/* ─────────────────────────────────────────────────────────────────────────────
   GERİ SAYIM ETİKETLƏRİ TESTİ (Phase 45.2)

   Xəta: RU-da etiket sabit idi — «72 ДНЕЙ», «1 ДНЕЙ», «2 ЧАСОВ».
   Rus dilində say ilə uzlaşma: 1 день · 2–4 дня · 5+ дней (11–14 → дней).
   EN-də «1 Days» da eyni xətadır. AZ-da isim saya görə dəyişmir.

   İşə salmaq: node tests/countdown_labels_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import * as cd from '../src/utils/countdownLabels.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)

const labels = cd.countdownLabels
ok('countdownLabels export olunur', typeof labels === 'function')

if (typeof labels === 'function') {
  const ru = (days, hours) => labels('ru', { days, hours })
  for (const [n, w] of [[1, 'День'], [21, 'День'], [101, 'День'], [2, 'Дня'], [3, 'Дня'], [4, 'Дня'], [22, 'Дня'], [72, 'Дня'],
                        [0, 'Дней'], [5, 'Дней'], [11, 'Дней'], [12, 'Дней'], [14, 'Дней'], [111, 'Дней'], [112, 'Дней']]) {
    eq(`RU ${n} gün → ${w}`, ru(n, 5).days, w)
  }
  for (const [n, w] of [[1, 'Час'], [21, 'Час'], [2, 'Часа'], [4, 'Часа'], [23, 'Часа'], [0, 'Часов'], [5, 'Часов'], [11, 'Часов'], [12, 'Часов']]) {
    eq(`RU ${n} saat → ${w}`, ru(5, n).hours, w)
  }
  eq('RU dəqiqə qısaltması dəyişmir', ru(5, 5).minutes, 'Мин.')
  eq('RU saniyə qısaltması dəyişmir', ru(5, 5).seconds, 'Сек.')

  eq('EN 1 gün → Day', labels('en', { days: 1, hours: 3 }).days, 'Day')
  eq('EN 2 gün → Days', labels('en', { days: 2, hours: 3 }).days, 'Days')
  eq('EN 0 gün → Days', labels('en', { days: 0, hours: 3 }).days, 'Days')

  const az = labels('az', { days: 1, hours: 2 })
  eq('AZ gün dəyişmir', az.days, 'Gün')
  eq('AZ saat dəyişmir', az.hours, 'Saat')
  eq('naməlum dil → AZ', labels('xx', { days: 3, hours: 3 }).days, 'Gün')
}

if (fail) { console.log(`\n${fail} FAIL`); process.exit(1) }
console.log('countdown_labels: hamısı keçdi')
