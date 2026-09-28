<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Admin Login Endpoint
   POST { key: string }
   → Düzgündürsə HMAC token qaytarır (8 saat)
   → Yanlışdırsa 401 qaytarır
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$key  = trim($body['key'] ?? '');

if ($key === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Key required']);
    exit;
}

$adminKey = defined('ADMIN_KEY') ? ADMIN_KEY : '';

/* ── Brute-force qapısı (2026-09-28) ──
   Yalnız 0.5 s gecikmə paralel sorğularla keçilirdi. İndi IP üzrə
   15 dəqiqədə 10 cəhd. Uğurlu giriş də sayılır — admin gündə bir neçə
   dəfə daxil olur, limitə çatmaz. */
if (!rateGate('admin-login:' . clientIp(), 10, 900)) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many attempts', 'message' => 'Çox sayda cəhd. 15 dəqiqə sonra yenidən yoxlayın.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($adminKey === '' || !hash_equals($adminKey, $key)) {
    /* Brute-force gecikməsi: yanlış key-də 0.5s gözlə */
    usleep(500000);
    http_response_code(401);
    echo json_encode(['error' => 'Invalid key']);
    exit;
}

/* HMAC token yarat */
$iat        = time();
$exp        = $iat + 28800; /* 8 saat */
$payloadRaw = "{$iat}:{$exp}";
$payloadB64 = rtrim(strtr(base64_encode($payloadRaw), '+/', '-_'), '=');
$sig        = hash_hmac('sha256', $payloadB64, $adminKey);
$token      = "{$payloadB64}.{$sig}";

echo json_encode(['ok' => true, 'token' => $token, 'exp' => $exp]);
