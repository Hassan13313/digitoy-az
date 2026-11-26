<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Oturma planı: zal planı, qız/oğlan evi və qruplar (2026-11-26, v52)

   • guests.side       — 'bride' (qız evi) | 'groom' (oğlan evi) | NULL
   • guests.group_name — tanışlıq qrupu («İş yoldaşları», «Məhlə uşaqları»…) | NULL
   • guests.table_id   — masanın ADI; '' = hələ masası yoxdur
   • seating_layouts   — dəvətnamə başına bir JSON: masalar (forma, tutum, yer),
                         zonalar (səhnə, bəy-gəlin, rəqs…), qruplar, qonaqlara
                         nə göstərilsin (showMap, showTablemates)
   Masa adı guests.table_id ilə bağlıdır (köhnə kod, idxal, ixrac, «masanı tap»
   dəyişmədən işləsin deyə). Ad dəyişəndə / masa silinəndə qonaqlar burada
   yenilənir. Admin (manage_guest.php) və müştəri paneli (owner_seating.php)
   eyni funksiyaları işlədir. Yalnız include edilir (api/.htaccess).
   Saf hissələr: tests/seating_layout_test.php
   ══════════════════════════════════════════════════════════════════════════ */

const SEAT_TABLE_MAX         = 80;    /* guests.table_id VARCHAR(80) */
const SEAT_GROUP_MAX         = 60;    /* guests.group_name VARCHAR(60) */
const SEAT_ZONE_LABEL_MAX    = 30;
const SEAT_LAYOUT_TABLES_MAX = 150;
const SEAT_LAYOUT_ZONES_MAX  = 30;
const SEAT_GROUPS_MAX        = 40;
const SEAT_BULK_MAX          = 500;
const SEAT_ZONE_KINDS = ['stage', 'couple', 'dance', 'door', 'music', 'photo', 'cake', 'gift', 'kids', 'bar', 'custom'];

/** Ad / masa / qeyd təmizləmə: boşluqlar sıxılır, idarə simvolları atılır, uzunluq kəsilir */
function seatClean($v, int $max): string {
    $s = is_string($v) ? $v : (is_int($v) || is_float($v) ? (string) $v : '');
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? '';
    $s = trim(preg_replace('/\s+/u', ' ', $s) ?? '');
    return mb_substr($s, 0, $max);
}

/** Tərəf: forma və Excel dəyərləri («Qız evi», «gəlin», «Oğlan evi», «bəy», bride, groom…) → 'bride' | 'groom' | null */
function seatSide($v): ?string {
    $s = mb_strtolower(seatClean($v, 40));
    $s = str_replace("\u{0307}", '', $s);                       /* «İ» → «i̇» birləşdirici nöqtə */
    $s = strtr($s, ['ı' => 'i', 'ə' => 'e', 'ğ' => 'g', 'ö' => 'o', 'ü' => 'u', 'ş' => 's', 'ç' => 'c']);
    if ($s === '') return null;
    if (in_array($s, ['bride', 'q', 'qiz'], true)) return 'bride';
    if (in_array($s, ['groom', 'o', 'oglan'], true)) return 'groom';
    foreach (['qiz', 'gelin', 'bride', 'невест'] as $w) if (str_contains($s, $w)) return 'bride';
    foreach (['oglan', 'bey', 'groom', 'жених'] as $w) if (str_contains($s, $w)) return 'groom';
    return null;
}

/** Qrup adı; boşdursa null */
function seatGroup($v): ?string {
    $s = seatClean($v, SEAT_GROUP_MAX);
    return $s === '' ? null : $s;
}

/** Ədəd [min..max] aralığında; ədəd deyilsə $def */
function seatNum($v, float $min, float $max, ?float $def): ?float {
    if (!is_int($v) && !is_float($v) && !(is_string($v) && is_numeric($v))) return $def;
    $f = (float) $v;
    if (!is_finite($f)) return $def;
    return round(min($max, max($min, $f)), 2);
}

/**
 * Zal planını yoxla və təmizlə (müştəridən gələn JSON — etibarsızdır).
 * `zones` null qalırsa müştəri tərəfi standart zonaları göstərir (heç vaxt
 * saxlanmayıb); boş massiv isə «hamısını silmişəm» deməkdir.
 */
function seatLayoutNormalize($in): array {
    $in = is_array($in) ? $in : [];

    $tables = [];
    $seen = [];
    foreach (is_array($in['tables'] ?? null) ? $in['tables'] : [] as $t) {
        if (count($tables) >= SEAT_LAYOUT_TABLES_MAX) break;
        if (!is_array($t)) continue;
        $name = seatClean($t['name'] ?? '', SEAT_TABLE_MAX);
        $key = mb_strtolower($name);
        if ($name === '' || isset($seen[$key])) continue;   /* DB müqayisəsi böyük-kiçik hərfə həssas deyil */
        $seen[$key] = true;
        $tables[] = [
            'name'  => $name,
            'shape' => ($t['shape'] ?? '') === 'long' ? 'long' : 'round',
            'cap'   => (int) seatNum($t['cap'] ?? null, 1, 60, 10),
            'x'     => seatNum($t['x'] ?? null, 0, 100, null),
            'y'     => seatNum($t['y'] ?? null, 0, 100, null),
        ];
    }

    $zones = null;
    if (is_array($in['zones'] ?? null)) {
        $zones = [];
        $ids = [];
        foreach ($in['zones'] as $z) {
            if (count($zones) >= SEAT_LAYOUT_ZONES_MAX) break;
            if (!is_array($z)) continue;
            $label = seatClean($z['label'] ?? '', SEAT_ZONE_LABEL_MAX);
            $id = (int) seatNum($z['id'] ?? null, 1, 9999, 0);
            if ($label === '' || $id === 0 || isset($ids[$id])) continue;
            $ids[$id] = true;
            $zones[] = [
                'id'    => $id,
                'label' => $label,
                'kind'  => in_array($z['kind'] ?? '', SEAT_ZONE_KINDS, true) ? $z['kind'] : 'custom',
                'shape' => ($z['shape'] ?? '') === 'oval' ? 'oval' : 'rect',
                'x'     => seatNum($z['x'] ?? null, 0, 100, 50),
                'y'     => seatNum($z['y'] ?? null, 0, 100, 50),
                'w'     => seatNum($z['w'] ?? null, 3, 100, 16),
                'h'     => seatNum($z['h'] ?? null, 2, 100, 8),
            ];
        }
    }

    $groups = [];
    foreach (is_array($in['groups'] ?? null) ? $in['groups'] : [] as $g) {
        if (count($groups) >= SEAT_GROUPS_MAX) break;
        $g = seatGroup($g);
        if ($g !== null && !in_array($g, $groups, true)) $groups[] = $g;
    }

    return [
        'v'              => 1,
        'tables'         => $tables,
        'zones'          => $zones,
        'groups'         => $groups,
        'showMap'        => ($in['showMap'] ?? false) === true,
        'showTablemates' => ($in['showTablemates'] ?? true) !== false,
    ];
}

/** Dəvətnamə qonaqlarına nə göstərilir (ictimai get_guests). Plan yoxdursa köhnə davranış: masa yoldaşları görünür, xəritə yox. */
function seatPublicSeating(?array $layout): array {
    $showMap = (bool) ($layout['showMap'] ?? false);
    return [
        'showTablemates' => (bool) ($layout['showTablemates'] ?? true),
        'showMap'        => $showMap,
        'layout'         => $showMap ? ['tables' => $layout['tables'] ?? [], 'zones' => $layout['zones'] ?? null] : null,
    ];
}

/* ── DB ───────────────────────────────────────────────────────────────── */

function seatLayoutLoad(PDO $db, string $slug): ?array {
    $st = $db->prepare('SELECT layout_json FROM seating_layouts WHERE invitation_id = :s LIMIT 1');
    $st->execute([':s' => $slug]);
    $raw = $st->fetchColumn();
    if ($raw === false) return null;
    $d = json_decode((string) $raw, true);
    return is_array($d) ? seatLayoutNormalize($d) : null;
}

/** null → sətir silinir (geri qaytarma heç vaxt saxlanmamış vəziyyətə qaytaranda) */
function seatLayoutSave(PDO $db, string $slug, ?array $layout): void {
    if ($layout === null) {
        $db->prepare('DELETE FROM seating_layouts WHERE invitation_id = :s')->execute([':s' => $slug]);
        return;
    }
    $db->prepare('INSERT INTO seating_layouts (invitation_id, layout_json) VALUES (:s, :j)
                  ON DUPLICATE KEY UPDATE layout_json = VALUES(layout_json)')
       ->execute([':s' => $slug, ':j' => json_encode($layout, JSON_UNESCAPED_UNICODE)]);
}

/** Toplu dəyişiklik üçün id siyahısı (təkrarsız, müsbət, limitli) */
function seatIds($v): array {
    $out = [];
    foreach (is_array($v) ? $v : [] as $id) {
        $id = is_int($id) || (is_string($id) && ctype_digit($id)) ? (int) $id : 0;
        if ($id > 0) $out[$id] = $id;
        if (count($out) >= SEAT_BULK_MAX) break;
    }
    return array_values($out);
}

/** Toplu yamaq: yalnız göndərilən sahələr. side '' / null → tərəfsiz */
function seatPatch($v): array {
    $v = is_array($v) ? $v : [];
    $p = [];
    if (array_key_exists('table_id', $v))   $p['table_id']   = seatClean($v['table_id'], SEAT_TABLE_MAX);
    if (array_key_exists('side', $v))       $p['side']       = seatSide($v['side']);
    if (array_key_exists('group_name', $v)) $p['group_name'] = seatGroup($v['group_name']);
    return $p;
}

/** Seçilmiş qonaqlara eyni dəyişikliyi tətbiq et; əvvəlki dəyərləri qaytarır (geri qaytarma üçün) */
function seatApplyBulk(PDO $db, string $slug, array $ids, array $patch): array {
    if (!$ids || !$patch) return [];
    $in = implode(',', array_fill(0, count($ids), '?'));
    $q = $db->prepare("SELECT id, table_id, side, group_name FROM guests WHERE invitation_id = ? AND id IN ($in)");
    $q->execute([$slug, ...$ids]);
    $before = $q->fetchAll(PDO::FETCH_ASSOC);
    if (!$before) return [];
    $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($patch)));
    $u = $db->prepare("UPDATE guests SET $sets WHERE invitation_id = ? AND id IN ($in)");
    $u->execute([...array_values($patch), $slug, ...$ids]);
    return array_map(fn($r) => ['id' => (int) $r['id'], 'table_id' => $r['table_id'], 'side' => $r['side'], 'group_name' => $r['group_name']], $before);
}

/** Qonaq sahələrini əvvəlki halına qaytar (yalnız sətirdə olan açarlar) */
function seatRestoreGuests(PDO $db, string $slug, array $rows): void {
    foreach ($rows as $r) {
        if (!is_array($r) || empty($r['id'])) continue;
        $f = array_intersect_key($r, array_flip(['table_id', 'full_name', 'notes', 'side', 'group_name']));
        if (!$f) continue;
        if (array_key_exists('notes', $f)) $f['notes'] = ($f['notes'] ?? '') === '' ? null : $f['notes'];
        $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($f)));
        $db->prepare("UPDATE guests SET $sets WHERE id = ? AND invitation_id = ?")
           ->execute([...array_values($f), (int) $r['id'], $slug]);
    }
}

/**
 * Zal planını saxla. `renames` — [{from,to}] (masanın adı dəyişib), `removed` —
 * silinən masaların adları (qonaqları masasız qalır). Hamısı bir tranzaksiyada.
 * @return array{layout: array, before: ?array, guests: array}
 */
function seatApplyLayout(PDO $db, string $slug, $layoutIn, $renamesIn, $removedIn): array {
    $layout = seatLayoutNormalize($layoutIn);
    $renames = [];
    foreach (is_array($renamesIn) ? array_slice($renamesIn, 0, SEAT_LAYOUT_TABLES_MAX) : [] as $r) {
        if (!is_array($r)) continue;
        $from = seatClean($r['from'] ?? '', SEAT_TABLE_MAX);
        $to   = seatClean($r['to'] ?? '', SEAT_TABLE_MAX);
        if ($from !== '' && $to !== '' && $from !== $to) $renames[] = [$from, $to];
    }
    $removed = [];
    foreach (is_array($removedIn) ? array_slice($removedIn, 0, SEAT_LAYOUT_TABLES_MAX) : [] as $n) {
        $n = seatClean($n, SEAT_TABLE_MAX);
        if ($n !== '') $removed[] = $n;
    }

    $db->beginTransaction();
    try {
        $before = seatLayoutLoad($db, $slug);
        $touched = array_merge(array_column($renames, 0), $removed);
        $guests = [];
        if ($touched) {
            $in = implode(',', array_fill(0, count($touched), '?'));
            $q = $db->prepare("SELECT id, table_id FROM guests WHERE invitation_id = ? AND table_id IN ($in)");
            $q->execute([$slug, ...$touched]);
            $guests = array_map(fn($r) => ['id' => (int) $r['id'], 'table_id' => $r['table_id']], $q->fetchAll(PDO::FETCH_ASSOC));
        }
        $ren = $db->prepare('UPDATE guests SET table_id = ? WHERE invitation_id = ? AND table_id = ?');
        foreach ($renames as [$from, $to]) $ren->execute([$to, $slug, $from]);
        foreach ($removed as $n) $ren->execute(['', $slug, $n]);
        seatLayoutSave($db, $slug, $layout);
        $db->commit();
    } catch (Throwable $e) {
        if ($db->inTransaction()) $db->rollBack();
        throw $e;
    }
    return ['layout' => $layout, 'before' => $before, 'guests' => $guests];
}
