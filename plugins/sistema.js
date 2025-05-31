import { initBotNameSystem } from '../lib/getBotName.js';

// Inicializar el sistema de nombres de bot al cargar el bot
(async () => {
  try {
    console.log('Inicializando sistema de nombres de bot...');
    await initBotNameSystem();
  } catch (error) {
    console.error('Error al inicializar sistema de nombres:', error);
  }
})();