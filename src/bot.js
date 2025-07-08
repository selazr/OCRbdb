import dotenv from 'dotenv';
dotenv.config();

import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import {
  analyzeTableTextWithGPT4o,
  processImageWithGPT4o,
} from './services/openaiService.js';
import { generateExcelFromData } from './services/excelService.js';
import { extractPagesFromPDF } from './services/pdfService.js';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  console.log('Mensaje recibido:', msg);

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

    bot.sendMessage(chatId, '📥 Imagen recibida. Procesando...');
    console.log('Descargando imagen desde Telegram:', url);

    try {
      // const response = await axios.get(url, { responseType: 'arraybuffer' });
      // const imageBuffer = Buffer.from(response.data);
      // const text = await processImageWithTesseract(imageBuffer, 'spa');
      const result = await processImageWithGPT4o({ url });
      console.log('Datos devueltos por OpenAI:', result);

      if (typeof result === 'object') {
        const buffer = await generateExcelFromData(result);
        await bot.sendDocument(
          chatId,
          buffer,
          {},
          {
            filename: 'datos.xlsx',
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }
        );
      } else {
        bot.sendMessage(chatId, `📋 Datos extraídos:\n\n${result}`);
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, '❌ Error al procesar la imagen.');
    }
    return;
  }

  if (
    msg.document &&
    (msg.document.mime_type === 'application/pdf' ||
      msg.document.file_name?.toLowerCase().endsWith('.pdf'))
  ) {
    const fileId = msg.document.file_id;
    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

    bot.sendMessage(chatId, '📥 PDF recibido. Procesando...');
    console.log('Descargando PDF desde Telegram:', url);

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const pdfBuffer = Buffer.from(response.data);
      console.log('Tamaño del PDF (bytes):', pdfBuffer.length);
      const pages = await extractPagesFromPDF(pdfBuffer);

      for (const pageText of pages) {
        const result = await analyzeTableTextWithGPT4o(pageText);
        console.log('Datos devueltos por OpenAI:', result);

        if (typeof result === 'object') {
          const buffer = await generateExcelFromData(result);
          await bot.sendDocument(
            chatId,
            buffer,
            {},
            {
              filename: 'datos.xlsx',
              contentType:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }
          );
        } else {
          bot.sendMessage(chatId, `📋 Datos extraídos:\n\n${result}`);
        }
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, '❌ Error al procesar el PDF.');
    }
  } else {
    bot.sendMessage(chatId, 'Por favor, envíame un archivo PDF con la tabla.');
  }
});
