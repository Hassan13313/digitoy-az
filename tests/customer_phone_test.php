<?php
/* ══════════════════════════════════════════════════
   Phase 50 — builderdəki könüllü əlaqə nömrəsi (server tərəfi)

   İşə salma:  php tests/customer_phone_test.php
   Eyni fixture-u tests/customer_phone_test.mjs JS qaydası üçün işlədir.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/../public/api/phone_lib.php';

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

$fx = json_decode(file_get_contents(__DIR__ . '/fixtures/phone_cases.json'), true);

echo "normalizeCustomerPhone (fixture)\n";
foreach ($fx['cases'] as [$in, $want]) {
    $got = normalizeCustomerPhone($in);
    ok(json_encode($in, JSON_UNESCAPED_UNICODE) . ' → ' . json_encode($want) . ($got === $want ? '' : ' (alındı ' . json_encode($got) . ')'), $got === $want);
}
foreach ($fx['non_strings'] as $in) {
    ok('sətir olmayan ' . json_encode($in) . ' → null', normalizeCustomerPhone($in) === null);
}

echo "endpointlər (mənbə yoxlaması)\n";
$api  = __DIR__ . '/../public/api/';
$save = file_get_contents($api . 'save_draft.php');
$sub  = file_get_contents($api . 'submit_draft.php');
ok('save_draft phone_lib.php-ni qoşur', strpos($save, "/phone_lib.php'") !== false);
ok('save_draft açar yoxdursa sütuna toxunmur (array_key_exists)', strpos($save, "array_key_exists('customer_phone'") !== false);
ok('save_draft nömrəni normallaşdırır', strpos($save, 'normalizeCustomerPhone(') !== false);
ok('save_draft addım tavanı 12', strpos($save, 'min(12, $currentStep)') !== false);
ok('submit_draft nömrəni silmir (COALESCE)', strpos($sub, 'COALESCE(:phone, customer_phone)') !== false);
ok('submit_draft-da köhnə «?: null» qalmayıb', strpos($sub, '$customerPhone ?: null') === false);
ok('submit_draft nömrəni normallaşdırır', strpos($sub, 'normalizeCustomerPhone(') !== false);
ok('phone_lib.php birbaşa HTTP ilə açılmır', strpos(file_get_contents($api . '.htaccess'), '<Files "phone_lib.php">') !== false);

echo "\n$passed passed, $failed failed\n";
exit($failed ? 1 : 0);
