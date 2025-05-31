import ws from 'ws'
let handler = async (m, { conn, usedPrefix, isRowner}) => {
let _uptime = process.uptime() * 1000;
let totalreg = Object.keys(global.db.data.users).length
let totalchats = Object.keys(global.db.data.chats).length

let uptime = clockString(_uptime);
let users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) 
const totalUsers = users.length;
let old = performance.now()
let neww = performance.now()
let speed = neww - old
const used = process.memoryUsage()
let info = ` ✦Información - ${botname} ⴵ\n`
info += `ⴵ  *◜Creador◞* ⇢ ${etiqueta}\n`
info += `ⴵ  *◜Prefijo◞* ⇢ [ ${usedPrefix} ]\n`
info += `ⴵ  *◜Versión◞* ⇢ ${vs}\n`
info += `ⴵ  *◜Chats Privados◞* ⇢ ${chats.length - groupsIn.length}\n`
info += `ⴵ  *◜Total De Chats◞* ⇢ ${chats.length}\n`
info += `ⴵ  *◜Usuarios◞* ⇢ ${totalreg}\n`
info += `ⴵ  *◜Grupos◞* ⇢ ${groupsIn.length}\n`
info += `ⴵ  *◜Actividad◞* ⇢ ${uptime}\n`
info += `ⴵ  *◜Velocidad◞* ⇢ ${(speed * 1000).toFixed(0) / 1000}\n`
info += `ⴵ  *◜Sub-Bots Activos◞* ⇢ ${totalUsers || '0'}`
await conn.sendFile(m.chat, avatar, 'estado.jpg', info, fkontak)
}
handler.help = ['estado']
handler.tags = ['info']
handler.command = ['estado', 'status', 'estate', 'state', 'stado', 'stats']
handler.register = true

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}
