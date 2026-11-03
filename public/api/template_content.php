<?php
/* ═══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — şablon səviyyəli məzmun (ictimai oxuma, 2026-11)

   GET ?key=boarding-pass | boarding-pass@birthday → { admin, sections }

   Şablon önbaxışı (/demo/template/:id) və builder önbaxışı üçündür: orada
   dəvətnamə yoxdur, ona görə məzmun get_invitation.php ilə gəlmir.
   Yalnız şablonun öz mətni/rəngi qayıdır — şəxsi məlumat burada yoxdur.
   ═══════════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/template_content_lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$key = $_GET['key'] ?? null;
if (!tcValidKey($key)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid key required']);
    exit;
}

header('Cache-Control: public, max-age=60');
echo json_encode(tcRead(getDB(), $key), JSON_UNESCAPED_UNICODE);
