/* ─────────────────────────────────────────────────────────────────────────────
   BÖLMƏ ADLARI TESTİ (Phase 41)

   NƏ ÜÇÜN VAR: Claude Design-da hər şablon bölmələri ÖZ metaforasında
   adlandırır (Boarding Pass → «Uçuş cədvəli», Vinyl → «Tracklist · Side A»).
   Bu adlar `TemplateShell`-ə `sectionLabels` propu ilə verilir və HƏR ÜÇ
   DİLDƏ (AZ/EN/RU) olmalıdır — Phase 40 tərcümə sistemi pozulmamalıdır.

   Bu test şablon fayllarını MƏTN kimi oxuyur (React render etmədən), çünki
   `sectionLabels` sadəcə statik obyekt literalıdır. Beləliklə test nə JSX
   toolchain-i, nə də brauzer tələb edir.

   Yoxlayır:
     1. Yeni 7 şablonun hər birində `sectionLabels` var
     2. Hər başlıqda üç dilin ÜÇÜ də var və heç biri boş deyil
     3. `kicker` BÖYÜK hərflədir — səbəb: səhifə lang="az"-dır və CSS
        `text-transform: uppercase` ingilis «i»-ni «İ»-yə çevirir
        (EDITION → EDİTİON). Mənbədə böyük yazılanda problem yaranmır.
     4. AZ və RU mətnləri fərqlidir (kopyala-yapışdır tərcümə qalmayıb)
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'

const NEW_TEMPLATES = [
  'boarding-pass', 'cinema-premiere', 'vinyl-record',
  'royal-palace', 'mediterranean', 'gazette', 'luxury-jewelry',
]

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}

for (const id of NEW_TEMPLATES) {
  const src = readFileSync(`src/templates/${id}/index.jsx`, 'utf8')

  const block = src.match(/sectionLabels=\{\{([\s\S]*?)\n {6}\}\}/)
  ok(`${id}: sectionLabels mövcuddur`, !!block)
  if (!block) continue

  const body = block[1]

  /* kicker-lər */
  const kickers = [...body.matchAll(/kicker: '([^']+)'/g)].map((m) => m[1])
  ok(`${id}: ən azı 6 bölmə adlandırılıb`, kickers.length >= 6, `${kickers.length}`)
  for (const k of kickers) {
    ok(`${id}: kicker BÖYÜK hərflə «${k}»`, k === k.toUpperCase())
  }

  /* başlıqlar — üç dil */
  const titles = [...body.matchAll(/title: \{ az: '([^']*)', en: '([^']*)', ru: '([^']*)' \}/g)]
  ok(`${id}: başlıq sayı kicker sayına bərabər`, titles.length === kickers.length,
     `${titles.length} vs ${kickers.length}`)

  for (const [, az, en, ru] of titles) {
    ok(`${id}: AZ boş deyil`, az.trim().length > 0)
    ok(`${id}: EN boş deyil`, en.trim().length > 0)
    ok(`${id}: RU boş deyil`, ru.trim().length > 0)
    /* RU kiril olmalıdır — AZ mətnin kopyası qalmamalıdır.
       İstisna: «Liner notes», «RSVP» kimi beynəlxalq terminlər. */
    const intl = /^(RSVP|Liner notes)/i.test(ru)
    ok(`${id}: RU kiril əlifbasındadır «${ru}»`, intl || /[А-Яа-яЁё]/.test(ru))
  }

  /* proqram variantı elan olunubsa tanınan dəyər olmalıdır */
  const ps = src.match(/programStyle: '([^']+)'/)
  if (ps) ok(`${id}: programStyle tanınır «${ps[1]}»`, ['table', 'tracklist'].includes(ps[1]))
}

/* ── Köhnə şablonlar TOXUNULMAMALIDIR ────────────────────────────────────
   9 mövcud şablon `sectionLabels` ötürməməlidir — ötürsəydi canlı
   dəvətnamələrin bölmə adları dəyişərdi. */
const OLD = ['royal-gold', 'floral-garden', 'modern-black', 'white-elegance',
             'night-sky', 'oriental-luxe', 'nature-touch', 'crystal-glass', 'simple-luxury']
for (const id of OLD) {
  const src = readFileSync(`src/templates/${id}/index.jsx`, 'utf8')
  ok(`${id}: KÖHNƏ şablon sectionLabels ötürmür (adları dəyişməyib)`,
     !src.includes('sectionLabels'))
}

console.log(fail === 0
  ? `Bölmə adları: ${NEW_TEMPLATES.length} yeni şablon × 3 dil yoxlanıldı, hamısı keçdi`
  : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
