/* PAJAMA SPA — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  LILAC: '#C9B6F2', LILAC_L: '#E9E0FB', LILAC_D: '#8E72D6', MINT: '#BDEBD9', MINT_D: '#5FBF9C', PEACH: '#FFD3BE', PEACH_D: '#F2A285',
  CREAM: '#FFF9F4', NIGHT: '#3B2E5A', NIGHT_D: '#2A2044', INK: '#3B2E5A', MUTED: '#7E7598', LINE: '#E8DFF5',
}

export const CREAM_BG = (C) => (`radial-gradient(50% 35% at 10% 10%, rgba(201,182,242,.35), transparent 70%), radial-gradient(50% 35% at 90% 80%, rgba(189,235,217,.45), transparent 70%), ${C.CREAM}`)
export const NIGHT_BG = (C) => (`radial-gradient(1.4px 1.4px at 14% 22%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 36% 10%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 70% 18%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 86% 34%, #fff 50%, transparent 51%), radial-gradient(60% 40% at 50% 0%, rgba(201,182,242,.25), transparent 70%), linear-gradient(180deg, #4A3A70, ${C.NIGHT} 60%, #2A2044)`)
export const PILLOW = 'radial-gradient(120% 90% at 30% 20%, #FFFFFF, #F1EAFE 45%, #DCCFF7 100%)'

/* Lələklər — sabit toxumlu LCG */
let seed = 97
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
export const FEATHERS = Array.from({ length: 20 }, () => ({ a: -170 + rnd() * 160, r: 90 + rnd() * 180, s: 20 + rnd() * 16, rot: rnd() * 360, d: 0.2 + rnd() * 0.3, dur: 1.3 + rnd() * 0.8 }))

/* Ad uzunluğuna görə ölçü (Pangolin) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(54px, 16.6vw, 78px)'
  if (n <= 14) return 'clamp(42px, 12.6vw, 58px)'
  if (n <= 22) return 'clamp(32px, 9.6vw, 44px)'
  return 'clamp(26px, 7.4vw, 34px)'
}
