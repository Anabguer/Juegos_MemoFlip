// Componente de Header Global - MemoFlip
class HeaderComponent {
    constructor(options = {}) {
        this.showHome = options.showHome !== false;
        this.showRanking = options.showRanking !== false;
        this.homeUrl = options.homeUrl || 'world-selector.html';
        this.title = options.title || '';
    }

    render() {
        return `
            <header class="game-hud">
                <!-- ESTRUCTURA UNIFICADA: TODO EN UNA FILA -->
                <div class="hud-content">
                    <!-- IZQUIERDA: VACÍA (sin home) -->
                    <div class="hud-left">
                        <!-- Sin home aquí -->
                    </div>
                    
                    <!-- CENTRO: BANNER Y TÍTULO -->
                    <div class="hud-center">
                        <img src="images/ui/logo-banner.png" alt="MemoFlip" class="logo-banner">
                        ${this.title ? `<div class="page-title">${this.title}</div>` : ''}
                    </div>
                    
                    <!-- DERECHA: ESTADÍSTICAS Y NAVEGACIÓN -->
                    <div class="hud-right">
                        <!-- ESTADÍSTICAS (más grandes) -->
                        <div class="hud-stats">
                            <div class="stat-item stat-large">
                                <img src="images/ui/star.png" alt="Stars" class="hud-btn-img-large">
                                <span id="total-stars">0</span>
                            </div>
                            <div class="stat-item stat-large">
                                <img src="images/ui/trofeo.png" alt="Trophies" class="hud-btn-img-large">
                                <span id="total-trophies">0</span>
                            </div>
                        </div>
                        
                        <!-- NAVEGACIÓN (separada) -->
                        <div class="hud-nav">
                            ${this.showRanking ? `
                                <button class="hud-btn-simple" onclick="showRanking()">
                                    <img src="images/ui/ranking.png" alt="Ranking" class="hud-btn-img">
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- BOTÓN HOME FLOTANTE (fuera del header) -->
                ${this.showHome ? `
                    <button class="home-floating-btn" onclick="window.location.href='${this.homeUrl}'" title="Volver al inicio">
                        <img src="images/ui/home.png" alt="Home" class="home-floating-icon">
                    </button>
                ` : ''}
            </header>
        `;
    }

    mount(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.render();
            this.updateStats();
        }
    }

    updateStats() {
        const totalStars = document.getElementById('total-stars');
        const totalTrophies = document.getElementById('total-trophies');
        
        if (totalStars) {
            // Calcular estrellas totales desde Storage
            const totalStats = Storage.getTotalStats();
            totalStars.textContent = totalStats.totalStars;
        }
        
        if (totalTrophies) {
            // Calcular trofeos desde TrophySystem
            const trophyCount = typeof TrophySystem !== 'undefined' ? TrophySystem.getTotalTrophies() : 0;
            totalTrophies.textContent = trophyCount;
        }
    }
}

// Función global para inicializar header
function initHeader(options = {}) {
    const header = new HeaderComponent(options);
    header.mount('header-container');
    return header;
}

// Función global para mostrar trofeos
function showTrophies() {
    window.location.href = 'trophies.html';
}

// Función global para mostrar ranking
function showRanking() {
    window.location.href = 'ranking.html';
}
