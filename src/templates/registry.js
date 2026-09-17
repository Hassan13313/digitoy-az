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
