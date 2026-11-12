/* IVORY SILK — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { SILK: '#EFE7DB', PAPER: '#F8F4EC', INK: '#1F3327', GOLD: '#A6844A', MUTE: '#6F6A5F' }

/* Ad uzunluğuna görə ölçü (Petit Formal Script) */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(46px, 14vw, 64px)' : 'clamp(38px, 11vw, 52px)'
  if (n <= 18) return big ? 'clamp(38px, 11vw, 52px)' : 'clamp(32px, 9vw, 42px)'
  return big ? 'clamp(32px, 9vw, 42px)' : 'clamp(26px, 7.6vw, 34px)'
}
