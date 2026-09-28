<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — «Bizim Hekayəmiz» şəkil yükləməsi (Phase 44)

   POST multipart: photo=<şəkil>, sid=<builder sessiya ID-si>
   → { ok, url: "/uploads/_story/<bucket>/<hash>.jpg", width, height }

   Builder-də şəkil SEÇİLƏN KİMİ çağırılır — slug hələ yoxdur, ona görə
   qovluq sessiyaya bağlıdır (bax story_media.php). Formda yalnız qaytarılan
   URL saxlanılır; o, sifariş təsdiqlənəndən sonra da DƏYİŞMİR, yəni
   save_invitation.php-də heç bir köçürmə lazım deyil.

   ⚠ İCTİMAİ ENDPOINT: builder-i istifadə edən hər kəs (sifarişdən əvvəl)
   bura yazır. Sui-istifadəyə qarşı:
     • IP üzrə saatda 90 yükləmə (`rateGate`),
     • sessiya qovluğunda ən çox STORY_BUCKET_CAP fayl,
     • hər fayl GD ilə yenidən kodlaşdırılır — diskə yalnız təmiz JPEG düşür,
     • uploads/.htaccess bu qovluqda da skript icrasını bağlayır.
   ══════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/story_media.php';

function storyFail(int $http, string $code, string $message, bool $permanent = true): never {
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
   «sid yoxdur» kimi yanıltıcı görünməsin. */
if (empty($_FILES) && empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    storyFail(413, 'FILE_TOO_LARGE', 'Şəkil çox böyükdür.');
}

$sid = (string) ($_POST['sid'] ?? '');
if (!isValidStorySid($sid)) {
    storyFail(400, 'BAD_SESSION', 'Sessiya tanınmadı. Səhifəni yeniləyin.');
}

$file = $_FILES['photo'] ?? null;
if (!$file || is_array($file['name'] ?? null) || count($_FILES) !== 1) {
    storyFail(400, 'BAD_REQUEST', 'Hər sorğuda bir şəkil göndərilməlidir.');
}
if (($file['error'] ?? -1) !== UPLOAD_ERR_OK) {
    $tooBig = in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
    storyFail($tooBig ? 413 : 400, $tooBig ? 'FILE_TOO_LARGE' : 'UPLOAD_ERROR',
        $tooBig ? 'Şəkil çox böyükdür.' : 'Şəkil yüklənmədi. Yenidən cəhd edin.', $tooBig);
}
if ((int) $file['size'] <= 0 || (int) $file['size'] > STORY_MAX_UPLOAD
    || !is_uploaded_file($file['tmp_name'])) {
    storyFail(413, 'FILE_TOO_LARGE', 'Şəkil çox böyükdür.');
}

if (!rateGate('story:' . clientIp(), 90, 3600)) {
    storyFail(429, 'RATE_LIMIT', 'Çox sayda şəkil yükləndi. Bir az sonra yenidən cəhd edin.', false);
}

$bucket = storyBucket($sid);
$dir    = storyDir($bucket);
if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
    storyFail(500, 'SERVER_STORAGE', 'Serverdə yaddaş xətası. Bir az sonra yenidən cəhd edin.', false);
}
if (storyBucketCount($dir) >= STORY_BUCKET_CAP) {
    storyFail(429, 'BUCKET_FULL', 'Bu sifariş üçün şəkil limiti dolub.');
}

$tmp = $dir . '.tmp_' . bin2hex(random_bytes(8)) . '.jpg';
$res = storyReencode($file['tmp_name'], $tmp);
if (!$res['ok']) {
    @unlink($tmp);
    if ($res['error'] === 'WRITE_FAILED') {
        storyFail(500, 'SERVER_STORAGE', 'Şəkil saxlanılmadı. Yenidən cəhd edin.', false);
    }
    storyFail(422, 'NOT_IMAGE', 'Bu fayl şəkil kimi açılmadı. JPG, PNG və ya WEBP seçin.');
}

$name = storyCommit($tmp, $dir);
if ($name === null) {
    storyFail(500, 'SERVER_STORAGE', 'Şəkil saxlanılmadı. Yenidən cəhd edin.', false);
}

echo json_encode([
    'ok'     => true,
    'url'    => storyPublicUrl($bucket, $name),
    'width'  => $res['width'],
    'height' => $res['height'],
]);
