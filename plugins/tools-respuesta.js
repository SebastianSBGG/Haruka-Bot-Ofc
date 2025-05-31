let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw m.reply(`*🥺 Ejemplo:*\n\n${usedPrefix + command} <id> <mensaje>\n\n*🥺 Uso:* ${usedPrefix + command} 1234 Gracias por tu confesión.`);
    
    let split = text.trim().split(/ (.+)/); 
    let id = split[0]; 
    let pesan = split[1]; 

    if (!id || !pesan) throw m.reply(`*🥺 Ejemplo:*\n\n${usedPrefix + command} <id> <mensaje>\n\n*🥺 Uso:* ${usedPrefix + command} 1234 Gracias por tu confesión.`);
    
    id = id.trim();
    pesan = pesan.trim();

    
    console.log("conn.menfess", conn.menfess); 
    
    if (!conn.menfess || !conn.menfess[id]) {
        throw m.reply(`*🥺 Error:* No se encontró ningún mensaje con el ID *${id}*.`);
    }
    
    let { dari, penerima } = conn.menfess[id];
    
    if (m.sender !== penerima) throw m.reply('🥺 No tienes permiso para responder a este mensaje.');
    
    let teks = `*Hola, recibiste una respuesta a tu mensaje anónimo.*\n\n*\`ID:\`* *${id}*\n*\`RESPUESTA:\`* \n\n${pesan}`.trim();
    
    try {
        
        let sentMessage = await conn.sendMessage(dari, {
            text: teks,
            contextInfo: {
                mentionedJid: [dari],
                externalAdReply: {
                    title: 'R E S P U E S T A - G E N E S I S',
                    body: '¡Gracias por usar el servicio de confesiones!',
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIyz1dMPkZuNleUyfXPMsltHwKKdVddTf4-A&usqp=CAU',
                    sourceUrl: 'https://whatsapp.com/channel/0029VavL0RX77qVMEGBNL23y'
                }
            }
        });
        
        if (sentMessage) {
           return conn.reply(m.chat, '*🥺 Respuesta enviada con éxito.*\n*IDENTIFICADOR:*' + ` *${id}*`, m, fake);
            
            
            conn.menfess[id].status = true;
        } else {
            throw new Error('No se pudo enviar el mensaje.');
        }
    } catch (e) {
        console.error(e);
        m.reply('ya lo emos enviado.');
    }
};

handler.tags = ['tools'];
handler.help = ['respuesta'].map(v => v + ' <id mensaje>');
handler.command = /^(respuesta|reply)$/i;
handler.register = true;
handler.private = true;

export default handler;
