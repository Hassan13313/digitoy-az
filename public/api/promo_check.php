<?php
/* ── promo_check.php — müştərinin yazdığı promokodu yoxlayır (2026-11-25) ──
   POST {code, package} → {ok:true, code, kind, amount, price_base, price_final}
                        və ya {ok:false, reason: NOT_FOUND|INACTIVE|NOT_STARTED|EXPIRED|PACKAGE|LIMIT}
   Kod siyahısı heç vaxt qaytarılmır. Təxminlə tapmağın qarşısını IP limiti alır.
   Yekun qiymət burada yalnız göstərmək üçündür — sifarişdə submit_draft.php yenidən yoxlayır. */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/promo_lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$raw = file_get_contents('php://input');
if (strlen((string) $raw) > 2048) {
    http_response_code(413);
    echo json_encode(['error' => 'Payload too large']);
    exit;
}
if (!rateGate('promo_check|' . clientIp(), 20, 600)) {
    http_response_code(429);
    echo json_encode(['error' => 'RATE_LIMITED'], JSON_UNESCAPED_UNICODE);
    exit;
}

$body    = json_decode((string) $raw, true);
$body    = is_array($body) ? $body : [];
$package = is_string($body['package'] ?? null) ? $body['package'] : '';
if (!isset(DIGITOY_PACKAGE_PRICES[$package])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid package']);
    exit;
}

ensureTables();
$db = getDB();

/* Müştərinin artıq göndərilmiş sifarişi limitdə öz yerini özü tutmasın (submit_draft ilə eyni qayda) */
$ownId = null;
$sid   = is_string($body['session_id'] ?? null) ? $body['session_id'] : '';
if (preg_match('/^[a-zA-Z0-9\-]{8,64}$/', $sid)) {
    $st = $db->prepare('SELECT id FROM draft_invitations WHERE session_id = :s ORDER BY updated_at DESC LIMIT 1');
    $st->execute([':s' => $sid]);
    $ownId = ($v = $st->fetchColumn()) !== false ? (int) $v : null;
}

echo json_encode(promoCheck($db, $body['code'] ?? null, $package, promoToday(), $ownId), JSON_UNESCAPED_UNICODE);
