/* ─────────────────────────────────────────────────────────────────────────────
   İŞTİRAK TƏSDİQİ — QONAQ SİYAHISINDAN ASILI DEYİL (Phase 48)

   İstək (2026-10-07): «hələ ki adlar yazılmamış olsa da, insanlar adlarını
   qeyd edib gəlib-gəlməyəcəklərini təsdiqləyə bilsinlər».
   Əvvəl siyahı varsa adı siyahıda OLMAYAN qonaq göndərə bilmirdi («Adınız
   siyahıda tapılmadı», düymə bağlı); siyahıdakı adı tam yazıb seçməyən də.

   İşə salmaq: node tests/rsvp_target_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { rsvpTarget } from '../src/utils/rsvpTarget.js'

let fail = 0
let pass = 0
const ok = (name, cond, extra = '') => {
  if (cond) pass++
  else { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}
const eq = (name, a, b) => ok(name, JSON.stringify(a) === JSON.stringify(b), `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)

const t = (guestList, query, selected = null) => rsvpTarget({ guestList, selected, query })

const aysel = { id: 1, full_name: 'Aysel Məmmədova', table_id: 'M1' }
const tural = { id: 2, full_name: 'Tural Əliyev', table_id: 'M2' }
const anar1 = { id: 3, full_name: 'Anar Quliyev', table_id: 'M3' }
const anar2 = { id: 4, full_name: 'Anar Quliyev', table_id: 'M4' }
const list  = [aysel, tural, anar1, anar2]

/* ── Siyahı YOXDUR (boş və ya hələ yüklənməyib) ── */
eq('siyahı boş: ad yazılıb → sərbəst cavab', t([], 'Leyla Həsənova'), { kind: 'free', name: 'Leyla Həsənova' })
eq('siyahı yüklənir (null): ad yazılıb → sərbəst cavab', t(null, 'Leyla'), { kind: 'free', name: 'Leyla' })
eq('ad boşdur → göndərmək olmaz', t([], ''), null)
eq('yalnız boşluq → göndərmək olmaz', t([], '   '), null)
eq('adın kənar boşluqları atılır', t([], '  Leyla  '), { kind: 'free', name: 'Leyla' })

/* ── Siyahı VAR ── */
eq('siyahıdan seçilib → həmin qonaq', t(list, 'Aysel Məmmədova', aysel), { kind: 'guest', guest: aysel })
eq('adı tam yazıb seçməyib (tək uyğunluq) → həmin qonaq', t(list, '  tural   əliyev '), { kind: 'guest', guest: tural })
eq('Azərbaycan hərfsiz yazılış («tural eliyev») da uyğun gəlir', t(list, 'TURAL ELIYEV'), { kind: 'guest', guest: tural })
eq('«Məmmədova» ↔ «Memmedova»', t(list, 'aysel memmedova'), { kind: 'guest', guest: aysel })
eq('adı siyahıda YOXDUR → yenə göndərilir (sərbəst)', t(list, 'Kamran Rzayev'), { kind: 'free', name: 'Kamran Rzayev' })
eq('yarımçıq ad («Aysel») başqasına bağlanmır → sərbəst', t(list, 'Aysel'), { kind: 'free', name: 'Aysel' })
eq('eyni adlı iki qonaq → təxmin edilmir, sərbəst', t(list, 'Anar Quliyev'), { kind: 'free', name: 'Anar Quliyev' })
eq('siyahı var, ad boş → göndərmək olmaz', t(list, ''), null)

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
