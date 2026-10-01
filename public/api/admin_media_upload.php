<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Admin şəkil yükləməsi (Phase 45)

   POST multipart: slug=<dəvətnamə>, photo=<şəkil>   (admin tokeni MƏCBURİ)
   → { ok, url: "/uploads/_admin/<slug>/<hash>.jpg|png", width, height }

   Admin «Məzmun» panelində:
     • açılış monoqramına şəkil / loqo,
     • «Bizim Hekayəmiz» fəsillərinə şəkil.
   Formda (form_data.admin) yalnız qaytarılan qısa yol saxlanılır.
   Saxlama qaydaları və təhlükəsizlik: admin_media.php.
   ══════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/admin_media.php';

requireAdmin();

function adminMediaFail(int $http, string $code, string $message): never {
    http_response_code($http);
    echo json_encode(['error' => $code, 'code' => $code, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

/* post_max_size aşılanda PHP $_POST və $_FILES-i BOŞ qaytarır */
if (empty($_FILES) && empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    adminMediaFail(413, 'FILE_TOO_LARGE', 'Şəkil çox böyükdür.');
}

$slug = trim((string) ($_POST['slug'] ?? ''));
if (!isValidSlug($slug)) {
    adminMediaFail(400, 'BAD_SLUG', 'Dəvətnamə tanınmadı.');
}

/* Yalnız MÖVCUD dəvətnamə üçün qovluq yaradılır */
$st = getDB()->prepare('SELECT 1 FROM invitations WHERE slug = :s LIMIT 1');
$st->execute([':s' => $slug]);
if (!$st->fetchColumn()) {
    adminMediaFail(404, 'NOT_FOUND', 'Dəvətnamə tapılmadı.');
}

$file = $_FILES['photo'] ?? null;
if (!$file || is_array($file['name'] ?? null) || count($_FILES) !== 1) {
    adminMediaFail(400, 'BAD_REQUEST', 'Hər sorğuda bir şəkil göndərilməlidir.');
}
if (($file['error'] ?? -1) !== UPLOAD_ERR_OK) {
    $tooBig = in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
    adminMediaFail($tooBig ? 413 : 400, $tooBig ? 'FILE_TOO_LARGE' : 'UPLOAD_ERROR',
        $tooBig ? 'Şəkil çox böyükdür.' : 'Şəkil yüklənmədi. Yenidən cəhd edin.');
}
if ((int) $file['size'] <= 0 || (int) $file['size'] > ADMIN_MEDIA_MAX_UPLOAD || !is_uploaded_file($file['tmp_name'])) {
    adminMediaFail(413, 'FILE_TOO_LARGE', 'Şəkil çox böyükdür (maks. 12 MB).');
}

$dir = adminMediaDir($slug);
if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
    adminMediaFail(500, 'SERVER_STORAGE', 'Serverdə yaddaş xətası.');
}
if (adminMediaCount($dir) >= ADMIN_MEDIA_CAP) {
    adminMediaFail(429, 'CAP_REACHED', 'Bu dəvətnamə üçün şəkil limiti dolub.');
}

$tmpBase = $dir . '.tmp_' . bin2hex(random_bytes(8));
$res = adminMediaReencode($file['tmp_name'], $tmpBase);
if (!$res['ok']) {
    if ($res['error'] === 'WRITE_FAILED') {
        adminMediaFail(500, 'SERVER_STORAGE', 'Şəkil saxlanılmadı. Yenidən cəhd edin.');
    }
    adminMediaFail(422, 'NOT_IMAGE', 'Bu fayl şəkil kimi açılmadı. JPG, PNG və ya WEBP seçin.');
}

$name = adminMediaCommit($res['path'], $dir, $res['ext']);
if ($name === null) {
    adminMediaFail(500, 'SERVER_STORAGE', 'Şəkil saxlanılmadı. Yenidən cəhd edin.');
}

adminAuditLog('admin_media_upload', $slug, $name);

echo json_encode([
    'ok'     => true,
    'url'    => adminMediaUrl($slug, $name),
    'width'  => $res['width'],
    'height' => $res['height'],
]);
