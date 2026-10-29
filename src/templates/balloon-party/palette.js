/* BALLOON PARTY — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  CREAM: '#FFF8F3', BLUSH: '#F6C3CF', PINK: '#EF8FA8', PINK_D: '#C9577C', MINT: '#BDE8D7', MINT_D: '#7FC8B0',
  LEMON: '#FFE495', LILAC: '#D6C5F3', SKY: '#BFDCF6', PLUM: '#4A3046', MUTED: '#7D6479', GOLD: '#D8A64A', GOLD_D: '#B9822F',
}

/* Folqa qızılı — şar hərfləri və rəqəm */
export const FOIL = 'linear-gradient(165deg, #FFF4D6 0%, #F2CF7E 22%, #C9913A 46%, #F7E3A3 62%, #D8A64A 80%, #B9822F 100%)'
export const ROSE_FOIL = 'linear-gradient(165deg, #FFE9E3 0%, #F3B9AA 25%, #C9786A 48%, #F8D3C8 64%, #D99A8A 82%, #B5685C 100%)'

export function seeded(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

/* Açılış dəstəsinin şarları: x, y (dəstə mərkəzinə görə), rəng, ölçü, uçuş */
export const BUNCH = [
  { x: 0, y: -150, c: 'gold', s: 1.15, d: 0.0, sway: -8 },
  { x: -70, y: -118, c: '#EF8FA8', s: 1.0, d: 0.12, sway: 10 },
  { x: 72, y: -122, c: '#BDE8D7', s: 1.0, d: 0.06, sway: -12 },
  { x: -112, y: -60, c: '#D6C5F3', s: 0.9, d: 0.2, sway: 14 },
  { x: 112, y: -64, c: '#FFE495', s: 0.92, d: 0.16, sway: -10 },
  { x: -40, y: -64, c: '#BFDCF6', s: 0.95, d: 0.26, sway: 8 },
  { x: 44, y: -60, c: 'rose', s: 0.98, d: 0.1, sway: -6 },
  { x: 0, y: -40, c: '#F6C3CF', s: 0.85, d: 0.3, sway: 12 },
]

/* Konfetti nöqtələri (fon) */
export const DOTS = (() => {
  const r = seeded(11)
  const cols = ['#EF8FA8', '#7FC8B0', '#FFE495', '#D6C5F3', '#BFDCF6', '#D8A64A']
  return Array.from({ length: 26 }, (_, i) => ({ x: r() * 100, y: r() * 100, s: 4 + r() * 6, c: cols[i % cols.length], rot: Math.round(r() * 90), sq: r() > 0.6 }))
})()

/* Ad uzunluğuna görə şar hərflərinin ölçüsü */
export function letterSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 4) return 'clamp(62px, 20vw, 92px)'
  if (n <= 6) return 'clamp(52px, 15.5vw, 76px)'
  if (n <= 9) return 'clamp(40px, 11.5vw, 58px)'
  return 'clamp(30px, 8.4vw, 44px)'
}
