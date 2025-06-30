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
             text:
             'Analiza la tabla de la imagen y extrae su contenido. Este tipo de tablas suele incluir columnas como "Producto/Preparación/Material Auxiliar/Materia Prima", "Lote MMP/Lote Interno/Número de Carro", "Cantidad (kg)", "Descripción del motivo de merma", "Responsable" y "Turno". Presta especial atención a la columna "Descripción del motivo de merma"; es fundamental capturarla con precisión, incluso si la escritura está abreviada, es ambigua o difícil de leer. Interpreta correctamente palabras manuscritas que puedan parecer similares entre sí (ej. "punta" vs. "planta", "decoración" cortado o con letra irregular). También revisa si hay errores visuales de alineación que puedan afectar la interpretación de las columnas. Devuelve únicamente un arreglo JSON de objetos utilizando las claves: producto, lote, cantidad, motivo, responsable y turno. No incluyas texto adicional.'
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
  try {
    return JSON.parse(result);
  } catch (err) {
    return result;
  }
}
