import { lazy } from 'react'
import SimpleLuxuryTemplate from './simple-luxury'
import TemplateScaffold from './_shared/TemplateScaffold'
import { DEFAULT_TEMPLATE_ID } from './templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE REGISTRY — id → React komponent.

   ⚠ simple-luxury QƏSDƏN statik import edilib: o, bütün mövcud müştərilərin
   default şablonudur (köhnə Digitoy dəvətnaməsi), lazy olsaydı ilk render-də
   əlavə chunk gözləntisi yaranardı. Qalan şablonlar lazy — bundle-a təsir
   etmirlər.

   Reyestrdə (templateConfig) olub burada komponenti olmayan şablonlar
   TemplateScaffold ilə render olunur (yalnız /demo preview-də əlçatandır).
   ───────────────────────────────────────────────────────────────────────── */
const COMPONENTS = {
  'simple-luxury':  SimpleLuxuryTemplate,
  'royal-gold':     lazy(() => import('./royal-gold')),
  'floral-garden':  lazy(() => import('./floral-garden')),
  'modern-black':   lazy(() => import('./modern-black')),
  'white-elegance': lazy(() => import('./white-elegance')),
  'night-sky':      lazy(() => import('./night-sky')),
  'oriental-luxe':  lazy(() => import('./oriental-luxe')),
  'nature-touch':   lazy(() => import('./nature-touch')),
  'crystal-glass':  lazy(() => import('./crystal-glass')),
  /* Phase 41 — Claude Design «Seçilmiş 7» dəsti (hamısı lazy) */
  'boarding-pass':   lazy(() => import('./boarding-pass')),
  'cinema-premiere': lazy(() => import('./cinema-premiere')),
  'vinyl-record':    lazy(() => import('./vinyl-record')),
  'royal-palace':    lazy(() => import('./royal-palace')),
  'mediterranean':   lazy(() => import('./mediterranean')),
  'gazette':         lazy(() => import('./gazette')),
  'luxury-jewelry':  lazy(() => import('./luxury-jewelry')),
  /* 2026-10 — «Uşaq ad günü» konsepti */
  'fairy-tale':      lazy(() => import('./fairy-tale')),
  'space-mission':   lazy(() => import('./space-mission')),
  'circus-show':     lazy(() => import('./circus-show')),
  'dino-adventure':  lazy(() => import('./dino-adventure')),
  'balloon-party':   lazy(() => import('./balloon-party')),
  /* 2026-10 — «Xına gecəsi» konsepti */
  'red-veil': lazy(() => import('./red-veil')),
  'xonca': lazy(() => import('./xonca')),
  'henna-buta': lazy(() => import('./henna-buta')),
  'mirror-candle': lazy(() => import('./mirror-candle')),
  'kelagayi': lazy(() => import('./kelagayi')),
  /* 2026-11 — «Viral video» toy seriyası */
  'candle-rings': lazy(() => import('./candle-rings')),
  'bridal-veil': lazy(() => import('./bridal-veil')),
  'first-dance': lazy(() => import('./first-dance')),
  /* 2026-11 — lüks toy seriyası */
  'ivory-silk': lazy(() => import('./ivory-silk')),
  'baku-night': lazy(() => import('./baku-night')),
  'golden-hour': lazy(() => import('./golden-hour')),
  'shahdag': lazy(() => import('./shahdag')),
  /* 2026-10 — «Sünnət toyu» konsepti */
  'little-prince': lazy(() => import('./little-prince')),
  'hero-comic': lazy(() => import('./hero-comic')),
  'mashallah': lazy(() => import('./mashallah')),
  'little-pilot': lazy(() => import('./little-pilot')),
  'football-star': lazy(() => import('./football-star')),
  /* 2026-10 — «Baby shower» konsepti */
  'pastel-bloom': lazy(() => import('./pastel-bloom')),
  'teddy-bear': lazy(() => import('./teddy-bear')),
  'gender-reveal': lazy(() => import('./gender-reveal')),
  'stork-letter': lazy(() => import('./stork-letter')),
  'baby-mobile': lazy(() => import('./baby-mobile')),
  /* 2026-10 — «Korporativ» konsepti */
  'gala-night': lazy(() => import('./gala-night')),
  'keynote': lazy(() => import('./keynote')),
  'award-night': lazy(() => import('./award-night')),
  'business-card': lazy(() => import('./business-card')),
  'neon-party': lazy(() => import('./neon-party')),
  /* 2026-10 — «İldönümü» konsepti */
  'silver-locket': lazy(() => import('./silver-locket')),
  'golden-jubilee': lazy(() => import('./golden-jubilee')),
  'first-paper': lazy(() => import('./first-paper')),
  'retro-polaroid': lazy(() => import('./retro-polaroid')),
  'love-letters': lazy(() => import('./love-letters')),
  /* 2026-10 — «Məzuniyyət» konsepti */
  'caps-toss': lazy(() => import('./caps-toss')),
  'yearbook': lazy(() => import('./yearbook')),
  'last-bell': lazy(() => import('./last-bell')),
  'chalkboard': lazy(() => import('./chalkboard')),
  'paper-plane': lazy(() => import('./paper-plane')),
  /* 2026-10 — «Açılış və təqdimat» konsepti */
  'ribbon-cut': lazy(() => import('./ribbon-cut')),
  'bistro-sign': lazy(() => import('./bistro-sign')),
  'roller-shutter': lazy(() => import('./roller-shutter')),
  'unboxing': lazy(() => import('./unboxing')),
  'gallery-unveil': lazy(() => import('./gallery-unveil')),
  /* 2026-10 — «Bayram gecələri» konsepti */
  'novruz-bonfire': lazy(() => import('./novruz-bonfire')),
  'novruz-semeni': lazy(() => import('./novruz-semeni')),
  'midnight-clock': lazy(() => import('./midnight-clock')),
  'snow-globe': lazy(() => import('./snow-globe')),
  'masquerade-ball': lazy(() => import('./masquerade-ball')),
  /* 2026-10 — «Qız gecəsi» konsepti */
  'pink-champagne': lazy(() => import('./pink-champagne')),
  'disco-ball': lazy(() => import('./disco-ball')),
  'pajama-spa': lazy(() => import('./pajama-spa')),
  'paris-night': lazy(() => import('./paris-night')),
  'boho-sunset': lazy(() => import('./boho-sunset')),
}

/** Şablonun öz komponenti varmı (yoxsa scaffold göstəriləcək)? */
export function hasTemplateComponent(id) {
  return Object.prototype.hasOwnProperty.call(COMPONENTS, id)
}

/** id → komponent. Komponent yoxdursa scaffold, id tamamilə naməlumdursa default. */
export function getTemplateComponent(id) {
  if (COMPONENTS[id]) return COMPONENTS[id]
  return id ? TemplateScaffold : COMPONENTS[DEFAULT_TEMPLATE_ID]
}

export { DEFAULT_TEMPLATE_ID }
