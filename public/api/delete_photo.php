<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$slug = trim($body['slug'] ?? '');
$id   = (int) ($body['id'] ?? 0);

if (!$slug || !$id) {
    http_response_code(400);
    echo json_encode(['error' => 'slug and id required']);
    exit;
}

$db   = getDB();
$stmt = $db->prepare("SELECT filename FROM photos WHERE id = :id AND slug = :slug LIMIT 1");
$stmt->execute([':id' => $id, ':slug' => $slug]);
$row  = $stmt->fetch();

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Photo not found']);
    exit;
}

/* Faylı diskdən sil */
$filePath = __DIR__ . '/../uploads/' . $slug . '/' . $row['filename'];
if (file_exists($filePath)) {
    unlink($filePath);
}

/* DB-dən sil */
$stmt = $db->prepare("DELETE FROM photos WHERE id = :id AND slug = :slug");
$stmt->execute([':id' => $id, ':slug' => $slug]);

echo json_encode(['ok' => true]);
