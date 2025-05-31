let handler = async (m) => {
    if (!m.isGroup) {
        return conn.reply(m.chat, 'Este comando solo se puede usar en grupos.', m);
    }

    let groupMetadata = await conn.groupMetadata(m.chat);
    let groupId = groupMetadata.id;
    let groupName = groupMetadata.subject;
    let groupDesc = groupMetadata.desc || 'No hay descripción disponible.';
    let groupParticipants = groupMetadata.participants.length;
    let groupLink = groupMetadata.replay ? groupMetadata.replay : 'Este grupo no tiene enlace.';

    let infoMessage = `
    🥳 *Información del Grupo:*
    *Nombre:* ${groupName}
    *ID del Grupo:* ${groupId}
    *Descripción:* ${groupDesc}
    *Número de Participantes:* ${groupParticipants}
    *Enlace del Grupo:* ${groupLink}
    `;

    conn.reply(m.chat, infoMessage, m);
};

handler.command = /^(info grupo|grups19)$/i; // Comando para activar la consulta de información del grupo
handler.group = true; // Solo en grupos
handler.fail = null; // Manejo de fallos
export default handler;
