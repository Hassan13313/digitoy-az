/* XONÇA — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  WALNUT: '#22120B', WALNUT_L: '#341C11', COPPER: '#B8683A', COPPER_L: '#E3A06C', COPPER_D: '#7E3F1E',
  BRASS: '#D9A54A', FLAME: '#FFD27A', CREAM: '#FFF1D6', IVORY: '#F6EAD8', IVORY_D: '#EAD7BC',
  RIBBON: '#A51E2C', HENNA: '#7A3B17', LEAF: '#55703C', INK: '#2B1A10', MUTED: '#7A5F4C', SAND: '#D9C1A0',
}

/* Mis səth — xonçanın üzü */
export const COPPER_FACE = 'radial-gradient(ellipse at 40% 35%, #F2B987 0%, #C97B48 32%, #9C552B 66%, #6E3418 100%)'

/* Xonçanın üstündəki şamlar: x, y (svg 300×230), hündürlük, yanma ardıcıllığı */
export const CANDLES = [
  { x: 58, y: 166, h: 44, d: 0.15 },
  { x: 100, y: 150, h: 58, d: 0.35 },
  { x: 150, y: 143, h: 70, d: 0.0 },
  { x: 200, y: 150, h: 58, d: 0.45 },
  { x: 242, y: 166, h: 44, d: 0.25 },
  { x: 92, y: 196, h: 38, d: 0.55 },
  { x: 208, y: 196, h: 38, d: 0.65 },
]

/* Şəkərbura / paxlava kimi şirniyyatlar */
export const SWEETS = [
  { x: 124, y: 186, c: '#F1D9A8' }, { x: 176, y: 186, c: '#E9C98D' },
  { x: 150, y: 202, c: '#F4DFB4' }, { x: 128, y: 205, c: '#C98A5A' }, { x: 172, y: 205, c: '#C98A5A' },
]

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(58px, 18vw, 84px)'
  if (n <= 10) return 'clamp(46px, 13.5vw, 66px)'
  if (n <= 16) return 'clamp(36px, 10vw, 52px)'
  return 'clamp(28px, 8vw, 40px)'
}
