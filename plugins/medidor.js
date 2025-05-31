let handler = async (m, { conn, command, text }) => {
  let parts = text.split('|').map(s => s.trim());
  let name = parts[0];
  let customMsg = parts[1] || '';

  let cmd = command.toLowerCase();
  let response = '';

  if (/chichis/.test(cmd)) {
    let randomLetter = ['A', 'B', 'C', 'D'].getRandom();
    let defaultMessages = [
      '¡Que flotadores bro! 😳🥵',
      'Con esas chichis puedes flotar en el mar.',
      'Tremenda delantera, cuidado con los choques.',
    ];
    let finalMsg = customMsg || defaultMessages.getRandom();
    response = `*🍒 MEDIDOR DE CHICHIS 🍒*

*Las Chichis de ${name} son copa* ${randomLetter}

${finalMsg}`;
  } else if (/altura/.test(cmd)) {
    let alturas = Array.from({ length: 161 }, (_, i) => (140 + i / 10).toFixed(2));
    let randomHeight = alturas.getRandom();
    let defaultMessages = [
      'Joder que alto estás, pareces gigante weón 🤨',
      'Tú no caminas, ¡desfilas como modelo!',
      'Con esa altura entras en la NBA sin prueba.',
    ];
    let finalMsg = customMsg || defaultMessages.getRandom();
    response = `*📏 MEDIDOR DE ALTURA 📏*

*${name} mide* *${randomHeight}* *metros*

${finalMsg}`;
  } else if (/poto|culo/.test(cmd)) {
    let randomPoto = ['No hay', 'Poquito', 'Tiene más o menos', 'Se carga un tremendo culazo'].getRandom();
    let defaultMessages = [
      'Que culazo bro 🍑, ¿serías mi culón/culona? 😳',
      'Con ese poto no se puede caminar sin causar accidentes.',
      'Ese culo merece un pedestal.',
    ];
    let finalMsg = customMsg || defaultMessages.getRandom();
    response = `*🍑 MEDIDOR DE POTOS 🍑*

*El poto de ${name} es* ${randomPoto}

${finalMsg}`;
  } else if (/infiel/.test(cmd)) {
    let porcentaje = Math.floor(Math.random() * 101);
    let defaultMessages = [
      'Cuidado con esas vueltas, ¡no te confíes!',
      'La fidelidad es relativa... como tu porcentaje.',
      'Te pasaste de infiel, ni tu sombra te cree.',
    ];
    let finalMsg = customMsg || defaultMessages.getRandom();
    response = `*🥷🏻🐂 MEDIDOR DE INFIDELIDAD 🐂🥷🏻*

*El nivel de infidelidad de ${name} es de* *${porcentaje}%*

${finalMsg}`;
  } else if (/putito|putitoo|putito2/.test(cmd)) {
    let medida = Math.floor(Math.random() * 61);
    let defaultMessages = [
      'Deberías cerrar el culo gay de mierdas 🫥',
      'Te dejaron más abierto que una tienda 24/7.',
      'Con eso dentro, ni una bomba te hace daño.',
    ];
    let finalMsg = customMsg || defaultMessages.getRandom();
    response = `*🛡️ MEDIDOR DE PROFUNDIDAD ANAL 🛡️*

*A ${name} tiene una verga en el culo de* *${medida}cm*

${finalMsg}`;
  } else if (/tula/.test(cmd)) {
    let medida = Math.floor(Math.random() * 31);
    let defaultMessages = [
      'Deberías convertirte en actor porno 🥵, ¡las romperías todas!',
      'Con esa tula se detiene el tráfico.',
      'Una tula de esas es patrimonio nacional.',
    ];
    let finalMsg = customMsg || defaultMessages.getRandom();
    response = `*🍆 MEDIDOR DE TULA 🍆*

*La tula de ${name} mide* *${medida}cm*

${finalMsg}`;
  } else if (/cuca|pussy|vagina/.test(cmd)) {
    let medida = Math.floor(Math.random() * 31);
    let defaultMessages = [
      'Deberías cerrar las piernas, eso es más profundo que las Marianas 🫥',
      'Parece que guardas secretos en el fondo.',
      'Eso tiene más profundidad que un poema de Neruda.',
    ];
    let finalMsg = customMsg || defaultMessages.getRandom();
    response = `*🛡️ MEDIDOR DE PROFUNDIDAD 🛡️*

*A ${name} le mide* *${medida}cm pero para adentro*

${finalMsg}`;
  } else {
    response = 'Comando no reconocido.';
  }

  m.reply(response, null, { mentions: conn.parseMention(response) });
};

handler.help = ['chichis', 'altura', 'poto', 'culo', 'infiel', 'putito', 'putitoo', 'putito2', 'tula', 'cuca', 'pussy', 'vagina'];
handler.tags = ['fun'];
handler.command = /^(chichis|altura|poto|culo|infiel|putito|putitoo|putito2|tula|cuca|pussy|vagina)$/i;

export default handler;
