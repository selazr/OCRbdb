# OCRbdb

Este proyecto es un bot de Telegram que analiza imágenes de tablas, extrae su contenido utilizando OpenAI GPT-4o y entrega los datos resultantes ya sea en texto o en un archivo Excel.

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
- `src/services/openaiService.js`: se comunica con la API de OpenAI para procesar la imagen y extraer la información de la tabla.
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

Si prefieres que el reconocimiento de texto se realice de manera local,
puedes utilizar [Tesseract.js](https://github.com/naptha/tesseract.js).
Instálalo con:

```bash
npm install tesseract.js
```

Luego emplea el servicio `tesseractService.js` para extraer el texto:

```javascript
import { processImageWithTesseract } from './src/services/tesseractService.js';

const texto = await processImageWithTesseract(buffer, 'spa');
```

Flujo sugerido:

1. Recibir la imagen desde Telegram u otra fuente.
2. Pasarla a `processImageWithTesseract` para obtener el texto plano.
3. Procesar ese texto según tus necesidades, por ejemplo generando el Excel
   con `generateExcelFromData`.

