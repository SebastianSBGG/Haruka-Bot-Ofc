import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 


global.botNumber = ''



global.owner = [
  ['56985230452', 'sebas', true],
  ['522219831926', 'david', true]
];



global.mods = ['522219831926', '56985230452']
global.suittag = ['522219831926'] 
global.prems = []



global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.languaje = 'Español'
global.vs = '2.2.0'
global.nameqr = '𝑯𝑨𝑹𝑼𝑲𝑨 𝑩𝑶𝑻 𝑶𝑭𝑪 • ⫹⫺ ᴘᴏᴡᴇʀ ʙʏ 𝙳𝚊𝚟𝚒𝚍 ᵛⁱᵖ'
global.namebot = '𝑯𝑨𝑹𝑼𝑲𝑨 𝑩𝑶𝑻 𝑶𝑭𝑪 • ⫹⫺ ᴘᴏᴡᴇʀ ʙʏ 𝙳𝚊𝚟𝚒𝚍 ᵛⁱᵖ'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.HarukaJadibts = true



global.packname = '𝑯𝑨𝑹𝑼𝑲𝑨 𝑩𝑶𝑻 𝑶𝑭𝑪 • ⫹⫺ ᴘᴏᴡᴇʀ ʙʏ 𝙳𝚊𝚟𝚒𝚍 ᵛⁱᵖ'
global.botname = '𝑯𝑨𝑹𝑼𝑲𝑨 𝑩𝑶𝑻 𝑶𝑭𝑪 • ⫹⫺ ᴘᴏᴡᴇʀ ʙʏ 𝙳𝚊𝚟𝚒𝚍 ᵛⁱᵖ'
global.wm = '𝑯𝑨𝑹𝑼𝑲𝑨 𝑩𝑶𝑻 𝑶𝑭𝑪 • ⫹⫺ ᴘᴏᴡᴇʀ ʙʏ 𝙳𝚊𝚟𝚒𝚍 ᵛⁱᵖ'
global.author = '𝑯𝑨𝑹𝑼𝑲𝑨 𝑩𝑶𝑻 𝑶𝑭𝑪 • ⫹⫺ ᴘᴏᴡᴇʀ ʙʏ 𝙳𝚊𝚟𝚒𝚍 ᵛⁱᵖ'
global.dev = '𝑯𝑨𝑹𝑼𝑲𝑨 𝑩𝑶𝑻 𝑶𝑭𝑪 • ⫹⫺ ᴘᴏᴡᴇʀ ʙʏ 𝙳𝚊𝚟𝚒𝚍 ᵛⁱᵖ'
global.textbot = '𝑯𝑨𝑹𝑼𝑲𝑨 𝑩𝑶𝑻 𝑶𝑭𝑪 • ⫹⫺ ᴘᴏᴡᴇʀ ʙʏ 𝙳𝚊𝚟𝚒𝚍 ᵛⁱᵖ'
global.etiqueta = '𝑯𝑨𝑹𝑼𝑲𝑨 𝑩𝑶𝑻 𝑶𝑭𝑪 • ⫹⫺ ᴘᴏᴡᴇʀ ʙʏ 𝙳𝚊𝚟𝚒𝚍 ᵛⁱᵖ'



global.moneda = '¥enes'
global.welcom1 = '❍ Edita Con El Comando setwelcome'
global.welcom2 = '❍ Edita Con El Comando setbye'
global.banner = 'https://files.catbox.moe/gqr82s.jpg'
global.avatar = 'https://files.catbox.moe/gqr82s.jpg'



global.gp1 = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a'
global.comunidad1 = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a'
global.channel = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a'
global.channel2 = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a'
global.md = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a'
global.correo = 'https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a'
global.cn ='https://whatsapp.com/channel/0029Vb6BhZ94inojKBChol3a';



global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363401576634867@newsletter',
}



global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

global.rpg = {
  emoticon(string) {
    string = string.toLowerCase();
    const emot = {
      level: '🌟 Nivel',
      coin: '💸 Coin',
      exp: '✨ Experiencia',
      bank: '🏦 Banco',
      diamond: '💎 Diamante',
      health: '❤️ Salud',
      kyubi: '🌀 Magia',
      joincount: '💰 Token',
      emerald: '♦️ Esmeralda',
      stamina: '⚡ Energía',
      role: '⚜️ Rango',
      premium: '🎟️ Premium',
      pointxp: '📧 Puntos Exp',
      gold: '👑 Oro',
      iron: '⛓️ Hierro',
      coal: '🌑 Carbón',
      stone: '🪨 Piedra',
      potion: '🥤 Poción',
    };
    const results = Object.keys(emot).map((v) => [v, new RegExp(v, 'gi')]).filter((v) => v[1].test(string));
    if (!results.length) return '';
    else return emot[results[0][0]];
  }};
global.rpgg = { 
  emoticon(string) {
    string = string.toLowerCase();
    const emott = {
      level: '🌟',
      coin: '💸',
      exp: '✨',
      bank: '🏦',
      diamond: '💎',
      health: '❤️',
      kyubi: '🌀',
      joincount: '💰',
      emerald: '♦️',
      stamina: '⚡',
      role: '⚜️',
      premium: '🎟️',
      pointxp: '📧',
      gold: '👑',
      iron: '⛓️',
      coal: '🌑',
      stone: '🪨',
      potion: '🥤',
    };
    const results = Object.keys(emott).map((v) => [v, new RegExp(v, 'gi')]).filter((v) => v[1].test(string));
    if (!results.length) return '';
    else return emott[results[0][0]];
  }};  



let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
