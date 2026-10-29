/* SNOW GLOBE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NIGHT: '#1E3A5F', NIGHT_L: '#2C4F7C', NIGHT_D: '#142842', ICE: '#DCEBF7', FROST: '#F2F7FB', SNOW: '#FFFFFF',
  PINE: '#2E6B4F', PINE_L: '#3F8A66', RED: '#C8303C', RED_D: '#9C2230', GOLD: '#E2B65C', WOOD: '#8A5A3A', KRAFT: '#D9B98C',
  INK: '#1B2B40', MUTED: '#6B7A8E', LINE: '#D6E2EE',
}

export const NIGHT_BG = `radial-gradient(70% 45% at 50% 0%, rgba(220,235,247,.18), transparent 70%), linear-gradient(180deg, #2C4F7C, #1E3A5F 55%, #142842)`
export const FROST_BG = `radial-gradient(60% 40% at 50% 0%, #FFFFFF, transparent 70%), #F2F7FB`
export const BAUBLES = ['#C8303C', '#E2B65C', '#3F8A66', '#4C7CC4']

/* Qar dənələri — sabit toxumlu LCG */
let seed = 53
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const FLAKES = Array.from({ length: 36 }, () => ({ x: 8 + rnd() * 84, s: 2 + rnd() * 3.5, d: rnd() * 3, dur: 2.6 + rnd() * 2.4, dx: (rnd() - 0.5) * 24 }))
export const SKY_FLAKES = Array.from({ length: 26 }, () => ({ x: rnd() * 100, s: 2 + rnd() * 4, d: rnd() * 5, dur: 6 + rnd() * 6, dx: (rnd() - 0.5) * 60 }))

/* Ad uzunluğuna görə ölçü (Pacifico) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(40px, 12vw, 56px)'
  if (n <= 18) return 'clamp(32px, 9.6vw, 44px)'
  if (n <= 26) return 'clamp(26px, 7.6vw, 34px)'
  return 'clamp(22px, 6.2vw, 28px)'
}
