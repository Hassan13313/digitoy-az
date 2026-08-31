<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Media saxlama boru xətti (paylaşılan)

   Həm birbaşa yükləmə (upload_photo.php), həm də hissəli yükləmə
   (upload_chunk.php) EYNİ son mərhələdən keçir: MIME yoxlaması, EXIF
   təmizliyi, thumbnail, video posteri, ad təyini. Məntiq tək yerdədir ki,
   iki yol bir-birindən ayrılmasın.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/media_policy.php';

const ALLOWED_MEDIA_MIME = [
    'image/jpeg'      => 'jpg',
    'image/png'       => 'png',
    'image/gif'       => 'gif',
    'image/webp'      => 'webp',
    'video/mp4'       => 'mp4',
    'video/quicktime' => 'mov',
];

/** Yükləmə qovluğunu hazırla; alınmasa null */
function ensureUploadDir(string $slug): ?string {
    $dir = __DIR__ . '/../uploads/' . $slug . '/';
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) return null;
    if (!is_writable($dir)) {
        @chmod($dir, 0755);
        if (!is_writable($dir)) return null;
    }
    return $dir;
}

/**
 * Mənbə faylı qalereyaya yerləşdir.
 *
 * @param string      $srcPath        mənbə (yüklənmiş və ya birləşdirilmiş fayl)
 * @param string      $mime           aşkarlanmış MIME (ALLOWED_MEDIA_MIME-də olmalıdır)
 * @param string      $slug           toy qovluğu
 * @param bool        $isUploadedFile true → move_uploaded_file, false → rename
 * @param string|null $posterTmp      videolar üçün könüllü JPEG poster (müvəqqəti yol)
 *
 * @return array{ok:bool, error?:string, code?:string, status?:int,
 *                filename?:string, thumb?:?string, poster?:?string}
 */
function storeMedia(string $srcPath, string $mime, string $slug,
                    bool $isUploadedFile, ?string $posterTmp = null): array {

    if (!isset(ALLOWED_MEDIA_MIME[$mime])) {
        return ['ok' => false, 'status' => 415, 'code' => 'UNSUPPORTED_TYPE',
                'error' => 'Bu fayl növü dəstəklənmir. Yalnız şəkil (JPG, PNG, WebP) və video (MP4, MOV) göndərmək olar.'];
    }

    $dir = ensureUploadDir($slug);
    if ($dir === null) {
        return ['ok' => false, 'status' => 500, 'code' => 'STORAGE_ERROR',
                'error' => 'Server yaddaş xətası. Bir az sonra yenidən cəhd edin.'];
    }

    /* Ad YALNIZ aşkarlanmış MIME-dan qurulur — istifadəçinin göndərdiyi ad
       heç vaxt istifadə edilmir (uzantı saxtakarlığı, path traversal və
       fayl adı ilə XSS kökündən aradan qalxır). */
    $basename = time() . '_' . uniqid('', true);
    $filename = $basename . '.' . ALLOWED_MEDIA_MIME[$mime];
    $destPath = $dir . $filename;

    $isImage    = str_starts_with($mime, 'image/');
    $thumbName  = null;
    $posterName = null;

    if ($isImage && extension_loaded('gd')) {
        $img = match ($mime) {
            'image/jpeg' => @imagecreatefromjpeg($srcPath),
            'image/png'  => @imagecreatefrompng($srcPath),
            'image/gif'  => @imagecreatefromgif($srcPath),
            'image/webp' => @imagecreatefromwebp($srcPath),
            default      => false,
        };

        if ($img === false) {
            return ['ok' => false, 'status' => 422, 'code' => 'CORRUPT_IMAGE',
                    'error' => 'Şəkil oxuna bilmədi — fayl zədəlidir. Başqa şəkil seçin.'];
        }

        /* GD ilə yenidən kodlamaq EXIF-i (GPS/cihaz metadata) təbii şəkildə atır */
        $saved = match ($mime) {
            'image/jpeg' => imagejpeg($img, $destPath, 90),
            'image/png'  => imagepng($img, $destPath, 6),
            'image/gif'  => imagegif($img, $destPath),
            'image/webp' => imagewebp($img, $destPath, 90),
            default      => false,
        };

        if ($saved) {
            $w = imagesx($img);
            $h = imagesy($img);
            $ratio = min(1, 480 / max($w, $h));
            $nw = max(1, (int) round($w * $ratio));
            $nh = max(1, (int) round($h * $ratio));

            $thumb = imagecreatetruecolor($nw, $nh);
            imagefill($thumb, 0, 0, imagecolorallocate($thumb, 255, 255, 255));
            imagecopyresampled($thumb, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
            if (imagejpeg($thumb, $dir . $basename . '_thumb.jpg', 78)) {
                $thumbName = $basename . '_thumb.jpg';
            }
            imagedestroy($thumb);
        }
        imagedestroy($img);

        if (!$saved || $thumbName === null) {
            /* Yarımçıq qalan hər şeyi təmizlə — zibil media qalmamalıdır */
            @unlink($destPath);
            @unlink($dir . $basename . '_thumb.jpg');
            return ['ok' => false, 'status' => 422, 'code' => 'CORRUPT_IMAGE',
                    'error' => 'Şəkil emal edilə bilmədi. Başqa şəkil seçin.'];
        }
    } else {
        /* Video (və ya GD-siz nadir hal) — orijinal olduğu kimi saxlanılır */
        $moved = $isUploadedFile
            ? move_uploaded_file($srcPath, $destPath)
            : @rename($srcPath, $destPath);

        /* rename fərqli disklər arasında alınmaya bilər — kopyala */
        if (!$moved && !$isUploadedFile) {
            $moved = @copy($srcPath, $destPath);
            if ($moved) @unlink($srcPath);
        }

        if (!$moved) {
            return ['ok' => false, 'status' => 500, 'code' => 'STORAGE_ERROR',
                    'error' => 'Fayl saxlanıla bilmədi. Yenidən cəhd edin.'];
        }

        /* Video posteri — serverdə ffmpeg yoxdur, kadr client tərəfdə
           <video>+canvas ilə çıxarılır və könüllü göndərilir. */
        if ($posterTmp !== null && is_file($posterTmp) && filesize($posterTmp) > 0
            && filesize($posterTmp) <= 2097152
            && mime_content_type($posterTmp) === 'image/jpeg') {
            if (@rename($posterTmp, $dir . $basename . '_poster.jpg')
                || @copy($posterTmp, $dir . $basename . '_poster.jpg')) {
                $posterName = $basename . '_poster.jpg';
            }
        }
    }

    /* Manifest ETag-i qovluq mtime-inə bağlıdır — açıq tablar yeniliyi görsün */
    @touch($dir);

    return ['ok' => true, 'filename' => $filename, 'thumb' => $thumbName, 'poster' => $posterName];
}

/** Saxlanmış media üçün cavab gövdəsi qur */
function mediaResponse(string $slug, array $stored): array {
    $baseUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
    $base    = $baseUrl . '/uploads/' . $slug . '/';

    $preview = $stored['thumb'] ?? null;
    if ($preview === null) $preview = $stored['poster'] ?? null;

    return [
        'ok'        => true,
        'url'       => $base . $stored['filename'],
        'thumbUrl'  => $base . ($preview ?? $stored['filename']),
        'posterUrl' => isset($stored['poster']) && $stored['poster'] ? $base . $stored['poster'] : null,
        'filename'  => $stored['filename'],
        'id'        => $stored['filename'],
    ];
}
