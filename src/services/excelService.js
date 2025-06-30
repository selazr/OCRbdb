import ExcelJS from 'exceljs';

export async function generateExcelFromData(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  worksheet.columns = [
    { header: 'Producto/Preparación/Material Auxiliar/Materia Prima', key: 'producto', width: 30 },
    { header: 'Lote MMP/Lote Interno/Número de Carro', key: 'lote', width: 30 },
    { header: 'Cantidad (kg)', key: 'cantidad', width: 15 },
    { header: 'Descripción del motivo de merma', key: 'motivo', width: 30 },
    { header: 'Responsable', key: 'responsable', width: 20 },
    { header: 'Turno', key: 'turno', width: 10 }
  ];

  const rows = Array.isArray(data) ? data : [data];
  rows
    .filter((row) => row && typeof row === 'object')
    .forEach((row) =>
      worksheet.addRow({
        producto: row.producto || '',
        lote: row.lote || '',
        cantidad: row.cantidad || '',
        motivo: row.motivo || '',
        responsable: row.responsable || '',
        turno: row.turno || '',
      })
    );

  return workbook.xlsx.writeBuffer();
}
