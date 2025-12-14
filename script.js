// script.js - Lightbox Etkileşimi ve Yükleme Animasyonu Eklendi

// Lightbox elementlerini seçelim
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-image');
const lightboxDesc = document.getElementById('lightbox-description');
const lightboxDate = document.getElementById('lightbox-date');
const closeBtn = document.querySelector('.close-btn');

// =========================================================
// YÜKLEME ANİMASYONU FONKSİYONU
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
// LIGHTBOX FONKSİYONLARI (Daha önce verdiğimiz kodlar)
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
