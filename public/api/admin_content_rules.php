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

/**
 * Şablonun şəkil yerləri (2026-11): { açar: {hide:true} | {hide:false} | {src} }.
 * Açar adı formatla yoxlanılır (kataloq `src/templates/templatePhotos.js`-dədir və
 * orada ağ siyahı ilə süzülür), şəkil yalnız serverin öz admin yükləməsi.
 */
const ACR_IMAGES_MAX = 40;
function acrImages($raw): ?array {
    if (!is_array($raw)) return null;
    $out = [];
    foreach ($raw as $key => $val) {
        if (count($out) >= ACR_IMAGES_MAX) break;
        if (!is_string($key) || !preg_match('/^[a-z][a-zA-Z0-9]{0,31}\z/', $key) || !is_array($val)) continue;
        if (($val['hide'] ?? null) === true) {
            $out[$key] = ['hide' => true];
        } elseif (($val['hide'] ?? null) === false && !isset($val['src'])) {
            $out[$key] = ['hide' => false];
        } else {
            $src = acrAdminImage($val['src'] ?? null);
            if ($src !== null) $out[$key] = ['src' => $src];
        }
    }
    return $out ?: null;
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

/* ── Ağ siyahılar — müştəri tərəfdəki `adminOverrides.js` ilə UYĞUN olmalıdır ──
   tests/admin_whitelists_test.mjs siyahıları müqayisə edir. */
const THEME_KEYS = ['primary', 'secondary', 'accent', 'background', 'text'];

/* `src/templates/templateConfig.js` › FONT_STACKS açarları.
   ⚠ 2026-11: yeni şablonların şriftləri siyahıda yox idi — admin onları seçəndə
   saxlama səssizcə atırdı. */
const FONT_KEYS = [
    'cormorant', 'newsreader', 'baskerville', 'instrument', 'marcellus', 'italiana', 'amiri', 'cinzel',
    'archivo', 'dmsans', 'inter', 'spacegrotesk', 'jetbrains', 'jost', 'bebas', 'notoDisplay',
    'hanken', 'ballet', 'fraunces', 'mulish', 'unbounded', 'interTight', 'spectral', 'sourceSerif',
    'commissioner', 'reemKufi', 'alegreya', 'vollkorn', 'geologica', 'josefin', 'onest', 'oswald',
    'plexSans', 'plexMono', 'bigShoulders', 'playfair', 'youngSerif', 'montserrat', 'cormorantSC', 'ebGaramond',
    'imperial', 'libreBodoni', 'literata', 'oldStandard', 'libreCaslon', 'raleway', 'cormorantUnicase', 'bonaNova',
    'tektur', 'exo2', 'oi', 'podkova', 'shantell', 'andika', 'mplusRounded', 'pacifico',
    'lora', 'greatVibes', 'alegreyaSans', 'badScript', 'playfairSC', 'merriweather', 'spectralSC', 'balsamiq',
    'nunitoSans', 'montserratAlt', 'nunito', 'cormorantInfant', 'caveat', 'comfortaa', 'playpen', 'ysabeauInfant',
    'interTightBold', 'lobster', 'jura', 'vollkornSC', 'brygada', 'piazzolla', 'didact', 'marmelad',
    'pangolin', 'bellotaText', 'alegreyaSC', 'firaXC', 'firaC', 'comforterBrush', 'robotoSerif', 'notoSans',
    'comforter', 'amatic', 'ysabeauOffice', 'ysabeau', 'martianMono', 'bonaNovaSC', 'robotoCondensed', 'ibmPlexMono',
    'alumniSans', 'notoSansDisplay', 'ibmPlexSerif', 'ibmPlexSans', 'robotoSlab', 'bellota', 'cormorantFull', 'exo2Heavy',
    'alumniPin', 'notoSerifL',
    /* 2026-11 — «Viral video» toy seriyası */
    'labrada', 'carattere', 'cormorantUpright', 'corinthia', 'gideonRoman', 'luxurious',
    'petitFormal', 'trirong', 'aboreto', 'albertSans', 'meaCulpa', 'hahmlet', 'plusJakarta',
];

/* `src/data/adminOverrides.js` › CONTENT_SECTIONS açarları (+ hekayə başlığı) */
const LABEL_KEYS = [
    'hero', 'countdown', 'venue', 'program', 'dresscode',
    'seating', 'gallery', 'rsvp', 'guestbook', 'footer', 'lovestory',
];

/* `src/data/sections.js` ilə eyni açarlar (Phase 35).
   ⚠ Phase 45: 'lovestory' əlavə edildi. Əvvəl siyahıda YOX idi və admin
   paneldə «Bölmələr» saxlananda `sections` obyekti bu siyahı ilə yenidən
   qurulurdu — müştərinin açdığı «Bizim Hekayəmiz» (`lovestory: true`)
   SƏSSİZCƏ silinir, hekayə dəvətnamədən itirdi; admin onu aça da bilmirdi. */
const SECTION_KEYS = [
    'venue', 'countdown', 'program', 'dresscode',
    'seating', 'gallery', 'rsvp', 'guestbook', 'music', 'lovestory',
];

const SCALE_MIN = 0.85;
const SCALE_MAX = 1.25;
const MAX_TEXT  = 160;

/** Nəzarət simvollarını at, boşluqları yığ, kəs. Boş qalsa null. */
function cleanText($v, int $max = MAX_TEXT): ?string {
    if (!is_string($v)) return null;
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v);
    $v = preg_replace('/\s+/u', ' ', (string)$v);
    $v = trim((string)$v);
    return $v === '' ? null : mb_substr($v, 0, $max);
}

function cleanColor($v): ?string {
    if (!is_string($v)) return null;
    $v = trim($v);
    return preg_match('/^#[0-9A-Fa-f]{6}$/', $v) ? strtoupper($v) : null;
}

function cleanScale($v): ?float {
    if (!is_numeric($v)) return null;
    $n = round((float)$v, 2);
    if ($n < SCALE_MIN) $n = SCALE_MIN;
    if ($n > SCALE_MAX) $n = SCALE_MAX;
    return $n;
}

/**
 * Admin override-larının TAM süzgəci: rənglər, şriftlər, bölmə mətnləri, sətirlər,
 * açılış və hekayə. Etibarsız/naməlum hər şey atılır.
 * Həm dəvətnamə (admin_invitation_content.php), həm şablon səviyyəsi
 * (admin_template_content.php) bunu işlədir.
 */
function acrCleanOverrides(array $inAdmin): array {
    $clean = [];

    /* ── rənglər ── */
    if (is_array($inAdmin['theme'] ?? null)) {
        $t = [];
        foreach (THEME_KEYS as $k) {
            $c = cleanColor($inAdmin['theme'][$k] ?? null);
            if ($c !== null) $t[$k] = $c;
        }
        if ($t) $clean['theme'] = $t;
    }

    /* ── şriftlər ── */
    if (is_array($inAdmin['fonts'] ?? null)) {
        $f = [];
        foreach (['heading', 'body'] as $k) {
            $v = $inAdmin['fonts'][$k] ?? null;
            if (is_string($v) && in_array($v, FONT_KEYS, true)) $f[$k] = $v;
        }
        foreach (['headingScale', 'bodyScale'] as $k) {
            $n = cleanScale($inAdmin['fonts'][$k] ?? null);
            /* 1.0 = dəyişiklik yoxdur → saxlamırıq (JSON şişməsin) */
            if ($n !== null && abs($n - 1.0) > 0.001) $f[$k] = $n;
        }
        if ($f) $clean['fonts'] = $f;
    }

    /* ── bölmə mətnləri (AZ/EN/RU) ── */
    if (is_array($inAdmin['labels'] ?? null)) {
        $L = [];
        foreach ($inAdmin['labels'] as $key => $entry) {
            if (!in_array($key, LABEL_KEYS, true) || !is_array($entry)) continue;
            $e = [];

            $kick = cleanText($entry['kicker'] ?? null, 40);
            /* ⚠ BÖYÜK HƏRF: səhifə lang="az"-dır, CSS `text-transform: uppercase`
               ingilis «i»-ni «İ»-yə çevirir (EDITION → EDİTİON). Mənbədə böyük
               saxlayanda problem yaranmır — eyni qayda şablonlarda da var. */
            if ($kick !== null) $e['kicker'] = mb_strtoupper($kick, 'UTF-8');

            if (is_array($entry['title'] ?? null)) {
                $title = [];
                foreach (['az', 'en', 'ru'] as $lg) {
                    $t = cleanText($entry['title'][$lg] ?? null);
                    if ($t !== null) $title[$lg] = $t;
                }
                if ($title) $e['title'] = $title;
            }

            if ($e) $L[$key] = $e;
        }
        if ($L) $clean['labels'] = $L;
    }

    /* ── sətirlər (Phase 42.1 · #7) ──
       ⚠ Açar ağ siyahısı BURADA saxlanılmır: kataloq müştəri tərəfdədir
       (`src/data/adminOverrides.js` › STRING_CATALOG) və orada da yoxlanılır.
       Server tərəfdə format yoxlanılır — açar adı təhlükəsiz simvollardan
       ibarət olmalı, dəyər sətir və məhdud uzunluqda. Beləliklə kataloq
       genişlənəndə PHP-ni hər dəfə yeniləmək lazım gəlmir, amma zibil də keçmir. */
    if (is_array($inAdmin['strings'] ?? null)) {
        $S = [];
        foreach ($inAdmin['strings'] as $key => $val) {
            /* nöqtəli prefiks (rsvp.yes) və adi açar (inv_location) */
            if (!preg_match('/^[a-z][a-z0-9_]*(\.[a-z][a-zA-Z0-9_]*)?$/i', (string)$key)) continue;
            if (!is_array($val)) continue;
            $bucket = [];
            foreach (['az', 'en', 'ru'] as $lg) {
                $t = cleanText($val[$lg] ?? null, 400);
                if ($t !== null) $bucket[$lg] = $t;
            }
            if ($bucket) $S[$key] = $bucket;
        }
        if ($S) $clean['strings'] = $S;
    }

    /* ── açılış ekranı və «Bizim Hekayəmiz» (Phase 45) ── */
    $opening = acrOpening($inAdmin['opening'] ?? null);
    if ($opening !== null) $clean['opening'] = $opening;
    $story = acrStory($inAdmin['story'] ?? null);
    if ($story !== null) $clean['story'] = $story;

    /* ── şablonun şəkil yerləri (2026-11) ── */
    $images = acrImages($inAdmin['images'] ?? null);
    if ($images !== null) $clean['images'] = $images;

    return $clean;
}

/** Bölmə görünürlüyü (Phase 35 açarı): yalnız məlum açarlar, boşdursa null. */
function acrCleanSections($inSections): ?array {
    if (!is_array($inSections)) return null;
    $s = [];
    foreach (SECTION_KEYS as $k) {
        if (array_key_exists($k, $inSections)) $s[$k] = (bool)$inSections[$k];
    }
    return $s ?: null;
}
