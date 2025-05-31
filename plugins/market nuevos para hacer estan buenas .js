import axios from 'axios';

const handler = async (m, { conn, args, command }) => {
  const apis = {
    nokia: 'https://api.popcat.xyz/nokia?image=',
    comunismo: 'https://api.popcat.xyz/communism?image=',
    ad: 'https://api.popcat.xyz/ad?image=',
    shit: 'https://delirius-apiofc.vercel.app/canvas/shit?url=',
    trash: 'https://delirius-apiofc.vercel.app/canvas/trash?url=',
    xnxx: 'https://api.siputzx.my.id/api/canvas/xnxx?title='
  };

  if (!apis[command]) {
    return conn.reply(m.chat, '*[❌] Comando no válido.*', m);
  }

  // Determinar el usuario objetivo (mencionado, citado o quien envió el mensaje)
  let who = m.quoted 
    ? m.quoted.sender 
    : m.mentionedJid && m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.sender;

  let profilePic;
  try {
    profilePic = await conn.profilePictureUrl(who, 'image');
  } catch (e) {
    profilePic = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'; // Imagen por defecto si no tiene foto
  }

  let apiUrl;
  if (command === 'xnxx') {
    if (args.length < 1) {
      return conn.reply(m.chat, '*[⚠️] Uso correcto:* !xnxx <título>', m);
    }
    let titulo = encodeURIComponent(args.join(' '));
    apiUrl = `${apis.xnxx}${titulo}&image=${encodeURIComponent(profilePic)}`;
  } else {
    apiUrl = `${apis[command]}${encodeURIComponent(profilePic)}`;
  }

  await conn.reply(m.chat, '*[⏳] Generando imagen, por favor espere...*', m);

  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    await conn.sendFile(m.chat, buffer, `${command}.jpg`, '*[✅] Aquí está tu imagen!*', m);
  } catch (error) {
    console.error('Error al generar la imagen:', error);
    await conn.reply(m.chat, '*[❗] Error al generar la imagen, inténtelo más tarde.*', m);
  }
};

handler.command = /^(nokia|comunismo|ad|shit|trash|xnxx)$/i;
handler.tags = ['maker'];
handler.help = [
  'nokia', 'comunismo', 'ad', 'shit', 'trash', 
  'xnxx <título>'
];

export default handler;
