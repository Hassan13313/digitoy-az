<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Müştəri telefonu (Phase 50)

   Builderdə könüllü yazılan nömrə draft_invitations.customer_phone-a düşür.
   ⚠ Qayda src/utils/customerPhone.js ilə HƏRFBƏHƏRF eynidir — hər ikisi
   tests/fixtures/phone_cases.json ilə yoxlanılır.
══════════════════════════════════════════════════ */

/**
 * Nömrəni vahid formaya sal:
 *   050 123 45 67 · 501234567 · 994501234567 · 00994… · +994…  →  +994501234567
 *   digər «+» nömrələri (7–15 rəqəm)                            →  +<rəqəmlər>
 * Tanınmayan hər şey (boş, hərf, massiv, çox qısa/uzun) → null.
 */
function normalizeCustomerPhone($raw): ?string {
    if (!is_string($raw)) return null;
    $s = trim($raw);
    if ($s === '' || strlen($s) > 40) return null;
    if (!preg_match('/^\+?[0-9\s\-().]+$/', $s)) return null;

    $plus   = $s[0] === '+';
    $digits = preg_replace('/\D/', '', $s);

    if (!$plus && str_starts_with($digits, '00')) {   /* 00994… → beynəlxalq */
        $digits = substr($digits, 2);
        $plus   = true;
    }
    if (strlen($digits) === 12 && str_starts_with($digits, '994')) return '+' . $digits;
    if (!$plus && strlen($digits) === 10 && $digits[0] === '0') return '+994' . substr($digits, 1);
    /* 9 rəqəm: operator kodu ilə (50…, 70…). «0» ilə başlayırsa yerli nömrədir və bir rəqəm əskikdir */
    if (!$plus && strlen($digits) === 9 && $digits[0] !== '0') return '+994' . $digits;
    if ($plus && strlen($digits) >= 7 && strlen($digits) <= 15) return '+' . $digits;
    return null;
}
