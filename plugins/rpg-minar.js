let cooldowns = {}

let handler = async (m, { conn }) => {
let user = global.db.data.users[m.sender];
if (!user) return;

let coin = pickRandom([2000, 5000, 8000, 10000, 15000, 20000, 30000, 50000]);
let emerald = pickRandom([2000, 3000, 4000, 5000, 6000, 8000, 10000]);
let iron = pickRandom([2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000]);
let gold = pickRandom([2000, 3000, 4000, 5000, 7000, 8000, 10000]);
let coal = pickRandom([2000, 3000, 4000, 5000, 6000, 7000, 9000, 12000, 15000]);
let stone = pickRandom([2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000]);

let img = 'https://files.catbox.moe/mculzd.jpg';
let time = user.lastmiming + 600000;

if (new Date() - user.lastmiming < 600000) {
return conn.reply(m.chat, `${emoji3} Debes esperar ${msToTime(time - new Date())} para volver a minar.`, m);
}

let hasil = Math.floor(Math.random() * 1000);
let info = `⛏️ *Te has adentrando en lo profundo de las cuevas*\n\n` +
`> *🍬 Obtuviste estos recursos*\n\n` +
`✨ *Exp*: ${hasil}\n` +
`💸 *${moneda}*: ${coin}\n` +
`♦️ *Esmeralda*: ${emerald}\n` +
`🔩 *Hierro*: ${iron}\n` +
`🏅 *Oro*: ${gold}\n` +
`🕋 *Carbón*: ${coal}\n` +
`🪨 *Piedra*: ${stone}`;

await conn.sendFile(m.chat, img, 'yuki.jpg', info, fkontak);
await m.react('⛏️');

user.health -= 50;
user.pickaxedurability -= 30;
user.coin += coin;
user.iron += iron;
user.gold += gold;
user.emerald += emerald;
user.coal += coal;
user.stone += stone;
user.lastmiming = new Date() * 1;
}

handler.help = ['minar'];
handler.tags = ['economy'];
handler.command = ['minar', 'miming', 'mine'];
handler.register = true;
handler.group = true;

export default handler;

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

hours = (hours < 10) ? '0' + hours : hours;
minutes = (minutes < 10) ? '0' + minutes : minutes;
seconds = (seconds < 10) ? '0' + seconds : seconds;

return minutes + ' m y ' + seconds + ' s ';
}
