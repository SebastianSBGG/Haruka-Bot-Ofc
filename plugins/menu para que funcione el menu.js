import fs from 'fs';
import { promises as fsPromises } from 'fs';

// Función para crear el JSON por defecto si no existe
async function createDefaultDB() {
  const defaultDB = {
    "links": {
      "imagen": [
        "https://files.catbox.moe/8xhnpl.png"
      ]
    },
    "mainBot": {
      "nombre": "HARUKA BOT OFC"
    },
    "subBots": {}
  };
  
  const dbPath = './src/database/db.json';
  
  try {
    // Verificar si el directorio existe, si no, crearlo
    const dir = './src/database';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Crear el archivo JSON si no existe
    if (!fs.existsSync(dbPath)) {
      await fsPromises.writeFile(dbPath, JSON.stringify(defaultDB, null, 2));
      console.log('Archivo db.json creado automáticamente');
    }
    
    return defaultDB;
  } catch (error) {
    console.error('Error creando DB por defecto:', error);
    return defaultDB;
  }
}

let handler = async (m, { conn, args, isRowner }) => {
  // Verificar si es un sub-bot o el bot principal
  const isSub = global.conn !== conn;
  const botJid = conn.user.jid;
  const botNumber = botJid.split('@')[0];
  
  // Comprobamos si el usuario proporcionó un enlace
  if (args.length === 0 || !args[0].startsWith("https://")) {
    return m.reply("Por favor, proporciona un enlace de imagen válido.\n\n*Uso:* .setimagelink https://files.catbox.moe/ejemplo.jpg");
  }

  const imageLink = args[0];

  // Comprobamos si el enlace es de una imagen (extensiones comunes)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasImageExtension = imageExtensions.some(ext => imageLink.toLowerCase().includes(ext));
  
  if (!hasImageExtension) {
    return m.reply("El enlace proporcionado no parece ser una imagen válida. Asegúrate de que termine en .jpg, .jpeg, .png, .gif o .webp");
  }

  try {
    // Cargar o crear el archivo JSON
    const dbPath = './src/database/db.json';
    let db;
    
    try {
      db = JSON.parse(await fsPromises.readFile(dbPath, 'utf-8'));
    } catch (error) {
      console.log('Archivo db.json no encontrado, creando uno nuevo...');
      db = await createDefaultDB();
    }

    // Asegurarse de que existe la estructura necesaria
    if (!db.links) db.links = {};
    if (!db.links.imagen) db.links.imagen = ["https://files.catbox.moe/8xhnpl.png"];
    if (!db.mainBot) db.mainBot = { "nombre": "HARUKA BOT OFC" };
    if (!db.subBots) db.subBots = {};

    if (isSub) {
      // Es un sub-bot: actualizar su imagen específica
      if (!db.subBots[botNumber]) {
        // Si el sub-bot no está registrado, registrarlo
        db.subBots[botNumber] = {
          imagen: imageLink,
          nombre: conn.user.name || `Sub-Bot-${botNumber}`
        };
        m.reply(`✅ Sub-bot registrado exitosamente!\n📷 Imagen establecida: ${imageLink}\n🤖 Nombre: ${db.subBots[botNumber].nombre}`);
      } else {
        // Actualizar la imagen del sub-bot existente
        db.subBots[botNumber].imagen = imageLink;
        m.reply(`✅ Imagen del sub-bot actualizada!\n📷 Nueva imagen: ${imageLink}\n🤖 Bot: ${db.subBots[botNumber].nombre || 'Sub-Bot'}`);
      }
    } else {
      // Es el bot principal: actualizar la imagen principal
      db.links.imagen = [imageLink];
      m.reply(`✅ Imagen del bot principal actualizada!\n📷 Nueva imagen: ${imageLink}\n🤖 Bot: ${db.mainBot.nombre}`);
    }

    // Guardar el archivo JSON actualizado
    await fsPromises.writeFile(dbPath, JSON.stringify(db, null, 2));
    console.log('Base de datos actualizada correctamente');

  } catch (error) {
    console.error('Error al cambiar imagen:', error);
    m.reply("❌ Hubo un error al intentar cambiar la imagen. Verifica que el enlace sea válido e inténtalo de nuevo.");
  }
};

handler.help = ['setimagelink <url>'];
handler.tags = ['owner'];
handler.command = ['setimagelink', 'setimg', 'cambiarimagen'];
handler.rowner = true;

export default handler;