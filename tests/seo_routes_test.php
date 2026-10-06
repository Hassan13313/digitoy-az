<?php
/* ══════════════════════════════════════════════════
   Phase 47 — seo.php marşrutları: hüquqi səhifələr + 404

   İşə salma:  php tests/seo_routes_test.php
   DB TƏLƏB ETMİR. 1) saf funksiyalar mənbədən götürülür; 2) seo.php
   kökdəki index.html ilə müvəqqəti qovluqda ayrıca prosesdə işlədilir.
   Uyğunluq (docs.js ↔ seo.php ↔ sitemap.xml): tests/site_routes_test.mjs.
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

$root = dirname(__DIR__);
$src  = file_get_contents($root . '/public/seo.php');
foreach (['seoLegalPages', 'seoIsAppRoute'] as $fn) {
    if (!preg_match('/\nfunction ' . $fn . '\(.*?\n\}/s', $src, $m)) { echo "FAIL: `$fn` seo.php-də tapılmadı\n"; exit(1); }
    eval($m[0]);
}

/* ── 1. Saf funksiyalar ── */
ok('3 hüquqi səhifə', array_keys(seoLegalPages()) === ['/mexfilik', '/sertler', '/geri-qaytarma']);
foreach (seoLegalPages() as $p => [$t, $d]) {
    ok("$p: başlıq və təsvir dolu", str_ends_with($t, ' | DigiToy') && mb_strlen($d) >= 80 && mb_strlen($d) <= 170);
}
foreach (['/preview/live', '/admin', '/admin/orders', '/demo/template/royal-gold'] as $p) ok("tətbiq marşrutu: $p", seoIsAppRoute($p));
foreach (['/bu-yoxdur', '/invite', '/mexfilikx', '/demo/template/', '/admin.php', '/preview'] as $p) ok("naməlum: $p", !seoIsAppRoute($p));

/* ── 2. Real cavab (ayrıca prosesdə) ── */
$tmp = sys_get_temp_dir() . '/dt_seo_routes_' . getmypid();
@mkdir($tmp);
copy($root . '/public/seo.php', $tmp . '/seo.php');
copy($root . '/index.html', $tmp . '/index.html');
/* Windows-da escapeshellarg dırnaqları silir → kod -r ilə yox, ayrıca faylla ötürülür */
file_put_contents($tmp . '/run.php', '<?php $_SERVER["REQUEST_URI"] = $argv[1]; ob_start(); include __DIR__ . "/seo.php";'
    . ' $o = ob_get_clean(); echo (int) http_response_code(), "\n", $o;');
function seoRun(string $tmp, string $uri): array {
    $out = shell_exec(escapeshellarg(PHP_BINARY) . ' -d display_errors=0 ' . escapeshellarg($tmp . '/run.php') . ' ' . escapeshellarg($uri) . ' 2>&1');
    [$status, $html] = explode("\n", (string) $out, 2) + [1 => ''];
    preg_match('#<title>(.*?)</title>#s', $html, $t);
    preg_match('#<link rel="canonical" href="([^"]*)"#', $html, $c);
    preg_match('#<meta name="robots" content="([^"]*)"#', $html, $r);
    return ['status' => (int) $status, 'title' => $t[1] ?? '', 'canon' => $c[1] ?? '', 'robots' => $r[1] ?? '', 'html' => $html];
}
$run = fn (string $uri) => seoRun($tmp, $uri);

foreach (seoLegalPages() as $p => [$t]) {
    foreach ([$p, $p . '/'] as $uri) {
        $r = $run($uri);
        ok("$uri → 200, öz canonical-ı, indekslənir", $r['status'] !== 404 && $r['title'] === htmlspecialchars($t, ENT_QUOTES)
           && $r['canon'] === 'https://digitoy.az' . $p && str_starts_with($r['robots'], 'index'));
    }
    ok("$p: BreadcrumbList var", str_contains($run($p)['html'], '"BreadcrumbList"'));
}
$r = $run('/bu-yoxdur');
ok('/bu-yoxdur → 404 + «Səhifə tapılmadı»', $r['status'] === 404 && str_starts_with($r['title'], 'Səhifə tapılmadı') && str_starts_with($r['robots'], 'noindex'));
ok('/admin → 404 deyil', $run('/admin')['status'] !== 404);
ok('/ → 404 deyil, ana səhifə canonical', ($h = $run('/'))['status'] !== 404 && $h['canon'] === 'https://digitoy.az/');

@unlink($tmp . '/run.php'); @unlink($tmp . '/seo.php'); @unlink($tmp . '/index.html'); @rmdir($tmp);

echo "\n$passed ok, $failed FAIL\n";
exit($failed ? 1 : 0);
