<?php
/* ── get_invitations_list.php — Admin: approved dəvətnamələr ── */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$limit  = min((int)($_GET['limit']  ?? 50), 100);
$offset = max((int)($_GET['offset'] ?? 0),  0);
$search = trim($_GET['search'] ?? '');

$db = getDB();

$conditions = [];
$params     = [];

if ($search !== '') {
    $like = '%' . $search . '%';
    $conditions[] = "(slug LIKE :s1 OR form_data LIKE :s2)";
    $params[':s1'] = $like;
    $params[':s2'] = $like;
}

$where = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';

$cntStmt = $db->prepare("SELECT COUNT(*) FROM invitations $where");
$cntStmt->execute($params);
$total = (int)$cntStmt->fetchColumn();

$sql  = "SELECT id, slug, form_data, created_at, updated_at
         FROM invitations $where
         ORDER BY created_at DESC
         LIMIT :lim OFFSET :off";
$stmt = $db->prepare($sql);
foreach ($params as $k => $v) $stmt->bindValue($k, $v);
$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
$stmt->bindValue(':off', $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

$items = [];
foreach ($rows as $row) {
    $fd        = $row['form_data'] ? json_decode($row['form_data'], true) : [];
    $eventType = $fd['eventType'] ?? '';
    $isCouple  = in_array($eventType, ['toy', 'nishan']);
    $isCorp    = in_array($eventType, ['corporate', 'other']);

    if ($isCouple) {
        $names = trim(($fd['brideName'] ?? '') . ' & ' . ($fd['groomName'] ?? ''), ' &');
    } elseif ($isCorp) {
        $names = $fd['eventName'] ?? '';
    } else {
        $names = $fd['brideName'] ?? '';
    }

    $items[] = [
        'id'         => $row['id'],
        'slug'       => $row['slug'],
        'names'      => $names ?: '—',
        'event_type' => $eventType,
        'date'       => $fd['date'] ?? '',
        'venue'      => $fd['venueName'] ?? '',
        'package'    => $fd['package'] ?? '',
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
    ];
}

echo json_encode(['ok' => true, 'invitations' => $items, 'total' => $total]);
