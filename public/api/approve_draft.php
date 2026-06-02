<?php
/* ── approve_draft.php — draft_invitations.status = 'approved' ── */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body      = json_decode(file_get_contents('php://input'), true);
$draftCode = trim($body['draft_code'] ?? '');

if (!$draftCode || !preg_match('/^DT-[A-Z0-9]{6}$/', $draftCode)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid draft_code required']);
    exit;
}

$db = getDB();

$stmt = $db->prepare("
    UPDATE draft_invitations
    SET status      = 'approved',
        approved_at = NOW()
    WHERE draft_code = :code
");
$stmt->execute([':code' => $draftCode]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Draft not found', 'draft_code' => $draftCode]);
    exit;
}

echo json_encode(['ok' => true, 'draft_code' => $draftCode, 'status' => 'approved']);
