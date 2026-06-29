<?php
/* ══════════════════════════════════════════════════
   POST /api/submit_attendance.php  (Public)
   Body: { guest_id, status, optional_message }
   Hər qonaq yalnız bir dəfə cavab verə bilər.
   Phase 22 — Guest Management Refactor
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body        = json_decode(file_get_contents('php://input'), true);
$guestId     = (int)($body['guest_id'] ?? 0);
$status      = strtoupper(trim($body['status'] ?? ''));
$msg         = isset($body['optional_message']) ? trim($body['optional_message']) : null;
$extraGuests = min(10, max(0, (int)($body['extra_guests'] ?? 0)));

if (!$guestId) {
    http_response_code(422);
    echo json_encode(['error' => 'guest_id required']);
    exit;
}

$allowed = ['GOING', 'NOT_GOING', 'MAYBE'];
if (!in_array($status, $allowed, true)) {
    http_response_code(422);
    echo json_encode(['error' => 'status must be GOING, NOT_GOING or MAYBE']);
    exit;
}

ensureTables();
$db = getDB();

/* ── Qonağın mövcud olduğunu yoxla ── */
$check = $db->prepare("SELECT id FROM guests WHERE id = :id LIMIT 1");
$check->execute([':id' => $guestId]);
if (!$check->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'guest_not_found']);
    exit;
}

/* ── Artıq cavab verib? ── */
$dup = $db->prepare("SELECT status, submitted_at FROM attendance WHERE guest_id = :id AND status != 'NO_RESPONSE' LIMIT 1");
$dup->execute([':id' => $guestId]);
$existing = $dup->fetch();
if ($existing) {
    http_response_code(409);
    echo json_encode([
        'error'        => 'already_submitted',
        'status'       => $existing['status'],
        'submitted_at' => $existing['submitted_at'],
    ]);
    exit;
}

/* ── UPSERT: NO_RESPONSE varsa UPDATE, yoxdursa INSERT ── */
$now = date('Y-m-d H:i:s');
$st  = $db->prepare("
    INSERT INTO attendance (guest_id, status, submitted_at, optional_message, extra_guests)
    VALUES (:gid, :status, :now, :msg, :eg)
    ON DUPLICATE KEY UPDATE
        status           = VALUES(status),
        submitted_at     = VALUES(submitted_at),
        optional_message = VALUES(optional_message),
        extra_guests     = VALUES(extra_guests)
");
$st->execute([
    ':gid'    => $guestId,
    ':status' => $status,
    ':now'    => $now,
    ':msg'    => $msg ? substr($msg, 0, 1000) : null,
    ':eg'     => $extraGuests,
]);

echo json_encode(['ok' => true, 'status' => $status, 'submitted_at' => $now]);
