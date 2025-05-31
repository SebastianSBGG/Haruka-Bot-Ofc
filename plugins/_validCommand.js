export async function before(m) {
  // Solo procesamos mensajes que tengan texto y empiecen con el prefijo definido
  if (!m.text || !global.prefix.test(m.text)) return;

  // Extrae el prefijo usado y el comando (la primera palabra después del prefijo)
  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  // Función para verificar si el comando existe en los plugins registrados
  const validCommand = (command, plugins) =>
    Object.values(plugins).some(plugin => {
      if (!plugin.command) return false;
      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      return cmds.includes(command);
    });

  // Si el comando es "bot", no se procesa ningún otro flujo
  if (command === "bot") return;

  // Si el comando es válido, se ejecuta la lógica correspondiente
  if (validCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];

    // Si el bot está desactivado en el grupo, se notifica al usuario
    if (chat.isBanned) {
      const avisoDesactivado = `《✧》El bot *${botname}* está desactivado en este grupo.\n\n> ✦ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`;
      await m.reply(avisoDesactivado);
      return;
    }

    // Incrementa el contador de comandos del usuario
    user.commands = (user.commands || 0) + 1;
  }
}
