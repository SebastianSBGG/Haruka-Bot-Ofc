// Expresión regular para detectar diferentes tipos de enlaces prohibidos
const linkRegex = /(chat\.whatsapp\.com\/|whatsapp\.com\/channel\/|t\.me\/|telegram\.me\/|youtube\.com\/|youtu\.be\/)/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
    // Verifica si el mensaje es de un grupo y si el usuario tiene permisos especiales
    if (!m.isGroup || isAdmin || isOwner || isROwner || m.fromMe) return;

    let chat = global.db.data.chats[m.chat];
    
    // Si el anti-link está desactivado o el mensaje no contiene un link prohibido, no hacer nada
    if (!chat.antiLink || !linkRegex.test(m.text)) return;

    try {
        // Elimina el mensaje y expulsa al usuario en paralelo para mayor rapidez
        await Promise.all([
            conn.sendMessage(m.chat, { delete: m.key }),
            isBotAdmin ? conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove') : null
        ]);
    } catch (e) {
        console.error('Error eliminando mensaje o usuario:', e);
    }

    return;
}
