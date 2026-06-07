<?php
@ini_set('upload_max_filesize', '128M');
@ini_set('post_max_size',       '128M');
@ini_set('max_execution_time',  '300');
@ini_set('memory_limit',        '256M');

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

/* ── 1. Slug validation ── */
$slug = trim($_POST['slug'] ?? '');

if (!$slug || !preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

/* ── Eyni requestdə maksimum 1 fayl ── */
if (count($_FILES) > 1 || (isset($_FILES['photo']) && is_array($_FILES['photo']['name']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Only one file per request allowed']);
    exit;
}

if (empty($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'File upload error', 'code' => $_FILES['photo']['error'] ?? -1]);
    exit;
}

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
    echo json_encode(['error' => 'Too many uploads from this network. Please try again in a while.']);
    exit;
}

/* ── MIME aşkarlama (real fayl məzmununa görə — Content-Type header-ə güvənmir) ── */
$file = $_FILES['photo'];
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
            'error'   => 'HEIC_NOT_SUPPORTED',
            'message' => 'Bu fayl formatı (HEIC) hazırda dəstəklənmir. Zəhmət olmasa telefonunuzun Kamera ayarlarından "Formatlar → Ən Uyğun" (Most Compatible) seçimini aktivləşdirib yenidən cəhd edin — bu, şəkilləri avtomatik JPG formatında çəkəcək.',
        ]);
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
    echo json_encode(['error' => 'File type not allowed', 'mime' => $mime]);
    exit;
}

/* ── Max file size: 50MB ── */
if ($file['size'] > 52428800) {
    if ($heicTemp) @unlink($heicTemp);
    http_response_code(413);
    echo json_encode(['error' => 'File too large (max 50MB)']);
    exit;
}

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
$ext      = $extByMime[$mime] ?? (strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg');
$basename = time() . '_' . uniqid('', true);
$filename = $basename . '.' . $ext;
$destPath = $uploadDir . $filename;

$isImage     = (strpos($mime, 'image/') === 0);
$thumbName   = null;
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
        @unlink($destPath);
        if ($heicTemp) @unlink($heicTemp);
        http_response_code(422);
        echo json_encode(['error' => 'Could not process image — file may be corrupted']);
        exit;
    }
} else {
    /* Video (və ya GD əlçatmaz olduğu nadir hal) — orijinalı olduğu kimi köçür.
       Videolar üçün EXIF/thumbnail emalı tətbiq edilmir — qalereyada Film
       ikonu ilə göstərilir (mövcud davranış dəyişməyib). */
    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        if ($heicTemp) @unlink($heicTemp);
        http_response_code(500);
        echo json_encode(['error' => 'Could not save file']);
        exit;
    }
}

if ($heicTemp) @unlink($heicTemp);

/* ── Public URL ── */
$baseUrl  = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
$url      = $baseUrl . '/uploads/' . $slug . '/' . $filename;
$thumbUrl = $thumbName ? ($baseUrl . '/uploads/' . $slug . '/' . $thumbName) : $url;

echo json_encode([
    'ok'       => true,
    'url'      => $url,
    'thumbUrl' => $thumbUrl,
    'filename' => $filename,
    'id'       => $filename,
    'mime'     => $mime,
]);
