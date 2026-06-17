<?php
/* ── save_draft.php — session_id üzrə draft upsert ── */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body        = json_decode(file_get_contents('php://input'), true);
$sessionId   = trim($body['session_id']   ?? '');
$formData    = $body['form_data']          ?? null;
$package     = trim($body['package']      ?? 'SADE');
$currentStep = (int) ($body['current_step'] ?? 1);

if (!$sessionId || !preg_match('/^[a-zA-Z0-9\-]{8,64}$/', $sessionId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid session_id required']);
    exit;
}

$validPkgs = ['SADE', 'VIP', 'PREMIUM'];
if (!in_array($package, $validPkgs, true)) $package = 'SADE';
$currentStep = max(1, min(6, $currentStep));

$json      = $formData ? json_encode($formData, JSON_UNESCAPED_UNICODE) : null;
$expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

ensureTables();
$db = getDB();

/* Aktiv draft-ı tap */
$stmt = $db->prepare("SELECT id FROM draft_invitations
    WHERE session_id = :sid AND status = 'draft' LIMIT 1");
$stmt->execute([':sid' => $sessionId]);
$existing = $stmt->fetch();

if ($existing) {
    $stmt = $db->prepare("UPDATE draft_invitations
        SET package = :pkg, current_step = :step, form_data = :data, expires_at = :exp
        WHERE id = :id");
    $stmt->execute([
        ':pkg'  => $package,
        ':step' => $currentStep,
        ':data' => $json,
        ':exp'  => $expiresAt,
        ':id'   => $existing['id'],
    ]);
} else {
    $stmt = $db->prepare("INSERT INTO draft_invitations
        (session_id, package, current_step, form_data, expires_at)
        VALUES (:sid, :pkg, :step, :data, :exp)");
    $stmt->execute([
        ':sid'  => $sessionId,
        ':pkg'  => $package,
        ':step' => $currentStep,
        ':data' => $json,
        ':exp'  => $expiresAt,
    ]);
}

echo json_encode(['ok' => true]);
