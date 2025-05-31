import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn, command }) => {
  conn.hdr = conn.hdr || {};
  if (m.sender in conn.hdr) throw '⏳ Aún hay un proceso en curso, por favor espera...';

  let q = m.quoted || m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';
  if (!mime) throw '⚠️ Envía o responde a una imagen primero';
  if (!/image\/(jpe?g|png)/.test(mime)) throw `❌ Formato ${mime} no soportado`;

  conn.hdr[m.sender] = true;
  await conn.sendMessage(m.chat, { react: { text: "♻️", key: m.key } });

  let img = await q.download?.();
  let error = false;

  try {
    const imageUrl = await uploadToCatbox(img);
    const api = `https://fastrestapis.fasturl.cloud/aiimage/upscale?imageUrl=${encodeURIComponent(imageUrl)}&resize=4`;
    const res = await fetch(api);
    const buffer = await res.buffer();
    await conn.sendFile(m.chat, buffer, 'hd.jpg', '✅ Aquí tienes la imagen en HD 😒', m);
  } catch {
    error = true;
  } finally {
    if (error) m.reply('❌ Error al mejorar la imagen.');
    delete conn.hdr[m.sender];
  }
};

handler.help = ['hd', 'remini'];
handler.tags = ['tools'];
handler.command = /^(hd|remini)$/i;

export default handler;

async function uploadToCatbox(buffer) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, 'image.jpg');
  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  });
  const url = await res.text();
  if (!url.startsWith('https://')) throw '❌ Error al subir a Catbox';
  return url.trim();
}
