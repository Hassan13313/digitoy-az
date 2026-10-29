/* LAST BELL — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  WHITE: '#FFFFFF', SNOW: '#F5F6F9', NAVY: '#1C2A4A', NAVY_D: '#121C33', RED: '#C8102E', RED_D: '#930B21',
  GOLD: '#E2BD6A', GOLD_L: '#F7E2A8', BRASS: '#C9A04A', WOOD: '#7A4B2A', INK: '#1C2A4A', MUTED: '#6A7387', LINE: '#E1E5EE',
}

export const SASH = (C) => (`linear-gradient(180deg, #E0213F 0%, ${C.RED} 45%, #A50D26 100%)`)
export const GOLD_GRAD = (C) => (`linear-gradient(160deg, #B8913E 0%, #F7E2A8 40%, ${C.GOLD} 62%, #B8913E 100%)`)
/* Dama-dama dəftər vərəqi */
export const GRID_BG = (C) => (`linear-gradient(rgba(28,42,74,.06) 1px, transparent 1px) 0 0 / 22px 22px, linear-gradient(90deg, rgba(28,42,74,.06) 1px, transparent 1px) 0 0 / 22px 22px, ${C.WHITE}`)
export const NAVY_BG = (C) => (`radial-gradient(70% 50% at 50% 0%, rgba(226,189,106,.14), transparent 70%), linear-gradient(180deg, #22325A, ${C.NAVY})`)

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(52px, 16vw, 74px)'
  if (n <= 14) return 'clamp(40px, 12vw, 56px)'
  if (n <= 22) return 'clamp(31px, 9vw, 43px)'
  return 'clamp(25px, 7vw, 34px)'
}
