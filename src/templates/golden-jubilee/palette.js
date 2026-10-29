/* GOLDEN JUBILEE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  LEATHER: '#5A1E1B', LEATHER_L: '#73302A', LEATHER_D: '#33100E',
  GOLD: '#D4AF5A', GOLD_L: '#F3DE9C', GOLD_D: '#9C7A2E',
  PAGE: '#F7F0E1', PAGE_D: '#EADFC6', INK: '#3B2A1C', MUTED: '#86735A', CREAM: '#F6EAD0',
}

export const GOLD_GRAD = 'linear-gradient(160deg, #9C7A2E 0%, #F3DE9C 30%, #D4AF5A 52%, #FFF1C2 68%, #A9852F 100%)'

/* Dəri faktura — SVG səs-küy (data URI) */
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")"
export const LEATHER_BG = `${NOISE}, radial-gradient(80% 60% at 50% 30%, #7A332C, #5A1E1B 55%, #3D1311 100%)`
export const LEATHER_FLAT = `${NOISE}, linear-gradient(180deg, #5A1E1B, #3D1311)`
export const PAGE_BG = `radial-gradient(90% 70% at 50% 0%, #FFFBF1, transparent 70%), #F7F0E1`

export const goldText = {
  backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text',
  color: 'transparent', WebkitTextFillColor: 'transparent',
  filter: 'drop-shadow(0 1px 0 rgba(0,0,0,.45))',
}

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(36px, 10.6vw, 50px)'
  if (n <= 16) return 'clamp(30px, 8.6vw, 42px)'
  if (n <= 24) return 'clamp(25px, 7vw, 34px)'
  return 'clamp(21px, 5.8vw, 28px)'
}
