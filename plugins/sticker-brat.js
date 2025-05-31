import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { tmpdir } from 'os';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Llama a la API de brat y retorna un Buffer con los datos de la imagen.
 */
const fetchSticker = async (text, attempt = 1) => {
  const url = 'https://brat.caliphdev.com/api/brat';
  try {
    const response = await axios.get(url, {
      params: { text },
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    // Si recibimos 429, reintentamos hasta 3 veces
    if (error.response?.status === 429 && attempt < 3) {
      const retryAfter = error.response.headers['retry-after'] || 5;
      await delay(retryAfter * 1000);
      return fetchSticker(text, attempt + 1);
    }
    throw error;
  }
};

const handler = async (m, { text, conn }) => {
  if (!text) {
    return conn.sendMessage(
      m.chat,
      { text: '🤖 Por favor ingresa el texto para hacer un sticker.' },
      { quoted: m }
    );
  }

  try {
    // Informamos al usuario que estamos procesando su solicitud
    await conn.sendMessage(
      m.chat,
      { text: '⏳ Generando sticker, espere un momento...' },
      { quoted: m }
    );

    // Obtenemos el buffer de la API
    const buffer = await fetchSticker(text);
    
    // Ruta temporal para guardar el webp
    const outputFile = path.join(tmpdir(), `sticker-${Date.now()}.webp`);

    // Redimensionamos y convertimos a WebP
    await sharp(buffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ quality: 80 })
      .toFile(outputFile);

    // Enviamos el sticker
    await conn.sendMessage(
      m.chat,
      { sticker: { url: outputFile } },
      { quoted: m }
    );

    // Limpiamos archivo temporal
    fs.unlinkSync(outputFile);

  } catch (err) {
    console.error('Error generando sticker brat:', err);
    return conn.sendMessage(
      m.chat,
      { text: '⚠️ Ocurrió un error al generar el sticker. Intenta más tarde.' },
      { quoted: m }
    );
  }
};

handler.command = ['brat'];
handler.tags = ['sticker'];
handler.help = ['brat <texto>'];

export default handler;