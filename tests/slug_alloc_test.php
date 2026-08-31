<?php
/* ══════════════════════════════════════════════════
   Kanonik slug ayırıcısı — regression testləri

   Ən vacib test: EYNİ ADLI İKİ CÜTLÜK.
   Phase 33-dən əvvəl şəkilçi substr(md5($slug.'digitoy'),0,6) idi — yəni
   adın funksiyası — və ikinci cütlük birincinin dəvətnaməsini səssizcə
   üstündən yazırdı. Bu test həmin davranışın qayıtmasının qarşısını alır.

   SQLite ilə işləyir (MySQL tələb etmir):
       php tests/slug_alloc_test.php
══════════════════════════════════════════════════ */

require_once __DIR__ . '/../public/api/slug_alloc.php';

$pass = 0; $fail = 0;
function check(string $name, bool $cond, string $extra = '') {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok   $name\n"; }
    else       { $fail++; echo "  FAIL $name" . ($extra ? " — $extra" : '') . "\n"; }
}

function freshDb(): PDO {
    $db = new PDO('sqlite::memory:');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('CREATE TABLE invitations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        form_data TEXT NOT NULL,
        draft_code TEXT UNIQUE
    )');
    return $db;
}

/** Endpoint-in davranışını təqlid et: həll et, sonra tətbiq et */
function saveInvitation(PDO $db, string $baseSlug, ?string $draftCode, string $data): array {
    $res = resolveCanonicalSlug($db, $baseSlug, $draftCode);
    if ($res['action'] === 'update_slug') {
        $db->prepare('UPDATE invitations SET form_data = ? WHERE slug = ?')
           ->execute([$data, $res['slug']]);
    } elseif ($res['action'] === 'update_code') {
        $db->prepare('UPDATE invitations SET form_data = ? WHERE draft_code = ?')
           ->execute([$data, $draftCode]);
    } else {
        $code = ($draftCode && preg_match(DRAFT_CODE_PATTERN, $draftCode)) ? $draftCode : null;
        $db->prepare('INSERT INTO invitations (slug, form_data, draft_code) VALUES (?,?,?)')
           ->execute([$res['slug'], $data, $code]);
    }
    return $res;
}

function rowCount(PDO $db): int {
    return (int) $db->query('SELECT COUNT(*) FROM invitations')->fetchColumn();
}
function dataFor(PDO $db, string $slug): ?string {
    $q = $db->prepare('SELECT form_data FROM invitations WHERE slug = ?');
    $q->execute([$slug]);
    $v = $q->fetchColumn();
    return $v === false ? null : (string) $v;
}

echo "eyni adlı iki cütlük (əsas məlumat itkisi ssenarisi)\n";
$db = freshDb();
$a = saveInvitation($db, 'aytekin-ve-ferid', 'DT-ABC234', 'BİRİNCİ CÜTLÜK');
$b = saveInvitation($db, 'aytekin-ve-ferid', 'DT-XYZ789', 'İKİNCİ CÜTLÜK');

check('iki fərqli slug alınır', $a['slug'] !== $b['slug'], "{$a['slug']} vs {$b['slug']}");
check('hər ikisi ayrıca sətirdir', rowCount($db) === 2, 'sətir sayı=' . rowCount($db));
check('REGRESSION: birinci cütlük ÜSTÜNDƏN YAZILMIR',
      dataFor($db, $a['slug']) === 'BİRİNCİ CÜTLÜK', dataFor($db, $a['slug']) ?? 'YOX');
check('ikinci cütlüyün öz məlumatı var',
      dataFor($db, $b['slug']) === 'İKİNCİ CÜTLÜK');
check('slug sifarişin öz kodundan törəyir',
      $a['slug'] === 'aytekin-ve-ferid-abc234', $a['slug']);
check('uploads qovluqları da ayrıdır', $a['slug'] !== $b['slug']);

echo "\nidempotentlik (təkrar approve dublikat yaratmır)\n";
$db = freshDb();
$r1 = saveInvitation($db, 'leyla-ve-murad', 'DT-QQQ111', 'v1');
$r2 = saveInvitation($db, 'leyla-ve-murad', 'DT-QQQ111', 'v2');
check('təkrar saxlama eyni slug qaytarır', $r1['slug'] === $r2['slug'], "{$r1['slug']} vs {$r2['slug']}");
check('dublikat sətir yaranmır', rowCount($db) === 1, 'sətir sayı=' . rowCount($db));
check('məzmun yenilənir', dataFor($db, $r1['slug']) === 'v2');

echo "\ngeriyə uyğunluq (köhnə linklər)\n";
$db = freshDb();
/* Köhnə format sətir — kodsuz, ad-əsaslı slug (canlıdakı aytekin-ve-ferid kimi) */
$db->exec("INSERT INTO invitations (slug, form_data) VALUES ('aytekin-ve-ferid', 'KÖHNƏ')");
$r = saveInvitation($db, 'aytekin-ve-ferid', null, 'YENİLƏNMİŞ');
check('köhnə slug qorunur (dəyişdirilmir)', $r['slug'] === 'aytekin-ve-ferid', $r['slug']);
check('köhnə sətir yenilənir, yenisi yaranmır', rowCount($db) === 1);
check('köhnə link işləməyə davam edir', dataFor($db, 'aytekin-ve-ferid') === 'YENİLƏNMİŞ');

/* Köhnə ad-slug MÖVCUD olsa belə, yeni cütlük ona toxunmamalıdır */
$r2 = saveInvitation($db, 'aytekin-ve-ferid', 'DT-NEW555', 'ÜÇÜNCÜ CÜTLÜK');
check('yeni cütlük köhnə sətirdən ayrılır', $r2['slug'] !== 'aytekin-ve-ferid', $r2['slug']);
check('köhnə cütlüyün məlumatı toxunulmur', dataFor($db, 'aytekin-ve-ferid') === 'YENİLƏNMİŞ');

echo "\ntoqquşma (kod şəkilçisi artıq tutulub)\n";
$db = freshDb();
$db->exec("INSERT INTO invitations (slug, form_data) VALUES ('nigar-ve-elvin-abc234', 'BAŞQASI')");
$r = saveInvitation($db, 'nigar-ve-elvin', 'DT-ABC234', 'YENİ');
check('tutulmuş şəkilçi yenidən istifadə edilmir', $r['slug'] !== 'nigar-ve-elvin-abc234', $r['slug']);
check('mövcud sətir üstündən yazılmır', dataFor($db, 'nigar-ve-elvin-abc234') === 'BAŞQASI');
check('yeni sətir əlavə olunur', rowCount($db) === 2);

echo "\nkodsuz cütlüklər (əl ilə yaradılan)\n";
$db = freshDb();
$slugs = [];
for ($i = 0; $i < 25; $i++) {
    $slugs[] = saveInvitation($db, 'eyni-ad', null, "cütlük-$i")['slug'];
}
check('25 eyni adlı cütlük — hamısı unikal', count(array_unique($slugs)) === 25,
      'unikal=' . count(array_unique($slugs)));
check('25 ayrıca sətir', rowCount($db) === 25, 'sətir sayı=' . rowCount($db));
$lost = 0;
foreach ($slugs as $i => $sl) { if (dataFor($db, $sl) !== "cütlük-$i") $lost++; }
check('heç bir cütlüyün məlumatı itmir', $lost === 0, "$lost itdi");

echo "\nyararsız draft_code təhlükəsiz idarə olunur\n";
$db = freshDb();
foreach (['', 'zibil', 'DT-abc', "DT-ABC234'; DROP TABLE invitations;--"] as $bad) {
    $r = saveInvitation($db, 'test-cutluk', $bad, 'data');
    check("yararsız kod qəbul edilmir: '" . substr($bad, 0, 20) . "'",
          $r['slug'] !== 'test-cutluk-abc234' && str_starts_with($r['slug'], 'test-cutluk-'), $r['slug']);
}
check('cədvəl sağdır (SQL injection yoxdur)', rowCount($db) === 4, 'sətir sayı=' . rowCount($db));

echo "\n$pass keçdi, $fail uğursuz\n";
exit($fail === 0 ? 0 : 1);
