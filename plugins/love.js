var handler = async (m, { conn, command, text }) => {
  // Verifica que se haya mencionado a alguien
  if (!m.mentionedJid || m.mentionedJid.length === 0) {
    return conn.reply(m.chat, '🚩 *Debes mencionar a alguien para hacer el ship*', m);
  }
  
  // Extrae el nombre del usuario que ejecuta el comando
  let name1 = m.pushName || conn.getName(m.sender);
  // Extrae el nombre de la primera persona mencionada
  let name2 = conn.getName(m.mentionedJid[0]);
  
  // Intenta obtener la foto de perfil del usuario que ejecuta el comando
  let pp1;
  try {
    pp1 = await conn.profilePictureUrl(m.sender, 'image');
  } catch (e) {
    pp1 = 'https://i.ibb.co/20qfy5s8/file.jpg'; // Imagen predeterminada
  }
  
  // Intenta obtener la foto de perfil de la persona mencionada
  let pp2;
  try {
    pp2 = await conn.profilePictureUrl(m.mentionedJid[0], 'image');
  } catch (e) {
    pp2 = 'https://i.ibb.co/20qfy5s8/file.jpg'; // Imagen predeterminada
  }
  
  // Genera un porcentaje aleatorio entre 0 y 99
  let percentage = Math.floor(Math.random() * 100);
  
  // Selecciona el texto según el comando: "love" para el comando love, o "amor" para ship
  let textForApi = (command.toLowerCase() === 'love') ? 'love' : 'amor';
  
  // Construye la URL de la API codificando los parámetros
  let apiUrl = `https://delirius-apiofc.vercel.app/canvas/ship?` +
    `image1=${encodeURIComponent(pp1)}` +
    `&name1=${encodeURIComponent(name1)}` +
    `&image2=${encodeURIComponent(pp2)}` +
    `&name2=${encodeURIComponent(name2)}` +
    `&percentage=${percentage}` +
    `&text=${encodeURIComponent(textForApi)}`;
  
  // Envía la imagen generada por la API al chat
  conn.sendFile(m.chat, apiUrl, 'ship.jpg', null, m);
}

handler.help = ['ship', 'love'];
handler.tags = ['fun'];
handler.command = ['ship', 'love'];
handler.register = true;

export default handler;
