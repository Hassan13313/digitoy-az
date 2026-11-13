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
@mkdir($tmp . '/guides');
$guideFiles = glob($root . '/public/guides/*.json') ?: [];
foreach ($guideFiles as $f) copy($f, $tmp . '/guides/' . basename($f));
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

/* Phase 50 — müştəri paneli: mövcud marşrut, indekslənmir, linkləri izlənmir, adlar yoxdur */
$r = $run('/invite/aytac-ve-niyaz-51eedb/panel');
ok('/invite/<slug>/panel → 404 deyil + «Müştəri paneli»', $r['status'] !== 404 && $r['title'] === 'Müştəri paneli | DigiToy');
ok('/invite/<slug>/panel → noindex, nofollow', $r['robots'] === 'noindex, nofollow');
ok('/invite/<slug>/panel → canonical yoxdur', $r['canon'] === '');
ok('/invite/<slug>/foto əvvəlki kimi noindex, follow', $run('/invite/aytac-ve-niyaz-51eedb/foto')['robots'] === 'noindex, follow');
ok('/invite/<slug>/bilinmeyen → 404', $run('/invite/aytac-ve-niyaz-51eedb/bilinmeyen')['status'] === 404);
ok('/ → 404 deyil, ana səhifə canonical', ($h = $run('/'))['status'] !== 404 && $h['canon'] === 'https://digitoy.az/');

/* Phase 51 — axtarış sözləri + JS-siz botlar üçün <noscript> mətni */
ok('/ → title «Online Dəvətnamə» ilə başlayır', str_starts_with($h['title'], 'Online Dəvətnamə'));
ok('/ → <noscript> #root-dan sonra, H1 + FAQ ilə',
    preg_match('#<div id="root"></div>\s*<noscript><main[^>]*><h1>Rəqəmsal Toy Dəvətnamənizi Özünüz Yaradın</h1>#u', $h['html']) === 1
    && str_contains($h['html'], '<h3>Online dəvətnamə nədir?</h3>'));
ok('/ → <noscript> bir dəfə', substr_count($h['html'], '<noscript><main') === 1);   /* şrift fallback-ı <noscript><link> sayılmır */
ok('/ → FAQ dırnaqları HTML-də escape olunub', str_contains($h['html'], '&quot;İndi Başla&quot;'));
ok('/ → FAQPage schema 12 sual, ilki «Online dəvətnamə nədir?»',
    preg_match('#"@type":"FAQPage","mainEntity":\[\{"@type":"Question","name":"Online dəvətnamə nədir\?"#u', $h['html']) === 1
    && substr_count($h['html'], '"@type":"Question"') === 12);
foreach (['/templates' => 'Dəvətnamə Şablonları', '/demo' => 'Online Dəvətnamə Nümunəsi'] as $p => $h1) {
    $r = $run($p);
    ok("$p → title «Online Dəvətnamə» ilə başlayır", str_starts_with($r['title'], 'Online Dəvətnamə'));
    ok("$p → <noscript> H1: $h1", str_contains($r['html'], "<noscript><main") && str_contains($r['html'], "<h1>$h1</h1>"));
}
foreach (['/invite/aytac-ve-niyaz-51eedb', '/invite/aytac-ve-niyaz-51eedb/panel', '/mexfilik', '/bu-yoxdur', '/admin'] as $p) {
    ok("$p → <noscript> YOXDUR (şəxsi/daxili/hüquqi)", !str_contains($run($p)['html'], '<noscript><main'));
}

/* Phase 52 — bələdçilər: public/guides/<slug>.json-dan meta, schema, <noscript>, daxili data */
ok('bələdçi faylları var (≥ 6)', count($guideFiles) >= 6);
foreach ($guideFiles as $f) {
    $g = json_decode(file_get_contents($f), true);
    $p = '/' . $g['slug'];
    $r = $run($p . '/');
    $h = $r['html'];
    ok("$p → 404 deyil, öz title/canonical-ı, indekslənir", $r['status'] !== 404 && $r['title'] === htmlspecialchars($g['title'], ENT_QUOTES)
        && $r['canon'] === 'https://digitoy.az' . $p && $r['robots'] === 'index, follow');
    ok("$p → og:type article", str_contains($h, '<meta property="og:type" content="article" />'));
    ok("$p → Article + BreadcrumbList + FAQPage", str_contains($h, '"@type":"Article"') && str_contains($h, '"@type":"BreadcrumbList"')
        && substr_count($h, '"@type":"Question"') === count($g['faq']));
    $first = $g['sections'][0]['samples'][0] ?? null;
    ok("$p → <noscript>: H1 + bütün bölmələr" . ($first ? ' + ilk nümunə' : ''),
        str_contains($h, '<noscript><main') && str_contains($h, '<h1>' . htmlspecialchars($g['h1'], ENT_QUOTES | ENT_HTML5) . '</h1>')
        && substr_count($h, '<h2>') >= count($g['sections'])
        && (!$first || str_contains($h, nl2br(htmlspecialchars($first, ENT_QUOTES | ENT_HTML5), false))));
    ok("$p → daxili JSON data oxunur, slug eynidir",
        preg_match('#<script id="dt-guide-data" type="application/json">(.*?)</script>#s', $h, $m) === 1
        && (json_decode($m[1], true)['slug'] ?? '') === $g['slug']);
}
ok('/ → <noscript>-da bələdçi linkləri', str_contains($run('/')['html'], 'Bələdçilər: <a href="/'));
ok('/toy-devetnamesi-metnleri/x → 404', $run('/toy-devetnamesi-metnleri/x')['status'] === 404);
ok('/bu-beledci-yoxdur → 404, data yoxdur', ($r = $run('/bu-beledci-yoxdur'))['status'] === 404 && !str_contains($r['html'], 'dt-guide-data'));
ok('/..%2Fapi → 404 (fayl yolundan çıxmaq olmur)', $run('/..%2Fapi')['status'] === 404);
ok('/mexfilik → bələdçi datası yoxdur', !str_contains($run('/mexfilik')['html'], 'dt-guide-data'));

/* 2026-11-14 — PRERENDER: _prerender/home.html varsa ana səhifənin root-una qoyulur (data-pre),
   eyni mətnli <noscript> çıxır; başqa marşrutlar və fayl olmayanda — əvvəlki qayda */
@mkdir($tmp . '/_prerender');
$fake = '<div class="min-h-screen bg-cream"><main id="main"><h1 id="hero-title">Hazır başlıq</h1></main></div>';
file_put_contents($tmp . '/_prerender/home.html', $fake);
$h = $run('/')['html'];
ok('prerender: / → <div id="root" data-pre="/"> + hazır HTML', str_contains($h, '<div id="root" data-pre="/">' . $fake . '</div>'));
ok('prerender: / → <noscript><main> yoxdur (məzmun HTML-dədir)', !str_contains($h, '<noscript><main'));
ok('prerender: / → meta/schema yerindədir', str_contains($h, '"@type":"FAQPage"') && str_contains($h, '<link rel="canonical" href="https://digitoy.az/" />'));
foreach (['/templates', '/sablonlar/xina-gecesi', '/invite/aytac-ve-niyaz-51eedb', '/bu-yoxdur'] as $p) {
    $h = $run($p)['html'];
    ok("prerender: $p → root boş, data-pre yoxdur", str_contains($h, '<div id="root"></div>') && !str_contains($h, 'data-pre'));
}
/* kataloq səhifələri: öz faylı varsa öz root-u, data-pre = yol; naməlum tədbir/fayl adı yolu — heç nə */
file_put_contents($tmp . '/_prerender/templates.html', '<main>T</main>');
file_put_contents($tmp . '/_prerender/sablonlar--xina-gecesi.html', '<main>X</main>');
ok('prerender: /templates → öz fraqmenti', str_contains($run('/templates')['html'], '<div id="root" data-pre="/templates"><main>T</main></div>'));
ok('prerender: /sablonlar/xina-gecesi → öz fraqmenti', str_contains($run('/sablonlar/xina-gecesi')['html'], '<div id="root" data-pre="/sablonlar/xina-gecesi"><main>X</main></div>'));
ok('prerender: /sablonlar/ad-gunu (fayl yoxdur) → boş root', str_contains($run('/sablonlar/ad-gunu')['html'], '<div id="root"></div>'));
ok('prerender: /sablonlar/bilinmeyen → 404, fraqment yoxdur', ($r = $run('/sablonlar/bilinmeyen'))['status'] === 404 && !str_contains($r['html'], 'data-pre'));
ok('prerender: /sablonlar/..%2Fhome → fraqment yoxdur', !str_contains($run('/sablonlar/..%2Fhome')['html'], 'data-pre'));
@unlink($tmp . '/_prerender/templates.html'); @unlink($tmp . '/_prerender/sablonlar--xina-gecesi.html');
@unlink($tmp . '/_prerender/home.html'); @rmdir($tmp . '/_prerender');

/* müvəqqəti qovluğu təmizlə — yalnız yuxarıda özümüzün köçürdüyü fayllar */
foreach ($guideFiles as $f) @unlink($tmp . '/guides/' . basename($f));
@rmdir($tmp . '/guides');
@unlink($tmp . '/run.php'); @unlink($tmp . '/seo.php'); @unlink($tmp . '/index.html'); @rmdir($tmp);

/* ── 4. /sablonlar/* bot HTML-i: hər şablon adının üz qabığı tapılır (2026-11-13: «Maşallah» →
      masallah.webp axtarılırdı, fayl mashallah.webp-dir — sünnət səhifəsində şəkil düşmürdü) ── */
foreach (['seoConceptPages', 'seoTemplateSlug'] as $fn) {
    if (!function_exists($fn)) {
        if (!preg_match('/\nfunction ' . $fn . '\(.*?\n\}/s', $src, $m)) { echo "FAIL: `$fn` seo.php-də tapılmadı\n"; exit(1); }
        eval($m[0]);
    }
}
foreach (seoConceptPages() as $slug => $cp) {
    $missing = array_values(array_filter($cp['names'], fn($n) => !is_file($root . '/public/img/templates/' . seoTemplateSlug($n) . '.webp')));
    ok("/sablonlar/$slug: bütün şablonların üz qabığı var" . ($missing ? ' — yoxdur: ' . implode(', ', $missing) : ''), !$missing);
}

echo "\n$passed ok, $failed FAIL\n";
exit($failed ? 1 : 0);
