<?php
/* ── /api/health.php — Sistem vəziyyəti ──
   Açıq cavab yalnız status + db + vaxt verir (uptime yoxlaması üçün kifayətdir).
   PHP versiyası, mühit və cədvəl adları yalnız admin tokeni ilə göstərilir
   (Phase 49.8 — açıq cavabda server detalı sızdırılmır). */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$result = [
    'status'      => 'ok',
    'environment' => APP_ENV,
    'php_version' => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION . '.' . PHP_RELEASE_VERSION,
    'timestamp'   => gmdate('c'),
    'db'          => 'unknown',
    'tables'      => [],
];

try {
    ensureTables();
    $db = getDB();

    /* DB bağlantı yoxlaması */
    $db->query('SELECT 1');
    $result['db'] = 'connected';

    /* Cədvəl mövcudluğu yoxlaması — INFORMATION_SCHEMA ilə (C6) */
    $expected = ['invitations', 'photos', 'guest_responses', 'draft_invitations'];
    $found    = [];
    $chk      = $db->prepare(
        "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :tbl"
    );
    foreach ($expected as $tbl) {
        $chk->execute([':tbl' => $tbl]);
        if ((int)$chk->fetchColumn() > 0) $found[] = $tbl;
    }
    $result['tables'] = $found;

    $missing = array_diff($expected, $found);
    if (!empty($missing)) {
        $result['status']  = 'degraded';
        $result['missing'] = array_values($missing);
    }

} catch (Exception $e) {
    $result['status'] = 'error';
    $result['db']     = 'failed';
}

$httpCode = match($result['status']) {
    'ok'       => 200,
    'degraded' => 200,
    default    => 503,
};

if (!isAdminRequest()) {
    $result = array_intersect_key($result, array_flip(['status', 'db', 'timestamp']));
}

http_response_code($httpCode);
echo json_encode($result, JSON_PRETTY_PRINT);
