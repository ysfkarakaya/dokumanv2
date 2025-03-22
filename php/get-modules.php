<?php
/**
 * Modüller dizinindeki tüm modülleri tarar ve JSON formatında döndürür
 */

// CORS başlıkları (gerekirse)
header('Content-Type: application/json');

// Modüller dizini
$modulesDir = '../moduller';

// Sonuç dizisi
$modules = [];

// Modüller dizini var mı kontrol et
if (!is_dir($modulesDir)) {
    echo json_encode(['error' => 'Modüller dizini bulunamadı']);
    exit;
}

// Modüller dizinindeki tüm klasörleri tara
$moduleFolders = array_filter(glob($modulesDir . '/*'), 'is_dir');

foreach ($moduleFolders as $moduleFolder) {
    $moduleName = basename($moduleFolder);
    
    // Modül bilgilerini al
    $moduleInfo = getModuleInfo($moduleFolder);
    
    // Modül sayfalarını al
    $pages = getModulePages($moduleFolder);
    
    // Modül bilgilerini diziye ekle
    $modules[] = [
        'id' => $moduleName,
        'name' => $moduleInfo['name'] ?? ucwords(str_replace('-', ' ', $moduleName)),
        'icon' => $moduleInfo['icon'] ?? 'bi-folder',
        'pages' => $pages
    ];
}

// Sonucu JSON olarak döndür
echo json_encode($modules);

/**
 * Modül bilgilerini alır
 * 
 * @param string $moduleFolder Modül klasörü yolu
 * @return array Modül bilgileri
 */
function getModuleInfo($moduleFolder) {
    $infoFile = $moduleFolder . '/module-info.json';
    
    if (file_exists($infoFile)) {
        $info = json_decode(file_get_contents($infoFile), true);
        return $info ?? [];
    }
    
    return [];
}

/**
 * Modül sayfalarını alır
 * 
 * @param string $moduleFolder Modül klasörü yolu
 * @return array Sayfa listesi
 */
function getModulePages($moduleFolder) {
    $pages = [];
    
    // HTML dosyalarını tara
    $htmlFiles = glob($moduleFolder . '/*.html');
    
    foreach ($htmlFiles as $htmlFile) {
        $pageId = basename($htmlFile, '.html');
        $pageTitle = getPageTitle($htmlFile);
        
        $pages[] = [
            'id' => $pageId,
            'title' => $pageTitle
        ];
    }
    
    return $pages;
}

/**
 * HTML dosyasından sayfa başlığını alır
 * 
 * @param string $htmlFile HTML dosya yolu
 * @return string Sayfa başlığı
 */
function getPageTitle($htmlFile) {
    // Dosya içeriğini oku
    $content = file_get_contents($htmlFile);
    
    // Başlık meta etiketini ara
    preg_match('/<meta\s+name="title"\s+content="([^"]+)"/i', $content, $matches);
    
    if (!empty($matches[1])) {
        return $matches[1];
    }
    
    // Başlık bulunamadıysa, dosya adını kullan
    $pageId = basename($htmlFile, '.html');
    return ucwords(str_replace('-', ' ', $pageId));
}
