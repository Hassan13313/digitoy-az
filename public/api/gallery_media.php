<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — QALEREYA MEDİA QATI (Phase 43)

   NƏ ÜÇÜN BU FAYL: Phase 43-ə qədər qalereya manifestini QURAN kod yalnız
   `get_photos.php`-nin içində idi. Phase 43 eyni siyahını daha üç yerdən
   istəyir (canlı sayğac, slayd şou, analitika) və üç ayrı kopya qaçılmaz
   şəkildə bir-birindən sürüşərdi: qalereya 41 foto, sayğac 43 göstərərdi.
   Ona görə skan məntiqi BİR yerə köçürülüb.

   ⚠ DAVRANIŞ DƏYİŞMİR: `scanGalleryMedia()` içindəki qaydalar
   `get_photos.php`-dən HƏRFƏN götürülüb — eyni uzantılar, eyni törəmə fayl
   istisnaları (_thumb/_poster), eyni önizləmə seçimi, eyni sıralama.
   Element açarları (`id`, `url`, `thumbUrl`, `posterUrl`, `name`, `type`,
   `size`, `uploadedAt`, `source`) olduğu kimi qalır, yalnız Phase 43
   sahələri ƏLAVƏ olunur.

   ⚠ FAYL SİSTEMİ YEGANƏ HƏQİQƏTDİR. `photos` cədvəli sayğac üçündür,
   `media_flags`/`media_reactions` isə yalnız bəzəkdir — hər üçü boş olsa
   da qalereya tam işləyir.
══════════════════════════════════════════════════ */

/** Qalereyada media sayılan uzantılar (get_photos.php ilə EYNİ siyahı) */
const GALLERY_IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'];
const GALLERY_VIDEO_EXT = ['mp4', 'mov', 'quicktime'];

/** Qonağın seçə biləcəyi reaksiyalar — server tərəfli AĞ SİYAHI.
    Buradan kənar hər hansı emoji rədd edilir: DB-yə yalnız bu dörd
    dəyərdən biri düşür, yəni frontend heç vaxt naməlum simvol görməz. */
const GALLERY_REACTIONS = ['❤️', '😍', '👏', '🎉'];

function galleryUploadDir(string $slug): string {
    return __DIR__ . '/../uploads/' . $slug . '/';
}

function galleryBaseUrl(): string {
    return (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}

/** Fayl adı təhlükəsizdirmi? (delete_photo.php ilə eyni qayda) */
function isSafeMediaName($name): bool {
    return is_string($name)
        && $name !== ''
        && strpbrk($name, "/\\") === false
        && strpos($name, '..') === false
        && preg_match('/^[a-zA-Z0-9_\-\.]+$/', $name) === 1;
}

/** Qonaq kimliyi — brauzerdə yaradılan təsadüfi hex. Şəxsi məlumat DEYİL. */
function isValidVisitorId($id): bool {
    return is_string($id) && preg_match('/^[a-f0-9]{8,32}$/', $id) === 1;
}

/**
 * Qalereya manifestini fayl sistemindən qur.
 *
 * @return array{items:array, photos:int, videos:int, dirMtime:int}
 */
function scanGalleryMedia(string $slug): array {
    $uploadDir = galleryUploadDir($slug);
    $baseUrl   = galleryBaseUrl();
    $dirMtime  = is_dir($uploadDir) ? (int) @filemtime($uploadDir) : 0;

    $items  = [];
    $photos = 0;
    $videos = 0;

    if (!is_dir($uploadDir)) {
        return ['items' => [], 'photos' => 0, 'videos' => 0, 'dirMtime' => 0];
    }

    $allFiles = scandir($uploadDir);
    if ($allFiles === false) {
        return ['items' => [], 'photos' => 0, 'videos' => 0, 'dirMtime' => $dirMtime];
    }
    $fileSet = array_flip($allFiles);

    foreach ($allFiles as $file) {
        if ($file === '.' || $file === '..') continue;
        /* Törəmə fayllar ayrıca media kimi sayılmır — yalnız orijinala
           bağlı kiçik təsvirlərdir (_thumb: foto önizləməsi,
           _poster: videonun ilk kadrı) */
        if (substr($file, -10) === '_thumb.jpg')  continue;
        if (substr($file, -11) === '_poster.jpg') continue;

        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (!in_array($ext, array_merge(GALLERY_IMAGE_EXT, GALLERY_VIDEO_EXT))) continue;

        $isVideo = in_array($ext, GALLERY_VIDEO_EXT);
        $mime    = $isVideo ? ($ext === 'mov' ? 'video/quicktime' : 'video/mp4') : 'image/jpeg';
        $stat    = @stat($uploadDir . $file);

        /* Önizləmə seçimi:
             foto  → _thumb.jpg (480px)
             video → _poster.jpg (client tərəfdə çıxarılmış ilk kadr)
           İkisi də yoxdursa orijinala fallback (köhnə media) — heç nə pozulmur. */
        $base       = pathinfo($file, PATHINFO_FILENAME);
        $thumbFile  = $base . '_thumb.jpg';
        $posterFile = $base . '_poster.jpg';
        $hasThumb   = isset($fileSet[$thumbFile]);
        $hasPoster  = isset($fileSet[$posterFile]);

        /* ── Oxunmayan posteri özü düzəlt (2026-09-28) ──
           28.09-dək hissəli yükləmədə poster 0600 ilə qalırdı (bax
           media_store.php) və veb server ona 403 verirdi. Belə fayla rast
           gələndə icazə bir dəfə düzəldilir — əl ilə FTP/DirectAdmin
           əməliyyatı lazım deyil. Normal faylda yalnız bir stat-dır. */
        if ($hasPoster) {
            $pp   = $uploadDir . $posterFile;
            $perm = @fileperms($pp);
            if ($perm !== false && ($perm & 0004) === 0) @chmod($pp, 0644);
        }

        $preview = $hasThumb ? $thumbFile : ($hasPoster ? $posterFile : $file);

        if ($isVideo) $videos++; else $photos++;

        $items[] = [
            'id'         => $file,
            'url'        => $baseUrl . '/uploads/' . $slug . '/' . $file,
            'thumbUrl'   => $baseUrl . '/uploads/' . $slug . '/' . $preview,
            'posterUrl'  => $hasPoster ? ($baseUrl . '/uploads/' . $slug . '/' . $posterFile) : null,
            'name'       => $file,
            'type'       => $mime,
            'size'       => $stat ? (int) $stat['size'] : 0,
            'uploadedAt' => $stat ? date('Y-m-d H:i:s', $stat['mtime']) : '',
            'source'     => 'server',
        ];
    }

    /* Default sıralama — YENİDƏN KÖHNƏYƏ (Phase 39 davranışı) */
    usort($items, fn($a, $b) => strcmp($b['uploadedAt'], $a['uploadedAt']));

    return ['items' => $items, 'photos' => $photos, 'videos' => $videos, 'dirMtime' => $dirMtime];
}

/**
 * Yalnız SAYĞACLAR — manifest qurmadan.
 * Canlı sayğac endpoint-i hər 15–30 saniyədə çağırılır, ona görə burada
 * `stat()` ETMİRİK: sadəcə qovluq girişlərini süzüb sayırıq.
 *
 * @return array{photos:int, videos:int, total:int, dirMtime:int}
 */
function countGalleryMedia(string $slug): array {
    $uploadDir = galleryUploadDir($slug);
    $dirMtime  = is_dir($uploadDir) ? (int) @filemtime($uploadDir) : 0;
    $photos = 0;
    $videos = 0;

    if (is_dir($uploadDir)) {
        foreach ((array) scandir($uploadDir) as $file) {
            if ($file === '.' || $file === '..') continue;
            if (substr($file, -10) === '_thumb.jpg')  continue;
            if (substr($file, -11) === '_poster.jpg') continue;
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, GALLERY_VIDEO_EXT, true))      $videos++;
            elseif (in_array($ext, GALLERY_IMAGE_EXT, true))  $photos++;
        }
    }

    return [
        'photos'   => $photos,
        'videos'   => $videos,
        'total'    => $photos + $videos,
        'dirMtime' => $dirMtime,
    ];
}

/**
 * Seçilmiş media xəritəsi: filename => true.
 * ⚠ Cədvəl yoxdursa BOŞ massiv qaytarır — qalereya öz adi sırası ilə işləyir.
 */
function galleryFeaturedMap(string $slug): array {
    try {
        $st = getDB()->prepare(
            'SELECT filename FROM media_flags WHERE slug = :s AND featured = 1'
        );
        $st->execute([':s' => $slug]);
        $out = [];
        foreach ($st->fetchAll() as $r) $out[$r['filename']] = true;
        return $out;
    } catch (Throwable $e) {
        return [];
    }
}

/**
 * Reaksiya xəritəsi: filename => ['counts' => [emoji => n], 'total' => n, 'mine' => emoji|null]
 *
 * Bir sorğu, bir indeks (idx_react_media). Cədvəl boşdursa nəticə də boşdur
 * və qalereya reaksiya çubuqlarını sadəcə sıfır ilə göstərir.
 */
function galleryReactionMap(string $slug, ?string $visitorId = null): array {
    try {
        $st = getDB()->prepare(
            'SELECT filename, emoji, COUNT(*) AS cnt
               FROM media_reactions
              WHERE slug = :s
              GROUP BY filename, emoji'
        );
        $st->execute([':s' => $slug]);

        $out = [];
        foreach ($st->fetchAll() as $r) {
            $f = $r['filename'];
            if (!isset($out[$f])) $out[$f] = ['counts' => [], 'total' => 0, 'mine' => null];
            $out[$f]['counts'][$r['emoji']] = (int) $r['cnt'];
            $out[$f]['total'] += (int) $r['cnt'];
        }

        /* Qonağın öz seçimi — ayrıca kiçik sorğu (yalnız öz sətirləri) */
        if ($visitorId !== null && isValidVisitorId($visitorId)) {
            $mine = getDB()->prepare(
                'SELECT filename, emoji FROM media_reactions
                  WHERE slug = :s AND visitor_id = :v'
            );
            $mine->execute([':s' => $slug, ':v' => $visitorId]);
            foreach ($mine->fetchAll() as $r) {
                $f = $r['filename'];
                if (!isset($out[$f])) $out[$f] = ['counts' => [], 'total' => 0, 'mine' => null];
                $out[$f]['mine'] = $r['emoji'];
            }
        }

        return $out;
    } catch (Throwable $e) {
        return [];
    }
}

/**
 * ETag üçün yüngül versiya damğası.
 * Qovluq mtime-i reaksiya/seçim dəyişəndə DƏYİŞMİR (fayl əlavə olunmur),
 * ona görə şərti GET köhnə siyahını qaytarardı. Bu iki kiçik aqreqat
 * damğanı tamamlayır: `MAX(updated_at)` + `COUNT(*)`.
 */
function galleryMetaVersion(string $slug): string {
    $parts = [];
    foreach (['media_flags', 'media_reactions'] as $tbl) {
        try {
            $st = getDB()->prepare(
                "SELECT COUNT(*) AS c, COALESCE(MAX(updated_at), '0') AS m
                   FROM `$tbl` WHERE slug = :s"
            );
            $st->execute([':s' => $slug]);
            $row = $st->fetch();
            $parts[] = ($row['c'] ?? 0) . '@' . ($row['m'] ?? '0');
        } catch (Throwable $e) {
            $parts[] = 'na';
        }
    }
    return implode('|', $parts);
}

/**
 * Manifesti sırala. Mövcud sıralar TOXUNULMUR, yalnız yeni rejim əlavə olunur.
 *
 *   'newest'   — yenidən köhnəyə (DEFAULT, Phase 39 davranışı)
 *   'oldest'   — köhnədən yeniyə
 *   'featured' — seçilmişlər ƏVVƏLDƏ, sonra yenidən köhnəyə
 */
function sortGalleryItems(array $items, string $sort): array {
    if ($sort === 'oldest') {
        usort($items, fn($a, $b) => strcmp($a['uploadedAt'], $b['uploadedAt']));
        return $items;
    }
    if ($sort === 'featured') {
        usort($items, function ($a, $b) {
            $fa = !empty($a['featured']) ? 1 : 0;
            $fb = !empty($b['featured']) ? 1 : 0;
            if ($fa !== $fb) return $fb - $fa;                 /* seçilmiş öndə */
            return strcmp($b['uploadedAt'], $a['uploadedAt']); /* sonra yeni → köhnə */
        });
        return $items;
    }
    /* 'newest' — scanGalleryMedia() onsuz da bu sıradadır */
    return $items;
}
