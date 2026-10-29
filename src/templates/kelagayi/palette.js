/* KƏLAĞAYI — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  SILK: '#F7EED9', SILK_D: '#EADCC0', SAFFRON: '#E0A526', SAFFRON_D: '#A8720E',
  CRIMSON: '#9E1F32', CRIMSON_D: '#6E1222', INDIGO: '#24305E', INK: '#1E1A17', MUTED: '#6E5F4E',
}

/* Kəlağayı haşiyəsi — üç rəngli zolaq (çərçivələr və ayırıcılar üçün) */
export const BAND = `linear-gradient(90deg, ${C.CRIMSON} 0 33.3%, ${C.SAFFRON} 33.3% 66.6%, ${C.INDIGO} 66.6% 100%)`

/* İpək parıltısı — üzərindən keçən işıq */
export const SHEEN = 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,.38) 45%, transparent 60%)'

/* Ad uzunluğuna görə ölçü (Playfair Display SC) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(50px, 15vw, 70px)'
  if (n <= 10) return 'clamp(40px, 11.6vw, 54px)'
  if (n <= 16) return 'clamp(30px, 8.6vw, 42px)'
  return 'clamp(24px, 6.8vw, 32px)'
}
