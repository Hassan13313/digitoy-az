/* MIRROR & CANDLE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NIGHT: '#14100D', NIGHT_L: '#211A15', PANEL: '#1B1511',
  GOLD: '#E0B864', GOLD_L: '#F6DFA0', GOLD_D: '#A88438',
  SILVER: '#C9CED6', IVORY: '#F4ECDD', MUTED: '#B8AA94', FAINT: '#7E7262',
}

/* Qızılı çərçivə — konik parıltı */
export const GILT = 'conic-gradient(from 210deg, #8C6A2A, #F6DFA0, #B8913F, #FFF1C4, #9C7A34, #E0B864, #8C6A2A)'

/* Düymələr üçün — konik parıltı enli düymədə «konus» kimi görünür */
export const GILT_BAR = 'linear-gradient(160deg, #B8913F 0%, #F6DFA0 42%, #D9B565 62%, #9C7A34 100%)'

/* Güzgü səthi: sönük (açılışdan əvvəl) və işıqlı */
export const MIRROR_DIM = 'radial-gradient(80% 70% at 40% 30%, #4A4846 0%, #2A2826 45%, #171513 100%)'
export const MIRROR_LIT = 'radial-gradient(80% 70% at 40% 30%, #FFF6E2 0%, #D9C7A6 32%, #8F826E 70%, #4A4034 100%)'

/* Şam işığı ləkələri (fon) */
export const GLOW_BG = `radial-gradient(45% 30% at 12% 20%, rgba(255,190,100,.10), transparent 70%), radial-gradient(45% 30% at 88% 60%, rgba(255,190,100,.08), transparent 70%), linear-gradient(180deg, ${C.NIGHT_L}, ${C.NIGHT})`

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(46px, 14vw, 64px)'
  if (n <= 10) return 'clamp(38px, 11vw, 52px)'
  if (n <= 16) return 'clamp(30px, 8.4vw, 40px)'
  return 'clamp(24px, 6.6vw, 32px)'
}
