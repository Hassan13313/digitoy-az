/* HENNA BUTA — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  CREAM: '#FBF3E8', SAND: '#F3E3CF', SKIN: '#F1D3B8', SKIN_D: '#E2B795',
  HENNA: '#8A3A18', HENNA_D: '#5A230C', TERRA: '#B5552B', LEAF: '#5E7A3A',
  GOLD: '#C99A4B', INK: '#3A1E12', MUTED: '#7B5A48',
}

/* Açıq ovuc — sadə, zərif xətt (viewBox 0 0 200 290) */
export const HAND = [
  'M68 288C64 252 56 228 50 212C42 196 30 176 22 160C16 148 15 134 22 129C29 124 37 130 43 140C48 148 53 156 58 160',
  'L58 72A10 10 0 0 1 78 72L78 126Q79.5 130 81 126L81 50A11 11 0 0 1 103 50L103 124Q104 129 105 124',
  'L105 60A10 10 0 0 1 125 60L125 128Q126 133 127 128L127 92A8.5 8.5 0 0 1 144 92L144 150',
  'C149 166 152 188 147 214C143 238 137 262 134 288Z',
].join('')

/* Barmaq ucları (dolu xına) */
export const TIPS = [
  'M58 84L58 72A10 10 0 0 1 78 72L78 84Q68 79 58 84Z',
  'M81 63L81 50A11 11 0 0 1 103 50L103 63Q92 58 81 63Z',
  'M105 72L105 60A10 10 0 0 1 125 60L125 72Q115 67 105 72Z',
  'M127 102L127 92A8.5 8.5 0 0 1 144 92L144 102Q135.5 97 127 102Z',
  'M17.5 141C16 134 18 128 22 129C27 126 33 130 37 135Q27 135 17.5 141Z',
]

/* Barmaq bəzəkləri: [x1, x2, y] — iki xətt və nöqtələr */
export const BANDS = [[58, 78, 104], [81, 103, 86], [105, 125, 96], [127, 144, 120]]

/* Seeded təsadüf (React saflığı üçün modul səviyyəsində) */
export function seeded(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

/* Ad uzunluğuna görə ölçü (Spectral) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(56px, 17vw, 80px)'
  if (n <= 10) return 'clamp(44px, 13vw, 62px)'
  if (n <= 16) return 'clamp(34px, 9.6vw, 48px)'
  return 'clamp(28px, 7.8vw, 38px)'
}
