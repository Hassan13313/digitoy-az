<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — QALEREYA META (Phase 43)

   GET /api/gallery_meta.php?slug=<slug>
   → { ok, slug, active, title, names, date, counts:{photos,videos,total}, config }

   Qalereya üz qapağı, slayd şou və QR stend dizayneri üçün YEGANƏ oxu
   nöqtəsi. Üç mənbəni birləşdirir:
     1. `invitations.form_data` → adlar, tarix, tədbir adı
     2. fayl sistemi           → foto/video sayğacları
     3. `gallery_config`       → cütlüyün öz başlıq/izah/qapaq seçimi

   ⚠ TAMAMİLƏ YENİ ENDPOINT: mövcud heç bir URL, cavab və ya davranış
   dəyişmir. Bu fayl silinsə Phase 43 xüsusiyyətləri sönür, qalereyanın özü
   isə (get_photos.php) olduğu kimi işləməyə davam edir.

   ⚠ İCAZƏ: publikdir — qalereya səhifəsi onsuz da slug bilən hər kəsə
   açıqdır (QR kodun üzərindədir). Deaktiv dəvətnamədə (is_active = 0) adlar
   VERİLMİR: `get_invitation.php` ilə eyni məxfilik qaydası.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/gallery_media.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$slug = trim($_GET['slug'] ?? '');
if (!$slug || !isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* ── Sayğaclar (fayl sistemi) ── */
$counts = countGalleryMedia($slug);

/* ── Şərti GET ──
   Üz qapağı hər səhifə açılışında sorğulanır. ETag qovluq mtime + config
   yeniləmə vaxtından qurulur, ona görə heç nə dəyişməyəndə cavab 304-dür. */
$configRow = null;
try {
    $st = getDB()->prepare('SELECT config, updated_at FROM gallery_config WHERE slug = :s LIMIT 1');
    $st->execute([':s' => $slug]);
    $configRow = $st->fetch() ?: null;
} catch (Throwable $e) {
    /* cədvəl hələ yoxdur → default ayarlar */
}

$etag = '"' . md5($slug . '|' . $counts['dirMtime'] . '|' . $counts['total']
               . '|' . ($configRow['updated_at'] ?? '0')) . '"';
header('ETag: ' . $etag);
header('Cache-Control: no-store');
if (trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
    http_response_code(304);
    exit;
}

/* ── Dəvətnamə məlumatı ──
   ⚠ `get_invitation.php` ilə eyni FAIL-OPEN qaydası: `is_active` sütunu
   hələ yoxdursa dəvətnamə aktiv sayılır, yəni köhnə bazada da işləyir. */
$names    = '';
$title    = '';
$dateStr  = '';
$timeStr  = '';
$venue    = '';
$isActive = true;
$exists   = false;

try {
    $db = getDB();
    try {
        $st = $db->prepare('SELECT form_data, is_active FROM invitations WHERE slug = :s LIMIT 1');
        $st->execute([':s' => $slug]);
        $row = $st->fetch();
        if ($row) $isActive = ((int) ($row['is_active'] ?? 1)) === 1;
    } catch (PDOException $e) {
        $st = $db->prepare('SELECT form_data FROM invitations WHERE slug = :s LIMIT 1');
        $st->execute([':s' => $slug]);
        $row = $st->fetch();
    }

    if ($row) {
        $exists = true;
        $fd = json_decode($row['form_data'] ?? '', true);
        if (is_array($fd) && $isActive) {
            $bride = trim((string) ($fd['brideName'] ?? ''));
            $groom = trim((string) ($fd['groomName'] ?? ''));
            $ev    = trim((string) ($fd['eventName'] ?? ''));

            if ($bride !== '' && $groom !== '') $names = $groom . ' & ' . $bride;
            elseif ($ev !== '')                 $names = $ev;
            else                                $names = trim($bride . $groom);

            $title   = $ev !== '' ? $ev : $names;
            $dateStr = trim((string) ($fd['date'] ?? ''));
            $timeStr = trim((string) ($fd['time'] ?? ''));
            $venue   = trim((string) ($fd['venueName'] ?? ''));
        }
    }
} catch (Throwable $e) {
    /* DB əlçatmazdırsa üz qapağı yalnız sayğaclarla göstərilir */
}

/* ── Cütlüyün öz ayarları ── */
$config = [];
if ($configRow && !empty($configRow['config'])) {
    $decoded = json_decode($configRow['config'], true);
    if (is_array($decoded)) $config = $decoded;
}
/* ⚠ Boş PHP massivi JSON-da `[]` olur, halbuki client obyekt gözləyir.
   `config.standLayout` kimi oxunuşlar `[]` üzərində də işləyir, amma
   tip fərqi gec-tez səhvə aparır — cavab HƏMİŞƏ obyektdir. */
if (empty($config)) $config = new stdClass();

echo json_encode([
    'ok'      => true,
    'slug'    => $slug,
    'exists'  => $exists,
    'active'  => $isActive,
    'names'   => $names,
    'title'   => $title,
    'date'    => $dateStr,
    'time'    => $timeStr,
    'venue'   => $venue,
    'counts'  => [
        'photos' => $counts['photos'],
        'videos' => $counts['videos'],
        'total'  => $counts['total'],
    ],
    'config'  => $config,
], JSON_UNESCAPED_UNICODE);
