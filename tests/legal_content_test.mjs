/* ─────────────────────────────────────────────────────────────────────────────
   HÜQUQİ MƏTNLƏR (Phase 47)

   • 3 sənəd × 3 dil yüklənir, boş bölmə yoxdur;
   • bölmə id-ləri 3 dildə EYNİDİR (məzmun cədvəli və #kuki linki işləsin);
   • EN/RU-da «AZ mətni üstündür» qeydi var, AZ-da yoxdur;
   • saxlama müddətləri retention.php ilə EYNİDİR — siyasət nə vəd edirsə,
     avtomatik təmizləmə onu edir;
   • sifariş düyməsinin altındakı mətn istifadəçinin istədiyi kimidir.

   İşə salmaq: node tests/legal_content_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { LEGAL_DOCS } from '../src/data/legal/docs.js'
import { LEGAL_UI, LEGAL_CONTACT } from '../src/data/legal/ui.js'
import { RETENTION } from '../src/data/legal/retention.js'
import { LEGAL_PAGE_UI } from '../src/data/legal/page.js'

let fail = 0
let pass = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; return }
  console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++
}
const eq = (name, a, b) => ok(name, JSON.stringify(a) === JSON.stringify(b), `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)
const LANGS = ['az', 'en', 'ru']

const texts = {}
for (const d of LEGAL_DOCS) {
  texts[d.id] = {}
  for (const l of LANGS) {
    try { texts[d.id][l] = (await import(`../src/data/legal/${d.id}/${l}.js`)).default }
    catch (e) { ok(`${d.id}/${l}.js yüklənir`, false, e.message) }
  }
}

const flatten = (doc) => [...doc.intro, ...doc.sections.flatMap((s) => [s.title, ...s.body.flatMap((b) => (typeof b === 'string' ? [b] : b.list))])]

for (const d of LEGAL_DOCS) {
  const ids = texts[d.id].az?.sections.map((s) => s.id)
  for (const l of LANGS) {
    const t = texts[d.id][l]
    if (!t) continue
    const tag = `${d.id}/${l}`
    ok(`${tag}: başlıq`, typeof t.title === 'string' && t.title.length > 5)
    ok(`${tag}: giriş`, Array.isArray(t.intro) && t.intro.length > 0)
    ok(`${tag}: bölmələr dolu`, t.sections.length >= 5 && t.sections.every((s) => s.id && s.title && s.body.length))
    ok(`${tag}: body yalnız mətn və ya {list}`, t.sections.every((s) => s.body.every((b) => typeof b === 'string' || (Array.isArray(b.list) && b.list.length))))
    eq(`${tag}: bölmə id-ləri AZ ilə eynidir`, t.sections.map((s) => s.id), ids)
    eq(`${tag}: id-lər təkrarsızdır`, new Set(ids).size, ids.length)
    ok(`${tag}: ${l === 'az' ? 'tərcümə qeydi YOXDUR' : 'AZ mətni üstündür qeydi var'}`, l === 'az' ? !t.notice : !!t.notice)
    const all = flatten(t).join('\n')
    ok(`${tag}: əlaqə e-poçtu var`, all.includes(LEGAL_CONTACT.email))
    ok(`${tag}: doldurulmamış yer yoxdur`, !/undefined|\[\[|TODO|\$\{/.test(all))
  }
}

/* Məxfilik siyasətində kuki bölməsi — banner «Ətraflı» linki /mexfilik#kuki-yə aparır */
ok('privacy: #kuki bölməsi var', texts.privacy.az.sections.some((s) => s.id === 'kuki'))
ok('privacy/az: real yaddaş açarları sadalanır', ['digitoy_consent', 'digitoy_session_id', '_ga', 'ph_*_posthog']
  .every((k) => flatten(texts.privacy.az).join(' ').includes(k)))

/* Saxlama müddətləri — retention.php ilə eyni */
const php = readFileSync(fileURLToPath(new URL('../public/api/retention.php', import.meta.url)), 'utf8')
const phpConst = (n) => Number((php.match(new RegExp(`const ${n}\\s*=\\s*(\\d+)`)) || [])[1])
eq('auditIpDays = RET_AUDIT_IP_DAYS', RETENTION.auditIpDays, phpConst('RET_AUDIT_IP_DAYS'))
eq('galleryIpDays = RET_GALLERY_IP_DAYS', RETENTION.galleryIpDays, phpConst('RET_GALLERY_IP_DAYS'))
eq('tempHours = RET_TEMP_HOURS', RETENTION.tempHours, phpConst('RET_TEMP_HOURS'))
eq('mediaLogDays = RET_MEDIA_LOG_DAYS', RETENTION.mediaLogDays, phpConst('RET_MEDIA_LOG_DAYS'))
eq('draftDays = RET_DRAFT_DAYS', RETENTION.draftDays, phpConst('RET_DRAFT_DAYS'))
for (const l of LANGS) {
  const all = flatten(texts.privacy[l]).join(' ')
  ok(`privacy/${l}: ${RETENTION.draftDays} günlük draft müddəti yazılıb`, all.includes(String(RETENTION.draftDays)))
  ok(`privacy/${l}: ${RETENTION.auditIpDays} günlük IP müddəti yazılıb`, all.includes(String(RETENTION.auditIpDays)))
}

/* Qısa UI mətnləri — açarlar 3 dildə eyni */
const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`])).sort()
for (const l of ['en', 'ru']) eq(`ui/${l}: açarlar AZ ilə eynidir`, keys(LEGAL_UI[l]), keys(LEGAL_UI.az))
for (const l of ['en', 'ru']) eq(`page/${l}: açarlar AZ ilə eynidir`, keys(LEGAL_PAGE_UI[l]), keys(LEGAL_PAGE_UI.az))
eq('telefon formatı', LEGAL_CONTACT.phone, '+994 99 213 36 96')
const n = LEGAL_UI.az.orderNote
eq('sifariş qeydi (AZ) hərfbəhərf', n.pre + n.terms + n.mid + n.privacy + n.post, 'Sifariş verməklə İstifadə şərtlərini və Məxfilik siyasətini qəbul edirəm')

console.log(fail ? `\n${pass} ok, ${fail} FAIL` : `\nlegal_content: ${pass} yoxlama keçdi`)
process.exit(fail ? 1 : 0)
