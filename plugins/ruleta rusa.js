let partidas = {};

// Definir la variable moneda 
const moneda = 'Coin'; // Puedes cambiar esto al nombre de tu moneda en el bot

// Handler principal para comandos con prefijo
const handler = async (m, { conn, text, command, args, usedPrefix }) => {
  const chatId = m.chat;
  
  // Verificar que sea un grupo
  if (!m.isGroup) return m.reply("❌ *Este comando solo funciona en grupos.*");

  // Asegurarse de que los usuarios estén en la base de datos
  let user1 = global.db.data.users[m.sender];
  if (!user1) global.db.data.users[m.sender] = {};
  
  switch (command) {
    case 'ruletarusa':
      // Verificar si hay una mención para retar
      if (!m.mentionedJid || m.mentionedJid.length === 0) {
        return m.reply(`🎮 *𝚁𝚄𝙻𝙴𝚃𝙰 𝚁𝚄𝚂𝙰 - 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂:*
• ${usedPrefix}𝚁𝚄𝙻𝙴𝚃𝙰𝚁𝚄𝚂𝙰 @𝚄𝚂𝚄𝙰𝚁𝙸𝙾 - 𝙿𝙰𝚁𝙰 𝙸𝙽𝙸𝙲𝙸𝙰𝚁
• 𝙰𝙲𝙴𝙿𝚃𝙰𝚁 - 𝙿𝙰𝚁𝙰 𝙰𝙲𝙴𝙿𝚃𝙰𝚁
• 𝙳𝙸𝚂𝙿𝙰𝚁𝙰𝚁 - 𝙴𝚂𝙲𝚁𝙸𝙱𝙴 𝙳𝙸𝚂𝙿𝙰𝚁𝙰𝚁 𝚈 𝙶𝙰𝙽𝙰`);
      }
      
      // Si ya existe una partida en el grupo
      if (partidas[chatId]) {
        return m.reply("⚠️ *𝚈𝙰 𝙷𝙰𝚈 𝚄𝙽𝙰 𝙿𝙰𝚁𝚃𝙸𝙳𝙰 𝙿𝙽𝙳𝙹.*");
      }
      
      // Crear nueva partida
      let user = m.mentionedJid[0];
      
      // Asegurarse de que el usuario retado esté en la base de datos
      if (!global.db.data.users[user]) global.db.data.users[user] = {};
      
      // Moneda inicial para ambos jugadores
      const monedaInicial = Math.floor(Math.random() * 10000) + 1000;
      
      partidas[chatId] = {
        jugadores: [m.sender, user],
        turno: 0,
        disparos: 0,
        activo: false,
        monedas: {
          [m.sender]: monedaInicial,
          [user]: monedaInicial
        }
      };
      
      return m.reply(`🎯 *¡𝙸𝙽𝙸𝙲𝙸𝙾 𝙻𝙰 𝚁𝚄𝙻𝙴𝚃𝙰!*  
👤 *${m.sender.split("@")[0]}* 𝙷𝙰𝚂 𝚁𝙴𝚃𝙰𝙳𝙾 𝙰 *${user.split("@")[0]}*  
💰 *𝙼𝙾𝙽𝙴𝙳𝙰𝚂 𝙸𝙽𝙸𝙲𝙸𝙰𝙻𝙴𝚂:* ${monedaInicial}
👄 *${user.split("@")[0]}*, 𝙴𝚂𝙲𝚁𝙸𝙱𝙴 \`𝙰𝙲𝙴𝙿𝚃𝙰𝚁\` 𝙿𝙰𝚁𝙰 𝙸𝙽𝙸𝙲𝙸𝙰𝚁.`);
      
    case 'aceptar':
      return procesarAceptar(m, usedPrefix, chatId);
      
    case 'disparar':
      return procesarDisparar(m, usedPrefix, chatId);
      
    default:
      return m.reply(`🎮 *𝚁𝚄𝙻𝙴𝚃𝙰 𝚁𝚄𝚂𝙰 - 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂:*
• ${usedPrefix}𝚁𝚄𝙻𝙴𝚃𝙰𝚁𝚄𝚂𝙰 @𝚄𝚂𝚄𝙰𝚁𝙸𝙾 - 𝙿𝙰𝚁𝙰 𝙸𝙽𝙸𝙲𝙸𝙰𝚁
• 𝙰𝙲𝙴𝙿𝚃𝙰𝚁 - 𝙿𝙰𝚁𝙰 𝙰𝙲𝙴𝙿𝚃𝙰𝚁
• 𝙳𝙸𝚂𝙿𝙰𝚁𝙰𝚁 - 𝙴𝚂𝙲𝚁𝙸𝙱𝙴 𝙳𝙸𝚂𝙿𝙰𝚁𝙰𝚁 𝚈 𝙶𝙰𝙽𝙰`);
  }
};

// Handler para mensajes sin prefijo
handler.all = async function (m, { conn }) {
  if (!m.isGroup) return;
  if (!m.text) return;
  
  const chatId = m.chat;
  const mensaje = m.text.trim();
  
  // Verificar si el mensaje es "aceptar" o "Aceptar"
  if (mensaje.toLowerCase() === "aceptar") {
    return procesarAceptar(m, "", chatId);
  }
  
  // Verificar si el mensaje es "disparar" o "Disparar"
  if (mensaje.toLowerCase() === "disparar") {
    return procesarDisparar(m, "", chatId);
  }
};

// Función para procesar el comando aceptar
function procesarAceptar(m, usedPrefix, chatId) {
  // Verificar si hay partida
  if (!partidas[chatId]) {
    return m.reply(`⚠️ *𝙽𝙾 𝙷𝙰𝚈 𝙿𝙰𝚁𝚃𝙸𝙳𝙰.*
𝙿𝙰𝚁𝙰 𝙸𝙽𝙸𝙲𝙸𝙰𝚁 𝚄𝚂𝙰: ${usedPrefix}𝚁𝚄𝙻𝙴𝚃𝙰𝚁𝚄𝚂𝙰 @usuario`);
  }
  
  // Verificar si ya está activa
  if (partidas[chatId].activo) {
    return m.reply("⚠️ *𝚈𝙰 𝙷𝙰𝚈 𝚄𝙽𝙰 𝙴𝙽 𝙲𝚄𝚁𝚂𝙾.*");
  }
  
  // Verificar que sea el jugador retado
  if (m.sender !== partidas[chatId].jugadores[1]) {
    return m.reply("⚠️ *𝚂𝙾𝙻𝙾 𝙴𝙻 𝙹𝚄𝙶𝙰𝙳𝙾𝚁 𝚁𝙴𝚃𝙰𝙳𝙾 𝙵𝚄𝙽𝙲𝙸𝙾𝙽𝙰.*");
  }
  
  // Activar la partida
  partidas[chatId].activo = true;
  return m.reply(`👄 *¡𝙲𝙾𝙼𝙴𝙽𝚉𝙾 𝙻𝙰 𝚁𝚄𝙻𝙴𝚃𝙰!*  
🎲 *${partidas[chatId].jugadores[0].split("@")[0]}* 𝚃𝙸𝙴𝙽𝙴 𝙴𝙻 𝙿𝚁𝙸𝙼𝙴𝚁 𝚃𝚄𝚁𝙽𝙾.  
💰 *𝙼𝙾𝙽𝙴𝙳𝙰𝚂:* ${partidas[chatId].monedas[partidas[chatId].jugadores[0]]}
  𝙴𝚂𝙲𝚁𝙸𝙱𝙴 \`𝙳𝙸𝚂𝙿𝙰𝚁𝙰𝚁\` 𝙿𝙰𝚁𝙰 𝙸𝙽𝙲𝙸𝙰𝚁.`);
}

// Función para procesar el comando disparar
function procesarDisparar(m, usedPrefix, chatId) {
  // Verificar si hay partida
  if (!partidas[chatId]) {
    return m.reply(`⚠️ *𝙽𝙾 𝙷𝙰𝚈 𝙿𝙰𝚁𝚃𝙸𝙳𝙰 𝙿𝙴𝙽𝙳𝙴𝙹𝙾.*
𝙿𝙰𝚁𝙰 𝙸𝙽𝙸𝙲𝙸𝙰𝚁 𝚄𝚂𝙰: ${usedPrefix}𝚁𝚄𝙻𝙴𝚃𝙰𝚁𝚄𝚂𝙰 @𝚄𝚂𝚄𝙰𝚁𝙸𝙾`);
  }
  
  // Verificar si la partida está activa
  if (!partidas[chatId].activo) {
    return m.reply(`⏳ *𝙲𝙾𝙼𝙴𝙽𝚉𝙾 𝙴𝙻 𝙹𝚄𝙴𝙶𝙾.*
𝙴𝚂𝙿𝙴𝚁𝙰 𝚀𝚄𝙴 𝙴𝚂𝙲𝚁𝙸𝙱𝙰 𝙰𝙲𝙴𝙿𝚃𝙰𝚁`);
  }
  
  // Verificar que sea el turno del jugador
  let partida = partidas[chatId];
  let turnoJugador = partida.jugadores[partida.turno];
  
  if (m.sender !== turnoJugador) {
    return m.reply(`⏳ *𝙽𝙾 𝙴𝚂 𝚃𝚄 𝚃𝚄𝚁𝙽𝙾.*
🎮 *𝚃𝚄𝚁𝙽𝙾 𝙰𝙲𝚃𝚄𝙰𝙻:* ${partida.jugadores[partida.turno].split("@")[0]}`);
  }
  
  // Lógica del disparo
  partida.disparos++;
  
  // La probabilidad aumenta con cada disparo
  let probabilidad = partida.disparos / 6;
  let disparoExitoso = Math.random() < probabilidad;
  
  // Mensajes de tensión progresivos
  let mensajesTension = [
    "👄 *¡𝙿𝚁𝙸𝙼𝙴𝚁 𝙳𝙸𝚂𝙿𝙰𝚁𝙾!* 𝙴𝚂 𝙻𝙾 𝙵𝙰𝙲𝙸𝙻?",
    "  *¡𝚂𝙴𝙶𝚄𝙽𝙳𝙾 𝙳𝙸𝚂𝙿𝙰𝚁𝙾!* 𝙰𝙷𝙾𝚁𝙰 𝙲𝙾𝙼𝙸𝙴𝙽𝚉𝙰 𝙴𝙻 𝙹𝚄𝙴𝙶𝙾 𝚁𝙴𝙰𝙻",
    "  *¡𝚃𝙴𝚁𝙲𝙴𝚁 𝙳𝙸𝙰𝙿𝙰𝚁𝙾!* 𝚈𝙰 𝚃𝙴 𝚂𝚄𝙳𝙰𝙽 𝙻𝙰𝚂 𝙽𝙰𝙻𝙶𝙰𝚂?",
    "  *¡𝙲𝚄𝙰𝚁𝚃𝙾 𝙳𝙸𝚂𝙿𝙰𝚁𝙾!* 𝚂𝙾𝙻𝙾 𝙵𝙰𝙻𝚃𝙰 𝚄𝙽𝙰 𝙼𝙰𝚂 𝚈 𝙶𝙰𝙽𝙰𝚂!",
    "💀 *¡𝚄𝙻𝚃𝙸𝙼𝙾 𝚃𝚄𝚁𝙽𝙾!* 𝙿𝙸𝙴𝙽𝚂𝙰𝚂 𝙴𝙽 𝙶𝙰𝙽𝙰𝚁"
  ];
  
  let mensaje = mensajesTension[Math.min(partida.disparos - 1, mensajesTension.length - 1)];
  
  if (disparoExitoso) {
    // El disparo elimina al jugador
    let jugadorEliminado = m.sender;
    let jugadorGanador = partida.jugadores.find(j => j !== m.sender);
    
    // Generar una cantidad aleatoria de monedas para el ganador
    const monedaGanada = Math.floor(Math.random() * 5000) + 5000;
    const monedaPerdida = Math.floor(partida.monedas[jugadorEliminado] * 0.3); // Pierde 30% de sus monedas
    
    // El ganador recibe monedas
    const monedaFinal = partida.monedas[jugadorGanador] + monedaGanada;
    
    // Guardar el resultado final antes de eliminar la partida
    const resultadoFinal = {
      ganador: jugadorGanador.split("@")[0],
      perdedor: jugadorEliminado.split("@")[0],
      monedaGanada,
      monedaPerdida,
      monedaFinal
    };
    
    // Actualizar la base de datos del usuario ganador
    if (!global.db.data.users[jugadorGanador]) global.db.data.users[jugadorGanador] = {};
    if (!global.db.data.users[jugadorGanador].coin) global.db.data.users[jugadorGanador].coin = 0;
    
    // Añadir monedas al usuario ganador
    global.db.data.users[jugadorGanador].coin += monedaGanada;
    
    delete partidas[chatId];
    
    return m.reply(`🚨 *¡${jugadorEliminado.split("@")[0]} 𝚂𝙸 𝙽𝙾 𝙰𝙶𝚄𝙰𝙽𝚃𝙰𝚂 𝙽𝙾 𝙹𝚄𝙴𝙶𝚄𝙴𝚂!*  
💣 *¡𝙱𝙰𝙽𝙶!* 𝚈𝙰 𝚃𝙴𝚁𝙼𝙸𝙽𝙾
💀 *𝙶𝙰𝙼𝙴 𝙾𝚅𝙴𝚁..*

📊 *𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾𝚂:*
🏆 *𝙶𝙰𝙽𝙰𝙳𝙾𝚁:* ${resultadoFinal.ganador}
💸 *${moneda}*: ${monedaGanada}`);
  } else {
    // Si se alcanzan 5 disparos sin eliminar, se declara empate
    if (partida.disparos >= 5) {
      const monedaBonus = Math.floor(Math.random() * 2000) + 1000;
      
      // Ambos jugadores reciben un bonus por empate en la base de datos
      partida.jugadores.forEach(jugador => {
        // Asegurarse de que el usuario exista en la base de datos
        if (!global.db.data.users[jugador]) global.db.data.users[jugador] = {};
        if (!global.db.data.users[jugador].coin) global.db.data.users[jugador].coin = 0;
        
        // Añadir monedas al usuario
        global.db.data.users[jugador].coin += monedaBonus;
      });
      
      const jugador1 = partida.jugadores[0].split("@")[0];
      const jugador2 = partida.jugadores[1].split("@")[0];
      
      delete partidas[chatId];
      
      return m.reply(`🎉 *¡𝙼𝚄𝚈 𝙱𝙸𝙴𝙽!* 𝙻𝙾𝙶𝚁𝙰𝚁𝙾𝙽 𝚃𝙴𝙽𝙴𝚁 𝚄𝙽 𝙴𝙼𝙿𝙰𝚃𝙴!
💰 *𝙱𝙾𝙽𝚄𝚂 𝙿𝙾𝚁 𝙴𝙼𝙿𝙰𝚃𝙴:* +${monedaBonus}

📊 *𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾𝚂:*
👤 *${jugador1}*: 💸 *${moneda}*: ${monedaBonus}
👤 *${jugador2}*: 💸 *${moneda}*: ${monedaBonus}`);
    }
    
    // Se cambia el turno y continúa el juego
    partida.turno = 1 - partida.turno;
    let siguienteJugador = partida.jugadores[partida.turno];
    let nombreSiguiente = siguienteJugador.split("@")[0];
    
    // Generar bono aleatorio para el turno
    const coin = Math.floor(Math.random() * 500) + 100;
    
    // Actualizar la base de datos del usuario
    if (!global.db.data.users[siguienteJugador]) global.db.data.users[siguienteJugador] = {};
    if (!global.db.data.users[siguienteJugador].coin) global.db.data.users[siguienteJugador].coin = 0;
    
    // Añadir pequeño bono al usuario por su turno
    global.db.data.users[siguienteJugador].coin += coin;
    
    return m.reply(`${mensaje}\n\n👄 *𝙳𝙸𝚂𝙿𝙰𝚁𝙾 𝙵𝙰𝙻𝙻𝙸𝙳𝙾.*  
🎲 *𝚃𝙴 𝚃𝙾𝙲𝙰 ${nombreSiguiente}.* 
𝙴𝚂𝙲𝚁𝙸𝙱𝙴 \`𝙳𝙸𝚂𝙿𝙰𝚁𝙰𝚁\`.
💸 *${moneda}*: ${coin}`);
  }
}

handler.command = ['ruletarusa', 'aceptar', 'disparar'];
handler.tags = ['juegos', 'entretenimiento'];
handler.group = true;

export default handler;