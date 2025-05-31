import { getBotName } from '../lib/getBotName.js';

const handler = async (m, { isOwner, isAdmin, conn, participants, args, usedPrefix }) => {
  // Evitar conflicto si el prefijo es 'a' o 'A'
  if (usedPrefix.toLowerCase() === 'a') return;

  // React con emoji personalizado o por defecto
  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '👤';
  await m.react(customEmoji);

  // Solo administradores u owner pueden usar el comando
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  // Obtener nombre dinámico del bot
  const botName = await getBotName(conn);

  // Construir mensaje
  const mensaje = args.join(' ');
  const infoLine = `*» INFO :* ${mensaje}`;
  let teks = `*!  MENCION GENERAL  !*
*PARA ${participants.length} MIEMBROS* 🗣️

${infoLine}

╭┄ ┄ 𝅄 ۪꒰ \`⡞᪲=͟͟͞${botName} ≼᳞ׄ\` ꒱ ۟ 𝅄 ┄
`;

  // Agregar menciones
  for (const mem of participants) {
    teks += `┊${customEmoji} @${mem.id.split('@')[0]}
`;
  }

  teks += `╰⸼ ┄ ┄ ┄ ─ ꒰ ׅ୭ *${botName}* ୧ ׅ ꒱ ┄ ─ ┄ ⸼`;

  // Enviar mensaje con menciones
  await conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) });
};

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.admin = true;
handler.group = true;

export default handler;
