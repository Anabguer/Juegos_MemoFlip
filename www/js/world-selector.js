// Selector de Mundos - MemoFlip

// Configuración de mundos
const WORLD_CONFIG = {
  ocean: {
    name: '🌊 Mundo Océano',
    description: '¿Listo para explorar las profundidades marinas?',
    difficulty: 'Fácil (3×4)',
    levels: 4,
    unlocked: true,
    requiredStars: 0
  },
  island: {
    name: '🏝️ Mundo Isla',
    description: '¿Preparado para la aventura tropical?',
    difficulty: 'Medio (4×4)',
    levels: 4,
    unlocked: false,
    requiredStars: 6 // Necesita completar océano con al menos ⭐⭐
  },
  volcano: {
    name: '🌋 Mundo Volcán',
    description: '¿Tienes valor para enfrentar el fuego?',
    difficulty: 'Difícil (4×5)',
    levels: 3,
    unlocked: false,
    requiredStars: 12 // Necesita completar isla con al menos ⭐⭐
  }
};

// Elementos del DOM
const worldCards = document.querySelectorAll('.world-orb');
const totalStarsEl = document.getElementById('totalStars');
const totalLevelsEl = document.getElementById('totalLevels');
const showStatsBtn = document.getElementById('showStats');
const statsModal = document.getElementById('statsModal');
const closeStatsBtn = document.getElementById('closeStats');
const statsContent = document.getElementById('statsContent');

let selectedWorld = null;

// Inicializar selector de mundos
function initWorldSelector() {
  updateWorldStates();
  attachEventListeners();
  updateGlobalStats();
}

// Actualizar estados de los mundos
function updateWorldStates() {
  const totalStats = Storage.getTotalStats();
  const totalStars = totalStats.totalStars;
  
  Object.keys(WORLD_CONFIG).forEach(worldKey => {
    const world = WORLD_CONFIG[worldKey];
    const worldCard = document.querySelector(`[data-world="${worldKey}"]`);
    const worldStatus = document.getElementById(`${worldKey}Status`);
    const starsEl = document.getElementById(`${worldKey}Stars`);
    const progressEl = document.getElementById(`${worldKey}Progress`);
    
    // Calcular progreso del mundo
    const worldProgress = getWorldProgress(worldKey);
    const isUnlocked = totalStars >= world.requiredStars;
    const isCompleted = worldProgress.completed === world.levels;
    
    // Actualizar clases CSS
    worldCard.classList.remove('available', 'completed', 'locked');
    
    if (!isUnlocked) {
      worldCard.classList.add('locked');
      worldStatus.textContent = '🔒';
      worldStatus.title = `Necesitas ${world.requiredStars} ⭐`;
      worldCard.style.pointerEvents = 'none';
    } else if (isCompleted) {
      worldCard.classList.add('completed');
      worldStatus.textContent = '👑';
      worldStatus.title = '¡Completado!';
      worldCard.style.pointerEvents = 'auto';
    } else {
      worldCard.classList.add('available');
      worldStatus.textContent = '🟢';
      worldStatus.title = '¡Disponible!';
      worldCard.style.pointerEvents = 'auto';
    }
    
    // Actualizar estrellas y progreso
    starsEl.textContent = SCORING.getStarsDisplay(worldProgress.stars);
    progressEl.textContent = `${worldProgress.completed}/${world.levels}`;
  });
}

// Obtener progreso de un mundo específico
function getWorldProgress(worldKey) {
  const worldLevels = getWorldLevels(worldKey);
  let completed = 0;
  let totalStars = 0;
  
  worldLevels.forEach(level => {
    const score = Storage.getBestScore(`level_${level}`);
    if (score) {
      completed++;
      totalStars += score.bestStars;
    }
  });
  
  return { completed, stars: totalStars };
}

// Obtener niveles de un mundo
function getWorldLevels(worldKey) {
  switch(worldKey) {
    case 'ocean': return [1, 2, 3, 4];
    case 'island': return [5, 6, 7, 8];
    case 'volcano': return [9, 10, 11];
    default: return [];
  }
}

// Entrar directo al mundo (sin modal)
function enterWorld(worldKey) {
  // Guardar mundo seleccionado
  localStorage.setItem('selectedWorld', worldKey);
  
  // Ir directo al mapa del mundo
  window.location.href = `world-${worldKey}.html`;
}

// Entrar al mundo seleccionado
function enterSelectedWorld() {
  if (!selectedWorld) return;
  
  // Guardar mundo seleccionado
  localStorage.setItem('selectedWorld', selectedWorld);
  
  // Ir al mapa del mundo
  window.location.href = `world-${selectedWorld}.html`;
}

// Actualizar estadísticas globales
function updateGlobalStats() {
  const totalStats = Storage.getTotalStats();
  totalStarsEl.textContent = totalStats.totalStars;
  totalLevelsEl.textContent = totalStats.levelsCompleted;
}

// Mostrar estadísticas globales
function showGlobalStats() {
  const totalStats = Storage.getTotalStats();
  const allScores = Storage.getScores();
  
  let html = `
    <div class="stat-row">
      <span>🎮 Partidas jugadas:</span>
      <strong>${totalStats.totalGames}</strong>
    </div>
    <div class="stat-row">
      <span>⭐ Estrellas totales:</span>
      <strong>${totalStats.totalStars}/33</strong>
    </div>
    <div class="stat-row">
      <span>🏆 Niveles completados:</span>
      <strong>${totalStats.levelsCompleted}/11</strong>
    </div>
  `;
  
  // Estadísticas por mundo
  Object.keys(WORLD_CONFIG).forEach(worldKey => {
    const world = WORLD_CONFIG[worldKey];
    const progress = getWorldProgress(worldKey);
    const maxStars = world.levels * 3;
    
    html += `<div class="level-stats">
      <div class="level-title">${world.name}</div>
      <div class="stat-row">
        <span>Progreso:</span>
        <strong>${progress.completed}/${world.levels} niveles</strong>
      </div>
      <div class="stat-row">
        <span>Estrellas:</span>
        <strong>${progress.stars}/${maxStars} ⭐</strong>
      </div>
    </div>`;
  });
  
  statsContent.innerHTML = html;
  statsModal.classList.add('show');
}

// Event Listeners
function attachEventListeners() {
  // Tarjetas de mundos - Entrar directo
  worldCards.forEach(card => {
    card.addEventListener('click', () => {
      const worldKey = card.dataset.world;
      if (!card.classList.contains('locked')) {
        enterWorld(worldKey);
      }
    });
  });
  
  // Sin modal - entrada directa
  
  // Estadísticas
  showStatsBtn.addEventListener('click', showGlobalStats);
  closeStatsBtn.addEventListener('click', () => {
    statsModal.classList.remove('show');
  });
  
  // Cerrar modal de estadísticas con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      statsModal.classList.remove('show');
    }
  });
}

// Efectos visuales
function addVisualEffects() {
  // Partículas flotantes ocasionales
  setInterval(() => {
    if (Math.random() < 0.3) {
      createFloatingParticle();
    }
  }, 4000);
}

function createFloatingParticle() {
  const particle = document.createElement('div');
  particle.textContent = ['✨', '🌟', '💫', '⭐', '🔮'][Math.floor(Math.random() * 5)];
  particle.style.cssText = `
    position: absolute;
    font-size: 24px;
    pointer-events: none;
    animation: float-world 6s ease-in-out forwards;
    left: ${Math.random() * 100}%;
    top: 100%;
    z-index: 1;
  `;
  
  document.querySelector('.worlds-background').appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 6000);
}

// CSS para efectos
const worldEffectsStyles = document.createElement('style');
worldEffectsStyles.textContent = `
  @keyframes float-world {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-120vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(worldEffectsStyles);

// Función para ajustar tamaño dinámicamente
function adjustLayoutForScreen() {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  
  // Calcular altura disponible (sin header)
  const header = document.querySelector('.world-header');
  const headerHeight = header ? header.offsetHeight : 60;
  const availableHeight = vh - headerHeight - (vh * 0.1); // 10vh de padding total
  
  // Calcular tamaño óptimo para que siempre quepan las 3 tarjetas
  const totalCardsSpace = availableHeight * 0.85; // 85% del espacio para las tarjetas
  const totalGapsSpace = availableHeight * 0.15;  // 15% para gaps
  
  // Dividir entre 3 tarjetas y 2 gaps
  const cardHeight = Math.max(60, Math.min(120, totalCardsSpace / 3));
  const gap = Math.max(5, Math.min(25, totalGapsSpace / 2));
  
  // Tamaños proporcionales
  const iconSize = Math.max(40, Math.min(80, cardHeight * 0.65));
  const titleSize = Math.max(14, Math.min(20, cardHeight * 0.22));
  const statsSize = Math.max(10, Math.min(14, cardHeight * 0.16));
  const statusSize = Math.max(25, Math.min(40, cardHeight * 0.35));
  
  // Aplicar estilos dinámicos
  const style = document.createElement('style');
  style.id = 'dynamic-layout';
  
  // Remover estilo anterior si existe
  const oldStyle = document.getElementById('dynamic-layout');
  if (oldStyle) oldStyle.remove();
  
  style.textContent = `
    .worlds-grid {
      gap: ${gap}px !important;
      height: ${availableHeight}px !important;
      max-height: ${availableHeight}px !important;
    }
    .world-card {
      height: ${cardHeight}px !important;
      min-height: ${cardHeight}px !important;
      max-height: ${cardHeight}px !important;
    }
    .world-icon {
      width: ${iconSize}px !important;
      height: ${iconSize}px !important;
    }
    .world-title {
      font-size: ${titleSize}px !important;
    }
    .world-stats {
      font-size: ${statsSize}px !important;
    }
    .world-status {
      width: ${statusSize}px !important;
      height: ${statusSize}px !important;
      font-size: ${statusSize * 0.7}px !important;
    }
    
    /* Debug info */
    body::before {
      content: 'Screen: ${vw}x${vh} | Cards: ${cardHeight}px | Gap: ${gap}px';
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 5px;
      font-size: 10px;
      z-index: 9999;
      display: none; /* Oculto por defecto */
    }
  `;
  
  document.head.appendChild(style);
  
  console.log(`Pantalla: ${vw}x${vh} | Altura disponible: ${availableHeight}px | Altura tarjetas: ${cardHeight}px`);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  initWorldSelector();
  addVisualEffects();
  adjustLayoutForScreen();
});

// Reajustar cuando cambia el tamaño de pantalla
window.addEventListener('resize', adjustLayoutForScreen);

// Actualizar cuando regresa de un mundo
window.addEventListener('focus', () => {
  updateWorldStates();
  updateGlobalStats();
});
