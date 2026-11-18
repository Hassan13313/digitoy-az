<?php
/* Dəvətnamə linkinin önbaxış şəkli (2026-11-18) — php tests/seo_invite_image_test.php
   seoInviteImage() seo.php-dən götürülür (fayl require edilə bilməz — səhifəni çap edir). */
$ok = 0; $fail = 0;
function eq($label, $a, $b) { global $ok, $fail; if ($a === $b) $ok++; else { $fail++; echo "  FAIL $label → " . var_export($a, true) . "\n"; } }

$src = file_get_contents(__DIR__ . '/../public/seo.php');
if (!preg_match('/\nfunction seoInviteImage\(.*?\n\}/s', $src, $m)) { echo "FAIL: seoInviteImage tapılmadı\n"; exit(1); }
const SITE = 'https://digitoy.az';
eval($m[0]);
$dir = __DIR__ . '/../public/og';

eq('toy şablonu + toy', seoInviteImage(['tpl' => 'ivory-silk', 'type' => 'toy'], $dir), SITE . '/og/ivory-silk--toy.jpg');
eq('toy şablonu + nişan', seoInviteImage(['tpl' => 'ivory-silk', 'type' => 'nishan'], $dir), SITE . '/og/ivory-silk--nishan.jpg');
eq('boş növ = toy', seoInviteImage(['tpl' => 'ivory-silk', 'type' => ''], $dir), SITE . '/og/ivory-silk--toy.jpg');
eq('uyğunsuz növ → neytral', seoInviteImage(['tpl' => 'ivory-silk', 'type' => 'graduation'], $dir), SITE . '/og/ivory-silk--neutral.jpg');
eq('naməlum şablon → ümumi', seoInviteImage(['tpl' => 'yox-bele', 'type' => 'toy'], $dir), SITE . '/og-image.jpg');
eq('məlumat yoxdur → ümumi', seoInviteImage(null, $dir), SITE . '/og-image.jpg');
eq('yol hücumu təmizlənir', seoInviteImage(['tpl' => '../../etc/passwd', 'type' => 'toy'], $dir), SITE . '/og-image.jpg');

/* Hər mövcud qapaq üçün ən azı neytral şəkil var */
$missing = [];
foreach (glob(__DIR__ . '/../public/img/templates/*.webp') as $f) {
    $id = basename($f, '.webp');
    if (str_contains($id, '--')) continue;
    if (!is_file("$dir/$id--neutral.jpg")) $missing[] = $id;
}
eq('hər qapağın önizləməsi var', $missing, []);
foreach (glob("$dir/*.jpg") as $f) if (filesize($f) > 300 * 1024) { $fail++; echo "  FAIL çox böyük: " . basename($f) . "\n"; }

echo "$ok passed, $fail failed\n";
exit($fail ? 1 : 0);
