// ===== TOP 5 MANUAL - ACTUALIZAS MENSUALMENTE =====
const top5Peliculas = [
    {
        titulo: "Masacre en Texas",
        imagen: "👀",
        url: "https://tubitv.com/es-mx/movies/545161/masacre-en-texas-herencia-maldita-doblado",
        descripcion: "basada en hechos reales: masacre en texas herencia maldita doblado"
    },
    {
        titulo: "Scream 4", 
        imagen: "👻",
        url: "https://tubitv.com/es-mx/movies/533568/scream-4-doblado", 
        descripcion: "continua la secuela scream 4 doblado"
    },
    {
        titulo: "Cadaver",
        imagen: "💀",
        url: "https://tubitv.com/es-mx/movies/100046027/cad-ver",
        descripcion: "La morgue y cadaveres que puede salir mal?"
    },
    {
        titulo: "La Maldicion de la Ouija",
        imagen: "👹",
        url: "https://tubitv.com/es-mx/movies/547115/la-maldici-n-de-la-ouija",
        descripcion: "un juego de tablero o una maldicion?"
    },
    {
        titulo: "La Noche de los Muertos Vivientes",
        imagen: "🧟‍♀️",
        url: "https://tubitv.com/es-mx/movies/560399/la-noche-de-los-muertos-vivientes-doblado",
        descripcion: "Pelicula de culto 1968"
    }
];

// ===== FUNCIÓN OPTIMIZADA PARA PC/MÓVIL =====
function showCartelera() {
    welcomeSection.style.display = 'none';
    channelsSection.style.display = 'none';
    playerSection.style.display = 'none';
    carteleraSection.style.display = 'block';
    
    carteleraGrid.innerHTML = `
        <div class="cartelera-header">
            <h2>🎬 TOP 5 PELÍCULAS DE TERROR</h2>
            <p class="last-update">🕐 Actualizado Mes - Tubi TV</p>
        </div>
    `;
    
    top5Peliculas.forEach((pelicula, index) => {
        const peliculaItem = document.createElement('div');
        peliculaItem.className = 'cartelera-item';
        
        const imagenContent = pelicula.imagen.startsWith('http') 
            ? `<img src="${pelicula.imagen}" alt="${pelicula.titulo}" class="canal-logo-small">`
            : `<div class="movie-emoji">${pelicula.imagen}</div>`;
        
        peliculaItem.innerHTML = `
            <div class="canal-info">
                <div class="canal-logo-small">
                    ${imagenContent}
                </div>
                <div class="canal-name">#${index + 1} - ${pelicula.titulo}</div>
                <span class="live-badge">🎬 TOP ${index + 1}</span>
            </div>
            <div class="pelicula-info">
                <p class="pelicula-description">${pelicula.descripcion}</p>
                <a href="${pelicula.url}" target="_blank" class="ver-canal-btn">
                    ▶ Ver Tubi TV
                </a>
            </div>
        `;
        
        carteleraGrid.appendChild(peliculaItem);
    });
    
    // Mensaje inteligente que se adapta
    const mensajeAdaptable = document.createElement('div');
    mensajeAdaptable.className = 'cartelera-footer';
    mensajeAdaptable.innerHTML = `
        <p><strong>💡 En PC/Móvil:</strong> Haz clic en "Ver Tubi TV" para abrir en nueva pestaña</p>
        <p><strong>📺 En Smart TV:</strong> Anota los títulos y búscalos en la app de Tubi TV</p>
        <p>🔄 Actualizado mes octubre terror</p>
    `;
    carteleraGrid.appendChild(mensajeAdaptable);
}
