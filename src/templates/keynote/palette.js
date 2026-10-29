/* KEYNOTE — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  VOID: '#060A14', NAVY: '#0C1324', PANEL: '#111A30', PANEL_L: '#18233F', LINE: '#22304F',
  BLUE: '#3D7BFF', CYAN: '#22D3EE', VIOLET: '#8B7BFF', WHITE: '#F3F6FC', MUTED: '#8A97B4', FAINT: '#56637F',
}

export const GLOW = (C) => (`linear-gradient(120deg, ${C.BLUE}, ${C.CYAN} 50%, ${C.VIOLET})`)
export const GRID_BG = (C) => (`radial-gradient(circle, rgba(138,151,180,.16) 1px, transparent 1.4px) 0 0 / 22px 22px, radial-gradient(80% 50% at 50% 0%, rgba(61,123,255,.18), transparent 70%), ${C.VOID}`)

/* Ad uzunluğuna görə ölçü (Geologica) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(44px, 13vw, 62px)'
  if (n <= 14) return 'clamp(36px, 10.4vw, 50px)'
  if (n <= 22) return 'clamp(29px, 8.2vw, 40px)'
  return 'clamp(23px, 6.4vw, 30px)'
}
