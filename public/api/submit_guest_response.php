<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

$invId  = trim($body['invitation_id'] ?? '');
$name   = strip_tags(trim($body['guest_name'] ?? ''));
$msg    = strip_tags(trim($body['message']    ?? ''));
$status = $body['attendance_status']  ?? null;
$extra  = max(0, min(10, (int)($body['extra_guests'] ?? 0)));

if (!$invId || !$name) {
    http_response_code(422);
    echo json_encode(['error' => 'invitation_id and guest_name required']);
    exit;
}

if ($status !== null && !in_array($status, ['yes', 'no'], true)) {
    http_response_code(422);
    echo json_encode(['error' => 'attendance_status must be yes or no']);
    exit;
}

ensureTables();
$db = getDB();

$st = $db->prepare("
    INSERT INTO guest_responses (invitation_id, guest_name, message, attendance_status, extra_guests)
    VALUES (:inv, :name, :msg, :status, :extra)
");
$st->execute([
    ':inv'    => substr($invId, 0, 120),
    ':name'   => substr($name,  0, 255),
    ':msg'    => $msg ?: null,
    ':status' => $status,
    ':extra'  => $extra,
]);

echo json_encode(['ok' => true, 'id' => $db->lastInsertId()]);
