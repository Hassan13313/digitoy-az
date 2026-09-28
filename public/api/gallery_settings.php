<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — QALEREYA AYARLARI (Phase 43)

   POST /api/gallery_settings.php
   body: { slug, config: { ... } }
   → { ok, slug, config }

   Cütlüyün qalereya üz qapağı + QR stend seçimləri. İcazə `delete_photo.php`
   ilə EYNİ qaydadır: admin tokeni VƏ YA məhz bu slug üçün qalereya tokeni
   (`requireGalleryAccess`). Yəni qonaq başqasının qapağını dəyişə bilmir.

   ⚠ OXU üçün ayrıca endpoint var: `gallery_meta.php` (publik).
   ⚠ Ayarlar bir JSON blob-dur: yeni sahə əlavə etmək üçün DB miqrasiyası
     lazım deyil. Naməlum açarlar SÜZÜLÜR (ağ siyahı) — blob şişmir və
     frontend heç vaxt gözlənilməz məzmun almır.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/gallery_auth.php';
require_once __DIR__ . '/gallery_media.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$slug = trim($body['slug'] ?? '');

if (!$slug || !isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* İcazə slug MƏLUM olduqdan SONRA yoxlanılır — token həmin slug-a bağlıdır */
requireGalleryAccess($slug);

$in = is_array($body['config'] ?? null) ? $body['config'] : [];

/* ── Qapaq şəkli ──
   Üç mənbə qəbul edilir, HƏR ÜÇÜ KÖNÜLLÜ:
     1. 'data:image/...;base64,…'  → brauzerdə ölçüsü kiçildilmiş şəkil
     2. 'https://…'               → admin-in verdiyi xarici ünvan
     3. qalereyadaki fayl adı     → mövcud mediadan seçim

   ⚠ NƏ ÜÇÜN FAYL SİSTEMİNƏ YAZILMIR: yeni yükləmə yolu açmaq media
   auditini, silmə məntiqini və qalereya skanını dəyişdirərdi. Data URI
   `gallery_config` sətrində qalır — mövcud heç bir axına toxunmur.
   ⚠ Ölçü limiti: 1.5 MB base64. Brauzer onsuz da 1600px-ə kiçildir. */
const COVER_MAX_BYTES = 1572864;

function sanitizeCover($v): string {
    if (!is_string($v)) return '';
    $v = trim($v);
    if ($v === '') return '';

    if (strncmp($v, 'data:', 5) === 0) {
        if (!preg_match('#^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=\s]+$#', $v)) return '';
        if (strlen($v) > COVER_MAX_BYTES) return '';
        return $v;
    }
    if (strncmp($v, 'https://', 8) === 0 || strncmp($v, '/uploads/', 9) === 0) {
        return substr($v, 0, 500);
    }
    /* Qalereyadaki fayl adı */
    return isSafeMediaName($v) ? substr($v, 0, 255) : '';
}

function clampText($v, int $max): string {
    if (!is_string($v)) return '';
    /* Nəzarət simvolları təmizlənir (yalnız yeni sətir saxlanılır) */
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v);
    return mb_substr(trim((string) $v), 0, $max);
}

/* ── MÖVCUD AYARLAR ──
   Sorğu QİSMİ ola bilər (iki ayrı redaktor var: cütlüyün «Qapaq» modalı
   və adminin «QR stend» dizayneri). Ona görə əvvəlcə mövcud sətir oxunur,
   sonra YALNIZ göndərilən açarlar üzərinə yazılır. Əks halda biri
   saxlayanda digərinin ayarları səssizcə defaulta qayıdardı. */
$current = [];
try {
    $q = getDB()->prepare('SELECT config FROM gallery_config WHERE slug = :s LIMIT 1');
    $q->execute([':s' => $slug]);
    $raw = $q->fetchColumn();
    if ($raw) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) $current = $decoded;
    }
} catch (Throwable $e) {
    /* cədvəl hələ yoxdur → defaultlardan başlanır */
}

/* ── AĞ SİYAHI + DEFAULTLAR ── */
$layouts  = ['classic', 'portrait', 'minimal', 'frame'];
$defaults = [
    'coverPhoto'        => '',
    'coverTitle'        => '',
    'coverSubtitle'     => '',
    'coverEnabled'      => true,
    'standTitle'        => '',
    'standDescription'  => '',
    'standLayout'       => 'classic',
    'standShowDate'     => true,
    'standShowPhoto'    => true,
    'slideSeconds'      => 6,
    'slideFeaturedOnly' => false,
];

/* Başlanğıc: default ← mövcud (yalnız tanınan açarlar) */
$config = $defaults;
foreach ($defaults as $k => $_) {
    if (array_key_exists($k, $current)) $config[$k] = $current[$k];
}

/* Sonra: sorğuda GƏLƏN açarlar sanitasiyadan keçib üzərinə yazılır */
if (array_key_exists('coverPhoto', $in))    $config['coverPhoto']    = sanitizeCover($in['coverPhoto']);
if (array_key_exists('coverTitle', $in))    $config['coverTitle']    = clampText($in['coverTitle'], 120);
if (array_key_exists('coverSubtitle', $in)) $config['coverSubtitle'] = clampText($in['coverSubtitle'], 240);
if (array_key_exists('coverEnabled', $in))  $config['coverEnabled']  = $in['coverEnabled'] !== false;

if (array_key_exists('standTitle', $in))       $config['standTitle']       = clampText($in['standTitle'], 120);
if (array_key_exists('standDescription', $in)) $config['standDescription'] = clampText($in['standDescription'], 400);
if (array_key_exists('standLayout', $in)) {
    $config['standLayout'] = in_array($in['standLayout'], $layouts, true)
        ? $in['standLayout'] : 'classic';
}
if (array_key_exists('standShowDate', $in))  $config['standShowDate']  = $in['standShowDate'] !== false;
if (array_key_exists('standShowPhoto', $in)) $config['standShowPhoto'] = $in['standShowPhoto'] !== false;

if (array_key_exists('slideSeconds', $in)) {
    $config['slideSeconds'] = max(3, min(30, (int) $in['slideSeconds']));
}
if (array_key_exists('slideFeaturedOnly', $in)) {
    $config['slideFeaturedOnly'] = $in['slideFeaturedOnly'] === true;
}

/* Tiplər sabitlənir — köhnə sətirdə səhv tip qalmış ola bilər */
$config['coverEnabled']      = (bool) $config['coverEnabled'];
$config['standShowDate']     = (bool) $config['standShowDate'];
$config['standShowPhoto']    = (bool) $config['standShowPhoto'];
$config['slideFeaturedOnly'] = (bool) $config['slideFeaturedOnly'];
$config['slideSeconds']      = max(3, min(30, (int) $config['slideSeconds']));
$config['coverPhoto']        = sanitizeCover($config['coverPhoto']);
if (!in_array($config['standLayout'], $layouts, true)) $config['standLayout'] = 'classic';

try {
    ensureTables();
    $st = getDB()->prepare(
        'INSERT INTO gallery_config (slug, config) VALUES (:s, :c)
         ON DUPLICATE KEY UPDATE config = VALUES(config)'
    );
    $st->execute([':s' => $slug, ':c' => json_encode($config, JSON_UNESCAPED_UNICODE)]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error'   => 'SAVE_FAILED',
        'message' => 'Ayarlar saxlanıla bilmədi. Bir az sonra yenidən cəhd edin.',
    ]);
    exit;
}

adminAuditLog('gallery_settings', $slug, $config['standLayout']);

echo json_encode(['ok' => true, 'slug' => $slug, 'config' => $config], JSON_UNESCAPED_UNICODE);
