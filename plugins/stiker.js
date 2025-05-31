import fs from 'fs';
import WebP from 'node-webpmux';
import ffmpeg from 'fluent-ffmpeg';

let handler = async (m, { conn }) => {
    let buffer;
    const emoji = '🎨';

    try {
        let v = m?.quoted ? m.quoted : m;
        let mime = (v.msg || v).mimetype || v?.mediaType || '';

        if (/image\//.test(mime)) {
            let media = await v?.download?.();

            let crop = /\-x|\-crop/i.test(m.text);
            buffer = await imageToWebp(media, crop, { author: global.packsticker2, packName: global.packsticker });
        } else if(/video/.test(mime)) {
            let media = await v?.download?.();

            let crop = /\-x|\-crop/i.test(m.text);
            buffer = await videoToWebp(media, crop, { author: global.packsticker2, packName: global.packsticker });
        } else {
            return conn.reply(m.chat, `${emoji} Por favor, envia una imagen o video para hacer un sticker.`, m);
        }

        await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
    } catch(e) {
        console.error(e);
        conn.reply(m.chat, `${emoji} Ocurrió un error al crear el sticker.`, m);
    }
};

handler.help = ['stiker <img>', 'sticker <url>']
handler.tags = ['sticker']
//handler.group = true;
handler.register = true
handler.command = ['s', 'sticker', 'stiker']

export default handler

// Función para generar números aleatorios
const getRandom = (ext = '', length = 10000) => Math.floor(Math.random() * length) + ext;

// Función para convertir imágenes a WebP con tamaño 512x512
const imageToWebp = (buffer, shouldCrop = false, stickerMetadata) => {
    const tmpFileIn = getRandom('.jpg');
    const tmpFileOut = getRandom('.webp');
    
    // Definir filtro de FFmpeg - ahora siempre estira para llenar completamente 512x512
    // Si se usa -crop, primero recorta para hacer cuadrado y luego estira
    const filter = shouldCrop 
        ? 'crop=w=\'min(iw,ih)\':h=\'min(iw,ih)\',scale=512:512,setsar=1' 
        : 'scale=512:512:force_original_aspect_ratio=disable';
    
    fs.writeFileSync(tmpFileIn, buffer);
    
    return new Promise((resolve, reject) => {
        ffmpeg(tmpFileIn)
            .on('error', reject)
            .on('end', async () => {
                let finalBuffer = await writeExif(tmpFileOut, stickerMetadata);
                await Promise.all([
                    fs.promises.unlink(tmpFileIn),
                    fs.promises.unlink(tmpFileOut)
                ]);
                resolve(finalBuffer);
            })
            .addOutputOptions([
                '-vcodec', 'libwebp', 
                '-vf', filter, 
                '-preset', 'default'
            ])
            .toFormat('webp')
            .save(tmpFileOut);
    });
};

// Función para convertir videos a WebP con tamaño 512x512
const videoToWebp = (buffer, shouldCrop = false, stickerMetadata) => {
    const tmpFileIn = getRandom('.mp4');
    const tmpFileOut = getRandom('.webp');
    
    // Definir filtro de FFmpeg - ahora siempre estira para llenar completamente 512x512
    // Si se usa -crop, primero recorta para hacer cuadrado y luego estira
    const filter = shouldCrop 
        ? 'crop=w=\'min(iw,ih)\':h=\'min(iw,ih)\',scale=512:512,setsar=1,fps=15' 
        : 'scale=512:512:force_original_aspect_ratio=disable,fps=15';
    
    fs.writeFileSync(tmpFileIn, buffer);
    
    return new Promise((resolve, reject) => {
        ffmpeg(tmpFileIn)
            .on('error', reject)
            .on('end', async () => {
                let finalBuffer = await writeExif(tmpFileOut, stickerMetadata);
                await Promise.all([
                    fs.promises.unlink(tmpFileIn),
                    fs.promises.unlink(tmpFileOut)
                ]);
                resolve(finalBuffer);
            })
            .addOutputOptions([
                '-vcodec', 'libwebp',
                '-vf', filter,
                '-loop', '0',
                '-ss', '00:00:00',
                '-t', '00:00:05',
                '-preset', 'default',
                '-an',
                '-vsync', '0'
            ])
            .toFormat('webp')
            .save(tmpFileOut);
    });
};

// Función para escribir metadatos EXIF en el sticker
const writeExif = (input, metadata = {}) => {
    const tmpFileOut = getRandom('.webp');
    
    return new Promise(async (resolve, reject) => {
        try {
            let img = new WebP.Image();
            
            const exifData = {
                'android-app-store-link': 'https://play.google.com/store/apps/details?id=com.snowcorp.stickerly.android',
                'sticker-pack-name': metadata.packName || '',
                'sticker-pack-id': Math.floor(Math.random() * 100000),
                'sticker-pack-publisher': metadata.author || '',
                'emojis': metadata.emojis || ['🚀']
            };
            
            // Formato del encabezado EXIF
            const exifHeader = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const exifJSON = Buffer.from(JSON.stringify(exifData), 'utf-8');
            const exifBuffer = Buffer.concat([exifHeader, exifJSON]);
            
            // Escribir longitud del JSON
            exifBuffer.writeUIntLE(exifJSON.length, 14, 4);
            
            await img.load(input);
            img.exif = exifBuffer;
            await img.save(tmpFileOut);
            
            const finalBuffer = fs.readFileSync(tmpFileOut);
            await fs.promises.unlink(tmpFileOut);
            
            resolve(finalBuffer);
        } catch (error) {
            reject(error);
        }
    });
};