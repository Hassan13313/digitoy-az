/* ─────────────────────────────────────────────────────────────────────────────
   MARŞRUTLAR + SEO UYĞUNLUĞU (Phase 47)

   Hüquqi səhifələr üç yerdə yaşayır və biri unudulsa səssizcə sınır:
     • src/data/legal/docs.js  — brauzer (title/description, marşrut)
     • public/seo.php          — crawler meta + HTTP 404 qərarı
     • public/sitemap.xml      — axtarış sistemləri
   Üstəlik index.html-dəki Organization JSON-LD və security.txt yoxlanılır.

   İşə salmaq: node tests/site_routes_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { matchLegalRoute, isKnownSpaPath } from '../src/utils/siteRoutes.js'
import { LEGAL_DOCS } from '../src/data/legal/docs.js'
import { LEGAL_CONTACT } from '../src/data/legal/ui.js'

let fail = 0
let pass = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; return }
  console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)
const read = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8')

/* ── 1. matchLegalRoute ── */
eq('/mexfilik', matchLegalRoute('/mexfilik'), 'privacy')
eq('/sertler/ (sondakı kəsik)', matchLegalRoute('/sertler/'), 'terms')
eq('/geri-qaytarma#x', matchLegalRoute('/geri-qaytarma#odenis'), 'refund')
eq('/mexfilik?utm=1', matchLegalRoute('/mexfilik?utm=1'), 'privacy')
for (const p of ['/', '/mexfilikx', '/xmexfilik', '/mexfilik/alt', '/MEXFILIK', '']) eq(`uyğun deyil: ${p}`, matchLegalRoute(p), null)

/* ── 2. isKnownSpaPath — naməlum yol 404 ekranı açır ── */
for (const p of ['/', '/index.html', '/demo', '/demo/', '/templates', '/templates/', '/preview/live', '/mexfilik', '/sertler/',
  '/geri-qaytarma', '/demo/template/royal-gold', '/admin', '/admin/orders', '/invite/aytac-ve-niyaz-51eedb',
  '/invite/aytac-ve-niyaz-51eedb/foto']) ok(`tanınır: ${p}`, isKnownSpaPath(p))
for (const p of ['/bu-yoxdur', '/invite', '/invite/', '/demo/template/', '/privacy', '/wp-login.php', '/a/b/c'])
  ok(`naməlum: ${p}`, !isKnownSpaPath(p))

/* ── 3. docs.js ↔ seo.php ↔ sitemap.xml ── */
const seo = read('../public/seo.php')
const sitemap = read('../public/sitemap.xml')
const esc = (s) => s.replace(/'/g, "\\'")
for (const d of LEGAL_DOCS) {
  ok(`${d.id}: seo.php-də path + title + description eynidir`,
    seo.includes(`'${d.path}'`) && seo.includes(`'${esc(d.title)}'`) && seo.includes(`'${esc(d.description)}'`))
  ok(`${d.id}: sitemap-da`, sitemap.includes(`<loc>https://digitoy.az${d.path}</loc>`))
  ok(`${d.id}: path tanınır`, matchLegalRoute(d.path) === d.id)
}
eq('id-lər təkrarsızdır', new Set(LEGAL_DOCS.map((d) => d.id)).size, LEGAL_DOCS.length)
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
eq('sitemap: 6 URL', locs.length, 6)
ok('sitemap: urlset bağlanır', sitemap.trim().endsWith('</urlset>'))

/* ── 4. index.html Organization JSON-LD ── */
const html = read('../index.html')
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
let org = null
for (const b of blocks) {
  try { const j = JSON.parse(b); if (j['@type'] === 'Organization') org = j } catch { ok('JSON-LD parse olunur', false, b.slice(0, 60)) }
}
ok('Organization bloku var', !!org)
if (org) {
  eq('sameAs: Instagram + TikTok', org.sameAs.length, 2)
  ok('sameAs footer linkləri ilə eynidir', org.sameAs.includes('https://www.instagram.com/digitoy.az/') && org.sameAs.includes('https://www.tiktok.com/@digitoy.az'))
  eq('contactPoint telefon', org.contactPoint?.telephone, '+994992133696')
  eq('contactPoint e-poçt', org.contactPoint?.email, LEGAL_CONTACT.email)
  eq('logo PNG', org.logo, 'https://digitoy.az/android-chrome-512x512.png')
}

/* ── 5. security.txt (RFC 9116) ── */
const sec = read('../public/.well-known/security.txt')
const field = (k) => [...sec.matchAll(new RegExp(`^${k}: (.+)$`, 'gm'))].map((m) => m[1].trim())
ok('Contact: mailto — əlaqə e-poçtu', field('Contact').includes(`mailto:${LEGAL_CONTACT.email}`))
ok('bütün Contact-lar URI-dir', field('Contact').every((c) => /^(mailto:|https:\/\/)/.test(c)))
eq('Canonical', field('Canonical')[0], 'https://digitoy.az/.well-known/security.txt')
eq('tək Expires', field('Expires').length, 1)
const exp = Date.parse(field('Expires')[0])
const days = (exp - Date.now()) / 86400000
ok('Expires gələcəkdədir və ≤ 366 gün', days > 0 && days <= 366, `${Math.round(days)} gün`)
if (days > 0 && days < 30) console.log(`  ⚠ security.txt Expires ${Math.round(days)} gün sonra bitir — yenilə`)

console.log(fail ? `\n${pass} ok, ${fail} FAIL` : `\nsite_routes: ${pass} yoxlama keçdi`)
process.exit(fail ? 1 : 0)
