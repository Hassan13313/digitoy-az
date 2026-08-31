<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Qonaq media yükləməsi

   2026-08-31 düzəlişi (real toy hadisəsi: uzun videolar yüklənmirdi):
   • Köhnə @ini_set('upload_max_filesize'|'post_max_size', '128M')
     sətirləri TAMAMİLƏ TƏSİRSİZ idi — bu direktivlər PHP_INI_PERDIR-dir,
     PHP sorğu gövdəsini skript İCRA OLUNMAZDAN ƏVVƏL parse edir.
     Ölçülmüş real tavan: upload_max_filesize=100M, post_max_size≈104M.
     Ona görə silindilər (bax: media_policy.php — ölçmə qeydləri).
   • Tək sorğu limiti 50MB → 90MB (MAX_SINGLE_REQUEST_BYTES). 50MB 4K/30-da
     cəmi ~15 saniyəyə uyğun gəlirdi — "15-20 saniyədən uzun video
     getmir" şikayətinin birbaşa səbəbi.
   • post_max_size aşılanda PHP $_POST/$_FILES-i sükutla atır; köhnə kod
     bu halda "Valid slug required" (400) qaytarırdı — yanıldıcı idi.
     İndi 413 + aydın Azərbaycanca mesaj.
   • Bütün rədd cavabları maşın-oxunaqlı `code` + `permanent` bayrağı ilə
     qayıdır ki, frontend daimi xətanı (yenidən cəhd mənasızdır)
     müvəqqətidən ayıra bilsin.
══════════════════════════════════════════════════ */

@ini_set('max_execution_time', '300');   /* PHP_INI_ALL — real təsir edir */
@ini_set('memory_limit',       '256M');  /* PHP_INI_ALL — real təsir edir */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/media_policy.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

/* ── 0. post_max_size aşımı — HƏR ŞEYDƏN ƏVVƏL ──
   PHP gövdəni atdığı üçün $_POST['slug'] boş olur; bu yoxlama olmasa
   aşağıdakı slug yoxlaması yanıldıcı "Valid slug required" qaytarardı. */
if (postBodyWasDiscarded()) {
    $sent = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    http_response_code(413);
    echo json_encode([
        'error'     => 'REQUEST_TOO_LARGE',
        'code'      => 'REQUEST_TOO_LARGE',
        'permanent' => true,
        'limit'     => MAX_SINGLE_REQUEST_LABEL,
        'message'   => 'Fayl serverin qəbul etdiyi ölçüdən böyükdür ('
                     . humanBytes($sent) . '). Maksimum ' . MAX_SINGLE_REQUEST_LABEL
                     . '. Videonu qısaldın və ya kamera ayarlarından 1080p seçin.',
    ]);
    mediaLog('upload_failed', ['reason' => 'post_max_size', 'bytes' => $sent]);
    exit;
}

/* ── 1. Slug validation ── */
$slug = trim($_POST['slug'] ?? '');

if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required', 'code' => 'BAD_SLUG', 'permanent' => true]);
    exit;
}

/* ── Sorğu başına bir media (+ videolar üçün könüllü poster kadrı) ── */
$extraFiles = array_diff(array_keys($_FILES), ['photo', 'poster']);
if (!empty($extraFiles) || (isset($_FILES['photo']) && is_array($_FILES['photo']['name']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Only one file per request allowed', 'code' => 'BAD_REQUEST', 'permanent' => true]);
    exit;
}

/* ── Yükləmə xətalarını AYDIN mesajlara çevir ──
   Köhnə kod yalnız xam PHP rəqəmini qaytarırdı ('code' => 1) — qonaq nə
   baş verdiyini heç cür başa düşə bilmirdi. */
if (empty($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    $err = $_FILES['photo']['error'] ?? -1;
    [$httpCode, $code, $msg, $permanent] = match ($err) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => [413, 'FILE_TOO_LARGE',
            'Fayl çox böyükdür. Maksimum ' . MAX_SINGLE_REQUEST_LABEL . '.', true],
        UPLOAD_ERR_PARTIAL => [400, 'UPLOAD_INTERRUPTED',
            'Yükləmə yarımçıq qaldı — bağlantı kəsildi. Yenidən cəhd edin.', false],
        UPLOAD_ERR_NO_FILE => [400, 'NO_FILE', 'Fayl seçilməyib.', true],
        UPLOAD_ERR_NO_TMP_DIR, UPLOAD_ERR_CANT_WRITE => [500, 'SERVER_STORAGE',
            'Serverdə müvəqqəti yaddaş xətası. Bir az sonra yenidən cəhd edin.', false],
        default => [400, 'UPLOAD_ERROR',
            'Fayl yüklənərkən xəta baş verdi. Yenidən cəhd edin.', false],
    };
    http_response_code($httpCode);
    echo json_encode(['error' => $code, 'code' => $code, 'message' => $msg, 'permanent' => $permanent]);
    mediaLog('upload_failed', ['slug' => $slug, 'reason' => $code, 'php_err' => $err]);
    exit;
}

mediaLog('upload_started', ['slug' => $slug, 'bytes' => (int) $_FILES['photo']['size']]);

/* ── Rate limit — (slug, IP) açarı ilə saatda 300, flock ilə atomik ──
   Köhnə versiya YALNIZ IP-yə görə (saatda 30) limitləyirdi: toy
   məkanında eyni WiFi-dən paylaşılan ictimai IP-ni bir neçə qonağın
   adi istifadəsi belə dəqiqələr içində dolduraraq HAMISINI bloklayırdı.
   İndi (toy slug-u + IP) cütü açardır — fərqli toylar eyni binict IP-ni
   bir-biri ilə paylaşsa belə bir-birini bloklamır, və limit (300/saat)
   50-100 fotoluq partiyalara + paralel qonaq fəaliyyətinə kifayət edir.
   Əvvəlki versiyada read→filter→check→append→write addımları arasında
   kilidlənmə yox idi (TOCTOU yarışı) — eyni andan iki sorğu say
   yoxlamasını eyni vaxtda keçə bilərdi. İndi fopen+flock(LOCK_EX) bütün
   oxu-dəyişdirmə-yazma dövrünü tək atomik blok halına gətirir. */
$ip       = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip       = trim(explode(',', $ip)[0]);
$rlKey    = hash('sha256', $slug . '|' . $ip);
$rlFile   = sys_get_temp_dir() . '/digitoy_rl_' . $rlKey . '.json';
$rlLimit  = 300;   /* (toy, IP) cütü üzrə saatlıq tavan */
$rlWindow = 3600;

$rlAllowed = true;
$fp = @fopen($rlFile, 'c+');
if ($fp !== false) {
    if (flock($fp, LOCK_EX)) {
        $raw    = stream_get_contents($fp);
        $rlData = $raw ? (json_decode($raw, true) ?: []) : [];
        $now    = time();
        $rlData = array_values(array_filter($rlData, fn($t) => ($now - $t) < $rlWindow));

        if (count($rlData) >= $rlLimit) {
            $rlAllowed = false;
        } else {
            $rlData[] = $now;
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($rlData));
            fflush($fp);
        }
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

if (!$rlAllowed) {
    http_response_code(429);
    echo json_encode([
        'error'     => 'RATE_LIMITED',
        'code'      => 'RATE_LIMITED',
        'permanent' => false,
        'message'   => 'Bu şəbəkədən çox sayda yükləmə oldu. Bir neçə dəqiqə sonra cəhd edin.',
    ]);
    mediaLog('upload_failed', ['slug' => $slug, 'reason' => 'rate_limited']);
    exit;
}

$file = $_FILES['photo'];

/* ── Ölçü limiti — MIME/emal işindən ƏVVƏL (ucuz və dərhal aydın cavab) ── */
if ($file['size'] > MAX_SINGLE_REQUEST_BYTES) {
    http_response_code(413);
    echo json_encode([
        'error'     => 'FILE_TOO_LARGE',
        'code'      => 'FILE_TOO_LARGE',
        'permanent' => true,
        'limit'     => MAX_SINGLE_REQUEST_LABEL,
        'size'      => humanBytes((int) $file['size']),
        'message'   => 'Fayl çox böyükdür (' . humanBytes((int) $file['size'])
                     . '). Maksimum ' . MAX_SINGLE_REQUEST_LABEL . '.',
    ]);
    mediaLog('upload_failed', ['slug' => $slug, 'reason' => 'too_large', 'bytes' => (int) $file['size']]);
    exit;
}

/* ── MIME aşkarlama (real fayl məzmununa görə — Content-Type header-ə güvənmir) ── */
$mime = mime_content_type($file['tmp_name']);

/* ── HEIC/HEIF strategiyası ──
   iPhone-lar default olaraq HEIC formatında çəkir. Əksər brauzerlər
   (Chrome, Firefox, Edge, Android, və hətta Safari-nin bir çox kontekst-
   ləri) <img> daxilində HEIC-i DEKODLAYA BİLMİR — konversiya olmadan
   saxlasaq, qonaqların yüklədiyi şəkillərin böyük hissəsi digər
   qonaqlara və adminə "broken image" kimi görünər. Yalnız serverdə
   ETIBARLI konversiya mümkündürsə (Imagick + libheif) qəbul edirik;
   əks halda AYDIN mesajla rədd edirik — heç vaxt sükutla qırıq şəkil
   saxlamırıq. */
$heicTemp = null;
if (in_array($mime, ['image/heic', 'image/heif'], true)) {
    $converted = null;
    if (extension_loaded('imagick')) {
        try {
            $im = new Imagick($file['tmp_name']);
            $im->setImageFormat('jpeg');
            $im->setImageCompressionQuality(88);
            $im->stripImage();
            $tmpOut = $file['tmp_name'] . '_heic.jpg';
            $im->writeImage($tmpOut);
            $im->clear();
            $im->destroy();
            if (is_file($tmpOut) && filesize($tmpOut) > 0) $converted = $tmpOut;
        } catch (Throwable $e) {
            $converted = null;
        }
    }

    if (!$converted) {
        http_response_code(415);
        echo json_encode([
            'error'     => 'HEIC_NOT_SUPPORTED',
            'code'      => 'HEIC_NOT_SUPPORTED',
            'permanent' => true,
            'message'   => 'Bu fayl formatı (HEIC) hazırda dəstəklənmir. Zəhmət olmasa telefonunuzun Kamera ayarlarından "Formatlar → Ən Uyğun" (Most Compatible) seçimini aktivləşdirib yenidən cəhd edin — bu, şəkilləri avtomatik JPG formatında çəkəcək.',
        ]);
        mediaLog('upload_failed', ['slug' => $slug, 'reason' => 'heic_unsupported']);
        exit;
    }

    $heicTemp         = $converted;
    $file['tmp_name'] = $converted;
    $mime             = 'image/jpeg';
}

$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
if (!in_array($mime, $allowed, true)) {
    if ($heicTemp) @unlink($heicTemp);
    http_response_code(415);
    echo json_encode([
        'error'     => 'UNSUPPORTED_TYPE',
        'code'      => 'UNSUPPORTED_TYPE',
        'permanent' => true,
        'mime'      => $mime,
        'message'   => 'Bu fayl növü dəstəklənmir. Yalnız şəkil (JPG, PNG, WebP) və video (MP4, MOV) göndərmək olar.',
    ]);
    mediaLog('upload_failed', ['slug' => $slug, 'reason' => 'bad_mime', 'mime' => $mime]);
    exit;
}

/* Ölçü limiti yuxarıda yoxlanılıb (MAX_SINGLE_REQUEST_BYTES).
   Daha böyük fayllar bu endpoint-ə HEÇ VAXT gəlmir — client onları
   upload_chunk.php üzərindən hissə-hissə göndərir (2 GB-a qədər). */

/* ── Qovluq yarat ── */
$uploadDir = __DIR__ . '/../uploads/' . $slug . '/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
        if ($heicTemp) @unlink($heicTemp);
        http_response_code(500);
        echo json_encode(['error' => 'Cannot create upload directory']);
        exit;
    }
}
if (!is_writable($uploadDir)) {
    chmod($uploadDir, 0755);
    if (!is_writable($uploadDir)) {
        if ($heicTemp) @unlink($heicTemp);
        http_response_code(500);
        echo json_encode(['error' => 'Upload directory not writable']);
        exit;
    }
}

/* ── Unikal fayl adı (HEIC konversiyası → .jpg) ── */
$extByMime = [
    'image/jpeg'      => 'jpg',
    'image/png'       => 'png',
    'image/gif'       => 'gif',
    'image/webp'      => 'webp',
    'video/mp4'       => 'mp4',
    'video/quicktime' => 'mov',
];
/* Uzantı YALNIZ aşkarlanmış MIME-dan gəlir — istifadəçinin göndərdiyi ad
   heç vaxt istifadə edilmir. Bu, uzantı saxtakarlığını, path traversal-ı
   və fayl adı vasitəsilə XSS-i kökündən aradan qaldırır. */
$ext      = $extByMime[$mime];
$basename = time() . '_' . uniqid('', true);
$filename = $basename . '.' . $ext;
$destPath = $uploadDir . $filename;

$isImage     = (strpos($mime, 'image/') === 0);
$thumbName   = null;
$posterName  = null;
$processedOK = false;

/* ── Şəkillər: EXIF (GPS/cihaz metadata) silinir + thumbnail yaradılır ──
   Faylı GD ilə yenidən kodlamaq EXIF-i təbii şəkildə atır — GD oxuduğu
   piksel datasını saxlayır, metadata seqmentlərini yenidən yazmır. Bu
   həm orijinalın GPS-siz/EXIF-siz saxlanmasını, həm də qalereya grid-i
   üçün yüngül thumbnail yaradılmasını TƏK keçiddə həll edir. GD demək
   olar ki bütün PHP/cPanel quraşdırmalarında defolt mövcuddur. */
if ($isImage && extension_loaded('gd')) {
    $img = false;
    switch ($mime) {
        case 'image/jpeg': $img = @imagecreatefromjpeg($file['tmp_name']); break;
        case 'image/png':  $img = @imagecreatefrompng($file['tmp_name']);  break;
        case 'image/gif':  $img = @imagecreatefromgif($file['tmp_name']);  break;
        case 'image/webp': $img = @imagecreatefromwebp($file['tmp_name']); break;
    }

    if ($img !== false) {
        /* Orijinalı EXIF-siz yenidən yaz — eyni format, vizual key keyfiyyətdə */
        $savedOriginal = false;
        switch ($mime) {
            case 'image/jpeg': $savedOriginal = imagejpeg($img, $destPath, 90);  break;
            case 'image/png':  $savedOriginal = imagepng($img, $destPath, 6);    break;
            case 'image/gif':  $savedOriginal = imagegif($img, $destPath);       break;
            case 'image/webp': $savedOriginal = imagewebp($img, $destPath, 90);  break;
        }

        if ($savedOriginal) {
            /* Thumbnail — qalereya grid-i üçün, maks. 480px, həmişə JPEG */
            $w = imagesx($img);
            $h = imagesy($img);
            $ratio = min(1, 480 / max($w, $h));
            $nw    = max(1, (int) round($w * $ratio));
            $nh    = max(1, (int) round($h * $ratio));

            $thumb = imagecreatetruecolor($nw, $nh);
            $white = imagecolorallocate($thumb, 255, 255, 255);
            imagefill($thumb, 0, 0, $white);
            imagecopyresampled($thumb, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);

            $candidateThumb = $basename . '_thumb.jpg';
            if (imagejpeg($thumb, $uploadDir . $candidateThumb, 78)) {
                $thumbName   = $candidateThumb;
                $processedOK = true;
            }
            imagedestroy($thumb);
        }
        imagedestroy($img);
    }

    if (!$processedOK) {
        /* Yarımçıq qalan hər şeyi təmizlə — uğursuz yükləmədən sonra
           diskdə "zibil" media qalmamalıdır (consistency invariantı) */
        @unlink($destPath);
        @unlink($uploadDir . $basename . '_thumb.jpg');
        if ($heicTemp) @unlink($heicTemp);
        http_response_code(422);
        echo json_encode([
            'error'     => 'CORRUPT_IMAGE',
            'code'      => 'CORRUPT_IMAGE',
            'permanent' => true,
            'message'   => 'Şəkil oxuna bilmədi — fayl zədəlidir. Başqa şəkil seçin.',
        ]);
        mediaLog('upload_failed', ['slug' => $slug, 'reason' => 'gd_failed', 'mime' => $mime]);
        exit;
    }
} else {
    /* Video (və ya GD əlçatmaz olduğu nadir hal) — orijinalı olduğu kimi köçür.
       Videolar üçün EXIF/thumbnail emalı tətbiq edilmir.

       ⚠ HEIC konversiyasından sonra $file['tmp_name'] artıq YÜKLƏNMİŞ fayl
       deyil, Imagick-in yazdığı adi müvəqqəti fayldır. move_uploaded_file()
       belə yol üçün HƏMİŞƏ false qaytarır — GD quraşdırılmamış serverdə hər
       iPhone şəkli 500 xətası verərdi. Mənbənin növünə görə düzgün funksiya
       seçilir. */
    $moved = $heicTemp
        ? @rename($file['tmp_name'], $destPath)
        : move_uploaded_file($file['tmp_name'], $destPath);

    if ($moved && $heicTemp) $heicTemp = null;   /* köçürüldü — silinməyə çalışma */

    if (!$moved) {
        if ($heicTemp) @unlink($heicTemp);
        http_response_code(500);
        echo json_encode([
            'error'     => 'STORAGE_ERROR',
            'code'      => 'STORAGE_ERROR',
            'permanent' => false,
            'message'   => 'Fayl saxlanıla bilmədi. Yenidən cəhd edin.',
        ]);
        mediaLog('upload_failed', ['slug' => $slug, 'reason' => 'move_failed']);
        exit;
    }

    /* ── Video poster kadrı ──
       Serverdə ffmpeg yoxdur, ona görə ilk kadr CLIENT tərəfdə <video>+canvas
       ilə çıxarılır və könüllü 'poster' sahəsində göndərilir. Poster varsa
       qalereya grid-i videonu real kadrla göstərir (əvvəl yalnız ümumi Film
       ikonu var idi). Poster gəlməsə davranış dəyişmir — heç nə pozulmur. */
    if (!empty($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK
        && $_FILES['poster']['size'] > 0 && $_FILES['poster']['size'] <= 2097152
        && mime_content_type($_FILES['poster']['tmp_name']) === 'image/jpeg') {
        $candidatePoster = $basename . '_poster.jpg';
        if (@move_uploaded_file($_FILES['poster']['tmp_name'], $uploadDir . $candidatePoster)) {
            $posterName = $candidatePoster;
        }
    }
}

if ($heicTemp) @unlink($heicTemp);

/* Qalereya manifestinin ETag-i qovluq mtime-inə bağlıdır — yeni fayl
   bütün açıq tabların növbəti sorğuda yeniliyi görməsini təmin edir */
@touch($uploadDir);

/* ── Public URL ── */
$baseUrl  = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
$url      = $baseUrl . '/uploads/' . $slug . '/' . $filename;
$thumbUrl = $thumbName   ? ($baseUrl . '/uploads/' . $slug . '/' . $thumbName)
          : ($posterName ? ($baseUrl . '/uploads/' . $slug . '/' . $posterName) : $url);

mediaLog('upload_completed', [
    'slug'        => $slug,
    'bytes'       => (int) $file['size'],
    'mime'        => $mime,
    'thumb'       => (bool) $thumbName,
    'poster'      => (bool) $posterName,
    'duration_ms' => elapsedMs(),
]);

echo json_encode([
    'ok'        => true,
    'url'       => $url,
    'thumbUrl'  => $thumbUrl,
    'posterUrl' => $posterName ? ($baseUrl . '/uploads/' . $slug . '/' . $posterName) : null,
    'filename'  => $filename,
    'id'        => $filename,
    'mime'      => $mime,
]);
