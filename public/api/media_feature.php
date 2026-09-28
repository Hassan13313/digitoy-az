<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — SEÇİLMİŞ MEDİA (Phase 43)

   POST /api/media_feature.php
   body: { slug, id, featured: true|false }
   → { ok, id, featured, featuredCount }

   Cütlük (və ya admin) bir foto/videonu «seçilmiş» işarələyir — qalereyada
   `sort=featured` rejimində birinci sıraya çıxır.

   ⚠ İCAZƏ `delete_photo.php` ilə EYNİ: admin tokeni VƏ YA məhz bu slug
     üçün qalereya tokeni. Qonaq başqasının qalereyasını sıralaya bilmir.
   ⚠ MÖVCUD SIRALAMA QALIR: `sort` parametri verilməyəndə qalereya hələ də
     yenidən köhnəyə sıralanır (bax get_photos.php). Seçilmiş media yalnız
     `sort=featured` rejimini dəyişir.
   ⚠ Cədvəl silinsə bütün işarələr yox olur, qalereya isə işləyir.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/gallery_auth.php';
require_once __DIR__ . '/gallery_media.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$slug     = trim($body['slug'] ?? '');
$rawId    = trim($body['id']   ?? '');
$featured = ($body['featured'] ?? false) === true;

if (!$slug || !isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* İcazə slug MƏLUM olduqdan SONRA — token həmin slug-a bağlıdır */
requireGalleryAccess($slug);

if (!isSafeMediaName($rawId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid media id required']);
    exit;
}

/* Olmayan fayl işarələnməməlidir — orfan sətirlər sıralamanı korlayır */
if (!is_file(galleryUploadDir($slug) . $rawId)) {
    http_response_code(404);
    echo json_encode(['error' => 'MEDIA_NOT_FOUND']);
    exit;
}

ensureTables();

try {
    $db = getDB();
    $st = $db->prepare(
        'INSERT INTO media_flags (slug, filename, featured, featured_at)
         VALUES (:s, :f, :fl, :at)
         ON DUPLICATE KEY UPDATE featured = VALUES(featured), featured_at = VALUES(featured_at)'
    );
    $st->execute([
        ':s'  => $slug,
        ':f'  => $rawId,
        ':fl' => $featured ? 1 : 0,
        ':at' => $featured ? gmdate('Y-m-d H:i:s') : null,
    ]);

    /* Seçilmişlərin ümumi sayı — UI «3 seçilmiş» yazısını dərhal yeniləyir */
    $cs = $db->prepare('SELECT COUNT(*) FROM media_flags WHERE slug = :s AND featured = 1');
    $cs->execute([':s' => $slug]);
    $count = (int) $cs->fetchColumn();
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error'   => 'FEATURE_FAILED',
        'message' => 'İşarə saxlanıla bilmədi. Bir az sonra yenidən cəhd edin.',
    ]);
    exit;
}

adminAuditLog($featured ? 'media_feature' : 'media_unfeature', $slug, $rawId);

echo json_encode([
    'ok'            => true,
    'id'            => $rawId,
    'featured'      => $featured,
    'featuredCount' => $count,
]);
