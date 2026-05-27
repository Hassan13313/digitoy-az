<?php
@ini_set('upload_max_filesize', '128M');
@ini_set('post_max_size',       '128M');
@ini_set('max_execution_time',  '300');
@ini_set('memory_limit',        '256M');

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$slug = trim($_POST['slug'] ?? '');

if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

if (empty($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'File upload error', 'code' => $_FILES['photo']['error'] ?? -1]);
    exit;
}

$file    = $_FILES['photo'];
$mime    = mime_content_type($file['tmp_name']);
$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime'];

if (!in_array($mime, $allowed, true)) {
    http_response_code(415);
    echo json_encode(['error' => 'File type not allowed', 'mime' => $mime]);
    exit;
}

if ($file['size'] > 52428800) {
    http_response_code(413);
    echo json_encode(['error' => 'File too large (max 50MB)']);
    exit;
}

/* Qovluq yarat */
$uploadDir = __DIR__ . '/../uploads/' . $slug . '/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
        http_response_code(500);
        echo json_encode(['error' => 'Cannot create upload directory', 'path' => $uploadDir]);
        exit;
    }
}
if (!is_writable($uploadDir)) {
    chmod($uploadDir, 0755);
    if (!is_writable($uploadDir)) {
        http_response_code(500);
        echo json_encode(['error' => 'Upload directory not writable']);
        exit;
    }
}

/* Unikal fayl adı */
$ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg';
$filename = time() . '_' . uniqid() . '.' . $ext;
$destPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not save file']);
    exit;
}

/* Public URL */
$baseUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
$url     = $baseUrl . '/uploads/' . $slug . '/' . $filename;

echo json_encode([
    'ok'       => true,
    'url'      => $url,
    'filename' => $filename,
    'id'       => $filename,
    'mime'     => $mime,
]);
