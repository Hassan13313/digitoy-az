<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — «Bizim Hekayəmiz» şəkilləri: saxlama köməkçiləri (Phase 44)

   YALNIZ include edilir (api/.htaccess-də birbaşa giriş bağlıdır).
   Funksiyalar DB-yə və sorğuya toxunmur → tests/story_media_test.php
   onları serversiz yoxlayır.

   ── NƏ ÜÇÜN FAYL, form_data DEYİL ────────────────────────────────────────
   Phase 43-də şəkil data URI kimi `form_data`-nın İÇİNDƏ gedirdi. Fəsil
   başına çoxlu şəkil ilə bu üç yerdə sınır:
     • builder hər dəyişiklikdə formu sessionStorage-a yazır (~5 MB kvota),
     • hər 800 ms-dən bir bütün formu serverə göndərir (save_draft),
     • qonaq dəvətnaməni açanda BÜTÜN şəkilləri birdən endirir.
   İndi şəkil seçilən kimi bura yüklənir; formda yalnız qısa URL qalır.

   ── QOVLUQ ───────────────────────────────────────────────────────────────
   uploads/_story/<bucket>/<sha1>.jpg
     • `_story` — slug-da `_` ola bilmədiyi üçün heç bir qalereya ilə
       TOQQUŞMUR, qalereya skanı (get_photos) da bura baxmır.
     • <bucket> builder sessiyasının ID-sindən HASH-lə alınır. Sessiya ID-si
       draft-ı oxumaq üçün açardır (get_draft.php) — URL-də ÇİY görünsəydi
       dəvətnaməni açan hər kəs sifarişi oxuya bilərdi.
     • Fayl adı məzmunun hash-idir: eyni şəkil iki dəfə seçilsə disk
       ikinci nüsxə yaratmır.

   ── TƏHLÜKƏSİZLİK ────────────────────────────────────────────────────────
   Hər fayl GD ilə YENİDƏN KODLAŞDIRILIR (JPEG). Nəticədə:
     • EXIF/GPS və hər hansı gizli məzmun (polyglot) atılır,
     • diskə yalnız bizim yaratdığımız təmiz JPEG düşür, uzantı sabitdir.
   Dekoddan ƏVVƏL ölçülər başlıqdan oxunur: 40 MP-dan böyük «decompression
   bomb» GD-yə ümumiyyətlə verilmir.
   ══════════════════════════════════════════════════════════════════════ */

const STORY_MAX_EDGE     = 1400;               /* px — dəvətnamədə ən geniş xana ~430px @3x */
const STORY_JPEG_QUALITY = 84;
const STORY_MAX_UPLOAD   = 8 * 1024 * 1024;    /* client ~300 KB göndərir; ehtiyat */
const STORY_MAX_PIXELS   = 40000000;           /* 40 MP — başlıqdan yoxlanılır */
/* Bir builder sessiyasında diskə düşə biləcək fayl sayı. Dəvətnamə limiti
   40 şəkildir; dəyişdirilən/silinən şəkillər də qovluqda qalır, ona görə
   tavan bir qədər yüksəkdir. */
const STORY_BUCKET_CAP   = 120;

/** Builder sessiya ID-si: crypto.randomUUID() (36) və ya base36 ehtiyatı (~19).
    ⚠ `\z`, `$` DEYİL: `$` sondakı "\n"-i də qəbul edir. */
function isValidStorySid($sid): bool {
    return is_string($sid) && (bool) preg_match('/^[A-Za-z0-9-]{16,64}\z/', $sid);
}

/** Sessiya ID-sindən ictimai qovluq adı — geri çevrilmir. */
function storyBucket(string $sid): string {
    return substr(hash('sha256', 'digitoy-story|' . $sid), 0, 24);
}

function storyDir(string $bucket): string {
    return __DIR__ . '/../uploads/_story/' . $bucket . '/';
}

function storyPublicUrl(string $bucket, string $filename): string {
    return '/uploads/_story/' . $bucket . '/' . $filename;
}

/** Qovluqdakı hazır şəkillərin sayı (müvəqqəti fayllar sayılmır). */
function storyBucketCount(string $dir): int {
    if (!is_dir($dir)) return 0;
    $files = glob($dir . '*.jpg');
    return $files === false ? 0 : count($files);
}

/**
 * Şəkli yoxla, kiçilt və təmiz JPEG kimi yaz.
 *
 * @return array{ok:bool, error?:string, width?:int, height?:int}
 *   error: NOT_IMAGE | UNSUPPORTED | TOO_MANY_PIXELS | DECODE_FAILED | WRITE_FAILED
 */
function storyReencode(string $src, string $dest, int $maxEdge = STORY_MAX_EDGE): array {
    $info = @getimagesize($src);
    if ($info === false || empty($info[0]) || empty($info[1])) {
        return ['ok' => false, 'error' => 'NOT_IMAGE'];
    }
    [$w, $h, $type] = [(int) $info[0], (int) $info[1], (int) $info[2]];

    if (!in_array($type, [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
        return ['ok' => false, 'error' => 'UNSUPPORTED'];
    }
    if ($w * $h > STORY_MAX_PIXELS) {
        return ['ok' => false, 'error' => 'TOO_MANY_PIXELS'];
    }

    $img = match ($type) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($src),
        IMAGETYPE_PNG  => @imagecreatefrompng($src),
        IMAGETYPE_WEBP => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($src) : false,
    };
    if (!$img) return ['ok' => false, 'error' => 'DECODE_FAILED'];

    $scale = min(1, $maxEdge / max($w, $h));
    $nw = max(1, (int) round($w * $scale));
    $nh = max(1, (int) round($h * $scale));

    $out = imagecreatetruecolor($nw, $nh);
    /* Şəffaf PNG → ağ fon (JPEG-də alfa yoxdur, əks halda qara çıxır) */
    imagefill($out, 0, 0, imagecolorallocate($out, 255, 255, 255));
    imagecopyresampled($out, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
    imagedestroy($img);

    imageinterlace($out, true);   /* proqressiv JPEG — yavaş şəbəkədə tədricən açılır */
    $ok = @imagejpeg($out, $dest, STORY_JPEG_QUALITY);
    imagedestroy($out);

    if (!$ok || !is_file($dest)) {
        @unlink($dest);
        return ['ok' => false, 'error' => 'WRITE_FAILED'];
    }
    return ['ok' => true, 'width' => $nw, 'height' => $nh];
}

/* ── Builder musiqisi (Phase 44.3) ──────────────────────────────────────────
   Eyni problem MP3-də də var idi: builder faylı `slug` ilə yükləyirdi, amma
   dəvətnamə yalnız TƏSDİQDƏ yaranır və slug-a kod əlavə olunur. Phase 37-dən
   bəri upload_music.php mövcud olmayan slug-u 404 ilə rədd etdiyi üçün builder
   səssizcə `blob:` URL saxlayırdı — musiqi yalnız müştərinin öz brauzerində
   səslənirdi. İndi MP3 də sessiya qovluğuna düşür (uploads/_music/<bucket>/).
   Bucket duzu hekayədən FƏRQLİDİR: iki qovluq bir-birindən çıxarıla bilməz. */
const MUSIC_MAX_UPLOAD = 20 * 1024 * 1024;   /* MusicStep.MP3_MAX_BYTES ilə eyni */
/* Bir sessiyada diskə düşə biləcək MP3 sayı — dəvətnamədə bir musiqi olur,
   ehtiyat müştərinin fikrini bir neçə dəfə dəyişməsi üçündür. */
const MUSIC_BUCKET_CAP = 6;

function musicBucket(string $sid): string {
    return substr(hash('sha256', 'digitoy-music|' . $sid), 0, 24);
}

function musicDir(string $bucket): string {
    return __DIR__ . '/../uploads/_music/' . $bucket . '/';
}

function musicPublicPath(string $bucket, string $filename): string {
    return '/uploads/_music/' . $bucket . '/' . $filename;
}

function musicBucketCount(string $dir): int {
    if (!is_dir($dir)) return 0;
    $files = glob($dir . '*.mp3');
    return $files === false ? 0 : count($files);
}

/** Məzmun hash-indən fayl adı — eyni MP3 iki dəfə yüklənsə ikinci nüsxə yaranmır. */
function musicFileName(string $path): ?string {
    $hash = @sha1_file($path);
    return $hash === false ? null : substr($hash, 0, 20) . '.mp3';
}

/**
 * Yenidən kodlaşdırılmış müvəqqəti faylı məzmun hash-i ilə yerinə qoy.
 * Eyni şəkil artıq varsa müvəqqəti fayl silinir və mövcud ad qaytarılır.
 */
function storyCommit(string $tmp, string $dir): ?string {
    $hash = sha1_file($tmp);
    if ($hash === false) { @unlink($tmp); return null; }
    $name = substr($hash, 0, 20) . '.jpg';
    if (is_file($dir . $name)) { @unlink($tmp); return $name; }
    if (!@rename($tmp, $dir . $name)) { @unlink($tmp); return null; }
    /* Veb server oxuya bilsin — hissəli video posterlərindəki 403 dərsi
       (bax media_store.php). GD faylı umask ilə yaradır, bu ehtiyatdır. */
    @chmod($dir . $name, 0644);
    return $name;
}
