/* ─────────────────────────────────────────────────────────────────────────────
   DƏVƏTNAMƏ SLUG-I TESTİ (Phase 46)

   Builder-in «Sifarişi təsdiqlə» düyməsi slug-ı adlardan hesablayırdı; admin
   sifariş səhifəsindəki «Təsdiq et» isə dəvətnamə ÜMUMİYYƏTLƏ yaratmırdı —
   sifarişlər «təsdiqlənmiş», dəvətnamələr siyahısı isə boş qalırdı.
   İndi hər iki yol eyni `computeInviteSlug()`-dan istifadə edir; nəticə
   builder-in köhnə hesabı ilə HƏRFBƏHƏRF eyni olmalıdır (mövcud linklər).

   İşə salmaq: node tests/invite_slug_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import * as s from '../src/utils/inviteSlug.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)

ok('computeInviteSlug export olunur', typeof s.computeInviteSlug === 'function')
ok('toSlug export olunur', typeof s.toSlug === 'function')

if (typeof s.computeInviteSlug === 'function') {
  const c = s.computeInviteSlug
  eq('toy: gəlin-ve-bəy', c({ eventType: 'toy', brideName: 'Səbinə', groomName: 'Rövşən' }), 'sebine-ve-rovsen')
  eq('nişan', c({ eventType: 'nishan', brideName: 'Aytac', groomName: 'Niyaz' }), 'aytac-ve-niyaz')
  eq('korporativ: tədbir adı', c({ eventType: 'corporate', eventName: 'Turqayın Kiçik Toyu' }), 'turqayin-kicik-toyu')
  eq('digər, ad yoxdursa tedbir', c({ eventType: 'other', eventName: '' }), 'tedbir')
  eq('ad günü: şəxsin adı', c({ eventType: 'birthday', brideName: 'Güldəstə' }), 'guldeste')
  eq('ad günü, ad yoxdursa davetname', c({ eventType: 'birthday' }), 'davetname')
  eq('böyük İ/Ə/Ş/Ç/Ğ/Ö/Ü', c({ eventType: 'toy', brideName: 'İLKİN ŞƏMS', groomName: 'ÇAĞRI ÖZÜM' }), 'ilkin-sems-ve-cagri-ozum')
  eq('eventType yoxdursa (köhnə) ad günü kimi', c({ brideName: 'Leyla' }), 'leyla')
}

if (fail) { console.log(`\n${fail} FAIL`); process.exit(1) }
console.log('invite_slug: hamısı keçdi')
