<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Phase 36: dəvətnamə məzmununun əl ilə tərcüməsi (admin)

   GET  ?slug=…            → { form_data, i18n }  — redaktor üçün mənbə mətnlər
   POST { slug, i18n:{…} } → yalnız `form_data.i18n` açarını yeniləyir

   NƏ ÜÇÜN AYRICA ENDPOINT (save_invitation.php DEYİL):
   `save_invitation.php` slug allokasiya məntiqini işə salır
   (`resolveCanonicalSlug`) — tərcümə yazmaq üçün oraya girmək canlı linkin
   dəyişməsi riskini yaradır. Bu endpoint SLUG-A HEÇ VAXT TOXUNMUR:
   yalnız mövcud sətirin form_data JSON-una `i18n` açarını qoyur.

   ⚠ Digər açarlar (adlar, tarix, şablon, sections…) OLDUĞU KİMİ qalır —
   JSON oxunub yalnız `i18n` dəyişdirilir və eyni tranzaksiyada geri yazılır.
   `i18n` yoxdursa şablonlar AZ mətnə düşür → köhnə dəvətnamələr toxunulmaz.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

$LANGS = ['en', 'ru'];               /* AZ mənbə dildir — tərcümə saxlanmır */
$MAX_FIELD_LEN = 2000;               /* bir sahənin maksimum uzunluğu       */

/* ⚠ BÖYÜK HƏRF: köhnə (Phase 33-dən əvvəlki) sluglarda böyük hərf var —
   `get_invitation.php` ilə eyni geniş şablon işlədilir. */
function invSlugOk(string $s): bool {
    return (bool)isValidSlug($s);
}

/* ─────────────────────────── OXU ─────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $slug = trim($_GET['slug'] ?? '');
    if (!invSlugOk($slug)) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid slug required']);
        exit;
    }

    $db = getDB();
    $st = $db->prepare("SELECT form_data FROM invitations WHERE slug = :s LIMIT 1");
    $st->execute([':s' => $slug]);
    $raw = $st->fetchColumn();

    if ($raw === false) {
        http_response_code(404);
        echo json_encode(['error' => 'Invitation not found']);
        exit;
    }

    $fd = json_decode((string)$raw, true);
    if (!is_array($fd)) $fd = [];

    echo json_encode([
        'ok'        => true,
        'slug'      => $slug,
        'form_data' => $fd,
        'i18n'      => is_array($fd['i18n'] ?? null) ? $fd['i18n'] : new stdClass(),
    ]);
    exit;
}

/* ─────────────────────────── YAZ ─────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'GET or POST required']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$slug = trim($body['slug'] ?? '');
$in   = $body['i18n'] ?? null;

if (!invSlugOk($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

if (!is_array($in)) {
    http_response_code(422);
    echo json_encode(['error' => 'i18n object required']);
    exit;
}

/* ── Təmizləmə: yalnız en/ru, yalnız sətir və sadə massiv dəyərlər ──
   Boş sətirlər ATILIR ki, JSON şişməsin və boş tərcümə AZ mətni
   əvəzləməsin (resolver yalnız DOLU dəyəri işlədir). */
function cleanI18nValue($v, int $max) {
    if (is_string($v)) {
        $v = trim($v);
        return $v === '' ? null : mb_substr($v, 0, $max);
    }
    if (is_array($v)) {
        $out = [];
        foreach ($v as $k => $item) {
            $c = cleanI18nValue($item, $max);
            if ($c !== null) $out[$k] = $c;
        }
        return $out ?: null;
    }
    return null;
}

$clean = [];
foreach ($LANGS as $lg) {
    if (!isset($in[$lg]) || !is_array($in[$lg])) continue;
    $bucket = [];
    foreach ($in[$lg] as $field => $val) {
        if (!preg_match('/^[A-Za-z0-9_]{2,40}$/', (string)$field)) continue;
        $c = cleanI18nValue($val, $MAX_FIELD_LEN);
        if ($c !== null) $bucket[$field] = $c;
    }
    if ($bucket) $clean[$lg] = $bucket;
}

$db = getDB();
$db->beginTransaction();

try {
    /* FOR UPDATE — paralel saxlama ilə yarış olmasın */
    $st = $db->prepare("SELECT form_data FROM invitations WHERE slug = :s LIMIT 1 FOR UPDATE");
    $st->execute([':s' => $slug]);
    $raw = $st->fetchColumn();

    if ($raw === false) {
        $db->rollBack();
        http_response_code(404);
        echo json_encode(['error' => 'Invitation not found']);
        exit;
    }

    $fd = json_decode((string)$raw, true);
    if (!is_array($fd)) {
        /* Xarab JSON-u YENİDƏN YAZMIRIQ — məzmun itə bilər */
        $db->rollBack();
        http_response_code(409);
        echo json_encode(['error' => 'form_data is not valid JSON']);
        exit;
    }

    if ($clean) $fd['i18n'] = $clean;
    else        unset($fd['i18n']);

    $json = json_encode($fd, JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Could not encode form_data']);
        exit;
    }

    $upd = $db->prepare("UPDATE invitations SET form_data = :d, updated_at = NOW() WHERE slug = :s");
    $upd->execute([':d' => $json, ':s' => $slug]);

    $db->commit();
} catch (Throwable $e) {
    if ($db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Could not save translations']);
    exit;
}

echo json_encode(['ok' => true, 'slug' => $slug, 'i18n' => $clean ?: new stdClass()]);
