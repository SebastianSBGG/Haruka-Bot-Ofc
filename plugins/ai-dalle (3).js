// - OfcKing >> https://github.com/OfcKing

import axios from 'axios';

const handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await conn.reply(m.chat, `${emoji} Por favor, proporciona una descripción para generar la imagen.`, m);
        return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://api.siputzx.my.id/api/ai/flatai?prompt=${prompt}`;

    try {
        conn.reply(m.chat, `${emoji2} Espere un momento...`, m)

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        await conn.sendMessage(m.chat, { image: Buffer.from(response.data) }, { quoted: m });
    } catch (error) {
        console.error('Error al generar la imagen:', error);
        await conn.reply(m.chat, `${msm} No se pudo generar la imagen, intenta nuevamente mas tarde.`, m);
    }
};

handler.command = ['flatai'];
handler.help = ['dalle'];
handler.tags = ['tools'];

export default handler;