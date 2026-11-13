/* BUSINESS CARD — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  DESK: '#E9E7E1', PAPER: '#F4F3EF', WHITE: '#FFFFFF', INK: '#121212', GRAPHITE: '#3A3A3A',
  MUTED: '#76756F', HAIR: '#D6D4CC', KLEIN: '#2438E8', KLEIN_D: '#1A28B0',
}

/* Ad uzunluğuna görə ölçü (Inter Tight) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(52px, 16vw, 76px)'
  if (n <= 14) return 'clamp(42px, 12.4vw, 60px)'
  if (n <= 22) return 'clamp(34px, 9.6vw, 46px)'
  return 'clamp(26px, 7.4vw, 36px)'
}
