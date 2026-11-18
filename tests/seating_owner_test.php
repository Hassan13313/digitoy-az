<?php
/* Müştəri panelində oturma redaktəsi (2026-11-18) — php tests/seating_owner_test.php (DB-siz) */
require __DIR__ . '/../public/api/seating_owner_lib.php';
$ok = 0; $fail = 0;
function check($name, $cond) { global $ok, $fail; if ($cond) $ok++; else { $fail++; echo "  FAIL $name\n"; } }

/* Paket qaydası */
check('VİP icazəlidir', ownerSeatingAllowed(['package' => 'VIP']));
check('Premium icazəlidir', ownerSeatingAllowed(['package' => 'PREMIUM', 'sections' => ['seating' => true]]));
check('Sadə icazəsiz', !ownerSeatingAllowed(['package' => 'SADE']));
check('Mini icazəsiz', !ownerSeatingAllowed(['package' => 'MINI']));
check('bölmə bağlıdırsa icazəsiz', !ownerSeatingAllowed(['package' => 'VIP', 'sections' => ['seating' => false]]));

/* PİN */
$pin = newSeatingPin();
check('PİN 6 rəqəm', (bool) preg_match('/^\d{6}$/', $pin));

/* Redaktə tokeni */
$now = 1_800_000_000;
$t = seatTokenMake('leyla-murad', 'secret', $now);
check('token keçərlidir', seatTokenValid($t, 'leyla-murad', 'secret', $now + 60));
check('başqa slug üçün etibarsız', !seatTokenValid($t, 'basqa-toy', 'secret', $now + 60));
check('PİN/link yenilənəndə etibarsız', !seatTokenValid($t, 'leyla-murad', 'secret2', $now + 60));
check('12 saatdan sonra etibarsız', !seatTokenValid($t, 'leyla-murad', 'secret', $now + SEAT_TOKEN_TTL + 1));
check('format pozuqdursa etibarsız', !seatTokenValid('abc.def', 'leyla-murad', 'secret', $now));

/* Təmizləmə */
check('boşluqlar sıxılır', seatClean("  Əli   Məmmədov \n", 120) === 'Əli Məmmədov');
check('uzunluq kəsilir (UTF-8)', mb_strlen(seatClean(str_repeat('ə', 200), 120)) === 120);
check('massiv → boş', seatClean(['x'], 120) === '');

/* Geri qaytarma planı */
check('əlavənin tərsi silmək', seatUndoPlan(['action' => 'add', 'guest_id' => 7, 'before_json' => null]) === ['delete', 7, null]);
$b = json_encode(['table_id' => 'Masa 3', 'full_name' => 'Əli', 'notes' => '']);
check('silmənin tərsi bərpa', seatUndoPlan(['action' => 'delete', 'guest_id' => 7, 'before_json' => $b])[0] === 'insert');
check('köçürmənin tərsi əvvəlki masa', seatUndoPlan(['action' => 'move', 'guest_id' => 7, 'before_json' => $b]) === ['restore', 7, json_decode($b, true)]);
check('naməlum əməliyyat → null', seatUndoPlan(['action' => 'x', 'guest_id' => 1, 'before_json' => null]) === null);

/* Endpoint qorumaları (mənbə yoxlaması) */
$src = file_get_contents(__DIR__ . '/../public/api/owner_seating.php');
check('müştəri açarı yoxlanılır', str_contains($src, 'ownerKeyValid($db, $slug, $ownerToken)'));
check('paket yoxlanılır', str_contains($src, 'ownerSeatingAllowed($fd)'));
check('PİN cəhdləri məhdudlaşdırılır', str_contains($src, "rateGate('seat_pin|'") && str_contains($src, "rateGate('seat_pin_ip|'"));
check('PİN password_verify ilə', str_contains($src, 'password_verify($pin, $pinHash)'));
check('qonaq bu dəvətnaməyə aiddir', substr_count($src, 'invitation_id = :s') >= 5);
$link = file_get_contents(__DIR__ . '/../public/api/owner_link.php');
check('admin PİN-i hash ilə saxlayır', str_contains($link, 'password_hash($pin, PASSWORD_DEFAULT)'));
$cfg = file_get_contents(__DIR__ . '/../public/api/config.php');
check('sxem v50 cədvəlləri', str_contains($cfg, 'CREATE TABLE IF NOT EXISTS owner_edit_pins') && str_contains($cfg, 'CREATE TABLE IF NOT EXISTS guest_changes'));
$purge = file_get_contents(__DIR__ . '/../public/api/admin_purge.php');
check('dəvətnamə silinəndə tarixçə (qonaq adları) və PİN də silinir',
    str_contains($purge, 'DELETE FROM guest_changes   WHERE invitation_id = :s') && str_contains($purge, 'DELETE FROM owner_edit_pins WHERE slug = :s'));
check('dəvətnamə silinəndə mesaj qeydləri də silinir', str_contains($purge, 'DELETE FROM event_messages WHERE draft_code IN'));
$ht = file_get_contents(__DIR__ . '/../public/api/.htaccess');
check('kitabxana birbaşa açılmır', str_contains($ht, 'seating_owner_lib'));

echo "$ok passed, $fail failed\n";
exit($fail ? 1 : 0);
