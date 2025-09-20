// Utilidades globales
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function pad(n){ return n<10 ? "0"+n : n; }
function fmtTime(s){ const m=Math.floor(s/60), r=s%60; return m+":"+pad(r); }

// Almacenamiento local para puntuaciones
const Storage = {
  STORAGE_KEY: 'memoflip_scores',
  
  getScores() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error loading scores:', e);
      return {};
    }
  },
  
  saveScore(level, moves, seconds, stars) {
    try {
      const scores = this.getScores();
      if (!scores[level]) {
        scores[level] = { bestTime: seconds, bestMoves: moves, bestStars: stars, timesPlayed: 0 };
      }
      
      const current = scores[level];
      current.timesPlayed++;
      
      // Actualizar puntuaciones (siempre guardar la última jugada)
      current.bestTime = seconds;
      current.bestMoves = moves;
      current.bestStars = stars;
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
      return scores[level];
    } catch (e) {
      console.error('Error saving score:', e);
      return null;
    }
  },
  
  getBestScore(level) {
    const scores = this.getScores();
    return scores[level] || null;
  },
  
  // FUNCIÓN PARA LIMPIAR DATOS CORRUPTOS
  cleanCorruptedData() {
    const scores = this.getScores();
    let cleaned = false;
    
    // Eliminar nivel 9 (volcán) si no se ha completado correctamente
    if (scores['9']) {
      console.log('🧹 Limpiando datos corruptos del nivel 9 (volcán)');
      delete scores['9'];
      cleaned = true;
    }
    
    if (cleaned) {
      localStorage.setItem('memoflip_scores', JSON.stringify(scores));
      console.log('🧹 Datos limpiados correctamente');
    }
    
    return cleaned;
  },

  getTotalStats() {
    // Limpiar datos corruptos antes de calcular
    this.cleanCorruptedData();
    
    const scores = this.getScores();
    let totalGames = 0, totalStars = 0;
    
    console.log('🌟 DEBUG TOTAL STATS - Scores disponibles:', scores);
    
    Object.entries(scores).forEach(([level, score]) => {
      console.log(`🌟 Nivel ${level}: ${score.bestStars} estrellas`);
      totalGames += score.timesPlayed;
      totalStars += score.bestStars;
    });
    
    console.log(`🌟 Total estrellas calculadas: ${totalStars}`);
    
    // Obtener total de trofeos
    let totalTrophies = 0;
    try {
      const trophies = JSON.parse(localStorage.getItem('memoflip_trophies') || '{}');
      totalTrophies = Object.keys(trophies).length;
    } catch (e) {
      console.error('Error loading trophies:', e);
    }
    
    return { totalGames, totalStars, totalTrophies, levelsCompleted: Object.keys(scores).length };
  }
};
