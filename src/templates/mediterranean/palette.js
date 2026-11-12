/* MEDITERRANEAN — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { BG: '#FBF8F1', BG2: '#F1E7D3', INK: '#1E3348', ACCENT: '#1F5FA6', MUTE: '#5A6B7A' }

/* Ad uzunluğuna görə ölçü */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(48px, 14vw, 66px)' : 'clamp(40px, 11.5vw, 54px)'
  if (n <= 18) return big ? 'clamp(40px, 11.5vw, 54px)' : 'clamp(33px, 9.4vw, 44px)'
  return big ? 'clamp(33px, 9.4vw, 44px)' : 'clamp(27px, 7.8vw, 36px)'
}
