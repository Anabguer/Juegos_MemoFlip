// Service Worker para MemoFlip - Versión Expandida
const CACHE_NAME = 'memoflip-v2.0.0';
const urlsToCache = [
  // Páginas principales
  '/',
  '/index.html',
  '/world-selector.html',
  '/world-ocean.html',
  '/world-island.html',
  '/world-volcano.html',
  '/trophies.html',
  '/ranking.html',
  
  // CSS
  '/css/style.css',
  '/css/global-layout.css',
  '/css/world-selector.css',
  '/css/world-map.css',
  '/css/trophies.css',
  '/css/ranking.css',
  
  // JavaScript Core
  '/js/main.js',
  '/js/settings.js',
  '/js/utils.js',
  '/js/game-config.js',
  '/js/world-selector.js',
  '/js/world-map.js',
  '/js/theme-system.js',
  '/js/sound-system.js',
  '/js/tutorial-system.js',
  '/js/trophy-system.js',
  '/js/achievement-system.js',
  '/js/ranking-system.js',
  '/js/trophies-page.js',
  '/js/ranking-page.js',
  
  // Componentes
  '/components/header.js',
  
  // Manifest y configuración
  '/manifest.json',
  '/capacitor.config.json',
  
  // Imágenes UI principales
  '/images/ui/home.png',
  '/images/ui/logo.png',
  '/images/ui/logo-banner.png',
  '/images/ui/star.png',
  '/images/ui/trofeo.png',
  '/images/ui/ranking.png',
  '/images/ui/trophy-background.png',
  
  // Iconos de mundos
  '/images/worlds/world-ocean-icon.png',
  '/images/worlds/world-island-icon.png',
  '/images/worlds/world-volcano-icon.png',
  '/images/worlds/world-selector-background.png',
  
  // Estados de nivel
  '/images/level-unlocked.png',
  '/images/level-locked.png',
  '/images/level-completed.png',
  '/images/level-boss.png'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones con estrategia mejorada
self.addEventListener('fetch', event => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;
  
  // Estrategia Cache First para assets estáticos
  if (event.request.url.includes('/images/') || 
      event.request.url.includes('/css/') || 
      event.request.url.includes('/js/') ||
      event.request.url.includes('/components/')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(fetchResponse => {
            // Cachear respuesta exitosa
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return fetchResponse;
          });
        })
    );
    return;
  }
  
  // Estrategia Network First para páginas HTML
  if (event.request.url.includes('.html') || event.request.url === self.location.origin + '/') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cachear respuesta exitosa
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback a cache si no hay red
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Para otros recursos, usar Cache First
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Actualizar Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


