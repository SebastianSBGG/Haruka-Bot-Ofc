import { randomBytes } from 'crypto';

const handler = async (m, { conn, text, groupMetadata }) => {
  // Verifica si el mensaje proviene del creador del bot
  const botCreator = '522219831926@s.whatsapp.net'; // Reemplaza con tu número de WhatsApp
  if (m.sender !== botCreator) {
    return conn.reply(m.chat, '*『❌』Solo el creador del bot puede usar este comando.*', m);
  }

  // Verifica si se proporcionó un mensaje
  if (!text) throw '*『💬』Ingrese un mensaje para enviar a todos los grupos.*';

  // Obtiene el nombre del usuario (creador del bot)
  const name = await conn.getName(m.sender);

  // Obtiene la lista de grupos
  const groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce)
    .map((v) => v[0]);

  // Prepara el mensaje
  const teks = `*MENSAJE DEL CREADOR:*\n\n*Nombre:* ${name}\n*Mensaje:* ${text}`;

  // Envía el mensaje a todos los grupos
  for (const id of groups) {
    await conn.sendMessage(id, { text: teks });
  }

  // Confirma que el mensaje se envió
  await conn.reply(m.chat, '*『✅』Mensaje enviado a todos los grupos.*', m);
};

// Define el comando y restricciones
handler.command = /^(msg)$/i;
handler.owner = true; // Solo el propietario puede usar el comando
export default handler;

// Función para generar un ID aleatorio
const randomID = (length) => randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length);