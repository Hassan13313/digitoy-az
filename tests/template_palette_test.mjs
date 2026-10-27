/* ─────────────────────────────────────────────────────────────────────────────
   PREMIUM ŞABLONLARDA ADMİN OVERRIDE-LARI TESTİ (2026-10)

   NƏ ÜÇÜN VAR: premium redizaynda 13 şablon `TemplateShell`-dən çıxdı və
   rəngləri öz palitrasına keçdi. Köhnə shell-in verdiyi admin imkanları
   itməməlidir:
     • «Rəng» tabı (primary/secondary/accent/background/text) → `resolvePalette`
     • «Başlıq ölçüsü» əmsalı → `scaleFont(…, C.hs)`
     • canlı önbaxışın bölməyə sürüşməsi → `data-section` lövbərləri
     • «və» bağlayıcısının mətni → `inv.and`

   Yoxlayır:
     1. resolvePalette: override yoxdursa EYNİ obyekt (görünüş dəyişmir),
        varsa yalnız bağlı açarlar dəyişir; əmsal `hs` kimi gəlir
     2. scaleFont: əmsalsız orijinal sətir, əmsalla calc()
     3. 13 şablonun hər birində PAL + LINKS (yalnız admin token-ləri və
        palitranın öz açarları), Provider, 9 bölmə lövbəri, başlıq əmsalı
        və bağlayıcı; modul səviyyəsində sabit hex rəng qalmayıb
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { resolvePalette, scaleFont } from '../src/templates/_shared/palette.js'
import { THEME_KEYS } from '../src/data/adminOverrides.js'

let fail = 0
let pass = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; return }
  console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`)
  fail++
}

/* ── 1. resolvePalette ── */
{
  const PAL = { GOLD: '#D2A262', NAVY: '#0E1B2E', INK: '#14243B' }
  const LINKS = { primary: ['GOLD'], background: ['NAVY'] }
  const BASE = { primary: '#D2A262', background: '#0E1B2E', text: '#F4EFE4' }

  ok('override yoxdur → eyni obyekt', resolvePalette(PAL, LINKS, BASE, BASE) === PAL)
  ok('theme yoxdur → eyni obyekt', resolvePalette(PAL, LINKS, null, BASE) === PAL)

  const sameValues = { ...BASE }
  ok('dəyərlər eynidirsə → eyni obyekt', resolvePalette(PAL, LINKS, sameValues, BASE) === PAL)

  const out = resolvePalette(PAL, LINKS, { ...BASE, primary: '#FF0000' }, BASE)
  ok('primary → GOLD', out.GOLD === '#FF0000')
  ok('bağlı olmayan açar toxunulmur', out.NAVY === PAL.NAVY && out.INK === PAL.INK)
  ok('PAL mutasiya olunmur', PAL.GOLD === '#D2A262')

  const txt = resolvePalette(PAL, LINKS, { ...BASE, text: '#000000' }, BASE)
  ok('LINKS-də olmayan token heç nəyi dəyişmir', txt.GOLD === PAL.GOLD && txt.NAVY === PAL.NAVY && txt.INK === PAL.INK)

  const scaled = resolvePalette(PAL, LINKS, { ...BASE, headingScale: 1.2 }, BASE)
  ok('başlıq əmsalı → hs', scaled.hs === 1.2 && scaled.GOLD === PAL.GOLD)
}

/* ── 2. scaleFont ── */
ok('əmsalsız → orijinal', scaleFont('clamp(30px, 9vw, 40px)', undefined) === 'clamp(30px, 9vw, 40px)')
ok('əmsal 1 → orijinal', scaleFont('clamp(30px, 9vw, 40px)', 1) === 'clamp(30px, 9vw, 40px)')
ok('əmsal → calc', scaleFont('clamp(30px, 9vw, 40px)', 1.2) === 'calc(clamp(30px, 9vw, 40px) * 1.2)')

/* ── 3. Şablon faylları ── */
const REDESIGNED = [
  'modern-black', 'white-elegance', 'night-sky', 'oriental-luxe', 'nature-touch', 'crystal-glass',
  'boarding-pass', 'cinema-premiere', 'vinyl-record', 'royal-palace', 'mediterranean', 'gazette', 'luxury-jewelry',
]
const ANCHORS = ['hero', 'countdown', 'venue', 'program', 'dresscode', 'seating', 'gallery', 'rsvp', 'guestbook']

for (const id of REDESIGNED) {
  const src = readFileSync(`src/templates/${id}/index.jsx`, 'utf8').replace(/\r\n/g, '\n')

  const pal = src.match(/\nconst PAL = \{\n([\s\S]*?)\n\}/)
  ok(`${id}: PAL var`, !!pal)
  const palKeys = pal ? [...pal[1].matchAll(/^\s+([A-Z][A-Z0-9_]*):/gm)].map((m) => m[1]) : []

  const links = src.match(/\nconst LINKS = (\{[^\n]*\})/)
  ok(`${id}: LINKS var`, !!links)
  if (links) {
    for (const [, token, list] of links[1].matchAll(/(\w+): \[([^\]]*)\]/g)) {
      ok(`${id}: LINKS token «${token}» admin token-idir`, THEME_KEYS.includes(token))
      for (const k of list.split(',').map((s) => s.trim().replace(/'/g, '')).filter(Boolean)) {
        ok(`${id}: LINKS açarı «${k}» PAL-dadır`, palKeys.includes(k))
      }
    }
  }

  ok(`${id}: resolvePalette çağırılır`, src.includes('resolvePalette(PAL, LINKS, inv.theme, BASE)'))
  ok(`${id}: Provider var`, src.includes('<PaletteContext.Provider value={C}>'))
  ok(`${id}: modul səviyyəsində hex sabiti qalmayıb`, !/^const [A-Z][A-Z0-9_]* = '#[0-9A-Fa-f]{3,8}'/m.test(src))
  for (const a of ANCHORS) {
    ok(`${id}: data-section «${a}»`, src.includes(`data-section="${a}"`) || src.includes(`section="${a}"`))
  }
  ok(`${id}: bölmə başlığı admin əmsalı ilə`, /fontSize: scaleFont\('clamp\([^']*\)', C\.hs\)/.test(src))
  ok(`${id}: «və» bağlayıcısı inv.and`, /\{inv\.and\}|\$\{inv\.and\}/.test(src))
}

console.log(`${pass} ok, ${fail} fail`)
if (fail) process.exit(1)
