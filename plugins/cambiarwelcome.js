// setwelcome.js - Comando para configurar mensaje de bienvenida
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
    return m.reply('⚠️ Solo los administradores pueden configurar el mensaje de bienvenida.');
  }

  // Verificar que se proporcione un mensaje
  if (!text) {
    return m.reply(`📝 *Comando: setwelcome*

*Uso:* .setwelcome <mensaje>

*Ejemplo:* 
.setwelcome ¡Bienvenido al grupo oficial! Por favor lee las reglas y preséntate con los demás miembros. ¡Esperamos que disfrutes! 🎉

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
    
    // Actualizar mensaje de bienvenida
    config[groupId].welcome = text;
    
    // Guardar configuración
    if (saveConfig(config)) {
      return m.reply(`✅ *Mensaje de bienvenida configurado exitosamente*

*Grupo:* ${groupMetadata.subject}
*Nuevo mensaje:* ${text}

El mensaje se mostrará cuando nuevos miembros se unan al grupo.`);
    } else {
      return m.reply('❌ Error al guardar la configuración. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error en setwelcome:', error);
    return m.reply('❌ Ocurrió un error al configurar el mensaje. Inténtalo de nuevo.');
  }
};

handler.help = ['setwelcome'];
handler.tags = ['group'];
handler.command = /^(setwelcome|welcomedit)$/i;
handler.group = true;
handler.admin = true;

export default handler;