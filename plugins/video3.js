// Añadir esto dentro del bloque if (connection == 'open') de la función yukiJadiBot

// Registrar el sub-bot en la base de datos
try {
  const dbPath = './src/database/db.json';
  const db = JSON.parse(await fs.promises.readFile(dbPath, 'utf-8'));
  
  // Asegurarse de que existe la estructura necesaria
  if (!db.links) db.links = {};
  if (!db.links.video) db.links.video = ["https://files.catbox.moe/shjplo.mp4"];
  if (!db.links.imagen) db.links.imagen = ["https://files.catbox.moe/ysucs5.jpg"];
  
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
    console.log(chalk.blue(`Sub-bot ${botNumber} registrado en la base de datos`));
  }
} catch (error) {
  console.error('Error al registrar el sub-bot en la base de datos:', error);
}