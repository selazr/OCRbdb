import { createWorker } from 'tesseract.js';

export async function processImageWithTesseract(imageBuffer, lang = 'eng') {
  console.log('Procesando imagen con Tesseract...');
  const worker = await createWorker();
  try {
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    const { data: { text } } = await worker.recognize(imageBuffer);
    console.log('Texto reconocido:', text);
    return text;
  } finally {
    await worker.terminate();
  }
}
