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

/* Diskdən oxu — DB lazım deyil */
$uploadDir = __DIR__ . '/../uploads/' . $slug . '/';
$baseUrl   = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];

$photos = [];
if (is_dir($uploadDir)) {
    $imgExt   = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'];
    $videoExt = ['mp4', 'mov', 'quicktime'];

    foreach (scandir($uploadDir) as $file) {
        if ($file === '.' || $file === '..') continue;
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (!in_array($ext, array_merge($imgExt, $videoExt))) continue;

        $mime = in_array($ext, $videoExt) ? 'video/mp4' : 'image/jpeg';
        $stat = stat($uploadDir . $file);

        $photos[] = [
            'id'         => $file,
            'url'        => $baseUrl . '/uploads/' . $slug . '/' . $file,
            'thumbUrl'   => $baseUrl . '/uploads/' . $slug . '/' . $file,
            'name'       => $file,
            'type'       => $mime,
            'size'       => $stat ? (int) $stat['size'] : 0,
            'uploadedAt' => $stat ? date('Y-m-d H:i:s', $stat['mtime']) : '',
            'source'     => 'server',
        ];
    }

    usort($photos, fn($a, $b) => strcmp($b['uploadedAt'], $a['uploadedAt']));
}

echo json_encode(['ok' => true, 'slug' => $slug, 'photos' => $photos]);
