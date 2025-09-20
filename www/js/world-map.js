// Mapa de Mundo Individual - MemoFlip

// Configuración de niveles por mundo
const LEVEL_DESCRIPTIONS = {
  ocean: {
    1: { name: 'Primer Chapuzón', description: '¡Tu primera aventura submarina!' },
    2: { name: 'Corrientes Marinas', description: 'Navega entre las corrientes del océano' },
    3: { name: 'Arrecife de Coral', description: 'Explora los coloridos arrecifes de coral' },
    4: { name: 'Kraken del Océano', description: '¡Enfrenta al guardián de las profundidades!' }
  },
  island: {
    5: { name: 'Playa Dorada', description: 'Relájate en la arena dorada' },
    6: { name: 'Selva Misteriosa', description: 'Explora la densa vegetación tropical' },
    7: { name: 'Cueva Secreta', description: 'Descubre los secretos ocultos de la isla' },
    8: { name: 'Guardián de la Isla', description: '¡El protector ancestral te desafía!' }
  },
  volcano: {
    9: { name: 'Ladera Ardiente', description: 'El calor aumenta la dificultad' },
    10: { name: 'Cráter Humeante', description: 'En el corazón del volcán' },
    11: { name: 'Dragón de Lava', description: '¡El desafío final te espera!' }
  }
};

// Elementos del DOM
const levelNodes = document.querySelectorAll('.level-node');
const pathConnectors = document.querySelectorAll('.path-connector');
const levelModal = document.getElementById('levelModal');
const levelTitle = document.getElementById('levelTitle');
const levelDescription = document.getElementById('levelDescription');
const levelSize = document.getElementById('levelSize');
const levelBestTime = document.getElementById('levelBestTime');
const levelBestStars = document.getElementById('levelBestStars');
const playLevelBtn = document.getElementById('playLevel');
const closeLevelModalBtn = document.getElementById('closeLevelModal');
const backToWorldsBtn = document.getElementById('backToWorlds');
const showStatsBtn = document.getElementById('showStats');
const statsModal = document.getElementById('statsModal');
const closeStatsBtn = document.getElementById('closeStats');
const statsContent = document.getElementById('statsContent');

// Variables globales
let currentWorld = null;
let selectedLevel = null;

// Inicializar mapa del mundo
function initWorldMap() {
  // Detectar mundo actual desde la URL o localStorage
  const urlPath = window.location.pathname;
  if (urlPath.includes('ocean')) {
    currentWorld = 'ocean';
  } else if (urlPath.includes('island')) {
    currentWorld = 'island';
  } else if (urlPath.includes('volcano')) {
    currentWorld = 'volcano';
  }
  
  if (!currentWorld) {
    // Fallback si no se puede detectar
    currentWorld = localStorage.getItem('selectedWorld') || 'ocean';
  }
  
  updateLevelStates();
  updateWorldProgress();
  attachEventListeners();
  addWorldEffects();
}

// Actualizar estados de los niveles
function updateLevelStates() {
  const worldLevels = getWorldLevels(currentWorld);
  let lastCompletedLevel = 0;
  
  // Encontrar el último nivel completado
  worldLevels.forEach(level => {
    const score = Storage.getBestScore(`level_${level}`);
    if (score) {
      lastCompletedLevel = level;
    }
  });
  
  levelNodes.forEach((node, index) => {
    const levelNum = worldLevels[worldLevels.length - 1 - index]; // Orden inverso (de arriba a abajo)
    const levelScore = Storage.getBestScore(`level_${levelNum}`);
    
    // Determinar si está desbloqueado
    const isUnlocked = levelNum === worldLevels[0] || lastCompletedLevel >= levelNum - 1;
    
    // Actualizar clases CSS
    node.classList.remove('locked', 'completed', 'available');
    
    if (!isUnlocked) {
      node.classList.add('locked');
      node.style.pointerEvents = 'none';
    } else if (levelScore) {
      node.classList.add('completed');
      // Mostrar estrellas
      const starsDisplay = node.querySelector('.stars-display');
      starsDisplay.textContent = SCORING.getStarsDisplay(levelScore.bestStars);
    } else {
      node.classList.add('available');
    }
    
    // Actualizar conectores
    const connectorIndex = Math.floor(index / 2);
    if (connectorIndex < pathConnectors.length) {
      const connector = pathConnectors[connectorIndex];
      if (isUnlocked) {
        connector.classList.remove('inactive');
      } else {
        connector.classList.add('inactive');
      }
    }
  });
}

// Obtener niveles de un mundo
function getWorldLevels(worldKey) {
  switch(worldKey) {
    case 'ocean': return [1, 2, 3, 4];
    case 'island': return [5, 6, 7, 8];
    case 'volcano': return [9, 10, 11];
    default: return [1, 2, 3, 4];
  }
}

// Actualizar progreso del mundo
function updateWorldProgress() {
  const worldLevels = getWorldLevels(currentWorld);
  let completed = 0;
  let totalStars = 0;
  
  worldLevels.forEach(level => {
    const score = Storage.getBestScore(`level_${level}`);
    if (score) {
      completed++;
      totalStars += score.bestStars;
    }
  });
  
  // Actualizar elementos del DOM
  const levelsCompletedEl = document.getElementById(`${currentWorld}LevelsCompleted`);
  const starsEarnedEl = document.getElementById(`${currentWorld}StarsEarned`);
  
  if (levelsCompletedEl) levelsCompletedEl.textContent = completed;
  if (starsEarnedEl) starsEarnedEl.textContent = totalStars;
}

// Mostrar modal de nivel
function showLevelModal(levelNum) {
  selectedLevel = levelNum;
  const levelInfo = LEVEL_DESCRIPTIONS[currentWorld][levelNum];
  const levelScore = Storage.getBestScore(`level_${levelNum}`);
  
  levelTitle.textContent = `Nivel ${levelNum} - ${levelInfo.name}`;
  levelDescription.textContent = levelInfo.description;
  
  // Determinar tamaño según el mundo
  let size = '3×4';
  if (currentWorld === 'island') size = '4×4';
  else if (currentWorld === 'volcano') size = '4×5';
  levelSize.textContent = size;
  
  if (levelScore) {
    levelBestTime.textContent = fmtTime(levelScore.bestTime);
    levelBestStars.textContent = SCORING.getStarsDisplay(levelScore.bestStars);
  } else {
    levelBestTime.textContent = '--:--';
    levelBestStars.textContent = '---';
  }
  
  levelModal.classList.add('show');
}

// Jugar nivel seleccionado
function playSelectedLevel() {
  if (!selectedLevel) return;
  
  // Guardar nivel seleccionado
  localStorage.setItem('selectedLevel', selectedLevel);
  
  // Ir al juego
  window.location.href = 'index.html';
}

// Mostrar estadísticas del mundo
function showWorldStats() {
  const worldLevels = getWorldLevels(currentWorld);
  const worldName = currentWorld === 'ocean' ? '🌊 Océano' : 
                   currentWorld === 'island' ? '🏝️ Isla' : '🌋 Volcán';
  
  let html = `<div class="level-title">${worldName}</div>`;
  
  worldLevels.forEach(level => {
    const levelInfo = LEVEL_DESCRIPTIONS[currentWorld][level];
    const score = Storage.getBestScore(`level_${level}`);
    
    html += `<div class="level-stats">
      <div class="level-title">Nivel ${level} - ${levelInfo.name}</div>`;
    
    if (score) {
      const starsDisplay = SCORING.getStarsDisplay(score.bestStars);
      html += `
        <div class="stat-row">
          <span>Puntuación:</span>
          <strong>${starsDisplay}</strong>
        </div>
        <div class="stat-row">
          <span>Mejor tiempo:</span>
          <strong>${fmtTime(score.bestTime)}</strong>
        </div>
        <div class="stat-row">
          <span>Menos intentos:</span>
          <strong>${score.bestMoves}</strong>
        </div>
      `;
    } else {
      html += '<div class="stat-row"><span>No completado</span><strong>-</strong></div>';
    }
    
    html += '</div>';
  });
  
  statsContent.innerHTML = html;
  statsModal.classList.add('show');
}

// Efectos visuales por mundo
function addWorldEffects() {
  if (currentWorld === 'ocean') {
    addOceanBubbles();
  } else if (currentWorld === 'island') {
    addIslandParticles();
  } else if (currentWorld === 'volcano') {
    addVolcanoEmbers();
  }
}

function addOceanBubbles() {
  // Burbujas más frecuentes
  setInterval(() => {
    if (Math.random() < 0.8) { // Aumentado de 0.4 a 0.8
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${Math.random() * 20 + 5}px;
        height: ${Math.random() * 20 + 5}px;
        animation-duration: ${Math.random() * 3 + 3}s;
        z-index: 0;
      `;
      
      document.querySelector('.world-map-background').appendChild(bubble);
      
      setTimeout(() => bubble.remove(), 6000);
    }
  }, 800); // Reducido de 2000ms a 800ms


}

function addIslandParticles() {
  // Hojas flotantes para la isla
  setInterval(() => {
    if (Math.random() < 0.3) {
      const leaf = document.createElement('div');
      leaf.textContent = ['🍃', '🌺', '🦋'][Math.floor(Math.random() * 3)];
      leaf.style.cssText = `
        position: absolute;
        font-size: 20px;
        pointer-events: none;
        animation: island-float 8s ease-in-out forwards;
        left: ${Math.random() * 100}%;
        top: 100%;
        z-index: 1;
      `;
      
      document.querySelector('.world-map-background').appendChild(leaf);
      setTimeout(() => leaf.remove(), 8000);
    }
  }, 3000);
}

function addVolcanoEmbers() {
  // Chispas volcánicas
  setInterval(() => {
    if (Math.random() < 0.5) {
      const ember = document.createElement('div');
      ember.textContent = ['🔥', '✨', '💥'][Math.floor(Math.random() * 3)];
      ember.style.cssText = `
        position: absolute;
        font-size: 16px;
        pointer-events: none;
        animation: volcano-ember 5s ease-out forwards;
        left: ${Math.random() * 100}%;
        top: 80%;
        z-index: 1;
      `;
      
      document.querySelector('.world-map-background').appendChild(ember);
      setTimeout(() => ember.remove(), 5000);
    }
  }, 2000);
}

// Event Listeners
function attachEventListeners() {
  // Nodos de niveles - IR DIRECTO AL NIVEL
  levelNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      if (!node.classList.contains('locked')) {
        const worldLevels = getWorldLevels(currentWorld);
        const levelNum = worldLevels[worldLevels.length - 1 - index]; // Orden inverso
        // Ir directo al nivel sin modal
        localStorage.setItem('selectedLevel', levelNum);
        window.location.href = 'index.html';
      }
    });
  });
  
  // Botones del modal
  playLevelBtn.addEventListener('click', playSelectedLevel);
  closeLevelModalBtn.addEventListener('click', () => {
    levelModal.classList.remove('show');
  });
  
  // Navegación
  backToWorldsBtn.addEventListener('click', () => {
    window.location.href = 'world-selector.html';
  });
  
  // Estadísticas
  showStatsBtn.addEventListener('click', showWorldStats);
  closeStatsBtn.addEventListener('click', () => {
    statsModal.classList.remove('show');
  });
  
  // Cerrar modales con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      levelModal.classList.remove('show');
      statsModal.classList.remove('show');
    }
  });
}

// CSS adicional para efectos
const worldMapEffectsStyles = document.createElement('style');
worldMapEffectsStyles.textContent = `
  @keyframes island-float {
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-120vh) rotate(180deg); opacity: 0; }
  }
  
  @keyframes volcano-ember {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    50% { transform: translateY(-30vh) scale(1.2); opacity: 0.8; }
    100% { transform: translateY(-60vh) scale(0.5); opacity: 0; }
  }
`;
document.head.appendChild(worldMapEffectsStyles);

// Función para ajustar tamaño dinámicamente - GARANTIZAR QUE TODO SE VEA
function adjustMapForScreen() {
  const vh = window.innerHeight;
  const availableHeight = vh - 60; // Sin header
  
  // Calcular espacio para 4 niveles + 3 conectores + padding
  const totalPadding = vh * 0.1; // 10% total padding
  const usableHeight = availableHeight - totalPadding;
  
  // 4 nodos + 3 conectores pequeños
  const connectorSpace = 30; // 3 conectores de 10px cada uno
  const nodeSpace = usableHeight - connectorSpace;
  const nodeSize = Math.max(45, Math.min(80, nodeSpace / 4));
  
  // Aplicar estilos dinámicos
  const style = document.createElement('style');
  style.id = 'dynamic-map-layout';
  
  const oldStyle = document.getElementById('dynamic-map-layout');
  if (oldStyle) oldStyle.remove();
  
  style.textContent = `
    .level-node {
      width: ${nodeSize}px !important;
      height: ${nodeSize}px !important;
    }
    .level-node.boss-level {
      width: ${nodeSize * 1.2}px !important;
      height: ${nodeSize * 1.2}px !important;
    }
    .level-path {
      height: ${availableHeight}px !important;
      max-height: ${availableHeight}px !important;
      justify-content: space-evenly !important;
      gap: ${Math.max(5, (usableHeight - (nodeSize * 4.2)) / 3)}px !important;
    }
    .path-connector {
      height: 8px !important;
      flex-shrink: 0;
    }
  `;
  
  document.head.appendChild(style);
  
  console.log(`Screen: ${vh}px | Available: ${availableHeight}px | Node: ${nodeSize}px`);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  initWorldMap();
  adjustMapForScreen();
});

// Reajustar cuando cambia el tamaño
window.addEventListener('resize', adjustMapForScreen);

// Actualizar cuando regresa del juego
window.addEventListener('focus', () => {
  updateLevelStates();
  updateWorldProgress();
});
