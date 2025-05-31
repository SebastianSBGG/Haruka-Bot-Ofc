import fetch from 'node-fetch';

const mensajesProcesados = new Set();

const handler = async (m, { conn, text }) => {
  // Evita procesar el mismo mensaje más de una vez
  if (mensajesProcesados.has(m.key.id)) return;
  mensajesProcesados.add(m.key.id);

  // Verifica que exista texto y sea un enlace válido de GitHub
  if (!text || !/^https:\/\/github\.com\//i.test(text)) {
    return m.reply(
      '⚠️ Por favor ingresa un enlace válido de GitHub.\n' +
      'Ejemplo: .gitclone https://github.com/usuario/repositorio'
    );
  }

  try {
    // Llamada a la API para clonar el repositorio
    const apiUrl = `https://api.nekorinn.my.id/downloader/github-clone?url=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.result?.downloadUrl?.zip) {
      return m.reply('❌ No se pudo obtener información del repositorio.');
    }

    const { metadata, downloadUrl } = json.result;
    const nombreArchivo = `${metadata.name || 'repo'}.zip`;

    // Construye la descripción
    const caption = 
      `📦 *GitHub Clone*\n\n` +
      `📁 *Nombre:* ${metadata.fullName}\n` +
      `📝 *Descripción:* ${metadata.description || '-'}\n` +
      `⭐ *Stars:* ${metadata.stars}   🍴 *Forks:* ${metadata.forks}\n` +
      `📅 *Creado:* ${metadata.createdAt}\n` +
      `🔄 *Última actualización:* ${metadata.updatedAt}\n` +
      `🔗 *Repositorio:* ${metadata.repoUrl}`;

    // Envía el ZIP del repositorio
    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl.zip },
        fileName: nombreArchivo,
        mimetype: 'application/zip',
        caption
      },
      { quoted: m }
    );

  } catch (error) {
    console.error(error);
    m.reply('❌ Ha ocurrido un error al procesar tu solicitud.');
  }
};

handler.help = ['gitclone <enlace GitHub>'];
handler.tags = ['downloader'];
handler.command = /^gitclone2$/i;

export default handler;
