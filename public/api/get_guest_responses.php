<?php
require_once __DIR__ . '/config.php';

$invId = trim($_GET['invitation_id'] ?? '');
if (!$invId) {
    http_response_code(422);
    echo json_encode(['error' => 'invitation_id required']);
    exit;
}

ensureTables();
$db = getDB();

/* Guestbook messages — sadece mesaj olanlar */
$st = $db->prepare("
    SELECT guest_name, message, created_at
    FROM guest_responses
    WHERE invitation_id = :inv AND message IS NOT NULL AND message != ''
    ORDER BY created_at ASC
");
$st->execute([':inv' => substr($invId, 0, 120)]);
$messages = $st->fetchAll();

/* RSVP stats */
$st2 = $db->prepare("
    SELECT
        SUM(attendance_status = 'yes') AS yes_count,
        SUM(attendance_status = 'no')  AS no_count,
        SUM(CASE WHEN attendance_status = 'yes' THEN extra_guests ELSE 0 END) AS guests_count
    FROM guest_responses
    WHERE invitation_id = :inv AND attendance_status IS NOT NULL
");
$st2->execute([':inv' => substr($invId, 0, 120)]);
$row = $st2->fetch();

echo json_encode([
    'messages' => array_map(fn($r) => [
        'name'       => $r['guest_name'],
        'text'       => $r['message'],
        'created_at' => $r['created_at'],
    ], $messages),
    'rsvp' => [
        'yes'    => (int)($row['yes_count']    ?? 0),
        'no'     => (int)($row['no_count']     ?? 0),
        'guests' => (int)($row['guests_count'] ?? 0),
    ],
]);
