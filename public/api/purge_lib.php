<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Birdəfəlik silmənin FAYL köməkçiləri (Phase 46 → 47)

   YALNIZ include edilir (api/.htaccess-də birbaşa giriş bağlıdır).
   Əvvəl admin_purge.php-nin sonunda idi; o fayl yüklənən kimi requireAdmin()
   işlətdiyi üçün avtomatik təmizləmə (retention.php) onları götürə bilmirdi.
   tests/admin_purge_test.php. Phase 48: sifariş əlaqəsi order_link.php-dən.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/order_link.php';

/** Bu slug-un öz upload qovluqları. Təhlükəli/rezerv ad → BOŞ siyahı. */
function purgeSlugDirs(string $root, string $slug): array {
    /* Phase 48: tire ilə BAŞLAYA bilər (adsız dəvətnamə «-ve--xlcn9k»), amma ən azı bir hərf/rəqəm */
    if (!preg_match('/^(?=-*[A-Za-z0-9])[A-Za-z0-9-]{1,120}$/', $slug)) return [];
    if (in_array(strtolower($slug), ['music'], true)) return [];   /* uploads/music — köhnə musiqi KÖKÜ */
    return [$root . '/' . $slug, $root . '/_admin/' . $slug, $root . '/music/' . $slug];
}

/** form_data-dakı _story/_music FAYL istinadları (uploads/-a nisbi, təkrarsız) */
function purgeReferencedFiles(array $fd): array {
    $out  = [];
    $walk = function ($v) use (&$walk, &$out) {
        if (is_array($v)) { foreach ($v as $x) $walk($x); return; }
        if (is_string($v) && preg_match('#^(?:https?://[^/]+)?/uploads/((?:_story|_music)/[A-Za-z0-9_-]+/[A-Za-z0-9_-]+\.[A-Za-z0-9]{2,5})$#', $v, $m)) {
            $out[$m[1]] = true;
        }
    };
    $walk($fd);
    return array_keys($out);
}

/** form_data-dakı _story/_music fayllarından başqa HEÇ BİR dəvətnamənin ($exclSlug
    xaric) və sifarişin ($exclOrderIds xaric) işlətmədikləri — yalnız bunlar silinə bilər. */
function purgeOwnRefs(PDO $db, array $fd, string $exclSlug, array $exclOrderIds): array {
    return purgeUnsharedRefs($db, purgeReferencedFiles($fd), $exclSlug, $exclOrderIds);
}

/** Verilən _story/_music fayllarından başqa HEÇ BİR dəvətnamənin ($exclSlug xaric)
    və sifarişin ($exclOrderIds xaric) işlətmədikləri. Avtomatik təmizləmə də
    (retention.php) bunu işlədir — bucket-dəki adsız faylları da yoxlamaq üçün. */
function purgeUnsharedRefs(PDO $db, array $rels, string $exclSlug, array $exclOrderIds): array {
    $excl = $exclOrderIds ? ' AND id NOT IN (' . implode(',', array_map('intval', $exclOrderIds)) . ')' : '';
    $inv  = $db->prepare("SELECT COUNT(*) FROM invitations WHERE slug <> :s AND form_data LIKE :p ESCAPE '!'");
    $drf  = $db->prepare("SELECT COUNT(*) FROM draft_invitations WHERE form_data LIKE :p ESCAPE '!'" . $excl);
    $own  = [];
    foreach ($rels as $rel) {
        $pat = purgeLikePattern($rel);
        $inv->execute([':s' => $exclSlug, ':p' => $pat]);
        $shared = (int) $inv->fetchColumn();
        $drf->execute([':p' => $pat]);
        $shared += (int) $drf->fetchColumn();
        if ($shared === 0) $own[] = $rel;
    }
    return $own;
}

/** Hələ CANLI dəvətnaməyə bağlı sifarişlər → [id => slug] */
function purgeLinkedOrders(PDO $db, array $orders): array {
    $out = [];
    foreach ($orders as $o) {
        $slug = orderInvitationSlug($db, $o['approved_slug'] ?? null, $o['draft_code'] ?? null);
        if ($slug !== null) $out[(int) $o['id']] = $slug;
    }
    return $out;
}

/** «Silinmiş» sifarişləri birdəfəlik sil. Canlı dəvətnaməyə bağlılar SAXLANILIR (kept);
    silinənlərin başqa heç yerdə işlənməyən _story/_music faylları DB-dən SONRA silinir. */
function purgeOrders(PDO $db, string $uploads, array $orders): array {
    $linked = purgeLinkedOrders($db, $orders);
    $kept = []; $go = [];
    foreach ($orders as $o) {
        if (isset($linked[(int) $o['id']])) $kept[] = (string) $o['draft_code'];
        else $go[(int) $o['id']] = $o;
    }
    if (!$go) return ['deleted' => 0, 'files' => 0, 'kept' => $kept];

    $ids  = array_keys($go);
    $refs = [];
    foreach ($go as $o) {
        foreach (purgeOwnRefs($db, json_decode((string) $o['form_data'], true) ?: [], '', $ids) as $rel) $refs[$rel] = true;
    }
    $st = $db->prepare("DELETE FROM draft_invitations WHERE status = 'deleted' AND id IN (" . implode(',', $ids) . ')');
    $st->execute();
    $n = $st->rowCount();

    $files = 0;
    if ($n === count($ids)) {   /* arada biri bərpa olunubsa fayllara toxunma */
        foreach (array_keys($refs) as $rel) {
            if (($p = purgeSafePath($uploads, $rel)) !== null) $files += purgeRmTree($p, false)[0];
        }
    }
    return ['deleted' => $n, 'files' => $files, 'kept' => $kept];
}

/** form_data-da bu faylı tapan LIKE nümunəsi (ESCAPE '!'). Seqmentlər % ilə
    birləşir: DB-də JSON slash-ları «\/» kimi saxlanılır (JSON_UNESCAPED_SLASHES
    yoxdur), tam URL də ola bilər. Artıq uyğunluq → fayl SAXLANILIR (təhlükəsiz). */
function purgeLikePattern(string $rel): string {
    $esc = fn ($s) => str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $s);
    return '%' . implode('%', array_map($esc, explode('/', $rel))) . '%';
}

/** Real yol uploads kökünün İÇİNDƏdirsə qaytar (kökün özü, mövcud olmayan, kənar → null) */
function purgeSafePath(string $root, string $rel): ?string {
    $rootReal = realpath($root);
    if ($rootReal === false || $rel === '') return null;
    $p = realpath($rootReal . '/' . $rel);
    if ($p === false || $p === $rootReal) return null;
    return strpos($p, $rootReal . DIRECTORY_SEPARATOR) === 0 ? $p : null;
}

/** Fayl/qovluğu sil (dry → yalnız say). Symlink izlənmir. @return [fayl sayı, bayt] */
function purgeRmTree(string $path, bool $dry): array {
    if (is_link($path) || is_file($path)) {
        $b = (int) @filesize($path);
        if ($dry) return [1, $b];
        return @unlink($path) ? [1, $b] : [0, 0];
    }
    if (!is_dir($path)) return [0, 0];
    $f = 0; $b = 0;
    foreach ((array) @scandir($path) as $e) {
        if ($e === '.' || $e === '..') continue;
        [$ff, $bb] = purgeRmTree($path . '/' . $e, $dry);
        $f += $ff; $b += $bb;
    }
    if (!$dry) @rmdir($path);
    return [$f, $b];
}
