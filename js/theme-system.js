// Sistema de Temas - MemoFlip
// Gestión de temas visuales y personalización

const ThemeSystem = {
  STORAGE_KEY: 'memoflip_theme_settings',
  
  // Temas disponibles
  themes: {
    ocean: {
      id: 'ocean',
      name: 'Océano',
      description: 'Tema azul oceánico original',
      colors: {
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#0f3460',
        card: '#ffffff',
        text: '#ffffff',
        button: '#ff6b35',
        success: '#7bd389',
        muted: '#2c3e50'
      },
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      isDefault: true
    },
    
    sunset: {
      id: 'sunset',
      name: 'Atardecer',
      description: 'Tema cálido con tonos naranjas y rojos',
      colors: {
        primary: '#2c1810',
        secondary: '#8b4513',
        accent: '#cd853f',
        card: '#fff8dc',
        text: '#ffffff',
        button: '#ff6347',
        success: '#90ee90',
        muted: '#a0522d'
      },
      background: 'linear-gradient(135deg, #2c1810, #8b4513, #cd853f)',
      isDefault: false
    },
    
    forest: {
      id: 'forest',
      name: 'Bosque',
      description: 'Tema verde natural',
      colors: {
        primary: '#0f4c3a',
        secondary: '#1b5e20',
        accent: '#2e7d32',
        card: '#f1f8e9',
        text: '#ffffff',
        button: '#4caf50',
        success: '#8bc34a',
        muted: '#388e3c'
      },
      background: 'linear-gradient(135deg, #0f4c3a, #1b5e20, #2e7d32)',
      isDefault: false
    },
    
    dark: {
      id: 'dark',
      name: 'Oscuro',
      description: 'Tema oscuro minimalista',
      colors: {
        primary: '#000000',
        secondary: '#1a1a1a',
        accent: '#333333',
        card: '#2a2a2a',
        text: '#ffffff',
        button: '#666666',
        success: '#4caf50',
        muted: '#444444'
      },
      background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333)',
      isDefault: false
    },
    
    light: {
      id: 'light',
      name: 'Claro',
      description: 'Tema claro y brillante',
      colors: {
        primary: '#f5f5f5',
        secondary: '#e0e0e0',
        accent: '#bdbdbd',
        card: '#ffffff',
        text: '#333333',
        button: '#2196f3',
        success: '#4caf50',
        muted: '#9e9e9e'
      },
      background: 'linear-gradient(135deg, #f5f5f5, #e0e0e0, #bdbdbd)',
      isDefault: false
    }
  },
  
  currentTheme: 'ocean',
  
  // Inicializar sistema de temas
  init() {
    this.loadSettings();
    this.applyTheme(this.currentTheme);
    // this.createThemeSelector(); // DESHABILITADO - no mostrar selector de temas
  },
  
  // Cargar configuración
  loadSettings() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        this.currentTheme = settings.currentTheme || 'ocean';
      }
    } catch (e) {
      console.warn('Error cargando configuración de temas:', e);
    }
  },
  
  // Guardar configuración
  saveSettings() {
    try {
      const settings = {
        currentTheme: this.currentTheme
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Error guardando configuración de temas:', e);
    }
  },
  
  // Aplicar tema
  applyTheme(themeId) {
    const theme = this.themes[themeId];
    if (!theme) return;
    
    this.currentTheme = themeId;
    this.saveSettings();
    
    // Aplicar variables CSS
    const root = document.documentElement;
    root.style.setProperty('--bg1', theme.colors.primary);
    root.style.setProperty('--bg2', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--card', theme.colors.card);
    root.style.setProperty('--ink', theme.colors.text);
    root.style.setProperty('--ok', theme.colors.success);
    root.style.setProperty('--muted', theme.colors.muted);
    
    // Aplicar fondo
    document.body.style.background = theme.background;
    
    // Actualizar meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme.colors.primary;
    }
    
    // Notificar cambio de tema
    this.notifyThemeChange(theme);
  },
  
  // Crear selector de temas
  createThemeSelector() {
    // Verificar si ya existe
    if (document.getElementById('theme-selector')) return;
    
    const selector = document.createElement('div');
    selector.id = 'theme-selector';
    selector.innerHTML = `
      <div class="theme-selector-container">
        <button class="theme-toggle-btn" id="theme-toggle">
          🎨
        </button>
        <div class="theme-dropdown" id="theme-dropdown">
          <div class="theme-dropdown-header">
            <h3>Temas</h3>
            <button class="theme-close-btn">×</button>
          </div>
          <div class="theme-list" id="theme-list">
            <!-- Los temas se cargarán aquí -->
          </div>
        </div>
      </div>
    `;
    
    // Agregar estilos
    const styles = document.createElement('style');
    styles.textContent = `
      .theme-selector-container {
        position: relative;
        display: inline-block;
      }
      
      .theme-toggle-btn {
        background: var(--accent);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .theme-toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      
      .theme-dropdown {
        position: absolute;
        top: 50px;
        right: 0;
        background: var(--card);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        min-width: 280px;
        max-width: 320px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        pointer-events: none;
      }
      
      .theme-dropdown.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      
      .theme-dropdown-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid var(--muted);
      }
      
      .theme-dropdown-header h3 {
        margin: 0;
        color: var(--ink);
        font-size: 1.1em;
      }
      
      .theme-close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--ink);
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .theme-close-btn:hover {
        background: var(--muted);
      }
      
      .theme-list {
        padding: 10px;
      }
      
      .theme-option {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 5px;
      }
      
      .theme-option:hover {
        background: var(--muted);
      }
      
      .theme-option.active {
        background: var(--accent);
        color: white;
      }
      
      .theme-preview {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 12px;
        border: 2px solid var(--muted);
        flex-shrink: 0;
      }
      
      .theme-info {
        flex: 1;
      }
      
      .theme-name {
        font-weight: bold;
        margin-bottom: 2px;
      }
      
      .theme-description {
        font-size: 0.85em;
        opacity: 0.8;
      }
      
      @media (max-width: 600px) {
        .theme-dropdown {
          right: -50px;
          min-width: 250px;
        }
      }
    `;
    
    document.head.appendChild(styles);
    
    // Agregar al header o crear contenedor
    const header = document.querySelector('header') || document.querySelector('.toolbar');
    if (header) {
      header.appendChild(selector);
    } else {
      document.body.appendChild(selector);
    }
    
    // Cargar temas
    this.loadThemes();
    
    // Event listeners
    document.getElementById('theme-toggle').onclick = () => this.toggleDropdown();
    document.querySelector('.theme-close-btn').onclick = () => this.hideDropdown();
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        this.hideDropdown();
      }
    });
  },
  
  // Cargar lista de temas
  loadThemes() {
    const themeList = document.getElementById('theme-list');
    if (!themeList) return;
    
    themeList.innerHTML = '';
    
    Object.values(this.themes).forEach(theme => {
      const option = document.createElement('div');
      option.className = `theme-option ${theme.id === this.currentTheme ? 'active' : ''}`;
      option.innerHTML = `
        <div class="theme-preview" style="background: ${theme.background}"></div>
        <div class="theme-info">
          <div class="theme-name">${theme.name}</div>
          <div class="theme-description">${theme.description}</div>
        </div>
      `;
      
      option.onclick = () => {
        this.applyTheme(theme.id);
        this.hideDropdown();
        this.updateActiveTheme(theme.id);
      };
      
      themeList.appendChild(option);
    });
  },
  
  // Actualizar tema activo
  updateActiveTheme(activeId) {
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.remove('active');
    });
    
    const activeOption = document.querySelector(`[data-theme="${activeId}"]`) ||
                       document.querySelectorAll('.theme-option')[Object.keys(this.themes).indexOf(activeId)];
    if (activeOption) {
      activeOption.classList.add('active');
    }
  },
  
  // Mostrar/ocultar dropdown
  toggleDropdown() {
    const dropdown = document.getElementById('theme-dropdown');
    if (dropdown.classList.contains('show')) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
  },
  
  showDropdown() {
    const dropdown = document.getElementById('theme-dropdown');
    dropdown.classList.add('show');
  },
  
  hideDropdown() {
    const dropdown = document.getElementById('theme-dropdown');
    dropdown.classList.remove('show');
  },
  
  // Notificar cambio de tema (ELIMINADO - no mostrar mensajes)
  notifyThemeChange(theme) {
    // Función vacía - no mostrar notificaciones de cambio de tema
  },
  
  // Obtener tema actual
  getCurrentTheme() {
    return this.themes[this.currentTheme];
  },
  
  // Obtener todos los temas
  getAllThemes() {
    return this.themes;
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.ThemeSystem = ThemeSystem;
}
