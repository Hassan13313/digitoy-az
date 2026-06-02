<?php
/* ── get_orders_list.php — Admin: submitted/all draft siyahısı ── */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$status = trim($_GET['status'] ?? 'submitted');
$limit  = min((int)($_GET['limit']  ?? 50), 100);
$offset = max((int)($_GET['offset'] ?? 0),  0);

$validStatuses = ['submitted', 'approved', 'rejected', 'draft', 'all'];
if (!in_array($status, $validStatuses, true)) $status = 'submitted';

$db = getDB();

$where  = $status === 'all' ? "WHERE status != 'draft'" : "WHERE status = :status";
$params = $status === 'all' ? [] : [':status' => $status];

/* Total sayı */
$cntStmt = $db->prepare("SELECT COUNT(*) FROM draft_invitations $where");
$cntStmt->execute($params);
$total = (int)$cntStmt->fetchColumn();

/* Siyahı */
$sql  = "SELECT id, draft_code, package, status, customer_phone, submitted_at, form_data
         FROM draft_invitations $where
         ORDER BY submitted_at DESC
         LIMIT :lim OFFSET :off";
$stmt = $db->prepare($sql);
if ($status !== 'all') $stmt->bindValue(':status', $status);
$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
$stmt->bindValue(':off', $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

$pkgLabels = ['SADE' => 'Sadə (59₼)', 'VIP' => 'VİP (89₼)', 'PREMIUM' => 'Premium (129₼)'];

$orders = [];
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

    $orders[] = [
        'id'             => $row['id'],
        'draft_code'     => $row['draft_code'],
        'package'        => $row['package'],
        'package_label'  => $pkgLabels[$row['package']] ?? $row['package'],
        'status'         => $row['status'],
        'customer_phone' => $row['customer_phone'] ?? '',
        'submitted_at'   => $row['submitted_at'],
        'event_type'     => $eventType,
        'names'          => $names ?: '—',
    ];
}

echo json_encode(['ok' => true, 'orders' => $orders, 'total' => $total]);
