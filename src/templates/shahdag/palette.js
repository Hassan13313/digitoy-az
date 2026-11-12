/* ŞAHDAĞ — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { SNOW: '#F6F7F8', FROST: '#E6EBEF', SLATE: '#1D2833', NIGHT: '#0F1720', AMBER: '#D29A55', MUTE: '#7B8794' }

/* Ad uzunluğuna görə ölçü (Playfair Display SC) */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(40px, 12vw, 58px)' : 'clamp(32px, 10vw, 46px)'
  if (n <= 18) return big ? 'clamp(32px, 10vw, 46px)' : 'clamp(26px, 8vw, 36px)'
  return big ? 'clamp(26px, 8vw, 36px)' : 'clamp(24px, 6.8vw, 28px)'
}
