async function handler(m, { groupMetadata, command, conn, text, usedPrefix }) {
    let user = a => '@' + a.split('@')[0];

    // Extraer el número del comando (ejemplo: !top10 -> 10)
    let num = command.match(/\d+/) ? parseInt(command.match(/\d+/)[0]) : 0;

    // Validar que el número esté entre 1 y 30
    if (!num || num < 1 || num > 30) {
        return conn.reply(m.chat, `🚩 *Uso correcto:* \n${usedPrefix}${command} [tema]\n\nEjemplo: ${usedPrefix}${command} mejores jugadores`, m);
    }

    if (!text) return conn.reply(m.chat, `🚩 *Ejemplo de uso:*\n${usedPrefix}${command} Pros`, m);

    // Obtener los participantes del grupo y mezclar aleatoriamente
    let participants = groupMetadata.participants.map(v => v.id).sort(() => 0.5 - Math.random()).slice(0, num);

    // Si hay menos participantes de los requeridos
    if (participants.length < num) {
        return conn.reply(m.chat, `⚠️ *No hay suficientes miembros en el grupo para hacer un top ${num}.*`, m);
    }

    // Lista de emojis para darle más dinamismo
    let emojis = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🤩', '😏', '😳', '🥵', '🤯', '😱', '😨', '🤫', '🥴', '🤧', '🤑', '🤠', '🤖', '🤝', '💪', '👑', '😚', '🐱', '🐈', '🐆', '🐅', '⚡️', '🗣️', '☃️', '⛄️', '🙈', '🧐', '🤓', '🍓', '🍎', '🎈', '🪄', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '💘', '💝', '💟', '👄', '😎', '🔥', '🖕', '🐦'];

    let emojiRandom = emojis[Math.floor(Math.random() * emojis.length)];

    // Construir el mensaje del top
    let mensaje = `*${emojiRandom} Top ${num} ${text} ${emojiRandom}*\n\n`;
    mensaje += participants.map((p, i) => `*${i + 1}. ${user(p)} ${pickRandom(emojis)}*`).join('\n');

    // Enviar el mensaje con menciones
    await conn.reply(m.chat, mensaje, null, { mentions: participants });
}

handler.help = ['top'];
handler.command = /^top(\d{1,2})$/i; // Acepta comandos como top1, top5, top10, top30
handler.tags = ['juegos'];
handler.group = true;
handler.register = true;

export default handler;

// Función para seleccionar un emoji aleatorio
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
