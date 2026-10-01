<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Phase 45: açılış ekranı və «Bizim Hekayəmiz» override-larının
   server tərəfi yoxlaması.

   YALNIZ include edilir (admin_invitation_content.php). Funksiyalar DB-yə və
   sorğuya toxunmur → tests/admin_content_rules_test.php onları serversiz
   yoxlayır.

   ⚠ Qaydalar `src/data/adminOverrides.js` › normalizeOpening / normalizeStory
   ilə EYNİDİR. Brauzer tərəfə heç vaxt təkbaşına etibar edilmir: admin
   paneldən gələn hər dəyər burada yenidən süzülür.
     • açarlar yalnız ağ siyahıdan (slot adları, hekayə mətnləri, `c<N>`)
     • mətn uzunluğu məhduddur, nəzarət simvolları atılır
     • şəkil yalnız serverin öz yaratdığı fayl adıdır (başqa host, data:,
       javascript:, ../ — hamısı rədd)
   Dəyərlər dəvətnamədə React mətni kimi göstərilir (escape olunur), HTML/CSS-ə
   birbaşa düşmür.
   ══════════════════════════════════════════════════════════════════════ */

/* `src/templates/_shared/openingSpec.js` › OPENING_SLOT_LABELS açarları */
const ACR_OPENING_SLOTS = [
    'kicker', 'sub', 'title', 'meta', 'cta', 'hint', 'brand', 'pass', 'route',
    'fDate', 'fTime', 'fGate', 'edition', 'masthead', 'venue', 'no', 'and', 'skip',
];
const ACR_MONO_MODES   = ['none', 'text', 'sticker', 'image'];
const ACR_STORY_TEXTS  = ['kicker', 'title', 'sub', 'next', 'end', 'endSub', 'kpre', 'photo'];
const ACR_LANGS        = ['az', 'en', 'ru'];
const ACR_MAX_CHAPTERS = 12;
const ACR_MAX_PHOTOS   = 6;

const ACR_ADMIN_IMG_RE = '~^/uploads/_admin/[A-Za-z0-9-]{1,120}/[a-f0-9]{20}\.(?:jpg|png)\z~';
const ACR_STORY_IMG_RE = '~^/uploads/_story/[a-f0-9]{24}/[a-f0-9]{20}\.jpg\z~';

/** Qısa mətn: nəzarət simvolları → boşluq, boşluqlar yığılır, kəsilir. */
function acrText($v, int $max): ?string {
    if (!is_string($v)) return null;
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v);
    if ($v === null) return null;                 /* etibarsız UTF-8 */
    $v = trim((string) preg_replace('/\s+/u', ' ', $v));
    return $v === '' ? null : mb_substr($v, 0, $max, 'UTF-8');
}

/** Uzun mətn (hekayə fəsli): SƏTİR SONLARI QORUNUR. */
function acrLongText($v, int $max): ?string {
    if (!is_string($v)) return null;
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    $v = preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', ' ', $v);
    if ($v === null) return null;
    $v = preg_replace('/[^\S\n]+/u', ' ', $v);
    $v = preg_replace('/ *\n */u', "\n", (string) $v);
    $v = trim((string) preg_replace('/\n{3,}/u', "\n\n", (string) $v));
    return $v === '' ? null : mb_substr($v, 0, $max, 'UTF-8');
}

function acrAdminImage($v): ?string {
    return (is_string($v) && preg_match(ACR_ADMIN_IMG_RE, $v)) ? $v : null;
}

function acrStoryImage($v): ?string {
    return (is_string($v) && (preg_match(ACR_ADMIN_IMG_RE, $v) || preg_match(ACR_STORY_IMG_RE, $v))) ? $v : null;
}

/** {az,en,ru} qovası — heç bir dil dolu deyilsə null */
function acrLangBucket($raw, callable $clean): ?array {
    if (!is_array($raw)) return null;
    $out = [];
    foreach (ACR_LANGS as $lg) {
        $t = $clean($raw[$lg] ?? null);
        if ($t !== null) $out[$lg] = $t;
    }
    return $out ?: null;
}

/**
 * Açılış ekranı: { mono:{mode,value?,image?}, text:{slot:{az,en,ru}}, hide:[slot] }
 * Heç bir etibarlı dəyər qalmasa null (= açar saxlanılmır).
 */
function acrOpening($raw): ?array {
    if (!is_array($raw)) return null;
    $out = [];

    $m = $raw['mono'] ?? null;
    if (is_array($m) && in_array($m['mode'] ?? null, ACR_MONO_MODES, true)) {
        $mode = $m['mode'];
        if ($mode === 'none') {
            $out['mono'] = ['mode' => 'none'];
        } elseif ($mode === 'image') {
            $img = acrAdminImage($m['image'] ?? null);
            if ($img !== null) $out['mono'] = ['mode' => 'image', 'image' => $img];
        } else {
            $v = acrText($m['value'] ?? null, $mode === 'text' ? 12 : 16);
            if ($v !== null) $out['mono'] = ['mode' => $mode, 'value' => $v];
        }
    }

    if (is_array($raw['text'] ?? null)) {
        $T = [];
        foreach ($raw['text'] as $slot => $val) {
            if (!in_array($slot, ACR_OPENING_SLOTS, true)) continue;
            $b = acrLangBucket($val, fn($x) => acrText($x, 140));
            if ($b !== null) $T[$slot] = $b;
        }
        if ($T) $out['text'] = $T;
    }

    if (is_array($raw['hide'] ?? null)) {
        $H = [];
        foreach ($raw['hide'] as $slot) {
            if (is_string($slot) && in_array($slot, ACR_OPENING_SLOTS, true) && !in_array($slot, $H, true)) $H[] = $slot;
        }
        if ($H) $out['hide'] = $H;
    }

    return $out ?: null;
}

/** Bir fəsil (müştərinin fəslinə override və ya admin-in yeni fəsli). */
function acrChapter($raw, bool $allowIndex): ?array {
    if (!is_array($raw)) return null;
    $c = [];
    $title   = acrLangBucket($raw['title']   ?? null, fn($x) => acrText($x, 160));
    $text    = acrLangBucket($raw['text']    ?? null, fn($x) => acrLongText($x, 1500));
    $caption = acrLangBucket($raw['caption'] ?? null, fn($x) => acrText($x, 80));
    if ($title   !== null) $c['title']   = $title;
    if ($text    !== null) $c['text']    = $text;
    if ($caption !== null) $c['caption'] = $caption;

    if (($raw['date'] ?? null) === false) $c['date'] = false;
    else { $d = acrText($raw['date'] ?? null, 60); if ($d !== null) $c['date'] = $d; }
    if (($raw['icon'] ?? null) === false) $c['icon'] = false;
    else { $i = acrText($raw['icon'] ?? null, 16); if ($i !== null) $c['icon'] = $i; }

    if (is_array($raw['photos'] ?? null)) {
        $P = [];
        foreach ($raw['photos'] as $p) {
            if (count($P) >= ACR_MAX_PHOTOS) break;
            if ($allowIndex && is_int($p) && $p >= 0 && $p < ACR_MAX_PHOTOS) {
                if (!in_array($p, $P, true)) $P[] = $p;
                continue;
            }
            $url = acrStoryImage($p);
            if ($url !== null && !in_array($url, $P, true)) $P[] = $url;
        }
        $c['photos'] = $P;   /* boş massiv də mənalıdır: «şəkilləri gizlət» */
    }

    if ($allowIndex && ($raw['hide'] ?? null) === true) $c['hide'] = true;
    return $c;
}

/**
 * «Bizim Hekayəmiz»: { text:{…}, ch:{c0:{…}}, add:[{…}] }
 * ⚠ `ch` açarı `c<indeks>`-dir — rəqəm açar PHP-də massivə çevrilir və JSON-a
 * `[…]` kimi yazılır; prefiks onu həmişə obyekt saxlayır.
 */
function acrStory($raw): ?array {
    if (!is_array($raw)) return null;
    $out = [];

    if (is_array($raw['text'] ?? null)) {
        $T = [];
        foreach (ACR_STORY_TEXTS as $k) {
            $b = acrLangBucket($raw['text'][$k] ?? null, fn($x) => acrText($x, 200));
            if ($b !== null) $T[$k] = $b;
        }
        if ($T) $out['text'] = $T;
    }

    if (is_array($raw['ch'] ?? null)) {
        $CH = [];
        foreach ($raw['ch'] as $key => $val) {
            if (!is_string($key) || !preg_match('/^c(?:[0-9]|[1-2][0-9])\z/', $key)) continue;
            $c = acrChapter($val, true);
            if ($c) $CH[$key] = $c;
        }
        if ($CH) $out['ch'] = $CH;
    }

    if (is_array($raw['add'] ?? null)) {
        $A = [];
        foreach ($raw['add'] as $val) {
            if (count($A) >= ACR_MAX_CHAPTERS) break;
            $c = acrChapter($val, false);
            if ($c === null) continue;
            unset($c['hide']);
            if (($c['date'] ?? null) === false) unset($c['date']);
            if (($c['icon'] ?? null) === false) unset($c['icon']);
            if (empty($c['title']) && empty($c['text']) && empty($c['photos'])) continue;
            $id = is_array($val) ? ($val['id'] ?? null) : null;
            $c['id'] = (is_string($id) && preg_match('/^[A-Za-z0-9_-]{1,40}\z/', $id)) ? $id : ('adm_' . count($A));
            $A[] = $c;
        }
        if ($A) $out['add'] = $A;
    }

    return $out ?: null;
}
