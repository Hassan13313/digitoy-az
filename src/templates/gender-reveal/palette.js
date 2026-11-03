/* GENDER REVEAL — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  PINK: '#F49AC1', PINK_D: '#E0659C', PINK_L: '#FCDDEA', BLUE: '#7DB9F0', BLUE_D: '#3F8CD8', BLUE_L: '#D6EAFC',
  CREAM: '#FFFBF7', GOLD: '#E9C46A', GOLD_D: '#C79A2C', INK: '#33365C', MUTED: '#6E7091',
}

/* Yarı çəhrayı, yarı mavi */
export const SPLIT = (C) => ((a = C.BLUE_L, b = C.PINK_L, deg = 115) => `linear-gradient(${deg}deg, ${a} 0 50%, ${b} 50% 100%)`)


/* Qutudan uçan şarlar: x (px, mərkəzə görə), rəng, gecikmə, ölçü */
export const RELEASE = [
  [-90, 'blue', 0.0, 54], [-40, 'pink', 0.08, 62], [10, 'blue', 0.14, 58], [60, 'pink', 0.05, 66],
  [105, 'blue', 0.2, 50], [-120, 'pink', 0.25, 48], [-10, 'pink', 0.3, 46], [130, 'pink', 0.12, 44],
]

/* Konfetti */
export function seeded(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}
export const CONFETTI = (C) => ((() => {
  const r = seeded(31)
  const cols = [C.PINK, '#7DB9F0', C.GOLD, '#FFFFFF']
  return Array.from({ length: 30 }, (_, i) => ({ x: (r() - 0.5) * 340, y: -80 - r() * 300, rot: Math.round(r() * 360), c: cols[i % 4], d: (r() * 0.3).toFixed(2), w: 6 + r() * 6 }))
})())

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(46px, 14vw, 64px)'
  if (n <= 10) return 'clamp(36px, 10.6vw, 50px)'
  if (n <= 16) return 'clamp(28px, 8vw, 38px)'
  return 'clamp(22px, 6vw, 28px)'
}
