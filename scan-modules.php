<?php
/**
 * Modüller dizinindeki tüm modülleri tarar ve JSON formatında döndürür
 */

// CORS başlıklarını ayarla
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Modüller dizini
$modulesDir = 'moduller';

// Dizin var mı kontrol et
if (!is_dir($modulesDir)) {
    echo json_encode([]);
    exit;
}

// Modül dizinlerini bul
$modules = [];
$dirs = scandir($modulesDir);

foreach ($dirs as $dir) {
    // Nokta ile başlayan dizinleri ve dosyaları atla
    if ($dir[0] === '.') {
        continue;
    }
    
    // Sadece dizinleri al
    if (is_dir($modulesDir . '/' . $dir)) {
        $modules[] = $dir;
    }
}

// Modülleri JSON olarak döndür
echo json_encode($modules);
