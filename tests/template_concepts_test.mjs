/* ─────────────────────────────────────────────────────────────────────────────
   Şablon bölmələri (tədbir konseptləri, 2026-10) — vitrin və builder
   «Hamısı» seçiləndə şablonları tədbirə görə başlıqlı bölmələrə ayırır.

   Yoxlanılır:
     1. hər görünən şablonun konsepti var və CONCEPT_META-dadır
     2. groupTemplatesByConcept: sıra CONCEPT_META ilə, boş bölmə yox,
        hər şablon yalnız bir bölmədə, cəmi itkisiz
     3. süzülmüş siyahıda yalnız dolu bölmələr qalır
     4. konseptsiz şablon «Digər» bölməsinə düşür (3 dildə ad)
     5. hər konseptin builder tədbir növü builder-də mövcuddur

   İşə salma: node tests/template_concepts_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { listTemplates, groupTemplatesByConcept, CONCEPT_META, conceptEventType } from '../src/templates/templateConfig.js'
import { EVENT_TYPES } from '../src/data/constants.js'

let fail = 0
let n = 0
const ok = (name, cond, extra = '') => {
  n++
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}

const all = listTemplates()
const order = Object.keys(CONCEPT_META)

for (const tpl of all) ok(`${tpl.id}: konsepti var`, !!CONCEPT_META[tpl.concept], String(tpl.concept))

for (const lang of ['az', 'en', 'ru']) {
  const groups = groupTemplatesByConcept(all, lang)
  ok(`${lang}: bölmələr CONCEPT_META sırasında`, groups.map((g) => g.id).join() === order.filter((id) => all.some((t) => t.concept === id)).join())
  ok(`${lang}: boş bölmə yoxdur`, groups.every((g) => g.items.length > 0))
  ok(`${lang}: heç bir şablon itmir və təkrarlanmır`, groups.flatMap((g) => g.items).length === all.length && new Set(groups.flatMap((g) => g.items.map((t) => t.id))).size === all.length)
  for (const g of groups) {
    ok(`${lang}/${g.id}: adı var`, typeof g.label === 'string' && g.label.length > 0 && g.label !== g.id)
    ok(`${lang}/${g.id}: içində yalnız öz şablonları`, g.items.every((t) => t.concept === g.id))
  }
}

/* süzülmüş siyahı: yalnız iki konsept qalır */
const some = all.filter((t) => t.concept === 'kids' || t.concept === 'toy')
const g2 = groupTemplatesByConcept(some, 'az')
ok('süzülmüş: yalnız dolu bölmələr', g2.map((g) => g.id).join() === 'toy,kids')

/* konseptsiz şablon → «Digər» */
const g3 = groupTemplatesByConcept([{ id: 'x' }, ...some.slice(0, 1)], 'ru')
ok('konseptsiz → sonda «Другое»', g3[g3.length - 1].id === 'other' && g3[g3.length - 1].label === 'Другое')
ok('az «Digər»', groupTemplatesByConcept([{ id: 'x' }], 'az')[0].label === 'Digər')
ok('naməlum dil → az', groupTemplatesByConcept([{ id: 'x' }], 'de')[0].label === 'Digər')

/* konseptin tədbir növü builder-in 1-ci addımında seçilə bilir */
const eventIds = new Set(EVENT_TYPES.map((e) => e.id))
for (const [id, meta] of Object.entries(CONCEPT_META)) ok(`${id}: tədbir növü «${meta.eventType}» builder-də var`, eventIds.has(meta.eventType))
for (const tpl of all) ok(`${tpl.id}: conceptEventType`, conceptEventType(tpl.id) === CONCEPT_META[tpl.concept].eventType)

console.log(fail ? `\n${fail} / ${n} uğursuz` : `Şablon bölmələri: ${n} yoxlama, hamısı keçdi (${all.length} şablon)`)
process.exit(fail ? 1 : 0)
