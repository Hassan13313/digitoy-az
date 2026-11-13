/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLON VERSİYALARI — fotolu toy seriyası (v3) və dondurulmuş v2 (2026-11-13)

   İstifadəçi: «köhnələr köhnə versiyada qalsın». Fotolu dizayna keçən şablonun
   artıq yaradılmış dəvətnaməsi (templateVersion 2) legacy/v2/<id> surəti ilə açılır.
   Qoruduğu müqavilələr:
     1. JS (legacy/registry.js › FROZEN_V2) və PHP (template_version.php ›
        TV_V3_TEMPLATES) siyahıları eynidir — biri unudulsa yeni sifariş səhv
        versiya alar və ya köhnə dəvətnamə yeni dizayna keçər.
     2. Hər dondurulmuş şablonun surəti diskdədir və import-ları mövcuddur.
     3. Versiya qaydaları (v1 / v2 / v3).
     4. Dondurulmuş surətin oxuduğu ORTAQ reyestrlər (tema, şrift, açılış mətni,
        hekayə teması, keçid effekti) snapshot ilə eynidir — dəyişsə köhnə
        dəvətnamənin görünüşü də dəyişər. Bilərəkdən dəyişirsinizsə, əvvəl
        surətə öz dəyərini yazın, sonra snapshot-u yeniləyin:
        UPDATE_SNAPSHOT=1 node tests/template_versions_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { V3_TEMPLATES, currentVersionOf, previousVersionOf, isFrozenVersion, hasLegacyVersion, getLegacyComponent, isV1Invitation } from '../src/templates/legacy/registry.js'
import { getTemplateTheme } from '../src/templates/templateConfig.js'
import { OPENING_SPEC, openingDefaults } from '../src/templates/_shared/openingSpec.js'

let fail = 0
const ok = (name, cond, extra = '') => { if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ } }
const root = new URL('../', import.meta.url)
const read = (p) => readFileSync(new URL(p, root), 'utf8')

/* 1. JS ↔ PHP */
const php = read('public/api/template_version.php')
const phpList = [...(php.match(/TV_V3_TEMPLATES\s*=\s*\[([\s\S]*?)\]/)?.[1] || '').matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1])
ok('PHP siyahısı oxundu', phpList.length > 0)
ok('JS və PHP siyahıları eynidir', JSON.stringify([...phpList].sort()) === JSON.stringify([...V3_TEMPLATES].sort()), `php=${phpList} js=${V3_TEMPLATES}`)
ok('Simple Luxury fotolu seriyada deyil', !V3_TEMPLATES.includes('simple-luxury'))

/* 2. Surətlər diskdə, import-lar mövcud */
for (const id of V3_TEMPLATES) {
  const dir = new URL(`src/templates/legacy/v2/${id}/`, root)
  ok(`${id}: v2 surəti var`, existsSync(new URL('index.jsx', dir)))
  if (!existsSync(dir)) continue
  for (const fn of readdirSync(dir).filter((f) => /\.(jsx?|mjs)$/.test(f))) {
    const src = readFileSync(new URL(fn, dir), 'utf8')
    for (const m of src.matchAll(/(?:from\s+|import\(\s*|import\s+)'(\.{1,2}\/[^']+)'/g)) {
      const t = new URL(m[1], new URL(fn, dir))
      const found = ['', '.js', '.jsx', '/index.js', '/index.jsx'].some((ext) => existsSync(new URL(t.href + ext)))
      ok(`${id}/${fn}: import ${m[1]} mövcuddur`, found)
    }
  }
}

/* 2b. Geyim bölməsi — dondurulmuş surət dondurulduğu gün canlıda olan ikonları göstərir, indikini yox:
   – 2026-11-13 səhər dondurulan 15 toy şablonu: köhnə ikonlar (legacy/v2/_shared/DressCodeSection)
   – 2026-11-13 axşam dondurulan 50 şablon (xına, sünnət, qalan 40): o vaxt canlıda olan lüks ikonlar
     (legacy/v2/_shared/DressCodeSectionLux) — onların dəvətnamələri səhərdən bu ikonlarla görünürdü */
const FROZEN_OLD_DRESS = V3_TEMPLATES.slice(0, 15)
ok('ilk 15 dondurulmuş şablon toy seriyasıdır', FROZEN_OLD_DRESS.includes('royal-palace') && FROZEN_OLD_DRESS.includes('modern-black') && !FROZEN_OLD_DRESS.includes('red-veil'))
for (const f of ['DressCodeSection', 'DressCodeSectionLux']) ok(`legacy/v2/_shared/${f}.jsx var`, existsSync(new URL(`src/templates/legacy/v2/_shared/${f}.jsx`, root)))
for (const id of V3_TEMPLATES) {
  const src = read(`src/templates/legacy/v2/${id}/index.jsx`)
  if (!src.includes('DressCodeSection')) continue
  const want = FROZEN_OLD_DRESS.includes(id) ? 'DressCodeSection' : 'DressCodeSectionLux'
  ok(`${id}: v2 surəti dondurulmuş geyim bölməsini (${want}) işlədir`, src.includes(`from '../_shared/${want}'`) && !src.includes("from '../../../_shared/DressCodeSection'"))
}
/* Lux surəti dondurulduğu andakı canlı bölmə ilə eynidir (yalnız import yolları fərqlidir) */
const body = (s) => s.replace(/\r/g, '').split('\n').filter((l) => !l.startsWith('import ')).join('\n')
const lux = read('src/templates/legacy/v2/_shared/DressCodeSectionLux.jsx').replace(/^\/\*[\s\S]*?\*\/\r?\n/, '')
ok('DressCodeSectionLux import-ları mövcuddur', [...lux.matchAll(/from '(\.{1,2}\/[^']+)'/g)].every((m) => ['.js', '.jsx'].some((e) => existsSync(new URL(m[1] + e, new URL('src/templates/legacy/v2/_shared/', root))))))
if (body(lux) !== body(read('src/templates/_shared/DressCodeSection.jsx'))) console.log('  qeyd: canlı _shared/DressCodeSection.jsx dondurulmuş Lux surətindən fərqlənir (gözlənilən — canlı versiya dəyişib)')

/* 3. Versiya qaydaları */
for (const id of V3_TEMPLATES) {
  ok(`${id}: yeni dəvətnamə 3`, currentVersionOf(id) === 3)
  ok(`${id}: v2 dondurulub`, isFrozenVersion(id, 2) && isFrozenVersion(id, '2'))
  ok(`${id}: v3 indiki dizayndır`, !isFrozenVersion(id, 3))
  ok(`${id}: «köhnəyə qaytar» → 2`, previousVersionOf(id) === 2)
}
ok('simple-luxury: yeni dəvətnamə 2, köhnə versiyası yoxdur', currentVersionOf('simple-luxury') === 2 && !hasLegacyVersion('simple-luxury'))
ok('yeni şablon (ivory-silk): 2, dondurma yoxdur', currentVersionOf('ivory-silk') === 2 && !isFrozenVersion('ivory-silk', 2))
ok('v1 dondurması dəyişməyib (royal-gold v1)', isFrozenVersion('royal-gold', 1))
ok('versiyasız data (builder/demo) dondurulmur', !isFrozenVersion('royal-gold', undefined))
/* Versiyası 1 olan (server oxuyanda açar yoxdursa 1 yazır) dəvətnamə: öz v1 surəti olan toy
   şablonunda v1 surəti, olmayan şablonda (konseptlər) dondurulmuş v2 — heç vaxt yeni fotolu dizayn */
for (const id of V3_TEMPLATES) {
  ok(`${id}: v1 dəvətnamə dondurulmuş surətlə açılır`, isFrozenVersion(id, 1) && !!getLegacyComponent(id, 1))
}
ok('royal-gold: v1 öz surəti (v2 deyil)', getLegacyComponent('royal-gold', 1) !== getLegacyComponent('royal-gold', 2) && isV1Invitation({ templateVersion: 1 }, 'royal-gold'))
ok('red-veil: v1 → v2 surəti, v1 şriftləri yox', getLegacyComponent('red-veil', 1) === getLegacyComponent('red-veil', 2) && !isV1Invitation({ templateVersion: 1 }, 'red-veil'))
ok('ivory-silk: v1 dondurulmur (köhnə versiyası yoxdur)', !isFrozenVersion('ivory-silk', 1))

/* 4. Ortaq reyestrlərin snapshot-u */
const fonts = read('src/templates/fonts.js')
const motion = read('src/templates/_shared/motion.jsx')
const story = read('src/templates/_shared/loveStoryTheme.js')
const line = (src, id) => (src.split(/\r?\n/).find((l) => l.trimStart().startsWith(`'${id}':`)) || '').trim()
const ctx = { weddingData: { brideName: 'Aysel', groomName: 'Nicat', date: '2027-03-13', time: '19:00', venueName: 'Buta Palace', eventType: 'toy' }, lang: 'az', isCouple: true, isCorp: false, eventLabel: 'Toy' }
const snap = {}
for (const id of V3_TEMPLATES) {
  let defaults = null
  try { defaults = openingDefaults(id, ctx) } catch (e) { defaults = 'ERR ' + e.message }
  snap[id] = { theme: getTemplateTheme(id), fonts: line(fonts, id), motion: line(motion, id), opening: OPENING_SPEC[id] || null, openingDefaults: defaults, story: line(story, id) }
}
const fx = new URL('tests/fixtures/frozen_v2_registry.json', root)
if (process.env.UPDATE_SNAPSHOT || !existsSync(fx)) {
  writeFileSync(fx, JSON.stringify(snap, null, 1) + '\n')
  console.log('snapshot yazıldı: tests/fixtures/frozen_v2_registry.json')
} else {
  const want = JSON.parse(readFileSync(fx, 'utf8'))
  for (const id of V3_TEMPLATES) {
    for (const k of Object.keys(snap[id])) {
      ok(`${id}.${k} snapshot ilə eynidir (köhnə dəvətnamənin görünüşü)`, JSON.stringify(snap[id][k]) === JSON.stringify(want[id]?.[k]))
    }
  }
}

console.log(fail === 0 ? 'Şablon versiyaları: bütün yoxlamalar keçdi' : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
