<?php
/* ══════════════════════════════════════════════════
   Phase 45.2 — WhatsApp/Telegram önbaxışının mətni (seo.php)

   İşə salma:  php tests/seo_invite_meta_test.php
   DB TƏLƏB ETMİR — `seoInviteMeta()` saf funksiyadır.

   Xəta: korporativ/digər/ad günü dəvətnaməsi paylaşılanda önbaxış
   «Toy Dəvətnaməsi» və «sizi toy mərasiminə dəvət edir» yazırdı.
   Toy üçün mətn əvvəlki ilə HƏRFBƏHƏRF eyni qalmalıdır.
   Brauzer tərəfi: tests/invite_seo_test.mjs.
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;

function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}
function eq(string $label, $a, $b): void {
    ok($label . ($a === $b ? '' : '  →  ' . var_export($a, true) . ' !== ' . var_export($b, true)), $a === $b);
}

/* seo.php require edilə bilməz (səhifəni çap edir) — funksiyanı mənbədən götürürük */
$src = file_get_contents(__DIR__ . '/../public/seo.php');
if (!preg_match('/\nfunction seoInviteMeta\(.*?\n\}/s', $src, $m)) {
    echo "FAIL: `seoInviteMeta` seo.php-də tapılmadı\n";
    exit(1);
}
eval($m[0]);

$tail = 'Rəqəmsal dəvətnaməyə baxın, İştirak Təsdiqi göndərin.';

/* Toy — əvvəlki çıxış */
[$t, $d] = seoInviteMeta(['type' => 'toy', 'groom' => 'Tural', 'bride' => 'Aysel', 'event' => '']);
eq('toy başlıq', $t, 'Tural & Aysel — Toy Dəvətnaməsi | DigiToy');
eq('toy təsvir', $d, "Tural & Aysel sizi toy mərasiminə dəvət edir. $tail");

[$t, $d] = seoInviteMeta(null);
eq('məlumat yoxdur → köhnə ümumi başlıq', $t, 'Toy Dəvətnaməsi | DigiToy');
eq('məlumat yoxdur → köhnə ümumi təsvir', $d, "Sizi toy mərasiminə dəvət edirik. $tail");

[$t] = seoInviteMeta(['type' => '', 'groom' => 'Tural', 'bride' => 'Aysel', 'event' => '']);
eq('növ boşdursa toy', $t, 'Tural & Aysel — Toy Dəvətnaməsi | DigiToy');

[$t, $d] = seoInviteMeta(['type' => 'nishan', 'groom' => 'Tural', 'bride' => 'Aysel', 'event' => '']);
eq('nişan başlıq', $t, 'Tural & Aysel — Nişan Dəvətnaməsi | DigiToy');
eq('nişan təsvir', $d, "Tural & Aysel sizi nişan mərasiminə dəvət edir. $tail");

[$t, $d] = seoInviteMeta(['type' => 'birthday', 'groom' => '', 'bride' => 'Leyla', 'event' => '']);
eq('ad günü başlıq', $t, 'Leyla — Ad Günü Dəvətnaməsi | DigiToy');
eq('ad günü təsvir', $d, "Leyla sizi ad gününə dəvət edir. $tail");

[$t, $d] = seoInviteMeta(['type' => 'corporate', 'groom' => '', 'bride' => '', 'event' => 'Əməkdaşlar Gecəsi']);
eq('korporativ başlıq', $t, 'Əməkdaşlar Gecəsi — Dəvətnamə | DigiToy');
eq('korporativ təsvir', $d, "Sizi «Əməkdaşlar Gecəsi» tədbirinə dəvət edirik. $tail");

[$t] = seoInviteMeta(['type' => 'other', 'groom' => '', 'bride' => '', 'event' => 'Ədəbiyyat Axşamı']);
eq('digər başlıq', $t, 'Ədəbiyyat Axşamı — Dəvətnamə | DigiToy');

[$t, $d] = seoInviteMeta(['type' => 'corporate', 'groom' => '', 'bride' => '', 'event' => '']);
eq('adsız korporativ başlıq', $t, 'Dəvətnamə | DigiToy');
ok('adsız korporativ təsvirdə «toy» yoxdur', stripos($d, 'toy') === false);

echo "\n$passed ok, $failed FAIL\n";
exit($failed ? 1 : 0);
