import { jest } from '@jest/globals';

const ExcelJS = {};
class Worksheet {
  constructor(name) {
    this.name = name;
    this.columns = [];
    this.rows = [];
  }
  addRow(row) {
    this.rows.push(row);
  }
}
class Workbook {
  constructor() {
    ExcelJS.__lastWorkbook = this;
    this.worksheets = [];
    this.xlsx = { writeBuffer: jest.fn().mockResolvedValue(Buffer.from('x')) };
  }
  addWorksheet(name) {
    const ws = new Worksheet(name);
    this.worksheets.push(ws);
    return ws;
  }
}
ExcelJS.Workbook = Workbook;
ExcelJS.__lastWorkbook = null;

jest.unstable_mockModule('exceljs', () => ({ default: ExcelJS }));

let generateExcelFromData;
let exceljs;

beforeAll(async () => {
  exceljs = await import('exceljs');
  ({ generateExcelFromData } = await import('../src/services/excelService.js'));
});

test('generateExcelFromData sets headers and rows', async () => {
  const sample = {
    producto: 'Prod',
    lote: 'L1',
    cantidad: '5',
    motivo: 'M',
    responsable: 'R',
    turno: 'T',
  };
  const buf = await generateExcelFromData(sample);
  expect(buf).toBeInstanceOf(Buffer);
  const workbook = exceljs.default.__lastWorkbook;
  const ws = workbook.worksheets[0];
  expect(ws.columns.map(c => c.header)).toEqual([
    'Producto/Preparación/Material Auxiliar/Materia Prima',
    'Lote MMP/Lote Interno/Número de Carro',
    'Cantidad (kg)',
    'Descripción del motivo de merma',
    'Responsable',
    'Turno'
  ]);
  expect(ws.rows[0]).toEqual(sample);
  expect(workbook.xlsx.writeBuffer).toHaveBeenCalled();
});

test('generateExcelFromData skips null entries', async () => {
  const sample = { producto: 'P' };
  await generateExcelFromData([null, sample]);
  const workbook = exceljs.default.__lastWorkbook;
  const ws = workbook.worksheets[0];
  expect(ws.rows).toEqual([sample]);
});
