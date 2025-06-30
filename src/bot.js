import dotenv from 'dotenv';
dotenv.config();

import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { processImageWithGPT4o } from './services/openaiService.js';
import { generateExcelFromData } from './services/excelService.js';

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
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const base64 = Buffer.from(response.data).toString('base64');
      console.log('Tamaño de la imagen en base64:', base64.length);
      const result = await processImageWithGPT4o(base64);
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
  } else {
    bot.sendMessage(chatId, 'Por favor, envíame una imagen de tabla.');
  }
});
