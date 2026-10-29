/* NEON PARTY — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  WALL: '#0D0A15', BRICK: '#181222', PANEL: '#1B1428', PINK: '#FF4FD8', CYAN: '#3CF2FF', VIOLET: '#9B5CFF',
  YELLOW: '#FFE45C', WHITE: '#F6F0FF', MUTED: '#A99CC4', FAINT: '#6B5F86', TUBE: '#3A2B4A',
}

/* Kərpic divar (SVG naxış) */
const brick = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='32' viewBox='0 0 64 32'><rect width='64' height='32' fill='%23181222'/><g fill='none' stroke='%23000000' stroke-opacity='.55' stroke-width='2'><path d='M0 1H64M0 17H64M1 1V16M33 17V32'/></g><g fill='%23FFFFFF' fill-opacity='.025'><rect x='3' y='3' width='58' height='12'/><rect x='35' y='19' width='28' height='12'/><rect x='0' y='19' width='31' height='12'/></g></svg>`
export const BRICKS = `url("data:image/svg+xml,${brick.replace(/</g, '%3C').replace(/>/g, '%3E')}") 0 0 / 64px 32px`

/* Neon parıltısı */
export const glow = (c, s = 1) => `0 0 ${2 * s}px #FFFFFF, 0 0 ${6 * s}px ${c}, 0 0 ${14 * s}px ${c}, 0 0 ${28 * s}px ${c}`
export const boxGlow = (c) => `0 0 0 1.5px ${c}, 0 0 10px ${c}, 0 0 24px ${c}88, inset 0 0 12px ${c}66`

/* Ad uzunluğuna görə ölçü (Lobster) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(52px, 16vw, 76px)'
  if (n <= 14) return 'clamp(42px, 12.4vw, 60px)'
  if (n <= 22) return 'clamp(34px, 9.6vw, 46px)'
  return 'clamp(26px, 7.4vw, 36px)'
}
