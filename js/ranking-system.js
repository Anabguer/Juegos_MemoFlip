// Sistema de Ranking - MemoFlip
// Gestión de puntuaciones y ranking local (preparado para Firebase)

// Definición de categorías de ranking
const RANKING_CATEGORIES = {
  memoscore: {
    id: 'memoscore',
    name: 'MemoScore Total',
    description: 'Puntuación general basada en estrellas, velocidad y eficiencia',
    emoji: '🏆',
    icon: 'images/ui/trofeo.png',
    sortOrder: 'desc' // Mayor es mejor
  },
  
  total_stars: {
    id: 'total_stars',
    name: 'Coleccionista de Estrellas',
    description: 'Total de estrellas obtenidas en todos los niveles',
    emoji: '⭐',
    icon: 'images/ui/star.png',
    sortOrder: 'desc'
  },
  
  speed_master: {
    id: 'speed_master',
    name: 'Maestro de la Velocidad',
    description: 'Tiempo promedio más rápido por nivel completado',
    emoji: '⚡',
    icon: 'images/ui/star.png',
    sortOrder: 'asc' // Menor es mejor
  },
  
  efficiency_expert: {
    id: 'efficiency_expert',
    name: 'Estratega Perfecto',
    description: 'Promedio de movimientos más bajo por nivel',
    emoji: '🎯',
    icon: 'images/ui/star.png',
    sortOrder: 'asc' // Menor es mejor
  },
  
  world_explorer: {
    id: 'world_explorer',
    name: 'Explorador de Mundos',
    description: 'Porcentaje de mundos completados',
    emoji: '🌍',
    icon: 'images/ui/trofeo.png',
    sortOrder: 'desc'
  }
};

// Sistema de ranking local
const RankingSystem = {
  STORAGE_KEY: 'memoflip_player_record',
  
  // Calcular MemoScore del jugador
  calculateMemoScore() {
    const scores = Storage.getScores();
    let totalMemoScore = 0;
    
    Object.keys(scores).forEach(levelKey => {
      const score = scores[levelKey];
      if (score) {
        // Base: Estrellas × 1000
        const baseScore = score.bestStars * 1000;
        
        // Bonus de velocidad (máximo 500 puntos)
        const speedBonus = Math.max(0, 500 - (score.bestTime * 5));
        
        // Bonus de eficiencia (máximo 300 puntos)
        const efficiencyBonus = Math.max(0, 300 - (score.bestMoves * 10));
        
        const levelMemoScore = baseScore + speedBonus + efficiencyBonus;
        totalMemoScore += levelMemoScore;
      }
    });
    
    return Math.round(totalMemoScore);
  },
  
  // Calcular estadísticas del jugador para ranking
  calculatePlayerStats() {
    const scores = Storage.getScores();
    const totalStats = Storage.getTotalStats();
    
    // Calcular promedios
    let totalTime = 0;
    let totalMoves = 0;
    let levelsCompleted = 0;
    
    Object.values(scores).forEach(score => {
      if (score) {
        totalTime += score.bestTime;
        totalMoves += score.bestMoves;
        levelsCompleted++;
      }
    });
    
    const avgTime = levelsCompleted > 0 ? totalTime / levelsCompleted : 999;
    const avgMoves = levelsCompleted > 0 ? totalMoves / levelsCompleted : 999;
    
    // Calcular porcentaje de mundos completados
    const worldsCompleted = this.calculateWorldsCompleted();
    const worldCompletionPercentage = (worldsCompleted.completed / worldsCompleted.total) * 100;
    
    return {
      memoscore: this.calculateMemoScore(),
      total_stars: totalStats.totalStars,
      speed_master: Math.round(avgTime * 10) / 10, // 1 decimal
      efficiency_expert: Math.round(avgMoves * 10) / 10, // 1 decimal
      world_explorer: Math.round(worldCompletionPercentage),
      levelsCompleted,
      totalGames: totalStats.totalGames,
      trophies: typeof TrophySystem !== 'undefined' ? TrophySystem.getTotalTrophies() : 0,
      lastUpdated: Date.now()
    };
  },
  
  // Calcular mundos completados
  calculateWorldsCompleted() {
    const oceanComplete = this.isWorldComplete([1, 2, 3, 4]);
    const islandComplete = this.isWorldComplete([5, 6, 7, 8]);
    const volcanoComplete = this.isWorldComplete([9, 10, 11]);
    
    const completed = [oceanComplete, islandComplete, volcanoComplete].filter(Boolean).length;
    
    return {
      completed,
      total: 3,
      details: {
        ocean: oceanComplete,
        island: islandComplete,
        volcano: volcanoComplete
      }
    };
  },
  
  // Verificar si un mundo está completo
  isWorldComplete(levels) {
    return levels.every(level => {
      const score = Storage.getBestScore(`level_${level}`);
      return score && score.bestStars >= 1;
    });
  },
  
  // Guardar récord del jugador
  savePlayerRecord() {
    try {
      const playerStats = this.calculatePlayerStats();
      const playerRecord = {
        ...playerStats,
        playerName: this.getPlayerName(),
        recordDate: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(playerRecord));
      return playerRecord;
    } catch (e) {
      console.error('Error saving player record:', e);
      return null;
    }
  },
  
  // Obtener récord del jugador
  getPlayerRecord() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading player record:', e);
      return null;
    }
  },
  
  // Obtener nombre del jugador (temporal hasta login)
  getPlayerName() {
    const savedName = localStorage.getItem('memoflip_player_name');
    return savedName || 'Jugador Anónimo';
  },
  
  // Establecer nombre del jugador
  setPlayerName(name) {
    localStorage.setItem('memoflip_player_name', name || 'Jugador Anónimo');
    this.savePlayerRecord(); // Actualizar récord
  },
  
  // Generar ranking local simulado (para demo hasta Firebase)
  generateLocalRanking(category = 'memoscore', limit = 10) {
    const playerRecord = this.getPlayerRecord() || this.calculatePlayerStats();
    
    // Generar jugadores simulados basados en el rendimiento del jugador
    const simulatedPlayers = this.generateSimulatedPlayers(playerRecord, category, limit - 1);
    
    // Agregar al jugador real
    const allPlayers = [
      {
        ...playerRecord,
        playerName: this.getPlayerName(),
        isCurrentPlayer: true,
        rank: 0 // Se calculará después
      },
      ...simulatedPlayers
    ];
    
    // Ordenar según la categoría
    const categoryInfo = RANKING_CATEGORIES[category];
    const sortOrder = categoryInfo.sortOrder;
    
    allPlayers.sort((a, b) => {
      const aValue = a[category] || 0;
      const bValue = b[category] || 0;
      
      if (sortOrder === 'desc') {
        return bValue - aValue; // Mayor a menor
      } else {
        return aValue - bValue; // Menor a mayor
      }
    });
    
    // Asignar rangos
    allPlayers.forEach((player, index) => {
      player.rank = index + 1;
    });
    
    return allPlayers.slice(0, limit);
  },
  
  // Generar jugadores simulados realistas
  generateSimulatedPlayers(basePlayer, category, count) {
    const players = [];
    const baseValue = basePlayer[category] || 0;
    
    // Nombres simulados
    const names = [
      'MasterMemo', 'FlipExpert', 'CardWizard', 'MemoryKing', 'PuzzlePro',
      'BrainStorm', 'QuickFlip', 'StarHunter', 'MemoryMaster', 'CardGenius',
      'FlashCard', 'MindReader', 'MemoryAce', 'PuzzleStar', 'BrainPower'
    ];
    
    for (let i = 0; i < count; i++) {
      const variation = (Math.random() - 0.5) * 0.4; // ±20% variación
      let simulatedValue;
      
      if (RANKING_CATEGORIES[category].sortOrder === 'desc') {
        // Para valores donde mayor es mejor
        simulatedValue = Math.max(0, Math.round(baseValue * (1 + variation)));
      } else {
        // Para valores donde menor es mejor
        simulatedValue = Math.max(1, Math.round(baseValue * (1 + Math.abs(variation))));
      }
      
      players.push({
        playerName: names[i % names.length] + (i > names.length - 1 ? (Math.floor(i / names.length) + 1) : ''),
        [category]: simulatedValue,
        memoscore: Math.round(Math.random() * 20000 + 5000),
        total_stars: Math.round(Math.random() * 33 + 10),
        speed_master: Math.round((Math.random() * 60 + 20) * 10) / 10,
        efficiency_expert: Math.round((Math.random() * 20 + 8) * 10) / 10,
        world_explorer: Math.round(Math.random() * 100 + 50),
        levelsCompleted: Math.round(Math.random() * 11 + 5),
        trophies: Math.round(Math.random() * 6 + 2),
        isCurrentPlayer: false,
        lastUpdated: Date.now() - Math.random() * 86400000 * 7 // Última semana
      });
    }
    
    return players;
  },
  
  // Obtener posición del jugador en una categoría
  getPlayerRank(category = 'memoscore') {
    const ranking = this.generateLocalRanking(category, 100);
    const playerEntry = ranking.find(p => p.isCurrentPlayer);
    return playerEntry ? playerEntry.rank : null;
  },
  
  // Obtener estadísticas de ranking del jugador
  getPlayerRankingStats() {
    const stats = {};
    
    Object.keys(RANKING_CATEGORIES).forEach(category => {
      stats[category] = {
        rank: this.getPlayerRank(category),
        value: this.calculatePlayerStats()[category]
      };
    });
    
    return stats;
  }
};

// Función para actualizar récord cuando se completa un nivel
function updatePlayerRecord() {
  if (typeof RankingSystem !== 'undefined') {
    RankingSystem.savePlayerRecord();
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.RankingSystem = RankingSystem;
  window.RANKING_CATEGORIES = RANKING_CATEGORIES;
  window.updatePlayerRecord = updatePlayerRecord;
}

