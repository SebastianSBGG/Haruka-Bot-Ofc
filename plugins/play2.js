import fetch from 'node-fetch'
import yts from "yt-search";

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `*Example:* ${usedPrefix + command} kunumi\n*O también:* ${usedPrefix + command} https://www.youtube.com/watch?v=Z28dtg_QmFw`;

  conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

  try {
    let ytUrl;
    let videoTitle;
    let thumbnailUrl;
    
    // Verificar si el texto es una URL de YouTube
    const isYouTubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(text);
    
    if (isYouTubeUrl) {
      // Si es una URL, usar directamente
      ytUrl = text;
      const videoIdMatch = ytUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
      videoTitle = "YouTube Audio";
    } else {
      // Si no es una URL, buscar en YouTube
      conn.sendMessage(m.chat, { react: { text: '🎵', key: m.key } });
      
      const searchResults = await yts(text);
      
      if (!searchResults.videos || searchResults.videos.length === 0) {
        throw 'No se encontraron resultados para tu búsqueda.';
      }
      
      // Tomar el primer resultado
      const firstVideo = searchResults.videos[0];
      ytUrl = firstVideo.url;
      videoTitle = firstVideo.title;
      thumbnailUrl = firstVideo.thumbnail;
      
      // Enviar información del video encontrado
      await conn.sendMessage(m.chat, {
        text: ` *𝙰𝚞𝚍𝚒𝚘:*\n *𝚃𝚒𝚝𝚞𝚕𝚘:* ${videoTitle}\n *𝚃𝚒𝚎𝚖𝚙𝚘:* ${firstVideo.duration.timestamp}\n *𝚅𝚒𝚜𝚝𝚊𝚜:* ${firstVideo.views}\n *𝙿𝚞𝚋𝚕𝚒𝚌𝚊𝚍𝚘:* ${firstVideo.ago}\n\n *𝙰𝚚𝚞𝚒 𝚅𝚊..*`
      }, { quoted: m });
    }

    conn.sendMessage(m.chat, { react: { text: '⬇️', key: m.key } });

    // Descargar el audio usando la API
    const res = await fetch(`https://fastrestapis.fasturl.cloud/downup/ytmp3?quality=128kbps&server=auto&url=${encodeURIComponent(ytUrl)}`);
    const data = await res.json();

    if (!data.result || !data.result.media) {
      throw 'Error al procesar el audio. Intenta con otro video.';
    }

    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    // Enviar el audio
    await conn.sendMessage(m.chat, {
      audio: { url: data.result.media },
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: data.result.title || videoTitle,
          body: "𝚂𝚎𝚋𝚊𝚜 𝚅𝚒𝚙",
          thumbnailUrl,
          sourceUrl: ytUrl,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    
    if (typeof error === 'string') {
      throw error;
    } else {
      throw 'Error al procesar tu solicitud. Verifica que el término de búsqueda o link sea válido e inténtalo de nuevo.';
    }
  }
};

handler.help = ['play2 <búsqueda/link>'];
handler.command = ['play2'];
handler.tags = ['downloader'];
handler.premium = false;

export default handler;