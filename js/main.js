// El juego principal - las variables globales ya están cargadas desde settings.js y utils.js

console.log('main.js cargado - esperando DOM...');

// Variables globales que se inicializarán cuando el DOM esté listo
let boardEl, movesEl, timeEl, levelSel, winModal;
const sumMoves = document.getElementById('sumMoves');
const sumTime = document.getElementById('sumTime');
const currentLevelInfo = document.getElementById('currentLevelInfo');

// estado
let state = {
  levelKey: '3x4',
  currentLevel: 1,
  cards: [],
  flipped: [],
  matches: 0,
  moves: 0,
  ticking: false,
  seconds: 0,
  timerId: null,
  shuffleTriggered: false, // Para el efecto especial del volcán
  shuffleThreshold: 0.5, // 50% de cartas emparejadas
};

function startTimer(){
  if(state.ticking) return;
  state.ticking = true;
  state.timerId = setInterval(()=>{
    state.seconds++;
    timeEl.textContent = fmtTime(state.seconds);
  }, 1000);
}
function stopTimer(){
  state.ticking = false;
  clearInterval(state.timerId);
}

function newDeck(rows, cols, level = 1){
  const needPairs = (rows*cols)/2;
  const worldCards = getCardsForLevel(level);
  const selectedCards = shuffle([...worldCards]).slice(0, needPairs);
  return shuffle([...selectedCards, ...selectedCards]).map((card, idx)=>({
    id: idx, emoji: card.emoji, image: card.image, flipped: false, matched: false
  }));
}

function drawBoard(){
  if (!boardEl) {
    console.log('boardEl no encontrado');
    return;
  }
  
  if (!LEVELS || !LEVELS[state.levelKey]) {
    console.log('LEVELS o levelKey no encontrado:', state.levelKey);
    return;
  }
  
  const {rows, cols} = LEVELS[state.levelKey];
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  boardEl.style.gridTemplateRows = `repeat(${rows}, auto)`;
  boardEl.innerHTML = "";
  
  // Agregar efecto de mezcla
  boardEl.style.opacity = '0';
  boardEl.style.transform = 'scale(0.8)';
  
  state.cards.forEach(card=>{
    const c = document.createElement('button');
    c.className = 'card'; c.setAttribute('aria-label','carta');
    
    // Usar imagen si está disponible, sino emoji como fallback
    const frontContent = card.image 
      ? `<img src="${card.image}" alt="${card.emoji}" style="width:100%;height:100%;object-fit:contain;">`
      : card.emoji;
    
    // Determinar imagen del reverso según el mundo
    let backImage = '🐚'; // Fallback
    if (state.currentLevel <= 4) {
      backImage = `<img src="images/cards/ocean/portada.png" alt="Ocean" style="width:80%;height:80%;object-fit:contain;">`;
    } else if (state.currentLevel <= 8) {
      backImage = `<img src="images/cards/island/portada.png" alt="Island" style="width:80%;height:80%;object-fit:contain;">`;
    } else {
      backImage = `<img src="images/cards/volcano/portada.png" alt="Volcano" style="width:80%;height:80%;object-fit:contain;">`;
    }
    
    c.innerHTML = `
      <div class="inner">
        <div class="face back">${backImage}</div>
        <div class="face front">${frontContent}</div>
      </div>`;
    if (c) {
      c.addEventListener('click', ()=>onFlip(card.id, c));
    }
    boardEl.appendChild(c);
    card._el = c;
    
    // Asegurar que la carta esté boca abajo al inicio
    if (!card.flipped && !card.matched) {
      c.classList.remove('flipped');
    }
    
    console.log(`Carta ${card.id} creada: ${card.emoji}, flipped: ${card.flipped}`);
  });
  
  // Efecto de mezcla - mostrar cartas con animación
  setTimeout(() => {
    boardEl.style.transition = 'all 0.5s ease';
    boardEl.style.opacity = '1';
    boardEl.style.transform = 'scale(1)';
    
    // Cartas creadas correctamente
  }, 100);
  
  movesEl.textContent = state.moves;
  timeEl.textContent = fmtTime(state.seconds);
}

function onFlip(id, el){
  console.log(`CLICK en carta ${id}`);
  const card = state.cards.find(c=>c.id===id);
  if(!card) {
    console.log('Carta no encontrada');
    return;
  }
  if(card.flipped || card.matched) {
    console.log('Carta ya girada o emparejada');
    return;
  }
  if(state.flipped.length===2) {
    console.log('Ya hay 2 cartas giradas');
    return;
  }
  if(state.seconds===0 && !state.ticking) startTimer();

  console.log('Girando carta...');
  card.flipped = true;
  el.classList.add('flipped');

  // Sonido de voltear carta
  if (typeof SoundSystem !== 'undefined') {
    SoundSystem.play('flip');
  }

  state.flipped.push(card);
  if(state.flipped.length===2){
    state.moves++;
    movesEl.textContent = state.moves;
    const [a,b]=state.flipped;
    if(a.emoji===b.emoji){
      a.matched=b.matched=true;
      a._el.classList.add('matched'); b._el.classList.add('matched');
      state.flipped = [];
      state.matches += 1;
      
      // Sonido de emparejar
      if (typeof SoundSystem !== 'undefined') {
        SoundSystem.play('match');
      }
      
      // Verificar efecto especial del volcán
      checkVolcanoShuffleEffect();
      
      if(state.matches === state.cards.length/2){
        stopTimer();
        showWin();
      }
    } else {
      setTimeout(()=>{
        a.flipped=b.flipped=false;
        a._el.classList.remove('flipped');
        b._el.classList.remove('flipped');
        state.flipped=[];
      }, 700);
    }
  }
}

function reset(levelKey=state.levelKey){
  stopTimer();
  const currentLevel = state.currentLevel || 1;
  state = { 
    levelKey, 
    currentLevel, 
    cards:[], 
    flipped:[], 
    matches:0, 
    moves:0, 
    ticking:false, 
    seconds:0, 
    timerId:null,
    shuffleTriggered: false,
    shuffleThreshold: 0.5
  };
  const {rows, cols} = LEVELS[levelKey];
  state.cards = newDeck(rows, cols, currentLevel);
  drawBoard();
}

function showWin(){
  const stars = SCORING.calculateStars(state.levelKey, state.moves, state.seconds);
  const levelKey = `level_${state.currentLevel}`;
  const savedScore = Storage.saveScore(levelKey, state.moves, state.seconds, stars);

  sumMoves.textContent = state.moves;
  sumTime.textContent = fmtTime(state.seconds);
  
  // Sonido de victoria
  if (typeof SoundSystem !== 'undefined') {
    SoundSystem.play('win');
  }
  
  // Actualizar el modal con las estrellas
  const winTitle = document.getElementById('winTitle');
  const starsDisplay = SCORING.getStarsDisplay(stars);
  winTitle.innerHTML = `¡Nivel ${state.currentLevel} completado! ${starsDisplay}`;
  
  // Mostrar si es nuevo récord
  if (savedScore && (savedScore.bestStars === stars && savedScore.bestTime === state.seconds)) {
    winTitle.innerHTML += '<br><small style="color:#7bd389">¡Nuevo récord!</small>';
  }
  
  // Verificar trofeos ganados
  if (typeof TrophySystem !== 'undefined') {
    const newTrophies = TrophySystem.checkTrophies(state.currentLevel, state.moves, state.seconds, stars);
    newTrophies.forEach(trophy => {
      setTimeout(() => {
        showTrophyNotification(trophy);
        // Sonido de trofeo
        if (typeof SoundSystem !== 'undefined') {
          SoundSystem.play('trophy');
        }
      }, 1000); // Mostrar después del modal
    });
  }
  
  // Verificar logros expandidos
  if (typeof AchievementSystem !== 'undefined') {
    AchievementSystem.updatePlayingStreak();
    const newAchievements = AchievementSystem.checkAchievements(state.currentLevel, state.moves, state.seconds, stars);
    newAchievements.forEach(achievement => {
      setTimeout(() => {
        showAchievementNotification(achievement);
        // Sonido de logro
        if (typeof SoundSystem !== 'undefined') {
          SoundSystem.play('trophy');
        }
      }, 1500); // Mostrar después de los trofeos
    });
  }
  
  // Actualizar récord del jugador para ranking
  if (typeof updatePlayerRecord !== 'undefined') {
    updatePlayerRecord();
  }
  
  winModal.classList.add('show');
}
function hideWin(){ winModal.classList.remove('show'); }

// Efecto especial del volcán: mezclar cartas a mitad de partida
function checkVolcanoShuffleEffect() {
  // Solo en el nivel 4 del volcán (nivel 11 global)
  if (state.currentLevel !== 11) return;
  
  // Solo si no se ha activado ya
  if (state.shuffleTriggered) return;
  
  // Verificar si se ha alcanzado el umbral de cartas emparejadas
  const totalPairs = state.cards.length / 2;
  const matchedPairs = state.matches;
  const progressRatio = matchedPairs / totalPairs;
  
  if (progressRatio >= state.shuffleThreshold) {
    state.shuffleTriggered = true;
    triggerVolcanoShuffle();
  }
}

// Activar mezcla del volcán
function triggerVolcanoShuffle() {
  // Sonido de mezcla
  if (typeof SoundSystem !== 'undefined') {
    SoundSystem.play('shuffle');
  }
  
  // Mostrar notificación de efecto especial
  showVolcanoShuffleNotification();
  
  // Obtener cartas no emparejadas
  const unmatchedCards = state.cards.filter(card => !card.matched);
  
  // Voltear todas las cartas no emparejadas
  unmatchedCards.forEach(card => {
    card.flipped = false;
    if (card._el) {
      card._el.classList.remove('flipped');
    }
  });
  
  // Limpiar cartas volteadas
  state.flipped = [];
  
  // Mezclar las posiciones de las cartas no emparejadas
  setTimeout(() => {
    const shuffledCards = shuffle([...unmatchedCards]);
    
    // Reasignar posiciones
    let shuffleIndex = 0;
    state.cards.forEach((card, index) => {
      if (!card.matched) {
        // Intercambiar la carta actual con una carta mezclada
        const newCard = shuffledCards[shuffleIndex];
        const currentPosition = index;
        
        // Intercambiar en el array
        state.cards[index] = newCard;
        state.cards[index].id = index;
        
        shuffleIndex++;
      }
    });
    
    // Redibujar el tablero
    drawBoard();
    
    // Mostrar mensaje de confirmación
    setTimeout(() => {
      showVolcanoShuffleComplete();
    }, 1000);
    
  }, 2000); // Esperar 2 segundos para que se vea el efecto
}

// Mostrar notificación de efecto especial
function showVolcanoShuffleNotification() {
  const notification = document.createElement('div');
  notification.className = 'volcano-effect-notification';
  notification.innerHTML = `
    <div class="effect-content">
      <div class="effect-icon">🌋</div>
      <div class="effect-text">
        <div class="effect-title">¡Erupción Volcánica!</div>
        <div class="effect-desc">Las cartas se están mezclando...</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Mostrar confirmación de mezcla completada
function showVolcanoShuffleComplete() {
  const notification = document.createElement('div');
  notification.className = 'volcano-complete-notification';
  notification.innerHTML = `
    <div class="effect-content">
      <div class="effect-icon">⚡</div>
      <div class="effect-text">
        <div class="effect-title">¡Mezcla Completa!</div>
        <div class="effect-desc">Las cartas han cambiado de posición</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 500);
  }, 2500);
}

function showStats() {
  const totalStats = Storage.getTotalStats();
  const allScores = Storage.getScores();
  
  let html = `
    <div class="stat-row">
      <span>🎮 Partidas jugadas:</span>
      <strong>${totalStats.totalGames}</strong>
    </div>
    <div class="stat-row">
      <span>⭐ Estrellas totales:</span>
      <strong>${totalStats.totalStars}</strong>
    </div>
    <div class="stat-row">
      <span>🏆 Niveles completados:</span>
      <strong>${totalStats.levelsCompleted}/3</strong>
    </div>
  `;
  
  // Mostrar estadísticas por nivel
  Object.keys(LEVELS).forEach(levelKey => {
    const level = LEVELS[levelKey];
    const score = allScores[levelKey];
    
    html += `<div class="level-stats">
      <div class="level-title">${level.name} (${level.rows}×${level.cols})</div>`;
    
    if (score) {
      const starsDisplay = SCORING.getStarsDisplay(score.bestStars);
      html += `
        <div class="stat-row">
          <span>Mejor puntuación:</span>
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
        <div class="stat-row">
          <span>Veces jugado:</span>
          <strong>${score.timesPlayed}</strong>
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

function hideStats() {
  statsModal.classList.remove('show');
}

// Inicializar juego
function initGame() {
  // Sistema de temas deshabilitado
  // if (typeof ThemeSystem !== 'undefined') {
  //   ThemeSystem.init();
  // }
  
  // Inicializar sistema de sonidos
  if (typeof SoundSystem !== 'undefined') {
    SoundSystem.init();
  }
  
  // Inicializar sistema de tutorial
  if (typeof TutorialSystem !== 'undefined') {
    TutorialSystem.init();
  }
  
  // Comprobar si se ha seleccionado un nivel desde el mapa
  const selectedLevel = localStorage.getItem('selectedLevel');
  if (selectedLevel) {
    state.currentLevel = parseInt(selectedLevel);
    localStorage.removeItem('selectedLevel');
  }
  
  // Configurar nivel usando game-config.js
  if (typeof getLevelKeyForLevel !== 'undefined') {
    state.levelKey = getLevelKeyForLevel(state.currentLevel);
  } else {
    // Fallback al código anterior
    if (state.currentLevel <= 4) {
      state.levelKey = '3x4';
    } else if (state.currentLevel <= 8) {
      state.levelKey = '4x4';
    } else {
      state.levelKey = '4x5';
    }
  }
  
  // Actualizar info del nivel
  currentLevelInfo.textContent = `Nivel ${state.currentLevel}`;
  
  reset();
}

// eventos - se inicializan cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM listo - inicializando juego...');
  
  // Obtener elementos del DOM ahora que está listo
  boardEl = document.getElementById('board');
  movesEl = document.getElementById('moves');
  timeEl = document.getElementById('time');
  levelSel = document.getElementById('level');
  winModal = document.getElementById('winModal');
  
  console.log('Elementos del DOM:', {
    boardEl: !!boardEl,
    movesEl: !!movesEl,
    timeEl: !!timeEl,
    levelSel: !!levelSel,
    winModal: !!winModal
  });
  
  // Inicializar el juego cuando el DOM esté listo
  initGame();
  // restartBtn eliminado - no agregar event listener

  // Verificar que los elementos existan antes de agregar event listeners
  const againBtn = document.getElementById('again');
  const nextBtn = document.getElementById('next');

  if (againBtn) {
    againBtn.addEventListener('click', ()=>{ hideWin(); reset(); });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', ()=>{
  // Ir al siguiente nivel
  state.currentLevel++;
  if (state.currentLevel <= 11) {
    // Actualizar configuración del nivel usando game-config.js
    if (typeof getLevelKeyForLevel !== 'undefined') {
      state.levelKey = getLevelKeyForLevel(state.currentLevel);
    } else {
      // Fallback al código anterior
      if (state.currentLevel <= 4) {
        state.levelKey = '3x4';
      } else if (state.currentLevel <= 8) {
        state.levelKey = '4x4';
      } else {
        state.levelKey = '4x5';
      }
    }
    currentLevelInfo.textContent = `Nivel ${state.currentLevel}`;
    hideWin(); 
    reset();
  } else {
  // Ir al selector de mundos cuando se completen todos los niveles
  // Forzar actualización de datos antes de ir
  localStorage.setItem('forceRefresh', Date.now());
  window.location.href = 'index.html';
  }
  });
  } // Cerrar if (nextBtn)
}); // Cerrar DOMContentLoaded

// statsBtn y closeStatsBtn eliminados - no agregar event listeners
// levelMapBtn ya no existe - se maneja desde el header

// Cerrar modales con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideWin();
    hideStats();
  }
});
