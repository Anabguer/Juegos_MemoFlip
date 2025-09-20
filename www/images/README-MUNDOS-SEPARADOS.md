# 🌍 Sistema de Mundos Separados - MemoFlip

## 🎯 **Nuevo Diseño: 4 Pantallas**

### **Flujo de navegación:**
```
Selector de Mundos → Mapa Individual → Juego → Volver
```

---

## 📱 **PANTALLA 1: Selector de Mundos**

### **world-selector-background.png**
- **Tamaño**: 1080x1920px (formato móvil)
- **Descripción**: Pantalla principal con 3 mundos para elegir
- **Prompt**:
```
"Mobile game world selector screen, vertical 1080x1920, three distinct floating islands/worlds: Ocean world (bottom, turquoise blue with coral reefs and fish), Tropical Island world (middle, green with palm trees and beaches), Volcano world (top, red/orange with lava and mountains). Each world is a circular floating island with magical glow. Space between them for UI buttons. Fantasy cartoon style, bright colors, magical atmosphere, game UI like Candy Crush world map"
```

### **world-ocean-icon.png**
- **Tamaño**: 300x300px
- **Descripción**: Icono del mundo océano para el selector
- **Prompt**:
```
"Game world icon, circular 300x300px, ocean theme, underwater scene with coral reefs, tropical fish, and sea plants, bright turquoise and coral colors, cartoon flat design, glowing border effect, PNG transparent background"
```

### **world-island-icon.png**
- **Tamaño**: 300x300px
- **Descripción**: Icono del mundo isla para el selector
- **Prompt**:
```
"Game world icon, circular 300x300px, tropical island theme, palm trees, white sand beach, coconuts, bright green and golden colors, cartoon flat design, glowing border effect, PNG transparent background"
```

### **world-volcano-icon.png**
- **Tamaño**: 300x300px
- **Descripción**: Icono del mundo volcán para el selector
- **Prompt**:
```
"Game world icon, circular 300x300px, volcano theme, erupting volcano with lava flows, red rocks and crystals, bright red and orange colors, cartoon flat design, glowing border effect, PNG transparent background"
```

---

## 🌊 **PANTALLA 2: Mapa Mundo Océano**

### **ocean-world-map.png**
- **Tamaño**: 1080x1920px
- **Descripción**: Mapa individual del mundo océano con camino ascendente
- **Prompt**:
```
"Ocean world level map, vertical 1080x1920, underwater scene starting from deep ocean floor (bottom) rising to surface (top), coral reefs, sea plants, tropical fish swimming around, golden trail/path winding upward through coral formations connecting 4 level spots from bottom to top, deep blue at bottom to turquoise at top gradient, bubbles floating up, cartoon style, bright ocean colors, magical underwater atmosphere, mountain-like progression from depths to surface"
```

---

## 🏝️ **PANTALLA 3: Mapa Mundo Isla**

### **island-world-map.png**
- **Tamaño**: 1080x1920px
- **Descripción**: Mapa individual del mundo isla con camino ascendente
- **Prompt**:
```
"Tropical island world level map, vertical 1080x1920, lush tropical island rising from beach (bottom) to mountain peak (top), white sandy beaches at bottom, palm trees and jungle in middle, mountain peak at top, golden trail/path winding upward through the landscape connecting 4 level spots from beach to peak, bright green vegetation, blue ocean at bottom, cartoon style, vibrant tropical colors, paradise atmosphere, mountain-like progression from sea level to summit"
```

---

## 🌋 **PANTALLA 4: Mapa Mundo Volcán**

### **volcano-world-map.png**
- **Tamaño**: 1080x1920px
- **Descripción**: Mapa individual del mundo volcán con camino ascendente
- **Prompt**:
```
"Volcano world level map, vertical 1080x1920, active volcano rising from rocky base (bottom) to erupting crater (top), volcanic rocks and dark terrain at bottom, lava flows in middle, glowing crater at peak, golden trail/path winding up the volcano slopes connecting 3 level spots from base to crater, red and orange lava glow, dark rocky terrain, steam and smoke, cartoon style, dramatic volcanic colors, epic adventure atmosphere, mountain-like progression from base to volcanic summit"
```

---

## 🔘 **BOTONES DE NIVELES (Reutilizar los existentes)**

- ✅ `level-unlocked.png` (ya tienes)
- ✅ `level-locked.png` (ya tienes)  
- ✅ `level-completed.png` (ya tienes)
- ✅ `level-boss.png` (ya tienes)

---

## 📁 **Estructura de archivos:**

```
images/
├── worlds/
│   ├── world-selector-background.png    # Pantalla principal
│   ├── world-ocean-icon.png            # Icono océano  
│   ├── world-island-icon.png           # Icono isla
│   ├── world-volcano-icon.png          # Icono volcán
│   ├── ocean-world-map.png             # Mapa océano
│   ├── island-world-map.png            # Mapa isla
│   └── volcano-world-map.png           # Mapa volcán
└── [otros archivos existentes...]
```

---

## 🎮 **Lógica del juego:**

### **Selector de Mundos:**
- **Océano**: Siempre disponible
- **Isla**: Se desbloquea al completar océano (4 niveles con ⭐⭐)
- **Volcán**: Se desbloquea al completar isla (4 niveles con ⭐⭐)

### **Mapas Individuales:**
- **Océano**: 4 niveles (3×4) + 1 jefe
- **Isla**: 4 niveles (4×4) + 1 jefe  
- **Volcán**: 3 niveles (4×5) + 1 jefe

### **Progresión Visual:**
- Mundos bloqueados se ven en gris/desaturado
- Mundos disponibles brillan y tienen animación
- Mundos completados tienen corona dorada

---

## 🎨 **Paleta de colores consistente:**

### **🌊 Océano:**
- Azules: #4682B4, #87CEEB, #20B2AA
- Corales: #FF6B6B, #FFA07A
- Dorado: #FFD700

### **🏝️ Isla:**
- Verdes: #32CD32, #228B22, #90EE90
- Dorados: #DAA520, #F4A460
- Azul océano: #4682B4

### **🌋 Volcán:**
- Rojos: #DC143C, #FF4500, #CD5C5C
- Naranjas: #FF8C00, #FFA500
- Grises: #696969, #2F4F4F

---

## 🚀 **Resumen: 7 imágenes nuevas**

1. `world-selector-background.png` - Pantalla principal
2. `world-ocean-icon.png` - Icono océano
3. `world-island-icon.png` - Icono isla  
4. `world-volcano-icon.png` - Icono volcán
5. `ocean-world-map.png` - Mapa océano
6. `island-world-map.png` - Mapa isla
7. `volcano-world-map.png` - Mapa volcán

**¡Con estas 7 imágenes tendrás un sistema de mundos espectacular!** 🎨✨
