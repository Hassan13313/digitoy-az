/* PARIS NIGHT — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  NIGHT: '#151935', NIGHT_L: '#262C55', INK: '#1C2140', BLUSH: '#F7D6DC', ROSE: '#E58FA3', ROSE_D: '#B94E70',
  PAPER: '#FFF7F7', GOLD: '#E1BC78', GOLD_D: '#9A7535', PISTACHIO: '#BFDDA8', LAVENDER: '#CDB8EA', LEMON: '#F4DE8E',
  RASPBERRY: '#E46A8C', MUTED: '#776C84', LINE: '#F0D7DD', MOON: '#FFF3D6',
}

export const NIGHT_BG = (C) => (`radial-gradient(1.4px 1.4px at 12% 14%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 30% 6%, #fff 50%, transparent 51%), radial-gradient(1.2px 1.2px at 58% 12%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 78% 8%, #fff 50%, transparent 51%), radial-gradient(1.4px 1.4px at 90% 24%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 44% 28%, #fff 50%, transparent 51%), radial-gradient(70% 45% at 50% 100%, rgba(229,143,163,.22), transparent 70%), linear-gradient(180deg, #0F1229, ${C.INK} 55%, #2A2650)`)
export const PAPER_BG = (C) => (`repeating-linear-gradient(90deg, rgba(247,214,220,.24) 0 18px, transparent 18px 36px), ${C.PAPER}`)
export const STRIPES = (C) => (`repeating-linear-gradient(90deg, ${C.INK} 0 10px, #FFFFFF 10px 20px)`)
export const MACARONS = (C) => ([C.ROSE, '#BFDDA8', '#CDB8EA', '#F4DE8E', '#E46A8C', '#A9D4E8'])

/* Qüllənin yarım eni (viewBox 100×200) */
export function halfWidth(y) {
  if (y < 14) return 1.2
  if (y < 66) return 4 + ((y - 14) / 52) * 2
  if (y < 72) return 14
  if (y < 116) return 10 + ((y - 72) / 44) * 6
  if (y < 124) return 26
  return 22 + ((y - 124) / 76) * 22
}

/* Qüllə işıqları — sabit toxumlu LCG */
let seed = 53
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const SPARKS = Array.from({ length: 46 }, () => {
  const y = 8 + rnd() * 186
  let x = 50 + (rnd() * 2 - 1) * halfWidth(y) * 0.88
  const arch = y > 150 ? ((y - 150) / 50) * 22 : 0
  if (Math.abs(x - 50) < arch) x = 50 + Math.sign(x - 50 || 1) * (arch + 3)
  return { x, y, d: rnd() * 1.6, dur: 0.5 + rnd() * 0.7 }
})

/* Ad uzunluğuna görə ölçü (Alumni Sans Pinstripe, böyük hərflə) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(64px, 20vw, 92px)'
  if (n <= 14) return 'clamp(48px, 15vw, 70px)'
  if (n <= 22) return 'clamp(38px, 11.4vw, 52px)'
  return 'clamp(30px, 8.6vw, 40px)'
}
