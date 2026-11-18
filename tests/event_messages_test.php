<?php
/* Toy günü təbriki / rəy mesajları (2026-11-18) — php tests/event_messages_test.php (DB-siz) */
require __DIR__ . '/../public/api/event_messages_lib.php';
$ok = 0; $fail = 0;
function check($name, $cond) { global $ok, $fail; if ($cond) $ok++; else { $fail++; echo "  FAIL $name\n"; } }

$toy = ['eventType' => 'toy', 'groomName' => 'Murad', 'brideName' => 'Leyla', 'date' => '2026-11-18'];
check('cütlük adları', eventMsgNames($toy) === 'Murad və Leyla');
check('ad günü adı', eventMsgNames(['eventType' => 'birthday', 'brideName' => 'Zəhra']) === 'Zəhra');
check('korporativ ad', eventMsgNames(['eventType' => 'corporate', 'eventName' => 'Azercell']) === 'Azercell');

$c = buildCongratsText($toy, 'https://digitoy.az/invite/leyla-murad/foto');
check('təbrik: müraciət', str_starts_with($c, 'Hörmətli Murad və Leyla!'));
check('təbrik: toy günü', str_contains($c, 'toy gününüzü ürəkdən təbrik edirik'));
check('təbrik: foto linki', str_contains($c, '/invite/leyla-murad/foto'));
check('təbrik: linksiz (Premium deyil)', !str_contains(buildCongratsText($toy), 'http'));
check('xına mətni', str_contains(buildCongratsText(['eventType' => 'xina', 'brideName' => 'Aysel']), 'xına gecənizi'));
$r = buildReviewText($toy);
check('rəy: ilk ad', str_starts_with($r, 'Salam, Murad!'));
check('rəy: toyunuz', str_contains($r, 'toyunuz unudulmaz keçdi'));
check('adsız müraciət', str_starts_with(buildReviewText(['eventType' => 'toy']), 'Salam!'));

$rows = [
    ['code' => 'DT-AAAAAA', 'slug' => 's1', 'phone' => '+994501111111', 'fd' => $toy + ['date' => '2026-11-18'], 'gallery' => true,  'sent' => []],
    ['code' => 'DT-BBBBBB', 'slug' => 's2', 'phone' => '+994502222222', 'fd' => ['eventType' => 'nishan', 'groomName' => 'A', 'brideName' => 'B', 'date' => '2026-11-16'], 'gallery' => false, 'sent' => []],
    ['code' => 'DT-CCCCCC', 'slug' => 's3', 'phone' => '+994503333333', 'fd' => ['eventType' => 'toy', 'date' => '2026-11-13'], 'gallery' => false, 'sent' => []],
    ['code' => 'DT-DDDDDD', 'slug' => 's4', 'phone' => '+994504444444', 'fd' => ['eventType' => 'toy', 'date' => '2026-11-14'], 'gallery' => false, 'sent' => ['review' => '2026-11-16 10:00:00']],
    ['code' => 'DT-EEEEEE', 'slug' => 's5', 'phone' => '',              'fd' => ['eventType' => 'toy', 'date' => '2026-11-18'], 'gallery' => false, 'sent' => []],
    ['code' => 'DT-FFFFFF', 'slug' => 's6', 'phone' => '+994506666666', 'fd' => ['eventType' => 'toy', 'date' => '2026-11-05'], 'gallery' => false, 'sent' => []],
];
$due = eventMessagesDue($rows, '2026-11-18');
check('təbrik: yalnız bu gün', array_column($due['congrats'], 'code') === ['DT-AAAAAA']);
check('təbrik: Premium-da foto linki', str_contains($due['congrats'][0]['text'], '/invite/s1/foto'));
$rv = array_column($due['review'], 'code');
check('rəy: 2 gün sonra', in_array('DT-BBBBBB', $rv, true));
check('rəy: buraxılmış (5 gün) hələ siyahıda', in_array('DT-CCCCCC', $rv, true));
check('rəy: göndərilmiş gecikmiş siyahıdan çıxır', !in_array('DT-DDDDDD', $rv, true));
check('telefonsuz sifariş çıxmır', !in_array('DT-EEEEEE', array_column($due['congrats'], 'code'), true));
check('7 gündən köhnə çıxmır', !in_array('DT-FFFFFF', $rv, true));
$late = array_values(array_filter($due['review'], fn($x) => $x['code'] === 'DT-CCCCCC'))[0] ?? [];
check('gecikmiş rəy işarəsi', !empty($late['late']));

echo "$ok passed, $fail failed\n";
exit($fail ? 1 : 0);
