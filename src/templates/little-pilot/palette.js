/* LITTLE PILOT — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  SKY: '#8DD3F7', SKY_L: '#CDEEFC', SKY_D: '#3B95D6', NAVY: '#18324F', CLOUD: '#FFFFFF',
  RED: '#E5533D', RED_D: '#B83A28', YELLOW: '#FFC845', CREAM: '#FFF9EE', MUTED: '#5C6F85',
}

export const SKY_BG = `linear-gradient(180deg, ${C.SKY_D} 0%, ${C.SKY} 55%, ${C.SKY_L} 100%)`

/* Buludlar: x, y (%), ölçü, sürüşmə müddəti */
export const CLOUDS = [
  { x: -6, y: 10, w: 150, d: 46, o: 0.95 },
  { x: 58, y: 18, w: 120, d: 38, o: 0.85 },
  { x: 18, y: 64, w: 180, d: 52, o: 0.9 },
  { x: 70, y: 74, w: 140, d: 42, o: 0.8 },
  { x: 36, y: 38, w: 90, d: 34, o: 0.6 },
]

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(30px, 9vw, 42px)'
  if (n <= 10) return 'clamp(24px, 7vw, 34px)'
  if (n <= 16) return 'clamp(19px, 5.4vw, 27px)'
  return 'clamp(16px, 4.4vw, 22px)'
}
