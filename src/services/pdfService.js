import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  return data.text;
}
