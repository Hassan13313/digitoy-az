/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLONUN ŞƏKİL YERLƏRİ TESTİ (2026-11)

   Admin «Şəkillər» tabı foto ilə qurulmuş şablonlarda hər şəkli gizlədə və ya
   əvəz edə bilir (`admin.images`). Qoruduğu müqavilələr:
     1. Zibil/başqa host/naməlum açar səssizcə atılır (server: acrImages ilə eyni).
     2. Dəvətnamənin seçimi şablon səviyyəsindəkindən üstündür; {hide:false} orijinalı qaytarır.
     3. Hər yer şablonda həqiqətən işlənir (P.<açar>), standart foto diskdə var.
     4. Nar Möhür kataloqdan tam çıxıb; «Toy / Nişan»-da 7 yeni şablon ən üstdədir.
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync, existsSync } from 'node:fs'
import { normalizeImages, normalizeOverrides, mergeTemplateDefaults } from '../src/data/adminOverrides.js'
import { templatePhotoSlots, resolvePhotos, isCustomPhoto, TEMPLATE_PHOTO_KEYS } from '../src/templates/templatePhotos.js'
import { listTemplates } from '../src/templates/templateConfig.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const IMG = '/uploads/_admin/tpl-candle-rings/0123456789abcdef0123.jpg'
const TEMPLATES = ['candle-rings', 'bridal-veil', 'first-dance', 'ivory-silk', 'baku-night', 'golden-hour', 'shahdag', 'royal-palace', 'oriental-luxe',
  'night-sky', 'mediterranean', 'crystal-glass', 'gazette', 'royal-gold', 'luxury-jewelry', 'floral-garden', 'white-elegance', 'nature-touch', 'vinyl-record', 'cinema-premiere', 'boarding-pass', 'modern-black']

/* 1. normalizeImages */
ok('null → null', normalizeImages(null) === null)
ok('massiv → null', normalizeImages([{ hide: true }]) === null)
ok('gizlət', eq(normalizeImages({ hero: { hide: true } }), { hero: { hide: true } }))
ok('orijinal foto', eq(normalizeImages({ hero: { hide: false } }), { hero: { hide: false } }))
ok('admin şəkli', eq(normalizeImages({ finale: { src: IMG } }), { finale: { src: IMG } }))
ok('başqa host rədd', normalizeImages({ hero: { src: 'https://evil.example/a.jpg' } }) === null)
ok('data: rədd', normalizeImages({ hero: { src: 'data:image/png;base64,AA' } }) === null)
ok('../ rədd', normalizeImages({ hero: { src: '/uploads/_admin/../x.jpg' } }) === null)
ok('"true" sətri gizlətmə deyil', normalizeImages({ hero: { hide: 'true' } }) === null)
ok('naməlum açar atılır', eq(normalizeImages({ nope: { hide: true }, hero: { hide: true } }), { hero: { hide: true } }))
ok('normalizeOverrides images-i saxlayır', eq(normalizeOverrides({ images: { hero: { hide: true } } }), { images: { hero: { hide: true } } }))
ok('images yoxdursa açar yoxdur', normalizeOverrides({ images: { nope: { hide: true } } }) === null)

/* Server açar formatı ilə uyğunluq (admin_content_rules.php › acrImages) */
for (const k of TEMPLATE_PHOTO_KEYS) ok(`açar formatı: ${k}`, /^[a-z][a-zA-Z0-9]{0,31}$/.test(k))

/* 2. Qatların birləşməsi */
const tpl = { images: { hero: { hide: true }, finale: { src: IMG } } }
ok('şablon qatı keçir', eq(mergeTemplateDefaults(tpl, null).images, tpl.images))
const merged = mergeTemplateDefaults(tpl, { images: { hero: { hide: false } } })
ok('dəvətnamə şablondan üstündür', eq(merged.images, { hero: { hide: false }, finale: { src: IMG } }))
ok('şablonda images yoxdursa dəvətnamənin özü qalır', eq(mergeTemplateDefaults({ theme: { primary: '#111111' } }, { images: { hero: { hide: true } } }).images, { hero: { hide: true } }))

/* resolvePhotos */
const slots = templatePhotoSlots('candle-rings')
const def = Object.fromEntries(slots.map((p) => [p.key, p.src]))
ok('override yoxdursa standart fotolar', eq(resolvePhotos(slots, null), def))
const r = resolvePhotos(slots, { hero: { hide: true }, finale: { src: IMG }, invite: { hide: false } })
ok('gizlədilən → null', r.hero === null)
ok('admin şəkli → src', r.finale === IMG)
ok('hide:false → standart', r.invite === def.invite)
ok('isCustomPhoto', isCustomPhoto({ finale: { src: IMG } }, 'finale') && !isCustomPhoto({ hero: { hide: true } }, 'hero') && !isCustomPhoto(null, 'x'))
ok('şəkil yeri olmayan şablon → []', templatePhotoSlots('red-veil').length === 0)

/* 3. Hər şablonda: açarlar təkrarsız, standart foto diskdə, hər yer P.<açar> ilə işlənir */
for (const id of TEMPLATES) {
  const list = templatePhotoSlots(id)
  let src = readFileSync(new URL(`../src/templates/${id}/index.jsx`, import.meta.url), 'utf8')
  /* ümumi lüks mühərriklə qurulan şablonlar şəkilləri mühərrikdə oxuyur */
  if (src.includes("from '../_shared/luxe/LuxeTemplate'")) src += readFileSync(new URL('../src/templates/_shared/luxe/LuxeTemplate.jsx', import.meta.url), 'utf8')
  ok(`${id}: şəkil yerləri var`, list.length >= 4, String(list.length))
  ok(`${id}: açarlar təkrarsız`, new Set(list.map((p) => p.key)).size === list.length)
  ok(`${id}: vimg( qalmayıb (hamısı admin yerindən)`, !src.includes('vimg('))
  for (const p of list) {
    ok(`${id}.${p.key}: ad və izah var`, !!p.label && !!p.hint)
    ok(`${id}.${p.key}: standart foto diskdə`, existsSync(new URL(`../public${p.src.split("?")[0]}`, import.meta.url)), p.src)
    ok(`${id}.${p.key}: şablonda işlənir`, src.includes(`P.${p.key}`))
  }
}

/* 4. Nar Möhür yoxdur, yeni şablonlar ən üstdə */
ok('Nar Möhür kataloqda yoxdur', !listTemplates().some((t) => t.id === 'nar-mohur'))
ok('nar-mohur qovluğu yoxdur', !existsSync(new URL('../src/templates/nar-mohur', import.meta.url)))
const toy = listTemplates().filter((t) => t.concept === 'toy').map((t) => t.id)
const ORDER = ['ivory-silk', 'bridal-veil', 'first-dance', 'candle-rings', 'baku-night', 'golden-hour', 'shahdag', 'royal-palace']
ok('Toy / Nişan: Ivory Silk birinci, Şam və Üzük Bakı Gecəsindən əvvəl, sonra Royal Palace', eq(toy.slice(0, 8), ORDER), toy.slice(0, 8).join(','))
ok('hər şablonun şəkil yerləri var (Şəkillər tabı)', TEMPLATES.every((id) => templatePhotoSlots(id).length > 0))

console.log(fail === 0
  ? 'Şablonun şəkil yerləri: bütün yoxlamalar keçdi'
  : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
