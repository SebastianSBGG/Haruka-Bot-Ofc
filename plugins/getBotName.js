import fs from 'fs';
import { promises as fsPromises } from 'fs';

/**
 * Función que obtiene el nombre del bot actual (principal o sub-bot)
 * @param {Object} conn - Conexión del bot
 * @returns {Promise<string>} - Nombre del bot
 */
export async function getBotName(conn) {
  try {
    // Verificar si es un sub-bot o el bot principal
    const isSub = global.conn !== conn;
    const botJid = conn.user.jid;
    const botNumber = botJid.split('@')[0];
    
    // Cargar el archivo JSON
    const dbPath = './src/database/db.json';
    const db = JSON.parse(await fsPromises.readFile(dbPath, 'utf-8'));
    
    // Si no existe la estructura, crearla con valores por defecto
    if (!db.mainBot) db.mainBot = { nombre: "𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲" };
    if (!db.subBots) db.subBots = {};
    
    if (isSub && db.subBots[botNumber] && db.subBots[botNumber].nombre) {
      // Es un sub-bot y tiene nombre personalizado
      return db.subBots[botNumber].nombre;
    } else if (!isSub && db.mainBot && db.mainBot.nombre) {
      // Es el bot principal y tiene nombre personalizado
      return db.mainBot.nombre;
    } else {
      // Valor por defecto si no hay nombre configurado
      return isSub ? `Sub-Bot-${botNumber}` : "𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲";
    }
  } catch (error) {
    console.error('Error al obtener el nombre del bot:', error);
    // En caso de error, devolver un nombre genérico
    return "Bot";
  }
}

/**
 * Función que actualiza el archivo JSON para asegurar que tenga la estructura correcta
 * Puede ser usada durante la inicialización del bot
 */
export async function initBotNameSystem() {
  try {
    const dbPath = './src/database/db.json';
    let db;
    
    // Intentar leer el archivo JSON
    try {
      db = JSON.parse(await fsPromises.readFile(dbPath, 'utf-8'));
    } catch (error) {
      // Si el archivo no existe o está corrupto, crear uno nuevo
      db = {};
    }
    
    // Asegurarse de que existe la estructura necesaria
    if (!db.links) db.links = {};
    if (!db.links.video) db.links.video = ["https://files.catbox.moe/ef5j84.mp4"];
    if (!db.links.imagen) db.links.imagen = ["https://files.catbox.moe/8xhnpl.png"];
    
    // Añadir la estructura para el bot principal si no existe
    if (!db.mainBot) db.mainBot = { nombre: "𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲" };
    
    // Asegurarse de que existe la estructura para sub-bots
    if (!db.subBots) db.subBots = {};
    
    // Guardar el archivo JSON actualizado
    await fsPromises.writeFile(dbPath, JSON.stringify(db, null, 2));
    console.log('Sistema de nombres de bot inicializado correctamente');
    
  } catch (error) {
    console.error('Error al inicializar el sistema de nombres de bot:', error);
  }
}