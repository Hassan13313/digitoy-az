<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — VPS video çeviricisi üçün API (2026-11)

   Qonaqların telefondan yüklədiyi videolar (4K, HEVC, 50–400 MB) brauzerdə
   gec açılır və ya heç açılmır. Hostinqdə FFmpeg yoxdur, ona görə ayrıca VPS
   (scripts/video-worker/worker.py) videonu endirir, H.264 ≤1080p + faststart
   nüsxəyə çevirir və bura geri yükləyir: <ad>_web.mp4. Orijinal endirmə
   (HD) üçün olduğu kimi qalır. Posteri olmayan videoya poster də yaradır.

   Giriş: X-Worker-Token başlığı = config.worker.php-dəki VIDEO_WORKER_TOKEN
   (serverdə əl ilə yaradılır, deploy ZIP-ə düşmür). Admin açarı DEYİL —
   sızsa belə yalnız bu üç əməliyyatı edə bilər.

   GET  ?action=queue                         → { items:[{slug,name,size,url,poster}] }
   POST ?action=upload  slug,name,kind,file   (kind: web | poster)
   POST ?action=skip    slug,name,reason      (çevirmək lazım deyil / alınmadı)
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/gallery_media.php';
require_once __DIR__ . '/media_policy.php';
if (is_file(__DIR__ . '/config.worker.php')) require_once __DIR__ . '/config.worker.php';

const VW_QUEUE_LIMIT   = 20;
const VW_MIN_AGE_SEC   = 120;          /* yükləməsi təzə bitmiş faylı tələsmə */
const VW_MAX_BYTES     = 100 * 1048576;

function vwFail(int $code, string $err): never {
    http_response_code($code);
    echo json_encode(['error' => $err]);
    exit;
}

$token = (string) ($_SERVER['HTTP_X_WORKER_TOKEN'] ?? '');
if (!defined('VIDEO_WORKER_TOKEN') || strlen((string) VIDEO_WORKER_TOKEN) < 32) vwFail(503, 'WORKER_DISABLED');
if ($token === '' || !hash_equals((string) VIDEO_WORKER_TOKEN, $token)) vwFail(401, 'BAD_TOKEN');

$action  = (string) ($_GET['action'] ?? '');
$uploads = realpath(__DIR__ . '/../uploads');
if ($uploads === false) vwFail(500, 'NO_UPLOADS');

/** Albom qovluğu + media adı yoxlaması (yalnız mövcud orijinal video) */
function vwVideoPath(string $uploads, string $slug, string $name): string {
    if (!isValidSlug($slug) || !isSafeMediaName($name) || isGalleryWebCopy($name)) vwFail(400, 'BAD_NAME');
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!in_array($ext, GALLERY_VIDEO_EXT, true)) vwFail(400, 'NOT_VIDEO');
    $path = $uploads . '/' . $slug . '/' . $name;
    if (!is_file($path) || is_link($path)) vwFail(404, 'NOT_FOUND');
    return $path;
}

if ($action === 'queue' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $items = [];
    $base  = galleryBaseUrl();
    foreach ((array) @scandir($uploads) as $slug) {
        if (count($items) >= VW_QUEUE_LIMIT) break;
        if ($slug === '' || $slug[0] === '.' || $slug[0] === '_' || $slug === 'music' || !isValidSlug($slug)) continue;
        $dir = $uploads . '/' . $slug;
        if (!is_dir($dir) || is_link($dir)) continue;
        $files = array_flip((array) @scandir($dir));
        foreach ($files as $f => $_) {
            if (count($items) >= VW_QUEUE_LIMIT) break;
            $ext = strtolower(pathinfo((string) $f, PATHINFO_EXTENSION));
            if (!in_array($ext, GALLERY_VIDEO_EXT, true) || isGalleryWebCopy((string) $f)) continue;
            $b = pathinfo((string) $f, PATHINFO_FILENAME);
            if (isset($files[$b . '_web.mp4']) || isset($files[$b . '_web.skip'])) continue;
            $p = $dir . '/' . $f;
            if (time() - (int) @filemtime($p) < VW_MIN_AGE_SEC) continue;
            $items[] = [
                'slug'   => $slug,
                'name'   => (string) $f,
                'size'   => (int) @filesize($p),
                'url'    => $base . '/uploads/' . $slug . '/' . rawurlencode((string) $f),
                'poster' => isset($files[$b . '_poster.jpg']),
            ];
        }
    }
    echo json_encode(['ok' => true, 'items' => $items]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') vwFail(405, 'METHOD');

$slug = trim((string) ($_POST['slug'] ?? ''));
$name = trim((string) ($_POST['name'] ?? ''));
$src  = vwVideoPath($uploads, $slug, $name);
$base = substr($src, 0, -strlen(pathinfo($src, PATHINFO_EXTENSION)) - 1);

if ($action === 'skip') {
    $reason = substr(preg_replace('/[^a-z0-9_ .:-]/i', '', (string) ($_POST['reason'] ?? '')), 0, 120);
    @file_put_contents($base . '_web.skip', $reason . "\n");
    mediaLog('video_web_skip', ['slug' => $slug, 'name' => $name, 'reason' => $reason]);
    echo json_encode(['ok' => true]);
    exit;
}

if ($action !== 'upload') vwFail(400, 'BAD_ACTION');

$kind = (string) ($_POST['kind'] ?? '');
$file = $_FILES['file'] ?? null;
if (!in_array($kind, ['web', 'poster'], true)) vwFail(400, 'BAD_KIND');
if (!is_array($file) || ($file['error'] ?? 1) !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) vwFail(400, 'NO_FILE');
if ((int) $file['size'] <= 0 || (int) $file['size'] > VW_MAX_BYTES) vwFail(413, 'TOO_BIG');

$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$want = $kind === 'web' ? ['video/mp4'] : ['image/jpeg'];
if (!in_array($mime, $want, true)) vwFail(415, 'BAD_TYPE');

$dest = $base . ($kind === 'web' ? '_web.mp4' : '_poster.jpg');
if ($kind === 'poster' && is_file($dest)) { echo json_encode(['ok' => true, 'kept' => true]); exit; }
$tmp = $dest . '.part';
if (!move_uploaded_file($file['tmp_name'], $tmp)) vwFail(500, 'MOVE_FAILED');
@chmod($tmp, 0644);
if (!@rename($tmp, $dest)) { @unlink($tmp); vwFail(500, 'RENAME_FAILED'); }
@unlink($base . '_web.skip');

mediaLog('video_web_' . $kind, ['slug' => $slug, 'name' => $name, 'bytes' => (int) $file['size']]);
echo json_encode(['ok' => true]);
