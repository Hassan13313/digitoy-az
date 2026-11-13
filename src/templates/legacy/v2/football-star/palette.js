/* FOOTBALL STAR — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  PITCH: '#1F7A3C', PITCH_D: '#145A2B', PITCH_L: '#2C9150', LINE: '#F2F6EF',
  NAVY: '#0E2A47', NAVY_D: '#081A2E', GOLD: '#F2C230', WHITE: '#FFFFFF', INK: '#0C1B2C', MUTED: '#586878', GRASS_L: '#EEF5EC',
}

/* Ot zolaqları */
export const PITCH_BG = (C) => (`repeating-linear-gradient(180deg, ${C.PITCH} 0 54px, ${C.PITCH_L} 54px 108px)`)
export const NIGHT_BG = (C) => (`radial-gradient(60% 30% at 18% 0%, rgba(255,255,255,.22), transparent 70%), radial-gradient(60% 30% at 82% 0%, rgba(255,255,255,.22), transparent 70%), linear-gradient(180deg, ${C.NAVY_D}, ${C.NAVY} 40%, ${C.PITCH_D} 40.2%, ${C.PITCH} 100%)`)

/* «Qol!» */
export const GOAL_WORD = { az: 'QOL!', en: 'GOAL!', ru: 'ГОЛ!' }

/* Ad uzunluğuna görə ölçü (Oswald) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(54px, 17vw, 78px)'
  if (n <= 10) return 'clamp(42px, 12.6vw, 60px)'
  if (n <= 16) return 'clamp(32px, 9vw, 44px)'
  return 'clamp(24px, 6.8vw, 32px)'
}
