import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix }) => {
    // Emojis y mensajes para personalizar respuestas
    const emojiPeticion = '🎨';
    const emojiProcesando = '⏳';
    const emojiError = '❌';
    
    // Verificar si se proporcionó un prompt
    if (!args[0]) {
        await conn.reply(m.chat, `${emojiPeticion} Por favor, proporciona una descripción para generar la imagen.\n\nEjemplo: ${usedPrefix}magic un gato con sombrero`, m);
        return;
    }

    const prompt = encodeURIComponent(args.join(' '));
    const apiUrl = `https://apidl.asepharyana.cloud/api/ai/text2img?prompt=${prompt}`;

    try {
        // Mensaje de procesamiento
        const waitMsg = await conn.reply(m.chat, `${emojiProcesando} Generando imagen con la descripción: "${args.join(' ')}".\nEsto puede tomar unos momentos...`, m);

        // Realizar la solicitud a la API con timeout
        const response = await axios.get(apiUrl, { 
            responseType: 'arraybuffer',
            timeout: 60000 // 60 segundos de timeout
        });

        // Verificar si la respuesta contiene datos válidos
        if (!response.data || response.data.length < 100) {
            throw new Error('La API devolvió datos incorrectos o vacíos');
        }

        // Enviar la imagen generada
        await conn.sendMessage(m.chat, { 
            image: Buffer.from(response.data),
            caption: `✨ *Imagen generada con IA*\n📝 Prompt: ${args.join(' ')}` 
        }, { quoted: m });

        // Eliminar mensaje de espera
        try {
            await conn.sendMessage(m.chat, { delete: waitMsg.key });
        } catch (deleteError) {
            console.log('No se pudo eliminar el mensaje de espera');
        }
    } catch (error) {
        console.error('Error completo al generar la imagen:', error);
        
        // Mensaje de error personalizado según el tipo de error
        let errorMsg = `${emojiError} `;
        
        if (error.code === 'ECONNABORTED') {
            errorMsg += 'La generación de la imagen tomó demasiado tiempo. Intenta nuevamente.';
        } else if (error.response) {
            // Error de respuesta de la API
            errorMsg += `Error del servidor: ${error.response.status}. Intenta con un prompt diferente.`;
        } else if (error.request) {
            // Error de conexión
            errorMsg += 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else {
            // Otros errores
            errorMsg += 'No se pudo generar la imagen. Intenta con una descripción diferente.';
        }
        
        await conn.reply(m.chat, errorMsg, m);
    }
};

// Configuración del comando
handler.command = ['text2img', 'imagine', 'generar'];
handler.help = ['text2img <descripción>'];
handler.tags = ['ai', 'tools'];
handler.limit = true; // Si tienes un sistema de límites

export default handler;