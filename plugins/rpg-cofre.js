const handler = async (m, { isPrems, conn }) => {
  if (!global.db.data.users[m.sender]) {
    throw `${emoji4} Usuario no encontrado.`;
  }

  const lastCofreTime = global.db.data.users[m.sender].lastcofre;
  const timeToNextCofre = lastCofreTime + 10000; // 10 segundos

  if (Date.now() < timeToNextCofre) {
    const tiempoRestante = timeToNextCofre - Date.now();
    const mensajeEspera = `${emoji3} Ya reclamaste tu cofre\n⏰️ Regresa en: *${msToTime(tiempoRestante)}* para volver a reclamar.`;
    await conn.sendMessage(m.chat, { text: mensajeEspera }, { quoted: m });
    return;
  }

  const img = 'https://files.catbox.moe/zw21gt.jpg';
  const dia = Math.floor(Math.random() * 1000);
  const tok = Math.floor(Math.random() * 100);
  const ai = Math.floor(Math.random() * 400);
  const expp = Math.floor(Math.random() * 5000);

  global.db.data.users[m.sender].coin += dia;
  global.db.data.users[m.sender].diamonds += ai;
  global.db.data.users[m.sender].joincount += tok;
  global.db.data.users[m.sender].exp += expp;
  global.db.data.users[m.sender].lastcofre = Date.now();

  const texto = `
╭━〔 Cσϝɾҽ Aʅҽαƚσɾισ 〕⬣
┃📦 *Obtienes Un Cofre*
┃ ¡Felicidades!
╰━━━━━━━━━━━━⬣

╭━〔 Nυҽʋσʂ Rҽƈυɾʂσʂ 〕⬣
┃ *${dia} ${moneda}* 💸
┃ *${tok} Tokens* ⚜️
┃ *${ai} Diamantes* 💎
┃ *${expp} Exp* ✨
╰━━━━━━━━━━━━⬣`;

  try {
    await conn.sendFile(m.chat, img, 'yuki.jpg', texto, fkontak);
  } catch (error) {
    throw `${msm} Ocurrió un error al enviar el cofre.`;
  }
};

handler.help = ['cofre'];
handler.tags = ['rpg'];
handler.command = ['cofre'];
handler.level = 5;
handler.group = true;
handler.register = true;

export default handler;

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const milliseconds = parseInt((duration % 1000) / 100);

  return `${seconds} segundos`;
}
