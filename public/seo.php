<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Server tərəfli SEO meta qatı

   PROBLEM (2026-08-31 auditi):
   Sayt SPA-dır (Vite/React) və SPA fallback bütün marşrutlara EYNİ
   index.html-i verirdi. Nəticədə xam HTML-də:
     • hər səhifə `<link rel=canonical href="https://digitoy.az/">`
       elan edirdi → /templates və /demo özlərini ANA SƏHİFƏNİN
       DUBLİKATI kimi göstərirdi (indeksdən düşmə riski);
     • hər səhifə `robots: index, follow` verirdi → şəxsi dəvətnamələr
       (/invite/*) xam HTML-də İNDEKSLƏNƏ BİLƏN görünürdü; noindex yalnız
       JS icra olunandan sonra qoyulurdu;
     • WhatsApp/Telegram/Facebook JS İCRA ETMİR — dəvətnamə linki
       paylaşılanda önbaxışda cütlüyün adı yox, ümumi DigiToy mətni
       görünürdü.

   HƏLL: SPA fallback index.html əvəzinə bu fayla yönəlir. Fayl
   index.html-in <head>-indəki meta bloku marşruta uyğun əvəzləyir.
   BODY TOXUNULMUR — React tətbiqi eyni qalır.

   ⚠ TƏHLÜKƏSİZLİK QAYDASI: burada nə baş verirsə versin, cavab HƏMİŞƏ
   işlək index.html olmalıdır. Hər addım try/catch və fallback ilədir;
   şablon tapılmasa və ya DB sönsə belə sayt açılır.
══════════════════════════════════════════════════ */

$__indexFile = __DIR__ . '/index.html';

/* Fail-safe: hər hansı gözlənilməz xəta olarsa xam index.html ver */
function seoFallback(string $file): never {
    if (!headers_sent()) header('Content-Type: text/html; charset=UTF-8');
    if (is_file($file)) readfile($file);
    exit;
}

set_error_handler(function () use ($__indexFile) { seoFallback($__indexFile); });
set_exception_handler(function () use ($__indexFile) { seoFallback($__indexFile); });

if (!is_file($__indexFile)) {
    http_response_code(500);
    exit('index.html not found');
}

$html = file_get_contents($__indexFile);
if ($html === false || $html === '') seoFallback($__indexFile);

const SITE = 'https://digitoy.az';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = rtrim($path, '/');
if ($path === '') $path = '/';

/* ── Marşruta görə meta ──
   `index` sahəsi YALNIZ ictimai marketinq səhifələri üçün true-dur.
   Google-un crawl büdcəsi şəxsi toy səhifələrinə sərf olunmamalıdır. */
$meta = [
    'title'  => 'DigiToy — Rəqəmsal Toy Dəvətnaməsi, İştirak Təsdiqi və QR Foto Paylaşımı',
    'desc'   => 'Bir Dəvətnamədən Daha Artığı. İştirak Təsdiqi (RSVP), oturma planı, QR foto paylaşımı və premium rəqəmsal toy dəvətnamələri.',
    'canon'  => SITE . '/',
    'index'  => true,
    'ogtype' => 'website',
    'image'  => SITE . '/og-image.jpg',
];

if ($path === '/') {
    /* defolt */
} elseif ($path === '/demo') {
    $meta['title'] = 'Nümunə Dəvətnamə — DigiToy Rəqəmsal Toy Dəvətnaməsi';
    $meta['desc']  = 'DigiToy rəqəmsal toy dəvətnaməsinin canlı nümunəsinə baxın: İştirak Təsdiqi, oturma planı, QR foto paylaşımı və premium dizayn bir arada.';
    $meta['canon'] = SITE . '/demo';
} elseif ($path === '/templates') {
    $meta['title'] = 'Dəvətnamə Şablonları — Rəqəmsal Toy Dəvətnaməsi | DigiToy';
    $meta['desc']  = 'DigiToy-un bütün rəqəmsal dəvətnamə şablonları: klassik qızıl, botanik bağ, modern qara, gecə səması və daha çoxu. Hər birinin canlı önbaxışına baxın.';
    $meta['canon'] = SITE . '/templates';
} elseif (preg_match('#^/invite/([a-zA-Z0-9\-]{2,120})(?:/(foto|qalereya-idare))?$#', $path, $m)) {
    $slug = $m[1];
    $sub  = $m[2] ?? '';

    /* Şəxsi səhifə — axtarış nəticələrinə DÜŞMÜR, amma link paylaşıla bilir */
    $meta['index']  = false;
    $meta['canon']  = '';
    $meta['ogtype'] = 'profile';

    if ($sub === 'foto') {
        $meta['title'] = 'Şəkillərini Paylaş | DigiToy';
        $meta['desc']  = 'Tədbirdən çəkdiyiniz şəkil və videoları bir toxunuşla paylaşın.';
    } elseif ($sub === 'qalereya-idare') {
        $meta['title'] = 'Qonaq Şəkilləri | DigiToy';
        $meta['desc']  = 'Qonaqlarınızın paylaşdığı şəkilləri görün və endirin.';
    } else {
        /* ── Dəvətnamə önbaxışı ──
           WhatsApp/Telegram/Facebook JS icra ETMİR, ona görə cütlüyün adı
           MƏHZ BURADA, serverdə qoyulmalıdır. Əks halda paylaşılan link
           ümumi "DigiToy" mətni ilə görünür.
           DB əlçatmazsa ümumi mətnlə davam edirik — səhifə heç vaxt
           bu səbəbdən sınmır. */
        /* ⚠ DB sorğusu YALNIZ crawler üçün edilir.
           Səbəb: adlar yalnız ÖNBAXIŞ (WhatsApp/Telegram/Facebook) üçün
           lazımdır — real brauzer meta-nı onsuz da JS ilə yeniləyir.
           Əgər hər ziyarətçi üçün sorğu etsəydik və DB yavaşlasa/sönsə,
           HƏR dəvətnamə açılışı PDO timeout-u qədər (saniyələrlə)
           gözləyərdi. Ölçüldü: DB əlçatmaz olanda bu yol 2013 ms sürür.
           İndi bu xərci yalnız botlar ödəyir, o da keşlənir. */
        $names = seoIsCrawler() ? seoLookupCoupleNames($slug) : null;
        if ($names !== null) {
            $meta['title'] = $names . ' — Toy Dəvətnaməsi | DigiToy';
            $meta['desc']  = $names . ' sizi toy mərasiminə dəvət edir. Rəqəmsal dəvətnaməyə baxın, İştirak Təsdiqi göndərin.';
        } else {
            $meta['title'] = 'Toy Dəvətnaməsi | DigiToy';
            $meta['desc']  = 'Sizi toy mərasiminə dəvət edirik. Rəqəmsal dəvətnaməyə baxın, İştirak Təsdiqi göndərin.';
        }
    }
} else {
    /* Naməlum marşrut (admin, daxili önbaxış, mövcud olmayan səhifə) —
       indekslənməsin ki, crawl büdcəsi boş yerə xərclənməsin. */
    $meta['index'] = false;
    $meta['canon'] = '';
    $meta['title'] = 'DigiToy';
}

/** Sorğu paylaşım önbaxışı / axtarış botundandırmı? */
function seoIsCrawler(): bool {
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if ($ua === '') return false;
    return (bool) preg_match(
        '#facebookexternalhit|facebookcatalog|WhatsApp|Telegram|Twitterbot|Slackbot|'
      . 'LinkedInBot|Discordbot|vkShare|redditbot|Googlebot|bingbot|YandexBot|'
      . 'Applebot|DuckDuckBot|Pinterest|SkypeUriPreview|embedly|Iframely#i',
        $ua
    );
}

/** Cütlüyün adlarını DB-dən oxu (BƏY & GƏLİN sırası ilə). Alınmasa null.
    Nəticə qısa müddət keşlənir — eyni link təkrar paylaşılanda DB-yə
    yenidən getmirik. Keş həm TAPILAN, həm də TAPILMAYAN nəticəni saxlayır. */
function seoLookupCoupleNames(string $slug): ?string {
    $cacheFile = sys_get_temp_dir() . '/digitoy_seo_' . hash('sha256', $slug) . '.txt';
    if (is_file($cacheFile) && (time() - (int) @filemtime($cacheFile)) < 3600) {
        $c = (string) @file_get_contents($cacheFile);
        return $c === '' ? null : $c;
    }

    $result = seoQueryCoupleNames($slug);
    @file_put_contents($cacheFile, (string) $result, LOCK_EX);
    return $result;
}

function seoQueryCoupleNames(string $slug): ?string {
    try {
        $cfg = __DIR__ . '/api/config.production.php';
        if (!is_file($cfg)) $cfg = __DIR__ . '/api/config.local.php';
        if (!is_file($cfg)) return null;
        require_once $cfg;
        if (!defined('DB_HOST')) return null;

        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHAR,
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 2]
        );
        $st = $pdo->prepare('SELECT form_data FROM invitations WHERE slug = :s LIMIT 1');
        $st->execute([':s' => $slug]);
        $row = $st->fetchColumn();
        if (!$row) return null;

        $d = json_decode((string) $row, true);
        if (!is_array($d)) return null;

        /* Göstərim sırası BƏY → GƏLİN (mövcud davranışla eyni) */
        $parts = array_values(array_filter([
            trim((string) ($d['groomName'] ?? '')),
            trim((string) ($d['brideName'] ?? '')),
        ], fn($v) => $v !== ''));

        if (!$parts) {
            $ev = trim((string) ($d['eventName'] ?? ''));
            return $ev !== '' ? $ev : null;
        }
        return implode(' & ', $parts);
    } catch (Throwable $e) {
        return null;   /* DB sönsə belə səhifə açılır */
    }
}

/* ── Meta blokunu qur ── */
$e = fn($v) => htmlspecialchars((string) $v, ENT_QUOTES | ENT_HTML5, 'UTF-8');

$robots = $meta['index'] ? 'index, follow' : 'noindex, follow';
$ogUrl  = $meta['canon'] !== '' ? $meta['canon'] : SITE . $path;

$block  = "<title>" . $e($meta['title']) . "</title>\n";
$block .= '    <meta name="description" content="' . $e($meta['desc']) . "\" />\n";
$block .= '    <meta name="robots" content="' . $robots . "\" />\n";
if ($meta['canon'] !== '') {
    $block .= '    <link rel="canonical" href="' . $e($meta['canon']) . "\" />\n";
}
$block .= '    <meta property="og:type" content="' . $e($meta['ogtype']) . "\" />\n";
$block .= '    <meta property="og:site_name" content="DigiToy" />' . "\n";
$block .= '    <meta property="og:locale" content="az_AZ" />' . "\n";
$block .= '    <meta property="og:title" content="' . $e($meta['title']) . "\" />\n";
$block .= '    <meta property="og:description" content="' . $e($meta['desc']) . "\" />\n";
$block .= '    <meta property="og:image" content="' . $e($meta['image']) . "\" />\n";
$block .= '    <meta property="og:url" content="' . $e($ogUrl) . "\" />\n";
$block .= '    <meta name="twitter:card" content="summary_large_image" />' . "\n";
$block .= '    <meta name="twitter:title" content="' . $e($meta['title']) . "\" />\n";
$block .= '    <meta name="twitter:description" content="' . $e($meta['desc']) . "\" />\n";
$block .= '    <meta name="twitter:image" content="' . $e($meta['image']) . '" />';

/* ── Marşruta xas strukturlaşdırılmış data (JSON-LD) ──
   Organization və WebSite index.html-də statik qalır. Burada YALNIZ
   marşruta aid olanlar əlavə olunur. Şəxsi səhifələrə (noindex) heç nə
   əlavə edilmir — orada schema-nın dəyəri yoxdur.

   Qiymətlər src/data/packages.js → PACKAGE_DEFS ilə eyni olmalıdır
   (SADE 59, VIP 89, PREMIUM 129 AZN). */
$jsonld = [];

if ($path === '/') {
    $jsonld[] = [
        '@context' => 'https://schema.org',
        '@type'    => 'Service',
        'name'     => 'Rəqəmsal Toy Dəvətnaməsi',
        'alternateName' => ['Elektron dəvətnamə', 'Online dəvətnamə', 'Digital wedding invitation'],
        'serviceType'   => 'Rəqəmsal dəvətnamə hazırlanması',
        'description'   => 'Toy, nişan və digər tədbirlər üçün premium rəqəmsal dəvətnamə: '
                         . 'İştirak Təsdiqi (RSVP), oturma planı, QR ilə foto/video paylaşımı.',
        'provider' => ['@type' => 'Organization', 'name' => 'DigiToy', 'url' => SITE],
        'areaServed' => ['@type' => 'Country', 'name' => 'Azərbaycan'],
        'url' => SITE . '/',
        'offers' => [
            ['@type' => 'Offer', 'name' => 'SADƏ',    'price' => '59',  'priceCurrency' => 'AZN',
             'availability' => 'https://schema.org/InStock', 'url' => SITE . '/'],
            ['@type' => 'Offer', 'name' => 'VIP',     'price' => '89',  'priceCurrency' => 'AZN',
             'availability' => 'https://schema.org/InStock', 'url' => SITE . '/'],
            ['@type' => 'Offer', 'name' => 'PREMIUM', 'price' => '129', 'priceCurrency' => 'AZN',
             'availability' => 'https://schema.org/InStock', 'url' => SITE . '/'],
        ],
    ];

    /* FAQPage — məzmun əvvəl index.html-də STATİK idi, yəni HƏR səhifədə,
       o cümlədən şəxsi dəvətnamələrdə görünürdü. İndi yalnız ana səhifədə.
       Suallar dəyişməyib (Google-un artıq gördüyü məzmun qorunur). */
    $jsonld[] = [
        '@context'   => 'https://schema.org',
        '@type'      => 'FAQPage',
        'mainEntity' => [
            [
                '@type' => 'Question',
                'name' => 'DigiToy nədir?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => 'DigiToy Azərbaycanda rəqəmsal toy dəvətnaməsi platformasıdır. RSVP (iştirak təsdiqi), oturma planı, QR foto paylaşımı və premium animasiyalı dəvətnamələr bir arada təqdim edilir.'
                ]
            ],
            [
                '@type' => 'Question',
                'name' => 'Paketlər nə qədərdir?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => 'DigiToy üç paket təqdim edir: Sadə (59₼), VİP (89₼) və Premium (129₼). Hər paket müxtəlif animasiya, xüsusiyyət və dəstək səviyyəsi ilə gəlir.'
                ]
            ],
            [
                '@type' => 'Question',
                'name' => 'Dəvətnamə necə göndərilir?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => 'Dəvətnamə unikal keçid vasitəsilə WhatsApp, Telegram və ya digər mesajlaşma tətbiqləri üzərindən paylaşılır. Qonaqlar keçidə klikləyərək dəvətnaməni açır, RSVP verir və yerini görür.'
                ]
            ],
            [
                '@type' => 'Question',
                'name' => 'RSVP və oturma planı nədir?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => 'RSVP qonaqların iştirakını təsdiqləməsidir. Oturma planı isə hər qonağın stolunu göstərir — qonaqlar öz adlarını axtararaq masalarını tapa bilir.'
                ]
            ],
            [
                '@type' => 'Question',
                'name' => 'QR foto paylaşımı necə işləyir?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => 'Masa kartlarına yerləşdirilmiş QR kodu ilə qonaqlar toy şəkillərini birbaşa yükləyə bilər. Bütün fotoşəkillər admin panelindən idarə olunur.'
                ]
            ]
        ],
    ];

} elseif ($path === '/templates' || $path === '/demo') {
    $label = $path === '/templates' ? 'Dəvətnamə Şablonları' : 'Nümunə Dəvətnamə';
    $jsonld[] = [
        '@context'        => 'https://schema.org',
        '@type'           => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Ana səhifə', 'item' => SITE . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $label,       'item' => SITE . $path],
        ],
    ];
}

foreach ($jsonld as $ld) {
    $json = json_encode($ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json !== false) {
        $block .= "\n    <script type=\"application/ld+json\">" . $json . '</script>';
    }
}

/* index.html-dəki hazır meta blokunu (title-dan twitter:image-ə qədər)
   marşruta uyğun blokla əvəzlə. Şablon gözlənildiyi kimi deyilsə
   HEÇ NƏ DƏYİŞMİR — sayt yenə işləyir. */
$pattern = '#<title>.*?<meta name="twitter:image"[^>]*/>#s';
$out = preg_replace($pattern, $block, $html, 1, $count);

if ($out === null || $count !== 1) {
    seoFallback($__indexFile);
}

header('Content-Type: text/html; charset=UTF-8');
/* SPA qabığı qısa müddət keşlənə bilər; meta marşrutdan asılıdır */
header('Cache-Control: public, max-age=300');
echo $out;
