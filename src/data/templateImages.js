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
  /* 2026-10 — «Sünnət toyu» konsepti */
  'little-prince',
  'hero-comic',
  'mashallah',
  'little-pilot',
  'football-star',
  /* 2026-10 — «Baby shower» konsepti */
  'pastel-bloom',
  'teddy-bear',
  'gender-reveal',
  'stork-letter',
  'baby-mobile',
  /* 2026-10 — «Korporativ» konsepti */
  'gala-night',
  'keynote',
  'award-night',
  'business-card',
  'neon-party',
  /* 2026-10 — «İldönümü» konsepti */
  'silver-locket',
  'golden-jubilee',
  'first-paper',
  'retro-polaroid',
  'love-letters',
  /* 2026-10 — «Məzuniyyət» konsepti */
  'caps-toss',
  'yearbook',
  'last-bell',
  'chalkboard',
  'paper-plane',
  /* 2026-10 — «Açılış və təqdimat» konsepti */
  'ribbon-cut',
  'bistro-sign',
  'roller-shutter',
  'unboxing',
  'gallery-unveil',
  /* 2026-10 — «Bayram gecələri» konsepti */
  'novruz-bonfire',
  'novruz-semeni',
  'midnight-clock',
  'snow-globe',
  'masquerade-ball',
])

export const TEMPLATE_IMAGE_SIZE = { width: 780, height: 1688 }

export function templateImage(id) {
  return WITH_IMAGE.has(id) ? `/img/templates/${id}.webp` : null
}
