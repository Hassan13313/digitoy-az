<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — QALEREYA HADİSƏ QEYDİ (Phase 43)

   POST /api/gallery_track.php
   body: { slug, event: 'visit' | 'qr_scan' | 'slideshow' }
   → { ok: true }

   Yalnız YAZIR — heç nə oxumur, heç nə qaytarmır. Qonaq axınına təsir
   etməməsi üçün:
     • cavab dərhal verilir, DB yazısı `galleryEvent()` içində try/catch-dədir;
     • `visit` və `qr_scan` GÜNDƏ BİR DƏFƏ yazılır (ip_hash + tarix) — açıq
       qalan tab saatlarla sorğu göndərsə də statistika şişmir;
     • IP açıq saxlanılmır (gündəlik duzlu HMAC, 16 simvol).

   ⚠ `upload` hadisəsi BURADAN gəlmir — onu yükləmə endpointləri özü yazır
     (upload_photo.php / media_store.php), yəni client-i aldatmaqla uydurma
     yükləmə statistikası yaratmaq olmur.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body  = json_decode(file_get_contents('php://input'), true);
$slug  = trim($body['slug']  ?? '');
$event = trim($body['event'] ?? '');

/* Client YALNIZ bu üç hadisəni yaza bilər */
$allowed = ['visit', 'qr_scan', 'slideshow'];

if (!$slug || !isValidSlug($slug) || !in_array($event, $allowed, true)) {
    /* Səssiz uğur: analitika sorğusu heç vaxt qonağa xəta göstərməməlidir */
    echo json_encode(['ok' => true, 'skipped' => true]);
    exit;
}

/* Bir IP-dən dəqiqədə 30 hadisə — açıq tab-lar üçün bol, skript üçün dar */
if (!rateGate('gtrack:' . clientIp(), 30, 60)) {
    echo json_encode(['ok' => true, 'skipped' => true]);
    exit;
}

/* Dəvətnamə mövcud deyilsə yazmırıq — uydurma slug cədvəli doldurmasın.
   `invitationExists()` DB oxunmursa FAIL-OPEN qaytarır (bax config.php). */
if (!invitationExists(getDB(), $slug)) {
    echo json_encode(['ok' => true, 'skipped' => true]);
    exit;
}

ensureTables();

/* `slideshow` hər açılışda sayılır (sessiya göstəricisidir);
   `visit`/`qr_scan` gündə bir dəfə (unikal qonaq göstəricisidir).
   `function_exists`: deploy zamanı köhnə config.php ilə qarşılaşsa hadisə
   sadəcə yazılmır — qonaq xəta görmür. */
if (function_exists('galleryEvent')) {
    galleryEvent($slug, $event, $event !== 'slideshow');
}

echo json_encode(['ok' => true]);
