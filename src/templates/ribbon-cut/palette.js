/* RIBBON CUT — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  EMERALD: '#0F3D30', EMERALD_L: '#175443', EMERALD_D: '#09281F', GOLD: '#D8B25A', GOLD_L: '#F5DE9C', GOLD_D: '#A8822E',
  RED: '#C21F32', RED_D: '#8E1424', IVORY: '#F7F2E6', INK: '#13281F', MUTED: '#6E7C74',
}

export const GOLD_GRAD = (C) => (`linear-gradient(160deg, #A8822E 0%, #F5DE9C 35%, ${C.GOLD} 58%, #FFF0C0 74%, #A8822E 100%)`)
export const RIBBON = (C) => (`linear-gradient(180deg, #E23A4D 0%, ${C.RED} 40%, #9A1527 75%, ${C.RED} 100%)`)
export const EMERALD_BG = (C) => (`radial-gradient(70% 50% at 50% 0%, rgba(216,178,90,.16), transparent 70%), linear-gradient(180deg, #175443, ${C.EMERALD} 60%, #09281F)`)
export const IVORY_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), ${C.IVORY}`)

/* Qızılı konfetti — sabit toxumlu LCG */
let seed = 11
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
/* Mövqelər modul yüklənəndə BİR dəfə (rnd vəziyyətlidir); fabrik yalnız rəngi admin palitrasından götürür */
const CONFETTI_BASE = Array.from({ length: 30 }, () => ({
  x: rnd() * 100, d: 0.35 + rnd() * 0.5, s: 5 + rnd() * 6, r: rnd() * 360, dx: (rnd() - 0.5) * 70, dur: 1.3 + rnd() * 1,
  ci: Math.floor(rnd() * 4),
}))
export const CONFETTI = (C) => CONFETTI_BASE.map(({ ci, ...p }) => ({ ...p, c: [C.GOLD, '#F5DE9C', '#FFFFFF', C.RED][ci] }))

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(42px, 13vw, 60px)'
  if (n <= 18) return 'clamp(34px, 10vw, 46px)'
  if (n <= 26) return 'clamp(28px, 8vw, 37px)'
  return 'clamp(23px, 6.4vw, 30px)'
}
