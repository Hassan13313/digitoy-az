<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Admin «Albom saxlama» (2026-11)

   GET  /api/admin_album_retention.php
        → { ok, today, rules:{keepDays, noticeDays, minNoticeDays}, albums:[…] }
   POST /api/admin_album_retention.php  { slug, action: 'notice' | 'undo' | 'extend', option? }
        option (extend): 3m | 6m | 1y | forever | clear — ödənişli uzadılma
        → { ok, schedule }

   «notice» — sifarişçiyə WhatsApp ilə silinmə xəbərdarlığı göndərildi.
   Albom YALNIZ bundan sonra və vaxtı çatanda avtomatik silinir
   (bax album_retention.php). Admin tokeni tələb olunur.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/album_retention.php';

requireAdmin();

$db      = getDB();
$uploads = __DIR__ . '/../uploads';
$today   = albumToday();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'ok'     => true,
        'today'  => $today,
        'rules'  => ['keepDays' => ALBUM_KEEP_DAYS, 'noticeDays' => ALBUM_NOTICE_DAYS, 'minNoticeDays' => ALBUM_MIN_NOTICE_DAYS],
        'albums' => albumList($db, $uploads, $today),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'GET or POST required']);
    exit;
}

$body   = json_decode((string) file_get_contents('php://input'), true);
$slug   = is_array($body) && is_string($body['slug'] ?? null) ? trim($body['slug']) : '';
$action = is_array($body) && is_string($body['action'] ?? null) ? $body['action'] : '';

$option = is_array($body) && is_string($body['option'] ?? null) ? $body['option'] : '';

if (!isValidSlug($slug) || !in_array($action, ['notice', 'undo', 'extend'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'BAD_REQUEST', 'message' => 'slug və action (notice | undo | extend) lazımdır.']);
    exit;
}

$done = $action === 'extend'
    ? albumExtend($db, $slug, $option, $today)
    : albumSetNotice($db, $slug, $action === 'undo');
if (!$done) {
    http_response_code(404);
    echo json_encode(['error' => 'NOT_FOUND', 'message' => 'Albom tapılmadı və ya artıq silinib.']);
    exit;
}

$row   = albumRow($db, $slug);
$sched = $row ? albumScheduleOf($row, $today) : null;
adminAuditLog(['notice' => 'album_notice', 'undo' => 'album_notice_undo', 'extend' => 'album_extend'][$action], $slug,
    $sched ? (string) json_encode(['option' => $option ?: null, 'keepUntil' => $sched['keepUntil'], 'deleteAt' => $sched['deleteAt']]) : null);

echo json_encode(['ok' => true, 'slug' => $slug, 'schedule' => $sched], JSON_UNESCAPED_UNICODE);
