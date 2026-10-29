/* HERO COMIC — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  YELLOW: '#FFD43B', RED: '#E63946', BLUE: '#1F5FD1', SKY: '#5BC0EB', INK: '#121212',
  PAPER: '#FFF8E6', WHITE: '#FFFFFF', MUTED: '#4A4A4A',
}

/* Rastr nöqtələri (halftone) */
export const DOTS = (color = 'rgba(18,18,18,.16)', size = 8) => `radial-gradient(circle, ${color} 1.15px, transparent 1.6px) 0 0 / ${size}px ${size}px`

/* Sürət xətləri — mərkəzdən */
export const SPEED = (C) => ((a = C.BLUE, b = '#2C74F0') => `repeating-conic-gradient(from 0deg at 50% 50%, ${a} 0deg 7deg, ${b} 7deg 14deg)`)

/* Komiks hərfi: qalın qara kontur + kölgə */
export const OUTLINE = (C) => ((w = 3, shadow = 5) => ({
  WebkitTextStroke: `${w}px ${C.INK}`, paintOrder: 'stroke fill',
  textShadow: `${shadow}px ${shadow}px 0 ${C.INK}`,
}))

/* Səs effekti sözü dil üzrə */
export const SFX = { az: 'BAM!', en: 'POW!', ru: 'БАМ!' }

/* Ulduz partlayışı — n uclu çoxbucaq (0..100 koordinat) */
export function burst(n = 14, inner = 0.72) {
  const pts = []
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2
    const r = i % 2 ? 50 * inner : 50
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)}% ${(50 + Math.sin(a) * r).toFixed(1)}%`)
  }
  return `polygon(${pts.join(', ')})`
}
export const BURST = burst(14, 0.74)
export const BURST_SHARP = burst(12, 0.6)

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 5) return 'clamp(56px, 17vw, 78px)'
  if (n <= 8) return 'clamp(44px, 13vw, 60px)'
  if (n <= 13) return 'clamp(32px, 9.4vw, 44px)'
  return 'clamp(24px, 7vw, 32px)'
}
