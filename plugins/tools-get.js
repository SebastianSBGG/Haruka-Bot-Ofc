import fetch from 'node-fetch';

const handler = async (m, { text }) => {
  if (!text) {
    return m.reply(
      '⚠️ Ejemplo de uso:\n' +
      '.get <url_api>'
    );
  }

  try {
    const respuesta = await fetch(text);
    const datos = await respuesta.json();
    const formateado = JSON.stringify(datos, null, 2);
    await m.reply(`*Respuesta de la API:*\n\`\`\`json\n${formateado}\n\`\`\``);
  } catch (err) {
    console.error(err);
    await m.reply(
      '❌ Error al obtener datos de la API. ' +
      'Asegúrate de que la URL sea válida y que la respuesta sea JSON.'
    );
  }
};

handler.help = ['get <url>'];
handler.tags = ['tools'];
handler.command = ['get2'];
handler.limit = false;
handler.premium = false;

export default handler;
