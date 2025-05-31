const handler = async (m, { conn, command }) => {
  conn.koboy = conn.koboy || {};
  
  // Comando para cerrar partida forzosamente
  if (command === 'cerrarkoboy') {
    if (!conn.koboy[m.chat]) {
      return m.reply('⚠️ No hay ninguna partida de *Koboy* activa en este chat.');
    }
    
    // Comprobar si el usuario es quien inició el juego o es admin
    let isAdmin = m.isGroup ? (await conn.groupMetadata(m.chat)).participants.find(v => v.id === m.sender)?.admin : false;
    if (conn.koboy[m.chat].sender !== m.sender && !isAdmin) {
      return m.reply('⚠️ Solo quien inició la partida o un administrador puede cerrarla.');
    }
    
    delete conn.koboy[m.chat];
    return m.reply('🎮 La partida de *Koboy* ha sido cerrada correctamente.');
  }
  
  // Si ya hay una partida activa en este chat, no dejar iniciar otra
  if (conn.koboy[m.chat]) {
    return m.reply('⚠️ Ya hay una partida activa de *Koboy* en este chat! Usa *cerrarkoboy* para cerrarla si está estancada.');
  }

  let user = global.db.data.users[m.sender];
  // Verifica cooldown de 4 segundos por usuario
  if (user.lastKoboy && (new Date - user.lastKoboy) < 1000 * 4) {
    let tiempoRestante = Math.floor((1000 * 4 - (new Date - user.lastKoboy)) / 1000);
    return m.reply(`⏳ Espera *${tiempoRestante} segundos* para jugar *Koboy* de nuevo.`);
  }

  // Posiciones aleatorias, no pueden coincidir
  let playerPosition, criminalPosition;
  do {
    playerPosition = Math.floor(Math.random() * 6);
    criminalPosition = Math.floor(Math.random() * 6);
  } while (playerPosition === criminalPosition);

  let gameState = `🎯 *Juego Koboy: Atrapa al criminal!*

🏇 Tu posición:
${"・".repeat(playerPosition)}🤠${"・".repeat(5 - playerPosition)}
🚨 Posición del criminal:
${"・".repeat(criminalPosition)}🥷${"・".repeat(5 - criminalPosition)}

➡️ Responde *'kanan'* para moverte a la derecha.
⬅️ Responde *'kiri'* para moverte a la izquierda.

⚠️ Tienes *5 movimientos* para atrapar al criminal!`;

  // Envía el mensaje y guarda la clave (key)
  let msg = await conn.reply(m.chat, gameState, m);

  // Guarda el estado del juego
  conn.koboy[m.chat] = {
    playerPosition,
    criminalPosition,
    key: msg,
    oldkey: msg,
    earnedExp: 10000,
    earnedMoney: 1000000,
    sender: m.sender,
    moveCount: 0,
    maxMoves: 5,
    roomId: m.chat,
  };

  // Actualiza el tiempo del último juego del usuario
  user.lastKoboy = new Date * 1;
  global.db.data.users[m.sender] = user;
};

// Este before maneja las respuestas de los movimientos
handler.before = async (m, { conn }) => {
  conn.koboy = conn.koboy || {};
  if (!conn.koboy[m.chat]) return;

  let gameData = conn.koboy[m.chat];

  // Solo continúa si el mensaje es respuesta al mensaje del juego
  if (!m.quoted || m.quoted.id !== gameData.key.id) return;

  let texto = m.text.toLowerCase();

  if (!['kiri', 'kanan'].includes(texto)) {
    return m.reply('⚠️ Solo puedes responder con *kiri* o *kanan* para moverte.');
  }

  let { playerPosition, criminalPosition, moveCount, maxMoves, earnedExp, earnedMoney, sender, oldkey } = gameData;

  // Mueve el jugador según la respuesta
  if (texto === 'kiri') {
    if (playerPosition > 0) {
      playerPosition--;
      moveCount++;
    } else {
      return m.reply('🚫 Ya estás en el límite izquierdo!');
    }
  } else if (texto === 'kanan') {
    if (playerPosition < 5) {
      playerPosition++;
      moveCount++;
    } else {
      return m.reply('🚫 Ya estás en el límite derecho!');
    }
  }

  // Borra el mensaje anterior del estado del juego
  if (oldkey?.id && oldkey?.remoteJid) {
    await conn.sendMessage(m.chat, { delete: oldkey });
  }

  // Comprueba si atrapó al criminal
  if (playerPosition === criminalPosition) {
    let dineroGanado = randomMoney(earnedMoney, 1);
    let expGanada = randomMoney(earnedExp, 1);

    let user = global.db.data.users[sender];
    user.coin = (user.coin || 0) + dineroGanado; // Cambiado de money a coin
    user.exp = (user.exp || 0) + expGanada;
    global.db.data.users[sender] = user;

    delete conn.koboy[m.chat];
    return conn.reply(
      m.chat,
      `🎉 *¡Felicidades! Atrapaste al criminal!*\n\n` +
      `💸 *${moneda}*: ${dineroGanado}\n` +
      `✨ *Exp*: ${expGanada}`,
      m,
      { mentions: [sender] }
    );
  }

  // Si se acabaron los movimientos y no atrapó al criminal
  if (moveCount >= maxMoves) {
    delete conn.koboy[m.chat];
    return conn.reply(
      m.chat,
      `😔 *Perdiste!* El criminal escapó porque usaste todos tus movimientos.`,
      m,
      { mentions: [sender] }
    );
  }

  // Actualiza el estado del juego con las posiciones nuevas
  let nuevoEstado = `🎯 *Juego Koboy: Atrapa al criminal!*

🏇 Tu posición:
${"・".repeat(playerPosition)}🤠${"・".repeat(5 - playerPosition)}
🚨 Posición del criminal:
${"・".repeat(criminalPosition)}🥷${"・".repeat(5 - criminalPosition)}

➡️ Responde *'kanan'* para moverte a la derecha.
⬅️ Responde *'kiri'* para moverte a la izquierda.

⚠️ Movimientos restantes: *${maxMoves - moveCount}*`;

  let nuevoMsg = await conn.reply(m.chat, nuevoEstado, m);

  // Guarda la actualización
  conn.koboy[m.chat] = {
    ...gameData,
    playerPosition,
    moveCount,
    key: nuevoMsg,
    oldkey: nuevoMsg,
  };
};

handler.help = ['koboy', 'cerrarkoboy'];
handler.tags = ['rpg'];
handler.command = /^(koboy|cerrarkoboy)$/i;

export default handler;

function randomMoney(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}