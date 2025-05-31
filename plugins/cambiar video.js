import fs from 'fs';
import { promises as fsPromises } from 'fs';

let handler = async (m, { conn, args, isRowner }) => {
  // Verificar si es un sub-bot o el bot principal
  const isSub = global.conn !== conn;
  const botJid = conn.user.jid;
  const botNumber = botJid.split('@')[0];
  
  // Comprobamos si el usuario proporcionó un enlace de Catbox
  if (args.length === 0 || !args[0].startsWith("https://")) {
    return m.reply("Por favor, proporciona un enlace de Catbox MP4 válido.");
  }

  const catboxLink = args[0];

  // Comprobamos si el enlace es válido de Catbox
  if (!catboxLink.includes("catbox.moe")) {
    return m.reply("El enlace proporcionado no es un enlace válido de Catbox.");
  }

  try {
    // Cargar el archivo JSON
    const dbPath = './src/database/db.json';
    const db = JSON.parse(await fsPromises.readFile(dbPath, 'utf-8'));

    // Asegurarse de que existe la estructura necesaria
    if (!db.links) db.links = {};
    if (!db.links.imagen) db.links.imagen = ["https://files.catbox.moe/8xhnpl.png"];
    if (!db.links.video) db.links.video = ["https://files.catbox.moe/ef5j84.mp4"];
    
    // Nueva estructura para sub-bots si no existe
    if (!db.subBots) db.subBots = {};

    if (isSub) {
      // Es un sub-bot: actualizar su video específico
      if (!db.subBots[botNumber]) {
        // Si el sub-bot no está registrado, registrarlo
        db.subBots[botNumber] = {
          imagen: db.links.imagen[0], // Usa la imagen del bot principal por defecto
          video: catboxLink,
          nombre: conn.user.name || `Sub-Bot-${botNumber}`
        };
        m.reply(`¡Sub-bot registrado y el video establecido a: ${catboxLink}`);
      } else {
        // Actualizar el video del sub-bot existente
        db.subBots[botNumber].video = catboxLink;
        m.reply(`¡El video de este sub-bot ha sido actualizado a: ${catboxLink}`);
      }
    } else {
      // Es el bot principal: actualizar el video principal
      db.links.video = [catboxLink];
      m.reply(`¡El video del bot principal ha sido actualizado a: ${catboxLink}`);
    }

    // Guardar el archivo JSON actualizado
    await fsPromises.writeFile(dbPath, JSON.stringify(db, null, 2));

  } catch (error) {
    console.error(error);
    m.reply("Hubo un error al intentar cambiar el enlace del video.");
  }
};

handler.help = ['setvideolink'];
handler.tags = ['tools'];
handler.command = ['setvideolink'];
handler.rowner = true;

export default handler;