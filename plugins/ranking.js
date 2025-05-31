// plugins/ranking.js
import { getGroupDatabase, getUserName, formatNumber } from '../lib/database-utils.js';

let handler = async (m, { conn, participants, groupMetadata, args }) => {
    if (!m.isGroup) {
        return m.reply('❌ Este comando solo funciona en grupos.');
    }
    
    try {
        const groupId = groupMetadata.id;
        const groupData = getGroupDatabase(groupId);
        
        await m.reply('📊 𝙶𝚎𝚗𝚎𝚛𝚊𝚗𝚍𝚘 𝙻𝚒𝚜𝚝.');
        
        // Determinar cuántos usuarios mostrar (por defecto 10, máximo 20)
        let limit = 10;
        if (args[0] && !isNaN(args[0])) {
            limit = Math.min(Math.max(parseInt(args[0]), 5), 20);
        }
        
        // Crear lista de usuarios con actividad (solo participantes actuales)
        let userList = [];
        
        for (let participant of participants) {
            const userId = participant.id;
            const userData = groupData.users[userId];
            
            if (userData) {
                const totalActivity = userData.msgCount + userData.stickerCount + userData.imageCount + 
                                     userData.videoCount + userData.audioCount + userData.documentCount;
                
                if (totalActivity > 0) {
                    userList.push({
                        id: userId,
                        name: getUserName(userId),
                        msgCount: userData.msgCount,
                        totalActivity: totalActivity,
                        stickerCount: userData.stickerCount,
                        imageCount: userData.imageCount,
                        lastMessage: userData.lastMessage
                    });
                }
            }
        }
        
        // Verificar si hay usuarios con actividad
        if (userList.length === 0) {
            return m.reply('📊 𝙰𝚞𝚗 𝚗𝚊𝚍𝚊.');
        }
        
        // Ordenar por total de actividad
        userList.sort((a, b) => b.totalActivity - a.totalActivity);
        
        // Construir mensaje
        let txt = `🏆 *𝙶𝚛𝚞𝚙𝚘 𝙰𝚌𝚝𝚒𝚟𝚘 ?*\n\n`;
        txt += `📊 𝚃𝚘𝚝𝚊𝚕: ${formatNumber(groupData.totalMessages)}\n`;
        txt += `👥 𝚄𝚜𝚎𝚛: ${userList.length}/${participants.length}\n`;
        txt += `📅 𝚄𝚕𝚝𝚒𝚖𝚊 𝚊𝚝𝚒𝚟𝚒𝚍𝚊𝚍: ${groupData.lastActivity ? new Date(groupData.lastActivity).toLocaleDateString() : 'N/A'}\n\n`;
        
        const topUsers = userList.slice(0, limit);
        const mentions = [];
        
        topUsers.forEach((user, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
            const percentage = ((user.totalActivity / groupData.totalMessages) * 100).toFixed(1);
            
            txt += `${medal} @${user.name}\n`;
            txt += `   💬 ${formatNumber(user.msgCount)} 𝙼𝚎𝚗𝚜𝚊𝚓𝚎𝚜 (${percentage}%)\n`;
            txt += `   🖼️ ${formatNumber(user.stickerCount)} 𝚂𝚝𝚒𝚔𝚎𝚛 | 🏞️ ${formatNumber(user.imageCount)} 𝙸𝚖𝚐\n`;
            txt += `   📊 𝚃𝚘𝚝𝚊𝚕: ${formatNumber(user.totalActivity)}\n\n`;
            
            mentions.push(user.id);
        });
        
        if (userList.length > limit) {
            txt += `... y ${userList.length - limit} 𝙴𝚕 𝙼𝚎𝚓𝚘𝚛 𝚄𝚜𝚎𝚛\n\n`;
        }
        
        txt += `💡 *𝚃𝚒𝚙:* 𝚄𝚜𝚊 \`.ranking 15\` 𝙿𝚊𝚛𝚊 𝚅𝚎𝚛 𝙼𝚊𝚜 𝚄𝚜𝚎𝚛`;
        
        await m.reply(txt, null, { mentions });
        
    } catch (error) {
        console.error('❌ Error en comando ranking:', error);
        await m.reply('❌ Ocurrió un error al generar el ranking. Intenta nuevamente.');
    }
};

handler.help = ['ranking [número]', 'top [número]'];
handler.tags = ['group'];
handler.command = /^(ranking|actividadgrupo)$/i;
handler.group = true;

export default handler;