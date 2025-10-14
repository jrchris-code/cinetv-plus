// ===== FUNCIONES DE CARTELERA =====

// Función para obtener información en tiempo real del programa actual
async function getCurrentProgram(channelUrl) {
    try {
        console.log(`Consultando: ${channelUrl}`);
        
        // Usar proxy para evitar CORS
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(channelUrl);
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/x-mpegURL, application/vnd.apple.mpegurl, text/plain'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const m3u8Content = await response.text();
        
        // Analizar el contenido M3U8
        const lines = m3u8Content.split('\n');
        let currentProgram = 'En vivo';
        let foundInfo = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Buscar líneas EXTINF que contienen información del programa
            if (line.startsWith('#EXTINF:')) {
                const parts = line.split(',');
                if (parts.length > 1) {
                    currentProgram = parts[1].trim();
                    foundInfo = true;
                    break;
                }
            }
            
            // También buscar títulos en comentarios
            if (line.startsWith('#') && line.includes('title=')) {
                const titleMatch = line.match(/title="([^"]+)"/);
                if (titleMatch) {
                    currentProgram = titleMatch[1];
                    foundInfo = true;
                    break;
                }
            }
        }
        
        // Si no encontramos información específica
        if (!foundInfo) {
            // Intentar determinar el tipo de contenido por el nombre del canal/URL
            if (channelUrl.includes('cine') || channelUrl.includes('movie')) {
                currentProgram = 'Película en curso';
            } else if (channelUrl.includes('music') || channelUrl.includes('mtv')) {
                currentProgram = 'Video musical';
            } else {
                currentProgram = 'Transmisión en vivo';
            }
        }
        
        return currentProgram;
        
    } catch (error) {
        console.warn(`No se pudo obtener información de ${channelUrl}:`, error.message);
        return 'Información no disponible';
    }
}

// Función para mostrar la cartelera en tiempo real
async function showCartelera() {
    welcomeSection.style.display = 'none';
    channelsSection.style.display = 'none';
    playerSection.style.display = 'none';
    carteleraSection.style.display = 'block';
    
    // Mostrar loading
    carteleraGrid.innerHTML = `
        <div class="loading-cartelera">
            <div class="spinner"></div>
            <p>Consultando cartelera en tiempo real...</p>
        </div>
    `;
    
    // Obtener información de todos los canales de cine
    const carteleraItems = [];
    
    for (let channel of channelsData.cine) {
        if (channel.url !== '#' && channel.name !== 'VACANTE') {
            try {
                const currentProgram = await getCurrentProgram(channel.url);
                
                carteleraItems.push(`
                    <div class="cartelera-item" data-channel="${channel.name}">
                        <div class="canal-info">
                            <div class="canal-logo-small">
                                ${channel.logo.startsWith('http') 
                                    ? `<img src="${channel.logo}" alt="${channel.name}" onerror="this.style.display='none'">`
                                    : `<div>${channel.logo}</div>`}
                            </div>
                            <div class="canal-name">${channel.name}</div>
                            <span class="live-badge">🔴 EN VIVO</span>
                        </div>
                        <div class="pelicula-info">
                            <h3 class="pelicula-title">"${currentProgram}"</h3>
                            <div class="pelicula-horario">📡 Transmitiendo ahora</div>
                            <p class="pelicula-descripcion">${channel.description}</p>
                            <button class="ver-canal-btn" data-channel-id="${channel.id}">▶ Ver este canal</button>
                        </div>
                    </div>
                `);
                
            } catch (error) {
                // Si falla, mostrar información básica
                carteleraItems.push(`
                    <div class="cartelera-item" data-channel="${channel.name}">
                        <div class="canal-info">
                            <div class="canal-logo-small">
                                ${channel.logo.startsWith('http') 
                                    ? `<img src="${channel.logo}" alt="${channel.name}" onerror="this.style.display='none'">`
                                    : `<div>${channel.logo}</div>`}
                            </div>
                            <div class="canal-name">${channel.name}</div>
                            <span class="live-badge">🔴 EN VIVO</span>
                        </div>
                        <div class="pelicula-info">
                            <h3 class="pelicula-title">Contenido no disponible</h3>
                            <div class="pelicula-horario">⚠ Información temporalmente no disponible</div>
                            <p class="pelicula-descripcion">${channel.description}</p>
                            <button class="ver-canal-btn" data-channel-id="${channel.id}">▶ Ver este canal</button>
                        </div>
                    </div>
                `);
            }
        }
    }
    
    // Mostrar los resultados
    if (carteleraItems.length > 0) {
        carteleraGrid.innerHTML = carteleraItems.join('');
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.ver-canal-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const channelId = parseInt(this.getAttribute('data-channel-id'));
                const channel = channelsData.cine.find(c => c.id === channelId);
                if (channel) {
                    playChannel(channel);
                }
            });
        });
        
        // Hacer los items clicables también
        document.querySelectorAll('.cartelera-item').forEach(item => {
            item.addEventListener('click', function() {
                const channelName = this.getAttribute('data-channel');
                const channel = channelsData.cine.find(c => c.name === channelName);
                if (channel) {
                    playChannel(channel);
                }
            });
        });
        
    } else {
        carteleraGrid.innerHTML = '<div class="no-cartelera">No hay canales de cine disponibles en este momento.</div>';
    }
}
