<?php
/* ══════════════════════════════════════════════════
   Promokodlar (2026-11-25) — paylaşılan məntiq

   Kodu admin yaradır (admin_promo.php), müştəri sifarişin son addımında yazır
   (promo_check.php), submit_draft.php isə YENİDƏN yoxlayıb yekun qiyməti
   sifarişə yazır — qiymətin həqiqət mənbəyi serverdir, brauzer yox.

   Qaydalar:
     • kod yalnız A–Z və 0–9 (3–32). Müştəri «qaracümə» yazsa da QARACUME olur;
     • tarixlər DATE, son gün daxil, «bu gün» Bakı vaxtı ilə;
     • istifadə sayı = həmin kodla GÖNDƏRİLMİŞ və TƏSDİQLƏNMİŞ sifarişlər
       (qaralama, silinmiş, rədd edilmiş sayılmır);
     • `owner` — kodun sahibi (influenser/partnyor), hesabat üçün.

   Asılılıq: DIGITOY_PACKAGE_PRICES (config.php). Bu fayl birbaşa açılmır
   (.htaccess), yalnız require olunur.
══════════════════════════════════════════════════ */

const PROMO_REASONS     = ['NOT_FOUND', 'INACTIVE', 'NOT_STARTED', 'EXPIRED', 'PACKAGE', 'LIMIT'];
const PROMO_MAX_PERCENT = 90;
const PROMO_MAX_FIXED   = 200;
const PROMO_COUNTED     = "('submitted', 'approved')";

/** Müştərinin yazdığı kodu standart şəklə salır; uyğun deyilsə null. */
function promoNormalizeCode($raw): ?string {
    if (!is_string($raw)) return null;
    $s = strtr(trim($raw), [
        'ə' => 'E', 'Ə' => 'E', 'ü' => 'U', 'Ü' => 'U', 'ö' => 'O', 'Ö' => 'O',
        'ğ' => 'G', 'Ğ' => 'G', 'ş' => 'S', 'Ş' => 'S', 'ç' => 'C', 'Ç' => 'C',
        'ı' => 'I', 'İ' => 'I', '-' => '', ' ' => '',
    ]);
    $s = strtoupper(preg_replace('/\s+/u', '', $s) ?? '');
    return preg_match('/^[A-Z0-9]{3,32}$/', $s) ? $s : null;
}

/** Endirimli qiymət (tam manat). Faiz yarımdan yuxarı yuvarlanır, ₼ endirimi 0-dan aşağı düşmür. */
function promoPrice(int $base, string $kind, int $amount): int {
    if ($kind === 'percent') return (int) round($base * (100 - $amount) / 100);
    return max(0, $base - $amount);
}

/** Bakı vaxtı ilə bugünkü tarix (Y-m-d). */
function promoToday(): string {
    return (new DateTimeImmutable('now', new DateTimeZone('Asia/Baku')))->format('Y-m-d');
}

/** Paketlər sütunu (CSV, NULL = hamısı) → massiv. */
function promoPackageList($csv): array {
    return $csv ? array_values(array_filter(explode(',', (string) $csv))) : [];
}

/**
 * Kodun bu paketə bu gün tətbiq olunub-olunmadığını qərarlaşdırır (DB-siz).
 * @return array ok: [ok, code, kind, amount, price_base, price_final] · xəta: [ok=false, reason]
 */
function promoEvaluate(?array $row, string $package, string $today, int $used): array {
    $fail = fn(string $reason) => ['ok' => false, 'reason' => $reason];
    if (!$row) return $fail('NOT_FOUND');
    if (!(int) $row['active']) return $fail('INACTIVE');
    if (!empty($row['starts_on']) && $today < $row['starts_on']) return $fail('NOT_STARTED');
    if (!empty($row['ends_on']) && $today > $row['ends_on']) return $fail('EXPIRED');

    $base = DIGITOY_PACKAGE_PRICES[$package] ?? null;
    $allowed = promoPackageList($row['packages'] ?? null);
    if ($base === null || ($allowed && !in_array($package, $allowed, true))) return $fail('PACKAGE');
    if (isset($row['max_uses']) && $row['max_uses'] !== null && $used >= (int) $row['max_uses']) return $fail('LIMIT');

    $kind   = (string) $row['kind'];
    $amount = (int) $row['amount'];
    return [
        'ok'          => true,
        'code'        => (string) $row['code'],
        'kind'        => $kind,
        'amount'      => $amount,
        'price_base'  => $base,
        'price_final' => promoPrice($base, $kind, $amount),
    ];
}

function promoFind(PDO $db, $code): ?array {
    $code = promoNormalizeCode($code);
    if ($code === null) return null;
    $st = $db->prepare('SELECT * FROM promo_codes WHERE code = :c LIMIT 1');
    $st->execute([':c' => $code]);
    return $st->fetch(PDO::FETCH_ASSOC) ?: null;
}

/** $excludeId — müştərinin öz sifarişi: təkrar göndərəndə limitdəki yerini özü tutmasın. */
function promoUsedCount(PDO $db, string $code, ?int $excludeId = null): int {
    $st = $db->prepare('SELECT COUNT(*) FROM draft_invitations
                        WHERE promo_code = :c AND status IN ' . PROMO_COUNTED . ' AND id <> :x');
    $st->execute([':c' => $code, ':x' => $excludeId ?? 0]);
    return (int) $st->fetchColumn();
}

/** promo_check.php-nin cavabı: kodu tapır, istifadəni sayır, qaydaları tətbiq edir. */
function promoCheck(PDO $db, $raw, string $package, string $today, ?int $excludeId = null): array {
    $row = promoFind($db, $raw);
    return promoEvaluate($row, $package, $today, $row ? promoUsedCount($db, $row['code'], $excludeId) : 0);
}

/**
 * submit_draft.php sifarişə nə yazsın. Kod keçməsə sifariş endirimsiz qeyd olunur
 * (müştəriyə göstərilən endirim admin üçün yox, `result` cavabda qayıdır).
 */
function promoSubmitFields(PDO $db, $raw, string $package, string $today, ?int $draftId = null): array {
    $base = DIGITOY_PACKAGE_PRICES[$package] ?? null;
    $out  = ['promo_code' => null, 'price_base' => $base, 'price_final' => $base, 'result' => null];
    if (!is_string($raw) || trim($raw) === '' || $base === null) return $out;

    $res = promoCheck($db, $raw, $package, $today, $draftId);
    $out['result'] = $res;
    if ($res['ok']) {
        $out['promo_code']  = $res['code'];
        $out['price_final'] = $res['price_final'];
    }
    return $out;
}

/** Admin sifariş detalı üçün: kod və qiymətlər (sifariş yoxdursa null-lar). */
function promoOrderFields(PDO $db, string $draftCode): array {
    $st = $db->prepare('SELECT promo_code, price_base, price_final FROM draft_invitations WHERE draft_code = :c LIMIT 1');
    $st->execute([':c' => $draftCode]);
    $r = $st->fetch(PDO::FETCH_ASSOC) ?: [];
    $int = fn($v) => $v === null || $v === '' ? null : (int) $v;
    return [
        'promo_code'  => $r['promo_code'] ?? null,
        'price_base'  => $int($r['price_base'] ?? null),
        'price_final' => $int($r['price_final'] ?? null),
    ];
}

/** Admin siyahısı: hər kod + neçə sifariş gətirib. */
function promoList(PDO $db): array {
    $rows = $db->query('SELECT p.*, (SELECT COUNT(*) FROM draft_invitations d
                                     WHERE d.promo_code = p.code AND d.status IN ' . PROMO_COUNTED . ') AS used
                        FROM promo_codes p ORDER BY p.id DESC')->fetchAll(PDO::FETCH_ASSOC);
    return array_map(fn($r) => [
        'id'         => (int) $r['id'],
        'code'       => $r['code'],
        'kind'       => $r['kind'],
        'amount'     => (int) $r['amount'],
        'packages'   => promoPackageList($r['packages']),
        'starts_on'  => $r['starts_on'] ?: null,
        'ends_on'    => $r['ends_on'] ?: null,
        'max_uses'   => $r['max_uses'] === null ? null : (int) $r['max_uses'],
        'active'     => (bool) (int) $r['active'],
        'owner'      => $r['owner'],
        'note'       => $r['note'],
        'used'       => (int) $r['used'],
        'created_at' => $r['created_at'],
    ], $rows);
}

/** Massiv sahəni ('x[]') rədd edən sətir oxuyucu. */
function promoStr($v): ?string {
    return is_string($v) || is_int($v) ? trim((string) $v) : null;
}

function promoDateOrNull($v, bool &$bad): ?string {
    $s = promoStr($v);
    if ($s === null) { $bad = $v !== null; return null; }
    if ($s === '') return null;
    $ok = preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $s, $m) && checkdate((int) $m[2], (int) $m[3], (int) $m[1]);
    $bad = !$ok;
    return $ok ? $s : null;
}

/**
 * Admin formasını yoxlayır. errors boşdursa `clean` DB-yə yazılmağa hazırdır.
 * @return array{errors: array<string,string>, clean: array}
 */
function promoValidateInput(array $in): array {
    $errors = [];
    $len = fn(string $s) => function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);

    $code = promoNormalizeCode($in['code'] ?? null);
    if ($code === null) $errors['code'] = 'Kod 3–32 latın hərfi və ya rəqəm olmalıdır';

    $kind = promoStr($in['kind'] ?? null);
    if (!in_array($kind, ['percent', 'fixed'], true)) $errors['kind'] = 'Endirim növünü seçin';

    $amountRaw = promoStr($in['amount'] ?? null);
    $amount = $amountRaw !== null && ctype_digit($amountRaw) ? (int) $amountRaw : 0;
    $max = $kind === 'fixed' ? PROMO_MAX_FIXED : PROMO_MAX_PERCENT;
    if ($amount < 1 || $amount > $max) {
        $errors['amount'] = $kind === 'fixed' ? "Endirim 1–{$max}₼ olmalıdır" : "Endirim 1–{$max}% olmalıdır";
    }

    $pk = $in['packages'] ?? [];
    $pk = is_array($pk) ? $pk : [];
    $all = array_keys(DIGITOY_PACKAGE_PRICES);
    $picked = array_values(array_filter($all, fn($id) => in_array($id, $pk, true)));
    if (count($picked) !== count(array_unique(array_filter($pk, 'is_string')))) $errors['packages'] = 'Naməlum paket';
    $packages = ($picked && count($picked) < count($all)) ? implode(',', $picked) : null;

    $badStart = $badEnd = false;
    $startsOn = promoDateOrNull($in['starts_on'] ?? null, $badStart);
    $endsOn   = promoDateOrNull($in['ends_on'] ?? null, $badEnd);
    if ($badStart) $errors['starts_on'] = 'Tarix YYYY-AA-GG olmalıdır';
    if ($badEnd)   $errors['ends_on']   = 'Tarix YYYY-AA-GG olmalıdır';
    if ($startsOn && $endsOn && $endsOn < $startsOn) $errors['ends_on'] = 'Bitmə tarixi başlanğıcdan əvvəl ola bilməz';

    $mu = promoStr($in['max_uses'] ?? null);
    $maxUses = null;
    if ($mu !== null && $mu !== '') {
        if (ctype_digit($mu) && (int) $mu >= 1 && (int) $mu <= 100000) $maxUses = (int) $mu;
        else $errors['max_uses'] = 'Limit 1 və ya daha çox olmalıdır (boş = limitsiz)';
    }

    $owner = promoStr($in['owner'] ?? null);
    $owner = $owner === '' ? null : $owner;
    if ($owner !== null && $len($owner) > 80) $errors['owner'] = 'Ən çox 80 simvol';

    $note = promoStr($in['note'] ?? null);
    $note = $note === '' ? null : $note;
    if ($note !== null && $len($note) > 255) $errors['note'] = 'Ən çox 255 simvol';

    return ['errors' => $errors, 'clean' => [
        'code' => $code, 'kind' => $kind, 'amount' => $amount, 'packages' => $packages,
        'starts_on' => $startsOn, 'ends_on' => $endsOn, 'max_uses' => $maxUses, 'owner' => $owner, 'note' => $note,
    ]];
}
