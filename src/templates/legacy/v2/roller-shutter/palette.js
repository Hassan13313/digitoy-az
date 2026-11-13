/* ROLLER SHUTTER — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  CHAR: '#1D2023', CHAR_L: '#2A2E33', CHAR_D: '#141618', STEEL: '#A7AFB7', STEEL_L: '#D7DCE1', STEEL_D: '#7C858E',
  YELLOW: '#FFD23F', AMBER: '#FFB547', CONCRETE: '#ECEDEE', WHITE: '#F7F8F9', INK: '#1D2023', MUTED: '#6C737B', LINE: '#D3D7DB',
}

/* Büzməli metal jalüz */
export const SHUTTER = `repeating-linear-gradient(180deg, #C9CFD5 0 4px, #E6E9EC 4px 9px, #AEB5BC 9px 11px, #8F979F 11px 13px)`
export const HAZARD = (C) => (`repeating-linear-gradient(135deg, ${C.YELLOW} 0 12px, ${C.CHAR} 12px 24px)`)
export const STEEL_GRAD = 'linear-gradient(160deg, #8F979F 0%, #E6E9EC 35%, #B9C0C7 60%, #F2F4F6 75%, #8F979F 100%)'
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .12 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")"
export const CONCRETE_BG = `${NOISE}, linear-gradient(180deg, #F1F2F3, #E4E6E8)`
export const CHAR_BG = (C) => (`${NOISE}, radial-gradient(70% 50% at 50% 0%, rgba(255,181,71,.12), transparent 70%), linear-gradient(180deg, #2A2E33, ${C.CHAR})`)
/* Mağazanın içi — isti işıq */
export const INTERIOR = `radial-gradient(60% 45% at 50% 40%, rgba(255,214,150,.95), rgba(255,181,71,.55) 45%, rgba(60,40,20,.9) 100%), #3A2A1A`

/* Ad uzunluğuna görə ölçü (Alumni Sans — dar) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(64px, 20vw, 92px)'
  if (n <= 18) return 'clamp(50px, 15vw, 70px)'
  if (n <= 26) return 'clamp(40px, 12vw, 54px)'
  return 'clamp(32px, 9vw, 42px)'
}
