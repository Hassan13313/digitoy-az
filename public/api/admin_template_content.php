<?php
/* ═══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — admin «Şablonlar»: şablon səviyyəli məzmun (2026-11)

   GET              → { items: [{ key, updated_at }] } (dəyişdirilmiş şablonlar)
   GET  ?key=…      → { key, admin, sections }
   POST { key, admin, sections } → { ok, admin, sections }

   Dəyişiklik həmin şablonu işlədən BÜTÜN yeni dizaynlı dəvətnamələrə və
   vitrindəki önbaxışa keçir. Bir dəvətnamənin öz «Məzmun» düzəlişləri bunun
   üstündədir. Köhnə dizaynda (v1) qalan dəvətnamələrə təsir etmir.

   ⚠ Hekayə fəsilləri şablon səviyyəsində saxlanılmır (müştərinin öz hekayəsidir) —
   yalnız bölmənin mətnləri (`story.text`).
   ⚠ Təmizləmə qaydaları admin_content_rules.php: dəvətnamə ilə eyni ağ siyahılar.
   ═══════════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/admin_content_rules.php';
require_once __DIR__ . '/template_content_lib.php';

requireAdmin();
ensureTables();

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['key'])) {
        $rows = $db->query('SELECT template_key AS `key`, updated_at FROM template_content ORDER BY updated_at DESC')->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['items' => $rows], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $key = $_GET['key'];
    if (!tcValidKey($key)) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid key required']);
        exit;
    }
    echo json_encode(['key' => $key] + tcRead($db, $key), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'GET or POST required']);
    exit;
}

$rawBody = file_get_contents('php://input') ?: '';
if (strlen($rawBody) > 524288) {
    http_response_code(413);
    echo json_encode(['error' => 'Body too large']);
    exit;
}
$body = json_decode($rawBody, true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON body required']);
    exit;
}

$key = $body['key'] ?? null;
if (!tcValidKey($key)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid key required']);
    exit;
}

$clean = tcForTemplate(acrCleanOverrides(is_array($body['admin'] ?? null) ? $body['admin'] : []));
$sections = acrCleanSections($body['sections'] ?? null);
if ($sections !== null) {
    /* Hekayəni müştəri özü açır */
    unset($sections['lovestory']);
    if (!$sections) $sections = null;
}

try {
    if (!$clean && !$sections) {
        /* Boş = sıfırlandı: şablon öz halına qayıdır */
        $db->prepare('DELETE FROM template_content WHERE template_key = :k')->execute([':k' => $key]);
    } else {
        $enc = json_encode(['admin' => $clean, 'sections' => $sections ?: []], JSON_UNESCAPED_UNICODE);
        if ($enc === false) throw new RuntimeException('encode');
        $db->prepare(
            'INSERT INTO template_content (template_key, content) VALUES (:k, :c)
             ON DUPLICATE KEY UPDATE content = VALUES(content)'
        )->execute([':k' => $key, ':c' => $enc]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Save failed']);
    exit;
}

adminAuditLog('template_content_update', $key, json_encode([
    'theme'    => isset($clean['theme']) ? array_keys($clean['theme']) : [],
    'fonts'    => isset($clean['fonts']) ? array_keys($clean['fonts']) : [],
    'labels'   => isset($clean['labels']) ? array_keys($clean['labels']) : [],
    'strings'  => isset($clean['strings']) ? count($clean['strings']) : 0,
    'opening'  => isset($clean['opening']),
    'story'    => isset($clean['story']),
    'images'   => isset($clean['images']),
    'sections' => $sections !== null,
], JSON_UNESCAPED_UNICODE));

echo json_encode([
    'ok'       => true,
    'admin'    => $clean ?: new stdClass(),
    'sections' => $sections ?: new stdClass(),
], JSON_UNESCAPED_UNICODE);
