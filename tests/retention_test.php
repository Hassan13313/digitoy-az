<?php
/* ══════════════════════════════════════════════════
   Phase 47 — avtomatik məlumat təmizləmə (public/api/retention.php)

   İşə salma:  php tests/retention_test.php
   DB TƏLƏB ETMİR — SQLite yaddaşda + müvəqqəti qovluq.

   Ən təhlükəli hissə draft fayllarıdır: bucket brauzerə bağlıdır, ona görə
   tərk edilmiş draft-ın qovluğunda CANLI dəvətnamənin şəkli də ola bilər
   (Phase 46.1-də paylaşılan hekayə şəkli məhz belə silinmişdi).
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

require_once __DIR__ . '/../public/api/retention.php';

$NOW    = strtotime('2026-10-06 12:00:00 UTC');
$DB_NOW = '2026-10-06 12:00:00';
$day    = 86400;
$ago    = fn (int $d) => gmdate('Y-m-d H:i:s', $NOW - $d * 86400);
$enc    = fn ($a) => json_encode($a, JSON_UNESCAPED_UNICODE);   /* DB-dəki forma: «\/» */

function freshDb(): PDO {
    $db = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    $db->exec("CREATE TABLE invitations (slug TEXT, draft_code TEXT, form_data TEXT)");
    $db->exec("CREATE TABLE draft_invitations (id INTEGER PRIMARY KEY, draft_code TEXT, session_id TEXT, status TEXT,
               approved_slug TEXT, form_data TEXT, updated_at TEXT, expires_at TEXT)");
    $db->exec("CREATE TABLE admin_audit (id INTEGER PRIMARY KEY, action TEXT, slug TEXT, actor TEXT, ip TEXT, detail TEXT,
               created_at TEXT DEFAULT CURRENT_TIMESTAMP)");
    $db->exec("CREATE TABLE gallery_events (id INTEGER PRIMARY KEY, slug TEXT, event_type TEXT, ip_hash TEXT, created_at TEXT)");
    $db->exec("CREATE TABLE schema_meta (meta_key TEXT PRIMARY KEY, meta_value TEXT)");
    return $db;
}
function mkfile(string $path, int $mtime): void {
    @mkdir(dirname($path), 0777, true);
    file_put_contents($path, 'x');
    touch($path, $mtime);
}
function rmtree(string $p): void {
    if (is_file($p) || is_link($p)) { @unlink($p); return; }
    foreach ((array) @scandir($p) as $e) if ($e !== '.' && $e !== '..') rmtree("$p/$e");
    @rmdir($p);
}

/* ── 0. Kəsim tarixi ── */
ok('kəsim DB saatından hesablanır', retentionCut($DB_NOW, 90) === '2026-07-08 12:00:00');

/* ── 1. admin_audit.ip → NULL, sətir qalır ── */
$db = freshDb();
$ins = $db->prepare('INSERT INTO admin_audit (action, ip, created_at) VALUES (:a, :ip, :c)');
$ins->execute([':a' => 'old', ':ip' => '1.2.3.4', ':c' => $ago(91)]);
$ins->execute([':a' => 'new', ':ip' => '5.6.7.8', ':c' => $ago(10)]);
$cut = retentionCut($DB_NOW, RET_AUDIT_IP_DAYS);
ok('dry run sayır, dəyişmir', retentionNullColumn($db, 'admin_audit', 'ip', $cut, true) === 1
   && $db->query("SELECT ip FROM admin_audit WHERE action='old'")->fetchColumn() === '1.2.3.4');
ok('köhnə IP NULL olur', retentionNullColumn($db, 'admin_audit', 'ip', $cut, false) === 1);
$rows = $db->query('SELECT action, ip FROM admin_audit ORDER BY id')->fetchAll();
ok('sətirlər silinmir, yeni IP qalır', $rows === [['action' => 'old', 'ip' => null], ['action' => 'new', 'ip' => '5.6.7.8']]);
ok('ikinci dəfə heç nə', retentionNullColumn($db, 'admin_audit', 'ip', $cut, false) === 0);

/* ── 2. gallery_events.ip_hash → 7 gün ── */
$ins = $db->prepare('INSERT INTO gallery_events (slug, event_type, ip_hash, created_at) VALUES (:s, :t, :h, :c)');
$ins->execute([':s' => 'a', ':t' => 'visit', ':h' => 'abcd', ':c' => $ago(8)]);
$ins->execute([':s' => 'a', ':t' => 'visit', ':h' => 'ef01', ':c' => $DB_NOW]);
ok('8 günlük hash NULL, bugünkü qalır',
   retentionNullColumn($db, 'gallery_events', 'ip_hash', retentionCut($DB_NOW, RET_GALLERY_IP_DAYS), false) === 1
   && $db->query('SELECT COUNT(*) FROM gallery_events WHERE ip_hash IS NULL')->fetchColumn() == 1
   && $db->query('SELECT COUNT(*) FROM gallery_events')->fetchColumn() == 2);

/* ── 3. Temp faylları: yalnız dəqiq ad + köhnə ── */
$tmp = sys_get_temp_dir() . '/dt_ret_tmp_' . getmypid();
$h64 = str_repeat('a', 64);
mkfile("$tmp/digitoy_rl_$h64.json", $NOW - 2 * $day);                 /* silinir */
mkfile("$tmp/digitoy_rl_" . str_repeat('b', 64) . '.json', $NOW - 3600); /* təzə */
mkfile("$tmp/digitoy_rl_$h64.json.bak", $NOW - 2 * $day);            /* başqa ad */
mkfile("$tmp/digitoy_rl_short.json", $NOW - 2 * $day);               /* başqa ad */
mkfile("$tmp/other_$h64.json", $NOW - 2 * $day);                     /* başqa prefiks */
mkfile("$tmp/digitoy_seo2_$h64.json", $NOW - 2 * $day);              /* SEO keş */
mkfile("$tmp/digitoy_seo_$h64.txt", $NOW - 2 * $day);                /* köhnə SEO keş */
ok('dry run: 3 sayılır (rate-limit + 2 SEO keş), silinmir', retentionSweepTemp($tmp, $NOW, true) === 3 && is_file("$tmp/digitoy_rl_$h64.json"));
ok('köhnə rate-limit və SEO keşləri silinir', retentionSweepTemp($tmp, $NOW, false) === 3 && !is_file("$tmp/digitoy_rl_$h64.json")
   && !is_file("$tmp/digitoy_seo2_$h64.json") && !is_file("$tmp/digitoy_seo_$h64.txt"));
ok('təzə və başqa adlı fayllar qalır', is_file("$tmp/digitoy_rl_" . str_repeat('b', 64) . '.json')
   && is_file("$tmp/digitoy_rl_$h64.json.bak") && is_file("$tmp/digitoy_rl_short.json") && is_file("$tmp/other_$h64.json"));
ok('olmayan qovluq → 0', retentionSweepTemp("$tmp/yoxdur", $NOW, false) === 0);
rmtree($tmp);

/* ── 4. Media logları: tarix fayl adından ── */
$logs = sys_get_temp_dir() . '/dt_ret_logs_' . getmypid();
mkfile("$logs/media-2026-08-01.log", $NOW);   /* 66 gün — silinir (mtime təzə olsa da) */
mkfile("$logs/media-2026-09-20.log", $NOW);   /* 16 gün — qalır */
mkfile("$logs/media-2026-08-01.log.gz", $NOW);
mkfile("$logs/retention.stamp", $NOW - 90 * $day);
ok('yalnız 30 gündən köhnə media logu', retentionSweepMediaLogs($logs, $NOW, false) === 1 && !is_file("$logs/media-2026-08-01.log"));
ok('digərləri qalır', is_file("$logs/media-2026-09-20.log") && is_file("$logs/media-2026-08-01.log.gz") && is_file("$logs/retention.stamp"));
rmtree($logs);

/* ── 5. Draft-lar və faylları ── */
$up  = sys_get_temp_dir() . '/dt_ret_up_' . getmypid();
$old = $NOW - 40 * $day;
$SID_A = 'aaaaaaaa-1111-2222-3333-444444444444';   /* tərk edilmiş, tək sətir */
$SID_B = 'bbbbbbbb-1111-2222-3333-444444444444';   /* tərk edilmiş, sonra sifariş verib */
$SID_C = 'cccccccc-1111-2222-3333-444444444444';   /* 10 gün əvvəl yenilənib */
$bA = storyBucket($SID_A); $mA = musicBucket($SID_A); $bB = storyBucket($SID_B);
$f = fn (string $n) => str_repeat($n, 20);   /* 20 hex simvol */
$ownA    = "_story/$bA/" . $f('1') . '.jpg';   /* form_data-da, yalnız A */
$sharedA = "_story/$bA/" . $f('2') . '.jpg';   /* bucket-də, CANLI dəvətnamə «\/» ilə işlədir */
$looseA  = "_story/$bA/" . $f('3') . '.jpg';   /* bucket-də, form_data-da yox (dəyişdirilmiş şəkil) */
$freshA  = "_story/$bA/" . $f('4') . '.jpg';   /* bucket-də, təzə (təkrar yüklənib → touch) */
$musA    = "_music/$mA/" . $f('5') . '.mp3';
$tmpA    = "_story/$bA/.tmp_" . str_repeat('6', 16) . '.jpg';
$ordB    = "_story/$bB/" . $f('7') . '.jpg';   /* B-nin sifarişi də işlədir */
$looseB  = "_story/$bB/" . $f('8') . '.jpg';   /* bucket-də — A qoruyucusu: siyahıya baxılmır */
foreach ([$ownA, $sharedA, $looseA, $musA, $tmpA, $ordB, $looseB] as $rel) mkfile("$up/$rel", $old);
mkfile("$up/$freshA", $NOW - 2 * $day);
mkfile("$up/_story/evil.jpg", $old);

$db = freshDb();
$db->exec("INSERT INTO invitations VALUES ('canli-toy-ab12cd', 'DT-LIVE01', " . $db->quote($enc(['loveStory' => [['photos' => ['/uploads/' . $sharedA]]]])) . ")");
$ins = $db->prepare('INSERT INTO draft_invitations (id, draft_code, session_id, status, form_data, updated_at, expires_at)
                     VALUES (:i, :c, :s, :st, :f, :u, :e)');
$draft = function (int $id, string $sid, string $status, array $fd, int $updDays, ?string $code = null) use ($ins, $enc, $ago) {
    $ins->execute([':i' => $id, ':c' => $code, ':s' => $sid, ':st' => $status, ':f' => $enc($fd), ':u' => $ago($updDays), ':e' => $ago($updDays - 7)]);
};
$draft(1, $SID_A, 'draft', ['s' => ['/uploads/' . $ownA, '/uploads/' . $sharedA, '/uploads/_story/../../evil.jpg'], 'm' => 'https://digitoy.az/uploads/' . $musA], 40);
$draft(2, $SID_B, 'draft', ['s' => ['/uploads/' . $ordB]], 40);
$draft(3, $SID_B, 'submitted', ['s' => ['/uploads/' . $ordB]], 40, 'DT-SUBM01');
$draft(4, $SID_C, 'draft', [], 10);
$draft(5, 'dddddddd-1111-2222-3333-444444444444', 'deleted', [], 60, 'DT-DEL001');
$draft(6, 'eeeeeeee-1111-2222-3333-444444444444', 'approved', [], 60, 'DT-APPR01');
$draft(7, 'ffffffff-1111-2222-3333-444444444444', 'rejected', [], 60, 'DT-REJ001');
$draft(8, 'short', 'draft', [], 40);   /* yararsız sid → bucket siyahısı yoxdur */

$deadline = microtime(true) + 20;
ok('status sayı silmə ilə eyni qaydadır (1, 2, 8)', retentionDraftCount($db, $DB_NOW) === 3);
$r = retentionPurgeDrafts($db, $up, $DB_NOW, $NOW, true, $deadline);
ok('dry run: 3 draft sayılır, heç nə silinmir', $r['drafts'] === 3 && $db->query('SELECT COUNT(*) FROM draft_invitations')->fetchColumn() == 8
   && is_file("$up/$ownA") && is_file("$up/$looseA"));

$r = retentionPurgeDrafts($db, $up, $DB_NOW, $NOW, false, $deadline);
$left = $db->query('SELECT id FROM draft_invitations ORDER BY id')->fetchAll(PDO::FETCH_COLUMN);
ok('yalnız 30+ gün toxunulmamış draft-lar silinir (1, 2, 8)', $r['drafts'] === 3 && array_map('intval', $left) === [3, 4, 5, 6, 7]);
ok('A-nın öz faylları silinir (forma + bucket + musiqi + .tmp_)',
   !is_file("$up/$ownA") && !is_file("$up/$looseA") && !is_file("$up/$musA") && !is_file("$up/$tmpA"));
ok('CANLI dəvətnamənin «\\/» ilə saxlanmış şəkli QALIR (46.1 regressiyası)', is_file("$up/$sharedA"));
ok('təzə (touch edilmiş) fayl qalır', is_file("$up/$freshA"));
ok('sifarişin də işlətdiyi fayl qalır', is_file("$up/$ordB"));
ok('eyni sessiyanın başqa sətri var → bucket siyahısına baxılmır', is_file("$up/$looseB"));
ok('../ yolu ilə kənar fayla toxunulmur', is_file("$up/_story/evil.jpg"));
ok('silinən fayl sayı dəqiqdir', $r['files'] === 4);
ok('boşalmayan bucket qovluğu qalır', is_dir("$up/_story/$bA"));
ok('boşalan musiqi qovluğu silinir', !is_dir("$up/_music/$mA"));

/* Yoxlama ilə silmə arasında sətir yenilənibsə fayllara toxunulmur */
$db->exec("INSERT INTO draft_invitations (id, session_id, status, form_data, updated_at, expires_at) VALUES
           (9, 'gggggggg-1111-2222-3333-444444444444', 'draft', " . $db->quote($enc(['s' => ['/uploads/' . $looseB]])) . ", '" . $ago(40) . "', '" . $ago(33) . "')");
$db->exec("CREATE TRIGGER bump BEFORE DELETE ON draft_invitations WHEN OLD.id = 9 BEGIN SELECT RAISE(IGNORE); END");
$r = retentionPurgeDrafts($db, $up, $DB_NOW, $NOW, false, $deadline);
ok('DELETE 0 sətir → fayllar qalır', $r['drafts'] === 0 && is_file("$up/$looseB"));
ok('silinəndən sonra say yenilənir (yalnız 9 qalıb)', retentionDraftCount($db, $DB_NOW) === 1);
$db->exec('DROP TRIGGER bump');

/* ── 6. Sahibsiz bucket hesabatı (heç nə silmir) ── */
mkfile("$up/_story/" . str_repeat('9', 24) . '/' . $f('a') . '.jpg', $NOW - 100 * $day);
mkfile("$up/_story/" . str_repeat('8', 24) . '/' . $f('b') . '.jpg', $NOW - 5 * $day);
$o = retentionOrphanReport($db, $up, $NOW);
/* bA (sessiyası silinib) da sahibsizdir, amma içində 2 günlük fayl var → sayılmır */
ok('yalnız 90+ günlük sahibsiz bucket sayılır, silinmir', $o['buckets'] === 1 && is_dir("$up/_story/" . str_repeat('9', 24)));

/* ── 7. Gündə bir dəfə + kilid + jurnal ── */
$db2   = freshDb();
$stamp = sys_get_temp_dir() . '/dt_ret_stamp_' . getmypid() . '/retention.stamp';
$opt   = ['now' => $NOW, 'dbNow' => $DB_NOW, 'uploads' => "$up/yoxdur", 'tmp' => "$up/yoxdur", 'logs' => "$up/yoxdur", 'stamp' => $stamp];
$db2->exec("INSERT INTO admin_audit (action, ip, created_at) VALUES ('x', '9.9.9.9', '" . $ago(100) . "')");

$res = maybeRunRetention($db2, $opt);
ok('ilk çağırış işləyir', is_array($res) && $res['audit_ip'] === 1 && $res['dry'] === false);
ok('gündəlik işdə sahibsiz bucket hesabatı yoxdur', !array_key_exists('orphans', $res) && array_key_exists('temp_files', $res));
ok('möhür faylı yaranır', is_file($stamp));
$log = $db2->query("SELECT actor, ip, detail FROM admin_audit WHERE action = 'retention_run'")->fetchAll();
ok('tək jurnal sətri, IP NULL, actor system', count($log) === 1 && $log[0]['ip'] === null && $log[0]['actor'] === 'system:retention'
   && strlen($log[0]['detail']) <= 500 && json_decode($log[0]['detail'], true)['audit_ip'] === 1);
ok('24 saat ərzində ikinci çağırış → null', maybeRunRetention($db2, $opt) === null);
@unlink($stamp);
ok('möhür silinsə də DB kilidi saxlayır', maybeRunRetention($db2, ['now' => $NOW + 3600] + $opt) === null);
ok('25 saat sonra yenidən işləyir', is_array(maybeRunRetention($db2, ['now' => $NOW + 25 * 3600] + $opt)));
ok('force 24 saatı gözləmir', is_array(maybeRunRetention($db2, ['now' => $NOW + 26 * 3600, 'force' => true] + $opt)));
$before = $db2->query("SELECT COUNT(*) FROM admin_audit WHERE action = 'retention_run'")->fetchColumn();
$dry = maybeRunRetention($db2, ['dry' => true] + $opt);
ok('önizləmədə sahibsiz bucket hesabatı var', isset($dry['orphans']['buckets']));
ok('dry run jurnala yazılmır, kilidə toxunmur', $dry['dry'] === true
   && $db2->query("SELECT COUNT(*) FROM admin_audit WHERE action = 'retention_run'")->fetchColumn() == $before);

/* Kilid yarışı: oxuduqdan sonra başqa sorğu dəyəri dəyişibsə işləmir */
class RaceDb extends PDO {
    public function prepare(string $q, array $o = []): PDOStatement|false {
        if (str_starts_with($q, 'UPDATE schema_meta')) $this->exec("UPDATE schema_meta SET meta_value = '424242' WHERE meta_key = 'retention_last_run'");
        return parent::prepare($q, $o);
    }
}
$race = new RaceDb('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
$race->exec("CREATE TABLE schema_meta (meta_key TEXT PRIMARY KEY, meta_value TEXT)");
$race->exec("CREATE TABLE admin_audit (id INTEGER PRIMARY KEY, action TEXT, slug TEXT, actor TEXT, ip TEXT, detail TEXT, created_at TEXT)");
@unlink($stamp);
ok('kilidi itirən sorğu işləmir', maybeRunRetention($race, $opt) === null);

$st = retentionStatus($db2);
ok('status son işi və müddətləri qaytarır', $st['last']['result']['dry'] === false && $st['periods']['draft_days'] === 30);

rmtree(dirname($stamp));
rmtree($up);

echo "\n$passed ok, $failed FAIL\n";
exit($failed ? 1 : 0);
