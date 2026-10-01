<?php
/* ══════════════════════════════════════════════════
   Phase 46 — dəvətnaməni birdəfəlik silmə: FAYL qatının təhlükəsizliyi

   İşə salma:  php tests/admin_purge_test.php
   DB TƏLƏB ETMİR — admin_purge.php-dəki saf funksiyalar yoxlanılır.

   Ən təhlükəli hissə fayl silməkdir: yanlış yol bütün uploads/ qovluğunu
   və ya başqa toyun şəkillərini silə bilər. Qorunmalı olanlar:
     1. Yalnız bu slug-un öz qovluqları (uploads/<slug>, _admin/<slug>,
        music/<slug>) — `..`, `/`, boş slug QƏBUL OLUNMUR.
     2. form_data-dan yalnız _story/ və _music/ altındakı FAYLLAR götürülür
        (qovluq, ../, başqa yer yox).
     3. Real yol uploads/ kökündən kənara çıxa bilməz (symlink/.. daxil).
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

$src = file_get_contents(__DIR__ . '/../public/api/admin_purge.php');
foreach (['purgeSlugDirs', 'purgeReferencedFiles', 'purgeSafePath', 'purgeLikePattern'] as $fn) {
    if (!preg_match('/\nfunction ' . $fn . '\(.*?\n\}/s', $src, $m)) {
        echo "FAIL: `$fn` admin_purge.php-də tapılmadı\n";
        exit(1);
    }
    eval($m[0]);
}

/* ── 1. Slug qovluqları ── */
$dirs = purgeSlugDirs('/srv/up', 'aysel-ve-tural-ab12cd');
ok('3 qovluq qaytarılır', $dirs === ['/srv/up/aysel-ve-tural-ab12cd', '/srv/up/_admin/aysel-ve-tural-ab12cd', '/srv/up/music/aysel-ve-tural-ab12cd']);
foreach (['', '..', '../x', 'a/b', '_admin', '.hidden', 'a..b/c', 'music', 'MUSIC', '_music', '_story'] as $bad) {
    ok('təhlükəli slug rədd: ' . var_export($bad, true), purgeSlugDirs('/srv/up', $bad) === []);
}

/* ── 2. form_data-dakı fayl istinadları ── */
$fd = [
    'music'     => ['file' => 'https://digitoy.az/uploads/_music/5cb7b63c72b650b7/c2e47f.mp3'],
    'loveStory' => [
        ['photos' => ['/uploads/_story/cb4c4e66dcc2/deeb098e.jpg', '/uploads/_story/cb4c4e66dcc2/deeb098e.jpg']],
        ['photos' => ['/uploads/_story/../../api/config.production.php', '/uploads/_story/x/', '/music/perfect.mp3']],
    ],
    'admin'     => ['story' => ['ch' => ['c0' => ['photos' => [0, '/uploads/_admin/slug-x/a.jpg']]]]],
    'other'     => '/uploads/other-slug/1.jpg',
    'evil'      => '/uploads/_music/a/../../../etc/passwd',
];
$refs = purgeReferencedFiles($fd);
sort($refs);
ok('yalnız _story/_music faylları, təkrarsız', $refs === ['_music/5cb7b63c72b650b7/c2e47f.mp3', '_story/cb4c4e66dcc2/deeb098e.jpg']);
ok('boş form_data → boş', purgeReferencedFiles([]) === []);

/* ── 2b. Ortaq fayl axtarışı DB-dəki JSON-a uyğun gəlməlidir ──
   save_invitation/save_draft form_data-nı JSON_UNESCAPED_UNICODE ilə yazır —
   slash-lar «\/» kimi saxlanılır. Əvvəlki «%/uploads/_story/…%» nümunəsi
   bunu tapmırdı → başqa dəvətnamənin hekayə şəkli də silinirdi (test.digitoy.az). */
function likeMatches(string $pattern, string $subject): bool {   /* MySQL LIKE … ESCAPE '!' */
    $re = '';
    for ($i = 0, $n = strlen($pattern); $i < $n; $i++) {
        $c = $pattern[$i];
        if ($c === '!' && $i + 1 < $n) { $re .= preg_quote($pattern[++$i], '#'); continue; }
        $re .= $c === '%' ? '.*' : ($c === '_' ? '.' : preg_quote($c, '#'));
    }
    return (bool) preg_match('#^' . $re . '$#s', $subject);
}
$rel   = '_story/cb4c4e66dcc2fdfc6b2479b3/deeb098e88e2084b8eb7.jpg';
$other = ['loveStory' => ['chapters' => [['photos' => ['/uploads/' . $rel]]]], 'brideName' => 'Gəlin'];
$pat   = purgeLikePattern($rel);
ok('DB formasında (\\/) tapılır', likeMatches($pat, json_encode($other, JSON_UNESCAPED_UNICODE)));
ok('qaçışsız formada da tapılır', likeMatches($pat, json_encode($other, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)));
ok('tam URL formasında da tapılır', likeMatches($pat, json_encode(['p' => 'https://digitoy.az/uploads/' . $rel])));
ok('başqa fayl → tapılmır', !likeMatches($pat, json_encode(['p' => '/uploads/_story/cb4c4e66dcc2fdfc6b2479b3/aaaa098e88e2084b8eb7.jpg'])));
ok('_ joker deyil (literal)', !likeMatches(purgeLikePattern('_music/ab/c.mp3'), json_encode(['p' => '/uploads/Xmusic/ab/c.mp3'])));

/* ── 3. Real yol uploads kökündən çıxa bilməz ── */
$root = sys_get_temp_dir() . '/dt_purge_test_' . getmypid();
@mkdir($root . '/_story/b1', 0777, true);
@mkdir($root . '/slug-a', 0777, true);
file_put_contents($root . '/_story/b1/p.jpg', 'x');
$outside = sys_get_temp_dir() . '/dt_purge_outside_' . getmypid() . '.txt';
file_put_contents($outside, 'keep');

ok('kök daxilində fayl qəbul', purgeSafePath($root, '_story/b1/p.jpg') === realpath($root . '/_story/b1/p.jpg'));
ok('kök daxilində qovluq qəbul', purgeSafePath($root, 'slug-a') === realpath($root . '/slug-a'));
ok('mövcud olmayan → null', purgeSafePath($root, '_story/b1/none.jpg') === null);
ok('kökün özü → null', purgeSafePath($root, '') === null && purgeSafePath($root, '.') === null);
ok('../ ilə çıxış → null', purgeSafePath($root, '../' . basename($outside)) === null);

@unlink($root . '/_story/b1/p.jpg'); @rmdir($root . '/_story/b1'); @rmdir($root . '/_story'); @rmdir($root . '/slug-a'); @rmdir($root);
ok('kənar fayl toxunulmayıb', is_file($outside)); @unlink($outside);

echo "\n$passed ok, $failed FAIL\n";
exit($failed ? 1 : 0);
