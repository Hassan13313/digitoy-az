/* MASQUERADE BALL — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  BLACK: '#0D0A10', PLUM: '#3A1030', PLUM_L: '#5A1C4A', PLUM_D: '#22091C', GOLD: '#D9B25F', GOLD_L: '#F4DC9C', GOLD_D: '#A6822F',
  CRIMSON: '#9E1B32', IVORY: '#F5EEE3', INK: '#1A1218', MUTED: '#7B6E76', LINE: '#E2D6C6',
}

export const GOLD_GRAD = 'linear-gradient(160deg, #A6822F 0%, #F4DC9C 35%, #D9B25F 58%, #FFF0C4 72%, #A6822F 100%)'
export const VELVET = `repeating-linear-gradient(90deg, rgba(0,0,0,.35) 0 4%, rgba(255,255,255,.05) 7%, rgba(0,0,0,.2) 10%, rgba(0,0,0,.4) 13%), linear-gradient(180deg, #5A1C4A, #3A1030 60%, #22091C)`
export const BALL_BG = `radial-gradient(50% 36% at 50% 22%, rgba(244,220,156,.28), transparent 70%), radial-gradient(80% 60% at 50% 100%, rgba(90,28,74,.6), transparent 70%), linear-gradient(180deg, #1A0E18, #0D0A10)`
export const IVORY_BG = `radial-gradient(90% 60% at 50% 0%, #FFFDF8, transparent 70%), #F5EEE3`

/* Qızılı toz — sabit toxumlu LCG */
let seed = 67
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const DUST = Array.from({ length: 30 }, () => ({ a: rnd() * 360, r: 60 + rnd() * 140, s: 2 + rnd() * 4, d: 0.35 + rnd() * 0.35, dur: 0.9 + rnd() * 0.8 }))

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(40px, 12vw, 56px)'
  if (n <= 18) return 'clamp(32px, 9.6vw, 44px)'
  if (n <= 26) return 'clamp(26px, 7.6vw, 34px)'
  return 'clamp(22px, 6.2vw, 28px)'
}
