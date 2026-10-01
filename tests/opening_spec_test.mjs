/* ─────────────────────────────────────────────────────────────────────────────
   AÇILIŞ EKRANI TESTİ (Phase 45)

   `openingSpec.js` 16 şablonun açılış mətnlərinin TƏK mənbəyidir. Bu test
   qoruyur:
     1. GERİYƏ UYĞUNLUQ — AZ defoltları Phase 45-dən ƏVVƏLKİ markup-dakı
        sətirlərlə HƏRFBƏHƏRF eynidir (mövcud dəvətnamələr dəyişməməlidir).
     2. MONOQRAM — cütlük/ad günü əvvəlki kimi baş hərf, korporativ/digər
        tədbirdə hərf YOX («Əliyev Turqayın…» → «Ə» xətası).
     3. DİL — EN/RU-da açılış artıq Azərbaycanca qalmır.
     4. ADMIN OVERRIDE — gizlətmə, dil zənciri, monoqram rejimləri.
     5. MÜQAVİLƏ — hər şablonun slotu admin etiketinə və server ağ
        siyahısına (admin_content_rules.php) uyğundur.

   İşə salmaq: node tests/opening_spec_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import {
  OPENING_SPEC, OPENING_SLOT_LABELS, openingDefaults, autoMonogram, makeOpeningText, phrase,
} from '../src/templates/_shared/openingSpec.js'
import { normalizeOpening, OPENING_SLOT_KEYS } from '../src/data/adminOverrides.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)

const TEMPLATES = Object.keys(OPENING_SPEC)
const couple = { eventType: 'toy', groomName: 'Tural', brideName: 'Aysel', date: '2026-11-21', time: '19:00', venueName: 'Gülüstan Sarayı, Bakı' }
const corp   = { eventType: 'other', eventName: 'Əliyev Turqayın kiçik toyu', groomName: '', brideName: '', date: '2026-10-11', time: '18:00', venueName: 'Nagil Bag Restaurant' }
const bday   = { eventType: 'birthday', eventName: 'Sinan', brideName: '', date: '2026-05-02', venueName: 'Bakı' }
const ctx = (wd, lang = 'az', eventLabel = 'Toy') => ({
  weddingData: wd, lang, eventLabel,
  isCouple: ['toy', 'nishan'].includes(wd.eventType),
  isCorp: ['corporate', 'other'].includes(wd.eventType),
})

/* ── 1. AZ defoltları = köhnə markup ─────────────────────────────────────── */
const d = (id, wd = couple, label) => openingDefaults(id, ctx(wd, 'az', label))

eq('oriental CTA', d('oriental-luxe').cta, 'Dəvətnaməni aç')
eq('oriental kicker = eventLabel', d('oriental-luxe', couple, 'Toy').kicker, 'Toy')
eq('oriental meta', d('oriental-luxe').meta, '21 Noyabr 2026, Şənbə · Bakı')
eq('hint hamısında «toxunun»', TEMPLATES.filter((id) => id !== 'simple-luxury').every((id) => d(id).hint === 'toxunun'), true)
eq('white-elegance «Dəvətnamə»', d('white-elegance').sub, 'Dəvətnamə')
eq('white-elegance tarix', d('white-elegance').meta, '21 · 11 · 2026')
eq('vinyl CTA', d('vinyl-record').cta, 'Plyonkanı işə sal')
eq('vinyl kicker', d('vinyl-record').kicker, 'Side A')
eq('royal-palace kicker', d('royal-palace').kicker, 'Dəvətnamə')
eq('royal-gold cütlük CTA', d('royal-gold').cta, 'Dəvəti aç')
eq('royal-gold korporativ CTA', d('royal-gold', corp).cta, 'Dəvətnaməni aç')
eq('royal-gold Anno', d('royal-gold').sub, 'Anno MMXXVI')
eq('royal-gold tarix (AZ)', d('royal-gold').meta, '21 Noyabr 2026, Şənbə · Bakı')
eq('floral cütlük CTA', d('floral-garden').cta, 'Dəvətnaməyə daxil olun')
eq('floral korporativ CTA', d('floral-garden', corp).cta, 'Tədbirə daxil olun')
eq('boarding CTA', d('boarding-pass').cta, 'Check-in et')
eq('boarding marşrut', d('boarding-pass').route, 'GYD → ♥')
eq('boarding sahələr', [d('boarding-pass').fDate, d('boarding-pass').fTime, d('boarding-pass').fGate].join('|'), 'Tarix|Saat|Qapı')
eq('boarding meta = məkan', d('boarding-pass').meta, 'Gülüstan Sarayı, Bakı')
eq('cinema CTA', d('cinema-premiere').cta, 'Premyeranı aç')
eq('cinema alt yazı', d('cinema-premiere').sub, 'bir ömürlük film')
eq('cinema kicker', d('cinema-premiere').kicker, 'Premyera')
eq('cinema meta', d('cinema-premiere').meta, '21.11.2026 · Gülüstan Sarayı, Bakı')
eq('crystal kicker', d('crystal-glass').kicker, 'Dəvətnamə')
eq('gazette CTA', d('gazette').cta, 'Buraxılışı oxu')
eq('gazette buraxılış', d('gazette').edition, 'Xüsusi buraxılış')
eq('gazette masthead', d('gazette').masthead, 'THE GAZETTE')
eq('gazette toy rubrikası', d('gazette').sub, 'Toy elanı · Bakı')
eq('gazette saat', d('gazette').meta, 'Saat 19:00')
eq('jewelry CTA', d('luxury-jewelry').cta, 'Qutunu aç')
eq('mediterranean meta', d('mediterranean').meta, '21 · 11 · 2026 · Gülüstan Sarayı, Bakı')
eq('modern-black CTA', d('modern-black').cta, 'Dəvəti aç')
eq('modern-black VƏ', d('modern-black').and, 'VƏ')
eq('modern-black brend', d('modern-black').brand, 'Digitoy')
eq('nature meta (yer əvvəl)', d('nature-touch').meta, 'Bakı · 21 Noyabr 2026, Şənbə')
eq('night-sky kicker', d('night-sky').kicker, 'O gecə göy belə görünürdü')
eq('night-sky meta (Bakı koordinatı)', d('night-sky').meta, '21 Noyabr 2026, Şənbə · 40°23′N · 49°52′E')
eq('simple-luxury şüar', d('simple-luxury').sub, 'Bir Dəvətnamədən Daha Artığı')
eq('simple-luxury Keç', d('simple-luxury').skip, 'Keç →')
eq('adlar bir sətirdə', d('oriental-luxe').title, 'Tural & Aysel')
eq('korporativ ad', d('oriental-luxe', corp).title, 'Əliyev Turqayın kiçik toyu')

/* Düzəliş: gazette rubrikası artıq tədbir növünə görədir */
eq('gazette korporativ rubrika', d('gazette', corp).sub, 'Tədbir elanı · Bakı')

/* ── 2. Monoqram ─────────────────────────────────────────────────────────── */
eq('oriental cütlük', autoMonogram('oriental-luxe', ctx(couple)), 'T&A')
eq('white cütlük', autoMonogram('white-elegance', ctx(couple)), 'T&A')
eq('royal-gold cütlük', autoMonogram('royal-gold', ctx(couple)), 'T&A')
eq('vinyl cütlük', autoMonogram('vinyl-record', ctx(couple)), 'T&A')
eq('royal-palace cütlük', autoMonogram('royal-palace', ctx(couple)), 'T A')
eq('ad günü — baş hərf qalır', autoMonogram('oriental-luxe', ctx(bday)), 'S')
eq('vinyl ad günü', autoMonogram('vinyl-record', ctx(bday)), 'S')
for (const id of ['royal-gold', 'oriental-luxe', 'white-elegance', 'vinyl-record', 'royal-palace']) {
  const m = autoMonogram(id, ctx(corp))
  ok(`${id}: korporativdə «Ə» YOXDUR`, m !== 'Ə' && !/[A-Za-zƏəİıÖöÜüĞğÇçŞş]/.test(m || ''), JSON.stringify(m))
}
eq('oriental korporativ → ornament (null)', autoMonogram('oriental-luxe', ctx(corp)), null)
eq('royal-palace korporativ köhnə adları görmür', autoMonogram('royal-palace', ctx({ ...corp, groomName: 'Köhnə', brideName: 'Ad' })), '♛')

/* ── 3. Dil ──────────────────────────────────────────────────────────────── */
const en = openingDefaults('oriental-luxe', ctx(couple, 'en', 'Wedding'))
eq('EN CTA', en.cta, 'Open the invitation')
eq('EN hint', en.hint, 'tap to open')
ok('EN tarix ingiliscə', /November/.test(en.meta), en.meta)
const ru = openingDefaults('boarding-pass', ctx(couple, 'ru', 'Свадьба'))
eq('RU boarding sahəsi', ru.fGate, 'Выход')
eq('RU CTA', ru.cta, 'Пройти регистрацию')
eq('RU royal-gold tarixi rusca', /Ноября/.test(openingDefaults('royal-gold', ctx(couple, 'ru')).meta), true)
eq('naməlum dil → AZ', phrase('open', 'de'), 'Dəvətnaməni aç')
for (const id of TEMPLATES) {
  for (const lang of ['en', 'ru']) {
    const def = openingDefaults(id, ctx(couple, lang, lang === 'en' ? 'Wedding' : 'Свадьба'))
    for (const [slot, v] of Object.entries(def)) {
      if (['title', 'meta', 'venue', 'brand', 'masthead', 'pass', 'route', 'no', 'kicker'].includes(slot)) continue
      ok(`${id} ${lang} ${slot} azərbaycanca qalmayıb`, !/[əƏğĞıİşŞçÇöÖüÜ]/.test(v), v)
    }
  }
}

/* ── 4. Admin override ───────────────────────────────────────────────────── */
const opening = normalizeOpening({
  mono: { mode: 'sticker', value: '💍' },
  text: { cta: { az: 'Buyurun', en: 'Welcome' }, kicker: { az: 'Xüsusi' } },
  hide: ['hint'],
})
const otAz = makeOpeningText('oriental-luxe', ctx(couple), opening)
eq('override CTA (AZ)', otAz.text('cta'), 'Buyurun')
eq('gizli sahə boşdur', otAz.text('hint'), '')
eq('gizli sahə override-dır', otAz.override('hint'), '')
eq('dəyişməyən sahə override deyil', otAz.override('meta'), undefined)
eq('monoqram stiker', otAz.mono.kind + ':' + otAz.mono.text, 'sticker:💍')
const otEn = makeOpeningText('oriental-luxe', ctx(couple, 'en', 'Wedding'), opening)
eq('EN override', otEn.text('cta'), 'Welcome')
eq('EN-də olmayan → AZ override (sistem qaydası)', otEn.text('kicker'), 'Xüsusi')
const none = makeOpeningText('royal-gold', ctx(couple), null)
eq('override yoxdursa defolt', none.text('cta'), 'Dəvəti aç')
eq('override yoxdursa avtomatik monoqram', none.mono.kind + ':' + none.mono.text, 'auto:T&A')
eq('boş rejim', makeOpeningText('royal-gold', ctx(couple), { mono: { mode: 'none' } }).mono.kind, 'none')
eq('şəkilsiz şəkil rejimi → avtomatik', makeOpeningText('royal-gold', ctx(couple), { mono: { mode: 'image' } }).mono.kind, 'auto')

/* ── 5. Müqavilə: slotlar ↔ etiketlər ↔ server ağ siyahısı ────────────────── */
for (const [id, spec] of Object.entries(OPENING_SPEC)) {
  for (const slot of spec.slots) {
    ok(`${id}.${slot} admin etiketi var`, !!OPENING_SLOT_LABELS[slot])
    ok(`${id}.${slot} defoltu var`, typeof openingDefaults(id, ctx(couple))[slot] === 'string')
  }
}
const php = readFileSync(new URL('../public/api/admin_content_rules.php', import.meta.url), 'utf8')
const m = php.match(/ACR_OPENING_SLOTS = \[([\s\S]*?)\];/)
const phpSlots = m ? [...m[1].matchAll(/'([a-zA-Z]+)'/g)].map((x) => x[1]).sort() : []
eq('server slot siyahısı = müştəri siyahısı', JSON.stringify(phpSlots), JSON.stringify([...OPENING_SLOT_KEYS].sort()))

console.log(fail
  ? `\n${fail} yoxlama UĞURSUZ`
  : 'Açılış ekranı: AZ defoltları dəyişməyib, monoqram, dil və override-lar keçdi')
process.exit(fail ? 1 : 0)
