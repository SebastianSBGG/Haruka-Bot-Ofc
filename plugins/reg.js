import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Registra un nuevo sub-bot en la base de datos
 * @param {string} pathYukiJadiBot - Ruta del archivo del sub-bot
 * @param {string} userName - Nombre de usuario proporcionado
 */
export async function registerSubBot(pathYukiJadiBot, userName) {
  try {
    const dbPath = './src/database/db.json';
    let db;
    
    // Intentar leer el archivo JSON
    try {
      db = JSON.parse(await fs.promises.readFile(dbPath, 'utf-8'));
    } catch (error) {
      // Si el archivo no existe o está corrupto, crear uno nuevo
      db = {};
    }
    
    // Asegurarse de que existe la estructura necesaria
    if (!db.links) db.links = {};
    if (!db.links.video) db.links.video = ["https://files.catbox.moe/vizse3.mp4"];
    if (!db.links.imagen) db.links.imagen = ["https://files.catbox.moe/ysucs5.jpg"];
    
    // Añadir la estructura para el bot principal si no existe
    if (!db.mainBot) db.mainBot = { nombre: "Bot Principal" };
    
    // Crear estructura para sub-bots si no existe
    if (!db.subBots) db.subBots = {};
    
    const botNumber = path.basename(pathYukiJadiBot);
    
    // Registrar el sub-bot si no existe
    if (!db.subBots[botNumber]) {
      db.subBots[botNumber] = {
        imagen: db.links.imagen[0], // Usa la imagen del bot principal por defecto
        video: db.links.video[0],   // Usa el video del bot principal por defecto
        nombre: userName || `Sub-Bot-${botNumber}`
      };
      
      // Guardar el archivo JSON actualizado
      await fs.promises.writeFile(dbPath, JSON.stringify(db, null, 2));
      console.log(chalk.blue(`Sub-bot ${botNumber} registrado en la base de datos con nombre: ${db.subBots[botNumber].nombre}`));
    } else {
      console.log(chalk.yellow(`Sub-bot ${botNumber} ya está registrado en la base de datos`));
    }
    
    return db.subBots[botNumber];
  } catch (error) {
    console.error('Error al registrar el sub-bot en la base de datos:', error);
    // Devolver un objeto con valores por defecto en caso de error
    return {
      imagen: "https://files.catbox.moe/ysucs5.jpg",
      video: "https://files.catbox.moe/vizse3.mp4",
      nombre: userName || "Sub-Bot"
    };
  }
}