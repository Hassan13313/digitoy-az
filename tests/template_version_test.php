<?php
/* ══════════════════════════════════════════════════
   2026-10-28 — şablon versiyası qaydalarının testi

   İşə salma:  php tests/template_version_test.php
   DB TƏLƏB ETMİR.

   NƏ ÜÇÜN VAR: burada sınan bir dəyişiklik ya təsdiqlənmiş dəvətnaməni
   müştərinin razılığı olmadan yeni dizayna keçirir (sifariş sinxronu,
   builder datası açarı daşımır), ya da yeni sifarişi köhnə dizaynda açır.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/../public/api/i18n_merge.php';
require_once __DIR__ . '/../public/api/template_version.php';

$passed = 0;
$failed = 0;

function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

$fd = ['templateId' => 'boarding-pass', 'brideName' => 'Aysel'];

/* ── yeni sətir ── */
ok('INSERT: açar yoxdursa 2 yazılır', tvForSave($fd, null)['templateVersion'] === 2);
ok('INSERT: açıq 1 qəbul olunur (admin seçimi)', tvForSave($fd + ['templateVersion' => 1], null)['templateVersion'] === 1);

/* ── yeniləmə ── */
ok('UPDATE: köhnə sətir (açarsız) + açarsız data → açar YARANMIR (köhnə qalır)',
    !array_key_exists('templateVersion', tvForSave($fd, ['brideName' => 'x'])));
ok('UPDATE: saxlanılmış 1 qorunur', tvForSave($fd, ['templateVersion' => 1])['templateVersion'] === 1);
ok('UPDATE: saxlanılmış 2 qorunur (sifariş sinxronu yeni dəvətnaməni köhnəyə qaytarmır)',
    tvForSave($fd, ['templateVersion' => 2])['templateVersion'] === 2);
ok('UPDATE: açıq dəyər saxlanılanı əvəz edir', tvForSave($fd + ['templateVersion' => 2], ['templateVersion' => 1])['templateVersion'] === 2);
ok('UPDATE: string "2" normallaşır', tvForSave($fd + ['templateVersion' => '2'], [])['templateVersion'] === 2);
ok('UPDATE: yanlış dəyər atılır, saxlanılan qalır', tvForSave($fd + ['templateVersion' => 7], ['templateVersion' => 1])['templateVersion'] === 1);
ok('UPDATE: yanlış saxlanılan dəyər köçürülmür', !array_key_exists('templateVersion', tvForSave($fd, ['templateVersion' => 'abc'])));
ok('digər sahələrə toxunulmur', tvForSave($fd, null)['brideName'] === 'Aysel');

/* ── oxuma ── */
ok('READ: açarsız (redizayndan əvvəlki) → 1', tvForRead($fd)['templateVersion'] === 1);
ok('READ: 2 → 2', tvForRead(['templateVersion' => 2])['templateVersion'] === 2);
ok('READ: yanlış → 1', tvForRead(['templateVersion' => 9])['templateVersion'] === 1);

/* ── i18n birləşdirməsi ilə birlikdə (save_invitation.php axını) ── */
$stored = ['templateVersion' => 1, 'i18n' => ['en' => ['brideName' => 'Aysel']]];
$merged = tvForSave(mergeInvitationI18n($stored, $fd), $stored);
ok('save axını: tərcümə + versiya birlikdə qorunur', $merged['templateVersion'] === 1 && isset($merged['i18n']));

/* ── normallaşdırma ── */
ok('tvNormalize: 1.0 → 1', tvNormalize(1.0) === 1);
ok('tvNormalize: null / "" / true → null', tvNormalize(null) === null && tvNormalize('') === null && tvNormalize(true) === null);

echo "\n$passed ok, $failed fail\n";
exit($failed ? 1 : 0);
