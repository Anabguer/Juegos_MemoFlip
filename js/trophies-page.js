// Página de Trofeos - MemoFlip
// Gestión de la pantalla de trofeos y logros

let currentFilter = 'all';

// Inicializar página de trofeos
function initTrophiesPage() {
    console.log('🏆 Inicializando página de trofeos...');
    updateTrophyStats();
    renderTrophies();
    attachTrophyEventListeners();
    console.log('🏆 Página de trofeos inicializada');
}

// Actualizar estadísticas de trofeos
function updateTrophyStats() {
    const stats = TrophySystem.getTrophyStats();
    
    const earnedCountEl = document.getElementById('earned-count');
    const totalCountEl = document.getElementById('total-count');
    const completionPercentageEl = document.getElementById('completion-percentage');
    
    if (earnedCountEl) earnedCountEl.textContent = stats.earned;
    if (totalCountEl) totalCountEl.textContent = stats.total;
    if (completionPercentageEl) completionPercentageEl.textContent = `${stats.percentage}%`;
}

// Renderizar lista de trofeos
function renderTrophies(filter = 'all') {
    const container = document.getElementById('trophies-container');
    if (!container) {
        console.error('🏆 No se encontró el contenedor de trofeos');
        return;
    }
    
    const trophies = TrophySystem.getTrophiesForDisplay();
    console.log('🏆 Trofeos obtenidos:', trophies);
    const filteredTrophies = filterTrophies(trophies, filter);
    console.log('🏆 Trofeos filtrados:', filteredTrophies);
    
    if (filteredTrophies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏆</div>
                <div class="empty-state-text">No hay trofeos en esta categoría</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTrophies.map(trophy => createTrophyCard(trophy)).join('');
}

// Filtrar trofeos por categoría
function filterTrophies(trophies, filter) {
    if (filter === 'all') return trophies;
    return trophies.filter(trophy => trophy.category === filter);
}

// Crear tarjeta de trofeo
function createTrophyCard(trophy) {
    const isEarned = trophy.isEarned;
    const earnedDate = trophy.earnedDate ? new Date(trophy.earnedDate).toLocaleDateString('es-ES') : '';
    
    return `
        <div class="trophy-card ${isEarned ? 'earned' : ''}" data-trophy-id="${trophy.id}">
            ${!isEarned ? '<div class="trophy-locked-overlay">🔒</div>' : ''}
            
            <div class="trophy-content">
                <div class="trophy-icon-container">
                    ${createTrophyIcon(trophy, isEarned)}
                </div>
                
                <div class="trophy-info">
                    <h3 class="trophy-name">${trophy.name}</h3>
                    <p class="trophy-description">${trophy.description}</p>
                    ${isEarned && earnedDate ? `<div class="trophy-earned-date">Obtenido el ${earnedDate}</div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Crear icono de trofeo (imagen o emoji)
function createTrophyIcon(trophy, isEarned) {
    // Intentar usar imagen primero, luego fallback, luego emoji
    const imagePath = trophy.image;
    const fallbackPath = trophy.fallbackImage;
    
    return `
        <img 
            src="${imagePath}" 
            alt="${trophy.name}" 
            class="trophy-icon"
            onerror="this.onerror=null; this.src='${fallbackPath}'; if(this.src.includes('${fallbackPath}') && this.src === '${fallbackPath}') { this.style.display='none'; this.nextElementSibling.style.display='block'; }"
        >
        <div class="trophy-emoji" style="display:none;">${trophy.emoji}</div>
    `;
}

// Eventos de la página de trofeos
function attachTrophyEventListeners() {
    // Filtros de categoría
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botón activo
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Aplicar filtro
            currentFilter = btn.dataset.category;
            renderTrophies(currentFilter);
        });
    });
    
    // Click en tarjetas de trofeos (para futuras funcionalidades)
    document.addEventListener('click', (e) => {
        const trophyCard = e.target.closest('.trophy-card');
        if (trophyCard) {
            const trophyId = trophyCard.dataset.trophyId;
            onTrophyCardClick(trophyId);
        }
    });
}

// Manejar click en tarjeta de trofeo
function onTrophyCardClick(trophyId) {
    const trophy = TROPHY_DEFINITIONS[trophyId];
    if (!trophy) return;
    
    // Efecto visual de click
    const card = document.querySelector(`[data-trophy-id="${trophyId}"]`);
    if (card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
    
    // Mostrar información adicional (futuro)
    showTrophyDetails(trophy);
}

// Mostrar detalles de trofeo (modal futuro)
function showTrophyDetails(trophy) {
    // Por ahora solo mostrar en consola
    console.log('Detalles del trofeo:', trophy);
    
    // Aquí se podría implementar un modal con:
    // - Descripción detallada
    // - Progreso hacia el trofeo
    // - Pistas para obtenerlo
    // - Estadísticas relacionadas
}

// Función para actualizar la página cuando se gana un nuevo trofeo
function refreshTrophiesPage() {
    if (document.getElementById('trophies-container')) {
        updateTrophyStats();
        renderTrophies(currentFilter);
        
        // Actualizar header si existe
        const header = document.querySelector('.game-hud');
        if (header && typeof HeaderComponent !== 'undefined') {
            // Buscar instancia del header y actualizar
            const totalTrophies = document.getElementById('total-trophies');
            if (totalTrophies) {
                totalTrophies.textContent = TrophySystem.getTotalTrophies();
            }
        }
    }
}

// Función para mostrar animación de nuevo trofeo en la página
function highlightNewTrophy(trophyId) {
    const card = document.querySelector(`[data-trophy-id="${trophyId}"]`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('new-trophy-highlight');
        
        setTimeout(() => {
            card.classList.remove('new-trophy-highlight');
        }, 3000);
    }
}

// CSS adicional para efectos especiales
const trophyPageEffectsStyles = document.createElement('style');
trophyPageEffectsStyles.textContent = `
    .new-trophy-highlight {
        animation: new-trophy-pulse 1s ease-in-out 3;
        border-color: #FFD700 !important;
        box-shadow: 0 0 30px rgba(255,215,0,0.8) !important;
    }
    
    @keyframes new-trophy-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .trophy-card {
        cursor: pointer;
    }
    
    .trophy-card:active {
        transform: scale(0.95) !important;
    }
`;
document.head.appendChild(trophyPageEffectsStyles);

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.initTrophiesPage = initTrophiesPage;
    window.refreshTrophiesPage = refreshTrophiesPage;
    window.highlightNewTrophy = highlightNewTrophy;
}

