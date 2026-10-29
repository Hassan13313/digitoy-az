/* FAIRY TALE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NIGHT: '#1F2A52', DUSK: '#3B3A7A', VIOLET: '#5E4A9C', LILAC: '#B7A3D9', LILAC_L: '#E7DEF3',
  ROSE: '#E9B8C4', ROSE_D: '#C98497', CREAM: '#FBF5EA', PARCH: '#F3E7D1', GOLD: '#C8A15A',
  GOLD_L: '#EBD49A', GOLD_D: '#9C7A3A', INK: '#2D2A4A', MUTED: '#625C7C', SAGE: '#9BB59A',
}

/* Folqa qızılı (mətn və konturlar üçün) */
export const FOIL = 'linear-gradient(100deg, #9C7A3A 0%, #F1DA9C 34%, #C8A15A 52%, #F6E3B0 72%, #A8843F 100%)'

/* Toxumlu təsadüf — hər render eyni nəticə */
export function seeded(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

