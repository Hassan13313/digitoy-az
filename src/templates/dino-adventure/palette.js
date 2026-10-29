/* DINO ADVENTURE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  JUNGLE: '#24452F', LEAF: '#3E7A3A', FERN: '#7FB069', FERN_L: '#A8CF8E', SAND: '#F5EBD3', SAND_D: '#E6D3A8',
  EGG: '#FBF4E2', LAVA: '#E4683A', LAVA_D: '#B8482A', SKY: '#BFE3DA', STONE: '#B9AE98', STONE_D: '#6E6556',
  INK: '#2B2A20', MUTED: '#615C47', AMBER: '#E9A23B', AMBER_L: '#F6C66B', BONE: '#F3EBD8', TEAL: '#4C9A8A',
}

export function seeded(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

/* Yumurta xalları (sabit) */
export const SPOTS = (() => {
  const r = seeded(5)
  return Array.from({ length: 12 }, () => ({ x: (r() - 0.5) * 80, y: -50 + r() * 110, rx: 3 + r() * 6, ry: 2 + r() * 4, rot: Math.round(r() * 180) }))
})()
