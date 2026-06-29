<?php
/* ══════════════════════════════════════════════════
   GET /api/get_guests.php?invitation_id=SLUG
   Public: qonaq siyahısı + iştirak statusu + statistika
   Phase 22 — Guest Management Refactor
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';

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
$st = $db->prepare("
    SELECT
        g.id,
        g.invitation_id,
        g.table_id,
        g.full_name,
        g.seat_number,
        g.notes,
        g.created_at,
        COALESCE(a.status, 'NO_RESPONSE') AS attendance_status,
        a.submitted_at,
        a.optional_message,
        COALESCE(a.extra_guests, 0) AS extra_guests
    FROM guests g
    LEFT JOIN attendance a ON a.guest_id = g.id
    WHERE g.invitation_id = :inv
    ORDER BY g.table_id ASC, g.id ASC
");
$st->execute([':inv' => $invId]);
$rows = $st->fetchAll();

$guests = array_map(fn($r) => [
    'id'               => (int)$r['id'],
    'invitation_id'    => $r['invitation_id'],
    'table_id'         => $r['table_id'],
    'full_name'        => $r['full_name'],
    'seat_number'      => $r['seat_number'] !== null ? (int)$r['seat_number'] : null,
    'notes'            => $r['notes'],
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
