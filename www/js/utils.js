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
      
      // Actualizar mejores puntuaciones
      if (stars > current.bestStars || 
          (stars === current.bestStars && seconds < current.bestTime)) {
        current.bestTime = seconds;
        current.bestMoves = moves;
        current.bestStars = stars;
      }
      
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
  
  getTotalStats() {
    const scores = this.getScores();
    let totalGames = 0, totalStars = 0;
    
    Object.values(scores).forEach(score => {
      totalGames += score.timesPlayed;
      totalStars += score.bestStars;
    });
    
    return { totalGames, totalStars, levelsCompleted: Object.keys(scores).length };
  }
};
