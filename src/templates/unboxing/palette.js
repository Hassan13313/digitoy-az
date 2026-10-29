/* UNBOXING — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NIGHT: '#101024', NIGHT_L: '#1B1A3A', NIGHT_D: '#0A0A18', VIOLET: '#7C5CFF', VIOLET_L: '#B9A8FF', VIOLET_D: '#5638E0',
  PEARL: '#F4F3FA', SILVER: '#C9CBD8', INK: '#151530', MUTED: '#7E809A', LINE: '#E2E1EE',
}

export const STAGE_BG = `radial-gradient(42% 60% at 50% 0%, rgba(185,168,255,.30), transparent 72%), radial-gradient(60% 30% at 50% 100%, rgba(124,92,255,.22), transparent 70%), linear-gradient(180deg, #17163A, #101024 55%, #0A0A18)`
export const PEARL_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), ${C.PEARL}`)
export const BOX_FRONT = 'linear-gradient(160deg, #2A2860 0%, #1B1A3A 55%, #121130 100%)'
export const VIOLET_GRAD = (C) => (`linear-gradient(135deg, ${C.VIOLET_L}, ${C.VIOLET} 50%, #5638E0)`)
export const ORB = 'radial-gradient(circle at 36% 30%, #FFFFFF 0 8%, #E3DCFF 20%, #A08BFF 45%, #6A4CF0 70%, #3B2AA0 100%)'

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(44px, 13.4vw, 62px)'
  if (n <= 18) return 'clamp(35px, 10.4vw, 48px)'
  if (n <= 26) return 'clamp(29px, 8.4vw, 38px)'
  return 'clamp(24px, 6.6vw, 31px)'
}
