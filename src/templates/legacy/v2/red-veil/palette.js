/* RED VEIL — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  WINE: '#3E0911', VELVET: '#7E1626', CRIMSON: '#8E1B2B', RED: '#B3283A',
  GOLD: '#D4A64A', GOLD_L: '#F0D48C', GOLD_D: '#9C7428',
  IVORY: '#F8EEE2', IVORY_D: '#EFE0CD', INK: '#2A1014', MUTED: '#76524C',
}

/* Məxmər örpək: dərin qırmızı + yumşaq qıvrımlar */
export const VELVET_BG = (C) => ([
  'repeating-linear-gradient(90deg, rgba(0,0,0,.20) 0%, rgba(255,255,255,.045) 5%, rgba(0,0,0,.16) 11%, rgba(0,0,0,.05) 16%, rgba(0,0,0,.20) 22%)',
  `radial-gradient(120% 80% at 50% 0%, ${C.RED} 0%, ${C.VELVET} 48%, ${C.WINE} 100%)`,
].join(', '))

/* Örpəyin üstündəki qızılı tikmə — kiçik butalar şəbəkəsi (data URI) */
const BUTA_D = 'M12 38c-7 0-11-6-11-12 0-9 8-15 13-19 2-2 4-3 6-2 2 2-1 4-2 5 4 4 6 10 6 15 0 8-5 13-12 13z'
const butaSvg = (color, op) => `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='80' viewBox='0 0 64 80'>${
  [[6, 0, 0], [38, 40, 0]].map(([x, y]) => `<g transform='translate(${x} ${y})' fill='none' stroke='${color}' stroke-opacity='${op}' stroke-width='1.1'><path d='${BUTA_D}'/><circle cx='12' cy='26' r='2' fill='${color}' fill-opacity='${op}' stroke='none'/></g>`).join('')
}<g fill='${color}' fill-opacity='${op}'><circle cx='52' cy='14' r='1.3'/><circle cx='20' cy='60' r='1.3'/></g></svg>`
export const VEIL_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(butaSvg('#F0D48C', 0.16))}")`
export const IVORY_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(butaSvg('#9C7428', 0.08))}")`

/* Ad uzunluğuna görə yazı ölçüsü (Great Vibes) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(64px, 20vw, 96px)'
  if (n <= 10) return 'clamp(52px, 15vw, 76px)'
  if (n <= 16) return 'clamp(40px, 11vw, 58px)'
  return 'clamp(32px, 8.6vw, 44px)'
}
