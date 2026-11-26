<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Müştəri panelində oturma planının redaktəsi (2026-11-18)

   Qoruma iki qatdır:
     1. «Müştəri paneli» açarı (owner_key, ≥32 simvol) — link özü;
     2. 6 rəqəmli redaktə PİN-i — admin yaradır və müştəriyə ayrıca göndərir.
        Link ailə qrupunda paylaşılsa belə PİN-siz yalnız BAXMAQ olur.
   PİN bir dəfə yoxlanır və 12 saatlıq redaktə tokeni verilir (HMAC; açar PİN
   hash-i + owner_key — PİN və ya link yenilənəndə köhnə tokenlər ölür).
   Yalnız VİP / Premium (oturma planı paketdə var və bölmə açıqdır).
   Yalnız include edilir (api/.htaccess). Saf hissələr tests/seating_owner_test.php.
   ══════════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/seating_layout_lib.php';   /* seatClean, SEAT_TABLE_MAX, zal planı, toplu dəyişiklik */

const SEAT_TOKEN_TTL   = 12 * 3600;
const SEAT_NAME_MAX    = 120;
const SEAT_NOTE_MAX    = 300;
const SEAT_GUESTS_MAX  = 2000;

/** Paket və bölmə oturma redaktəsinə icazə verirmi? */
function ownerSeatingAllowed(array $fd): bool {
    $pkg = (string) ($fd['package'] ?? '');
    $secOn = (($fd['sections']['seating'] ?? true) !== false);
    return in_array($pkg, ['VIP', 'PREMIUM'], true) && $secOn;
}

function newSeatingPin(): string {
    return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}

function seatTokenMake(string $slug, string $secret, ?int $now = null): string {
    $exp = ($now ?? time()) + SEAT_TOKEN_TTL;
    return $exp . '.' . hash_hmac('sha256', $slug . '|' . $exp, $secret);
}

function seatTokenValid(string $token, string $slug, string $secret, ?int $now = null): bool {
    if (!preg_match('/^(\d{10})\.([a-f0-9]{64})$/', $token, $m)) return false;
    if ((int) $m[1] < ($now ?? time())) return false;
    return hash_equals(hash_hmac('sha256', $slug . '|' . $m[1], $secret), $m[2]);
}

/** Dəyişikliyi tarixçəyə yaz («geri qaytar» üçün) */
function seatRecord(PDO $db, string $slug, string $action, ?int $guestId, ?array $before, ?array $after): void {
    $st = $db->prepare('INSERT INTO guest_changes (invitation_id, actor, action, guest_id, before_json, after_json)
                        VALUES (:i, :a, :ac, :g, :b, :af)');
    $st->execute([
        ':i' => $slug, ':a' => 'owner', ':ac' => $action, ':g' => $guestId,
        ':b' => $before ? json_encode($before, JSON_UNESCAPED_UNICODE) : null,
        ':af' => $after ? json_encode($after, JSON_UNESCAPED_UNICODE) : null,
    ]);
}

/** Tarixçə sətrinin geri qaytarma planı: [əməliyyat, guest_id, sahələr] (saf funksiya) */
function seatUndoPlan(array $change): ?array {
    $before = $change['before_json'] ? json_decode($change['before_json'], true) : null;
    $id = $change['guest_id'] !== null ? (int) $change['guest_id'] : null;
    return match ($change['action']) {
        'add'    => $id ? ['delete', $id, null] : null,
        'delete' => is_array($before) ? ['insert', null, $before] : null,
        'update', 'move' => ($id && is_array($before)) ? ['restore', $id, $before] : null,
        /* v52: toplu dəyişiklik (masa / tərəf / qrup) və zal planı */
        'bulk', 'layout' => is_array($before) ? [$change['action'], null, $before] : null,
        'assign' => is_array($before) ? ['bulk', null, $before] : null,   /* v53: avtomatik yerləşdirmə */
        default  => null,
    };
}
