// ===== FUNCIONES DEL REPRODUCTOR =====

// Función para reproducir canal con manejo de CORS
function playChannel(channel) {
    if (channel.url === '#' || channel.name === 'VACANTE') {
        return;
    }
    
    playerTitle.textContent = channel.name;
    playerSection.style.display = 'flex';
    
    // Para TODOS los canales: intentar directo primero, luego proxies
    tryPlayChannel(channel.url);
}

// Función para intentar reproducir con diferentes métodos
function tryPlayChannel(streamUrl, proxyIndex = -1) {
    // Lista de proxies CORS gratuitos (proxyIndex = -1 significa intento directo)
    const corsProxies = [
        'https://corsproxy.io/?',
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/'
    ];
    
    let urlToTry = streamUrl;
    
    // Si proxyIndex >= 0, usar proxy correspondiente
    if (proxyIndex >= 0) {
        if (proxyIndex < corsProxies.length) {
            urlToTry = corsProxies[proxyIndex] + encodeURIComponent(streamUrl);
        } else {
            // Si ya probamos todos los proxies, mostrar error
            showStreamError();
            return;
        }
    }
    
    console.log(`Intentando reproducir: ${proxyIndex === -1 ? 'DIRECTO' : 'PROXY ' + proxyIndex}`);
    
    setupVideoPlayer(urlToTry, () => {
        // Si falla, intentar con el siguiente método
        const nextAttempt = proxyIndex + 1;
        tryPlayChannel(streamUrl, nextAttempt);
    });
}

// Configurar el reproductor de video
function setupVideoPlayer(streamUrl, onErrorCallback = null) {
    // Limpiar cualquier instancia HLS anterior
    if (hls) {
        hls.destroy();
        hls = null;
    }
    
    if (Hls.isSupported()) {
        hls = new Hls({
            debug: false,
            enableWorker: false,
            lowLatencyMode: true,
            backBufferLength: 90,
            xhrSetup: function(xhr, url) {
                // Configuración adicional para CORS
                xhr.withCredentials = false;
            }
        });
        
        hls.loadSource(streamUrl);
        hls.attachMedia(videoPlayer);
        
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            console.log('Stream cargado correctamente');
            videoPlayer.play().catch(e => {
                console.log('Error al reproducir:', e);
                if (onErrorCallback) onErrorCallback();
            });
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
            console.error('Error HLS:', data);
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('Error de red, intentando siguiente método...');
                        if (onErrorCallback) onErrorCallback();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('Error de medios, intentando siguiente método...');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.log('Error fatal, intentando siguiente método...');
                        if (onErrorCallback) onErrorCallback();
                        break;
                }
            }
        });
        
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Para Safari y navegadores que soportan HLS nativo
        videoPlayer.src = streamUrl;
        
        const loadedHandler = function() {
            videoPlayer.play().catch(e => {
                console.log('Error al reproducir:', e);
                if (onErrorCallback) onErrorCallback();
            });
            videoPlayer.removeEventListener('loadedmetadata', loadedHandler);
        };
        
        const errorHandler = function() {
            console.log('Error en carga nativa, intentando siguiente método...');
            if (onErrorCallback) onErrorCallback();
            videoPlayer.removeEventListener('error', errorHandler);
        };
        
        videoPlayer.addEventListener('loadedmetadata', loadedHandler);
        videoPlayer.addEventListener('error', errorHandler);
        
        // Timeout de seguridad
        setTimeout(() => {
            if (videoPlayer.readyState < 1) {
                console.log('Timeout en carga, intentando siguiente método...');
                if (onErrorCallback) onErrorCallback();
            }
        }, 10000);
    }
}

// Mostrar error de stream
function showStreamError() {
    alert('No se pudo cargar el canal. Por favor, intenta con otro canal o verifica tu conexión.');
    closeVideoPlayer();
}

// Cerrar reproductor
function closeVideoPlayer() {
    playerSection.style.display = 'none';
    
    if (hls) {
        hls.destroy();
        hls = null;
    }
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.removeAttribute('src'); // Limpiar completamente
    videoPlayer.load();
}
