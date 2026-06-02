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

/* ── 1. Slug validation ── */
$slug = trim($_POST['slug'] ?? '');

if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* ── 5. Eyni requestdə maksimum 1 fayl ── */
if (count($_FILES) > 1 || (isset($_FILES['photo']) && is_array($_FILES['photo']['name']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Only one file per request allowed']);
    exit;
}

if (empty($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'File upload error', 'code' => $_FILES['photo']['error'] ?? -1]);
    exit;
}

/* ── 4. Rate limit — IP başına saatda 30 upload ── */
$ip        = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ipHash    = hash('sha256', $ip);
$rlFile    = sys_get_temp_dir() . '/digitoy_rl_' . $ipHash . '.json';
$rlLimit   = 30;
$rlWindow  = 3600; /* 1 saat */

$now       = time();
$rlData    = [];

if (file_exists($rlFile)) {
    $raw = @file_get_contents($rlFile);
    if ($raw) $rlData = json_decode($raw, true) ?: [];
}

/* Köhnə timestamp-ləri sil (pencərə xaricindəkilər) */
$rlData = array_values(array_filter($rlData, fn($t) => ($now - $t) < $rlWindow));

if (count($rlData) >= $rlLimit) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many uploads. Try again later.']);
    exit;
}

$rlData[] = $now;
@file_put_contents($rlFile, json_encode($rlData), LOCK_EX);

/* ── 2. MIME validation ── */
$file    = $_FILES['photo'];
$mime    = mime_content_type($file['tmp_name']);
$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime'];

if (!in_array($mime, $allowed, true)) {
    http_response_code(415);
    echo json_encode(['error' => 'File type not allowed', 'mime' => $mime]);
    exit;
}

/* ── 3. Max file size: 50MB ── */
if ($file['size'] > 52428800) {
    http_response_code(413);
    echo json_encode(['error' => 'File too large (max 50MB)']);
    exit;
}

/* ── Qovluq yarat ── */
$uploadDir = __DIR__ . '/../uploads/' . $slug . '/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
        http_response_code(500);
        echo json_encode(['error' => 'Cannot create upload directory']);
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

/* ── Unikal fayl adı ── */
$ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg';
$filename = time() . '_' . uniqid() . '.' . $ext;
$destPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not save file']);
    exit;
}

/* ── Public URL ── */
$baseUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
$url     = $baseUrl . '/uploads/' . $slug . '/' . $filename;

echo json_encode([
    'ok'       => true,
    'url'      => $url,
    'filename' => $filename,
    'id'       => $filename,
    'mime'     => $mime,
]);
