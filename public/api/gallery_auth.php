<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Qalereya İcazə Qatı (per-toy)

   PROBLEM (2026-08-31 audit):
   /invite/<slug>/qalereya-idare səhifəsi tamamilə açıq route-dur —
   slug QR kodun üzərində yazılıdır, yəni HƏR qonaq bu səhifəni aça
   bilir. Silmə API-si isə requireAdmin() tələb edirdi (sayt üzrə
   YEGANƏ ADMIN_KEY). Nəticədə:
     • cütlük öz qalereyasından heç nə silə bilmirdi (401),
     • frontend xətanı udub UI-dan elementi çıxarırdı → "silindi"
       görünürdü, refresh-də geri qayıdırdı.

   HƏLL:
   Silmə üçün İKİ yol qəbul edilir:
     1) Admin tokeni (mövcud admin panel işləməyə davam edir), VƏ YA
     2) MƏHZ HƏMİN slug üçün imzalanmış qalereya tokeni.

   Qalereya tokeni slug-a bağlıdır — bir toyun tokeni başqa toyun
   mediasına toxuna bilmir (IDOR bağlıdır). Token ADMIN_KEY-dən
   törəyən ayrıca açarla imzalanır: qalereya tokeni sızsa belə admin
   səlahiyyətinə çevrilə bilmir.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/owner_auth.php';

/** Qalereya imzaları üçün ayrıca açar — admin açarı ilə eyni deyil */
function gallerySigningKey(): string {
    $secret = defined('ADMIN_KEY') ? ADMIN_KEY : '';
    return hash_hmac('sha256', 'digitoy:gallery:v1', $secret);
}

/** Verilmiş slug üçün qalereya tokeni yarat (yalnız admin çağırır) */
function mintGalleryToken(string $slug, int $ttlSeconds = 63072000): array {
    $exp        = time() + $ttlSeconds;   /* default 2 il — toy sonrası da işləsin */
    $payloadRaw = "g:{$slug}:{$exp}";
    $payloadB64 = rtrim(strtr(base64_encode($payloadRaw), '+/', '-_'), '=');
    $sig        = hash_hmac('sha256', $payloadB64, gallerySigningKey());
    return ['token' => "{$payloadB64}.{$sig}", 'exp' => $exp];
}

/** Tokeni yoxla — MƏHZ bu slug üçün etibarlı olmalıdır */
function validateGalleryToken(string $token, string $slug): bool {
    $dot = strrpos($token, '.');
    if ($dot === false || $dot === 0) return false;

    $payloadB64 = substr($token, 0, $dot);
    $sig        = substr($token, $dot + 1);

    /* İmzanı əvvəl yoxla (timing-safe) */
    $expectedSig = hash_hmac('sha256', $payloadB64, gallerySigningKey());
    if (!hash_equals($expectedSig, $sig)) return false;

    $decoded = base64_decode(strtr($payloadB64, '-_', '+/'));
    if (!$decoded) return false;

    /* Format: g:<slug>:<exp> — slug-un içində ':' ola bilməz (regex a-z0-9-) */
    $parts = explode(':', $decoded);
    if (count($parts) !== 3 || $parts[0] !== 'g') return false;

    [, $tokenSlug, $exp] = $parts;

    /* Slug tam üst-üstə düşməlidir — başqa toyun tokeni qəbul edilmir */
    if (!hash_equals($tokenSlug, $slug)) return false;

    return is_numeric($exp) && time() <= (int) $exp;
}

/** Sorğudan qalereya tokenini oxu */
function readGalleryToken(): string {
    if (!empty($_SERVER['HTTP_X_GALLERY_TOKEN'])) {
        return trim($_SERVER['HTTP_X_GALLERY_TOKEN']);
    }
    return '';
}

/**
 * Sorğu bu slug-un idarəçisindəndirmi? Admin tokeni, həmin slug üçün
 * qalereya tokeni (cütlüyün idarəetmə linki) VƏ YA Phase 50 «Müştəri
 * paneli» açarı (DB-dədir, panel linki yenilənəndə dərhal bağlanır).
 */
function isGalleryManagerRequest(string $slug): bool {
    if (isAdminRequest()) return true;

    $galleryToken = readGalleryToken();
    if ($galleryToken !== '' && validateGalleryToken($galleryToken, $slug)) return true;

    return isOwnerRequest($slug);
}

/* ── Albomun baxış linki (2026-11-06) ──
   Albom məxfidir: qonaq /foto səhifəsində şəkil GÖNDƏRİR, amma albomu
   yalnız müştərinin paylaşdığı link ilə görür:
     /invite/<slug>/qalereya-idare?v=<token>  (slayd şou: /slayd?v=<token>)
   Token slug-a bağlıdır və SABİTDİR — müştəri linki bir dəfə paylaşır.
   Yalnız OXUMA verir: idarəetmə tokeni «payload.imza» formatındadır və
   imzası base64 payload üzərindədir, bu isə «v:<slug>» üzərində — biri
   digərinin yerinə keçə bilmir. */
function galleryViewToken(string $slug): string {
    return substr(hash_hmac('sha256', "v:{$slug}", gallerySigningKey()), 0, 32);
}

function isGalleryViewRequest(string $slug): bool {
    $token = $_SERVER['HTTP_X_GALLERY_VIEW'] ?? '';
    return is_string($token) && $token !== ''
        && hash_equals(galleryViewToken($slug), trim($token));
}

/**
 * Bu slug üzərində idarəetmə səlahiyyətini tələb et.
 * Uğursuzluqda 401 ilə dayandırır.
 */
function requireGalleryAccess(string $slug): void {
    if (isGalleryManagerRequest($slug)) return;

    http_response_code(401);
    echo json_encode([
        'error'   => 'GALLERY_AUTH_REQUIRED',
        'message' => 'Bu qalereyanı idarə etmək üçün icazəniz yoxdur. '
                   . 'Zəhmət olmasa sizə göndərilən idarəetmə linkindən istifadə edin.',
    ]);
    exit;
}
