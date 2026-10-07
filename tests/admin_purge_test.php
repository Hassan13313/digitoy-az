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

/* Phase 47: köməkçilər purge_lib.php-yə köçdü (yan təsirsiz, birbaşa yüklənir) */
require_once __DIR__ . '/../public/api/purge_lib.php';
$ep = file_get_contents(__DIR__ . '/../public/api/admin_purge.php');
ok('admin_purge.php purge_lib.php-ni qoşur', strpos($ep, "require_once __DIR__ . '/purge_lib.php';") !== false);
ok('admin_purge.php-də köməkçi təkrarı yoxdur', strpos($ep, 'function purgeOwnRefs') === false);

/* ── 1. Slug qovluqları ── */
$dirs = purgeSlugDirs('/srv/up', 'aysel-ve-tural-ab12cd');
ok('3 qovluq qaytarılır', $dirs === ['/srv/up/aysel-ve-tural-ab12cd', '/srv/up/_admin/aysel-ve-tural-ab12cd', '/srv/up/music/aysel-ve-tural-ab12cd']);
/* Phase 48 — adsız dəvətnamə «-ve--xlcn9k» (prod) tire ilə başlayır: isValidSlug onu
   qəbul edir, amma silmə 400 verirdi və dəvətnamə heç cür silinə bilmirdi */
ok('tire ilə başlayan slug da silinə bilir', purgeSlugDirs('/srv/up', '-ve--xlcn9k') === ['/srv/up/-ve--xlcn9k', '/srv/up/_admin/-ve--xlcn9k', '/srv/up/music/-ve--xlcn9k']);
foreach (['', '..', '../x', 'a/b', '_admin', '.hidden', 'a..b/c', 'music', 'MUSIC', '_music', '_story', '-', '--', '-.', 'a\\b'] as $bad) {
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

/* ── 4. «Silinmiş» sifarişlərin birdəfəlik silinməsi (ultrareview, PR #1) ──
   a) CANLI dəvətnaməyə bağlı sifariş SİLİNMİR (soft delete «geri alına bilər» deyir);
   b) silinən sifarişin öz _story/_music faylları da silinir, ortaqlar qalır.
   Real SQL — SQLite yaddaşda (LIKE … ESCAPE '!' eyni işləyir). */
$db = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
$db->exec("CREATE TABLE invitations (slug TEXT, draft_code TEXT, form_data TEXT)");
$db->exec("CREATE TABLE draft_invitations (id INTEGER PRIMARY KEY, draft_code TEXT, status TEXT, approved_slug TEXT, form_data TEXT)");
$enc = fn ($a) => json_encode($a, JSON_UNESCAPED_UNICODE);   /* DB-dəki forma: «\/» */
$own = '_story/aaaa1111/own1.jpg'; $shr = '_story/aaaa1111/shared1.jpg'; $mus = '_music/bbbb2222/song1.mp3';
$db->exec("INSERT INTO invitations VALUES ('canli-toy-ab12cd', 'DT-LIVE01', " . $db->quote($enc(['p' => '/uploads/' . $shr])) . ")");
$ins = $db->prepare('INSERT INTO draft_invitations VALUES (:i, :c, :s, :a, :f)');
$ins->execute([':i' => 1, ':c' => 'DT-GONE01', ':s' => 'deleted', ':a' => null,               ':f' => $enc(['s' => ['/uploads/' . $own, '/uploads/' . $shr], 'm' => 'https://digitoy.az/uploads/' . $mus])]);
$ins->execute([':i' => 2, ':c' => 'DT-LIVE01', ':s' => 'deleted', ':a' => 'canli-toy-ab12cd', ':f' => $enc([])]);   /* təsdiqlənib, sonra soft delete */
$ins->execute([':i' => 3, ':c' => 'DT-OTHER1', ':s' => 'deleted', ':a' => 'canli-toy-ab12cd', ':f' => $enc([])]);   /* yalnız approved_slug ilə bağlı */
$ins->execute([':i' => 4, ':c' => 'DT-ACTIV1', ':s' => 'submitted', ':a' => null,             ':f' => $enc(['s' => ['/uploads/' . $mus]])]);

$all = $db->query("SELECT id, draft_code, approved_slug, form_data FROM draft_invitations WHERE status = 'deleted' ORDER BY id")->fetchAll();
$linked = purgeLinkedOrders($db, $all);
ok('canlı dəvətnaməyə bağlılar tapılır (draft_code və approved_slug)', $linked === [2 => 'canli-toy-ab12cd', 3 => 'canli-toy-ab12cd']);

$root = sys_get_temp_dir() . '/dt_purge_orders_' . getmypid();
@mkdir($root . '/_story/aaaa1111', 0777, true); @mkdir($root . '/_music/bbbb2222', 0777, true);
foreach ([$own, $shr, $mus] as $rel) file_put_contents($root . '/' . $rel, 'x');

$res = purgeOrders($db, $root, $all);
$left = $db->query("SELECT draft_code FROM draft_invitations ORDER BY id")->fetchAll(PDO::FETCH_COLUMN);
ok('yalnız bağlı olmayan sifariş silinir', $res['deleted'] === 1 && $left === ['DT-LIVE01', 'DT-OTHER1', 'DT-ACTIV1']);
ok('saxlananlar kodla qaytarılır', $res['kept'] === ['DT-LIVE01', 'DT-OTHER1']);
ok('sifarişin öz hekayə şəkli silinir', !is_file($root . '/' . $own) && $res['files'] === 1);
ok('canlı dəvətnamənin ortaq şəkli qalır', is_file($root . '/' . $shr));
ok('aktiv sifarişin musiqisi qalır', is_file($root . '/' . $mus));

$one = $db->query("SELECT id, draft_code, approved_slug, form_data FROM draft_invitations WHERE draft_code = 'DT-LIVE01'")->fetchAll();
$r1 = purgeOrders($db, $root, $one);
ok('tək bağlı sifariş də silinmir', $r1['deleted'] === 0 && $r1['kept'] === ['DT-LIVE01']);
ok('boş siyahı → heç nə', purgeOrders($db, $root, []) === ['deleted' => 0, 'files' => 0, 'kept' => []]);

/* ── 5. purgeUnsharedRefs: adı verilən fayllar (retention.php bucket skanı üçün) ── */
$db->exec("INSERT INTO invitations VALUES ('ikinci-toy-cd34ef', '', " . $db->quote($enc(['m' => 'https://digitoy.az/uploads/' . $mus])) . ")");
$rels = [$shr, $mus, '_story/aaaa1111/tek.jpg'];
ok('ortaq olmayanlar qaytarılır (\\/ formasında da)', purgeUnsharedRefs($db, $rels, '', []) === ['_story/aaaa1111/tek.jpg']);
ok('istisna slug sayılmır', purgeUnsharedRefs($db, [$shr], 'canli-toy-ab12cd', []) === [$shr]);
ok('istisna sifariş sayılmır', purgeUnsharedRefs($db, [$mus], 'ikinci-toy-cd34ef', [4]) === [$mus]);
ok('boş siyahı → boş', purgeUnsharedRefs($db, [], '', []) === []);
ok('purgeOwnRefs eyni nəticəni verir',
   purgeOwnRefs($db, ['x' => '/uploads/' . $shr, 'y' => '/uploads/_story/aaaa1111/tek.jpg'], '', []) === ['_story/aaaa1111/tek.jpg']);

foreach ([$shr, $mus] as $rel) @unlink($root . '/' . $rel);
@rmdir($root . '/_story/aaaa1111'); @rmdir($root . '/_music/bbbb2222'); @rmdir($root . '/_story'); @rmdir($root . '/_music'); @rmdir($root);

echo "\n$passed ok, $failed FAIL\n";
exit($failed ? 1 : 0);
