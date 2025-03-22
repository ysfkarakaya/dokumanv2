/**
 * Aaro ERP Dokümantasyon Sistemi - Statik Modül Verileri
 * 
 * Bu dosya, PHP kullanmadan modül ve sayfa verilerini statik olarak tanımlar.
 */

// Tüm modüllerin statik tanımı
const staticModules = [
    {
        id: "musteri-satici",
        name: "Müşteri & Satıcı",
        icon: "bi-people",
        description: "Müşteri ve satıcı yönetimi ile ilgili dokümantasyon",
        version: "1.0.0",
        order: 1,
        pages: [
            { 
                id: "genel-bakis", 
                title: "Genel Bakış",
                icon: "bi-info-circle",
                url: "/musteri-satici/genel-bakis",
                lastUpdate: "10.03.2025"
            },
            { 
                id: "musteri-ekleme", 
                title: "Müşteri Ekleme",
                icon: "bi-person-plus",
                url: "/musteri-satici/musteri-ekleme",
                lastUpdate: "10.03.2025"
            },
            { 
                id: "satici-ekleme", 
                title: "Satıcı Ekleme",
                icon: "bi-person-plus-fill",
                url: "/musteri-satici/satici-ekleme",
                lastUpdate: "10.03.2025"
            },
            { 
                id: "cari-hareketleri", 
                title: "Cari Hareketleri",
                icon: "bi-arrow-left-right",
                url: "/musteri-satici/cari-hareketleri",
                lastUpdate: "10.03.2025"
            },
            { 
                id: "risk-limitleri", 
                title: "Risk Limitleri",
                icon: "bi-exclamation-triangle",
                url: "/musteri-satici/risk-limitleri",
                lastUpdate: "10.03.2025"
            }
        ]
    },
    {
        id: "stok",
        name: "Stok Yönetimi",
        icon: "bi-box-seam",
        description: "Stok yönetimi ile ilgili dokümantasyon",
        version: "1.0.0",
        order: 2,
        pages: [
            { 
                id: "genel-bakis", 
                title: "Genel Bakış",
                icon: "bi-info-circle",
                url: "/stok/genel-bakis",
                lastUpdate: "12.03.2025"
            },
            { 
                id: "stok-karti", 
                title: "Stok Kartı",
                icon: "bi-box",
                url: "/stok/stok-karti",
                lastUpdate: "12.03.2025"
            },
            { 
                id: "stok-karti-listesi", 
                title: "Stok Kartı Listesi",
                icon: "bi-list-ul",
                url: "/stok/stok-karti-listesi",
                lastUpdate: "12.03.2025"
            },
            { 
                id: "stok-hareketleri", 
                title: "Stok Hareketleri",
                icon: "bi-arrow-left-right",
                url: "/stok/stok-hareketleri",
                lastUpdate: "12.03.2025"
            }
        ]
    },
    {
        id: "satis-pazarlama",
        name: "Satış & Pazarlama",
        icon: "bi-cart",
        description: "Satış ve pazarlama yönetimi ile ilgili dokümantasyon",
        version: "1.0.0",
        order: 3,
        pages: [
            { 
                id: "genel-bakis", 
                title: "Genel Bakış",
                icon: "bi-info-circle",
                url: "/satis-pazarlama/genel-bakis",
                lastUpdate: "15.03.2025"
            },
            { 
                id: "siparis-listesi", 
                title: "Sipariş Listesi",
                icon: "bi-list-check",
                url: "/satis-pazarlama/siparis-listesi",
                lastUpdate: "15.03.2025"
            },
            { 
                id: "fatura-listesi", 
                title: "Fatura Listesi",
                icon: "bi-receipt",
                url: "/satis-pazarlama/fatura-listesi",
                lastUpdate: "15.03.2025"
            },
            { 
                id: "sozlesme-listesi", 
                title: "Sözleşme Listesi",
                icon: "bi-file-earmark-text",
                url: "/satis-pazarlama/sozlesme-listesi",
                lastUpdate: "15.03.2025"
            },
            { 
                id: "fiyat-listesi", 
                title: "Fiyat Listesi",
                icon: "bi-tag",
                url: "/satis-pazarlama/fiyat-listesi",
                lastUpdate: "15.03.2025"
            },
            { 
                id: "satis-pazarlama-asamalari", 
                title: "Satış Aşamaları",
                icon: "bi-diagram-3",
                url: "/satis-pazarlama/satis-pazarlama-asamalari",
                lastUpdate: "15.03.2025"
            }
        ]
    },
    {
        id: "cek-senet",
        name: "Çek & Senet",
        icon: "bi-cash-coin",
        description: "Çek ve senet yönetimi ile ilgili dokümantasyon",
        version: "1.0.0",
        order: 4,
        pages: [
            { 
                id: "genel-bakis", 
                title: "Genel Bakış",
                icon: "bi-info-circle",
                url: "/cek-senet/genel-bakis",
                lastUpdate: "18.03.2025"
            },
            { 
                id: "cek-senet-karti-listesi", 
                title: "Çek/Senet Kartı Listesi",
                icon: "bi-list-ul",
                url: "/cek-senet/cek-senet-karti-listesi",
                lastUpdate: "18.03.2025"
            },
            { 
                id: "cek-senet-hareket-listesi", 
                title: "Çek/Senet Hareket Listesi",
                icon: "bi-arrow-left-right",
                url: "/cek-senet/cek-senet-hareket-listesi",
                lastUpdate: "18.03.2025"
            },
            { 
                id: "hareket-olustur", 
                title: "Hareket Oluştur",
                icon: "bi-plus-circle",
                url: "/cek-senet/hareket-olustur",
                lastUpdate: "18.03.2025"
            }
        ]
    },
    {
        id: "sss",
        name: "Sık Sorulan Sorular",
        icon: "bi-question-circle",
        description: "Sık sorulan sorular ve cevapları",
        version: "1.0.0",
        order: 5,
        pages: [
            { 
                id: "genel-bakis", 
                title: "Genel SSS",
                icon: "bi-info-circle",
                url: "/sss/genel-bakis",
                lastUpdate: "20.03.2025"
            }
        ]
    }
];

// Varsayılan içerikler
const defaultContents = {
    "musteri-satici-genel": `
        <h1>Müşteri & Satıcı Modülü</h1>
        <p>Aaro ERP'nin Müşteri & Satıcı modülü, işletmenizin müşteri ve tedarikçi ilişkilerini yönetmek için tasarlanmış kapsamlı bir araçtır.</p>
        <div class="alert alert-info">
            <i class="bi bi-info-circle"></i>
            <strong>Bilgi:</strong> Müşteri & Satıcı modülü, Aaro ERP'nin temel modüllerinden biridir ve diğer modüllerle entegre çalışır.
        </div>
        <h2>Modül Özellikleri</h2>
        <ul>
            <li>Müşteri ve satıcı kayıtlarının yönetimi</li>
            <li>Cari hesap takibi</li>
            <li>Müşteri ve satıcı kategorileri</li>
            <li>Detaylı raporlama</li>
        </ul>
    `,
    "musteri-ekleme": `
        <h1>Müşteri Ekleme</h1>
        <p>Bu bölümde yeni müşteri kaydı oluşturma işlemi anlatılmaktadır.</p>
        <div class="alert alert-primary">
            <i class="bi bi-lightbulb"></i>
            <strong>İpucu:</strong> Müşteri bilgilerini eksiksiz ve doğru bir şekilde girmek, satış ve muhasebe süreçlerinizin daha verimli çalışmasını sağlar.
        </div>
        <h2>Müşteri Bilgileri</h2>
        <p>Müşteri kaydı oluştururken aşağıdaki bilgileri girmeniz gerekir:</p>
        <ul>
            <li>Müşteri adı/ünvanı</li>
            <li>Vergi dairesi ve numarası</li>
            <li>İletişim bilgileri</li>
            <li>Adres bilgileri</li>
        </ul>
    `,
    "satici-ekleme": `
        <h1>Satıcı Ekleme</h1>
        <p>Bu bölümde yeni satıcı kaydı oluşturma işlemi anlatılmaktadır.</p>
        <div class="alert alert-primary">
            <i class="bi bi-lightbulb"></i>
            <strong>İpucu:</strong> Satıcı bilgilerini eksiksiz ve doğru bir şekilde girmek, satın alma ve muhasebe süreçlerinizin daha verimli çalışmasını sağlar.
        </div>
        <h2>Satıcı Bilgileri</h2>
        <p>Satıcı kaydı oluştururken aşağıdaki bilgileri girmeniz gerekir:</p>
        <ul>
            <li>Satıcı adı/ünvanı</li>
            <li>Vergi dairesi ve numarası</li>
            <li>İletişim bilgileri</li>
            <li>Adres bilgileri</li>
        </ul>
    `,
    "stok-genel": `
        <h1>Stok Yönetimi Modülü</h1>
        <p>Aaro ERP'nin Stok Yönetimi modülü, işletmenizin tüm stok hareketlerini ve ürün envanterini etkin bir şekilde yönetmenizi sağlayan kapsamlı bir araçtır.</p>
        <div class="alert alert-info">
            <i class="bi bi-info-circle"></i>
            <strong>Bilgi:</strong> Stok Yönetimi modülü, Aaro ERP'nin temel modüllerinden biridir ve satış, satın alma ve üretim modülleriyle entegre çalışır.
        </div>
        <h2>Modül Özellikleri</h2>
        <ul>
            <li>Stok kartları yönetimi</li>
            <li>Stok hareketleri takibi</li>
            <li>Depo yönetimi</li>
            <li>Stok raporları</li>
        </ul>
    `
};

// Modül içeriklerini yüklemek için yardımcı fonksiyon
function getModuleContent(moduleId, pageId) {
    return new Promise((resolve, reject) => {
        // Önce HTML dosyasını yüklemeyi dene
        fetch(`moduller/${moduleId}/${pageId}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('İçerik bulunamadı');
                }
                return response.text();
            })
            .then(content => {
                resolve(content);
            })
            .catch(error => {
                console.warn(`${moduleId}/${pageId}.html yüklenemedi:`, error);
                
                // Varsayılan içeriği kontrol et
                const defaultKey = `${moduleId}-${pageId}`;
                if (defaultContents[defaultKey]) {
                    resolve(defaultContents[defaultKey]);
                } else {
                    // Genel bir hata içeriği döndür
                    resolve(`
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle"></i>
                            <strong>Uyarı:</strong> İçerik bulunamadı.
                        </div>
                        <p>Lütfen sol menüden başka bir sayfa seçin.</p>
                    `);
                }
            });
    });
}

// Modül bilgilerini almak için yardımcı fonksiyon
function getModuleInfo(moduleId, pageId) {
    return new Promise((resolve, reject) => {
        // Önce statik modül verilerinde ara
        const module = staticModules.find(m => m.id === moduleId);
        if (!module) {
            reject(new Error(`Modül bulunamadı: ${moduleId}`));
            return;
        }
        
        const page = module.pages.find(p => p.id === pageId);
        if (!page) {
            reject(new Error(`Sayfa bulunamadı: ${moduleId}/${pageId}`));
            return;
        }
        
        // Modül bilgilerini oluştur
        const moduleInfo = {
            title: page.title,
            moduleName: module.name,
            icon: page.icon || module.icon,
            url: page.url || `/${moduleId}/${pageId}`,
            lastUpdate: page.lastUpdate || "01.01.2025"
        };
        
        resolve(moduleInfo);
    });
}
