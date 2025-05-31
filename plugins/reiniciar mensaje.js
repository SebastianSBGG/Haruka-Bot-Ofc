// resetwelcome.js - Comando para restablecer mensajes a valores predeterminados
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

const handler = async (m, { conn, args, isAdmin, groupMetadata }) => {
  // Verificar que sea un grupo
  if (!m.isGroup) {
    return m.reply('⚠️ Este comando solo funciona en grupos.');
  }

  // Verificar que sea administrador
  if (!isAdmin) {
    return m.reply('⚠️ Solo los administradores pueden restablecer los mensajes.');
  }

  const action = args[0]?.toLowerCase();
  
  // Si no hay argumentos, mostrar ayuda
  if (!action) {
    return m.reply(`🔄 *Comando: resetwelcome*

*Opciones disponibles:*
• .resetwelcome welcome - Restablece solo el mensaje de bienvenida
• .resetwelcome goodbye - Restablece solo el mensaje de despedida  
• .resetwelcome all - Restablece ambos mensajes

*Ejemplo:*
.resetwelcome all`);
  }

  const groupId = m.chat;
  
  try {
    // Cargar configuración actual
    const config = loadConfig();
    
    // Mensajes predeterminados
    const defaultMessages = {
      welcome: "¡hola bienvenido cambia este mensaje con welcomedit",
      goodbye: "¡jajaaj se fue un puto cambia este mensaje con bayedit"
    };
    
    // Inicializar configuración del grupo si no existe
    if (!config[groupId]) {
      config[groupId] = { ...defaultMessages };
    }
    
    let resetMessage = '';
    
    // Procesar la acción
    switch (action) {
      case 'welcome':
      case 'bienvenida':
        config[groupId].welcome = defaultMessages.welcome;
        resetMessage = 'El mensaje de bienvenida ha sido restablecido.';
        break;
        
      case 'goodbye':
      case 'despedida':
        config[groupId].goodbye = defaultMessages.goodbye;
        resetMessage = 'El mensaje de despedida ha sido restablecido.';
        break;
        
      case 'all':
      case 'todo':
      case 'todos':
        config[groupId] = { ...defaultMessages };
        resetMessage = 'Ambos mensajes han sido restablecidos.';
        break;
        
      default:
        return m.reply('⚠️ Opción inválida. Usa: welcome, goodbye o all');
    }
    
    // Guardar configuración
    if (saveConfig(config)) {
      return m.reply(`✅ *Mensajes restablecidos exitosamente*

*Grupo:* ${groupMetadata.subject}
*Acción:* ${resetMessage}

*Mensajes actuales:*
🟢 *Bienvenida:* ${config[groupId].welcome}
🔴 *Despedida:* ${config[groupId].goodbye}`);
    } else {
      return m.reply('❌ Error al guardar los cambios. Inténtalo de nuevo.');
    }
    
  } catch (error) {
    console.error('Error en resetwelcome:', error);
    return m.reply('❌ Ocurrió un error al restablecer los mensajes. Inténtalo de nuevo.');
  }
};

handler.help = ['resetwelcome'];
handler.tags = ['group'];
handler.command = /^(resetwelcome|resetmensajes)$/i;
handler.group = true;
handler.admin = true;

export default handler;