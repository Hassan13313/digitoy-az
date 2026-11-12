/* İLK RƏQS — rənglər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  GECE: '#120E16', GECE_2: '#1B1520', SAMPAN: '#EAD7B7', FISHENG: '#F5C66B', GUL: '#C98B8B', BOZ: '#9C93A0',
}

/* Ad uzunluğuna görə ölçü (Luxurious Script) */
export function nameSize(text, big = false) {
  const n = Array.from(String(text || '')).length
  if (n <= 12) return big ? 'clamp(62px, 18vw, 96px)' : 'clamp(52px, 15.5vw, 82px)'
  if (n <= 18) return big ? 'clamp(48px, 13.6vw, 70px)' : 'clamp(42px, 12vw, 60px)'
  return big ? 'clamp(38px, 10.4vw, 52px)' : 'clamp(34px, 9.2vw, 46px)'
}
