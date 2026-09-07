<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Phase 40: `form_data.i18n` birləşdirmə məntiqi (saf funksiyalar)

   NƏ ÜÇÜN AYRICA FAYL: burada DB, header və ya sessiya YOXDUR — beləliklə
   `tests/i18n_merge_test.php` bu faylı require edib məntiqi real DB-siz
   yoxlaya bilir. `slug_alloc.php` ilə eyni yanaşma.

   ── HƏLL EDİLƏN XƏTA ──
   `save_invitation.php` builder-dən gələn `formData`-nı OLDUĞU KİMİ yazırdı.
   Builder isə `i18n` açarını daşımır (tərcümələr ayrıca modaldan yazılır),
   ona görə dəvətnamə ikinci dəfə təsdiqlənəndə admin-in yazdığı bütün
   EN/RU mətnlər SƏSSİZCƏ SİLİNİRDİ. İstifadəçinin gördüyü: «tərcümə save
   olur, sonra itir və yenidən AZ mətn görünür».

   ── MODEL ──
   `i18n`     : { en|ru → { field → mətn, programSteps → { index → mətn } } }
   `i18nMeta` : eyni ağac, dəyər olaraq 'auto' | 'manual'
                Açarlar YASTIdır: 'venueNote', 'programSteps.0'

   ── QAYDA (bir cümlə ilə) ──
   ADMIN-İN ƏL İLƏ YAZDIĞINA HEÇ VAXT TOXUNULMUR.
     • meta = 'manual'  → saxlanılan dəyər qalır (builder onu əvəz edə bilmir)
     • meta = 'auto'    → builder-in yeni avtomatik tərcüməsi ilə əvəzlənir
                          (AZ mətn dəyişəndə köhnə avtomatik tərcümə köhnəlir)
     • meta YOXDUR      → 'manual' sayılır ⇒ Phase 36-da yazılmış MÖVCUD
                          tərcümələr (o vaxt meta yox idi) qorunur.
══════════════════════════════════════════════════ */

if (!defined('I18N_LANGS')) {
    define('I18N_LANGS', 'en,ru');
}

/** Bir dil qovasını yastı xəritəyə çevir: ['programSteps' => [0 => 'x']] → ['programSteps.0' => 'x'] */
function i18nFlatten($bucket): array {
    if (!is_array($bucket)) return [];
    $out = [];
    foreach ($bucket as $k => $v) {
        $k = (string)$k;
        if (is_string($v)) {
            $out[$k] = $v;
        } elseif (is_array($v)) {
            foreach ($v as $k2 => $v2) {
                if (is_string($v2)) $out[$k . '.' . (string)$k2] = $v2;
            }
        }
    }
    return $out;
}

/** Yastı xəritəni geri qova formasına çevir. */
function i18nUnflatten(array $flat): array {
    $out = [];
    foreach ($flat as $k => $v) {
        if (!is_string($v)) continue;
        $parts = explode('.', (string)$k, 2);
        if (count($parts) === 2) {
            if (!isset($out[$parts[0]]) || !is_array($out[$parts[0]])) $out[$parts[0]] = [];
            $out[$parts[0]][$parts[1]] = $v;
        } else {
            $out[$k] = $v;
        }
    }
    return $out;
}

/**
 * Builder-dən gələn `formData`-nı saxlanılan sətirlə birləşdir.
 *
 * @param array $storedFd    DB-dəki mövcud form_data (dekod edilmiş)
 * @param array $incomingFd  builder-in göndərdiyi yeni form_data
 * @return array             yazılacaq form_data (yalnız i18n/i18nMeta dəyişir)
 */
function mergeInvitationI18n(array $storedFd, array $incomingFd): array {
    $langs = explode(',', I18N_LANGS);

    $storedI18n = is_array($storedFd['i18n']     ?? null) ? $storedFd['i18n']     : [];
    $storedMeta = is_array($storedFd['i18nMeta'] ?? null) ? $storedFd['i18nMeta'] : [];
    $incI18n    = is_array($incomingFd['i18n']     ?? null) ? $incomingFd['i18n']     : [];
    $incMeta    = is_array($incomingFd['i18nMeta'] ?? null) ? $incomingFd['i18nMeta'] : [];

    $outI18n = [];
    $outMeta = [];

    foreach ($langs as $lg) {
        $sVals = i18nFlatten($storedI18n[$lg] ?? null);
        $sMeta = i18nFlatten($storedMeta[$lg] ?? null);
        $iVals = i18nFlatten($incI18n[$lg] ?? null);
        $iMeta = i18nFlatten($incMeta[$lg] ?? null);

        $vals = [];
        $meta = [];

        /* 1) Saxlanılanlar: manual olanlar toxunulmaz, auto olanlar yenilənir */
        foreach ($sVals as $key => $val) {
            $isAuto = (($sMeta[$key] ?? 'manual') === 'auto');
            if (!$isAuto) {
                $vals[$key] = $val;
                $meta[$key] = 'manual';
                continue;
            }
            /* auto: builder yeni tərcümə verdisə onu götür, verməyibsə ATIL —
               çünki AZ mətn dəyişmiş ola bilər və köhnə avtomatik tərcümə
               artıq yanlışdır. Atılan sahə render zamanı lüğətə/AZ-a düşür. */
            if (isset($iVals[$key]) && $iVals[$key] !== '') {
                $vals[$key] = $iVals[$key];
                $meta[$key] = 'auto';
            }
        }

        /* 2) Yalnız builder-də olan yeni sahələr */
        foreach ($iVals as $key => $val) {
            if (isset($vals[$key]) || $val === '') continue;
            $vals[$key] = $val;
            $meta[$key] = ($iMeta[$key] ?? 'auto') === 'manual' ? 'manual' : 'auto';
        }

        if ($vals) {
            $outI18n[$lg] = i18nUnflatten($vals);
            $outMeta[$lg] = i18nUnflatten($meta);
        }
    }

    $out = $incomingFd;
    if ($outI18n) { $out['i18n'] = $outI18n; $out['i18nMeta'] = $outMeta; }
    else          { unset($out['i18n'], $out['i18nMeta']); }
    return $out;
}
