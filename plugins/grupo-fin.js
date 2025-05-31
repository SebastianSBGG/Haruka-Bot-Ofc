var handler = async (m, { conn, participants, command }) => {
    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
    const botId = conn.user.jid; // ID del bot

    // Verificar si el que usa el comando es el propietario del bot
    if (m.sender !== ownerBot) {
        return conn.reply(m.chat, '❗ Este comando solo puede ser utilizado por el propietario del bot.', m);
    }

    // Filtrar participantes para eliminar (todos menos el propietario del grupo, del bot y el bot mismo)
    const usersToRemove = participants.map(participant => participant.id)
        .filter(user => user !== ownerGroup && user !== ownerBot && user !== botId);

    if (usersToRemove.length === 0) {
        return conn.reply(m.chat, '🚩 No hay usuarios para eliminar.', m);
    }

    // Intentar eliminar a los participantes con un retraso
    for (let user of usersToRemove) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            // Esperar 1 segundo entre eliminaciones
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            // Manejar errores de forma específica
            if (error.message.includes('rate-overlimit')) {
                conn.reply(m.chat, '❗ Alcanzado el límite de tasa. Por favor, intenta más tarde.', m);
                break; // Detener el proceso si se alcanza el límite
            } else {
                conn.reply(m.chat, `❌ Error al eliminar a ${user}: ${error.message}`, m);
            }
        }
    }

    // Enviar un mensaje confirmando que la operación ha terminado
    conn.reply(m.chat, '✅ Todos los miembros han sido procesados (eliminados o error), excepto el propietario del grupo, el propietario del bot y el bot.', m);
};

// Configuración del comando
handler.help = ['kickgrup'];
handler.tags = ['grupo'];
handler.command = /^kickgrup$/i;
handler.rowner = true;  // Solo el propietario del bot puede usarlo
handler.botAdmin = true;  // El bot debe ser administrador del grupo
handler.group = true;  // Solo puede ser usado en grupos

export default handler;
