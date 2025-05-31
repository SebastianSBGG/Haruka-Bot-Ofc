import fetch from "node-fetch";

const fetchJson = (url, options) => fetch(url, options).then(res => res.json());

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Ejemplo:\n${usedPrefix + command} jokowi`;

    await conn.sendMessage(m.chat, {
        react: { text: "⏱️", key: m.key }
    });

    try {
        let response = await fetchJson(`https://api.vreden.my.id/api/igstalk?query=${text}`);
        const user = response.result?.user;
        if (!user) throw "Cuenta no encontrada o privada.";

        const nickname = user.username;
        const fullname = user.full_name;
        const posts = user.media_count.toLocaleString();
        const followers = user.follower_count.toLocaleString();
        const following = user.following_count.toLocaleString();
        const bio = user.biography || "Sin biografía.";
        const accountType = user.is_business ? "Negocio" : "Personal";
        const imgUrl = user.hd_profile_pic_url_info?.url || user.profile_pic_url;

        await conn.sendMessage(
            m.chat,
            {
                image: { url: imgUrl },
                caption: `*\`乂 INSTAGRAM - STALK\`*\n\n*Nickname:* ${nickname}\n*Nombre completo:* ${fullname}\n*Publicaciones:* ${posts}\n*Seguidores:* ${followers}\n*Siguiendo:* ${following}\n*Tipo de cuenta:* ${accountType}\n*Biografía:*\n${bio}`
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, {
            react: { text: "", key: m.key }
        });

    } catch (error) {
        await m.reply(`Error: ${error.message}`);
    }
};

handler.help = ["igstalk"];
handler.tags = ["stalker"];
handler.command = ["igstalk"];
handler.limit = false;

export default handler;
