import fs from 'fs';
import os from 'os';
import { join } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
  const emojiScale    = '⚖️';
  const emojiAlert    = '❗';
  const emojiVideo    = '🎥';
  const emojiExercise = '💪';
  const emojiRecipe   = '🥗';

  // 1) Validación de entrada
  if (!text) {
    return conn.reply(
      m.chat,
      `${emojiAlert} *Por favor indica tu peso en kilogramos.*\nEjemplo:\n*${command} 75kg*`,
      m
    );
  }

  // 2) Parseo de número (enteros y decimales, coma o punto)
  const match = text.trim().toLowerCase().match(/\d+(?:[\.,]\d+)?/);
  if (!match) {
    return conn.reply(
      m.chat,
      `${emojiAlert} *Formato no reconocido.*\nUso: *${command} 68kg* o *${command} 68.5kg*`,
      m
    );
  }
  const peso = parseFloat(match[0].replace(',', '.'));
  if (isNaN(peso) || peso <= 0) {
    return conn.reply(m.chat, `${emojiAlert} *Peso inválido.*`, m);
  }

  // 3) Lógica según peso
  if (peso >= 80) {
    // := 80kg ➞ convierte video a GIF animado y envía GIF + audio
    const videoUrl = 'https://files.catbox.moe/6yckz9.mp4';
    const audioUrl = 'https://files.catbox.moe/lv50ha.opus';
    const tmpVideo = join(os.tmpdir(), `video-${Date.now()}.mp4`);
    const tmpGif   = join(os.tmpdir(), `gif-${Date.now()}.mp4`); // Cambiado a .mp4 para mejor compatibilidad

    try {
      // Descargar video
      const res = await fetch(videoUrl);
      if (!res.ok) throw new Error('Error al descargar video');
      const vidBuf = await res.arrayBuffer();
      fs.writeFileSync(tmpVideo, Buffer.from(vidBuf));

      // Convertir con ffmpeg (optimizado para WhatsApp)
      await new Promise((resolve, reject) => {
        ffmpeg(tmpVideo)
          .outputOptions([
            '-vf', 'fps=15,scale=320:-1:flags=lanczos',
            '-t', '8',
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart'
          ])
          .save(tmpGif)
          .on('end', resolve)
          .on('error', reject);
      });

      // Enviar video como GIF
      const caption = `${emojiScale} *Tu peso:* ${peso.toFixed(1)} kg\n\n${emojiVideo} *¡DALE PUTO GORD@ HACE EJERCICIO!*`;
      
      // Opción 1: Enviar desde el archivo local
      await conn.sendMessage(
        m.chat,
        {
          video: fs.readFileSync(tmpGif),
          caption: caption,
          gifPlayback: true
        },
        { quoted: m }
      );

      // Enviar audio motivacional
      await conn.sendMessage(
        m.chat,
        { audio: { url: audioUrl }, mimetype: 'audio/mpeg' },
        { quoted: m }
      );
    } catch (error) {
      console.error('Error en la conversión:', error);
      
      // Plan de respaldo: enviar el video original como GIF
      const caption = `${emojiScale} *Tu peso:* ${peso.toFixed(1)} kg\n\n${emojiVideo} *¡DALE PUTO GORD@ HACE EJERCICIO!*`;
      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption: caption,
          gifPlayback: true
        }, 
        { quoted: m }
      );
      
      // Enviar audio motivacional
      await conn.sendMessage(
        m.chat,
        { audio: { url: audioUrl }, mimetype: 'audio/mpeg' },
        { quoted: m }
      );
    } finally {
      // Limpieza
      if (fs.existsSync(tmpVideo)) fs.unlinkSync(tmpVideo);
      if (fs.existsSync(tmpGif)) fs.unlinkSync(tmpGif);
    }
    return;
  }

  // < 80kg: sugiere ejercicios y recetas
  const ejercicios = [
    // Cardio
    '30 min de caminata rápida',
    '20 min de trote ligero',
    '15 min de salto de cuerda',
    '30 min de natación',
    '20 min de bicicleta estática',
    '15 min de HIIT (entrenamiento de alta intensidad)',
    '30 min de elíptica',
    '20 min de remo',
    '30 min de zumba',
    '20 min de baile aeróbico',
    '15 min de sprints intercalados',
    '25 min de kickboxing',
    '30 min de patinaje',
    '20 min de step',
    '15 min de jumping jacks',
    '30 min de carrera continua',
    '20 min de escalador',
    '30 min de aquagym',
    '15 min de saltos al cajón',
    '20 min de aeróbicos',
    
    // Fuerza
    '3 series de 12 sentadillas',
    '3 series de 10 flexiones',
    '3 series de 15 abdominales',
    '3 series de 12 zancadas alternas',
    '3 series de 10 dominadas',
    '3 series de 12 peso muerto',
    '3 series de 15 elevaciones de cadera',
    '3 series de 10 fondos de tríceps',
    '3 series de 12 curl de bíceps',
    '3 series de 15 elevaciones laterales',
    '3 series de 12 press de hombros',
    '3 series de 10 remos con mancuerna',
    '3 series de 12 extensiones de tríceps',
    '3 series de 15 abdominales oblicuos',
    '3 series de 10 burpees',
    '3 series de 12 mountain climbers',
    '3 series de 10 press de banca',
    '3 series de 15 elevaciones de pantorrilla',
    '3 series de 12 hip thrust',
    '3 series de 15 crunch abdominales',
    
    // Equilibrio y flexibilidad
    '20 min de yoga dinámico',
    '15 min de estiramientos generales',
    '20 min de pilates',
    '15 min de tai chi',
    '10 min de equilibrio sobre una pierna',
    '15 min de ejercicios de movilidad articular',
    '20 min de yoga restaurativo',
    '10 min de planchas isométricas',
    '15 min de estiramientos para espalda',
    '20 min de yoga para principiantes',
    '15 min de foam roller para recuperación',
    '10 min de ejercicios de propiocepción',
    '20 min de stretching dinámico',
    '15 min de yoga para flexibilidad',
    '10 min de equilibrio con fitball',
    '15 min de ejercicios de respiración profunda',
    '20 min de barre fitness',
    '15 min de estiramientos para isquiotibiales',
    '10 min de ejercicios para postura',
    '15 min de movilidad de caderas',
    
    // Funcionales
    'Circuito de abdominales (3x15)',
    'Plancha 1min (3x)',
    'Tabata de 4 minutos (20s trabajo/10s descanso)',
    'Circuito de cuerpo completo (3 rondas)',
    'Entrenamiento en escalera (aumentar repeticiones)',
    'Circuito de 7 minutos a máxima intensidad',
    'Entrenamiento con kettlebell (3x10)',
    'Circuito metabólico (30s por ejercicio)',
    'Entrenamiento en superseries (sin descanso)',
    'Rutina de calistenia básica',
    'Circuito de resistencia muscular',
    'Entrenamiento en pirámide descendente',
    'Circuito de intervalos de potencia',
    'Entrenamiento funcional con TRX',
    'Circuito de glúteos y piernas',
    'Entrenamiento con bandas elásticas',
    'Circuito core en suelo',
    'Rutina fullbody de 20 minutos',
    'Circuito de cardio y tonificación',
    'Entrenamiento con peso corporal',
    
    // Específicos
    '2 km de trote suave',
    '50 jumping jacks',
    '20 zancadas alternas por pierna',
    '30 abdominales rusos',
    '15 flexiones diamante',
    '30 sentadillas sumo',
    '20 mountain climbers por pierna',
    '15 burpees completos',
    '40 elevaciones de talones',
    '25 tijeras con salto',
    '15 pullups asistidos',
    '30 abdominales bicicleta',
    '20 flexiones hindú',
    '15 pistol squat (sentadillas a una pierna)',
    '25 pasos de oso',
    '30 segundos de saltos de estrella',
    '20 buenos días (hip hinge)',
    '15 flexiones pike',
    '30 abdominales en V',
    '20 saltos de rana',
    
    // Deportes
    '30 min de fútbol recreativo',
    '45 min de baloncesto',
    '60 min de vóley playa',
    '30 min de tenis',
    '45 min de paddel',
    '60 min de escalada',
    '30 min de squash',
    '45 min de bádminton',
    '60 min de senderismo',
    '30 min de esquí de fondo',
    '45 min de hockey',
    '60 min de surf',
    '30 min de golf caminando',
    '45 min de rugby touch',
    '30 min de skateboarding',
    '45 min de entrenamiento en circuito',
    '60 min de ultimate frisbee',
    '30 min de handball',
    '45 min de waterpolo',
    '30 min de parkour básico'
  ];
  
  const recetas = [
    // Desayunos
    'Tostada integral con aguacate y huevo',
    'Batido verde (espinaca y plátano) con chía',
    'Tazón de yogur griego con frutas y nueces',
    'Avena overnight con leche vegetal y frutas',
    'Tortilla de claras con espinacas y champiñones',
    'Pancakes de avena y plátano',
    'Tostada de salmón ahumado con queso cottage',
    'Smoothie bowl de açaí con granola casera',
    'Huevos revueltos con tomate y espinacas',
    'Bowl de chía con leche de almendras y frutas',
    'Wrap de pavo con lechuga y tomate',
    'Muffins de huevo con verduras',
    'Tostada de hummus con tomate y semillas',
    'Batido proteico con frutas del bosque',
    'Granola casera con yogur natural',
    'Revuelto de tofu con cúrcuma y verduras',
    'Panqueques integrales con compota de manzana',
    'Porridge de quinoa con canela y manzana',
    'Frittata de vegetales al horno',
    'Bowl de kéfir con frutas y semillas',
    
    // Almuerzos
    'Ensalada de quinoa con vegetales y pollo',
    'Salmón al horno con brócoli y limón',
    'Pechuga de pollo a la plancha con ensalada',
    'Wrap integral de pavo y vegetales',
    'Buddha bowl con garbanzos y aguacate',
    'Sopa de lentejas y verduras',
    'Ensalada de garbanzos y tomate cherry',
    'Pasta integral con verduras salteadas',
    'Cuscús con pollo y vegetales asados',
    'Tortilla española con cebolla y calabacín',
    'Bowl de arroz integral con atún y aguacate',
    'Ensalada griega con queso feta bajo en grasa',
    'Sopa de calabaza con jengibre',
    'Tacos de pescado con repollo y yogur',
    'Revuelto de quinoa con verduras',
    'Hamburguesa de pavo con pan integral',
    'Wok de tofu con verduras y salsa de soja baja en sodio',
    'Ensalada de atún con judías verdes',
    'Crema de zanahoria con crutones integrales',
    'Rollitos de pavo rellenos de hummus',
    
    // Cenas
    'Omelette de claras con espinacas',
    'Sándwich integral de atún y espinaca',
    'Poke bowl de salmón con arroz integral',
    'Ensalada de lentejas con queso de cabra',
    'Brochetas de pavo con verduras',
    'Crema de calabacín sin nata',
    'Dorada al horno con hierbas y limón',
    'Revuelto de champiñones con ajo y perejil',
    'Sopa miso con tofu y algas',
    'Ensalada templada de quinoa y vegetales',
    'Tortilla de berenjena y cebolla',
    'Hamburguesa de lentejas con ensalada',
    'Wok de gambas con brócoli',
    'Berenjenas rellenas de carne magra',
    'Filete de merluza al vapor con verduras',
    'Gazpacho tradicional bajo en aceite',
    'Pizza casera con base de coliflor',
    'Pollo al curry ligero con arroz basmati',
    'Calabacines rellenos de quinoa y verduras',
    'Ensalada de espinacas con pollo y fresas',
    
    // Snacks
    'Hummus casero con palitos de zanahoria',
    'Apple con mantequilla de almendras',
    'Puñado de frutos secos naturales (30g)',
    'Yogur griego con miel y canela',
    'Rollitos de pavo con pepino',
    'Edamame salteado con limón',
    'Palitos de apio con queso cottage',
    'Chips de kale horneados',
    'Tomates cherry con mozzarella light',
    'Smoothie de proteínas casero',
    'Huevo duro con sal marina',
    'Palomitas naturales sin mantequilla',
    'Rodajas de pepino con hummus',
    'Batido de plátano y espinacas',
    'Barritas energéticas caseras',
    'Rebanada de pan integral con aguacate',
    'Gelatina natural con frutas',
    'Yogur helado con frutas del bosque',
    'Chips de manzana horneados',
    'Salsa de yogur con verduras',
    
    // Ensaladas
    'Ensalada César con pollo a la plancha',
    'Ensalada de espinacas con fresas y nueces',
    'Ensalada de rúcula con parmesano y limón',
    'Ensalada de kale, quinoa y aguacate',
    'Ensalada nicoise con atún fresco',
    'Ensalada de pasta integral con pesto ligero',
    'Ensalada de bulgur con hierbas y cítricos',
    'Ensalada waldorf con yogur en vez de mayonesa',
    'Ensalada de col con manzana y zanahoria',
    'Ensalada de aguacate, mango y camarones',
    'Ensalada mediterránea con garbanzos',
    'Ensalada de lentejas con verduras asadas',
    'Ensalada tailandesa con edamame',
    'Ensalada griega con orégano fresco',
    'Ensalada de pollo con uvas y apio',
    'Ensalada de brotes con semillas tostadas',
    'Ensalada de quinoa con verduras arcoíris',
    'Ensalada caprese con tomates cherry',
    'Ensalada de pepino, eneldo y yogur',
    'Ensalada de frijoles negros con maíz',
    
    // Sopas y cremas
    'Caldo de verduras con fideos integrales',
    'Crema de espárragos sin nata',
    'Sopa minestrone con judías blancas',
    'Crema de calabaza y jengibre',
    'Sopa de pollo con verduras',
    'Crema de champiñones ligera',
    'Sopa de pescado y azafrán',
    'Crema de brócoli con almendras',
    'Sopa de miso con algas y tofu',
    'Crema de guisantes con menta',
    'Sopa de frijoles negros con cilantro',
    'Crema de zanahoria y cúrcuma',
    'Sopa de cebolla gratinada light',
    'Crema de coliflor y ajo asado',
    'Sopa de lentejas rojas con limón',
    'Crema de apio y manzana verde',
    'Sopa de tomate casera con albahaca',
    'Crema de boniato con canela',
    'Sopa de verduras al curry',
    'Caldo depurativo de verduras y jengibre',
    
    // Guisos y platos principales
    'Chili sin carne con verduras y legumbres',
    'Curry de garbanzos con espinacas',
    'Estofado de pavo con verduras',
    'Dahl de lentejas rojas con cúrcuma',
    'Guiso de sepia con guisantes',
    'Ragú de champiñones con polenta',
    'Pollo al limón con hierbas provenzales',
    'Berenjena rellena de carne magra y verduras',
    'Bacalao al horno con tomate y cebolla',
    'Potaje de garbanzos con espinacas',
    'Pisto manchego con huevo escalfado',
    'Conejo estofado con verduras',
    'Caldereta de pescado blanco',
    'Legumbres con verduras de temporada',
    'Lomo de cerdo al horno con manzana',
    'Arroz integral con verduras al curry',
    'Carne magra guisada con zanahorias',
    'Pulpo a la gallega con patata cocida',
    'Pollo tikka masala versión ligera',
    'Pimientos rellenos de quinoa y pavo'
  ];

  const pick = (arr, n = 4) => arr.sort(() => Math.random() - 0.5).slice(0, n);
  const selEj = pick(ejercicios);
  const selRec = pick(recetas);

  const msg = `${emojiScale} *Tu peso:* ${peso.toFixed(1)} kg\n\n` +
               `${emojiExercise} *Ejercicios:*\n• ${selEj.join('\n• ')}\n\n` +
               `${emojiRecipe} *Recetas:*\n• ${selRec.join('\n• ')}`;

  return await conn.reply(m.chat, msg, m, { mentions: conn.parseMention(msg) });
};

handler.help     = ['peso <número>kg'];
handler.tags     = ['health', 'fun'];
handler.command  = ['peso'];
handler.group    = true;
handler.register = true;

export default handler;