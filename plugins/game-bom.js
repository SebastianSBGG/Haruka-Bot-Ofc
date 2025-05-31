// game-bom.js (Archivo principal)
let handler = async (m, {
    conn
}) => {
    conn.bomb = conn.bomb || {};
    let id = m.chat,
        timeout = 180000;
    if (id in conn.bomb) return conn.reply(m.chat, '*^ ¡Esta sesión aún no ha terminado!*', conn.bomb[id][0]);
    
    // Recompensas base
    let rewardCoin = randomInt(600, 3000);
    let rewardExp = randomInt(100, 800);
    
    const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5);
    const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    const array = bom.map((v, i) => ({
        emot: v,
        number: number[i],
        position: i + 1,
        state: false
    }));
    
    let teks = `乂  *B O M B A*\n\nEnvía un número del *1* al *9* para abrir una de las *9* casillas numeradas a continuación:\n\n`;
    for (let i = 0; i < array.length; i += 3) teks += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
    teks += `\nTiempo límite: [ *${((timeout / 1000) / 60)} minutos* ]\n`;
    teks += `Recompensa actual: 💸 *${moneda}*: ${formatNumber(rewardCoin)} | ✨ *EXP*: ${formatNumber(rewardExp)}\n`;
    teks += `¡Si encuentras la casilla que contiene la bomba, perderás la recompensa!`;
    
    let msg = await conn.reply(m.chat, teks, m);
    let { key } = msg;

    // Actualizar usuario en la base de datos
    let users = global.db.data.users[m.sender];
    if (!users) users = global.db.data.users[m.sender] = {};
    users.lastBomb = new Date * 1;

    conn.bomb[id] = [
        msg,
        array,
        setTimeout(() => {
            let v = array.find(v => v.emot == '💥');
            if (conn.bomb[id]) conn.reply(m.chat, `*¡Se acabó el tiempo!* La bomba estaba en la casilla número ${v.number}.`, conn.bomb[id][0].key);
            delete conn.bomb[id];
        }, timeout),
        key,
        m.sender,
        rewardCoin,
        rewardExp,
        0, // contador de casillas abiertas
        false // flag para saber si ya se ganó
    ];
};

handler.help = ["bomba"];
handler.tags = ["juego"];
handler.command = /^(bomba|cerrarbomba)$/i;

export default handler;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(number) {
    return number.toLocaleString();
}

// Constante para la moneda
const moneda = "COINS";