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
    
    // Ana sayfada modül kartlarını oluştur
    renderModuleCards();
    
    // Arama fonksiyonu
    setupSearch();
    
    // Dark Mode işlevselliği
    setupDarkMode();
    
    // Yazdırma işlevselliği
    setupPrintButton();
});

/**
 * Ana sayfada modül kartlarını render eder
 */
function renderModuleCards() {
    let cardsHtml = '';
    
    // Modülleri sırala
    const sortedModules = [...staticModules].sort((a, b) => a.order - b.order);
    
    // Her modül için bir kart oluştur
    sortedModules.forEach(function(module) {
        // Modül için rastgele bir renk sınıfı seç
        const colorClasses = ['primary', 'success', 'info', 'warning', 'danger'];
        const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
        
        cardsHtml += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-header bg-${randomColor} text-white">
                        <h4 class="mb-0"><i class="bi ${module.icon}"></i> ${module.name}</h4>
                    </div>
                    <div class="card-body">
                        <p>${module.description || 'Bu modül ile ilgili dokümantasyon.'}</p>
                        <h5>Sayfalar:</h5>
                        <div class="module-pages-list">`;
        
        // Modülün ilk 4 sayfasını göster
        const pagesToShow = module.pages.slice(0, 4);
        pagesToShow.forEach(function(page) {
            cardsHtml += `
                <a href="?module=${module.id}&page=${page.id}" class="module-page-item">
                    <span class="page-icon"><i class="bi bi-file-text"></i></span>
                    <span class="page-title">${page.title}</span>
                    <span class="page-arrow"><i class="bi bi-chevron-right"></i></span>
                </a>`;
        });
        
        // Eğer daha fazla sayfa varsa, "Daha fazla..." linki ekle
        if (module.pages.length > 4) {
            cardsHtml += `
                <a href="#" onclick="$('#module-${module.id}').addClass('show');" class="module-page-item module-page-more">
                    <span class="page-icon"><i class="bi bi-three-dots"></i></span>
                    <span class="page-title">Daha fazla...</span>
                    <span class="page-arrow"><i class="bi bi-chevron-down"></i></span>
                </a>`;
        }
        
        cardsHtml += `
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="?module=${module.id}&page=genel-bakis" class="btn btn-sm btn-${randomColor}">
                            <i class="bi bi-arrow-right-circle"></i> Modüle Git
                        </a>
                    </div>
                </div>
            </div>`;
    });
    
    // Kartları sayfaya ekle
    $('#moduleCards').html(cardsHtml);
}

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
    // Sidebar arama fonksiyonu
    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        if (searchTerm.length < 2) {
            // Arama terimi çok kısaysa tüm modülleri göster
            renderModuleMenu(staticModules);
            return;
        }
        
        // Arama terimine göre modülleri filtrele
        const filteredModules = staticModules.map(module => {
            // Modül adı arama terimiyle eşleşiyorsa, tüm sayfaları göster
            if (module.name.toLowerCase().includes(searchTerm)) {
                return module;
            }
            
            // Sayfaları filtrele
            const filteredPages = module.pages.filter(page => 
                page.title.toLowerCase().includes(searchTerm)
            );
            
            // Eğer filtrelenmiş sayfalar varsa, modülü bu sayfalarla döndür
            if (filteredPages.length > 0) {
                return {
                    ...module,
                    pages: filteredPages
                };
            }
            
            // Eşleşme yoksa null döndür
            return null;
        }).filter(module => module !== null);
        
        // Filtrelenmiş modülleri göster
        renderModuleMenu(filteredModules);
        
        // Tüm collapse'leri aç
        $('.module-items').addClass('show');
    });
    
    // Sidebar arama butonuna tıklama olayı ekle
    $('#searchButton').on('click', function() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        
        if (searchTerm.length < 2) {
            return;
        }
        
        // Arama işlemini tetikle
        $('#searchInput').trigger('keyup');
    });
    
    // Gelişmiş arama fonksiyonu
    setupAdvancedSearch();
}

/**
 * Gelişmiş arama fonksiyonunu ayarlar
 */
function setupAdvancedSearch() {
    // Enter tuşuna basıldığında arama yap
    $('#advancedSearchInput').on('keypress', function(e) {
        if (e.which === 13) {
            $('#advancedSearchButton').click();
        }
    });
    
    // Arama butonuna tıklama olayı ekle
    $('#advancedSearchButton').on('click', function() {
        const searchTerm = $('#advancedSearchInput').val().toLowerCase();
        
        if (searchTerm.length < 2) {
            // Arama terimi çok kısaysa uyarı göster
            $('#searchResults').html(`
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i> Lütfen en az 2 karakter girin.
                </div>
            `);
            return;
        }
        
        // Arama filtrelerini al
        const searchModules = $('#searchModules').is(':checked');
        const searchPages = $('#searchPages').is(':checked');
        const searchContent = $('#searchContent').is(':checked');
        
        // Arama yapılıyor göster
        $('#searchResults').html(`
            <div class="text-center p-4">
                <div class="spinner"></div>
                <p class="mt-3">Arama yapılıyor...</p>
            </div>
        `);
        
        // Arama yap
        setTimeout(() => {
            performAdvancedSearch(searchTerm, searchModules, searchPages, searchContent);
        }, 500); // Gerçek bir arama yapıldığı hissi vermek için küçük bir gecikme
    });
}

/**
 * Gelişmiş arama işlemini gerçekleştirir
 * @param {string} searchTerm - Arama terimi
 * @param {boolean} searchModules - Modüllerde arama yapılacak mı
 * @param {boolean} searchPages - Sayfalarda arama yapılacak mı
 * @param {boolean} searchContent - İçerikte arama yapılacak mı
 */
function performAdvancedSearch(searchTerm, searchModules, searchPages, searchContent) {
    // Arama sonuçları
    let searchResults = [];
    
    // Modüllerde arama yap
    if (searchModules) {
        staticModules.forEach(module => {
            if (module.name.toLowerCase().includes(searchTerm) || 
                module.description.toLowerCase().includes(searchTerm)) {
                searchResults.push({
                    type: 'module',
                    title: module.name,
                    icon: module.icon,
                    path: `?module=${module.id}&page=genel-bakis`,
                    snippet: module.description || 'Modül açıklaması bulunmuyor.',
                    highlight: highlightText(module.description || '', searchTerm),
                    moduleId: module.id,
                    pageId: 'genel-bakis',
                    relevance: module.name.toLowerCase().includes(searchTerm) ? 10 : 5
                });
            }
        });
    }
    
    // Sayfalarda arama yap
    if (searchPages) {
        staticModules.forEach(module => {
            module.pages.forEach(page => {
                if (page.title.toLowerCase().includes(searchTerm)) {
                    searchResults.push({
                        type: 'page',
                        title: page.title,
                        icon: page.icon || 'bi-file-text',
                        path: `?module=${module.id}&page=${page.id}`,
                        snippet: `${module.name} modülünde bir sayfa.`,
                        highlight: `<strong>${page.title}</strong> sayfası, ${module.name} modülünde bulunmaktadır.`,
                        moduleId: module.id,
                        pageId: page.id,
                        relevance: 8
                    });
                }
            });
        });
    }
    
    // İçerikte arama yap (Gerçek bir uygulamada bu kısım sunucu tarafında yapılır)
    if (searchContent) {
        // Örnek içerik araması (gerçek bir uygulamada bu kısım sunucu tarafında yapılır)
        // Bu örnekte, bazı sabit içerik parçaları ekliyoruz
        const sampleContentMatches = [
            {
                moduleId: 'stok',
                pageId: 'stok-karti',
                content: 'Stok kartı, ürünlerinizin detaylı bilgilerini içerir. Stok kodu, adı, barkodu, fiyatı gibi bilgileri burada yönetebilirsiniz.'
            },
            {
                moduleId: 'musteri-satici',
                pageId: 'musteri-ekleme',
                content: 'Müşteri ekleme ekranında yeni müşteri kaydı oluşturabilirsiniz. Müşteri adı, vergi numarası, adres ve iletişim bilgilerini girebilirsiniz.'
            },
            {
                moduleId: 'bayi',
                pageId: 'bayi-ekrani',
                content: 'Bayi ekranı, bayilerinizin eriştiği ekrandır. Bayiler bu ekrandan ürünleri görüntüleyebilir, sipariş verebilir ve hesaplarını takip edebilir.'
            },
            {
                moduleId: 'bayi',
                pageId: 'siparis-listesi',
                content: 'Sipariş listesi, bayilerinizin vermiş olduğu siparişlerin detaylarını içerir. Siparişin tarihini, tutarını ve durumunu görebilirsiniz.'
            }
        ];
        
        sampleContentMatches.forEach(item => {
            if (item.content.toLowerCase().includes(searchTerm)) {
                // İlgili modül ve sayfayı bul
                const module = staticModules.find(m => m.id === item.moduleId);
                const page = module ? module.pages.find(p => p.id === item.pageId) : null;
                
                if (module && page) {
                    searchResults.push({
                        type: 'content',
                        title: page.title,
                        icon: page.icon || 'bi-file-text',
                        path: `?module=${module.id}&page=${page.id}`,
                        snippet: item.content,
                        highlight: highlightText(item.content, searchTerm),
                        moduleId: module.id,
                        pageId: page.id,
                        relevance: 6
                    });
                }
            }
        });
    }
    
    // Sonuçları alaka düzeyine göre sırala
    searchResults.sort((a, b) => b.relevance - a.relevance);
    
    // Sonuçları göster
    renderSearchResults(searchResults, searchTerm);
}

/**
 * Arama sonuçlarını render eder
 * @param {Array} results - Arama sonuçları
 * @param {string} searchTerm - Arama terimi
 */
function renderSearchResults(results, searchTerm) {
    if (results.length === 0) {
        // Sonuç bulunamadıysa
        $('#searchResults').html(`
            <div class="search-no-results">
                <i class="bi bi-search"></i>
                <h4>Sonuç bulunamadı</h4>
                <p>"${searchTerm}" için herhangi bir sonuç bulunamadı. Lütfen farklı bir arama terimi deneyin.</p>
            </div>
        `);
        return;
    }
    
    // Sonuç başlığı
    let resultsHtml = `
        <div class="search-results-header">
            <div class="search-results-count">
                <strong>${results.length}</strong> sonuç bulundu
            </div>
            <div class="search-results-sort">
                <span>Sıralama:</span>
                <select class="form-select form-select-sm" id="searchResultsSort">
                    <option value="relevance" selected>Alaka Düzeyi</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                </select>
            </div>
        </div>
        <div class="search-results-list">
    `;
    
    // Sonuçları listele
    results.forEach(result => {
        let typeIcon, typeLabel, typeClass;
        
        switch (result.type) {
            case 'module':
                typeIcon = 'bi-grid-3x3-gap';
                typeLabel = 'Modül';
                typeClass = 'module';
                break;
            case 'page':
                typeIcon = 'bi-file-text';
                typeLabel = 'Sayfa';
                typeClass = 'page';
                break;
            case 'content':
                typeIcon = 'bi-card-text';
                typeLabel = 'İçerik';
                typeClass = 'content';
                break;
        }
        
        resultsHtml += `
            <div class="search-result-item">
                <div class="search-result-title">
                    <i class="bi ${result.icon}"></i>
                    ${result.title}
                    <span class="search-result-type ${typeClass}">
                        <i class="bi ${typeIcon}"></i> ${typeLabel}
                    </span>
                </div>
                <div class="search-result-path">
                    <i class="bi bi-link-45deg"></i>
                    ${result.path}
                </div>
                <div class="search-result-snippet">
                    ${result.highlight}
                </div>
                <div class="search-result-actions">
                    <a href="${result.path}" class="btn btn-sm btn-primary">
                        <i class="bi bi-arrow-right"></i> Git
                    </a>
                </div>
            </div>
        `;
    });
    
    resultsHtml += `</div>`;
    
    // Sonuçları göster
    $('#searchResults').html(resultsHtml);
    
    // Sıralama değiştiğinde sonuçları yeniden sırala
    $('#searchResultsSort').on('change', function() {
        const sortType = $(this).val();
        
        switch (sortType) {
            case 'az':
                results.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'za':
                results.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'relevance':
            default:
                results.sort((a, b) => b.relevance - a.relevance);
                break;
        }
        
        // Sonuçları yeniden render et
        renderSearchResults(results, searchTerm);
    });
}

/**
 * Metindeki arama terimini vurgular
 * @param {string} text - Metin
 * @param {string} term - Vurgulanacak terim
 * @returns {string} Vurgulanmış metin
 */
function highlightText(text, term) {
    if (!text) return '';
    
    // Regex ile arama terimini bul ve vurgula
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}
