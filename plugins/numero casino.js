import db from '../lib/database.js'

let cooldowns = {}

let handler = async (m, { conn, args, usedPrefix, command, DevMode }) => {
    let user = global.db.data.users[m.sender]
    let who = m.fromMe ? conn.user.jid : m.sender
    let username = conn.getName(who)
    let tiempoEspera = 3
    
    // Inicializar contador de partidas si no existe
    if (user.playCountNumber == null) user.playCountNumber = 0
    
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
        conn.reply(m.chat, `🎲 Ya has jugado recientemente, espera *⏱️ ${tiempoRestante}* para jugar nuevamente`, m)
        return
    }
    
    if (args.length < 2) {
        return conn.reply(m.chat, `🎲 *NÚMERO MÁS ALTO* 🎲\n\n` +
            `Elige un número del 1 al 10 y la cantidad de ${moneda} que deseas apostar\n\n` +
            `*Ejemplo:* ${usedPrefix + command} 7 100\n\n` +
            `Si tu número es mayor que el mío, ¡ganarás el doble de tu apuesta!`, m)
    }
    
    const playerChosenNumber = parseInt(args[0])
    let count = args[1]
    
    if (isNaN(playerChosenNumber) || playerChosenNumber < 1 || playerChosenNumber > 10) {
        return conn.reply(m.chat, `Por favor, elige un número válido del 1 al 10.\n\n*Ejemplo:* ${usedPrefix + command} 7 100`, m)
    }
    
    if (/all/i.test(args[1])) {
        count = user.coin
    } else {
        count = parseInt(count) || 50
    }
    
    count = Math.max(1, count)
    
    if (user.coin < count) {
        return conn.reply(m.chat, `No tienes *${formatNumber(count)} 💸 ${moneda}* para apostar!`.trim(), m)
    }
    
    // Descontar apuesta, aplicar cooldown y aumentar contador de partidas
    user.coin -= count
    cooldowns[m.sender] = Date.now()
    user.playCountNumber++
    
    let botNumber
    // Sistema más equilibrado: Aumenta probabilidad de victoria del jugador
    
    // Cada 4 partidas el jugador gana seguro
    if (user.playCountNumber % 4 === 0) {
        // Bot elige un número menor para garantizar victoria
        botNumber = playerChosenNumber > 1 ? Math.floor(Math.random() * (playerChosenNumber - 1)) + 1 : 1
    } 
    // Dificultad balanceada (50% chance de ganar aproximadamente)
    else {
        // Definir rango del bot según número del jugador
        if (Math.random() < 0.5) {
            // 50% probabilidad que bot saque número menor
            botNumber = Math.floor(Math.random() * playerChosenNumber) + 1
        } else {
            // 50% probabilidad que bot saque número mayor
            botNumber = Math.min(10, Math.floor(Math.random() * (11 - playerChosenNumber)) + playerChosenNumber)
        }
    }
    
    let msg = `🎲 *NÚMERO MÁS ALTO* 🎲\n\n`
    msg += `${username} ha elegido el número ${playerChosenNumber} y ha apostado ${formatNumber(count)} 💸 ${moneda}\n\n`
    msg += `🤖 *${botname}*: ${getNumberEmoji(botNumber)} (${botNumber})\n`
    msg += `👤 *${username}*: ${getNumberEmoji(playerChosenNumber)} (${playerChosenNumber})\n\n`
    
    if (playerChosenNumber > botNumber) {
        const winnings = count * 2
        user.coin += winnings
        msg += `🎉 ¡Felicidades! Tu número es mayor.\n¡Has ganado ${formatNumber(winnings)} 💸 ${moneda}!`
    } else if (botNumber > playerChosenNumber) {
        msg += `😔 ¡Has perdido! Mi número es mayor.\nPierdes ${formatNumber(count)} 💸 ${moneda}.`
    } else {
        user.coin += count
        msg += `🤝 ¡Empate! Ambos sacaron el mismo número.\nSe te devuelve ${formatNumber(count)} 💸 ${moneda}.`
    }
    
    conn.reply(m.chat, msg, m)
}

function getNumberEmoji(number) {
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
    return emojis[number - 1]
}

handler.help = ['numero *<cantidad>*']
handler.tags = ['games']
handler.command = ['numero', 'number', 'numeros']
handler.group = true
handler.register = true
handler.fail = null
export default handler

function segundosAHMS(segundos) {
    let segundosRestantes = segundos % 60
    return `${segundosRestantes} segundos`
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}