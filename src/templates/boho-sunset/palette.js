/* BOHO SUNSET — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  CREAM: '#FBF4EA', SAND: '#F3E6D6', PAMPAS: '#E3CCA6', CLAY: '#C8754F', CLAY_D: '#9C4F31', ROSE: '#D9A08E', MUSTARD: '#D9A441',
  SAGE: '#9AA68A', INK: '#4A2F24', MUTED: '#86695A', LINE: '#E7D3BD', DUSK: '#3A2433', DUSK_L: '#5A3647', KRAFT: '#E6CFAE',
}
export const BANDS = [C.CLAY, C.MUSTARD, C.ROSE, C.SAGE]

export const SKY_DAY = 'linear-gradient(180deg, #F6D2A8 0%, #F4B183 38%, #E07A5F 68%, #B5566A 100%)'
export const SKY_NIGHT = 'radial-gradient(1.2px 1.2px at 20% 18%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 42% 10%, #fff 50%, transparent 51%), radial-gradient(1.4px 1.4px at 66% 22%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 82% 12%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 30% 34%, #fff 50%, transparent 51%), radial-gradient(1.2px 1.2px at 74% 40%, #fff 50%, transparent 51%), linear-gradient(180deg, #2B1B33 0%, #5A3647 60%, #A3586A 100%)'
export const CREAM_BG = 'radial-gradient(60% 40% at 0% 0%, rgba(217,160,142,.22), transparent 70%), radial-gradient(60% 40% at 100% 100%, rgba(154,166,138,.2), transparent 70%), #FBF4EA'
export const DUSK_BG = 'radial-gradient(80% 50% at 50% 110%, rgba(224,122,95,.45), transparent 70%), radial-gradient(1px 1px at 18% 16%, rgba(255,255,255,.8) 50%, transparent 51%), radial-gradient(1px 1px at 76% 10%, rgba(255,255,255,.8) 50%, transparent 51%), radial-gradient(1.2px 1.2px at 60% 26%, rgba(255,255,255,.8) 50%, transparent 51%), linear-gradient(180deg, #2B1B33, #3A2433 50%, #4E2C3B)'

/* Pampas tükləri — sabit toxumlu LCG */
let seed = 211
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const WISPS = Array.from({ length: 54 }, (_, i) => ({ t: i / 53, side: i % 2 ? 1 : -1, len: 8 + rnd() * 8, ang: 14 + rnd() * 36, w: 2.8 + rnd() * 2.2 }))

/* Ad uzunluğuna görə ölçü (Noto Serif, nazik italik) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(52px, 16vw, 74px)'
  if (n <= 14) return 'clamp(40px, 12vw, 56px)'
  if (n <= 22) return 'clamp(32px, 9.4vw, 42px)'
  return 'clamp(26px, 7.4vw, 34px)'
}
