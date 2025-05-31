let handler = async (m, { conn, text, command, usedPrefix }) => {
  let users = global.db.data.users[m.sender]

  if (!text) {
    return conn.reply(
      m.chat,
      `${emoji} Debes ingresar una cantidad de *💸 ${moneda}* y apostar a un color.\nEjemplo sin multiplicador: *${usedPrefix + command} 1000 black*\nEjemplo con multiplicador: *${usedPrefix + command} 1000 black x2*`,
      m
    )
  }

  let args = text.trim().split(" ")

  // Se permite que sean 2 o 3 argumentos: cantidad, color y opcionalmente multiplicador
  if (args.length < 2 || args.length > 3) {
    return conn.reply(
      m.chat,
      `${emoji2} Formato incorrecto. Debes ingresar una cantidad y apostar a un color.\nEjemplo sin multiplicador: *${usedPrefix + command} 1000 red*\nEjemplo con multiplicador: *${usedPrefix + command} 1000 red x2*`,
      m
    )
  }

  let coin = parseInt(args[0])
  if (isNaN(coin) || coin <= 0) {
    return conn.reply(m.chat, `${emoji} Ingresa una cantidad válida para la apuesta.`, m)
  }

  let color = args[1].toLowerCase()
  if (!(color === 'black' || color === 'red')) {
    return conn.reply(m.chat, `${emoji2} Debes apostar a un color válido: *black* o *red*.`, m)
  }

  // Configuración del multiplicador: por defecto x1
  let multiplier = 1
  if (args.length === 3) {
    let multiStr = args[2].toLowerCase()
    if (!multiStr.startsWith('x')) {
      return conn.reply(m.chat, `${emoji2} El formato del multiplicador es incorrecto. Ejemplo: x2`, m)
    }
    multiplier = parseInt(multiStr.slice(1))
    if (isNaN(multiplier) || multiplier < 1 || multiplier > 10) {
      return conn.reply(m.chat, `${emoji2} El multiplicador debe ser un número entre 1 y 10.`, m)
    }
  }

  // Verificar que el usuario tenga suficientes fondos para cubrir la apuesta con multiplicador
  if (coin * multiplier > users.coin) {
    return conn.reply(
      m.chat,
      `${emoji2} No tienes suficientes ${moneda} para apostar ${coin} con multiplicador x${multiplier}.\nTu saldo es de ${users.coin} ${moneda}.`,
      m
    )
  }

  // Ajustamos la probabilidad de ganar en función del multiplicador:
  // Para x1: 55% de ganar, cada incremento reduce la probabilidad en 5%
  // Ej: x2: 50%, x3: 45%, ..., x10: 10%
  let winChance = 0.55 - ((multiplier - 1) * 0.05)
  let result = Math.random()
  let win = (result < winChance)

  // Se determina el color de la ruleta según el resultado:
  // Si gana, la ruleta "muestra" el color apostado; si pierde, el opuesto.
  let outcome = win ? color : (color === 'black' ? 'red' : 'black')
  let amountChange = coin * multiplier

  if (win) {
    users.coin += amountChange
    conn.reply(
      m.chat,
      `${emoji} ¡Ganaste! La ruleta cayó en *${outcome}*.\nHas ganado *${amountChange} 💸 ${moneda}* (multiplicador x${multiplier}).\nTu nuevo saldo es: *${users.coin} 💸 ${moneda}*`,
      m
    )
  } else {
    users.coin -= amountChange
    conn.reply(
      m.chat,
      `${emoji2} ¡Perdiste! La ruleta cayó en *${outcome}*.\nSe te restaron *${amountChange} 💸 ${moneda}* (multiplicador x${multiplier}).\nTu nuevo saldo es: *${users.coin} 💸 ${moneda}*`,
      m
    )
  }
}

handler.tags = ['economy']
handler.help = ['ruleta *<cantidad> <color> [x<multiplicador>]*']
handler.command = ['ruleta', 'roulette', 'rt']
handler.register = true
handler.group = true

export default handler
