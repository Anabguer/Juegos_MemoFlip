// Configuración de Juego - MemoFlip
// Configuración unificada para todo el juego

const GAME_CONFIG = {
    // 🌊 MUNDO OCÉANO (sin cronómetro - aprendizaje)
    ocean: {
        name: 'Océano',
        theme: 'ocean',
        hasTimer: false,
        unlockRequirement: 0, // Siempre disponible
        levels: [
            {
                level: 1,
                pairs: 3,
                cards: 6,
                timer: null,
                description: 'Sin presión, para aprender'
            },
            {
                level: 2,
                pairs: 4,
                cards: 8,
                timer: null,
                description: 'Práctica básica'
            },
            {
                level: 3,
                pairs: 5,
                cards: 10,
                timer: null,
                description: 'Aumentando dificultad'
            },
            {
                level: 4,
                pairs: 6,
                cards: 12,
                timer: null,
                description: 'Preparación para el siguiente mundo'
            }
        ]
    },

    // 🏝️ MUNDO ISLA (cronómetro solo en el último)
    island: {
        name: 'Isla Tropical',
        theme: 'island',
        hasTimer: 'partial', // Solo último nivel
        unlockRequirement: 8, // ~8 estrellas del océano
        levels: [
            {
                level: 1,
                pairs: 4,
                cards: 8,
                timer: null,
                description: 'Inicio sin presión'
            },
            {
                level: 2,
                pairs: 5,
                cards: 10,
                timer: null,
                description: 'Subiendo el reto'
            },
            {
                level: 3,
                pairs: 6,
                cards: 12,
                timer: null,
                description: 'Casi al límite'
            },
            {
                level: 4,
                pairs: 6,
                cards: 12,
                timer: 120, // 2 minutos - tiempo generoso
                description: 'Primer reto con tiempo'
            }
        ]
    },

    // 🌋 MUNDO VOLCÁN (todos con cronómetro - máxima dificultad)
    volcano: {
        name: 'Volcán Ardiente',
        theme: 'volcano',
        hasTimer: true,
        unlockRequirement: 16, // ~16 estrellas totales
        levels: [
            {
                level: 1,
                pairs: 5,
                cards: 10,
                timer: 90, // 1.5 minutos - moderado
                description: 'Cronómetro moderado'
            },
            {
                level: 2,
                pairs: 6,
                cards: 12,
                timer: 75, // 1.25 minutos - más ajustado
                description: 'Tiempo más ajustado'
            },
            {
                level: 3,
                pairs: 7,
                cards: 14,
                timer: 60, // 1 minuto - rápido
                description: 'Cronómetro rápido'
            },
            {
                level: 4,
                pairs: 8,
                cards: 16,
                timer: 90, // 1.5 minutos pero con mezcla
                description: 'Tiempo + mezcla a mitad de partida',
                specialEffect: 'shuffle_mid_game' // Efecto especial
            }
        ]
    }
};

// Configuración de niveles (compatible con código existente)
const GAME_LEVELS = {
    "3x4": {rows:3, cols:4, name:"Fácil", maxTime:60, maxMoves:15},
    "4x4": {rows:4, cols:4, name:"Medio", maxTime:90, maxMoves:25},
    "4x5": {rows:4, cols:5, name:"Difícil", maxTime:120, maxMoves:35}
};

// Mapeo de niveles a mundos
const LEVEL_TO_WORLD = {
    1: 'ocean', 2: 'ocean', 3: 'ocean', 4: 'ocean',
    5: 'island', 6: 'island', 7: 'island', 8: 'island',
    9: 'volcano', 10: 'volcano', 11: 'volcano', 12: 'volcano'
};

// Mapeo de mundos a configuraciones de nivel
const WORLD_TO_LEVEL_CONFIG = {
    'ocean': '3x4',
    'island': '4x4',
    'volcano': '4x5' // Configuración por defecto, se sobrescribe por nivel específico
};

// Mapeo específico de niveles a configuraciones según roadmap
const LEVEL_TO_CONFIG = {
    // Océano (niveles 1-4): 6, 8, 10, 12 cartas
    1: '3x3',  // 6 cartas (3x3 = 9, pero usamos solo 6)
    2: '3x4',  // 8 cartas (3x4 = 12, pero usamos solo 8)
    3: '4x4',  // 10 cartas (4x4 = 16, pero usamos solo 10)
    4: '3x4',  // 12 cartas (3x4 = 12)
    
    // Isla (niveles 5-8): 8, 10, 12, 12 cartas
    5: '3x4',  // 8 cartas (3x4 = 12, pero usamos solo 8)
    6: '4x4',  // 10 cartas (4x4 = 16, pero usamos solo 10)
    7: '3x4',  // 12 cartas (3x4 = 12)
    8: '3x4',  // 12 cartas (3x4 = 12)
    
    // Volcán (niveles 9-12): 10, 12, 14, 16 cartas
    9: '4x4',  // 10 cartas (4x4 = 16, pero usamos solo 10)
    10: '3x4', // 12 cartas (3x4 = 12)
    11: '4x4', // 14 cartas (4x4 = 16, pero usamos solo 14)
    12: '4x4'  // 16 cartas (4x4 = 16)
};

// Función para obtener configuración de un mundo
function getWorldConfig(worldKey) {
    return GAME_CONFIG[worldKey] || null;
}

// Función para obtener configuración de un nivel específico
function getLevelConfig(worldKey, levelNumber) {
    const world = getWorldConfig(worldKey);
    if (!world) return null;
    
    return world.levels.find(level => level.level === levelNumber) || null;
}

// Función para verificar si un mundo está desbloqueado
function isWorldUnlocked(worldKey) {
    const world = getWorldConfig(worldKey);
    if (!world) return false;
    
    // Océano siempre está desbloqueado
    if (worldKey === 'ocean') return true;
    
    // Calcular estrellas totales
    const totalStars = getTotalStars();
    return totalStars >= world.unlockRequirement;
}

// Función para obtener estrellas totales
function getTotalStars() {
    let total = 0;
    
    // Usar el sistema Storage unificado
    if (typeof Storage !== 'undefined') {
        const scores = Storage.getScores();
        Object.values(scores).forEach(score => {
            if (score.bestStars) {
                total += score.bestStars;
            }
        });
    }
    
    return total;
}

// Función para verificar si un nivel está desbloqueado
function isLevelUnlocked(worldKey, levelNumber) {
    // El mundo debe estar desbloqueado
    if (!isWorldUnlocked(worldKey)) return false;
    
    // El nivel 1 siempre está desbloqueado si el mundo lo está
    if (levelNumber === 1) return true;
    
    // Los otros niveles requieren completar el anterior
    const worldProgress = getWorldProgress(worldKey);
    if (!worldProgress || !worldProgress.levels) return false;
    
    const previousLevel = worldProgress.levels[levelNumber - 2];
    return previousLevel && previousLevel.completed;
}

// Función para obtener el progreso de un mundo
function getWorldProgress(worldKey) {
    const savedProgress = localStorage.getItem(`${worldKey}Progress`);
    return savedProgress ? JSON.parse(savedProgress) : null;
}

// Función para guardar progreso de un mundo
function saveWorldProgress(worldKey, progress) {
    localStorage.setItem(`${worldKey}Progress`, JSON.stringify(progress));
}

// Función para obtener información de desbloqueo
function getUnlockInfo(worldKey) {
    const world = getWorldConfig(worldKey);
    if (!world) return null;
    
    const totalStars = getTotalStars();
    const required = world.unlockRequirement;
    
    return {
        isUnlocked: totalStars >= required,
        currentStars: totalStars,
        requiredStars: required,
        remaining: Math.max(0, required - totalStars)
    };
}

// Funciones auxiliares para compatibilidad
function getLevelKeyForLevel(levelNumber) {
    // Usar mapeo específico si existe, sino usar mapeo por mundo
    if (LEVEL_TO_CONFIG[levelNumber]) {
        return LEVEL_TO_CONFIG[levelNumber];
    }
    
    const world = LEVEL_TO_WORLD[levelNumber];
    return world ? WORLD_TO_LEVEL_CONFIG[world] : '3x4';
}

function getWorldForLevel(levelNumber) {
    return LEVEL_TO_WORLD[levelNumber] || 'ocean';
}

function getLevelConfigForLevel(levelNumber) {
    const world = getWorldForLevel(levelNumber);
    const worldConfig = getWorldConfig(world);
    if (!worldConfig) return null;
    
    // Calcular el nivel dentro del mundo (1-4)
    let levelInWorld;
    if (world === 'ocean') {
        levelInWorld = levelNumber; // Niveles 1-4
    } else if (world === 'island') {
        levelInWorld = levelNumber - 4; // Niveles 5-8 → 1-4
    } else if (world === 'volcano') {
        levelInWorld = levelNumber - 8; // Niveles 9-12 → 1-4
    }
    
    return worldConfig.levels.find(level => level.level === levelInWorld) || null;
}

// Exportar configuración para uso global
if (typeof window !== 'undefined') {
    window.GAME_CONFIG = GAME_CONFIG;
    // window.LEVELS = LEVELS; // CONFLICTO - ya existe en settings.js
    window.LEVEL_TO_WORLD = LEVEL_TO_WORLD;
    window.WORLD_TO_LEVEL_CONFIG = WORLD_TO_LEVEL_CONFIG;
    window.getWorldConfig = getWorldConfig;
    window.getLevelConfig = getLevelConfig;
    window.isWorldUnlocked = isWorldUnlocked;
    window.isLevelUnlocked = isLevelUnlocked;
    window.getTotalStars = getTotalStars;
    window.getUnlockInfo = getUnlockInfo;
    window.getLevelKeyForLevel = getLevelKeyForLevel;
    window.getWorldForLevel = getWorldForLevel;
    window.getLevelConfigForLevel = getLevelConfigForLevel;
}
