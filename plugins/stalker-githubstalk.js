import axios from 'axios';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('¿Cuál es el nombre de usuario?');

  try {
    const res = await githubstalk(text);

    const caption = `
*Usuario:* ${res.username}
*Nombre:* ${res.nickname || 'No disponible'}
*Bio:* ${res.bio || 'No disponible'}
*ID:* ${res.id}
*Node ID:* ${res.nodeId}
*Tipo:* ${res.type}
*Admin:* ${res.admin ? 'Sí' : 'No'}
*Empresa:* ${res.company || 'No disponible'}
*Blog:* ${res.blog || 'No disponible'}
*Ubicación:* ${res.location || 'No disponible'}
*Correo:* ${res.email || 'No disponible'}
*Repos públicos:* ${res.public_repo}
*Gists públicos:* ${res.public_gists}
*Seguidores:* ${res.followers}
*Siguiendo:* ${res.following}
*Creado:* ${res.created_at}
*Actualizado:* ${res.updated_at}
`;

    await conn.sendMessage(
      m.chat,
      {
        image: { url: res.profile_pic },
        caption: caption,
      },
      { quoted: m }
    );
  } catch (e) {
    m.reply(`Error: ${e.message}`);
  }
};

async function githubstalk(usuario) {
  return new Promise((resolve, reject) => {
    axios
      .get('https://api.github.com/users/' + usuario)
      .then(({ data }) => {
        const resultado = {
          username: data.login,
          nickname: data.name,
          bio: data.bio,
          id: data.id,
          nodeId: data.node_id,
          profile_pic: data.avatar_url,
          url: data.html_url,
          type: data.type,
          admin: data.site_admin,
          company: data.company,
          blog: data.blog,
          location: data.location,
          email: data.email,
          public_repo: data.public_repos,
          public_gists: data.public_gists,
          followers: data.followers,
          following: data.following,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        resolve(resultado);
      })
      .catch(reject);
  });
}

handler.help = ['githubstalk'];
handler.command = /^(ghstalk|githubstalk)$/i;
handler.tags = ['stalker'];

export default handler;
