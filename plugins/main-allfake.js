import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) {

global.getBuffer = async function getBuffer(url, options) {
try {
options ? options : {}
var res = await axios({
method: "get",
url,
headers: {
'DNT': 1,
'User-Agent': 'GoogleBot',
'Upgrade-Insecure-Request': 1
},
...options,
responseType: 'arraybuffer'
})
return res.data
} catch (e) {
console.log(`Error : ${e}`)
}}
  
//creador y otros
global.creador = 'Wa.me/522219831926'
global.ofcbot = `${conn.user.jid.split('@')[0]}`
global.asistencia = 'Wa.me/522219831926'
global.namechannel = '𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲 𝚇 ᵈᵃᵛⁱᵈ ᵛⁱᵖ'
global.namechannel2 = '𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲 𝚇 ᵈᵃᵛⁱᵈ ᵛⁱᵖ"'
global.namegrupo = '𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲 𝚇 ᵈᵃᵛⁱᵈ ᵛⁱᵖ'
global.namecomu = ' 𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲 𝚇 ᵈᵃᵛⁱᵈ ᵛⁱᵖ '
global.listo = '🤑 *𝚈𝙰 𝚃𝙴𝚁𝙼𝙸𝙽𝙰𝙼𝙾𝚂*'
global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/gqr82s.jpg')

//Ids channel
global.idchannel = '120363401576634867@newsletter'
global.canalIdM = ["120363401576634867@newsletter", "120363401576634867@newsletter"]
global.canalNombreM = ["𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲 𝚇 ᵈᵃᵛⁱᵈ ᵛⁱᵖ", "𝙷𝙰𝚁𝚄𝙺𝙰 𝙱𝙾𝚃 𝙾𝙵𝙲 𝚇 ᵈᵃᵛⁱᵈ ᵛⁱᵖ"]
global.channelRD = await getRandomChannel()

//fechas
global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

//Reacciones De Comandos.!
global.rwait = '🕒'
global.done = '✅'
global.error = '✖️'
global.msm = '⚠️'

//Emojis determinado de Yuki Bot
global.emoji = '🤓'
global.emoji2 = '🤕'
global.emoji3 = '😔'
global.emoji4 = '👻'
global.emoji5 = '👑'
global.emojis = [emoji, emoji2, emoji3, emoji4].getRandom()

//mensaje en espera
global.wait = '🤕 𝙴𝚜𝚙𝚎𝚛𝚊 𝙳𝚎𝚓𝚊 𝙲𝚑𝚊𝚖𝚋𝚎𝚊𝚛...';
global.waitt = '🤕 𝙴𝚜𝚙𝚎𝚛𝚊 𝙳𝚎𝚓𝚊 𝙲𝚑𝚊𝚖𝚋𝚎𝚊𝚛...';
global.waittt = '🤕 𝙴𝚜𝚙𝚎𝚛𝚊 𝙳𝚎𝚓𝚊 𝙲𝚑𝚊𝚖𝚋𝚎𝚊𝚛...';
global.waitttt = '🤕 𝙴𝚜𝚙𝚎𝚛𝚊 𝙳𝚎𝚓𝚊 𝙲𝚑𝚊𝚖𝚋𝚎𝚊𝚛...';

//Enlaces
var canal = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a'  
let canal2 = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a'
var git = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a'
var github = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a' 
let correo = 'seba306053@gmail.com'

global.redes = [canal, canal2, git, github, correo].getRandom()

//Imagen
let category = "imagen"
const db = './src/database/db.json'
const db_ = JSON.parse(fs.readFileSync(db))
const random = Math.floor(Math.random() * db_.links[category].length)
const randomlink = db_.links[category][random]
const response = await fetch(randomlink)
const rimg = await response.buffer()
global.icons = rimg

//• ↳ ◜𝑻𝑰𝑬𝑴𝑷𝑶 𝑹𝑷𝑮◞ • ⚔
var ase = new Date(); var hour = ase.getHours(); switch(hour){ case 0: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 1: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 2: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 3: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 4: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 5: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 6: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 7: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅'; break; case 8: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 9: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 10: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 11: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 12: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 13: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 14: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 15: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 16: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 17: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 18: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 19: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 20: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 21: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 22: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 23: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;}
global.saludo = hour;

//tags
global.nombre = m.pushName || 'Anónimo'
global.taguser = '@' + m.sender.split("@s.whatsapp.net")
var more = String.fromCharCode(8206)
global.readMore = more.repeat(850)

global.packsticker = `°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n\n✦ Usuario: ${nombre}\n✦ Bot: ${botname}\n✦ Fecha: ${fecha}\n✦ Hora: ${tiempo}\n`;
global.packsticker2 = `\n°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n\n${dev}`
  
//Fakes
global.fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `522219831926-522219831926@g.us` } : {}) }, message: { 'contactMessage': { 'displayName': `${nombre}`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${nombre},;;;\nFN:${nombre},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': null, thumbnail: null,sendEphemeral: true}}}

global.fake = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, newsletterName: channelRD.name, serverMessageId: -1 }
}}, { quoted: m }

global.icono = [
'https://files.catbox.moe/gqr82s.jpg',
].getRandom()

global.rcanal = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, serverMessageId: 100, newsletterName: channelRD.name, }, externalAdReply: { showAdAttribution: true, title: packname, body: dev, mediaUrl: null, description: null, previewType: "PHOTO", thumbnailUrl: icono, sourceUrl: redes, mediaType: 1, renderLargerThumbnail: false }, }, }}

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
  }

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}
