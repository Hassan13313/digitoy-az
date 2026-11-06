<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Qonaq albomunun saxlanma müddəti (2026-11)

   YALNIZ include edilir (api/.htaccess-də birbaşa giriş bağlıdır).

   QAYDA (məxfilik siyasəti §7 və istifadə şərtləri §5 ilə EYNİ — rəqəmlər
   src/data/legal/retention.js-dədir, tests/legal_content_test.mjs yoxlayır):
     • albom tədbir tarixindən ALBUM_KEEP_DAYS gün saxlanılır;
     • sifarişçiyə silinmədən ALBUM_NOTICE_DAYS gün əvvəl WhatsApp ilə xəbər
       verilir — admin «Xəbərdarlıq göndərildi» basır (gallery_notice_at);
     • xəbərdarlıq gecikibsə albom bildirişdən ən azı ALBUM_MIN_NOTICE_DAYS
       gün sonra silinir (gecikmə müştərinin vaxtından yeyilmir);
     • xəbərdarlıq qeydə alınmayıbsa albom HEÇ VAXT avtomatik silinmir;
     • sifarişçi əlavə ödənişlə müddəti uzada bilər (gallery_keep_until;
       ALBUM_FOREVER = müddətsiz). Uzadılanda köhnə xəbərdarlıq ləğv olunur —
       yeni tarixdən əvvəl yenidən xəbər verilməlidir.

   Yalnız uploads/<slug>/ (qonaq şəkil və videoları) silinir. Dəvətnamənin öz
   faylları (_admin/<slug>, _story, _music) və dəvətnamənin özü QALIR.
   Tarixlər Bakı vaxtı ilə gün dəqiqliyində müqayisə olunur.
   ══════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/purge_lib.php';

const ALBUM_KEEP_DAYS       = 30;
const ALBUM_NOTICE_DAYS     = 10;
const ALBUM_MIN_NOTICE_DAYS = 7;
const ALBUM_TZ              = 'Asia/Baku';
const ALBUM_FOREVER         = '9999-12-31';           /* müddətsiz saxlanma (ödənişli) */
const ALBUM_EXTEND_OPTIONS  = ['3m' => '+3 months', '6m' => '+6 months', '1y' => '+1 year'];

/** Bakı vaxtı ilə bugünkü tarix (Y-m-d) */
function albumToday(?int $now = null): string {
    return (new DateTimeImmutable('@' . ($now ?? time())))
        ->setTimezone(new DateTimeZone(ALBUM_TZ))->format('Y-m-d');
}

/** Düzgün Y-m-d tarixidirsə özünü, deyilsə null */
function albumValidDate($s): ?string {
    if (!is_string($s) || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', trim($s), $m)) return null;
    return checkdate((int) $m[2], (int) $m[3], (int) $m[1]) ? trim($s) : null;
}

function albumAddDays(string $ymd, int $days): string {
    return (new DateTimeImmutable($ymd . ' 00:00:00', new DateTimeZone('UTC')))
        ->modify(($days >= 0 ? '+' : '') . $days . ' days')->format('Y-m-d');
}

/** UTC 'Y-m-d H:i:s' (PHP-nin yazdığı) → Bakı tarixi */
function albumUtcToLocalDate(?string $utc): ?string {
    if (!is_string($utc) || $utc === '') return null;
    $t = strtotime($utc . ' UTC');
    return $t === false ? null : albumToday($t);
}

/**
 * Albomun cədvəli.
 * state: no_date | active | notice_due | notified | due | purged | forever
 * $extendUntil — ödənişli uzadılma tarixi (ALBUM_FOREVER → müddətsiz)
 * @return array{event:?string, keepUntil:?string, extended:bool, noticeFrom:?string, noticeAt:?string, deleteAt:?string, state:string}
 */
function albumSchedule(?string $event, ?string $noticeAtUtc, ?string $purgedAtUtc, string $today, ?string $extendUntil = null): array {
    $event       = albumValidDate($event);
    $extendUntil = albumValidDate($extendUntil);
    $keepUntil   = $event ? albumAddDays($event, ALBUM_KEEP_DAYS) : null;
    $extended    = $extendUntil !== null && ($keepUntil === null || $extendUntil > $keepUntil);
    if ($extended) $keepUntil = $extendUntil;
    if ($keepUntil === ALBUM_FOREVER && !$purgedAtUtc) {
        return ['event' => $event, 'keepUntil' => null, 'extended' => true, 'noticeFrom' => null,
                'noticeAt' => null, 'deleteAt' => null, 'state' => 'forever'];
    }
    $noticeFrom = $keepUntil ? albumAddDays($keepUntil, -ALBUM_NOTICE_DAYS) : null;
    $noticeAt   = albumUtcToLocalDate($noticeAtUtc);
    $deleteAt   = null;
    if ($noticeAt) {
        $earliest = albumAddDays($noticeAt, ALBUM_MIN_NOTICE_DAYS);
        $deleteAt = ($keepUntil && $keepUntil > $earliest) ? $keepUntil : $earliest;
    }

    if ($purgedAtUtc)    $state = 'purged';
    elseif ($deleteAt)   $state = $today >= $deleteAt ? 'due' : 'notified';
    elseif (!$event)     $state = 'no_date';
    else                 $state = $today >= $noticeFrom ? 'notice_due' : 'active';

    return compact('event', 'keepUntil', 'extended', 'noticeFrom', 'noticeAt', 'deleteAt', 'state');
}

/** form_data JSON → tədbir tarixi */
function albumEventDateOf(?string $formData): ?string {
    $fd = json_decode((string) $formData, true);
    return is_array($fd) ? albumValidDate($fd['date'] ?? null) : null;
}

/** Admin siyahısı üçün göstərilən ad (owner_panel.php ilə eyni qayda) */
function albumNamesOf(?string $formData): string {
    $fd  = json_decode((string) $formData, true);
    $fd  = is_array($fd) ? $fd : [];
    $str = fn ($k) => is_string($fd[$k] ?? null) ? trim($fd[$k]) : '';
    $type = $str('eventType');
    if (in_array($type, ['toy', 'nishan'], true)) {
        return implode(' & ', array_filter([$str('groomName'), $str('brideName')], 'strlen'));
    }
    return in_array($type, ['corporate', 'other'], true) ? $str('eventName') : $str('brideName');
}

/** Albom qovluğu (yalnız qonaq mediası) — təhlükəli slug → null */
function albumDir(string $uploads, string $slug): ?string {
    $dirs = purgeSlugDirs($uploads, $slug);
    return $dirs ? $dirs[0] : null;   /* [0] = uploads/<slug>; _admin və music toxunulmur */
}

/** Qovluqdakı fayl sayı və həcmi (alt qovluqsuz — albom düzdür) */
function albumDirStats(?string $dir): array {
    $files = 0; $bytes = 0;
    if ($dir && is_dir($dir) && !is_link($dir)) {
        foreach ((array) @scandir($dir, SCANDIR_SORT_NONE) as $f) {
            if ($f === '.' || $f === '..' || $f[0] === '.') continue;
            $p = $dir . '/' . $f;
            if (is_file($p) && !is_link($p)) { $files++; $bytes += (int) @filesize($p); }
        }
    }
    return ['files' => $files, 'mb' => round($bytes / 1048576, 1)];
}

/** Albom bağlanıbmı (silinib)? DB xətasında FAIL-OPEN — toy günü yükləmə dayanmasın. */
function albumIsClosed(PDO $db, string $slug): bool {
    try {
        $q = $db->prepare('SELECT gallery_purged_at FROM invitations WHERE slug = :s LIMIT 1');
        $q->execute([':s' => $slug]);
        return !empty($q->fetchColumn());
    } catch (Throwable $e) {
        return false;
    }
}

/** Dəvətnamənin albom sütunları (yoxdursa null) */
function albumRow(PDO $db, string $slug): ?array {
    try {
        $q = $db->prepare('SELECT slug, form_data, gallery_notice_at, gallery_purged_at, gallery_keep_until FROM invitations WHERE slug = :s LIMIT 1');
        $q->execute([':s' => $slug]);
        return $q->fetch() ?: null;
    } catch (Throwable $e) {
        return null;
    }
}

/** Sətirdən cədvəl */
function albumScheduleOf(array $row, string $today): array {
    return albumSchedule(albumEventDateOf($row['form_data'] ?? null),
        $row['gallery_notice_at'] ?? null, $row['gallery_purged_at'] ?? null, $today,
        $row['gallery_keep_until'] ?? null);
}

/**
 * Admin «Albom saxlama» siyahısı: mediası olan və ya xəbərdarlığı/silinməsi
 * qeydə alınmış albomlar, ən təcili birinci.
 */
function albumList(PDO $db, string $uploads, string $today): array {
    $rows = $db->query('SELECT slug, form_data, is_active, gallery_notice_at, gallery_purged_at, gallery_keep_until
                        FROM invitations ORDER BY id DESC')->fetchAll();
    $out = [];
    foreach ($rows as $r) {
        $stats = albumDirStats(albumDir($uploads, (string) $r['slug']));
        if ($stats['files'] === 0 && empty($r['gallery_notice_at']) && empty($r['gallery_purged_at'])) continue;
        $out[] = [
            'slug'     => $r['slug'],
            'names'    => albumNamesOf($r['form_data']),
            'active'   => (int) ($r['is_active'] ?? 1) === 1,
            'files'    => $stats['files'],
            'mb'       => $stats['mb'],
            'schedule' => albumScheduleOf($r, $today),
        ];
    }
    $rank = ['due' => 0, 'notice_due' => 1, 'notified' => 2, 'no_date' => 3, 'active' => 4, 'forever' => 5, 'purged' => 6];
    usort($out, fn ($a, $b) => [$rank[$a['schedule']['state']], $a['schedule']['keepUntil'] ?? '9999']
                           <=> [$rank[$b['schedule']['state']], $b['schedule']['keepUntil'] ?? '9999']);
    return $out;
}

/** «Xəbərdarlıq göndərildi» (undo → geri al). Silinmiş albomda dəyişmir. @return yenilənibmi */
function albumSetNotice(PDO $db, string $slug, bool $undo, ?int $now = null): bool {
    $sql = $undo
        ? 'UPDATE invitations SET gallery_notice_at = NULL WHERE slug = :s AND gallery_purged_at IS NULL'
        : 'UPDATE invitations SET gallery_notice_at = :t WHERE slug = :s AND gallery_purged_at IS NULL';
    $q = $db->prepare($sql);
    $q->execute($undo ? [':s' => $slug] : [':s' => $slug, ':t' => gmdate('Y-m-d H:i:s', $now ?? time())]);
    return $q->rowCount() > 0;
}

/**
 * Ödənişli uzadılma. $option: 3m | 6m | 1y | forever | clear.
 * Yeni tarix cari saxlanma tarixindən (keçibsə bu gündən) hesablanır; köhnə
 * xəbərdarlıq ləğv olunur. @return yenilənibmi
 */
function albumExtend(PDO $db, string $slug, string $option, string $today): bool {
    $row = albumRow($db, $slug);
    if (!$row || !empty($row['gallery_purged_at'])) return false;
    if ($option === 'clear') {
        $until = null;
    } elseif ($option === 'forever') {
        $until = ALBUM_FOREVER;
    } elseif (isset(ALBUM_EXTEND_OPTIONS[$option])) {
        $cur   = albumScheduleOf($row, $today)['keepUntil'];
        $from  = ($cur && $cur > $today) ? $cur : $today;
        $until = (new DateTimeImmutable($from))->modify(ALBUM_EXTEND_OPTIONS[$option])->format('Y-m-d');
    } else {
        return false;
    }
    $q = $db->prepare('UPDATE invitations SET gallery_keep_until = :u, gallery_notice_at = NULL WHERE slug = :s AND gallery_purged_at IS NULL');
    $q->execute([':u' => $until, ':s' => $slug]);
    return $q->rowCount() > 0;
}

/**
 * Vaxtı çatmış albomları sil (retention.php gündəlik çağırır).
 * Yalnız xəbərdarlığı qeydə alınmış VƏ silinmə tarixi keçmiş albomlar.
 * @return array{albums:int, files:int, mb:float}
 */
function albumPurgeDue(PDO $db, string $uploads, string $today, bool $dry, float $deadline, ?int $now = null): array {
    $out = ['albums' => 0, 'files' => 0, 'mb' => 0.0];
    $rows = $db->query('SELECT slug, form_data, gallery_notice_at, gallery_purged_at, gallery_keep_until FROM invitations
                        WHERE gallery_notice_at IS NOT NULL AND gallery_purged_at IS NULL')->fetchAll();
    foreach ($rows as $r) {
        if (microtime(true) > $deadline) break;
        if (albumScheduleOf($r, $today)['state'] !== 'due') continue;
        $slug = (string) $r['slug'];
        $dir  = albumDir($uploads, $slug);
        $safe = $dir && is_dir($dir) ? purgeSafePath($uploads, basename($dir)) : null;
        [$files, $bytes] = $safe ? purgeRmTree($safe, $dry) : [0, 0];
        $out['albums']++;
        $out['files'] += $files;
        $out['mb']    += round($bytes / 1048576, 1);
        if ($dry) continue;
        foreach (['media_flags', 'media_reactions'] as $t) {
            try { $db->prepare("DELETE FROM $t WHERE slug = :s")->execute([':s' => $slug]); }
            catch (Throwable $e) { /* cədvəl yoxdursa keç */ }
        }
        $db->prepare('UPDATE invitations SET gallery_purged_at = :t WHERE slug = :s')
           ->execute([':t' => gmdate('Y-m-d H:i:s', $now ?? time()), ':s' => $slug]);
    }
    return $out;
}
