const items = ['XP'];
const confirmation = {};
const DEBT_INCREMENT = 10;
const DEBT_INTERVAL = 5 * 60 * 60 * 1000; // 5 horas
const MIN_AMOUNT = 10;

async function handler(m, { conn, args, command }) {
  const user = global.db.data.users[m.sender];

  const sendMessage = (text, mentions = []) => {
    conn.sendMessage(m.chat, { text, mentions }, { quoted: m });
  };

  if (command === 'prestarxp') {
    const loanedUser = args[1] ? args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net' : '';
    const count = Math.max(MIN_AMOUNT, isNumber(args[0]) ? parseInt(args[0]) : MIN_AMOUNT);

    if (!loanedUser) {
      return sendMessage('*👤 Menciona al usuario que le deseas hacer el préstamo de XP.*');
    }

    if (!(loanedUser in global.db.data.users)) {
      return sendMessage(`*👤 El usuario ${loanedUser} no está en la base de datos.*`);
    }

    if (user.xp < count) {
      return sendMessage('*💰 No tienes suficiente XP para prestar.*');
    }

    if (confirmation[loanedUser]) {
      return sendMessage('*💰 Ya hay una solicitud de préstamo pendiente para este usuario.*');
    }

    const lenderTag = `@${m.sender.split('@')[0]}`;
    const confirmMessage = `*${lenderTag} desea prestarte ${count} XP. ¿Aceptarás?* 
*—◉ Tienes 60 segundos para confirmar.*
*—◉ Escribe:* 
*◉ Si = para aceptar*
*◉ No = para cancelar*`;

    await sendMessage(confirmMessage, [m.sender]);

    confirmation[loanedUser] = {
      sender: m.sender,
      to: loanedUser,
      count,
      timeout: setTimeout(() => {
        sendMessage('*⌛ Se acabó el tiempo, no se obtuvo respuesta. Préstamo cancelado.*', [loanedUser]);
        delete confirmation[loanedUser];
      }, 60 * 1000)
    };

  } else if (command === 'pagarxp') {
    const amountToPay = Math.max(MIN_AMOUNT, isNumber(args[0]) ? parseInt(args[0]) : MIN_AMOUNT);

    if (user.xp < 0) {
      return sendMessage('*🚫 No puedes realizar pagos mientras tu cuenta esté en negativo.*');
    }

    if (!user.debts || Object.keys(user.debts).length === 0) {
      return sendMessage('*💳 No tienes XP en deuda para pagar.*');
    }

    const totalDebt = Object.values(user.debts).reduce((acc, val) => acc + val, 0);

    if (amountToPay < MIN_AMOUNT) {
      return sendMessage(`*💰 La cantidad mínima para pagar es ${MIN_AMOUNT} XP.*`);
    }

    if (amountToPay > totalDebt) {
      return sendMessage(`*💰 No puedes pagar más de ${totalDebt} XP.*`);
    }

    for (const [lender, debtAmount] of Object.entries(user.debts)) {
      if (debtAmount > 0) {
        if (amountToPay <= debtAmount) {
          user.debts[lender] -= amountToPay;
          if (user.debts[lender] <= 0) {
            delete user.debts[lender];
          }
          break;
        }
        amountToPay -= debtAmount;
        delete user.debts[lender];
      }
    }

    sendMessage(`*💸 Pago realizado: ${amountToPay} XP.*`);

    if (Object.keys(user.debts).length === 0) {
      sendMessage('*🎉 Ya no debes nada.*');
    }

  } else if (command === 'deudaxp') {
    if (!user.debts || Object.keys(user.debts).length === 0) {
      return sendMessage('*💳 No tienes deudas pendientes.*');
    }

    let debtMessage = '*💳 Deudas pendientes:*\n';
    const mentions = [];

    for (const [lender, amount] of Object.entries(user.debts)) {
      if (amount > 0) {
        debtMessage += `*— ${amount} XP de @${lender.split('@')[0]}*\n`;
        mentions.push(lender);
      }
    }

    debtMessage += '*Total de deudas: ' + Object.values(user.debts).reduce((acc, val) => acc + val, 0) + ' XP*';
    sendMessage(debtMessage.trim(), mentions);
  }
}

handler.before = async (m) => {
  if (m.isBaileys) return;
  if (!(m.sender in confirmation)) return;
  if (!m.text) return;

  const { timeout, to, count } = confirmation[m.sender];
  const loanedUser = global.db.data.users[to];

  if (/^No$/i.test(m.text)) {
    clearTimeout(timeout);
    delete confirmation[to];
    return conn.sendMessage(m.chat, { text: '*🔴 Cancelado, el préstamo no se realizará.*' }, { quoted: m });
  }

  if (/^Si$/i.test(m.text)) {
    const lender = global.db.data.users[m.sender];
    loanedUser.xp += count;
    loanedUser.debts = loanedUser.debts || {};
    loanedUser.debts[m.sender] = (loanedUser.debts[m.sender] || 0) + count;

    conn.sendMessage(m.chat, { text: `*💱 Se prestaron correctamente ${count} XP a @${to.split('@')[0]}.*`, mentions: [to] }, { quoted: m });

    setInterval(() => {
      loanedUser.debts[m.sender] += DEBT_INCREMENT;
    }, DEBT_INTERVAL);

    clearTimeout(timeout);
    delete confirmation[to];
  }
};

handler.help = ['prestarxp', 'pagarxp', 'deudaxp'].map((v) => v + ' [cantidad] [@tag]');
handler.tags = ['xp'];
handler.command = ['prestarxp', 'pagarxp', 'deudaxp'];
handler.disabled = false;
handler.group = true;
handler.register = true;

export default handler;

function isNumber(x) {
  return !isNaN(x);
}
