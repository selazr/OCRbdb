import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  return data.text;
}

export async function extractPagesFromPDF(pdfBuffer) {
  const text = await extractTextFromPDF(pdfBuffer);
  return text
    .split(/\f/g)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}
