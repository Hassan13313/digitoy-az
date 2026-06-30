<?php
/* ── get_dashboard_stats.php — Admin: dashboard statistikaları ── */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$db = getDB();

/* Sifariş statistikaları */
$orderStats = $db->query("
    SELECT
        COUNT(*)                                          AS total,
        SUM(status = 'submitted')                         AS submitted,
        SUM(status = 'approved')                          AS approved,
        SUM(status = 'rejected')                          AS rejected,
        SUM(status = 'draft')                             AS draft,
        SUM(DATE(submitted_at) = CURDATE())               AS today,
        SUM(submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS last7days
    FROM draft_invitations
    WHERE status != 'draft'
")->fetch();

/* Paket bölgüsü */
$pkgRows = $db->query("
    SELECT package, COUNT(*) AS cnt
    FROM draft_invitations
    WHERE status IN ('submitted','approved')
    GROUP BY package
    ORDER BY cnt DESC
")->fetchAll();

$packages = [];
foreach ($pkgRows as $r) {
    $packages[$r['package']] = (int)$r['cnt'];
}

/* Dəvətnamə sayı */
$invCount = (int)$db->query("SELECT COUNT(*) FROM invitations")->fetchColumn();

/* Foto sayı — filesystem-dən (photos cədvəli istifadə edilmir) */
$uploadBase = __DIR__ . '/../uploads/';
$photoCount = 0;
if (is_dir($uploadBase)) {
    $mediaExts = ['jpg','jpeg','png','gif','webp','heic','mp4','mov'];
    foreach ((array) glob($uploadBase . '*', GLOB_ONLYDIR) as $albumDir) {
        foreach ((array) glob($albumDir . '/*') as $file) {
            $ext  = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            $base = pathinfo($file, PATHINFO_BASENAME);
            if (in_array($ext, $mediaExts) && substr($base, -10) !== '_thumb.jpg') {
                $photoCount++;
            }
        }
    }
}

/* Son 7 günün gündəlik sifarişləri — bütün günlər doldurulur */
$dailyRows = $db->query("
    SELECT DATE(submitted_at) AS day, COUNT(*) AS cnt
    FROM draft_invitations
    WHERE submitted_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      AND status != 'draft'
    GROUP BY DATE(submitted_at)
    ORDER BY day ASC
")->fetchAll();

$dailyMap = [];
foreach ($dailyRows as $r) {
    $dailyMap[$r['day']] = (int)$r['cnt'];
}

/* Son 7 günü tam doldur (boş günlər 0 ilə) */
$daily = [];
for ($i = 6; $i >= 0; $i--) {
    $d = date('Y-m-d', strtotime("-{$i} days"));
    $daily[] = ['day' => $d, 'cnt' => $dailyMap[$d] ?? 0];
}

echo json_encode([
    'ok'      => true,
    'orders'  => [
        'total'    => (int)($orderStats['total']    ?? 0),
        'submitted'=> (int)($orderStats['submitted']?? 0),
        'approved' => (int)($orderStats['approved'] ?? 0),
        'rejected' => (int)($orderStats['rejected'] ?? 0),
        'today'    => (int)($orderStats['today']    ?? 0),
        'last7days'=> (int)($orderStats['last7days']?? 0),
    ],
    'packages'    => $packages,
    'invitations' => $invCount,
    'photos'      => $photoCount,
    'daily'       => $daily,
]);
