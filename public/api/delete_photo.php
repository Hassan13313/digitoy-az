<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Media silmə

   2026-08-31 düzəlişi:
   • Əvvəl requireAdmin() tələb olunurdu → cütlük öz qalereyasından
     heç nə silə bilmirdi (401) və frontend xətanı udduğu üçün UI
     "silindi" göstərirdi, refresh-də media geri qayıdırdı.
     İndi requireGalleryAccess($slug): admin tokeni VƏ YA məhz bu slug
     üçün qalereya tokeni. Başqa toyun tokeni işləmir.
   • Silmə İDEMPOTENTdir: onsuz da yoxdursa 200 {already:true} —
     ikiqat klik / paralel silmə "uğursuz" görünmür.
   • Törəmə fayllar da silinir (_thumb.jpg, _poster.jpg) — əks halda
     orfan thumbnail-lar diskdə toplanırdı.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/gallery_auth.php';
require_once __DIR__ . '/media_policy.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body   = json_decode(file_get_contents('php://input'), true);
$slug   = trim($body['slug'] ?? '');
$rawId  = trim($body['id'] ?? '');

if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* İcazə slug MƏLUM olduqdan SONRA yoxlanılır — token həmin slug-a bağlıdır */
requireGalleryAccess($slug);

/* ── Fayl adı ──
   Path ayırıcısı və ya '..' olan id AÇIQ şəkildə rədd edilir. basename()
   ilə sükutla kəsmək də təhlükəsiz olardı, amma hücum cəhdi "uğurlu"
   (200 already:true) görünərdi — pis operativ siqnal. İndi 400 + logda iz. */
if ($rawId === '' || strpbrk($rawId, "/\\") !== false || strpos($rawId, '..') !== false) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid filename required']);
    mediaLog('delete_failed', ['slug' => $slug, 'reason' => 'illegal_id']);
    exit;
}

$filename = basename($rawId);

if (!$filename || $filename === '.' || !preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid filename required']);
    exit;
}

mediaLog('delete_started', ['slug' => $slug, 'file' => $filename]);

$uploadDir = __DIR__ . '/../uploads/' . $slug . '/';
$filePath  = $uploadDir . $filename;

/* Simvolik link / qovluqdan kənara çıxma müdafiəsi */
$realDir = realpath($uploadDir);
if ($realDir === false) {
    http_response_code(404);
    echo json_encode(['error' => 'Gallery not found']);
    mediaLog('delete_failed', ['slug' => $slug, 'reason' => 'gallery_missing']);
    exit;
}

$base       = pathinfo($filename, PATHINFO_FILENAME);
$derivatives = [$base . '_thumb.jpg', $base . '_poster.jpg'];

$existed = file_exists($filePath);

if ($existed) {
    $realFile = realpath($filePath);
    if ($realFile === false || strpos($realFile, $realDir . DIRECTORY_SEPARATOR) !== 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid path']);
        mediaLog('delete_failed', ['slug' => $slug, 'reason' => 'path_escape']);
        exit;
    }

    if (!@unlink($filePath)) {
        http_response_code(500);
        echo json_encode([
            'error'   => 'DELETE_FAILED',
            'message' => 'Fayl silinə bilmədi. Zəhmət olmasa bir az sonra yenidən cəhd edin.',
        ]);
        mediaLog('delete_failed', ['slug' => $slug, 'reason' => 'unlink_failed']);
        exit;
    }
}

/* Törəmə faylları da təmizlə — mövcud deyilsə səssizcə keçir */
$removedDerivatives = 0;
foreach ($derivatives as $d) {
    if (preg_match('/^[a-zA-Z0-9_\-\.]+$/', $d) && is_file($uploadDir . $d)) {
        if (@unlink($uploadDir . $d)) $removedDerivatives++;
    }
}

/* Qalereya manifestinin ETag-i qovluq mtime-inə bağlıdır — silmə onu
   dəyişir, yəni bütün açıq tablar növbəti sorğuda yeni siyahı alır. */
@touch($uploadDir);

mediaLog('delete_completed', [
    'slug'         => $slug,
    'file'         => $filename,
    'already_gone' => !$existed,
    'derivatives'  => $removedDerivatives,
    'duration_ms'  => elapsedMs(),
]);

echo json_encode([
    'ok'      => true,
    'deleted' => $filename,
    'already' => !$existed,   /* idempotent: onsuz da yox idisə də uğur */
]);
