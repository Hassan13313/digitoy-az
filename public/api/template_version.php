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
   Açıq gələn dəyər (1 və ya 2) həmişə qəbul olunur — admin seçimidir.
   ⚠ DB-siz test olunur: tests/template_version_test.php
   ───────────────────────────────────────────────────────────────────────── */

const TEMPLATE_VERSION_LEGACY  = 1;
const TEMPLATE_VERSION_CURRENT = 2;

/** 1 və ya 2 — başqa hər şey null */
function tvNormalize($v): ?int {
    if (is_int($v) || (is_string($v) && ctype_digit($v)) || (is_float($v) && floor($v) == $v)) {
        $n = (int)$v;
        return ($n === TEMPLATE_VERSION_LEGACY || $n === TEMPLATE_VERSION_CURRENT) ? $n : null;
    }
    return null;
}

/**
 * Saxlanılacaq form_data-nın versiyası.
 * @param array      $incoming gələn form_data
 * @param array|null $stored   mövcud sətrin form_data-sı (null = yeni sətir)
 */
function tvForSave(array $incoming, ?array $stored): array {
    $in = tvNormalize($incoming['templateVersion'] ?? null);
    unset($incoming['templateVersion']);
    if ($in !== null) {
        $incoming['templateVersion'] = $in;
        return $incoming;
    }
    if ($stored === null) {
        $incoming['templateVersion'] = TEMPLATE_VERSION_CURRENT;
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
