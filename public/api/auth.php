<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Admin Auth Helper
   requireAdmin() — hər qorunan endpointdən çağırılır
   validateAdminToken() — HMAC imzasını yoxlayır
══════════════════════════════════════════════════ */

function requireAdmin(): void {
    $token = '';

    /* X-Admin-Token header (əsas üsul) */
    if (!empty($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
        $token = $_SERVER['HTTP_X_ADMIN_TOKEN'];
    }
    /* Authorization: Bearer TOKEN (ehtiyat üsul) */
    elseif (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/^Bearer\s+(.+)$/i', $_SERVER['HTTP_AUTHORIZATION'], $m)) {
            $token = trim($m[1]);
        }
    }

    if ($token === '' || !validateAdminToken($token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Admin authorization required']);
        exit;
    }
}

function validateAdminToken(string $token): bool {
    /* Token format: base64url(iat:exp) + '.' + hmac_sha256(payload, ADMIN_KEY) */
    $dot = strrpos($token, '.');
    if ($dot === false || $dot === 0) return false;

    $payloadB64 = substr($token, 0, $dot);
    $sig        = substr($token, $dot + 1);

    /* İmzanı əvvəl yoxla (timing-safe) */
    $secret      = defined('ADMIN_KEY') ? ADMIN_KEY : '';
    $expectedSig = hash_hmac('sha256', $payloadB64, $secret);
    if (!hash_equals($expectedSig, $sig)) return false;

    /* Payload-ı decode et, müddəti yoxla */
    $decoded = base64_decode(strtr($payloadB64, '-_', '+/'));
    if (!$decoded) return false;

    $parts = explode(':', $decoded, 2);
    if (count($parts) !== 2) return false;

    [, $exp] = $parts;
    return is_numeric($exp) && time() <= (int)$exp;
}
