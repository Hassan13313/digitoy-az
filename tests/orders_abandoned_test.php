<?php
/* ══════════════════════════════════════════════════
   Phase 50 — admin «Sifarişlər» → «Yarımçıq» tabı (get_orders_list.php)

   İşə salma:  php tests/orders_abandoned_test.php     (SQLite, MySQL tələb etmir)

   «Yarımçıq» = builderdə nömrə qoyub sifarişi GÖNDƏRMƏYƏN sessiya. Sorğunun
   WHERE şərti endpointin mənbəyindən götürülüb SQLite-da işlədilir — yəni
   test real şərti yoxlayır, surətini yox.
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

$src = file_get_contents(__DIR__ . '/../public/api/get_orders_list.php');

echo "mənbə\n";
ok("'abandoned' etibarlı statusdur", strpos($src, "'all', 'abandoned']") !== false);
ok('qaralama son fəaliyyətə görə sıralanır (submitted_at yoxdursa updated_at)', strpos($src, 'ORDER BY COALESCE(submitted_at, updated_at) DESC') !== false);
ok('cavabda updated_at və current_step var',
    strpos($src, "'updated_at'     => \$row['updated_at']") !== false
    && strpos($src, "'current_step'   => (int) \$row['current_step']") !== false);
ok('invitations ilə JOIN yoxdur (collation qarışığı)', stripos($src, 'JOIN invitations') === false);

/* Endpointdəki üç şərti götür */
preg_match('/elseif \(\$isAbandoned\) \{(.*?)\n\} else \{/s', $src, $blk);
preg_match_all('/\$conditions\[\] = "(.*?)";/s', $blk[1] ?? '', $m);
$conds = $m[1] ?? [];
ok('üç şərt tapıldı (status, telefon, NOT EXISTS)', count($conds) === 3);

$db = new PDO('sqlite::memory:');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec('CREATE TABLE draft_invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT, status TEXT, customer_phone TEXT, updated_at TEXT
)');
$rows = [
    /* session, status, phone, updated */
    ['s-lead',    'draft',     '+994501234567', '2026-10-19 10:00'],   /* əsl yarımçıq */
    ['s-nophone', 'draft',     null,            '2026-10-19 11:00'],   /* nömrə yoxdur */
    ['s-empty',   'draft',     '',              '2026-10-19 11:30'],   /* boş sətir */
    ['s-ordered', 'submitted', '+994551112233', '2026-10-18 09:00'],   /* sifariş göndərib… */
    ['s-ordered', 'draft',     '+994551112233', '2026-10-19 12:00'],   /* …sonra builderə qayıdıb */
    ['s-approved','approved',  '+994701112233', '2026-10-10 09:00'],
    ['s-approved','draft',     '+994701112233', '2026-10-19 12:30'],
    ['s-rejected','rejected',  '+994771112233', '2026-10-11 09:00'],   /* rədd edilib → yenidən cəhd */
    ['s-rejected','draft',     '+994771112233', '2026-10-19 09:00'],
    ['s-lead2',   'draft',     '+994502223344', '2026-10-19 13:00'],
];
$ins = $db->prepare('INSERT INTO draft_invitations (session_id, status, customer_phone, updated_at) VALUES (?,?,?,?)');
foreach ($rows as $r) $ins->execute($r);

$sql = 'SELECT session_id FROM draft_invitations WHERE ' . implode(' AND ', $conds) . ' ORDER BY updated_at DESC';
$got = $db->query($sql)->fetchAll(PDO::FETCH_COLUMN);

echo "şərt real məlumatda\n";
ok('nömrəli qaralama görünür', in_array('s-lead', $got, true));
ok('nömrəsiz qaralama görünmür', !in_array('s-nophone', $got, true));
ok('boş nömrəli qaralama görünmür', !in_array('s-empty', $got, true));
ok('sifarişi göndərmiş sessiyanın yeni qaralaması görünmür', !in_array('s-ordered', $got, true));
ok('təsdiqlənmiş sessiyanın qaralaması görünmür', !in_array('s-approved', $got, true));
ok('rədd edilmiş sessiyanın yeni qaralaması görünür (yenidən əlaqə)', in_array('s-rejected', $got, true));
ok('ən son fəaliyyət birinci', $got === ['s-lead2', 's-lead', 's-rejected']);

echo "\n$passed passed, $failed failed\n";
exit($failed ? 1 : 0);
