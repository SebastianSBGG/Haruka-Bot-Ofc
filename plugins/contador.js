// plugins/message-tracker.js
import { getGroupDatabase, saveGroupDatabase, initializeUser } from '../lib/database-utils.js';

// Función before para registrar todos los mensajes automáticamente
export async function before(m, { conn, participants, groupMetadata }) {
    // Solo procesar mensajes de grupo
    if (!m.isGroup || !groupMetadata || !m.sender) return;
    
    console.log(`📱 Procesando mensaje en grupo: ${groupMetadata.id}`);
    
    const groupId = groupMetadata.id;
    const userId = m.sender;
    
    try {
        // Obtener base de datos del grupo
        const groupData = getGroupDatabase(groupId);
        
        // Inicializar usuario si no existe
        if (!groupData.users[userId]) {
            groupData.users[userId] = initializeUser();
        }
        
        console.log(`👤 Usuario: ${userId.split('@')[0]} | Tipo: ${m.mtype}`);
        
        const userData = groupData.users[userId];
        
        // Actualizar último mensaje
        userData.lastMessage = new Date().toISOString();
        
        // Contar según el tipo de mensaje
        switch (m.mtype) {
            case 'conversation':
            case 'extendedTextMessage':
                userData.msgCount++;
                groupData.totalMessages++;
                break;
            case 'stickerMessage':
                userData.stickerCount++;
                groupData.totalMessages++;
                break;
            case 'imageMessage':
                userData.imageCount++;
                groupData.totalMessages++;
                break;
            case 'videoMessage':
                userData.videoCount++;
                groupData.totalMessages++;
                break;
            case 'audioMessage':
            case 'ptt':
                userData.audioCount++;
                groupData.totalMessages++;
                break;
            case 'documentMessage':
                userData.documentCount++;
                groupData.totalMessages++;
                break;
        }
        
        // Actualizar actividad del grupo
        groupData.lastActivity = new Date().toISOString();
        
        // Guardar cambios de forma asíncrona para no bloquear
        setImmediate(() => {
            saveGroupDatabase(groupId, groupData);
            console.log(`💾 Datos guardados para grupo: ${groupId.split('@')[0]}`);
        });
        
    } catch (error) {
        console.error(`❌ Error registrando mensaje en grupo ${groupId}:`, error);
    }
}