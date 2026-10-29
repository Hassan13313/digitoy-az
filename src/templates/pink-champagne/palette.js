/* PINK CHAMPAGNE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  BLUSH: '#F9E3E7', BLUSH_D: '#F1C7D0', ROSE: '#E3778F', ROSE_D: '#C25470', WINE: '#5C1A2B', WINE_D: '#3E0F1C',
  GOLD: '#E2BE78', GOLD_L: '#F6E2B4', CREAM: '#FFF8F3', INK: '#3A1622', MUTED: '#8E6B75', LINE: '#F0D3DA',
}

export const GOLD_GRAD = 'linear-gradient(160deg, #B8924A 0%, #F6E2B4 38%, #E2BE78 60%, #FFF1CC 74%, #B8924A 100%)'
export const ROSE_GRAD = 'linear-gradient(135deg, #F3A3B5, #E3778F 55%, #C25470)'
export const BLUSH_BG = `radial-gradient(60% 40% at 80% 10%, rgba(255,255,255,.8), transparent 70%), radial-gradient(70% 50% at 10% 90%, rgba(227,119,143,.18), transparent 70%), #F9E3E7`
export const WINE_BG = `radial-gradient(70% 50% at 50% 0%, rgba(227,119,143,.25), transparent 70%), linear-gradient(180deg, #6E2236, #5C1A2B 60%, #3E0F1C)`

/* Qabarcıqlar — sabit toxumlu LCG */
let seed = 71
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const BUBBLES = Array.from({ length: 22 }, () => ({ x: rnd() * 100, s: 6 + rnd() * 18, d: rnd() * 6, dur: 7 + rnd() * 7 }))
export const FOAM = Array.from({ length: 40 }, () => ({ a: -140 + rnd() * 100, r: 70 + rnd() * 230, s: 10 + rnd() * 18, d: 0.2 + rnd() * 0.35, dur: 0.9 + rnd() * 0.7 }))

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(58px, 18vw, 84px)'
  if (n <= 14) return 'clamp(44px, 13vw, 62px)'
  if (n <= 22) return 'clamp(34px, 10vw, 46px)'
  return 'clamp(27px, 7.6vw, 36px)'
}
