<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Phase 36: dəvətnamə linkini aktiv/deaktiv et

   NƏ ÜÇÜN: təsdiqlənmiş link ömürlük açıq qalırdı. Ödəniş geri alınanda
   və ya xidmət dayandırılmalı olanda admin-in linki bağlamaq yolu yox idi.

   NƏ TOXUNMUR: slug, URL, QR kodu, qalereya, upload qovluğu, form_data.
   Yalnız `invitations.is_active` sütunu dəyişir — geri qaytarmaq bir kliklik.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$slug = trim($body['slug'] ?? '');

/* ⚠ BÖYÜK HƏRF: Phase 33-dən ƏVVƏLKİ dəvətnamələrin slug şəkilçisi böyük
   hərflidir (məs. `sasas-ve-sasasa-DDE863`). Yalnız kiçik hərf qəbul etsək
   admin həmin KÖHNƏ linkləri deaktiv edə bilməzdi. `get_invitation.php` da
   eyni geniş şablonu işlədir. */
if (!$slug || !isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* `active` AÇIQ-AŞKAR boolean olmalıdır — səhvən düşən boş/naməlum dəyər
   linki səssizcə bağlamamalıdır. */
if (!array_key_exists('active', $body) || !is_bool($body['active'])) {
    http_response_code(422);
    echo json_encode(['error' => 'active must be a boolean']);
    exit;
}

$active = $body['active'] ? 1 : 0;

/* Sütunun mövcudluğuna zəmanət — bu endpoint nadir çağırılır,
   ona görə miqrasiya xərci burada problem deyil (get_invitation.php-dən fərqli). */
ensureTables();
$db = getDB();

$st = $db->prepare("UPDATE invitations SET is_active = :a WHERE slug = :s");
$st->execute([':a' => $active, ':s' => $slug]);

if ($st->rowCount() === 0) {
    /* Sətir yoxdursa 404; varsa amma dəyər onsuz da eynidirsə uğur sayılır
       (idempotent — ikiqat klik "uğursuz" görünməsin). */
    $chk = $db->prepare("SELECT is_active FROM invitations WHERE slug = :s LIMIT 1");
    $chk->execute([':s' => $slug]);
    $cur = $chk->fetchColumn();
    if ($cur === false) {
        http_response_code(404);
        echo json_encode(['error' => 'Invitation not found']);
        exit;
    }
}

/* Phase 39 — dagidici emeliyyat: audit jurnali */
adminAuditLog($active ? 'invitation_activate' : 'invitation_deactivate', $slug);

echo json_encode(['ok' => true, 'slug' => $slug, 'active' => (bool)$active]);
