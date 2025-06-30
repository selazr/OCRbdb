# OCRbdb

Este proyecto es un bot de Telegram que analiza imágenes de tablas. Primero extrae el texto de la imagen con Tesseract y luego utiliza OpenAI GPT-4o para estructurar los datos, ya sea en texto o en un archivo Excel.

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

Una vez en funcionamiento, envíale al bot una foto que contenga una tabla. El bot enviará un mensaje de confirmación mientras procesa la imagen.

- Si los datos se reconocen como una colección de objetos, el bot generará un archivo `datos.xlsx` con la información estructurada.
- En caso contrario, devolverá el texto extraído directamente en el chat.

## Estructura del proyecto

- `src/bot.js`: punto de entrada del bot de Telegram.
- `src/services/openaiService.js`: se comunica con la API de OpenAI para procesar la imagen o el texto extraído y obtener la información estructurada.
- `src/services/excelService.js`: genera un archivo Excel a partir de los datos obtenidos.
- `src/services/tesseractService.js`: extrae texto de imágenes utilizando Tesseract.

## Variables de entorno

| Variable            | Descripción                                     |
|---------------------|-------------------------------------------------|
| `TELEGRAM_BOT_TOKEN`| Token de tu bot de Telegram.                     |
| `OPENAI_API_KEY`    | Clave de API de OpenAI para usar el modelo GPT-4o.|

## Licencia

ISC

## Usar Tesseract como motor OCR

El bot emplea Tesseract de forma predeterminada para reconocer el texto de las imágenes.
Si necesitas utilizar este servicio en otro contexto o modificar el idioma, puedes importar
`processImageWithTesseract` desde `tesseractService.js`:

```javascript
import { processImageWithTesseract } from './src/services/tesseractService.js';
import { analyzeTableTextWithGPT4o } from './src/services/openaiService.js';

const texto = await processImageWithTesseract(buffer, 'spa');
const datos = await analyzeTableTextWithGPT4o(texto);
```

El flujo es el mismo que usa el bot:

1. Obtener la imagen.
2. Ejecutar `processImageWithTesseract` para extraer el texto plano.
3. Enviar ese texto a `analyzeTableTextWithGPT4o` para corregirlo y estructurarlo.
4. Generar un Excel con `generateExcelFromData` si es necesario.

