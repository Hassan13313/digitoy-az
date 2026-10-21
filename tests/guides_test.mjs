/* ─────────────────────────────────────────────────────────────────────────────
   BƏLƏDÇİ SƏHİFƏLƏRİ (Phase 52, SEO)

   Hər bələdçi dörd yerdə yaşayır və biri unudulsa səssizcə sınır:
     • public/guides/<slug>.json — mətnin özü (GuidePage + seo.php oxuyur)
     • src/data/guides.js        — marşrut, footer linki, <head> title/description
     • public/sitemap.xml        — axtarış sistemləri
     • public/llms.txt           — AI axtarışları
   Server tərəfi (meta, schema, <noscript>): tests/seo_routes_test.php.

   İşə salmaq: node tests/guides_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { GUIDES, matchGuideRoute, findGuide } from '../src/data/guides.js'
import { isKnownSpaPath, matchLegalRoute } from '../src/utils/siteRoutes.js'

let fail = 0
let pass = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; return }
  console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)
const read = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8')

const dir = fileURLToPath(new URL('../public/guides/', import.meta.url))
const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
const sitemap = read('../public/sitemap.xml')
const llms = read('../public/llms.txt')

/* ── 1. Siyahı ↔ fayllar ── */
eq('fayl sayı = GUIDES sayı', files.length, GUIDES.length)
eq('slug-lar təkrarlanmır', new Set(GUIDES.map((g) => g.slug)).size, GUIDES.length)
for (const g of GUIDES) ok(`${g.slug}: JSON faylı var`, files.includes(`${g.slug}.json`))

/* ── 2. Hər JSON: forma, SEO uzunluqları, mətnlərin keyfiyyəti ── */
const isStr = (v) => typeof v === 'string' && v.trim() !== ''
const blockOk = (b) => isStr(b)
  || (Array.isArray(b?.list) && b.list.length > 0 && b.list.every(isStr))
  || (Array.isArray(b?.steps) && b.steps.length > 1 && b.steps.every(isStr))

for (const f of files) {
  const slug = f.replace(/\.json$/, '')
  let d
  try { d = JSON.parse(readFileSync(dir + f, 'utf8')) } catch (e) { ok(`${f}: JSON oxunur`, false, e.message); continue }
  const g = findGuide(slug)
  eq(`${slug}: slug fayl adı ilə eyni`, d.slug, slug)
  if (g) {
    eq(`${slug}: title guides.js ilə eyni`, d.title, g.title)
    eq(`${slug}: description guides.js ilə eyni`, d.description, g.description)
    eq(`${slug}: label guides.js ilə eyni`, d.label, g.label)
  }
  ok(`${slug}: slug formatı (seo.php regex)`, /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
  ok(`${slug}: title ≤ 70 və «| DigiToy» ilə bitir`, d.title.length <= 70 && d.title.endsWith(' | DigiToy'), `${d.title.length}`)
  ok(`${slug}: title «Dəvətnamə» daşıyır`, /dəvətnamə/i.test(d.title))
  ok(`${slug}: description 120–170`, d.description.length >= 120 && d.description.length <= 170, `${d.description.length}`)
  ok(`${slug}: description «online» daşıyır`, /online/i.test(d.description))
  ok(`${slug}: h1 var`, isStr(d.h1))
  ok(`${slug}: updated ISO tarix`, /^\d{4}-\d{2}-\d{2}$/.test(d.updated))
  ok(`${slug}: intro`, Array.isArray(d.intro) && d.intro.length > 0 && d.intro.every(blockOk))
  ok(`${slug}: ən azı 4 bölmə`, Array.isArray(d.sections) && d.sections.length >= 4)
  const ids = (d.sections || []).map((s) => s.id)
  eq(`${slug}: bölmə id-ləri unikal`, new Set(ids).size, ids.length)
  for (const s of d.sections || []) {
    ok(`${slug}#${s.id}: id formatı`, /^[a-z0-9-]+$/.test(s.id))
    ok(`${slug}#${s.id}: başlıq`, isStr(s.title))
    ok(`${slug}#${s.id}: body və ya nümunə var`, (s.body?.length || 0) + (s.samples?.length || 0) > 0)
    ok(`${slug}#${s.id}: body blokları düzgün`, (s.body || []).every(blockOk))
    for (const t of s.samples || []) {
      ok(`${slug}#${s.id}: nümunə mətn dolu`, isStr(t))
      ok(`${slug}#${s.id}: [yer tutucu] mötərizələri cütdür`, (t.match(/\[/g) || []).length === (t.match(/\]/g) || []).length && !/\[[^\]]*\[/.test(t))
    }
  }
  const samples = (d.sections || []).reduce((n, s) => n + (s.samples?.length || 0), 0)
  if (slug.endsWith('-metnleri')) ok(`${slug}: ən azı 6 nümunə mətn`, samples >= 6, `${samples}`)
  ok(`${slug}: FAQ ≥ 3, sual/cavab dolu`, Array.isArray(d.faq) && d.faq.length >= 3 && d.faq.every((x) => isStr(x.q) && isStr(x.a)))
  ok(`${slug}: CTA başlıq + mətn`, isStr(d.cta?.title) && isStr(d.cta?.text))
  ok(`${slug}: related mövcud bələdçilərdir, özü yox`, Array.isArray(d.related) && d.related.length >= 2
    && d.related.every((r) => r !== slug && findGuide(r)))
  ok(`${slug}: nümunə mətn qalıqları yoxdur`, !/lorem|todo|xxx/i.test(JSON.stringify(d)))

  /* ── 3. Marşrut, sitemap, llms.txt ── */
  eq(`${slug}: matchGuideRoute`, matchGuideRoute(`/${slug}`), slug)
  eq(`${slug}: sondakı kəsiklə də`, matchGuideRoute(`/${slug}/`), slug)
  ok(`${slug}: SPA tanıyır (404 deyil)`, isKnownSpaPath(`/${slug}`))
  eq(`${slug}: hüquqi səhifə ilə toqquşmur`, matchLegalRoute(`/${slug}`), null)
  ok(`${slug}: sitemap-da`, sitemap.includes(`<loc>https://digitoy.az/${slug}</loc>`))
  ok(`${slug}: llms.txt-də`, llms.includes(`https://digitoy.az/${slug})`))
}

for (const p of ['/toy-devetnamesi-metnleri/x', '/TOY-DEVETNAMESI-METNLERI', '/guides', '/guides/toy-devetnamesi-metnleri.json', '/devetname-metnleri'])
  eq(`bələdçi deyil: ${p}`, matchGuideRoute(p), null)

console.log(fail ? `\n${pass} ok, ${fail} FAIL` : `\nguides: ${pass} yoxlama keçdi`)
process.exit(fail ? 1 : 0)
