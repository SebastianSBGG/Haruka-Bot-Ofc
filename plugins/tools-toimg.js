import * as fs from 'fs';
import { exec } from 'child_process';

let handler = async (m, { conn }) => {
  // Si es sticker estático
  if (m.quoted && /sticker/.test(m.quoted.mtype) && !m.quoted.isAnimated) {
    const img = await m.quoted.download();
    await conn.sendMessage(
      m.chat,
      { image: img, jpegThumbnail: img },
      { quoted: m }
    );

  // Si es sticker animado
  } else if (m.quoted && /sticker/.test(m.quoted.mtype) && m.quoted.isAnimated) {
    // Reacción de espera
    await conn.sendMessage(m.chat, {
      react: { text: '⏱️', key: m.key }
    });

    const img = await m.quoted.download();
    const video = await webpToVideo(img);

    await conn.sendMessage(
      m.chat,
      {
        video,
        gifPlayback: /gif/i.test(m.text),
        gifAttribution: ~~(Math.random() * 2)
      },
      { quoted: m }
    );

  } else {
    throw '⚠️ ¡Responde a un sticker!';
  }
};

handler.help = ['toimg'];
handler.tags = ['sticker','tools'];
handler.command = /^(toimg)$/i;
handler.register = false;
handler.premium = false;
handler.limit = false;

export default handler;

function webpToVideo(bufferWebp) {
  return new Promise((resolve, reject) => {
    try {
      const tmpPath = `./tmp/${~~(Math.random() * 1e6 + 1)}.webp`;
      fs.writeFileSync(tmpPath, bufferWebp);

      // Convierte WebP a GIF
      exec(`convert ${tmpPath} ${tmpPath}.gif`, (err1) => {
        if (err1) return reject(err1);

        // Convierte GIF a MP4
        exec(
          `ffmpeg -i ${tmpPath}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${tmpPath}.mp4`,
          (err2) => {
            if (err2) return reject(err2);

            // Verifica existencia de archivos
            if (
              !fs.existsSync(`${tmpPath}.gif`) ||
              !fs.existsSync(`${tmpPath}.mp4`)
            ) {
              fs.unlinkSync(tmpPath);
              return reject('¡Error al convertir el archivo!');
            }

            const videoBuffer = fs.readFileSync(`${tmpPath}.mp4`);
            // Limpia archivos temporales
            fs.unlinkSync(tmpPath);
            fs.unlinkSync(`${tmpPath}.gif`);
            fs.unlinkSync(`${tmpPath}.mp4`);

            resolve(videoBuffer);
          }
        );
      });
    } catch (e) {
      reject(e);
    }
  });
}
