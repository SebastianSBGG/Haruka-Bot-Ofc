import fetch from 'node-fetch';
import axios from 'axios';

// API Key de Tenor (reemplázala con una válida)
const API_KEY = "AIzaSyCrewI96aHzanTNBC-QLml7PCVjQMlgUEc";

// Helper para obtener el buffer de un archivo desde una URL
const getBuffer = async (url) => {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(res.data);
    } catch (error) {
        throw new Error('Error al descargar el archivo: ' + error.message);
    }
};

// Función principal del comando
const handler = async (m, { conn, args }) => {
    if (!API_KEY || API_KEY === "TU_API_KEY_AQUI") {
        await conn.reply(m.chat, '⚠️ Error: Falta configurar una API Key válida de Tenor.', m);
        return;
    }

    if (!args[0]) {
        await conn.reply(m.chat, '⚠️ Por favor, proporciona una palabra clave para buscar un GIF.', m);
        return;
    }

    const search_term = encodeURIComponent(args.join(' '));
    const search_url = `https://tenor.googleapis.com/v2/search?q=${search_term}&key=${API_KEY}&client_key=whatsapp-bot&limit=1`;

    try {
        // Mensaje de espera
        await conn.reply(m.chat, '🔍 Buscando GIF, espere un momento...', m);

        // Llamada a la API de Tenor
        const response = await fetch(search_url);
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            await conn.reply(m.chat, '❌ No se encontraron GIFs para esa búsqueda.', m);
            return;
        }

        // Obtenemos el primer resultado
        const gif = data.results[0];
        const gifUrl = gif.media_formats.mp4.url; // URL del GIF en formato MP4

        // Diseño de respuesta sin incluir el enlace
        const caption = `ᯓᡣ𐭩 𝖡𝗎𝗌𝗊𝗎𝖾𝖽𝖺𝗌 𝖾𝗇 *𝖳𝖾𝗇𝗈𝗋*\n\n` +
                        `◇ 𝖳𝗂𝗍𝗎𝗅𝗈: *${gif.content_description || 'GIF'}*\n` +
                        `◇ 𝖢𝗋𝖾𝖺𝖼𝗂𝗈𝗇: *${gif.created || 'Desconocida'}*`;

        // Descargar el MP4 y enviarlo como video con reproducción en bucle
        const media = await getBuffer(gifUrl);
        await conn.sendMessage(m.chat, { 
            video: media, 
            caption, 
            gifPlayback: true,  // IMPORTANTE para que se reproduzca como GIF
            mimetype: 'video/mp4' // Asegura que WhatsApp lo detecte bien
        }, { quoted: m });

    } catch (error) {
        console.error('Error al buscar el GIF:', error);
        await conn.reply(m.chat, `❌ Error al buscar el GIF: ${error.message}`, m);
    }
};

handler.command = ['tenor'];
handler.help = ['tenor <texto>'];
handler.tags = ['fun'];

export default handler;
