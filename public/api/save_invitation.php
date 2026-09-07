<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/slug_alloc.php';
require_once __DIR__ . '/i18n_merge.php';

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
if (!isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid slug']);
    exit;
}

if (!is_array($formData)) {
    http_response_code(400);
    echo json_encode(['error' => 'formData must be an object']);
    exit;
}

$templateId = normalizeTemplateId($formData['templateId'] ?? null);

$json = json_encode($formData, JSON_UNESCAPED_UNICODE);
if (!$json) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid formData JSON']);
    exit;
}

/* ══════════════════════════════════════════════════
   TƏRCÜMƏLƏRİN QORUNMASI (Phase 40)

   Builder `i18n` açarını daşımır (tərcümələr `admin_translations.php`-dən
   yazılır), ona görə burada sadəcə `formData`-nı yazmaq admin-in EN/RU
   mətnlərini SƏSSİZCƏ SİLİRDİ — «tərcümə save olur, sonra itir» xətası.
   İndi mövcud sətir oxunur və tərcümələr `mergeInvitationI18n()` qaydası
   ilə birləşdirilir. Məntiq `i18n_merge.php`-dədir və DB-siz test edilir.
══════════════════════════════════════════════════ */
function invitationJsonWithMergedI18n(PDO $db, string $column, $value, array $incomingFd): string {
    /* Sütun adı sorğuya birbaşa yazılır — ona görə YALNIZ ağ siyahı qəbul edilir */
    if (!in_array($column, ['slug', 'draft_code'], true)) $column = 'slug';

    $st = $db->prepare("SELECT form_data FROM invitations WHERE $column = :v LIMIT 1");
    $st->execute([':v' => $value]);
    $raw = $st->fetchColumn();

    $stored = $raw === false ? [] : json_decode((string)$raw, true);
    if (!is_array($stored)) $stored = [];

    $merged = mergeInvitationI18n($stored, $incomingFd);
    $out = json_encode($merged, JSON_UNESCAPED_UNICODE);
    /* Kodlama uğursuz olsa BİRLƏŞDİRMƏSİZ orijinala düşürük — dəvətnamənin
       özü heç bir halda saxlanılmamış qalmasın. */
    return $out === false ? (string)json_encode($incomingFd, JSON_UNESCAPED_UNICODE) : $out;
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
    $data = invitationJsonWithMergedI18n($db, 'slug', $res['slug'], $formData);
    $upd = $db->prepare("UPDATE invitations SET form_data = :data, template_id = :tpl, updated_at = NOW() WHERE slug = :slug");
    $upd->execute([':data' => $data, ':tpl' => $templateId, ':slug' => $res['slug']]);
    echo json_encode(['ok' => true, 'slug' => $res['slug'], 'created' => false]);
    exit;
}

if ($res['action'] === 'update_code') {
    $data = invitationJsonWithMergedI18n($db, 'draft_code', $draftCode, $formData);
    $upd = $db->prepare("UPDATE invitations SET form_data = :data, template_id = :tpl, updated_at = NOW() WHERE draft_code = :c");
    $upd->execute([':data' => $data, ':tpl' => $templateId, ':c' => $draftCode]);
    echo json_encode(['ok' => true, 'slug' => $res['slug'], 'created' => false]);
    exit;
}

/* Adi INSERT — ON DUPLICATE KEY UPDATE QƏSDƏN İSTİFADƏ EDİLMİR:
   toqquşma baş verərsə başqasının dəvətnaməsini üstündən yazmaqdansa
   xəta qaytarmaq DOĞRUDUR. */
try {
    /* Yeni sətir: saxlanılan yoxdur, amma eyni funksiyadan keçirilir ki,
       `i18n`/`i18nMeta` forması bütün yollarda EYNİ normallaşdırılsın. */
    $insJson = json_encode(mergeInvitationI18n([], $formData), JSON_UNESCAPED_UNICODE);
    if ($insJson === false) $insJson = $json;

    $ins = $db->prepare("INSERT INTO invitations (slug, form_data, template_id, draft_code) VALUES (:slug, :data, :tpl, :code)");
    $ins->execute([
        ':slug' => $res['slug'],
        ':data' => $insJson,
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
