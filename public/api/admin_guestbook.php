<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Phase 36: təbrik məktublarının moderasiyası (admin)

   GET  ?slug=&limit=&offset=&search=   → mesaj siyahısı (id ilə)
   POST { id: N }                       → mesajı sil

   ⚠ QONAĞIN AXINI DƏYİŞMİR: `submit_guest_response.php` və
   `get_guest_responses.php` toxunulmur, DB sxemi dəyişmir.

   ⚠ SİLMƏ QAYDASI (vacib):
   `guest_responses` bir sətirdə HƏM təbrik mesajını, HƏM DƏ RSVP cavabını
   (attendance_status + extra_guests) saxlayır. Sətri bütöv silmək qonağın
   iştirak cavabını da məhv edərdi — statistika səhv göstərərdi.
   Ona görə:
     • attendance_status IS NULL  → sətir yalnız mesajdır → SİLİNİR
     • attendance_status var      → yalnız `message = NULL` → RSVP QALIR
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();
ensureTables();
$db = getDB();

/* ─────────────────────────── SİLMƏ ─────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $id   = (int)($body['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(422);
        echo json_encode(['error' => 'Valid id required']);
        exit;
    }

    $st = $db->prepare("SELECT id, attendance_status FROM guest_responses WHERE id = :id LIMIT 1");
    $st->execute([':id' => $id]);
    $row = $st->fetch();

    /* İdempotent: onsuz da yoxdursa 200 — ikiqat klik xəta göstərməsin */
    if (!$row) {
        echo json_encode(['ok' => true, 'id' => $id, 'already' => true]);
        exit;
    }

    if ($row['attendance_status'] === null) {
        $db->prepare("DELETE FROM guest_responses WHERE id = :id")->execute([':id' => $id]);
        $mode = 'row_deleted';
    } else {
        $db->prepare("UPDATE guest_responses SET message = NULL WHERE id = :id")->execute([':id' => $id]);
        $mode = 'message_cleared';
    }

    echo json_encode(['ok' => true, 'id' => $id, 'mode' => $mode]);
    exit;
}

/* ─────────────────────────── SİYAHI ─────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET or POST required']);
    exit;
}

$limit  = min(max((int)($_GET['limit'] ?? 100), 1), 200);
$offset = max((int)($_GET['offset'] ?? 0), 0);
$slug   = trim($_GET['slug']   ?? '');
$search = trim($_GET['search'] ?? '');

$conds  = ["message IS NOT NULL", "message != ''"];
$params = [];

if ($slug !== '' && preg_match('/^[a-zA-Z0-9\-]{2,120}$/', $slug)) {
    $conds[] = 'invitation_id = :inv';
    $params[':inv'] = $slug;
}

if ($search !== '') {
    $conds[] = '(guest_name LIKE :q1 OR message LIKE :q2 OR invitation_id LIKE :q3)';
    $like = '%' . $search . '%';
    $params[':q1'] = $like;
    $params[':q2'] = $like;
    $params[':q3'] = $like;
}

$where = 'WHERE ' . implode(' AND ', $conds);

$cnt = $db->prepare("SELECT COUNT(*) FROM guest_responses $where");
$cnt->execute($params);
$total = (int)$cnt->fetchColumn();

$sql = "SELECT id, invitation_id, guest_name, message, attendance_status, created_at
        FROM guest_responses $where
        ORDER BY created_at DESC, id DESC
        LIMIT :lim OFFSET :off";
$st = $db->prepare($sql);
foreach ($params as $k => $v) $st->bindValue($k, $v);
$st->bindValue(':lim', $limit,  PDO::PARAM_INT);
$st->bindValue(':off', $offset, PDO::PARAM_INT);
$st->execute();

$messages = array_map(fn($r) => [
    'id'         => (int)$r['id'],
    'slug'       => $r['invitation_id'],
    'name'       => $r['guest_name'],
    'text'       => $r['message'],
    'has_rsvp'   => $r['attendance_status'] !== null,
    'created_at' => $r['created_at'],
], $st->fetchAll());

echo json_encode(['ok' => true, 'messages' => $messages, 'total' => $total]);
