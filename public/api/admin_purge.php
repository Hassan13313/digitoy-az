<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Phase 46: BİRDƏFƏLİK SİLMƏ (yalnız admin)

   POST JSON { action, ... }:
     preview        { slug }                → nə silinəcək (HEÇ NƏ silinmir)
     invitation     { slug, confirm: slug } → dəvətnamə + qonaqlar, RSVP,
                                              təbriklər, foto/video, reaksiyalar,
                                              qalereya ayarı + BAĞLI SİFARİŞ +
                                              upload faylları
     order          { draft_code }          → «Silinmiş» statusdakı BİR sifariş
     deleted_orders {}                      → «Silinmiş» statusdakı BÜTÜN sifarişlər
                                              (canlı dəvətnaməyə bağlılar saxlanılır → kept)

   ⚠ GERİ QAYTARILMIR. Hər əməliyyat admin_audit-ə yazılır.
   ⚠ Fayl silmə yalnız uploads/ kökünün İÇİNDƏ, yalnız bu slug-un öz
     qovluqlarında və başqa dəvətnamənin/sifarişin istifadə ETMƏDİYİ
     hekayə/musiqi fayllarında aparılır (tests/admin_purge_test.php).
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/purge_lib.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    purgeJson(405, ['error' => 'POST required']);
}

$body   = json_decode(file_get_contents('php://input'), true) ?: [];
$action = (string) ($body['action'] ?? '');

ensureTables();
$db      = getDB();
$uploads = __DIR__ . '/../uploads';

/* ── Silinmiş sifarişlər ──
   Yalnız «Silinmiş» statusdakılar. CANLI dəvətnaməyə bağlı sifariş SİLİNMİR:
   soft delete «geri alına bilər» deyir; belə sifariş dəvətnamə ilə birlikdə
   «Dəvətnamələr»dən silinir. Silinənlərin öz hekayə/musiqi faylları da gedir. */
if ($action === 'deleted_orders' || $action === 'order') {
    $sql  = "SELECT id, draft_code, approved_slug, form_data FROM draft_invitations WHERE status = 'deleted'";
    $args = [];
    $code = '';
    if ($action === 'order') {
        $code = strtoupper(trim((string) ($body['draft_code'] ?? '')));
        if (!preg_match('/^DT-[A-Z0-9]{4,12}$/', $code)) purgeJson(400, ['error' => 'Valid draft_code required']);
        $sql .= ' AND draft_code = :c';
        $args[':c'] = $code;
    }
    $st = $db->prepare($sql);
    $st->execute($args);
    $rows = $st->fetchAll();
    if ($action === 'order' && !$rows) purgeJson(404, ['error' => 'NOT_IN_TRASH', 'message' => 'Sifariş «Silinmiş» bölməsində tapılmadı.']);

    $res = purgeOrders($db, $uploads, $rows);
    if ($action === 'order' && $res['deleted'] === 0) {
        purgeJson(409, ['error' => 'LINKED_INVITATION', 'message' => 'Bu sifariş aktiv dəvətnaməyə bağlıdır — əvvəlcə dəvətnaməni «Dəvətnamələr»dən silin.']);
    }
    adminAuditLog($action === 'order' ? 'purge_order' : 'purge_deleted_orders', null,
        trim($code . ' ' . json_encode($res, JSON_UNESCAPED_UNICODE)));
    purgeJson(200, ['ok' => true] + $res);
}

if ($action !== 'preview' && $action !== 'invitation') {
    purgeJson(400, ['error' => 'Unknown action']);
}

/* ── Dəvətnamə ── */
$slug = trim((string) ($body['slug'] ?? ''));
if (!isValidSlug($slug) || !purgeSlugDirs($uploads, $slug)) purgeJson(400, ['error' => 'Valid slug required']);

$st = $db->prepare('SELECT id, form_data, draft_code FROM invitations WHERE slug = :s LIMIT 1');
$st->execute([':s' => $slug]);
$inv = $st->fetch();
if (!$inv) purgeJson(404, ['error' => 'INVITATION_NOT_FOUND']);

$fd   = json_decode((string) $inv['form_data'], true) ?: [];
$code = (string) ($inv['draft_code'] ?? '');

/* Bağlı sifariş(lər) — Sifarişlər bölməsi ilə eyni qayda (order_link.php) */
$orders   = invitationOrders($db, $slug, $code);
$orderIds = array_map('intval', array_column($orders, 'id'));

$count = function (string $sql) use ($db, $slug): int {
    $q = $db->prepare($sql);
    $q->execute([':s' => $slug]);
    return (int) $q->fetchColumn();
};

/* Hekayə/musiqi faylları — başqa dəvətnamə və ya sifariş də işlədirsə SAXLANILIR */
$ownRefs = purgeOwnRefs($db, $fd, $slug, $orderIds);

$targets = [];
foreach (purgeSlugDirs($uploads, $slug) as $dir) {
    if (($p = purgeSafePath($uploads, substr($dir, strlen($uploads) + 1))) !== null) $targets[] = $p;
}
foreach ($ownRefs as $rel) {
    if (($p = purgeSafePath($uploads, $rel)) !== null) $targets[] = $p;
}

$files = 0; $bytes = 0;
foreach ($targets as $t) { [$f, $b] = purgeRmTree($t, true); $files += $f; $bytes += $b; }

$summary = [
    'slug'      => $slug,
    'guests'    => $count('SELECT COUNT(*) FROM guests WHERE invitation_id = :s'),
    'responses' => $count('SELECT COUNT(*) FROM guest_responses WHERE invitation_id = :s'),
    'photos'    => $count('SELECT COUNT(*) FROM photos WHERE slug = :s'),
    'files'     => $files,
    'mb'        => round($bytes / 1048576, 1),
    'orders'    => array_values(array_filter(array_column($orders, 'draft_code'))),
];

if ($action === 'preview') purgeJson(200, ['ok' => true] + $summary);

/* İkinci təsdiq serverdə də: slug hərfbəhərf yazılmalıdır */
if ((string) ($body['confirm'] ?? '') !== $slug) purgeJson(422, ['error' => 'CONFIRM_MISMATCH']);

$db->beginTransaction();
try {
    $db->prepare('DELETE FROM attendance WHERE guest_id IN (SELECT id FROM guests WHERE invitation_id = :s)')->execute([':s' => $slug]);
    foreach ([
        'DELETE FROM guests          WHERE invitation_id = :s',
        'DELETE FROM guest_responses WHERE invitation_id = :s',
        'DELETE FROM photos          WHERE slug = :s',
        'DELETE FROM media_reactions WHERE slug = :s',
        'DELETE FROM media_flags     WHERE slug = :s',
        'DELETE FROM gallery_events  WHERE slug = :s',
        'DELETE FROM gallery_config  WHERE slug = :s',
        'DELETE FROM invitations     WHERE slug = :s',
    ] as $sql) {
        $db->prepare($sql)->execute([':s' => $slug]);
    }
    if ($orderIds) $db->exec('DELETE FROM draft_invitations WHERE id IN (' . implode(',', $orderIds) . ')');
    $db->commit();
} catch (Throwable $e) {
    $db->rollBack();
    purgeJson(500, ['error' => 'PURGE_FAILED']);
}

/* Fayllar DB-dən SONRA: DB alınmasa heç bir şəkil itmir */
$files = 0; $bytes = 0;
foreach ($targets as $t) { [$f, $b] = purgeRmTree($t, false); $files += $f; $bytes += $b; }
foreach (['digitoy_seo_', 'digitoy_seo2_'] as $pfx) {   /* önbaxış keşində adlar qalmasın */
    @unlink(sys_get_temp_dir() . '/' . $pfx . hash('sha256', $slug) . ($pfx === 'digitoy_seo_' ? '.txt' : '.json'));
}

$summary['files'] = $files;
$summary['mb']    = round($bytes / 1048576, 1);
adminAuditLog('purge_invitation', $slug, json_encode($summary, JSON_UNESCAPED_UNICODE));
purgeJson(200, ['ok' => true] + $summary);


/* ══════════════════ köməkçilər ══════════════════ */

function purgeJson(int $status, array $data): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
