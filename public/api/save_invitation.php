<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$slug     = trim($body['slug']     ?? '');
$formData = $body['formData']      ?? null;

if (!$slug || !$formData) {
    http_response_code(400);
    echo json_encode(['error' => 'slug and formData required']);
    exit;
}

/* Slug: yalnız a-z, 0-9, tire */
if (!preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid slug']);
    exit;
}

$json = json_encode($formData, JSON_UNESCAPED_UNICODE);
if (!$json) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid formData JSON']);
    exit;
}

$db  = getDB();
$sql = "INSERT INTO invitations (slug, form_data)
        VALUES (:slug, :data)
        ON DUPLICATE KEY UPDATE form_data = :data2, updated_at = NOW()";

$stmt = $db->prepare($sql);
$stmt->execute([
    ':slug'  => $slug,
    ':data'  => $json,
    ':data2' => $json,
]);

echo json_encode(['ok' => true, 'slug' => $slug]);
