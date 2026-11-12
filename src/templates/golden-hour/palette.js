/* GOLDEN HOUR — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { CREAM: '#FBF4EC', PEACH: '#F2DCC8', SUN: '#C77B45', ROSE: '#B86E5C', INK: '#3A2A22', MUTE: '#8A746A' }

/* Ad uzunluğuna görə ölçü (Mea Culpa) */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(58px, 17vw, 84px)' : 'clamp(48px, 14vw, 66px)'
  if (n <= 18) return big ? 'clamp(48px, 14vw, 66px)' : 'clamp(38px, 11vw, 52px)'
  return big ? 'clamp(38px, 11vw, 52px)' : 'clamp(32px, 9.3vw, 44px)'
}
