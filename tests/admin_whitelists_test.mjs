/* ─────────────────────────────────────────────────────────────────────────────
   Admin ağ siyahıları: brauzer ↔ server (2026-11)

   Admin panel bir dəyəri göstərir, server isə ağ siyahıda olmayanı SƏSSİZCƏ atır.
   Belə yeni şablonların şriftləri «saxlanılır» görünüb, əslində itirdi. Bu test iki tərəfi müqayisə edir.

   Həmçinin: şablon qatı + dəvətnamə qatının birləşməsi (mergeTemplateDefaults).

   İşə salma: node tests/admin_whitelists_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { FONT_STACKS, listTemplates, isMultiConcept } from '../src/templates/templateConfig.js'
import { THEME_KEYS, CONTENT_SECTIONS, OPENING_SLOT_KEYS, STORY_TEXT_KEYS, mergeTemplateDefaults, withTemplateDefaults, normalizeOverrides } from '../src/data/adminOverrides.js'
import { SECTION_DEFS } from '../src/data/sections.js'
import { OPENING_SPEC } from '../src/templates/_shared/openingSpec.js'

let fail = 0
let n = 0
const ok = (name, cond, extra = '') => {
  n++
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}
const eq = (name, a, b) => ok(name, JSON.stringify(a) === JSON.stringify(b), `${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`)
const read = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8')
const rules = read('../public/api/admin_content_rules.php')
const lib = read('../public/api/template_content_lib.php')

const phpList = (src, name) => {
  const m = src.match(new RegExp(`const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\];`))
  if (!m) { ok(`${name} tapıldı`, false); return [] }
  return [...m[1].replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/'([^']+)'/g)].map((x) => x[1])
}
const sorted = (a) => [...a].sort()

eq('şriftlər: PHP = FONT_STACKS', sorted(phpList(rules, 'FONT_KEYS')), sorted(Object.keys(FONT_STACKS)))
eq('rənglər: PHP = THEME_KEYS', sorted(phpList(rules, 'THEME_KEYS')), sorted(THEME_KEYS))
ok('bölmə başlıqları: hamısı PHP-də', CONTENT_SECTIONS.every((s) => phpList(rules, 'LABEL_KEYS').includes(s.key)))
eq('açılış yerləri: PHP = OPENING_SLOT_LABELS', sorted(phpList(rules, 'ACR_OPENING_SLOTS')), sorted(OPENING_SLOT_KEYS))
eq('hekayə mətnləri: PHP = STORY_TEXT_KEYS', sorted(phpList(rules, 'ACR_STORY_TEXTS')), sorted(STORY_TEXT_KEYS))
ok('bölmələr: hamısı PHP-də', SECTION_DEFS.every((d) => phpList(rules, 'SECTION_KEYS').includes(d.id)), SECTION_DEFS.map((d) => d.id).join())
eq('ad günü versiyaları: PHP = templateConfig', sorted(phpList(lib, 'TC_BIRTHDAY_VARIANTS')), sorted(listTemplates().filter((t) => isMultiConcept(t.id)).map((t) => t.id)))

/* hər şablonun açılış spesifikasiyası var, slotları tanınır */
for (const t of listTemplates()) {
  const spec = OPENING_SPEC[t.id]
  ok(`${t.id}: açılış spesifikasiyası`, !!spec)
  if (spec) ok(`${t.id}: slotlar ağ siyahıdadır`, spec.slots.every((s) => OPENING_SLOT_KEYS.includes(s)), spec.slots.join())
}

/* ── İki qatın birləşməsi ── */
const tpl = {
  theme: { primary: '#111111', accent: '#222222' },
  fonts: { heading: 'inter' },
  strings: { 'tpl_gazette.price': { az: 'ŞABLON', en: 'TPL' }, inv_join: { az: 'ŞABLON' } },
  labels: { venue: { kicker: 'K', title: { az: 'ŞABLON', en: 'TPL' } } },
  opening: { text: { cta: { az: 'ŞABLON', en: 'TPL' } }, hide: ['hint'] },
  story: { text: { title: { az: 'ŞABLON' } } },
}
const inv = {
  theme: { primary: '#333333' },
  strings: { 'tpl_gazette.price': { az: 'DƏVƏT' } },
  labels: { venue: { title: { az: 'DƏVƏT' } } },
  opening: { text: { cta: { az: 'DƏVƏT' } } },
  story: { ch: { c0: { title: { az: 'FƏSİL' } } } },
}
const m = mergeTemplateDefaults(tpl, inv)
eq('rəng: dəvətnamə üstündür, qalanı şablondan', m.theme, { primary: '#333333', accent: '#222222' })
eq('şrift: şablondan', m.fonts, { heading: 'inter' })
eq('sətir: dil-dil birləşir', m.strings['tpl_gazette.price'], { az: 'DƏVƏT', en: 'TPL' })
eq('sətir: şablondakı qalır', m.strings.inv_join, { az: 'ŞABLON' })
eq('başlıq: birləşir', m.labels.venue, { kicker: 'K', title: { az: 'DƏVƏT', en: 'TPL' } })
eq('açılış mətni: birləşir', m.opening.text.cta, { az: 'DƏVƏT', en: 'TPL' })
eq('açılış gizlətmə: şablondan', m.opening.hide, ['hint'])
eq('hekayə: fəsil dəvətnamədən, mətn şablondan', m.story, { ch: { c0: { title: { az: 'FƏSİL' } } }, text: { title: { az: 'ŞABLON' } } })
ok('boş şablon: EYNİ obyekt', mergeTemplateDefaults({}, inv) === inv && mergeTemplateDefaults(null, inv) === inv)
ok('dəvətnamə qatı yoxdur: işləyir', mergeTemplateDefaults(tpl, undefined).strings.inv_join.az === 'ŞABLON')
ok('birləşmiş nəticə təmizlənir', !!normalizeOverrides(m)?.strings?.inv_join)

const wd = { brideName: 'A', sections: { dresscode: true }, admin: inv }
ok('boş defaults: EYNİ data', withTemplateDefaults(wd, {}) === wd && withTemplateDefaults(wd, { admin: {}, sections: {} }) === wd && withTemplateDefaults(wd, undefined) === wd)
const wm = withTemplateDefaults(wd, { admin: tpl, sections: { dresscode: false, gallery: false } })
eq('bölmələr: müştərinin seçimi üstündür', wm.sections, { dresscode: true, gallery: false })
ok('data dəyişmir', wd.sections.gallery === undefined && wd.admin === inv)

console.log(fail ? `\n${fail} / ${n} uğursuz` : `Admin ağ siyahıları: ${n} yoxlama, hamısı keçdi`)
process.exit(fail ? 1 : 0)
