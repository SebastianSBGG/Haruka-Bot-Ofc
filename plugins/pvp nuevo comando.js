let handler = async (m, { conn, text, participants, args }) => {
  // Verifica que se hayan mencionado dos usuarios
  if (!m.mentionedJid[1])
    return m.reply(`Etiqueta a dos personas para iniciar el combate.\nEjemplo: .pvp @usuario1 @usuario2`);

  let user1 = m.mentionedJid[0];
  let user2 = m.mentionedJid[1];

  // Obtiene los nombres de usuario o asigna un valor por defecto
  const nombres = {
    [user1]: (await conn.getName(user1)) || 'Jugador 1',
    [user2]: (await conn.getName(user2)) || 'Jugador 2',
  };

  // Definición de los atributos a evaluar
  const atributos = ["Fuerza", "Velocidad", "Inteligencia", "Belleza", "Suerte", "Carisma"];

  // Genera atributos aleatorios (1 a 100) para cada usuario
  const stats = {};
  for (let u of [user1, user2]) {
    stats[u] = {};
    atributos.forEach(attr => {
      stats[u][attr] = Math.floor(Math.random() * 100) + 1;
    });
  }

  // Suma el total de los atributos para cada usuario
  const total1 = Object.values(stats[user1]).reduce((a, b) => a + b, 0);
  const total2 = Object.values(stats[user2]).reduce((a, b) => a + b, 0);

  // Determina el ganador o establece empate (null)
  const ganador = total1 > total2 ? user1 : total2 > total1 ? user2 : null;

  // Construye el mensaje con diseño en bloque
  let texto = `╔══════════════════════════╗\n`;
  texto += `║       *MATCHMAKING*      ║\n`;
  texto += `══════════════════════════\n`;
  texto += `⚔️ @${user1.split("@")[0]} VS @${user2.split("@")[0]} ⚔️\n\n`;
  texto += `💥🔻 *CALCULANDO ATRIBUTOS...* 🔻💥\n`;

  // Muestra cada atributo y sus valores para ambos jugadores
  for (let attr of atributos) {
    texto += `\n*# ${attr}:*\n`;
    texto += `- @${user1.split("@")[0]}: ${stats[user1][attr]}\n`;
    texto += `- @${user2.split("@")[0]}: ${stats[user2][attr]}\n`;
  }

  // Muestra el puntaje total y el ganador o empate
  texto += `\n⚡ *PUNTAJE TOTAL* ⚡\n`;
  texto += `🏅 @${user1.split("@")[0]} = ${total1}\n`;
  texto += `🥶 @${user2.split("@")[0]} = ${total2}\n\n`;

  if (ganador) {
    texto += `🏆 *GANADOR: @${ganador.split("@")[0]}* 🎉🔥\n`;
  } else {
    texto += `⚖️ *EMPATE TOTAL* ⚖️\n`;
  }

  texto += `\n────────────────────────────\n`;
  texto += `¿QUIÉN SE ATREVE AL SIGUIENTE DESAFÍO?\n`;
  texto += `────────────────────────────\n`;
  texto += `*PD:* Quien diga que esto está comprando, ¡la mando a la xuxa!`;

  // Envía el mensaje con las menciones correspondientes
  conn.sendMessage(m.chat, { text: texto, mentions: [user1, user2] }, { quoted: m });
};

handler.help = ['pvp @user @user'];
handler.tags = ['juegos'];
handler.command = /^pvp$/i;

export default handler;
