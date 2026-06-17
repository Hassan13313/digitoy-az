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
$stmt = $db->prepare("SELECT form_data FROM invitations WHERE slug = :slug LIMIT 1");
$stmt->execute([':slug' => $slug]);
$row  = $stmt->fetch();

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

$data = json_decode($row['form_data'], true);
echo json_encode(['ok' => true, 'slug' => $slug, 'data' => $data]);
