<?php
/* ══════════════════════════════════════════════════
   Phase 40 — `i18n` birləşdirmə məntiqinin testi

   İşə salma:  php tests/i18n_merge_test.php
   DB TƏLƏB ETMİR.

   NƏ ÜÇÜN VAR: burada sınan bir dəyişiklik müştərinin əl ilə yazdığı
   EN/RU mətnləri SƏSSİZCƏ silir — məhz Phase 40-dan əvvəl baş verən xəta.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/../public/api/i18n_merge.php';

$passed = 0;
$failed = 0;

function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

function eq(string $label, $got, $exp): void {
    $same = json_encode($got, JSON_UNESCAPED_UNICODE) === json_encode($exp, JSON_UNESCAPED_UNICODE);
    ok($label, $same);
    if (!$same) {
        echo "       got: " . json_encode($got, JSON_UNESCAPED_UNICODE) . "\n";
        echo "       exp: " . json_encode($exp, JSON_UNESCAPED_UNICODE) . "\n";
    }
}

echo "\n── yastılaşdırma ──\n";
eq('flatten', i18nFlatten(['venueNote' => 'Hall 2', 'programSteps' => [0 => 'Guest Reception']]),
   ['venueNote' => 'Hall 2', 'programSteps.0' => 'Guest Reception']);
eq('unflatten', i18nUnflatten(['venueNote' => 'Hall 2', 'programSteps.0' => 'Guest Reception']),
   ['venueNote' => 'Hall 2', 'programSteps' => [0 => 'Guest Reception']]);

echo "\n── ƏSAS XƏTA: builder tərcüməni silməməlidir ──\n";
/* Builder `i18n` DAŞIMIR. Əvvəl bu hal saxlanılan tərcüməni tamamilə silirdi. */
$stored = [
    'venueName' => 'Gülüstan',
    'i18n'      => ['en' => ['venueNote' => 'Hall 2, 3rd floor']],
    'i18nMeta'  => ['en' => ['venueNote' => 'manual']],
];
$incoming = ['venueName' => 'Gülüstan', 'brideName' => 'Aytəkin'];
$m = mergeInvitationI18n($stored, $incoming);
eq('manual tərcümə qalır', $m['i18n'], ['en' => ['venueNote' => 'Hall 2, 3rd floor']]);
eq('meta qalır',           $m['i18nMeta'], ['en' => ['venueNote' => 'manual']]);
ok('digər sahələr builder-dən gəlir', ($m['brideName'] ?? '') === 'Aytəkin');

echo "\n── meta OLMAYAN köhnə (Phase 36) tərcümələr də qorunur ──\n";
$stored2 = ['i18n' => ['ru' => ['venueNote' => 'Зал 2']]];
$m2 = mergeInvitationI18n($stored2, ['i18n' => ['ru' => ['venueNote' => 'AVTOMATİK']], 'i18nMeta' => ['ru' => ['venueNote' => 'auto']]]);
eq('metasız sahə manual sayılır', $m2['i18n'], ['ru' => ['venueNote' => 'Зал 2']]);

echo "\n── 'auto' sahə builder-in yeni tərcüməsi ilə yenilənir ──\n";
$stored3 = [
    'i18n'     => ['en' => ['venueName' => 'Old Hall', 'venueNote' => 'Hall 2']],
    'i18nMeta' => ['en' => ['venueName' => 'auto',     'venueNote' => 'manual']],
];
$m3 = mergeInvitationI18n($stored3, ['i18n' => ['en' => ['venueName' => 'New Hall', 'venueNote' => 'IGNORED']]]);
eq('auto yenilənir, manual qalır', $m3['i18n'],
   ['en' => ['venueName' => 'New Hall', 'venueNote' => 'Hall 2']]);
eq('meta doğru qalır', $m3['i18nMeta'],
   ['en' => ['venueName' => 'auto', 'venueNote' => 'manual']]);

echo "\n── AZ mətn dəyişdi: köhnəlmiş 'auto' tərcümə ATILIR ──\n";
$stored4 = ['i18n' => ['en' => ['venueName' => 'Wedding Hall']], 'i18nMeta' => ['en' => ['venueName' => 'auto']]];
$m4 = mergeInvitationI18n($stored4, ['venueName' => 'Tamam başqa məkan']);
ok('köhnəlmiş auto silindi', !isset($m4['i18n']['en']['venueName']));
ok('boş qalan i18n ümumiyyətlə yazılmır', !isset($m4['i18n']));

echo "\n── proqram sətirləri indeks-indeks birləşir ──\n";
$stored5 = [
    'i18n'     => ['en' => ['programSteps' => [0 => 'Guest Reception', 1 => 'MY OWN TEXT']]],
    'i18nMeta' => ['en' => ['programSteps' => [0 => 'auto',            1 => 'manual']]],
];
$m5 = mergeInvitationI18n($stored5, [
    'i18n' => ['en' => ['programSteps' => [0 => 'Guest Arrival', 1 => 'Wedding Ceremony', 2 => 'Dinner']]],
]);
eq('0 auto→yeni, 1 manual→qalır, 2 yeni əlavə', $m5['i18n']['en']['programSteps'],
   [0 => 'Guest Arrival', 1 => 'MY OWN TEXT', 2 => 'Dinner']);

echo "\n── tərcüməsi olmayan dəvətnamə: heç bir açar əlavə edilmir ──\n";
$m6 = mergeInvitationI18n([], ['brideName' => 'Leyla']);
ok('i18n yaradılmır',     !array_key_exists('i18n', $m6));
ok('i18nMeta yaradılmır', !array_key_exists('i18nMeta', $m6));
eq('form_data toxunulmaz', $m6, ['brideName' => 'Leyla']);

echo "\n── xarab/gözlənilməz forma çökmür ──\n";
$m7 = mergeInvitationI18n(['i18n' => 'zibil'], ['i18n' => ['en' => ['venueNote' => 123]]]);
ok('sətir olmayan dəyər atılır', !isset($m7['i18n']));
$m8 = mergeInvitationI18n(['i18n' => ['de' => ['x' => 'y']]], []);
ok('naməlum dil daşınmır', !isset($m8['i18n']));

echo "\n" . str_repeat('─', 46) . "\n";
echo "  keçdi: $passed   uğursuz: $failed\n";
exit($failed > 0 ? 1 : 0);
