<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Avtomatik məlumat təmizləmə (Phase 47)

   YALNIZ include edilir (api/.htaccess-də birbaşa giriş bağlıdır). config.php-ni
   ÇAĞIRAN qoşur; bu fayl yalnız funksiya və sabit təyin edir →
   tests/retention_test.php onu SQLite + müvəqqəti qovluqla yoxlayır.

   NƏ ÜÇÜN: Məxfilik siyasəti saxlama müddətlərini vəd edir, amma cron yoxdur
   və heç nə özü silinmirdi (açıq IP-lər, tərk edilmiş draft şəkilləri, köhnə
   loglar). Müddətlər src/data/legal/retention.js ilə EYNİ olmalıdır
   (tests/legal_content_test.mjs yoxlayır).

   ⚠ Sətir SİLİNMİR, yalnız şəxsi sahə NULL olur: admin_audit, gallery_events.
   ⚠ Draft faylı yalnız heç bir dəvətnamə/sifariş işlətmirsə VƏ fayl köhnədirsə
     silinir. Bucket brauzerə bağlıdır, sifarişə yox (story_media.php).
   ⚠ Cədvəl/sütun adları daxili sabitlərdir — istifadəçi girişi SQL-ə düşmür.
   ══════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/purge_lib.php';
require_once __DIR__ . '/story_media.php';

const RET_AUDIT_IP_DAYS   = 90;    /* admin_audit.ip → NULL */
const RET_GALLERY_IP_DAYS = 7;     /* gallery_events.ip_hash → NULL (təkrar yoxlaması yalnız bu günə baxır) */
const RET_TEMP_HOURS      = 24;    /* rate-limit və SEO keş faylları (ən uzun pəncərə 1 saat) */
const RET_MEDIA_LOG_DAYS  = 30;    /* api/_logs/media-YYYY-MM-DD.log */
const RET_DRAFT_DAYS      = 30;    /* toxunulmamış draft + onun öz hekayə/musiqi faylları */
const RET_ORPHAN_DAYS     = 90;    /* sahibsiz bucket — YALNIZ hesabat */
const RET_INTERVAL        = 86400; /* gündə ən çox bir dəfə */
const RET_BATCH_ROWS      = 2000;
const RET_MAX_FILES       = 5000;
const RET_MAX_DRAFTS      = 100;
const RET_TIME_BUDGET     = 20;    /* saniyə */

/** DB saatı ('Y-m-d H:i:s'). created_at DB-nin öz saat qurşağındadır — kəsim də ona görə hesablanır. */
function retentionDbNow(PDO $db): string {
    $sql = $db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite' ? "SELECT datetime('now')" : 'SELECT NOW()';
    return (string) $db->query($sql)->fetchColumn();
}

function retentionCut(string $dbNow, int $days): string {
    return gmdate('Y-m-d H:i:s', strtotime($dbNow . ' UTC') - $days * 86400);
}

/** Köhnə sətirlərdə şəxsi sahəni NULL et (sətir qalır). @return təsirlənən sətir sayı */
function retentionNullColumn(PDO $db, string $table, string $col, string $cut, bool $dry): int {
    $st = $db->prepare("SELECT id FROM $table WHERE $col IS NOT NULL AND created_at < :c ORDER BY id LIMIT " . RET_BATCH_ROWS);
    $st->execute([':c' => $cut]);
    $ids = array_map('intval', $st->fetchAll(PDO::FETCH_COLUMN));
    if (!$ids || $dry) return count($ids);
    return $db->exec("UPDATE $table SET $col = NULL WHERE id IN (" . implode(',', $ids) . ')');
}

/** Qovluqda adı $regex-ə TAM uyğun və $isOld($path, $match) deyən faylları sil.
    Symlink-ə toxunulmur; sistemin temp qovluğu böyük ola bilər → sıralanmadan, bir keçidlə. */
function retentionSweep(string $dir, string $regex, callable $isOld, bool $dry): int {
    if (!is_dir($dir)) return 0;
    $n = 0;
    foreach ((array) @scandir($dir, SCANDIR_SORT_NONE) as $name) {
        if ($n >= RET_MAX_FILES) break;
        if (!is_string($name) || !preg_match($regex, $name, $m)) continue;
        $p = $dir . '/' . $name;
        if (is_link($p) || !is_file($p) || !$isOld($p, $m)) continue;
        if ($dry || @unlink($p)) $n++;
    }
    return $n;
}

/** Sorğu limiti (digitoy_rl_) və önbaxış keşi (digitoy_seo_, digitoy_seo2_) — mtime-a görə. */
function retentionSweepTemp(string $dir, int $now, bool $dry): int {
    return retentionSweep($dir, '/^digitoy_(?:rl|seo2?)_[a-f0-9]{64}\.(?:json|txt)\z/',
        fn ($p) => $now - (int) @filemtime($p) >= RET_TEMP_HOURS * 3600, $dry);
}

/** media-YYYY-MM-DD.log — tarix fayl adından götürülür (mtime yazıla bilər). */
function retentionSweepMediaLogs(string $dir, int $now, bool $dry): int {
    $limit = gmdate('Y-m-d', $now - RET_MEDIA_LOG_DAYS * 86400);
    return retentionSweep($dir, '/^media-(\d{4}-\d{2}-\d{2})\.log\z/', fn ($p, $m) => $m[1] < $limit, $dry);
}

/** Bucket-dəki yalnız bizim yaratdığımız fayllar (məzmun hash-i və ya .tmp_). */
function retentionBucketFiles(string $uploads, string $sub, string $bucket): array {
    $out = [];
    foreach ((array) @scandir($uploads . '/' . $sub . '/' . $bucket) as $name) {
        if (is_string($name) && preg_match('/^(?:[a-f0-9]{20}\.(?:jpg|mp3)|\.tmp_[a-f0-9]{16}\.jpg)\z/', $name)) {
            $out[] = $sub . '/' . $bucket . '/' . $name;
        }
    }
    return $out;
}

/* Silinə bilən draft: göndərilməyib, 30 gün toxunulmayıb və vaxtı keçib.
   Status kartının sayı da, silmə də BU şərti işlədir. */
const RET_DRAFT_WHERE = "status = 'draft' AND updated_at < :c AND expires_at < :n";

function retentionDraftCount(PDO $db, ?string $dbNow = null): int {
    $now = $dbNow ?? retentionDbNow($db);
    $st  = $db->prepare('SELECT COUNT(*) FROM draft_invitations WHERE ' . RET_DRAFT_WHERE);
    $st->execute([':c' => retentionCut($now, RET_DRAFT_DAYS), ':n' => $now]);
    return (int) $st->fetchColumn();
}

/** Admin «draft təmizləmə» düyməsi üçün: real yollar və saatla bir partiya. */
function retentionPurgeDraftsNow(PDO $db): array {
    return retentionPurgeDrafts($db, __DIR__ . '/../uploads', retentionDbNow($db), time(), false,
                                microtime(true) + RET_TIME_BUDGET);
}

/**
 * 30 gündən çox toxunulmamış, vaxtı keçmiş draft-lar + onların ÖZ faylları.
 * Qoruyucular:
 *   A) eyni session_id-li başqa sətir (sifariş, dəvətnamə) varsa bucket siyahısına baxılmır;
 *   B) başqa dəvətnamə/sifariş işlədən fayl saxlanılır (purgeUnsharedRefs, «\/» daxil);
 *   C) fayl da 30 gündən köhnə olmalıdır (təkrar yükləmədə touch() edilir);
 *   D) DELETE şərtləri təkrarlanır — arada sətir dəyişibsə fayllara toxunulmur.
 * @return array{drafts:int, files:int}
 */
function retentionPurgeDrafts(PDO $db, string $uploads, string $dbNow, int $now, bool $dry, float $deadline): array {
    $cut = retentionCut($dbNow, RET_DRAFT_DAYS);
    $st  = $db->prepare('SELECT id, session_id, form_data FROM draft_invitations WHERE ' . RET_DRAFT_WHERE
                        . ' ORDER BY id LIMIT ' . RET_MAX_DRAFTS);
    $st->execute([':c' => $cut, ':n' => $dbNow]);
    $rows = $st->fetchAll();

    $same = $db->prepare('SELECT COUNT(*) FROM draft_invitations WHERE session_id = :s AND id <> :i');
    $del  = $db->prepare("DELETE FROM draft_invitations WHERE id = :i AND status = 'draft' AND updated_at < :c");
    $out  = ['drafts' => 0, 'files' => 0];

    foreach ($rows as $r) {
        if (microtime(true) > $deadline) break;
        $id  = (int) $r['id'];
        $sid = (string) $r['session_id'];
        $rels = purgeReferencedFiles(json_decode((string) $r['form_data'], true) ?: []);

        $same->execute([':s' => $sid, ':i' => $id]);
        if ((int) $same->fetchColumn() === 0 && isValidStorySid($sid)) {
            $rels = array_merge($rels,
                retentionBucketFiles($uploads, '_story', storyBucket($sid)),
                retentionBucketFiles($uploads, '_music', musicBucket($sid)));
        }

        /* Əvvəl ucuz yoxlama (fayl var və köhnədir), sonra bahalı LIKE axtarışı */
        $old = [];
        foreach (array_unique($rels) as $rel) {
            $p = purgeSafePath($uploads, $rel);
            if ($p !== null && is_file($p) && $now - (int) @filemtime($p) >= RET_DRAFT_DAYS * 86400) $old[$rel] = $p;
        }
        $paths = $old ? array_map(fn ($rel) => $old[$rel], purgeUnsharedRefs($db, array_keys($old), '', [$id])) : [];

        if ($dry) { $out['drafts']++; $out['files'] += count($paths); continue; }

        $del->execute([':i' => $id, ':c' => $cut]);
        if ($del->rowCount() !== 1) continue;
        $out['drafts']++;
        foreach ($paths as $p) {
            $out['files'] += purgeRmTree($p, false)[0];
            @rmdir(dirname($p));   /* yalnız boş qalıbsa silinir */
        }
    }
    return $out;
}

/** Heç bir draft sətrinə aid olmayan, 90 gündən köhnə bucket-lər — SİLİNMİR, yalnız sayılır. */
function retentionOrphanReport(PDO $db, string $uploads, int $now): array {
    $known = [];
    foreach ($db->query('SELECT DISTINCT session_id FROM draft_invitations')->fetchAll(PDO::FETCH_COLUMN) as $sid) {
        $known['_story/' . storyBucket((string) $sid)] = true;
        $known['_music/' . musicBucket((string) $sid)] = true;
    }
    $out = ['buckets' => 0, 'mb' => 0.0];
    $bytes = 0;
    foreach (['_story', '_music'] as $sub) {
        foreach ((array) @glob($uploads . '/' . $sub . '/*', GLOB_ONLYDIR) as $dir) {
            if (isset($known[$sub . '/' . basename($dir)])) continue;
            $size = 0;
            foreach ((array) @glob($dir . '/*') as $f) {
                if ($now - (int) @filemtime($f) < RET_ORPHAN_DAYS * 86400) continue 2;   /* təzə fayl var */
                $size += (int) @filesize($f);
            }
            $out['buckets']++;
            $bytes += $size;
        }
    }
    $out['mb'] = round($bytes / 1048576, 1);
    return $out;
}

/**
 * Bütün addımlar. Hər addım ayrıca try/catch-dədir: biri alınmasa digərləri işləyir.
 * $opt: dry, now, dbNow, uploads, tmp, logs (testlər üçün).
 */
function runRetention(PDO $db, array $opt = []): array {
    $dry      = !empty($opt['dry']);
    $now      = (int) ($opt['now'] ?? time());
    $dbNow    = (string) ($opt['dbNow'] ?? retentionDbNow($db));
    $uploads  = (string) ($opt['uploads'] ?? __DIR__ . '/../uploads');
    $tmp      = (string) ($opt['tmp'] ?? sys_get_temp_dir());
    $logs     = (string) ($opt['logs'] ?? __DIR__ . '/_logs');
    $deadline = microtime(true) + RET_TIME_BUDGET;

    $steps = [
        'audit_ip'   => fn () => retentionNullColumn($db, 'admin_audit', 'ip', retentionCut($dbNow, RET_AUDIT_IP_DAYS), $dry),
        'gallery_ip' => fn () => retentionNullColumn($db, 'gallery_events', 'ip_hash', retentionCut($dbNow, RET_GALLERY_IP_DAYS), $dry),
        'temp_files' => fn () => retentionSweepTemp($tmp, $now, $dry),
        'media_logs' => fn () => retentionSweepMediaLogs($logs, $now, $dry),
        'drafts'     => fn () => retentionPurgeDrafts($db, $uploads, $dbNow, $now, $dry, $deadline),
    ];
    /* Sahibsiz bucket hesabatı yalnız önizləmədə göstərilir — gündəlik işdə hesablanmır */
    if ($dry) $steps['orphans'] = fn () => retentionOrphanReport($db, $uploads, $now);
    $res = ['dry' => $dry];
    foreach ($steps as $k => $fn) {
        try { $res[$k] = $fn(); } catch (Throwable $e) { $res[$k] = 'error'; }
    }
    return $res;
}

/** Jurnal sətri. adminAuditLog() DEYİL: o, təsadüfən işə salan sorğunun IP-sini yazardı. */
function retentionLogRun(PDO $db, array $res): void {
    try {
        $db->prepare("INSERT INTO admin_audit (action, slug, actor, ip, detail)
                      VALUES ('retention_run', NULL, 'system:retention', NULL, :d)")
           ->execute([':d' => substr((string) json_encode($res, JSON_UNESCAPED_UNICODE), 0, 500)]);
    } catch (Throwable $e) { /* jurnal köməkçidir */ }
}

function retentionStampFresh(string $stamp, int $now): bool {
    return is_file($stamp) && $now - (int) @filemtime($stamp) < RET_INTERVAL;
}

/**
 * Gündə ən çox bir dəfə işlət. Əvvəl ucuz fayl yoxlaması, sonra DB-də optimistik
 * kilid (schema_meta.retention_last_run): eyni anda iki sorğudan yalnız biri işləyir.
 * dry → kilidsiz, jurnalsız, heç nə dəyişmir. force → 24 saat gözlənilmir.
 * @return nəticə və ya null (işləmədi)
 */
function maybeRunRetention(PDO $db, array $opt = []): ?array {
    if (!empty($opt['dry'])) return runRetention($db, $opt);

    $now   = (int) ($opt['now'] ?? time());
    $stamp = (string) ($opt['stamp'] ?? __DIR__ . '/_logs/retention.stamp');
    $force = !empty($opt['force']);
    if (!$force && retentionStampFresh($stamp, $now)) return null;

    $get = $db->prepare("SELECT meta_value FROM schema_meta WHERE meta_key = 'retention_last_run'");
    $get->execute();
    $old = $get->fetchColumn();
    if ($old === false) {
        try { $db->exec("INSERT INTO schema_meta (meta_key, meta_value) VALUES ('retention_last_run', '0')"); }
        catch (Throwable $e) { /* paralel sorğu artıq yaradıb */ }
        $get->execute();
        $old = $get->fetchColumn();
        if ($old === false) return null;
    }
    $old = (string) $old;
    if (!$force && $now - (int) $old < RET_INTERVAL) {
        if (is_dir(dirname($stamp))) @touch($stamp, (int) $old);
        return null;
    }
    $upd = $db->prepare("UPDATE schema_meta SET meta_value = :n WHERE meta_key = 'retention_last_run' AND meta_value = :o");
    $upd->execute([':n' => (string) $now, ':o' => $old]);
    if ($upd->rowCount() !== 1) return null;   /* başqa sorğu qabaqladı */

    if (!is_dir(dirname($stamp))) @mkdir(dirname($stamp), 0755, true);
    @touch($stamp, $now);
    $res = runRetention($db, $opt);
    retentionLogRun($db, $res);
    return $res;
}

/** Admin paneli üçün: son iş və müddətlər. */
function retentionStatus(PDO $db): array {
    $last = null;
    try {
        $st = $db->query("SELECT detail, created_at FROM admin_audit WHERE action = 'retention_run' ORDER BY id DESC LIMIT 1");
        if ($row = $st->fetch()) $last = ['at' => $row['created_at'], 'result' => json_decode((string) $row['detail'], true)];
    } catch (Throwable $e) { /* cədvəl yoxdursa null */ }
    return [
        'last'    => $last,
        'periods' => [
            'audit_ip_days'   => RET_AUDIT_IP_DAYS,
            'gallery_ip_days' => RET_GALLERY_IP_DAYS,
            'temp_hours'      => RET_TEMP_HOURS,
            'media_log_days'  => RET_MEDIA_LOG_DAYS,
            'draft_days'      => RET_DRAFT_DAYS,
        ],
    ];
}

/** Cavab göndəriləndən SONRA işlət — admin gözləmir. Möhür təzədirsə heç nə qeydə alınmır. */
function retentionScheduleAfterResponse(): void {
    if (retentionStampFresh(__DIR__ . '/_logs/retention.stamp', time())) return;
    register_shutdown_function(function () {
        ignore_user_abort(true);
        if (function_exists('fastcgi_finish_request')) fastcgi_finish_request();
        elseif (function_exists('litespeed_finish_request')) litespeed_finish_request();
        @set_time_limit(60);
        try { ensureTables(); maybeRunRetention(getDB()); } catch (Throwable $e) { /* növbəti dəfə */ }
    });
}
