<?php
/**
 * Dokümantasyon içinde arama yapar
 */

// CORS başlıkları (gerekirse)
header('Content-Type: application/json');

// Arama terimini al
$searchTerm = $_GET['q'] ?? '';

// Arama terimi boş mu kontrol et
if (empty($searchTerm)) {
    echo json_encode(['error' => 'Arama terimi eksik']);
    exit;
}

// Modüller dizini
$modulesDir = 'moduller';

// Sonuç dizisi
$results = [];

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
    
    // HTML dosyalarını tara
    $htmlFiles = glob($moduleFolder . '/*.html');
    
    foreach ($htmlFiles as $htmlFile) {
        $pageId = basename($htmlFile, '.html');
        $content = file_get_contents($htmlFile);
        
        // Meta bilgilerini çıkar
        $metaData = extractMetaData($content);
        
        // İçeriği temizle (HTML etiketlerini kaldır)
        $cleanContent = strip_tags($content);
        
        // Arama terimini içeriyor mu kontrol et
        if (stripos($cleanContent, $searchTerm) !== false || 
            stripos($metaData['title'] ?? '', $searchTerm) !== false) {
            
            // Eşleşen içeriği bul ve vurgula
            $excerpt = getExcerpt($cleanContent, $searchTerm);
            
            // Sonuca ekle
            $results[] = [
                'moduleId' => $moduleName,
                'moduleName' => $moduleInfo['name'] ?? ucwords(str_replace('-', ' ', $moduleName)),
                'pageId' => $pageId,
                'title' => $metaData['title'] ?? ucwords(str_replace('-', ' ', $pageId)),
                'icon' => $metaData['icon'] ?? $moduleInfo['icon'] ?? 'bi-file-text',
                'excerpt' => $excerpt,
                'url' => "?module=$moduleName&page=$pageId"
            ];
        }
    }
}

// Sonucu JSON olarak döndür
echo json_encode([
    'query' => $searchTerm,
    'count' => count($results),
    'results' => $results
]);

/**
 * HTML içeriğinden meta bilgilerini çıkarır
 * 
 * @param string $content HTML içeriği
 * @return array Meta bilgileri
 */
function extractMetaData($content) {
    $metaData = [];
    
    // Meta etiketlerini ara
    preg_match('/<meta\s+name="title"\s+content="([^"]+)"/i', $content, $titleMatches);
    preg_match('/<meta\s+name="icon"\s+content="([^"]+)"/i', $content, $iconMatches);
    
    if (!empty($titleMatches[1])) {
        $metaData['title'] = $titleMatches[1];
    }
    
    if (!empty($iconMatches[1])) {
        $metaData['icon'] = $iconMatches[1];
    }
    
    return $metaData;
}

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
 * Arama terimine göre içerikten bir alıntı oluşturur
 * 
 * @param string $content İçerik
 * @param string $searchTerm Arama terimi
 * @return string Alıntı
 */
function getExcerpt($content, $searchTerm) {
    // Arama teriminin pozisyonunu bul
    $pos = stripos($content, $searchTerm);
    
    if ($pos === false) {
        // Eğer bulunamazsa, içeriğin ilk 150 karakterini döndür
        return substr($content, 0, 150) . '...';
    }
    
    // Alıntı başlangıç pozisyonu
    $start = max(0, $pos - 75);
    
    // Alıntı uzunluğu
    $length = strlen($searchTerm) + 150;
    
    // Alıntıyı oluştur
    $excerpt = substr($content, $start, $length);
    
    // Başlangıç ve bitiş noktalarını düzenle
    if ($start > 0) {
        $excerpt = '...' . $excerpt;
    }
    
    if ($start + $length < strlen($content)) {
        $excerpt .= '...';
    }
    
    // Arama terimini vurgula
    $excerpt = preg_replace('/(' . preg_quote($searchTerm, '/') . ')/i', '<strong>$1</strong>', $excerpt);
    
    return $excerpt;
}
