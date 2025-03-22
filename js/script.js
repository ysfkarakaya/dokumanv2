/**
 * Aaro ERP Dokümantasyon Sistemi
 * 
 * Bu script, modüllerin otomatik olarak listelenmesi ve içeriğin
 * yüklenmesi için gerekli fonksiyonları içerir.
 */

$(document).ready(function() {
    // Önbelleği tüm Ajax istekleri için devre dışı bırak
    $.ajaxSetup({
        cache: false
    });
    
    // Modülleri yükle (tamamen JavaScript ile)
    loadModules();
    
    // Arama fonksiyonu
    setupSearch();
    
    // Dark Mode işlevselliği
    setupDarkMode();
    
    // Yazdırma işlevselliği
    setupPrintButton();
});

/**
 * Dark Mode işlevselliğini ayarlar
 */
function setupDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // LocalStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem('theme');
    
    // Eğer kaydedilmiş bir tema tercihi varsa, onu uygula
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    // Dark Mode butonuna tıklama olayı ekle
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Yeni temayı uygula
        htmlElement.setAttribute('data-theme', newTheme);
        
        // Tema tercihini localStorage'a kaydet
        localStorage.setItem('theme', newTheme);
        
        // Tema ikonunu güncelle
        updateThemeIcon(newTheme);
    });
}

/**
 * Tema ikonunu günceller
 * @param {string} theme - Tema adı ('dark' veya 'light')
 */
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill';
        themeToggle.title = 'Aydınlık Moda Geç';
    } else {
        icon.className = 'bi bi-moon-fill';
        themeToggle.title = 'Karanlık Moda Geç';
    }
}

/**
 * Yazdırma butonunu ayarlar
 */
function setupPrintButton() {
    const printButton = document.getElementById('printButton');
    
    printButton.addEventListener('click', function() {
        window.print();
    });
}

/**
 * Modülleri yükler ve menüde listeler
 */
function loadModules() {
    // Statik modül verilerini kullan
    renderModuleMenu(staticModules);
    
    // URL'den modül ve sayfa parametrelerini al
    const urlParams = new URLSearchParams(window.location.search);
    const moduleParam = urlParams.get('module');
    const pageParam = urlParams.get('page');
    
    // Eğer URL'de modül ve sayfa parametreleri varsa, ilgili sayfayı yükle
    if (moduleParam && pageParam) {
        loadModulePage(moduleParam, pageParam);
    }
}

/**
 * Modülleri menüde render eder
 * @param {Array} modules - Modül listesi
 */
function renderModuleMenu(modules) {
    let menuHtml = '';
    
    modules.forEach(function(module) {
        menuHtml += `
            <div class="module-category">
                <div class="module-category-title" data-bs-toggle="collapse" data-bs-target="#module-${module.id}">
                    <span><i class="bi ${module.icon}"></i> ${module.name}</span>
                    <i class="bi bi-chevron-down"></i>
                </div>
                <ul id="module-${module.id}" class="module-items collapse">`;
        
        module.pages.forEach(function(page) {
            menuHtml += `
                <li class="module-item" 
                    data-module="${module.id}" 
                    data-page="${page.id}"
                    onclick="loadModulePage('${module.id}', '${page.id}')">
                    ${page.title}
                </li>`;
        });
        
        menuHtml += `
                </ul>
            </div>`;
    });
    
    $('#moduleMenu').html(menuHtml);
}

/**
 * Belirtilen modül ve sayfayı yükler
 * @param {string} moduleId - Modül ID'si
 * @param {string} pageId - Sayfa ID'si
 */
function loadModulePage(moduleId, pageId) {
    // URL'i güncelle (sayfa yenilenmeden)
    const newUrl = `?module=${moduleId}&page=${pageId}`;
    window.history.pushState({}, '', newUrl);
    
    // Aktif menü öğesini güncelle
    $('.module-item').removeClass('active');
    $(`.module-item[data-module="${moduleId}"][data-page="${pageId}"]`).addClass('active');
    
    // Yükleniyor göster
    $('#moduleContent').html(`
        <div class="loading-container">
            <div class="spinner"></div>
        </div>
    `);
    
    // Modül bilgilerini al
    getModuleInfo(moduleId, pageId)
        .then(function(moduleInfo) {
            // Modül başlığını göster
            renderModuleHeader(moduleInfo);
            
            // İçeriği yükle
            return getModuleContent(moduleId, pageId);
        })
        .then(function(content) {
            $('#moduleContent').html(content);
            
            // Kod bloklarını vurgula (eğer prism.js kullanılıyorsa)
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }
            
            // Accordion ve tab gibi Bootstrap bileşenlerini yeniden başlat
            initBootstrapComponents();
            
            console.log(`İçerik yüklendi: ${moduleId}/${pageId}`);
        })
        .catch(function(error) {
            console.error('İçerik yükleme hatası:', error);
            
            $('#moduleContent').html(`
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    İçerik yüklenirken bir hata oluştu: ${error}
                </div>
                <p>Lütfen sol menüden başka bir sayfa seçin veya sayfayı yenileyin.</p>
            `);
        });
}


/**
 * Bootstrap bileşenlerini başlatır
 */
function initBootstrapComponents() {
    // Accordion ve tab gibi bileşenleri yeniden başlat
    if (typeof bootstrap !== 'undefined') {
        // Accordions
        document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(function(element) {
            new bootstrap.Collapse(element, {
                toggle: false
            });
        });
        
        // Tabs
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(function(element) {
            new bootstrap.Tab(element);
        });
    }
}

/**
 * Modül başlık bilgilerini render eder
 * @param {Object} moduleInfo - Modül bilgileri
 */
function renderModuleHeader(moduleInfo) {
    const headerHtml = `
        <div class="module-header-title">
            <i class="bi ${moduleInfo.icon}"></i>
            <h2>${moduleInfo.title}</h2>
        </div>
        <div class="module-meta">
            <div class="module-meta-item">
                <i class="bi bi-folder"></i>
                <span>Modül: ${moduleInfo.moduleName}</span>
            </div>
            <div class="module-meta-item">
                <i class="bi bi-link-45deg"></i>
                <span>URL: ${moduleInfo.url}</span>
            </div>
            <div class="module-meta-item">
                <i class="bi bi-calendar3"></i>
                <span>Güncelleme: ${moduleInfo.lastUpdate}</span>
            </div>
        </div>
    `;
    
    $('#moduleHeader').html(headerHtml).show();
}

/**
 * Arama fonksiyonunu ayarlar
 */
function setupSearch() {
    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        if (searchTerm.length < 2) {
            $('.module-item').show();
            $('.module-category').show();
            return;
        }
        
        // Tüm modül öğelerini gizle
        $('.module-item').hide();
        $('.module-category').hide();
        
        // Arama terimiyle eşleşen öğeleri göster
        $('.module-item').each(function() {
            const itemText = $(this).text().toLowerCase();
            if (itemText.includes(searchTerm)) {
                $(this).show();
                $(this).closest('.module-category').show();
                $(this).closest('.collapse').addClass('show');
            }
        });
    });
}
