/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLONUN ÖZ MƏTNLƏRİ TESTİ (2026-10-28)

   NƏ ÜÇÜN VAR: premium dizaynlardakı şablona məxsus sətirlər (bilet sahələri,
   qəzet rubrikaları, kino titrləri, brend yazısı…) admin panelindən
   dəyişdirilə bilir. Zəncir 4 yerdən keçir və hər biri qırıla bilər:
     copy.js (TXT + FIELDS) → admin sahəsi → server açar yoxlaması →
     override qatının ağ siyahısı → şablonun `inv.copy(TXT)` oxuması.

   Yoxlayır:
     1. FIELDS-dəki hər açar TXT-də 3 dildə var və boş deyil
     2. admin açarı serverin regex-inə uyğundur (admin_invitation_content.php)
     3. sahənin bölməsi admin «Mətnlər» tabında mövcuddur
     4. şablon copy.js-i idxal edir və hər açarı həqiqətən oxuyur
     5. normalizeOverrides şablon açarını saxlayır, naməlum açarı atır
     6. fill() yer tutucularını doldurur
     7. açılış sahələrinin hamısı serverin ağ siyahısındadır
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { templateCopyFields, templateLabels, TEMPLATE_COPY_KEYS } from '../src/templates/templateCopy.js'
import { fill, copyPrefix } from '../src/templates/_shared/copyText.js'
import { normalizeOverrides, CONTENT_SECTIONS } from '../src/data/adminOverrides.js'
import { OPENING_SPEC, OPENING_SLOT_LABELS } from '../src/templates/_shared/openingSpec.js'

const REDESIGNED = [
  'modern-black', 'white-elegance', 'night-sky', 'oriental-luxe', 'nature-touch', 'crystal-glass',
  'boarding-pass', 'cinema-premiere', 'vinyl-record', 'royal-palace', 'mediterranean', 'gazette', 'luxury-jewelry',
]
const SERVER_KEY_RE = /^[a-z][a-z0-9_]*(\.[a-z][a-zA-Z0-9_]*)?$/i
const SECTION_KEYS = new Set(CONTENT_SECTIONS.map((s) => s.key))

let fail = 0
let n = 0
const ok = (name, cond, extra = '') => {
  n++
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}

for (const id of REDESIGNED) {
  const fields = templateCopyFields(id)
  const src = readFileSync(`src/templates/${id}/index.jsx`, 'utf8')
  ok(`${id}: ən azı bir öz sətri var`, fields.length > 0)
  ok(`${id}: LABELS reyestrdədir`, !!templateLabels(id))
  ok(`${id}: copy.js idxal olunur`, /import \{[^}]*\bTXT\b[^}]*\} from '\.\/copy'/.test(src))
  ok(`${id}: inv.copy(TXT) işlədilir`, src.includes('inv.copy(TXT)'))
  for (const f of fields) {
    const k = f.key.slice(copyPrefix(id).length)
    ok(`${f.key}: prefiks düzgündür`, f.key.startsWith(copyPrefix(id)))
    ok(`${f.key}: server açar regex-inə uyğundur`, SERVER_KEY_RE.test(f.key))
    ok(`${f.key}: bölmə «${f.section}» admin tabında var`, SECTION_KEYS.has(f.section))
    ok(`${f.key}: adı var`, !!f.label)
    for (const lg of ['az', 'en', 'ru']) ok(`${f.key}: ${lg} mətni var`, typeof f.defaults[lg] === 'string' && f.defaults[lg].trim().length > 0)
    ok(`${f.key}: şablon bu açarı oxuyur`, new RegExp(`\\.${k}\\b`).test(src), k)
    ok(`${f.key}: ağ siyahıdadır`, TEMPLATE_COPY_KEYS.has(f.key))
  }
}

/* override qatı */
const ov = normalizeOverrides({ strings: {
  'tpl_boarding_pass.pax': { az: 'Qonaqlarımız', ru: 'Гости' },
  'tpl_boarding_pass.nope': { az: 'x' },
  'tpl_unknown.pax': { az: 'x' },
} })
ok('normalizeOverrides: şablon açarı saxlanılır', ov?.strings?.['tpl_boarding_pass.pax']?.az === 'Qonaqlarımız')
ok('normalizeOverrides: naməlum açar atılır', !ov?.strings?.['tpl_boarding_pass.nope'] && !ov?.strings?.['tpl_unknown.pax'])

/* fill */
ok('fill: yer tutucular', fill('Baş rollarda {names}', { names: 'A & B' }) === 'Baş rollarda A & B')
ok('fill: naməlum yer tutucu qalır', fill('{x} və {y}', { x: 1 }) === '1 və {y}')
ok('fill: boş dəyər', fill('a{at}b', { at: '' }) === 'ab')

/* açılış sahələri ↔ server ağ siyahısı */
const php = readFileSync('public/api/admin_content_rules.php', 'utf8')
const phpSlots = new Set([...php.match(/ACR_OPENING_SLOTS = \[([\s\S]*?)\]/)[1].matchAll(/'(\w+)'/g)].map((m) => m[1]))
for (const [id, spec] of Object.entries(OPENING_SPEC)) {
  for (const slot of spec.slots) {
    ok(`${id}: açılış sahəsi «${slot}» serverdə qəbul olunur`, phpSlots.has(slot))
    ok(`${id}: açılış sahəsi «${slot}» admin adı var`, !!OPENING_SLOT_LABELS[slot])
  }
}

console.log(fail === 0 ? `Şablon mətnləri: ${n} yoxlama, hamısı keçdi` : `\n${fail} / ${n} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
