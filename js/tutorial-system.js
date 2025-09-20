// Sistema de Tutorial - MemoFlip
// Guía interactiva para nuevos jugadores

const TutorialSystem = {
  STORAGE_KEY: 'memoflip_tutorial_completed',
  
  // Configuración de tutorial
  steps: [
    {
      id: 'welcome',
      title: '¡Bienvenido a MemoFlip!',
      content: 'Encuentra las cartas iguales volteándolas de a dos. ¡Entrena tu memoria!',
      target: '.board',
      position: 'center',
      action: 'show'
    },
    {
      id: 'first_card',
      title: 'Primera carta',
      content: 'Toca una carta para voltearla y ver su contenido.',
      target: '.card:first-child',
      position: 'top',
      action: 'highlight',
      waitFor: 'card_flip'
    },
    {
      id: 'second_card',
      title: 'Segunda carta',
      content: 'Ahora toca otra carta. Si coinciden, ¡se quedarán volteadas!',
      target: '.card:nth-child(2)',
      position: 'top',
      action: 'highlight',
      waitFor: 'card_match'
    },
    {
      id: 'matching',
      title: '¡Emparejaste!',
      content: 'Las cartas iguales se quedan volteadas. Continúa hasta encontrar todas las parejas.',
      target: '.matched',
      position: 'center',
      action: 'success'
    },
    {
      id: 'stats',
      title: 'Estadísticas',
      content: 'Observa tus movimientos y tiempo. Menos movimientos = más estrellas ⭐',
      target: '.stats',
      position: 'bottom',
      action: 'point'
    },
    {
      id: 'controls',
      title: 'Controles',
      content: 'Usa estos botones para reiniciar, ver estadísticas o volver al mapa.',
      target: '.toolbar',
      position: 'bottom',
      action: 'point'
    },
    {
      id: 'stars',
      title: 'Sistema de Estrellas',
      content: '⭐ = Bueno, ⭐⭐ = Muy bueno, ⭐⭐⭐ = ¡Perfecto! Las estrellas desbloquean nuevos mundos.',
      target: '.win-modal',
      position: 'center',
      action: 'explain',
      showWhen: 'level_completed'
    }
  ],
  
  currentStep: 0,
  isActive: false,
  overlay: null,
  tooltip: null,
  
  // Inicializar sistema de tutorial
  init() {
    this.createOverlay();
    this.createTooltip();
    this.checkIfShouldShow();
  },
  
  // Verificar si debe mostrar el tutorial
  checkIfShouldShow() {
    const hasCompleted = localStorage.getItem(this.STORAGE_KEY) === 'true';
    const isFirstTime = !hasCompleted;
    
    if (isFirstTime) {
      // Esperar un poco para que la página se cargue
      setTimeout(() => {
        this.start();
      }, 1000);
    }
  },
  
  // Crear overlay de fondo
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'tutorial-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(this.overlay);
  },
  
  // Crear tooltip
  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tutorial-tooltip';
    this.tooltip.style.cssText = `
      position: fixed;
      background: linear-gradient(135deg, #ff6b35, #f7931e);
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      max-width: 300px;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.3s ease;
      pointer-events: auto;
    `;
    
    this.tooltip.innerHTML = `
      <div class="tutorial-header">
        <h3 class="tutorial-title"></h3>
        <button class="tutorial-close">×</button>
      </div>
      <div class="tutorial-content"></div>
      <div class="tutorial-actions">
        <button class="tutorial-prev">Anterior</button>
        <button class="tutorial-next">Siguiente</button>
        <button class="tutorial-skip">Saltar Tutorial</button>
      </div>
    `;
    
    document.body.appendChild(this.tooltip);
    
    // Event listeners
    this.tooltip.querySelector('.tutorial-close').onclick = () => this.skip();
    this.tooltip.querySelector('.tutorial-prev').onclick = () => this.previous();
    this.tooltip.querySelector('.tutorial-next').onclick = () => this.next();
    this.tooltip.querySelector('.tutorial-skip').onclick = () => this.skip();
  },
  
  // Iniciar tutorial
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.currentStep = 0;
    this.showStep();
  },
  
  // Mostrar paso actual
  showStep() {
    if (this.currentStep >= this.steps.length) {
      this.complete();
      return;
    }
    
    const step = this.steps[this.currentStep];
    
    // Actualizar contenido del tooltip
    this.tooltip.querySelector('.tutorial-title').textContent = step.title;
    this.tooltip.querySelector('.tutorial-content').textContent = step.content;
    
    // Mostrar/ocultar botones según el paso
    const prevBtn = this.tooltip.querySelector('.tutorial-prev');
    const nextBtn = this.tooltip.querySelector('.tutorial-next');
    const skipBtn = this.tooltip.querySelector('.tutorial-skip');
    
    prevBtn.style.display = this.currentStep > 0 ? 'block' : 'none';
    nextBtn.textContent = this.currentStep === this.steps.length - 1 ? 'Finalizar' : 'Siguiente';
    skipBtn.style.display = 'block';
    
    // Posicionar tooltip
    this.positionTooltip(step);
    
    // Aplicar acción del paso
    this.applyStepAction(step);
    
    // Mostrar overlay y tooltip
    this.overlay.style.opacity = '1';
    this.overlay.style.pointerEvents = 'auto';
    this.tooltip.style.opacity = '1';
    this.tooltip.style.transform = 'scale(1)';
  },
  
  // Posicionar tooltip
  positionTooltip(step) {
    const target = document.querySelector(step.target);
    if (!target) {
      // Posición por defecto si no encuentra el target
      this.tooltip.style.top = '50%';
      this.tooltip.style.left = '50%';
      this.tooltip.style.transform = 'translate(-50%, -50%) scale(1)';
      return;
    }
    
    const rect = target.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    
    let top, left;
    
    switch (step.position) {
      case 'top':
        top = rect.top - tooltipRect.height - 20;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 20;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 20;
        break;
      case 'center':
      default:
        top = window.innerHeight / 2 - tooltipRect.height / 2;
        left = window.innerWidth / 2 - tooltipRect.width / 2;
        break;
    }
    
    // Asegurar que esté dentro de la ventana
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
    
    this.tooltip.style.top = top + 'px';
    this.tooltip.style.left = left + 'px';
    this.tooltip.style.transform = 'translate(0, 0) scale(1)';
  },
  
  // Aplicar acción del paso
  applyStepAction(step) {
    const target = document.querySelector(step.target);
    
    // Limpiar acciones anteriores
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
    
    switch (step.action) {
      case 'highlight':
        if (target) {
          target.classList.add('tutorial-highlight');
        }
        break;
      case 'point':
        if (target) {
          target.classList.add('tutorial-highlight');
        }
        break;
      case 'success':
        if (target) {
          target.classList.add('tutorial-highlight');
          // Agregar efecto de éxito
          setTimeout(() => {
            target.style.animation = 'tutorial-success 0.6s ease';
          }, 300);
        }
        break;
    }
  },
  
  // Siguiente paso
  next() {
    this.currentStep++;
    this.showStep();
  },
  
  // Paso anterior
  previous() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep();
    }
  },
  
  // Saltar tutorial
  skip() {
    this.complete();
  },
  
  // Completar tutorial
  complete() {
    this.isActive = false;
    
    // Ocultar overlay y tooltip
    this.overlay.style.opacity = '0';
    this.overlay.style.pointerEvents = 'none';
    this.tooltip.style.opacity = '0';
    this.tooltip.style.transform = 'scale(0.8)';
    
    // Limpiar highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
    
    // Marcar como completado
    localStorage.setItem(this.STORAGE_KEY, 'true');
    
    // Mostrar mensaje de finalización
    this.showCompletionMessage();
  },
  
  // Mostrar mensaje de finalización
  showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'tutorial-completion';
    message.innerHTML = `
      <div class="completion-content">
        <div class="completion-icon">🎉</div>
        <div class="completion-text">
          <h3>¡Tutorial Completado!</h3>
          <p>Ya sabes cómo jugar. ¡Disfruta de MemoFlip!</p>
        </div>
      </div>
    `;
    
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #7bd389, #5cb85c);
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => message.style.opacity = '1', 100);
    
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => message.remove(), 300);
    }, 3000);
  },
  
  // Reiniciar tutorial
  restart() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.init();
  },
  
  // Verificar si el tutorial está completado
  isCompleted() {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }
};

// CSS para el tutorial
const tutorialStyles = document.createElement('style');
tutorialStyles.textContent = `
  .tutorial-highlight {
    position: relative;
    z-index: 9997;
    animation: tutorial-pulse 1.5s ease-in-out infinite;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.8);
  }
  
  @keyframes tutorial-pulse {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(255, 107, 53, 0.8);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 0 30px rgba(255, 107, 53, 1);
      transform: scale(1.02);
    }
  }
  
  @keyframes tutorial-success {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); background-color: rgba(123, 211, 137, 0.3); }
    100% { transform: scale(1); }
  }
  
  .tutorial-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .tutorial-title {
    margin: 0;
    font-size: 1.2em;
    font-weight: bold;
  }
  
  .tutorial-close {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tutorial-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .tutorial-content {
    margin-bottom: 20px;
    line-height: 1.5;
  }
  
  .tutorial-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .tutorial-actions button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  
  .tutorial-actions button:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .tutorial-completion .completion-content {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .completion-icon {
    font-size: 48px;
  }
  
  .completion-text h3 {
    margin: 0 0 5px 0;
    font-size: 1.3em;
  }
  
  .completion-text p {
    margin: 0;
    opacity: 0.9;
  }
  
  @media (max-width: 600px) {
    .tutorial-tooltip {
      max-width: 90vw;
      margin: 10px;
    }
    
    .tutorial-actions {
      flex-direction: column;
    }
    
    .tutorial-actions button {
      width: 100%;
    }
  }
`;
document.head.appendChild(tutorialStyles);

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.TutorialSystem = TutorialSystem;
}

