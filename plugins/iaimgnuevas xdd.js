import axios from 'axios';

const handler = async (m, { conn, args, command }) => {
    const emojiError   = '❌';
    const emojiLoading = '⏳';
    
    if (!args.length) {
        await conn.reply(m.chat, `${emojiError} Por favor, proporciona un texto para generar la imagen.`, m);
        return;
    }

    // Mapeo de comandos a sus APIs
    const apis = {
        stable:   'https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=',
        deepfake: 'https://api.nekorinn.my.id/ai-img/deepfake-nsfw?text=',
        geminimg:   'https://api.nekorinn.my.id/ai-img/gemini-image?text=',
        ghibli2:  'https://api.nekorinn.my.id/ai-img/text2ghibli-v2?text=',
        ghibli:   'https://api.nekorinn.my.id/ai-img/text2ghibli?text='
    };

    const baseUrl = apis[command];
    if (!baseUrl) {
        await conn.reply(m.chat, `${emojiError} Comando desconocido. Usa uno de: stable, deepfake, geminimg, ghibli, ghibli2.`, m);
        return;
    }

    const prompt = encodeURIComponent(args.join(' '));
    const url    = `${baseUrl}${prompt}`;

    try {
        await conn.reply(m.chat, `${emojiLoading} Generando imagen, por favor espera...`, m);
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        const img = Buffer.from(res.data, 'binary');

        await conn.sendMessage(m.chat, { image: img }, { quoted: m });
    } catch (err) {
        console.error('Error al generar la imagen:', err);
        await conn.reply(m.chat, `${emojiError} No se pudo generar la imagen. Intenta nuevamente más tarde.`, m);
    }
};

handler.command = ['stable', 'deepfake', 'geminimg', 'ghibli', 'ghibli2'];
handler.help    = [
  'stable <texto>',
  'deepfake <texto>',
  'geminimg <texto>',
  'ghibli2 <texto>',
  'ghibli <texto>'
];
handler.tags    = ['tools'];
handler.limit   = true; // opcional: si usas un sistema de límites por comando

export default handler;
