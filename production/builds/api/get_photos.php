<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$slug = trim($_GET['slug'] ?? '');

if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

$uploadDir = __DIR__ . '/../uploads/' . $slug . '/';
$baseUrl   = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];

/* ── Şərti GET (ETag / Last-Modified) ──
   Qalereya hər 30 saniyədə bir avto-yenilənmə üçün bu endpoint-i sorğulayır
   (açıq tab-ların hamısından). Əvvəlki versiya hər sorğuda scandir() +
   stat() icra edirdi — fotoların sayı artdıqca davamlı disk yükü yaradırdı.
   İndi qovluğun mtime-i ƏSASINDA yüngül bir ETag hesablanır (cəmi 1 stat
   çağırışı): client uyğun gələn If-None-Match göndərsə, tam scan-i ümumiyyətlə
   keçərək birbaşa 304 qaytarırıq. Qovluq mtime-i fayl əlavə/silinmə/adı
   dəyişmə zamanı dəyişir (POSIX davranışı) — bu sistemdə fayllar heç vaxt
   yerində redaktə olunmur (yalnız yaradılır/silinir), ona görə bu siqnal
   tam etibarlıdır. Cache-Control: no-store — brauzerin öz HTTP keşinin
   bizim əl ilə idarə olunan şərti sorğu məntiqi ilə qarışmasının qarşısını
   alır (bax: src/utils/api.js::getPhotos). */
$dirMtime = is_dir($uploadDir) ? (int) @filemtime($uploadDir) : 0;
$etag     = '"' . md5($slug . '|' . $dirMtime) . '"';
$lastMod  = gmdate('D, d M Y H:i:s', $dirMtime) . ' GMT';

header('ETag: ' . $etag);
header('Last-Modified: ' . $lastMod);
header('Cache-Control: no-store');

$ifNoneMatch = trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '');
if ($ifNoneMatch !== '' && $ifNoneMatch === $etag) {
    http_response_code(304);
    exit;
}

$photos = [];
if (is_dir($uploadDir)) {
    $imgExt   = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'];
    $videoExt = ['mp4', 'mov', 'quicktime'];

    $allFiles = scandir($uploadDir);
    $fileSet  = array_flip($allFiles);

    foreach ($allFiles as $file) {
        if ($file === '.' || $file === '..') continue;
        if (substr($file, -10) === '_thumb.jpg') continue; /* thumbnail-lar ayrıca media kimi sayılmır */

        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (!in_array($ext, array_merge($imgExt, $videoExt))) continue;

        $mime = in_array($ext, $videoExt) ? 'video/mp4' : 'image/jpeg';
        $stat = stat($uploadDir . $file);

        /* Thumbnail varsa istifadə et — yoxdursa orijinala fallback
           (videolar + bu yeniləmədən əvvəl yüklənmiş köhnə fotolar) */
        $base      = pathinfo($file, PATHINFO_FILENAME);
        $thumbFile = $base . '_thumb.jpg';
        $hasThumb  = isset($fileSet[$thumbFile]);

        $photos[] = [
            'id'         => $file,
            'url'        => $baseUrl . '/uploads/' . $slug . '/' . $file,
            'thumbUrl'   => $baseUrl . '/uploads/' . $slug . '/' . ($hasThumb ? $thumbFile : $file),
            'name'       => $file,
            'type'       => $mime,
            'size'       => $stat ? (int) $stat['size'] : 0,
            'uploadedAt' => $stat ? date('Y-m-d H:i:s', $stat['mtime']) : '',
            'source'     => 'server',
        ];
    }

    usort($photos, fn($a, $b) => strcmp($b['uploadedAt'], $a['uploadedAt']));
}

echo json_encode(['ok' => true, 'slug' => $slug, 'photos' => $photos]);
