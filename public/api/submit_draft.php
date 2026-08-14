<?php
/* ── submit_draft.php — draft-ı submitted vəziyyətinə keçir ── */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body          = json_decode(file_get_contents('php://input'), true);
$sessionId     = trim($body['session_id']     ?? '');
$customerPhone = trim($body['customer_phone'] ?? '');
$formData      = $body['form_data']            ?? null;
$package       = trim($body['package']        ?? 'SADE');

if (!$sessionId || !preg_match('/^[a-zA-Z0-9\-]{8,64}$/', $sessionId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid session_id required']);
    exit;
}

$validPkgs = ['SADE', 'VIP', 'PREMIUM'];
if (!in_array($package, $validPkgs, true)) $package = 'SADE';

$json = $formData ? json_encode($formData, JSON_UNESCAPED_UNICODE) : null;

function generateDraftCode(PDO $db): string {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for ($attempt = 0; $attempt < 10; $attempt++) {
        $code = 'DT-';
        for ($i = 0; $i < 6; $i++) {
            $code .= $chars[random_int(0, strlen($chars) - 1)];
        }
        $chk = $db->prepare("SELECT id FROM draft_invitations WHERE draft_code = :c LIMIT 1");
        $chk->execute([':c' => $code]);
        if (!$chk->fetch()) return $code;
    }
    throw new RuntimeException('Cannot generate unique draft_code');
}

$templateId = normalizeTemplateId($formData['templateId'] ?? null);

ensureTables();
$db = getDB();

/* Mövcud draft-ı tap (hər statusda) */
$stmt = $db->prepare("SELECT id, draft_code FROM draft_invitations
    WHERE session_id = :sid ORDER BY updated_at DESC LIMIT 1");
$stmt->execute([':sid' => $sessionId]);
$existing = $stmt->fetch();

if ($existing) {
    $draftCode = $existing['draft_code'] ?: generateDraftCode($db);
    $stmt = $db->prepare("UPDATE draft_invitations
        SET draft_code     = :code,
            package        = :pkg,
            form_data      = :data,
            template_id    = :tpl,
            customer_phone = :phone,
            status         = 'submitted',
            submitted_at   = IF(submitted_at IS NULL, NOW(), submitted_at),
            expires_at     = DATE_ADD(NOW(), INTERVAL 30 DAY)
        WHERE id = :id");
    $stmt->execute([
        ':code'  => $draftCode,
        ':pkg'   => $package,
        ':data'  => $json,
        ':tpl'   => $templateId,
        ':phone' => $customerPhone ?: null,
        ':id'    => $existing['id'],
    ]);
} else {
    $draftCode = generateDraftCode($db);
    $stmt = $db->prepare("INSERT INTO draft_invitations
        (session_id, draft_code, package, form_data, template_id, customer_phone, status, submitted_at, expires_at)
        VALUES (:sid, :code, :pkg, :data, :tpl, :phone, 'submitted', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))");
    $stmt->execute([
        ':sid'   => $sessionId,
        ':code'  => $draftCode,
        ':pkg'   => $package,
        ':data'  => $json,
        ':tpl'   => $templateId,
        ':phone' => $customerPhone ?: null,
    ]);
}

echo json_encode(['ok' => true, 'draft_code' => $draftCode]);
