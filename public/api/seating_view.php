<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Oturma planı: restoran üçün YALNIZ BAXIŞ linki (2026-11-26, v53)
   GET /api/seating_view.php?slug=<slug>      (X-Venue-Key: 48 hex)
     → { ok, names, date, time, guests:[{id, full_name, table_id, extra_guests, status}], layout }
   Linki admin və ya müştəri (PİN ilə) yaradır: /invite/<slug>/zal#k=<açar>.
   Açar yenilənəndə köhnə link dərhal işləmir. Telefon, qeyd, qız/oğlan evi,
   qruplar və mesajlar VERİLMİR — restorana yalnız ad, masa və say lazımdır.
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/seating_layout_lib.php';
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

function viewFail(int $code, string $err): never {
    http_response_code($code);
    echo json_encode(['error' => $err]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') viewFail(405, 'GET required');
$slug = is_string($_GET['slug'] ?? null) ? trim($_GET['slug']) : '';
if (!isValidSlug($slug)) viewFail(400, 'Valid slug required');
if (!rateGate('seat_view_ip|' . clientIp(), 120, 600)) viewFail(429, 'RATE_LIMITED');
$key = is_string($_SERVER['HTTP_X_VENUE_KEY'] ?? null) ? trim($_SERVER['HTTP_X_VENUE_KEY']) : '';

ensureTables();
$db = getDB();
if (!seatVenueValid($db, $slug, $key)) viewFail(401, 'ACCESS_REQUIRED');

$q = $db->prepare('SELECT form_data FROM invitations WHERE slug = :s LIMIT 1');
$q->execute([':s' => $slug]);
$fd = json_decode((string) $q->fetchColumn(), true);
$fd = is_array($fd) ? $fd : [];
$str = fn($k) => is_string($fd[$k] ?? null) ? trim($fd[$k]) : '';
$type = $str('eventType');
$names = in_array($type, ['toy', 'nishan'], true)
    ? implode(' & ', array_filter([$str('groomName'), $str('brideName')], 'strlen'))
    : (in_array($type, ['corporate', 'other'], true) ? $str('eventName') : $str('brideName'));

$st = $db->prepare("SELECT g.id, g.table_id, g.full_name, COALESCE(a.status, 'NO_RESPONSE') AS status, COALESCE(a.extra_guests, 0) AS extra_guests
                    FROM guests g LEFT JOIN attendance a ON a.guest_id = g.id
                    WHERE g.invitation_id = :s ORDER BY g.table_id ASC, g.id ASC");
$st->execute([':s' => $slug]);
$guests = array_map(fn($r) => [
    'id' => (int) $r['id'], 'full_name' => $r['full_name'], 'table_id' => $r['table_id'],
    'status' => $r['status'], 'extra_guests' => (int) $r['extra_guests'],
], $st->fetchAll(PDO::FETCH_ASSOC));

$layout = seatLayoutLoad($db, $slug);
if ($layout) unset($layout['groups'], $layout['links']);

echo json_encode([
    'ok'     => true,
    'names'  => $names,
    'date'   => $str('date'),
    'time'   => $str('time'),
    'venue'  => $str('venueName'),
    'guests' => $guests,
    'layout' => $layout,
], JSON_UNESCAPED_UNICODE);
