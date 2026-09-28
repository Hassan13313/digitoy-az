<?php
/* ── save_draft.php — session_id üzrə draft upsert ── */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

/* ── Sui-istifadə qapısı (2026-09-28) ──
   İctimai endpoint idi və heç bir limit yox idi: skript cədvəli sonsuz
   draftla doldura bilərdi. Autosave 800 ms debounce ilə gəlir — aktiv
   yazan istifadəçi 10 dəqiqədə 240-a yaxınlaşmır. Gövdə tavanı 4 MB:
   Phase 44-dən şəkillər fayldır, köhnə data URI-li draftlar da sığır. */
$raw = file_get_contents('php://input');
if (strlen((string) $raw) > 4 * 1024 * 1024) {
    http_response_code(413);
    echo json_encode(['error' => 'Payload too large']);
    exit;
}
if (!rateGate('draft_save|' . clientIp(), 240, 600)) {
    http_response_code(429);
    echo json_encode(['error' => 'RATE_LIMITED']);
    exit;
}

$body        = json_decode((string) $raw, true);
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
$templateId = normalizeTemplateId($formData['templateId'] ?? null);
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
        SET package = :pkg, current_step = :step, form_data = :data,
            template_id = :tpl, expires_at = :exp
        WHERE id = :id");
    $stmt->execute([
        ':pkg'  => $package,
        ':step' => $currentStep,
        ':data' => $json,
        ':tpl'  => $templateId,
        ':exp'  => $expiresAt,
        ':id'   => $existing['id'],
    ]);
} else {
    $stmt = $db->prepare("INSERT INTO draft_invitations
        (session_id, package, current_step, form_data, template_id, expires_at)
        VALUES (:sid, :pkg, :step, :data, :tpl, :exp)");
    $stmt->execute([
        ':sid'  => $sessionId,
        ':pkg'  => $package,
        ':step' => $currentStep,
        ':data' => $json,
        ':tpl'  => $templateId,
        ':exp'  => $expiresAt,
    ]);
}

echo json_encode(['ok' => true]);
