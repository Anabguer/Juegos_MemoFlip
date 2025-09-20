// Sistema de Logros Expandido - MemoFlip
// Logros adicionales y medallas especiales

const AchievementSystem = {
  STORAGE_KEY: 'memoflip_achievements',
  
  // Logros expandidos
  ACHIEVEMENTS: {
    'marathon': {
      name: 'Maratón',
      description: 'Completa 10 niveles consecutivos sin perder.',
      image: 'images/ui/trofeo.png',
      fallbackEmoji: '🏃',
      category: 'skill',
      check: (level, moves, seconds, stars) => {
        // Verificar si ha completado 10 niveles seguidos
        let consecutiveWins = 0;
        for (let i = Math.max(1, level - 9); i <= level; i++) {
          const score = Storage.getBestScore(`level_${i}`);
          if (score && score.bestStars >= 1) {
            consecutiveWins++;
          } else {
            consecutiveWins = 0;
          }
        }
        return consecutiveWins >= 10;
      }
    },
    
    'perfectionist_total': {
      name: 'Perfeccionista Total',
      description: 'Consigue 3 estrellas en 20 niveles diferentes.',
      image: 'images/ui/trofeo.png',
      fallbackEmoji: '💎',
      category: 'skill',
      check: (level, moves, seconds, stars) => {
        const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const perfectLevels = allLevels.filter(lvl => {
          const score = Storage.getBestScore(`level_${lvl}`);
          return score && score.bestStars === 3;
        });
        return perfectLevels.length >= 20;
      }
    },
    
    'speed_demon': {
      name: 'Demonio de la Velocidad',
      description: 'Completa 5 niveles diferentes en menos de 20 segundos cada uno.',
      image: 'images/ui/trofeo.png',
      fallbackEmoji: '⚡',
      category: 'skill',
      check: (level, moves, seconds, stars) => {
        const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const fastLevels = allLevels.filter(lvl => {
          const score = Storage.getBestScore(`level_${lvl}`);
          return score && score.bestTime <= 20;
        });
        return fastLevels.length >= 5;
      }
    },
    
    'memory_master': {
      name: 'Maestro de la Memoria',
      description: 'Completa todos los mundos con al menos 2 estrellas en cada nivel.',
      image: 'images/ui/trofeo.png',
      fallbackEmoji: '🧠',
      category: 'world',
      check: (level, moves, seconds, stars) => {
        const oceanLevels = [1, 2, 3, 4];
        const islandLevels = [5, 6, 7, 8];
        const volcanoLevels = [9, 10, 11];
        
        const oceanComplete = oceanLevels.every(lvl => {
          const score = Storage.getBestScore(`level_${lvl}`);
          return score && score.bestStars >= 2;
        });
        
        const islandComplete = islandLevels.every(lvl => {
          const score = Storage.getBestScore(`level_${lvl}`);
          return score && score.bestStars >= 2;
        });
        
        const volcanoComplete = volcanoLevels.every(lvl => {
          const score = Storage.getBestScore(`level_${lvl}`);
          return score && score.bestStars >= 2;
        });
        
        return oceanComplete && islandComplete && volcanoComplete;
      }
    },
    
    'explorer': {
      name: 'Explorador',
      description: 'Juega al menos una vez en todos los niveles disponibles.',
      image: 'images/ui/trofeo.png',
      fallbackEmoji: '🗺️',
      category: 'world',
      check: (level, moves, seconds, stars) => {
        const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const playedLevels = allLevels.filter(lvl => {
          const score = Storage.getBestScore(`level_${lvl}`);
          return score !== null;
        });
        return playedLevels.length >= allLevels.length;
      }
    },
    
    'volcano_survivor': {
      name: 'Superviviente del Volcán',
      description: 'Completa el nivel 11 (efecto especial del volcán) en menos de 60 segundos.',
      image: 'images/ui/trofeo.png',
      fallbackEmoji: '🌋',
      category: 'skill',
      check: (level, moves, seconds, stars) => {
        if (level === 11) {
          return seconds <= 60;
        }
        // También verificar si ya lo completó en el tiempo requerido
        const score = Storage.getBestScore('level_11');
        return score && score.bestTime <= 60;
      }
    },
    
    'night_owl': {
      name: 'Búho Nocturno',
      description: 'Juega después de las 11 PM y completa un nivel.',
      image: 'images/ui/trofeo.png',
      fallbackEmoji: '🦉',
      category: 'special',
      check: (level, moves, seconds, stars) => {
        const now = new Date();
        const hour = now.getHours();
        return hour >= 23 || hour <= 5; // Entre 11 PM y 5 AM
      }
    },
    
    'early_bird': {
      name: 'Madrugador',
      description: 'Juega antes de las 7 AM y completa un nivel.',
      image: 'images/ui/trofeo.png',
      fallbackEmoji: '🐦',
      category: 'special',
      check: (level, moves, seconds, stars) => {
        const now = new Date();
        const hour = now.getHours();
        return hour >= 5 && hour <= 7; // Entre 5 AM y 7 AM
      }
    },
    
    'streak_master': {
      name: 'Maestro de Racha',
      description: 'Juega 7 días consecutivos.',
      image: 'images/ui/trofeo.png',
      fallbackEmoji: '🔥',
      category: 'special',
      check: (level, moves, seconds, stars) => {
        // Verificar días consecutivos jugados
        const today = new Date().toDateString();
        const streak = this.getPlayingStreak();
        return streak >= 7;
      }
    }
  },
  
  // Obtener logros ganados
  getEarnedAchievements() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error loading achievements:', e);
      return {};
    }
  },
  
  // Guardar logro
  saveAchievement(achievementKey) {
    const earnedAchievements = this.getEarnedAchievements();
    if (!earnedAchievements[achievementKey]) {
      earnedAchievements[achievementKey] = {
        earnedDate: new Date().toISOString(),
        new: true
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(earnedAchievements));
      return true;
    }
    return false;
  },
  
  // Marcar logro como visto
  markAchievementAsSeen(achievementKey) {
    const earnedAchievements = this.getEarnedAchievements();
    if (earnedAchievements[achievementKey]) {
      earnedAchievements[achievementKey].new = false;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(earnedAchievements));
    }
  },
  
  // Verificar logros
  checkAchievements(currentLevel, moves, seconds, stars) {
    const newAchievements = [];
    for (const key in this.ACHIEVEMENTS) {
      const achievement = this.ACHIEVEMENTS[key];
      const isEarned = this.getEarnedAchievements()[key];

      if (!isEarned && achievement.check(currentLevel, moves, seconds, stars)) {
        this.saveAchievement(key);
        newAchievements.push({ key, ...achievement });
      }
    }
    return newAchievements;
  },
  
  // Obtener total de logros
  getTotalAchievements() {
    return Object.keys(this.getEarnedAchievements()).length;
  },
  
  // Obtener racha de días jugando
  getPlayingStreak() {
    const streakData = localStorage.getItem('memoflip_playing_streak');
    if (!streakData) return 0;
    
    try {
      const { lastPlayDate, streak } = JSON.parse(streakData);
      const today = new Date().toDateString();
      const lastPlay = new Date(lastPlayDate).toDateString();
      
      if (today === lastPlay) {
        return streak;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (yesterday.toDateString() === lastPlay) {
          // Continúa la racha
          return streak + 1;
        } else {
          // Rompe la racha
          return 1;
        }
      }
    } catch (e) {
      return 0;
    }
  },
  
  // Actualizar racha de juego
  updatePlayingStreak() {
    const today = new Date();
    const streak = this.getPlayingStreak();
    
    const streakData = {
      lastPlayDate: today.toISOString(),
      streak: streak
    };
    
    localStorage.setItem('memoflip_playing_streak', JSON.stringify(streakData));
  }
};

// Función para mostrar notificación de logro
function showAchievementNotification(achievement) {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-icon">${achievement.fallbackEmoji}</div>
    <div class="achievement-content">
      <h3>¡Logro Desbloqueado!</h3>
      <p>${achievement.name}</p>
      <small>${achievement.description}</small>
    </div>
  `;
  
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');
    notification.addEventListener('transitionend', () => notification.remove());
  }, 4000);
}

// CSS para notificaciones de logros
const achievementNotificationStyles = document.createElement('style');
achievementNotificationStyles.textContent = `
  .achievement-notification {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3), 0 0 20px rgba(76,175,80,0.7);
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 1000;
    opacity: 0;
    transform: translateX(-400px);
    transition: transform 0.5s ease-out, opacity 0.5s ease-out;
    min-width: 300px;
    max-width: 90vw;
  }

  .achievement-notification.show {
    transform: translateX(0);
    opacity: 1;
  }

  .achievement-icon {
    font-size: 40px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }

  .achievement-content h3 {
    margin: 0 0 5px 0;
    font-size: 1.2em;
    color: white;
  }

  .achievement-content p {
    margin: 0 0 3px 0;
    font-size: 1em;
    font-weight: bold;
  }

  .achievement-content small {
    margin: 0;
    font-size: 0.85em;
    opacity: 0.9;
  }

  @media (max-width: 600px) {
    .achievement-notification {
      bottom: 10px;
      left: 10px;
      right: 10px;
      min-width: auto;
      transform: translateY(100px);
    }
    
    .achievement-notification.show {
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(achievementNotificationStyles);

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.AchievementSystem = AchievementSystem;
  window.showAchievementNotification = showAchievementNotification;
}

