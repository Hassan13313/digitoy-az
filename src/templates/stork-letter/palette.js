/* STORK LETTER — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  PAPER: '#F3EBDD', PAPER_L: '#FBF6EC', PAPER_D: '#E6D9C3', DUSTY: '#7C97AE', DUSTY_D: '#4E6A83', DUSTY_L: '#C9D6E1',
  TERRA: '#C98B6B', SEAL: '#A9473A', SEAL_D: '#7E2F25', INK: '#3E3A36', MUTED: '#776C61', SEPIA: '#9A7B57',
}

/* Köhnə kağız */
export const PAPER_BG = (C) => (`radial-gradient(120% 70% at 50% 0%, rgba(255,255,255,.55), transparent 70%), radial-gradient(circle, rgba(154,123,87,.05) 1px, transparent 1.5px) 0 0 / 5px 5px, ${C.PAPER}`)

/* Poçt markası kənarı (perforasiya) */
export const PERF = {
  WebkitMask: 'radial-gradient(circle at 6px 6px, transparent 3.3px, #000 3.7px) -6px -6px / 12px 12px, linear-gradient(#000 0 0) content-box',
  mask: 'radial-gradient(circle at 6px 6px, transparent 3.3px, #000 3.7px) -6px -6px / 12px 12px, linear-gradient(#000 0 0) content-box',
}

/* Ad uzunluğuna görə ölçü (Great Vibes) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(58px, 18vw, 82px)'
  if (n <= 10) return 'clamp(46px, 13.6vw, 64px)'
  if (n <= 16) return 'clamp(38px, 10.6vw, 50px)'
  return 'clamp(30px, 8.4vw, 40px)'
}
