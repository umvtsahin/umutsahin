// script.js - Lightbox Etkileşimi

// Lightbox elementlerini seçelim
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-image');
const lightboxDesc = document.getElementById('lightbox-description');
const lightboxDate = document.getElementById('lightbox-date');
const closeBtn = document.querySelector('.close-btn');

/**
 * Bir fotoğraf öğesine tıklandığında Lightbox'ı açar ve içeriği doldurur.
 * @param {HTMLImageElement} imgElement - Tıklanan resim elementi.
 */
function openLightbox(imgElement) {
    // Fotoğrafın kaynağını ve data özniteliklerini al
    const src = imgElement.src;
    const description = imgElement.getAttribute('data-description') || 'Açıklama yok.';
    const date = imgElement.getAttribute('data-date') || 'Tarih belirtilmemiş.';

    // Lightbox içeriğini doldur
    lightboxImg.src = src;
    lightboxDesc.textContent = description;
    lightboxDate.textContent = 'Çekim Tarihi: ' + date;

    // Lightbox'ı görünür yap
    lightbox.style.display = "flex"; // Flex ile içeriği dikeyde de ortalar
    document.body.style.overflow = "hidden"; // Lightbox açıkken kaydırmayı engelle
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

function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto"; // Sayfa kaydırmasını geri aç
}
