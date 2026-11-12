<?php
/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLON VERSİYASI (2026-10-28) — form_data.templateVersion

   NƏ ÜÇÜN: premium redizayn (v2) canlıya çıxanda artıq təsdiqlənmiş
   dəvətnamələr müştərinin seçdiyi köhnə görünüşdə (v1) qalır. Admin
   müştərinin razılığı ilə onu yeni versiyaya keçirir (admin_template_version.php).

   Qaydalar (src/templates/legacy/registry.js ilə eyni):
     • YENİ sətir (INSERT)  → açar gəlməyibsə 2 yazılır
     • YENİLƏMƏ (UPDATE)    → açar gəlməyibsə SAXLANILMIŞ dəyər qorunur
                              (builder/sifariş datasında açar yoxdur — o, köhnə
                              dəvətnaməni səssizcə yeni versiyaya keçirməməlidir)
     • OXUMA                → açar yoxdursa 1 (deploy-dan əvvəl yaradılıb)
   Açıq gələn dəyər (1, 2 və ya 3) həmişə qəbul olunur — admin seçimidir.

   v3 — FOTOLU TOY SERİYASI (2026-11-12): köhnə toy şablonları cüt-cüt fotolu
   dizayna keçir; keçən şablonun YENİ dəvətnaməsi 3 alır, artıq yaradılmışlar
   (2) dondurulmuş surətlə açılır. Siyahı klientlə eynidir:
   src/templates/legacy/registry.js › FROZEN_V2 (tests/template_versions_test.mjs).
   ⚠ DB-siz test olunur: tests/template_version_test.php
   ───────────────────────────────────────────────────────────────────────── */

const TEMPLATE_VERSION_LEGACY  = 1;
const TEMPLATE_VERSION_CURRENT = 2;
const TEMPLATE_VERSION_PHOTO   = 3;

/* Fotolu dizayna (v3) keçmiş şablonlar */
const TV_V3_TEMPLATES = [
    'royal-palace', 'oriental-luxe', 'night-sky', 'mediterranean', 'crystal-glass',
    'gazette', 'royal-gold', 'luxury-jewelry', 'floral-garden', 'white-elegance',
    'nature-touch', 'vinyl-record', 'cinema-premiere', 'boarding-pass', 'modern-black',
];

/** 1, 2 və ya 3 — başqa hər şey null */
function tvNormalize($v): ?int {
    if (is_int($v) || (is_string($v) && ctype_digit($v)) || (is_float($v) && floor($v) == $v)) {
        $n = (int)$v;
        return ($n >= TEMPLATE_VERSION_LEGACY && $n <= TEMPLATE_VERSION_PHOTO) ? $n : null;
    }
    return null;
}

/** Şablonun yeni dəvətnaməyə yazılan versiyası */
function tvCurrentFor($templateId): int {
    return (is_string($templateId) && in_array($templateId, TV_V3_TEMPLATES, true)) ? TEMPLATE_VERSION_PHOTO : TEMPLATE_VERSION_CURRENT;
}

/**
 * Saxlanılacaq form_data-nın versiyası.
 * @param array      $incoming gələn form_data
 * @param array|null $stored   mövcud sətrin form_data-sı (null = yeni sətir)
 */
function tvForSave(array $incoming, ?array $stored): array {
    /* Şablon məzmunu oxunanda əlavə olunur (get_invitation.php), dəvətnaməyə yazılmır:
       admin builder-də yenidən saxlayanda köhnə surət burada qalmasın */
    unset($incoming['templateDefaults']);
    $in = tvNormalize($incoming['templateVersion'] ?? null);
    unset($incoming['templateVersion']);
    if ($in !== null) {
        $incoming['templateVersion'] = $in;
        return $incoming;
    }
    if ($stored === null) {
        $incoming['templateVersion'] = tvCurrentFor($incoming['templateId'] ?? null);
        return $incoming;
    }
    $st = tvNormalize($stored['templateVersion'] ?? null);
    if ($st !== null) $incoming['templateVersion'] = $st;
    return $incoming;
}

/** Oxunan form_data — versiyası yoxdursa köhnədir */
function tvForRead(array $fd): array {
    $fd['templateVersion'] = tvNormalize($fd['templateVersion'] ?? null) ?? TEMPLATE_VERSION_LEGACY;
    return $fd;
}
