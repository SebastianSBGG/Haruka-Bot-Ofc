import fs from 'fs';
import { promises as fsPromises } from 'fs';
import moment from 'moment';
import { getBotName } from '../lib/getBotName.js';

function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

// Función para crear el JSON por defecto si no existe
async function createDefaultDB() {
  const defaultDB = {
    "links": {
      "imagen": [
        "https://files.catbox.moe/8xhnpl.png"
      ]
    },
    "mainBot": {
      "nombre": "HARUKA BOT OFC"
    },
    "subBots": {}
  };
  
  const dbPath = './src/database/menucomp.json';
  
  try {
    // Verificar si el directorio existe, si no, crearlo
    const dir = './src/database';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Crear el archivo JSON si no existe
    if (!fs.existsSync(dbPath)) {
      await fsPromises.writeFile(dbPath, JSON.stringify(defaultDB, null, 2));
      console.log('Archivo db.json creado automáticamente');
    }
    
    return defaultDB;
  } catch (error) {
    console.error('Error creando DB por defecto:', error);
    return defaultDB;
  }
}

const handler = async (m, { conn, usedPrefix }) => {
  if (usedPrefix === 'a' || usedPrefix === 'A') return;

  try {
    // Obtener el nombre del bot usando la función importada
    const botName = await getBotName(conn);
    
    // Ajuste de zona horaria: +1 hora
    const d = new Date(Date.now() + 3600000);
    const locale = 'es';
    const currentMoment = moment().format('DD/MM/YY\nHH:mm:ss');

    // Uptime en milisegundos
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);

    // Actualizar datos desde la DB global y usuario
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered).length;

    // Datos del usuario y variables adicionales
    let taguser = conn.getName(m.sender);
    let user = global.db.data.users[m.sender];
    let botname = global.botname || 'MiBot';
    let totalreg = rtotalreg;
    // Variables para experiencia (ajusta estos valores según tu sistema)
    let minExp = user.minExp || 0;
    let xp = user.xpNext || 1000;
    let currentTime = new Date().toLocaleString(locale);
    let dev = ''; // Información del desarrollador, si aplica

    // Verificar si es un sub-bot o el bot principal
    const isSub = global.conn !== conn;
    const botJid = conn.user.jid;
    const botNumber = botJid.split('@')[0];

    // Cargar o crear el JSON para extraer el enlace de la imagen
    const jsonPath = './src/database/db.json';
    let db;
    
    try {
      db = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (error) {
      console.log('Archivo db.json no encontrado, creando uno nuevo...');
      db = await createDefaultDB();
    }
    
    let imageUrl;
    // Comprobar si es un sub-bot y tiene una imagen personalizada
    if (isSub && db.subBots && db.subBots[botNumber]) {
      // Si el sub-bot tiene su propia imagen, usarla
      if (db.subBots[botNumber].imagen) {
        imageUrl = db.subBots[botNumber].imagen;
      } else {
        // Si no tiene imagen propia, usar la imagen por defecto
        imageUrl = db.links.imagen?.[0] || "https://files.catbox.moe/8xhnpl.png";
      }
      
      // También podemos usar el nombre del sub-bot si está definido
      if (db.subBots[botNumber].nombre) {
        botname = db.subBots[botNumber].nombre;
      }
    } else {
      // Es el bot principal o un sub-bot sin configuración especial
      imageUrl = db.links.imagen?.[0] || "https://files.catbox.moe/8xhnpl.png";
    }

    // Definir el mensaje con información del bot y del usuario
    const str = `

 *Hola, ${taguser}* Gracias Por Su Preferencia

     ۬*PROYECTO ${botName} * 

     ٜ۪࣪۬*DESARROLLADOR » DAVIDvip(solft)
╭═┅═━━━━━━━━━━━━━━
┊•  BOT » ${(conn.user.jid === global.conn.user.jid ? 'Oficial' : 'Sub-Bot')}
┊•  USUARIO » ${totalreg}
┊•  LEVEL » *${user.level}*
┊•  XP » *${user.exp - minExp} / ${xp}*
┊•  DINERO » *${user.coin} ${global.moneda || 'coins'}*
┊• ∞ HOSTING » By David
╰═┅═━──────────────


╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  PRINCIPALES  ╭ׅׄ̇─ׅ̻ׄ
> Comandos para ver estado e información del bot.
╚━━━━━━━━━━━
  help  menu 
> Ver la lista de comandos del bot.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   owner  creador 
> Envia el número de teléfono del creador del bot.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   status  estado 
> Ver el estado actual del bot.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  SUB BOTS  ╭ׅׄ̇─ׅ̻ׄ
> Comandos para gestionar y configurar sub bots.
╚━━━━━━━━━━━
  qr 
> Código Qr Para Ser Sub Bot.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   sockets 
> Lista De Sub Bot.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   token 
> Tu Token De Sub Bot.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  IAS  ╭ׅׄ̇─ׅ̻ׄ
> Comandos de inteligencia artificial disponibles.
╚━━━━━━━━━━━
  ghibli2 
> Ghibli2 No automática - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   stabili 
> Stabili No automática - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   stable 
> Stable No automática - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   _imagine 
> Imagine - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ghibli 
> Ghibli No automática - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   geminimg 
> GeminiMg No automática - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   flux 
> Flux No automática - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   dalle 
> Dall-E No automática - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   flatai 
> FlatAI No automática - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   magic 
> Magic No automática - Imagen AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   deepseek 
> DeepSeek No automática - Texto AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   geminipro 
> GeminiPro No automática - Texto AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   llama 
> Llama No automática - Texto AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   gemini 
> Gemini No automática - Texto AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   qwenturbo 
> QwenTurbo No automática - Texto AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   qwenmax 
> QwenMax No automática - Texto AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   learnlm 
> LearnLM No automática - Texto AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   guru 
> Guru No automática - Texto AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   blackboxai 
> BlackBoxAI No automática - Texto AI.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   Hh akaru 
> Hh akaru automática - Automático.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  GAMES  ╭ׅׄ̇─ׅ̻ׄ
> Juegos y entretenimiento disponibles.
╚━━━━━━━━━━━
  slot 
> Slot Ruleta - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ruletarusa 
> Ruletarusa Prototipo - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   apostar 
> Apostar suerte - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   koboy 
> Koboy derecha izquierda - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ruleta 
> Ruleta con cantidad y color - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   carrera 
> Carrera elige tu letra - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   numero 
> Número elige tu número más alto - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   game 
> Game adivina el número - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   peliculas 
> Películas descubre tu película - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   trivia 
> Trivia elige opciones A, B, C - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   adivinanza 
> Adivinanza descubre la respuesta - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   buscaminas 
> Buscaminas juego imposible de ganar - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ahorcado 
> Ahorcado descubre el nombre - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ordena 
> Ordena ordena la palabra - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   math 
> Math gana exp con tu inteligencia - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ppt 
> PPT piedra, papel y tijera - Game.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tictactoe 
> Tictactoe gana exp - Game.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  DESCARGA  ╭ׅׄ̇─ׅ̻ׄ
> Comandos para descargar contenido de diferentes plataformas.
╚━━━━━━━━━━━
  apk 
> Apk aplicación - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   gitclone 
> Gitclone ponga el link de su repositorio - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   instagram 
> Instagram videos de IG, pone tu link - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tiktok 
> Tiktok video TikTok, pone tu link - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tiktok2 
> Tiktok2 video TikTok, pone tu link - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ttmp3 
> Ttmp3 audio de TikTok, pone tu link - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   play2 
> Play2 YT, demora, hágalo de nuevo - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   play 
> Play YT mp3 mp4 - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   pvideo 
> Pvideo YT video, demora, hágalo de nuevo - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   aplemusi 
> Aplemusi audio, demora, hágalo de nuevo - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   deezer 
> Deezer audio, demora, hágalo de nuevo - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   facebook 
> Facebook descargar videos de Facebook - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   twitter 
> Twitter ponga su enlace de Twitter - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   xvideosdl 
> Xvideosdl video porno de Xvideos, pone tu enlace - Download.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   spotify 
> Spotify ponga su mejor música - Download.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  BÚSQUEDA  ╭ׅׄ̇─ׅ̻ׄ
> Comandos para buscar contenido en diferentes plataformas.
╚━━━━━━━━━━━
  phsearch 
> Phsearch busca porno - Search.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   r34 
> R34 rule 34 img porno - Search.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tenor 
> Tenor buscador de tenor - Search.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tiktoksearch 
> Tiktoksearch busca tu video de tik tok - Search.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   githubsearch 
> Githubsearch buscar tus repositorios - Search.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   animes 
> Animes buscar tu anime - Search.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   simi 
> Simi automática - Automático.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  OWNER  ╭ׅׄ̇─ׅ̻ׄ
> Comandos exclusivos para propietarios del bot.
╚━━━━━━━━━━━
  setimagelink 
> SetImageLink Nueva imagen bot - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setvideolink 
> SetVideoLink Nuevo video bot - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   seticono 
> SetIcono cambiar icono del catálogo - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setimage 
> SetImage cambiar foto de perfil - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setavatar 
> SetAvatar cambiar avatar - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setstatus 
> SetStatus Nueva descripción contacto - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setbotname 
> SetBotName Nuevo nombre bot - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setbye 
> SetBye Mensaje de salida - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setmoneda 
> SetMoneda cambiar nombre monedas - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   prefix 
> Prefix Nuevo prefijo - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   resetprefix 
> ResetPrefix resetear prefijo - Config.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   listcmd 
> ListCmd Lista comandos nv - Gestión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setcmd 
> SetCmd crear comando nv - Gestión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   delcmd 
> DelCmd borrar comandos nv - Gestión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   getplugin 
> GetPlugin dar mis comandos - Gestión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   saveplugin 
> SavePlugin saber sobre plugin - Gestión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   banuser 
> BanUser banear del bot - Usuario.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   unbanuser 
> UnBanUser desbanear usuario - Usuario.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   restablecerdatos 
> RestablecerDatos borrar datos persona - Usuario.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   chetar 
> Chetar chetar de todo - Usuario.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   deschetar 
> Deschetar hacer agente normal - Usuario.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   addprem 
> AddPrem dar premium común - Premium.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   addprem2 
> AddPrem2 dar premium especial - Premium.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   addprem3 
> AddPrem3 dar admin épico - Premium.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   addprem4 
> AddPrem4 dar admin legendario - Premium.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   delpremium 
> DelPremium sacar premium - Premium.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   addowner 
> AddOwner añadir owner nuevo - Admin.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   delowner 
> DelOwner quitar owner - Admin.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   autoadmin 
> AutoAdmin dar admin a creador - Admin.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   añadircoin 
> AñadirCoin añadir coins - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   quitarcoin 
> QuitarCoin quitar coins - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   añadirxp 
> AñadirXP añadir xp - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   quitarxp 
> QuitarXP quitar xp - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   join 
> Join unir a grupos bot - Grupos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   salir 
> Salir sacar de grupos bot - Grupos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   gruposlista 
> GruposLista ver todos los grupos - Grupos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   msg 
> Msg mensaje para todos los grupos - Grupos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   spam2 
> Spam2 hacer spam a otros grupos - Grupos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   bottemporal 
> BotTemporal bot temporal en grupo - Grupos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   reiniciar 
> Reiniciar reiniciar sistema - Sistema.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   dsowner 
> DsOwner reiniciar sistema - Sistema.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   savefile 
> SaveFile ruta y archivo - Archivos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   deletefile 
> DeleteFile eliminar archivo - Archivos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   cleanfile 
> CleanFile archivos temporales - Archivos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   borrartmp 
> BorrarTmp borrar tmp - Archivos.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   get 
> Get sacar API de links - API.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   get2 
> Get2 sacar API de links + ejecutador - API.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  RPG  ╭ׅׄ̇─ׅ̻ׄ
> Sistema de rol y experiencia para usuarios.
╚━━━━━━━━━━━
  unreg 
> Unreg Borrar verificación - Profile.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setdescription 
> SetDescription Poner descripción en tu perfil del bot - Profile.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   verificar 
> Verificar Registrarte - Profile.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setgenre 
> SetGenre Poner género en tu perfil - Profile.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   marry 
> Marry Casarse - Social.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   divorce 
> Divorce Divorciarse - Social.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   profile 
> Profile Ver perfiles - Profile.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   comprarpremium 
> ComprarPremium Comprar premium - Premium.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setbirth 
> SetBirth Poner descripto perfil del bot - Profile.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   delgenero 
> DelGenero Borrar género - Profile.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   deldescription 
> DelDescription Borrar descripción - Profile.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   delbirth 
> DelBirth Borrar descripto lógico - Profile.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   levelup 
> LevelUp Subir de nivel - Experience.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   lb 
> Lb Ver los tops - Ranking.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  GRUPO  ╭ׅׄ̇─ׅ̻ׄ
> Comandos para administración y gestión de grupos.
╚━━━━━━━━━━━
  restablecer 
> Restablecer Reiniciar link de grupo - Configuración.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   bayedit 
> BayEdit Escribe el nuevo mensaje de despedida - Mensajes.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   welcomedit 
> WelcomeEdit Escribe el nuevo mensaje de Bienvenida - Mensajes.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   resetwelcome 
> ResetWelcome Reiniciar Welcome - Mensajes.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   viewwelcome 
> ViewWelcome Ver Welcome Bay Y Welcome - Mensajes.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   rulban 
> Rulban Elige random a un usuario y lo elimina - Moderación.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   testwelcome 
> TestWelcome Ver si funciona el welcome - Test.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   unwarn 
> Unwarn Advertencia a usuario - Moderación.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   todos 
> Todos Etiqueta a todos los usuarios - General.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   promote 
> Promote Dar admin a las personas - Admin.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   listadv 
> Listadv Lista de advertidos - Moderación.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   mute 
> Mute Mutear a un usuario - Moderación.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   gpdesc 
> GpDesc Cambiar descripción del grupo - Configuración.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   setname 
> SetName Cambiar nombre del grupo - Configuración.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   hidetag 
> HideTag para estar AFK - General.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   actividad 
> Actividad Etiqueta al usuario y muestra su actividad - Stats.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   actividadgrupo 
> ActividadGrupo Muestra la actividad general del grupo - Stats.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   groupstats 
> GroupStats estadística - Stats.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   resetstats 
> ResetStats reiniciar contador - Stats.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   admins 
> Admins general del grupo - Admin.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  FUN  ╭ׅׄ̇─ׅ̻ׄ
> Comandos de entretenimiento y diversión.
╚━━━━━━━━━━━
  love 
> Love Etiqueta a una persona - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   chequearbelleza 
> Chequearbelleza Etiqueta a una persona - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   peso 
> Peso Ponga Su Peso - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   sorteo 
> Sorteo Sortea - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   waste 
> Waste Imagen saquenme de Venezuela - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   zodia 
> Zodia Ponga su fecha de nacimiento - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   cuca 
> Cuca Medidor de profundidad - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tula 
> Tula Cuando te mide la tula - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   altura 
> Altura Medidor de altura - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   chichis 
> Chichis Tamaño de tetas - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   infiel 
> Infiel Medidor de infidelidad - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   poto 
> Poto Medidor de potos - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   putito 
> Putito Medidor de gey - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   pajero 
> Pajero Medidor de pajero - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   chaqueteame 
> Chaqueteame Etiqueta a una persona - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   odio 
> Odio Medidor de odio - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   doxxeo 
> Doxxeo Doxeo normal - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   iqtest 
> Iqtest Tu inteligencia - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   marica 
> Marica Etiqueta a la persona gey - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   follar 
> Follar Follar - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   cekhorny 
> Cekhorny Medidor de horny - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   huevo 
> Huevo Agarrador de huevos - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   top1-30 
> Top1-30 Elige tu mejor top (texto) - Diversión.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   pvp 
> Pvp desafío - Diversión.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  ECONOMÍA  ╭ׅׄ̇─ׅ̻ׄ
> Sistema económico del bot con yenes y experiencia.
╚━━━━━━━━━━━
  platita 
> Platita Ganar XP - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   semanal 
> Semanal Ganar recursos - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   transfer 
> Transfer Dar yenes - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   chambear 
> Chambear Ganar XP - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   prostituirse 
> Prostituirse Puta para ganar yenes - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   buyall 
> Buyall Menos XP y más yenes - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   rob 
> Rob Robar - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   retirar 
> Retirar Retirar tus yenes del banco - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   minar 
> Minar Ganar recursos - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   mensual 
> Mensual Ganar XP y demás - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   inventario 
> Inventario Ver todo lo que tienes - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   crimen 
> Crimen Ganas recursos - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   daily 
> Daily Ganas recursos - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   deposit 
> Deposit Depositar yenes en el banco - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   explorar 
> Explorar Ganar recursos - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   gremio 
> Gremio Ganar recursos - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   cofre 
> Cofre Ganar recursos - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   caracruz 
> Caracruz Cara o cruz, juego - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   cartera 
> Cartera Ver todos los yenes que tienes - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   baltop 
> Baltop Ver el top de yenes - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   banco 
> Banco Ver los yenes guardados - Economía.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   prestarxp 
> Prestarxp Das un poco de tu XP - Economía.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  MARKET  ╭ׅׄ̇─ׅ̻ׄ
> Comandos para crear imágenes y memes personalizados.
╚━━━━━━━━━━━
  difuminar 
> Difuminar etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tweet 
> Tweet tweet <nombre>,<usuario>,<texto> - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   deadpologo 
> Deadpologo deadpologo <texto1> <texto2> - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   xnxx 
> Xnxx etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   trash 
> Trash etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ad 
> Ad etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   comunismo 
> Comunismo etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   phub 
> Phub etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   xnxxcard 
> Xnxxcard etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   borrar3 
> Borrar3 etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   patrick 
> Patrick etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   invert 
> Invert etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   hitler 
> Hitler etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   affect 
> Affect etiqueta una persona - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   bed 
> Bed pone un texto - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   alert 
> Alert pone un texto - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   biden 
> Biden pone un texto - Market.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   gun 
> Gun pone un texto - Market.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  CONVERTIDORES  ╭ׅׄ̇─ׅ̻ׄ
> Herramientas para convertir archivos multimedia.
╚━━━━━━━━━━━
  tomp3 
> Tomp3 Tu video a MP3 - Conversor.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tourl 
> Tourl Saca el URL de tus imágenes o videos - Conversor.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tovideo 
> Tovideo Tu sticker en movimiento - Conversor.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   togifaud 
> Togifaud GIF de tu video - Conversor.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ibb 
> Ibb Link de tu imagen - Conversor.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   catbox 
> Catbox Link de video o imagen URL - Conversor.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   toimg 
> Toimg Tu sticker a imagen - Conversor.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   tts 
> Tts Crea un audio - Conversor.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  HERRAMIENTAS  ╭ׅׄ̇─ׅ̻ׄ
> Utilidades y herramientas diversas del bot.
╚━━━━━━━━━━━
  cekresolution 
> Cekresolution Resolución de una imagen y su URL - Herramientas.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   eliminar 
> Eliminar Elimina tu mensaje - Herramientas.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ssweb 
> Ssweb Manda captura del link que mandes - Herramientas.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   foto 
> Foto Busca tu imagen - Herramientas.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   hora 
> Hora Hora en todos los países - Herramientas.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   channelinfo 
> Channelinfo Información del ID del canal - Herramientas.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  RANDOM  ╭ׅׄ̇─ׅ̻ׄ
> Contenido aleatorio y variado.
╚━━━━━━━━━━━
  wallpaper 
> Wallpaper Ponga su texto de la img que quiera - Random.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  INFO  ╭ׅׄ̇─ׅ̻ׄ
> Información y configuración del bot.
╚━━━━━━━━━━━
  reporte 
> Reporte Envía el comando que vaa en texto - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   listapremium 
> Listapremium te hace una lista - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ping 
> Ping Ver velocidad de reposta - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   newcommand 
> Newcommand Escribe un nuevo comando para mi creador - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   infobot 
> Infobot Información del bot - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   estado 
> Estado Como va el bot - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   editautoresponder 
> Editautoresponder Editar autoresponder - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   autoresponder2 
> Autoresponder2 Borrar el autoresponder que creaste - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   owner 
> Owner Mi creador - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   dashboard 
> Dashboard Todos los comandos - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   apoyar 
> Apoyar Ayuda a mi creador con dinero - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   presupuestobot 
> Presupuestobot Venta del bot - Info.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   runtime 
> Runtime Tiempo que está activo - Info.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  STICKER  ╭ׅׄ̇─ׅ̻ׄ
> Creación y personalización de stickers.
╚━━━━━━━━━━━
  stickmaker 
> Stickmaker Filtros con sticker - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   stickerfilter 
> Stickerfilter Filtros con sticker - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   efectosticker 
> Efectosticker Aplica efectos como: noautorizo, autorizo - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   pfp 
> Pfp Tu foto de perfil - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   brat 
> Brat Texto sticker - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   furbrat 
> Furbrat Texto sticker - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   bratvid 
> Bratvid Texto sticker Video - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   emojimix 
> Emojimix Doble emoji 😔+👻 - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   trigger 
> Trigger Efecto sticker - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   smeme 
> Smeme Crear sticker bot | cabrón - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   sticker 
> Sticker Crea tu sticker - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   qc 
> Qc Crea sticker con texto - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   qc2 
> Qc2 Crea sticker con texto efectos - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   wm 
> Wm Cambiar el nombre del sticker paquete - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   texts 
> Texts Tu texto a Stiker - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   attp 
> Attp Tu texto a Stiker - Sticker.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   ttp 
> Ttp Tu texto a Stiker - Sticker.

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭〔ׅ  VIDEO NORMAL  ╭ׅׄ̇─ׅ̻ׄ
> Comandos con videos de reacciones y emociones.
╚━━━━━━━━━━━
  lengua 
> Lengua etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   morder 
> Morder etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   enojado 
> Enojado etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   sonrojarse 
> Sonrojarse etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   acurrucarse 
> Acurrucarse etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   llorar2 
> Llorar2 etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   cafe 
> Cafe etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   aburrido 
> Aburrido etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   bailar 
> Bailar etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   borracho 
> Borracho etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   comer 
> Comer etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   palmada 
> Palmada etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   feliz 
> Feliz etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   hola 
> Hola etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   matar 
> Matar etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   besar2 
> Besar2 etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   hug 
> Hug etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   reirse 
> Reirse etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   embarazar 
> Embarazar etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   pucheros 
> Pucheros etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   acariciar 
> Acariciar etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   picar 
> Picar etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   lamber 
> Lamber etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   correr 
> Correr etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   pegar 
> Pegar etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   seducir 
> Seducir etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   asustada 
> Asustada etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   triste 
> Triste etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   timida 
> Timida etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   bofetada2 
> Bofetada2 etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   dormir 
> Dormir etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   fumar 
> Fumar etiqueta una persona - Video.
 ᳯ⃞ 𑪏𑪋ᩧ❀:   encuerar 
> Encuerar etiqueta una perso
╰┉ͦ━ᷫ━ⷭ┈ ⃘⵿݂۪۪۪࣭࣭፝۬۬۬͞ᰰ᷒|${botName} *┈⊷ꫂ፝۬۬۬͞ᜓ⃘݂۪۪۪࣭࣭.─᭢╯`.trim();

    // Enviar mensaje con imagen
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: str
    }, { quoted: m });

  } catch (e) {
    console.error('Error general en handler:', e);
    conn.reply(m.chat, '*[❗INFO❗] Error al enviar el menú, repórtalo al propietario del bot.*', m);
  }
};

handler.command = ['menu', 'menuall','comandos', 'help', 'menucompleto'];
handler.exp = 50;
handler.fail = null;

export default handler;