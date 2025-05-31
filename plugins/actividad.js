// plugins/actividad.js
import { getGroupDatabase, getUserName, formatNumber } from '../lib/database-utils.js';

let handler = async (m, { conn, participants, groupMetadata }) => {
    if (!m.isGroup) {
        return m.reply('❌ Este comando solo funciona en grupos.');
    }
    
    try {
        const groupId = groupMetadata.id;
        const mentionedUser = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
        
        // Obtener base de datos del grupo
        const groupData = getGroupDatabase(groupId);
        
        // Verificar si el usuario está en el grupo
        const isUserInGroup = participants.some(p => p.id === mentionedUser);
        if (!isUserInGroup && mentionedUser !== m.sender) {
            return m.reply('❌ El usuario mencionado no está en este grupo.');
        }
        
        // Obtener datos del usuario
        const userData = groupData.users[mentionedUser] || {
            msgCount: 0,
            stickerCount: 0,
            imageCount: 0,
            videoCount: 0,
            audioCount: 0,
            documentCount: 0,
            firstMessage: null,
            lastMessage: null
        };
        
        const userName = getUserName(mentionedUser);
        const totalActivity = userData.msgCount + userData.stickerCount + userData.imageCount + 
                             userData.videoCount + userData.audioCount + userData.documentCount;
        
        // Construir mensaje de respuesta
        let txt = `☭ *Mensajes enviados por el usuario @${userName} en este grupo:* ${formatNumber(userData.msgCount)}\n\n`;
        
        if (totalActivity === 0) {
            txt += `😴 Este usuario aún no ha enviado mensajes en el grupo.`;
        } else {
            txt += ` *Estadísticas detalladas:*\n`;
            txt += ` Mensajes de texto: ${formatNumber(userData.msgCount)}\n`;
            txt += ` Stickers: ${formatNumber(userData.stickerCount)}\n`;
            txt += ` Imágenes: ${formatNumber(userData.imageCount)}\n`;
            txt += ` Videos: ${formatNumber(userData.videoCount)}\n`;
            txt += ` Audios: ${formatNumber(userData.audioCount)}\n`;
            txt += ` Documentos: ${formatNumber(userData.documentCount)}\n`;
            txt += ` *Total de actividad:* ${formatNumber(totalActivity)}\n\n`;
            
            if (userData.firstMessage) {
                const firstDate = new Date(userData.firstMessage);
                txt += `🕐 Primer mensaje: ${firstDate.toLocaleDateString()}\n`;
            }
            if (userData.lastMessage) {
                const lastDate = new Date(userData.lastMessage);
                txt += `🕕 Último mensaje: ${lastDate.toLocaleDateString()}`;
            }
        }
        
        await m.reply(txt, null, { mentions: [mentionedUser] });
        
    } catch (error) {
        console.error('❌ Error en comando actividad:', error);
        await m.reply('❌ Ocurrió un error al obtener las estadísticas. Intenta nuevamente.');
    }
};

handler.help = ['actividad', 'actividad @usuario'];
handler.tags = ['group'];
handler.command = /^actividad$/i;
handler.group = true;

export default handler;