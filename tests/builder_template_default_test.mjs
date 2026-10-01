/* ─────────────────────────────────────────────────────────────────────────────
   BUILDER DEFAULT ŞABLON TESTİ (Phase 45.1)

   Xəta: builder açılanda siyahının ilk dizaynı (Royal Gold) «Seçildi» görünürdü,
   amma `data.templateId` boş qalırdı. Önbaxış, submit_draft və save_invitation
   boş dəyəri DEFAULT_TEMPLATE_ID-yə (simple-luxury) çevirirdi — dizayn
   seçməyən müştəri Royal Gold əvəzinə Simple Luxury alırdı.

   Qayda:
     1. Müştəri heç nə seçməyibsə → builder-in ilk dizaynı (Royal Gold).
     2. Seçim edilibsə → olduğu kimi qalır.
     3. Admin baxışında boş dəyər → DEFAULT_TEMPLATE_ID: köhnə sifarişlər
        indiyə qədər necə render olunubsa, elə qalır.

   İşə salmaq: node tests/builder_template_default_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import * as cfg from '../src/templates/templateConfig.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)

const resolve = cfg.resolveBuilderTemplateId
ok('resolveBuilderTemplateId export olunur', typeof resolve === 'function')

if (typeof resolve === 'function') {
  eq('builder-in ilk dizaynı Royal Gold-dur', cfg.builderDefaultTemplateId(), 'royal-gold')

  for (const empty of ['', null, undefined]) {
    eq(`müştəri, seçim yoxdur (${JSON.stringify(empty)}) → royal-gold`, resolve(empty), 'royal-gold')
    eq(`admin, seçim yoxdur (${JSON.stringify(empty)}) → DEFAULT_TEMPLATE_ID`,
      resolve(empty, { isAdmin: true }), cfg.DEFAULT_TEMPLATE_ID)
  }

  eq('müştərinin seçimi qalır', resolve('night-sky'), 'night-sky')
  eq('adminin gördüyü seçim qalır', resolve('floral-garden', { isAdmin: true }), 'floral-garden')
}

if (fail) { console.log(`\n${fail} FAIL`); process.exit(1) }
console.log('builder_template_default: hamısı keçdi')
