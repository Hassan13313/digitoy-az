<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/slug_alloc.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body      = json_decode(file_get_contents('php://input'), true);
$slug      = trim($body['slug']       ?? '');
$formData  = $body['formData']        ?? null;
$draftCode = trim($body['draft_code'] ?? '');   /* sifarişin unikal kodu (varsa) */

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

/* ══════════════════════════════════════════════════
   KANONİK SLUG TƏYİNİ
   Məntiq (və nəyə görə belədir) slug_alloc.php-dədir; ora həm də
   real DB olmadan test edilə bilir (tests/slug_alloc_test.php).
══════════════════════════════════════════════════ */

try {
    $res = resolveCanonicalSlug($db, $slug, $draftCode);
} catch (RuntimeException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not allocate a unique slug']);
    exit;
}

if ($res['action'] === 'update_slug') {
    $upd = $db->prepare("UPDATE invitations SET form_data = :data, template_id = :tpl, updated_at = NOW() WHERE slug = :slug");
    $upd->execute([':data' => $json, ':tpl' => $templateId, ':slug' => $res['slug']]);
    echo json_encode(['ok' => true, 'slug' => $res['slug'], 'created' => false]);
    exit;
}

if ($res['action'] === 'update_code') {
    $upd = $db->prepare("UPDATE invitations SET form_data = :data, template_id = :tpl, updated_at = NOW() WHERE draft_code = :c");
    $upd->execute([':data' => $json, ':tpl' => $templateId, ':c' => $draftCode]);
    echo json_encode(['ok' => true, 'slug' => $res['slug'], 'created' => false]);
    exit;
}

/* Adi INSERT — ON DUPLICATE KEY UPDATE QƏSDƏN İSTİFADƏ EDİLMİR:
   toqquşma baş verərsə başqasının dəvətnaməsini üstündən yazmaqdansa
   xəta qaytarmaq DOĞRUDUR. */
try {
    $ins = $db->prepare("INSERT INTO invitations (slug, form_data, template_id, draft_code) VALUES (:slug, :data, :tpl, :code)");
    $ins->execute([
        ':slug' => $res['slug'],
        ':data' => $json,
        ':tpl'  => $templateId,
        ':code' => preg_match(DRAFT_CODE_PATTERN, $draftCode) ? $draftCode : null,
    ]);
} catch (PDOException $e) {
    /* 23000 = unikallıq pozuntusu (paralel sorğu araya girdi) */
    if ($e->getCode() === '23000') {
        http_response_code(409);
        echo json_encode(['error' => 'Slug already taken, please retry']);
        exit;
    }
    throw $e;
}

echo json_encode(['ok' => true, 'slug' => $res['slug'], 'created' => true]);
