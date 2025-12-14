// script.js - Mobil Odaklı Galeri Kontrolcüsü (TAM VERSİYON)

// 1. YAPILANDIRMA
const SHEETS_ID = '1evrCEz6RLZ-NCjs2rsrm31RPfBLo0hcpEHHhwTMvTfk'; 
const YOUTUBE_VIDEO_ID = 'sF80I-TQiW0'; 

let allPhotos = [];
let uniqueCategories = new Set();
let player;
let isMuted = true;

// 2. MÜZİK KONTROLÜ VE SORUN GİDERME
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: { 
            'autoplay': 1, 
            'loop': 1, 
            'playlist': YOUTUBE_VIDEO_ID, 
            'controls': 0, 
            'mute': 1 // OTOMATİK OYNATMA İÇİN BAŞLANGIÇTA SESSİZ
        }, 
        events: { 'onReady': onPlayerReady }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

// Kullanıcı sayfayla etkileşime girdiğinde (herhangi bir yere tıkladığında)
document.addEventListener('click', function handleFirstInteraction() {
    if (player && player.isMuted() && isMuted) {
        player.unMute();
        isMuted = false;
        
        // Müzik kontrol butonunu göster
        document.getElementById('music-toggle').classList.remove('music-hidden');
        document.querySelector('#music-toggle i').className = 'fas fa-volume-up';
    }
    // İlk etkileşimden sonra dinleyiciyi kaldır
    document.removeEventListener('click', handleFirstInteraction);
});

function toggleMute() {
    if (player.isMuted()) {
        player.mute();
        isMuted = true;
        document.querySelector('#music-toggle i').className = 'fas fa-volume-mute';
    } else {
        player.unMute();
        isMuted = false;
        document.querySelector('#music-toggle i').className = 'fas fa-volume-up';
    }
}


// 3. SİDEBAR VE SAYFA NAVİGASYONU
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function navigate(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfa geçişinde üste kaydır

    if (pageId === 'categories-page') {
        buildCategoryList();
    }
}


// 4. GALERİ YÜKLEME VE FİLTRELEME
document.addEventListener("DOMContentLoaded", function() {
    // Açılış Animasyonu
    setTimeout(function() {
        document.getElementById('intro-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('intro-screen').style.display = 'none';
        }, 1000); 
    }, 1000);

    loadGalleryFromSheet();
});


function loadGalleryFromSheet() {
    const sheetURL = `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:json&gid=0`;

    fetch(sheetURL)
        .then(res => res.text())
        .then(text => {
            const jsonText = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
            const data = JSON.parse(jsonText);
            
            data.table.rows.slice(1).forEach(row => {
                try {
                    const url = row.c[0] ? row.c[0].v : '';
                    const description = row.c[1] ? row.c[1].v : 'Açıklama yok.';
                    const date = row.c[2] ? row.c[2].v : 'Tarih belirtilmemiş.';
                    const category = row.c[3] ? row.c[3].v.trim() : 'Diğer'; 

                    if (url) {
                        const photoData = { url, description, date, category };
                        allPhotos.push(photoData);
                        uniqueCategories.add(category);
                    }
                } catch (e) {
                    console.error("Hata: Satır işlenemedi.", row, e);
                }
            });

            filterAndRenderGallery('all');
        })
        .catch(err => {
            console.error("Veri yüklenemedi. Web'de Yayımla ayarını ve ID'yi kontrol edin.", err);
        });
}

function filterAndRenderGallery(filterCategory) {
    const container = document.querySelector('.gallery-container');
    container.innerHTML = '';
    
    const titleElement = document.getElementById('current-category-title');
    if (filterCategory === 'all') {
        titleElement.innerText = 'Tüm Fotoğraflar';
    } else {
        titleElement.innerText = filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1);
    }

    const photosToDisplay = (filterCategory === 'all')
        ? allPhotos
        : allPhotos.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

    photosToDisplay.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${photo.url}" 
                 alt="${photo.description}" 
                 data-description="${photo.description}" 
                 data-date="${photo.date}" 
                 onclick="openLightbox(this)">
        `;
        container.appendChild(item);

        setTimeout(() => { item.classList.add('show'); }, 500 + (index * 100)); 
    });
}

// 5. KATEGORİ LİSTESİ OLUŞTURMA
function buildCategoryList() {
    const list = document.getElementById('category-list');
    list.innerHTML = '';

    const allItem = document.createElement('li');
    const allLink = document.createElement('a');
    allLink.href = '#';
    allLink.innerText = 'Tüm Fotoğrafları Gör';
    allLink.onclick = (e) => {
        e.preventDefault();
        filterAndRenderGallery('all'); 
        navigate('home-page'); 
    };
    allItem.appendChild(allLink);
    list.appendChild(allItem);

    uniqueCategories.forEach(cat => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.innerText = cat.charAt(0).toUpperCase() + cat.slice(1);
        link.onclick = (e) => {
            e.preventDefault();
            filterAndRenderGallery(cat); 
            navigate('home-page');
            toggleSidebar(); // Filtrelemeden sonra sidebar'ı kapat
        };
        listItem.appendChild(link);
        list.appendChild(listItem);
    });
}


// 6. KAR YAĞIŞI FONKSİYONLARI (Canvas)
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Snowflake {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.velX = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.y += this.speed;
        this.x += this.velX;
        if (this.y > canvas.height) { this.y = -5; this.x = Math.random() * canvas.width; }
    }
    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
for (let i = 0; i < 150; i++) { particles.push(new Snowflake()); }
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();


// 7. LIGHTBOX FONKSİYONLARI
function openLightbox(img) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-image').src = img.src;
    document.getElementById('lightbox-description').innerText = img.dataset.description;
    document.getElementById('lightbox-date').innerText = img.dataset.date;
    lb.style.display = 'flex';
    document.body.style.overflow = "hidden";
}

document.querySelector('.close-btn').onclick = () => {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = "auto";
}
window.onclick = function(event) {
    if (event.target === document.getElementById('lightbox')) {
        document.getElementById('lightbox').style.display = 'none';
        document.body.style.overflow = "auto";
    }
}
document.onkeydown = function(e) {
    if (e.key === "Escape") {
        document.getElementById('lightbox').style.display = 'none';
        document.body.style.overflow = "auto";
    }
};
