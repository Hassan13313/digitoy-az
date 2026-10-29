/* SILVER LOCKET — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NIGHT: '#141923', NIGHT_L: '#1E2531', SILVER: '#C9CED6', SILVER_L: '#F1F3F6', SILVER_D: '#8D949E',
  ROSE: '#D9A3A6', ROSE_D: '#B87B80', IVORY: '#F4F1EC', INK: '#232831', MUTED: '#7C8592', FAINT: '#5A6372',
}

export const SILVER_GRAD = (C) => (`linear-gradient(150deg, #8D949E 0%, #F1F3F6 35%, ${C.SILVER} 55%, #FFFFFF 70%, #9AA1AB 100%)`)
export const NIGHT_BG = `radial-gradient(70% 45% at 50% 0%, rgba(201,206,214,.12), transparent 70%), linear-gradient(180deg, ${'#1E2531'}, ${'#141923'})`

/* Ürək forması (viewBox 0 0 200 184) */
export const HEART = 'M100 178C100 178 8 120 8 58C8 26 32 6 58 6C78 6 92 18 100 34C108 18 122 6 142 6C168 6 192 26 192 58C192 120 100 178 100 178Z'

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(48px, 14.6vw, 68px)'
  if (n <= 14) return 'clamp(40px, 11.6vw, 54px)'
  if (n <= 22) return 'clamp(32px, 9vw, 44px)'
  return 'clamp(26px, 7vw, 34px)'
}
