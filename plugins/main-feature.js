import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who =
    m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let name = await conn.getName(who)

  // Fijo el monto a 1000
  let txt = `*乂  B O T  -  F E A T U R E*\n\n`
  txt += `◦  *Total* : 1000\n` // Mostramos 1000 como un valor fijo
  txt += author // Suponiendo que 'author' es una variable global que contiene un mensaje adicional.

  // Envía el mensaje con la solicitud de pago con el valor fijo de 1000
  await conn.relayMessage(
    m.chat,
    {
      requestPaymentMessage: {
        currencyCodeIso4217: 'USD',
        amount1000: 1000, // Fijo el valor a 1000
        requestFrom: '0@s.whatsapp.net',
        noteMessage: {
          extendedTextMessage: {
            text: txt,
            contextInfo: {
              mentionedJid: [m.sender],
              externalAdReply: {
                showAdAttribution: true,
              },
            },
          },
        },
      },
    },
    {}
  )
}

handler.help = ['totalfeature']
handler.tags = ['main']
handler.command = /^(presupuestobot)$/i
export default handler
