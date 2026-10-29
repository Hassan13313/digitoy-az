/* ─────────────────────────────────────────────────────────────────────────────
   Şablon kartlarının REAL ekran şəkilləri (UI redesign 2026-10).
   Fayllar: public/img/templates/<id>.webp — 780×1688 (390×844 telefon, DPR 2),
   dəvətnamənin açılışdan sonrakı ilk ekranı.
   2026-10: premium redizayndan sonra 20 şəklin hamısı yenidən çəkildi
   (şablonun öz demo datası ilə, uşaq şablonları uşaq ad günü demosu ilə).

   ⚠ Yeni şablon əlavə olunanda şəkli yoxdursa kart BOŞ QALMIR: bu funksiya
   null qaytarır və komponent rəng/şriftdən qurulan miniatürü göstərir.
   Şəkil əlavə etmək = faylı public/img/templates/-ə qoymaq + id-ni bura yazmaq.
   ───────────────────────────────────────────────────────────────────────── */
const WITH_IMAGE = new Set([
  'royal-gold', 'oriental-luxe', 'white-elegance', 'vinyl-record', 'royal-palace', 'crystal-glass',
  'luxury-jewelry', 'nature-touch', 'floral-garden', 'boarding-pass', 'cinema-premiere', 'gazette',
  'mediterranean', 'modern-black', 'night-sky', 'simple-luxury',
  /* 2026-10 — «Uşaq ad günü» konsepti */
  'fairy-tale', 'space-mission', 'circus-show', 'dino-adventure', 'balloon-party',
  /* 2026-10 — «Xına gecəsi» konsepti */
  'red-veil',
  'xonca',
  'henna-buta',
  'mirror-candle',
  'kelagayi',
])

export const TEMPLATE_IMAGE_SIZE = { width: 780, height: 1688 }

export function templateImage(id) {
  return WITH_IMAGE.has(id) ? `/img/templates/${id}.webp` : null
}
