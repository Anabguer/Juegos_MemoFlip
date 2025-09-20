/* ========================================
   MEMOFLIP - CONSTANTES DEL JUEGO
   ======================================== */

// CONFIGURACIÓN DE MUNDOS
const WORLDS = {
    OCEAN: {
        name: 'ocean',
        displayName: 'Mundo Océano',
        icon: '🌊',
        startLevel: 1,
        endLevel: 4,
        requiredStars: 0,
        difficulty: 'Fácil'
    },
    ISLAND: {
        name: 'island',
        displayName: 'Isla Tropical',
        icon: '🏝️',
        startLevel: 5,
        endLevel: 8,
        requiredStars: 6,
        difficulty: 'Media'
    },
    VOLCANO: {
        name: 'volcano',
        displayName: 'Volcán Ardiente',
        icon: '🌋',
        startLevel: 9,
        endLevel: 12,
        requiredStars: 12,
        difficulty: 'Difícil'
    }
};

// CONFIGURACIÓN DE NIVELES
const LEVEL_CONFIG = {
    MAX_LEVELS_PER_WORLD: 4,
    TOTAL_LEVELS: 12,
    MAX_STARS_PER_LEVEL: 3
};

// CONFIGURACIÓN DE CARTAS
const CARD_CONFIG = {
    MIN_PAIRS: 3,
    MAX_PAIRS: 8,
    DEFAULT_CARD_SIZE: 'medium'
};

// CONFIGURACIÓN DE TIEMPO
const TIMER_CONFIG = {
    UPDATE_INTERVAL: 1000, // 1 segundo
    ANIMATION_DURATION: 500, // 0.5 segundos
    CARD_FLIP_DURATION: 300 // 0.3 segundos
};

// CONFIGURACIÓN DE PUNTUACIÓN
const SCORING_CONFIG = {
    STAR_THRESHOLDS: {
        FAST: 30, // segundos
        MEDIUM: 60, // segundos
        SLOW: 120 // segundos
    },
    MOVE_THRESHOLDS: {
        EFFICIENT: 8,
        AVERAGE: 12,
        INEFFICIENT: 16
    }
};

// CONFIGURACIÓN DE UI
const UI_CONFIG = {
    HEADER_HEIGHT: 90,
    CARD_GRID_COLUMNS: 3,
    ANIMATION_DURATION: 300,
    MODAL_ANIMATION_DURATION: 300
};

// CONFIGURACIÓN DE ALMACENAMIENTO
const STORAGE_CONFIG = {
    SCORES_KEY: 'memoflip_scores',
    TROPHIES_KEY: 'memoflip_trophies',
    SETTINGS_KEY: 'memoflip_settings',
    PROGRESS_KEY: 'memoflip_progress'
};

// CONFIGURACIÓN DE ACTUALIZACIÓN
const UPDATE_CONFIG = {
    STATS_UPDATE_INTERVAL: 2000, // 2 segundos
    FOCUS_UPDATE_DELAY: 100, // 0.1 segundos
    STORAGE_UPDATE_DELAY: 100 // 0.1 segundos
};

// CONFIGURACIÓN DE ACCESIBILIDAD
const ACCESSIBILITY_CONFIG = {
    REDUCED_MOTION_DURATION: 0.01, // ms
    REDUCED_MOTION_ITERATIONS: 1
};

// CONFIGURACIÓN DE EFECTOS
const EFFECTS_CONFIG = {
    CARD_SCALE_ON_HOVER: 1.02,
    CARD_TRANSLATE_Y: -10,
    MODAL_BACKDROP_BLUR: 5,
    CARD_SHADOW_BLUR: 10
};

// CONFIGURACIÓN DE RESPONSIVE
const RESPONSIVE_CONFIG = {
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
    DESKTOP_BREAKPOINT: 1200
};

// CONFIGURACIÓN DE CACHE
const CACHE_CONFIG = {
    CACHE_VERSION: '20250919080500',
    CACHE_DURATION: 86400000 // 24 horas
};

// EXPORTAR CONSTANTES
if (typeof window !== 'undefined') {
    window.WORLDS = WORLDS;
    window.LEVEL_CONFIG = LEVEL_CONFIG;
    window.CARD_CONFIG = CARD_CONFIG;
    window.TIMER_CONFIG = TIMER_CONFIG;
    window.SCORING_CONFIG = SCORING_CONFIG;
    window.UI_CONFIG = UI_CONFIG;
    window.STORAGE_CONFIG = STORAGE_CONFIG;
    window.UPDATE_CONFIG = UPDATE_CONFIG;
    window.ACCESSIBILITY_CONFIG = ACCESSIBILITY_CONFIG;
    window.EFFECTS_CONFIG = EFFECTS_CONFIG;
    window.RESPONSIVE_CONFIG = RESPONSIVE_CONFIG;
    window.CACHE_CONFIG = CACHE_CONFIG;
}
