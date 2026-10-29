/* CAPS TOSS — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NAVY: '#14213D', NAVY_L: '#1F3160', NAVY_D: '#0C1529', GOLD: '#E5B94E', GOLD_L: '#F6DC92', GOLD_D: '#B38A2C',
  IVORY: '#F7F4EC', PARCH: '#F1E8D2', INK: '#14213D', MUTED: '#6B7590', RED: '#B3263A',
}

export const GOLD_GRAD = 'linear-gradient(160deg, #B38A2C 0%, #F6DC92 35%, #E5B94E 60%, #FFF0BF 75%, #B38A2C 100%)'
export const NAVY_BG = `radial-gradient(70% 45% at 50% 0%, rgba(229,185,78,.16), transparent 70%), linear-gradient(180deg, #1F3160, #14213D 60%, #0C1529)`
export const IVORY_BG = `radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), #F7F4EC`

/* Konfetti — sabit toxumlu LCG (render saf qalsın) */
let seed = 7
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const CONFETTI = Array.from({ length: 34 }, () => ({
  x: rnd() * 100, d: 0.2 + rnd() * 0.6, s: 5 + rnd() * 7, r: rnd() * 360, dx: (rnd() - 0.5) * 60, dur: 1.4 + rnd() * 1.2,
  c: ['#E5B94E', '#F6DC92', '#FFFFFF', '#B3263A'][Math.floor(rnd() * 4)],
}))

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(52px, 16vw, 76px)'
  if (n <= 14) return 'clamp(40px, 12vw, 56px)'
  if (n <= 22) return 'clamp(31px, 9vw, 43px)'
  return 'clamp(25px, 7vw, 34px)'
}
