/* ŞAM VƏ ÜZÜK — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  MEXMER: '#15211A', MEXMER_2: '#1C2B22', GECE: '#0A0F0C', FIL: '#F1E5CE', QIZIL: '#D6AD6B', KUL: '#A8AE9C',
}

/* Ad uzunluğuna görə ölçü (Carattere) */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(64px, 19vw, 100px)' : 'clamp(54px, 16vw, 84px)'
  if (n <= 18) return big ? 'clamp(50px, 14vw, 72px)' : 'clamp(44px, 12.4vw, 62px)'
  return big ? 'clamp(38px, 10.6vw, 54px)' : 'clamp(34px, 9.4vw, 46px)'
}
