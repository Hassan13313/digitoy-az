/* LOVE LETTERS — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  LINEN: '#EFE6D8', PAPER: '#FBF6EC', ENV1: '#F4ECDD', ENV2: '#E7D8C1', ENV3: '#E3CFCB', ENV4: '#CFD7DC',
  TWINE: '#A9835A', TWINE_D: '#7E5F3C', INK: '#2F3550', INK_L: '#4A5274', ROSE: '#9C4A4A', ROSE_L: '#C98B8B',
  MUTED: '#7D7468', NAVY: '#262B42',
}

export const ENVS = (C) => ([C.ENV1, C.ENV2, C.ENV3, C.ENV4])

export const LINEN_BG = (C) => (`repeating-linear-gradient(0deg, rgba(120,100,70,.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(120,100,70,.035) 0 1px, transparent 1px 3px), ${C.LINEN}`)
export const NAVY_BG = `radial-gradient(80% 50% at 50% 0%, rgba(201,139,139,.18), transparent 70%), #262B42`
/* Xətli məktub kağızı */
export const RULED = `repeating-linear-gradient(180deg, transparent 0 31px, rgba(47,53,80,.12) 31px 32px), #FBF6EC`

/* Ad uzunluğuna görə ölçü (Great Vibes) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(52px, 15.6vw, 74px)'
  if (n <= 16) return 'clamp(44px, 13vw, 60px)'
  if (n <= 24) return 'clamp(36px, 10.4vw, 48px)'
  return 'clamp(28px, 8vw, 38px)'
}
