<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Admin şəkilləri: saxlama köməkçiləri (Phase 45)

   YALNIZ include edilir (api/.htaccess-də birbaşa giriş bağlıdır).
   Funksiyalar DB-yə və sorğuya toxunmur → tests/admin_media_test.php onları
   serversiz yoxlayır.

   Nə üçün: admin «Məzmun» panelində açılış monoqramına şəkil (loqo, foto)
   və «Bizim Hekayəmiz»-ə fəsil şəkli əlavə edə bilir. Hekayə şəkillərindən
   (story_media.php) iki fərq var:
     • ŞƏFFAFLIQ QORUNUR — korporativ loqo çox vaxt şəffaf PNG-dir; JPEG-ə
       çevirsək ağ kvadrat qalardı. Şəffaf piksel varsa PNG, yoxdursa JPEG.
     • Qovluq SLUG-a bağlıdır (dəvətnamə artıq mövcuddur):
         uploads/_admin/<slug>/<sha1>.jpg|png
       `_admin` — slug-da `_` ola bilməz, qalereya qovluqları ilə toqquşmur.

   ── TƏHLÜKƏSİZLİK ── (story_media.php ilə eyni)
   Hər fayl GD ilə YENİDƏN KODLAŞDIRILIR: EXIF/GPS və gizli məzmun atılır,
   diskə yalnız bizim yaratdığımız təmiz JPEG/PNG düşür, uzantı sabitdir.
   40 MP-dan böyük şəkil GD-yə ümumiyyətlə verilmir.
   ══════════════════════════════════════════════════════════════════════ */

const ADMIN_MEDIA_MAX_EDGE   = 1400;
const ADMIN_MEDIA_MAX_UPLOAD = 12 * 1024 * 1024;
const ADMIN_MEDIA_MAX_PIXELS = 40000000;
const ADMIN_MEDIA_JPEG_Q     = 86;
/* Bir dəvətnamə üçün diskə düşə biləcək admin şəkli (monoqram + fəsillər,
   dəyişdirilən köhnə şəkillər də qovluqda qalır) */
const ADMIN_MEDIA_CAP        = 80;

function adminMediaDir(string $slug): string {
    return __DIR__ . '/../uploads/_admin/' . $slug . '/';
}

function adminMediaUrl(string $slug, string $filename): string {
    return '/uploads/_admin/' . $slug . '/' . $filename;
}

function adminMediaCount(string $dir): int {
    if (!is_dir($dir)) return 0;
    /* ⚠ GLOB_BRACE bəzi sistemlərdə (musl/Alpine) yoxdur — iki ayrı glob */
    $n = 0;
    foreach (['*.jpg', '*.png'] as $pat) {
        $files = glob($dir . $pat);
        if ($files !== false) $n += count($files);
    }
    return $n;
}

/** Şəkildə həqiqətən şəffaf piksel varmı? Kiçik nüsxədə yoxlanılır (ucuzdur). */
function adminMediaHasAlpha($img): bool {
    $w = imagesx($img);
    $h = imagesy($img);
    $tw = max(1, min(48, $w));
    $th = max(1, min(48, $h));
    $t = imagecreatetruecolor($tw, $th);
    imagealphablending($t, false);
    imagesavealpha($t, true);
    imagefill($t, 0, 0, imagecolorallocatealpha($t, 0, 0, 0, 127));
    imagecopyresampled($t, $img, 0, 0, 0, 0, $tw, $th, $w, $h);
    $found = false;
    for ($y = 0; $y < $th && !$found; $y++) {
        for ($x = 0; $x < $tw; $x++) {
            if (((imagecolorat($t, $x, $y) >> 24) & 0x7F) > 8) { $found = true; break; }
        }
    }
    imagedestroy($t);
    return $found;
}

/**
 * Şəkli yoxla, kiçilt və təmiz JPEG/PNG kimi yaz.
 * @param string $destNoExt  uzantısız hədəf yolu (uzantını funksiya seçir)
 * @return array{ok:bool, error?:string, ext?:string, path?:string, width?:int, height?:int}
 *   error: NOT_IMAGE | UNSUPPORTED | TOO_MANY_PIXELS | DECODE_FAILED | WRITE_FAILED
 */
function adminMediaReencode(string $src, string $destNoExt, int $maxEdge = ADMIN_MEDIA_MAX_EDGE): array {
    $info = @getimagesize($src);
    if ($info === false || empty($info[0]) || empty($info[1])) {
        return ['ok' => false, 'error' => 'NOT_IMAGE'];
    }
    [$w, $h, $type] = [(int) $info[0], (int) $info[1], (int) $info[2]];
    if (!in_array($type, [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
        return ['ok' => false, 'error' => 'UNSUPPORTED'];
    }
    if ($w * $h > ADMIN_MEDIA_MAX_PIXELS) {
        return ['ok' => false, 'error' => 'TOO_MANY_PIXELS'];
    }

    $img = match ($type) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($src),
        IMAGETYPE_PNG  => @imagecreatefrompng($src),
        IMAGETYPE_WEBP => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($src) : false,
    };
    if (!$img) return ['ok' => false, 'error' => 'DECODE_FAILED'];

    $alpha = $type !== IMAGETYPE_JPEG && adminMediaHasAlpha($img);

    $scale = min(1, $maxEdge / max($w, $h));
    $nw = max(1, (int) round($w * $scale));
    $nh = max(1, (int) round($h * $scale));

    $out = imagecreatetruecolor($nw, $nh);
    if ($alpha) {
        imagealphablending($out, false);
        imagesavealpha($out, true);
        imagefill($out, 0, 0, imagecolorallocatealpha($out, 0, 0, 0, 127));
    } else {
        /* Şəffaflıq yoxdursa JPEG — fon ağ (JPEG-də alfa yoxdur) */
        imagefill($out, 0, 0, imagecolorallocate($out, 255, 255, 255));
    }
    imagecopyresampled($out, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
    imagedestroy($img);

    $ext  = $alpha ? 'png' : 'jpg';
    $dest = $destNoExt . '.' . $ext;
    if ($alpha) {
        $ok = @imagepng($out, $dest, 8);
    } else {
        imageinterlace($out, true);
        $ok = @imagejpeg($out, $dest, ADMIN_MEDIA_JPEG_Q);
    }
    imagedestroy($out);

    if (!$ok || !is_file($dest)) {
        @unlink($dest);
        return ['ok' => false, 'error' => 'WRITE_FAILED'];
    }
    return ['ok' => true, 'ext' => $ext, 'path' => $dest, 'width' => $nw, 'height' => $nh];
}

/**
 * Müvəqqəti faylı məzmun hash-i ilə yerinə qoy. Eyni şəkil artıq varsa
 * müvəqqəti fayl silinir və mövcud ad qaytarılır.
 */
function adminMediaCommit(string $tmp, string $dir, string $ext): ?string {
    $hash = @sha1_file($tmp);
    if ($hash === false) { @unlink($tmp); return null; }
    $name = substr($hash, 0, 20) . '.' . $ext;
    if (is_file($dir . $name)) { @unlink($tmp); return $name; }
    if (!@rename($tmp, $dir . $name)) { @unlink($tmp); return null; }
    /* Veb server oxuya bilsin (hissəli poster 403 dərsi — media_store.php) */
    @chmod($dir . $name, 0644);
    return $name;
}
