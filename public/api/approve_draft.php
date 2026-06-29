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
$slug      = trim($body['slug']       ?? '');

if (!$draftCode || !preg_match('/^DT-[A-Z0-9]{6}$/', $draftCode)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid draft_code required']);
    exit;
}

/* Slug validation — böyük hərflərə icazə ver (köhnə uppercase sluglar üçün) */
if ($slug !== '' && !preg_match('/^[a-zA-Z0-9\-]{2,120}$/', $slug)) {
    $slug = '';
}

$db = getDB();

/* Əsl slug-u tap: köhnə format (azer-nermin) ya da yeni (azer-nermin-ab12cd) */
$actualSlug = $slug;
if ($slug) {
    $checkExact = $db->prepare("SELECT slug FROM invitations WHERE slug = :slug LIMIT 1");
    $checkExact->execute([':slug' => $slug]);
    if (!$checkExact->fetchColumn()) {
        $code = substr(md5($slug . 'digitoy'), 0, 6);
        $uniqueSlug = $slug . '-' . $code;
        $checkUniq = $db->prepare("SELECT slug FROM invitations WHERE slug = :slug LIMIT 1");
        $checkUniq->execute([':slug' => $uniqueSlug]);
        if ($checkUniq->fetchColumn()) {
            $actualSlug = $uniqueSlug;
        }
    }
}

$stmt = $db->prepare("
    UPDATE draft_invitations
    SET status         = 'approved',
        approved_at    = NOW(),
        approved_slug  = CASE WHEN :slug != '' THEN :slug2 ELSE approved_slug END
    WHERE draft_code = :code
");
$stmt->execute([':code' => $draftCode, ':slug' => $actualSlug, ':slug2' => $actualSlug]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Draft not found', 'draft_code' => $draftCode]);
    exit;
}

echo json_encode(['ok' => true, 'draft_code' => $draftCode, 'status' => 'approved', 'approved_slug' => $actualSlug ?: null]);
