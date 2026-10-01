<?php
/* ══════════════════════════════════════════════════
   Açılış ekranı + «Bizim Hekayəmiz» override-larının server yoxlaması
   (Phase 45) — regression testləri.

   Serversiz işləyir:
       php tests/admin_content_rules_test.php

   Qoruduğu müqavilələr:
     1. Zibil/naməlum açar SƏSSİZCƏ atılır, heç nə qalmasa null qayıdır.
     2. Şəkil yalnız serverin öz fayl adıdır (host, data:, ../ rədd).
     3. Fəsil mətninin sətir sonları qorunur (dəvətnamədə pre-line).
     4. `ch` açarı `c<N>`-dir — JSON-a yazılanda obyekt qalır, massiv olmur.
     5. Emoji (stiker) yarıdan kəsilmir.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/../public/api/admin_content_rules.php';

$pass = 0; $fail = 0;
function check(string $name, bool $cond, string $extra = '') {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok   $name\n"; }
    else       { $fail++; echo "  FAIL $name" . ($extra ? " — $extra" : '') . "\n"; }
}

echo "açılış — boş və zibil\n";
check('null → null', acrOpening(null) === null);
check('boş massiv → null', acrOpening([]) === null);
check('naməlum açarlar → null', acrOpening(['zzz' => 1, 'text' => ['bogus' => ['az' => 'x']]]) === null);
check('auto rejimi saxlanılmır', acrOpening(['mono' => ['mode' => 'auto']]) === null);
check('naməlum rejim atılır', acrOpening(['mono' => ['mode' => 'script', 'value' => 'x']]) === null);

echo "\naçılış — monoqram\n";
check('boş monoqram', acrOpening(['mono' => ['mode' => 'none']]) === ['mono' => ['mode' => 'none']]);
$o = acrOpening(['mono' => ['mode' => 'text', 'value' => '  T & A  ']]);
check('mətn təmizlənir', ($o['mono']['value'] ?? null) === 'T & A', json_encode($o));
$o = acrOpening(['mono' => ['mode' => 'text', 'value' => str_repeat('Ə', 40)]]);
check('mətn 12 simvola kəsilir', mb_strlen($o['mono']['value'] ?? '') === 12);
$o = acrOpening(['mono' => ['mode' => 'sticker', 'value' => '💍']]);
check('stiker qəbul', ($o['mono']['value'] ?? null) === '💍');
$o = acrOpening(['mono' => ['mode' => 'sticker', 'value' => str_repeat('💍', 30)]]);
check('stiker kod nöqtəsi ilə kəsilir (emoji bütöv)',
    ($o['mono']['value'] ?? '') === str_repeat('💍', 16) && mb_check_encoding($o['mono']['value'], 'UTF-8'));
check('boş mətn rejimi atılır', acrOpening(['mono' => ['mode' => 'text', 'value' => '   ']]) === null);

$good = '/uploads/_admin/aytac-ve-niyaz-51eedb/0123456789abcdef0123.png';
$o = acrOpening(['mono' => ['mode' => 'image', 'image' => $good]]);
check('admin şəkli qəbul', ($o['mono']['image'] ?? null) === $good);
foreach ([
    'https://evil.example/x.png',
    'javascript:alert(1)',
    'data:image/png;base64,AAAA',
    '/uploads/_admin/../../api/config.php',
    '/uploads/_admin/slug/0123456789abcdef0123.php',
    '/uploads/_admin/slug/0123456789ABCDEF0123.png',
    "/uploads/_admin/slug/0123456789abcdef0123.png\n",
    '/uploads/_story/0123456789abcdef01234567/0123456789abcdef0123.jpg',
] as $bad) {
    check('monoqram şəkli rədd: ' . json_encode($bad), acrOpening(['mono' => ['mode' => 'image', 'image' => $bad]]) === null);
}

echo "\naçılış — mətnlər\n";
$o = acrOpening(['text' => [
    'cta'   => ['az' => "  Aç\x07 bunu  ", 'en' => '', 'xx' => 'no'],
    'kicker'=> ['ru' => str_repeat('я', 300)],
    'evil'  => ['az' => 'x'],
]]);
check('ağ siyahıdakı slot qalır', isset($o['text']['cta']) && isset($o['text']['kicker']));
check('naməlum slot atılır', !isset($o['text']['evil']));
check('nəzarət simvolu + boşluq təmizlənir', ($o['text']['cta']['az'] ?? null) === 'Aç bunu', json_encode($o['text']['cta'] ?? null));
check('boş dil saxlanılmır', !isset($o['text']['cta']['en']) && !isset($o['text']['cta']['xx']));
check('140 simvola kəsilir', mb_strlen($o['text']['kicker']['ru'] ?? '') === 140);
$o = acrOpening(['hide' => ['hint', 'hint', 'zzz', 5, 'cta']]);
check('hide: təkrarsız, yalnız slot', ($o['hide'] ?? null) === ['hint', 'cta'], json_encode($o));

echo "\nhekayə — mətnlər\n";
check('null → null', acrStory(null) === null);
check('zibil → null', acrStory(['text' => ['bogus' => ['az' => 'x']], 'ch' => 'x', 'add' => 'y']) === null);
$s = acrStory(['text' => ['title' => ['az' => 'Nağılımız'], 'endSub' => ['en' => 'See you']]]);
check('başlıq mətnləri', ($s['text']['title']['az'] ?? null) === 'Nağılımız' && ($s['text']['endSub']['en'] ?? null) === 'See you');

echo "\nhekayə — fəsil override-ları\n";
$s = acrStory(['ch' => [
    'c0'  => ['title' => ['az' => 'Tanışlıq'], 'text' => ['az' => "Birinci sətir\r\n\r\n\r\n\r\nİkinci   sətir"],
              'photos' => [1, 0, 1, 'javascript:x', $good, 9], 'date' => false, 'icon' => '💛', 'hide' => false],
    'c2'  => ['hide' => true],
    '0'   => ['title' => ['az' => 'rəqəm açar']],
    'c99' => ['title' => ['az' => 'çox böyük indeks']],
]]);
check('c0 və c2 qalır', isset($s['ch']['c0']) && isset($s['ch']['c2']));
check('rəqəm və böyük indeks açarı atılır', !isset($s['ch']['0']) && !isset($s['ch']['c99']));
check('sətir sonu qorunur, 3+ boş sətir 2-yə enir', ($s['ch']['c0']['text']['az'] ?? null) === "Birinci sətir\n\nİkinci sətir",
    json_encode($s['ch']['c0']['text']['az'] ?? null));
check('şəkillər: indeks + ünvan, təkrarsız, zibilsiz', ($s['ch']['c0']['photos'] ?? null) === [1, 0, $good],
    json_encode($s['ch']['c0']['photos'] ?? null));
check('date:false saxlanılır (gizlət)', ($s['ch']['c0']['date'] ?? null) === false);
check('hide:false saxlanılmır', !isset($s['ch']['c0']['hide']));
check('hide:true saxlanılır', ($s['ch']['c2']['hide'] ?? null) === true);
$enc = json_encode(['ch' => $s['ch']]);
check('JSON-da ch obyekt qalır', str_starts_with($enc, '{"ch":{"c0"'), $enc);
$s = acrStory(['ch' => ['c1' => ['photos' => []]]]);
check('boş şəkil siyahısı (hamısını gizlət) saxlanılır', ($s['ch']['c1']['photos'] ?? null) === []);

echo "\nhekayə — yeni fəsillər\n";
$s = acrStory(['add' => [
    ['id' => 'adm_x1', 'title' => ['az' => 'Yeni'], 'photos' => [0, $good, '/uploads/_story/0123456789abcdef01234567/0123456789abcdef0123.jpg'], 'hide' => true, 'date' => false],
    ['title' => ['az' => '']],
    ['id' => '<script>', 'text' => ['az' => 'Mətn']],
]]);
check('boş yeni fəsil atılır', count($s['add'] ?? []) === 2, json_encode($s['add'] ?? null));
check('yeni fəsildə indeks şəkli OLMUR', ($s['add'][0]['photos'] ?? null) === [$good, '/uploads/_story/0123456789abcdef01234567/0123456789abcdef0123.jpg']);
check('yeni fəsildə hide/date:false yoxdur', !isset($s['add'][0]['hide']) && !array_key_exists('date', $s['add'][0]));
check('etibarlı id qalır', ($s['add'][0]['id'] ?? null) === 'adm_x1');
check('etibarsız id əvəzlənir', ($s['add'][1]['id'] ?? null) === 'adm_1');
$many = array_fill(0, 30, ['title' => ['az' => 'x']]);
check('ən çox 12 yeni fəsil', count(acrStory(['add' => $many])['add']) === 12);

echo "\n$pass keçdi, $fail uğursuz\n";
exit($fail ? 1 : 0);
