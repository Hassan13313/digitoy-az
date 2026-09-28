<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/gallery_media.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$slug = trim($_GET['slug'] ?? '');

if (!$slug || !isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* ── Phase 43 — sıralama və qonaq kimliyi (İKİSİ DƏ KÖNÜLLÜ) ──
   Parametr verilməyəndə davranış Phase 39-dakı ilə TAM EYNİDİR:
   `sort=newest` (yenidən köhnəyə) və reaksiyalarda `mine` sahəsi boş.
   Yəni keşlənmiş köhnə frontend heç nə hiss etmir. */
$sort    = strtolower(trim($_GET['sort'] ?? 'newest'));
if (!in_array($sort, ['newest', 'oldest', 'featured'], true)) $sort = 'newest';
$visitor = trim($_GET['visitor'] ?? '');
if (!isValidVisitorId($visitor)) $visitor = '';

/* ── Şərti GET (ETag / Last-Modified) ──
   Qalereya hər 30 saniyədə bir avto-yenilənmə üçün bu endpoint-i sorğulayır
   (açıq tab-ların hamısından). Əvvəlki versiya hər sorğuda scandir() +
   stat() icra edirdi — fotoların sayı artdıqca davamlı disk yükü yaradırdı.
   İndi qovluğun mtime-i ƏSASINDA yüngül bir ETag hesablanır (cəmi 1 stat
   çağırışı): client uyğun gələn If-None-Match göndərsə, tam scan-i ümumiyyətlə
   keçərək birbaşa 304 qaytarırıq. Qovluq mtime-i fayl əlavə/silinmə/adı
   dəyişmə zamanı dəyişir (POSIX davranışı) — bu sistemdə fayllar heç vaxt
   yerində redaktə olunmur (yalnız yaradılır/silinir), ona görə bu siqnal
   tam etibarlıdır. Cache-Control: no-store — brauzerin öz HTTP keşinin
   bizim əl ilə idarə olunan şərti sorğu məntiqi ilə qarışmasının qarşısını
   alır (bax: src/utils/api.js::getPhotos). */
$uploadDir = galleryUploadDir($slug);
$dirMtime  = is_dir($uploadDir) ? (int) @filemtime($uploadDir) : 0;

/* ETag SƏHİFƏLƏMƏ parametrlərini də əhatə etməlidir — əks halda client
   1-ci səhifənin ETag-i ilə 2-ci səhifəni soruşub 304 alır və 1-ci
   səhifəni təkrar göstərir. */
$etagLimit  = isset($_GET['limit'])  ? (int) $_GET['limit']  : -1;
$etagOffset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;

/* ── Phase 43: ETag reaksiya/seçim dəyişikliyini də tutmalıdır ──
   Reaksiya verilməsi fayl YARATMIR, ona görə qovluq mtime-i dəyişmir və
   köhnə ETag hələ də uyğun gəlirdi: qonaq öz reaksiyasını görürdü, digər
   qonaqlar isə 30 saniyəlik yeniləmədə 304 alıb köhnə siyahını saxlayırdı.
   `galleryMetaVersion()` iki kiçik aqreqatdır (COUNT + MAX(updated_at)),
   indekslənmiş sütunlar üzərində — ucuzdur. Cədvəllər yoxdursa 'na|na'
   qaytarır, yəni ETag sabit qalır və davranış əvvəlki kimi olur. */
$metaVer = galleryMetaVersion($slug);

$etag = '"' . md5($slug . '|' . $dirMtime . '|' . $etagLimit . '|' . $etagOffset
               . '|' . $sort . '|' . $visitor . '|' . $metaVer) . '"';
$lastMod = gmdate('D, d M Y H:i:s', $dirMtime) . ' GMT';

header('ETag: ' . $etag);
header('Last-Modified: ' . $lastMod);
header('Cache-Control: no-store');

$ifNoneMatch = trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '');
if ($ifNoneMatch !== '' && $ifNoneMatch === $etag) {
    http_response_code(304);
    exit;
}

/* ── Manifest (fayl sistemi = yeganə həqiqət) ──
   Skan `gallery_media.php`-ə köçürülüb ki, canlı sayğac, slayd şou və
   analitika EYNİ siyahını görsün. Qaydalar hərfən eynidir. */
$scan   = scanGalleryMedia($slug);
$photos = $scan['items'];

/* ── Phase 43 sahələri — MÖVCUD açarlara ƏLAVƏ, heç biri silinmir ──
   DB oxunmursa hər ikisi boş massivdir → elementlər `featured: false` və
   sıfır reaksiya ilə gəlir, qalereya isə tam işləyir. */
$featured  = galleryFeaturedMap($slug);
$reactions = galleryReactionMap($slug, $visitor !== '' ? $visitor : null);

foreach ($photos as &$p) {
    $r = $reactions[$p['id']] ?? null;
    $p['featured']       = isset($featured[$p['id']]);
    $p['reactions']      = $r ? $r['counts'] : new stdClass();
    $p['reactionTotal']  = $r ? $r['total']  : 0;
    $p['myReaction']     = $r ? $r['mine']   : null;
}
unset($p);

$photos = sortGalleryItems($photos, $sort);

/* ── Server tərəfi səhifələmə (könüllü) ──
   Parametrsiz sorğu ƏVVƏLKİ kimi bütün siyahını qaytarır — mövcud
   istifadəçilər (köhnə keşlənmiş frontend daxil) pozulmur. `limit`
   verildikdə isə 500+ medialı qalereyada manifest kiçik qalır. */
$total  = count($photos);
$limit  = isset($_GET['limit'])  ? max(1, min((int) $_GET['limit'], 500)) : null;
$offset = isset($_GET['offset']) ? max(0, (int) $_GET['offset'])          : 0;

if ($limit !== null) {
    $photos = array_slice($photos, $offset, $limit);
}

echo json_encode([
    'ok'     => true,
    'slug'   => $slug,
    'total'  => $total,
    'offset' => $offset,
    'photos' => $photos,
    /* Phase 43 — canlı sayğaclar. Qalereya üz qapağı və admin paneli
       bunları oxuyur; köhnə client bu açarları sadəcə görməzdən gəlir. */
    'counts' => [
        'photos' => $scan['photos'],
        'videos' => $scan['videos'],
        'total'  => $scan['photos'] + $scan['videos'],
    ],
    'sort'   => $sort,
]);
