import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn }) => {
  // 1) Determinar userId
  let userId = m.quoted?.sender
    ? m.quoted.sender
    : (m.mentionedJid?.[0] || m.sender);

  // 2) Cargar datos de la DB
  let user = global.db.data.users[userId] || {};

  // 3) Perfil pic
  let perfil = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://i.ibb.co/hFX0Dty8/file.jpg');

  // 4) Datos básicos
  let description = user.description || '𝚂𝙸𝙽 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝙲𝙸𝙾𝙽';
  let cumpleanos = user.birth || null;

  // ─── CÁLCULO EDAD ──────────────────────────────────────────────────────────
  let age = '𝙳𝙴𝚂𝙲𝙾𝙽𝙾𝙲𝙸𝙳𝙾';
  
  // MODIFICACIÓN AQUÍ: Primero intenta leer de user.age (comando reg)
  if (user.age) {
    age = user.age;
  } 
  // Si no existe user.age, intenta calcularlo desde la fecha de nacimiento
  else if (cumpleanos) {
    age = moment().diff(moment(cumpleanos, 'YYYY-MM-DD'), 'years');
  }
  // ─────────────────────────────────────────────────────────────────────────

  // ─── PAÍS ─────────────────────────────────────────────────────────────────
  const telefono = userId.split('@')[0];
  let pais = '𝙽𝙾 𝙸𝙳𝙴𝙽𝚃𝙸𝙵𝙸𝙲𝙰𝙳𝙾';
  try {
    const pn = new PhoneNumber('+' + telefono);
    const code = pn.getRegionCode();
    const countryNames = {
      US: '𝙴𝚂𝚃𝙰𝙳𝙾𝚂 𝚄𝙽𝙸𝙳𝙾𝚂', MX: '𝙼𝙴𝚇𝙸𝙲𝙾', ES: '𝙴𝚂𝙿𝙰𝙽̃𝙰',
      CO: '𝙲𝙾𝙻𝙾𝙼𝙱𝙸𝙰', AR: '𝙰𝚁𝙶𝙴𝙽𝚃𝙸𝙽𝙰', PE: '𝙿𝙴𝚁𝚄',
      CL: '𝙲𝙷𝙸𝙻𝙴', EC: '𝙴𝙲𝚄𝙰𝙳𝙾𝚁', VE: '𝚅𝙴𝙽𝙴𝚉𝚄𝙴𝙻𝙰',
      BO: '𝙱𝙾𝙻𝙸𝚅𝙸𝙰', PY: '𝙿𝙰𝚁𝙰𝙶𝚄𝙰𝚈', UY: '𝚄𝚁𝚄𝙶𝚄𝙰𝚈',
      BR: '𝙱𝚁𝙰𝚂𝙸𝙻', CR: '𝙲𝙾𝚂𝚃𝙰 𝚁𝙸𝙲𝙰', CU: '𝙲𝚄𝙱𝙰',
      DO: '𝚁𝙴𝙿𝚄𝙱𝙻𝙸𝙲𝙰 𝙳𝙾𝙼𝙸𝙽𝙸𝙲𝙰𝙽𝙰', SV: '𝙴𝙻 𝚂𝙰𝙻𝚅𝙰𝙳𝙾𝚁',
      GT: '𝙶𝚄𝙰𝚃𝙴𝙼𝙰𝙻𝙰', HN: '𝙷𝙾𝙽𝙳𝚄𝚁𝙰𝚂', NI: '𝙽𝙸𝙲𝙰𝚁𝙰𝙶𝚄𝙰',
      PA: '𝙿𝙰𝙽𝙰𝙼𝙰', PR: '𝙿𝚄𝙴𝚁𝚃𝙾 𝚁𝙸𝙲𝙾'
    };
    if (code) pais = countryNames[code] || code;
  } catch (e) {
    // deja pais = 'No identificado'
  }
  // ─────────────────────────────────────────────────────────────────────────

  // ─── DÍA DE LA SEMANA ────────────────────────────────────────────────────
  const dias = ['𝙳𝙾𝙼𝙸𝙽𝙶𝙾','𝙻𝚄𝙽𝙴𝚂','𝙼𝙰𝚁𝚃𝙴𝚂','𝙼𝙸𝙴𝚁𝙲𝙾𝙻𝙴𝚂','𝙹𝚄𝙴𝚅𝙴𝚂','𝚅𝙸𝙴𝚁𝙽𝙴𝚂','𝚂𝙰𝙱𝙰𝙳𝙾'];
  const diaSemana = dias[new Date().getDay()];
  // ─────────────────────────────────────────────────────────────────────────

  // Resto de stats
  let genero    = user.genre      || '𝙽𝙾 𝙴𝚂𝙿𝙴𝙲𝙸𝙵𝙸𝙲𝙰𝙳𝙾';
  let pareja    = user.marry      || '𝙽𝙰𝙳𝙸𝙴';
  let exp       = user.exp        || 0;
  let nivel     = user.level      || 0;
  let role      = user.role       || '𝚂𝙸𝙽 𝚁𝙰𝙽𝙶𝙾';
  let coins     = user.coin       || 0;
  let bankCoins = user.bank       || 0;
  let premium   = user.premium    ? '✅' : '❌';

  // 5) Montar texto
  let profileText = `
「❖」 *𝙿𝙴𝚁𝙵𝙸𝙻* ◢@${userId.split('@')[0]}◤
${description}

❖ *𝙿𝙰𝙸𝚂* » ${pais}

❖ *𝙲𝙾𝙸𝙽𝚂 𝙴𝙽 𝙲𝙰𝚁𝚃𝙴𝚁𝙰* » ${coins.toLocaleString()} ${global.moneda}
❖ *𝙲𝙾𝙸𝙽𝚂 𝙱𝙰𝙽𝙲𝙾* » ${bankCoins.toLocaleString()} ${global.moneda}

❖ 𝙴𝙳𝙰𝙳 » ${age}
❖ *𝙲𝚄𝙼𝙿𝙻𝙴𝙰𝙽̃𝙾𝚂* » ${cumpleanos || '𝙽𝙾 𝙴𝚂𝙿𝙴𝙲𝙸𝙵𝙸𝙲𝙰𝙳𝙾'}
❖ *𝙶𝙴𝙽𝙴𝚁𝙾* » ${genero}
❖ *𝙲𝙰𝚂𝙰𝙳𝙾 𝙲𝙾𝙽* » ${pareja}

❖ *𝙽𝙸𝚅𝙴𝙻* » ${nivel}
❖ *𝙳𝙸𝙰* » ${diaSemana}

❖ *𝙴𝚇𝙿* » ${exp.toLocaleString()}
❖ 𝚁𝙰𝙽𝙶𝙾 » ${role}
❖ *Premium* » ${premium}
  `.trim();

  // 6) Envío
  await conn.sendMessage(m.chat, {
    text: profileText,
    contextInfo: {
      mentionedJid: [userId],
      externalAdReply: {
        title: '✧ Perfil de Usuario ✧',
        body: dev,                   // asegúrate de que `dev` está definido
        thumbnailUrl: perfil,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
};

handler.help = ['profile'];
handler.tags = ['rg'];
handler.command = ['profile','perfil'];

export default handler;