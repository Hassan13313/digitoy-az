<?php
/* ══════════════════════════════════════════════════
   Phase 37/39 — paylaşılan köməkçilərin testi

   İşə salma:  php tests/phase37_helpers_test.php
   DB TƏLƏB ETMİR — yalnız saf funksiyalar yoxlanılır.

   NƏ ÜÇÜN VAR: `isValidSlug()` bütün endpointlərin tək qapısıdır. Burada
   sınan bir dəyişiklik eyni anda foto yükləməni, qalereyanı, RSVP-ni və
   admin panelini sındıra bilər — məhz Phase 37-dən əvvəl baş verən şey.
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;

function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

/* ── Sınaqdan keçirilən funksiyaları config.php-dən TƏK-TƏK götürürük.
      Bütün faylı require etmək başlıq göndərir və DB-yə qoşulur. ── */
$src = file_get_contents(__DIR__ . '/../public/api/config.php');

foreach (['isValidSlug', 'clientIp'] as $fn) {
    if (!preg_match('/\nfunction ' . $fn . '\(.*?\n\}/s', $src, $m)) {
        echo "FAIL: `$fn` config.php-də tapılmadı — funksiya adı dəyişib?\n";
        exit(1);
    }
    eval($m[0]);
}

echo "\n── isValidSlug: qəbul edilməli olanlar ──\n";
/* ⚠ ƏN VACİB HAL: Phase 33-dən ƏVVƏLKİ sluglarda BÖYÜK HƏRF var.
   Bu sətir sınarsa həmin toylarda foto yükləmə yenidən bağlanar. */
ok('BÖYÜK hərfli köhnə slug (Phase 33-dən əvvəl)', isValidSlug('sasas-ve-sasasa-DDE863'));
ok('kiçik hərfli yeni slug',                       isValidSlug('aytekin-ve-ferid-abc234'));
ok('yalnız rəqəm və tire',                         isValidSlug('12-34'));
ok('minimum uzunluq (2)',                          isValidSlug('ab'));
ok('maksimum uzunluq (120)',                       isValidSlug(str_repeat('a', 120)));
ok('qarışıq registr',                              isValidSlug('AyTeKin-Ve-FeRid-XY12'));

echo "\n── isValidSlug: rədd edilməli olanlar ──\n";
ok('boş sətir',                 !isValidSlug(''));
ok('bir simvol (çox qısa)',     !isValidSlug('a'));
ok('121 simvol (çox uzun)',     !isValidSlug(str_repeat('a', 121)));
ok('path traversal `..`',       !isValidSlug('../etc'));
ok('kəsik `/`',                 !isValidSlug('a/b'));
ok('tərs kəsik `\\`',           !isValidSlug('a\\b'));
ok('nöqtə (fayl uzantısı)',     !isValidSlug('slug.php'));
ok('boşluq',                    !isValidSlug('iki soz'));
ok('alt xətt',                  !isValidSlug('a_b'));
ok('faiz kodlaması',            !isValidSlug('a%2e%2e'));
ok('NULL bayt',                 !isValidSlug("abc\0def"));
ok('kiril hərfləri',            !isValidSlug('тест-слаг'));
ok('massiv (string deyil)',     !isValidSlug(['a']));
ok('null (string deyil)',       !isValidSlug(null));
ok('rəqəm (string deyil)',      !isValidSlug(123));

echo "\n── clientIp: XFF yalnız etibarlı proxy-dən ──\n";
/* Phase 37-dən ƏVVƏL: XFF şərtsiz oxunurdu, yəni rate limit hər sorğuda
   yeni «IP» uydurmaqla tamamilə keçilirdi. */
$_SERVER = [];
$_SERVER['REMOTE_ADDR'] = '203.0.113.7';
$_SERVER['HTTP_X_FORWARDED_FOR'] = '1.2.3.4';
ok('TRUSTED_PROXIES yoxdur → XFF İQNORLANIR', clientIp() === '203.0.113.7');

define('TRUSTED_PROXIES', ['10.0.0.1']);
$_SERVER['REMOTE_ADDR'] = '203.0.113.7';   /* proxy siyahısında DEYİL */
ok('naməlum mənbə → XFF iqnorlanır',        clientIp() === '203.0.113.7');

$_SERVER['REMOTE_ADDR'] = '10.0.0.1';      /* etibarlı proxy */
$_SERVER['HTTP_X_FORWARDED_FOR'] = '1.2.3.4, 10.0.0.1';
ok('etibarlı proxy → zəncirin İLK IP-si',   clientIp() === '1.2.3.4');

$_SERVER['HTTP_X_FORWARDED_FOR'] = 'not-an-ip';
ok('etibarlı proxy, yararsız XFF → REMOTE_ADDR', clientIp() === '10.0.0.1');

$_SERVER['HTTP_X_FORWARDED_FOR'] = '';
ok('etibarlı proxy, boş XFF → REMOTE_ADDR', clientIp() === '10.0.0.1');

echo "\n" . ($failed === 0
    ? "$passed keçdi, 0 uğursuz\n"
    : "$passed keçdi, $failed UĞURSUZ\n");

exit($failed === 0 ? 0 : 1);
