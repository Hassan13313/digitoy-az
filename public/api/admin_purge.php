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

/* Bağlı sifariş(lər): təsdiqdə yazılan approved_slug və ya dəvətnamənin sifariş kodu */
$st = $db->prepare('SELECT id, draft_code FROM draft_invitations WHERE approved_slug = :s OR (draft_code = :c AND :c2 <> \'\')');
$st->execute([':s' => $slug, ':c' => $code, ':c2' => $code]);
$orders   = $st->fetchAll();
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

/** Bu slug-un öz upload qovluqları. Təhlükəli/rezerv ad → BOŞ siyahı. */
function purgeSlugDirs(string $root, string $slug): array {
    if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9-]{0,119}$/', $slug)) return [];
    if (in_array(strtolower($slug), ['music'], true)) return [];   /* uploads/music — köhnə musiqi KÖKÜ */
    return [$root . '/' . $slug, $root . '/_admin/' . $slug, $root . '/music/' . $slug];
}

/** form_data-dakı _story/_music FAYL istinadları (uploads/-a nisbi, təkrarsız) */
function purgeReferencedFiles(array $fd): array {
    $out  = [];
    $walk = function ($v) use (&$walk, &$out) {
        if (is_array($v)) { foreach ($v as $x) $walk($x); return; }
        if (is_string($v) && preg_match('#^(?:https?://[^/]+)?/uploads/((?:_story|_music)/[A-Za-z0-9_-]+/[A-Za-z0-9_-]+\.[A-Za-z0-9]{2,5})$#', $v, $m)) {
            $out[$m[1]] = true;
        }
    };
    $walk($fd);
    return array_keys($out);
}

/** form_data-dakı _story/_music fayllarından başqa HEÇ BİR dəvətnamənin ($exclSlug
    xaric) və sifarişin ($exclOrderIds xaric) işlətmədikləri — yalnız bunlar silinə bilər. */
function purgeOwnRefs(PDO $db, array $fd, string $exclSlug, array $exclOrderIds): array {
    $excl = $exclOrderIds ? ' AND id NOT IN (' . implode(',', array_map('intval', $exclOrderIds)) . ')' : '';
    $inv  = $db->prepare("SELECT COUNT(*) FROM invitations WHERE slug <> :s AND form_data LIKE :p ESCAPE '!'");
    $drf  = $db->prepare("SELECT COUNT(*) FROM draft_invitations WHERE form_data LIKE :p ESCAPE '!'" . $excl);
    $own  = [];
    foreach (purgeReferencedFiles($fd) as $rel) {
        $pat = purgeLikePattern($rel);
        $inv->execute([':s' => $exclSlug, ':p' => $pat]);
        $shared = (int) $inv->fetchColumn();
        $drf->execute([':p' => $pat]);
        $shared += (int) $drf->fetchColumn();
        if ($shared === 0) $own[] = $rel;
    }
    return $own;
}

/** Hələ CANLI dəvətnaməyə bağlı sifarişlər (approved_slug və ya draft_code ilə) → [id => slug] */
function purgeLinkedOrders(PDO $db, array $orders): array {
    $q   = $db->prepare("SELECT slug FROM invitations WHERE slug = :s OR (draft_code = :c AND :c2 <> '') LIMIT 1");
    $out = [];
    foreach ($orders as $o) {
        $c = (string) ($o['draft_code'] ?? '');
        $q->execute([':s' => (string) ($o['approved_slug'] ?? ''), ':c' => $c, ':c2' => $c]);
        if (($slug = $q->fetchColumn()) !== false) $out[(int) $o['id']] = (string) $slug;
        $q->closeCursor();
    }
    return $out;
}

/** «Silinmiş» sifarişləri birdəfəlik sil. Canlı dəvətnaməyə bağlılar SAXLANILIR (kept);
    silinənlərin başqa heç yerdə işlənməyən _story/_music faylları DB-dən SONRA silinir. */
function purgeOrders(PDO $db, string $uploads, array $orders): array {
    $linked = purgeLinkedOrders($db, $orders);
    $kept = []; $go = [];
    foreach ($orders as $o) {
        if (isset($linked[(int) $o['id']])) $kept[] = (string) $o['draft_code'];
        else $go[(int) $o['id']] = $o;
    }
    if (!$go) return ['deleted' => 0, 'files' => 0, 'kept' => $kept];

    $ids  = array_keys($go);
    $refs = [];
    foreach ($go as $o) {
        foreach (purgeOwnRefs($db, json_decode((string) $o['form_data'], true) ?: [], '', $ids) as $rel) $refs[$rel] = true;
    }
    $st = $db->prepare("DELETE FROM draft_invitations WHERE status = 'deleted' AND id IN (" . implode(',', $ids) . ')');
    $st->execute();
    $n = $st->rowCount();

    $files = 0;
    if ($n === count($ids)) {   /* arada biri bərpa olunubsa fayllara toxunma */
        foreach (array_keys($refs) as $rel) {
            if (($p = purgeSafePath($uploads, $rel)) !== null) $files += purgeRmTree($p, false)[0];
        }
    }
    return ['deleted' => $n, 'files' => $files, 'kept' => $kept];
}

/** form_data-da bu faylı tapan LIKE nümunəsi (ESCAPE '!'). Seqmentlər % ilə
    birləşir: DB-də JSON slash-ları «\/» kimi saxlanılır (JSON_UNESCAPED_SLASHES
    yoxdur), tam URL də ola bilər. Artıq uyğunluq → fayl SAXLANILIR (təhlükəsiz). */
function purgeLikePattern(string $rel): string {
    $esc = fn ($s) => str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $s);
    return '%' . implode('%', array_map($esc, explode('/', $rel))) . '%';
}

/** Real yol uploads kökünün İÇİNDƏdirsə qaytar (kökün özü, mövcud olmayan, kənar → null) */
function purgeSafePath(string $root, string $rel): ?string {
    $rootReal = realpath($root);
    if ($rootReal === false || $rel === '') return null;
    $p = realpath($rootReal . '/' . $rel);
    if ($p === false || $p === $rootReal) return null;
    return strpos($p, $rootReal . DIRECTORY_SEPARATOR) === 0 ? $p : null;
}

/** Fayl/qovluğu sil (dry → yalnız say). Symlink izlənmir. @return [fayl sayı, bayt] */
function purgeRmTree(string $path, bool $dry): array {
    if (is_link($path) || is_file($path)) {
        $b = (int) @filesize($path);
        if ($dry) return [1, $b];
        return @unlink($path) ? [1, $b] : [0, 0];
    }
    if (!is_dir($path)) return [0, 0];
    $f = 0; $b = 0;
    foreach ((array) @scandir($path) as $e) {
        if ($e === '.' || $e === '..') continue;
        [$ff, $bb] = purgeRmTree($path . '/' . $e, $dry);
        $f += $ff; $b += $bb;
    }
    if (!$dry) @rmdir($path);
    return [$f, $b];
}
