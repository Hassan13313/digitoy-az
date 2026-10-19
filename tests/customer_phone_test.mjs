/* ─────────────────────────────────────────────────────────────────────────────
   Phase 50 — builderdəki könüllü əlaqə nömrəsi (src/utils/customerPhone.js)

   Eyni fixture-u tests/customer_phone_test.php server qaydası üçün işlədir:
   JS və PHP EYNİ nəticəni verməlidir (biri dəyişsə test sınır).
   İşə salmaq: node tests/customer_phone_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { normalizeCustomerPhone, formatPhoneDisplay } from '../src/utils/customerPhone.js'

let pass = 0
let fail = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; return }
  console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++
}
const read = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8')

const fx = JSON.parse(read('./fixtures/phone_cases.json'))
for (const [input, want] of fx.cases) {
  const got = normalizeCustomerPhone(input)
  ok(`${JSON.stringify(input)} → ${JSON.stringify(want)}`, got === want, `alındı ${JSON.stringify(got)}`)
}
for (const input of fx.non_strings) {
  ok(`sətir olmayan ${JSON.stringify(input)} → null`, normalizeCustomerPhone(input) === null)
}

ok('göstəriş formatı', formatPhoneDisplay('+994501234567') === '+994 50 123 45 67')
ok('xarici nömrə olduğu kimi', formatPhoneDisplay('+905321234567') === '+905321234567')
ok('boş', formatPhoneDisplay(null) === '')

/* Nömrə form_data-ya YAZILMAMALIDIR (dəvətnamədə ictimai qaytarılır) */
const builder = read('../src/components/landing/BuilderForm.jsx')
ok('BuilderForm nömrəni data-ya yazmır', !/set\(\s*['"]customerPhone['"]/.test(builder) && !/set\(\s*['"]customer_phone['"]/.test(builder))
ok('autosave normallaşdırılmış nömrəni ayrıca göndərir', /saveDraft\([^;]*, step, savedPhone\)/.test(builder)
  && builder.includes('const savedPhone = normalizeCustomerPhone(customerPhone) || \'\''))
ok('draft bərpası bitənə qədər autosave gözləyir (draftReady)', builder.includes('.finally(function() { setDraftReady(true) })')
  && builder.includes('if (!isHydrated || !draftReady ||'))
for (const f of ['../src/components/landing/Preview.jsx', '../src/templates/_shared/TemplateActions.jsx']) {
  ok(`${f.split('/').pop()}: sifarişdə nömrə göndərilir`, read(f).includes('readCustomerPhone()'))
}

console.log(`\ncustomer_phone: ${pass} ok, ${fail} FAIL`)
process.exit(fail ? 1 : 0)
