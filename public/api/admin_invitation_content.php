<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Phase 42: «Invitation Content Manager» (admin)

   GET  ?slug=…  → { admin, sections, template_id, form_data_preview }
   POST { slug, admin:{theme,fonts,labels}, sections:{…} }

   ── NƏ ÜÇÜN AYRICA ENDPOINT (save_invitation.php DEYİL) ─────────────────
   `save_invitation.php` slug allokasiya məntiqini işə salır
   (`resolveCanonicalSlug`) — buradan ora girmək CANLI LİNKİN dəyişməsi
   riskidir. Bu endpoint `admin_translations.php` ilə eyni prinsipdədir:
   mövcud sətrin `form_data` JSON-unu oxuyur, YALNIZ iki açarı dəyişir
   (`admin`, `sections`) və eyni tranzaksiyada geri yazır.

   ⚠ TOXUNULMAYAN AÇARLAR: adlar, tarix, məkan, şablon, `i18n`, `i18nMeta`,
   `programSteps`, `seatingPlan`, `music`… — hamısı olduğu kimi qalır.
   ⚠ Builder / approval / RSVP / qalereya axınları bu faylı ÇAĞIRMIR.
   ⚠ `sections` Phase 35-dən mövcud açardır — YENİ sahə yaradılmır.

   ── TƏHLÜKƏSİZLİK ──────────────────────────────────────────────────────
   Admin panelindən gələn dəyərlər render zamanı birbaşa CSS-ə düşür, ona
   görə burada SƏRT ağ siyahı var:
     • rəng  → yalnız `#RRGGBB`
     • şrift → yalnız reyestrdəki ailə açarı (FONT_KEYS)
     • ölçü  → yalnız 0.85–1.25 arası ədəd
     • mətn  → uzunluq limiti + nəzarət simvolları təmizlənir
   Eyni yoxlamalar müştəri tərəfdə də var (`src/data/adminOverrides.js`) —
   iki qat QƏSDƏNDİR: brauzer tərəfə heç vaxt təkbaşına etibar etmirik.
   ══════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/admin_content_rules.php';

requireAdmin();

/* ─────────────────────────── OXU ─────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $slug = trim($_GET['slug'] ?? '');
    if (!isValidSlug($slug)) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid slug required']);
        exit;
    }

    $db = getDB();
    $st = $db->prepare("SELECT form_data, template_id FROM invitations WHERE slug = :s LIMIT 1");
    $st->execute([':s' => $slug]);
    $row = $st->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        echo json_encode(['error' => 'Invitation not found']);
        exit;
    }

    $fd = json_decode((string)$row['form_data'], true);
    if (!is_array($fd)) $fd = [];

    echo json_encode([
        'slug'        => $slug,
        'template_id' => $row['template_id'] ?? null,
        /* Açar yoxdursa boş obyekt — köhnə dəvətnamələr normaldır */
        'admin'       => isset($fd['admin']) && is_array($fd['admin']) ? $fd['admin'] : new stdClass(),
        'sections'    => isset($fd['sections']) && is_array($fd['sections']) ? $fd['sections'] : new stdClass(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/* ─────────────────────────── YAZ ─────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'GET or POST required']);
    exit;
}

$rawBody = file_get_contents('php://input') ?: '';
/* Hekayə mətnləri ilə gövdə böyüyə bilər, amma 512 KB-dan çox olmamalıdır */
if (strlen($rawBody) > 524288) {
    http_response_code(413);
    echo json_encode(['error' => 'Body too large']);
    exit;
}
$body = json_decode($rawBody, true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON body required']);
    exit;
}

$slug = trim((string)($body['slug'] ?? ''));
if (!isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

$inAdmin    = is_array($body['admin'] ?? null)    ? $body['admin']    : [];
$inSections = is_array($body['sections'] ?? null) ? $body['sections'] : null;

/* Təmizləmə qaydaları: admin_content_rules.php (şablon səviyyəsi də eynisini işlədir) */
$clean = acrCleanOverrides($inAdmin);
$cleanSections = acrCleanSections($inSections);

$db = getDB();
$db->beginTransaction();

try {
    /* FOR UPDATE — builder eyni anda saxlayırsa yarış olmasın */
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
        /* ⚠ Xarab JSON-u YENİDƏN YAZMIRIQ — müştəri məzmunu itə bilər.
           Eyni qayda `admin_translations.php`-dədir. */
        $db->rollBack();
        http_response_code(409);
        echo json_encode(['error' => 'form_data is not valid JSON — aborting to avoid data loss']);
        exit;
    }

    /* Boş override = açarı TAMAMİLƏ sil (JSON təmiz qalsın, render əvvəlki
       davranışa qayıtsın). */
    if ($clean) $fd['admin'] = $clean;
    else        unset($fd['admin']);

    /* ⚠ BİRLƏŞDİRMƏ, əvəzləmə yox (Phase 45): siyahıda olmayan açar (gələcək
       bölmə, köhnə frontend-in bilmədiyi açar) mövcud dəyərini saxlayır. */
    if ($cleanSections !== null) {
        $prev = (isset($fd['sections']) && is_array($fd['sections'])) ? $fd['sections'] : [];
        $fd['sections'] = array_merge($prev, $cleanSections);
    }

    $enc = json_encode($fd, JSON_UNESCAPED_UNICODE);
    if ($enc === false) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Failed to encode form_data']);
        exit;
    }

    $up = $db->prepare("UPDATE invitations SET form_data = :f WHERE slug = :s");
    $up->execute([':f' => $enc, ':s' => $slug]);

    $db->commit();

    adminAuditLog('invitation_content_update', $slug, json_encode([
        'theme'    => isset($clean['theme'])  ? array_keys($clean['theme'])  : [],
        'fonts'    => isset($clean['fonts'])  ? array_keys($clean['fonts'])  : [],
        'labels'   => isset($clean['labels']) ? array_keys($clean['labels']) : [],
        'strings'  => isset($clean['strings']) ? count($clean['strings']) : 0,
        'opening'  => isset($clean['opening']),
        'story'    => isset($clean['story']),
        'images'   => isset($clean['images']),
        'sections' => $cleanSections !== null,
    ], JSON_UNESCAPED_UNICODE));

    echo json_encode([
        'ok'       => true,
        'admin'    => $clean ?: new stdClass(),
        'sections' => ($cleanSections !== null ? $fd['sections'] : null) ?? new stdClass(),
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    if ($db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Save failed']);
}
