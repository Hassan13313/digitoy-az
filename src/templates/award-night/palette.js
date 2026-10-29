/* AWARD NIGHT — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  WINE: '#4E0D1A', WINE_D: '#2A060E', CARPET: '#8A1426', GOLD: '#E1B54E', GOLD_L: '#F6DD95', GOLD_D: '#A07A22',
  CREAM: '#F7EEDC', INK: '#1B0A0E', MUTED: '#CDB1A8', FAINT: '#8E6F69',
}

export const GOLD_GRAD = 'linear-gradient(160deg, #A07A22 0%, #F6DD95 40%, #E1B54E 60%, #8C6618 100%)'
export const BRASS = 'linear-gradient(180deg, #F3D98E 0%, #D9AE4A 45%, #B98C2C 55%, #E6C470 100%)'
export const VELVET = `repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 3%, rgba(255,255,255,.03) 6%, rgba(0,0,0,.14) 10%), radial-gradient(90% 60% at 50% 0%, #6E1426, ${C.WINE} 50%, ${C.WINE_D})`

/* Ad uzunluğuna görə ölçü (Cormorant SC) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(46px, 14vw, 64px)'
  if (n <= 14) return 'clamp(38px, 11vw, 52px)'
  if (n <= 22) return 'clamp(30px, 8.6vw, 42px)'
  return 'clamp(24px, 6.6vw, 32px)'
}
