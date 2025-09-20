# MemoFlip - Juego de Memoria

Juego de memoria moderno y divertido, optimizado para dispositivos móviles.

## ✨ Características Implementadas

- ✅ **Juego completo de memoria** con 3 niveles de dificultad
- ✅ **Sistema de puntuación con estrellas** (1-3 ⭐)
- ✅ **Almacenamiento local** de mejores puntuaciones
- ✅ **Panel de estadísticas** detallado
- ✅ **Diseño responsivo** optimizado para móviles
- ✅ **PWA (Progressive Web App)** lista para instalar
- ✅ **Animaciones suaves** y efectos visuales

## 🏗 Estructura del Proyecto
```
MemoFlip/
├─ index.html          # Página principal
├─ manifest.json       # Configuración PWA
├─ sw.js              # Service Worker
├─ css/
│  └─ style.css       # Estilos principales
├─ js/
│  ├─ main.js         # Lógica principal del juego
│  ├─ settings.js     # Configuración y puntuación
│  └─ utils.js        # Utilidades y almacenamiento
├─ icons/             # Iconos para PWA
└─ generate-icons.html # Herramienta para generar iconos
```

## 🚀 Cómo Ejecutar

### Desarrollo Local
1. Clona o descarga el proyecto
2. Ejecuta un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con VS Code Live Server
   ```
3. Abre `http://localhost:8000` en tu navegador

### Instalar como PWA
1. Abre la aplicación en Chrome/Edge
2. Busca el icono de "Instalar" en la barra de direcciones
3. Haz clic en "Instalar MemoFlip"

## 📱 Crear APK para Android

### Opción 1: PWA Builder (Recomendado)
1. Ve a [PWABuilder.com](https://www.pwabuilder.com/)
2. Introduce la URL de tu PWA
3. Configura las opciones de Android
4. Descarga el APK generado

### Opción 2: Capacitor
```bash
npm install -g @capacitor/cli
npx cap init MemoFlip com.tudominio.memoflip
npx cap add android
npx cap copy
npx cap open android
# Compilar en Android Studio
```

### Opción 3: Cordova
```bash
npm install -g cordova
cordova create MemoFlipApp com.tudominio.memoflip MemoFlip
# Copiar archivos web a www/
cordova platform add android
cordova build android
```

## 🎯 Próximas Funcionalidades

- 🔐 **Sistema de login** (Firebase/Google)
- 🏆 **Ranking global** online
- 🎨 **Más temas visuales** y cartas personalizadas
- 🎵 **Efectos de sonido** y música
- 🎮 **Más modos de juego** (tiempo límite, desafíos)
- 🏅 **Sistema de logros** expandido
- 👥 **Modo multijugador** local
