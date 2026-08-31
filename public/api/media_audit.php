<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Media tutarlılıq auditi (YALNIZ OXUMA)

   GET /api/media_audit.php[?slug=<slug>]   (admin tələb olunur)

   ⚠ BU ENDPOINT HEÇ NƏ SİLMİR. Yalnız hesabat verir.
      Təmizləmə həmişə insan qərarı ilə, delete_photo.php üzərindən
      aparılmalıdır — avtomatik destruktiv əməliyyat YOXDUR.

   SOURCE OF TRUTH: FAYL SİSTEMİ (public/uploads/<slug>/).
   Qalereya (get_photos.php) qovluğu skan edir; `photos` DB cədvəli
   mövcuddur, amma qonaq qalereyası üçün heç kim ora yazmır — yəni o,
   ikinci bir həqiqət mənbəyi DEYİL. Bu audit hər ikisini tutuşdurur ki,
   fərq varsa görünsün.

   Aşkarlanan uyğunsuzluqlar:
     orphan_thumb   — _thumb.jpg / _poster.jpg var, orijinal media yoxdur
     missing_thumb  — şəkil var, thumbnail yoxdur (köhnə yükləmə; zərərsiz)
     zero_byte      — 0 baytlıq fayl (yarımçıq qalmış yükləmənin qalığı)
     unknown_ext    — qalereyanın tanımadığı uzantı (heç vaxt göstərilmir)
     db_only        — `photos` cədvəlində sətir var, faylı yoxdur
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'GET required']);
    exit;
}

$onlySlug = trim($_GET['slug'] ?? '');
if ($onlySlug !== '' && !preg_match('/^[a-z0-9\-]{2,120}$/', $onlySlug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}

$uploadsDir = __DIR__ . '/../uploads/';
$mediaExts  = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'mp4', 'mov'];

$report   = [];
$totals   = ['galleries' => 0, 'media' => 0, 'bytes' => 0, 'issues' => 0];

if (is_dir($uploadsDir)) {
    foreach (scandir($uploadsDir) as $slug) {
        if ($slug === '.' || $slug === '..') continue;
        if ($slug !== '' && $slug[0] === '_') continue;          /* _logs kimi xidməti qovluqlar */
        if (!preg_match('/^[a-z0-9\-]{2,120}$/', $slug)) continue;
        if ($onlySlug !== '' && $slug !== $onlySlug) continue;

        $dir = $uploadsDir . $slug . '/';
        if (!is_dir($dir)) continue;

        $files = array_values(array_diff(scandir($dir), ['.', '..']));
        $set   = array_flip($files);

        $issues     = [];
        $mediaCount = 0;
        $bytes      = 0;

        foreach ($files as $f) {
            $path = $dir . $f;
            if (!is_file($path)) continue;

            $size = (int) @filesize($path);
            $bytes += $size;
            $ext   = strtolower(pathinfo($f, PATHINFO_EXTENSION));

            $isThumb  = substr($f, -10) === '_thumb.jpg';
            $isPoster = substr($f, -11) === '_poster.jpg';

            if ($size === 0) {
                $issues[] = ['type' => 'zero_byte', 'file' => $f];
                continue;
            }

            if ($isThumb || $isPoster) {
                /* Törəmə faylın orijinalı hələ mövcuddurmu? */
                $stem  = $isThumb ? substr($f, 0, -10) : substr($f, 0, -11);
                $found = false;
                foreach ($mediaExts as $e) {
                    if (isset($set[$stem . '.' . $e])) { $found = true; break; }
                }
                if (!$found) {
                    $issues[] = ['type' => 'orphan_thumb', 'file' => $f, 'bytes' => $size];
                }
                continue;
            }

            if (!in_array($ext, $mediaExts, true)) {
                $issues[] = ['type' => 'unknown_ext', 'file' => $f, 'ext' => $ext];
                continue;
            }

            $mediaCount++;

            /* Şəkillərin thumbnail-i olmalıdır (köhnə yükləmələrdə olmaya bilər) */
            if (!in_array($ext, ['mp4', 'mov'], true)) {
                $stem = pathinfo($f, PATHINFO_FILENAME);
                if (!isset($set[$stem . '_thumb.jpg'])) {
                    $issues[] = ['type' => 'missing_thumb', 'file' => $f];
                }
            }
        }

        $totals['galleries']++;
        $totals['media']  += $mediaCount;
        $totals['bytes']  += $bytes;
        $totals['issues'] += count($issues);

        $report[] = [
            'slug'   => $slug,
            'media'  => $mediaCount,
            'mb'     => round($bytes / 1048576, 1),
            'issues' => $issues,
        ];
    }
}

/* ── DB tərəfi: `photos` cədvəlində sətri olub faylı olmayanlar ──
   Cədvəl hazırda istifadə edilmir; sətir varsa bu, keçmiş bir axının
   qalığıdır və bilinməlidir.

   getDB() bağlantı alınmayanda exit() edir (tutula bilmir), ona görə
   burada AYRICA PDO qurulur: MySQL sönsə belə fayl sistemi auditi —
   yəni əsas və HƏQİQİ mənbə — işləməyə davam edir. */
$dbOnly = [];
try {
    $db = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHAR,
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 3]
    );
    $rows = $db->query('SELECT slug, filename FROM photos LIMIT 5000')->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as $r) {
        $s = (string) $r['slug'];
        $f = basename((string) $r['filename']);
        if ($onlySlug !== '' && $s !== $onlySlug) continue;
        if (!preg_match('/^[a-z0-9\-]{2,120}$/', $s)) continue;
        if (!is_file($uploadsDir . $s . '/' . $f)) {
            $dbOnly[] = ['slug' => $s, 'filename' => $f];
        }
    }
} catch (Throwable $e) {
    $dbOnly = null;   /* null = yoxlanıla bilmədi (xəta deyil) */
}

if (is_array($dbOnly)) $totals['issues'] += count($dbOnly);

usort($report, fn($a, $b) => count($b['issues']) <=> count($a['issues']));

echo json_encode([
    'ok'              => true,
    'read_only'       => true,
    'source_of_truth' => 'filesystem',
    'generated_at'    => gmdate('c'),
    'totals'          => $totals,
    'db_only'         => $dbOnly,
    'galleries'       => $report,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
