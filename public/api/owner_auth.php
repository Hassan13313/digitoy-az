<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — «Müştəri paneli» icazə qatı (Phase 50)

   Hər dəvətnamənin öz gizli açarı var: invitations.owner_key (64 hex).
   Link: /invite/<slug>/panel#k=<açar>  →  frontend açarı X-Owner-Token
   başlığında göndərir.

   NƏ ÜÇÜN QALEREYA TOKENİ KİMİ İMZALI DEYİL:
   imzalı token geri çağırıla bilmir (iki il etibarlıdır). Müştəri paneli
   RSVP adlarını və qonaq hesabatını göstərir — link səhv adama düşsə admin
   «Linki yenilə» ilə köhnəsini DƏRHAL bağlaya bilməlidir. Açar DB-də
   olduğuna görə yenisi yazılan an köhnəsi heç bir yerdə keçmir.

   SƏLAHİYYƏT: yalnız OXU (RSVP, qonaq hesabatı) + qalereya idarəsi
   (requireGalleryAccess). Silmə/redaktə endpointləri bu açarı qəbul etmir.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/auth.php';

/** Sorğudakı müştəri açarı (yoxdursa ''). Massiv/qeyri-sətir → ''. */
function readOwnerToken(): string {
    $v = $_SERVER['HTTP_X_OWNER_TOKEN'] ?? '';
    return is_string($v) ? trim($v) : '';
}

/** Açar formatı: düz 64 kiçik hex simvol — DB-yə getməzdən əvvəl süzgəc. */
function isOwnerKeyFormat(string $key): bool {
    return (bool) preg_match('/^[a-f0-9]{64}$/', $key);
}

/** Yeni təsadüfi açar (256 bit). */
function newOwnerKey(): string {
    return bin2hex(random_bytes(32));
}

/**
 * Dəvətnamənin açarı; yoxdursa yaradılır ($created = true). Dəvətnamə yoxdursa null.
 * `WHERE owner_key IS NULL` — eyni anda iki admin sorğusu fərqli açar yazmasın:
 * ikincisi heç nə dəyişmir və birincinin açarını oxuyur.
 */
function ownerKeyFor(PDO $db, string $slug, ?bool &$created = null): ?string {
    $created = false;
    $q = $db->prepare('SELECT owner_key FROM invitations WHERE slug = :s LIMIT 1');
    $q->execute([':s' => $slug]);
    $key = $q->fetchColumn();
    if ($key === false) return null;                     /* dəvətnamə yoxdur */
    if (is_string($key) && $key !== '') return $key;     /* adi hal: 1 sorğu */

    $up = $db->prepare('UPDATE invitations SET owner_key = :k WHERE slug = :s AND owner_key IS NULL');
    $up->execute([':k' => newOwnerKey(), ':s' => $slug]);
    $created = $up->rowCount() > 0;
    $q->execute([':s' => $slug]);
    $key = $q->fetchColumn();
    return is_string($key) && $key !== '' ? $key : null;
}

/** Açarı dəyiş — köhnə link dərhal etibarsız olur. Dəvətnamə yoxdursa null.
    Təsadüfi açar hər dəfə fərqlidir, ona görə rowCount() = sətir var/yox. */
function rotateOwnerKey(PDO $db, string $slug): ?string {
    $key = newOwnerKey();
    $up = $db->prepare('UPDATE invitations SET owner_key = :k WHERE slug = :s');
    $up->execute([':k' => $key, ':s' => $slug]);
    return $up->rowCount() > 0 ? $key : null;
}

/** Açar MƏHZ bu slug-a aiddirmi? Xətada (sütun yoxdur, DB düşüb) false. */
function ownerKeyValid(PDO $db, string $slug, string $token): bool {
    if (!isOwnerKeyFormat($token)) return false;
    try {
        $q = $db->prepare('SELECT owner_key FROM invitations WHERE slug = :s LIMIT 1');
        $q->execute([':s' => $slug]);
        $key = $q->fetchColumn();
    } catch (Throwable $e) {
        return false;
    }
    return is_string($key) && $key !== '' && hash_equals($key, $token);
}

/** Sorğuda bu slug üçün etibarlı müştəri açarı varmı? (dayandırmır;
    başlıq yoxdursa DB-yə getmir) */
function isOwnerRequest(string $slug): bool {
    $token = readOwnerToken();
    if (!isOwnerKeyFormat($token)) return false;
    ensureTables();
    return ownerKeyValid(getDB(), $slug, $token);
}

/**
 * Bu dəvətnamə üzərində kim danışır? 'admin' | 'owner' | null.
 * Admin əvvəl yoxlanılır (stateless HMAC, DB-siz) — admin axını dəyişmir.
 */
function invitationRole(string $slug): ?string {
    if (isAdminRequest()) return 'admin';
    return isOwnerRequest($slug) ? 'owner' : null;
}

/**
 * Admin VƏ YA bu slug-un müştəri açarı tələb et; əks halda 401 (çox səhv
 * cəhddə 429) ilə dayandırır. Slug yoxdursa da 401 — slug-u yoxlamaq olmasın.
 */
function requireInvitationAccess(string $slug): void {
    if (invitationRole($slug) === null) ownerAccessDenied();
}

/** Uğursuz cəhd: açar göndərilibsə sayğac artır, limit keçilibsə 429. */
function ownerAccessDenied(): void {
    if (readOwnerToken() !== '' && !rateGate('owner_fail|' . clientIp(), 20, 600)) {
        http_response_code(429);
        echo json_encode(['error' => 'RATE_LIMITED']);
        exit;
    }
    http_response_code(401);
    echo json_encode(['error' => 'ACCESS_REQUIRED']);
    exit;
}
