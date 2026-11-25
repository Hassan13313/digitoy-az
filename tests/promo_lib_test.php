<?php
/* ══════════════════════════════════════════════════
   Promokodlar (2026-11-25) — promo_lib.php

   İşə salma:  php tests/promo_lib_test.php     (SQLite, MySQL tələb etmir)

   Yoxlayır: kodun normallaşdırılması (AZ hərfləri, kiçik hərf, tire), endirimli
   qiymət, tarix/paket/limit/aktivlik qaydaları (Bakı vaxtı, son gün daxil),
   istifadə sayı (yalnız göndərilmiş + təsdiqlənmiş), sifarişə yazılan sahələr
   (səhv kod → endirimsiz qiymət) və admin formasının yoxlanışı.
══════════════════════════════════════════════════ */

if (!defined('DIGITOY_PACKAGE_PRICES')) {
    define('DIGITOY_PACKAGE_PRICES', ['VIDEO' => 29, 'MINI' => 39, 'SADE' => 59, 'VIP' => 89, 'PREMIUM' => 129]);
}
require_once __DIR__ . '/../public/api/promo_lib.php';

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

function freshDb(): PDO {
    $db = new PDO('sqlite::memory:');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $db->exec('CREATE TABLE promo_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        kind TEXT NOT NULL,
        amount INTEGER NOT NULL,
        packages TEXT DEFAULT NULL,
        starts_on TEXT DEFAULT NULL,
        ends_on TEXT DEFAULT NULL,
        max_uses INTEGER DEFAULT NULL,
        active INTEGER NOT NULL DEFAULT 1,
        owner TEXT DEFAULT NULL,
        note TEXT DEFAULT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )');
    $db->exec('CREATE TABLE draft_invitations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        draft_code TEXT UNIQUE,
        package TEXT DEFAULT "SADE",
        status TEXT DEFAULT "draft",
        promo_code TEXT DEFAULT NULL,
        price_base INTEGER DEFAULT NULL,
        price_final INTEGER DEFAULT NULL
    )');
    return $db;
}

function addCode(PDO $db, array $f): void {
    $f += ['kind' => 'percent', 'amount' => 30, 'packages' => null, 'starts_on' => null,
           'ends_on' => null, 'max_uses' => null, 'active' => 1, 'owner' => null];
    $st = $db->prepare('INSERT INTO promo_codes (code, kind, amount, packages, starts_on, ends_on, max_uses, active, owner)
                        VALUES (:code, :kind, :amount, :packages, :starts_on, :ends_on, :max_uses, :active, :owner)');
    $st->execute([':code' => $f['code'], ':kind' => $f['kind'], ':amount' => $f['amount'], ':packages' => $f['packages'],
                  ':starts_on' => $f['starts_on'], ':ends_on' => $f['ends_on'], ':max_uses' => $f['max_uses'],
                  ':active' => $f['active'], ':owner' => $f['owner']]);
}

function addOrder(PDO $db, string $code, string $status, ?string $promo): void {
    $db->prepare('INSERT INTO draft_invitations (draft_code, status, promo_code) VALUES (?, ?, ?)')
       ->execute([$code, $status, $promo]);
}

echo "\n── Normallaşdırma ──\n";
ok("' qaracümə ' → QARACUME", promoNormalizeCode(' qaracümə ') === 'QARACUME');
ok("'QARACÜMƏ' → QARACUME", promoNormalizeCode('QARACÜMƏ') === 'QARACUME');
ok("'bf-30' → BF30", promoNormalizeCode('bf-30') === 'BF30');
ok("'Aysel 10' → AYSEL10", promoNormalizeCode('Aysel 10') === 'AYSEL10');
ok("'şəkil' → SEKIL (ş, ə, i)", promoNormalizeCode('şəkil') === 'SEKIL');
ok("'İlk' / 'ılk' → ILK", promoNormalizeCode('İlk') === 'ILK' && promoNormalizeCode('ılk') === 'ILK');
ok("'çöğ' → COG", promoNormalizeCode('çöğ') === 'COG');
ok("2 simvol → null", promoNormalizeCode('ab') === null);
ok("33 simvol → null", promoNormalizeCode(str_repeat('X', 33)) === null);
ok("32 simvol qəbul", promoNormalizeCode(str_repeat('X', 32)) === str_repeat('X', 32));
ok("simvol '!' → null", promoNormalizeCode('BF30!') === null);
ok("massiv → null", promoNormalizeCode(['BF30']) === null);
ok("null → null", promoNormalizeCode(null) === null);

echo "\n── Qiymət ──\n";
ok('129 −30% → 90', promoPrice(129, 'percent', 30) === 90);
ok('59 −30% → 41', promoPrice(59, 'percent', 30) === 41);
ok('89 −30% → 62', promoPrice(89, 'percent', 30) === 62);
ok('39 −30% → 27', promoPrice(39, 'percent', 30) === 27);
ok('29 −30% → 20', promoPrice(29, 'percent', 30) === 20);
ok('129 −50% → 65 (64.5 yuxarı yuvarlanır)', promoPrice(129, 'percent', 50) === 65);
ok('29 −20₼ → 9', promoPrice(29, 'fixed', 20) === 9);
ok('39 −50₼ → 0 (mənfi olmur)', promoPrice(39, 'fixed', 50) === 0);

echo "\n── Qaydalar (promoEvaluate) ──\n";
$row = ['code' => 'QARACUMA', 'kind' => 'percent', 'amount' => 30, 'packages' => null,
        'starts_on' => '2026-11-27', 'ends_on' => '2026-11-30', 'max_uses' => 50, 'active' => 1];
$r = promoEvaluate($row, 'PREMIUM', '2026-11-27', 0);
ok('ilk gün keçərli, PREMIUM 129 → 90', $r['ok'] === true && $r['price_base'] === 129 && $r['price_final'] === 90
    && $r['code'] === 'QARACUMA' && $r['kind'] === 'percent' && $r['amount'] === 30);
ok('son gün (ends_on) hələ keçərli', promoEvaluate($row, 'SADE', '2026-11-30', 0)['ok'] === true);
ok('növbəti gün EXPIRED', promoEvaluate($row, 'SADE', '2026-12-01', 0)['reason'] === 'EXPIRED');
ok('başlamamış NOT_STARTED', promoEvaluate($row, 'SADE', '2026-11-26', 0)['reason'] === 'NOT_STARTED');
ok('limit dolub LIMIT (50/50)', promoEvaluate($row, 'SADE', '2026-11-28', 50)['reason'] === 'LIMIT');
ok('49/50 hələ keçərli', promoEvaluate($row, 'SADE', '2026-11-28', 49)['ok'] === true);
ok('söndürülüb INACTIVE', promoEvaluate(['active' => 0] + $row, 'SADE', '2026-11-28', 0)['reason'] === 'INACTIVE');
ok('tapılmadı NOT_FOUND', promoEvaluate(null, 'SADE', '2026-11-28', 0)['reason'] === 'NOT_FOUND');
$vipOnly = ['packages' => 'VIP,PREMIUM'] + $row;
ok('yalnız VIP/PREMIUM: SADE → PACKAGE', promoEvaluate($vipOnly, 'SADE', '2026-11-28', 0)['reason'] === 'PACKAGE');
ok('yalnız VIP/PREMIUM: VIP keçərli 89 → 62', promoEvaluate($vipOnly, 'VIP', '2026-11-28', 0)['price_final'] === 62);
$open = ['starts_on' => null, 'ends_on' => null, 'max_uses' => null] + $row;
ok('tarixsiz və limitsiz kod hər gün keçərli', promoEvaluate($open, 'MINI', '2030-01-01', 999)['ok'] === true);
ok('naməlum paket → PACKAGE', promoEvaluate($open, 'GOLD', '2026-11-28', 0)['reason'] === 'PACKAGE');
ok('promoToday() Y-m-d formatı', (bool) preg_match('/^\d{4}-\d{2}-\d{2}$/', promoToday()));

echo "\n── DB: tapma, istifadə sayı, yoxlama ──\n";
$db = freshDb();
addCode($db, ['code' => 'QARACUMA', 'max_uses' => 2, 'ends_on' => '2026-11-30']);
addOrder($db, 'DT-AAAAA1', 'submitted', 'QARACUMA');
addOrder($db, 'DT-AAAAA2', 'approved', 'QARACUMA');
addOrder($db, 'DT-AAAAA3', 'draft', 'QARACUMA');
addOrder($db, 'DT-AAAAA4', 'deleted', 'QARACUMA');
addOrder($db, 'DT-AAAAA5', 'rejected', 'QARACUMA');
addOrder($db, 'DT-AAAAA6', 'submitted', null);
ok('promoFind kiçik hərflə tapır', (promoFind($db, 'qaracuma')['code'] ?? '') === 'QARACUMA');
ok('promoFind yoxdursa null', promoFind($db, 'YOXDUR') === null);
ok('istifadə = yalnız submitted + approved (2)', promoUsedCount($db, 'QARACUMA') === 2);
ok('promoCheck: limit dolub', promoCheck($db, 'qaracuma', 'SADE', '2026-11-28')['reason'] === 'LIMIT');
ok('promoCheck: format səhvi → NOT_FOUND', promoCheck($db, '!!', 'SADE', '2026-11-28')['reason'] === 'NOT_FOUND');
addCode($db, ['code' => 'AYSEL10', 'kind' => 'fixed', 'amount' => 10, 'owner' => 'Aysel (Instagram)']);
ok('promoCheck: AYSEL10 VIP 89 → 79', promoCheck($db, 'aysel-10', 'VIP', '2026-11-28')['price_final'] === 79);

echo "\n── Sifarişə yazılan sahələr (promoSubmitFields) ──\n";
$f = promoSubmitFields($db, 'AYSEL10', 'PREMIUM', '2026-11-28');
ok('keçərli kod: kod + 129 → 119', $f['promo_code'] === 'AYSEL10' && $f['price_base'] === 129 && $f['price_final'] === 119 && $f['result']['ok'] === true);
$f = promoSubmitFields($db, 'QARACUMA', 'PREMIUM', '2026-11-28');
ok('limit dolmuş kod: kodsuz, tam qiymət, səbəb LIMIT', $f['promo_code'] === null && $f['price_final'] === 129 && $f['result']['reason'] === 'LIMIT');
$ownId = (int) $db->query("SELECT id FROM draft_invitations WHERE draft_code = 'DT-AAAAA2'")->fetchColumn();
ok('öz sifarişi sayılmır: təkrar göndərəndə limit yeri qorunur (2 → 1)', promoUsedCount($db, 'QARACUMA', $ownId) === 1);
$f = promoSubmitFields($db, 'QARACUMA', 'PREMIUM', '2026-11-28', $ownId);
ok('limitin son yerini tutan müştəri təkrar göndərir → endirim qalır', $f['promo_code'] === 'QARACUMA' && $f['price_final'] === 90);
$f = promoSubmitFields($db, '', 'MINI', '2026-11-28');
ok('kod yoxdur: result null, 39 = 39', $f['promo_code'] === null && $f['result'] === null && $f['price_base'] === 39 && $f['price_final'] === 39);
$f = promoSubmitFields($db, null, 'GOLD', '2026-11-28');
ok('naməlum paket: qiymət null', $f['price_base'] === null && $f['price_final'] === null);

echo "\n── Admin üçün: sifariş sahələri və siyahı ──\n";
$db->prepare('UPDATE draft_invitations SET price_base = 129, price_final = 90 WHERE draft_code = ?')->execute(['DT-AAAAA2']);
$o = promoOrderFields($db, 'DT-AAAAA2');
ok('promoOrderFields: kod + qiymətlər', $o === ['promo_code' => 'QARACUMA', 'price_base' => 129, 'price_final' => 90]);
ok('promoOrderFields: sifariş yoxdur → null-lar', promoOrderFields($db, 'DT-ZZZZZZ') === ['promo_code' => null, 'price_base' => null, 'price_final' => null]);
$list = promoList($db);
$byCode = array_column($list, null, 'code');
ok('promoList: hər kodun istifadəsi', count($list) === 2 && $byCode['QARACUMA']['used'] === 2 && $byCode['AYSEL10']['used'] === 0);
ok('promoList: owner saxlanır, packages massivdir', $byCode['AYSEL10']['owner'] === 'Aysel (Instagram)' && $byCode['AYSEL10']['packages'] === []);

echo "\n── Admin formasının yoxlanışı (promoValidateInput) ──\n";
$good = ['code' => 'qara cümə', 'kind' => 'percent', 'amount' => '30', 'packages' => ['VIP', 'PREMIUM'],
         'starts_on' => '2026-11-27', 'ends_on' => '2026-11-30', 'max_uses' => '', 'owner' => '  ', 'note' => 'BF 2026'];
$v = promoValidateInput($good);
ok('düzgün forma: xəta yoxdur', $v['errors'] === []);
ok('təmiz dəyərlər', $v['clean'] === ['code' => 'QARACUME', 'kind' => 'percent', 'amount' => 30, 'packages' => 'VIP,PREMIUM',
    'starts_on' => '2026-11-27', 'ends_on' => '2026-11-30', 'max_uses' => null, 'owner' => null, 'note' => 'BF 2026']);
ok('bütün paketlər seçilibsə packages = null', promoValidateInput(['packages' => ['VIDEO', 'MINI', 'SADE', 'VIP', 'PREMIUM']] + $good)['clean']['packages'] === null);
ok('boş paket siyahısı = hamısı (null)', promoValidateInput(['packages' => []] + $good)['clean']['packages'] === null);
ok('faiz 91 → xəta', isset(promoValidateInput(['amount' => 91] + $good)['errors']['amount']));
ok('faiz 0 → xəta', isset(promoValidateInput(['amount' => 0] + $good)['errors']['amount']));
ok('₼ 200 qəbul, 201 xəta', promoValidateInput(['kind' => 'fixed', 'amount' => 200] + $good)['errors'] === []
    && isset(promoValidateInput(['kind' => 'fixed', 'amount' => 201] + $good)['errors']['amount']));
ok('naməlum növ → xəta', isset(promoValidateInput(['kind' => 'gift'] + $good)['errors']['kind']));
ok('qısa kod → xəta', isset(promoValidateInput(['code' => 'ab'] + $good)['errors']['code']));
ok('bitmə başlanğıcdan əvvəl → xəta', isset(promoValidateInput(['ends_on' => '2026-11-26'] + $good)['errors']['ends_on']));
ok('səhv tarix formatı → xəta', isset(promoValidateInput(['starts_on' => '27.11.2026'] + $good)['errors']['starts_on']));
ok('naməlum paket → xəta', isset(promoValidateInput(['packages' => ['GOLD']] + $good)['errors']['packages']));
ok('limit 0 → xəta, 5 qəbul', isset(promoValidateInput(['max_uses' => '0'] + $good)['errors']['max_uses'])
    && promoValidateInput(['max_uses' => '5'] + $good)['clean']['max_uses'] === 5);
ok('owner 80 simvola qədər, artığı xəta', isset(promoValidateInput(['owner' => str_repeat('a', 81)] + $good)['errors']['owner']));
ok('massiv sahə (code[]) → xəta, TypeError yox', isset(promoValidateInput(['code' => ['x']] + $good)['errors']['code']));

echo "\n$passed passed, $failed failed\n";
exit($failed ? 1 : 0);
