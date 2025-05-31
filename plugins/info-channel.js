let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply("⚠️ *Formato incorrecto!*\n\nUsa: `.cinfo <link_channel>`");

  let match = args[0].match(/whatsapp\.com\/channel\/([\w-]+)/);
  if (!match) return m.reply("❌ *Enlace no válido!*\nAsegúrate de pegar un enlace de canal de WhatsApp válido.");

  let inviteId = match[1];

  try {
    let metadata = await conn.newsletterMetadata("invite", inviteId);
    if (!metadata || !metadata.id) return m.reply("❌ *No se pudo obtener la información del canal.*\nVerifica el enlace o intenta más tarde.");

    let caption = `┏━━━〔 *INFORMACIÓN DEL CANAL* 〕━━━┓\n\n` +
                  `🔑 *ID:* ${metadata.id}\n` +
                  `📌 *Nombre:* ${metadata.name}\n` +
                  `👥 *Seguidores:* ${metadata.subscribers?.toLocaleString() || "Desconocido"}\n` +
                  `📅 *Creado el:* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString("es-ES") : "Desconocido"}\n\n` +
                  `📝 *Descripción:* ${metadata.description || "Sin descripción disponible."}`;

    if (metadata.preview) {
      await conn.sendMessage(m.chat, {
        image: { url: "https://pps.whatsapp.net" + metadata.preview },
        caption
      }, { quoted: m });
    } else {
      await m.reply(caption);
    }

  } catch (error) {
    console.error("Error al obtener datos del canal:", error);
    m.reply("⚠️ *Ocurrió un error al procesar el enlace. Intenta nuevamente.*");
  }
};

handler.help = ["cinfo <link_channel>"];
handler.tags = ["info"];
handler.command = ["cinfo", "channelinfo", "ci"];
handler.limit = false;

export default handler;
