<?php
/* ══════════════════════════════════════════════════
   POST /api/manage_guest.php  (Admin tələb olunur)
   action: add | update | delete | move | bulk | layout
   Phase 22 — Guest Management Refactor
   v52 (2026-11-26): masasız qonaq (table_id ''), side / group_name,
     bulk   { invitation_id, ids:[…], patch:{ table_id?, side?, group_name? } }
     layout { invitation_id, layout:{…}, renames:[{from,to}], removed:[ad] }
     assign { invitation_id, pairs:[{id, table_id}] }       (v53 avtomatik yerləşdirmə)
     adopt  { invitation_id, response_id }                   (v53 siyahıda olmayan RSVP → qonaq)
     venue_link { invitation_id, rotate? }                   (v53 restoran linkinin açarı)
   Qaydalar: seating_layout_lib.php (müştəri paneli ilə eyni).
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/seating_layout_lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

requireAdmin();

$body   = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }
$action = trim((string) ($body['action'] ?? ''));

ensureTables();
$db = getDB();

/* ── ADD ── */
if ($action === 'add') {
    $invId    = trim($body['invitation_id'] ?? '');
    $tableId  = trim($body['table_id']      ?? '');
    $fullName = trim($body['full_name']     ?? '');
    $seatNum  = isset($body['seat_number']) && $body['seat_number'] !== '' ? (int)$body['seat_number'] : null;
    $notes    = isset($body['notes']) ? trim($body['notes']) : null;

    /* v52: masa boş ola bilər — qonaq «masasız» siyahıda qalır */
    if (!$invId || !$fullName) {
        http_response_code(422);
        echo json_encode(['error' => 'invitation_id and full_name required']);
        exit;
    }

    $st = $db->prepare("
        INSERT INTO guests (invitation_id, table_id, full_name, seat_number, notes, side, group_name)
        VALUES (:inv, :tbl, :name, :seat, :notes, :side, :grp)
    ");
    $st->execute([
        ':inv'   => substr($invId, 0, 120),
        ':tbl'   => seatClean($tableId, SEAT_TABLE_MAX),
        ':name'  => substr($fullName, 0, 255),
        ':seat'  => $seatNum,
        ':notes' => $notes ? substr($notes, 0, 1000) : null,
        ':side'  => seatSide($body['side'] ?? null),
        ':grp'   => seatGroup($body['group_name'] ?? null),
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
    $notes    = array_key_exists('notes', $body) ? (trim((string) ($body['notes'] ?? '')) ?: null) : false;   /* null → boş (PHP 8.1 trim(null) xəbərdarlığı JSON-u pozurdu) */

    if (!$id) { http_response_code(422); echo json_encode(['error' => 'id required']); exit; }

    $sets   = [];
    $params = [':id' => $id];
    if ($tableId  !== null)  { $sets[] = 'table_id = :tbl';   $params[':tbl']  = seatClean($tableId, SEAT_TABLE_MAX); }
    if (array_key_exists('side', $body))       { $sets[] = 'side = :side';      $params[':side'] = seatSide($body['side']); }
    if (array_key_exists('group_name', $body)) { $sets[] = 'group_name = :grp'; $params[':grp']  = seatGroup($body['group_name']); }
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
    $tableId = seatClean($body['table_id'] ?? '', SEAT_TABLE_MAX);   /* '' = masadan çıxar */
    if (!$id) { http_response_code(422); echo json_encode(['error' => 'id required']); exit; }

    $db->prepare("UPDATE guests SET table_id = :tbl WHERE id = :id")->execute([
        ':tbl' => $tableId,
        ':id'  => $id,
    ]);
    echo json_encode(['ok' => true]);
    exit;
}

/* ── v52: BULK (seçilmiş qonaqlar: masa / tərəf / qrup) və LAYOUT (zal planı) ── */
if (in_array($action, ['bulk', 'layout', 'assign', 'adopt', 'venue_link'], true)) {
    $invId = is_string($body['invitation_id'] ?? null) ? trim($body['invitation_id']) : '';
    if (!isValidSlug($invId)) { http_response_code(422); echo json_encode(['error' => 'invitation_id required']); exit; }
    if ($action === 'bulk') {
        $ids = seatIds($body['ids'] ?? []);
        $patch = seatPatch($body['patch'] ?? []);
        if (!$ids || !$patch) { http_response_code(422); echo json_encode(['error' => 'ids and patch required']); exit; }
        $changed = seatApplyBulk($db, $invId, $ids, $patch);
        echo json_encode(['ok' => true, 'changed' => count($changed)]);
        exit;
    }
    if ($action === 'assign') {
        $db->beginTransaction();
        $changed = seatApplyAssign($db, $invId, $body['pairs'] ?? []);
        $db->commit();
        echo json_encode(['ok' => true, 'changed' => count($changed)]);
        exit;
    }
    if ($action === 'adopt') {
        $g = seatAdopt($db, $invId, $body['response_id'] ?? 0);
        if (!$g) { http_response_code(404); echo json_encode(['error' => 'RESPONSE_NOT_FOUND']); exit; }
        echo json_encode(['ok' => true, 'id' => $g['id']]);
        exit;
    }
    if ($action === 'venue_link') {
        echo json_encode(['ok' => true, 'key' => seatVenueKey($db, $invId, !empty($body['rotate']))]);
        exit;
    }
    $res = seatApplyLayout($db, $invId, $body['layout'] ?? null, $body['renames'] ?? [], $body['removed'] ?? []);
    echo json_encode(['ok' => true, 'layout' => $res['layout']], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(422);
echo json_encode(['error' => 'Invalid action. Use: add, update, delete, move, bulk, layout, assign, adopt, venue_link']);
