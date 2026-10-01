<?php
/* ══════════════════════════════════════════════════
   Admin şəkil saxlanması (Phase 45) — regression testləri.

   Serversiz işləyir (yalnız GD lazımdır):
       php tests/admin_media_test.php

   Qoruduğu müqavilələr:
     1. Şəffaf loqo PNG kimi qalır (JPEG-də ağ kvadrat olardı),
        şəffaflığı olmayan şəkil JPEG olur (yüngül).
     2. Hər fayl yenidən kodlaşdırılır; şəkil olmayan / GIF rədd edilir.
     3. Böyük şəkil kiçildilir, eyni şəkil ikinci dəfə yazılmır.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/../public/api/admin_media.php';

$pass = 0; $fail = 0;
function check(string $name, bool $cond, string $extra = '') {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok   $name\n"; }
    else       { $fail++; echo "  FAIL $name" . ($extra ? " — $extra" : '') . "\n"; }
}

$tmp = sys_get_temp_dir() . '/admin_media_test_' . bin2hex(random_bytes(4)) . '/';
mkdir($tmp, 0755, true);

function solid(string $path, int $w, int $h, string $kind, bool $transparent = false): void {
    $im = imagecreatetruecolor($w, $h);
    if ($transparent) {
        imagealphablending($im, false);
        imagesavealpha($im, true);
        imagefill($im, 0, 0, imagecolorallocatealpha($im, 0, 0, 0, 127));
        imagefilledrectangle($im, (int) ($w / 4), (int) ($h / 4), (int) ($w * 3 / 4), (int) ($h * 3 / 4),
            imagecolorallocatealpha($im, 200, 40, 40, 0));
    } else {
        imagefill($im, 0, 0, imagecolorallocate($im, 30, 120, 200));
    }
    match ($kind) {
        'jpeg' => imagejpeg($im, $path, 90),
        'png'  => imagepng($im, $path),
        'webp' => imagewebp($im, $path, 90),
        'gif'  => imagegif($im, $path),
    };
    imagedestroy($im);
}

echo "format seçimi\n";
$cases = [
    ['png',  true,  'png'],
    ['png',  false, 'jpg'],
    ['jpeg', false, 'jpg'],
];
if (function_exists('imagewebp') && function_exists('imagecreatefromwebp')) {
    $cases[] = ['webp', true, 'png'];
    $cases[] = ['webp', false, 'jpg'];
}
foreach ($cases as [$kind, $alpha, $want]) {
    $src = $tmp . "src_{$kind}_" . ($alpha ? 'a' : 'o') . ".$kind";
    solid($src, 320, 200, $kind, $alpha);
    $r = adminMediaReencode($src, $tmp . "out_{$kind}_" . ($alpha ? 'a' : 'o'));
    $info = $r['ok'] ? @getimagesize($r['path']) : false;
    $type = $want === 'png' ? IMAGETYPE_PNG : IMAGETYPE_JPEG;
    check("$kind " . ($alpha ? 'şəffaf' : 'qeyri-şəffaf') . " → $want",
        $r['ok'] && ($r['ext'] ?? '') === $want && $info && $info[2] === $type, json_encode($r));
}

echo "\nşəffaflıq həqiqətən qorunur\n";
$src = $tmp . 'logo.png';
solid($src, 200, 200, 'png', true);
$r = adminMediaReencode($src, $tmp . 'logo_out');
$im = @imagecreatefrompng($r['path'] ?? '');
$corner = $im ? ((imagecolorat($im, 2, 2) >> 24) & 0x7F) : -1;
$center = $im ? ((imagecolorat($im, 100, 100) >> 24) & 0x7F) : -1;
check('küncdə şəffaf piksel', $corner > 100, "alpha=$corner");
check('mərkəzdə qeyri-şəffaf piksel', $center === 0, "alpha=$center");

echo "\nrədd edilənlər\n";
file_put_contents($tmp . 'fake.png', "<?php echo 'x'; ?>");
check('şəkil olmayan fayl → NOT_IMAGE', adminMediaReencode($tmp . 'fake.png', $tmp . 'x1')['error'] === 'NOT_IMAGE');
solid($tmp . 'a.gif', 50, 50, 'gif');
check('GIF → UNSUPPORTED', adminMediaReencode($tmp . 'a.gif', $tmp . 'x2')['error'] === 'UNSUPPORTED');
check('heç bir çıxış faylı qalmır', !glob($tmp . 'x1.*') && !glob($tmp . 'x2.*'));

echo "\nölçü və təkrar\n";
solid($tmp . 'big.jpg', 3000, 1500, 'jpeg');
$r = adminMediaReencode($tmp . 'big.jpg', $tmp . 'big_out');
check('uzun tərəf 1400-ə endirilir', $r['ok'] && $r['width'] === 1400 && $r['height'] === 700, json_encode($r));

$dir = $tmp . 'slugdir/';
mkdir($dir);
$r1 = adminMediaReencode($tmp . 'big.jpg', $dir . '.tmp_a');
$n1 = adminMediaCommit($r1['path'], $dir, $r1['ext']);
$r2 = adminMediaReencode($tmp . 'big.jpg', $dir . '.tmp_b');
$n2 = adminMediaCommit($r2['path'], $dir, $r2['ext']);
check('ad məzmun hash-idir', (bool) preg_match('/^[a-f0-9]{20}\.jpg$/', (string) $n1), (string) $n1);
check('eyni şəkil eyni ad', $n1 === $n2);
check('qovluqda tək fayl, müvəqqəti fayl qalmır', adminMediaCount($dir) === 1 && !glob($dir . '.tmp_*'));
check('URL forması', adminMediaUrl('aytac-ve-niyaz-51eedb', 'abc.png') === '/uploads/_admin/aytac-ve-niyaz-51eedb/abc.png');

/* təmizlik */
foreach (glob($tmp . '{,.}*', GLOB_BRACE) ?: [] as $f) { if (is_file($f)) @unlink($f); }
foreach (glob($dir . '{,.}*', GLOB_BRACE) ?: [] as $f) { if (is_file($f)) @unlink($f); }
@rmdir($dir); @rmdir($tmp);

echo "\n$pass keçdi, $fail uğursuz\n";
exit($fail ? 1 : 0);
