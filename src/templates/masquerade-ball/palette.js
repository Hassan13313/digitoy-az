/* MASQUERADE BALL — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { BG: '#1A0B1E', BG2: '#26112C', INK: '#F6EEE4', ACCENT: '#D8B15A', MUTE: '#BFA9C2' }

/* Ad uzunluğuna görə ölçü */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(40px, 12vw, 56px)' : 'clamp(34px, 10vw, 46px)'
  if (n <= 18) return big ? 'clamp(32px, 9.4vw, 44px)' : 'clamp(28px, 8vw, 38px)'
  return big ? 'clamp(26px, 7.6vw, 36px)' : 'clamp(22px, 6.4vw, 30px)'
}
