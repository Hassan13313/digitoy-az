/* SNOW GLOBE — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { BG: '#F3F7FA', BG2: '#E6EEF4', INK: '#1D3346', ACCENT: '#B3202E', MUTE: '#566B7E', GREEN: '#1F6E4A', GOLD: '#D3A84E' }

/* Ad uzunluğuna görə ölçü */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(54px, 16vw, 74px)' : 'clamp(44px, 13vw, 58px)'
  if (n <= 18) return big ? 'clamp(44px, 13vw, 58px)' : 'clamp(36px, 10.5vw, 48px)'
  return big ? 'clamp(36px, 10.5vw, 48px)' : 'clamp(30px, 8.6vw, 40px)'
}
