// Sistema de Trofeos - MemoFlip
// Manejo de logros y recompensas locales

const TROPHY_DEFINITIONS = {
  ocean_guardian: {
    id: 'ocean_guardian',
    name: 'Guardián del Océano',
    description: 'Completa todos los niveles del mundo océano',
    emoji: '🌊',
    image: 'images/trophies/ocean-trophy.png',
    fallbackImage: 'images/ui/trofeo.png',
    category: 'world',
    requirement: {
      type: 'complete_world',
      world: 'ocean',
      levels: [1, 2, 3, 4]
    }
  },
  
  island_king: {
    id: 'island_king',
    name: 'Rey de la Isla',
    description: 'Completa todos los niveles del mundo isla',
    emoji: '🏝️',
    image: 'images/trophies/island-trophy.png',
    fallbackImage: 'images/ui/trofeo.png',
    category: 'world',
    requirement: {
      type: 'complete_world',
      world: 'island',
      levels: [5, 6, 7, 8]
    }
  },
  
  volcano_lord: {
    id: 'volcano_lord',
    name: 'Señor del Volcán',
    description: 'Completa todos los niveles del mundo volcán',
    emoji: '🌋',
    image: 'images/trophies/volcano-trophy.png',
    fallbackImage: 'images/ui/trofeo.png',
    category: 'world',
    requirement: {
      type: 'complete_world',
      world: 'volcano',
      levels: [9, 10, 11]
    }
  },
  
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Consigue 3 estrellas en todos los niveles',
    emoji: '⭐',
    image: 'images/trophies/perfect-trophy.png',
    fallbackImage: 'images/ui/star.png',
    category: 'skill',
    requirement: {
      type: 'perfect_stars',
      totalLevels: 11,
      starsRequired: 3
    }
  },
  
  lightning_fast: {
    id: 'lightning_fast',
    name: 'Rayo',
    description: 'Completa cualquier nivel en menos de 30 segundos',
    emoji: '⚡',
    image: 'images/trophies/speed-trophy.png',
    fallbackImage: 'images/ui/star.png',
    category: 'skill',
    requirement: {
      type: 'speed_record',
      maxTime: 30
    }
  },
  
  master_strategist: {
    id: 'master_strategist',
    name: 'Estratega',
    description: 'Completa un nivel con el mínimo de movimientos posible',
    emoji: '🎯',
    image: 'images/trophies/strategy-trophy.png',
    fallbackImage: 'images/ui/star.png',
    category: 'skill',
    requirement: {
      type: 'efficiency_record',
      description: 'Movimientos perfectos según el nivel'
    }
  }
};

// Sistema de gestión de trofeos
const TrophySystem = {
  STORAGE_KEY: 'memoflip_trophies',
  
  // Obtener trofeos ganados
  getEarnedTrophies() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error loading trophies:', e);
      return {};
    }
  },
  
  // Guardar trofeo ganado
  earnTrophy(trophyId) {
    try {
      const trophies = this.getEarnedTrophies();
      if (!trophies[trophyId]) {
        trophies[trophyId] = {
          earnedAt: Date.now(),
          earnedDate: new Date().toISOString()
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trophies));
        return true; // Nuevo trofeo ganado
      }
      return false; // Ya tenía este trofeo
    } catch (e) {
      console.error('Error saving trophy:', e);
      return false;
    }
  },
  
  // Verificar si un trofeo está ganado
  hasTrophy(trophyId) {
    const trophies = this.getEarnedTrophies();
    return !!trophies[trophyId];
  },
  
  // Obtener total de trofeos ganados
  getTotalTrophies() {
    return Object.keys(this.getEarnedTrophies()).length;
  },
  
  // Verificar todos los trofeos después de completar un nivel
  checkTrophies(levelCompleted, moves, seconds, stars) {
    const newTrophies = [];
    
    Object.values(TROPHY_DEFINITIONS).forEach(trophy => {
      if (!this.hasTrophy(trophy.id)) {
        if (this.checkTrophyRequirement(trophy, levelCompleted, moves, seconds, stars)) {
          if (this.earnTrophy(trophy.id)) {
            newTrophies.push(trophy);
          }
        }
      }
    });
    
    return newTrophies;
  },
  
  // Verificar si se cumple el requisito de un trofeo
  checkTrophyRequirement(trophy, levelCompleted, moves, seconds, stars) {
    const req = trophy.requirement;
    
    switch (req.type) {
      case 'complete_world':
        return this.checkWorldCompletion(req.levels);
      
      case 'perfect_stars':
        return this.checkPerfectStars(req.totalLevels, req.starsRequired);
      
      case 'speed_record':
        return seconds <= req.maxTime;
      
      case 'efficiency_record':
        return this.checkEfficiencyRecord(levelCompleted, moves);
      
      default:
        return false;
    }
  },
  
  // Verificar si un mundo está completado
  checkWorldCompletion(requiredLevels) {
    return requiredLevels.every(level => {
      const score = Storage.getBestScore(level.toString()); // Usar clave numérica
      return score && score.bestStars >= 1; // Al menos 1 estrella
    });
  },
  
  // Verificar estrellas perfectas
  checkPerfectStars(totalLevels, starsRequired) {
    let perfectLevels = 0;
    for (let level = 1; level <= totalLevels; level++) {
      const score = Storage.getBestScore(level.toString()); // Usar clave numérica
      if (score && score.bestStars >= starsRequired) {
        perfectLevels++;
      }
    }
    return perfectLevels >= totalLevels;
  },
  
  // Verificar récord de eficiencia (movimientos mínimos)
  checkEfficiencyRecord(levelCompleted, moves) {
    // Movimientos mínimos teóricos por nivel (basado en pares)
    const minMoves = {
      1: 6, 2: 8, 3: 10, 4: 12, // Océano (3x4)
      5: 8, 6: 10, 7: 12, 8: 16, // Isla (4x4)
      9: 10, 10: 12, 11: 16 // Volcán (4x5)
    };
    
    const theoreticalMin = minMoves[levelCompleted] || 999;
    return moves <= theoreticalMin;
  },
  
  // Obtener estadísticas de trofeos
  getTrophyStats() {
    const earned = this.getEarnedTrophies();
    const total = Object.keys(TROPHY_DEFINITIONS).length;
    const earnedCount = Object.keys(earned).length;
    
    const byCategory = {
      world: 0,
      skill: 0
    };
    
    Object.keys(earned).forEach(trophyId => {
      const trophy = TROPHY_DEFINITIONS[trophyId];
      if (trophy) {
        byCategory[trophy.category]++;
      }
    });
    
    return {
      total,
      earned: earnedCount,
      remaining: total - earnedCount,
      percentage: Math.round((earnedCount / total) * 100),
      byCategory
    };
  },
  
  // Obtener lista de trofeos para mostrar
  getTrophiesForDisplay() {
    const earned = this.getEarnedTrophies();
    
    return Object.values(TROPHY_DEFINITIONS).map(trophy => ({
      ...trophy,
      isEarned: !!earned[trophy.id],
      earnedAt: earned[trophy.id]?.earnedAt || null,
      earnedDate: earned[trophy.id]?.earnedDate || null
    }));
  }
};

// Función para mostrar notificación de nuevo trofeo
function showTrophyNotification(trophy) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = 'trophy-notification';
  notification.innerHTML = `
    <div class="trophy-notification-content">
      <div class="trophy-icon">${trophy.emoji}</div>
      <div class="trophy-info">
        <div class="trophy-title">¡Nuevo Trofeo!</div>
        <div class="trophy-name">${trophy.name}</div>
        <div class="trophy-desc">${trophy.description}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Mostrar animación
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Ocultar después de 4 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}

// CSS para las notificaciones de trofeos
const trophyNotificationStyles = document.createElement('style');
trophyNotificationStyles.textContent = `
  .trophy-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    border-radius: 15px;
    padding: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    transform: translateX(400px);
    transition: all 0.5s ease;
    max-width: 300px;
    border: 3px solid #FFD700;
  }
  
  .trophy-notification.show {
    transform: translateX(0);
  }
  
  .trophy-notification-content {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #1a1a2e;
  }
  
  .trophy-icon {
    font-size: 40px;
    animation: trophy-bounce 0.6s ease-in-out;
  }
  
  .trophy-title {
    font-size: 14px;
    font-weight: bold;
    color: #8B4513;
  }
  
  .trophy-name {
    font-size: 16px;
    font-weight: bold;
    margin: 2px 0;
  }
  
  .trophy-desc {
    font-size: 12px;
    opacity: 0.8;
  }
  
  @keyframes trophy-bounce {
    0%, 20%, 60%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    80% { transform: translateY(-5px); }
  }
  
  @media (max-width: 600px) {
    .trophy-notification {
      top: 10px;
      right: 10px;
      left: 10px;
      max-width: none;
      transform: translateY(-200px);
    }
    
    .trophy-notification.show {
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(trophyNotificationStyles);

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.TrophySystem = TrophySystem;
  window.TROPHY_DEFINITIONS = TROPHY_DEFINITIONS;
  window.showTrophyNotification = showTrophyNotification;
}

