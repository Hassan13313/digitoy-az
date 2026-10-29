/* ─────────────────────────────────────────────────────────────────────────────
   BÖLMƏ ADLARI TESTİ (Phase 41)

   NƏ ÜÇÜN VAR: Claude Design-da hər şablon bölmələri ÖZ metaforasında
   adlandırır (Boarding Pass → «Uçuş cədvəli», Vinyl → «Tracklist · Side A»).
   Bu adlar `TemplateShell`-ə `sectionLabels` propu ilə verilir və HƏR ÜÇ
   DİLDƏ (AZ/EN/RU) olmalıdır — Phase 40 tərcümə sistemi pozulmamalıdır.

   Bu test şablon fayllarını MƏTN kimi oxuyur (React render etmədən), çünki
   `sectionLabels` sadəcə statik obyekt literalıdır. Beləliklə test nə JSX
   toolchain-i, nə də brauzer tələb edir.

   ⚠ PREMIUM REDİZAYN (2026-10): 13 şablon artıq `TemplateShell` yox,
   `useInvitation({ sectionLabels: LABELS })` istifadə edir və bölmə adları
   şablonun konsepsiyasına uyğundur (Night Sky → «Axşamın bürcü», Gazette →
   «Oxucu məktubları»…). Admin-in bölmə adı override-ları əvvəlki kimi
   üstündədir (mergeSectionLabels). Kicker-lər artıq LABELS-də deyil.

   Yoxlayır (redizayn edilmiş 13 şablon):
     1. `const LABELS` var və `useInvitation`-a ötürülür
     2. Hər başlıqda üç dilin ÜÇÜ də var və heç biri boş deyil
     3. AZ və RU mətnləri fərqlidir (kopyala-yapışdır tərcümə qalmayıb)
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'

const REDESIGNED = [
  'modern-black', 'white-elegance', 'night-sky', 'oriental-luxe', 'nature-touch', 'crystal-glass',
  'boarding-pass', 'cinema-premiere', 'vinyl-record', 'royal-palace', 'mediterranean', 'gazette', 'luxury-jewelry',
  /* 2026-10 — «Uşaq ad günü» konsepti */
  'fairy-tale', 'space-mission', 'circus-show', 'dino-adventure', 'balloon-party',
  /* 2026-10 — «Xına gecəsi» konsepti */
  'red-veil',
  'xonca',
  'henna-buta',
  'mirror-candle',
  'kelagayi',
  /* 2026-10 — «Sünnət toyu» konsepti */
  'little-prince',
  'hero-comic',
  'mashallah',
  'little-pilot',
  'football-star',
  /* 2026-10 — «Baby shower» konsepti */
  'pastel-bloom',
  'teddy-bear',
  'gender-reveal',
  'stork-letter',
  'baby-mobile',
  /* 2026-10 — «Korporativ» konsepti */
  'gala-night',
  'keynote',
  'award-night',
  'business-card',
  'neon-party',
  /* 2026-10 — «İldönümü» konsepti */
  'silver-locket',
  'golden-jubilee',
  'first-paper',
  'retro-polaroid',
  'love-letters',
  /* 2026-10 — «Məzuniyyət» konsepti */
  'caps-toss',
  'yearbook',
  'last-bell',
  'chalkboard',
  'paper-plane',
  /* 2026-10 — «Açılış və təqdimat» konsepti */
  'ribbon-cut',
  'bistro-sign',
  'roller-shutter',
  'unboxing',
  'gallery-unveil',
]
const SECTIONS = ['countdown', 'venue', 'program', 'dresscode', 'seating', 'gallery', 'rsvp', 'guestbook', 'hero', 'story']

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}

for (const id of REDESIGNED) {
  const src = readFileSync(`src/templates/${id}/index.jsx`, 'utf8')

  const block = src.match(/const LABELS = \{([\s\S]*?)\n\}/)
  ok(`${id}: LABELS mövcuddur`, !!block)
  ok(`${id}: LABELS useInvitation-a ötürülür`, /sectionLabels:\s*LABELS/.test(src))
  if (!block) continue
  const body = block[1]

  const rows = [...body.matchAll(/^\s*(\w+):\s*\{\s*title: \{ az: '([^']*)', en: '([^']*)', ru: '([^']*)' \} \},?$/gm)]
  ok(`${id}: ən azı 6 bölmə adlandırılıb`, rows.length >= 6, `${rows.length}`)
  for (const [, key, az, en, ru] of rows) {
    ok(`${id}: «${key}» tanınan bölmədir`, SECTIONS.includes(key))
    ok(`${id}/${key}: AZ boş deyil`, az.trim().length > 0)
    ok(`${id}/${key}: EN boş deyil`, en.trim().length > 0)
    ok(`${id}/${key}: RU boş deyil`, ru.trim().length > 0)
    const intl = /^(RSVP|Check-in|Liner notes)/i.test(ru)
    ok(`${id}/${key}: RU kiril əlifbasındadır «${ru}»`, intl || /[А-Яа-яЁё]/.test(ru))
    ok(`${id}/${key}: AZ ≠ RU`, intl || az !== ru)
  }
}

/* ── Defolt adlı şablonlar ────────────────────────────────────────────────
   Royal Gold və Floral Garden (təsdiqlənmiş ilk iki) və Simple Luxury
   defolt bölmə adlarını saxlayır — özəl LABELS olmamalıdır. */
for (const id of ['royal-gold', 'floral-garden', 'simple-luxury']) {
  const src = readFileSync(`src/templates/${id}/index.jsx`, 'utf8')
  ok(`${id}: defolt bölmə adları (özəl LABELS yoxdur)`, !/const LABELS = \{/.test(src))
}

console.log(fail === 0
  ? `Bölmə adları: ${REDESIGNED.length} şablon × 3 dil yoxlanıldı, hamısı keçdi`
  : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
