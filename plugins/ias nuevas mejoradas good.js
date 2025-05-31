import fetch from 'node-fetch'

let handler = async (m, { conn, command, args, usedPrefix }) => {
    let texto = ''
    let modelo = command
    
    // Si se usa el comando general 'ia' o 'ai', extraer el modelo y texto
    if (command === 'ia' || command === 'ai') {
        let [modeloArg, ...textoArray] = args
        modelo = modeloArg
        texto = textoArray.join(' ')
        
        // Si no se proporciona modelo o texto en comando general
        if (!modelo) {
            const modelos = [
                'qwenturbo', 'qwenmax', 'learnlm', 'llama', 'guru', 
                'blackboxai', 'claude', 'deepseek', 'geminipro'
            ]
            return conn.reply(m.chat, `❌ Formato incorrecto. Uso correcto:\n${usedPrefix}${command} <modelo> <texto>\n\nModelos disponibles:\n- ${modelos.join('\n- ')}\n\nEjemplo: ${usedPrefix}${command} qwenmax Hola, ¿cómo estás?\n\nTambién puedes usar directamente: ${usedPrefix}<modelo> <texto>`, m)
        }
        
        if (!texto) return conn.reply(m.chat, `❌ Por favor, ingresa un texto después del modelo elegido.`, m)
    } else {
        // Si se usa un comando específico del modelo, usar todo como texto
        texto = args.join(' ')
        if (!texto) return conn.reply(m.chat, `❌ Por favor, ingresa un texto después del comando ${usedPrefix}${command}.`, m)
    }
    
    // Normalizar el nombre del modelo
    const modeloNormalizado = modelo.toLowerCase().replace(/[-_]/g, '')
    
    // Configuración específica para cada API
    const modelConfig = {
        'qwenturbo': {
            url: `https://api.nekorinn.my.id/ai/qwen-turbo?text=${encodeURIComponent(texto)}`,
            extractText: (json) => {
                if (json.data) return json.data
                if (json.result) return json.result
                return null
            }
        },
        'qwenmax': {
            url: `https://api.nekorinn.my.id/ai/qwen-max?text=${encodeURIComponent(texto)}`,
            extractText: (json) => {
                if (json.data) return json.data
                if (json.result) return json.result
                return null
            }
        },
        'learnlm': {
            url: `https://api.nekorinn.my.id/ai/learnlm-1.5-pro-exp?text=${encodeURIComponent(texto)}`,
            extractText: (json) => {
                if (json.data) return json.data
                if (json.result) return json.result
                return null
            }
        },
        'llama': {
            url: `https://api.nekorinn.my.id/ai/qwen-max?text=${encodeURIComponent(texto)}`,
            extractText: (json) => {
                if (json.data) return json.data
                if (json.result) return json.result
                return null
            }
        },
        // Nuevas APIs
        'guru': {
            url: `https://api.agatz.xyz/api/degreeguru?message=${encodeURIComponent(texto)}`,
            extractText: (json) => {
                if (json.data) return json.data
                if (json.result) return json.result
                if (json.response) return json.response
                return null
            }
        },
        'blackboxai': {
            url: `https://api.siputzx.my.id/api/ai/blackboxai?content=${encodeURIComponent(texto)}`,
            extractText: (json) => {
                if (json.data) return json.data
                if (json.result) return json.result
                if (json.response) return json.response
                return null
            }
        },
        'claude': {
            url: `https://api.siputzx.my.id/api/ai/claude-sonnet-35?content=${encodeURIComponent(texto)}`,
            extractText: (json) => {
                if (json.data) return json.data
                if (json.result) return json.result
                if (json.response) return json.response
                return null
            }
        },
        'deepseek': {
            url: `https://api.siputzx.my.id/api/ai/deepseek-llm-67b-chat?content=${encodeURIComponent(texto)}`,
            extractText: (json) => {
                if (json.data) return json.data
                if (json.result) return json.result
                if (json.response) return json.response
                return null
            }
        },
        'geminipro': {
            url: `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(texto)}`,
            extractText: (json) => {
                if (json.data) return json.data
                if (json.result) return json.result
                if (json.response) return json.response
                return null
            }
        },
        // También agregamos la función para reconocer versiones compuestas del nombre
        'blackbox': { alias: 'blackboxai' },
        'claude35': { alias: 'claude' },
        'sonnet35': { alias: 'claude' },
        'geminipro1': { alias: 'geminipro' },
        'degree': { alias: 'guru' },
        'deepseekllm': { alias: 'deepseek' }
    };
    
    // Verificar si el modelo existe o es un alias
    let modeloFinal = modeloNormalizado;
    if (modelConfig[modeloNormalizado] && modelConfig[modeloNormalizado].alias) {
        modeloFinal = modelConfig[modeloNormalizado].alias;
    }
    
    // Verificar si el modelo existe
    if (!modelConfig[modeloFinal] || modelConfig[modeloFinal].alias) {
        const modelos = [
            'qwenturbo', 'qwenmax', 'learnlm', 'llama', 'guru', 
            'blackboxai', 'claude', 'deepseek', 'geminipro'
        ]
        return conn.reply(m.chat, `❌ Modelo "${modelo}" no reconocido. Modelos disponibles:\n- ${modelos.join('\n- ')}\n\nEjemplo: ${usedPrefix}${modelos[0]} Hola, ¿cómo estás?`, m)
    }
    
    // Mensaje de espera
    const waitMsg = await conn.reply(m.chat, `⏳ Procesando tu consulta con ${modeloFinal}...`, m)
    
    try {
        // Obtener la configuración del modelo
        const config = modelConfig[modeloFinal]
        
        // Realizar la solicitud
        const response = await fetch(config.url)
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`)
        }
        
        // Obtener el JSON de respuesta
        const json = await response.json()
        
        // Extraer solo el texto de la respuesta
        const responseText = config.extractText(json)
        
        // Verificar si se pudo extraer una respuesta válida
        if (!responseText) {
            console.log(`Estructura de respuesta de ${modeloFinal}:`, JSON.stringify(json))
            return conn.reply(m.chat, `❌ No se pudo obtener una respuesta válida de ${modeloFinal}. Intenta con otro modelo.`, m)
        }
        
        // Enviar la respuesta limpia
        await conn.sendMessage(m.chat, {
            text: `🤖 *${modeloFinal.toUpperCase()}*\n\n${responseText}`
        }, { quoted: m })
        
    } catch (error) {
        console.error(`Error con la API de ${modeloFinal}:`, error)
        conn.reply(m.chat, `❌ Ocurrió un error al comunicarse con la API de ${modeloFinal}: ${error.message}`, m)
    }
}

// Definir los comandos (ahora solo los nombres de modelos y los generales ia/ai)
handler.command = [
    'ia', 'ai', 'llama', 'qwenturbo', 'qwenmax', 'learnlm',
    'guru', 'blackboxai', 'claude', 'deepseek', 'geminipro'
]
handler.tags = ['ai', 'tools']
handler.help = [
    'ia <modelo> <texto>', 
    'ai <modelo> <texto>',
    '<modelo> <texto> (donde modelo puede ser cualquiera de los modelos soportados)'
]

export default handler