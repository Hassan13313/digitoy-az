/* ─────────────────────────────────────────────────────────────────────────────
   YENİ LANDİNG TƏRCÜMƏ TESTİ (UI redesign 2026-10)

   NƏ ÜÇÜN VAR: yeni landing komponentləri mətnləri `t[lang].key ?? 'AZ'`
   qaydası ilə oxuyur. Açar EN/RU-da yoxdursa, xəta OLMUR — sadəcə ingilis və
   rus ziyarətçi Azərbaycanca mətn görür. Bu səssiz «sızma»nı test tutur.

   Yoxlayır:
     1. src/components/landing/v2/*.jsx-də işlənən hər `x.açar` 3 dildə var
        (props ilə gələn paket/FAQ/rəy açarları istisnadır — aşağıda SKIP)
     2. LANDING_COPY-də 3 dilin açar dəstləri eynidir, heç biri boş deyil
     3. EN və RU mətnləri AZ ilə eyni deyil (tərcümə unudulmayıb),
        brend/termin olanlar istisna (EQUAL_OK)
     4. Paket kartları, FAQ və rəylər 3 dildə tam qurulur
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync, readdirSync } from 'node:fs'
import t from '../src/data/translations.js'
import { LANDING_COPY } from '../src/data/landingCopy.js'
import { buildPricingPackages } from '../src/data/packageCopy.js'
import { getFaqItems } from '../src/data/faq.js'
import { getReviews } from '../src/data/testimonials.js'

let fail = 0
let checks = 0
const ok = (name, cond, extra = '') => {
  checks++
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}

const LANGS = ['az', 'en', 'ru']
/* Props ilə gələn açarlar (data/packageCopy.js, data/faq.js, data/testimonials.js) */
const SKIP = /^(pkg(Simple|Vip|Premium|Opening|Countdown|Maps|Dress|Program|Link|Music|Rsvp|Seating|Qr|GalleryMgmt|AllSimple|AllVip|GuestList|GuestGallery|Zip|QrCard|QrSystem|Priority)\w*|pricing(Title|Subtitle|Partner|Templates)|faq|reviews)$/
/* 3 dildə eyni ola bilən mətnlər (brend, termin, rəqəm) */
const EQUAL_OK = new Set(['faqEyebrow', 'heroTrust2', 'dcStyle', 'featLoveStory', 'currencyName', 'musicArtist'])

/* ── 1. Komponentlərdə işlənən açarlar ── */
const dir = new URL('../src/components/landing/v2/', import.meta.url)
const used = new Set()
for (const f of readdirSync(dir).filter((n) => n.endsWith('.jsx'))) {
  const src = readFileSync(new URL(f, dir), 'utf8')
  for (const m of src.matchAll(/\bx\.([A-Za-z0-9_]+)/g)) if (!SKIP.test(m[1])) used.add(m[1])
}
ok('ən azı 100 açar tapıldı', used.size >= 100, `(${used.size})`)
for (const k of used) {
  for (const l of LANGS) ok(`${l}.${k} mövcuddur`, typeof t[l][k] === 'string' && t[l][k].trim() !== '')
}

/* ── 2. LANDING_COPY: eyni açar dəstləri ── */
const azKeys = Object.keys(LANDING_COPY.az).sort().join(',')
for (const l of ['en', 'ru']) ok(`${l} açar dəsti AZ ilə eynidir`, Object.keys(LANDING_COPY[l]).sort().join(',') === azKeys)

/* ── 3. Tərcümə unudulmayıb ── */
for (const k of Object.keys(LANDING_COPY.az)) {
  if (EQUAL_OK.has(k)) continue
  for (const l of ['en', 'ru']) ok(`${l}.${k} AZ-dan fərqlidir`, LANDING_COPY[l][k] !== LANDING_COPY.az[k], JSON.stringify(LANDING_COPY[l][k]))
}

/* ── 4. Props ilə gələn məzmun ── */
for (const l of LANGS) {
  const pk = buildPricingPackages(l)
  ok(`${l}: 3 paket`, pk.length === 3)
  ok(`${l}: qiymətlər 59/89/129`, pk.map((p) => p.price).join('/') === '59/89/129')
  ok(`${l}: hər paketdə funksiya və hədiyyə sətri`, pk.every((p) => p.name && p.tagline && p.features.length > 0 && p.gift))
  ok(`${l}: yalnız Premium önə çıxır`, pk.filter((p) => p.featured).map((p) => p.id).join() === 'PREMIUM')
  const faq = getFaqItems(l)
  ok(`${l}: FAQ tamdır`, faq.length >= 8 && faq.every((i) => i.q && i.a))
  const rv = getReviews(l)
  ok(`${l}: 5 rəy, hər birində şəhər və il`, rv.length === 5 && rv.every((r) => r.quote && r.names && r.city && r.year))
}

console.log(fail === 0
  ? `Landing tərcümələri: ${used.size} açar × 3 dil, ${checks} yoxlama — hamısı keçdi`
  : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
