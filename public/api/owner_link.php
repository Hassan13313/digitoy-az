<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — «Müştəri paneli» linki (Phase 50, yalnız admin)

   GET  /api/owner_link.php?slug=<slug>            → { ok, url }
        Açar yoxdursa yaradılır; varsa EYNİ link qaytarılır (admin linki
        istənilən qədər kopyalaya bilsin, müştərinin linki dəyişməsin).
   POST /api/owner_link.php {slug, action:'rotate'} → { ok, url }
        Yeni açar — köhnə link dərhal işləməz.

   Açar URL-in FRAGMENT hissəsindədir (#k=…): brauzer onu serverə,
   Referer başlığına və WhatsApp önbaxış botuna göndərmir.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/owner_auth.php';

requireAdmin();
header('Cache-Control: no-store');

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET' && $method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'GET or POST required']);
    exit;
}

$body = $method === 'POST' ? json_decode((string) file_get_contents('php://input'), true) : null;
$slug = $method === 'POST' ? ($body['slug'] ?? '') : ($_GET['slug'] ?? '');
$slug = is_string($slug) ? trim($slug) : '';

if (!isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

ensureTables();
$db = getDB();

if ($method === 'POST') {
    if (($body['action'] ?? '') !== 'rotate') {
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action']);
        exit;
    }
    $key = rotateOwnerKey($db, $slug);
    if ($key !== null) adminAuditLog('owner_link_rotate', $slug);
} else {
    $key = ownerKeyFor($db, $slug, $created);
    if ($created) adminAuditLog('owner_link_create', $slug);
}

if ($key === null) {
    http_response_code(404);
    echo json_encode(['error' => 'INVITATION_NOT_FOUND']);
    exit;
}

$baseUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];

echo json_encode([
    'ok'  => true,
    'url' => $baseUrl . '/invite/' . $slug . '/panel#k=' . $key,
]);
