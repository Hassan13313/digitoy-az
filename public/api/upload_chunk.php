<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Hissəli / davam etdirilə bilən yükləmə

   NƏ ÜÇÜN BU VAR (Phase 33 memarlıq qərarı):
   Ölçülmüş production tavanı `post_max_size ≈ 104M`-dır. Böyük videonu
   TƏK sorğu ilə göndərmək üçün bu limiti 2 GB-a qaldırmaq lazım gələrdi —
   bu isə TƏHLÜKƏLİDİR:
     • PHP bütün gövdəni müvəqqəti fayla yığır: 2 GB temp + 2 GB son fayl
       = hər paralel yükləmə üçün 4 GB anlıq disk;
     • zəif mobil şəbəkədə 2 GB tək sorğu SAATLARLA açıq qalır və qısa
       bir kəsilmə hər şeyi SIFIRDAN başladır (toy məkanında qaçılmazdır);
     • tək sorğu daxilində real "davam etdirmə" mümkün deyil;
     • böyük gövdə həm də DoS səthini genişləndirir.

   HƏLLİ: fayl client tərəfdə 4 MB-lıq hissələrə bölünür. Hər sorğu
   ~4 MB-dır, yəni server limitlərinin HEÇ BİRİNƏ toxunmur —
   post_max_size dəyişdirilmir. Kəsilmə olarsa yalnız son hissə itir,
   yükləmə qaldığı yerdən davam edir.

   MÜDAFİƏLƏR:
     • MIME İLK hissədən yoxlanılır — 2 GB zibil yığılmasının qarşısını alır;
     • hər sorğu üçün ölçü tavanı + ümumi tavan;
     • hissələr yalnız ARDICIL qəbul edilir (mövcud ölçü ilə yoxlanılır);
     • uploadId formatı ciddi, qovluqdan kənara çıxmaq mümkün deyil;
     • flock ilə eyni uploadId-yə paralel yazma qarşısı alınır.

   API:
     GET  ?slug=&uploadId=          → { received: <bayt> }  (davam nöqtəsi)
     POST slug, uploadId, chunkIndex, totalChunks, fileSize, chunk[, poster]
                                    → aralıq: { ok, received }
                                    → son:   { ok, done:true, url, ... }
══════════════════════════════════════════════════ */

@ini_set('max_execution_time', '120');
@ini_set('memory_limit',       '128M');   /* hissələr axınla yazılır, yığılmır */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/media_policy.php';
require_once __DIR__ . '/media_store.php';

/** Bir sorğuda maksimum hissə ölçüsü — server limitlərindən çox-çox aşağı */
const MAX_CHUNK_BYTES = 8388608;   /* 8 MiB */

/** Client-in istifadə etdiyi hissə ölçüsü (src/utils/uploadPolicy.js ilə eyni).
    Sıra yoxlaması üçün lazımdır — aşağıdakı CHUNK_OUT_OF_ORDER-ə bax. */
const CLIENT_CHUNK_BYTES = 4194304;   /* 4 MiB */

/** Yarımçıq yükləmələrin müvəqqəti qovluğu (slug ola bilməz — `_` ilə başlayır) */
function incomingDir(): ?string {
    $dir = __DIR__ . '/../uploads/_incoming';
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) return null;
    return $dir;
}

function partPath(string $slug, string $uploadId): string {
    /* Ad slug + uploadId-nin hash-idir: istifadəçi mətni fayl sisteminə düşmür */
    return incomingDir() . '/' . hash('sha256', $slug . '|' . $uploadId) . '.part';
}

function fail(int $status, string $code, string $message, bool $permanent = true): never {
    http_response_code($status);
    echo json_encode(['error' => $code, 'code' => $code,
                      'message' => $message, 'permanent' => $permanent]);
    exit;
}

/* ── Tərk edilmiş yarımçıq yükləmələrin təmizliyi ──
   YALNIZ 24 saatdan köhnə `.part` faylları silinir. Bunlar MÜŞTƏRİ MEDİASI
   DEYİL — brauzeri bağlanmış qonaqdan qalan yarımçıq qaralamalardır və
   qalereyada heç vaxt görünmür. Onlar silinməsə disk sonsuz böyüyər.
   Qalereya mediasına bu funksiya TOXUNMUR. */
function sweepStaleParts(): void {
    $dir = incomingDir();
    if ($dir === null) return;
    $cutoff = time() - 86400;
    foreach (glob($dir . '/*.part') ?: [] as $f) {
        if (@filemtime($f) < $cutoff) {
            @unlink($f);
            mediaLog('chunk_stale_removed', ['age_h' => 24]);
        }
    }
}

$slug     = trim($_REQUEST['slug']     ?? '');
$uploadId = trim($_REQUEST['uploadId'] ?? '');

if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    fail(400, 'BAD_SLUG', 'Qalereya tapılmadı.');
}
if (!preg_match('/^[a-z0-9]{16,64}$/', $uploadId)) {
    fail(400, 'BAD_UPLOAD_ID', 'Yükləmə identifikatoru yanlışdır.');
}

$part = partPath($slug, $uploadId);

/* ── Davam nöqtəsi ── */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $received = is_file($part) ? (int) filesize($part) : 0;
    echo json_encode(['ok' => true, 'received' => $received]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'METHOD', 'POST tələb olunur.');
}

/* post_max_size aşımı — hissə çox böyük göndərilib */
if (postBodyWasDiscarded()) {
    fail(413, 'CHUNK_TOO_LARGE', 'Yükləmə hissəsi çox böyükdür.');
}

$chunkIndex  = (int) ($_POST['chunkIndex']  ?? -1);
$totalChunks = (int) ($_POST['totalChunks'] ?? 0);
$fileSize    = (int) ($_POST['fileSize']    ?? 0);

if ($chunkIndex < 0 || $totalChunks < 1 || $chunkIndex >= $totalChunks) {
    fail(400, 'BAD_CHUNK_INDEX', 'Yükləmə sırası yanlışdır.');
}

if ($fileSize <= 0 || $fileSize > MAX_UPLOAD_BYTES) {
    fail(413, 'FILE_TOO_LARGE',
        'Fayl çox böyükdür (' . humanBytes($fileSize) . '). Maksimum ' . MAX_UPLOAD_LABEL . '.');
}

if (empty($_FILES['chunk']) || $_FILES['chunk']['error'] !== UPLOAD_ERR_OK) {
    fail(400, 'CHUNK_MISSING', 'Yükləmə hissəsi çatmadı. Yenidən cəhd edin.', false);
}

if ($_FILES['chunk']['size'] > MAX_CHUNK_BYTES) {
    fail(413, 'CHUNK_TOO_LARGE', 'Yükləmə hissəsi çox böyükdür.');
}

if (incomingDir() === null) {
    fail(500, 'STORAGE_ERROR', 'Server yaddaş xətası. Bir az sonra yenidən cəhd edin.', false);
}

if ($chunkIndex === 0) {
    sweepStaleParts();
    mediaLog('upload_started', ['slug' => $slug, 'bytes' => $fileSize, 'mode' => 'chunked']);
}

/* ── Hissəni ARDICIL əlavə et (flock ilə atomik) ── */
$fp = @fopen($part, 'c+');
if ($fp === false) {
    fail(500, 'STORAGE_ERROR', 'Server yaddaş xətası. Yenidən cəhd edin.', false);
}

if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    fail(409, 'UPLOAD_BUSY', 'Bu fayl artıq göndərilir. Bir az gözləyin.', false);
}

clearstatcache(true, $part);
$received  = (int) filesize($part);
$chunkSize = (int) $_FILES['chunk']['size'];

/* Client hansı offset-dən yazdığını göndərmir — mövcud ölçü həqiqətdir.
   Təkrar göndərilən hissə (şəbəkə retry-i) sükutla qəbul edilir. */
$expectedOffset = $received;

if ($chunkIndex > 0 && $received === 0) {
    flock($fp, LOCK_UN); fclose($fp);
    fail(409, 'UPLOAD_LOST', 'Yükləmə sıfırlandı — baştan başlayın.', false);
}

/* ── Sıra yoxlaması ──
   Gələn hissə serverin gözlədiyi mövqeyə uyğun gəlməlidir. Bu olmasa
   eyni uploadId-yə PARALEL yazan iki tab (məsələn qonaq eyni faylı iki
   pəncərədə göndərir — uploadId fayl açarına görə eynidir) hissələri
   ardıcıl əlavə edib faylı KORLAYA bilərdi: ölçü düz, məzmun səhv.
   İndi belə hal sükutla korlanma yox, aydın 409 verir və client GET ilə
   həqiqi mövqeyi öyrənib oradan davam edir. */
$expectedIndex = intdiv($received, CLIENT_CHUNK_BYTES);
if ($chunkIndex !== $expectedIndex) {
    flock($fp, LOCK_UN); fclose($fp);
    http_response_code(409);
    echo json_encode([
        'error'     => 'CHUNK_OUT_OF_ORDER',
        'code'      => 'CHUNK_OUT_OF_ORDER',
        'permanent' => false,
        'received'  => $received,   /* client buradan davam etsin */
        'message'   => 'Yükləmə sırası pozuldu — davam edilir.',
    ]);
    exit;
}

if ($received + $chunkSize > $fileSize) {
    flock($fp, LOCK_UN); fclose($fp); @unlink($part);
    fail(400, 'SIZE_MISMATCH', 'Fayl ölçüsü uyğun gəlmir.');
}

$in = @fopen($_FILES['chunk']['tmp_name'], 'rb');
if ($in === false) {
    flock($fp, LOCK_UN); fclose($fp);
    fail(500, 'STORAGE_ERROR', 'Hissə oxuna bilmədi. Yenidən cəhd edin.', false);
}

fseek($fp, $expectedOffset);
stream_copy_to_stream($in, $fp);
fclose($in);
fflush($fp);

clearstatcache(true, $part);
$received = (int) filesize($part);

/* ── MIME İLK hissədən yoxlanılır ──
   Bu olmasa hücumçu 2 GB zibil yığıb yalnız sonda rədd edilərdi.

   ⚠ Fayl AÇIQ deskriptor üzərindən oxunur, yolu yenidən açmaqla YOX:
   Windows-da açıq yazma deskriptoru olan faylı ikinci dəfə açmaq
   "Permission denied" verir (POSIX-də verməzdi). finfo_buffer() ilə
   davranış hər iki platformada eynidir. */
if ($expectedOffset === 0) {
    $head = '';
    $pos  = ftell($fp);
    rewind($fp);
    $head = (string) fread($fp, 8192);
    fseek($fp, $pos);

    $finfo   = new finfo(FILEINFO_MIME_TYPE);
    $sniffed = $head === '' ? '' : (string) $finfo->buffer($head);
    /* HEIC hissəli yolla gəlmir (client onu birbaşa göndərir) */
    if (!isset(ALLOWED_MEDIA_MIME[$sniffed])) {
        flock($fp, LOCK_UN); fclose($fp); @unlink($part);
        mediaLog('upload_failed', ['slug' => $slug, 'reason' => 'bad_mime', 'mime' => $sniffed, 'mode' => 'chunked']);
        fail(415, 'UNSUPPORTED_TYPE',
            'Bu fayl növü dəstəklənmir. Yalnız şəkil (JPG, PNG, WebP) və video (MP4, MOV) göndərmək olar.');
    }
}

flock($fp, LOCK_UN);
fclose($fp);

/* ── Hələ bitməyib ── */
if ($received < $fileSize) {
    echo json_encode(['ok' => true, 'received' => $received, 'done' => false]);
    exit;
}

/* ── Son hissə: birləşdirilmiş faylı qalereyaya köçür ── */
$mime = @mime_content_type($part);

$posterTmp = null;
if (!empty($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
    $posterTmp = $_FILES['poster']['tmp_name'];
}

$stored = storeMedia($part, $mime, $slug, false, $posterTmp);

if (!$stored['ok']) {
    @unlink($part);
    mediaLog('upload_failed', ['slug' => $slug, 'reason' => $stored['code'], 'mode' => 'chunked']);
    fail($stored['status'], $stored['code'], $stored['error'], $stored['status'] !== 500);
}

@unlink($part);   /* storeMedia rename etdisə onsuz da yoxdur */

mediaLog('upload_completed', [
    'slug'        => $slug,
    'bytes'       => $fileSize,
    'mime'        => $mime,
    'mode'        => 'chunked',
    'chunks'      => $totalChunks,
    'thumb'       => (bool) $stored['thumb'],
    'poster'      => (bool) $stored['poster'],
    'duration_ms' => elapsedMs(),
]);

echo json_encode(array_merge(mediaResponse($slug, $stored), [
    'done'     => true,
    'received' => $received,
    'mime'     => $mime,
]));
