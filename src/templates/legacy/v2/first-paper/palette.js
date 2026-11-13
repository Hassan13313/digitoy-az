/* FIRST PAPER — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  PAPER: '#F8F6F1', SHADE: '#E9E5DC', CREASE: '#D9D3C6', INK: '#232B4A', BLUE: '#3561C9', BLUE_D: '#24449A',
  SKY: '#A9C0EE', MUTED: '#737A8A', WHITE: '#FFFFFF',
}

/* Origami kağızının rəngli üzü — dalğa (seigaiha) naxışı */
export const WASHI = (C) => (`radial-gradient(circle at 50% 100%, transparent 5px, rgba(255,255,255,.55) 5.5px 6.5px, transparent 7px, transparent 9px, rgba(255,255,255,.35) 9.5px 10.5px, transparent 11px) 0 0 / 22px 11px, radial-gradient(circle at 50% 100%, transparent 5px, rgba(255,255,255,.55) 5.5px 6.5px, transparent 7px, transparent 9px, rgba(255,255,255,.35) 9.5px 10.5px, transparent 11px) 11px 5.5px / 22px 11px, linear-gradient(135deg, #3B6AD6, ${C.BLUE_D})`)

/* Kağız fakturası — çox incə damalı vərəq */
export const PAPER_BG = (C) => (`linear-gradient(rgba(53,97,201,.05) 1px, transparent 1px) 0 0 / 100% 26px, linear-gradient(90deg, rgba(53,97,201,.05) 1px, transparent 1px) 0 0 / 26px 100%, ${C.PAPER}`)

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 10) return 'clamp(40px, 12vw, 56px)'
  if (n <= 16) return 'clamp(34px, 10vw, 46px)'
  if (n <= 24) return 'clamp(28px, 8vw, 38px)'
  return 'clamp(23px, 6.4vw, 30px)'
}
