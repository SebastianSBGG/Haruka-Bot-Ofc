import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

// Regex modificado para aceptar separador con punto o espacio
let Reg = /\|?\s*(.+?)\s*(?:[.\s])\s*(\d+)\s*$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let mentionedJid = [who]
  let pp = await conn.profilePictureUrl(who, 'image').catch((_) => 'https://i.ibb.co/hFX0Dty8/file.jpg')
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  
  if (user.registered === true)
    return m.reply(`『✦』Ya estás registrado.\n\n*¿Quiere volver a registrarse?*\n\nUse este comando para eliminar su registro.\n*${usedPrefix}unreg*`)
  
  // Verificamos el formato con la nueva expresión regular
  let match = text.match(Reg)
  if (!match)
    return m.reply(`『✦』Formato incorrecto.\n\nUso del comando: *${usedPrefix + command} nombre.edad* ó *${usedPrefix + command} nombre edad*\nEjemplo: *${usedPrefix + command} ${name2} 18*`)
    
  let [_, name, age] = match  // Se capturan dos grupos: nombre y edad
  
  if (!name) return m.reply(`『✦』El nombre no puede estar vacío.`)
  if (!age) return m.reply(`『✦』La edad no puede estar vacía.`)
  if (name.length >= 100) return m.reply(`『✦』El nombre es demasiado largo.`)
  
  age = parseInt(age)
  if (age > 1000) return m.reply(`『✦』Wow el abuelo quiere jugar al bot.`)
  if (age < 5) return m.reply(`『✦』hay un abuelo bebé jsjsj.`)
  
  user.name = name + '✓'.trim()
  user.age = age
  user.regTime = +new Date      
  user.registered = true
  
  // Ajustando las recompensas
  global.db.data.users[m.sender].coin += 40
  global.db.data.users[m.sender].exp += 300
  global.db.data.users[m.sender].joincount += 20
  
  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
  
  let regbot = `✦ 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗔 𝗗 𝗢 ✦\n`
  regbot += `•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•\n`
  regbot += `> ✎ Nombre » ${name}\n`
  regbot += `> ✎ Edad » ${age} años\n`
  regbot += `•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•\n`
  regbot += ` 𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:\n`
  regbot += `> •  *${moneda}* » 40\n`
  regbot += `> •  *Experiencia* » 300\n`
  regbot += `> •  *Tokens* » 20\n`
  regbot += `•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•\n`
  regbot += `> ${dev}`
  
  await m.react('📩')
  
  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '✧ Usuario Verificado ✧',
        body: textbot,
        thumbnailUrl: pp,
        sourceUrl: channel,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });    
}; 

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler
