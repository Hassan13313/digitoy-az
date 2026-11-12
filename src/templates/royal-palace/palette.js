/* ROYAL PALACE — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { NAVY: '#0E1430', NAVY2: '#141B3A', GOLD: '#D6B76E', IVORY: '#F3ECDD', MUTE: '#AAB0CC' }

/* Ad uzunluğuna görə ölçü (Imperial Script) */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(56px, 17vw, 78px)' : 'clamp(46px, 13.5vw, 62px)'
  if (n <= 18) return big ? 'clamp(46px, 13.5vw, 62px)' : 'clamp(38px, 11vw, 50px)'
  return big ? 'clamp(38px, 11vw, 50px)' : 'clamp(32px, 9vw, 42px)'
}
