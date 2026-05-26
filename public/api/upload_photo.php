<?php
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
    echo json_encode(['error' => 'File upload error']);
    exit;
}

$file     = $_FILES['photo'];
$mime     = mime_content_type($file['tmp_name']);
$allowed  = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime'];

if (!in_array($mime, $allowed, true)) {
    http_response_code(415);
    echo json_encode(['error' => 'File type not allowed']);
    exit;
}

/* Max 50 MB */
if ($file['size'] > 52428800) {
    http_response_code(413);
    echo json_encode(['error' => 'File too large (max 50MB)']);
    exit;
}

/* Qovluq yarat */
$uploadDir = __DIR__ . '/../uploads/' . $slug . '/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
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

/* DB-ə yaz */
$db   = getDB();
$stmt = $db->prepare(
    "INSERT INTO photos (slug, url, filename, mime_type, file_size)
     VALUES (:slug, :url, :filename, :mime, :size)"
);
$stmt->execute([
    ':slug'     => $slug,
    ':url'      => $url,
    ':filename' => $filename,
    ':mime'     => $mime,
    ':size'     => $file['size'],
]);

echo json_encode([
    'ok'       => true,
    'url'      => $url,
    'filename' => $filename,
    'mime'     => $mime,
]);
