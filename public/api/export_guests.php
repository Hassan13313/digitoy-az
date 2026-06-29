<?php
/* ══════════════════════════════════════════════════
   GET /api/export_guests.php  (Admin tələb olunur)
   ?invitation_id=SLUG&mode=tables|status&format=csv
   Qonaqları CSV formatında ixrac edir.
   Phase 22 — Guest Management Refactor
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

requireAdmin();

$invId = trim($_GET['invitation_id'] ?? '');
$mode  = trim($_GET['mode']          ?? 'tables');  // tables | status

if (!$invId) {
    http_response_code(422);
    echo json_encode(['error' => 'invitation_id required']);
    exit;
}
$invId = substr($invId, 0, 120);

ensureTables();
$db = getDB();

/* ── Qonaqları iştirak statusu ilə gətir ── */
$st = $db->prepare("
    SELECT
        g.table_id,
        g.full_name,
        g.notes,
        COALESCE(a.status, 'NO_RESPONSE') AS status,
        a.submitted_at,
        COALESCE(a.extra_guests, 0) AS extra_guests
    FROM guests g
    LEFT JOIN attendance a ON a.guest_id = g.id
    WHERE g.invitation_id = :inv
    ORDER BY g.table_id ASC, g.full_name ASC
");
$st->execute([':inv' => $invId]);
$guests = $st->fetchAll();

$STATUS_AZ = [
    'GOING'       => 'Gələcək',
    'NOT_GOING'   => 'Gəlməyəcək',
    'MAYBE'       => 'Bəlkə',
    'NO_RESPONSE' => 'Cavab yoxdur',
];

/* ── CSV escape ── */
$esc = fn($v) => (strpbrk((string)($v ?? ''), ';",' . "\n") !== false)
    ? '"' . str_replace('"', '""', (string)($v ?? '')) . '"'
    : (string)($v ?? '');

/* ── CSV məzmunu ── */
$sep  = ';';
$bom  = "\xEF\xBB\xBF";  // UTF-8 BOM — Excel üçün

if ($mode === 'status') {
    /* Statuslara görə qruplaşdır */
    $grouped = ['GOING' => [], 'NOT_GOING' => [], 'MAYBE' => [], 'NO_RESPONSE' => []];
    foreach ($guests as $g) {
        $grouped[$g['status']][] = $g;
    }

    $lines = ['Ad' . $sep . 'Status' . $sep . 'Əlavə qonaq' . $sep . 'Masa' . $sep . 'Qeyd' . $sep . 'Tarix'];
    foreach ($grouped as $statusKey => $list) {
        if (empty($list)) continue;
        $lines[] = '';
        $lines[] = '=== ' . $STATUS_AZ[$statusKey] . ' ===';
        foreach ($list as $g) {
            $lines[] = implode($sep, [
                $esc($g['full_name']),
                $esc($STATUS_AZ[$g['status']] ?? $g['status']),
                $esc($g['extra_guests'] > 0 ? '+' . $g['extra_guests'] : '0'),
                $esc($g['table_id']),
                $esc($g['notes'] ?? ''),
                $esc($g['submitted_at'] ? substr($g['submitted_at'], 0, 10) : ''),
            ]);
        }
    }
} else {
    /* Masalara görə qruplaşdır (default) */
    $grouped = [];
    foreach ($guests as $g) {
        $grouped[$g['table_id']][] = $g;
    }

    $lines = ['Masa' . $sep . 'Ad' . $sep . 'Status' . $sep . 'Əlavə qonaq' . $sep . 'Qeyd' . $sep . 'Tarix'];
    foreach ($grouped as $tableId => $list) {
        $lines[] = '';
        $lines[] = '=== ' . $tableId . ' ===';
        foreach ($list as $g) {
            $lines[] = implode($sep, [
                $esc($g['table_id']),
                $esc($g['full_name']),
                $esc($STATUS_AZ[$g['status']] ?? $g['status']),
                $esc($g['extra_guests'] > 0 ? '+' . $g['extra_guests'] : '0'),
                $esc($g['notes'] ?? ''),
                $esc($g['submitted_at'] ? substr($g['submitted_at'], 0, 10) : ''),
            ]);
        }
    }
}

$today    = date('Y-m-d');
$filename = "qonaqlar-{$invId}-{$today}.csv";

/* Override Content-Type (config.php-dan gəlir) */
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: no-cache, no-store');

echo $bom . implode("\r\n", $lines);
