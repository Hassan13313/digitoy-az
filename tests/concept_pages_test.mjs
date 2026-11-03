/* ─────────────────────────────────────────────────────────────────────────────
   Tədbir üzrə şablon səhifələri (/sablonlar/<slug>, 2026-11)

   Yoxlanılır:
     1. hər konseptin səhifəsi, unikal slug-ı və yetərli mətni var
     2. seo.php cədvəli JS ilə hərfbəhərf eynidir (başlıq, təsvir, h1, giriş, şablon adları)
     3. sitemap və llms.txt bütün səhifələri əhatə edir
     4. SPA marşrutu: məlum slug tanınır, naməlum slug 404-dür
     5. URL ↔ konsept çevrilməsi və önbaxış yolu

   İşə salma: node tests/concept_pages_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { CONCEPT_PAGES, conceptPageFor } from '../src/data/conceptPages.js'
import { CONCEPT_META, listTemplates, templateConcepts, conceptBySlug, templatePreviewPath, previewConceptOf } from '../src/templates/templateConfig.js'
import { isKnownSpaPath } from '../src/utils/siteRoutes.js'

let fail = 0
let n = 0
const ok = (name, cond, extra = '') => {
  n++
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}
const read = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8')
const seo = read('../public/seo.php')
const sitemap = read('../public/sitemap.xml')
const llms = read('../public/llms.txt')
const phpStr = (s) => s.replace(/\\(['\\])/g, '$1')

const ids = Object.keys(CONCEPT_META)
const slugs = ids.map((id) => CONCEPT_META[id].slug)
ok('slug-lar unikaldır', new Set(slugs).size === slugs.length)
ok('hər konseptin səhifəsi var', ids.every((id) => conceptPageFor(id)))
ok('artıq konsept səhifəsi yoxdur', Object.keys(CONCEPT_PAGES).every((id) => CONCEPT_META[id]))

for (const id of ids) {
  const p = CONCEPT_PAGES[id]
  const slug = CONCEPT_META[id].slug
  ok(`${id}: başlıq uzunluğu`, p.title.length >= 30 && p.title.length <= 70, String(p.title.length))
  ok(`${id}: təsvir uzunluğu`, p.description.length >= 100 && p.description.length <= 180, String(p.description.length))
  for (const lg of ['az', 'en', 'ru']) {
    ok(`${id}/${lg}: h1`, !!p.h1[lg])
    ok(`${id}/${lg}: giriş mətni`, (p.intro[lg] || '').length > 80)
  }
  ok(`${id}: sitemap`, sitemap.includes(`<loc>https://digitoy.az/sablonlar/${slug}</loc>`))
  ok(`${id}: llms.txt`, llms.includes(`https://digitoy.az/sablonlar/${slug}`))
  ok(`${id}: SPA tanıyır`, isKnownSpaPath(`/sablonlar/${slug}`))
  ok(`${id}: slug → konsept`, conceptBySlug(slug) === id)

  /* seo.php cədvəli */
  const re = new RegExp(`'${slug}' => \\[\\s*'concept' => '${id}',\\s*'title' => '((?:[^'\\\\]|\\\\.)*)',\\s*'desc' => '((?:[^'\\\\]|\\\\.)*)',\\s*'h1' => '((?:[^'\\\\]|\\\\.)*)',\\s*'intro' => '((?:[^'\\\\]|\\\\.)*)',\\s*'names' => \\[([^\\]]*)\\]`)
  const m = seo.match(re)
  ok(`${id}: seo.php sətri`, !!m)
  if (m) {
    ok(`${id}: title eyni`, phpStr(m[1]) === p.title)
    ok(`${id}: desc eyni`, phpStr(m[2]) === p.description)
    ok(`${id}: h1 eyni`, phpStr(m[3]) === p.h1.az)
    ok(`${id}: intro eyni`, phpStr(m[4]) === p.intro.az)
    const names = [...m[5].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((x) => phpStr(x[1]))
    const expected = listTemplates().filter((t) => templateConcepts(t).includes(id)).map((t) => t.name)
    ok(`${id}: şablon adları eyni`, names.join('|') === expected.join('|'), names.join('|'))
  }
}

ok('naməlum slug SPA-da yoxdur', !isKnownSpaPath('/sablonlar/bu-yoxdur'))
ok('naməlum slug → null', conceptBySlug('bu-yoxdur') === null)
ok('naməlum konsept → null', conceptPageFor('yox') === null && conceptPageFor(null) === null)

/* Önbaxış yolu: əsas versiyada parametr yoxdur */
ok('toy versiyası: parametrsiz', templatePreviewPath('boarding-pass', 'toy') === '/demo/template/boarding-pass')
ok('ad günü versiyası: parametrli', templatePreviewPath('boarding-pass', 'birthday') === '/demo/template/boarding-pass?tedbir=birthday')
ok('uyğunsuz bölmə atılır', templatePreviewPath('royal-gold', 'birthday') === '/demo/template/royal-gold')
ok('previewConceptOf: əsas → null', previewConceptOf('boarding-pass', 'toy') === null)
ok('previewConceptOf: ad günü', previewConceptOf('boarding-pass', 'birthday') === 'birthday')
ok('previewConceptOf: etibarsız', previewConceptOf('boarding-pass', '<script>') === null)

console.log(fail ? `\n${fail} / ${n} uğursuz` : `Tədbir səhifələri: ${n} yoxlama, hamısı keçdi (${ids.length} səhifə)`)
process.exit(fail ? 1 : 0)
