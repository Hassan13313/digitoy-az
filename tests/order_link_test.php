<?php
/* ══════════════════════════════════════════════════
   Phase 48 — sifariş ↔ dəvətnamə əlaqəsinin TƏK qaydası

   İşə salma:  php tests/order_link_test.php     (SQLite, MySQL tələb etmir)

   Prod-da tapılan iki xəta (2026-10-07):
     1. Sifarişlər → «Təsdiqlənmiş»də 30 gündən köhnə sifarişə basanda
        «Sifariş tapılmadı»: get_draft.php admin axtarışında da
        `expires_at > NOW()` var idi, siyahıda isə yox.
     2. Detal dəvətnaməni ADLA (LIKE) tapırdı, birdəfəlik silmə isə yalnız
        approved_slug / draft_code ilə — iki bölmə fərqli «bağlılıq» görürdü.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/../public/api/order_link.php';

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

function freshDb(): PDO {
    $db = new PDO('sqlite::memory:');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('CREATE TABLE invitations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        form_data TEXT NOT NULL DEFAULT "{}",
        draft_code TEXT UNIQUE
    )');
    $db->exec('CREATE TABLE draft_invitations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        draft_code TEXT UNIQUE,
        package TEXT DEFAULT "SADE",
        current_step INTEGER DEFAULT 1,
        status TEXT DEFAULT "approved",
        form_data TEXT,
        customer_phone TEXT,
        submitted_at TEXT,
        approved_slug TEXT,
        expires_at TEXT NOT NULL
    )');
    return $db;
}

function addInvitation(PDO $db, string $slug, ?string $code = null): void {
    $db->prepare('INSERT INTO invitations (slug, draft_code) VALUES (?,?)')->execute([$slug, $code]);
}

function addOrder(PDO $db, string $code, ?string $approvedSlug, string $expires = '2099-01-01 00:00:00'): void {
    $db->prepare('INSERT INTO draft_invitations (draft_code, form_data, approved_slug, expires_at) VALUES (?,?,?,?)')
       ->execute([$code, '{"brideName":"Səbinə"}', $approvedSlug, $expires]);
}

/* ── 1. orderInvitationSlug — əlaqə qaydası ── */
$db = freshDb();
addInvitation($db, 'aysel-ve-tural-ab12cd', null);           /* Phase 33-dən əvvəlki, kodsuz */
addInvitation($db, 'nigar-ve-pervin-x7k2pq', 'DT-X7K2PQ');
addInvitation($db, 'leyla-ve-murad-zz1111', 'DT-ZZ1111');

ok('approved_slug ilə bağlı (kodsuz köhnə dəvətnamə)', orderInvitationSlug($db, 'aysel-ve-tural-ab12cd', 'DT-AAAAAA') === 'aysel-ve-tural-ab12cd');
ok('draft_code ilə bağlı (approved_slug boş)', orderInvitationSlug($db, null, 'DT-X7K2PQ') === 'nigar-ve-pervin-x7k2pq');
ok('approved_slug köhnə/yanlış, draft_code düzgün', orderInvitationSlug($db, 'nigar-ve-pervin', 'DT-X7K2PQ') === 'nigar-ve-pervin-x7k2pq');
ok('approved_slug-un dəvətnaməsi silinib → null', orderInvitationSlug($db, 'silinmis-ve-yox-123456', 'DT-BBBBBB') === null);
ok('heç bir əlaqə yoxdur → null', orderInvitationSlug($db, null, null) === null);
ok('boş sətirlər → null', orderInvitationSlug($db, '', '') === null);
/* save_invitation dəvətnaməni draft_code ilə yeniləyir (slug_alloc) → o üstündür */
ok('hər ikisi fərqli dəvətnaməyə → draft_code üstündür',
    orderInvitationSlug($db, 'aysel-ve-tural-ab12cd', 'DT-ZZ1111') === 'leyla-ve-murad-zz1111');
$other = freshDb();
addInvitation($other, 'basqa-db-only', 'DT-X7K2PQ');
ok('keşlənmiş sorğu başqa DB bağlantısına keçəndə yenilənir', orderInvitationSlug($other, null, 'DT-X7K2PQ') === 'basqa-db-only'
    && orderInvitationSlug($db, null, 'DT-X7K2PQ') === 'nigar-ve-pervin-x7k2pq');

/* ── 2. invitationOrders — əks istiqamət (birdəfəlik silmə) EYNİ qaydadır ── */
$db = freshDb();
addInvitation($db, 'sebine-ve-rovsen-72ad65', null);
addInvitation($db, 'natella-ve-hafis-yfaf7v', 'DT-YFAF7V');
addOrder($db, 'DT-V8K3QJ', 'sebine-ve-rovsen-72ad65');
addOrder($db, 'DT-YFAF7V', 'natella-ve-hafis-yfaf7v');
addOrder($db, 'DT-U9RL7E', null);                            /* eyni adlı dublikat, bağlı deyil */
addOrder($db, 'DT-QQQQQQ', 'sebine-ve-rovsen-72ad65');       /* köhnə approved_slug, amma… */
addInvitation($db, 'sebine-ve-rovsen-qqqqqq', 'DT-QQQQQQ');  /* …kodu başqa dəvətnaməyə bağlıdır */
$codes = fn (array $rows) => array_column($rows, 'draft_code');
ok('kodsuz dəvətnamə → approved_slug ilə bağlı sifariş', $codes(invitationOrders($db, 'sebine-ve-rovsen-72ad65', null)) === ['DT-V8K3QJ']);
ok('kodlu dəvətnamə → öz sifarişi', $codes(invitationOrders($db, 'natella-ve-hafis-yfaf7v', 'DT-YFAF7V')) === ['DT-YFAF7V']);
ok('detalda başqa dəvətnamə görünən sifariş SİLİNMİR', !in_array('DT-QQQQQQ', $codes(invitationOrders($db, 'sebine-ve-rovsen-72ad65', null)), true));
ok('o sifariş öz dəvətnaməsi ilə gedir', $codes(invitationOrders($db, 'sebine-ve-rovsen-qqqqqq', 'DT-QQQQQQ')) === ['DT-QQQQQQ']);
ok('dublikat heç bir dəvətnaməyə bağlı deyil', orderInvitationSlug($db, null, 'DT-U9RL7E') === null);

/* ── 3. orderByCode — admin detalı: müddəti bitmiş sifariş də açılır ── */
addOrder($db, 'DT-OLD001', null, '2026-09-01 00:00:00');
$o = orderByCode($db, 'DT-OLD001');
ok('30 gündən köhnə (expires_at keçib) sifariş TAPILIR', is_array($o) && $o['draft_code'] === 'DT-OLD001');
ok('mövcud olmayan kod → null', orderByCode($db, 'DT-NOPE00') === null);

/* ── 4. Endpointlər eyni qaydanı işlədir (mənbə yoxlaması) ── */
$api = __DIR__ . '/../public/api/';
$src = fn (string $f) => file_get_contents($api . $f);
foreach (['get_draft.php', 'get_orders_list.php'] as $f) {
    ok("$f order_link.php-ni qoşur və orderInvitationSlug işlədir",
        strpos($src($f), "/order_link.php'") !== false && strpos($src($f), 'orderInvitationSlug(') !== false);
}
ok('get_draft.php admin axtarışı orderByCode ilə', strpos($src('get_draft.php'), 'orderByCode(') !== false);
ok('get_draft.php-də ad üzrə LIKE axtarışı qalmayıb', stripos($src('get_draft.php'), 'form_data LIKE') === false);
ok('admin_purge.php bağlı sifarişləri invitationOrders ilə tapır', strpos($src('admin_purge.php'), 'invitationOrders(') !== false);
ok('purgeLinkedOrders eyni qaydanı işlədir', strpos($src('purge_lib.php'), 'orderInvitationSlug(') !== false);
ok('heç bir endpoint sütun-sütun JOIN etmir (collation qarışığı)', stripos($src('get_draft.php') . $src('get_orders_list.php'), 'JOIN invitations') === false);
ok('order_link.php birbaşa HTTP ilə açılmır', strpos($src('.htaccess'), '<Files "order_link.php">') !== false);

echo "\n$passed passed, $failed failed\n";
exit($failed ? 1 : 0);
