// Página de Ranking - MemoFlip
// Gestión de la pantalla de leaderboard y competencia

let currentCategory = 'memoscore';
let currentRanking = [];

// Inicializar página de ranking
function initRankingPage() {
    updatePlayerRecord();
    loadRanking();
    updatePlayerInfo();
    attachRankingEventListeners();
}

// Actualizar récord del jugador
function updatePlayerRecord() {
    RankingSystem.savePlayerRecord();
}

// Cargar ranking para la categoría actual
function loadRanking(category = 'memoscore') {
    currentCategory = category;
    
    // Mostrar estado de carga
    showLoadingState();
    
    // Simular delay de red (para realismo)
    setTimeout(() => {
        currentRanking = RankingSystem.generateLocalRanking(category, 10);
        renderRanking();
        updateCategoryInfo();
        hideLoadingState();
    }, 500);
}

// Renderizar ranking completo
function renderRanking() {
    renderPodium();
    renderLeaderboard();
}

// Renderizar podium (top 3)
function renderPodium() {
    const container = document.getElementById('podium-container');
    if (!container) return;
    
    const top3 = currentRanking.slice(0, 3);
    
    if (top3.length < 3) {
        container.innerHTML = '<div class="loading-state">Insuficientes jugadores para podium</div>';
        return;
    }
    
    // Ordenar para podium: 2do, 1ro, 3ro
    const podiumOrder = [top3[1], top3[0], top3[2]];
    const positions = ['second', 'first', 'third'];
    const medals = ['🥈', '🥇', '🥉'];
    
    container.innerHTML = podiumOrder.map((player, index) => {
        if (!player) return '';
        
        const position = positions[index];
        const medal = medals[index];
        const value = formatScoreValue(player[currentCategory], currentCategory);
        
        return `
            <div class="podium-place ${position}">
                <div class="podium-player">
                    <div class="podium-avatar">${player.isCurrentPlayer ? '👤' : '🎮'}</div>
                    <div class="podium-name">${player.playerName}</div>
                    <div class="podium-score">${value}</div>
                </div>
                <div class="podium-base">${medal}</div>
            </div>
        `;
    }).join('');
}

// Renderizar leaderboard completo
function renderLeaderboard() {
    const container = document.getElementById('leaderboard');
    if (!container) return;
    
    container.innerHTML = currentRanking.map(player => {
        const value = formatScoreValue(player[currentCategory], currentCategory);
        const additionalInfo = getAdditionalPlayerInfo(player);
        
        return `
            <div class="leaderboard-entry ${player.isCurrentPlayer ? 'current-player' : ''}">
                <div class="entry-rank">#${player.rank}</div>
                <div class="entry-avatar">${player.isCurrentPlayer ? '👤' : '🎮'}</div>
                <div class="entry-info">
                    <div class="entry-name">${player.playerName}</div>
                    <div class="entry-details">${additionalInfo}</div>
                </div>
                <div class="entry-score">${value}</div>
            </div>
        `;
    }).join('');
}

// Actualizar información del jugador actual
function updatePlayerInfo() {
    const playerRecord = RankingSystem.getPlayerRecord();
    if (!playerRecord) return;
    
    const playerNameEl = document.getElementById('player-name');
    const playerRankEl = document.getElementById('player-rank');
    const playerScoreEl = document.getElementById('player-score');
    
    if (playerNameEl) playerNameEl.textContent = playerRecord.playerName;
    
    // Buscar posición del jugador en el ranking actual
    const playerEntry = currentRanking.find(p => p.isCurrentPlayer);
    if (playerEntry) {
        if (playerRankEl) playerRankEl.textContent = `#${playerEntry.rank}`;
        if (playerScoreEl) {
            const value = formatScoreValue(playerEntry[currentCategory], currentCategory);
            playerScoreEl.textContent = value;
        }
    }
}

// Actualizar información de la categoría
function updateCategoryInfo() {
    const categoryInfo = RANKING_CATEGORIES[currentCategory];
    const descriptionEl = document.getElementById('category-description');
    
    if (descriptionEl && categoryInfo) {
        descriptionEl.textContent = categoryInfo.description;
    }
}

// Formatear valor de puntuación según la categoría
function formatScoreValue(value, category) {
    if (!value && value !== 0) return '0';
    
    switch (category) {
        case 'memoscore':
            return `${value.toLocaleString()} pts`;
        
        case 'total_stars':
            return `${value} ⭐`;
        
        case 'speed_master':
            return `${value}s`;
        
        case 'efficiency_expert':
            return `${value} mov`;
        
        case 'world_explorer':
            return `${value}%`;
        
        default:
            return value.toString();
    }
}

// Obtener información adicional del jugador
function getAdditionalPlayerInfo(player) {
    const parts = [];
    
    if (player.levelsCompleted) {
        parts.push(`${player.levelsCompleted} niveles`);
    }
    
    if (player.trophies) {
        parts.push(`${player.trophies} trofeos`);
    }
    
    return parts.join(' • ') || 'Jugador nuevo';
}

// Mostrar estado de carga
function showLoadingState() {
    const containers = ['podium-container', 'leaderboard'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <div>Cargando ranking...</div>
                </div>
            `;
        }
    });
}

// Ocultar estado de carga
function hideLoadingState() {
    // Los contenedores se llenan con renderRanking()
}

// Event listeners
function attachRankingEventListeners() {
    // Selector de categoría
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            loadRanking(e.target.value);
        });
    }
    
    // Botón editar nombre
    const editNameBtn = document.getElementById('edit-name-btn');
    const editNameModal = document.getElementById('editNameModal');
    const playerNameInput = document.getElementById('playerNameInput');
    const saveNameBtn = document.getElementById('saveNameBtn');
    const cancelNameBtn = document.getElementById('cancelNameBtn');
    
    if (editNameBtn && editNameModal) {
        editNameBtn.addEventListener('click', () => {
            const currentName = RankingSystem.getPlayerName();
            playerNameInput.value = currentName === 'Jugador Anónimo' ? '' : currentName;
            editNameModal.classList.add('show');
            playerNameInput.focus();
        });
    }
    
    if (saveNameBtn) {
        saveNameBtn.addEventListener('click', savePlayerName);
    }
    
    if (cancelNameBtn) {
        cancelNameBtn.addEventListener('click', () => {
            editNameModal.classList.remove('show');
        });
    }
    
    if (playerNameInput) {
        playerNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                savePlayerName();
            } else if (e.key === 'Escape') {
                editNameModal.classList.remove('show');
            }
        });
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editNameModal) {
            editNameModal.classList.remove('show');
        }
    });
    
    // Actualizar ranking periódicamente (simular tiempo real)
    setInterval(() => {
        if (document.getElementById('leaderboard')) {
            // Solo actualizar si estamos en la página de ranking
            const shouldUpdate = Math.random() < 0.1; // 10% probabilidad cada 30s
            if (shouldUpdate) {
                loadRanking(currentCategory);
            }
        }
    }, 30000);
}

// Guardar nombre del jugador
function savePlayerName() {
    const playerNameInput = document.getElementById('playerNameInput');
    const editNameModal = document.getElementById('editNameModal');
    
    if (!playerNameInput || !editNameModal) return;
    
    const newName = playerNameInput.value.trim();
    if (newName.length === 0) {
        alert('Por favor ingresa un nombre válido');
        return;
    }
    
    if (newName.length > 20) {
        alert('El nombre debe tener máximo 20 caracteres');
        return;
    }
    
    // Filtrar palabras inapropiadas (básico)
    const inappropriateWords = ['admin', 'bot', 'system', 'null', 'undefined'];
    if (inappropriateWords.some(word => newName.toLowerCase().includes(word))) {
        alert('Ese nombre no está permitido');
        return;
    }
    
    RankingSystem.setPlayerName(newName);
    editNameModal.classList.remove('show');
    
    // Actualizar UI
    updatePlayerInfo();
    loadRanking(currentCategory); // Recargar para mostrar el nuevo nombre
    
    // Mostrar confirmación
    showNameChangeConfirmation(newName);
}

// Mostrar confirmación de cambio de nombre
function showNameChangeConfirmation(newName) {
    const notification = document.createElement('div');
    notification.className = 'name-change-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">✅</div>
            <div class="notification-text">Nombre cambiado a: <strong>${newName}</strong></div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// CSS para notificación de cambio de nombre
const nameChangeNotificationStyles = document.createElement('style');
nameChangeNotificationStyles.textContent = `
    .name-change-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #7bd389, #5cb85c);
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.5s ease;
        max-width: 300px;
        border: 2px solid #5cb85c;
    }
    
    .name-change-notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        color: white;
    }
    
    .notification-icon {
        font-size: 24px;
    }
    
    .notification-text {
        font-size: 14px;
        font-weight: 600;
    }
    
    @media (max-width: 600px) {
        .name-change-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
            transform: translateY(-200px);
        }
        
        .name-change-notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(nameChangeNotificationStyles);

// Función para actualizar ranking desde otras páginas
function refreshRankingPage() {
    if (document.getElementById('leaderboard')) {
        updatePlayerRecord();
        loadRanking(currentCategory);
        updatePlayerInfo();
    }
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.initRankingPage = initRankingPage;
    window.refreshRankingPage = refreshRankingPage;
}

