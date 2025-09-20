# 🏆 Sistema de Trofeos y Ranking - MemoFlip

## 📋 **Especificaciones técnicas:**
- **Fondos**: 1080x1920px (formato móvil vertical)
- **Trofeos**: 128x128px cada uno
- **Formato**: PNG con fondo transparente (trofeos) / PNG completo (fondos)
- **Estilo**: Cartoon/flat design consistente con el juego
- **Total**: 8 imágenes (2 fondos + 6 trofeos)

---

## 🎨 **Guía de estilo:**
- **Colores principales**: Dorado (#FFD700), Azul real (#1E3A8A), Blanco perlado
- **Materiales**: Metal dorado brillante, cristales, efectos de luz
- **Estilo**: Elegante pero amigable, similar a Clash Royale/Clash of Clans
- **Consistencia**: Mismo estilo de iluminación y sombras en todos los trofeos

---

## 🖼️ **FONDOS DE PANTALLA**

### **1. trophy-background.png**
- **Tamaño**: 1080x1920px
- **Descripción**: Fondo para la pantalla de trofeos/logros
- **Ubicación**: `images/ui/trophy-background.png`
- **Prompt**:
```
"Mobile game trophy room background, vertical 1080x1920px, elegant trophy display hall with golden pedestals and marble columns, warm ambient lighting with golden glow, trophy cases with glass shelves in background, royal blue and gold color scheme, magical sparkles and light particles floating in air, luxurious carpet with royal patterns, game UI style like Clash Royale trophy room, clean background without UI elements, space for content overlay"
```

### **2. ranking-background.png**
- **Tamaño**: 1080x1920px
- **Descripción**: Fondo para la pantalla de ranking/leaderboard
- **Ubicación**: `images/ui/ranking-background.png`
- **Prompt**:
```
"Mobile game leaderboard background, vertical 1080x1920px, competitive arena theme with grand podium in center showing 1st 2nd 3rd places, stadium lights creating dramatic lighting, blue and gold color scheme, crowd silhouettes in background bleachers, victory banners and flags, champions arena atmosphere, game UI style like Clash of Clans leaderboard, clean background without UI elements, space for leaderboard content"
```

---

## 🏆 **TROFEOS INDIVIDUALES**
*Tema: Logros y reconocimientos del juego*

### **3. ocean-trophy.png**
- **Tamaño**: 128x128px
- **Descripción**: Trofeo "Guardián del Océano" (completar mundo océano)
- **Ubicación**: `images/trophies/ocean-trophy.png`
- **Prompt**:
```
"Golden trophy with ocean theme, elegant trophy cup with blue water wave patterns engraved on gold surface, coral reef decorations around the base, sea shell and starfish details, small water droplets effect, ocean blue gem on top, 128x128px, game icon style, PNG transparent background, shiny polished gold material with realistic reflections"
```

### **4. island-trophy.png**
- **Tamaño**: 128x128px
- **Descripción**: Trofeo "Rey de la Isla" (completar mundo isla)
- **Ubicación**: `images/trophies/island-trophy.png`
- **Prompt**:
```
"Golden trophy with tropical island theme, elegant trophy cup with palm tree silhouette on top, green emerald gem in center, tropical leaf engravings on gold surface, coconut and beach elements around base, sand texture details, warm golden glow, 128x128px, game icon style, PNG transparent background, shiny polished gold material with realistic reflections"
```

### **5. volcano-trophy.png**
- **Tamaño**: 128x128px
- **Descripción**: Trofeo "Señor del Volcán" (completar mundo volcán)
- **Ubicación**: `images/trophies/volcano-trophy.png`
- **Prompt**:
```
"Golden trophy with volcano theme, elegant trophy cup with erupting volcano design on top, red ruby gem in center, lava flow patterns engraved on gold surface, rocky volcanic texture around base, glowing lava cracks effect, dramatic red-orange glow, 128x128px, game icon style, PNG transparent background, shiny polished gold material with realistic reflections"
```

### **6. perfect-trophy.png**
- **Tamaño**: 128x128px
- **Descripción**: Trofeo "Perfeccionista" (conseguir 3 estrellas en todos los niveles)
- **Ubicación**: `images/trophies/perfect-trophy.png`
- **Prompt**:
```
"Golden trophy with perfection theme, elegant trophy cup with three golden stars arranged on top, diamond and crystal decorations, perfect geometric patterns engraved on gold surface, rainbow prism light effects, sparkling diamond gem in center, radiant white-gold glow, 128x128px, game icon style, PNG transparent background, shiny polished gold material with realistic reflections"
```

### **7. speed-trophy.png**
- **Tamaño**: 128x128px
- **Descripción**: Trofeo "Rayo" (completar cualquier nivel en menos de 30 segundos)
- **Ubicación**: `images/trophies/speed-trophy.png`
- **Prompt**:
```
"Golden trophy with speed theme, elegant trophy cup with lightning bolt design on top, dynamic wing decorations on sides, electric blue sapphire gem in center, speed lines and wind effects engraved on gold surface, electric blue glow and sparkles, motion blur effect, 128x128px, game icon style, PNG transparent background, shiny polished gold material with realistic reflections"
```

### **8. strategy-trophy.png**
- **Tamaño**: 128x128px
- **Descripción**: Trofeo "Estratega" (completar cualquier nivel con movimientos mínimos)
- **Ubicación**: `images/trophies/strategy-trophy.png`
- **Prompt**:
```
"Golden trophy with strategy theme, elegant trophy cup with target/bullseye design on top, tactical crosshair symbol, chess piece decorations around base, red ruby gem in center of target, precision geometric patterns engraved on gold surface, focused red glow, 128x128px, game icon style, PNG transparent background, shiny polished gold material with realistic reflections"
```

---

## 📁 **Estructura de archivos:**

```
images/
├── ui/
│   ├── trophy-background.png          # Fondo sala trofeos
│   └── ranking-background.png         # Fondo ranking
└── trophies/                          # Nueva carpeta
    ├── ocean-trophy.png               # Trofeo océano
    ├── island-trophy.png              # Trofeo isla
    ├── volcano-trophy.png             # Trofeo volcán
    ├── perfect-trophy.png             # Trofeo perfeccionista
    ├── speed-trophy.png               # Trofeo velocidad
    └── strategy-trophy.png            # Trofeo estratega
```

---

## 🎯 **Cómo usar los trofeos:**

### **Criterios de obtención:**
1. **🌊 Guardián del Océano**: Completar los 4 niveles del mundo océano
2. **🏝️ Rey de la Isla**: Completar los 4 niveles del mundo isla
3. **🌋 Señor del Volcán**: Completar los 3 niveles del mundo volcán
4. **⭐ Perfeccionista**: Conseguir 3 estrellas en todos los niveles (11 niveles)
5. **⚡ Rayo**: Completar cualquier nivel en menos de 30 segundos
6. **🎯 Estratega**: Completar cualquier nivel con el mínimo de movimientos posible

### **Sistema de implementación:**
1. **Genera** las 8 imágenes con los prompts
2. **Crea** la carpeta `/images/trophies/`
3. **Coloca** cada imagen en su ubicación correspondiente
4. **Implementa** la lógica de trofeos en JavaScript
5. **Crea** las pantallas de trofeos y ranking

---

## 💡 **Tips para generar:**

- **Genera por lotes** del mismo tipo (fondos juntos, trofeos juntos)
- **Usa el mismo prompt base** para trofeos cambiando solo el tema
- **Revisa que todos tengan el mismo estilo** de iluminación dorada
- **Mantén consistencia** en el tamaño y posición del trofeo
- **Si alguno no encaja**, regenera solo ese manteniendo el estilo

---

## 🚀 **Orden de generación recomendado:**

### **FASE 1: Fondos (2 imágenes)**
1. `trophy-background.png`
2. `ranking-background.png`

### **FASE 2: Trofeos de Mundos (3 imágenes)**
3. `ocean-trophy.png`
4. `island-trophy.png`
5. `volcano-trophy.png`

### **FASE 3: Trofeos de Logros (3 imágenes)**
6. `perfect-trophy.png`
7. `speed-trophy.png`
8. `strategy-trophy.png`

---

**¡Con estas imágenes tendrás un sistema de trofeos y ranking completo y visualmente impresionante!** 🏆✨
