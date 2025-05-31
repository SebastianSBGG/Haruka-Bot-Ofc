const userSpamData = {}

// El handler.before se ejecuta antes de procesar cada mensaje
let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems }) {
  // Obtiene la configuración del chat y del bot
  const chat = global.db.data.chats[m.chat]
  const bot = global.db.data.settings[conn.user.jid] || {}
  
  // Si el bot no tiene antiSpam activado, no hace nada
  if (!bot.antiSpam) return
  
  // Si es grupo y está en modo "solo admin", se omite
  if (m.isGroup && chat.modoadmin) return
  
  // En grupo, si el usuario es owner, admin, o si el bot no es admin o el usuario es premium, se salta la comprobación
  if (m.isGroup) {
    if (isOwner || isROwner || isAdmin || !isBotAdmin || isPrems) return
  }
  
  // Solo procesa mensajes de texto, imágenes y stickers
  if (
    !m.message ||
    (
      !m.message.conversation &&
      !m.message.imageMessage &&
      !m.message.stickerMessage
    )
  ) return
  
  const sender = m.sender
  const currentTime = new Date().getTime()
  const timeWindow = 5000      // Ventana de 5 segundos
  const messageLimit = 3       // Límite de 3 mensajes en ese tiempo

  // Inicializa el objeto de spam para el usuario si no existe
  if (!(sender in userSpamData)) {
    userSpamData[sender] = {
      lastMessageTime: currentTime,
      messageCount: 1,
      antiBan: 0, // Nivel de advertencia: 0 sin advertencia, 1: advertencia, 2: eliminación
    }
  } else {
    const userData = userSpamData[sender]
    const timeDifference = currentTime - userData.lastMessageTime

    // Si el mensaje llega dentro de la ventana, incrementa el contador
    if (timeDifference <= timeWindow) {
      userData.messageCount += 1
    } else {
      // Si ha pasado el tiempo, se reinicia el contador
      userData.messageCount = 1
    }
    userData.lastMessageTime = currentTime

    // Si se supera el límite
    if (userData.messageCount >= messageLimit) {
      // Si el usuario aún no ha sido advertido o eliminado (niveles menores a 2)
      if (userData.antiBan < 2) {
        userData.antiBan++
        const mention = `@${sender.split("@")[0]}`
        let warningMessage = ""
        if (userData.antiBan === 1) {
          // Nivel 1: Advertencia
          warningMessage = `✦ ${mention}, estás enviando mensajes demasiado rápido. Por favor, detente.`
          await conn.reply(m.chat, warningMessage, m, { mentions: [sender] })
          // Reinicia el contador para detectar nuevos envíos
          userData.messageCount = 0
        } else if (userData.antiBan === 2) {
          // Nivel 2: Eliminar al usuario por spam
          warningMessage = `✦ ${mention}, has sido eliminado(a) por spam.`
          await conn.reply(m.chat, warningMessage, m, { mentions: [sender] })
          await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
          // Elimina los datos del usuario
          delete userSpamData[sender]
          return
        }
      }
    }
  }
  
  // Opcionalmente, se elimina el mensaje spam después de 3 segundos
  if (m.key) {
    setTimeout(() => { conn.sendMessage(m.chat, { delete: m.key }) }, 3000)
  }
}

export default handler
