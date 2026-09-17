<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — /api/venue_map.php
   Məkan xəritəsinin ŞƏKLİ: üçüncü tərəfdən BİR DƏFƏ çəkilir, sonra həmişəlik
   digitoy.az-da saxlanılır.

   ── NƏ ÜÇÜN BELƏ? (Phase 41 — memarlıq qərarı) ──────────────────────────
   Bizdə ARDICIL olaraq eyni sinif problem yaşandı:

     1) Şablonlar brauzerdən birbaşa `tile.openstreetmap.org`-a müraciət edirdi
        → OSM usage policy pozuldu → «Access blocked» şəkli çıxdı.
     2) Əvəzinə Google Maps Embed iframe-i quruldu → açar/billing/referrer/
        kvotadan BİRİ pozulsa BÜTÜN canlı dəvətnamələrdə qara xəta paneli
        çıxır. Üstəlik o panel cross-origin iframe-in içindədir: JS onu
        OXUYA BİLMİR, yəni «alınmadı, ehtiyat variantı göstər» məntiqini
        avtomatik qurmaq MÜMKÜN DEYİL.

   Hər iki halın KÖK SƏBƏBİ eynidir: xəritə HƏR BAXIŞDA kənar xidmətdən
   çəkilirdi. Ona görə provayderi dəyişmək problemi həll etmir — çəkilmə
   ANI dəyişməlidir.

   ── YENİ MODEL ──────────────────────────────────────────────────────────
   Kənar xidmət HƏR MƏKAN ÜÇÜN BİR DƏFƏ, SERVER TƏRƏFDƏN çağırılır; nəticə
   `uploads/_maps/` içində saxlanılır və bundan sonra şəkil öz domenimizdən
   verilir.

   Bunun qazandırdıqları:
     • Provayder sonradan sınsa belə, artıq keşlənmiş məkanlar İŞLƏMƏYƏ
       DAVAM EDİR — canlı dəvətnamələr pozulmur.
     • Uğursuzluq AŞKARLANA BİLƏNDİR: bu endpoint eyni origin-dədir və
       xəta halında 404 qaytarır → brauzerdə `<img onerror>` işə düşür və
       şablon dekorativ karta keçir. Qonaq HEÇ VAXT xəta paneli görmür.
     • Trafik: baxış sayından ASILI DEYİL. Yüz qonaq eyni dəvətnaməyə
       baxsa da provayderə cəmi bir sorğu gedir.
     • Provayderi dəyişmək = aşağıdakı bir sabiti dəyişmək.

   ── TƏHLÜKƏSİZLİK ───────────────────────────────────────────────────────
   Çıxış URL-i SABİT şablondur və ora YALNIZ yoxlanılmış RƏQƏMLƏR yazılır
   (en/uzunluq diapazonu, ağ siyahıdakı ölçü/zoom). İstifadəçi mətni heç
   vaxt çıxış URL-inə düşmür → SSRF mümkün deyil.
   ══════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';

/* ── PROVAYDER ─────────────────────────────────────────────────────────────
   'osm'    — açar TƏLƏB ETMİR. Server tərəfdən bir neçə tile çəkilir və GD
              ilə birləşdirilir. Sorğu sayı çox az olduğuna və nəticə
              həmişəlik keşləndiyinə görə OSM siyasətinə uyğundur (siyasət
              brauzerdən kütləvi tile çəkilməsini qadağan edir, serverdən
              keşlənən az sayda sorğunu yox). Düzgün User-Agent göndərilir.
   'google' — Google Static Maps API. Açar lazımdır və o açar SERVER üçün
              olmalıdır (IP məhdudiyyəti ilə) — HTTP-referrer məhdudiyyətli
              brauzer açarı server sorğusunu rədd edir.

   ⚠ Dəyişdirmək üçün YALNIZ bu sabit (və lazım olsa açar) redaktə olunur;
   nə React, nə şablonlar toxunulur. */
const MAP_PROVIDER    = 'osm';
const MAP_GOOGLE_KEY  = '';   /* yalnız MAP_PROVIDER='google' olanda lazımdır */

/* OSM siyasəti düzgün, əlaqə saxlanıla bilən User-Agent tələb edir. */
const MAP_UA = 'DigitoyVenueMap/1.0 (+https://digitoy.az; server-side, cached once per venue)';

const TILE   = 256;
const MAP_DIR = __DIR__ . '/../uploads/_maps/';

/* Ağ siyahılar — istifadəçi ixtiyari ölçü/zoom istəyə bilməz (keş şişməsin,
   provayderə lazımsız sorğu getməsin). */
const ALLOWED_SIZES = ['640x320', '640x400', '800x400'];
const ALLOWED_ZOOMS = [14, 15, 16, 17];

/* ── Giriş yoxlaması ───────────────────────────────────────────────────── */

function fail(int $code): never {
    http_response_code($code);
    header('Cache-Control: no-store');
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') fail(405);

$ll = (string)($_GET['ll'] ?? '');
if (!preg_match('/^(-?\d{1,2}(?:\.\d{1,7})?),(-?\d{1,3}(?:\.\d{1,7})?)$/', $ll, $m)) fail(400);

$lat = (float)$m[1];
$lon = (float)$m[2];
/* Web Mercator ±85.05° -dən kənarda tanımsızdır */
if (abs($lat) > 85 || abs($lon) > 180) fail(400);

$size = (string)($_GET['size'] ?? '640x320');
if (!in_array($size, ALLOWED_SIZES, true)) fail(400);
[$W, $H] = array_map('intval', explode('x', $size));

$zoom = (int)($_GET['z'] ?? 16);
if (!in_array($zoom, ALLOWED_ZOOMS, true)) fail(400);

/* ── Keş ───────────────────────────────────────────────────────────────── */

/* Koordinat 5 onluğa yuvarlaqlaşır (~1 m): eyni məkanın cüzi fərqli
   linklərindən eyni keş faylı çıxsın, keş parçalanmasın. */
$cacheKey  = sha1(sprintf('%s|%.5F|%.5F|%d|%s', MAP_PROVIDER, $lat, $lon, $zoom, $size));
$cacheFile = MAP_DIR . $cacheKey . '.png';

function serveFile(string $path): never {
    $etag = '"' . substr(sha1_file($path), 0, 20) . '"';
    header('Content-Type: image/png');
    header('Content-Length: ' . filesize($path));
    /* Məzmun açara görə dəyişməzdir → uzun keş + immutable */
    header('Cache-Control: public, max-age=31536000, immutable');
    header('ETag: ' . $etag);
    header('X-Content-Type-Options: nosniff');

    if (trim((string)($_SERVER['HTTP_IF_NONE_MATCH'] ?? '')) === $etag) {
        http_response_code(304);
        exit;
    }
    readfile($path);
    exit;
}

if (is_file($cacheFile) && filesize($cacheFile) > 0) serveFile($cacheFile);

/* ── Buradan aşağısı YALNIZ keşdə olmayan məkan üçün işləyir ───────────── */

/* Keşdə olmayan hər sorğu provayderə çıxış deməkdir — bot ixtiyari
   koordinatlarla keşi doldura bilməsin. Baxış trafikinə təsiri yoxdur:
   normal qonaq keşlənmiş fayla düşür və bu sətrə çatmır. */
if (!rateGate('venue_map:' . clientIp(), 12, 600)) fail(429);

if (!is_dir(MAP_DIR) && !mkdir(MAP_DIR, 0755, true) && !is_dir(MAP_DIR)) fail(404);
if (!function_exists('imagecreatetruecolor')) fail(404);   /* GD yoxdursa səssiz düş */

/**
 * Bir neçə URL-i PARALEL çək (curl_multi). Qayıdış: [url => gövdə] — yalnız
 * uğurlu olanlar.
 *
 * ⚠ NƏ ÜÇÜN: ardıcıl çəkilişdə 12 tile ~7.3 saniyə çəkirdi (ölçüldü).
 * Bu YALNIZ ilk baxışda baş verir (sonra keşdir), amma o ilk qonaq da
 * gözləməməlidir. Paralel çəkilişdə eyni iş ~1 saniyəyədir.
 * curl yoxdursa avtomatik olaraq ardıcıl yola düşür.
 */
function fetchManyBinary(array $urls, int $timeout = 8): array {
    if (!function_exists('curl_multi_init')) {
        $out = [];
        foreach ($urls as $u) {
            $b = fetchBinary($u, $timeout);
            if ($b !== null) $out[$u] = $b;
        }
        return $out;
    }

    $mh = curl_multi_init();
    $handles = [];
    foreach ($urls as $u) {
        $ch = curl_init($u);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_USERAGENT      => MAP_UA,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        curl_multi_add_handle($mh, $ch);
        $handles[$u] = $ch;
    }

    do {
        $status = curl_multi_exec($mh, $running);
        if ($running) curl_multi_select($mh, 1.0);
    } while ($running && $status === CURLM_OK);

    $out = [];
    foreach ($handles as $u => $ch) {
        $body = curl_multi_getcontent($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($body !== false && $code === 200 && strlen($body) > 0) $out[$u] = $body;
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);
    }
    curl_multi_close($mh);
    return $out;
}

/** Sabit şablonlu URL-dən şəkil çək (curl, yoxdursa stream). Uğursuzda null. */
function fetchBinary(string $url, int $timeout = 6): ?string {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_USERAGENT      => MAP_UA,
            CURLOPT_FOLLOWLOCATION => false,   /* yönləndirmə izləmirik */
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $body = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ($body !== false && $code === 200 && strlen($body) > 0) ? $body : null;
    }

    /* Ehtiyat yol — bəzi hostinqlərdə curl bağlıdır */
    if (!ini_get('allow_url_fopen')) return null;
    $ctx = stream_context_create(['http' => [
        'timeout'       => $timeout,
        'header'        => 'User-Agent: ' . MAP_UA . "\r\n",
        'follow_location' => 0,
    ]]);
    $body = @file_get_contents($url, false, $ctx);
    return ($body !== false && strlen($body) > 0) ? $body : null;
}

/** lat/lon → kəsr tile koordinatları (slippy-map / Web Mercator) */
function tileXY(float $lat, float $lon, int $z): array {
    $n   = 2 ** $z;
    $x   = (($lon + 180) / 360) * $n;
    $rad = deg2rad($lat);
    $y   = ((1 - log(tan($rad) + 1 / cos($rad)) / M_PI) / 2) * $n;
    return [$x, $y];
}

/**
 * OSM: mərkəzi əhatə edən tile-ları çəkib GD ilə birləşdir.
 * ⚠ Tile sayı QƏSDƏN məhduddur (ən çox 20): səhv parametrlə serverin
 * onlarla sorğu göndərməsinin qarşısını alır.
 */
function buildFromOsm(float $lat, float $lon, int $z, int $W, int $H): ?\GdImage {
    [$xf, $yf] = tileXY($lat, $lon, $z);

    /* Şəklin sol-üst küncünün dünya piksel koordinatı */
    $left = $xf * TILE - $W / 2;
    $top  = $yf * TILE - $H / 2;

    $x0 = (int)floor($left / TILE);
    $y0 = (int)floor($top / TILE);
    $x1 = (int)floor(($left + $W) / TILE);
    $y1 = (int)floor(($top + $H) / TILE);

    $count = ($x1 - $x0 + 1) * ($y1 - $y0 + 1);
    if ($count <= 0 || $count > 20) return null;

    $canvas = imagecreatetruecolor($W, $H);
    imagefill($canvas, 0, 0, imagecolorallocate($canvas, 233, 231, 226));

    $maxTile = 2 ** $z;

    /* Əvvəlcə lazım olan bütün tile URL-lərini topla, sonra HAMISINI birdən
       çək — ardıcıl çəkilişdə 12 tile ~7 saniyə aparırdı. */
    $want = [];   /* url => [dstX, dstY] */
    for ($tx = $x0; $tx <= $x1; $tx++) {
        for ($ty = $y0; $ty <= $y1; $ty++) {
            /* Şaquli olaraq xəritədən kənar — belə tile yoxdur */
            if ($ty < 0 || $ty >= $maxTile) continue;
            /* Üfüqi olaraq dünya təkrarlanır */
            $wx  = (($tx % $maxTile) + $maxTile) % $maxTile;
            $url = sprintf('https://tile.openstreetmap.org/%d/%d/%d.png', $z, $wx, $ty);
            /* ⚠ Eyni URL iki dəfə lazım ola bilər (dünya təkrarlanan yerdə);
               belə halda ikinci nüsxə üçün ayrıca açar saxlanılmır — bu,
               yalnız çox kiçik zoom-da olur, bizim ağ siyahıda (14-17) yox. */
            $want[$url] = [(int)round($tx * TILE - $left), (int)round($ty * TILE - $top)];
        }
    }

    $blobs   = fetchManyBinary(array_keys($want));
    $okTiles = 0;

    foreach ($want as $url => [$dx, $dy]) {
        if (!isset($blobs[$url])) continue;
        $img = @imagecreatefromstring($blobs[$url]);
        if (!$img) continue;
        imagecopy($canvas, $img, $dx, $dy, 0, 0, TILE, TILE);
        imagedestroy($img);
        $okTiles++;
    }

    /* Heç nə gəlmədisə boş boz kart saxlamağın mənası yoxdur — 404 daha
       yaxşıdır, çünki şablon öz dekorativ kartını göstərəcək. */
    if ($okTiles === 0) { imagedestroy($canvas); return null; }
    return $canvas;
}

/** Google Static Maps — tək sorğu, server açarı ilə */
function buildFromGoogle(float $lat, float $lon, int $z, int $W, int $H): ?\GdImage {
    if (MAP_GOOGLE_KEY === '') return null;
    $url = sprintf(
        'https://maps.googleapis.com/maps/api/staticmap?center=%.5F,%.5F&zoom=%d&size=%dx%d&scale=2&maptype=roadmap&key=%s',
        $lat, $lon, $z, $W, $H, rawurlencode(MAP_GOOGLE_KEY)
    );
    $blob = fetchBinary($url, 8);
    if ($blob === null) return null;
    $img = @imagecreatefromstring($blob);
    return $img ?: null;
}

$canvas = match (MAP_PROVIDER) {
    'google' => buildFromGoogle($lat, $lon, $zoom, $W, $H),
    default  => buildFromOsm($lat, $lon, $zoom, $W, $H),
};

if ($canvas === null) fail(404);

/* ⚠ RƏNG EMALI BURADA EDİLMİR. Keşdə NEYTRAL şəkil saxlanılır və hər şablon
   onu öz rənginə CSS ilə boyayır (filter + tint). Beləliklə 16 şablon EYNİ
   keş faylını paylaşır — məkan başına bir fayl, şablon başına yox. */

/* Əvvəlcə müvəqqəti fayla yaz, sonra yerinə keçir: eyni anda iki sorğu
   gəlsə yarımçıq fayl oxunmasın. */
/* ⚠ SIXILMA: xəritə tile-larında rəng sayı azdır, ona görə 256 rəngli
   palitra + maksimum PNG sıxılması ölçünü yarıdan çox azaldır.
   Ölçüldü (640x320, Bakı mərkəzi): 178 KB → 77 KB.
   JPEG daha kiçik olardı (54 KB), amma xəritənin küçə adlarını və nazik
   xətlərini bulandırır — burada PNG düzgün seçimdir. */
imagetruecolortopalette($canvas, true, 256);

$tmp = $cacheFile . '.' . getmypid() . '.tmp';
$saved = imagepng($canvas, $tmp, 9);
imagedestroy($canvas);

if (!$saved || !is_file($tmp)) { @unlink($tmp); fail(404); }
if (!@rename($tmp, $cacheFile)) { @unlink($tmp); fail(404); }
@chmod($cacheFile, 0644);

serveFile($cacheFile);
