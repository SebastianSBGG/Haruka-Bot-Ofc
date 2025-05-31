const baseCoinReward = 20000;

var handler = async (m, { conn }) => {

    let user = global.db.data.users[m.sender] || {};
    user.monthly = user.monthly || 0;

    const cooldown = 60400 * 4; // 4 semanas

    let timeRemaining = user.monthly + cooldown - new Date();

    if (timeRemaining > 0) {
        return m.reply(`${emoji3} ¡Ya reclamaste tu regalo mensual! Vuelve en:\n *${msToTime(timeRemaining)}*`);
    }

    let coinReward = pickRandom([900, 700, 7700, 70, 600]);
    let expReward = pickRandom([500, 700, 60, 8000, 980]);
    let diamondReward = pickRandom([70, 700, 6000]);

    user.coin = (user.coin || 0) + coinReward;
    user.exp = (user.exp || 0) + expReward;
    user.diamonds = (user.diamonds || 0) + diamondReward;

    m.reply(`
\`\`\`🎁 ¡Ha pasado un mes! ¡Disfruta de tu regalo mensual!. \`\`\`

💸 *${moneda}* : +${coinReward}
✨ *Experiencia* : +${expReward}
💎 *Diamantes* : +${diamondReward}`);

    user.monthly = new Date * 1;
}

handler.help = ['monthly'];
handler.tags = ['rpg'];
handler.command = ['mensual', 'monthly'];
handler.group = true;
handler.register = true;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
    var days = Math.floor(duration / (1000 * 60 * 60 * 24));
    var hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days} días ${hours} horas ${minutes} minutos`;
}
