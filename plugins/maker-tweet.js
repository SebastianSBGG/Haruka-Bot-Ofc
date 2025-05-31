import fetch from 'node-fetch';

function formatearFecha() {
  const fecha = new Date(new Date().toLocaleString('es-ES', { timeZone: 'Asia/Jakarta' }));
  const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
  const horas = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  const ampm = horas >= 12 ? 'PM' : 'AM';
  const hora12 = horas % 12 || 12;
  const horaFormateada = `${hora12}:${minutos} ${ampm}`;
  return { horaFormateada, fechaFormateada };
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const input = args.join(' ').split(',');
  if (input.length < 3) {
    return m.reply(`⚠️ Uso incorrecto.\n\nEjemplo:\n${usedPrefix + command} maki,makibot,Este bot es el mejor`);
  }

  const nombre = input[0].trim();
  const usuario = input[1].trim();
  const contenido = input.slice(2).join(',').trim();

  const { horaFormateada, fechaFormateada } = formatearFecha();

  let urlFotoPerfil = 'https://files.catbox.moe/ifx2y7.png';
  try {
    urlFotoPerfil = await conn.profilePictureUrl(m.sender, 'image');
  } catch {}

  const urlImagen = `https://fastrestapis.fasturl.cloud/maker/tweet?content=${encodeURIComponent(contenido)}&ppUrl=${encodeURIComponent(urlFotoPerfil)}&name=${encodeURIComponent(nombre)}&username=${encodeURIComponent(usuario)}&verified=true&time=${encodeURIComponent(horaFormateada)}&date=${encodeURIComponent(fechaFormateada)}&retweets=1115&quotes=245&likes=5885&mode=dim`;

  try {
    await conn.sendMessage(m.chat, {
      image: { url: urlImagen },
      caption: `✅ *Tweet creado exitosamente*\n\n• *Nombre:* ${nombre}\n• *Usuario:* @${usuario}`,
      jpegThumbnail: await (await fetch(urlFotoPerfil)).buffer()
    }, { quoted: m });
  } catch (e) {
    console.error('[ERROR EN TWEET MAKER]', e);
    m.reply('❌ No se pudo crear el tweet. Intenta nuevamente más tarde.');
  }
};

handler.command = ['tweet'];
handler.tags = ['creador', 'maker'];
handler.help = ['tweet <nombre>,<usuario>,<texto>'];
handler.limit = true;

export default handler;
