/* ─────────────────────────────────────────────────────────────────────────────
   DEMO TƏRCÜMƏ TESTİ (Phase 42)

   NƏ ÜÇÜN VAR: dil dəyişdiriləndə demo dəvətnaməsinin proqram sətirləri və
   geyim kodu qeydi Azərbaycanca qalırdı.

   KÖK SƏBƏB (diaqnoz): tərcümə mexanizmi İŞLƏYİRDİ — `resolveWeddingContent`
   `TemplateRenderer`-də çağırılır və `programSteps[].activity` ilə
   `dressCodeDescription`-ı tərcümə edir. Problem MEXANİZMDƏ deyil,
   LÜĞƏTDƏ idi: demo-nun konkret ifadələri (məs. «Qonaqların MÖHTƏŞƏM
   Qarşılanması») `PHRASES`-də yox idi, `translatePhrase` null qaytarırdı və
   çağıran tərəf — düzgün olaraq — orijinal AZ mətni saxlayırdı.

   Bu test demo-nun HƏR görünən mətninin hər iki dilə tərcümə olunduğunu
   yoxlayır. Demo-ya yeni sətir əlavə edilib lüğətə yazılmasa, test sınır.

   ⚠ Bu, «bütün mətnlər tərcümə olunmalıdır» qaydası DEYİL: sərbəst müştəri
   cümlələri üçün tərcüməsiz qalmaq normaldır (bax contentI18n-dəki
   franken-mətn qoruyucusu). Qayda yalnız DEMO üçündür — demo məhsulun
   vitrinidir və orada azərbaycanca qalıq qəbuledilməzdir.
   ───────────────────────────────────────────────────────────────────────── */
import { demoInvitation } from '../src/data/demoInvitation.js'
import { resolveWeddingContent, translatePhrase } from '../src/data/contentI18n.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}   ${name}${extra ? '  →  ' + extra : ''}`)
  if (!cond) fail++
}

/* ── 1. Proqram sətirləri ─────────────────────────────────────────────── */
console.log('\n  PROQRAM')
for (const step of demoInvitation.programSteps || []) {
  for (const lang of ['en', 'ru']) {
    const t = translatePhrase(step.activity, lang)
    ok(`${lang.toUpperCase()} · ${step.time} ${step.activity.slice(0, 34)}`,
       typeof t === 'string' && t.length > 0 && t !== step.activity,
       t || 'TƏRCÜMƏ YOXDUR')
  }
}

/* ── 2. Geyim kodu qeydi ──────────────────────────────────────────────── */
console.log('\n  GEYİM KODU')
for (const lang of ['en', 'ru']) {
  const src = demoInvitation.dressCodeDescription
  const t = translatePhrase(src, lang)
  ok(`${lang.toUpperCase()} · geyim kodu qeydi`,
     typeof t === 'string' && t.length > 0 && t !== src,
     (t || 'TƏRCÜMƏ YOXDUR').slice(0, 70))
}

/* ── 3. Uçdan-uca: render-ə gedən obyektdə AZ qalıq olmamalıdır ───────── */
console.log('\n  UÇDAN-UCA (resolveWeddingContent)')
for (const lang of ['en', 'ru']) {
  const out = resolveWeddingContent(demoInvitation, lang)

  const steps = out.programSteps || []
  const azLeft = steps.filter((s, i) => s.activity === demoInvitation.programSteps[i].activity)
  ok(`${lang.toUpperCase()} · bütün proqram sətirləri dəyişdi`,
     azLeft.length === 0,
     azLeft.length ? azLeft.map((s) => s.activity).join(' | ') : 'təmiz')

  ok(`${lang.toUpperCase()} · geyim kodu qeydi dəyişdi`,
     out.dressCodeDescription !== demoInvitation.dressCodeDescription,
     (out.dressCodeDescription || '').slice(0, 60))

  /* Vaxt sütunu TOXUNULMAMALIDIR */
  const timesOk = steps.every((s, i) => s.time === demoInvitation.programSteps[i].time)
  ok(`${lang.toUpperCase()} · vaxtlar toxunulmayıb`, timesOk)

  /* İkonlar TOXUNULMAMALIDIR */
  const iconsOk = steps.every((s, i) => s.icon === demoInvitation.programSteps[i].icon)
  ok(`${lang.toUpperCase()} · ikonlar toxunulmayıb`, iconsOk)
}

/* ── 4. AZ dilində heç nə dəyişməməlidir (eyni referans) ──────────────── */
console.log('\n  AZ TOXUNULMAZLIĞI')
ok('az → eyni obyekt referansı (remount olmur)',
   resolveWeddingContent(demoInvitation, 'az') === demoInvitation)

console.log(fail === 0
  ? '\nDemo tərcüməsi: bütün mətnlər AZ/EN/RU işləyir'
  : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
