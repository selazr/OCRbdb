# OCRbdb

Este proyecto es un bot de Telegram que analiza tablas enviadas en formato PDF. Extrae el texto del PDF y luego utiliza OpenAI GPT-4o para estructurar los datos, ya sea en texto o en un archivo Excel.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- Una cuenta de Telegram con un bot creado a través de [BotFather](https://t.me/BotFather)
- Claves de API para OpenAI (modelo GPT-4o)

## Instalación

1. Clona este repositorio e instala las dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example` y completa tus claves:

   ```env
   TELEGRAM_BOT_TOKEN="tu_token_de_telegram"
   OPENAI_API_KEY="tu_clave_de_openai"
   ```

## Uso

Ejecuta el bot con Node.js:

```bash
node src/bot.js
```

O con el script de npm:

```bash
npm start
```

Una vez en funcionamiento, envíale al bot un archivo PDF que contenga la tabla. El bot enviará un mensaje de confirmación mientras procesa el documento.

- Si los datos se reconocen como una colección de objetos, el bot generará un archivo `datos.xlsx` con la información estructurada.
- En caso contrario, devolverá el texto extraído directamente en el chat.

## Estructura del proyecto

- `src/bot.js`: punto de entrada del bot de Telegram.
- `src/services/openaiService.js`: se comunica con la API de OpenAI para procesar la imagen o el texto extraído y obtener la información estructurada.
- `src/services/excelService.js`: genera un archivo Excel a partir de los datos obtenidos.
- `src/services/pdfService.js`: extrae el texto de los archivos PDF recibidos.

## Variables de entorno

| Variable            | Descripción                                     |
|---------------------|-------------------------------------------------|
| `TELEGRAM_BOT_TOKEN`| Token de tu bot de Telegram.                     |
| `OPENAI_API_KEY`    | Clave de API de OpenAI para usar el modelo GPT-4o.|

## Licencia

ISC

## Procesamiento de PDF

El bot emplea `pdf-parse` para extraer el texto de los documentos PDF recibidos. Posteriormente, envía ese texto a `analyzeTableTextWithGPT4o` para obtener los datos estructurados. Si necesitas usar este flujo de manera independiente:

```javascript
import { extractTextFromPDF } from './src/services/pdfService.js';
import { analyzeTableTextWithGPT4o } from './src/services/openaiService.js';

const texto = await extractTextFromPDF(buffer);
const datos = await analyzeTableTextWithGPT4o(texto);
```

Los pasos del bot son los siguientes:

1. Obtener el PDF.
2. Extraer su texto con `extractTextFromPDF`.
3. Enviar ese texto a `analyzeTableTextWithGPT4o` para corregirlo y estructurarlo.
4. Generar un Excel con `generateExcelFromData` si es necesario.

