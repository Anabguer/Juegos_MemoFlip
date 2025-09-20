// CABECERA UNIFICADA - FUNCIONES PARA TODAS LAS PÁGINAS

// FUNCIÓN PARA ACTUALIZAR ESTADÍSTICAS DEL HEADER
function updateHeaderStats() {
    // Usar únicamente el sistema Storage para mantener consistencia total
    const totalStats = Storage.getTotalStats();
    
    // Actualizar estrellas
    const starsElement = document.getElementById('total-stars');
    if (starsElement) {
        starsElement.textContent = totalStats.totalStars;
    }
    
    // Actualizar trofeos
    const trophiesElement = document.getElementById('total-trophies');
    if (trophiesElement) {
        trophiesElement.textContent = totalStats.totalTrophies;
    }
    
    console.log(`Estadísticas actualizadas - Estrellas: ${totalStats.totalStars}, Trofeos: ${totalStats.totalTrophies}`);
}

// FUNCIÓN GLOBAL PARA MOSTRAR TROFEOS
function showTrophies() {
    window.location.href = 'trophies.html';
}

// FUNCIÓN GLOBAL PARA MOSTRAR RANKING
function showRanking() {
    window.location.href = 'ranking.html';
}

// INICIALIZAR CABECERA EN TODAS LAS PÁGINAS
function initUnifiedHeader() {
    console.log('🎯 Inicializando cabecera unificada...');
    
    // Cargar el header unificado
    fetch('components/unified-header.html')
        .then(response => response.text())
        .then(html => {
            // Insertar el header al inicio del body
            document.body.insertAdjacentHTML('afterbegin', html);
            
            // Actualizar estadísticas
            updateHeaderStats();
            
            console.log('✅ Cabecera unificada cargada correctamente');
        })
        .catch(error => {
            console.error('❌ Error cargando cabecera unificada:', error);
        });
}

// ACTUALIZAR ESTADÍSTICAS CUANDO SE REGRESA DEL JUEGO
window.addEventListener('focus', function() {
    setTimeout(() => {
        updateHeaderStats();
    }, 100);
});

// INICIALIZAR CUANDO SE CARGA LA PÁGINA
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateHeaderStats();
    }, 500);
});
