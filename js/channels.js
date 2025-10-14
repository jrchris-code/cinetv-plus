// ===== DATOS DE CANALES =====
const channelsData = {
    cine: [
        {
            id: 1,
            name: "Cine Canal",
            description: "Las mejores películas de todos los tiempos",
            logo: "https://i.imgur.com/Rcxr410.png",
            url: "https://cors-proxy.cooks.fyi/https://streamer1.nexgen.bz/CINECANAL/index.m3u8"
        },
        {
            id: 2,
            name: "Cine Sony", 
            description: "Sony Channel para ver los mejores programas",
            logo: "https://i.imgur.com/bZWoDTg.png",
            url: "https://a-cdn.klowdtv.com/live1/cine_720p/playlist.m3u8"
        },
        {
            id: 3,
            name: "Aurora Media Films",
            description: "Películas que debes ver",
            logo: "https://i.imgur.com/DVC5w6H.png",
            url: "https://cdn.streamhispanatv.net:3417/live/auroramflive.m3u8"
        },
        {
            id: 4,
            name: "Cine Terror",
            description: "No Apto para Cardiacos",
            logo: "./assets/images/horror.png",
            url: "https://cors-proxy.cooks.fyi/https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5dcddf1ed95e740009fef7ab/master.m3u8"
        },
        {
            id:5,
            name: "VACANTE",
            description: "Espacio disponible para nuevo canal",
            logo: "➕",
            url: "#"
        }
    ],
    music: [
        {
            id: 1,
            name: "VM Latino",
            description: "Éxitos Latinos",
            logo: "https://i.imgur.com/Dvo1b82.png",
            url: "https://59ef525c24caa.streamlock.net/vmtv/vmlatino/playlist.m3u8"
        },
        {
            id: 2,
            name: "TV Éxitos",
            description: "Éxitos del mundo", 
            logo: "https://i.imgur.com/ahz7X7u.png",
            url: "https://streaming.grupomediosdelnorte.com:19360/tvexitos/tvexitos.m3u8"
        },
        {
            id: 3,
            name: "MTV Classics",
            description: "MTV Clásico",
            logo: "https://i.imgur.com/NPavpts.png",
            url: "https://jmp2.uk/plu-66a11a21a79dea0008aa90ca.m3u8"
        },
        {
            id: 4,
            name: "VACANTE",
            description: "Espacio disponible para nuevo canal",
            logo: "➕",
            url: "#"
        }
    ]
};

// ===== FUNCIONES DE CANALES =====
function showChannels(category) {
    welcomeSection.style.display = 'none';
    channelsSection.style.display = 'block';
    
    const categoryTitle = category === 'cine' ? 'CANALES DE CINE' : 'CANALES DE MÚSICA';
    sectionCategoryTitle.textContent = categoryTitle;
    
    channelsGrid.innerHTML = '';
    
    const channels = channelsData[category];
    channels.forEach(channel => {
        const channelCard = document.createElement('div');
        channelCard.className = 'channel-card';
        if (channel.name === 'VACANTE') {
            channelCard.classList.add('vacante');
        }
        
        const logoContent = channel.logo.startsWith('http') 
            ? `<img src="${channel.logo}" alt="${channel.name}" onerror="this.style.display='none'">`
            : `<div style="font-size: 60px;">${channel.logo}</div>`;
        
        channelCard.innerHTML = `
            <div class="channel-logo">
                ${logoContent}
            </div>
            <div class="channel-info">
                <h3 class="channel-name">${channel.name}</h3>
                <p class="channel-description">${channel.description}</p>
            </div>
        `;
        
        channelCard.addEventListener('click', () => {
            playChannel(channel);
        });
        
        channelsGrid.appendChild(channelCard);
    });
}
