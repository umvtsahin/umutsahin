// script.js - Dinamik Galeri, Kar ve Açılış Animasyonu

// 1. YAPILANDIRMA (SADECE BURASI GÜNCELLENDİ)
const SHEETS_ID = '1evrCEz6RLZ-NCjs2rsrm31RPfBLo0hcpEHHhwTMvTfk'; // Senin Google Sheets ID'n
const YOUTUBE_VIDEO_ID = 'sF80I-TQiW0'; // Müzik ID'si

// 2. YOUTUBE API MÜZİK KONTROLÜ
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': YOUTUBE_VIDEO_ID, 'mute': 1 }, 
        events: { 'onReady': onPlayerReady }
    });
}

function onPlayerReady(event) {
    // Müziği sessiz olarak başlatır, böylece tarayıcı engellemez.
    event.target.playVideo();
}


// 3. GALERİ YÜKLEME VE AÇILIŞ ANIMASYONU
document.addEventListener("DOMContentLoaded", function() {
    // 1. Açılış Ekranını Kaldır
    setTimeout(function() {
        document.getElementById('intro-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('intro-screen').style.display = 'none';
        }, 1500);
    }, 1500);

    // 2. Dinamik Galeriyi Yükle
    loadGalleryFromSheet();
});


function loadGalleryFromSheet() {
    // Google Sheets verisini JSON formatında çekme URL'si
    const sheetURL = `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:json&gid=0`;
    const container = document.querySelector('.gallery-container');

    fetch(sheetURL)
        .then(res => res.text())
        .then(text => {
            // Gelen metinden sadece JSON kısmını ayıkla
            const jsonText = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
            const data = JSON.parse(jsonText);
            
            // Satırları işle (İlk satır başlık olduğu için 1'den başlar)
            data.table.rows.slice(1).forEach((row, index) => {
                try {
                    // Verileri küçük harfli sütun başlıklarına göre çek
                    const url = row.c[0] ? row.c[0].v : '';
                    const description = row.c[1] ? row.c[1].v : 'Açıklama yok.';
                    const date = row.c[2] ? row.c[2].v : 'Tarih belirtilmemiş.';

                    if (url) {
                        const item = document.createElement('div');
                        item.className = 'gallery-item';
                        item.innerHTML = `
                            <img src="${url}" 
                                 alt="${description}" 
                                 data-description="${description}" 
                                 data-date="${date}" 
                                 onclick="openLightbox(this)">
                        `;
                        container.appendChild(item);

                        // Animasyonu sırayla başlat
                        setTimeout(() => { item.classList.add('show'); }, 1800 + (index * 200)); 
                    }
                } catch (e) {
                    console.error("Hata: Satır işlenemedi.", row, e);
                }
            });
        })
        .catch(err => {
            console.error("Veri yüklenemedi. Web'de Yayımla ayarını ve ID'yi kontrol edin.", err);
        });
}


// 4. GELİŞMİŞ KAR YAĞIŞI (Canvas)
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


// 5. LIGHTBOX FONKSİYONLARI
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
