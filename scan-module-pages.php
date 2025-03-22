<?php
/**
 * Belirtilen modül dizinindeki tüm HTML sayfalarını tarar ve JSON formatında döndürür
 */

// CORS başlıklarını ayarla
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Modül parametresini al
$module = isset($_GET['module']) ? $_GET['module'] : '';

// Modül parametresi boşsa hata döndür
if (empty($module)) {
    echo json_encode(['error' => 'Modül parametresi gereklidir.']);
    exit;
}

// Modül dizini
$moduleDir = 'moduller/' . $module;

// Dizin var mı kontrol et
if (!is_dir($moduleDir)) {
    echo json_encode([]);
    exit;
}

// HTML dosyalarını bul
$pages = [];
$files = scandir($moduleDir);

foreach ($files as $file) {
    // Nokta ile başlayan dosyaları atla
    if ($file[0] === '.') {
        continue;
    }
    
    // Sadece HTML dosyalarını al
    if (is_file($moduleDir . '/' . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'html') {
        $pages[] = $file;
    }
}

// Sayfaları JSON olarak döndür
echo json_encode($pages);
