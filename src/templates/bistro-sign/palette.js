/* BISTRO SIGN — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  GREEN: '#1F4D3A', GREEN_L: '#2C6650', GREEN_D: '#143628', CREAM: '#F4ECDC', CREAM_L: '#FBF6EC', BRASS: '#C9A04A', BRASS_L: '#EED493',
  WINE: '#7A1F2B', INK: '#1F2A24', MUTED: '#7A786C', LINE: '#E2D8C3', BULB: '#FFD98A',
}

/* Zolaqlı tente */
export const AWNING = (C) => (`repeating-linear-gradient(90deg, ${C.GREEN} 0 28px, ${C.CREAM} 28px 56px)`)
export const GREEN_BG = (C) => (`radial-gradient(70% 50% at 50% 0%, rgba(255,217,138,.16), transparent 70%), linear-gradient(180deg, #24563F, ${C.GREEN} 60%, #143628)`)
export const CREAM_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFDF7, transparent 70%), ${C.CREAM}`)
export const BRASS_GRAD = (C) => (`linear-gradient(160deg, #9C7A2E 0%, #EED493 40%, ${C.BRASS} 62%, #9C7A2E 100%)`)

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(44px, 13.4vw, 62px)'
  if (n <= 18) return 'clamp(36px, 10.6vw, 48px)'
  if (n <= 26) return 'clamp(29px, 8.4vw, 38px)'
  return 'clamp(24px, 6.6vw, 31px)'
}
