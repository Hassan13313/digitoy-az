<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — QALEREYA ANALİTİKASI (Phase 43)

   GET /api/gallery_analytics.php?slug=<slug>&days=30
   → { ok, slug, totals:{visits,qr_scans,uploads,slideshows,photos,videos,media},
       byDate:[{day,visits,uploads}], byHour:[{hour,count}], featured, reactions }

   GET /api/gallery_analytics.php            (slug YOX → admin xülasəsi)
   → { ok, global:{visits,qr_scans,uploads,...}, topAlbums:[…] }

   ⚠ İCAZƏ: slug verilibsə `requireGalleryAccess($slug)` — cütlük öz
     statistikasını görür, qonaq görmür. Slug verilməyibsə `requireAdmin()`.
   ⚠ FOTO/VİDEO SAYLARI fayl sistemindən gəlir (jurnaldan deyil) — jurnal
     itsə də rəqəmlər qalereyanın özü ilə üst-üstə düşür.
   ⚠ Cədvəl yoxdursa bütün jurnal sayğacları 0 qaytarır, endpoint 200
     verməyə davam edir: panel «məlumat yoxdur» göstərir, sınmır.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/gallery_auth.php';
require_once __DIR__ . '/gallery_media.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$slug = trim($_GET['slug'] ?? '');
$days = max(7, min(90, (int) ($_GET['days'] ?? 30)));

/* ── Rejim seçimi ── */
if ($slug === '') {
    requireAdmin();
} else {
    if (!isValidSlug($slug)) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid slug required']);
        exit;
    }
    requireGalleryAccess($slug);
}

header('Cache-Control: no-store');

/** Jurnal aqreqatı — cədvəl yoxdursa boş massiv (heç vaxt istisna atmır) */
function evAgg(string $sql, array $params): array {
    try {
        $st = getDB()->prepare($sql);
        $st->execute($params);
        return $st->fetchAll();
    } catch (Throwable $e) {
        return [];
    }
}

/* ══════ REJİM A — TƏK TOY ══════ */
if ($slug !== '') {
    $counts = countGalleryMedia($slug);

    /* Hadisə növü üzrə cəmi */
    $totals = ['visit' => 0, 'qr_scan' => 0, 'upload' => 0, 'slideshow' => 0];
    foreach (evAgg(
        'SELECT event_type, COUNT(*) AS c FROM gallery_events
          WHERE slug = :s GROUP BY event_type', [':s' => $slug]
    ) as $r) {
        $totals[$r['event_type']] = (int) $r['c'];
    }

    /* Tarix üzrə aktivlik — boş günlər 0 ilə doldurulur ki, qrafik
       əyilməsin (dashboard-dakı `daily` məntiqi ilə eyni yanaşma) */
    /* ⚠ INTERVAL-da bağlı parametr İŞLƏDİLMİR: `EMULATE_PREPARES = false`
       ilə MySQL bəzi versiyalarda `INTERVAL ? DAY` sintaksisini rədd edir.
       `$days` yuxarıda (int) kimi 7–90 arasına sıxılıb, ona görə birbaşa
       yerləşdirmə təhlükəsizdir. */
    $spanDays = (int) ($days - 1);
    $dateRows = evAgg(
        "SELECT DATE(created_at) AS day, event_type, COUNT(*) AS c
           FROM gallery_events
          WHERE slug = :s AND created_at >= DATE_SUB(CURDATE(), INTERVAL {$spanDays} DAY)
          GROUP BY DATE(created_at), event_type",
        [':s' => $slug]
    );
    $dateMap = [];
    foreach ($dateRows as $r) {
        $d = $r['day'];
        if (!isset($dateMap[$d])) $dateMap[$d] = ['visits' => 0, 'uploads' => 0, 'qr_scans' => 0];
        if     ($r['event_type'] === 'visit')   $dateMap[$d]['visits']   = (int) $r['c'];
        elseif ($r['event_type'] === 'upload')  $dateMap[$d]['uploads']  = (int) $r['c'];
        elseif ($r['event_type'] === 'qr_scan') $dateMap[$d]['qr_scans'] = (int) $r['c'];
    }
    $byDate = [];
    for ($i = $days - 1; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-{$i} days"));
        $byDate[] = [
            'day'      => $d,
            'visits'   => $dateMap[$d]['visits']   ?? 0,
            'uploads'  => $dateMap[$d]['uploads']  ?? 0,
            'qr_scans' => $dateMap[$d]['qr_scans'] ?? 0,
        ];
    }

    /* Saat üzrə aktivlik — 24 xanalı sabit massiv (toyun pik saatı görünsün) */
    $hourMap = array_fill(0, 24, 0);
    foreach (evAgg(
        'SELECT HOUR(created_at) AS h, COUNT(*) AS c FROM gallery_events
          WHERE slug = :s GROUP BY HOUR(created_at)', [':s' => $slug]
    ) as $r) {
        $h = (int) $r['h'];
        if ($h >= 0 && $h < 24) $hourMap[$h] = (int) $r['c'];
    }
    $byHour = [];
    for ($h = 0; $h < 24; $h++) $byHour[] = ['hour' => $h, 'count' => $hourMap[$h]];

    /* Seçilmiş və reaksiya sayları */
    $featuredCount  = 0;
    $reactionCount  = 0;
    $reactionByType = [];
    foreach (evAgg('SELECT COUNT(*) AS c FROM media_flags WHERE slug = :s AND featured = 1', [':s' => $slug]) as $r) {
        $featuredCount = (int) $r['c'];
    }
    foreach (evAgg('SELECT emoji, COUNT(*) AS c FROM media_reactions WHERE slug = :s GROUP BY emoji', [':s' => $slug]) as $r) {
        $reactionByType[$r['emoji']] = (int) $r['c'];
        $reactionCount += (int) $r['c'];
    }

    echo json_encode([
        'ok'     => true,
        'slug'   => $slug,
        'days'   => $days,
        'totals' => [
            'visits'     => $totals['visit'],
            'qr_scans'   => $totals['qr_scan'],
            'uploads'    => $totals['upload'],
            'slideshows' => $totals['slideshow'],
            'photos'     => $counts['photos'],
            'videos'     => $counts['videos'],
            'media'      => $counts['total'],
            'featured'   => $featuredCount,
            'reactions'  => $reactionCount,
        ],
        'byDate'         => $byDate,
        'byHour'         => $byHour,
        'reactionByType' => $reactionByType ?: new stdClass(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/* ══════ REJİM B — ADMIN XÜLASƏSİ ══════ */
$global = ['visit' => 0, 'qr_scan' => 0, 'upload' => 0, 'slideshow' => 0];
foreach (evAgg('SELECT event_type, COUNT(*) AS c FROM gallery_events GROUP BY event_type', []) as $r) {
    $global[$r['event_type']] = (int) $r['c'];
}

/* Son 14 günün gündəlik aktivliyi (dashboard widget-i) */
$dailyRows = evAgg(
    "SELECT DATE(created_at) AS day, event_type, COUNT(*) AS c
       FROM gallery_events
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
      GROUP BY DATE(created_at), event_type", []
);
$dmap = [];
foreach ($dailyRows as $r) {
    $d = $r['day'];
    if (!isset($dmap[$d])) $dmap[$d] = ['visits' => 0, 'uploads' => 0];
    if     ($r['event_type'] === 'visit')  $dmap[$d]['visits']  = (int) $r['c'];
    elseif ($r['event_type'] === 'upload') $dmap[$d]['uploads'] = (int) $r['c'];
}
$daily = [];
for ($i = 13; $i >= 0; $i--) {
    $d = date('Y-m-d', strtotime("-{$i} days"));
    $daily[] = ['day' => $d, 'visits' => $dmap[$d]['visits'] ?? 0, 'uploads' => $dmap[$d]['uploads'] ?? 0];
}

/* Saat üzrə (bütün toylar) — «qonaqlar hansı saatda yükləyir» sualı */
$hourMap = array_fill(0, 24, 0);
foreach (evAgg('SELECT HOUR(created_at) AS h, COUNT(*) AS c FROM gallery_events GROUP BY HOUR(created_at)', []) as $r) {
    $h = (int) $r['h'];
    if ($h >= 0 && $h < 24) $hourMap[$h] = (int) $r['c'];
}
$byHour = [];
for ($h = 0; $h < 24; $h++) $byHour[] = ['hour' => $h, 'count' => $hourMap[$h]];

/* Ən aktiv qalereyalar */
$topAlbums = evAgg(
    "SELECT slug,
            SUM(event_type = 'visit')  AS visits,
            SUM(event_type = 'upload') AS uploads
       FROM gallery_events
      GROUP BY slug
      ORDER BY visits DESC
      LIMIT 10", []
);
$topAlbums = array_map(fn($r) => [
    'slug'    => $r['slug'],
    'visits'  => (int) $r['visits'],
    'uploads' => (int) $r['uploads'],
], $topAlbums);

$reactTotal = 0;
foreach (evAgg('SELECT COUNT(*) AS c FROM media_reactions', []) as $r) $reactTotal = (int) $r['c'];
$featTotal = 0;
foreach (evAgg('SELECT COUNT(*) AS c FROM media_flags WHERE featured = 1', []) as $r) $featTotal = (int) $r['c'];

echo json_encode([
    'ok'     => true,
    'global' => [
        'visits'     => $global['visit'],
        'qr_scans'   => $global['qr_scan'],
        'uploads'    => $global['upload'],
        'slideshows' => $global['slideshow'],
        'reactions'  => $reactTotal,
        'featured'   => $featTotal,
    ],
    'daily'     => $daily,
    'byHour'    => $byHour,
    'topAlbums' => $topAlbums,
], JSON_UNESCAPED_UNICODE);
