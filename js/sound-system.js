// Sistema de Sonidos - MemoFlip
// Gestión de efectos de audio con controles de volumen

const SoundSystem = {
  STORAGE_KEY: 'memoflip_sound_settings',
  
  // Configuración de sonidos
  sounds: {
    flip: {
      name: 'Voltear carta',
      file: 'sounds/flip.mp3',
      volume: 0.7,
      enabled: true
    },
    match: {
      name: 'Emparejar',
      file: 'sounds/match.mp3',
      volume: 0.8,
      enabled: true
    },
    win: {
      name: 'Victoria',
      file: 'sounds/win.mp3',
      volume: 0.9,
      enabled: true
    },
    trophy: {
      name: 'Trofeo',
      file: 'sounds/trophy.mp3',
      volume: 0.8,
      enabled: true
    },
    shuffle: {
      name: 'Mezclar',
      file: 'sounds/shuffle.mp3',
      volume: 0.6,
      enabled: true
    },
    button: {
      name: 'Botón',
      file: 'sounds/button.mp3',
      volume: 0.5,
      enabled: true
    }
  },
  
  // Estado del sistema
  isEnabled: true,
  masterVolume: 0.8,
  audioContext: null,
  
  // Inicializar sistema de sonidos
  init() {
    this.loadSettings();
    this.setupAudioContext();
    this.createAudioElements();
  },
  
  // Configurar AudioContext
  setupAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext no soportado:', e);
    }
  },
  
  // Crear elementos de audio
  createAudioElements() {
    for (const key in this.sounds) {
      const sound = this.sounds[key];
      sound.audio = new Audio();
      sound.audio.preload = 'auto';
      sound.audio.volume = sound.volume * this.masterVolume;
      
      // Fallback a sonidos generados si no existe el archivo
      if (!sound.audio.src) {
        sound.audio.src = this.generateSound(sound.name);
      }
    }
  },
  
  // Generar sonidos sintéticos como fallback
  generateSound(type) {
    if (!this.audioContext) return '';
    
    const sampleRate = this.audioContext.sampleRate;
    const duration = type === 'win' ? 2 : type === 'trophy' ? 1.5 : 0.3;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    switch (type) {
      case 'flip':
        // Sonido de flip - onda cuadrada corta
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.sin(2 * Math.PI * 800 * i / sampleRate) * 0.3;
        }
        break;
        
      case 'match':
        // Sonido de match - acorde ascendente
        for (let i = 0; i < data.length; i++) {
          const freq = 440 + (i / data.length) * 220;
          data[i] = Math.sin(2 * Math.PI * freq * i / sampleRate) * 0.4;
        }
        break;
        
      case 'win':
        // Sonido de victoria - melodía ascendente
        for (let i = 0; i < data.length; i++) {
          const note = Math.floor(i / (data.length / 4));
          const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
          data[i] = Math.sin(2 * Math.PI * frequencies[note] * i / sampleRate) * 0.3;
        }
        break;
        
      case 'trophy':
        // Sonido de trofeo - campana
        for (let i = 0; i < data.length; i++) {
          const freq = 880;
          const envelope = Math.exp(-i / (sampleRate * 0.5));
          data[i] = Math.sin(2 * Math.PI * freq * i / sampleRate) * 0.5 * envelope;
        }
        break;
        
      case 'shuffle':
        // Sonido de mezcla - ruido blanco con filtro
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2;
        }
        break;
        
      case 'button':
        // Sonido de botón - click suave
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.sin(2 * Math.PI * 1000 * i / sampleRate) * 0.2;
        }
        break;
    }
    
    // Convertir a blob URL
    const wav = this.encodeWAV(buffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  },
  
  // Codificar buffer como WAV
  encodeWAV(buffer) {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // Header WAV
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Datos de audio
    const channelData = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return arrayBuffer;
  },
  
  // Reproducir sonido
  play(soundKey) {
    if (!this.isEnabled) return;
    
    const sound = this.sounds[soundKey];
    if (!sound || !sound.enabled) return;
    
    try {
      // Reiniciar audio si ya está reproduciéndose
      if (sound.audio.currentTime > 0) {
        sound.audio.currentTime = 0;
      }
      
      // Actualizar volumen
      sound.audio.volume = sound.volume * this.masterVolume;
      
      // Reproducir
      const playPromise = sound.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Error reproduciendo sonido:', error);
        });
      }
    } catch (e) {
      console.warn('Error en sistema de sonidos:', e);
    }
  },
  
  // Cargar configuración
  loadSettings() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        this.isEnabled = settings.isEnabled !== false;
        this.masterVolume = settings.masterVolume || 0.8;
        
        // Aplicar configuraciones individuales
        if (settings.sounds) {
          for (const key in settings.sounds) {
            if (this.sounds[key]) {
              this.sounds[key].enabled = settings.sounds[key].enabled !== false;
              this.sounds[key].volume = settings.sounds[key].volume || this.sounds[key].volume;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error cargando configuración de sonidos:', e);
    }
  },
  
  // Guardar configuración
  saveSettings() {
    try {
      const settings = {
        isEnabled: this.isEnabled,
        masterVolume: this.masterVolume,
        sounds: {}
      };
      
      for (const key in this.sounds) {
        settings.sounds[key] = {
          enabled: this.sounds[key].enabled,
          volume: this.sounds[key].volume
        };
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Error guardando configuración de sonidos:', e);
    }
  },
  
  // Habilitar/deshabilitar sonidos
  setEnabled(enabled) {
    this.isEnabled = enabled;
    this.saveSettings();
  },
  
  // Cambiar volumen maestro
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
    
    // Actualizar volúmenes de todos los sonidos
    for (const key in this.sounds) {
      if (this.sounds[key].audio) {
        this.sounds[key].audio.volume = this.sounds[key].volume * this.masterVolume;
      }
    }
  },
  
  // Cambiar configuración de sonido individual
  setSoundConfig(soundKey, config) {
    if (this.sounds[soundKey]) {
      if (config.enabled !== undefined) {
        this.sounds[soundKey].enabled = config.enabled;
      }
      if (config.volume !== undefined) {
        this.sounds[soundKey].volume = Math.max(0, Math.min(1, config.volume));
        if (this.sounds[soundKey].audio) {
          this.sounds[soundKey].audio.volume = this.sounds[soundKey].volume * this.masterVolume;
        }
      }
      this.saveSettings();
    }
  },
  
  // Obtener configuración actual
  getSettings() {
    return {
      isEnabled: this.isEnabled,
      masterVolume: this.masterVolume,
      sounds: { ...this.sounds }
    };
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SoundSystem = SoundSystem;
}

