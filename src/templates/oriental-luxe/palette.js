/* ORIENTAL LUXE — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = { NAR: '#4A0F1C', DEEP: '#2A0710', GOLD: '#D9B36C', IVORY: '#F3E4C4', MUTE: '#CDA88E' }

/* Ad uzunluğuna görə ölçü (Reem Kufi) */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(44px, 13vw, 60px)' : 'clamp(38px, 11vw, 50px)'
  if (n <= 18) return big ? 'clamp(38px, 11vw, 50px)' : 'clamp(32px, 9vw, 42px)'
  return big ? 'clamp(32px, 9vw, 42px)' : 'clamp(26px, 7.4vw, 34px)'
}
