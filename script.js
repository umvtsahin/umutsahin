// script.js - Dinamik Galeri, Kar, Navigasyon ve Filtreleme (Mantık aynı kaldı)

// 1. YAPILANDIRMA
const SHEETS_ID = '1evrCEz6RLZ-NCjs2rsrm31RPfBLo0hcpEHHhwTMvTfk'; // Senin Google Sheets ID'n
const YOUTUBE_VIDEO_ID = 'sF80I-TQiW0'; 

let allPhotos = [];
let uniqueCategories = new Set();

// 2. SAYFA NAVİGASYONU (İkonlara atandı)
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Eğer kategoriler sayfasına geçiliyorsa, listeyi yeniden oluştur
    if (pageId === 'categories-page') {
        buildCategoryList();
    }
}

// 3. YOUTUBE API MÜZİK KONTROLÜ (Değişmedi)
function onYouTubeIframeAPIReady() {
    // ... (Kod bloğu aynı kalır)
}

function onPlayerReady(event) {
    // ... (Kod bloğu aynı kalır)
}


// 4. GALERİ YÜKLEME VE FİLTRELEME
document.addEventListener("DOMContentLoaded", function() {
    // Açılış Animasyonu (Değişmedi)
    setTimeout(function() {
        document.getElementById('intro-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('intro-screen').style.display = 'none';
        }, 1500);
    }, 1500);

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
        // Kategori başlığının sadece ilk harfini büyüt
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

        setTimeout(() => { item.classList.add('show'); }, 500 + (index * 150)); 
    });
}

// 5. KATEGORİ LİSTESİ OLUŞTURMA (Değişmedi)
function buildCategoryList() {
    // ... (Kod bloğu aynı kalır)
}


// 6. KAR YAĞIŞI ve LIGHTBOX FONKSİYONLARI (Değişmedi)
// ... (Kod blokları aynı kalır)
