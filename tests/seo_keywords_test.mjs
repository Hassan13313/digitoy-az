/* ─────────────────────────────────────────────────────────────────────────────
   AXTARIŞ SÖZLƏRİ + MƏTN UYĞUNLUĞU (Phase 51)

   Google-da «online dəvətnamə», «elektron dəvətnamə» axtaranlar üçün başlıq,
   təsvir və görünən mətn bu ifadələri daşıyır. Eyni mətn bir neçə yerdə yaşayır
   və biri unudulsa səssizcə ayrılır:
     • src/App.jsx        — brauzerdə title/description (HOME_/DEMO_/TEMPLATES_)
     • public/seo.php     — crawler meta, FAQPage schema, <noscript> mətni
     • index.html         — seo.php sınanda verilən xam fayl
     • src/data/faq.js    — səhifədə görünən FAQ (schema onunla EYNİ olmalıdır)

   İşə salmaq: node tests/seo_keywords_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getFaqItems } from '../src/data/faq.js'
import { LANDING_COPY } from '../src/data/landingCopy.js'

let fail = 0
let pass = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; return }
  console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)
const read = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8')

const app = read('../src/App.jsx')
const seo = read('../public/seo.php')
const html = read('../index.html')
const templatesPage = read('../src/components/landing/TemplatesPage.jsx')

/* PHP tək dırnaqlı sətrini JS sətrinə çevir (\' və \\) */
const phpStr = (s) => s.replace(/\\(['\\])/g, '$1')
const jsConst = (name) => (app.match(new RegExp(`const ${name}\\s*=\\s*'([^']*)'`)) || [])[1]

/* ── 1. App.jsx ↔ seo.php: başlıq və təsvir hərfbəhərf eyni ── */
const pages = [
  ['/', 'HOME', /'title'\s*=>\s*'([^']*)',\s*'desc'\s*=>\s*'([^']*)'/],
  ['/demo', 'DEMO', /\$path === '\/demo'\) \{\s*\$meta\['title'\] = '([^']*)';\s*\$meta\['desc'\]\s*= '([^']*)'/],
  ['/templates', 'TEMPLATES', /\$path === '\/templates'\) \{\s*\$meta\['title'\] = '([^']*)';\s*\$meta\['desc'\]\s*= '([^']*)'/],
]
for (const [path, key, re] of pages) {
  const title = jsConst(`${key}_TITLE`)
  const desc = jsConst(`${key}_DESC`)
  const m = seo.match(re)
  ok(`${path}: seo.php-də meta tapıldı`, !!m)
  ok(`${path}: App.jsx-də ${key}_TITLE/${key}_DESC var`, !!title && !!desc)
  if (!m || !title || !desc) continue
  eq(`${path}: title eynidir`, phpStr(m[1]), title)
  eq(`${path}: description eynidir`, phpStr(m[2]), desc)
  ok(`${path}: title «Online Dəvətnamə» ilə başlayır`, title.startsWith('Online Dəvətnamə'))
  ok(`${path}: title ≤ 70 simvol`, title.length <= 70, `${title.length}`)
  ok(`${path}: title DigiToy ilə bitir`, title.endsWith(' | DigiToy'))
  ok(`${path}: description 120–170 simvol`, desc.length >= 120 && desc.length <= 170, `${desc.length}`)
  ok(`${path}: description «online dəvətnamə» daşıyır`, desc.toLowerCase().includes('online dəvətnamə'))
}
ok('/: title «Elektron» daşıyır', (jsConst('HOME_TITLE') || '').includes('Elektron'))

/* ── 2. index.html (seo.php sınanda) ana səhifə ilə eyni ── */
{
  const t = jsConst('HOME_TITLE')
  const d = jsConst('HOME_DESC')
  eq('index.html: <title>', (html.match(/<title>([^<]*)<\/title>/) || [])[1], t)
  eq('index.html: title 3 yerdə (title, og, twitter)', html.split(t).length - 1, 3)
  eq('index.html: description 3 yerdə', html.split(d).length - 1, 3)
  ok('index.html: <div id="root"></div> (noscript bura qoşulur)', html.includes('<div id="root"></div>'))
  for (const type of ['Organization', 'WebSite']) {
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => { try { return JSON.parse(m[1]) } catch { return null } })
      .find((j) => j && j['@type'] === type)
    ok(`index.html: ${type} JSON-LD oxunur`, !!ld)
    ok(`index.html: ${type} alternateName var`, Array.isArray(ld?.alternateName) && ld.alternateName.length > 0)
  }
}

/* ── 3. FAQ: schema = səhifədə görünən AZ FAQ ── */
{
  const body = (seo.match(/\nfunction seoHomeFaq\(\): array \{([\s\S]*?)\n\}/) || [])[1] || ''
  const php = [...body.matchAll(/\['((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)'\]/g)].map((m) => [phpStr(m[1]), phpStr(m[2])])
  const visible = getFaqItems('az').map((i) => [i.q, i.a])
  eq('FAQ: say eynidir', php.length, visible.length)
  visible.forEach(([q, a], i) => {
    eq(`FAQ ${i + 1}: sual eynidir`, php[i]?.[0], q)
    eq(`FAQ ${i + 1}: cavab eynidir`, php[i]?.[1], a)
  })
  const text = visible.flat().join(' ').toLowerCase()
  ok('FAQ: «online dəvətnamə» görünür', text.includes('online dəvətnamə'))
  ok('FAQ: «elektron» görünür', text.includes('elektron'))
  ok('FAQ: ilk sual «Online dəvətnamə nədir?»', visible[0][0] === 'Online dəvətnamə nədir?')
  for (const l of ['en', 'ru']) eq(`FAQ: ${l} sayı az ilə eyni`, getFaqItems(l).length, visible.length)
  ok('FAQ: «dərs kodu» səhvi qalmayıb', !text.includes('dərs kodu'))
}

/* ── 4. <noscript> mətni səhifədəki mətnlə eyni ── */
{
  const az = LANDING_COPY.az
  ok('noscript: hero H1 landingCopy ilə eyni',
    seo.includes(`<h1>${az.heroTitle1} ${az.heroTitle2} ${az.heroTitleAccent}</h1>`))
  ok('noscript: hero alt mətni landingCopy ilə eyni', seo.includes(`<p>${az.heroSubtitle}</p>`))
  ok('hero alt mətni «online dəvətnamə» daşıyır', az.heroSubtitle.includes('online dəvətnamə'))
  const intro = (templatesPage.match(/az: \{[\s\S]*?intro: '([^']*)'/) || [])[1]
  ok('TemplatesPage: AZ intro tapıldı', !!intro)
  ok('noscript: şablonlar intro TemplatesPage ilə eyni', !!intro && seo.includes(`<p>${intro}</p>`))
  ok('noscript: demo mətni DEMO_DESC ilə eyni', seo.includes(`<p>${jsConst('DEMO_DESC')}</p>`))
}

console.log(fail ? `\n${pass} ok, ${fail} FAIL` : `\nseo_keywords: ${pass} yoxlama keçdi`)
process.exit(fail ? 1 : 0)
