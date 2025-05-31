// setgoodbye.js - Comando para configurar mensaje de despedida
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = './src/database/welcome_config.json';

// Función para crear directorios si no existen
function ensureDirectoryExists() {
  const dirname = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Cargar configuración
function loadConfig() {
  ensureDirectoryExists();
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify({}, null, 2));
    }
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar configuración:', error);
    return {};
  }
}

// Guardar configuración
function saveConfig(config) {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return false;
  }
}

const handler = async (m, { conn, text, isAdmin, groupMetadata }) => {
  // Verificar que sea un grupo
  if (!m.isGroup) {
    return m.reply('⚠️ Este comando solo funciona en grupos.');
  }

  // Verificar que sea administrador
  if (!isAdmin) {
    return m.reply('⚠️ Solo los administradores pueden configurar el mensaje de despedida.');
  }

  // Verificar que se proporcione un mensaje
  if (!text) {
    return m.reply(`📝 *Comando: setgoodbye*

*Uso:* .setgoodbye <mensaje>

*Ejemplo:* 
.setgoodbye ¡Hasta pronto! Lamentamos verte partir, pero las puertas siempre estarán abiertas para cuando quieras volver. Cuídate mucho! 👋

*Nota:* Puedes usar emojis y saltos de línea en tu mensaje.`);
  }

  const groupId = m.chat;
  
  try {
    // Cargar configuración actual
    const config = loadConfig();
    
    // Inicializar configuración del grupo si no existe
    if (!config[groupId]) {
      config[groupId] = {
        welcome: "¡hola bienvenido cambia este mensaje con welcomedit",
        goodbye: "¡jajaaj se fue un puto cambia este mensaje con bayedit"
      };
    }
    
    // Actualizar mensaje de despedida
    config[groupId].goodbye = text;
    
    // Guardar configuración
    if (saveConfig(config)) {
      return m.reply(`✅ *Mensaje de despedida configurado exitosamente*

*Grupo:* ${groupMetadata.subject}
*Nuevo mensaje:* ${text}

El mensaje se mostrará cuando miembros abandonen el grupo.`);
    } else {
      return m.reply('❌ Error al guardar la configuración. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error en setgoodbye:', error);
    return m.reply('❌ Ocurrió un error al configurar el mensaje. Inténtalo de nuevo.');
  }
};

handler.help = ['setgoodbye'];
handler.tags = ['group'];
handler.command = /^(setgoodbye|bayedit)$/i;
handler.group = true;
handler.admin = true;

export default handler;