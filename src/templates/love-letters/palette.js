/* LOVE LETTERS — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { BG: '#EFE6D8', BG2: '#F7F1E7', INK: '#2F3550', ACCENT: '#A9666A', MUTE: '#5F6278' }

/* Ad uzunluğuna görə ölçü */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(54px, 16vw, 74px)' : 'clamp(44px, 13vw, 58px)'
  if (n <= 18) return big ? 'clamp(44px, 13vw, 58px)' : 'clamp(36px, 10.5vw, 48px)'
  return big ? 'clamp(36px, 10.5vw, 48px)' : 'clamp(30px, 8.6vw, 40px)'
}
