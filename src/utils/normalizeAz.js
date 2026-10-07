/* Azərbaycan hərfi normalizasiyası — YALNIZ axtarış/uyğunlaşdırma üçün, DB toxunulmur.
   Phase 48: hooks/useSeating.js-dən çıxarıldı (oradan yenə export olunur) ki,
   saf köməkçilər (rsvpTarget) və onların node testləri React/API-siz işlətsin. */
const AZ_MAP = { ş: 's', ə: 'e', ö: 'o', ü: 'u', ğ: 'g', ç: 'c', ı: 'i' }

export function normalizeAz(str) {
  return (str || '')
    .toLocaleLowerCase('az')
    .replace(/[şəöüğçı]/g, (ch) => AZ_MAP[ch] || ch)
    .replace(/\s+/g, ' ')
    .trim()
}
