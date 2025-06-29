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

  worksheet.addRow({
    producto: data.producto || '',
    lote: data.lote || '',
    cantidad: data.cantidad || '',
    motivo: data.motivo || '',
    responsable: data.responsable || '',
    turno: data.turno || ''
  });

  return workbook.xlsx.writeBuffer();
}
