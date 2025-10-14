// ===== APLICACIÓN PRINCIPAL =====

// Elementos DOM
const welcomeSection = document.getElementById('welcome-section');
const channelsSection = document.getElementById('channels-section');
const channelsGrid = document.getElementById('channels-grid');
const sectionCategoryTitle = document.getElementById('section-category-title');
const backBtn = document.getElementById('back-btn');
const playerSection = document.getElementById('player-section');
const videoPlayer = document.getElementById('video-player');
const playerTitle = document.getElementById('player-title');
const closePlayer = document.getElementById('close-player');
const categoryButtons = document.querySelectorAll('.category-btn');
const carteleraBtn = document.getElementById('cartelera-btn');
const carteleraSection = document.getElementById('cartelera-section');
const backCarteleraBtn = document.getElementById('back-cartelera-btn');
const carteleraGrid = document.getElementById('cartelera-grid');

// Variables globales
let hls = null;
let currentCategory = '';

// ===== CONTADOR DE VISITAS =====
function initVisitorCounter() {
    const STORAGE_KEY = 'cinetv_visit_count';
    let visitCount = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
    visitCount++;
    localStorage.setItem(STORAGE_KEY, visitCount.toString());
    document.getElementById('visit-count').textContent = visitCount.toLocaleString();
    
    // Efecto sutil al cargar
    const counter = document.getElementById('visitor-counter');
    counter.style.opacity = '0';
    setTimeout(() => {
        counter.style.transition = 'opacity 0.5s ease';
        counter.style.opacity = '0.6';
    }, 1000);
}

// ===== INICIALIZACIÓN =====
function init() {
    initVisitorCounter();
    showWelcome();
    setupEventListeners();
    setupSecurity();
}

// Configurar event listeners
function setupEventListeners() {
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentCategory = button.getAttribute('data-category');
            showChannels(currentCategory);
        });
    });

    backBtn.addEventListener('click', showWelcome);
    closePlayer.addEventListener('click', closeVideoPlayer);
    carteleraBtn.addEventListener('click', showCartelera);
    backCarteleraBtn.addEventListener('click', showWelcome);
}

// Configurar seguridad
function setupSecurity() {
    // Desactivar clic derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Desactivar teclas de desarrollo
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.key === 'u') ||
            (e.ctrlKey && e.key === 'r')) {
            e.preventDefault();
            return false;
        }
    });
}

// Mostrar pantalla de bienvenida
function showWelcome() {
    channelsSection.style.display = 'none';
    playerSection.style.display = 'none';
    carteleraSection.style.display = 'none';
    welcomeSection.style.display = 'block';
    
    if (hls) {
        hls.destroy();
        hls = null;
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
