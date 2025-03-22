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
        // Tüm modüllerin HTML içeriklerini tarayarak arama yapmak için
        // Burada daha kapsamlı bir içerik araması yapıyoruz
        
        // Örnek içerik veritabanı (gerçek bir uygulamada bu veriler sunucudan gelir)
        const contentDatabase = [
            // SSS Modülü
            {
                moduleId: 'sss',
                pageId: 'genel-bakis',
                content: `
                    <h1>Sık Sorulan Sorular</h1>
                    <p>Bu sayfada Aaro ERP kullanımı ile ilgili sık sorulan soruları ve cevaplarını bulabilirsiniz.</p>
                    
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>Aaro ERP'ye nasıl giriş yapabilirim?</h3>
                        </div>
                        <div class="faq-answer">
                            <p>Aaro ERP'ye giriş yapmak için size verilen kullanıcı adı ve şifre ile erp.aaro.com.tr adresinden giriş yapabilirsiniz. Şifrenizi unuttuysanız "Şifremi Unuttum" bağlantısını kullanarak sıfırlayabilirsiniz.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>Yeni bir stok kartı nasıl oluşturabilirim?</h3>
                        </div>
                        <div class="faq-answer">
                            <p>Yeni bir stok kartı oluşturmak için Stok Yönetimi modülüne gidin ve "Yeni Stok Kartı" butonuna tıklayın. Açılan formda gerekli bilgileri doldurun ve "Kaydet" butonuna tıklayın.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>Fatura kesme işlemi nasıl yapılır?</h3>
                        </div>
                        <div class="faq-answer">
                            <p>Fatura kesmek için Satış & Pazarlama modülüne gidin ve "Yeni Fatura" butonuna tıklayın. Müşteri bilgilerini, ürünleri ve fiyatları girin, ardından "Fatura Oluştur" butonuna tıklayın.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>Bayi siparişlerini nasıl görebilirim?</h3>
                        </div>
                        <div class="faq-answer">
                            <p>Bayi siparişlerini görmek için Bayi Sistemi modülüne gidin ve "Sipariş Listesi" sayfasını açın. Burada tüm bayi siparişlerini görüntüleyebilir, filtreleyebilir ve yönetebilirsiniz.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>Raporları nasıl oluşturabilirim?</h3>
                        </div>
                        <div class="faq-answer">
                            <p>Raporlar oluşturmak için ilgili modülün "Raporlar" bölümüne gidin. Rapor türünü seçin, tarih aralığı ve diğer filtreleri belirleyin, ardından "Rapor Oluştur" butonuna tıklayın.</p>
                        </div>
                    </div>
                `
            },
            // Stok Modülü
            {
                moduleId: 'stok',
                pageId: 'stok-karti',
                content: `
                    <h1>Stok Kartı</h1>
                    <p>Stok kartı, ürünlerinizin detaylı bilgilerini içerir. Stok kodu, adı, barkodu, fiyatı gibi bilgileri burada yönetebilirsiniz.</p>
                    
                    <h2>Stok Kartı Oluşturma</h2>
                    <p>Yeni bir stok kartı oluşturmak için aşağıdaki adımları izleyin:</p>
                    <ol>
                        <li>"Yeni Stok Kartı" butonuna tıklayın</li>
                        <li>Stok kodu ve adı gibi zorunlu alanları doldurun</li>
                        <li>Birim, KDV oranı ve diğer bilgileri girin</li>
                        <li>Fiyat bilgilerini girin</li>
                        <li>"Kaydet" butonuna tıklayın</li>
                    </ol>
                    
                    <h2>Stok Kartı Düzenleme</h2>
                    <p>Mevcut bir stok kartını düzenlemek için stok listesinden ilgili kartı bulun ve üzerine tıklayın. Açılan ekranda bilgileri güncelleyebilirsiniz.</p>
                `
            },
            {
                moduleId: 'stok',
                pageId: 'stok-karti-listesi',
                content: `
                    <h1>Stok Kartı Listesi</h1>
                    <p>Stok kartı listesi, sistemdeki tüm ürünlerin listelendiği ekrandır. Bu ekranda ürünleri filtreleyebilir, sıralayabilir ve yönetebilirsiniz.</p>
                    
                    <h2>Filtreleme</h2>
                    <p>Stok kartlarını filtrelemek için üst kısımdaki filtreleme alanlarını kullanabilirsiniz. Stok kodu, adı, grubu gibi kriterlere göre filtreleme yapabilirsiniz.</p>
                    
                    <h2>Sıralama</h2>
                    <p>Stok kartlarını sıralamak için sütun başlıklarına tıklayabilirsiniz. Tekrar tıklayarak sıralama yönünü değiştirebilirsiniz.</p>
                    
                    <h2>Toplu İşlemler</h2>
                    <p>Birden fazla stok kartı seçerek toplu işlemler yapabilirsiniz. Bunun için sol taraftaki kutucukları işaretleyin ve üst menüden yapmak istediğiniz işlemi seçin.</p>
                `
            },
            // Müşteri & Satıcı Modülü
            {
                moduleId: 'musteri-satici',
                pageId: 'musteri-ekleme',
                content: `
                    <h1>Müşteri Ekleme</h1>
                    <p>Müşteri ekleme ekranında yeni müşteri kaydı oluşturabilirsiniz. Müşteri adı, vergi numarası, adres ve iletişim bilgilerini girebilirsiniz.</p>
                    
                    <h2>Müşteri Bilgileri</h2>
                    <p>Müşteri kaydı oluştururken aşağıdaki bilgileri girmeniz gerekir:</p>
                    <ul>
                        <li>Müşteri adı/ünvanı</li>
                        <li>Vergi dairesi ve numarası</li>
                        <li>İletişim bilgileri</li>
                        <li>Adres bilgileri</li>
                    </ul>
                    
                    <h2>Müşteri Kategorileri</h2>
                    <p>Müşterilerinizi kategorilere ayırarak daha kolay yönetebilirsiniz. Kategori seçimi için "Kategori" alanını kullanın.</p>
                `
            },
            // Bayi Modülü
            {
                moduleId: 'bayi',
                pageId: 'bayi-ekrani',
                content: `
                    <h1>Bayi Ekranı</h1>
                    <p>Bayi ekranı, bayilerinizin eriştiği ekrandır. Bayiler bu ekrandan ürünleri görüntüleyebilir, sipariş verebilir ve hesaplarını takip edebilir.</p>
                    
                    <h2>Bayi Ekranı Özellikleri</h2>
                    <ul>
                        <li>Aaro logosuna tıklandığında anasayfaya erişim sağlar.</li>
                        <li>Kategoriler kısmından ürün kategorilerine göre filtreleme sağlayarak ürünleri daha kolay bulabilirsiniz.</li>
                        <li>Arama butonu: Ürüne ait tüm özellikleri arayabilirsiniz.</li>
                        <li>Bayisi olduğunuz firmanın iletişim bilgilerini görüntüleyebilirsiniz.</li>
                        <li>Siparişlerim: Siparişlerinizi burada görüntüleyerek, sipariş durumunu, tutarları, tedarik durumunun takibini sağlayabilirsiniz.</li>
                    </ul>
                `
            },
            {
                moduleId: 'bayi',
                pageId: 'siparis-listesi',
                content: `
                    <h1>Bayi Sipariş Listesi</h1>
                    <p>Sipariş listesi, bayilerinizin vermiş olduğu siparişlerin detaylarını içerir. Siparişin tarihini, tutarını ve sipariş durumunu (alınan sipariş, verilen teklif) görmenizi sağlar.</p>
                    
                    <h2>Sipariş Durumları</h2>
                    <p>Siparişler aşağıdaki durumlarda olabilir:</p>
                    <ul>
                        <li>Bekleyen Siparişler: Henüz onaylanmamış veya işleme alınmamış siparişler</li>
                        <li>Onaylanan Siparişler: Onaylanmış ve işleme alınmış siparişler</li>
                        <li>İptal Edilen Siparişler: Çeşitli nedenlerle iptal edilmiş siparişler</li>
                    </ul>
                    
                    <h2>Sipariş İşlemleri</h2>
                    <p>Siparişler üzerinde aşağıdaki işlemleri yapabilirsiniz:</p>
                    <ul>
                        <li>Sipariş Onaylama: Bekleyen siparişleri onaylayabilirsiniz.</li>
                        <li>Sipariş İptal Etme: Siparişleri iptal edebilirsiniz.</li>
                    </ul>
                `
            },
            {
                moduleId: 'bayi',
                pageId: 'bayi-kullanici-listesi',
                content: `
                    <h1>Bayi Kullanıcı Listesi</h1>
                    <p>Bayi kullanıcı listesi, işletmenizin bayi ağındaki tüm kullanıcıların kayıtlı bilgilerini içeren bir veritabanıdır. Bu liste, her bayinin erişim yetkileri, iletişim bilgileri ve sistemdeki rolü gibi bilgileri içerir.</p>
                    
                    <h2>Kullanıcı Yetkileri</h2>
                    <p>Bayi kullanıcılarının yapabileceği işlemleri yetki seviyelerine göre sınırlandırabilirsiniz. Yetki seviyeleri şunları içerir:</p>
                    <ul>
                        <li>Bakiye Görüntüleme: Kullanıcının cari hesap bakiyesini görüntüleyebilmesini sağlar.</li>
                        <li>Sipariş Oluşturma: Kullanıcının sipariş oluşturabilmesini sağlar.</li>
                        <li>Fatura Görüntüleme: Kullanıcının faturaları görüntüleyebilmesini sağlar.</li>
                        <li>Ödeme Yapma: Kullanıcının ödeme yapabilmesini sağlar.</li>
                        <li>Raporları Görüntüleme: Kullanıcının raporları görüntüleyebilmesini sağlar.</li>
                    </ul>
                `
            },
            // Kasa Modülü
            {
                moduleId: 'kasa',
                pageId: 'kasa-karti',
                content: `
                    <h1>Kasa Kartı</h1>
                    <p>Kasa kartı, işletmenizin nakit akışını takip etmek için kullanılan bir araçtır. Kasa giriş ve çıkışlarını bu ekrandan yönetebilirsiniz.</p>
                    
                    <h2>Kasa Bilgileri</h2>
                    <p>Kasa kartında aşağıdaki bilgiler yer alır:</p>
                    <ul>
                        <li>Kasa Kodu ve Adı</li>
                        <li>Kasa Tipi (Ana Kasa, Alt Kasa)</li>
                        <li>Kasa Sorumlusu</li>
                        <li>Açılış Bakiyesi</li>
                        <li>Güncel Bakiye</li>
                    </ul>
                `
            }
        ];
        
        // İçerik veritabanında arama yap
        contentDatabase.forEach(item => {
            // HTML etiketlerini kaldırarak düz metin elde et
            const plainText = item.content.replace(/<[^>]*>/g, ' ').toLowerCase();
            
            // Arama terimini içerikte ara
            if (plainText.includes(searchTerm)) {
                // İlgili modül ve sayfayı bul
                const module = staticModules.find(m => m.id === item.moduleId);
                const page = module ? module.pages.find(p => p.id === item.pageId) : null;
                
                if (module && page) {
                    // Arama teriminin geçtiği bölümü bul (snippet oluştur)
                    const termIndex = plainText.indexOf(searchTerm);
                    const startIndex = Math.max(0, termIndex - 50);
                    const endIndex = Math.min(plainText.length, termIndex + searchTerm.length + 50);
                    let snippet = plainText.substring(startIndex, endIndex);
                    
                    // Snippet'in başında veya sonunda kelime bölünmesini önle
                    if (startIndex > 0) {
                        snippet = '...' + snippet.substring(snippet.indexOf(' ') + 1);
                    }
                    if (endIndex < plainText.length) {
                        snippet = snippet.substring(0, snippet.lastIndexOf(' ')) + '...';
                    }
                    
                    // Sonuçlara ekle
                    searchResults.push({
                        type: 'content',
                        title: page.title,
                        icon: page.icon || 'bi-file-text',
                        path: `?module=${module.id}&page=${page.id}`,
                        snippet: snippet,
                        highlight: highlightText(snippet, searchTerm),
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
