const handler = async (m, { conn }) => {
  let txt = '';
  try {
    // Obtener todos los chats de grupo
    const allGroups = Object.entries(conn.chats)
      .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);

    // Filtrar solo aquellos grupos en los que el bot es participante
    const groups = [];
    for (const [jid] of allGroups) {
      // Intentar obtener metadata del grupo
      const groupMetadata = (conn.chats[jid]?.metadata) || await conn.groupMetadata(jid).catch(() => null);
      if (!groupMetadata) continue;
      const participants = groupMetadata.participants || [];
      // Solo incluir grupos donde el bot se encuentre entre los participantes
      if (participants.some(u => conn.decodeJid(u.id) === conn.user.jid)) {
        groups.push({ jid, metadata: groupMetadata, participants });
      }
    }

    const totalGroups = groups.length;
    for (let i = 0; i < groups.length; i++) {
      const { jid, metadata, participants } = groups[i];
      // Buscar al bot dentro de los participantes para saber si es admin
      const botEntry = participants.find(u => conn.decodeJid(u.id) === conn.user.jid) || {};
      const isBotAdmin = botEntry.admin || false;
      // Como se muestran solo grupos en los que el bot es participante, se fija el status en "Participante"
      const participantStatus = '👤 Participante';
      const totalParticipants = participants.length;

      // Obtener el link solo si el bot es administrador
      let groupLink = '--- (No admin) ---';
      if (isBotAdmin) {
        const inviteCode = await conn.groupInviteCode(jid).catch(() => null);
        groupLink = inviteCode 
          ? `https://chat.whatsapp.com/${inviteCode}` 
          : '--- (Error retrieving link) ---';
      }

      txt += `*◉ Grupo ${i + 1}*\n` +
             `*➤ Nombre:* ${await conn.getName(jid)}\n` +
             `*➤ ID:* ${jid}\n` +
             `*➤ Admin:* ${isBotAdmin ? '✔ Sí' : '❌ No'}\n` +
             `*➤ Estado:* ${participantStatus}\n` +
             `*➤ Total de Participantes:* ${totalParticipants}\n` +
             `*➤ Link:* ${groupLink}\n\n`;
    }

    m.reply(`*Lista de grupos del Bot* 🤖\n\n*—◉ Total de grupos:* ${totalGroups}\n\n${txt}`.trim());
  } catch (error) {
    m.reply('Ocurrió un error al obtener la lista de grupos.');
  }
};

handler.help = ['groups', 'grouplist'];
handler.tags = ['owner'];
handler.command = ['listgroup', 'gruposlista', 'grouplist', 'listagrupos'];
handler.rowner = true;
handler.private = true;
export default handler;
