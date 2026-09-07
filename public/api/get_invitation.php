<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$slug = trim($_GET['slug'] ?? '');

if (!$slug || !preg_match('/^[a-zA-Z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

$db = getDB();

/* ── Phase 36: is_active sütunu ilə oxu, sütun YOXDURSA köhnə sorğuya düş ──
   ⚠ Bu endpoint QƏSDƏN ensureTables() çağırmır (hər dəvətnamə açılışında
   ALTER/SHOW COLUMNS etmək bahalıdır). Ona görə miqrasiya hələ işləməyibsə
   yeni sütunlu sorğu 42S22 verər və BÜTÜN dəvətnamələr ölərdi.
   FAIL-OPEN: xəta olarsa köhnə sorğu ilə davam edilir və dəvətnamə AKTİV
   sayılır — mövcud müştərilər heç bir halda linkini itirmir. */
$row      = null;
$isActive = true;

try {
    $stmt = $db->prepare("SELECT form_data, is_active FROM invitations WHERE slug = :slug LIMIT 1");
    $stmt->execute([':slug' => $slug]);
    $row = $stmt->fetch();
    if ($row) $isActive = ((int)($row['is_active'] ?? 1)) === 1;
} catch (PDOException $e) {
    $stmt = $db->prepare("SELECT form_data FROM invitations WHERE slug = :slug LIMIT 1");
    $stmt->execute([':slug' => $slug]);
    $row = $stmt->fetch();
    $isActive = true;
}

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

/* ── Deaktiv link ──
   Status kodu 200 OLARAQ QALIR (tələb) — yalnız məzmun verilmir.
   Cütlüyün adı, məkanı, proqramı deaktivdən sonra sızmamalıdır, ona görə
   `data` ümumiyyətlə göndərilmir. Slug, QR və qalereya toxunulmaz qalır. */
if (!$isActive) {
    echo json_encode(['ok' => true, 'slug' => $slug, 'active' => false, 'data' => null]);
    exit;
}

$data = json_decode($row['form_data'], true);
if (!is_array($data)) $data = [];

/* Phase 4 — sablon: form_data prioritetlidir, yoxdursa sutun, o da yoxdursa default.
   Kohne (sutunsuz) setirlerde hemise default qaytarilir -> dizayn deyismir. */
if (empty($data['templateId'])) {
    /* Sutun QESDEN oxunmur — miqrasiya isleməyibse belə bu endpoint qirilmasin */
    $data['templateId'] = DEFAULT_TEMPLATE_ID;
}

echo json_encode(['ok' => true, 'slug' => $slug, 'active' => true, 'data' => $data]);
