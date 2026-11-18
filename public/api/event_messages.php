<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Toy günü təbriki / rəy mesajları (admin, 2026-11-18)
   GET  /api/event_messages.php            → { ok, today, congrats:[…], review:[…] }
   POST { action:'mark', code, kind:'congrats'|'review', sent:bool } → { ok }
   Mətnlər və tarix qaydası: event_messages_lib.php. Mesajı admin WhatsApp-dan
   özü göndərir — server heç kimə mesaj GÖNDƏRMİR.
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/order_link.php';
require_once __DIR__ . '/order_sync.php';
require_once __DIR__ . '/event_messages_lib.php';
requireAdmin();
header('Cache-Control: no-store');

ensureTables();
$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode((string) file_get_contents('php://input'), true);
    $code = is_array($body) ? (string) ($body['code'] ?? '') : '';
    $kind = is_array($body) ? (string) ($body['kind'] ?? '') : '';
    if (($body['action'] ?? '') !== 'mark' || !preg_match('/^DT-[A-Z0-9]{6}$/', $code) || !in_array($kind, ['congrats', 'review'], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request']);
        exit;
    }
    if (!empty($body['sent'])) {
        $db->prepare('INSERT IGNORE INTO event_messages (draft_code, kind) VALUES (:c, :k)')->execute([':c' => $code, ':k' => $kind]);
    } else {
        $db->prepare('DELETE FROM event_messages WHERE draft_code = :c AND kind = :k')->execute([':c' => $code, ':k' => $kind]);
    }
    echo json_encode(['ok' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET or POST required']);
    exit;
}

$today = (new DateTime('now', new DateTimeZone(EVENT_MSG_TZ)))->format('Y-m-d');
$from  = (new DateTime($today))->modify('-' . EVENT_MSG_REVIEW_WINDOW . ' days')->format('Y-m-d');

$st = $db->query("SELECT draft_code, customer_phone, package, form_data, approved_slug
                  FROM draft_invitations
                  WHERE status = 'approved' AND customer_phone IS NOT NULL AND customer_phone <> ''");
$rows = [];
foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $d) {
    $slug = orderInvitationSlug($db, $d['approved_slug'], $d['draft_code']);
    $fd   = invitationFormDataBySlug($db, $slug) ?? (json_decode((string) $d['form_data'], true) ?: []);
    $date = (string) ($fd['date'] ?? '');
    if ($date < $from || $date > $today) continue;          /* yalnız son 7 gün + bu gün */
    $pkg  = (string) ($fd['package'] ?? $d['package'] ?? '');
    $rows[] = [
        'code'    => $d['draft_code'],
        'slug'    => $slug,
        'phone'   => $d['customer_phone'],
        'fd'      => $fd,
        'gallery' => $pkg === 'PREMIUM' && (($fd['sections']['gallery'] ?? true) !== false),
        'sent'    => [],
    ];
}

if ($rows) {
    $codes = array_column($rows, 'code');
    $in    = implode(',', array_fill(0, count($codes), '?'));
    $q     = $db->prepare("SELECT draft_code, kind, sent_at FROM event_messages WHERE draft_code IN ($in)");
    $q->execute($codes);
    $sent = [];
    foreach ($q->fetchAll(PDO::FETCH_ASSOC) as $m) $sent[$m['draft_code']][$m['kind']] = $m['sent_at'];
    foreach ($rows as &$r) $r['sent'] = $sent[$r['code']] ?? [];
    unset($r);
}

echo json_encode(['ok' => true, 'today' => $today] + eventMessagesDue($rows, $today), JSON_UNESCAPED_UNICODE);
