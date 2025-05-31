// lib/database-utils.js
import fs from 'fs';
import path from 'path';

const DATABASE_DIR = './src/database/';

// Función para limpiar el ID del grupo y usarlo como nombre de archivo
export function cleanGroupId(groupId) {
    // Remover caracteres especiales y mantener solo números y letras
    return groupId.replace(/[@\-\.]/g, '_').replace(/[^\w]/g, '');
}

// Función para asegurar que el directorio existe
export function ensureDirectoryExists(dir) {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Directorio creado: ${dir}`);
        }
    } catch (error) {
        console.error(`❌ Error creando directorio ${dir}:`, error);
    }
}

// Función para obtener o crear el archivo JSON del grupo
export function getGroupDatabase(groupId) {
    try {
        ensureDirectoryExists(DATABASE_DIR);
        
        // Limpiar el ID del grupo para usarlo como nombre de archivo
        const cleanId = cleanGroupId(groupId);
        const fileName = `${cleanId}.json`;
        const filePath = path.join(DATABASE_DIR, fileName);
        
        console.log(`📂 Buscando base de datos: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            const initialData = {
                groupId: groupId, // ID original del grupo
                fileName: fileName, // Nombre del archivo
                createdAt: new Date().toISOString(),
                users: {},
                totalMessages: 0,
                lastActivity: null
            };
            
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
            console.log(`✅ Base de datos creada automáticamente: ${fileName}`);
            console.log(`📊 Grupo ID: ${groupId}`);
            return initialData;
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`📖 Base de datos cargada: ${fileName}`);
        return data;
        
    } catch (error) {
        console.error(`❌ Error manejando base de datos del grupo ${groupId}:`, error);
        return {
            groupId: groupId,
            fileName: `${cleanGroupId(groupId)}.json`,
            createdAt: new Date().toISOString(),
            users: {},
            totalMessages: 0,
            lastActivity: null
        };
    }
}

// Función para guardar datos del grupo
export function saveGroupDatabase(groupId, data) {
    try {
        ensureDirectoryExists(DATABASE_DIR);
        
        const cleanId = cleanGroupId(groupId);
        const fileName = `${cleanId}.json`;
        const filePath = path.join(DATABASE_DIR, fileName);
        
        // Asegurar que el groupId esté actualizado en los datos
        data.groupId = groupId;
        data.fileName = fileName;
        data.lastUpdate = new Date().toISOString();
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`💾 Base de datos guardada: ${fileName}`);
        
    } catch (error) {
        console.error(`❌ Error guardando base de datos del grupo ${groupId}:`, error);
    }
}

// Función para inicializar usuario
export function initializeUser() {
    return {
        msgCount: 0,
        stickerCount: 0,
        imageCount: 0,
        videoCount: 0,
        audioCount: 0,
        documentCount: 0,
        firstMessage: new Date().toISOString(),
        lastMessage: null
    };
}

// Función para obtener nombre de usuario limpio
export function getUserName(userId) {
    return userId.replace('@s.whatsapp.net', '').replace('@c.us', '');
}

// Función para formatear números grandes
export function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Función para listar todas las bases de datos
export function listGroupDatabases() {
    try {
        ensureDirectoryExists(DATABASE_DIR);
        const files = fs.readdirSync(DATABASE_DIR).filter(file => file.endsWith('.json'));
        
        console.log(`📊 Bases de datos encontradas: ${files.length}`);
        files.forEach(file => console.log(`  - ${file}`));
        
        return files;
    } catch (error) {
        console.error('❌ Error listando bases de datos:', error);
        return [];
    }
}