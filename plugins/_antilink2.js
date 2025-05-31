// Expresión regular mejorada para detectar enlaces válidos
const linkRegex = /(https?:\/\/|www\.)[\w.-]+\.[a-z]{2,6}([\/\w.-]*)*/i;

export async function before(m, { isAdmin, isBotAdmin }) {
  // Verificaciones iniciales
  if (!m.isGroup || m.isBaileys || m.fromMe) return; // Ignorar mensajes privados, del bot o enviados por sí mismo

  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};

  // Verifica si el mensaje contiene un enlace válido
  if (!linkRegex.test(m.text)) return; // Evita procesar mensajes sin links

  // Obtiene el enlace de invitación del grupo para excluirlo de la detección
  const groupLink = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
  const allowedLinks = [groupLink, 'https://www.youtube.com/', 'https://youtu.be/'];

  // Si el mensaje contiene un link permitido, no hacer nada
  if (allowedLinks.some(link => m.text.includes(link))) return;

  // Si el anti-link está activado y el usuario no es admin, se elimina el mensaje y se expulsa
  if (chat.antiLink2 && !isAdmin) {
    // Si el bot no es admin, no puede eliminar ni expulsar
    if (!isBotAdmin) {
      return m.reply(`✦ No soy admin, no puedo expulsar.`);
    }

    // Borra el mensaje antes de enviar aviso
    await this.sendMessage(m.chat, { delete: m.key });

    // Aviso de expulsión
    await this.sendMessage(m.chat, { 
      text: `*「 Anti Links 」*\n${m.sender.split('@')[0]}, rompiste las reglas. ¡Fuera! 🚪`, 
      mentions: [m.sender] 
    });

    // Expulsión si las restricciones están activadas
    if (bot.restrict) {
      let response = await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      if (response[0]?.status === '404') return;
    } else {
      return m.reply(`✦ La restricción está desactivada por el owner.`);
    }
  }
}
