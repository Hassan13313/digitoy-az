<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Müştəri panelindən oturma planının redaktəsi (2026-11-18)
   POST /api/owner_seating.php   (X-Owner-Token = müştəri paneli açarı)
     { slug, action:'unlock', pin }                         → { ok, token, exp }
     { slug, action:'add', token, full_name, table_id?, notes?, side?, group_name? }
     { slug, action:'update', token, id, full_name?, table_id?, notes?, side?, group_name? }
     { slug, action:'move', token, id, table_id }            table_id '' = masadan çıxar
     { slug, action:'bulk', token, ids:[…], patch:{ table_id?, side?, group_name? } }   (v52)
     { slug, action:'layout', token, layout:{…}, renames?:[{from,to}], removed?:[ad] }  (v52)
     { slug, action:'delete', token, id }
     { slug, action:'undo', token }                         → son dəyişikliyi geri qaytarır
     { slug, action:'history', token }                      → son 20 dəyişiklik
   Qaydalar və qoruma: seating_owner_lib.php
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/owner_auth.php';
require_once __DIR__ . '/seating_owner_lib.php';
header('Cache-Control: no-store');

function seatFail(int $code, string $err): never {
    http_response_code($code);
    echo json_encode(['error' => $err]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') seatFail(405, 'POST required');
$raw = (string) file_get_contents('php://input');
if (strlen($raw) > 65536) seatFail(413, 'Payload too large');   /* v52: zal planı JSON-u */
$body   = json_decode($raw, true);
if (!is_array($body)) seatFail(400, 'Invalid JSON');
$slug   = is_string($body['slug'] ?? null) ? trim($body['slug']) : '';
$action = is_string($body['action'] ?? null) ? $body['action'] : '';
if (!isValidSlug($slug)) seatFail(400, 'Valid slug required');

ensureTables();
$db = getDB();

/* 1) Müştəri açarı — yalnız məhz bu dəvətnamənin açarı */
$ownerToken = readOwnerToken();
if (!ownerKeyValid($db, $slug, $ownerToken)) ownerAccessDenied();

/* 2) Paket / bölmə */
$st = $db->prepare('SELECT form_data FROM invitations WHERE slug = :s LIMIT 1');
$st->execute([':s' => $slug]);
$fd = json_decode((string) $st->fetchColumn(), true) ?: [];
if (!ownerSeatingAllowed($fd)) seatFail(403, 'SEATING_NOT_IN_PACKAGE');

/* 3) PİN → redaktə tokeni */
$pq = $db->prepare('SELECT pin_hash FROM owner_edit_pins WHERE slug = :s LIMIT 1');
$pq->execute([':s' => $slug]);
$pinHash = (string) ($pq->fetchColumn() ?: '');
if ($pinHash === '') seatFail(403, 'NO_PIN');
$secret = $pinHash . '|' . $ownerToken;

if ($action === 'unlock') {
    /* Kobud gücə qarşı: link üzrə 15 dəqiqədə 20, IP üzrə 10 cəhd */
    if (!rateGate('seat_pin|' . $slug, 20, 900) || !rateGate('seat_pin_ip|' . clientIp(), 10, 900)) {
        seatFail(429, 'TOO_MANY_ATTEMPTS');
    }
    $pin = is_string($body['pin'] ?? null) ? preg_replace('/\D/', '', $body['pin']) : '';
    if (strlen($pin) !== 6 || !password_verify($pin, $pinHash)) seatFail(403, 'BAD_PIN');
    $token = seatTokenMake($slug, $secret);
    echo json_encode(['ok' => true, 'token' => $token, 'exp' => (int) explode('.', $token)[0]]);
    exit;
}

$token = is_string($body['token'] ?? null) ? $body['token'] : '';
if (!seatTokenValid($token, $slug, $secret)) seatFail(401, 'EDIT_LOCKED');
if (!rateGate('seat_edit|' . $slug, 600, 3600)) seatFail(429, 'RATE_LIMITED');

/** Qonaq MƏHZ bu dəvətnaməyə aiddir? (sətir və ya null) */
function seatGuest(PDO $db, string $slug, $id): ?array {
    $id = (int) $id;
    if ($id <= 0) return null;
    $q = $db->prepare('SELECT id, table_id, full_name, seat_number, notes, side, group_name FROM guests WHERE id = :id AND invitation_id = :s LIMIT 1');
    $q->execute([':id' => $id, ':s' => $slug]);
    return $q->fetch(PDO::FETCH_ASSOC) ?: null;
}

switch ($action) {
    case 'add': {
        $name  = seatClean($body['full_name'] ?? '', SEAT_NAME_MAX);
        $table = seatClean($body['table_id'] ?? '', SEAT_TABLE_MAX);
        $notes = seatClean($body['notes'] ?? '', SEAT_NOTE_MAX);
        $side  = seatSide($body['side'] ?? null);
        $group = seatGroup($body['group_name'] ?? null);
        if ($name === '') seatFail(422, 'NAME_REQUIRED');   /* v52: masa boş ola bilər */
        $c = $db->prepare('SELECT COUNT(*) FROM guests WHERE invitation_id = :s');
        $c->execute([':s' => $slug]);
        if ((int) $c->fetchColumn() >= SEAT_GUESTS_MAX) seatFail(422, 'TOO_MANY_GUESTS');
        $db->prepare('INSERT INTO guests (invitation_id, table_id, full_name, notes, side, group_name) VALUES (:s, :t, :n, :no, :sd, :gr)')
           ->execute([':s' => $slug, ':t' => $table, ':n' => $name, ':no' => $notes ?: null, ':sd' => $side, ':gr' => $group]);
        $id = (int) $db->lastInsertId();
        seatRecord($db, $slug, 'add', $id, null, ['table_id' => $table, 'full_name' => $name, 'notes' => $notes, 'side' => $side, 'group_name' => $group]);
        echo json_encode(['ok' => true, 'id' => $id]);
        exit;
    }
    case 'update':
    case 'move': {
        $g = seatGuest($db, $slug, $body['id'] ?? 0);
        if (!$g) seatFail(404, 'GUEST_NOT_FOUND');
        $new = [
            'table_id'  => array_key_exists('table_id', $body) ? seatClean($body['table_id'], SEAT_TABLE_MAX) : $g['table_id'],
            'full_name' => ($action === 'update' && array_key_exists('full_name', $body)) ? seatClean($body['full_name'], SEAT_NAME_MAX) : $g['full_name'],
            'notes'     => ($action === 'update' && array_key_exists('notes', $body)) ? seatClean($body['notes'], SEAT_NOTE_MAX) : (string) ($g['notes'] ?? ''),
            'side'       => ($action === 'update' && array_key_exists('side', $body)) ? seatSide($body['side']) : $g['side'],
            'group_name' => ($action === 'update' && array_key_exists('group_name', $body)) ? seatGroup($body['group_name']) : $g['group_name'],
        ];
        if ($new['full_name'] === '') seatFail(422, 'NAME_REQUIRED');
        $db->prepare('UPDATE guests SET table_id = :t, full_name = :n, notes = :no, side = :sd, group_name = :gr WHERE id = :id AND invitation_id = :s')
           ->execute([':t' => $new['table_id'], ':n' => $new['full_name'], ':no' => $new['notes'] ?: null,
                      ':sd' => $new['side'], ':gr' => $new['group_name'], ':id' => (int) $g['id'], ':s' => $slug]);
        seatRecord($db, $slug, $action, (int) $g['id'],
            ['table_id' => $g['table_id'], 'full_name' => $g['full_name'], 'notes' => (string) ($g['notes'] ?? ''),
             'side' => $g['side'], 'group_name' => $g['group_name']], $new);
        echo json_encode(['ok' => true]);
        exit;
    }
    case 'delete': {
        $g = seatGuest($db, $slug, $body['id'] ?? 0);
        if (!$g) seatFail(404, 'GUEST_NOT_FOUND');
        $db->beginTransaction();
        $db->prepare('DELETE FROM attendance WHERE guest_id = :id')->execute([':id' => (int) $g['id']]);
        $db->prepare('DELETE FROM guests WHERE id = :id AND invitation_id = :s')->execute([':id' => (int) $g['id'], ':s' => $slug]);
        seatRecord($db, $slug, 'delete', (int) $g['id'],
            ['table_id' => $g['table_id'], 'full_name' => $g['full_name'], 'notes' => (string) ($g['notes'] ?? ''),
             'side' => $g['side'], 'group_name' => $g['group_name']], null);
        $db->commit();
        echo json_encode(['ok' => true]);
        exit;
    }
    case 'undo': {
        $q = $db->prepare("SELECT * FROM guest_changes WHERE invitation_id = :s AND actor = 'owner' AND undone = 0 ORDER BY id DESC LIMIT 1");
        $q->execute([':s' => $slug]);
        $ch = $q->fetch(PDO::FETCH_ASSOC);
        if (!$ch) seatFail(404, 'NOTHING_TO_UNDO');
        $plan = seatUndoPlan($ch);
        if ($plan) {
            [$op, $gid, $f] = $plan;
            if ($op === 'delete') {
                $db->prepare('DELETE FROM attendance WHERE guest_id = :id')->execute([':id' => $gid]);
                $db->prepare('DELETE FROM guests WHERE id = :id AND invitation_id = :s')->execute([':id' => $gid, ':s' => $slug]);
            } elseif ($op === 'insert') {
                $db->prepare('INSERT INTO guests (invitation_id, table_id, full_name, notes, side, group_name) VALUES (:s, :t, :n, :no, :sd, :gr)')
                   ->execute([':s' => $slug, ':t' => $f['table_id'], ':n' => $f['full_name'], ':no' => ($f['notes'] ?? '') ?: null,
                              ':sd' => $f['side'] ?? null, ':gr' => $f['group_name'] ?? null]);
            } elseif ($op === 'bulk') {
                seatRestoreGuests($db, $slug, $f);
            } elseif ($op === 'layout') {
                seatLayoutSave($db, $slug, is_array($f['layout'] ?? null) ? seatLayoutNormalize($f['layout']) : null);
                seatRestoreGuests($db, $slug, is_array($f['guests'] ?? null) ? $f['guests'] : []);
            } else {
                seatRestoreGuests($db, $slug, [['id' => $gid] + $f]);   /* köhnə qeydlərdə side/group_name yoxdur — toxunulmur */
            }
        }
        $db->prepare('UPDATE guest_changes SET undone = 1 WHERE id = :id')->execute([':id' => (int) $ch['id']]);
        echo json_encode(['ok' => true, 'undone' => $ch['action']]);
        exit;
    }
    case 'bulk': {
        $ids = seatIds($body['ids'] ?? []);
        $patch = seatPatch($body['patch'] ?? []);
        if (!$ids || !$patch) seatFail(422, 'IDS_AND_PATCH_REQUIRED');
        $db->beginTransaction();
        $before = seatApplyBulk($db, $slug, $ids, $patch);
        if ($before) seatRecord($db, $slug, 'bulk', null, $before, ['count' => count($before)] + $patch);
        $db->commit();
        echo json_encode(['ok' => true, 'changed' => count($before)]);
        exit;
    }
    case 'layout': {
        $res = seatApplyLayout($db, $slug, $body['layout'] ?? null, $body['renames'] ?? [], $body['removed'] ?? []);
        seatRecord($db, $slug, 'layout', null, ['layout' => $res['before'], 'guests' => $res['guests']], ['tables' => count($res['layout']['tables'])]);
        echo json_encode(['ok' => true, 'layout' => $res['layout']], JSON_UNESCAPED_UNICODE);
        exit;
    }
    case 'history': {
        $q = $db->prepare("SELECT id, action, before_json, after_json, created_at FROM guest_changes
                           WHERE invitation_id = :s AND actor = 'owner' AND undone = 0 ORDER BY id DESC LIMIT 20");
        $q->execute([':s' => $slug]);
        $items = array_map(fn($r) => [
            'id' => (int) $r['id'], 'action' => $r['action'], 'at' => $r['created_at'],
            'before' => $r['before_json'] ? json_decode($r['before_json'], true) : null,
            'after'  => $r['after_json'] ? json_decode($r['after_json'], true) : null,
        ], $q->fetchAll(PDO::FETCH_ASSOC));
        echo json_encode(['ok' => true, 'items' => $items], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
seatFail(400, 'Unknown action');
