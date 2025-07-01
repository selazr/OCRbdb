import axios from 'axios';
import { extractTextFromPDF } from './pdfService.js';

export async function processImageWithGPT4o(base64Image) {
  console.log('Enviando imagen a OpenAI...');
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
            {
              type: 'text',
          text:
            'Analiza la tabla de la imagen y extrae su contenido. Este tipo de tablas suele incluir columnas como "Producto/Preparación/Material Auxiliar/Materia Prima", "Lote MMP/Lote Interno/Número de Carro", "Cantidad (kg)", "Descripción del motivo de merma", "Responsable" y "Turno".\n\nPresta especial atención a la columna "Descripción del motivo de merma"; dedica tiempo extra a revisarla y detallar este campo con la mayor precisión posible, ya que suele presentar el mayor margen de error. Devuelve únicamente un arreglo JSON de objetos utilizando las claves: producto, lote, cantidad, motivo, responsable y turno. No incluyas texto adicional.',

            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const result = response.data.choices[0].message.content;
  console.log('Respuesta de OpenAI:', result);
  try {
    return JSON.parse(result);
  } catch (err) {
    return result;
  }
}

export async function analyzeTableTextWithGPT4o(ocrText) {
  console.log('Enviando texto a OpenAI...', ocrText);
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content:
            'Corrige y estructura el siguiente texto reconocido por OCR. Devuelve únicamente un arreglo JSON de objetos con las claves: producto, lote, cantidad, motivo, responsable y turno.\n\n' +
            ocrText,
        },
      ],
      max_tokens: 1000,
      temperature: 0,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const result = response.data.choices[0].message.content;
  console.log('Respuesta de OpenAI:', result);
  try {
    return JSON.parse(result);
  } catch (err) {
    return result;
  }
}

export async function processPDFWithGPT4o(pdfBuffer) {
  const text = await extractTextFromPDF(pdfBuffer);
  return analyzeTableTextWithGPT4o(text);
}
