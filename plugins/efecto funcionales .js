import uploadImage from '../lib/uploadImage.js';
import { sticker } from '../lib/sticker.js';
import MessageType from '@whiskeysockets/baileys';

// Efectos permitidos (los endpoints de la API)
const allowedEffects = ['autorizo', 'noautorizo'];

/**
 * Comando: efectosticker
 * Uso: !efectosticker <efecto> (respondiendo a una imagen)
 * Efectos disponibles: autorizo, noautorizo
 */
const commandHandler = async (m, { conn, usedPrefix, text }) => {
  // Extrae y normaliza el argumento del efecto
  const effectArg = text.trim().toLowerCase();
  if (!allowedEffects.includes(effectArg)) {
    throw `
*_Uso correcto:_*
${usedPrefix}efectosticker <efecto>
Responde a una imagen y selecciona uno de los siguientes efectos:
${allowedEffects.map(e => `- ${e}`).join('\n')}
*Ejemplo:* ${usedPrefix}efectosticker autorizo
    `.trim();
  }
  
  // Obtiene la imagen desde el mensaje actual o del mensaje citado
  const targetMsg = m.quoted ? m.quoted : m;
  const mime = (targetMsg.msg || targetMsg).mimetype || '';
  if (!mime) throw '*No se encontró imagen. Responde a una imagen.*';
  if (!/image\/(jpe?g|png)/.test(mime)) throw '*Formato no permitido. Solo se aceptan imágenes JPEG y PNG.*';
  
  // Descarga la imagen del mensaje y súbela para obtener una URL pública
  const imageData = await targetMsg.download();
  const uploadedUrl = await uploadImage(imageData);
  
  // Construye la URL de la API usando el efecto seleccionado
  const apiEndpoint = `https://delirius-apiofc.vercel.app/canvas/${effectArg}?url=${encodeURIComponent(uploadedUrl)}`;
  
  try {
    // Genera el sticker con la función sticker (se puede configurar global.packname y global.author)
    const stickerBuffer = await sticker(null, apiEndpoint, global.packname, global.author);
    await conn.sendFile(m.chat, stickerBuffer, null, { asSticker: true });
  } catch (err) {
    m.reply('*Ocurrió un error al convertir a sticker, enviando imagen en su lugar...*');
    await conn.sendFile(m.chat, apiEndpoint, 'imagen.png', null, m);
  }
};

commandHandler.help = ['efectosticker <efecto> (responde a imagen)'];
commandHandler.tags = ['sticker'];
commandHandler.command = /^(efectosticker|esticker)$/i;

export default commandHandler;
