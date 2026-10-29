/* SPACE MISSION — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  SPACE: '#141A3C', DEEP: '#0C1029', VIOLET: '#3B2F7A', PURPLE: '#5B46B0',
  TANGERINE: '#FF8A3D', SUN: '#FFC94D', MINT: '#5FE0B7', PINK: '#F48FB1', SKY: '#7FB5FF',
  WHITE: '#F5F3FF', MUTED: '#AEB4D8', PANEL: '#1C2350', PANEL_L: '#283070', RED: '#FF5A4E',
}

/* Toxumlu təsadüf — hər render eyni nəticə */
export function seeded(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

/* Ulduz mövqeləri (səmalar üçün) */
export const STARS = (() => {
  const r = seeded(19)
  return Array.from({ length: 60 }, () => ({ x: r() * 100, y: r() * 100, s: 0.8 + r() * 2.2, d: (r() * 4).toFixed(2), c: r() > 0.85 }))
})()
