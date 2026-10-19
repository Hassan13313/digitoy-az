<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — «Müştəri paneli» başlığı (Phase 50)

   GET /api/owner_panel.php?slug=<slug>   (X-Owner-Token tələb olunur)
   → { ok, slug, active, package, sections, event:{type,names,date,time,venue} }

   ⚠ YALNIZ müştəri açarı qəbul edilir, admin tokeni YOX: admin köhnə
   (yenilənmiş) linki açanda müştərinin görəcəyini — «link etibarsızdır» —
   görməlidir. Məlumat endpointləri (RSVP, qonaqlar) isə admini də qəbul edir.

   form_data-nın HAMISI qaytarılmır — yalnız panel başlığına lazım olan sahələr.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/owner_auth.php';

header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$slug = trim($_GET['slug'] ?? '');
if (!isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* Açar yoxlaması və başlıq məlumatı BİR sorğuda (panel hər 60 s yoxlayır) */
$token = readOwnerToken();
if (!isOwnerKeyFormat($token)) ownerAccessDenied();
ensureTables();
$q = getDB()->prepare('SELECT owner_key, form_data, is_active FROM invitations WHERE slug = :s LIMIT 1');
$q->execute([':s' => $slug]);
$row = $q->fetch();
if (!$row || !is_string($row['owner_key']) || !hash_equals($row['owner_key'], $token)) ownerAccessDenied();

$fd  = json_decode((string) $row['form_data'], true);
$fd  = is_array($fd) ? $fd : [];
$str = fn($k) => is_string($fd[$k] ?? null) ? trim($fd[$k]) : '';

$type = $str('eventType');
if (in_array($type, ['toy', 'nishan'], true)) {
    /* Göstərim sırası BƏY → GƏLİN (seo.php ilə eyni) */
    $names = implode(' & ', array_filter([$str('groomName'), $str('brideName')], 'strlen'));
} elseif (in_array($type, ['corporate', 'other'], true)) {
    $names = $str('eventName');
} else {
    $names = $str('brideName');
}

/* Bölmə açarları: yalnız bool dəyərlər (bax src/data/sections.js) */
$sections = [];
foreach ((is_array($fd['sections'] ?? null) ? $fd['sections'] : []) as $id => $on) {
    if (is_string($id) && is_bool($on)) $sections[$id] = $on;
}

$pkg = $str('package');

echo json_encode([
    'ok'       => true,
    'slug'     => $slug,
    'active'   => (int) $row['is_active'] === 1,
    'package'  => in_array($pkg, ['SADE', 'VIP', 'PREMIUM'], true) ? $pkg : 'SADE',
    'sections' => (object) $sections,
    'event'    => [
        'type'  => $type,
        'names' => $names,
        'date'  => $str('date'),
        'time'  => $str('time'),
        'venue' => $str('venueName'),
    ],
], JSON_UNESCAPED_UNICODE);
