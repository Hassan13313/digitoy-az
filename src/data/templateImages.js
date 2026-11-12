import { isMultiConcept } from '../templates/templateConfig.js'

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
  /* 2026-11 — «Viral video» toy seriyası */
  'candle-rings',
  'bridal-veil',
  'first-dance',
  /* 2026-11 — lüks toy seriyası */
  'ivory-silk',
  'baku-night',
  'golden-hour',
  'shahdag',
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
  /* 2026-10 — «Qız gecəsi» konsepti */
  'pink-champagne',
  'disco-ball',
  'pajama-spa',
  'paris-night',
  'boho-sunset',
])

export const TEMPLATE_IMAGE_SIZE = { width: 780, height: 1688 }

/* Şəkli EYNİ adla yenilənən şablonlar: şəkillər 1 il keşlənir (.htaccess), sorğu
   parametri olmasa əvvəl baxan brauzer köhnə şəkli göstərərdi. Şəkli dəyişəndə rəqəmi artırın. */
/* 2026-11-12 (axşam): köhnə 16 toy dizaynından 15-i foto redizayn (Simple Luxury istisna) — yeni üz qabıqları;
   toy + ad günü dizaynlarının «--birthday» şəkilləri də yeniləndi (eyni rəqəm).
   2026-11-12: Bakı Gecəsi, Golden Hour, Alpine Luxe, Şam və Üzük, İlk Rəqs (fişənglər altında, reqs-2) — yeni üz qabığı (Gəlin üslubu: yuxarıda foto, adlar aşağıda).
   Ivory Silk patch-dəki orijinal kompozisiyadadır (istifadəçi qaytardı), yalnız yazı «Toy mərasiminə dəvət». */
const IMAGE_REV = { 'royal-palace': 2, 'oriental-luxe': 2, 'night-sky': 2, 'mediterranean': 2, 'crystal-glass': 2, 'gazette': 2, 'royal-gold': 2, 'luxury-jewelry': 2, 'floral-garden': 2, 'white-elegance': 2, 'nature-touch': 2, 'vinyl-record': 2, 'cinema-premiere': 2, 'boarding-pass': 2, 'modern-black': 2, 'ivory-silk': 3, 'candle-rings': 3, 'bridal-veil': 2, 'first-dance': 3, 'baku-night': 2, 'golden-hour': 2, shahdag: 2 }

export function templateImage(id, concept = null) {
  /* Ad günü bölməsindəki versiyanın öz şəkli var — tək nəfərin adı ilə */
  if (concept === 'birthday' && isMultiConcept(id)) return `/img/templates/${id}--birthday.webp${IMAGE_REV[id] ? `?v=${IMAGE_REV[id]}` : ''}`
  if (!WITH_IMAGE.has(id)) return null
  return `/img/templates/${id}.webp${IMAGE_REV[id] ? `?v=${IMAGE_REV[id]}` : ''}`
}
