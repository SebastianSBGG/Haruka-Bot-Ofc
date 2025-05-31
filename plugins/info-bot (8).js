import fs from 'fs';

const handler = (m) => m;

handler.all = async function (m) {
    const chat = global.db.data.chats[m.chat];
    if (chat.isBaneed) return; // Evita responder si el chat está bloqueado.

    // Lista de frases y respuestas.
    const frases = new Map([
    ["buenos días", "¡Buenos días! Espero que tengas un excelente día"],
    ["bot", "¡Hola como estas soy un bot creado por Sebas Y tu Marido David"],
    ["como estas", "¡bien gracias por preguntar "],
    [".on welcome", "¡lo usaste mal ya que este bot tiene la configuración de primero welcome y despues el off y el on ejemplo welcome on"],
    ["buenas noches", "¡Buenas noches! Descansa mucho 😴"],
    ["gracias", "¡De nada! 😊"],
    ["te amo", "¡Yo también te quiero mucho! 💕"],
    ["de nada", "¡Eres muy amable! 😊"],
    ["te extraño", "¡Yo también te extraño! Espero que podamos hablar más seguido."],
    ["perdón", "No te preocupes, todo está bien."],
    ["me gusta", "¡Me alegra mucho!"],
    ["me saludas", "¡Hola! ¿Cómo estás? 😊"],
    ]);

    // Normaliza el texto del mensaje para que sea insensible a mayúsculas/minúsculas.
    const text = m.text.toLowerCase().trim();

    // Busca si el texto del mensaje coincide con alguna frase preprogramada.
    if (frases.has(text)) {
        const respuesta = frases.get(text);
        conn.reply(m.chat, respuesta, m); // Envía la respuesta al chat.
    }

    return true;
};

export default handler;
