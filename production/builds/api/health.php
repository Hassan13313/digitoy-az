<?php
/* ── /api/health.php — Sistem vəziyyəti ── */
require_once __DIR__ . '/config.php';

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

    /* Cədvəl mövcudluğu yoxlaması */
    $expected = ['invitations', 'photos', 'guest_responses', 'draft_invitations'];
    $found    = [];
    foreach ($expected as $tbl) {
        $safe = addslashes($tbl);
        $stmt = $db->query("SHOW TABLES LIKE '$safe'");
        if ($stmt->rowCount() > 0) $found[] = $tbl;
    }
    $result['tables'] = $found;

    $missing = array_diff($expected, $found);
    if (!empty($missing)) {
        $result['status']  = 'degraded';
        $result['missing'] = array_values($missing);
    }

} catch (Exception $e) {
    $result['status']     = 'error';
    $result['db']         = 'failed';
    $result['db_error']   = $e->getMessage();   /* TEMP: diaqnostika */
    $result['db_code']    = $e->getCode();      /* TEMP: diaqnostika */
}

$httpCode = match($result['status']) {
    'ok'       => 200,
    'degraded' => 200,
    default    => 503,
};

http_response_code($httpCode);
echo json_encode($result, JSON_PRETTY_PRINT);
