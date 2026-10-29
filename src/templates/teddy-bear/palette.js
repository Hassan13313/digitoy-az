/* TEDDY BEAR — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  CREAM: '#FBF5EC', OAT: '#F2E8DA', HONEY: '#C99A6B', HONEY_D: '#8E6440', HONEY_L: '#E6C49E',
  SKY: '#BFD9EA', SKY_D: '#7FAAC8', BLUSH: '#F2CFCF', BLUSH_D: '#D99A9A', SAGE: '#CFE0CB', INK: '#5B4332', MUTED: '#8F7765',
}

/* Toxuma (trikotaj) — kiçik «V» ilmələr */
const knit = (color, op) => `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='12' viewBox='0 0 14 12'><path d='M1 1l6 9 6-9' fill='none' stroke='${color}' stroke-opacity='${op}' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg>`
export const KNIT = (C) => ((color = C.HONEY_D, op = 0.1) => `url("data:image/svg+xml,${encodeURIComponent(knit(color, op))}")`)

/* Bayraqcıqlar (girlyanda) */
export const BUNTING = (C) => ([C.SKY, C.BLUSH, '#F2E2B8', '#CFE0CB', '#E6C49E', C.SKY, C.BLUSH, '#CFE0CB'])

/* Ad uzunluğuna görə ölçü (Comfortaa) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(46px, 14vw, 64px)'
  if (n <= 10) return 'clamp(36px, 10.4vw, 48px)'
  if (n <= 16) return 'clamp(28px, 7.8vw, 36px)'
  return 'clamp(22px, 6vw, 28px)'
}
