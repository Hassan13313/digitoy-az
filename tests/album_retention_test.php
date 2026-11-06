<?php
/* ══════════════════════════════════════════════════
   2026-11 — qonaq albomunun saxlanma müddəti (public/api/album_retention.php)

   İşə salma:  php tests/album_retention_test.php
   DB TƏLƏB ETMİR — SQLite yaddaşda + müvəqqəti qovluq.

   Qayda: tədbir + 30 gün; xəbərdarlıq 10 gün əvvəl; gec xəbərdarlıqda
   bildirişdən ən azı 7 gün; xəbərdarlıq yoxdursa HEÇ VAXT silinmir.
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

require_once __DIR__ . '/../public/api/album_retention.php';

echo "cədvəl\n";
$s = albumSchedule('2026-12-10', null, null, '2026-12-20');
ok('saxlanma = tədbir + 30 gün',                   $s['keepUntil'] === '2027-01-09');
ok('xəbərdarlıq tarixi = silinmədən 10 gün əvvəl',  $s['noticeFrom'] === '2026-12-30');
ok('xəbərdarlıqdan əvvəl: active',                  $s['state'] === 'active' && $s['deleteAt'] === null);
ok('xəbərdarlıq vaxtı çatıb: notice_due',           albumSchedule('2026-12-10', null, null, '2026-12-30')['state'] === 'notice_due');
ok('müddət keçsə də xəbərdarlıqsız silinmir',       albumSchedule('2026-12-10', null, null, '2027-06-01')['state'] === 'notice_due');

/* Vaxtında xəbərdarlıq (30 dekabr, Bakı) → silinmə 9 yanvar */
$s = albumSchedule('2026-12-10', '2026-12-30 08:00:00', null, '2027-01-05');
ok('vaxtında xəbərdarlıq: silinmə = saxlanma tarixi', $s['deleteAt'] === '2027-01-09' && $s['state'] === 'notified');
ok('silinmə günü: due',                              albumSchedule('2026-12-10', '2026-12-30 08:00:00', null, '2027-01-09')['state'] === 'due');

/* Gec xəbərdarlıq (6 yanvar) → bildirişdən 7 gün sonra, 13 yanvar */
$s = albumSchedule('2026-12-10', '2027-01-06 09:00:00', null, '2027-01-10');
ok('gec xəbərdarlıq: bildirişdən 7 gün sonra',       $s['deleteAt'] === '2027-01-13' && $s['state'] === 'notified');
/* Müddət çoxdan keçib, xəbərdarlıq bu gün → yenə 7 gün */
ok('köhnə albom: bu gün xəbər → 7 gün sonra',       albumSchedule('2026-01-01', '2026-11-06 10:00:00', null, '2026-11-06')['deleteAt'] === '2026-11-13');

/* Bakı vaxtı: UTC 21:00 = Bakıda növbəti gün 01:00 */
ok('UTC → Bakı tarixi',                             albumUtcToLocalDate('2026-12-29 21:00:00') === '2026-12-30');
ok('tarixsiz dəvətnamə: no_date',                   albumSchedule(null, null, null, '2026-12-01')['state'] === 'no_date');
ok('səhv tarix qəbul edilmir',                      albumValidDate('2026-02-30') === null && albumValidDate('abc') === null);
ok('silinmiş: purged',                              albumSchedule('2026-12-10', '2026-12-30 08:00:00', '2027-01-09 01:00:00', '2027-02-01')['state'] === 'purged');

echo "\nsilmə\n";
$db = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
$db->exec("CREATE TABLE invitations (id INTEGER PRIMARY KEY, slug TEXT, form_data TEXT, is_active INTEGER DEFAULT 1,
           gallery_notice_at TEXT, gallery_purged_at TEXT, gallery_keep_until TEXT)");
$db->exec("CREATE TABLE media_flags (slug TEXT, filename TEXT)");
$db->exec("CREATE TABLE media_reactions (slug TEXT, filename TEXT)");
$ins = $db->prepare('INSERT INTO invitations (slug, form_data, gallery_notice_at) VALUES (:s, :f, :n)');
$fd  = fn ($date) => json_encode(['eventType' => 'toy', 'groomName' => 'Ə', 'brideName' => 'Ş', 'date' => $date]);
$ins->execute([':s' => 'due-ve-album',    ':f' => $fd('2026-09-01'), ':n' => '2026-10-20 08:00:00']);   /* vaxtı keçib */
$ins->execute([':s' => 'nonotice-album',  ':f' => $fd('2026-09-01'), ':n' => null]);                    /* xəbər yoxdur */
$ins->execute([':s' => 'late-notice',     ':f' => $fd('2026-09-01'), ':n' => '2026-11-04 08:00:00']);   /* 11-də silinəcək */
$db->exec("INSERT INTO media_flags VALUES ('due-ve-album', 'a.jpg'), ('late-notice', 'b.jpg')");

$up = sys_get_temp_dir() . '/dt_album_' . bin2hex(random_bytes(4));
foreach (['due-ve-album', 'nonotice-album', 'late-notice', '_admin/due-ve-album'] as $d) {
    @mkdir("$up/$d", 0777, true);
    file_put_contents("$up/$d/1.jpg", str_repeat('x', 2048));
}
file_put_contents("$up/due-ve-album/1_thumb.jpg", 'x');

$today = '2026-11-06';
$dry = albumPurgeDue($db, $up, $today, true, microtime(true) + 10);
ok('dry run: yalnız vaxtı çatmış 1 albom',          $dry['albums'] === 1 && $dry['files'] === 2);
ok('dry run heç nə silmir',                         is_file("$up/due-ve-album/1.jpg"));

$res = albumPurgeDue($db, $up, $today, false, microtime(true) + 10, strtotime('2026-11-06 06:00:00 UTC'));
ok('vaxtı çatmış albom silindi',                    $res['albums'] === 1 && !is_dir("$up/due-ve-album"));
ok('dəvətnamənin öz faylları (_admin) qalır',       is_file("$up/_admin/due-ve-album/1.jpg"));
ok('xəbərdarlıqsız albom qalır',                    is_file("$up/nonotice-album/1.jpg"));
ok('gec xəbərdarlıq: 7 gün dolmayıb, qalır',        is_file("$up/late-notice/1.jpg"));
ok('silinmə tarixi qeydə alındı',                   $db->query("SELECT gallery_purged_at FROM invitations WHERE slug='due-ve-album'")->fetchColumn() === '2026-11-06 06:00:00');
ok('albomun DB izləri silindi, başqasınınkı qalır', (int) $db->query("SELECT COUNT(*) FROM media_flags WHERE slug='due-ve-album'")->fetchColumn() === 0
                                                    && (int) $db->query("SELECT COUNT(*) FROM media_flags WHERE slug='late-notice'")->fetchColumn() === 1);
ok('albom bağlıdır (yükləmə qəbul edilmir)',        albumIsClosed($db, 'due-ve-album') && !albumIsClosed($db, 'late-notice'));
ok('təkrar işə salma heç nə etmir',                 albumPurgeDue($db, $up, $today, false, microtime(true) + 10)['albums'] === 0);
ok('7 gün dolanda gec xəbərdarlıqlı albom da silinir', albumPurgeDue($db, $up, '2026-11-11', false, microtime(true) + 10)['albums'] === 1 && !is_dir("$up/late-notice"));

echo "\nxəbərdarlıq\n";
ok('xəbərdarlıq qeydə alınır',                      albumSetNotice($db, 'nonotice-album', false, strtotime('2026-11-06 07:00:00 UTC')));
ok('geri alınır',                                   albumSetNotice($db, 'nonotice-album', true) && albumRow($db, 'nonotice-album')['gallery_notice_at'] === null);
ok('silinmiş albomda dəyişmir',                     !albumSetNotice($db, 'due-ve-album', true));

$list = albumList($db, $up, '2026-11-06');
ok('siyahıda mediası və ya qeydi olan albomlar',    count($list) === 3);
ok('silinmiş albom siyahının sonundadır',           end($list)['slug'] === 'due-ve-album' && end($list)['schedule']['state'] === 'purged');
ok('ad toy üçün bəy & gəlin',                       $list[0]['names'] === 'Ə & Ş');
ok('təhlükəli slug üçün qovluq yoxdur',             albumDir($up, '../etc') === null && albumDir($up, 'music') === null);

foreach (['_admin/due-ve-album', '_admin', 'nonotice-album'] as $d) { @unlink("$up/$d/1.jpg"); @rmdir("$up/$d"); }
@rmdir($up);

echo "\nödənişli uzadılma\n";
$s = albumSchedule('2026-12-10', null, null, '2027-01-05', '2027-04-09');
ok('uzadılıb: saxlanma yeni tarixə keçir',              $s['keepUntil'] === '2027-04-09' && $s['extended'] && $s['state'] === 'active');
ok('uzadılmada xəbərdarlıq yeni tarixdən 10 gün əvvəl', $s['noticeFrom'] === '2027-03-30');
ok('müddətsiz: forever, silinmir',                      albumSchedule('2026-01-01', '2026-02-01 08:00:00', null, '2030-01-01', ALBUM_FOREVER)['state'] === 'forever');
ok('əvvəlki tarix uzadılma sayılmır',                   albumSchedule('2026-12-10', null, null, '2026-12-20', '2026-12-15')['extended'] === false);

$db->prepare("INSERT INTO invitations (slug, form_data, gallery_notice_at) VALUES ('ext-album', :f, '2026-11-25 08:00:00')")->execute([':f' => $fd('2026-11-01')]);
@mkdir("$up/ext-album", 0777, true);
file_put_contents("$up/ext-album/1.jpg", 'x');
ok('3 ay uzadılır (cari saxlanma tarixindən)',          albumExtend($db, 'ext-album', '3m', '2026-11-26') && albumRow($db, 'ext-album')['gallery_keep_until'] === '2027-03-01');
ok('uzadılanda köhnə xəbərdarlıq ləğv olunur',          albumRow($db, 'ext-album')['gallery_notice_at'] === null);
ok('müddətsiz saxlanma',                                albumExtend($db, 'ext-album', 'forever', '2026-11-26') && albumScheduleOf(albumRow($db, 'ext-album'), '2026-11-26')['state'] === 'forever');
albumSetNotice($db, 'ext-album', false);
ok('müddətsiz albom xəbərdarlıqla da silinmir',         albumPurgeDue($db, $up, '2031-01-01', false, microtime(true) + 10)['albums'] === 0 && is_file("$up/ext-album/1.jpg"));
ok('uzadılma ləğvi',                                    albumExtend($db, 'ext-album', 'clear', '2026-11-26') && albumRow($db, 'ext-album')['gallery_keep_until'] === null);
ok('naməlum seçim rədd edilir',                         !albumExtend($db, 'ext-album', '5y', '2026-11-26'));
ok('silinmiş albom uzadılmır',                          !albumExtend($db, 'due-ve-album', '1y', '2026-11-26'));
@unlink("$up/ext-album/1.jpg"); @rmdir("$up/ext-album"); @rmdir($up);

echo "\n$passed keçdi, $failed uğursuz\n";
exit($failed === 0 ? 0 : 1);
