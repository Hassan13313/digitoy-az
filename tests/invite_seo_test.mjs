/* ─────────────────────────────────────────────────────────────────────────────
   DƏVƏTNAMƏ SƏHİFƏSİNİN BAŞLIĞI TESTİ (Phase 45.2)

   Xəta: korporativ / digər / ad günü dəvətnaməsində də brauzer başlığı
   «Toy Dəvətnaməsi», təsvir «sizi toy mərasiminə dəvət edir» idi.
   Toy üçün mətn HƏRFBƏHƏRF əvvəlki kimi qalmalıdır.
   Server tərəfi (WhatsApp önbaxışı): tests/seo_invite_meta_test.php.

   İşə salmaq: node tests/invite_seo_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import * as seo from '../src/utils/inviteSeo.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)

const meta = seo.inviteSeoMeta
ok('inviteSeoMeta export olunur', typeof meta === 'function')

if (typeof meta === 'function') {
  const tail = 'Rəqəmsal dəvətnaməyə baxın, İştirak Təsdiqi göndərin.'

  /* Toy — Phase 45.2-dən əvvəlki çıxışla eyni */
  const toy = meta({ eventType: 'toy', groomName: 'Tural', brideName: 'Aysel', venueName: 'Gülüstan Sarayı' })
  eq('toy başlıq', toy.title, 'Tural & Aysel — Toy Dəvətnaməsi | DigiToy')
  eq('toy təsvir', toy.description, `Tural & Aysel sizi toy mərasiminə dəvət edir. Gülüstan Sarayı məkanında ${tail}`)
  eq('eventType yoxdursa toy', meta({ groomName: 'Tural', brideName: 'Aysel' }).title, 'Tural & Aysel — Toy Dəvətnaməsi | DigiToy')
  eq('adsız toy', meta({ eventType: 'toy' }).title, 'Toy Dəvətnaməsi | DigiToy')
  eq('adsız toy → təsvir yoxdur', meta({ eventType: 'toy' }).description, null)

  eq('nişan', meta({ eventType: 'nishan', groomName: 'Tural', brideName: 'Aysel' }).title, 'Tural & Aysel — Nişan Dəvətnaməsi | DigiToy')
  eq('nişan təsvir', meta({ eventType: 'nishan', groomName: 'Tural', brideName: 'Aysel' }).description, `Tural & Aysel sizi nişan mərasiminə dəvət edir. ${tail}`)

  const bd = meta({ eventType: 'birthday', brideName: 'Leyla' })
  eq('ad günü başlıq', bd.title, 'Leyla — Ad Günü Dəvətnaməsi | DigiToy')
  eq('ad günü təsvir', bd.description, `Leyla sizi ad gününə dəvət edir. ${tail}`)

  const corp = meta({ eventType: 'corporate', eventName: 'Əməkdaşlar Gecəsi', venueName: 'Fairmont Baku' })
  eq('korporativ başlıq', corp.title, 'Əməkdaşlar Gecəsi — Dəvətnamə | DigiToy')
  eq('korporativ təsvir', corp.description, `Sizi «Əməkdaşlar Gecəsi» tədbirinə dəvət edirik. Fairmont Baku məkanında ${tail}`)
  eq('digər', meta({ eventType: 'other', eventName: 'Ədəbiyyat Axşamı' }).title, 'Ədəbiyyat Axşamı — Dəvətnamə | DigiToy')
  eq('adsız korporativ', meta({ eventType: 'corporate' }).title, 'Dəvətnamə | DigiToy')

  for (const r of [corp, bd, meta({ eventType: 'other', eventName: 'X' })]) {
    ok(`«toy» sözü yoxdur: ${r.title}`, !/toy/i.test(r.title.replace('DigiToy', '')) && !/toy mərasim/i.test(r.description || ''))
  }
  eq('boş data', meta(undefined).title, 'Toy Dəvətnaməsi | DigiToy')
}

if (fail) { console.log(`\n${fail} FAIL`); process.exit(1) }
console.log('invite_seo: hamısı keçdi')
