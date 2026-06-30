<?php
/* ══════════════════════════════════════════════════
   POST /api/manage_guest.php  (Admin tələb olunur)
   action: add | update | delete | move
   Phase 22 — Guest Management Refactor
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

requireAdmin();

$body   = json_decode(file_get_contents('php://input'), true);
$action = trim($body['action'] ?? '');

ensureTables();
$db = getDB();

/* ── ADD ── */
if ($action === 'add') {
    $invId    = trim($body['invitation_id'] ?? '');
    $tableId  = trim($body['table_id']      ?? '');
    $fullName = trim($body['full_name']     ?? '');
    $seatNum  = isset($body['seat_number']) && $body['seat_number'] !== '' ? (int)$body['seat_number'] : null;
    $notes    = isset($body['notes']) ? trim($body['notes']) : null;

    if (!$invId || !$tableId || !$fullName) {
        http_response_code(422);
        echo json_encode(['error' => 'invitation_id, table_id and full_name required']);
        exit;
    }

    $st = $db->prepare("
        INSERT INTO guests (invitation_id, table_id, full_name, seat_number, notes)
        VALUES (:inv, :tbl, :name, :seat, :notes)
    ");
    $st->execute([
        ':inv'   => substr($invId, 0, 120),
        ':tbl'   => substr($tableId, 0, 80),
        ':name'  => substr($fullName, 0, 255),
        ':seat'  => $seatNum,
        ':notes' => $notes ? substr($notes, 0, 1000) : null,
    ]);
    $newId = (int)$db->lastInsertId();
    echo json_encode(['ok' => true, 'id' => $newId]);
    exit;
}

/* ── UPDATE ── */
if ($action === 'update') {
    $id       = (int)($body['id'] ?? 0);
    $tableId  = isset($body['table_id'])  ? trim($body['table_id'])  : null;
    $fullName = isset($body['full_name']) ? trim($body['full_name']) : null;
    $seatNum  = array_key_exists('seat_number', $body) ? (($body['seat_number'] !== null && $body['seat_number'] !== '') ? (int)$body['seat_number'] : null) : false;
    $notes    = array_key_exists('notes', $body) ? (trim($body['notes']) ?: null) : false;

    if (!$id) { http_response_code(422); echo json_encode(['error' => 'id required']); exit; }

    $sets   = [];
    $params = [':id' => $id];
    if ($tableId  !== null)  { $sets[] = 'table_id = :tbl';   $params[':tbl']  = substr($tableId, 0, 80); }
    if ($fullName !== null)  { $sets[] = 'full_name = :name'; $params[':name'] = substr($fullName, 0, 255); }
    if ($seatNum  !== false) { $sets[] = 'seat_number = :seat'; $params[':seat'] = $seatNum; }
    if ($notes    !== false) { $sets[] = 'notes = :notes';     $params[':notes'] = $notes ? substr($notes, 0, 1000) : null; }

    if (empty($sets)) { echo json_encode(['ok' => true]); exit; }

    $db->prepare("UPDATE guests SET " . implode(', ', $sets) . " WHERE id = :id")->execute($params);
    echo json_encode(['ok' => true]);
    exit;
}

/* ── DELETE ── */
if ($action === 'delete') {
    $id = (int)($body['id'] ?? 0);
    if (!$id) { http_response_code(422); echo json_encode(['error' => 'id required']); exit; }

    $db->beginTransaction();
    try {
        $db->prepare("DELETE FROM attendance WHERE guest_id = :id")->execute([':id' => $id]);
        $db->prepare("DELETE FROM guests WHERE id = :id")->execute([':id' => $id]);
        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Silmə əməliyyatı uğursuz oldu']);
        exit;
    }
    echo json_encode(['ok' => true]);
    exit;
}

/* ── MOVE (table dəyişdir) ── */
if ($action === 'move') {
    $id      = (int)($body['id']       ?? 0);
    $tableId = trim($body['table_id']  ?? '');
    if (!$id || !$tableId) { http_response_code(422); echo json_encode(['error' => 'id and table_id required']); exit; }

    $db->prepare("UPDATE guests SET table_id = :tbl WHERE id = :id")->execute([
        ':tbl' => substr($tableId, 0, 80),
        ':id'  => $id,
    ]);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(422);
echo json_encode(['error' => 'Invalid action. Use: add, update, delete, move']);
