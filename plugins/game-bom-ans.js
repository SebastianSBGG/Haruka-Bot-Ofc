// game-bom-ans.js (Archivo de respuesta/procesamiento)
export async function before(m) {
    try {
        let id = m.chat;
        let timeout = 180000;
        let users = global.db.data.users[m.sender];
        let body = typeof m.text == 'string' ? m.text : false;
        
        this.bomb = this.bomb ? this.bomb : {};
        if (!this.bomb[id]) return !1
        
        // Permitir rendirse
        let isSurrender = /^((me)?rendirse|surr?ender)$/i.test(m.text);
        if (isSurrender) {
            await this.reply(m.chat, `🚩 Te has rendido :(`, m);
            clearTimeout(this.bomb[id][2]);
            delete this.bomb[id];
        }

        // Si el comando es cerrarbomba
        if (m.text === 'cerrarbomba') {
            let isAdmin = m.isGroup ? (await this.groupMetadata(m.chat)).participants.find(v => v.id === m.sender)?.admin : false;
            if (this.bomb[id][4] !== m.sender && !isAdmin) {
                return this.reply(m.chat, '⚠️ Solo quien inició la partida o un administrador puede cerrarla.', m);
            }
            
            await this.reply(m.chat, `🎮 La partida de *Bomba* ha sido cerrada correctamente.`, m);
            clearTimeout(this.bomb[id][2]);
            delete this.bomb[id];
            return true;
        }

        // Procesamiento de juego
        if (this.bomb[id] && m.quoted && m.quoted.id == this.bomb[id][3].id && !isNaN(body)) {
            let rewardCoin = this.bomb[id][5]; // Recompensa de monedas
            let rewardExp = this.bomb[id][6];  // Recompensa de exp
            let openCount = this.bomb[id][7];  // Contador de casillas abiertas
            let hasWon = this.bomb[id][8];     // Flag de victoria
            
            let json = this.bomb[id][1].find(v => v.position == body);
            if (!json) return this.reply(m.chat, `🚩 Para abrir una casilla envía un número del 1 al 9`, m);

            // Si ya se abrió esta casilla
            if (json.state) {
                return this.reply(m.chat, `🚩 La casilla ${json.number} ya ha sido abierta, por favor elige otra casilla.`, m);
            }
            
            // Si encontró la bomba
            if (json.emot == '💥') {
                json.state = true;
                let bomb = this.bomb[id][1];
                let teks = `乂  *B O M B A*\n\n`;
                teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
                teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
                teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
                teks += `Tiempo límite: [ *${((timeout / 1000) / 60)} minutos* ]\n`;
                teks += `*¡Juego terminado!*, has abierto la casilla con la bomba:\n`;
                teks += `💸 *${moneda}*: -${formatNumber(rewardCoin)}\n`;
                teks += `✨ *EXP*: -${formatNumber(rewardExp)}`;

                this.reply(m.chat, teks, m).then(() => {
                    // Restar recompensas
                    users.coin = users.coin ? (users.coin < rewardCoin ? 0 : users.coin - rewardCoin) : 0;
                    users.exp = users.exp ? (users.exp < rewardExp ? 0 : users.exp - rewardExp) : 0;
                    
                    clearTimeout(this.bomb[id][2]);
                    delete this.bomb[id];
                });
            } else {
                // Abrió una casilla segura
                json.state = true;
                this.bomb[id][7]++; // Incrementar contador de casillas abiertas
                openCount = this.bomb[id][7];
                
                // Si es la primera casilla segura, incrementamos la recompensa
                if (openCount > 0 && !hasWon) {
                    rewardCoin += 600; // Incrementar en 600 monedas
                    rewardExp += 100;  // Incrementar en 100 exp
                    this.bomb[id][5] = rewardCoin;
                    this.bomb[id][6] = rewardExp;
                }
                
                let changes = this.bomb[id][1];
                
                // Si ha abierto 8 casillas seguras (todas menos la bomba)
                if (openCount >= 8) {
                    this.bomb[id][8] = true; // Marcar como ganado
                    
                    let teks = `乂  *B O M B A*\n\n`;
                    teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
                    teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
                    teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
                    teks += `Tiempo límite: [ *${((timeout / 1000) / 60)} minutos* ]\n`;
                    teks += `*¡Juego terminado!* La casilla con la bomba no fue abierta:\n`;
                    teks += `💸 *${moneda}*: +${formatNumber(rewardCoin)}\n`;
                    teks += `✨ *EXP*: +${formatNumber(rewardExp)}`;

                    this.reply(m.chat, teks, m).then(() => {
                        // Agregar recompensa
                        users.coin = (users.coin || 0) + rewardCoin;
                        users.exp = (users.exp || 0) + rewardExp;
                        
                        clearTimeout(this.bomb[id][2]);
                        delete this.bomb[id];
                    });
                } else {
                    // Continúa el juego
                    let teks = `乂  *B O M B A*\n\n`;
                    teks += `Envía un número del *1* al *9* para abrir una de las *9* casillas numeradas a continuación:\n\n`;
                    teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
                    teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
                    teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
                    teks += `Tiempo límite: [ *${((timeout / 1000) / 60)} minutos* ]\n`;
                    teks += `Recompensa actual: 💸 *${moneda}*: ${formatNumber(rewardCoin)} | ✨ *EXP*: ${formatNumber(rewardExp)}\n`;
                    teks += `Casillas abiertas: ${openCount}/8`;

                    // Actualizar el mensaje usando protocolMessage
                    this.relayMessage(m.chat, {
                        protocolMessage: {
                            key: this.bomb[id][3],
                            type: 14,
                            editedMessage: {
                                conversation: teks
                            }
                        }
                    }, {});
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}

export const exp = 0;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(number) {
    return number.toLocaleString();
}

// Constante para la moneda
const moneda = "COINS";