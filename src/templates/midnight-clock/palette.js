/* MIDNIGHT CLOCK — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  MIDNIGHT: '#0E1430', MIDNIGHT_L: '#1A2350', MIDNIGHT_D: '#080C20', GOLD: '#E8C46A', GOLD_L: '#F8E6B0', GOLD_D: '#B08F3A',
  CHAMPAGNE: '#F6E7C1', SILVER: '#C8CEDB', ROSE: '#F2A6B8', IVORY: '#F7F4EC', INK: '#151B38', MUTED: '#7A809A', LINE: '#E2DECF',
}

export const GOLD_GRAD = (C) => (`linear-gradient(160deg, ${C.GOLD_D} 0%, #F8E6B0 35%, ${C.GOLD} 60%, #FFF3CF 74%, ${C.GOLD_D} 100%)`)
export const NIGHT_BG = (C) => (`radial-gradient(1.4px 1.4px at 10% 20%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 26% 8%, #fff 50%, transparent 51%), radial-gradient(1.6px 1.6px at 70% 12%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 84% 30%, #fff 50%, transparent 51%), radial-gradient(1.2px 1.2px at 50% 26%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 92% 6%, #fff 50%, transparent 51%), radial-gradient(70% 45% at 50% 0%, rgba(232,196,106,.14), transparent 70%), linear-gradient(180deg, #1A2350, ${C.MIDNIGHT} 60%, #080C20)`)
export const IVORY_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), ${C.IVORY}`)

/* Atəşfəşanlıq partlayışları */
export const BURSTS = (C) => ([
  { x: 20, y: 16, c: C.GOLD, d: 0.95, s: 300 },
  { x: 80, y: 12, c: '#F2A6B8', d: 1.05, s: 260 },
  { x: 66, y: 40, c: '#C8CEDB', d: 1.2, s: 220 },
  { x: 28, y: 46, c: '#F8E6B0', d: 1.3, s: 200 },
])

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(46px, 14vw, 64px)'
  if (n <= 18) return 'clamp(38px, 11vw, 50px)'
  if (n <= 26) return 'clamp(30px, 8.6vw, 40px)'
  return 'clamp(25px, 6.8vw, 32px)'
}
