/* NOVRUZ BONFIRE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NIGHT: '#1A1230', NIGHT_L: '#2A1E4A', NIGHT_D: '#100A20', EMBER: '#FF7A1A', FLAME: '#FFC23D', RED: '#D93B2B',
  GREEN: '#5B9A3C', CREAM: '#FBF3E4', PAPER: '#F6ECDA', INK: '#2A1A14', MUTED: '#85705F', WOOD: '#6B3E22',
}

export const NIGHT_BG = `radial-gradient(1.4px 1.4px at 12% 18%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 32% 8%, #fff 50%, transparent 51%), radial-gradient(1.6px 1.6px at 58% 14%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 76% 26%, #fff 50%, transparent 51%), radial-gradient(1.3px 1.3px at 88% 10%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 46% 30%, #fff 50%, transparent 51%), linear-gradient(180deg, #100A20, #1A1230 55%, #2A1E4A)`
export const EMBER_BG = `radial-gradient(70% 45% at 50% 100%, rgba(255,122,26,.30), transparent 70%), linear-gradient(180deg, #1A1230, #241838)`
export const PAPER_BG = `radial-gradient(90% 60% at 50% 0%, #FFFAF0, transparent 70%), #F6ECDA`
export const FIRE_GRAD = 'linear-gradient(180deg, #FFE08A, #FFC23D 35%, #FF7A1A 70%, #D93B2B)'

/* Qığılcımlar — sabit toxumlu LCG */
let seed = 23
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const SPARKS = Array.from({ length: 18 }, () => ({ x: 30 + rnd() * 40, s: 2 + rnd() * 3, d: rnd() * 2.4, dur: 1.8 + rnd() * 1.6, dx: (rnd() - 0.5) * 60 }))

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(44px, 13.4vw, 62px)'
  if (n <= 18) return 'clamp(36px, 10.6vw, 48px)'
  if (n <= 26) return 'clamp(29px, 8.4vw, 38px)'
  return 'clamp(24px, 6.6vw, 31px)'
}
