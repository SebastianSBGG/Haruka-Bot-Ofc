// plugins/groupstats.js
import { getGroupDatabase, formatNumber } from '../lib/database-utils.js';

let handler = async (m, { conn, participants, groupMetadata }) => {
    if (!m.isGroup) {
        return m.reply('❌ Este comando solo funciona en grupos.');
    }
    
    try {
        const groupId = groupMetadata.id;
        const groupData = getGroupDatabase(groupId);
        
        // Calcular estadísticas generales
        let totalUsers = Object.keys(groupData.users).length;
        let activeUsers = 0;
        let totalMessages = 0;
        let totalStickers = 0;
        let totalImages = 0;
        let totalVideos = 0;
        let totalAudios = 0;
        let totalDocuments = 0;
        
        let mostActiveUser = null;
        let maxActivity = 0;
        
        for (let userId in groupData.users) {
            const userData = groupData.users[userId];
            const userTotal = userData.msgCount + userData.stickerCount + userData.imageCount + 
                             userData.videoCount + userData.audioCount + userData.documentCount;
            
            if (userTotal > 0) {
                activeUsers++;
                totalMessages += userData.msgCount;
                totalStickers += userData.stickerCount;
                totalImages += userData.imageCount;
                totalVideos += userData.videoCount;
                totalAudios += userData.audioCount;
                totalDocuments += userData.documentCount;
                
                if (userTotal > maxActivity) {
                    maxActivity = userTotal;
                    mostActiveUser = userId;
                }
            }
        }
        
        // Calcular promedio de mensajes por usuario activo
        const avgMessages = activeUsers > 0 ? Math.round(totalMessages / activeUsers) : 0;
        
        // Fecha de creación de la base de datos
        const createdDate = new Date(groupData.createdAt).toLocaleDateString();
        const lastActivityDate = groupData.lastActivity ? new Date(groupData.lastActivity).toLocaleDateString() : 'N/A';
        
        // Construir mensaje
        let txt = `*𝙴𝚜𝚝𝚊𝚍𝚒𝚜𝚝𝚒𝚌𝚊𝚜*\n\n`;
        txt += ` *𝚒𝚗𝚏𝚘 𝚋𝚊𝚜𝚒𝚌𝚊:*\n`;
        txt += ` 𝚝𝚘𝚝𝚊𝚕 𝚙𝚊𝚛𝚝𝚒𝚌𝚒𝚙𝚊𝚗𝚝𝚎𝚜: ${participants.length}\n`;
        txt += ` 𝚞𝚜𝚞𝚊𝚛𝚒𝚘𝚜 𝚊𝚌𝚝𝚒𝚟𝚘𝚜: ${activeUsers}\n`;
        txt += ` 𝚄𝚜𝚞𝚊𝚛𝚞𝚒𝚘𝚜 𝚜𝚒𝚗 𝚗𝚊𝚍𝚊: ${participants.length - activeUsers}\n`;
        txt += ` 𝚁𝚎𝚐𝚒𝚜𝚝𝚛𝚘 𝚒𝚗𝚒𝚌𝚒𝚊𝚕: ${createdDate}\n`;
        txt += ` 𝚄𝚕𝚝𝚒𝚖𝚊 𝙰𝚌𝚝𝚒𝚟𝚒𝚍𝚊𝚍: ${lastActivityDate}\n\n`;
        
        txt += `*𝙰𝚌𝚝𝚒𝚟𝚒𝚍𝚊𝚍:*\n`;
        txt += ` 𝙼𝚎𝚗𝚜𝚊𝚓𝚎𝚜: ${formatNumber(totalMessages)}\n`;
        txt += ` 𝚂𝚝𝚒𝚔𝚎𝚛: ${formatNumber(totalStickers)}\n`;
        txt += ` 𝙸𝚖𝚐: ${formatNumber(totalImages)}\n`;
        txt += ` 𝚅𝚒𝚍𝚎𝚘: ${formatNumber(totalVideos)}\n`;
        txt += ` 𝙰𝚞𝚍𝚒𝚘: ${formatNumber(totalAudios)}\n`;
        txt += ` 𝙳𝚘𝚞𝚖𝚎𝚗𝚝𝚘: ${formatNumber(totalDocuments)}\n`;
        txt += `*Total general:* ${formatNumber(groupData.totalMessages)}\n\n`;
        
        if (activeUsers > 0) {
            txt += ` *𝙿𝚛𝚘𝚖𝚎𝚍𝚒𝚘:*\n`;
            txt += ` 𝙼𝚎𝚗𝚜𝚊𝚓𝚎 𝙿𝚘𝚛 𝚄𝚜𝚞𝚊𝚛𝚒𝚘: ${avgMessages}\n`;
            
            if (mostActiveUser) {
                const userName = mostActiveUser.replace('@s.whatsapp.net', '').replace('@c.us', '');
                txt += `🏆 Usuario más activo: @${userName} (${formatNumber(maxActivity)} actividades)\n\n`;
            }
        }
        
        const activityRate = ((activeUsers / participants.length) * 100).toFixed(1);
        txt += ` 𝙰𝚌𝚝𝚒𝚟𝚒𝚍𝚊𝚍: ${activityRate}%\n`;
        txt += `💡 *Tip:* Usa \`.ranking\` para ver el top de usuarios`;
        
        const mentions = mostActiveUser ? [mostActiveUser] : [];
        await m.reply(txt, null, { mentions });
        
    } catch (error) {
        console.error('❌ Error en comando groupstats:', error);
        await m.reply('❌ Ocurrió un error al obtener las estadísticas del grupo. Intenta nuevamente.');
    }
};

handler.help = ['groupstats', 'estadisticas'];
handler.tags = ['group'];
handler.command = /^(groupstats|estadisticas)$/i;
handler.group = true;

export default handler;