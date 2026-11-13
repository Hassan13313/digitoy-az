/* NOVRUZ SƏMƏNİ — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  GREEN: '#3F8F2F', GREEN_D: '#2B6A1F', SPROUT: '#8CCB4A', SPROUT_L: '#C9EA8E', RED: '#D7263D', RED_D: '#A81B2E',
  COPPER: '#B8743A', COPPER_L: '#E7B57A', CREAM: '#FFF8EA', INK: '#24331C', MUTED: '#6F7A62', LINE: '#E6DCC4',
}

export const EGGS = [
  { base: '#E94F37', pat: 'dots' }, { base: '#F6C445', pat: 'zigzag' }, { base: '#4FB3D9', pat: 'stripes' }, { base: '#9B5DE5', pat: 'dots' },
]

export const CREAM_BG = (C) => (`radial-gradient(60% 40% at 15% 10%, rgba(201,234,142,.35), transparent 70%), radial-gradient(50% 35% at 90% 90%, rgba(233,79,55,.10), transparent 70%), ${C.CREAM}`)
export const GREEN_BG = (C) => (`radial-gradient(70% 50% at 50% 0%, rgba(201,234,142,.25), transparent 70%), linear-gradient(180deg, ${C.GREEN}, #2B6A1F)`)
export const COPPER_GRAD = (C) => (`linear-gradient(160deg, #8A5226 0%, #E7B57A 38%, ${C.COPPER} 62%, #F1C994 76%, #8A5226 100%)`)

/* Səməni yarpaqları — sabit toxumlu LCG */
let seed = 41
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const BLADES = Array.from({ length: 30 }, (_, i) => ({ x: 22 + (i / 29) * 56 + (rnd() - 0.5) * 3, h: 46 + rnd() * 34, bend: (rnd() - 0.5) * 18, w: 1.6 + rnd() * 1.2, d: rnd() * 0.4, tone: rnd() > 0.5 ? '#8CCB4A' : '#5FAE34' }))

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(42px, 12.6vw, 58px)'
  if (n <= 18) return 'clamp(34px, 10vw, 46px)'
  if (n <= 26) return 'clamp(28px, 8vw, 36px)'
  return 'clamp(23px, 6.4vw, 30px)'
}
