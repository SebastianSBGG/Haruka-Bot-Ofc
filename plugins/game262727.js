const palabrasDesordenadas = [
    { question: "Ordena la palabra: IDCMOA", response: "COMIDA" },
    { question: "Ordena la palabra: CEHLEUP", response: "PELUCHE" },
    { question: "Ordena la palabra: PATLPO", response: "LAPTOP" }, 
    { question: "Ordena la palabra: ÁIPDOR", response: "RÁPIDO" },
    { question: "Ordena la palabra: PÁZLI", response: "LÁPIZ" },
    { question: "Ordena la palabra: LDEUC", response: "DULCE" },
    { question: "Ordena la palabra: CSÚMIA", response: "MÚSICA" },
    { question: "Ordena la palabra: EMÍITL", response: "LÍMITE" },
    { question: "Ordena la palabra: MRÁACA", response: "CÁMARA" },
    { question: "Ordena la palabra: TORTARE", response: "RETRATO" },
    { question: "Ordena la palabra: CÉHILE", response: "HÉLICE" },
    { question: "Ordena la palabra: NELUT", response: "TÚNEL" },
    { question: "Ordena la palabra: ARBÑA", response: "BAÑAR" },
    { question: "Ordena la palabra: ANJRMA", response: "MANJAR" },
    { question: "Ordena la palabra: STICHE", response: "CHISTE" },
    { question: "Ordena la palabra: USEOQB", response: "BOSQUE" },
    { question: "Ordena la palabra: IRTGAR", response: "GRITAR" },
    { question: "Ordena la palabra: ELUOCL", response: "CUELLO" },
    { question: "Ordena la palabra: ÍNDARJ", response: "JARDÍN" },
    { question: "Ordena la palabra: ECAMTA", response: "MACETA" },
    { question: "Ordena la palabra: UGPLAR", response: "PULGAR" },
    { question: "Ordena la palabra: RECRAR", response: "CERRAR" },
    { question: "Ordena la palabra: HULCRA", response: "LUCHAR" },
    { question: "Ordena la palabra: NABCLO", response: "BLANCO" },
    { question: "Ordena la palabra: ARLBILR", response: "BRILLAR" },
    { question: "Ordena la palabra: ILBORL", response: "BRILLO" },
    { question: "Ordena la palabra: ECZAIN", response: "CENIZA" },
    { question: "Ordena la palabra: MOSRBA", response: "SOMBRA" },
    { question: "Ordena la palabra: RSEETU", response: "SUERTE" },
    { question: "Ordena la palabra: NICBOA", response: "BOCINA" },
    { question: "Ordena la palabra: AFRAIJ", response: "JIRAFA" },
    { question: "Ordena la palabra: HCCOEH", response: "COCHE" },
    { question: "Ordena la palabra: SMAUPE", response: "ESPUMA" },
    { question: "Ordena la palabra: AMRATP", response: "TRAMPA" },
    { question: "Ordena la palabra: TLAFUA", response: "FLAUTA" },
    { question: "Ordena la palabra: ARECDU", response: "CUERDA" },
    { question: "Ordena la palabra: AVODEN", response: "VENADO" },
    { question: "Ordena la palabra: REPOR", response: "PERRO" },
    { question: "Ordena la palabra: DLARLIA", response: "ARDILLA" },
    { question: "Ordena la palabra: CDRUAO", response: "CUADRO" },
    { question: "Ordena la palabra: PRUECO", response: "CUERPO" },
    { question: "Ordena la palabra: OLEBATL", response: "BOTELLA" },
    { question: "Ordena la palabra: PAMLRAA", response: "LAMPARA" },
    { question: "Ordena la palabra: FERPUEM", response: "PERFUME" },
    { question: "Ordena la palabra: SCODI", response: "DISCO" },
    { question: "Ordena la palabra: TANPIUR", response: "PINTURA" },
    { question: "Ordena la palabra: RUITGARA", response: "GUITARRA" },
    { question: "Ordena la palabra: TANMA", response: "MANTA" },
    { question: "Ordena la palabra: AMRARIO", response: "ARMARIO" },
    { question: "Ordena la palabra: CLIOABEBIT", response: "BIBLIOTECA" },
    { question: "Ordena la palabra: RRILIABE", response: "LIBRERIA" },
    { question: "Ordena la palabra: CSELEUA", response: "ESCUELA" },
    { question: "Ordena la palabra: IVERUSDDAIN", response: "UNIVERSIDAD" },
    { question: "Ordena la palabra: TARUEP", response: "PUERTA" },
    { question: "Ordena la palabra: JOEESP", response: "ESPEJO" },
    { question: "Ordena la palabra: ENAATNV", response: "VENTANA" },
    { question: "Ordena la palabra: TIBBSCOMULE", response: "COMBUSTIBLE" },
    { question: "Ordena la palabra: LATAPN", response: "PLANTA" },
    { question: "Ordena la palabra: DOCAMER", response: "MERCADO" },
    { question: "Ordena la palabra: CARMADOR", response: "MARCADOR" },
    { question: "Ordena la palabra: PLTARNAE", response: "PARLANTE" },
    { question: "Ordena la palabra: LARCLUE", response: "CELULAR" },
    { question: "Ordena la palabra: PUTDAOCOMRA", response: "COMPUTADORA" },
    { question: "Ordena la palabra: TERNEF", response: "FERNET" },
    { question: "Ordena la palabra: ULCICHLO", response: "CUCHILLO" },
    // Más palabras aquí...
];

const gam = new Map();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let handler = async (m, { conn }) => {
    let users = global.db.data.users[m.sender];
    let palabra = palabrasDesordenadas[Math.floor(Math.random() * palabrasDesordenadas.length)];
    gam.set(m.sender, palabra.response.toLowerCase());
    conn.reply(m.chat, `*• Ordena la palabra:* \n\n${palabra.question}`, m);
};

handler.before = async (m, { conn }) => {
    let users = global.db.data.users[m.sender];
    let palabra = gam.get(m.sender);
    if (!palabra) return;

    if (m.text.toLowerCase() === palabra) {
        const premio = ['2000', '3000', '1000'];
        const prems = [7, 10, 15, 20, 5];
        const fee = prems[Math.floor(Math.random() * prems.length)];
        const ramdon = premio[Math.floor(Math.random() * premio.length)];
        users.exp += parseInt(ramdon);
        users.limit += fee;
        conn.reply(m.chat, `*• ¡Correcto! Has ganado:*\n- ${ramdon} XP\n- ${fee} Coins 💰`, m);
        gam.delete(m.sender);
    } else if (m.text.toLowerCase() === 'stop') {
        conn.reply(m.chat, `*• La respuesta correcta era:* ${palabrasDesordenadas.find(p => p.response.toLowerCase() === palabra).response}`, m);
        gam.delete(m.sender);
    } else {
        conn.reply(m.chat, `*• Incorrecto.* Intenta de nuevo o escribe *stop* para rendirte.`, m);
    }
};

handler.help = ['ordenapalabra'];
handler.tags = ['game'];
handler.command = ['ordena'];

export default handler;
