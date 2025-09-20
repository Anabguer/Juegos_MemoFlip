// Configuración global
const LEVELS = {
  "3x4": {rows:3, cols:4, name:"Fácil", maxTime:60, maxMoves:15},
  "4x4": {rows:4, cols:4, name:"Medio", maxTime:90, maxMoves:25},
  "4x5": {rows:4, cols:5, name:"Difícil", maxTime:120, maxMoves:35}
};

// Cartas por mundo temático
const WORLD_CARDS = {
  ocean: [
    { emoji: "🐠", image: "images/cards/ocean/pez-tropical.png" },
    { emoji: "🐟", image: "images/cards/ocean/pez-dorado.png" },
    { emoji: "🐡", image: "images/cards/ocean/pez-globo.png" },
    { emoji: "🦀", image: "images/cards/ocean/cangrejo.png" },
    { emoji: "🐳", image: "images/cards/ocean/ballena.png" },
    { emoji: "🐬", image: "images/cards/ocean/delfin.png" }
  ],
  island: [
    { emoji: "🌴", image: "images/cards/island/palmera.png" },
    { emoji: "🥥", image: "images/cards/island/coco.png" },
    { emoji: "🦜", image: "images/cards/island/loro.png" },
    { emoji: "🐒", image: "images/cards/island/mono.png" },
    { emoji: "🏝️", image: "images/cards/island/isla-pequena.png" },
    { emoji: "⛵", image: "images/cards/island/barco-pirata.png" }
  ],
  volcano: [
    { emoji: "🌋", image: "images/cards/volcano/volcan.png" },
    { emoji: "🔥", image: "images/cards/volcano/llama-fuego.png" },
    { emoji: "🪨", image: "images/cards/volcano/roca-volcanica.png" },
    { emoji: "🦎", image: "images/cards/volcano/lagarto.png" },
    { emoji: "💎", image: "images/cards/volcano/cristal.png" },
    { emoji: "⚡", image: "images/cards/volcano/rayo.png" },
        { emoji: "🥚", image: "images/cards/volcano/huevo.png" },
        { emoji: "🐦‍⬛", image: "images/cards/volcano/cuervo.png" },
    { emoji: "🌋", image: "images/cards/volcano/volcan.png" }, // Repetir para 4x5
    { emoji: "🔥", image: "images/cards/volcano/llama-fuego.png" } // Repetir para 4x5
  ]
};

// Función para obtener cartas según el nivel (usando game-config.js)
function getCardsForLevel(level) {
  // Usar game-config.js si está disponible
  if (typeof getWorldForLevel !== 'undefined') {
    const world = getWorldForLevel(level);
    return WORLD_CARDS[world] || WORLD_CARDS.ocean;
  }
  
  // Fallback al código anterior
  if (level <= 4) return WORLD_CARDS.ocean;
  if (level <= 8) return WORLD_CARDS.island;
  return WORLD_CARDS.volcano;
}

// Mantener compatibilidad con código existente
const EMOJIS = ["🐠","🐟","🐡","🦀","🐳","🐬","🐙","🪼","🦞","🐚","🦈","🪸","⚓️","🌊","🐋","🎣"];

// Sistema de puntuación con estrellas
const SCORING = {
  calculateStars(level, moves, seconds) {
    const levelData = LEVELS[level];
    if (!levelData) return 1;
    
    let stars = 3;
    
    // Penalizar por tiempo excesivo
    if (seconds > levelData.maxTime * 0.8) stars--;
    if (seconds > levelData.maxTime) stars--;
    
    // Penalizar por demasiados movimientos
    if (moves > levelData.maxMoves * 0.8) stars--;
    if (moves > levelData.maxMoves) stars--;
    
    return Math.max(1, stars);
  },
  
  getStarsDisplay(stars) {
    return '⭐'.repeat(stars) + '✩'.repeat(3 - stars);
  }
};
