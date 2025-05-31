// plugins/resetstats.js
import { getGroupDatabase, saveGroupDatabase, initializeUser, getUserName } from '../lib/database-utils.js';

let handler = async (m, { conn, participants, groupMetadata, isAdmin, args }) => {
    if (!m.isGroup) {
        return m.reply('❌ Este comando solo funciona en grupos.');
    }
    
    if (!isAdmin) {
        return m.reply('❌ Solo los administradores pueden usar este comando.');
    }
    
    try {
        const groupId = groupMetadata.id;
        const mentionedUser = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;
        
        // Confirmación para reset total
        if (!mentionedUser && !args[0]) {
            return m.reply('⚠️ *¿Estás seguro de resetear TODAS las estadísticas del grupo?*\n\nUsa: `.resetstats confirm` para confirmar\nO: `.resetstats @usuario` para resetear solo un usuario');
        }
        
        const groupData = getGroupDatabase(groupId);
        
        if (mentionedUser) {
            // Resetear usuario específico
            const isUserInGroup = participants.some(p => p.id === mentionedUser);
            if (!isUserInGroup) {
                return m.reply('❌ El usuario mencionado no está en este grupo.');
            }
            
            if (groupData.users[mentionedUser]) {
                const userName = getUserName(mentionedUser);
                const oldStats = groupData.users[mentionedUser];
                const oldTotal = oldStats.msgCount + oldStats.stickerCount + oldStats.imageCount + 
                               oldStats.videoCount + oldStats.audioCount + oldStats.documentCount;
                
                // Resetear estadísticas del usuario
                groupData.users[mentionedUser] = initializeUser();
                
                // Actualizar contador total del grupo
                groupData.totalMessages = Math.max(0, groupData.totalMessages - oldTotal);
                
                saveGroupDatabase(groupId, groupData);
                
                await m.reply(`✅ Estadísticas de @${userName} han sido reseteadas.\n📊 Se eliminaron ${oldTotal} mensajes del contador total.`, null, { mentions: [mentionedUser] });
            } else {
                const userName = getUserName(mentionedUser);
                await m.reply(`❌ @${userName} no tiene estadísticas registradas.`, null, { mentions: [mentionedUser] });
            }
        } else if (args[0] && args[0].toLowerCase() === 'confirm') {
            // Resetear todo el grupo
            const oldTotal = groupData.totalMessages;
            const oldUsers = Object.keys(groupData.users).length;
            
            const initialData = {
                groupId: groupId,
                createdAt: new Date().toISOString(),
                users: {},
                totalMessages: 0,
                lastActivity: null
            };
            
            saveGroupDatabase(groupId, initialData);
            
            await m.reply(`✅ *TODAS las estadísticas del grupo han sido reseteadas.*\n\n📊 Estadísticas eliminadas:\n- ${oldTotal} mensajes totales\n- ${oldUsers} usuarios con actividad\n\n🔄 El contador comenzará desde cero.`);
        } else {
            return m.reply('⚠️ Para resetear todo el grupo usa: `.resetstats confirm`\nPara resetear un usuario usa: `.resetstats @usuario`');
        }
        
    } catch (error) {
        console.error('❌ Error en comando resetstats:', error);
        await m.reply('❌ Ocurrió un error al resetear las estadísticas. Intenta nuevamente.');
    }
};

handler.help = ['resetstats @usuario', 'resetstats confirm'];
handler.tags = ['group'];
handler.command = /^resetstats$/i;
handler.group = true;
handler.admin = true;

export default handler;