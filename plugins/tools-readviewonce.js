let handler = async (m, { conn }) => {
  // Obtiene el mensaje citado y su media
  const tipoMedia = m.quoted?.mediaMessage;

  // Si es una imagen
  if (tipoMedia?.imageMessage) {
    let mimetype = tipoMedia.imageMessage.mimetype;
    const caption = tipoMedia.imageMessage.caption || '';

    // Verifica el formato; si no es JPEG o PNG, envía como binario genérico
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      await m.reply('⚠️ Formato no válido. Enviando el archivo sin formato específico.');
      mimetype = 'application/octet-stream';
    }

    try {
      const buffer = await m.quoted.download();
      await conn.sendMessage(
        m.chat,
        { image: buffer, caption },
        { quoted: m }
      );
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      await m.reply('❌ Error al descargar la imagen. Por favor, intenta nuevamente.');
    }

  // Si es un video
  } else if (tipoMedia?.videoMessage) {
    let mimetype = tipoMedia.videoMessage.mimetype;
    const caption = tipoMedia.videoMessage.caption || '';

    // Verifica el formato; si no es MP4, envía como binario genérico
    if (mimetype !== 'video/mp4') {
      await m.reply('⚠️ Formato no válido. Enviando el archivo sin formato específico.');
      mimetype = 'application/octet-stream';
    }

    try {
      const buffer = await m.quoted.download();
      await conn.sendMessage(
        m.chat,
        { video: buffer, caption },
        { quoted: m }
      );
    } catch (error) {
      console.error('Error al descargar el video:', error);
      await m.reply('❌ Error al descargar el video. Por favor, intenta nuevamente.');
    }

  // Si no hay imagen ni video
  } else {
    await m.reply('⚠️ No se encontró ningún mensaje de imagen o video.');
  }
};

handler.help = ['readviewonce'];
handler.tags = ['tools'];
handler.command = /^(retrieve|ver|rvo)$/i;

export default handler;
