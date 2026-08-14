<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$slug     = trim($body['slug']    ?? '');
$formData = $body['formData']     ?? null;

if (!$slug || !$formData) {
    http_response_code(400);
    echo json_encode(['error' => 'slug and formData required']);
    exit;
}

/* Slug: yalnız a-z, 0-9, tire */
if (!preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid slug']);
    exit;
}

$templateId = normalizeTemplateId($formData['templateId'] ?? null);

$json = json_encode($formData, JSON_UNESCAPED_UNICODE);
if (!$json) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid formData JSON']);
    exit;
}

$db = getDB();
ensureTables();

/* Köhnə format slug artıq mövcuddursa → yenilə (backward compat) */
$checkOld = $db->prepare("SELECT 1 FROM invitations WHERE slug = :slug LIMIT 1");
$checkOld->execute([':slug' => $slug]);

if ($checkOld->fetchColumn()) {
    $upd = $db->prepare("UPDATE invitations SET form_data = :data, template_id = :tpl, updated_at = NOW() WHERE slug = :slug");
    $upd->execute([':data' => $json, ':tpl' => $templateId, ':slug' => $slug]);
    echo json_encode(['ok' => true, 'slug' => $slug]);
    exit;
}

/* Yeni slug: deterministik 6-simvollu kod əlavə et (md5 lowercase verir) */
$code = substr(md5($slug . 'digitoy'), 0, 6);
$uniqueSlug = $slug . '-' . $code;

$ins = $db->prepare("
    INSERT INTO invitations (slug, form_data, template_id)
    VALUES (:slug, :data, :tpl)
    ON DUPLICATE KEY UPDATE form_data = :data2, template_id = :tpl2, updated_at = NOW()
");
$ins->execute([':slug' => $uniqueSlug, ':data' => $json, ':tpl' => $templateId, ':data2' => $json, ':tpl2' => $templateId]);

echo json_encode(['ok' => true, 'slug' => $uniqueSlug]);
