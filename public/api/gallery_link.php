<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Cütlük üçün qalereya idarəetmə linki

   GET /api/gallery_link.php?slug=<slug>   (admin tələb olunur)
   → { ok, url, token, exp }

   Bu link cütlüyə verilir. İçindəki token MƏHZ həmin toyun slug-una
   imzalanıb — başqa toyun mediasına toxuna bilmir. Qonaqlarda bu link
   olmadığı üçün onlar silmə əməliyyatı apara bilmirlər (qalereya
   idarəetmə səhifəsində silmə düymələri ümumiyyətlə görünmür).

   QR kodlar POZULMUR: qonaqların QR-i /foto səhifəsinə gedir və heç bir
   token tələb etmir — yalnız idarəetmə linki dəyişib.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/gallery_auth.php';

requireAdmin();

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

$minted  = mintGalleryToken($slug);
$baseUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];

echo json_encode([
    'ok'    => true,
    'slug'  => $slug,
    'url'   => $baseUrl . '/invite/' . $slug . '/qalereya-idare?k=' . $minted['token'],
    'token' => $minted['token'],
    'exp'   => $minted['exp'],
]);
