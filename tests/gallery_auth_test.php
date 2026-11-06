<?php
/* Qalereya tokeni — təhlükəsizlik testləri (PHP-nin özü ilə işləyir, framework yoxdur)
   İşlət:  php tests/gallery_auth_test.php                                        */

define('ADMIN_KEY', 'test-admin-key-0123456789');
require_once __DIR__ . '/../public/api/gallery_auth.php';

$pass = 0; $fail = 0;
function check(string $name, bool $cond) {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok   $name\n"; }
    else       { $fail++; echo "  FAIL $name\n"; }
}

echo "gallery token\n";

$a = mintGalleryToken('aytekin-ve-ferid');
$b = mintGalleryToken('leyla-ve-murad');

check('öz slug-u üçün etibarlıdır',            validateGalleryToken($a['token'], 'aytekin-ve-ferid'));
check('BAŞQA toyun slug-u üçün RƏDD edilir',   !validateGalleryToken($a['token'], 'leyla-ve-murad'));
check('başqa tokenlə çarpaz keçid yoxdur',     !validateGalleryToken($b['token'], 'aytekin-ve-ferid'));
check('imza pozulanda rədd edilir',            !validateGalleryToken($a['token'] . 'x', 'aytekin-ve-ferid'));
check('boş token rədd edilir',                 !validateGalleryToken('', 'aytekin-ve-ferid'));
check('nöqtəsiz token rədd edilir',            !validateGalleryToken('abcdef', 'aytekin-ve-ferid'));
check('admin tokeni qalereya tokeni deyil',    !validateGalleryToken(
    (function () {
        $p = rtrim(strtr(base64_encode(time() . ':' . (time() + 3600)), '+/', '-_'), '=');
        return $p . '.' . hash_hmac('sha256', $p, ADMIN_KEY);
    })(), 'aytekin-ve-ferid'));

/* Müddəti bitmiş token */
$expired = mintGalleryToken('aytekin-ve-ferid', -10);
check('müddəti bitmiş token rədd edilir',      !validateGalleryToken($expired['token'], 'aytekin-ve-ferid'));

/* Prefiks oyunu: "aytekin-ve-ferid" tokeni "aytekin-ve-ferid-2"-yə keçməməlidir */
check('slug prefiksi ilə keçid yoxdur',        !validateGalleryToken($a['token'], 'aytekin-ve-ferid-2'));

/* Qalereya açarı admin açarından fərqlidir (sızma admin olmur) */
check('qalereya açarı ≠ admin açarı',          gallerySigningKey() !== ADMIN_KEY);

echo "\ngallery VIEW token (albomun baxış linki)\n";

$va = galleryViewToken('aytekin-ve-ferid');
check('baxış tokeni sabitdir (link dəyişmir)',          $va === galleryViewToken('aytekin-ve-ferid'));
check('baxış tokeni 32 hex',                            (bool) preg_match('/^[a-f0-9]{32}$/', $va));
check('başqa toyun baxış tokeni fərqlidir',             $va !== galleryViewToken('leyla-ve-murad'));
check('slug prefiksi ilə eyni token alınmır',          $va !== galleryViewToken('aytekin-ve-ferid-2'));
check('baxış tokeni idarəetmə tokeni kimi KEÇMİR',      !validateGalleryToken($va, 'aytekin-ve-ferid'));

$_SERVER['HTTP_X_GALLERY_VIEW'] = $va;
check('düzgün X-Gallery-View qəbul edilir',             isGalleryViewRequest('aytekin-ve-ferid'));
check('başqa toyun albomuna keçmir',                    !isGalleryViewRequest('leyla-ve-murad'));
$_SERVER['HTTP_X_GALLERY_VIEW'] = $a['token'];
check('idarəetmə tokeni baxış başlığında işləmir',      !isGalleryViewRequest('aytekin-ve-ferid'));
$_SERVER['HTTP_X_GALLERY_VIEW'] = substr($va, 0, 31) . 'x';
check('pozulmuş baxış tokeni rədd edilir',              !isGalleryViewRequest('aytekin-ve-ferid'));
unset($_SERVER['HTTP_X_GALLERY_VIEW']);
check('başlıq yoxdursa albom bağlıdır',                 !isGalleryViewRequest('aytekin-ve-ferid'));

echo "\n$pass keçdi, $fail uğursuz\n";
exit($fail === 0 ? 0 : 1);
