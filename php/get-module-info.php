<?php
/**
 * Belirli bir modül ve sayfa için bilgileri döndürür
 */

// CORS başlıkları (gerekirse)
header('Content-Type: application/json');

// Parametreleri al
$moduleId = $_GET['module'] ?? '';
$pageId = $_GET['page'] ?? '';

// Parametreler boş mu kontrol et
if (empty($moduleId) || empty($pageId)) {
    echo json_encode(['error' => 'Modül veya sayfa parametresi eksik']);
    exit;
}

// Dosya yolu
$filePath = "../moduller/$moduleId/$pageId.html";

// Dosya var mı kontrol et
if (!file_exists($filePath)) {
    echo json_encode(['error' => 'Dosya bulunamadı']);
    exit;
}

// Dosya içeriğini oku
$content = file_get_contents($filePath);

// Meta bilgilerini çıkar
$metaData = extractMetaData($content);

// Modül bilgilerini al
$moduleInfo = getModuleInfo($moduleId);

// Sonuç
$result = [
    'title' => $metaData['title'] ?? ucwords(str_replace('-', ' ', $pageId)),
    'moduleName' => $moduleInfo['name'] ?? ucwords(str_replace('-', ' ', $moduleId)),
    'icon' => $metaData['icon'] ?? $moduleInfo['icon'] ?? 'bi-file-text',
    'url' => $metaData['url'] ?? "/$moduleId/$pageId",
    'lastUpdate' => $metaData['lastUpdate'] ?? date('d.m.Y')
];

// Sonucu JSON olarak döndür
echo json_encode($result);

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
    preg_match('/<meta\s+name="url"\s+content="([^"]+)"/i', $content, $urlMatches);
    preg_match('/<meta\s+name="lastUpdate"\s+content="([^"]+)"/i', $content, $updateMatches);
    
    if (!empty($titleMatches[1])) {
        $metaData['title'] = $titleMatches[1];
    }
    
    if (!empty($iconMatches[1])) {
        $metaData['icon'] = $iconMatches[1];
    }
    
    if (!empty($urlMatches[1])) {
        $metaData['url'] = $urlMatches[1];
    }
    
    if (!empty($updateMatches[1])) {
        $metaData['lastUpdate'] = $updateMatches[1];
    }
    
    return $metaData;
}

/**
 * Modül bilgilerini alır
 * 
 * @param string $moduleId Modül ID'si
 * @return array Modül bilgileri
 */
function getModuleInfo($moduleId) {
    $infoFile = "../moduller/$moduleId/module-info.json";
    
    if (file_exists($infoFile)) {
        $info = json_decode(file_get_contents($infoFile), true);
        return $info ?? [];
    }
    
    return [];
}
