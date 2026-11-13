/* PAPER PLANE — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { BG: '#FFFFFF', BG2: '#EEF4FD', INK: '#1B2D4F', ACCENT: '#2F6FDB', MUTE: '#5B6A85', RED: '#E0483E' }

/* Ad uzunluğuna görə ölçü */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(48px, 14vw, 66px)' : 'clamp(40px, 11.5vw, 54px)'
  if (n <= 18) return big ? 'clamp(40px, 11.5vw, 54px)' : 'clamp(33px, 9.4vw, 44px)'
  return big ? 'clamp(33px, 9.4vw, 44px)' : 'clamp(27px, 7.8vw, 36px)'
}
