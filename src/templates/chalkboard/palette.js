/* CHALKBOARD — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  BOARD: '#26453D', BOARD_D: '#1A322C', WOOD: '#9A6A42', WOOD_D: '#6E4628', CHALK: '#F3F0E6', CHALK_DIM: 'rgba(243,240,230,.62)',
  YELLOW: '#F5DE7A', PINK: '#F3A9B9', BLUE: '#A3D5E8', PAPER: '#F6F2E8', INK: '#26453D', MUTED: '#6F7A72', LINE: '#DDD6C6',
}

/* Lövhə — təbaşir ləkələri ilə */
export const BOARD_BG = `radial-gradient(40% 30% at 22% 28%, rgba(255,255,255,.07), transparent 70%), radial-gradient(35% 25% at 78% 70%, rgba(255,255,255,.06), transparent 70%), radial-gradient(60% 40% at 50% 110%, rgba(255,255,255,.05), transparent 70%), linear-gradient(180deg, #2A4B42, #22403A)`
export const PAPER_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFDF6, transparent 70%), ${C.PAPER}`)

/* Təbaşir fakturası — səs-küy maskası */
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3 0 0 0 -.55'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")"
export const chalky = { maskImage: NOISE, WebkitMaskImage: NOISE, maskSize: '120px 120px', WebkitMaskSize: '120px 120px' }

/* Ad uzunluğuna görə ölçü (Amatic SC — dar şrift) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(76px, 24vw, 108px)'
  if (n <= 14) return 'clamp(58px, 18vw, 82px)'
  if (n <= 22) return 'clamp(44px, 13vw, 60px)'
  return 'clamp(34px, 10vw, 46px)'
}
