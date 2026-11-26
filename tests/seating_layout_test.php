<?php
/* Oturma planı v52: tərəf, qrup, zal planı (2026-11-26) — php tests/seating_layout_test.php (DB-siz) */
require __DIR__ . '/../public/api/seating_owner_lib.php';
$ok = 0; $fail = 0;
function check($name, $cond) { global $ok, $fail; if ($cond) $ok++; else { $fail++; echo "  FAIL $name\n"; } }

/* Tərəf: forma və Excel yazılışları */
foreach (['bride', 'Qız evi', 'QIZ EVİ', 'qiz terefi', 'Gəlin tərəfi', 'q', 'Со стороны невесты'] as $v) check("tərəf «{$v}» → bride", seatSide($v) === 'bride');
foreach (['groom', 'Oğlan evi', 'OĞLAN EVİ', 'oglan', 'Bəy tərəfi', 'o', 'жених'] as $v) check("tərəf «{$v}» → groom", seatSide($v) === 'groom');
foreach (['', '  ', 'dost', null, ['x'], 5] as $v) check('tanınmayan tərəf → null', seatSide($v) === null);

/* Qrup */
check('qrup təmizlənir', seatGroup("  İş   yoldaşları ") === 'İş yoldaşları');
check('boş qrup → null', seatGroup('   ') === null);
check('qrup uzunluğu kəsilir', mb_strlen(seatGroup(str_repeat('ə', 100))) === SEAT_GROUP_MAX);

/* Zal planı */
$l = seatLayoutNormalize([
    'tables' => [
        ['name' => ' Masa 1 ', 'shape' => 'round', 'cap' => 10, 'x' => 13, 'y' => '31.5'],
        ['name' => 'masa 1', 'cap' => 4],                                  /* təkrar (böyük-kiçik hərf) */
        ['name' => 'Uzun masa', 'shape' => 'long', 'cap' => 999, 'x' => -5, 'y' => 'abc'],
        ['name' => ''], 'yanlış', ['name' => ['x']],
    ],
    'zones' => [
        ['id' => 1, 'label' => 'Səhnə', 'kind' => 'stage', 'x' => 50, 'y' => 6, 'w' => 36, 'h' => 7],
        ['id' => 1, 'label' => 'təkrar id'],
        ['id' => 2, 'label' => '<b>Musiqi</b>', 'kind' => 'hack', 'shape' => 'oval', 'w' => 0],
        ['id' => 3, 'label' => ''],
    ],
    'groups' => ['Ailə', 'Ailə', ' ', 'Dostlar'],
    'showMap' => 'true', 'showTablemates' => false,
]);
check('masalar: təkrar və boşlar atılır', array_column($l['tables'], 'name') === ['Masa 1', 'Uzun masa']);
check('masa yeri ədədə çevrilir', $l['tables'][0]['x'] === 13.0 && $l['tables'][0]['y'] === 31.5);
check('forma standart dəyirmi', $l['tables'][0]['shape'] === 'round' && $l['tables'][1]['shape'] === 'long');
check('tutum 1..60 aralığında', $l['tables'][1]['cap'] === 60);
check('yer 0..100, ədəd deyilsə null', $l['tables'][1]['x'] === 0.0 && $l['tables'][1]['y'] === null);
check('zonalar: təkrar id və boş ad atılır', array_column($l['zones'], 'id') === [1, 2]);
check('naməlum zona növü → custom', $l['zones'][1]['kind'] === 'custom' && $l['zones'][1]['shape'] === 'oval');
check('zona ölçüsü minimuma çəkilir', $l['zones'][1]['w'] === 3.0);
check('zona adı mətn kimi saxlanır (HTML-i ekranda React qaçırır)', $l['zones'][1]['label'] === '<b>Musiqi</b>');
check('qruplar təkrarsız', $l['groups'] === ['Ailə', 'Dostlar']);
check('showMap yalnız true olanda', $l['showMap'] === false);
check('showTablemates false saxlanır', $l['showTablemates'] === false);
$empty = seatLayoutNormalize(null);
check('boş plan: zonalar null (standart), masa yoldaşları görünür, xəritə yox',
    $empty['zones'] === null && $empty['tables'] === [] && $empty['showTablemates'] === true && $empty['showMap'] === false);
check('silinmiş bütün zonalar boş massiv qalır', seatLayoutNormalize(['zones' => []])['zones'] === []);
$many = seatLayoutNormalize(['tables' => array_map(fn($i) => ['name' => "M$i"], range(1, 400))]);
check('masa limiti', count($many['tables']) === SEAT_LAYOUT_TABLES_MAX);

/* Qonaqlara görünən hissə */
$pub = seatPublicSeating(null);
check('plan yoxdursa: masa yoldaşları görünür, xəritə yox', $pub === ['showTablemates' => true, 'showMap' => false, 'layout' => null]);
$pub = seatPublicSeating(['showMap' => true, 'showTablemates' => false, 'tables' => [['name' => 'Masa 1']], 'zones' => [], 'groups' => ['Ailə']]);
check('xəritə açıqdırsa yalnız masalar və zonalar verilir (qruplar yox)', $pub['layout'] === ['tables' => [['name' => 'Masa 1']], 'zones' => []] && $pub['showTablemates'] === false);
check('xəritə bağlıdırsa plan verilmir', seatPublicSeating(['showMap' => false, 'tables' => [['name' => 'X']]])['layout'] === null);

/* Toplu dəyişiklik */
check('id-lər təkrarsız və müsbət', seatIds([3, '3', 5, -1, 'x', 0, 7.5, '9']) === [3, 5, 9]);
check('id limiti', count(seatIds(range(1, 900))) === SEAT_BULK_MAX);
check('yamaq: yalnız göndərilən sahələr', seatPatch(['table_id' => ' Masa 2 ', 'side' => 'Qız evi']) === ['table_id' => 'Masa 2', 'side' => 'bride']);
check('yamaq: masadan çıxar və tərəfsiz', seatPatch(['table_id' => '', 'side' => '', 'group_name' => '']) === ['table_id' => '', 'side' => null, 'group_name' => null]);
check('yamaq: naməlum sahə atılır', seatPatch(['full_name' => 'x', 'invitation_id' => 'y']) === []);

/* Geri qaytarma planı */
$rows = json_encode([['id' => 4, 'table_id' => 'Masa 1', 'side' => null, 'group_name' => 'Ailə']]);
check('toplu dəyişikliyin tərsi', seatUndoPlan(['action' => 'bulk', 'guest_id' => null, 'before_json' => $rows]) === ['bulk', null, json_decode($rows, true)]);
$lb = json_encode(['layout' => null, 'guests' => [['id' => 4, 'table_id' => 'Masa 1']]]);
check('zal planının tərsi', seatUndoPlan(['action' => 'layout', 'guest_id' => null, 'before_json' => $lb])[0] === 'layout');

/* Endpoint və miqrasiya (mənbə yoxlaması) */
$cfg = file_get_contents(__DIR__ . '/../public/api/config.php');
check('sxem v52', str_contains($cfg, 'const SCHEMA_VERSION = 52;') && str_contains($cfg, 'CREATE TABLE IF NOT EXISTS seating_layouts'));
check('guests side / group_name sütunları', str_contains($cfg, "'side'       => 'VARCHAR(8)'") && str_contains($cfg, "'group_name' => 'VARCHAR(60)"));
$gg = file_get_contents(__DIR__ . '/../public/api/get_guests.php');
check('ictimai cavabda yalnız seatPublicSeating', str_contains($gg, "'seating' => seatPublicSeating(\$layout)"));
$pubBlock = substr($gg, strpos($gg, 'if ($role === null)'), 900);
check('ictimai cavabda tərəf və qrup yoxdur', !str_contains($pubBlock, "'side'") && !str_contains($pubBlock, "'group_name'"));
$mg = file_get_contents(__DIR__ . '/../public/api/manage_guest.php');
check('admin endpoint admin tələb edir', str_contains($mg, 'requireAdmin();'));
check('admin toplu/plan slug yoxlayır', str_contains($mg, 'isValidSlug($invId)'));
$os = file_get_contents(__DIR__ . '/../public/api/owner_seating.php');
check('müştəri toplu dəyişikliyi tarixçəyə yazılır', str_contains($os, "seatRecord(\$db, \$slug, 'bulk'"));
check('müştəri planı tarixçəyə yazılır', str_contains($os, "seatRecord(\$db, \$slug, 'layout'"));
$lib = file_get_contents(__DIR__ . '/../public/api/seating_layout_lib.php');
check('toplu yeniləmə yalnız bu dəvətnamədə', str_contains($lib, 'WHERE invitation_id = ? AND id IN'));
$ht = file_get_contents(__DIR__ . '/../public/api/.htaccess');
check('yeni kitabxana birbaşa açılmır', str_contains($ht, 'seating_layout_lib'));
$purge = file_get_contents(__DIR__ . '/../public/api/admin_purge.php');
check('dəvətnamə silinəndə zal planı da silinir', str_contains($purge, 'DELETE FROM seating_layouts WHERE invitation_id = :s'));

echo "$ok passed, $fail failed\n";
exit($fail ? 1 : 0);
