/* PAPER PLANE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  SKY: '#BFE0F5', SKY_L: '#EAF6FD', BLUE: '#2F6FDB', BLUE_D: '#1F4FA8', NAVY: '#1B2D4F', NAVY_D: '#111E36',
  RED: '#E0483E', SUN: '#FFC857', WHITE: '#FFFFFF', INK: '#1B2D4F', MUTED: '#5E7290', LINE: '#D5E3F2',
}

export const SKY_BG = `radial-gradient(40% 30% at 85% 8%, rgba(255,200,87,.45), transparent 70%), linear-gradient(180deg, #A9D4F2 0%, #CFE8F8 55%, #EAF6FD 100%)`
export const NIGHT_BG = `radial-gradient(1.5px 1.5px at 20% 30%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 70% 20%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 85% 65%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 35% 80%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 55% 50%, #fff 50%, transparent 51%), linear-gradient(180deg, #1B2D4F, #111E36)`
export const LINED = `linear-gradient(90deg, transparent 30px, rgba(224,72,62,.35) 30px 31.5px, transparent 31.5px), repeating-linear-gradient(180deg, transparent 0 27px, rgba(47,111,219,.16) 27px 28px), #FFFFFF`
/* Hava poçtu zolağı */
export const AIRMAIL = `repeating-linear-gradient(135deg, #E0483E 0 12px, #FFFFFF 12px 20px, #2F6FDB 20px 32px, #FFFFFF 32px 40px)`

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(54px, 17vw, 78px)'
  if (n <= 14) return 'clamp(42px, 12.6vw, 58px)'
  if (n <= 22) return 'clamp(32px, 9.4vw, 44px)'
  return 'clamp(26px, 7.2vw, 34px)'
}
