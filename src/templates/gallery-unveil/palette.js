/* GALLERY UNVEIL — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  WALL: '#EEEDEA', WALL_L: '#F7F6F3', INK: '#171717', MUTED: '#77746E', LINE: '#D9D6CF',
  PLUM: '#5A1F3A', PLUM_L: '#7C2E52', PLUM_D: '#3E1227', GOLD: '#C8A55A', GOLD_L: '#EBD49A', OCHRE: '#D69A3C', TEAL: '#2F6B6A', CHAR: '#1C1B1A',
}

export const GOLD_GRAD = (C) => (`linear-gradient(160deg, #A6853B 0%, #EBD49A 35%, ${C.GOLD} 60%, #F3E2B4 75%, #A6853B 100%)`)
/* Divar + yuxarıdan işıq */
export const WALL_BG = `radial-gradient(46% 38% at 50% 0%, rgba(255,250,235,.95), transparent 75%), linear-gradient(180deg, #F2F1EE, #E6E4DF)`
export const CHAR_BG = `radial-gradient(60% 40% at 50% 0%, rgba(235,212,154,.12), transparent 70%), linear-gradient(180deg, #232120, #1C1B1A)`
/* Məxmər örtük — qırışlar */
export const VELVET = (C) => (`repeating-linear-gradient(90deg, rgba(0,0,0,.28) 0 6%, rgba(255,255,255,.06) 9%, rgba(0,0,0,.18) 13%, rgba(0,0,0,.3) 16%), linear-gradient(180deg, #7C2E52, ${C.PLUM} 60%, #3E1227)`)

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(44px, 13.4vw, 62px)'
  if (n <= 18) return 'clamp(35px, 10.4vw, 48px)'
  if (n <= 26) return 'clamp(29px, 8.4vw, 38px)'
  return 'clamp(24px, 6.6vw, 31px)'
}
