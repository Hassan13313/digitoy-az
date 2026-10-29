/* YEARBOOK — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  BLUE: '#1F4FD1', BLUE_D: '#16379A', BLUE_DD: '#0F2566', YELLOW: '#FFC629', WHITE: '#FFFFFF', PAGE: '#F7F8FB',
  INK: '#14182B', MUTED: '#69708A', RED: '#E63946', GREEN: '#2A9D8F', PURPLE: '#7B4FD1', LINE: '#DCE2F0',
}

export const MARKERS = (C) => ([C.BLUE, C.RED, C.GREEN, C.PURPLE])

export const PAGE_BG = (C) => (`linear-gradient(90deg, transparent 38px, rgba(230,57,70,.25) 38px 39.5px, transparent 39.5px), repeating-linear-gradient(180deg, transparent 0 29px, rgba(31,79,209,.09) 29px 30px), ${C.WHITE}`)
export const BLUE_BG = (C) => (`radial-gradient(70% 50% at 50% 0%, rgba(255,198,41,.16), transparent 70%), linear-gradient(180deg, ${C.BLUE}, #16379A)`)

/* Varsity hərfi: sarı dolğu, ağ + göy kontur */
export const varsity = (C) => ((size) => ({
  color: C.YELLOW, WebkitTextStroke: `${Math.max(1.5, size * 0.04)}px ${C.WHITE}`, paintOrder: 'stroke fill',
  textShadow: `0 0 0 ${C.BLUE_DD}, ${size * 0.05}px ${size * 0.05}px 0 ${C.BLUE_DD}`,
}))

/* İmzalar (açılışda bir-bir görünür) */
export const SIGNS = {
  az: ['Uğurlar!', 'Unutma bizi!', 'Sən bacarırsan!', 'Ən yaxşı sinif!'],
  en: ['Good luck!', "Don’t forget us!", 'You got this!', 'Best class ever!'],
  ru: ['Удачи!', 'Не забывай нас!', 'У тебя всё получится!', 'Лучший класс!'],
}

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(60px, 19vw, 88px)'
  if (n <= 14) return 'clamp(46px, 14vw, 66px)'
  if (n <= 22) return 'clamp(36px, 10.6vw, 50px)'
  return 'clamp(28px, 8vw, 38px)'
}
