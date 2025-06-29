import axios from 'axios';

export async function processImageWithGPT4o(base64Image) {
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
              text: 'Extrae todos los datos relevantes de esta tabla en formato JSON estructurado. Claves esperadas: producto, lote, cantidad, motivo, responsable, turno.',
            },
          ],
        },
      ],
      max_tokens: 1000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
}
