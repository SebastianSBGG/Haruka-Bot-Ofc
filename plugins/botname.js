import fs from 'fs';
import { promises as fsPromises } from 'fs';

let handler = async (m, { conn, args, isRowner, text }) => {
  // Verificar si es un sub-bot o el bot principal
  const isSub = global.conn !== conn;
  const botJid = conn.user.jid;
  const botNumber = botJid.split('@')[0];
  
  // Comprobamos si el usuario proporcionó un nombre
  if (!text || text.trim() === '') {
    return m.reply("Por favor, proporciona un nombre para el bot.");
  }

  const newName = text.trim();

  try {
    // Cargar el archivo JSON
    const dbPath = './src/database/db.json';
    const db = JSON.parse(await fsPromises.readFile(dbPath, 'utf-8'));

    // Asegurarse de que existe la estructura necesaria
    if (!db.links) db.links = {};
    if (!db.mainBot) db.mainBot = { nombre: "𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲" };
    
    // Nueva estructura para sub-bots si no existe
    if (!db.subBots) db.subBots = {};

    if (isSub) {
      // Es un sub-bot: actualizar su nombre específico
      if (!db.subBots[botNumber]) {
        // Si el sub-bot no está registrado, registrarlo
        db.subBots[botNumber] = {
          imagen: db.links.imagen ? db.links.imagen[0] : null,
          video: db.links.video ? db.links.video[0] : null,
          nombre: newName
        };
        m.reply(`¡Sub-bot registrado con el nombre: ${newName}`);
      } else {
        // Actualizar el nombre del sub-bot existente
        db.subBots[botNumber].nombre = newName;
        m.reply(`¡El nombre de este sub-bot ha sido actualizado a: ${newName}`);
      }
    } else {
      // Es el bot principal: actualizar el nombre principal
      db.mainBot.nombre = newName;
      m.reply(`¡El nombre del bot principal ha sido actualizado a: ${newName}`);
    }

    // Guardar el archivo JSON actualizado
    await fsPromises.writeFile(dbPath, JSON.stringify(db, null, 2));

  } catch (error) {
    console.error(error);
    m.reply("Hubo un error al intentar cambiar el nombre del bot.");
  }
};

handler.help = ['setbotname <nombre>'];
handler.tags = ['tools'];
handler.command = ['setbotname', 'cambianombre', 'botnombre'];
handler.rowner = true;

export default handler;