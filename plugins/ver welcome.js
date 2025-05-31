// viewwelcome.js - Comando para ver mensajes configurados
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = './src/database/welcome_config.json';

// Cargar configuración
function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return {};
    }
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar configuración:', error);
    return {};
  }
}

const handler = async (m, { conn, groupMetadata }) => {
  // Verificar que sea un grupo
  if (!m.isGroup) {
    return m.reply('⚠️ Este comando solo funciona en grupos.');
  }

  const groupId = m.chat;
  
  try {
    // Cargar configuración actual
    const config = loadConfig();
    
    // Verificar si el grupo tiene configuración
    if (!config[groupId]) {
      return m.reply(`ℹ️ *No hay mensajes personalizados configurados*

*Grupo:* ${groupMetadata.subject}

Este grupo está usando los mensajes predeterminados del sistema.

*Para configurar mensajes personalizados:*
• .setwelcome <mensaje> - Configura mensaje de bienvenida
• .setgoodbye <mensaje> - Configura mensaje de despedida`);
    }
    
    // Obtener mensajes configurados
    const { welcome, goodbye } = config[groupId];
    
    // Generar mensaje de respuesta
    const mensaje = `📋 *Mensajes configurados para el grupo*

*🏠 Grupo:* ${groupMetadata.subject}

*🟢 Mensaje de Bienvenida:*
${welcome}

*🔴 Mensaje de Despedida:*
${goodbye}

*Para modificar los mensajes:*
• .setwelcome <nuevo mensaje>
• .setgoodbye <nuevo mensaje>`;
    
    return m.reply(mensaje);
    
  } catch (error) {
    console.error('Error en viewwelcome:', error);
    return m.reply('❌ Ocurrió un error al obtener los mensajes. Inténtalo de nuevo.');
  }
};

handler.help = ['viewwelcome'];
handler.tags = ['group'];
handler.command = /^(viewwelcome|sjsjkasydjwjsis8kwi8|welcomeconfig)$/i;
handler.group = true;

export default handler;