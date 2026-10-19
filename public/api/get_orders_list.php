<?php
/* ── get_orders_list.php — Admin: submitted/all draft siyahısı ── */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/order_link.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$status = trim($_GET['status'] ?? 'submitted');
$limit  = min((int)($_GET['limit']  ?? 50), 100);
$offset = max((int)($_GET['offset'] ?? 0),  0);
$search = trim($_GET['search'] ?? '');

$validStatuses = ['submitted', 'approved', 'rejected', 'draft', 'deleted', 'all', 'abandoned'];
if (!in_array($status, $validStatuses, true)) $status = 'submitted';
$isAbandoned = $status === 'abandoned';

/* Phase 4 — template_id sutunu SELECT-de istifade olunur; sxem hazir olsun */
ensureTables();
$db = getDB();

/* WHERE hissəsini dinamik qur */
$conditions = [];
$params     = [];

if ($status === 'all') {
    /* "Hamısı" tabı: draft + deleted xaric */
    $conditions[] = "status NOT IN ('draft', 'deleted')";
} elseif ($isAbandoned) {
    /* Phase 50 — «Yarımçıq»: builderdə nömrə qoyub sifarişi GÖNDƏRMƏYƏNLƏR.
       Eyni sessiyada göndərilmiş/təsdiqlənmiş sifariş varsa (sifarişdən sonra
       builderə qayıdanda autosave yeni draft yaradır) bu yalançı siqnaldır.
       Eyni cədvəldir — collation qarışığı yoxdur (bax order_link.php). */
    $conditions[] = "status = 'draft'";
    $conditions[] = "customer_phone IS NOT NULL AND customer_phone <> ''";
    $conditions[] = "NOT EXISTS (SELECT 1 FROM draft_invitations s2
                     WHERE s2.session_id = draft_invitations.session_id
                       AND s2.status IN ('submitted', 'approved'))";
} else {
    $conditions[] = "status = :status";
    $params[':status'] = $status;
}

/* Phase 4 — şablon üzrə filtr (?template=royal-gold) */
$templateFilter = trim($_GET['template'] ?? '');
if ($templateFilter !== '' && preg_match('/^[a-z0-9-]{2,50}$/', $templateFilter)) {
    $conditions[] = 'template_id = :tplf';
    $params[':tplf'] = $templateFilter;
}

if ($search !== '') {
    $like = '%' . $search . '%';
    $conditions[] = "(draft_code LIKE :s1 OR customer_phone LIKE :s2 OR form_data LIKE :s3)";
    $params[':s1'] = $like;
    $params[':s2'] = $like;
    $params[':s3'] = $like;
}

$where = 'WHERE ' . implode(' AND ', $conditions);

/* Total sayı */
$cntStmt = $db->prepare("SELECT COUNT(*) FROM draft_invitations $where");
$cntStmt->execute($params);
$total = (int)$cntStmt->fetchColumn();

/* Siyahı */
/* Qaralamanın submitted_at-ı NULL-dur — onda son fəaliyyət (updated_at) */
$sql  = "SELECT id, draft_code, package, status, customer_phone, submitted_at, updated_at, current_step,
                form_data, template_id, approved_slug
         FROM draft_invitations $where
         ORDER BY COALESCE(submitted_at, updated_at) DESC
         LIMIT :lim OFFSET :off";
$stmt = $db->prepare($sql);
foreach ($params as $k => $v) $stmt->bindValue($k, $v);
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
        'updated_at'     => $row['updated_at'],
        'current_step'   => (int) $row['current_step'],
        'event_type'     => $eventType,
        'names'          => $names ?: '—',
        /* Phase 48 — təsdiqlənmişin CANLI dəvətnaməsi (detal və silmə ilə eyni qayda) */
        'invitation_slug' => $row['status'] === 'approved'
            ? orderInvitationSlug($db, $row['approved_slug'], $row['draft_code']) : null,
        'template_id'    => !empty($fd['templateId']) ? $fd['templateId'] : ($row['template_id'] ?? DEFAULT_TEMPLATE_ID),
    ];
}

echo json_encode(['ok' => true, 'orders' => $orders, 'total' => $total]);
