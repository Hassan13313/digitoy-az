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
$legal = seoLegalPages()[$path] ?? null;   /* Phase 47: [title, description] və ya null */
$guide = $legal ? null : seoGuide($path);  /* Phase 52: public/guides/<slug>.json və ya null */
/* 2026-11: /sablonlar/<slug> — tədbir üzrə şablon səhifəsi */
$conceptPage = (preg_match('#^/sablonlar/([a-z0-9-]+)$#', $path, $cm)) ? (seoConceptPages()[$cm[1]] ?? null) : null;

/* ── Marşruta görə meta ──
   `index` sahəsi YALNIZ ictimai marketinq səhifələri üçün true-dur.
   Google-un crawl büdcəsi şəxsi toy səhifələrinə sərf olunmamalıdır. */
$seoStatus = 200;
/* Phase 51 SEO: başlıqlar «online / elektron dəvətnamə» axtarışına görədir.
   ⚠ src/App.jsx (HOME_/DEMO_/TEMPLATES_) ilə HƏRFBƏHƏRF eyni
   (tests/seo_keywords_test.mjs). */
$meta = [
    'title'  => 'Online Dəvətnamə — Rəqəmsal və Elektron Toy Dəvətnaməsi | DigiToy',
    'desc'   => 'Online dəvətnamə hazırlayın: toy, nişan və ad günü üçün rəqəmsal (elektron) dəvətnamə — İştirak Təsdiqi, oturma planı, QR foto paylaşımı. 59 ₼-dan.',
    'canon'  => SITE . '/',
    'index'  => true,
    'ogtype' => 'website',
    'image'  => SITE . '/og-image.jpg',
];

if ($path === '/') {
    /* defolt */
} elseif ($path === '/demo') {
    $meta['title'] = 'Online Dəvətnamə Nümunəsi — Rəqəmsal Toy Dəvətnaməsi | DigiToy';
    $meta['desc']  = 'Online dəvətnamə necə görünür? DigiToy rəqəmsal toy dəvətnaməsinin canlı nümunəsi: İştirak Təsdiqi, oturma planı, QR foto paylaşımı və premium dizayn bir arada.';
    $meta['canon'] = SITE . '/demo';
} elseif ($path === '/templates') {
    $meta['title'] = 'Online Dəvətnamə Şablonları — Toy, Nişan, Xına, Ad Günü | DigiToy';
    $meta['desc']  = 'Onlarla online dəvətnamə dizaynı: toy, nişan, xına gecəsi, ad günü, ildönümü, uşaq ad günü, sünnət toyu, korporativ tədbir və daha çoxu. Hər birinin canlı önbaxışı var.';
    $meta['canon'] = SITE . '/templates';
} elseif ($conceptPage) {
    /* 2026-11 — tədbir üzrə şablonlar: ictimai, indekslənir */
    $meta['title'] = $conceptPage['title'];
    $meta['desc']  = $conceptPage['desc'];
    $meta['canon'] = SITE . $path;
} elseif ($legal) {
    /* Phase 47 — hüquqi səhifələr: ictimai, indekslənir */
    [$meta['title'], $meta['desc']] = $legal;
    $meta['canon'] = SITE . $path;
} elseif ($guide) {
    /* Phase 52 — bələdçi / dəvətnamə mətnləri: ictimai, indekslənir */
    $meta['title']  = $guide['title'];
    $meta['desc']   = $guide['description'];
    $meta['canon']  = SITE . $path;
    $meta['ogtype'] = 'article';
} elseif (preg_match('#^/invite/([a-zA-Z0-9\-]{2,120})(?:/(foto|qalereya-idare|slayd|panel))?$#', $path, $m)) {
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
    } elseif ($sub === 'slayd') {
        $meta['title'] = 'Slayd Şou | DigiToy';
        $meta['desc']  = 'Qonaqların paylaşdığı şəkillər canlı slayd şouda.';
    } elseif ($sub === 'panel') {
        /* Phase 50 — müştərinin şəxsi paneli: önbaxışda adlar GÖSTƏRİLMİR,
           səhifədəki linklər də izlənmir (nofollow). */
        $meta['title']    = 'Müştəri paneli | DigiToy';
        $meta['desc']     = 'Dəvətnamənizin iştirak təsdiqləri, təbrikləri və şəkilləri bir yerdə.';
        $meta['nofollow'] = true;
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
        [$meta['title'], $meta['desc']] = seoInviteMeta(seoIsCrawler() ? seoLookupInvite($slug) : null);
    }
} else {
    /* Daxili marşrut (admin, canlı/şablon önbaxışı) və ya mövcud olmayan
       səhifə — indekslənməsin ki, crawl büdcəsi boş yerə xərclənməsin. */
    $meta['index'] = false;
    $meta['canon'] = '';
    $meta['title'] = 'DigiToy';

    /* ⚠ 2026-09-28 SEO: mövcud olmayan səhifə əvvəl 200 qaytarırdı («soft
       404» — Google bunu keyfiyyət problemi kimi qeyd edir). İndi 404
       STATUSU verilir; gövdə eyni SPA-dır, yəni istifadəçi yenə saytı
       görür. Siyahı src/App.jsx-dəki marşrutlarla UYĞUN olmalıdır —
       yeni marşrut əlavə edəndə buraya da yaz. */
    if (!seoIsAppRoute($path)) {
        $seoStatus = 404;
        $meta['title'] = 'Səhifə tapılmadı | DigiToy';
    }
}

/** 2026-11 — tədbir üzrə şablon səhifələri: slug → mətn və şablon adları.
    ⚠ src/data/conceptPages.js + templateConfig.js ilə HƏRFBƏHƏRF eyni (tests/concept_pages_test.mjs). */
function seoConceptPages(): array {
    return [
        'toy-nisan' => [
            'concept' => 'toy',
            'title' => 'Toy və Nişan Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Toy və nişan üçün online dəvətnamə şablonları: lüks, klassik, minimalist və vintage dizaynlar. İştirak Təsdiqi, oturma planı və QR foto paylaşımı ilə. 59 ₼-dan.',
            'h1' => 'Toy və Nişan Dəvətnaməsi',
            'intro' => 'Toy və nişan üçün online dəvətnamə şablonları. Hər dizaynın öz açılışı, şrifti və rəng dili var. Canlı önbaxışa baxın, bəyəndiyinizi seçin, linki qonaqlarınıza WhatsApp ilə göndərin.',
            'names' => ['Royal Palace', 'Oriental Luxe', 'Night Sky', 'Mediterranean', 'Crystal Glass', 'Gazette', 'Simple Luxury', 'Royal Gold', 'Luxury Jewelry', 'Floral Garden', 'White Elegance', 'Nature Touch', 'Vinyl Record', 'Cinema Premiere', 'Boarding Pass', 'Modern Black', 'Şam və Üzük', 'Gəlin', 'İlk Rəqs', 'Ivory Silk', 'Bakı Gecəsi', 'Golden Hour', 'Şahdağ'],
        ],
        'xina-gecesi' => [
            'concept' => 'xina',
            'title' => 'Xına Gecəsi Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Xına gecəsi üçün online dəvətnamə şablonları: qırmızı duvaq, xonça, kəlağayı, buta motivləri. Qonaqlarınıza bir linklə göndərin, iştirakı onlayn təsdiqləsinlər.',
            'h1' => 'Xına Gecəsi Dəvətnaməsi',
            'intro' => 'Xına gecəsi üçün milli motivli online dəvətnamə şablonları: qırmızı duvaq, xonça, kəlağayı, buta və şam işığı. Gəlinin adı, tarix və məkan bir linkdə.',
            'names' => ['Red Veil', 'Xonça', 'Henna Buta', 'Mirror & Candle', 'Kəlağayı'],
        ],
        'ad-gunu' => [
            'concept' => 'birthday',
            'title' => 'Ad Günü Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Ad günü üçün online dəvətnamə şablonları: minik talonu, kino premyerası, vinil, qəzet və modern afişa. Yaş, proqram, İştirak Təsdiqi və təbriklər bir linkdə.',
            'h1' => 'Ad Günü Dəvətnaməsi',
            'intro' => 'Böyüklər üçün ad günü dəvətnaməsi şablonları: minik talonu, kino premyerası, vinil plastinka, qəzet və modern afişa. Hər biri tək nəfərin adı və yaşı üçün hazırlanıb.',
            'names' => ['Gazette', 'Vinyl Record', 'Cinema Premiere', 'Boarding Pass', 'Modern Black'],
        ],
        'ildonumu' => [
            'concept' => 'anniversary',
            'title' => 'İldönümü Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Toy ildönümü üçün online dəvətnamə şablonları: gümüş və qızıl toy, ilk il, retro polaroid, sevgi məktubları. Xatirələriniz və proqramınız bir linkdə.',
            'h1' => 'İldönümü Dəvətnaməsi',
            'intro' => 'Toy ildönümü üçün online dəvətnamə şablonları: gümüş və qızıl toy, birinci il, retro polaroid və sevgi məktubları. Birlikdə keçirdiyiniz illər səhifənin mərkəzindədir.',
            'names' => ['Silver Locket', 'Golden Jubilee', 'First Paper', 'Retro Polaroid', 'Love Letters'],
        ],
        'usaq-ad-gunu' => [
            'concept' => 'kids',
            'title' => 'Uşaq Ad Günü Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Uşaq ad günü üçün online dəvətnamə şablonları: nağıl, kosmos, sirk, dinozavr və şarlar. Uşağın adı və yaşı ilə, valideynlər iştirakı bir toxunuşla təsdiqləyir.',
            'h1' => 'Uşaq Ad Günü Dəvətnaməsi',
            'intro' => 'Uşaq ad günü üçün online dəvətnamə şablonları: nağıl kitabı, kosmos səfəri, sirk, dinozavr macərası və rəngli şarlar. Uşağın adı və yaşı ilə, açılışı oyun kimi.',
            'names' => ['Fairy Tale', 'Space Mission', 'Circus Show', 'Dino Adventure', 'Balloon Party'],
        ],
        'sunnet-toyu' => [
            'concept' => 'sunnet',
            'title' => 'Sünnət Toyu Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Sünnət toyu üçün online dəvətnamə şablonları: balaca şahzadə, komiks qəhrəmanı, maşallah, balaca pilot və futbol ulduzu. Proqram və xəritə bir linkdə.',
            'h1' => 'Sünnət Toyu Dəvətnaməsi',
            'intro' => 'Sünnət toyu üçün online dəvətnamə şablonları: balaca şahzadə, komiks qəhrəmanı, maşallah, balaca pilot və futbol ulduzu. Oğlanın adı və yaşı ilə hazır dizaynlar.',
            'names' => ['Little Prince', 'Hero Comic', 'Maşallah', 'Little Pilot', 'Football Star'],
        ],
        'baby-shower' => [
            'concept' => 'baby',
            'title' => 'Baby Shower Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Baby shower və cins açıqlama (gender reveal) üçün online dəvətnamə şablonları: pastel, ayıcıq, leylək məktubu və beşik. Qonaqlarınız bir linklə qoşulsun.',
            'h1' => 'Baby Shower Dəvətnaməsi',
            'intro' => 'Baby shower və cins açıqlama (gender reveal) üçün online dəvətnamə şablonları: pastel çiçəklər, ayıcıq, leylək məktubu və beşik oyuncağı. Qonaqlar iştirakını bir toxunuşla bildirir.',
            'names' => ['Pastel Bloom', 'Teddy Bear', 'Gender Reveal', 'Stork Letter', 'Baby Mobile'],
        ],
        'korporativ' => [
            'concept' => 'corporate',
            'title' => 'Korporativ Dəvətnamə — Online Şablonlar | DigiToy',
            'desc' => 'Korporativ tədbirlər üçün online dəvətnamə şablonları: qala gecəsi, konfrans, mükafat mərasimi, vizit kart və neon parti. Qonaq siyahısı və İştirak Təsdiqi ilə.',
            'h1' => 'Korporativ Dəvətnamə',
            'intro' => 'Korporativ tədbirlər üçün online dəvətnamə şablonları: qala gecəsi, konfrans, mükafat mərasimi, vizit kart və neon parti. Təşkilatçının adı, proqram və qonaq təsdiqi bir səhifədə.',
            'names' => ['Gala Night', 'Keynote', 'Award Night', 'Business Card', 'Neon Party'],
        ],
        'mezuniyyet' => [
            'concept' => 'graduation',
            'title' => 'Məzuniyyət Dəvətnaməsi — Son Zəng Şablonları | DigiToy',
            'desc' => 'Məzuniyyət və son zəng gecəsi üçün online dəvətnamə şablonları: papaq atma, xatirə albomu, son zəng, lövhə və kağız təyyarə. Sinif yoldaşlarınıza bir linklə göndərin.',
            'h1' => 'Məzuniyyət Dəvətnaməsi',
            'intro' => 'Məzuniyyət və son zəng gecəsi üçün online dəvətnamə şablonları: papaq atma, xatirə albomu, son zəng, məktəb lövhəsi və kağız təyyarə. Sinif yoldaşlarınıza bir linklə göndərin.',
            'names' => ['Caps Toss', 'Yearbook', 'Last Bell', 'Chalkboard', 'Paper Plane'],
        ],
        'acilis' => [
            'concept' => 'opening',
            'title' => 'Açılış Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Mağaza, kafe və qalereya açılışı üçün online dəvətnamə şablonları: lentin kəsilməsi, bistro lövhəsi, qalereya, təqdimat. Ünvan, xəritə və proqram bir linkdə.',
            'h1' => 'Açılış Dəvətnaməsi',
            'intro' => 'Mağaza, kafe, salon və qalereya açılışı üçün online dəvətnamə şablonları: lentin kəsilməsi, bistro lövhəsi, qalxan jalüzi, qutu açılışı və qalereya. Ünvan və xəritə bir linkdə.',
            'names' => ['Ribbon Cut', 'Bistro Sign', 'Roller Shutter', 'Unboxing', 'Gallery Unveil'],
        ],
        'bayram-gecesi' => [
            'concept' => 'holiday',
            'title' => 'Novruz və Yeni İl Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Novruz, Yeni il və bayram gecələri üçün online dəvətnamə şablonları: tonqal, səməni, gecə yarısı saatı, qar kürəsi və maskarad. Ailə və dostlar üçün bir link.',
            'h1' => 'Bayram Gecəsi Dəvətnaməsi',
            'intro' => 'Novruz, Yeni il və bayram gecələri üçün online dəvətnamə şablonları: tonqal, səməni, gecə yarısı saatı, qar kürəsi və maskarad balı. Ailəniz və dostlarınız üçün bir link.',
            'names' => ['Novruz Bonfire', 'Novruz Səməni', 'Midnight Clock', 'Snow Globe', 'Masquerade Ball'],
        ],
        'qiz-gecesi' => [
            'concept' => 'bachelorette',
            'title' => 'Qız Gecəsi Dəvətnaməsi — Online Şablonlar | DigiToy',
            'desc' => 'Qız gecəsi (bachelorette) üçün online dəvətnamə şablonları: çəhrayı şampan, disko kürəsi, pijama və spa, Paris gecəsi və boho gün batımı. Rəfiqələrə bir linklə.',
            'h1' => 'Qız Gecəsi Dəvətnaməsi',
            'intro' => 'Qız gecəsi üçün online dəvətnamə şablonları: çəhrayı şampan, disko kürəsi, pijama və spa, Paris gecəsi və boho gün batımı. Rəfiqələrinizə bir linklə göndərin.',
            'names' => ['Pink Champagne', 'Disco Ball', 'Pajama Spa', 'Paris Night', 'Boho Sunset'],
        ],
    ];
}

/** Phase 47 — hüquqi səhifələr: path → [title, description].
    ⚠ src/data/legal/docs.js ilə HƏRFBƏHƏRF eyni (tests/site_routes_test.mjs). */
function seoLegalPages(): array {
    return [
        '/mexfilik'      => ['Məxfilik Siyasəti | DigiToy', 'DigiToy hansı məlumatları toplayır, nə üçün istifadə edir, kimlərlə paylaşır və nə qədər saxlayır — kukilər və hüquqlarınız daxil.'],
        '/sertler'       => ['İstifadə Şərtləri və Public Oferta | DigiToy', 'DigiToy rəqəmsal dəvətnamə xidmətindən istifadə qaydaları: sifariş, qiymət, linkin müddəti, məzmun və tərəflərin məsuliyyəti.'],
        '/geri-qaytarma' => ['Ödəniş və Geri Qaytarma Qaydaları | DigiToy', 'DigiToy-da ödəniş nə vaxt edilir və hansı hallarda pul qaytarılır — fərdi rəqəmsal xidmət üçün aydın qaydalar.'],
    ];
}

/** İndekslənməyən, amma MÖVCUD SPA marşrutu (404 deyil). ⚠ src/App.jsx ilə uyğun. */
function seoIsAppRoute(string $path): bool {
    return $path === '/preview/live'
        || (bool) preg_match('#^/demo/template/[a-zA-Z0-9\-]{1,60}$#', $path)
        || (bool) preg_match('#^/admin(/[a-zA-Z0-9\-/]*)?$#', $path);
}

/** Phase 51 — ana səhifənin FAQ-ı: [sual, cavab]. Səhifədə görünən AZ FAQ ilə
    HƏRFBƏHƏRF eyni: src/data/faq.js getFaqItems('az') (tests/seo_keywords_test.mjs). */
function seoHomeFaq(): array {
    return [
        ['Online dəvətnamə nədir?',
         'Online dəvətnamə (elektron və ya rəqəmsal dəvətnamə də deyilir) kağız kartın yerinə linklə göndərilən dəvətnamə səhifəsidir. Qonaqlar onu WhatsApp və ya Telegram-dan telefonda açır: tarix, məkan və xəritə, geri sayım, musiqi bir yerdədir, iştirakını da elə oradan təsdiqləyir. Çap və çatdırılma lazım deyil, məlumatları istənilən vaxt yeniləmək olar.'],
        ['Hansı tədbirlər üçün dəvətnamə hazırlamaq olar?',
         'Toy, nişan, xına gecəsi, ad günü, ildönümü, uşaq ad günü, sünnət toyu, baby shower, korporativ tədbir, məzuniyyət, açılış, bayram gecəsi və qız gecəsi üçün — hər tədbirin öz şablonları var. Başqa tədbir üçün adını özünüz yazırsınız. Dəvətnamə Azərbaycan, ingilis və rus dillərində açılır.'],
        ['Rəqəmsal dəvətnamə necə sifariş edilir?',
         'Səhifədəki "İndi Başla" düyməsinə basaraq istəyinizə və zövqünüzə tam uyğun paketi seçib, dəvətnamənizi dərhal özünüz düzəltməyə başlaya bilərsiniz.'],
        ['Dəvətnamənin istifadə müddəti nə qədərdir?',
         'Sifariş etdiyiniz dəvətnamə tədbir gününüz bitənə qədər tam aktiv və onlayn qalır.'],
        ['Qonaqlar dəvətnaməni necə açır?',
         'Sizə WhatsApp vasitəsilə göndərilən unikal link vasitəsilə qonaqlar birbaşa brauzerdən açır — heç bir tətbiq lazım deyil.'],
        ['Hazırlıq müddəti nə qədərdir?',
         'Sifarişi WhatsApp vasitəsilə yerləşdirdikdən sonra dəvətnaməniz ümumiyyətlə 24 saat ərzində hazır olur. VİP və Premium paketlər üçün xüsusi dizayn elementləri varsa, bu müddət 48 saata çata bilər.'],
        ['Eyni link neçə nəfər tərəfindən açıla bilər?',
         'Limitsiz. Eyni link istənilən sayda qonağa göndərilə bilər. Hər qonaq öz adını dəvətnamədə ayrıca görür.'],
        ['İştirak Təsdiqi sistemi necə işləyir?',
         'Qonaqlar "Gələcəm", "Gəlmiyəcəm" və ya "Bəlkə" seçimindən birini edə bilər. Əlavə nəfər sayını da bildirə bilərlər. Siz admin paneldən bütün cavabları real vaxtda izləyə bilərsiniz.'],
        ['Dəvətnamənin məlumatlarını sonra dəyişmək olarmı?',
         'Bəli. Sifariş etdikdən sonra da admin linkiniz vasitəsilə tarix, yer, geyim kodu, musiqi seçimi və digər məlumatları istənilən vaxt yeniləyə bilərsiniz. Dəvətnamə avtomatik yenilənir.'],
        ['Neçə dil dəstəklənir?',
         'Dəvətnamə Azərbaycan, İngilis və Rus dillərini tam dəstəkləyir. Qonaqlar səhifə yükləndiyi anda öz dilini seçə bilər. Mətn, tarix formatı və bütün interfeys tam lokalizasiya olunub.'],
        ['Ödəniş necə edilir?',
         'Sifariş tamamlanıb "WhatsApp ilə sifariş et" düyməsi vasitəsilə bizə göndərildikdən sonra məlumatlar yoxlanılır. Son variant sizinlə təsdiqləndikdən sonra ödəniş edilir. Ödənişi bank kartı və ya elektron ödəniş vasitəsilə həyata keçirmək mümkündür.'],
        ['Dəvətnamə neçə müddət aktiv qalır?',
         'Dəvətnaməniz toy/nişan gününüz bitənə qədər tam aktiv qalır. Tədbirinizdən sonra saytdan silinmir — yaddaş olaraq qalır. Əlavə müddətə ehtiyac duyulsada, biz onu saxlayırıq.'],
    ];
}

/** Phase 51 — JS-siz oxuyan botlar üçün səhifənin görünən mətni (<noscript>).
    Yalnız indekslənən marketinq səhifələri; qalan marşrutlar üçün ''.
    Mətnlər səhifədəkilərlə eynidir: hero — src/data/landingCopy.js,
    şablonlar — TemplatesPage.jsx UI.az (tests/seo_keywords_test.mjs). */
/** Şablon adı → img/templates/<id>.webp (məs. «Mirror & Candle» → mirror-candle, «Kəlağayı» → kelagayi) */
function seoTemplateSlug(string $name): string {
    /* adı id-dən fərqli yazılan şablonlar (2026-11 toy seriyaları) */
    $own = ['Şam və Üzük' => 'candle-rings', 'Gəlin' => 'bridal-veil', 'İlk Rəqs' => 'first-dance', 'Bakı Gecəsi' => 'baku-night', 'Şahdağ' => 'shahdag'];
    if (isset($own[$name])) return $own[$name];
    $t = strtr(mb_strtolower($name, 'UTF-8'), ['ə' => 'e', 'ğ' => 'g', 'ı' => 'i', 'ç' => 'c', 'ş' => 's', 'ö' => 'o', 'ü' => 'u', 'i̇' => 'i']);
    return trim(preg_replace('/[^a-z0-9]+/', '-', $t), '-');
}

function seoNoscript(string $path, callable $e, ?array $guide = null): string {
    $nav = '<p><a href="/">Ana səhifə</a> · <a href="/templates">Dəvətnamə şablonları</a> · '
         . '<a href="/demo">Nümunə dəvətnamə</a> · <a href="https://wa.me/994992133696">WhatsApp: +994 99 213 36 96</a> · '
         . '<a href="/mexfilik">Məxfilik</a> · <a href="/sertler">Şərtlər</a></p>';
    $links = [];
    foreach (seoGuideLinks() as $slug => $label) $links[] = '<a href="/' . $e($slug) . '">' . $e($label) . '</a>';
    if ($links) $nav .= '<p>Bələdçilər: ' . implode(' · ', $links) . '</p>';

    if ($guide) {
        /* Phase 52 — bələdçinin bütün mətni (GuidePage ilə eyni JSON) */
        $body = '<h1>' . $e($guide['h1']) . '</h1>' . seoBlocks($guide['intro'] ?? [], $e);
        foreach ($guide['sections'] as $s) {
            $body .= '<h2>' . $e($s['title'] ?? '') . '</h2>' . seoBlocks($s['body'] ?? [], $e);
            foreach ($s['samples'] ?? [] as $t) $body .= '<blockquote><p>' . nl2br($e($t), false) . '</p></blockquote>';
        }
        if (!empty($guide['faq'])) {
            $body .= '<h2>Tez-tez verilən suallar</h2>';
            foreach ($guide['faq'] as $f) $body .= '<h3>' . $e($f['q'] ?? '') . '</h3><p>' . $e($f['a'] ?? '') . '</p>';
        }
        if (!empty($guide['cta']['title'])) {
            $body .= '<h2>' . $e($guide['cta']['title']) . '</h2><p>' . $e($guide['cta']['text'] ?? '')
                   . ' <a href="/">Dəvətnaməni hazırla</a></p>';
        }
    } elseif ($path === '/') {
        $faq = '';
        foreach (seoHomeFaq() as [$q, $a]) $faq .= '<h3>' . $e($q) . '</h3><p>' . $e($a) . '</p>';
        $body = '<h1>Rəqəmsal Toy Dəvətnamənizi Özünüz Yaradın</h1>'
              . '<p>Sadəcə online dəvətnamə deyil — İştirak Təsdiqi, oturma planı, foto paylaşımı və xatirələrin toplandığı tam bir toy təcrübəsi. Hamısı bir zərif linkdə.</p>'
              . '<h2>Paketinizi Seçin</h2><ul><li>SADƏ — 59 ₼</li><li>VİP — 89 ₼</li><li>PREMIUM — 129 ₼</li></ul>'
              . '<h2>Tez-tez verilən suallar</h2>' . $faq;
    } elseif (str_starts_with($path, '/sablonlar/') && ($cp = seoConceptPages()[substr($path, 11)] ?? null)) {
        /* 2026-11 SEO: şablonun real ekran şəkli + alt mətn (Google Şəkillər, JS-siz botlar) */
        $items = '';
        foreach ($cp['names'] as $n) {
            $id  = seoTemplateSlug($n);
            $img = is_file(__DIR__ . '/img/templates/' . $id . '.webp')
                ? '<img src="/img/templates/' . $e($id) . '.webp" alt="' . $e($n . ' — ' . $cp['h1'] . ' şablonu') . '" width="390" height="844" loading="lazy"> '
                : '';
            $items .= '<li>' . $img . $e($n) . '</li>';
        }
        $others = [];
        foreach (seoConceptPages() as $slug => $p) $others[] = '<a href="/sablonlar/' . $e($slug) . '">' . $e($p['h1']) . '</a>';
        $body = '<h1>' . $e($cp['h1']) . '</h1><p>' . $e($cp['intro']) . '</p>'
              . '<h2>Şablonlar</h2><ul>' . $items . '</ul>'
              . '<p>Digər tədbirlər: ' . implode(' · ', $others) . '</p>';
    } elseif ($path === '/templates') {
        $others = [];
        foreach (seoConceptPages() as $slug => $p) $others[] = '<li><a href="/sablonlar/' . $e($slug) . '">' . $e($p['h1']) . '</a></li>';
        $body = '<h1>Dəvətnamə Şablonları</h1>'
              . '<p>Toy, nişan, xına gecəsi, ad günü, ildönümü, uşaq tədbirləri, korporativ və digər tədbirlər üçün online dəvətnamə şablonları. Əvvəlcə tədbirinizi seçin: hər tədbirin öz dizaynları var — rəng, şrift, animasiya və açılış ekranı fərqlidir.</p>'
              . '<h2>Tədbirə görə şablonlar</h2><ul>' . implode('', $others) . '</ul>';
    } elseif ($path === '/demo') {
        $body = '<h1>Online Dəvətnamə Nümunəsi</h1>'
              . '<p>Online dəvətnamə necə görünür? DigiToy rəqəmsal toy dəvətnaməsinin canlı nümunəsi: İştirak Təsdiqi, oturma planı, QR foto paylaşımı və premium dizayn bir arada.</p>';
    } else {
        return '';
    }
    return '<noscript><main style="max-width:760px;margin:40px auto;padding:0 16px;line-height:1.6">'
         . $body . '<p>Saytın bütün imkanları üçün brauzerinizdə JavaScript-i aktiv edin.</p>' . $nav
         . '</main></noscript>';
}

/** Phase 52 — mətn blokları: sətir → <p>, {list} → <ul>, {steps} → <ol> (GuidePage Body ilə eyni). */
function seoBlocks(array $blocks, callable $e): string {
    $html = '';
    foreach ($blocks as $b) {
        if (is_string($b)) { $html .= '<p>' . $e($b) . '</p>'; continue; }
        foreach (['list' => 'ul', 'steps' => 'ol'] as $key => $tag) {
            if (is_array($b[$key] ?? null)) {
                $html .= "<$tag>" . implode('', array_map(fn($i) => '<li>' . $e($i) . '</li>', $b[$key])) . "</$tag>";
            }
        }
    }
    return $html;
}

/** Phase 52 — bələdçi səhifəsi: public/guides/<slug>.json. Tapılmasa və ya forma
    pozuqdursa null (→ adi 404 yolu). Slug yalnız [a-z0-9-] — fayl yolundan çıxmaq olmur. */
function seoGuide(string $path): ?array {
    if (!preg_match('#^/([a-z0-9]+(?:-[a-z0-9]+)*)$#', $path, $m)) return null;
    $file = __DIR__ . '/guides/' . $m[1] . '.json';
    if (!is_file($file)) return null;
    $g = json_decode((string) file_get_contents($file), true);
    if (!is_array($g) || ($g['slug'] ?? '') !== $m[1] || empty($g['title']) || empty($g['description'])
        || empty($g['h1']) || !is_array($g['sections'] ?? null)) return null;
    return $g;
}

/** Phase 52 — <noscript> naviqasiyası üçün bütün bələdçilər: slug → label */
function seoGuideLinks(): array {
    $out = [];
    foreach (glob(__DIR__ . '/guides/*.json') ?: [] as $file) {
        $g = json_decode((string) file_get_contents($file), true);
        if (is_array($g) && !empty($g['slug']) && !empty($g['label'])) $out[$g['slug']] = $g['label'];
    }
    return $out;
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

/** Önbaxış mətni — tədbir növünə görə (Phase 45.2). Əvvəl korporativ/digər/
    ad günü dəvətnaməsi də «Toy Dəvətnaməsi» yazırdı; toy mətni dəyişməyib.
    ⚠ Brauzer tərəfi eyni mətnləri src/utils/inviteSeo.js-də qurur.
    @param ?array $d  seoLookupInvite() nəticəsi; null → köhnə ümumi mətn */
function seoInviteMeta(?array $d): array {
    $tail = 'Rəqəmsal dəvətnaməyə baxın, İştirak Təsdiqi göndərin.';
    if ($d === null) return ['Toy Dəvətnaməsi | DigiToy', "Sizi toy mərasiminə dəvət edirik. $tail"];

    $kinds = [
        'toy'      => ['Toy Dəvətnaməsi',     'toy mərasiminə'],
        'nishan'   => ['Nişan Dəvətnaməsi',   'nişan mərasiminə'],
        'birthday' => ['Ad Günü Dəvətnaməsi', 'ad gününə'],
        /* 2026-10 — konsept tədbir növləri (src/utils/inviteSeo.js ilə eyni) */
        'xina'         => ['Xına Gecəsi Dəvətnaməsi', 'xına gecəsinə'],
        'sunnet'       => ['Sünnət Toyu Dəvətnaməsi', 'sünnət toyuna'],
        'baby'         => ['Baby Shower Dəvətnaməsi', 'baby shower bayramına'],
        'anniversary'  => ['İldönümü Dəvətnaməsi',    'ildönümü məclisinə'],
        'graduation'   => ['Məzuniyyət Dəvətnaməsi',  'məzuniyyət gecəsinə'],
        'bachelorette' => ['Qız Gecəsi Dəvətnaməsi',  'qız gecəsinə'],
    ];
    $kind = $kinds[($d['type'] ?? '') !== '' ? $d['type'] : 'toy'] ?? null;
    if ($kind !== null) {
        /* Göstərim sırası BƏY → GƏLİN; ad günündə yalnız bride dolur */
        $names = implode(' & ', array_filter([$d['groom'] ?? '', $d['bride'] ?? ''], fn($v) => $v !== ''));
        if ($names === '') return [$kind[0] . ' | DigiToy', "Sizi {$kind[1]} dəvət edirik. $tail"];
        return ["$names — {$kind[0]} | DigiToy", "$names sizi {$kind[1]} dəvət edir. $tail"];
    }
    $event = $d['event'] ?? '';
    if ($event === '') return ['Dəvətnamə | DigiToy', "Sizi dəvət edirik. $tail"];
    return ["$event — Dəvətnamə | DigiToy", "Sizi «{$event}» tədbirinə dəvət edirik. $tail"];
}

/** Dəvətnamənin önbaxış üçün məlumatı (növ + adlar). Alınmasa null.
    Nəticə qısa müddət keşlənir — eyni link təkrar paylaşılanda DB-yə
    yenidən getmirik. Keş həm TAPILAN, həm də TAPILMAYAN nəticəni saxlayır.
    ⚠ Keş faylının adı Phase 45.2-də dəyişib (köhnə .txt yalnız adı saxlayırdı). */
function seoLookupInvite(string $slug): ?array {
    $cacheFile = sys_get_temp_dir() . '/digitoy_seo2_' . hash('sha256', $slug) . '.json';
    if (is_file($cacheFile) && (time() - (int) @filemtime($cacheFile)) < 3600) {
        $c = json_decode((string) @file_get_contents($cacheFile), true);
        return is_array($c) && $c ? $c : null;
    }

    $result = seoQueryInvite($slug);
    @file_put_contents($cacheFile, json_encode($result ?? [], JSON_UNESCAPED_UNICODE), LOCK_EX);
    return $result;
}

function seoQueryInvite(string $slug): ?array {
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
        /* ⚠ 2026-09-28: deaktiv dəvətnamənin adları önbaxışda da GİZLİ
           qalmalıdır (get_invitation.php data-nı onsuz da vermir). */
        try {
            $st = $pdo->prepare('SELECT form_data, is_active FROM invitations WHERE slug = :s LIMIT 1');
            $st->execute([':s' => $slug]);
            $r = $st->fetch(PDO::FETCH_ASSOC);
            if (!$r || (int) ($r['is_active'] ?? 1) !== 1) return null;
            $row = $r['form_data'];
        } catch (PDOException $e) {
            /* is_active sütunu yoxdursa (köhnə sxem) — əvvəlki sorğu */
            $st = $pdo->prepare('SELECT form_data FROM invitations WHERE slug = :s LIMIT 1');
            $st->execute([':s' => $slug]);
            $row = $st->fetchColumn();
        }
        if (!$row) return null;

        $d = json_decode((string) $row, true);
        if (!is_array($d)) return null;

        return [
            'type'  => trim((string) ($d['eventType'] ?? '')),
            'groom' => trim((string) ($d['groomName'] ?? '')),
            'bride' => trim((string) ($d['brideName'] ?? '')),
            'event' => trim((string) ($d['eventName'] ?? '')),
        ];
    } catch (Throwable $e) {
        return null;   /* DB sönsə belə səhifə açılır */
    }
}

/* ── Meta blokunu qur ── */
$e = fn($v) => htmlspecialchars((string) $v, ENT_QUOTES | ENT_HTML5, 'UTF-8');

$robots = ($meta['index'] ? 'index, ' : 'noindex, ') . (empty($meta['nofollow']) ? 'follow' : 'nofollow');
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
        'name'     => 'Online Dəvətnamə',
        'alternateName' => ['Onlayn dəvətnamə', 'Elektron dəvətnamə', 'Rəqəmsal dəvətnamə',
                            'Toy dəvətnaməsi', 'Digital wedding invitation'],
        'serviceType'   => 'Online dəvətnamə hazırlanması',
        'description'   => 'Toy, nişan, ad günü və digər tədbirlər üçün online (elektron) dəvətnamə: '
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

    /* FAQPage — yalnız ana səhifədə. Phase 51: suallar səhifədə GÖRÜNƏN
       FAQ ilə eynidir (Google schema-nın görünən məzmuna uyğun olmasını
       tələb edir; əvvəlki 5 sual səhifədə yox idi). */
    $jsonld[] = [
        '@context'   => 'https://schema.org',
        '@type'      => 'FAQPage',
        'mainEntity' => array_map(fn($f) => [
            '@type' => 'Question',
            'name'  => $f[0],
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f[1]],
        ], seoHomeFaq()),
    ];

} elseif ($path === '/templates' || $path === '/demo' || $legal) {
    $label = $path === '/templates' ? 'Dəvətnamə Şablonları'
           : ($path === '/demo' ? 'Nümunə Dəvətnamə' : explode(' | ', $legal[0])[0]);
    $jsonld[] = [
        '@context'        => 'https://schema.org',
        '@type'           => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Ana səhifə', 'item' => SITE . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $label,       'item' => SITE . $path],
        ],
    ];
} elseif ($conceptPage) {
    $jsonld[] = [
        '@context'        => 'https://schema.org',
        '@type'           => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Ana səhifə', 'item' => SITE . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Dəvətnamə Şablonları', 'item' => SITE . '/templates'],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $conceptPage['h1'], 'item' => SITE . $path],
        ],
    ];
    $jsonld[] = [
        '@context'        => 'https://schema.org',
        '@type'           => 'CollectionPage',
        'name'            => $conceptPage['h1'],
        'description'     => $conceptPage['desc'],
        'url'             => SITE . $path,
        'inLanguage'      => 'az',
        'mainEntity'      => [
            '@type'           => 'ItemList',
            'numberOfItems'   => count($conceptPage['names']),
            'itemListElement' => array_map(fn($n, $i) => ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $n],
                $conceptPage['names'], array_keys($conceptPage['names'])),
        ],
    ];
} elseif ($guide) {
    $jsonld[] = [
        '@context'         => 'https://schema.org',
        '@type'            => 'Article',
        'headline'         => $guide['h1'],
        'description'      => $guide['description'],
        'inLanguage'       => 'az',
        'datePublished'    => $guide['updated'] ?? '',
        'dateModified'     => $guide['updated'] ?? '',
        'mainEntityOfPage' => SITE . $path,
        'image'            => SITE . '/og-image.jpg',
        'author'           => ['@type' => 'Organization', 'name' => 'DigiToy', 'url' => SITE],
        'publisher'        => ['@type' => 'Organization', 'name' => 'DigiToy',
                               'logo' => ['@type' => 'ImageObject', 'url' => SITE . '/android-chrome-512x512.png']],
    ];
    $jsonld[] = [
        '@context'        => 'https://schema.org',
        '@type'           => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Ana səhifə', 'item' => SITE . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $guide['label'] ?? $guide['h1'], 'item' => SITE . $path],
        ],
    ];
    if (!empty($guide['faq']) && is_array($guide['faq'])) {
        $jsonld[] = [
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array_map(fn($f) => [
                '@type' => 'Question',
                'name'  => (string) ($f['q'] ?? ''),
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => (string) ($f['a'] ?? '')],
            ], $guide['faq']),
        ];
    }
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

/* Phase 51 — JS icra etməyən botlar (Yandex-in ilk keçidi, ChatGPT/Perplexity
   kimi AI axtarışları) xam HTML-də cəmi ~11 söz görürdü. <noscript> həmin
   səhifənin GÖRÜNƏN mətnini verir; JS işləyən brauzerdə və Googlebot-un
   render etdiyi səhifədə heç nə dəyişmir. Tapılmasa — sadəcə əlavə olunmur. */
$noscript = seoNoscript($path, $e, $guide);
/* Phase 52: bələdçinin JSON-u səhifənin içində — GuidePage ilk açılışda
   əlavə sorğu etmir. JSON_HEX_TAG: mətndəki «</script>» bloku qıra bilməz. */
if ($guide) {
    $data = json_encode($guide, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
    if ($data !== false) $noscript .= "\n    <script id=\"dt-guide-data\" type=\"application/json\">" . $data . '</script>';
}
if ($noscript !== '') {
    $out = str_replace('<div id="root"></div>', '<div id="root"></div>' . "\n    " . $noscript, $out);
}

if ($seoStatus !== 200) http_response_code($seoStatus);
header('Content-Type: text/html; charset=UTF-8');
/* SPA qabığı qısa müddət keşlənə bilər; meta marşrutdan asılıdır */
header('Cache-Control: public, max-age=300');
echo $out;
