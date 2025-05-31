var handler = async (m, { conn, participants, usedPrefix, command }) => {
    // Verificar si el bot es administrador
    const groupMetadata = await conn.groupMetadata(m.chat);
    const botNumber = conn.user.jid;
    const botAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
    
    if (!botAdmin) {
        return conn.reply(m.chat, '🚩 *El bot necesita ser administrador para ejecutar este comando.*', m);
    }

    // Obtener IDs de los usuarios a eliminar
    let users = m.mentionedJid.length ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [];
    
    if (users.length === 0) {
        return conn.reply(m.chat, '✅ *Etiqueta o responde al mensaje de las personas que quieres eliminar (máximo 20).*', m);
    }

    // Limitar a 20 personas
    users = users.slice(0, 20);

    // Obtener el dueño del grupo y el dueño del bot
    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    // Filtrar usuarios que no deben ser eliminados
    users = users.filter(user => ![conn.user.jid, ownerGroup, ownerBot].includes(user));

    if (users.length === 0) {
        return conn.reply(m.chat, '🚩 *No puedo eliminar a los propietarios ni al bot.*', m);
    }

    // Expulsar a los usuarios
    await conn.groupParticipantsUpdate(m.chat, users, 'remove');

    // Mensaje de confirmación
    let mensaje = `✅ *Usuarios eliminados:* \n${users.map(u => `- @${u.split('@')[0]}`).join('\n')}`;
    conn.reply(m.chat, mensaje, null, { mentions: users });
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'sacar', 'ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
