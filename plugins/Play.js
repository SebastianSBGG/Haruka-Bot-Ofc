import axios from "axios";
import yts from "yt-search";
import fetch from "node-fetch";

// Objeto para descarga de audio vía API vreden.web.id (reemplazando Oceansaver)
const ddownr = {
  download: async (url) => {
    const apiUrl = `https://api.vreden.web.id/api/ytplaymp3?query=${encodeURIComponent(url)}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.data?.result?.download?.url) {
        return response.data.result.download.url;
      }
      throw new Error("Fallo al obtener el audio.");
    } catch (error) {
      console.error("Error de API:", error);
      throw new Error("Error al contactar con la API.");
    }
  }
  // Eliminamos el método cekProgress ya que la nueva API devuelve la URL directamente
};

// Función para obtener miniatura de mejor calidad
async function obtenerMejorMiniatura(videoId) {
  // Intentar obtener la miniatura en alta resolución
  const opciones = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/default.jpg`
  ];
  
  for (const url of opciones) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return url;
    } catch {}
  }
  
  // Si ninguna funciona, usar la última opción
  return opciones[opciones.length - 1];
}

// Función auxiliar para obtener un buffer desde una URL
async function getBuffer(url) {
  try {
    let res = await fetch(url);
    let buf = await res.arrayBuffer();
    return Buffer.from(buf);
  } catch (error) {
    console.error("Error al obtener el buffer", error);
    throw new Error("Error al obtener el buffer");
  }
}

// Función auxiliar para formatear la fecha
function eYear(ago) {
  return ago || "Desconocido";
}

// Función para mostrar los detalles del video con mejor estética
function mostrarDetallesVideo(vid) {
  let txt = `┏━━*乂  Y O U T U B E - P L A Y*━━┓\n`;
  txt += `┃ ✩  *𝚃𝚒𝚝𝚞𝚕𝚘*: ${vid.title}\n`;
  txt += `┃ ✩  *𝙳𝚞𝚛𝚊𝚌𝚒𝚘𝚗*: ${vid.timestamp}\n`;
  txt += `┃ ✩  *𝚅𝚒𝚜𝚒𝚝𝚊𝚜*: ${vid.views}\n`;
  txt += `┃ ✩  *𝙰𝚞𝚝𝚘𝚛*: ${vid.author.name}\n`;
  txt += `┃ ✩  *𝙿𝚞𝚋𝚕𝚒𝚌𝚊𝚍𝚘*: ${eYear(vid.ago)}\n`;
  txt += `┃ ✩  *𝚄𝚛𝚕*: ${'https://youtu.be/' + vid.videoId}\n`;
  txt += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
  txt += `🎀 *Su ${vid.type === 'audio' ? 'audio' : 'video'} ↻ El audio se esta enviando espera un momento, soy lenta. . .*`;
  
  return txt;
}

// Handler unificado para audio y video
let handler = async (m, { conn, args, usedPrefix, command, text }) => {
  // Lista de formatos permitidos
  let lister = ["mp3", "yta", "audio", "mp4", "video", "ytv", "vídeo"];
  let [format, ...rest] = text.split(" ");
  let input = rest.join(" ");

  if (!lister.includes(format))
    return conn.reply(
      m.chat,
      `🎀 *Ingresa el formato deseado seguido de la búsqueda o URL.*

Ejemplos:
• ${usedPrefix + command} mp3 Enemy Tommoee Profitt
• ${usedPrefix + command} mp4 https://youtu.be/abc123`,
      m
    );

  // Rama para audio
  if (format === "mp3" || format === "yta" || format === "audio") {
    if (!input.trim())
      return conn.reply(m.chat, "🎀 Ingrese el nombre de una canción.", m);

    let search = await yts(input);
    if (!search.all.length)
      return m.reply("No se encontraron resultados.");
    let videoInfo = search.all[0];
    videoInfo.type = 'audio'; // Añadir tipo para el mensaje

    try {
      // Obtener la miniatura en la mejor calidad posible
      const thumbnailUrl = await obtenerMejorMiniatura(videoInfo.videoId);
      
      // Enviar la imagen con información detallada antes del audio
      const infoMensaje = mostrarDetallesVideo(videoInfo);
      
      // Mostrar mensaje de espera con la miniatura
      await conn.sendMessage(
        m.chat, 
        { 
          image: { url: thumbnailUrl },
          caption: infoMensaje
        }, 
        { quoted: m }
      );

      // Descargar y enviar el audio usando la nueva API
      const audioUrl = await ddownr.download(videoInfo.url);
      await conn.sendMessage(
        m.chat,
        { 
          audio: { url: audioUrl }, 
          mimetype: "audio/mpeg",
          fileName: `${videoInfo.title}.mp3`
        },
        { quoted: m }
      );
    } catch (error) {
      return m.reply(`⚠︎ Error: ${error.message}`);
    }
  }

  // Rama para video
  if (format === "mp4" || format === "video" || format === "ytv" || format === "vídeo") {
    if (!input.trim())
      return conn.reply(m.chat, "🎀 Ingrese el nombre o la URL del video.", m);

    let video;
    let videoUrl = input;

    // Si no es una URL de YouTube, se realiza búsqueda
    if (!videoUrl.includes("youtu")) {
      let search = await yts(videoUrl);
      if (!search.all.length)
        return m.reply("No se encontraron resultados.");
      video = search.all[0];
    } else {
      // Si es URL, se busca información del video para obtener más detalles
      let search = await yts(videoUrl);
      video = search.videos.find(v => v.url === videoUrl) || { url: videoUrl };
    }
    
    video.type = 'video'; // Añadir tipo para el mensaje
    
    try {
      // Obtener la miniatura en la mejor calidad posible
      const thumbnailUrl = await obtenerMejorMiniatura(video.videoId);
      
      // Enviar información detallada con la miniatura antes del video
      const infoMensaje = mostrarDetallesVideo(video);
      
      // Enviar imagen como thumbnail con el mensaje de información
      await conn.sendMessage(
        m.chat, 
        { 
          image: { url: thumbnailUrl },
          caption: infoMensaje
        }, 
        { quoted: m }
      );
      
      // Intentar descargar el video con múltiples opciones de API
      try {
        // Primera opción: api.siputzx.my.id
        let res = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(video.url)}`);
        let json = await res.json();
        if (json.data && json.data.dl) {
          await conn.sendFile(m.chat, json.data.dl, `${video.title}.mp4`, "", m);
          return;
        }
        throw new Error("No se obtuvo el video desde la primera opción.");
      } catch (e1) {
        try {
          // Segunda opción: axeel.my.id (fallback)
          const axeelUrl = `https://axeel.my.id/api/download/audio?url=${encodeURIComponent(video.url)}`;
          let axeelRes = await fetch(axeelUrl);
          let axeelData = await axeelRes.json();
          if (axeelData && axeelData.downloads?.url) {
            await conn.sendFile(m.chat, axeelData.downloads.url, `${video.title}.mp4`, "", m);
            return;
          }
          throw new Error();
        } catch (e2) {
          try {
            // Tercera opción: api.ryzendesu.vip
            const ryzenUrl = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;
            let ryzenRes = await fetch(ryzenUrl);
            let ryzenData = await ryzenRes.json();
            if (ryzenData.status === 'tunnel' && ryzenData.url) {
              await conn.sendFile(m.chat, ryzenData.url, `${video.title}.mp4`, "", m);
              return;
            }
            throw new Error();
          } catch (e3) {
            try {
              // Última opción: exonity.tech
              let d2 = await fetch(`https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${encodeURIComponent(video.url)}`);
              let dp = await d2.json();
              const videoBuffer = await getBuffer(dp.result.media.mp3);
              await conn.sendFile(m.chat, videoBuffer, `${video.title}.mp4`, "", m);
            } catch (e4) {
              console.error("Error al obtener el video:", e4);
              await conn.reply(
                m.chat,
                "❌ Ocurrió un error al descargar el video. Reporta el error con el comando #report",
                m
              );
            }
          }
        }
      }
    } catch (error) {
      return m.reply(`⚠︎ Error: ${error.message}`);
    }
  }
};

handler.help = ['play <formato> <búsqueda/URL>'];
handler.tags = ['descargas'];
handler.command = ['play', 'ytmp3', 'ytmp4']; // Puedes ajustar los triggers según prefieras
handler.limit = 1;
export default handler;