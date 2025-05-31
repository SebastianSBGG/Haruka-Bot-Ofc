let handler = async (m, { conn }) => {
  conn.reply(m.chat, `“${pickRandom(belleza)}”`, m);
};

handler.help = ['chequearbelleza'];
handler.tags = ['juego'];
handler.command = /^chequearbelleza$/i;

export default handler;

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}

const belleza = [
  'Nivel de belleza: 4%\n\n¿ES TU CARA O BASURA?',
  'Nivel de belleza: 7%\n\n¡En serio, pareces un mono!',
  'Nivel de belleza: 12%\n\n¡Cuanto más te miro, más me dan ganas de vomitar!',
  'Nivel de belleza: 22%\n\nQuizá sea porque pecas muy seguido 😂',
  'Nivel de belleza: 27%\n\nTe costará encontrar pareja, ¡reza un poco!',
  'Nivel de belleza: 35%\n\nPaciencia, cariño.',
  'Nivel de belleza: 41%\n\n¡Que recibas una buena pareja pronto!',
  'Nivel de belleza: 48%\n\nTe garantizo que será difícil que te conquisten.',
  'Nivel de belleza: 56%\n\nEres “semi-bonita” :v',
  'Nivel de belleza: 64%\n\nEstá bien.',
  'Nivel de belleza: 71%\n\nBastante bonita, sí.',
  'Nivel de belleza: 1%\n\n¡JAJAJA QUÉ BROMA!',
  'Nivel de belleza: 77%\n\n¡Esta vez no me equivoco!',
  'Nivel de belleza: 83%\n\n¡Te aseguro que nadie se decepcionará!',
  'Nivel de belleza: 89%\n\n¡Todos se van a quedar sin palabras!',
  'Nivel de belleza: 94%\n\n¡WOW!',
  'Nivel de belleza: 100%\n\n¡ERES LA MUJER MÁS HERMOSA QUE HE VISTO!'
];
