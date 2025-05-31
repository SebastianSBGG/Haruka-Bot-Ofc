import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { exec } from 'child_process';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchVideo = async (text, attempt = 1) => {
  try {
    const response = await axios.get(`https://api.hiuraa.my.id/maker/bratvid?text=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429 && attempt <= 3) {
      const retryAfter = error.response.headers['retry-after'] || 5;
      await delay(retryAfter * 1000);
      return fetchVideo(text, attempt + 1);
    }
    throw error;
  }
};

const convertVideoToSticker = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    // Comando para convertir el video a WebP animado:
    // - scale: redimensiona manteniendo el aspecto y no supera 512x512.
    // - fps: define la cantidad de cuadros por segundo.
    // - loop 0: indica que el sticker se repita infinitamente.
    const command = `ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -loop 0 "${outputPath}" -y`;
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

const handler = async (m, { text, conn }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: 'Por favor ingresa el texto para generar el sticker animado.',
    }, { quoted: m });
  }

  try {
    // 1. Descarga el video desde la API
    const videoBuffer = await fetchVideo(text);
    const videoPath = path.join(tmpdir(), `bratvid-${Date.now()}.mp4`);
    fs.writeFileSync(videoPath, videoBuffer);

    // 2. Define la ruta para el sticker en formato WebP animado
    const stickerPath = path.join(tmpdir(), `bratvid-${Date.now()}.webp`);
    
    // 3. Convierte el video a sticker animado
    await convertVideoToSticker(videoPath, stickerPath);
    
    // 4. Envía el sticker y elimina los archivos temporales
    await conn.sendMessage(m.chat, {
      sticker: { url: stickerPath },
    }, { quoted: m });
    
    fs.unlinkSync(videoPath);
    fs.unlinkSync(stickerPath);
  } catch (error) {
    console.error(error);
    return conn.sendMessage(m.chat, {
      text: 'Ocurrió un error al generar el sticker animado.',
    }, { quoted: m });
  }
};

handler.command = ['bratvid'];
handler.tags = ['sticker'];
handler.help = ['bratvid <texto>'];

export default handler;
