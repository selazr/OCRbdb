import { createWorker } from 'tesseract.js';

export async function processImageWithTesseract(imageBuffer, lang = 'eng') {
  const worker = await createWorker();
  try {
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    const { data: { text } } = await worker.recognize(imageBuffer);
    return text;
  } finally {
    await worker.terminate();
  }
}
