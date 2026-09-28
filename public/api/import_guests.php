<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — QONAQ SİYAHISININ TOPLU İDXALI (Phase 43)

   POST /api/import_guests.php   (admin tələb olunur)
   body: {
     invitation_id: "<slug>",
     rows: [ { name, table, phone? }, … ],   max 2000
     dry_run: false                          true → yalnız yoxlama hesabatı
   }
   → { ok, inserted, skipped:{duplicate,invalid}, errors:[…], total }

   NƏ ÜÇÜN SERVER TƏRƏFİ PARSING DEYİL: XLSX faylı brauzerdə açılır
   (`src/utils/guestSheet.js`, mövcud `jszip` ilə) və serverə TƏMİZ JSON
   gəlir. Belədə:
     • serverə fayl yükləmə yolu AÇILMIR (yeni hücum səthi yoxdur),
     • PHP tərəfində ZIP/XML emalı yoxdur (zip bomba riski yoxdur),
     • istifadəçi sütun uyğunlaşdırmasını göndərməmişdən ÖNCƏ görür.

   ⚠ MÖVCUD AXIN TOXUNULMUR: `manage_guest.php` (bir-bir əlavə),
     `migrate_guests.php` (oturma planı mətnindən köçürmə) və
     `get_guests.php` olduğu kimi qalır. Bu endpoint yalnız eyni `guests`
     cədvəlinə toplu yazır — həmin cədvəlin sütunları dəyişmir
     (`phone` Phase 43-də ƏLAVƏ olunub, NULL qəbul edir).

   ⚠ TƏKRAR MÜDAFİƏSİ İKİ SƏVİYYƏLİDİR:
     1. faylın ÖZÜ içində təkrarlanan adlar (Excel-də çox olur),
     2. bazada HƏMİN dəvətnamədə onsuz da olan adlar.
     Müqayisə normallaşdırılır (kiçik hərf, artıq boşluqsuz, AZ hərfləri
     translit) — «Əli  Məmmədov» və «əli məmmədov» EYNİ qonaqdır.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

requireAdmin();

const IMPORT_MAX_ROWS = 2000;

$body   = json_decode(file_get_contents('php://input'), true);
$invId  = trim($body['invitation_id'] ?? '');
$rows   = $body['rows'] ?? null;
$dryRun = ($body['dry_run'] ?? false) === true;

if ($invId === '' || !isValidSlug($invId)) {
    http_response_code(422);
    echo json_encode(['error' => 'invitation_id required']);
    exit;
}
if (!is_array($rows)) {
    http_response_code(422);
    echo json_encode(['error' => 'rows array required']);
    exit;
}
if (count($rows) > IMPORT_MAX_ROWS) {
    http_response_code(413);
    echo json_encode([
        'error'   => 'TOO_MANY_ROWS',
        'message' => 'Bir dəfədə ən çox ' . IMPORT_MAX_ROWS . ' qonaq idxal edilə bilər.',
        'limit'   => IMPORT_MAX_ROWS,
    ]);
    exit;
}

/** Ad müqayisəsi üçün normallaşdırma — AZ hərfləri translit edilir */
function normGuestName(string $s): string {
    $s = mb_strtolower(trim($s), 'UTF-8');
    $map = [
        'ə' => 'e', 'ğ' => 'g', 'ı' => 'i', 'İ' => 'i', 'i̇' => 'i',
        'ö' => 'o', 'ş' => 's', 'ü' => 'u', 'ç' => 'c',
    ];
    $s = strtr($s, $map);
    $s = preg_replace('/\s+/u', ' ', $s);
    return trim((string) $s);
}

/** Telefon — yalnız rəqəm, +, boşluq, tire, mötərizə */
function cleanPhone($v): ?string {
    if (!is_string($v)) return null;
    $v = trim($v);
    if ($v === '') return null;
    $v = preg_replace('/[^0-9+\-\s()]/u', '', $v);
    $v = trim((string) $v);
    if ($v === '') return null;
    /* Ən azı 7 rəqəm olmalıdır — əks halda bu telefon deyil */
    if (preg_match_all('/[0-9]/', $v) < 7) return null;
    return mb_substr($v, 0, 40);
}

ensureTables();
$db = getDB();

/* ── Bazada MÖVCUD adlar ── */
$existing = [];
try {
    $st = $db->prepare('SELECT full_name FROM guests WHERE invitation_id = :inv');
    $st->execute([':inv' => $invId]);
    foreach ($st->fetchAll() as $r) {
        $existing[normGuestName((string) $r['full_name'])] = true;
    }
} catch (Throwable $e) {
    /* Oxunmursa təkrar müdafiəsi zəifləyir, amma idxal dayanmır:
       UNIQUE açar yoxdur, ona görə burada FAIL-OPEN qəbul edilir. */
}

$defaultTable = 'Masa 1';
$seenInFile   = [];
$toInsert     = [];
$errors       = [];
$dupCount     = 0;
$invalidCount = 0;

foreach ($rows as $i => $row) {
    $lineNo = $i + 1;
    if (!is_array($row)) { $invalidCount++; continue; }

    $name  = trim((string) ($row['name'] ?? ''));
    $table = trim((string) ($row['table'] ?? ''));
    $phone = cleanPhone($row['phone'] ?? null);

    /* ── Validasiya ── */
    if ($name === '') {
        $invalidCount++;
        if (count($errors) < 30) $errors[] = ['line' => $lineNo, 'reason' => 'AD_BOŞDUR'];
        continue;
    }
    if (mb_strlen($name) > 255) $name = mb_substr($name, 0, 255);
    /* Rəqəmdən ibarət «ad» — adətən sütunlar səhv uyğunlaşdırılıb */
    if (preg_match('/^[0-9\s\-+()]+$/u', $name)) {
        $invalidCount++;
        if (count($errors) < 30) $errors[] = ['line' => $lineNo, 'reason' => 'AD_RƏQƏMDİR', 'value' => $name];
        continue;
    }

    if ($table === '') $table = $defaultTable;
    if (mb_strlen($table) > 80) $table = mb_substr($table, 0, 80);

    $key = normGuestName($name);
    if (isset($seenInFile[$key]) || isset($existing[$key])) {
        $dupCount++;
        if (count($errors) < 30) $errors[] = ['line' => $lineNo, 'reason' => 'TƏKRAR', 'value' => $name];
        continue;
    }
    $seenInFile[$key] = true;

    $toInsert[] = ['name' => $name, 'table' => $table, 'phone' => $phone];
}

/* ── Yalnız yoxlama rejimi ── */
if ($dryRun) {
    echo json_encode([
        'ok'       => true,
        'dry_run'  => true,
        'total'    => count($rows),
        'inserted' => 0,
        'willAdd'  => count($toInsert),
        'skipped'  => ['duplicate' => $dupCount, 'invalid' => $invalidCount],
        'errors'   => $errors,
        'preview'  => array_slice($toInsert, 0, 10),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/* ── Yazma — TƏK TRANZAKSİYA ──
   Yarıda kəsilən idxal yarım siyahı qoyardı: cütlük hansı adın düşdüyünü
   bilməzdi. Tranzaksiya ya hamısını yazır, ya heç nəyi. */
$inserted = 0;
if ($toInsert) {
    try {
        $db->beginTransaction();
        $st = $db->prepare(
            'INSERT INTO guests (invitation_id, table_id, full_name, phone)
             VALUES (:inv, :tbl, :name, :phone)'
        );
        foreach ($toInsert as $g) {
            $st->execute([
                ':inv'   => substr($invId, 0, 120),
                ':tbl'   => $g['table'],
                ':name'  => $g['name'],
                ':phone' => $g['phone'],
            ]);
            $inserted++;
        }
        $db->commit();
    } catch (Throwable $e) {
        if ($db->inTransaction()) $db->rollBack();

        /* `phone` sütunu hələ yoxdursa (miqrasiya işləməyib) telefonsuz
           yenidən cəhd edilir — idxal telefon ucbatından ölməməlidir. */
        $inserted = 0;
        try {
            $db->beginTransaction();
            $st = $db->prepare(
                'INSERT INTO guests (invitation_id, table_id, full_name)
                 VALUES (:inv, :tbl, :name)'
            );
            foreach ($toInsert as $g) {
                $st->execute([
                    ':inv'  => substr($invId, 0, 120),
                    ':tbl'  => $g['table'],
                    ':name' => $g['name'],
                ]);
                $inserted++;
            }
            $db->commit();
            $errors[] = ['line' => 0, 'reason' => 'TELEFON_SÜTUNU_YOXDUR'];
        } catch (Throwable $e2) {
            if ($db->inTransaction()) $db->rollBack();
            http_response_code(500);
            echo json_encode([
                'error'   => 'IMPORT_FAILED',
                'message' => 'Qonaqlar yazıla bilmədi. Heç bir sətir əlavə olunmadı.',
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}

adminAuditLog('guest_import', $invId, $inserted . ' guests, ' . $dupCount . ' dup');

echo json_encode([
    'ok'       => true,
    'total'    => count($rows),
    'inserted' => $inserted,
    'skipped'  => ['duplicate' => $dupCount, 'invalid' => $invalidCount],
    'errors'   => $errors,
], JSON_UNESCAPED_UNICODE);
