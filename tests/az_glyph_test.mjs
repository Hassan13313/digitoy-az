/* ─────────────────────────────────────────────────────────────────────────────
   AZƏRBAYCAN HƏRFLƏRİ TESTİ (Phase 43 · ISSUE #2)

   PROBLEM: bəzi şriftlərdə `Ə` (U+018F) glyph-i yoxdur. CSS font zənciri hər
   glyph üçün ayrı işlədiyinə görə yalnız HƏMİN HƏRF növbəti şriftdən gəlir —
   nəticədə azərbaycanca mətndə bir hərf başqa yazı növündə görünür.
   Əvvəl növbəti pillə çox vaxt sistem `Georgia`/`Inter` idi və fərq gözə
   çarpırdı.

   ⚠ GLYPH ÖLÇMƏSİ NODE-DA MÜMKÜN DEYİL (font faylı yüklənmir) — hansı
   şriftdə `Ə` olmadığı BRAUZERDƏ ölçülüb və `FONTS_MISSING_AZ`-ə yazılıb.
   Bu test həmin ölçmənin NƏTİCƏSİNİ qoruyur: əskik şriftin zəncirində
   dərhal sonra TAM ƏHATƏLİ bir VEB şrifti durmalıdır.

   Yəni test «şriftdə Ə var?» sualına yox, «Ə olmayanda hara düşür?»
   sualına cavab verir — düzəlişin özü də elə budur.
   ───────────────────────────────────────────────────────────────────────── */
import { FONT_STACKS, FONTS_MISSING_AZ, TEMPLATES } from '../src/templates/templateConfig.js'

/* Brauzerdə ölçülüb: bu ailələrdə Ə/Ğ/Ş/İ TAM var */
const FULL_AZ = [
  'Cormorant Garamond', 'Playfair Display', 'Newsreader', 'Libre Baskerville',
  'Space Grotesk', 'JetBrains Mono', 'Archivo', 'DM Sans', 'Inter',
]

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}

/** Zəncirdəki ailə adlarını sırayla çıxar */
const families = (stack) =>
  String(stack).split(',').map((x) => x.trim().replace(/^['"]|['"]$/g, ''))

/* ── 1. Ə olmayan hər şriftin ehtiyatı TAM ƏHATƏLİ olmalıdır ──────────── */
for (const key of Object.keys(FONTS_MISSING_AZ)) {
  const stack = FONT_STACKS[key]
  ok(`${key}: FONT_STACKS-də mövcuddur`, !!stack)
  if (!stack) continue

  const fams = families(stack)
  const rest = fams.slice(1)                    /* birincidən sonrakılar */
  const rescuer = rest.find((f) => FULL_AZ.includes(f))

  ok(`${key}: zəncirdə tam əhatəli veb şrifti var`, !!rescuer, stack)

  /* ⚠ Sistem şrifti (Georgia / Impact / system-ui) xilasedicidən ƏVVƏL
     gəlməməlidir — gəlsə Ə yenə sistem şriftindən çıxar. */
  if (rescuer) {
    const idxRescuer = rest.indexOf(rescuer)
    const sysBefore = rest.slice(0, idxRescuer)
      .filter((f) => /^(Georgia|Impact|system-ui|serif|sans-serif|monospace|Times New Roman|ui-monospace)$/i.test(f))
    ok(`${key}: xilasedicidən əvvəl sistem şrifti yoxdur`, sysBefore.length === 0, sysBefore.join(', '))
  }
}

/* ── 2. Tam əhatəli şriftlərin siyahısı zəncirlərdə həqiqətən işlənir ─── */
for (const f of ['Cormorant Garamond', 'DM Sans', 'Archivo', 'Playfair Display']) {
  const used = Object.values(FONT_STACKS).some((s) => families(s).includes(f))
  ok(`xilasedici «${f}» ən azı bir zəncirdə işlənir`, used)
}

/* ── 3. Şablonların işlətdiyi şriftlər reyestrdədir ───────────────────── */
const stacks = new Set(Object.values(FONT_STACKS))
for (const tpl of TEMPLATES) {
  const f = tpl.theme?.fonts
  if (!f) continue
  ok(`${tpl.id}: başlıq şrifti reyestrdəndir`, stacks.has(f.heading), f.heading)
  ok(`${tpl.id}: mətn şrifti reyestrdəndir`, stacks.has(f.body), f.body)
}

/* ── 4. Italiana artıq BAŞLIQ kimi işlənməməlidir ─────────────────────── */
/* 4 hərfi (Ə Ğ Ş İ) çatmır — azərbaycanca başlıqda daim qarışıq görünürdü */
const usesItaliana = TEMPLATES.filter((t) => t.theme?.fonts?.heading === FONT_STACKS.italiana)
ok('heç bir şablon Italiana-nı BAŞLIQ kimi işlətmir',
   usesItaliana.length === 0, usesItaliana.map((t) => t.id).join(', '))

console.log(fail === 0
  ? `AZ hərfləri: ${Object.keys(FONTS_MISSING_AZ).length} əskik şriftin hamısında uyğun ehtiyat var`
  : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
