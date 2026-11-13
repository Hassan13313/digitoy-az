/* LITTLE PRINCE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NAVY: '#0F1C3F', ROYAL: '#1C3474', ROYAL_L: '#2D4E9E', VELVET: '#8E1E33',
  GOLD: '#D8B058', GOLD_L: '#F3DC98', GOLD_D: '#9E7A2E',
  IVORY: '#F8F2E4', IVORY_D: '#EFE5CF', INK: '#16203D', MUTED: '#5D6684',
}

export const GOLD_GRAD = (C) => (`linear-gradient(160deg, #9E7A2E 0%, #F3DC98 40%, ${C.GOLD} 62%, #8C6A24 100%)`)
export const NAVY_BG = (C) => (`radial-gradient(90% 55% at 50% 0%, #22397A 0%, transparent 70%), linear-gradient(180deg, ${C.ROYAL}, ${C.NAVY})`)

/* Seeded təsadüf */
export function seeded(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

/* Qızılı toz (fon parıltıları) */
export const DUST = (() => {
  const r = seeded(77)
  return Array.from({ length: 34 }, () => ({ x: r() * 100, y: r() * 100, s: 1 + r() * 2.4, d: (r() * 4).toFixed(2) }))
})()

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(54px, 16vw, 76px)'
  if (n <= 10) return 'clamp(42px, 12vw, 58px)'
  if (n <= 16) return 'clamp(32px, 9vw, 44px)'
  return 'clamp(26px, 7vw, 34px)'
}
