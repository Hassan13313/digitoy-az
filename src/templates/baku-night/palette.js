/* BAKI GECƏSİ — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { NIGHT: '#0C1322', NIGHT2: '#121C30', GOLD: '#C9A45C', CHAM: '#EADFC8', MUTE: '#8D95A6' }

/* Ad uzunluğuna görə ölçü (Noto Serif Display) */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(50px, 15vw, 70px)' : 'clamp(44px, 12.5vw, 58px)'
  if (n <= 18) return big ? 'clamp(44px, 12.5vw, 58px)' : 'clamp(34px, 9.6vw, 46px)'
  return big ? 'clamp(34px, 9.6vw, 46px)' : 'clamp(28px, 8.2vw, 38px)'
}
