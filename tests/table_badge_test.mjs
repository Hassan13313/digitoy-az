/* ─────────────────────────────────────────────────────────────────────────────
   MASA NİŞANI TESTİ (2026-10-28)

   NƏ ÜÇÜN VAR: masa adı müştərinin sərbəst mətnidir («Masa 4», «12», «VIP»,
   «Bəy tərəfinin qohumları»). Premium nişanlarda «Masa 4» bütöv yazılanda
   Oriental Luxe ulduzundan çıxırdı və «Masa» sözü olan şablonlarda təkrar
   yaranırdı. Bu test bölmə qaydasını və şrift kiçilməsini qoruyur.
   ───────────────────────────────────────────────────────────────────────── */
import { tableParts, tableFontPx } from '../src/templates/_shared/tableBadge.js'

let fail = 0
let n = 0
const eq = (name, got, exp) => {
  n++
  const ok = JSON.stringify(got) === JSON.stringify(exp)
  if (!ok) { fail++; console.log(`  FAIL ${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(exp)}`) }
}

eq('Masa 4', tableParts('Masa 4'), { num: '4', full: 'Masa 4', hasWord: true })
eq('masa12 (boşluqsuz)', tableParts('masa12').num, '12')
eq('MASA № 7', tableParts('MASA № 7').num, '7')
eq('Table 3', tableParts('Table 3').num, '3')
eq('Стол 5', tableParts('Стол 5').num, '5')
eq('Masa: 9', tableParts('Masa: 9').num, '9')
eq('Masa A1', tableParts('Masa A1'), { num: 'A1', full: 'Masa A1', hasWord: true })
eq('yalnız rəqəm', tableParts('12'), { num: '12', full: '12', hasWord: false })
eq('VIP', tableParts('VIP'), { num: 'VIP', full: 'VIP', hasWord: false })
eq('uzun ad toxunulmur', tableParts('Bəy tərəfinin qohumları'), { num: 'Bəy tərəfinin qohumları', full: 'Bəy tərəfinin qohumları', hasWord: false })
eq('«Masa» + uzun ad bölünmür', tableParts('Masa gəlin tərəfi').hasWord, false)
eq('Masalar (söz ortası deyil)', tableParts('Masalar').num, 'Masalar')
eq('boş', tableParts(undefined), { num: '', full: '', hasWord: false })
eq('rəqəm tipi', tableParts(4).num, '4')

eq('qısa → dizayn ölçüsü', tableFontPx('12', 50), 50)
eq('3 simvol → dizayn ölçüsü', tableFontPx('VIP', 50), 50)
eq('uzun → kiçilir', tableFontPx('Bəy tərəfinin qohumları', 50) < 25, true)
eq('minimum', tableFontPx('x'.repeat(80), 50), 16)
eq('emoji bir simvol sayılır', tableFontPx('🌹🌹', 50), 50)

console.log(fail === 0 ? `Masa nişanı: ${n} yoxlama, hamısı keçdi` : `\n${fail} / ${n} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
