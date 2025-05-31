import moment from "moment-timezone";
import axios from "axios";
import fs from 'fs/promises';
import path from 'path';
import { getBotName } from '../lib/getBotName.js';

let handler = async (m, { conn }) => {
  // Obtener nombre dinámico del bot
  const botName = await getBotName(conn);

  // Formatear hora a 12 horas con AM/PM
  const formatTime12Hours = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const formattedHours = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // Zonas horarias a mostrar
  const zonas = {
    "🇲🇦 Hora en Casablanca, África":       "Africa/Casablanca",
    "🇵🇪 Hora en Lima, Perú":               "America/Lima",
    "🇨🇱 Hora en Santiago, Chile":         "America/Santiago",
    "🇦🇷 Hora en Buenos Aires, Argentina": "America/Argentina/Buenos_Aires",
    "🇪🇸 Hora en Madrid, España":          "Europe/Madrid",
    "🇵🇾 Hora en Asunción, Paraguay":      "America/Asuncion",
    "🇲🇽 Hora en Ciudad de México, México": "America/Mexico_City",
    "🇨🇴 Hora en Bogotá, Colombia":        "America/Bogota",
    "🇻🇪 Hora en Caracas, Venezuela":      "America/Caracas",
    "🇨🇺 Hora en La Habana, Cuba":         "America/Havana",
    "🇪🇨 Hora en Guayaquil, Ecuador":      "America/Guayaquil",
    "🇧🇴 Hora en La Paz, Bolivia":          "America/La_Paz",
    "🇺🇾 Hora en Montevideo, Uruguay":     "America/Montevideo",
    "🇭🇳 Hora en Tegucigalpa, Honduras":    "America/Tegucigalpa",
    "🇳🇮 Hora en Managua, Nicaragua":      "America/Managua",
    "🇬🇹 Hora en Ciudad de Guatemala":     "America/Guatemala",
    "🇨🇷 Hora en San José, Costa Rica":    "America/Costa_Rica",
    "🇩🇴 Hora en Santo Domingo":           "America/Santo_Domingo",
    "🇵🇷 Hora en San Juan, Puerto Rico":    "America/Puerto_Rico"
  };

  // Construir mensaje de horas
  let clockString = '';
  for (const [label, tz] of Object.entries(zonas)) {
    const hora = formatTime12Hours(moment().tz(tz).format('HH:mm'));
    clockString += `${label}: ${hora}\n─────────────────\n`;
  }

  // Verificar si es un sub-bot o el bot principal
  const isSub = global.conn !== conn;
  const botJid = conn.user.jid;
  const botNumber = botJid.split('@')[0];

  // Leer configuración de banners desde JSON
  const jsonPath = path.resolve('./src/database/db.json');
  let bannerURL;

  try {
    const data = await fs.readFile(jsonPath, 'utf-8');
    const jsonData = JSON.parse(data);

    if (isSub && jsonData.subBots && jsonData.subBots[botNumber]) {
      bannerURL = jsonData.subBots[botNumber].imagen;
      if (jsonData.subBots[botNumber].nombre) {
        // Si el JSON define un nombre específico, usarlo
      }
    } else if (jsonData.links?.imagen?.length) {
      bannerURL = jsonData.links.imagen[0];
    } else {
      bannerURL = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://files.catbox.moe/ysucs5.jpg');
    }
  } catch (error) {
    console.error('Error al leer el JSON de banners:', error);
    bannerURL = await conn.profilePictureUrl(m.sender, 'image')
      .catch(() => 'https://files.catbox.moe/ysucs5.jpg');
  }

  try {
    // Descargar y enviar el banner con las horas
    const responseImg = await axios.get(bannerURL, { responseType: 'arraybuffer' });
    await conn.sendFile(
      m.chat,
      responseImg.data,
      'banner.jpg',
      `${clockString}\n\n👑 .〔 ${botName} 〕`,
      m
    );
    await m.react('✅');
  } catch (err) {
    console.error(err);
    await m.reply('Hubo un error al enviar la imagen.');
  }
};

handler.help = ['hora'];
handler.tags = ['tools'];
handler.command = /^(hora)$/i;
handler.register = true;

export default handler;
