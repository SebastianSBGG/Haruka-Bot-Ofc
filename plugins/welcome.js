// welcome.js - Sistema avanzado de bienvenidas y despedidas con JSON

import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Ruta al archivo JSON de configuración
const CONFIG_PATH = './src/database/welcome_config.json';

// Función para crear directorios recursivamente si no existen
function ensureDirectoryExists() {
  const dirname = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
    console.log(`Directorio creado: ${dirname}`);
  }
}

// Asegurarse de que el archivo existe
function ensureConfigExists() {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(CONFIG_PATH)) {
      // Crear estructura inicial si el archivo no existe
      const initialConfig = {};
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(initialConfig, null, 2));
      console.log(`Archivo de configuración creado en: ${CONFIG_PATH}`);
    }
  } catch (error) {
    console.error('Error al verificar/crear archivo de configuración:', error);
  }
}

// Cargar la configuración
function loadConfig() {
  ensureConfigExists();
  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar la configuración:', error);
    return {};
  }
}

// Guardar la configuración
function saveConfig(config) {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    return false;
  }
}

// Obtener mensajes para un grupo específico o usar valores predeterminados
function getGroupMessages(groupId) {
  const config = loadConfig();
  // Si el grupo no tiene configuración, usar valores predeterminados
  if (!config[groupId]) {
    return {
      welcome: "¡hola bienvenido cambia este mensaje con welcomedit",
      goodbye: "¡jajaaj se fue un puto cambia este mensaje con bayedit"
    };
  }
  return config[groupId];
}

// Funciones exportadas para uso en comandos (opcional si los comandos las incluyen)
export const welcomeUtils = {
  CONFIG_PATH,
  loadConfig,
  saveConfig,
  getGroupMessages,
  ensureConfigExists
};

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  let who = m.messageStubParameters[0];
  let taguser = `@${who.split('@')[0]}`;
  let chat = global.db.data.chats[m.chat];
  let defaultImage = 'https://files.catbox.moe/zw21gt.jpg';
  
  // Obtener ID del grupo
  const groupId = m.chat;

  if (chat.welcome) {
    let img;
    try {
      let pp = await conn.profilePictureUrl(who, 'image');
      img = await (await fetch(pp)).buffer();
    } catch {
      img = await (await fetch(defaultImage)).buffer();
    }

    let miembros = participants.length;
    
    // Cargar mensajes personalizados del grupo
    const groupMessages = getGroupMessages(groupId);

    // Bienvenida: se muestra el total actual + 1
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = `ᯓᡣ𐭩 *𝙱𝙸𝙴𝙽𝚅𝙴𝙽𝙸𝙳𝙾 𝙰𝙻 𝙶𝚁𝚄𝙿𝙾*
◇ 𝙿𝙰𝚁𝚃𝙸𝙲𝙸𝙿𝙰𝙽𝚃𝙴: *${taguser}*
◇ 𝖫𝗎𝗀𝖺𝗋: *${groupMetadata.subject}*
◇ 𝖬𝗂𝖾𝗆𝖻𝗋𝗈𝗌: *${miembros + 1}*
> ◇ *𝖬𝖾𝗇𝗌𝖺𝗃𝖾:* 𝖣𝗂𝗌𝖿𝗋𝗎𝗍𝖺 𝗍𝗎 𝖾𝗌𝗍𝖾𝗇𝖼𝗂𝖺 𝖾𝗇 𝖾𝗅 𝗀𝗋𝗎𝗉𝗈 *𖦲*

${groupMessages.welcome}`;
      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] });
    }

    // Despedida: se muestra el total actual - 1
    else if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    ) {
      let salida = `ᯓᡣ𐭩 *𝖲𝖤 𝖥𝖴𝖤 𝖣𝖤𝖫 𝖦𝖱𝖴𝖯𝖮*
◇ 𝙿𝙰𝚁𝚃𝙸𝙲𝙸𝙿𝙰𝙽𝚃𝙴: *${taguser}*
◇ 𝖫𝗎𝗀𝖺𝗋: *${groupMetadata.subject}*
◇ 𝖬𝗂𝖾𝗆𝖻𝗋𝗈𝗌: *${miembros - 1}*
> ◇ *𝖬𝖾𝗇𝗌𝖺𝗃𝖾:* 𝗌𝖺𝗅𝗂𝗈 𝗎𝗇 𝗉𝖺𝗋𝗍𝗂𝖼𝗂𝗉𝖺𝗇𝗍𝖾 𝖽𝖾𝗅 𝗀𝗋𝗎𝗉𝗈 *𖦲*

${groupMessages.goodbye}`;
      await conn.sendMessage(m.chat, { image: img, caption: salida, mentions: [who] });
    }
  }

  return true;
}