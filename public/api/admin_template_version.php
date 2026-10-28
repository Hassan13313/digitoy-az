<?php
/* ─────────────────────────────────────────────────────────────────────────────
   ADMİN: DƏVƏTNAMƏNİN ŞABLON VERSİYASI (2026-10-28)

   POST { slug, version: 1|2 } → { ok, slug, templateVersion }

   NƏ ÜÇÜN AYRICA ENDPOINT: premium redizayndan əvvəl təsdiqlənmiş dəvətnamələr
   köhnə görünüşdə (v1) qalır; müştəri razı olanda admin onu yeni dizayna (v2)
   keçirir — lazım olsa geri qaytarır. `admin_invitation_content.php` hər
   saxlamada `admin` açarını yenidən yazır, ona görə versiya oradan dəyişsəydi
   admin düzəlişləri itə bilərdi. Bu endpoint YALNIZ `templateVersion`
   açarına toxunur (FOR UPDATE tranzaksiyası, xarab JSON üstündən yazılmır).
   Qaydalar: template_version.php.
   ───────────────────────────────────────────────────────────────────────── */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/template_version.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON body required']);
    exit;
}

$slug    = trim((string)($body['slug'] ?? ''));
$version = tvNormalize($body['version'] ?? null);
if (!isValidSlug($slug) || $version === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug and version (1 or 2) required']);
    exit;
}

$db = getDB();
$db->beginTransaction();
try {
    $st = $db->prepare("SELECT form_data FROM invitations WHERE slug = :s LIMIT 1 FOR UPDATE");
    $st->execute([':s' => $slug]);
    $raw = $st->fetchColumn();
    if ($raw === false) {
        $db->rollBack();
        http_response_code(404);
        echo json_encode(['error' => 'Invitation not found']);
        exit;
    }
    $fd = json_decode((string)$raw, true);
    if (!is_array($fd)) {
        $db->rollBack();
        http_response_code(409);
        echo json_encode(['error' => 'form_data is not valid JSON — aborting to avoid data loss']);
        exit;
    }

    $before = tvForRead($fd)['templateVersion'];
    $fd['templateVersion'] = $version;
    $enc = json_encode($fd, JSON_UNESCAPED_UNICODE);
    if ($enc === false) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Failed to encode form_data']);
        exit;
    }
    $up = $db->prepare("UPDATE invitations SET form_data = :f, updated_at = NOW() WHERE slug = :s");
    $up->execute([':f' => $enc, ':s' => $slug]);
    $db->commit();

    adminAuditLog('invitation_template_version', $slug, json_encode(['from' => $before, 'to' => $version]));
    echo json_encode(['ok' => true, 'slug' => $slug, 'templateVersion' => $version]);
} catch (Throwable $e) {
    if ($db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Save failed']);
}
