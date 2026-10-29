/* DISCO BALL — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NIGHT: '#140B2E', NIGHT_L: '#24154D', NIGHT_D: '#0B0619', MAGENTA: '#FF3EA5', MAGENTA_D: '#C21F7A', GOLD: '#FFC94A', LILAC: '#B69CFF',
  SILVER: '#D8DCE6', LIGHT: '#FBF1FF', INK: '#22123F', MUTED: '#7D6D99', LINE: '#EADDF7',
}

export const CHROME = 'linear-gradient(180deg, #FFFFFF 0%, #E6E9F2 38%, #8C93A8 50%, #F4F6FB 56%, #B8BED0 80%, #FFFFFF 100%)'
export const HOT = 'linear-gradient(90deg, #FF3EA5, #FFC94A)'
export const NIGHT_BG = `radial-gradient(60% 40% at 50% 0%, rgba(182,156,255,.28), transparent 70%), radial-gradient(70% 40% at 50% 100%, rgba(255,62,165,.22), transparent 70%), linear-gradient(180deg, #24154D, #140B2E 55%, #0B0619)`
export const LIGHT_BG = `radial-gradient(60% 40% at 80% 0%, rgba(255,201,74,.18), transparent 70%), radial-gradient(60% 40% at 10% 100%, rgba(255,62,165,.12), transparent 70%), #FBF1FF`
/* 70-ci illər gün şüası (pol) */
export const SUNBURST = 'repeating-conic-gradient(from 0deg at 50% 0%, rgba(255,62,165,.28) 0 6deg, rgba(255,201,74,.18) 6deg 12deg, transparent 12deg 18deg)'

/* İşıq ləkələri — sabit toxumlu LCG */
let seed = 83
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const SPOTS = Array.from({ length: 42 }, () => ({ x: rnd() * 100, y: rnd() * 100, s: 4 + rnd() * 8, c: ['#FFFFFF', '#FF3EA5', '#FFC94A', '#B69CFF'][Math.floor(rnd() * 4)] }))

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(58px, 18vw, 84px)'
  if (n <= 14) return 'clamp(44px, 13vw, 62px)'
  if (n <= 22) return 'clamp(34px, 10vw, 46px)'
  return 'clamp(27px, 7.6vw, 36px)'
}
