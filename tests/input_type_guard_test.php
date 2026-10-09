<?php
/* Giriş tipi qoruması + health.php məlumat sızması (PHP-nin öz daxili serveri ilə)
   İşlət:  php tests/input_type_guard_test.php

   1) ?slug[]=x kimi massiv parametr trim()/substr()-də TypeError atır. Əvvəl bu
      boş gövdəli 500 qaytarırdı; indi 400 + {"error":"Invalid input"} olmalıdır.
   2) health.php açıq cavabda PHP versiyası, mühit və cədvəl adlarını göstərməməlidir. */

$php  = PHP_BINARY;
$root = realpath(__DIR__ . '/../public');
$port = 18000 + random_int(0, 999);
$proc = proc_open([$php, '-S', "127.0.0.1:$port", '-t', $root], [1 => ['file', 'NUL', 'w'], 2 => ['file', 'NUL', 'w']], $pipes);
if (!is_resource($proc)) { echo "FAIL server başlamadı\n"; exit(1); }
register_shutdown_function(fn() => proc_terminate($proc));

$pass = 0; $fail = 0;
function check(string $name, bool $cond, string $extra = '') {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok   $name\n"; }
    else       { $fail++; echo "  FAIL $name $extra\n"; }
}
function req(string $method, string $path, ?string $body = null): array {
    global $port;
    $ctx = stream_context_create(['http' => [
        'method' => $method, 'ignore_errors' => true, 'timeout' => 10,
        'header' => "Content-Type: application/json\r\nHost: localhost:$port\r\n",
        'content' => $body ?? '',
    ]]);
    $out = @file_get_contents("http://127.0.0.1:$port$path", false, $ctx);
    $code = 0;
    foreach ($http_response_header ?? [] as $h) if (preg_match('#^HTTP/\S+ (\d+)#', $h, $m)) $code = (int) $m[1];
    return [$code, (string) $out];
}

/* server hazır olana qədər gözlə */
for ($i = 0; $i < 50; $i++) { if (@fsockopen('127.0.0.1', $port)) break; usleep(100000); }

echo "massiv parametr → 400\n";
foreach ([
    ['GET',  '/api/get_invitation.php?slug[]=x'],
    ['GET',  '/api/gallery_meta.php?slug[]=x'],
    ['GET',  '/api/get_photos.php?slug[]=x'],
    ['GET',  '/api/get_guests.php?invitation_id[]=x'],
    ['GET',  '/api/get_guest_responses.php?invitation_id[]=x'],
    ['GET',  '/api/get_draft.php?draft_code[]=x'],
    ['POST', '/api/submit_guest_response.php', '{"invitation_id":["x"],"name":["x"]}'],
    ['POST', '/api/media_react.php', '{"slug":["x"],"id":["x"]}'],
    ['POST', '/api/gallery_track.php', '{"slug":["x"]}'],
] as $r) {
    [$m, $p] = $r;
    [$code, $out] = req($m, $p, $r[2] ?? null);
    $j = json_decode($out, true);
    check("$m $p → 400", $code === 400, "(got $code)");
    check("$m $p → JSON xəta, sızma yoxdur", is_array($j) && ($j['error'] ?? '') === 'Invalid input'
        && !preg_match('/TypeError|\.php|Stack|#0/i', $out), '(' . substr($out, 0, 120) . ')');
}

echo "massiv invitation_id → \"Array\" slug-a çevrilmir\n";
/* (string)['x'] === "Array" isValidSlug-dan keçirdi və sorğu DB-yə qədər gedirdi */
[$code, $out] = req('POST', '/api/submit_attendance.php', '{"guest_id":1,"invitation_id":["x"],"status":"GOING"}');
check('submit_attendance massiv invitation_id → 422', $code === 422, "(got $code)");
check('submit_attendance → invitation_id required', (json_decode($out, true)['error'] ?? '') === 'invitation_id required', '(' . substr($out, 0, 120) . ')');

echo "health.php açıq cavab\n";
[$code, $out] = req('GET', '/api/health.php');
$j = json_decode($out, true) ?: [];
check('status və db sahələri var', isset($j['status'], $j['db']), $out);
check('php_version göstərilmir', !array_key_exists('php_version', $j));
check('environment göstərilmir', !array_key_exists('environment', $j));
check('cədvəl adları göstərilmir', !array_key_exists('tables', $j) && !array_key_exists('missing', $j));
check('PHP versiyası mətndə də yoxdur', !str_contains($out, PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION . '.'));

echo "test.digitoy.az noindex (.htaccess, statik)\n";
$ht = file_get_contents($root . '/.htaccess');
check('staging hostu SetEnvIf ilə tanınır', (bool) preg_match('/SetEnvIfNoCase\s+Host\s+\^test\\\\\.digitoy\\\\\.az\S*\s+DIGITOY_STAGING/', $ht));
check('X-Robots-Tag yalnız staging env-ində', (bool) preg_match('/Header always set X-Robots-Tag "noindex, nofollow" env=DIGITOY_STAGING/', $ht));
check('şərtsiz X-Robots-Tag yoxdur (prod indekslənir)', preg_match_all('/X-Robots-Tag/', $ht) === preg_match_all('/X-Robots-Tag[^\n]*env=DIGITOY_STAGING/', $ht));
check('<If> bloku işlədilmir (hostinqdə sınanmayıb)', !preg_match('/<If\s/i', $ht));

echo "\n$pass ok, $fail fail\n";
exit($fail ? 1 : 0);
