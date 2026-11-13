/* CIRCUS SHOW — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  PAPER: '#F7ECD6', PAPER_D: '#EEDDBB', CREAM: '#FFF8EA', RED: '#C62537', RED_D: '#9E1B2B',
  NAVY: '#1E2A57', NAVY_D: '#141C3E', MUSTARD: '#F2B23A', MUSTARD_D: '#C98A16', TEAL: '#1F8A80',
  INK: '#2A1E1A', MUTED: '#6A5546', GOLD: '#C99A3B',
}

export function seeded(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

/* Konfetti parçaları — açılış partlayışı (sabit, toxumlu) */
export const CONFETTI = (C) => ((() => {
  const r = seeded(31)
  const cols = [C.RED, C.MUSTARD, C.TEAL, C.CREAM, '#E86A8F', '#5B7BD5']
  return Array.from({ length: 46 }, (_, i) => {
    const a = -Math.PI / 2 + (r() - 0.5) * Math.PI * 1.25
    const d = 180 + r() * 260
    return {
      dx: Math.round(Math.cos(a) * d), dy: Math.round(Math.sin(a) * d + 160 + r() * 120),
      rot: Math.round((r() - 0.5) * 1080), w: 6 + Math.round(r() * 6), h: 10 + Math.round(r() * 8),
      c: cols[i % cols.length], delay: (r() * 0.25).toFixed(2), round: r() > 0.7,
    }
  })
})())

/* Uzun adlarda Oi şriftinin ölçüsü (çox enli şriftdir) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 5) return 'clamp(54px, 17vw, 80px)'
  if (n <= 8) return 'clamp(42px, 12.5vw, 62px)'
  if (n <= 12) return 'clamp(32px, 9vw, 46px)'
  return 'clamp(26px, 7vw, 36px)'
}
