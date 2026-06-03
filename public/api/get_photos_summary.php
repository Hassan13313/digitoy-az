<?php
/* ── get_photos_summary.php — Admin: uploads/ qovluğundan albom statistikaları ── */
/* NOTE: upload_photo.php şəkilləri filesystem-ə yazır (DB-yə deyil).
   Bu endpoint də filesystem-i skan edir ki, ikisi sinxron olsun.          */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$limit  = min((int)($_GET['limit']  ?? 50), 100);
$offset = max((int)($_GET['offset'] ?? 0),  0);
$search = trim($_GET['search'] ?? '');

$uploadsDir = __DIR__ . '/../uploads/';
$mediaExts  = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'mp4', 'mov'];

$albums = [];

if (is_dir($uploadsDir)) {
    foreach (scandir($uploadsDir) as $slug) {
        if ($slug === '.' || $slug === '..') continue;
        $slugDir = $uploadsDir . $slug . '/';
        if (!is_dir($slugDir)) continue;

        /* Axtarış filteri */
        if ($search !== '' && stripos($slug, $search) === false) continue;

        $photoCount = 0;
        $totalSize  = 0;
        $lastMtime  = 0;

        foreach (scandir($slugDir) as $file) {
            if ($file === '.' || $file === '..') continue;
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (!in_array($ext, $mediaExts, true)) continue;

            $stat = @stat($slugDir . $file);
            if (!$stat) continue;

            $photoCount++;
            $totalSize += $stat['size'];
            if ($stat['mtime'] > $lastMtime) $lastMtime = $stat['mtime'];
        }

        /* Boş qovluqları atla */
        if ($photoCount === 0) continue;

        $albums[] = [
            'slug'        => $slug,
            'photo_count' => $photoCount,
            'last_upload' => $lastMtime ? date('Y-m-d H:i:s', $lastMtime) : null,
            'total_mb'    => round($totalSize / 1048576, 1),
        ];
    }
}

/* Son yükləməyə görə sırala (yenidən köhnəyə) */
usort($albums, fn($a, $b) => strcmp($b['last_upload'] ?? '', $a['last_upload'] ?? ''));

$total     = count($albums);
$paginated = array_slice($albums, $offset, $limit);

echo json_encode(['ok' => true, 'albums' => $paginated, 'total' => $total]);
