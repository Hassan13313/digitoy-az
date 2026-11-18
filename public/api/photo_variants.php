<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Albom şəkillərinin baxış nüsxəsi (2026-11-18)

   Qonaq şəkli tam keyfiyyətdə yüklənir və orijinal olduğu kimi saxlanılır
   (endirmə, ZIP). Böyük görünüş və slayd-şou üçün isə yüngül nüsxə yaradılır:
     <ad>_display.jpg — uzun tərəf ≤ 1600 px, JPEG 82, progressive (~200–350 KB)
   Orijinal onsuz da ≤ 1600 px-dirsə nüsxə yaradılmır (front-end orijinala düşür).
   Yalnız include edilir (api/.htaccess).
   ══════════════════════════════════════════════════════════════════════════ */

const DISPLAY_MAX_SIDE = 1600;
const DISPLAY_SUFFIX   = '_display.jpg';
const DISPLAY_IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

/** GD şəklindən baxış nüsxəsi yazır. Nüsxə lazım deyilsə (kiçik şəkil) false. */
function makeDisplayCopy($img, string $destFile): bool {
    $w = imagesx($img);
    $h = imagesy($img);
    if (max($w, $h) <= DISPLAY_MAX_SIDE) return false;
    $r  = DISPLAY_MAX_SIDE / max($w, $h);
    $nw = max(1, (int) round($w * $r));
    $nh = max(1, (int) round($h * $r));
    $d  = imagecreatetruecolor($nw, $nh);
    imagefill($d, 0, 0, imagecolorallocate($d, 255, 255, 255));
    imagecopyresampled($d, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
    imageinterlace($d, true);
    $ok = imagejpeg($d, $destFile, 82);
    imagedestroy($d);
    if ($ok) @chmod($destFile, 0644);
    return $ok;
}

/** Köhnə şəkil üçün (toplu yeniləmə): 'created' | 'small' | 'exists' | 'skip' | 'failed' */
function ensureDisplayCopy(string $path): string {
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if (!in_array($ext, DISPLAY_IMAGE_EXT, true) || isPhotoDerivativeName(basename($path))) return 'skip';
    $dest = substr($path, 0, -strlen($ext) - 1) . DISPLAY_SUFFIX;
    if (is_file($dest)) return 'exists';
    $info = @getimagesize($path);
    if (!$info) return 'failed';
    if (max((int) $info[0], (int) $info[1]) <= DISPLAY_MAX_SIDE) return 'small';
    $img = match ($info[2]) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
        IMAGETYPE_PNG  => @imagecreatefrompng($path),
        IMAGETYPE_WEBP => @imagecreatefromwebp($path),
        IMAGETYPE_GIF  => @imagecreatefromgif($path),
        default        => false,
    };
    if ($img === false) return 'failed';
    $ok = makeDisplayCopy($img, $dest);
    imagedestroy($img);
    return $ok ? 'created' : 'failed';
}

/** Şəklin törəmə faylıdırmı (önizləmə / poster / baxış / video nüsxəsi)? */
function isPhotoDerivativeName(string $file): bool {
    return substr($file, -10) === '_thumb.jpg'
        || substr($file, -11) === '_poster.jpg'
        || substr($file, -12) === DISPLAY_SUFFIX
        || substr($file, -8)  === '_web.mp4';
}
