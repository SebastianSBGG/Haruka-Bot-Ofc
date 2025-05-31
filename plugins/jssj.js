// Esta función debe ir en el archivo que genera el menú
// Suponiendo que tienes algo como getMenuImage() que obtiene la imagen a mostrar

async function getMenuImage(conn) {
  try {
    const dbPath = './src/database/db.json';
    const db = JSON.parse(await fs.promises.readFile(dbPath, 'utf-8'));
    
    // Verificar si es un sub-bot o el bot principal
    const isSub = global.conn !== conn;
    
    if (isSub) {
      // Es un sub-bot, buscar su imagen específica
      const botNumber = conn.user.jid.split('@')[0];
      
      if (db.subBots && db.subBots[botNumber] && db.subBots[botNumber].imagen) {
        return db.subBots[botNumber].imagen;
      }
    }
    
    // Para el bot principal o si no se encuentra imagen del sub-bot
    return db.links.imagen[0];
  } catch (error) {
    console.error('Error al obtener la imagen del menú:', error);
    // Retornar una imagen por defecto en caso de error
    return "https://files.catbox.moe/ysucs5.jpg";
  }
}

// Luego, cuando generes el menú, usa esta función:
// const menuImage = await getMenuImage(conn);