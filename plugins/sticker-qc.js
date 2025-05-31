import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let text

    // Obtener el texto ya sea de los argumentos o del mensaje citado
    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw "¿Dónde está el texto?"; // Mensaje en español para cuando no hay texto
    }

    if (!text) return m.reply('¿Dónde está el texto?');

    // Obtener el JID del usuario mencionado o del que envió el mensaje
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

    // Expresión regular para eliminar la mención del texto
    const mentionRegex = new RegExp(`@${who.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');

    // Texto sin la mención
    const orang = text.replace(mentionRegex, '');

    // Obtener la foto de perfil del usuario
    const pp = await conn.profilePictureUrl(who).catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');

    // Obtener el nombre del usuario
    const number = await conn.getName(who);

    // Objeto con los datos para la API que genera la imagen tipo "quote"
    const obj = {
        type: "quote",
        format: "png",
        backgroundColor: "#000000",
        width: 1024,
        height: 1024,
        scale: 2,
        messages: [{
            entities: [],
            avatar: true,
            from: {
                id: 1,
                name: `${who?.name || number}`,
                photo: { url: `${pp}` }
            },
            text: orang,
            replyMessage: {}
        }]
    };

    // Llamada POST a la API que genera la imagen
    const json = await axios.post('https://bot.lyo.su/quote/generate', obj, {
        headers: { 'Content-Type': 'application/json' }
    });

    // Convertir la imagen en base64 a buffer
    const buffer = Buffer.from(json.data.result.image, 'base64');

    // Crear sticker a partir del buffer
    let stiker = await sticker(buffer, false, global.stickpack, global.stickauth);

    // Enviar el sticker al chat
    if (stiker) return conn.sendFile(m.chat, stiker, 'qc.webp', '', m);
}

handler.help = ['qc <texto>']
handler.tags = ['sticker']
handler.command = /^(qc)$/i
handler.register = true

export default handler;
