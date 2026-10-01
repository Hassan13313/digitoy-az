<?php
/* ══════════════════════════════════════════════════
   Phase 45.2 — qonaq cavabının təkrar-göndəriş açarı

   İşə salma:  php tests/guest_response_key_test.php
   DB TƏLƏB ETMİR — `guestDupKey()` saf funksiyadır.

   Xəta: RSVP və qonaq dəftəri eyni `submit_guest_response.php`-yə gedir və
   eyni 60 saniyəlik açarı paylaşırdı. Qonaq RSVP-dən dərhal sonra eyni adla
   təbrik yazanda 429 TOO_SOON alır, mesaj isə bazaya DÜŞMÜRDÜ.
   Qayda: RSVP və təbrik AYRI sayılır; eyni növün təkrarı yenə bloklanır.
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;

function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

$src = file_get_contents(__DIR__ . '/../public/api/submit_guest_response.php');
if (!preg_match('/\nfunction guestDupKey\(.*?\n\}/s', $src, $m)) {
    echo "FAIL: `guestDupKey` submit_guest_response.php-də tapılmadı\n";
    exit(1);
}
eval($m[0]);

$rsvp  = guestDupKey('aysel-ve-tural-abc123', '1.2.3.4', 'Leyla', 'yes');
$rsvp2 = guestDupKey('aysel-ve-tural-abc123', '1.2.3.4', 'Leyla', 'no');
$gb    = guestDupKey('aysel-ve-tural-abc123', '1.2.3.4', 'Leyla', null);
$gb2   = guestDupKey('aysel-ve-tural-abc123', '1.2.3.4', 'LEYLA', null);

ok('RSVP və təbrik fərqli açardır', $rsvp !== $gb);
ok('iki RSVP eyni açardır (təkrar bloklanır)', $rsvp === $rsvp2);
ok('təbrik təkrarı eyni açardır, ad registri nəzərə alınmır', $gb === $gb2);
ok('başqa qonaq fərqli açardır', $gb !== guestDupKey('aysel-ve-tural-abc123', '1.2.3.4', 'Nigar', null));
ok('başqa toy fərqli açardır', $gb !== guestDupKey('basqa-toy-xyz789', '1.2.3.4', 'Leyla', null));

echo "\n$passed ok, $failed FAIL\n";
exit($failed ? 1 : 0);
