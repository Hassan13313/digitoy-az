/* RETRO POLAROID — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  CREAM: '#F4EAD5', CREAM_L: '#FBF5E8', CHOC: '#3B2418', CHOC_L: '#5B3A29', BROWN: '#7A4E33',
  RED: '#C8452D', ORANGE: '#E07A2E', MUSTARD: '#E2B33C', TEAL: '#3E7C74', INK: '#3B2418', MUTED: '#8A6E58', WHITE: '#FFFDF8',
}

export const RAINBOW = (C) => ([C.RED, C.ORANGE, C.MUSTARD, C.TEAL])

/* 70-ci illər gün batımı — zolaqlı səma */
export const SUNSET = (C) => (`linear-gradient(180deg, #F2C15A 0%, #EFA243 30%, ${C.ORANGE} 52%, #C8452D 70%, #7A3B2A 100%)`)

export const CREAM_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFF8EA, transparent 70%), ${C.CREAM}`)
export const CHOC_BG = (C) => (`radial-gradient(80% 50% at 50% 0%, rgba(224,122,46,.22), transparent 70%), ${C.CHOC}`)

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(40px, 12vw, 56px)'
  if (n <= 16) return 'clamp(33px, 9.8vw, 46px)'
  if (n <= 24) return 'clamp(27px, 8vw, 37px)'
  return 'clamp(22px, 6.4vw, 30px)'
}
