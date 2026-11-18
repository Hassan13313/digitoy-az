<?php
/* Albom şəkillərinin baxış nüsxəsi (2026-11-18) — php tests/photo_variants_test.php
   GD ilə real fayllar yaradır (müvəqqəti qovluqda), DB tələb etmir. */
require __DIR__ . '/../public/api/photo_variants.php';

$ok = 0; $fail = 0;
function check($name, $cond) { global $ok, $fail; if ($cond) $ok++; else { $fail++; echo "  FAIL $name\n"; } }

$tmp = sys_get_temp_dir() . '/dt_pv_' . bin2hex(random_bytes(4));
mkdir($tmp);

/* Böyük şəkil (3000×2000) → 1600×1067 nüsxə */
$big = imagecreatetruecolor(3000, 2000);
imagefill($big, 0, 0, imagecolorallocate($big, 200, 150, 90));
imagejpeg($big, "$tmp/big.jpg", 90);
check('böyük şəkil: nüsxə yaradılır', makeDisplayCopy($big, "$tmp/big_display.jpg"));
imagedestroy($big);
[$w, $h] = getimagesize("$tmp/big_display.jpg");
check('nüsxənin uzun tərəfi 1600', $w === 1600 && $h === 1067);
check('nüsxə orijinaldan yüngüldür', filesize("$tmp/big_display.jpg") < filesize("$tmp/big.jpg"));

/* Kiçik şəkil → nüsxə lazım deyil */
$small = imagecreatetruecolor(1200, 900);
imagepng($small, "$tmp/small.png");
check('kiçik şəkil: nüsxə yoxdur', makeDisplayCopy($small, "$tmp/small_display.jpg") === false && !is_file("$tmp/small_display.jpg"));
imagedestroy($small);

/* Toplu yeniləmə köməkçisi */
$p = imagecreatetruecolor(2400, 3200); imagewebp($p, "$tmp/portrait.webp", 80); imagedestroy($p);
check('ensureDisplayCopy: yaradır', ensureDisplayCopy("$tmp/portrait.webp") === 'created');
check('ensureDisplayCopy: təkrarda «exists»', ensureDisplayCopy("$tmp/portrait.webp") === 'exists');
[$pw, $ph] = getimagesize("$tmp/portrait_display.jpg");
check('portret nüsxə 1200×1600', $pw === 1200 && $ph === 1600);
check('ensureDisplayCopy: kiçik → small', ensureDisplayCopy("$tmp/small.png") === 'small');
file_put_contents("$tmp/broken.jpg", 'not an image');
check('ensureDisplayCopy: zədəli → failed', ensureDisplayCopy("$tmp/broken.jpg") === 'failed');
check('ensureDisplayCopy: törəmə → skip', ensureDisplayCopy("$tmp/big_display.jpg") === 'skip');
check('ensureDisplayCopy: video → skip', ensureDisplayCopy("$tmp/clip.mp4") === 'skip');

/* Törəmə adları */
foreach (['a_thumb.jpg', 'a_poster.jpg', 'a_display.jpg', 'a_web.mp4'] as $d) check("törəmə: $d", isPhotoDerivativeName($d));
foreach (['a.jpg', 'display.jpg', 'a.mp4'] as $d) check("orijinal: $d", !isPhotoDerivativeName($d));

/* Bütün törəmə yollarının mərkəzi funksiyanı işlətdiyini yoxla */
$api = __DIR__ . '/../public/api/';
check('gallery_media displayUrl qaytarır', str_contains(file_get_contents($api . 'gallery_media.php'), "'displayUrl'"));
check('upload_photo nüsxə yaradır', str_contains(file_get_contents($api . 'upload_photo.php'), 'makeDisplayCopy($img'));
check('media_store (hissəli yükləmə) nüsxə yaradır', str_contains(file_get_contents($api . 'media_store.php'), 'makeDisplayCopy($img'));
check('delete_photo nüsxəni də silir', str_contains(file_get_contents($api . 'delete_photo.php'), "_display.jpg'"));
check('admin toplu yeniləmə var', str_contains(file_get_contents($api . 'admin_maintenance.php'), "'display_copies'"));
$src = file_get_contents(__DIR__ . '/../src/utils/mediaView.js');
check('front-end baxışda yüngül nüsxə', str_contains($src, 'item.displayUrl') && str_contains($src, 'item.webUrl'));

array_map('unlink', glob("$tmp/*")); rmdir($tmp);
echo "$ok passed, $fail failed\n";
exit($fail ? 1 : 0);
