/* RED VEIL — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { BG: '#24070D', BG2: '#360C15', INK: '#F8EEE2', ACCENT: '#D4A64A', MUTE: '#CDAEA2', VEL: '#8E1B2B', GOLD_L: '#F0D48C' }

/* Ad uzunluğuna görə ölçü */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(54px, 16vw, 74px)' : 'clamp(44px, 13vw, 58px)'
  if (n <= 18) return big ? 'clamp(44px, 13vw, 58px)' : 'clamp(36px, 10.5vw, 48px)'
  return big ? 'clamp(36px, 10.5vw, 48px)' : 'clamp(30px, 8.6vw, 40px)'
}
