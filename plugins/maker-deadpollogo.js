import axios from 'axios';
import qs from 'qs';
import * as cheerio from 'cheerio';
import FormData from 'form-data';

async function ephoto(text1, text2) {
  const url = 'https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html';
  const headers = { 'User-Agent': 'Mozilla/5.0' };

  const res = await axios.get(url, { headers });
  const $ = cheerio.load(res.data);

  const token = $('input[name=token]').val();
  const buildServer = $('input[name=build_server]').val();
  const buildServerId = $('input[name=build_server_id]').val();

  const formData = new FormData();
  formData.append('text[]', text1);
  formData.append('text[]', text2);
  formData.append('token', token);
  formData.append('build_server', buildServer);
  formData.append('build_server_id', buildServerId);

  const post = await axios.post(url, formData, {
    headers: {
      ...formData.getHeaders(),
      'Cookie': res.headers['set-cookie']?.join('; ')
    }
  });

  const $$ = cheerio.load(post.data);
  const formValue = JSON.parse($$('input[name=form_value_input]').val());
  const body = qs.stringify(formValue, { arrayFormat: 'brackets' });

  const hasil = await axios.post('https://en.ephoto360.com/effect/create-image', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': res.headers['set-cookie']?.join('; '),
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': url
    }
  });

  return buildServer + hasil.data.image;
}

let handler = async (m, { conn, args }) => {
  if (args.length < 2) {
    return m.reply('❗ Uso incorrecto.\n\nEjemplo: *.deadpologo Texto1 Texto2*');
  }

  let [text1, text2] = args;

  try {
    let imageUrl = await ephoto(text1, text2);
    let caption = `*🎬 Logo estilo Deadpool*\n\n🅰️ Texto 1: ${text1}\n🅱️ Texto 2: ${text2}`;
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption
    }, { quoted: m });
  } catch (e) {
    console.error('[ERROR DeadpoolLogo]', e.message);
    m.reply('❌ No se pudo generar el logo. El servidor podría estar ocupado. Intenta más tarde.');
  }
};

handler.help = ['deadpologo <texto1> <texto2>'];
handler.tags = ['editor', 'logo'];
handler.command = /^deadpologo$/i;
handler.limit = false;

export default handler;
