<?php
/* ── Phase 25.3 — Musiqi (MP3) yükləmə endpointi ──
   • Yalnız MP3 (real məzmuna görə MIME yoxlaması)
   • Maksimum 20 MB
   Mövcud DB sxeminə toxunmur — URL formData.music.file kimi saxlanılır.

   ── Phase 44.3 — İKİ REJİM ──────────────────────────────────────────────
   1) `sid` (builder sessiyası) — BUILDER HƏMİŞƏ BUNU GÖNDƏRİR.
      Dəvətnamə yalnız təsdiqdə yaranır və slug-a kod əlavə olunur, ona görə
      builder-in bildiyi slug serverdə YOXDUR. Fayl sessiya qovluğuna düşür:
      /uploads/_music/<bucket>/<sha1>.mp3 (bax story_media.php). URL təsdiqdən
      sonra da dəyişmir — heç bir köçürmə lazım deyil.
      Sui-istifadəyə qarşı: IP üzrə saatda 12 yükləmə, sessiyada ən çox
      MUSIC_BUCKET_CAP fayl, eyni fayl ikinci dəfə yazılmır.
   2) `slug` (mövcud dəvətnamə) — köhnə keşlənmiş frontend üçün saxlanılıb.
      Phase 37 qaydası dəyişmir: uydurma slug-la yükləmək olmaz.
      Fayllar: /uploads/music/{slug}/ ; (slug, IP) üzrə saatda 20.

   ⚠ Əvvəl sessiya rejimi yox idi: builder 404 alıb SƏSSİZCƏ `blob:` URL
   saxlayırdı və təsdiqlənmiş dəvətnamədə musiqi heç kimdə açılmırdı. */
@ini_set('upload_max_filesize', '25M');
@ini_set('post_max_size',       '25M');
@ini_set('max_execution_time',  '120');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/story_media.php';

function musicFail(int $http, string $code, string $message, bool $permanent = true): never {
    http_response_code($http);
    echo json_encode([
        'error' => $code, 'code' => $code, 'message' => $message, 'permanent' => $permanent,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

/* post_max_size aşılanda PHP $_POST və $_FILES-i BOŞ qaytarır — səbəb
   «sessiya yoxdur» kimi yanıltıcı görünməsin. */
if (empty($_FILES) && empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    musicFail(413, 'FILE_TOO_LARGE', 'Fayl 20 MB-dan böyük ola bilməz.');
}

$sid        = (string) ($_POST['sid'] ?? '');
$useSession = isValidStorySid($sid);
$slug       = '';

if (!$useSession) {
    $slug = trim($_POST['slug'] ?? '');
    if (!$slug || !isValidSlug($slug)) {
        musicFail(400, 'BAD_SESSION', 'Sessiya tanınmadı. Səhifəni yeniləyin.');
    }
    /* Phase 37 — uydurma slug-la musiqi yüklənə bilməz (bax upload_photo.php) */
    if (!invitationExists(getDB(), $slug)) {
        musicFail(404, 'INVITATION_NOT_FOUND', 'Bu dəvətnamə tapılmadı.');
    }
}

/* ── Eyni requestdə maksimum 1 fayl ── */
$file = $_FILES['music'] ?? null;
if (!$file || is_array($file['name'] ?? null) || count($_FILES) !== 1) {
    musicFail(400, 'BAD_REQUEST', 'Hər sorğuda bir MP3 faylı göndərilməlidir.');
}
if (($file['error'] ?? -1) !== UPLOAD_ERR_OK) {
    $tooBig = in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
    musicFail($tooBig ? 413 : 400, $tooBig ? 'FILE_TOO_LARGE' : 'UPLOAD_ERROR',
        $tooBig ? 'Fayl 20 MB-dan böyük ola bilməz.' : 'Fayl yüklənmədi. Yenidən cəhd edin.', $tooBig);
}
if ((int) $file['size'] <= 0 || (int) $file['size'] > MUSIC_MAX_UPLOAD
    || !is_uploaded_file($file['tmp_name'])) {
    musicFail(413, 'FILE_TOO_LARGE', 'Fayl 20 MB-dan böyük ola bilməz.');
}

/* ── Rate limit ──
   Sessiya rejimində açar IP-dir: sessiya ID-sini dəyişməklə limit keçilməsin.
   Slug rejimində əvvəlki (slug, IP) açarı — `rateGate` eyni sha256 faylını
   işlədir, yəni mövcud sayğaclar olduğu kimi davam edir. */
$ip = clientIp();
$allowed = $useSession
    ? rateGate('music:' . $ip, 12, 3600)
    : rateGate('music|' . $slug . '|' . $ip, 20, 3600);
if (!$allowed) {
    musicFail(429, 'RATE_LIMIT', 'Çox sayda fayl yükləndi. Bir az sonra yenidən cəhd edin.', false);
}

/* ── MIME — real fayl məzmununa görə (Content-Type header-ə güvənmir) ── */
$mime = mime_content_type($file['tmp_name']);
if (!in_array($mime, ['audio/mpeg', 'audio/mp3'], true)) {
    musicFail(415, 'NOT_MP3', 'Yalnız MP3 faylı qəbul olunur.');
}

if ($useSession) {
    $bucket = musicBucket($sid);
    $dir    = musicDir($bucket);
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        musicFail(500, 'SERVER_STORAGE', 'Serverdə yaddaş xətası. Bir az sonra yenidən cəhd edin.', false);
    }
    $filename = musicFileName($file['tmp_name']);
    if ($filename === null) {
        musicFail(500, 'SERVER_STORAGE', 'Fayl saxlanılmadı. Yenidən cəhd edin.', false);
    }
    /* Eyni fayl artıq varsa yenidən yazılmır və limitə sayılmır */
    if (!is_file($dir . $filename)) {
        if (musicBucketCount($dir) >= MUSIC_BUCKET_CAP) {
            musicFail(429, 'BUCKET_FULL', 'Bu sifariş üçün musiqi yükləmə limiti dolub.');
        }
        if (!move_uploaded_file($file['tmp_name'], $dir . $filename)) {
            musicFail(500, 'SERVER_STORAGE', 'Fayl saxlanılmadı. Yenidən cəhd edin.', false);
        }
    }
    $path = musicPublicPath($bucket, $filename);
} else {
    $dir = __DIR__ . '/../uploads/music/' . $slug . '/';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        musicFail(500, 'SERVER_STORAGE', 'Serverdə yaddaş xətası. Bir az sonra yenidən cəhd edin.', false);
    }
    $filename = time() . '_' . uniqid('', true) . '.mp3';
    if (!move_uploaded_file($file['tmp_name'], $dir . $filename)) {
        musicFail(500, 'SERVER_STORAGE', 'Fayl saxlanılmadı. Yenidən cəhd edin.', false);
    }
    $path = '/uploads/music/' . $slug . '/' . $filename;
}

/* Veb server oxuya bilsin — hissəli video posterlərindəki 403 dərsi
   (bax media_store.php). move_uploaded_file adətən 0644 verir, bu ehtiyatdır. */
@chmod($dir . $filename, 0644);

$baseUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
echo json_encode([
    'ok'       => true,
    'url'      => $baseUrl . $path,
    'filename' => $filename,
    'mime'     => $mime,
]);
