import fs from 'fs';
import { promises as fsPromises } from 'fs';

let handler = async (m, { conn, args, isRowner }) => {
  // Verificar si es un sub-bot o el bot principal
  const isSub = global.conn !== conn;
  const botJid = conn.user.jid;
  const botNumber = botJid.split('@')[0];
  
  // Comprobamos si el usuario proporcionó un enlace de Catbox
  if (args.length === 0 || !args[0].startsWith("https://")) {
    return m.reply("Por favor, proporciona un enlace de Catbox JPG válido.");
  }

  const catboxLink = args[0];

  // Comprobamos si el enlace es válido de Catbox
  if (!catboxLink.includes("catbox.moe")) {
    return m.reply("El enlace proporcionado no es un enlace válido de Catbox.");
  }

  try {
    // Cargar el archivo JSON
    const dbPath = './src/database/menuca.json';
    const db = JSON.parse(await fsPromises.readFile(dbPath, 'utf-8'));

    // Asegurarse de que existe la estructura necesaria
    if (!db.links) db.links = {};
    if (!db.links.video) db.links.video = ["https://files.catbox.moe/vizse3.mp4"];
    if (!db.links.imagen) db.links.imagen = ["https://files.catbox.moe/ysucs5.jpg"];
    
    // Nueva estructura para sub-bots si no existe
    if (!db.subBots) db.subBots = {};

    if (isSub) {
      // Es un sub-bot: actualizar su imagen específica
      if (!db.subBots[botNumber]) {
        // Si el sub-bot no está registrado, registrarlo
        db.subBots[botNumber] = {
          imagen: catboxLink,
          nombre: conn.user.name || `Sub-Bot-${botNumber}`
        };
        m.reply(`¡Sub-bot registrado y la imagen establecida a: ${catboxLink}`);
      } else {
        // Actualizar la imagen del sub-bot existente
        db.subBots[botNumber].imagen = catboxLink;
        m.reply(`¡La imagen de este sub-bot ha sido actualizada a: ${catboxLink}`);
      }
    } else {
      // Es el bot principal: actualizar la imagen principal
      db.links.imagen = [catboxLink];
      m.reply(`¡La imagen del bot principal ha sido actualizada a: ${catboxLink}`);
    }

    // Guardar el archivo JSON actualizado
    await fsPromises.writeFile(dbPath, JSON.stringify(db, null, 2));

  } catch (error) {
    console.error(error);
    m.reply("Hubo un error al intentar cambiar los enlaces de imagen.");
  }
};

handler.help = ['setimagelink'];
handler.tags = ['tools'];
handler.command = ['setimagemenu'];
handler.rowner = true;

export default handler;