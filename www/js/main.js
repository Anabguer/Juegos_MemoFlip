// El juego principal - las variables globales ya están cargadas desde settings.js y utils.js

const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const levelSel = document.getElementById('level');
const restartBtn = document.getElementById('restart');
const winModal = document.getElementById('winModal');
const againBtn = document.getElementById('again');
const nextBtn = document.getElementById('next');
const sumMoves = document.getElementById('sumMoves');
const sumTime = document.getElementById('sumTime');
const statsBtn = document.getElementById('statsBtn');
const statsModal = document.getElementById('statsModal');
const closeStatsBtn = document.getElementById('closeStats');
const statsContent = document.getElementById('statsContent');
const levelMapBtn = document.getElementById('levelMapBtn');
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
  const {rows, cols} = LEVELS[state.levelKey];
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  boardEl.style.gridTemplateRows = `repeat(${rows}, auto)`;
  boardEl.innerHTML = "";
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
    c.addEventListener('click', ()=>onFlip(card.id, c));
    boardEl.appendChild(c);
    card._el = c;
  });
  movesEl.textContent = state.moves;
  timeEl.textContent = fmtTime(state.seconds);
}

function onFlip(id, el){
  const card = state.cards.find(c=>c.id===id);
  if(card.flipped || card.matched) return;
  if(state.flipped.length===2) return;
  if(state.seconds===0 && !state.ticking) startTimer();

  card.flipped = true;
  el.classList.add('flipped');

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
  state = { levelKey, currentLevel, cards:[], flipped:[], matches:0, moves:0, ticking:false, seconds:0, timerId:null };
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
  
  // Actualizar el modal con las estrellas
  const winTitle = document.getElementById('winTitle');
  const starsDisplay = SCORING.getStarsDisplay(stars);
  winTitle.innerHTML = `¡Nivel ${state.currentLevel} completado! ${starsDisplay}`;
  
  // Mostrar si es nuevo récord
  if (savedScore && (savedScore.bestStars === stars && savedScore.bestTime === state.seconds)) {
    winTitle.innerHTML += '<br><small style="color:#7bd389">¡Nuevo récord!</small>';
  }
  
  winModal.classList.add('show');
}
function hideWin(){ winModal.classList.remove('show'); }

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
  // Comprobar si se ha seleccionado un nivel desde el mapa
  const selectedLevel = localStorage.getItem('selectedLevel');
  if (selectedLevel) {
    state.currentLevel = parseInt(selectedLevel);
    localStorage.removeItem('selectedLevel');
  }
  
  // Configurar nivel basado en currentLevel
  if (state.currentLevel <= 4) {
    state.levelKey = '3x4';
  } else if (state.currentLevel <= 8) {
    state.levelKey = '4x4';
  } else {
    state.levelKey = '4x5';
  }
  
  // Actualizar info del nivel
  currentLevelInfo.textContent = `Nivel ${state.currentLevel}`;
  
  reset();
}

initGame();

// eventos
restartBtn.addEventListener('click', ()=> reset());
againBtn.addEventListener('click', ()=>{ hideWin(); reset(); });
nextBtn.addEventListener('click', ()=>{
  // Ir al siguiente nivel
  state.currentLevel++;
  if (state.currentLevel <= 11) {
    // Actualizar configuración del nivel
    if (state.currentLevel <= 4) {
      state.levelKey = '3x4';
    } else if (state.currentLevel <= 8) {
      state.levelKey = '4x4';
    } else {
      state.levelKey = '4x5';
    }
    currentLevelInfo.textContent = `Nivel ${state.currentLevel}`;
    hideWin(); 
    reset();
  } else {
    // Ir al selector de mundos cuando se completen todos los niveles
    window.location.href = 'world-selector.html';
  }
});
statsBtn.addEventListener('click', showStats);
closeStatsBtn.addEventListener('click', hideStats);
levelMapBtn.addEventListener('click', () => {
  window.location.href = 'world-selector.html';
});

// Cerrar modales con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideWin();
    hideStats();
  }
});
