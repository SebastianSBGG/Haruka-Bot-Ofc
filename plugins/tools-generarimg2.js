import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { tmpdir } from 'os';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Handler para generar stickers a partir de texto convertido en imagen
 */
const handler = async (m, {conn, text, usedPrefix, command}) => {
  // Verificamos que el usuario haya ingresado un texto
  if (!text) throw `*🧑‍💻 Ingresa un texto para generar tu sticker*`;
  
  // Mostramos un emoji de reloj mientras generamos el sticker
  m.react('🕒');
  await conn.sendMessage(m.chat, {text: '*🧑‍💻 Espere, estamos trabajando en su sticker*'}, {quoted: m});
  
  try {
    // Usa la API de texto simple a imagen
    const response = await fetch(`https://api.dorratz.com/v3/text-image?text=${encodeURIComponent(text)}&fontSize=50`);
    if (!response.ok) throw new Error('Network response was not ok');
    const buffer = await response.buffer();
    
    // Ruta temporal para guardar el webp
    const outputFile = path.join(tmpdir(), `sticker-${Date.now()}.webp`);

    // Redimensionamos y convertimos a WebP para formato de sticker
    // Aseguramos que la imagen sea exactamente 512x512 con fondo transparente
    await sharp(buffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFormat('webp')
      .webp({ quality: 80, lossless: false })
      .toFile(outputFile);
    
    // Mostramos un emoji de éxito
    m.react('✔️');
    
    // Enviamos el sticker generado al chat
    await conn.sendMessage(
      m.chat,
      { sticker: { url: outputFile } },
      { quoted: m }
    );
    
    // Limpiamos archivo temporal después de enviar
    fs.unlinkSync(outputFile);
    
  } catch (error) {
    console.error(error);
    m.react('❌');
    throw `*🚨 Lo sentimos, ha ocurrido un error al generar el sticker 😔*`;
  }
}

// Definimos las etiquetas y comandos para el handler
handler.tags = ['sticker', 'tools'];
handler.help = ['texts'];
handler.command = ['texts'];

// Exportamos el handler
export default handler;