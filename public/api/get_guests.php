<?php
/* ══════════════════════════════════════════════════
   GET /api/get_guests.php?invitation_id=SLUG
   Phase 22 — Guest Management Refactor

   ⚠ 2026-09-28 TƏHLÜKƏSİZLİK DÜZƏLİŞİ — İKİ CAVAB REJİMİ:
   Slug ictimaidir (dəvətnamə linki bütün qonaqlara göndərilir). Əvvəl bu
   endpoint linki olan HƏR KƏSƏ bütün qonaqların telefonunu, qeydlərini,
   iştirak cavablarını və mesajlarını verirdi.
     • Admin tokeni ilə → tam cavab (admin: oturma planı, hesabatlar).
     • Tokensiz (dəvətnaməyə baxan qonaq) → YALNIZ «masanı tap» və RSVP
       üçün lazım olan sahələr: id, ad, masa, yer. Statistika da verilmir.
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$invId = trim($_GET['invitation_id'] ?? '');
if (!$invId) {
    http_response_code(422);
    echo json_encode(['error' => 'invitation_id required']);
    exit;
}
$invId = substr($invId, 0, 120);

ensureTables();
$db = getDB();

/* ── Bütün qonaqları iştirak statusu ilə gətir ── */
/* ── Phase 43: `phone` sütunu (Excel idxalından gəlir) ──
   ADDITIV: sahə cavaba ƏLAVƏ olunur, mövcud açarların heç biri
   dəyişmir. Köhnə client onu sadəcə görməzdən gəlir.
   FAIL-OPEN: miqrasiya hər hansı səbəbdən işləməyibsə sütunlu sorğu
   42S22 verər və BÜTÜN oturma planı ölərdi — ona görə köhnə sorğuya
   düşülür və `phone` sadəcə null qalır. */
function guestQuery(PDO $db, bool $withPhone): string {
    return "
        SELECT
            g.id,
            g.invitation_id,
            g.table_id,
            g.full_name,
            g.seat_number,
            g.notes,
            g.created_at,
            " . ($withPhone ? "g.phone," : "") . "
            COALESCE(a.status, 'NO_RESPONSE') AS attendance_status,
            a.submitted_at,
            a.optional_message,
            COALESCE(a.extra_guests, 0) AS extra_guests
        FROM guests g
        LEFT JOIN attendance a ON a.guest_id = g.id
        WHERE g.invitation_id = :inv
        ORDER BY g.table_id ASC, g.id ASC
    ";
}

try {
    $st = $db->prepare(guestQuery($db, true));
    $st->execute([':inv' => $invId]);
    $rows = $st->fetchAll();
} catch (PDOException $e) {
    $st = $db->prepare(guestQuery($db, false));
    $st->execute([':inv' => $invId]);
    $rows = $st->fetchAll();
}

if (!isAdminRequest()) {
    echo json_encode([
        'ok'     => true,
        'guests' => array_map(fn($r) => [
            'id'          => (int)$r['id'],
            'table_id'    => $r['table_id'],
            'full_name'   => $r['full_name'],
            'seat_number' => $r['seat_number'] !== null ? (int)$r['seat_number'] : null,
        ], $rows),
    ]);
    exit;
}

$guests = array_map(fn($r) => [
    'id'               => (int)$r['id'],
    'invitation_id'    => $r['invitation_id'],
    'table_id'         => $r['table_id'],
    'full_name'        => $r['full_name'],
    'seat_number'      => $r['seat_number'] !== null ? (int)$r['seat_number'] : null,
    'notes'            => $r['notes'],
    /* Phase 43 — sütun yoxdursa null (bax guestQuery FAIL-OPEN) */
    'phone'            => $r['phone'] ?? null,
    'created_at'       => $r['created_at'],
    'status'           => $r['attendance_status'],
    'submitted_at'     => $r['submitted_at'],
    'optional_message' => $r['optional_message'],
    'extra_guests'     => (int)$r['extra_guests'],
], $rows);

/* ── Masa üzrə statistika ── */
$tableMap = [];
foreach ($guests as $g) {
    $tid = $g['table_id'];
    if (!isset($tableMap[$tid])) {
        $tableMap[$tid] = ['table_id' => $tid, 'total' => 0, 'going' => 0, 'not_going' => 0, 'maybe' => 0, 'no_response' => 0];
    }
    $tableMap[$tid]['total']++;
    $s = strtolower($g['status']);
    if ($s === 'going')        $tableMap[$tid]['going']++;
    elseif ($s === 'not_going') $tableMap[$tid]['not_going']++;
    elseif ($s === 'maybe')    $tableMap[$tid]['maybe']++;
    else                       $tableMap[$tid]['no_response']++;
}
foreach ($tableMap as &$t) {
    $t['responded'] = $t['going'] + $t['not_going'] + $t['maybe'];
}
unset($t);

/* ── Ümumi statistika ── */
$total      = count($guests);
$going      = count(array_filter($guests, fn($g) => $g['status'] === 'GOING'));
$not_going  = count(array_filter($guests, fn($g) => $g['status'] === 'NOT_GOING'));
$maybe      = count(array_filter($guests, fn($g) => $g['status'] === 'MAYBE'));
$no_resp    = $total - $going - $not_going - $maybe;
$responded  = $going + $not_going + $maybe;
$rate       = $total > 0 ? round($responded / $total * 100) : 0;

$extraTotal = 0;
foreach ($guests as $g) {
    if ($g['status'] === 'GOING') $extraTotal += $g['extra_guests'];
}
$realAtt = $going + $extraTotal;

echo json_encode([
    'ok'     => true,
    'guests' => $guests,
    'tables' => array_values($tableMap),
    'stats'  => [
        'total'              => $total,
        'going'              => $going,
        'not_going'          => $not_going,
        'maybe'              => $maybe,
        'no_response'        => $no_resp,
        'responded'          => $responded,
        'response_rate'      => $rate,
        'extra_guests_total' => $extraTotal,
        'real_attendance'    => $realAtt,
    ],
]);
