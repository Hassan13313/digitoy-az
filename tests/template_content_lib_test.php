<?php
/* Şablon səviyyəli məzmunun qaydaları (DB-siz). İşə salma: php tests/template_content_lib_test.php */
require_once __DIR__ . '/../public/api/template_content_lib.php';

$passed = 0; $failed = 0;
function ok(string $n, bool $c): void {
    global $passed, $failed;
    if ($c) { $passed++; return; }
    $failed++; echo "  FAIL  $n\n";
}

ok('tcKey: ad günü versiyası', tcKey('boarding-pass', 'birthday') === 'boarding-pass@birthday');
ok('tcKey: toyda əsas', tcKey('boarding-pass', 'toy') === 'boarding-pass');
ok('tcKey: nişanda əsas', tcKey('boarding-pass', 'nishan') === 'boarding-pass');
ok('tcKey: tək bölməli şablon', tcKey('royal-gold', 'birthday') === 'royal-gold');
ok('tcValidKey: düzgün', tcValidKey('boarding-pass') && tcValidKey('boarding-pass@birthday'));
foreach (['', 'x y', '../x', 'a@toy', 'A', "a\n", str_repeat('a', 61)] as $bad) ok('tcValidKey rədd: ' . $bad, !tcValidKey($bad));
ok('tcValidKey: massiv', !tcValidKey(['x']));

$c = tcForTemplate([
    'theme' => ['primary' => '#000000'],
    'labels' => ['hero' => ['kicker' => 'K', 'title' => ['az' => 'AD']], 'footer' => ['title' => ['az' => 'AD']], 'venue' => ['title' => ['az' => 'V']]],
    'opening' => ['text' => ['title' => ['az' => 'AD'], 'meta' => ['az' => 'T'], 'venue' => ['az' => 'M'], 'cta' => ['az' => 'AC']], 'hide' => ['hint']],
    'story' => ['text' => ['title' => ['az' => 'H']], 'ch' => ['c0' => []], 'add' => [[]]],
]);
ok('rəng qalır', $c['theme']['primary'] === '#000000');
ok('hero: üst etiket qalır, adlar yox', $c['labels']['hero'] === ['kicker' => 'K']);
ok('footer boş qaldı → atıldı', !isset($c['labels']['footer']));
ok('digər başlıq qalır', isset($c['labels']['venue']['title']));
ok('açılış: yalnız CTA', array_keys($c['opening']['text']) === ['cta']);
ok('açılış gizlətmə qalır', $c['opening']['hide'] === ['hint']);
ok('hekayə: yalnız mətn', array_keys($c['story']) === ['text']);

$e = tcForTemplate(['labels' => ['hero' => ['title' => ['az' => 'AD']]], 'opening' => ['text' => ['title' => ['az' => 'AD']]], 'story' => ['ch' => ['c0' => []]]]);
ok('yalnız şəxsi sahələr → tam boş', $e === []);

echo "\n$passed ok, $failed fail\n";
exit($failed ? 1 : 0);
