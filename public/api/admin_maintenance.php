<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Phase 37/39: Admin baxım endpointi

   GET  ?action=status            → backup vəziyyəti + draft/indeks sayğacları
   POST { action: 'cleanup_drafts' }  → vaxtı keçmiş draft-ları sil
   POST { action: 'reindex_media' }   → `photos` indeksini fayl sistemindən qur
   GET  ?action=audit&limit=N     → son admin əməliyyatları

   ⚠ HEÇ BİR MÖVCUD AXINA TOXUNMUR. Yeni fayldır, mövcud endpointlərin
   heç biri bundan asılı deyil — tamamilə additivdir.
   ⚠ BACKUP SİSTEMİ QURULMUR. Bu endpoint yalnız MÖVCUD vəziyyəti oxuyur;
   arxiv yaratmır, silmir, heç nəyi köçürmür.
══════════════════════════════════════════════════ */

@ini_set('max_execution_time', '300');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

requireAdmin();
ensureTables();
$db = getDB();

$method = $_SERVER['REQUEST_METHOD'];
$body   = $method === 'POST' ? (json_decode(file_get_contents('php://input'), true) ?: []) : [];
$action = trim($method === 'POST' ? ($body['action'] ?? '') : ($_GET['action'] ?? 'status'));

/* ── Sxem bayrağını oxu/yaz ── */
function metaGet(PDO $db, string $k): ?string {
    try {
        $st = $db->prepare("SELECT meta_value FROM schema_meta WHERE meta_key = :k LIMIT 1");
        $st->execute([':k' => $k]);
        $v = $st->fetchColumn();
        return $v === false ? null : (string) $v;
    } catch (Throwable $e) { return null; }
}
function metaSet(PDO $db, string $k, string $v): void {
    try {
        $st = $db->prepare(
            "INSERT INTO schema_meta (meta_key, meta_value) VALUES (:k, :v)
             ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value)"
        );
        $st->execute([':k' => $k, ':v' => $v]);
    } catch (Throwable $e) { /* bayraq köməkçidir */ }
}

/* ══════════════════════════════════════════════════
   BACKUP VƏZİYYƏTİ — yalnız müşahidə
   Bilinən yerlərdə arxiv faylı axtarır və ƏN YENİSİNİN tarixini qaytarır.
   Heç nə tapılmazsa dürüst cavab: 'unknown' — «backup var» iddiası etmirik.
   ══════════════════════════════════════════════════ */
function backupStatus(PDO $db): array {
    $candidates = [
        __DIR__ . '/../../backups',      /* public_html-dən kənar (tövsiyə olunan) */
        __DIR__ . '/../../backup',
        __DIR__ . '/../backups',
    ];
    $exts   = ['zip', 'gz', 'tgz', 'sql', 'tar'];
    $newest = 0;
    $found  = null;
    $count  = 0;

    foreach ($candidates as $dir) {
        if (!is_dir($dir)) continue;
        foreach ((array) @scandir($dir) as $f) {
            if ($f === '.' || $f === '..') continue;
            $path = $dir . '/' . $f;
            if (!is_file($path)) continue;
            if (!in_array(strtolower(pathinfo($f, PATHINFO_EXTENSION)), $exts, true)) continue;
            $count++;
            $m = (int) @filemtime($path);
            if ($m > $newest) { $newest = $m; $found = $f; }
        }
    }

    /* Xarici backup prosesi bu faylı yeniləyə bilər (əl ilə də olar) */
    $marker = __DIR__ . '/backup_state.json';
    if (is_file($marker)) {
        $m = (int) @filemtime($marker);
        if ($m > $newest) { $newest = $m; $found = 'backup_state.json'; }
    }

    if ($newest === 0) {
        return [
            'status'  => 'unknown',
            'message' => 'Backup tapılmadı. Avtomatik arxiv qurulmayıbsa, '
                       . 'media və baza qorunmur.',
            'last_at' => null, 'age_hours' => null, 'files' => 0, 'newest_file' => null,
        ];
    }

    $ageH = (int) floor((time() - $newest) / 3600);
    return [
        'status'      => $ageH <= 48 ? 'ok' : 'stale',
        'message'     => $ageH <= 48
                       ? 'Son backup ' . $ageH . ' saat əvvəl.'
                       : 'Son backup ' . (int) floor($ageH / 24) . ' gün əvvəl — köhnəlmiş sayılır.',
        'last_at'     => gmdate('c', $newest),
        'age_hours'   => $ageH,
        'files'       => $count,
        'newest_file' => $found,
    ];
}

/* ── uploads ölçüsü (kobud, yalnız birinci səviyyə qovluq sayı) ── */
function uploadsSummary(): array {
    $base = __DIR__ . '/../uploads/';
    if (!is_dir($base)) return ['albums' => 0, 'exists' => false];
    $dirs = (array) glob($base . '*', GLOB_ONLYDIR);
    return ['albums' => count($dirs), 'exists' => true];
}

/* ══════════════════════════════════════════════════
   MARŞRUTLAR
   ══════════════════════════════════════════════════ */

if ($method === 'GET' && $action === 'audit') {
    $limit = min(max((int) ($_GET['limit'] ?? 50), 1), 200);
    $st = $db->prepare("SELECT id, action, slug, actor, ip, detail, created_at
                        FROM admin_audit ORDER BY id DESC LIMIT :l");
    $st->bindValue(':l', $limit, PDO::PARAM_INT);
    $st->execute();
    echo json_encode(['ok' => true, 'entries' => $st->fetchAll()]);
    exit;
}

if ($method === 'GET' && $action === 'status') {
    /* Vaxtı keçmiş draft sayı — silinmir, yalnız sayılır */
    $expired = 0;
    try {
        $expired = (int) $db->query(
            "SELECT COUNT(*) FROM draft_invitations
             WHERE status = 'draft' AND expires_at < NOW()"
        )->fetchColumn();
    } catch (Throwable $e) { /* sxem köhnədirsə 0 qalır */ }

    $draftTotal  = (int) $db->query("SELECT COUNT(*) FROM draft_invitations")->fetchColumn();
    $photoRows   = (int) $db->query("SELECT COUNT(*) FROM photos")->fetchColumn();
    $mediaIndexed = metaGet($db, 'media_indexed') === '1';

    echo json_encode([
        'ok'     => true,
        'backup' => backupStatus($db),
        'drafts' => [
            'total'          => $draftTotal,
            'expired'        => $expired,
            'cleanup_needed' => $expired > 0,
        ],
        'media' => [
            'indexed'       => $mediaIndexed,
            'indexed_rows'  => $photoRows,
            'indexed_at'    => metaGet($db, 'media_indexed_at'),
            'uploads'       => uploadsSummary(),
        ],
        'schema_version' => (int) (metaGet($db, 'version') ?? 0),
    ]);
    exit;
}

if ($method === 'POST' && $action === 'cleanup_drafts') {
    /* ── Vaxtı keçmiş draft-ları sil ──
       ⚠ YALNIZ `status='draft'` olanlar. `submitted`, `approved`, `rejected`
       sifarişlər HEÇ VAXT silinmir — onlar biznes qeydidir.
       Partiya ilə (max 2000) ki, böyük cədvəldə uzun kilid tutmasın. */
    $st = $db->prepare(
        "DELETE FROM draft_invitations
         WHERE status = 'draft' AND expires_at < NOW()
         LIMIT 2000"
    );
    $st->execute();
    $deleted = $st->rowCount();

    $remaining = (int) $db->query(
        "SELECT COUNT(*) FROM draft_invitations WHERE status = 'draft' AND expires_at < NOW()"
    )->fetchColumn();

    adminAuditLog('drafts_cleanup', null, "deleted={$deleted} remaining={$remaining}");

    echo json_encode([
        'ok'        => true,
        'deleted'   => $deleted,
        'remaining' => $remaining,
        'message'   => $remaining > 0
                     ? "{$deleted} draft silindi. Daha {$remaining} qalıb — düyməni yenidən basın."
                     : "{$deleted} draft silindi. Təmizləmə tamamlandı.",
    ]);
    exit;
}

if ($method === 'POST' && $action === 'reindex_media') {
    /* ── `photos` indeksini fayl sistemindən qur ──
       BİR DƏFƏLİK əməliyyat: Phase 39-dan əvvəl yüklənmiş fayllar cədvəldə
       yoxdur. Qalereya bundan asılı deyil, ona görə yarımçıq qalsa da heç
       nə sınmır — düyməni yenidən basmaq kifayətdir. */
    $base = __DIR__ . '/../uploads/';
    if (!is_dir($base)) {
        echo json_encode(['ok' => true, 'indexed' => 0, 'message' => 'uploads qovluğu yoxdur.']);
        exit;
    }

    $mediaExts = ['jpg','jpeg','png','gif','webp','heic','mp4','mov'];
    $mimeMap   = [
        'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
        'gif' => 'image/gif',  'webp' => 'image/webp', 'heic' => 'image/heic',
        'mp4' => 'video/mp4',  'mov'  => 'video/quicktime',
    ];

    /* Mövcud sətirləri təkrarlamamaq üçün açar dəsti */
    $known = [];
    foreach ($db->query("SELECT slug, filename FROM photos")->fetchAll() as $r) {
        $known[$r['slug'] . '/' . $r['filename']] = true;
    }

    $ins = $db->prepare(
        'INSERT INTO photos (slug, url, filename, mime_type, file_size, uploaded_at)
         VALUES (:s, :u, :f, :m, :z, :t)'
    );

    $indexed = 0;
    $db->beginTransaction();
    try {
        foreach ((array) glob($base . '*', GLOB_ONLYDIR) as $albumDir) {
            $slug = basename($albumDir);
            if (!isValidSlug($slug)) continue;      /* `music` kimi xidməti qovluqlar */
            foreach ((array) glob($albumDir . '/*') as $file) {
                if (!is_file($file)) continue;
                $fn  = basename($file);
                $ext = strtolower(pathinfo($fn, PATHINFO_EXTENSION));
                if (!in_array($ext, $mediaExts, true)) continue;
                /* törəmələr sayılmır — dashboard onları da saymırdı */
                if (substr($fn, -10) === '_thumb.jpg' || substr($fn, -11) === '_poster.jpg') continue;
                if (isset($known[$slug . '/' . $fn])) continue;

                $ins->execute([
                    ':s' => $slug,
                    ':u' => '/uploads/' . $slug . '/' . $fn,
                    ':f' => $fn,
                    ':m' => $mimeMap[$ext] ?? 'application/octet-stream',
                    ':z' => (int) @filesize($file),
                    ':t' => date('Y-m-d H:i:s', (int) @filemtime($file) ?: time()),
                ]);
                $indexed++;
            }
        }
        $db->commit();
    } catch (Throwable $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'INDEX_FAILED', 'message' => 'İndeks qurula bilmədi: ' . $e->getMessage()]);
        exit;
    }

    metaSet($db, 'media_indexed', '1');
    metaSet($db, 'media_indexed_at', gmdate('c'));
    adminAuditLog('media_reindex', null, "indexed={$indexed}");

    $total = (int) $db->query("SELECT COUNT(*) FROM photos")->fetchColumn();
    echo json_encode([
        'ok'      => true,
        'indexed' => $indexed,
        'total'   => $total,
        'message' => "{$indexed} yeni media indeksləndi. Cəmi {$total} qeyd.",
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Unknown action']);
