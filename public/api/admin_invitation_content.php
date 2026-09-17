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

requireAdmin();

/* ── Ağ siyahılar — müştəri tərəfdəki `adminOverrides.js` ilə UYĞUN olmalıdır ── */
const THEME_KEYS = ['primary', 'secondary', 'accent', 'background', 'text'];

/* `src/templates/templateConfig.js` › FONT_STACKS açarları */
const FONT_KEYS = [
    'cormorant', 'marcellus', 'instrument', 'newsreader', 'italiana', 'amiri',
    'archivo', 'jost', 'dmsans', 'inter',
    'spacegrotesk', 'jetbrains', 'bebas', 'cinzel', 'baskerville',
];

/* `src/data/adminOverrides.js` › CONTENT_SECTIONS açarları */
const LABEL_KEYS = [
    'hero', 'countdown', 'venue', 'program', 'dresscode',
    'seating', 'gallery', 'rsvp', 'guestbook', 'footer',
];

/* `src/data/sections.js` ilə eyni açarlar (Phase 35) */
const SECTION_KEYS = [
    'venue', 'countdown', 'program', 'dresscode',
    'seating', 'gallery', 'rsvp', 'guestbook', 'music',
];

const SCALE_MIN = 0.85;
const SCALE_MAX = 1.25;
const MAX_TEXT  = 160;

function invSlugOk(string $s): bool { return (bool)isValidSlug($s); }

/** Nəzarət simvollarını at, boşluqları yığ, kəs. Boş qalsa null. */
function cleanText($v, int $max = MAX_TEXT): ?string {
    if (!is_string($v)) return null;
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v);
    $v = preg_replace('/\s+/u', ' ', (string)$v);
    $v = trim((string)$v);
    return $v === '' ? null : mb_substr($v, 0, $max);
}

function cleanColor($v): ?string {
    if (!is_string($v)) return null;
    $v = trim($v);
    return preg_match('/^#[0-9A-Fa-f]{6}$/', $v) ? strtoupper($v) : null;
}

function cleanScale($v): ?float {
    if (!is_numeric($v)) return null;
    $n = round((float)$v, 2);
    if ($n < SCALE_MIN) $n = SCALE_MIN;
    if ($n > SCALE_MAX) $n = SCALE_MAX;
    return $n;
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

$body = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON body required']);
    exit;
}

$slug = trim((string)($body['slug'] ?? ''));
if (!invSlugOk($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

$inAdmin    = is_array($body['admin'] ?? null)    ? $body['admin']    : [];
$inSections = is_array($body['sections'] ?? null) ? $body['sections'] : null;

/* ── Təmizləmə: rənglər ── */
$clean = [];
if (is_array($inAdmin['theme'] ?? null)) {
    $t = [];
    foreach (THEME_KEYS as $k) {
        $c = cleanColor($inAdmin['theme'][$k] ?? null);
        if ($c !== null) $t[$k] = $c;
    }
    if ($t) $clean['theme'] = $t;
}

/* ── Təmizləmə: şriftlər ── */
if (is_array($inAdmin['fonts'] ?? null)) {
    $f = [];
    foreach (['heading', 'body'] as $k) {
        $v = $inAdmin['fonts'][$k] ?? null;
        if (is_string($v) && in_array($v, FONT_KEYS, true)) $f[$k] = $v;
    }
    foreach (['headingScale', 'bodyScale'] as $k) {
        $n = cleanScale($inAdmin['fonts'][$k] ?? null);
        /* 1.0 = dəyişiklik yoxdur → saxlamırıq (JSON şişməsin) */
        if ($n !== null && abs($n - 1.0) > 0.001) $f[$k] = $n;
    }
    if ($f) $clean['fonts'] = $f;
}

/* ── Təmizləmə: bölmə mətnləri (AZ/EN/RU) ── */
if (is_array($inAdmin['labels'] ?? null)) {
    $L = [];
    foreach ($inAdmin['labels'] as $key => $entry) {
        if (!in_array($key, LABEL_KEYS, true) || !is_array($entry)) continue;
        $e = [];

        $kick = cleanText($entry['kicker'] ?? null, 40);
        /* ⚠ BÖYÜK HƏRF: səhifə lang="az"-dır, CSS `text-transform: uppercase`
           ingilis «i»-ni «İ»-yə çevirir (EDITION → EDİTİON). Mənbədə böyük
           saxlayanda problem yaranmır — eyni qayda şablonlarda da var. */
        if ($kick !== null) $e['kicker'] = mb_strtoupper($kick, 'UTF-8');

        if (is_array($entry['title'] ?? null)) {
            $title = [];
            foreach (['az', 'en', 'ru'] as $lg) {
                $t = cleanText($entry['title'][$lg] ?? null);
                if ($t !== null) $title[$lg] = $t;
            }
            if ($title) $e['title'] = $title;
        }

        if ($e) $L[$key] = $e;
    }
    if ($L) $clean['labels'] = $L;
}

/* ── Təmizləmə: bölmə görünürlüyü (Phase 35 açarı) ── */
$cleanSections = null;
if (is_array($inSections)) {
    $s = [];
    foreach (SECTION_KEYS as $k) {
        if (array_key_exists($k, $inSections)) $s[$k] = (bool)$inSections[$k];
    }
    if ($s) $cleanSections = $s;
}

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

    if ($cleanSections !== null) $fd['sections'] = $cleanSections;

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
        'sections' => $cleanSections !== null,
    ], JSON_UNESCAPED_UNICODE));

    echo json_encode([
        'ok'       => true,
        'admin'    => $clean ?: new stdClass(),
        'sections' => $cleanSections ?? new stdClass(),
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    if ($db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Save failed']);
}
