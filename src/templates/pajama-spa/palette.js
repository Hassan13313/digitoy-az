/* PAJAMA SPA — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { BG: '#FFF8F3', BG2: '#FBE9E4', INK: '#4A3340', ACCENT: '#D97A93', MUTE: '#8D7480', MINT: '#DDF1E8' }

/* Ad uzunluğuna görə ölçü */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(54px, 16vw, 74px)' : 'clamp(44px, 13vw, 58px)'
  if (n <= 18) return big ? 'clamp(44px, 13vw, 58px)' : 'clamp(36px, 10.5vw, 48px)'
  return big ? 'clamp(36px, 10.5vw, 48px)' : 'clamp(30px, 8.6vw, 40px)'
}
