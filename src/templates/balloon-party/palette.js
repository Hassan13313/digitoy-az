/* BALLOON PARTY — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { BG: '#FFF8F3', BG2: '#FDEDEE', INK: '#4A3046', ACCENT: '#C9577C', MUTE: '#7E6676', PEACH: '#F2A98A', GOLD: '#D8A64A', PINK: '#E58FB0' }

/* Ad uzunluğuna görə ölçü */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(48px, 14vw, 66px)' : 'clamp(40px, 11.5vw, 54px)'
  if (n <= 18) return big ? 'clamp(40px, 11.5vw, 54px)' : 'clamp(33px, 9.4vw, 44px)'
  return big ? 'clamp(33px, 9.4vw, 44px)' : 'clamp(27px, 7.8vw, 36px)'
}
