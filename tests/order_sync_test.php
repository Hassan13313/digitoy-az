<?php
/* Sifariş ↔ Dəvətnamə sinxronluğu (2026-11-18) — DB-siz test
   php tests/order_sync_test.php */
require __DIR__ . '/../public/api/order_sync.php';
require __DIR__ . '/../public/api/i18n_merge.php';

$ok = 0; $fail = 0;
function check($name, $cond) { global $ok, $fail; if ($cond) $ok++; else { $fail++; echo "  FAIL $name\n"; } }

$stored = [
    'brideName' => 'Leyla', 'groomName' => 'Murad',
    'admin'    => ['theme' => ['accent' => '#b08d57'], 'labels' => ['program' => ['az' => 'Gecənin axışı']]],
    'sections' => ['lovestory' => true],
    'i18n'     => ['en' => ['venueName' => 'Ulduz Hall']],
    'i18nMeta' => ['en' => ['venueName' => 'manual']],
];
/* Sifarişin köhnə nüsxəsi: admin açarı yoxdur, adlar köhnədir */
$staleDraft = ['brideName' => 'Leyla', 'groomName' => 'Murad', 'sections' => ['lovestory' => true], 'venueName' => 'Ulduz'];

$m = preserveAdminOwnedKeys($stored, mergeInvitationI18n($stored, $staleDraft));
check('admin düzəlişləri qorunur', ($m['admin']['theme']['accent'] ?? '') === '#b08d57');
check('admin başlıqları qorunur', ($m['admin']['labels']['program']['az'] ?? '') === 'Gecənin axışı');
check('manual tərcümə qorunur', ($m['i18n']['en']['venueName'] ?? '') === 'Ulduz Hall');
check('gələn sahələr yazılır', ($m['venueName'] ?? '') === 'Ulduz');

/* Builder dəvətnamənin hazırkı halını açıb admin açarını özü gətirirsə — onunku qalır */
$fromBuilder = $stored; $fromBuilder['admin'] = ['theme' => ['accent' => '#000000']];
$m2 = preserveAdminOwnedKeys($stored, $fromBuilder);
check('builder-in gətirdiyi admin dəyəri üstündür', $m2['admin']['theme']['accent'] === '#000000');

/* Heç nə silinmir: saxlananda admin yoxdursa gələnə əlavə edilmir */
$m3 = preserveAdminOwnedKeys(['brideName' => 'A'], ['brideName' => 'B']);
check('admin olmayanda açar yaranmır', !array_key_exists('admin', $m3) && $m3['brideName'] === 'B');

/* get_draft / save_invitation həqiqətən kitabxananı işlədir */
$gd = file_get_contents(__DIR__ . '/../public/api/get_draft.php');
check('get_draft dəvətnamənin halını qaytarır', str_contains($gd, "'invitation_form_data'") && str_contains($gd, 'invitationFormDataBySlug'));
$si = file_get_contents(__DIR__ . '/../public/api/save_invitation.php');
check('save_invitation admin açarını qoruyur', str_contains($si, 'preserveAdminOwnedKeys($stored, $merged)'));
check('save_invitation sifariş nüsxəsini yeniləyir', substr_count($si, 'mirrorInvitationToDraft($db, $draftCode, $data)') === 2);
$od = file_get_contents(__DIR__ . '/../src/components/admin/AdminOrderDetail.jsx');
check('təsdiq mövcud dəvətnaməni üstündən yazmır', str_contains($od, 'draft?.approved_slug && draft?.invitation_form_data'));
$ht = file_get_contents(__DIR__ . '/../public/api/.htaccess');
check('order_sync.php birbaşa açılmır', str_contains($ht, 'order_sync|'));

echo "$ok passed, $fail failed\n";
exit($fail ? 1 : 0);
