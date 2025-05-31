import axios from 'axios';

const handler = async (m, { conn, args, command }) => {
  let target = m.quoted 
    ? m.quoted.sender 
    : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender);

  let profilePic;
  try {
    profilePic = await conn.profilePictureUrl(target, 'image');
  } catch (e) {
    profilePic = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
  }

  let senderPic;
  try {
    senderPic = await conn.profilePictureUrl(m.sender, 'image');
  } catch (e) {
    senderPic = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
  }

  let apiUrl = '';

  switch (command.toLowerCase()) {
    case 'patrick':
      apiUrl = `https://delirius-apiofc.vercel.app/canvas/patrick?url=${encodeURIComponent(profilePic)}`;
      break;
    case 'borrar3':
      apiUrl = `https://delirius-apiofc.vercel.app/canvas/delete?url=${encodeURIComponent(profilePic)}`;
      break;
    case 'xnxxcard':
      if (args.length < 1) {
        return conn.reply(m.chat, '*[⚠️] Uso correcto:* !xnxxcard <title>', m);
      }
      {
        const xnxxTitle = encodeURIComponent(args.join(' '));
        apiUrl = `https://delirius-apiofc.vercel.app/canvas/xnxxcard?image=${encodeURIComponent(profilePic)}&title=${xnxxTitle}`;
      }
      break;
    case 'phub':
      if (args.length < 2) {
        return conn.reply(m.chat, '*[⚠️] Uso correcto:* !phub <username> <text>', m);
      }
      {
        const phubUsername = encodeURIComponent(args[0]);
        const phubText = encodeURIComponent(args.slice(1).join(' '));
        apiUrl = `https://delirius-apiofc.vercel.app/canvas/phub?image=${encodeURIComponent(profilePic)}&username=${phubUsername}&text=${phubText}`;
      }
      break;
    case 'bofetada':
      apiUrl = `https://delirius-apiofc.vercel.app/canvas/bofetada?url1=${encodeURIComponent(senderPic)}&url2=${encodeURIComponent(profilePic)}`;
      break;
    case 'invert':
      apiUrl = `https://delirius-apiofc.vercel.app/canvas/invert?url=${encodeURIComponent(profilePic)}`;
      break;
    case 'hitler':
      apiUrl = `https://delirius-apiofc.vercel.app/canvas/hitler?url=${encodeURIComponent(profilePic)}`;
      break;
    case 'affect':
      apiUrl = `https://delirius-apiofc.vercel.app/canvas/affect?url=${encodeURIComponent(profilePic)}`;
      break;
    case 'bed':
      apiUrl = `https://delirius-apiofc.vercel.app/canvas/bed?url1=${encodeURIComponent(senderPic)}&url2=${encodeURIComponent(profilePic)}`;
      break;
    default:
      return conn.reply(m.chat, '*[❌] Comando no válido.*', m);
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

handler.command = /^(patrick|borrar3|xnxxcard|phub|bofetada|invert|hitler|affect|bed)$/i;
handler.tags = ['maker'];
handler.help = [
  'patrick',
  'borrar3',
  'xnxxcard <title>',
  'phub <username> <text>',
  'bofetada',
  'invert',
  'hitler',
  'affect',
  'bed'
];

export default handler;
