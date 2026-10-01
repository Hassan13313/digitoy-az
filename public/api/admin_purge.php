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

/* ── Silinmiş sifarişlər ── */
if ($action === 'deleted_orders') {
    $n = $db->exec("DELETE FROM draft_invitations WHERE status = 'deleted'");
    adminAuditLog('purge_deleted_orders', null, 'count=' . (int) $n);
    purgeJson(200, ['ok' => true, 'deleted' => (int) $n]);
}

if ($action === 'order') {
    $code = strtoupper(trim((string) ($body['draft_code'] ?? '')));
    if (!preg_match('/^DT-[A-Z0-9]{4,12}$/', $code)) purgeJson(400, ['error' => 'Valid draft_code required']);
    /* Yalnız «Silinmiş» statusdakı sifariş — aktiv sifariş səhvən itməsin */
    $st = $db->prepare("DELETE FROM draft_invitations WHERE draft_code = :c AND status = 'deleted'");
    $st->execute([':c' => $code]);
    if ($st->rowCount() === 0) purgeJson(404, ['error' => 'NOT_IN_TRASH', 'message' => 'Sifariş «Silinmiş» bölməsində tapılmadı.']);
    adminAuditLog('purge_order', null, $code);
    purgeJson(200, ['ok' => true, 'deleted' => 1]);
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
$ownRefs = [];
foreach (purgeReferencedFiles($fd) as $rel) {
    $pat = purgeLikePattern($rel);
    $q = $db->prepare("SELECT COUNT(*) FROM invitations WHERE slug <> :s AND form_data LIKE :p ESCAPE '!'");
    $q->execute([':s' => $slug, ':p' => $pat]);
    $shared = (int) $q->fetchColumn();
    $excl = $orderIds ? ' AND id NOT IN (' . implode(',', $orderIds) . ')' : '';
    $q = $db->prepare("SELECT COUNT(*) FROM draft_invitations WHERE form_data LIKE :p ESCAPE '!'" . $excl);
    $q->execute([':p' => $pat]);
    $shared += (int) $q->fetchColumn();
    if ($shared === 0) $ownRefs[] = $rel;
}

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
