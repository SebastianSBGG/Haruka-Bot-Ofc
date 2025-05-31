import { Sticker } from 'wa-sticker-formatter';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function subirUguu(rutaArchivo) {
  try {
    const form = new FormData();
    form.append('files[]', fs.createReadStream(rutaArchivo));
    const { data } = await axios.post('https://uguu.se/upload', form, {
      headers: { ...form.getHeaders() }
    });
    return data.files[0].url;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function crearSticker(imgUrl, calidad = 100) {
  const stickerMetadata = {
    type: "full",
    pack: "MemePack",
    author: "TuBot",
    quality: calidad
  };
  return await new Sticker(imgUrl, stickerMetadata).toBuffer();
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const [textoArriba, textoAbajo] = text.split`|`;
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || "";

  if (!mime) {
    throw `⚠️ Responde una imagen o envíala con:\n\n${usedPrefix + command} <texto arriba>|<texto abajo>`;
  }

  await m.reply("♻️ Generando meme...");

  // Descarga el buffer del medio
  const media = await q.download();
  const ext = mime.split('/')[1] || 'png';
  const tempFile = path.join(process.cwd(), `temp_${Date.now()}.${ext}`);
  fs.writeFileSync(tempFile, media);

  try {
    // Sube la imagen original a Uguu
    const urlOriginal = await subirUguu(tempFile);

    let memeUrl;
    if (mime.startsWith("image/")) {
      // Usa la API de memegen para superponer texto
      memeUrl = `https://api.memegen.link/images/custom/` +
        `${encodeURIComponent(textoArriba || ' ')}/` +
        `${encodeURIComponent(textoAbajo || ' ')}.png?background=${encodeURIComponent(urlOriginal)}`;
    } else {
      // Si no es imagen, convierte la URL subida directamente
      memeUrl = urlOriginal;
    }

    // Crea sticker y envía
    const stickerBuffer = await crearSticker(memeUrl);
    await conn.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m);
  } finally {
    // Limpia archivo temporal
    fs.unlinkSync(tempFile);
  }
};

handler.help = ['smeme <texto arriba>|<texto abajo>'];
handler.tags = ['sticker'];
handler.command = /^(smeme)$/i;
handler.limit = true;

export default handler;
