let WAMessageStubType = (await import('@whiskeysockets/baileys')).default

export async function before(m, { conn, participants, groupMetadata }) {
if (!m.messageStubType || !m.isGroup) return
const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"}  
let chat = global.db.data.chats[m.chat]
let usuario = `@${m.sender.split`@`[0]}`
let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/gqr82s.jpg'  

let nombre, foto, edit, newlink, status, admingp, noadmingp, aceptar
nombre = `《✧》${usuario} 𝐇𝐀 𝐂𝐀𝐌𝐁𝐈𝐀𝐃𝐎 𝐄𝐋 𝐍𝐎𝐌𝐁𝐑𝐄 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎.\n\n> ✦ 𝐀𝐇𝐎𝐑𝐀 𝐄𝐋 𝐆𝐑𝐔𝐏𝐎 𝐒𝐄 𝐋𝐋𝐀𝐌𝐀:\n> *${m.messageStubParameters[0]}*.`
foto = `《✧》𝐒𝐄 𝐇𝐀 𝐂𝐀𝐌𝐁𝐈𝐀𝐃𝐎 𝐋𝐀 𝐈𝐌𝐀𝐆𝐄𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎\n\n> ✦ 𝐀𝐂𝐂𝐈𝐎𝐍 𝐇𝐄𝐂𝐇𝐀 𝐏𝐎𝐑:\n> » ${usuario}`
edit = `《✧》${usuario} 𝐇𝐀 𝐏𝐄𝐑𝐌𝐈𝐓𝐈𝐃𝐎 𝐐𝐔𝐄 ${m.messageStubParameters[0] == 'on' ? '𝐒𝐎𝐋𝐎 𝐀𝐃𝐌𝐈𝐍𝐒' : '𝐓𝐎𝐃𝐎𝐒'} 𝐏𝐔𝐄𝐃𝐀𝐍 𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐀𝐑 𝐄𝐋 𝐆𝐑𝐔𝐏𝐎.`
newlink = `《✧》𝐄𝐋 𝐄𝐍𝐋𝐀𝐂𝐄 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎 𝐇𝐀 𝐒𝐈𝐃𝐎 𝐑𝐄𝐒𝐓𝐀𝐁𝐋𝐄𝐂𝐈𝐃𝐎.\n\n> ✦ 𝐀𝐂𝐂𝐈𝐎𝐍 𝐇𝐄𝐂𝐇𝐀 𝐏𝐎𝐑:\n> » ${usuario}`
status = `《✧》𝐄𝐋 𝐆𝐑𝐔𝐏𝐎 𝐇𝐀 𝐒𝐈𝐃𝐎 ${m.messageStubParameters[0] == 'on' ? '*cerrado 🔒*' : '*abierto 🔓*'} Por ${usuario}\n\n> ✦ Ahora ${m.messageStubParameters[0] == 'on' ? '*𝐒𝐎𝐋𝐎 𝐀𝐃𝐌𝐈𝐍𝐒*' : '*𝐓𝐎𝐃𝐎𝐒*'} 𝐏𝐔𝐄𝐃𝐄𝐍 𝐄𝐍𝐕𝐈𝐀𝐑 𝐌𝐄𝐍𝐒𝐀𝐉𝐄.`
admingp = `《✧》@${m.messageStubParameters[0].split`@`[0]} 𝐀𝐇𝐎𝐑𝐀 𝐄𝐒 𝐀𝐃𝐌𝐈𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎.\n\n> ✦ 𝐀𝐂𝐂𝐈𝐎𝐍 𝐇𝐄𝐂𝐇𝐀 𝐏𝐎𝐑:\n> » ${usuario}`
noadmingp =  `《✧》@${m.messageStubParameters[0].split`@`[0]} 𝐃𝐄𝐉𝐀 𝐃𝐄 𝐒𝐄𝐑 𝐀𝐃𝐌𝐈𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎.\n\n> ✦ 𝐀𝐂𝐂𝐈𝐎𝐍 𝐇𝐄𝐂𝐇𝐀 𝐏𝐎𝐑:\n> » ${usuario}`
aceptar = `《✧》𝐇𝐀 𝐋𝐋𝐄𝐆𝐀𝐃𝐎 𝐔𝐍 𝐍𝐔𝐄𝐕𝐎 𝐏𝐀𝐑𝐓𝐈𝐂𝐈𝐏𝐀𝐍𝐓𝐄 𝐀𝐋 𝐆𝐑𝐔𝐏𝐎.\n\n> ◦ ✐ Grupo: *${groupMetadata.subject}*\n\n> ◦ ⚘ 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐎/𝐀: @${m.messageStubParameters[0].split('@')[0]}\n\n> ◦ ✦ 𝐀𝐂𝐄𝐏𝐓𝐀𝐃𝐎 𝐏𝐎𝐑: @${m.sender.split('@')[0]}` 

if (chat.detect && m.messageStubType == 21) {
await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })   

} else if (chat.detect && m.messageStubType == 22) {
await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })

} else if (chat.detect && m.messageStubType == 23) {
await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })    

} else if (chat.detect && m.messageStubType == 25) {
await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })  

} else if (chat.detect && m.messageStubType == 26) {
await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })  

} else if (chat.detect2 && m.messageStubType == 27) {
await conn.sendMessage(m.chat, { text: aceptar, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] }, { quoted: fkontak })

} else if (chat.detect && m.messageStubType == 29) {
await conn.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })  

return;
} if (chat.detect && m.messageStubType == 30) {
await conn.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })  

} else {
//console.log({ messageStubType: m.messageStubType,
//messageStubParameters: m.messageStubParameters,
//type: WAMessageStubType[m.messageStubType], 
//})
}}
