let cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
let user = global.db.data.users[m.sender]
let tiempo = 5 * 60
if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
conn.reply(m.chat, `🚩 Espera ⏱️ *${tiempo2}* para volver a Trabajar.`, m, rcanal)
return
}
let rsl = Math.floor(Math.random() * 5000)
cooldowns[m.sender] = Date.now()
await conn.reply(m.chat, `🚩 ${pickRandom(trabajo)} *${toNum(rsl)}* ( *${rsl}* ) XP 😄.`, m, rcanal)
user.exp += rsl
}

handler.help = ['trabajar']
handler.tags = ['rpg']
handler.command = ['platita']
handler.register = true 
export default handler

function toNum(number) {
if (number >= 1000 && number < 1000000) {
return (number / 1000).toFixed(1) + 'k'
} else if (number >= 1000000) {
return (number / 1000000).toFixed(1) + 'M'
} else if (number <= -1000 && number > -1000000) {
return (number / 1000).toFixed(1) + 'k'
} else if (number <= -1000000) {
return (number / 1000000).toFixed(1) + 'M'
} else {
return number.toString()}}

function segundosAHMS(segundos) {
let minutos = Math.floor((segundos % 3600) / 60)
let segundosRestantes = segundos % 60
return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(list) {
return list[Math.floor(list.length * Math.random())];
}

// Thanks to FG98
const trabajo = [
   "𝐋𝐞 𝐑𝐨𝐛𝐚𝐬𝐭𝐞 𝐀𝐥 𝐉𝐞𝐟𝐞 𝐃𝐞𝐥𝐚 𝐌𝐚𝐟𝐢𝐚 𝐄𝐧 𝐔𝐧 1 𝐩𝐚 1 𝐘 𝐆𝐚𝐧𝐚𝐬𝐭𝐞",
   "𝐋𝐞 𝐂𝐡𝐮𝐩𝐚𝐬𝐭𝐞 𝐄𝐥 𝐏𝐞𝐧𝐞 𝐀𝐥 𝐀𝐝𝐦𝐢𝐧 𝐘 𝐆𝐚𝐧𝐚𝐬𝐭𝐞 𝐄𝐥 𝐒𝐢𝐝𝐚 𝐏𝐞𝐫𝐨 𝐆𝐚𝐧𝐚𝐬𝐭𝐞",
   "𝐋𝐞 𝐜𝐡𝐮𝐩𝐚𝐬𝐭𝐞 𝐥𝐚𝐬 𝐭𝐞𝐭𝐚𝐬 𝐚 𝐮𝐧𝐚 𝐩𝐮𝐭𝐚 ",
   "𝐟𝐨𝐥𝐥𝐚𝐬𝐭𝐞 𝐜𝐨𝐧 𝐮𝐧𝐚 𝐜𝐮𝐥𝐨𝐧𝐚 𝐭𝐞𝐭𝐨𝐧𝐚",
   "𝐌𝐚𝐭𝐚𝐬𝐭𝐞 𝐮𝐧 𝐡𝐚𝐢𝐭𝐢𝐚𝐧𝐨",
   "𝐌𝐚𝐭𝐚𝐬𝐭𝐞 𝐚 𝐩𝐮𝐭𝐢𝐧 𝐩𝐮𝐭𝐨 𝐢𝐧𝐝𝐢𝐠𝐞𝐧𝐚",
   "𝐅𝐨𝐥𝐥𝐚𝐬𝐭𝐞 𝐮𝐧𝐚 𝐩𝐞𝐫𝐮𝐧𝐚",
   "𝐍𝐞𝐠𝐫𝐚 𝐢𝐧𝐝𝐢𝐠𝐞𝐧𝐚 𝐪𝐮𝐢𝐞𝐫𝐞 𝐩𝐞𝐧𝐞 𝐚 𝐠𝐫𝐢𝐭𝐨𝐬 𝐲 𝐥𝐞 𝐝𝐢𝐬𝐭𝐞 𝐩𝐞𝐫𝐨 𝐭𝐞 𝐝𝐢𝐨 𝐜𝐚𝐧𝐜𝐞𝐫",
   "𝐑𝐨𝐛𝐚𝐬𝐭𝐞 𝐮𝐧 𝐨𝐬𝐨 𝐲 𝐞 𝐞𝐧𝐬𝐞𝐧̃𝐚𝐬𝐭𝐞 𝐚 𝐜𝐚𝐧𝐭𝐚𝐫",
   "𝐄𝐫𝐞𝐬 𝐞𝐥 𝐡𝐢𝐣𝐨 𝐝𝐞 𝐝𝐢𝐨𝐬 𝐝𝐞𝐥 𝐬𝐞𝐱𝐨 ",
   "𝐄𝐫𝐞𝐬 𝐚𝐜𝐭𝐨𝐫 𝐩𝐨𝐫𝐧𝐨",
   "𝐅𝐨𝐥𝐥𝐚𝐬𝐭𝐞 𝐮𝐧𝐚 𝐠𝐨𝐫𝐝𝐚 𝐭𝐞 𝐝𝐢𝐨 𝐠𝐨𝐧𝐨𝐫𝐞𝐚",
   "𝐝𝐞𝐬𝐚𝐫𝐨𝐥𝐥𝐚𝐬𝐭𝐞 𝐮𝐧 𝐣𝐮𝐞𝐠𝐨 𝐩𝐨𝐫𝐧𝐨",
   "𝐓𝐫𝐚𝐛𝐚𝐣𝐚𝐬𝐭𝐞 𝐜𝐨𝐦𝐨 𝐚𝐜𝐭𝐨𝐫 𝐩𝐨𝐫𝐧𝐨",
   "𝐭𝐞 𝐟𝐨𝐥𝐥𝐚𝐬𝐭𝐞 𝐚𝐥𝐚 𝐚𝐝𝐦𝐢𝐧 𝐦𝐮𝐣𝐞𝐫",
   "¡𝐦𝐞 𝐠𝐮𝐬𝐭𝐚𝐧 𝐥𝐚𝐬 𝐭𝐞𝐭𝐚𝐬 𝐭𝐨𝐦𝐚 𝐞𝐬𝐭𝐨!",
   "𝐝𝐢𝐨𝐬 𝐠𝐫𝐢𝐞𝐠𝐨",
   "𝐝𝐢𝐨𝐬 𝐝𝐞𝐥 𝐡𝐮𝐞𝐯𝐢𝐭𝐨 𝐫𝐞𝐲 𝐟𝐟 𝐰𝐚𝐬𝐚𝐚 𝐢𝐧𝐬𝐚𝐧𝐨",
   "𝐭𝐞 𝐡𝐢𝐜𝐢𝐬𝐭𝐞 𝐡𝐨𝐦𝐛𝐫𝐞 𝐲𝐚 𝐧𝐨 𝐞𝐫𝐞𝐬 𝐦𝐚𝐫𝐢𝐤𝐨𝐧",
   "𝐋𝐞 𝐦𝐚𝐦𝐚𝐬𝐭𝐞 𝐞𝐥 𝐩𝐞𝐧𝐞 𝐚𝐥 𝐛𝐨𝐭",
   "𝐓𝐫𝐚𝐛𝐚𝐣𝐚𝐬 𝐜𝐨𝐦𝐨 𝐩𝐮𝐭𝐚",
   "¡𝐓𝐞 𝐜𝐨𝐠𝐢𝐬𝐭𝐞 𝐮𝐧𝐚 𝐫𝐨𝐬𝐚𝐝𝐢𝐭𝐚",
   "𝐆𝐚𝐧𝐚𝐬𝐭𝐞 99 𝐂𝐦 𝐝𝐞 𝐭𝐮𝐥𝐚",
   "𝐓𝐞 𝐜𝐮𝐥𝐢𝐚𝐬𝐭𝐞 𝐮𝐧𝐚 𝐩𝐞𝐫𝐫𝐚 𝐝𝐞 𝐠𝐫𝐚𝐧𝐝𝐞𝐬 𝐭𝐞𝐭𝐚𝐬",
   "𝐐𝐮𝐞 𝐫𝐢𝐜𝐨 𝐜𝐨𝐠𝐞𝐬 𝐩𝐞𝐫𝐫𝐢𝐭𝐚",
   "𝐄𝐫𝐞𝐬 𝐩𝐨𝐥𝐢𝐜𝐢𝐚 𝐩𝐞𝐫𝐫𝐨 𝐭𝐞 𝐦𝐚𝐭𝐚𝐫𝐨𝐧",
   "𝐓𝐞 𝐟𝐨𝐥𝐥𝐚𝐬𝐭𝐞 𝐚𝐥𝐚 𝐧𝐚𝐥𝐠𝐨𝐧𝐚",
   "𝐄𝐥 𝐛𝐨𝐭 𝐭𝐞 𝐚𝐦𝐚 𝐦𝐮𝐜𝐡𝐨 𝐞𝐫𝐞𝐬 𝐡𝐞𝐫𝐦𝐨𝐬𝐨",
   "𝐭𝐨𝐦𝐚 𝐭𝐢𝐥𝐢𝐧 𝐞𝐫𝐞𝐬 𝐥𝐞𝐲𝐞𝐧𝐝𝐚",
   "𝐪𝐮𝐞 𝐛𝐮𝐞𝐧𝐚𝐬 𝐬𝐨𝐧 𝐥𝐚𝐬 𝐭𝐞𝐭𝐚𝐬",
   "𝐯𝐞𝐧𝐝𝐢𝐬𝐭𝐞 𝐜𝐨𝐧𝐝𝐨𝐧𝐞𝐬 𝐞𝐧 𝐥𝐨𝐬 𝐛𝐚𝐧̃𝐨𝐬",
   "𝐞𝐫𝐞𝐬 𝐞𝐥 𝐩𝐮𝐭𝐨 𝐣𝐞𝐟𝐞 𝐠𝐚𝐧𝐚𝐬𝐭𝐞 𝐦𝐮𝐜𝐡𝐨",
] 