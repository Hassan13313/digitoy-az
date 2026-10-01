import t from '../data/translations.js'

/* ─────────────────────────────────────────────────────────────────────────────
   Geri sayım etiketləri — saya görə (Phase 45.2).

   Əvvəl etiket sabit idi: RU-da «72 ДНЕЙ», EN-də «1 DAYS». AZ-da isim saya
   görə dəyişmir, ona görə translations.js-dəki dəyər olduğu kimi qalır.
   Dəqiqə/saniyə bütün dillərdə qısaltmadır — saya görə dəyişmir.
   ───────────────────────────────────────────────────────────────────────── */

/* 1 день · 2–4 дня · 5+ дней; 11–14 həmişə «дней» */
function ruForm(n, [one, few, many]) {
  const d10 = n % 10, d100 = n % 100
  if (d10 === 1 && d100 !== 11) return one
  if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return few
  return many
}

const PLURAL = {
  ru: {
    days:  (n) => ruForm(n, ['День', 'Дня', 'Дней']),
    hours: (n) => ruForm(n, ['Час', 'Часа', 'Часов']),
  },
  en: {
    days: (n) => (n === 1 ? 'Day' : 'Days'),
  },
}

/** @returns {{ days, hours, minutes, seconds }} cari saya uyğun etiketlər */
export function countdownLabels(lang, { days, hours }) {
  const tr = t[lang] || t.az
  const p = PLURAL[lang] || {}
  return {
    days:    p.days  ? p.days(days)   : tr.inv_days,
    hours:   p.hours ? p.hours(hours) : tr.inv_hours,
    minutes: tr.inv_minutes,
    seconds: tr.inv_seconds,
  }
}
