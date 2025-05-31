import fs from 'fs/promises';
import path from 'path';
import { getBotName } from '../lib/getBotName.js';

let handler = async (m, { conn, participants, groupMetadata, args }) => {
  // Obtener nombre dinámico del bot
  const botName = await getBotName(conn);

  // Leer configuración de banners desde JSON
  const isSub = global.conn !== conn;
  const botJid = conn.user.jid;
  const botNumber = botJid.split('@')[0];
  const jsonPath = path.resolve('./src/database/db.json');
  let bannerURL;
  try {
    const data = await fs.readFile(jsonPath, 'utf-8');
    const jsonData = JSON.parse(data);
    if (isSub && jsonData.subBots?.[botNumber]) {
      bannerURL = jsonData.subBots[botNumber].imagen;
    } else if (jsonData.links?.imagen?.length) {
      bannerURL = jsonData.links.imagen[0];
    } else {
      bannerURL = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://files.catbox.moe/ysucs5.jpg');
    }
  } catch (err) {
    console.error('Error al leer JSON de banners:', err);
    bannerURL = await conn.profilePictureUrl(m.sender, 'image')
      .catch(() => 'https://files.catbox.moe/ysucs5.jpg');
  }

  if (!bannerURL) {
    return m.reply("❌ No hay banner configurado. Usa el comando setbanner para definir uno.");
  }

  // Preparar lista de admins
  const groupAdmins = participants.filter(p => p.admin || p.admin === 'superadmin');
  const listAdmin = groupAdmins
    .map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`)
    .join('\n') || 'No se encontraron administradores.';

  // Determinar owner
  const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id;

  // Construir mensaje
  const mensaje = args.join(' ');
  const infoLine = `*𝙼𝙴𝙽𝚂𝙰𝙹𝙴:* ${mensaje}`;
  const text = `*━「* 𝐈𝐍𝐕𝐎𝐂𝐀𝐍𝐃𝐎 𝐀𝐃𝐌𝐈𝐍𝐒 *」━*\n\n${infoLine}\n\n*𝙰𝙳𝙼𝙸𝙉𝚂:*\n${listAdmin}\n\n*[ ⚠️ ] 𝚄𝚂𝙰𝚁 𝙴𝚂𝚃𝙴 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚂𝙾𝙻𝙾 𝙲𝚄𝙰𝙽𝙳𝙾 𝚂𝙴 𝚃𝚁𝙰𝚃𝙴 𝙳𝙴 𝚄𝙽𝙰 𝙴𝙼𝙴𝚁𝙶𝙴𝙽𝙲𝙸𝙰!!*`;

  // Enviar banner con menciones
  await conn.sendFile(
    m.chat,
    bannerURL,
    'banner.jpg',
    text,
    m,
    false,
    { mentions: [...groupAdmins.map(v => v.id), owner] }
  );
};

handler.help = ['admins <texto>'];
handler.tags = ['group'];
handler.command = /^(admins|@admins|dmins)$/i;
handler.group = true;

export default handler;
