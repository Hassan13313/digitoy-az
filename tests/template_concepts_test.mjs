/* ─────────────────────────────────────────────────────────────────────────────
   Şablon bölmələri (tədbir konseptləri) — vitrin və builder «Hamısı» seçiləndə
   şablonları tədbirə görə başlıqlı bölmələrə ayırır.

   Yoxlanılır:
     1. hər şablonun konsepti CONCEPT_META-dadır, sıra Həsənin dediyi kimidir
     2. «Toy / Nişan»: köhnə 16 dizaynın hamısı; 5-i ad günündə də var
     3. groupTemplatesByConcept: sıra sabit, boş bölmə yox, heç nə itmir
     4. konseptsiz şablon «Digər»-ə düşür (3 dildə ad)
     5. konseptin tədbir növü builder-də var; bir neçə bölməli şablonda bölməyə görə dəyişir
     6. ad günü versiyası: mətnlər, demo, şəkil, hekayə

   İşə salma: node tests/template_concepts_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  listTemplates, groupTemplatesByConcept, CONCEPT_META, conceptEventType, templateConcepts,
  conceptAcceptsEvent, isMultiConcept, countTemplateCards, listTemplateFacets, templateContentKey, eventTypeOnSelect, selectedConceptOf,
} from '../src/templates/templateConfig.js'
import { EVENT_TYPES } from '../src/data/constants.js'
import { demoForConcept } from '../src/data/demoInvitation.js'
import { templateImage } from '../src/data/templateImages.js'
import { templateCopyFields } from '../src/templates/templateCopy.js'
import { getStoryCopy } from '../src/templates/_shared/storyCopy.js'

let fail = 0
let n = 0
const ok = (name, cond, extra = '') => {
  n++
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}

const all = listTemplates()
const order = Object.keys(CONCEPT_META)

/* Həsənin qərarı: Toy/Nişan, xına, ad günü, ildönümü, uşaqlara aid olanlar, digərləri */
ok('bölmə sırası', order.join() === 'toy,xina,birthday,anniversary,kids,sunnet,baby,corporate,graduation,opening,holiday,bachelorette', order.join())
ok('«Toy / Nişan» adı', CONCEPT_META.toy.az === 'Toy / Nişan')
ok('ayrıca «Nişan» bölməsi yoxdur', !CONCEPT_META.nishan)

const OLD_16 = ['royal-gold', 'floral-garden', 'modern-black', 'white-elegance', 'night-sky', 'oriental-luxe', 'nature-touch', 'crystal-glass',
  'boarding-pass', 'cinema-premiere', 'vinyl-record', 'royal-palace', 'mediterranean', 'gazette', 'luxury-jewelry', 'simple-luxury']
const BIRTHDAY_5 = ['gazette', 'vinyl-record', 'cinema-premiere', 'boarding-pass', 'modern-black']
const toy = listTemplates({ concept: 'toy' }).map((t) => t.id)
ok('Toy / Nişan-da köhnə 16-nın hamısı + 7 yeni', OLD_16.every((id) => toy.includes(id)) && toy.length === 23, toy.join())
const bd = listTemplates({ concept: 'birthday' }).map((t) => t.id)
ok('Ad günündə 5 dizayn', bd.join() === BIRTHDAY_5.join(), bd.join())

for (const tpl of all) ok(`${tpl.id}: konsepti var`, templateConcepts(tpl).every((c) => CONCEPT_META[c]) && !!CONCEPT_META[tpl.concept], String(tpl.concept))

const cards = countTemplateCards(all)
ok('kartların sayı', cards === all.length + BIRTHDAY_5.length, String(cards))
ok('çiplərin cəmi kartların sayına bərabərdir', listTemplateFacets('az').concepts.reduce((s, c) => s + c.count, 0) === cards)
ok('çiplər sırası', listTemplateFacets('az').concepts.map((c) => c.id).join() === order.join())

for (const lang of ['az', 'en', 'ru']) {
  const groups = groupTemplatesByConcept(all, lang)
  ok(`${lang}: bölmələr CONCEPT_META sırasında`, groups.map((g) => g.id).join() === order.filter((id) => all.some((t) => templateConcepts(t).includes(id))).join())
  ok(`${lang}: boş bölmə yoxdur`, groups.every((g) => g.items.length > 0))
  const flat = groups.flatMap((g) => g.items)
  ok(`${lang}: heç bir şablon itmir`, flat.length === cards && new Set(flat.map((t) => t.id)).size === all.length)
  for (const g of groups) {
    ok(`${lang}/${g.id}: adı var`, typeof g.label === 'string' && g.label.length > 0 && g.label !== g.id)
    ok(`${lang}/${g.id}: içində yalnız öz şablonları`, g.items.every((t) => templateConcepts(t).includes(g.id)))
  }
}

/* süzülmüş siyahı: yalnız iki konsept qalır */
const some = all.filter((t) => t.concept === 'kids' || t.id === 'royal-gold')
ok('süzülmüş: yalnız dolu bölmələr', groupTemplatesByConcept(some, 'az').map((g) => g.id).join() === 'toy,kids')

/* konseptsiz şablon → «Digər» */
const g3 = groupTemplatesByConcept([{ id: 'x' }, ...some.slice(0, 1)], 'ru')
ok('konseptsiz → sonda «Другое»', g3[g3.length - 1].id === 'other' && g3[g3.length - 1].label === 'Другое')
ok('az «Digər»', groupTemplatesByConcept([{ id: 'x' }], 'az')[0].label === 'Digər')
ok('naməlum dil → az', groupTemplatesByConcept([{ id: 'x' }], 'de')[0].label === 'Digər')

/* konseptin tədbir növü builder-in 1-ci addımında seçilə bilir */
const eventIds = new Set(EVENT_TYPES.map((e) => e.id))
for (const [id, meta] of Object.entries(CONCEPT_META)) ok(`${id}: tədbir növü «${meta.eventType}» builder-də var`, eventIds.has(meta.eventType))
for (const tpl of all) ok(`${tpl.id}: conceptEventType`, conceptEventType(tpl.id) === CONCEPT_META[tpl.concept].eventType)
ok('Nişan seçimi «Toy / Nişan»a uyğundur', conceptAcceptsEvent('toy', 'nishan') && conceptAcceptsEvent('toy', 'toy'))
ok('Ad günü «Toy / Nişan»a uyğun deyil', !conceptAcceptsEvent('toy', 'birthday'))

/* seçim → tədbir növü */
ok('boş forma: kart tədbiri təyin edir', eventTypeOnSelect('red-veil', 'xina', { eventType: 'toy' }) === 'xina')
ok('ad yazılıb: tək bölməli şablonda dəyişmir', eventTypeOnSelect('red-veil', 'xina', { eventType: 'toy', brideName: 'A' }) === null)
ok('ad yazılıb: bir neçə bölməli dizaynda bölmə qərar verir', eventTypeOnSelect('gazette', 'birthday', { eventType: 'toy', brideName: 'A', groomName: 'B' }) === 'birthday')
ok('Nişan seçimi qalır', eventTypeOnSelect('royal-gold', 'toy', { eventType: 'nishan' }) === null)
ok('eyni tədbir: dəyişiklik yox', eventTypeOnSelect('gazette', 'toy', { eventType: 'toy' }) === null)
ok('bölmə verilməyib: əsas konsept', eventTypeOnSelect('fairy-tale', null, { eventType: 'toy' }) === 'birthday')
ok('seçili kart: ad günü', selectedConceptOf('gazette', 'birthday') === 'birthday')
ok('seçili kart: nişan → toy', selectedConceptOf('gazette', 'nishan') === 'toy')
ok('seçili kart: uyğunsuz tədbir → əsas', selectedConceptOf('gazette', 'corporate') === 'toy')

/* ad günü versiyası */
for (const id of BIRTHDAY_5) {
  ok(`${id}: bir neçə bölməli`, isMultiConcept(id))
  ok(`${id}: toyda → toy`, conceptEventType(id, 'toy') === 'toy')
  ok(`${id}: ad günündə → birthday`, conceptEventType(id, 'birthday') === 'birthday')
  ok(`${id}: etibarsız bölmə → əsas`, conceptEventType(id, 'kids') === 'toy')
  ok(`${id}: məzmun açarları ayrıdır`, templateContentKey(id, 'birthday') === `${id}@birthday` && templateContentKey(id, 'toy') === id && templateContentKey(id, 'nishan') === id)
  const img = templateImage(id, 'birthday')
  ok(`${id}: ad günü şəkli fərqlidir`, img && img !== templateImage(id, 'toy'))
  ok(`${id}: ad günü şəkli mövcuddur`, existsSync(fileURLToPath(new URL(`../public${img}`, import.meta.url))), img)
  for (const lg of ['az', 'en', 'ru']) {
    const t = getStoryCopy(id, lg, 'birthday')
    ok(`${id}/${lg}: hekayədə «Bizim» yoxdur`, !/Bizim|Our |Наш|hekayəmiz|our story|наша/i.test(`${t.title} ${t.sub} ${t.end} ${t.endSub}`), `${t.title} | ${t.end}`)
  }
}
ok('tək bölməli şablon: açar dəyişmir', templateContentKey('royal-gold', 'birthday') === 'royal-gold')

/* ad günü demosu tək nəfər üçündür */
const demoBd = demoForConcept('birthday', 'boarding-pass')
ok('demo: tədbir', demoBd.weddingData.eventType === 'birthday')
ok('demo: tək ad', !!demoBd.weddingData.brideName && !demoBd.weddingData.groomName)
ok('demo: yaş', Number(demoBd.weddingData.age) > 0)
const demoText = JSON.stringify([demoBd.weddingData.programSteps, demoBd.weddingData.loveStory, demoBd.guestbook, demoBd.weddingData.dressCodeDescription])
ok('demo: toy sözləri yoxdur', !/bəy|gəlin|Nicat|Aysel|toy/i.test(demoText), demoText.match(/bəy|gəlin|Nicat|Aysel|toy/i)?.[0])
ok('demo: toyda köhnə kimi', demoForConcept('toy', 'boarding-pass').weddingData.eventType === 'toy' && !!demoForConcept('toy', 'boarding-pass').weddingData.groomName)

/* cütlük mətni toyda qalır, ad günündə dəyişir */
const f = (id, ev, k) => templateCopyFields(id, ev).find((x) => x.key.endsWith('.' + k))?.defaults.az
ok('Cinema: toyda «Baş rollarda»', /rollarda/.test(f('cinema-premiere', 'toy', 'star')))
ok('Cinema: ad günündə «Baş rolda»', /rolda/.test(f('cinema-premiere', 'birthday', 'star')) && !/rollarda/.test(f('cinema-premiere', 'birthday', 'star')))
ok('Cinema: ad günündə «Sevgi» yoxdur', !/Sevgi/.test(f('cinema-premiere', 'birthday', 'rest1')))
ok('Gazette: toyda sevgi proqnozu', /Sevgi/.test(f('gazette', 'toy', 'forecast')))
ok('Gazette: ad günündə tort', /Tort/.test(f('gazette', 'birthday', 'forecast')))

console.log(fail ? `\n${fail} / ${n} uğursuz` : `Şablon bölmələri: ${n} yoxlama, hamısı keçdi (${all.length} dizayn, ${cards} kart)`)
process.exit(fail ? 1 : 0)
