<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$slug     = trim($body['slug'] ?? '');
$filename = basename(trim($body['id'] ?? '')); // id = filename

if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

if (!$filename || !preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid filename required']);
    exit;
}

$filePath = __DIR__ . '/../uploads/' . $slug . '/' . $filename;

if (!file_exists($filePath)) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit;
}

if (!unlink($filePath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not delete file']);
    exit;
}

echo json_encode(['ok' => true, 'deleted' => $filename]);
