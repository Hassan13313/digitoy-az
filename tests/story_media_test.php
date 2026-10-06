<?php
/* ══════════════════════════════════════════════════
   «Bizim Hekayəmiz» şəkil saxlanması — regression testləri (Phase 44)

   Serversiz işləyir (yalnız GD lazımdır):
       php tests/story_media_test.php
══════════════════════════════════════════════════ */

require_once __DIR__ . '/../public/api/story_media.php';

$pass = 0; $fail = 0;
function check(string $name, bool $cond, string $extra = '') {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok   $name\n"; }
    else       { $fail++; echo "  FAIL $name" . ($extra ? " — $extra" : '') . "\n"; }
}

$tmpDir = sys_get_temp_dir() . '/story_media_test_' . bin2hex(random_bytes(4)) . '/';
mkdir($tmpDir, 0755, true);

function makeImage(string $path, int $w, int $h, string $kind): void {
    $im = imagecreatetruecolor($w, $h);
    imagefill($im, 0, 0, imagecolorallocate($im, 200, 120, 60));
    match ($kind) {
        'jpeg' => imagejpeg($im, $path, 90),
        'png'  => imagepng($im, $path),
        'webp' => imagewebp($im, $path, 80),
        'gif'  => imagegif($im, $path),
    };
    imagedestroy($im);
}

echo "sessiya ID-si\n";
check('UUID qəbul edilir', isValidStorySid('3f2b8c1e-7a4d-4e2b-9c1a-2b3c4d5e6f70'));
check('base36 ehtiyat ID qəbul edilir', isValidStorySid('k2j3h4g5f6d7s8a9l0q'));
foreach (['', 'qısa', '../../etc/passwd', 'abc def ghi jkl mno', str_repeat('a', 65), "abcdefghijklmnop\n"] as $bad) {
    check('yararsız: ' . json_encode($bad), !isValidStorySid($bad));
}
check('massiv yararsızdır', !isValidStorySid(['x']));

echo "\nbucket\n";
$b1 = storyBucket('3f2b8c1e-7a4d-4e2b-9c1a-2b3c4d5e6f70');
check('deterministikdir', $b1 === storyBucket('3f2b8c1e-7a4d-4e2b-9c1a-2b3c4d5e6f70'));
check('24 hex simvol', (bool) preg_match('/^[0-9a-f]{24}$/', $b1), $b1);
check('sid-in özünü sızdırmır', !str_contains($b1, '3f2b8c1e'));
check('fərqli sid → fərqli bucket', $b1 !== storyBucket('3f2b8c1e-7a4d-4e2b-9c1a-2b3c4d5e6f71'));
check('URL forması', storyPublicUrl($b1, 'abc.jpg') === "/uploads/_story/$b1/abc.jpg");

echo "\nyenidən kodlaşdırma\n";
foreach (['jpeg', 'png', 'webp'] as $kind) {
    $src = $tmpDir . "src.$kind";
    makeImage($src, 300, 200, $kind);
    $out = $tmpDir . "out_$kind.jpg";
    $r = storyReencode($src, $out);
    $info = @getimagesize($out);
    check("$kind → JPEG", $r['ok'] && $info && $info[2] === IMAGETYPE_JPEG, json_encode($r));
}

$big = $tmpDir . 'big.jpg';
makeImage($big, 3000, 1500, 'jpeg');
$r = storyReencode($big, $tmpDir . 'big_out.jpg');
check('uzun kənar STORY_MAX_EDGE-ə kiçilir', $r['ok'] && $r['width'] === STORY_MAX_EDGE && $r['height'] === 700, json_encode($r));

$small = $tmpDir . 'small.png';
makeImage($small, 120, 80, 'png');
$r = storyReencode($small, $tmpDir . 'small_out.jpg');
check('kiçik şəkil böyüdülmür', $r['ok'] && $r['width'] === 120 && $r['height'] === 80, json_encode($r));

$gif = $tmpDir . 'anim.gif';
makeImage($gif, 50, 50, 'gif');
$r = storyReencode($gif, $tmpDir . 'gif_out.jpg');
check('GIF rədd edilir', !$r['ok'] && $r['error'] === 'UNSUPPORTED', json_encode($r));
check('rədd ediləndə fayl yaranmır', !is_file($tmpDir . 'gif_out.jpg'));

$php = $tmpDir . 'shell.jpg';
file_put_contents($php, "<?php system(\$_GET['c']); ?>");
$r = storyReencode($php, $tmpDir . 'shell_out.jpg');
check('şəkil olmayan fayl rədd edilir', !$r['ok'] && $r['error'] === 'NOT_IMAGE', json_encode($r));

/* Polyglot: həqiqi JPEG + sonuna PHP kodu. Yenidən kodlaşdırma onu atmalıdır. */
$poly = $tmpDir . 'poly.jpg';
makeImage($poly, 64, 64, 'jpeg');
file_put_contents($poly, "<?php echo 'pwned'; ?>", FILE_APPEND);
$r = storyReencode($poly, $tmpDir . 'poly_out.jpg');
check('polyglot-dakı PHP kodu çıxışa düşmür',
      $r['ok'] && !str_contains((string) file_get_contents($tmpDir . 'poly_out.jpg'), '<?php'));

/* Decompression bomb: kiçik PNG, amma başlıqda 20000×20000 yazılıb.
   GD-yə heç verilməməlidir — yalnız başlıqdan rədd. */
$bomb = $tmpDir . 'bomb.png';
makeImage($bomb, 10, 10, 'png');
$bytes = file_get_contents($bomb);
$bytes = substr_replace($bytes, pack('N', 20000) . pack('N', 20000), 16, 8);
file_put_contents($bomb, $bytes);
$r = storyReencode($bomb, $tmpDir . 'bomb_out.jpg');
check('40 MP-dan böyük başlıq rədd edilir', !$r['ok'] && $r['error'] === 'TOO_MANY_PIXELS', json_encode($r));

echo "\nyerləşdirmə (commit)\n";
$bucketDir = $tmpDir . 'bucket/';
mkdir($bucketDir);
$a = $bucketDir . '.tmp_a.jpg';
copy($tmpDir . 'out_jpeg.jpg', $a);
$n1 = storyCommit($a, $bucketDir);
check('hash adı ilə yerləşir', $n1 !== null && (bool) preg_match('/^[0-9a-f]{20}\.jpg$/', $n1), (string) $n1);
check('müvəqqəti fayl qalmır', !is_file($a));

$b = $bucketDir . '.tmp_b.jpg';
copy($tmpDir . 'out_jpeg.jpg', $b);
touch($bucketDir . $n1, time() - 40 * 86400);
$n2 = storyCommit($b, $bucketDir);
check('eyni şəkil eyni ad alır', $n1 === $n2);
clearstatcache();
check('yenidən seçilən fayl təzələnir (retention silməsin)', time() - filemtime($bucketDir . $n1) < 60);
check('ikinci nüsxə yaranmır', storyBucketCount($bucketDir) === 1, (string) storyBucketCount($bucketDir));

file_put_contents($bucketDir . '.tmp_z.jpg', 'x');
check('müvəqqəti fayllar sayılmır', storyBucketCount($bucketDir) === 1);
check('olmayan qovluq 0 qaytarır', storyBucketCount($tmpDir . 'yoxdur/') === 0);

echo "\nmusiqi (Phase 44.3)\n";
$sid = '3f2b8c1e-7a4d-4e2b-9c1a-2b3c4d5e6f70';
check('musiqi bucket 24 hex', (bool) preg_match('/^[0-9a-f]{24}\z/', musicBucket($sid)));
check('musiqi bucket sabitdir', musicBucket($sid) === musicBucket($sid));
check('musiqi bucket hekayədən fərqlidir', musicBucket($sid) !== storyBucket($sid));
check('musiqi bucket sid-i ifşa etmir', !str_contains(musicBucket($sid), '3f2b8c1e'));
check('ictimai yol', musicPublicPath('abc', 'x.mp3') === '/uploads/_music/abc/x.mp3');
check('qovluq _music altındadır', str_ends_with(musicDir('abc'), '/uploads/_music/abc/'));
check('limit ağlabatandır', MUSIC_BUCKET_CAP >= 3 && MUSIC_BUCKET_CAP <= 10);
check('ölçü limiti 20 MB', MUSIC_MAX_UPLOAD === 20 * 1024 * 1024);

$musicDir = $tmpDir . 'music/';
mkdir($musicDir);
file_put_contents($tmpDir . 'a.mp3', 'ID3-demo-content-A');
file_put_contents($tmpDir . 'b.mp3', 'ID3-demo-content-B');
$ma = musicFileName($tmpDir . 'a.mp3');
check('hash adı .mp3', $ma !== null && (bool) preg_match('/^[0-9a-f]{20}\.mp3\z/', $ma), (string) $ma);
check('eyni məzmun eyni ad', $ma === musicFileName($tmpDir . 'a.mp3'));
check('fərqli məzmun fərqli ad', $ma !== musicFileName($tmpDir . 'b.mp3'));
check('olmayan fayl null', musicFileName($tmpDir . 'yoxdur.mp3') === null);
copy($tmpDir . 'a.mp3', $musicDir . $ma);
file_put_contents($musicDir . 'qeyd.txt', 'x');
check('yalnız .mp3 sayılır', musicBucketCount($musicDir) === 1, (string) musicBucketCount($musicDir));
check('olmayan musiqi qovluğu 0', musicBucketCount($tmpDir . 'yoxdur/') === 0);
foreach (glob($musicDir . '*') ?: [] as $f) if (is_file($f)) unlink($f);
@rmdir($musicDir);

/* Təmizlik */
foreach (glob($bucketDir . '{,.}*', GLOB_BRACE) ?: [] as $f) if (is_file($f)) unlink($f);
@rmdir($bucketDir);
foreach (glob($tmpDir . '*') ?: [] as $f) if (is_file($f)) unlink($f);
@rmdir($tmpDir);

echo "\n$pass keçdi, $fail uğursuz\n";
exit($fail === 0 ? 0 : 1);
