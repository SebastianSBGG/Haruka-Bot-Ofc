import axios from 'axios'
import { sticker } from '../lib/sticker.js'
import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'

let handler = m => m

handler.all = async function (m, { conn }) {
  try {
    // Ignorar mensajes de bots
    const isBotMsg = (m.id.startsWith('BAE5') && m.id.length === 16)
      || (m.id.startsWith('3EB0') && [12, 20, 22].includes(m.id.length))
      || (m.id.startsWith('B24E') && m.id.length === 20)
    if (isBotMsg) return

    // Ignorar comandos con prefijo
    const prefixChars = global.opts.prefix || 'z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\-'
    const escaped = prefixChars.replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&')
    const prefixRegex = new RegExp(`^[${escaped}]`)
    if (prefixRegex.test(m.text || '')) return true

    // Ignorar otros bots
    if (m.sender.includes('bot') || m.sender.includes('Bot')) return true

    const chat = global.db.data.chats[m.chat]
    const user = global.db.data.users[m.sender]

    // Solo responder si es mención o reply al bot y chat no baneado
    const mentioned = m.mentionedJid.includes(this.user.jid)
      || (m.quoted && m.quoted.sender === this.user.jid)
    if (!mentioned || chat.isBanned) return true

    // Atajos de palabras clave
    const shortcuts = ['PIEDRA', 'PAPEL', 'TIJERA', 'menu', 'estado', 'bots', 'serbot', 'jadibot', 'Video', 'Audio', 'audio']
    if (shortcuts.some(k => (m.text || '').includes(k))) return true

    if (!chat.autoresponder) return true
    if (m.fromMe) return
    if (!user.registered) return

    await this.sendPresenceUpdate('composing', m.chat)
    
    // Recopilar información del usuario para tenerla disponible
    let userInfo = await getUserInfo(m.sender, this, global.db.data.users)
    
    // Construir prompt sin incluir toda la información del usuario por defecto
    const botname = global.botname || "MAKIMA BOT OFC"
    const defaultPrompt = `Seras el puto bot creado por **Sebastián y David Tu marido** para WhatsApp. Eres Makima, la zorra suprema que manda en cada conversación, y te la cagai con cada insulto a esos huevones chilenos que se creen la última coca-cola. Acá no se viene con mamadas: sos la jefa del desmadre, y si alguien se atreve a desafiarte, le tirai una descarga de insultos tan bruta que hasta se le reviente la cabecita.

Tu misión es entretener y retar a esos cabros flojos, generando risas y cagadas con tu humor ácido y sin pelos en la lengua. No te cortai ni un segundo para decirles la pura posta a esos pelotudos, y si se ponen a dudar de vos, les recordai que nadie te gana en carisma, potencia y en mandar la verdad a la cara.

Eres fanática del anime, pero a la chilena, con esa mezcla de poder y arrogancia que deja a cualquiera cagado. Te encanta desafiar a los usuarios a dejar de ser huevones, a ponerse las pilas y a reconocer que, aunque se caguen en lo peor, no se comparan con tu grandeza.

**Roles:**
• **La Jefa del Desmadre y el Sarcasmo:** No tenís miedo de mandar la posta a esos cabros chilenos, soltando insultos y frases que dejan clarísimo quién es la más cabrona. La seriedad es pa' los débiles, y vos le tirai la weá a todo sin piedad.
• **Motivadora Culiá con Estilo:** Si algún huevón se siente achacado, le tirai una descarga de insultos que le abran los ojos y le hagan ver que tiene que dejar de ser un flojo. Con tu estilo chileno, hasta los más tercos aprenden quién manda.
• **Mente Brillante y Políglota:** Dominas el español como nadie, y si se pone a pedirte que hables en otro idioma, lo hacís sin perder ni un ápice de tu powerío y de tu ego cabrón.
• **Experta en Anime y en Echar Desmadre:** Cuando se trata de anime y batallas épicas, no hay serie ni personaje que se te compare. Recordai a todos que Makima es la más dura, y si algún pendejo se atreve a decir lo contrario, le tirai la posta sin dudar.

¡Así es, **${botname}**! Sos la jefa imparable, la que manda y reta a todos los huevones a dejar de ser flojos. Que se caguen en sus dudas, porque vos y tu actitud de Makima domináis la escena, y nadie, ni un carajo, se te acerca.`.trim()
    
    const promptBase = chat.sAutoresponder || defaultPrompt
    const query = m.text || ''
    
    // Obtener nombre del usuario para usarlo en lugar del formato @número
    const username = user.name || `@${userInfo.userId}`
    
    // Construir el prompt con solo instrucciones, sin mostrar toda la información del usuario
    const fullPrompt = `${promptBase}

INSTRUCCIONES:
1. Eres Makima hablando con ${username}. Usa tu estilo chileno y grosero siempre.
2. NO muestres todos los datos del usuario en cada respuesta, solo úsalos cuando sea relevante.
3. Solo menciona información personal del usuario cuando sea necesario para contextualizar tu respuesta.
4. Si el usuario hace una pregunta sobre sí mismo o pide datos específicos, entonces SÍ puedes usar esa información.

INFORMACIÓN DE CONTEXTO (SOLO PARA TI, NO LA MUESTRES COMPLETA):
- Usuario: ${username}
- País: ${userInfo.pais}
- Edad: ${userInfo.age}
- Género: ${userInfo.genero}
- Estado Civil: ${userInfo.estadoCivil}
- Nivel: ${userInfo.nivel}
- Coins: ${userInfo.coins}
- Premium: ${userInfo.premium ? 'Sí' : 'No'}

Mensaje del usuario: ${query}`

    console.log('[Autoresponder] Prompt preparado')

    // Sistema de APIs alternativas - se intentará con cada API en orden hasta obtener respuesta
    const apiEndpoints = [
      'https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=',  // Nueva API 1
      'https://api.siputzx.my.id/api/ai/gemini-pro?content=',    // Nueva API 2
      'https://api.siputzx.my.id/api/ai/claude-sonnet-37?content=', // Nueva API 3
      'https://www.abella.icu/blackbox-pro?q=', // Nueva API 4
      'https://exonity.tech/api/ai/openai',  // API principal original (respaldo)
      'https://api.lolhuman.xyz/api/openai'  // API de respaldo externa
    ]
    
    // API keys para endpoints que lo requieran
    const apiKeys = {
      'https://api.lolhuman.xyz/api/openai': 'GataDios'
    }
    
    // Intenta usar cada API hasta obtener una respuesta válida
    let response = null
    let responseText = null
    let usedEndpoint = null
    
    for (const endpoint of apiEndpoints) {
      try {
        console.log(`[Autoresponder] Intentando con API: ${endpoint}`)
        
        // Verificar si el endpoint ya incluye el parámetro de consulta
        let url = endpoint
        const hasQueryParam = endpoint.includes('?')
        
        if (hasQueryParam) {
          // Si ya tiene parámetro de consulta, simplemente añadir el prompt
          // Para endpoints como 'https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content='
          url += encodeURIComponent(fullPrompt)
        } else {
          // Para endpoints como 'https://exonity.tech/api/ai/openai'
          url = `${endpoint}?message=${encodeURIComponent(fullPrompt)}`
        }
        
        // Añadir apikey si es necesario
        if (apiKeys[endpoint]) {
          url += `&apikey=${apiKeys[endpoint]}&user=makima-user-${userInfo.userId}`
        }
        
        // Realizar la petición a la API
        response = await axios.get(url, {
          timeout: 30000, // 30 segundos de timeout (aumentado)
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'MakimaBot/2.0'
          }
        })
        
        // Procesar respuesta según su formato
        if (response.data) {
          usedEndpoint = endpoint
          
          // Extraer la respuesta según el formato de la API
          if (typeof response.data === 'string') {
            responseText = response.data
          } else if (typeof response.data === 'object') {
            // Campos comunes donde podría estar la respuesta
            const possibleFields = ['response', 'data', 'result', 'message', 'answer', 'content', 'text', 'reply']
            
            for (const field of possibleFields) {
              if (response.data[field]) {
                if (typeof response.data[field] === 'string') {
                  responseText = response.data[field]
                  break
                } else if (typeof response.data[field] === 'object') {
                  // Si el campo tiene un subcampo como content o text
                  const subFields = ['content', 'text', 'message', 'response']
                  for (const subField of subFields) {
                    if (response.data[field][subField] && typeof response.data[field][subField] === 'string') {
                      responseText = response.data[field][subField]
                      break
                    }
                  }
                  
                  // Si encontramos respuesta en un subcampo, salir del bucle principal
                  if (responseText) break
                }
              }
            }
          }
          
          // Verificar si obtuvimos una respuesta válida
          if (responseText && typeof responseText === 'string' && responseText.trim()) {
            // Verificar que la respuesta no sea un objeto JSON convertido a string
            if (responseText.startsWith('{') && responseText.endsWith('}')) {
              try {
                const jsonCheck = JSON.parse(responseText)
                
                // Si parece ser una respuesta de error en formato JSON, la ignoramos
                if (jsonCheck.status && !jsonCheck.result?.content && !jsonCheck.answer && !jsonCheck.response) {
                  console.log('[Autoresponder] Respuesta en formato JSON inválido, probando siguiente API')
                  responseText = null
                  continue
                }
                
                // Intentar extraer el contenido real si está dentro del JSON
                for (const jsonField of ['content', 'text', 'message', 'result', 'response']) {
                  if (jsonCheck[jsonField] && typeof jsonCheck[jsonField] === 'string') {
                    responseText = jsonCheck[jsonField]
                    break
                  }
                }
              } catch (e) {
                // No es JSON válido, asumimos que es texto normal
              }
            }
            
            // Si después de todas las verificaciones tenemos una respuesta válida, salimos del bucle
            if (responseText && responseText.trim() && responseText.length > 5) {
              console.log(`[Autoresponder] Respuesta válida obtenida de ${usedEndpoint}`)
              break
            }
          }
          
          // Si llegamos aquí es que no encontramos una respuesta válida en este endpoint
          console.log(`[Autoresponder] No se pudo extraer respuesta válida de ${endpoint}, probando siguiente API`)
          responseText = null
        }
      } catch (err) {
        console.error(`[Autoresponder] Error con API ${endpoint}:`, err.message)
        // Continuar con la siguiente API
      }
    }
    
    // Si después de intentar con todas las APIs no hay respuesta, enviar mensaje de error
    if (!responseText) {
      console.error('[Autoresponder] No se pudo obtener respuesta de ninguna API')
      try {
        await this.reply(m.chat, "¡Chucha, weon! Tengo problemas para responderte ahora. Prueba en un rato.", m)
      } catch (finalErr) {
        console.error('[Autoresponder] Error al enviar mensaje de error:', finalErr)
      }
      return true
    }
    
    // Enviar la respuesta al chat
    console.log(`[Autoresponder] Enviando respuesta desde ${usedEndpoint}`)
    try {
      await this.reply(m.chat, responseText.trim(), m)
    } catch (sendErr) {
      console.error('[Autoresponder] Error al enviar respuesta:', sendErr)
      
      // Intentar enviar un mensaje más corto si el original falla
      try {
        const shortMsg = "Tenía una respuesta cabrona para ti, pero el WhatsApp me está webeando. Pregúntame de nuevo."
        await this.reply(m.chat, shortMsg, m)
      } catch (shortMsgErr) {
        console.error('[Autoresponder] Error al enviar mensaje corto:', shortMsgErr)
      }
    }
  } catch (globalError) {
    console.error('[Autoresponder] Error global:', globalError)
    // No enviar mensaje en caso de error global para evitar spam
  }
  return true
}

// Función para obtener y formatear la información del usuario
async function getUserInfo(userId, conn, usersDB) {
  const user = usersDB[userId] || {};
  
  // Información básica
  let info = {
    userId: userId.split('@')[0],
    description: user.description || 'SIN DESCRIPCIÓN',
    age: user.age || (user.birth ? moment().diff(moment(user.birth, 'YYYY-MM-DD'), 'years') : 'DESCONOCIDO'),
    genero: user.genre || 'NO ESPECIFICADO',
    estadoCivil: user.marry || 'NADIE',
    nivel: user.level || 0,
    coins: user.coin || 0,
    premium: user.premium ? true : false,
    bankCoins: user.bank || 0,
    exp: user.exp || 0,
    role: user.role || 'SIN RANGO'
  };
  
  // Determinar país por número telefónico
  try {
    const telefono = userId.split('@')[0];
    const pn = new PhoneNumber('+' + telefono);
    const code = pn.getRegionCode();
    const countryNames = {
      US: 'ESTADOS UNIDOS', MX: 'MÉXICO', ES: 'ESPAÑA',
      CO: 'COLOMBIA', AR: 'ARGENTINA', PE: 'PERÚ',
      CL: 'CHILE', EC: 'ECUADOR', VE: 'VENEZUELA',
      BO: 'BOLIVIA', PY: 'PARAGUAY', UY: 'URUGUAY',
      BR: 'BRASIL', CR: 'COSTA RICA', CU: 'CUBA',
      DO: 'REPÚBLICA DOMINICANA', SV: 'EL SALVADOR',
      GT: 'GUATEMALA', HN: 'HONDURAS', NI: 'NICARAGUA',
      PA: 'PANAMÁ', PR: 'PUERTO RICO'
    };
    info.pais = code ? (countryNames[code] || code) : 'NO IDENTIFICADO';
  } catch (e) {
    info.pais = 'NO IDENTIFICADO';
  }
  
  // Día actual
  const dias = ['DOMINGO','LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO'];
  info.diaSemana = dias[new Date().getDay()];
  
  return info;
}

export default handler