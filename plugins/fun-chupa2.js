const handler = async (m, { conn, command, text }) => {
let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
if (!who) throw '*[★] Menciona a alguien para simular una acción de felación.*'
const caption = `*[ ★ ] 𝚃𝚄 𝙼𝙰𝙼𝙸𝚃𝙰 @${who.split('@')[0]}*`
conn.sendMessage(m.chat, {image: { url: 'https://i.ibb.co/K60Q5k1/IMG-20250117-WA0227.jpg' }, caption: caption, mentions: conn.parseMention(caption)}, {quoted: m});   
};
handler.command = /^(tumama|tu mamá|tumamita|tu mamita)$/i;
export default handler;