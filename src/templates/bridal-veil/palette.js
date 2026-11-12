/* GƏLİN — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  AG: '#FFFFFF', TUL: '#F3F2F0', SEDEF: '#E9DFDA', GUL: '#B98F86', KOMUR: '#2C2627', BOZ: '#857A79',
}

/* Ad uzunluğuna görə ölçü (Corinthia) */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(66px, 19.5vw, 104px)' : 'clamp(56px, 16.5vw, 88px)'
  if (n <= 18) return big ? 'clamp(52px, 14.5vw, 76px)' : 'clamp(46px, 12.8vw, 64px)'
  return big ? 'clamp(40px, 11vw, 56px)' : 'clamp(36px, 9.8vw, 48px)'
}
