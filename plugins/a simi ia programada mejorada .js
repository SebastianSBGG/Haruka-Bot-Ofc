import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '¡Hola! 😊 Por favor, ingresa un texto para hablar conmigo.', m);

    try {
        // Usamos la función fetch de manera eficiente
        const api = fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(text)}`).then(res => res.json());

        api.then(json => {
            if (json.status === 'true' && json.result) {
                conn.sendMessage(m.chat, { text: json.result }, { quoted: m });
            } else {
                conn.reply(m.chat, '¡Ups! No pude encontrar una respuesta válida. ¿Podrías intentar de nuevo?', m);
            }
        }).catch(error => {
            console.error('Error al obtener respuesta de Simi:', error); // Log para depuración
            conn.reply(m.chat, '¡Oh no! Algo salió mal al contactar con la API. Inténtalo más tarde. 😊', m);
        });
    } catch (error) {
        console.error('Error inesperado:', error); // Log para depuración
        conn.reply(m.chat, '¡Oh no! Algo salió mal al procesar tu solicitud.', m);
    }
};

// Configuración para que funcione con la palabra "Simi"
handler.customPrefix = /\b[Hh]akaru\b/; // Activa el comando si el mensaje contiene "Simi"
handler.command = new RegExp(); // Sin prefijo específico

export default handler;
