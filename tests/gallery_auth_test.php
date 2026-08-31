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

echo "\n$pass keçdi, $fail uğursuz\n";
exit($fail === 0 ? 0 : 1);
