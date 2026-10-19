<?php
/* ══════════════════════════════════════════════════
   Phase 50 — «Müştəri paneli» açarı (owner_auth.php)

   İşə salma:  php tests/owner_auth_test.php     (SQLite, MySQL tələb etmir)

   Yoxlanılır: açar yaranır və sabit qalır, MƏHZ öz slug-una keçir,
   «Linki yenilə» köhnəsini dərhal bağlayır, qalereya tokeni ilə qarışmır,
   endpointlər admin davranışını dəyişmədən müştəri açarını qəbul edir.
══════════════════════════════════════════════════ */

define('ADMIN_KEY', 'test-admin-key-0123456789');
require_once __DIR__ . '/../public/api/gallery_auth.php';   /* owner_auth.php-ni də qoşur */

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
        owner_key TEXT
    )');
    $db->exec("INSERT INTO invitations (slug) VALUES ('aysel-ve-tural-ab12cd'), ('leyla-ve-murad-x9y8z7')");
    return $db;
}

echo "açarın yaranması\n";
$db = freshDb();
$a  = ownerKeyFor($db, 'aysel-ve-tural-ab12cd');
ok('64 kiçik hex simvol', is_string($a) && isOwnerKeyFormat($a));
ok('təkrar istəyəndə EYNİ açar (link dəyişmir)', ownerKeyFor($db, 'aysel-ve-tural-ab12cd', $created) === $a);
ok('təkrar istəkdə created = false (jurnala yazılmır)', $created === false);
ok('ilk istəkdə created = true', (function () {
    $db = freshDb();
    ownerKeyFor($db, 'leyla-ve-murad-x9y8z7', $c);
    return $c === true;
})());
$b = ownerKeyFor($db, 'leyla-ve-murad-x9y8z7');
ok('hər dəvətnamənin öz açarı', is_string($b) && $b !== $a);
ok('olmayan dəvətnamə → null', ownerKeyFor($db, 'yoxdur-ve-yoxdur') === null);
ok('olmayan dəvətnamə üçün sətir yaranmır',
    (int) $db->query('SELECT COUNT(*) FROM invitations')->fetchColumn() === 2);

echo "yoxlama\n";
ok('öz slug-u üçün keçir', ownerKeyValid($db, 'aysel-ve-tural-ab12cd', $a));
ok('BAŞQA dəvətnamənin açarı keçmir', !ownerKeyValid($db, 'leyla-ve-murad-x9y8z7', $a));
ok('boş açar keçmir', !ownerKeyValid($db, 'aysel-ve-tural-ab12cd', ''));
ok('63 simvol keçmir', !ownerKeyValid($db, 'aysel-ve-tural-ab12cd', substr($a, 0, 63)));
ok('BÖYÜK hərfli variant keçmir', !ownerKeyValid($db, 'aysel-ve-tural-ab12cd', strtoupper($a)));
ok('bir simvolu dəyişilmiş açar keçmir',
    !ownerKeyValid($db, 'aysel-ve-tural-ab12cd', substr($a, 0, 63) . ($a[63] === '0' ? '1' : '0')));
ok('açarı olmayan dəvətnamədə istənilən açar keçmir', (function () {
    $db = freshDb();
    return !ownerKeyValid($db, 'aysel-ve-tural-ab12cd', str_repeat('0', 64));
})());
ok('owner_key sütunu yoxdursa (miqrasiyasız DB) false, istisna yox', (function () {
    $db = new PDO('sqlite::memory:');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('CREATE TABLE invitations (id INTEGER PRIMARY KEY, slug TEXT)');
    return !ownerKeyValid($db, 'x-ve-y', str_repeat('a', 64));
})());

echo "«Linki yenilə»\n";
$a2 = rotateOwnerKey($db, 'aysel-ve-tural-ab12cd');
ok('yeni açar fərqlidir', is_string($a2) && isOwnerKeyFormat($a2) && $a2 !== $a);
ok('KÖHNƏ açar dərhal keçmir', !ownerKeyValid($db, 'aysel-ve-tural-ab12cd', $a));
ok('yeni açar keçir', ownerKeyValid($db, 'aysel-ve-tural-ab12cd', $a2));
ok('digər dəvətnaməyə toxunmur', ownerKeyValid($db, 'leyla-ve-murad-x9y8z7', $b));
ok('olmayan dəvətnamə → null', rotateOwnerKey($db, 'yoxdur-ve-yoxdur') === null);

echo "qalereya tokeni ilə qarışmır\n";
$g = mintGalleryToken('aysel-ve-tural-ab12cd')['token'];
ok('qalereya tokeni müştəri açarı kimi keçmir', !ownerKeyValid($db, 'aysel-ve-tural-ab12cd', $g));
ok('müştəri açarı qalereya tokeni kimi keçmir', !validateGalleryToken($a2, 'aysel-ve-tural-ab12cd'));

echo "başlıq oxunuşu\n";
$_SERVER['HTTP_X_OWNER_TOKEN'] = "  $a2  ";
ok('X-Owner-Token kənar boşluqsuz oxunur', readOwnerToken() === $a2);
$_SERVER['HTTP_X_OWNER_TOKEN'] = ['x'];
ok('massiv başlıq → boş', readOwnerToken() === '');
unset($_SERVER['HTTP_X_OWNER_TOKEN']);
ok('başlıq yoxdursa boş', readOwnerToken() === '');

echo "endpointlər (mənbə yoxlaması)\n";
$api = __DIR__ . '/../public/api/';
$src = fn (string $f) => file_get_contents($api . $f);
ok('owner_auth açarı hash_equals ilə müqayisə edir', strpos($src('owner_auth.php'), 'hash_equals(') !== false);
ok('owner_auth açarı random_bytes ilə yaradır', strpos($src('owner_auth.php'), 'random_bytes(32)') !== false);
ok('uğursuz cəhdlər rate limit-lə', strpos($src('owner_auth.php'), "rateGate('owner_fail|'") !== false);
ok('get_rsvp_responses: requireInvitationAccess (requireAdmin yox)',
    strpos($src('get_rsvp_responses.php'), 'requireInvitationAccess($slug)') !== false
    && strpos($src('get_rsvp_responses.php'), 'requireAdmin()') === false);
ok('export_guests: requireInvitationAccess (requireAdmin yox)',
    strpos($src('export_guests.php'), 'requireInvitationAccess($invId)') !== false
    && strpos($src('export_guests.php'), 'requireAdmin()') === false);
ok('get_guests: müştəri rejimində qonaq telefonu verilmir',
    strpos($src('get_guests.php'), "'phone'            => \$isAdmin ? (\$r['phone'] ?? null) : null") !== false);
ok('get_guests: rejim invitationRole ilə (admin | owner | ictimai)',
    strpos($src('get_guests.php'), '$role    = invitationRole($invId);') !== false);
ok('requireInvitationAccess vahid invitationRole-dan keçir',
    strpos($src('owner_auth.php'), 'if (invitationRole($slug) === null) ownerAccessDenied();') !== false);
ok('requireGalleryAccess: admin (auth.php), qalereya tokeni, sonra müştəri açarı',
    strpos($src('gallery_auth.php'), 'if (isAdminRequest()) return;') !== false
    && strpos($src('gallery_auth.php'), 'if (isOwnerRequest($slug)) return;') !== false);
ok('owner_panel YALNIZ müştəri açarı (admin tokeni yox), bir sorğuda hash_equals',
    strpos($src('owner_panel.php'), "hash_equals(\$row['owner_key'], \$token)") !== false
    && strpos($src('owner_panel.php'), 'isAdminRequest') === false
    && strpos($src('owner_panel.php'), 'invitationRole') === false);
ok('owner_panel form_data-nın hamısını qaytarmır',
    strpos($src('owner_panel.php'), "'form_data' =>") === false
    && strpos($src('owner_panel.php'), '=> $fd,') === false
    && strpos($src('owner_panel.php'), '=> $fd]') === false);
ok('owner_panel və owner_link keşlənmir',
    strpos($src('owner_panel.php'), 'Cache-Control: no-store') !== false
    && strpos($src('owner_link.php'), 'Cache-Control: no-store') !== false);
ok('owner_link yalnız admin', strpos($src('owner_link.php'), 'requireAdmin();') !== false);
ok('owner_link açarı URL fragment-ində verir', strpos($src('owner_link.php'), "'/panel#k='") !== false);
ok('owner_link yeniləməni jurnala yazır', strpos($src('owner_link.php'), "adminAuditLog('owner_link_rotate'") !== false);
$ht = $src('.htaccess');
ok('owner_auth.php birbaşa HTTP ilə açılmır', strpos($ht, '<Files "owner_auth.php">') !== false);
$cfg = $src('config.php');
ok('CORS X-Owner-Token başlığına icazə verir', (bool) preg_match('/Access-Control-Allow-Headers:[^\n]*X-Owner-Token/', $cfg));
ok('SCHEMA_VERSION >= 47', preg_match('/const SCHEMA_VERSION = (\d+);/', $cfg, $m) && (int) $m[1] >= 47);
ok('miqrasiya: owner_key ascii_bin CHAR(64)',
    strpos($cfg, 'ADD COLUMN owner_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin') !== false);

echo "\n$passed passed, $failed failed\n";
exit($failed ? 1 : 0);
