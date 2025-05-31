let handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply(`📝 Ingresa un texto junto al comando.`)

    let apiUrl;
    switch (command) {
        case 'gun':
            apiUrl = `https://api.popcat.xyz/gun?image=https://cdn.popcat.xyz/popcat.png&text=${encodeURIComponent(text)}`;
            break;
        case 'biden':
            apiUrl = `https://api.popcat.xyz/biden?text=${encodeURIComponent(text)}`;
            break;
        case 'alert':
            apiUrl = `https://api.popcat.xyz/alert?text=${encodeURIComponent(text)}`;
            break;
        default:
            return m.reply('❌ Comando no válido.');
    }

    try {
        await conn.sendFile(m.chat, apiUrl, `${command}.jpg`, null, m);
    } catch (e) {
        console.error(e);
        m.reply('❌ Ocurrió un error al generar la imagen.');
    }
};

handler.help = ['gun <texto>', 'biden <texto>', 'alert <texto>'];
handler.tags = ['logo'];
handler.command = ['gun', 'biden', 'alert'];
handler.register = true;

export default handler;






