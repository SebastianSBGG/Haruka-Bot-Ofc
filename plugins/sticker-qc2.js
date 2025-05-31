import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const handler = async (m, { conn, args, name }) => {
    let texto;
    let colorApi = '#000000'; // color por defecto

    if (args.length >= 1) {
        const entrada = args.join(" ").split("|");
        if (entrada.length === 2) {
            const nombreColor = entrada[0].trim().toLowerCase();
            texto = entrada[1].trim();

            const mapaColores = {
                'blanco': '#FFFFFF',
                'verde': '#00FF00',
                'amarillo': '#FFFF00',
                'negro': '#000000',
                'rojo': '#FF0000',
                'azul': '#0000FF',
                'morado': '#800080',
                'naranja': '#FFA500',
                'rosa': '#FFC0CB',
                'gris': '#808080',
                'marrón': '#A52A2A',
                'cian': '#00FFFF',
                'magenta': '#FF00FF',
                'granate': '#800000',
                'marino': '#000080',
                'oliva': '#808000',
                'plata': '#C0C0C0',
                'verdeazulado': '#008080',
                'turquesa': '#40E0D0',
                'violeta': '#EE82EE',
                'salmón': '#FA8072',
                'oro': '#FFD700',
                'índigo': '#4B0082',
                'lima': '#00FF00',
                'celeste': '#87CEEB',
                'bronceado': '#D2B48C',
                'orquídea': '#DA70D6',
                'coral': '#FF7F50'
            };

            colorApi = mapaColores[nombreColor] || colorApi;
        } else {
            throw obtenerMensajeErrorFormato();
        }
    } else if (m.quoted && m.quoted.text) {
        texto = m.quoted.text;
    } else {
        throw obtenerMensajeErrorFormato();
    }

    if (!texto) return m.reply('Por favor, ingresa un texto.');
    if (texto.length > 100) return m.reply('El texto no puede tener más de 100 caracteres.');

    const fotoPerfil = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/320b066dc81928b782c7b.png');

    const objeto = {
        type: "quote",
        format: "png",
        backgroundColor: colorApi,
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
            entities: [],
            avatar: true,
            from: {
                id: 1,
                name: name || m.pushName || "Usuario",
                photo: { url: fotoPerfil }
            },
            text: texto,
            replyMessage: {}
        }]
    };

    try {
        const respuesta = await axios.post('https://btzqc.betabotz.eu.org/generate', objeto, {
            headers: { 'Content-Type': 'application/json' }
        });
        const buffer = Buffer.from(respuesta.data.result.image, 'base64');
        const stiker = await sticker(buffer, false, global.stickpack, global.stickauth);
        if (stiker) return conn.sendFile(m.chat, stiker, 'Cita.webp', '', m);
    } catch (error) {
        console.error(error);
        throw "Ocurrió un error al crear el sticker.";
    }
}

function obtenerMensajeErrorFormato() {
    return `Formato incorrecto. Ejemplo de uso: .qc2 color| texto
[ 乂 L I S T A  D E  C O L O R E S 乂 ]

Blanco
Verde
Amarillo
Negro
Rojo
Azul
Morado
Naranja
Rosa
Gris
Marrón
Cian
Magenta
Granate
Marino
Oliva
Plata
Verdeazulado
Turquesa
Violeta
Salmón
Oro
Índigo
Lima
Celeste
Bronceado
Orquídea
Coral
`;
}

handler.help = ['qc2 <color>|<texto>'];
handler.tags = ['sticker', 'premium'];
handler.command = /^(fakechat2|qc2)$/i;
handler.premium = false;
handler.onlyprem = false;

export default handler;
