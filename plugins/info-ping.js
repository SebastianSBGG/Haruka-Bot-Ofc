import os from 'os';
import { performance } from 'perf_hooks';
import moment from 'moment-timezone';

let handler = async (m, { conn }) => {
    let start = performance.now();
    await new Promise(resolve => setTimeout(resolve, 100)); // Simula una pequeña espera
    let end = performance.now();
    let speed = (end - start).toFixed(4);

    let uptime = moment.duration(process.uptime(), 'seconds');
    let formattedUptime = `${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s`;

    let totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
    let freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
    let usedMem = (totalMem - freeMem).toFixed(2);

    let thumbnail = "https://telegra.ph/file/ec8cf04e3a2890d3dce9c.jpg";

    let messageContent = {
        text: `*「 ESTADO DEL BOT 」*\n\n` +
              `🚀 *Velocidad:* ${speed} ms\n` +
              `⏱️ *Tiempo activo:* ${formattedUptime}\n` +
              `💾 *RAM usada:* ${usedMem} MB / ${totalMem} MB`,
        contextInfo: {
            externalAdReply: {
                title: "Estado",
                body: "Información en tiempo real",
                thumbnailUrl: thumbnail,
                sourceUrl: "https://telegra.ph/file/ec8cf04e3a2890d3dce9c.jpg",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    };

    await conn.sendMessage(m.chat, messageContent, { quoted: m });
};

handler.help = ['ping'];
handler.tags = ['info'];
handler.command = /^(ping|velocidad|estado|speed|p)$/i;

export default handler;
