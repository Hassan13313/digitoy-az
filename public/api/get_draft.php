<?php
/* ── get_draft.php — session_id YA DA draft_code üzrə draft-ı qaytar ── */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$sessionId = trim($_GET['session_id'] ?? '');
$draftCode = trim($_GET['draft_code'] ?? '');

if (!$sessionId && !$draftCode) {
    http_response_code(400);
    echo json_encode(['error' => 'session_id or draft_code required']);
    exit;
}

ensureTables();
$db = getDB();

if ($draftCode) {
    /* draft_code üzrə axtarış (admin axını) */
    if (!preg_match('/^DT-[A-Z0-9]{6}$/', $draftCode)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid draft_code format']);
        exit;
    }
    $stmt = $db->prepare("
        SELECT id, draft_code, package, current_step, status, form_data,
               customer_phone, submitted_at, approved_slug
        FROM draft_invitations
        WHERE draft_code = :code
          AND expires_at > NOW()
        LIMIT 1");
    $stmt->execute([':code' => $draftCode]);
} else {
    /* session_id üzrə axtarış (autosave restore axını) */
    if (!preg_match('/^[a-zA-Z0-9\-]{8,64}$/', $sessionId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid session_id required']);
        exit;
    }
    $stmt = $db->prepare("
        SELECT id, draft_code, package, current_step, status, form_data,
               customer_phone, submitted_at, approved_slug
        FROM draft_invitations
        WHERE session_id = :sid
          AND expires_at > NOW()
        ORDER BY updated_at DESC
        LIMIT 1");
    $stmt->execute([':sid' => $sessionId]);
}

$row = $stmt->fetch();

if (!$row) {
    http_response_code(404);
    echo json_encode(['found' => false]);
    exit;
}

/* approved_slug NULL + status approved → invitations cədvəlindən əldə etməyə çalış */
$approvedSlug = $row['approved_slug'] ?? null;
if (!$approvedSlug && $row['status'] === 'approved' && !empty($row['form_data'])) {
    $fd        = json_decode($row['form_data'], true);
    $searchKey = $fd['brideName'] ?? ($fd['groomName'] ?? ($fd['eventName'] ?? ''));
    if ($searchKey !== '') {
        $safeKey = addcslashes($searchKey, '%_\\');
        $lu = $db->prepare(
            "SELECT slug FROM invitations WHERE form_data LIKE :q ORDER BY created_at DESC LIMIT 1"
        );
        $lu->execute([':q' => '%"' . $safeKey . '"%']);
        $found = $lu->fetchColumn();
        if ($found) $approvedSlug = $found;
    }
}

echo json_encode([
    'found'          => true,
    'draft_code'     => $row['draft_code'],
    'package'        => $row['package'],
    'current_step'   => (int) $row['current_step'],
    'status'         => $row['status'],
    'form_data'      => $row['form_data'] ? json_decode($row['form_data'], true) : null,
    'customer_phone' => $row['customer_phone'] ?? null,
    'submitted_at'   => $row['submitted_at']   ?? null,
    'approved_slug'  => $approvedSlug,
]);
