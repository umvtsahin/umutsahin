// script.js - Lightbox, Yükleme Animasyonu ve Kar Yağışı Fonksiyonları

// Lightbox elementlerini seçelim
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-image');
const lightboxDesc = document.getElementById('lightbox-description');
const lightboxDate = document.getElementById('lightbox-date');
const closeBtn = document.querySelector('.close-btn');

// =========================================================
// YÜKLEME ANİMASYONU (VSCO Tarzı Fade-In)
// =========================================================
document.addEventListener("DOMContentLoaded", function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Sayfa yüklendikten sonra, her bir fotoğrafı kademeli olarak görünür yap
    galleryItems.forEach((item, index) => {
        // 100ms başlangıç gecikmesi + her öğe için 100ms ek gecikme
        setTimeout(() => {
            item.classList.add('loaded');
        }, 100 + (index * 100)); 
    });
});

// =========================================================
// KAR YAĞIŞI OLUŞTURUCU FONKSİYONU
// =========================================================
function createSnowflake() {
    const snowContainer = document.getElementById('snow-container');
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '&#10052;'; // Kar tanesi ikonu (❄)

    // Rastgele başlangıç pozisyonu, büyüklük ve süre ayarları
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5-10 saniye
    snowflake.style.fontSize = Math.random() * 0.8 + 0.8 + 'em'; // 0.8-1.6em
    
    snowContainer.appendChild(snowflake);

    // Belli bir süre sonra kar tanesini DOM'dan kaldır (performans için)
    setTimeout(() => {
        snowflake.remove();
    }, 10000); // 10 saniye sonra kaldır
}

// Her 100 milisaniyede bir yeni kar tanesi oluştur
setInterval(createSnowflake, 100);


// =========================================================
// LIGHTBOX FONKSİYONLARI
// =========================================================

function openLightbox(imgElement) {
    const src = imgElement.src;
    const description = imgElement.getAttribute('data-description') || 'Açıklama yok.';
    const date = imgElement.getAttribute('data-date') || 'Tarih belirtilmemiş.';

    lightboxImg.src = src;
    lightboxDesc.textContent = description;
    lightboxDate.textContent = 'Çekim Tarihi: ' + date;

    lightbox.style.display = "flex"; 
    document.body.style.overflow = "hidden"; 
}

function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
}

// Kapatma butonuna tıklandığında Lightbox'ı kapat
const closeBtn = document.querySelector('.close-btn');
closeBtn.onclick = function() {
    closeLightbox();
}

// Kullanıcı pencerenin dışına tıkladığında Lightbox'ı kapat
window.onclick = function(event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
}

// Esc tuşuna basıldığında Lightbox'ı kapat
document.onkeydown = function(e) {
    if (e.key === "Escape") {
        closeLightbox();
    }
};
