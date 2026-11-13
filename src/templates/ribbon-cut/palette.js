/* RIBBON CUT — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { BG: '#F7F2E6', BG2: '#EFE8D6', INK: '#13281F', ACCENT: '#B8903E', MUTE: '#5A6B62', EMERALD: '#0F3D30' }

/* Ad uzunluğuna görə ölçü */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(40px, 12vw, 56px)' : 'clamp(34px, 10vw, 46px)'
  if (n <= 18) return big ? 'clamp(32px, 9.4vw, 44px)' : 'clamp(28px, 8vw, 38px)'
  return big ? 'clamp(26px, 7.6vw, 36px)' : 'clamp(22px, 6.4vw, 30px)'
}
