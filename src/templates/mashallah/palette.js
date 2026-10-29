/* MAŞALLAH — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  COBALT: '#0D3B8E', COBALT_D: '#082658', TURQ: '#27B0C8', SKY: '#BFE6F0',
  GOLD: '#D6A947', GOLD_L: '#F2D88E', CREAM: '#F6F2E8', WHITE: '#FFFFFF', INK: '#0E1F3D', MUTED: '#56677F',
}

/* Göz muncuğu — konsentrik halqalar (+ şüşə parıltısı ayrıca) */
export const NAZAR = (C) => (`radial-gradient(circle at 50% 50%, #0B0B12 0 15%, #8FD6EA 15.5% 29%, #FFFFFF 29.5% 45%, ${C.COBALT} 45.5% 100%)`)
export const GLASS = 'radial-gradient(60% 45% at 34% 26%, rgba(255,255,255,.75), rgba(255,255,255,0) 60%), radial-gradient(80% 80% at 70% 80%, rgba(0,0,40,.35), transparent 60%)'

/* Atlas lent — «Maşallah» */
export const SASH = (C) => (`linear-gradient(180deg, #1A55B8 0%, ${C.COBALT} 45%, ${C.COBALT_D} 100%)`)
export const SASH_WORD = { az: 'Maşallah', en: 'Mashallah', ru: 'Машаллах' }

/* Krem fonda incə mavi kaşı naxışı */
const tile = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='%230D3B8E' stroke-opacity='.08' stroke-width='1'><path d='M28 4l6 10 10 4-10 4-6 10-6-10-10-4 10-4z'/><circle cx='0' cy='0' r='8'/><circle cx='56' cy='0' r='8'/><circle cx='0' cy='56' r='8'/><circle cx='56' cy='56' r='8'/></g></svg>`
export const TILE = `url("data:image/svg+xml,${tile.replace(/</g, '%3C').replace(/>/g, '%3E')}")`

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(52px, 16vw, 74px)'
  if (n <= 10) return 'clamp(42px, 12vw, 58px)'
  if (n <= 16) return 'clamp(32px, 9vw, 44px)'
  return 'clamp(26px, 7vw, 34px)'
}
