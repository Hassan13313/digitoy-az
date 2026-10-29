/* BABY MOBILE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NIGHT: '#2E3A63', NIGHT_D: '#222B4D', NIGHT_L: '#41508A', MUSTARD: '#E9B949', MUSTARD_D: '#C9952B',
  CREAM: '#FFF4DE', BLUSH: '#F2B5A7', SAGE: '#A8C3A0', CLOUD: '#F8F1E6', INK: '#2A2F4A', MUTED: '#6B6F88',
}

/* Keçə (felt) dənəsi */
export const FELT = (color) => `radial-gradient(circle, rgba(255,255,255,.18) .8px, transparent 1.2px) 0 0 / 4px 4px, radial-gradient(circle, rgba(0,0,0,.06) .8px, transparent 1.2px) 2px 2px / 4px 4px, ${color}`

export const NIGHT_BG = `radial-gradient(70% 45% at 50% 0%, #4B5B96, transparent 70%), linear-gradient(180deg, ${C.NIGHT}, ${C.NIGHT_D})`

/* Seeded təsadüf — ulduzlar */
export function seeded(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}
export const SPARKS = (() => {
  const r = seeded(5)
  return Array.from({ length: 40 }, () => ({ x: r() * 100, y: r() * 100, s: 1 + r() * 2, d: (r() * 4).toFixed(2) }))
})()

/* Mobilin asma parçaları: x (%), sapın uzunluğu (px), forma, rəng */
export const HANG = [
  { x: 10, len: 70, shape: 'star', color: '#E9B949' },
  { x: 30, len: 120, shape: 'cloud', color: '#FFF4DE' },
  { x: 50, len: 86, shape: 'moon', color: '#E9B949' },
  { x: 70, len: 128, shape: 'heart', color: '#F2B5A7' },
  { x: 90, len: 74, shape: 'star', color: '#A8C3A0' },
]

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(50px, 15vw, 70px)'
  if (n <= 10) return 'clamp(40px, 11.6vw, 54px)'
  if (n <= 16) return 'clamp(30px, 8.6vw, 42px)'
  return 'clamp(24px, 6.6vw, 32px)'
}
