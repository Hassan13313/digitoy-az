<?php
/* ── Phase 25.3 — Musiqi (MP3) yükləmə endpointi ──
   upload_photo.php nümunəsində minimal variant:
   • Yalnız MP3 (real məzmuna görə MIME yoxlaması)
   • Maksimum 20 MB
   • (slug, IP) üzrə saatda 20 yükləmə (flock ilə atomik)
   • Fayllar: /uploads/music/{slug}/
   Mövcud DB sxeminə toxunmur — URL formData.music.file kimi saxlanılır. */
@ini_set('upload_max_filesize', '25M');
@ini_set('post_max_size',       '25M');
@ini_set('max_execution_time',  '120');

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

/* ── Slug validation ── */
$slug = trim($_POST['slug'] ?? '');
if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* ── Eyni requestdə maksimum 1 fayl ── */
if (count($_FILES) > 1 || (isset($_FILES['music']) && is_array($_FILES['music']['name']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Only one file per request allowed']);
    exit;
}

if (empty($_FILES['music']) || $_FILES['music']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'File upload error', 'code' => $_FILES['music']['error'] ?? -1]);
    exit;
}

/* ── Rate limit — (slug, IP) üzrə saatda 20, flock ilə atomik ── */
$ip       = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip       = trim(explode(',', $ip)[0]);
$rlKey    = hash('sha256', 'music|' . $slug . '|' . $ip);
$rlFile   = sys_get_temp_dir() . '/digitoy_rl_' . $rlKey . '.json';
$rlLimit  = 20;
$rlWindow = 3600;

$rlAllowed = true;
$fp = @fopen($rlFile, 'c+');
if ($fp !== false) {
    if (flock($fp, LOCK_EX)) {
        $raw    = stream_get_contents($fp);
        $rlData = $raw ? (json_decode($raw, true) ?: []) : [];
        $now    = time();
        $rlData = array_values(array_filter($rlData, fn($t) => ($now - $t) < $rlWindow));
        if (count($rlData) >= $rlLimit) {
            $rlAllowed = false;
        } else {
            $rlData[] = $now;
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($rlData));
            fflush($fp);
        }
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

if (!$rlAllowed) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many uploads. Please try again later.']);
    exit;
}

$file = $_FILES['music'];

/* ── Max 20 MB ── */
if ($file['size'] > 20971520) {
    http_response_code(413);
    echo json_encode(['error' => 'File too large (max 20MB)']);
    exit;
}

/* ── MIME — real fayl məzmununa görə (Content-Type header-ə güvənmir) ── */
$mime = mime_content_type($file['tmp_name']);
if (!in_array($mime, ['audio/mpeg', 'audio/mp3'], true)) {
    http_response_code(415);
    echo json_encode(['error' => 'Only MP3 files are allowed', 'mime' => $mime]);
    exit;
}

/* ── Qovluq: /uploads/music/{slug}/ ── */
$uploadDir = __DIR__ . '/../uploads/music/' . $slug . '/';
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

$filename = time() . '_' . uniqid('', true) . '.mp3';
$destPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not save file']);
    exit;
}

$baseUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
echo json_encode([
    'ok'       => true,
    'url'      => $baseUrl . '/uploads/music/' . $slug . '/' . $filename,
    'filename' => $filename,
    'mime'     => $mime,
]);
