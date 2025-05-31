// plugins/testdb.js
import { getGroupDatabase, saveGroupDatabase, listGroupDatabases, cleanGroupId } from '../lib/database-utils.js';

let handler = async (m, { conn, participants, groupMetadata }) => {
    if (!m.isGroup) {
        return m.reply('❌ Este comando solo funciona en grupos.');
    }
    
    try {
        const groupId = groupMetadata.id;
        
        let txt = `🧪 *PRUEBA DE BASE DE DATOS*\n\n`;
        txt += `📊 *Información del grupo:*\n`;
        txt += `🆔 ID original: ${groupId}\n`;
        txt += `📁 Nombre de archivo: ${cleanGroupId(groupId)}.json\n`;
        txt += `📂 Ruta: ./src/database/${cleanGroupId(groupId)}.json\n\n`;
        
        // Forzar creación de la base de datos
        const groupData = getGroupDatabase(groupId);
        
        txt += `✅ *Estado de la base de datos:*\n`;
        txt += `📅 Creada: ${new Date(groupData.createdAt).toLocaleString()}\n`;
        txt += `👥 Usuarios registrados: ${Object.keys(groupData.users).length}\n`;
        txt += `💬 Total mensajes: ${groupData.totalMessages}\n`;
        txt += `🕐 Última actividad: ${groupData.lastActivity ? new Date(groupData.lastActivity).toLocaleString() : 'Ninguna'}\n\n`;
        
        // Listar todas las bases de datos
        const allDatabases = listGroupDatabases();
        txt += `📊 *Bases de datos totales:* ${allDatabases.length}\n`;
        if (allDatabases.length > 0) {
            txt += `📁 Archivos encontrados:\n`;
            allDatabases.slice(0, 5).forEach(file => {
                txt += `  • ${file}\n`;
            });
            if (allDatabases.length > 5) {
                txt += `  ... y ${allDatabases.length - 5} más\n`;
            }
        }
        
        txt += `\n🔄 La base de datos se crea automáticamente al enviar mensajes.`;
        
        await m.reply(txt);
        
    } catch (error) {
        console.error('❌ Error en comando testdb:', error);
        await m.reply(`❌ Error en prueba: ${error.message}`);
    }
};

handler.help = ['testdb'];
handler.tags = ['owner'];
handler.command = /^testdb$/i;
handler.group = true;

export default handler;