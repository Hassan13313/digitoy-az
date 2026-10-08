/* ─────────────────────────────────────────────────────────────────────────────
   Şablon kartlarının REAL ekran şəkilləri (UI redesign 2026-10).
   Fayllar: public/img/templates/<id>.webp — 780×1688 (390×844 telefon, DPR 2),
   dəvətnamənin açılışdan sonrakı ilk ekranı.

   ⚠ Yeni şablon əlavə olunanda şəkli yoxdursa kart BOŞ QALMIR: bu funksiya
   null qaytarır və komponent rəng/şriftdən qurulan miniatürü göstərir.
   Şəkil əlavə etmək = faylı public/img/templates/-ə qoymaq + id-ni bura yazmaq.
   ───────────────────────────────────────────────────────────────────────── */
const WITH_IMAGE = new Set([
  'royal-gold', 'oriental-luxe', 'white-elegance', 'vinyl-record', 'royal-palace', 'crystal-glass',
  'luxury-jewelry', 'nature-touch', 'floral-garden', 'boarding-pass', 'cinema-premiere', 'gazette',
  'mediterranean', 'modern-black', 'night-sky', 'simple-luxury',
])

export const TEMPLATE_IMAGE_SIZE = { width: 780, height: 1688 }

export function templateImage(id) {
  return WITH_IMAGE.has(id) ? `/img/templates/${id}.webp` : null
}
