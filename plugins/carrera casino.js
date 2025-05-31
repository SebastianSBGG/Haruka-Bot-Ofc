import db from '../lib/database.js'

let cooldowns = {}

let handler = async (m, { conn, args, usedPrefix, command, DevMode }) => {
    let user = global.db.data.users[m.sender]
    let who = m.fromMe ? conn.user.jid : m.sender
    let username = conn.getName(who)
    let tiempoEspera = 20
    
    // Caballos en la carrera
    const horses = [
        { letter: "A", name: "🐎 𝙿𝚄𝙲𝙷𝙸𝚃𝙰", emoji: "⚡", position: 0 },
        { letter: "B", name: "🐎 𝙷𝚄𝙴𝚅𝙸𝚃𝙾77", emoji: "🌪️", position: 0 },
        { letter: "C", name: "🐎 𝙶𝙾𝙺𝚄", emoji: "💨", position: 0 },
        { letter: "D", name: "🐎 𝙼𝙰𝙽𝙲𝙷𝙸𝚃𝙰𝚂", emoji: "🔥", position: 0 }
    ]
    
    // Comprobar si el usuario ya está en cooldown
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
        conn.reply(m.chat, `🏇 𝚈 𝙷𝙰𝚂 𝙿𝙰𝚁𝚃𝙸𝙲𝙸𝙿𝙰𝙳𝙾 𝙴𝙽 𝚄𝙽𝙰 𝙲𝙰𝚁𝚁𝙴𝚁𝙰 𝚁𝙴𝙲𝙸𝙴𝙽𝚃𝙴𝙼𝙴𝙽𝚃𝙴 *⏱️ ${tiempoRestante}* para jugar nuevamente`, m)
        return
    }
    
    // Si es la primera vez que usa el comando, muestra la selección de caballos
    if (args.length < 1) {
        let msgSelection = `🏇 *𝙲𝙰𝚁𝚁𝙴𝚁𝙰 𝙳𝙴 𝙲𝙰𝙱𝙰𝙻𝙻𝙾𝚂* 🏇\n\n`
        msgSelection += `𝚂𝙴𝙻𝙴𝙲𝙲𝙸𝙾𝙽𝙰 𝚃𝚄 𝙲𝙰𝙱𝙰𝙻𝙻𝙾 𝙲𝙾𝙽 𝙻𝙰 𝙻𝙴𝚃𝚁𝙰 𝚈 𝙻𝙰 𝙲𝙰𝙽𝚃𝙸𝙳𝙰𝙳 𝙳𝙴 𝙰𝙿𝙾𝚂𝚃𝙰𝚁:\n\n`
        
        horses.forEach(horse => {
            msgSelection += `*${horse.letter}* - ${horse.name} ${horse.emoji}\n`
        })
        
        msgSelection += `\n*𝙴𝙹𝙴𝙼𝙿𝙻𝙾:* ${usedPrefix + command} (A) 𝙲𝙰𝙽𝚃𝙸𝙳𝙰𝙳 𝙳𝙴 𝙰𝙿𝙾𝚂𝚃𝙰𝚁100`
        return conn.reply(m.chat, msgSelection, m)
    }
    
    // Obtener la selección d𝙴𝙻 𝙲𝙰𝙱𝙰𝙻𝙻𝙾 y la cantidad a apostar
    const horseSelection = args[0].toUpperCase()
    let count = args[1]
    
    // Verificar que la selección d𝙴𝙻 𝙲𝙰𝙱𝙰𝙻𝙻𝙾 sea válida
    const playerHorse = horses.find(horse => horse.letter === horseSelection)
    if (!playerHorse) {
        return conn.reply(m.chat, `𝚂𝙴𝙻𝙴𝙲𝙲𝙸𝙾𝙽𝙰 𝙼𝙰𝙻 𝙴𝙻𝙸𝙶𝙴 𝙰 𝙱 𝙲 𝙳 \n\n*Ejemplo:* ${usedPrefix + command} (A) 𝙲𝙰𝙽𝚃𝙸𝙳𝙰𝙳 𝙳𝙴 𝙰𝙿𝙾𝚂𝚃𝙰𝚁100`, m)
    }
    
    // Verificar si el usuario quiere apostar todo
    if (/all/i.test(args[1])) {
        count = user.coin
    } else {
        // Convertir a número
        count = parseInt(count) || 50
    }
    
    // Asegurar que la apuesta sea al menos 1
    count = Math.max(1, count)
    
    if (user.coin < count) {
        return conn.reply(m.chat, `𝙽𝙾 𝚃𝙸𝙴𝙽𝙴𝚂 *${formatNumber(count)} 💸 ${moneda}* 𝙿𝙰𝚁𝙰 𝙰𝙿𝙾𝚂𝚃𝙰𝚁!`.trim(), m)
    }
    
    // Descuenta la apuesta
    user.coin -= count
    cooldowns[m.sender] = Date.now()
    
    // Longitud de la pista
    const trackLength = 10
    
    // Mensaje inicial
    let msg = `🏇 *𝙲𝙰𝚁𝚁𝙴𝚁𝙰 𝙳𝙴 𝙲𝙰𝙱𝙰𝙻𝙻𝙾𝚂* 🏇\n\n`
    msg += `${username} 𝙴𝚂𝚃𝙰 𝙰𝙿𝙾𝚂𝚃𝙰𝙽𝙳𝙾 ${formatNumber(count)} 💸 ${moneda} 𝙰𝙻 𝙲𝙰𝙱𝙰𝙻𝙻𝙾 ${playerHorse.name}\n\n`
    msg += `¡𝙻𝙰 𝙲𝙰𝚁𝚁𝙴𝚁𝙰 𝙴𝚂𝚃𝙰 𝙿𝙾𝚁 𝙲𝙾𝙼𝙴𝙽𝚉𝙰𝚁!\n`
    
    // Función para obtener la pista actual
    function getTrack() {
        let track = ""
        for (const horse of horses) {
            let position = "🏁"
            for (let i = 0; i < trackLength; i++) {
                if (i === horse.position) {
                    position += horse.emoji
                } else {
                    position += "━"
                }
            }
            position += "🏁"
            track += `${horse.letter} - ${horse.name}: ${position}\n`
        }
        return track
    }
    
    // Enviar mensaje inicial de la carrera (UN SOLO MENSAJE)
    const raceMsg = await conn.reply(m.chat, msg + "\n" + getTrack(), m)
    
    // Variables para el seguimiento
    let finished = false
    let winner = null
    
    // Simulación de la carrera (3 actualizaciones)
    for (let round = 0; round < 3; round++) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Avanzar caballos
        for (const horse of horses) {
            horse.position += Math.floor(Math.random() * 4) + 1
            if (horse.position >= trackLength && !finished) {
                finished = true
                winner = horse
            }
        }
        
        // Si nadie ha llegado a la meta después de las 3 rondas, determinar ganador
        if (round === 2 && !finished) {
            winner = horses.reduce((prev, current) => 
                (prev.position > current.position) ? prev : current
            )
        }
        
        // ACTUALIZAR el mismo mensaje con la nueva pista (no crear uno nuevo)
        try {
            await conn.sendMessage(m.chat, { 
                text: msg + "\n" + getTrack(),
                edit: raceMsg
            })
        } catch (e) {
            // Si falla la edición, continuamos sin interrumpir la carrera
            console.log("Error al editar mensaje:", e)
        }
    }
    
    // Resultado final (se añade al último mensaje editado)
    let resultMsg = msg + "\n" + getTrack() + "\n\n"
    resultMsg += `¡𝙴𝙻 𝙲𝙰𝙱𝙰𝙻𝙻𝙾 ${winner.name} 𝙷𝙰 𝙶𝙰𝙽𝙰𝙳𝙾 𝙻𝙰 𝙲𝙰𝚁𝚁𝙴𝚁𝙰!\n\n`
    
    // Comprobar si el jugador ganó
    if (winner.letter === horseSelection) {
        const winnings = count * 3
        user.coin += winnings
        resultMsg += `🎉 ¡𝙵𝙴𝙻𝙸𝙲𝙸𝙳𝙰𝙳𝙴𝚂 ${username}! ¡𝙷𝙰𝚂 𝙶𝙰𝙽𝙰𝙳𝙾 ${formatNumber(winnings)} 💸 ${moneda}!`
    } else {
        resultMsg += `😔 𝙻𝙾 𝚂𝙸𝙴𝙽𝚃𝙾 ${username}, 𝙷𝙰𝚂 𝙿𝙴𝚁𝙳𝙸𝙳𝙾 ${formatNumber(count)} 💸 ${moneda}.`
    }
    
    // Editar el mensaje final con los resultados
    try {
        await conn.sendMessage(m.chat, {
            text: resultMsg,
            edit: raceMsg
        })
    } catch (e) {
        // Si falla la edición, enviamos un mensaje nuevo como fallback
        conn.reply(m.chat, resultMsg, m)
    }
}

handler.help = ['carrera *<cantidad>*']
handler.tags = ['games']
handler.command = ['carrera', 'horses', 'caballos']
handler.group = true
handler.register = true
handler.fail = null
export default handler

function segundosAHMS(segundos) {
    let segundosRestantes = segundos % 60
    return `${segundosRestantes} segundos`
}

function formatNumber(number) {
    return number
    .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}