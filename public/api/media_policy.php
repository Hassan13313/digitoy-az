<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Media Siyasəti + Telemetriya

   ÖLÇÜLMÜŞ SERVER LİMİTLƏRİ (production, 2026-08-31, empirik sübut):
     upload_max_filesize = 100M   (102MB → UPLOAD_ERR_INI_SIZE, 100MB → keçir)
     post_max_size       ≈ 104M   (105MB → $_POST/$_FILES boş qayıdır)
     nginx client_max_body_size ≥ 128M  (nginx heç vaxt 413 qaytarmadı)

   XƏBƏRDARLIQ: upload_photo.php-dəki köhnə
     @ini_set('upload_max_filesize','128M') / @ini_set('post_max_size','128M')
   çağırışları TAMAMİLƏ TƏSİRSİZ idi — bu direktivlər PHP_INI_PERDIR-dir,
   PHP sorğu gövdəsini skript İCRA OLUNMAZDAN ƏVVƏL parse edir. Ona görə
   real limit 128M yox, 100M idi və bu heç yerdə görünmürdü.

   TƏTBİQ SİYASƏTİ: 90 MB.
   100M server tavanının altında təhlükəsiz ehtiyat saxlayır (multipart
   sərhəd/başlıq yükü + slug sahəsi ~200 bayt yer tutur) və tipik telefon
   videosunu əhatə edir:
     1080p/30  ≈ 60 MB/dəq → ~90 saniyə
     4K/30     ≈ 190 MB/dəq → ~28 saniyə
   Köhnə 50 MB limiti 4K/30-da cəmi ~15 saniyəyə uyğun gəlirdi — hadisə
   hesabatındakı "15-20 saniyədən uzun video yüklənmir" şikayəti ilə
   birebir üst-üstə düşür.
══════════════════════════════════════════════════ */

/* ══ Phase 33 — iki ayrı tavan ══════════════════════
   TƏK SORĞU yolu (upload_photo.php) server limitlərinə TABEDİR: gövdə
   post_max_size ≈ 104M-dan kiçik qalmalıdır → 90 MB.

   HİSSƏLİ yol (upload_chunk.php) fayl 4 MB-lıq parçalarla gəldiyi üçün
   server limitlərinə HEÇ TOXUNMUR — buna görə siyasət tavanı 2 GB-dır.
   Yəni 2 GB-a çatmaq üçün post_max_size DƏYİŞDİRİLMİR; tək sorğuda 2 GB
   göndərmək isə hər paralel yükləmə üçün ~4 GB anlıq disk tələb edər və
   zəif mobil şəbəkədə saatlarla açıq qalan, kəsiləndə sıfırdan başlayan
   sorğu deməkdir (bax: upload_chunk.php-dəki memarlıq qeydi).

   Frontend (src/utils/uploadPolicy.js) ilə eyni olmalıdır. */
define('MAX_UPLOAD_BYTES',         2147483648);  /* 2 GiB — hissəli yolun tavanı */
define('MAX_UPLOAD_LABEL',         '2 GB');
define('MAX_SINGLE_REQUEST_BYTES', 94371840);    /* 90 MiB — tək sorğu tavanı */
define('MAX_SINGLE_REQUEST_LABEL', '90 MB');

/** Serverin real tavanı — bunu aşan sorğu PHP-yə heç çatmır */
define('SERVER_POST_CEILING_BYTES', 104857600); /* ~100 MiB */

/**
 * post_max_size aşılıbmı?
 * PHP bu halda sorğunu SÜKUTLA atır: $_POST və $_FILES boş qalır, amma
 * CONTENT_LENGTH böyük olur. Bu aşkarlama olmadan skript "slug yoxdur"
 * deyib 400 qaytarırdı — istifadəçi üçün tamamilə yanıldıcı mesaj.
 */
function postBodyWasDiscarded(): bool {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') return false;
    if (!empty($_POST) || !empty($_FILES))              return false;
    return (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0;
}

/** İnsan üçün oxunaqlı ölçü */
function humanBytes(int $b): string {
    if ($b >= 1048576) return round($b / 1048576, 1) . ' MB';
    if ($b >= 1024)    return round($b / 1024, 1) . ' KB';
    return $b . ' B';
}

/**
 * Struktur log — "niyə yüklənmədi?" sualına terminal qazmadan cavab vermək üçün.
 * ŞƏXSİ MƏLUMAT YAZILMIR: fayl adı, IP və media məzmunu loglanmır;
 * yalnız slug, ölçü, MIME, müddət və xəta səbəbi saxlanılır.
 */
function mediaLog(string $event, array $fields = []): void {
    $line = json_encode(array_merge([
        'ts'    => gmdate('c'),
        'event' => $event,
    ], $fields), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $dir = __DIR__ . '/_logs';   /* api/.htaccess bu qovluğu HTTP-dən bağlayır */
    if (!is_dir($dir)) @mkdir($dir, 0755, true);

    /* Gündəlik fayl — böyüməsi idarə oluna bilsin */
    @file_put_contents($dir . '/media-' . gmdate('Y-m-d') . '.log',
        $line . "\n", FILE_APPEND | LOCK_EX);
}

/** Sorğunun başlanğıcından keçən müddət (ms) */
function elapsedMs(): int {
    $start = $_SERVER['REQUEST_TIME_FLOAT'] ?? microtime(true);
    return (int) round((microtime(true) - $start) * 1000);
}
