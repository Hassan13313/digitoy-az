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

$db   = getDB();
$stmt = $db->prepare(
    "SELECT id, url, filename, mime_type, file_size, uploaded_at
     FROM photos
     WHERE slug = :slug
     ORDER BY uploaded_at DESC"
);
$stmt->execute([':slug' => $slug]);
$rows = $stmt->fetchAll();

$photos = array_map(fn($r) => [
    'id'         => (string) $r['id'],
    'url'        => $r['url'],
    'thumbUrl'   => $r['url'],
    'name'       => $r['filename'],
    'type'       => $r['mime_type'],
    'size'       => (int) $r['file_size'],
    'uploadedAt' => $r['uploaded_at'],
    'source'     => 'server',
], $rows);

echo json_encode(['ok' => true, 'slug' => $slug, 'photos' => $photos]);
