<?php
/* ── get_rsvp_responses.php — Admin: slug üzrə RSVP cavabları ── */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$slug = trim($_GET['slug'] ?? '');
if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

$db = getDB();

/* RSVP cavabları (attendance_status dolu olanlar) */
$st = $db->prepare("
    SELECT guest_name, attendance_status, extra_guests, created_at
    FROM guest_responses
    WHERE invitation_id = :slug
      AND attendance_status IS NOT NULL
    ORDER BY created_at DESC
");
$st->execute([':slug' => $slug]);
$rows = $st->fetchAll();

/* Statistika */
$st2 = $db->prepare("
    SELECT
        SUM(attendance_status = 'yes')   AS yes_count,
        SUM(attendance_status = 'maybe') AS maybe_count,
        SUM(attendance_status = 'no')    AS no_count,
        SUM(CASE WHEN attendance_status = 'yes' THEN extra_guests ELSE 0 END) AS guests_count
    FROM guest_responses
    WHERE invitation_id = :slug AND attendance_status IS NOT NULL
");
$st2->execute([':slug' => $slug]);
$stats = $st2->fetch();

$responses = array_map(fn($r) => [
    'name'         => $r['guest_name'],
    'status'       => $r['attendance_status'],
    'extra_guests' => (int)$r['extra_guests'],
    'created_at'   => $r['created_at'],
], $rows);

echo json_encode([
    'ok'        => true,
    'slug'      => $slug,
    'responses' => $responses,
    'stats'     => [
        'yes'    => (int)($stats['yes_count']    ?? 0),
        'maybe'  => (int)($stats['maybe_count']  ?? 0),
        'no'     => (int)($stats['no_count']     ?? 0),
        'guests' => (int)($stats['guests_count'] ?? 0),
    ],
]);
