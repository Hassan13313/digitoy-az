/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE ANALYTICS — infrastruktur (hələ GÖNDƏRMİR).

   ⚠ Bu qatda hadisələr QƏSDƏN göndərilmir: `TEMPLATE_ANALYTICS_ENABLED = false`.
   Struktur hazırdır — bayraq true olan kimi bütün hadisələr mövcud
   `utils/analytics.js` (GA4 + PostHog) üzərindən axmağa başlayır.

   TODO (Phase 5): bayrağı true et və GA4-də `template_*` hadisələrini
   konversiya kimi qeyd et. Payload həmişə `SAFE_KEYS` allowlist-dən keçir —
   PII göndərilmir (yalnız template_id / status / category / source).
   ───────────────────────────────────────────────────────────────────────── */

import { trackEvent } from '../utils/analytics'
import { getTemplateConfig } from './templateConfig'

/* Bayraq true olana qədər heç nə göndərilmir */
export const TEMPLATE_ANALYTICS_ENABLED = false

/* Hadisə adları — tək mənbə, UI-larda string hardcode edilmir */
export const TEMPLATE_EVENTS = {
  VIEW:      'template_view',       /* şablon dəvətnamədə render olundu       */
  SELECTED:  'template_selected',   /* builder-də kart seçildi                */
  PREVIEWED: 'template_previewed',  /* builder-dən önbaxış açıldı             */
  FALLBACK:  'template_fallback',   /* etibarsız id → default şablona düşdü   */
  ERROR:     'template_error',      /* şablon render zamanı çökdü             */
}

/** Hadisə payload-ı — yalnız PII olmayan metadata */
function buildPayload(templateId, extra = {}) {
  const cfg = getTemplateConfig(templateId)
  return {
    template_id: templateId || 'unknown',
    template_status: cfg?.status || 'unknown',
    template_category: cfg?.category || 'unknown',
    template_version: cfg?.version ?? 0,
    ...extra,
  }
}

/**
 * Şablon hadisəsi göndər (bayraq bağlıdırsa no-op).
 * @param {string} event    TEMPLATE_EVENTS-dən biri
 * @param {string} templateId
 * @param {object} extra    əlavə PII-siz sahələr (məs. { source: 'builder' })
 */
export function trackTemplateEvent(event, templateId, extra = {}) {
  if (!TEMPLATE_ANALYTICS_ENABLED) return   /* TODO: Phase 5-də aç */
  trackEvent(event, buildPayload(templateId, extra))
}

/* ── Rahat köməkçilər (çağırış yerlərində hadisə adı yazılmasın) ── */
export const trackTemplateView      = (id, extra) => trackTemplateEvent(TEMPLATE_EVENTS.VIEW, id, extra)
export const trackTemplateSelected  = (id, extra) => trackTemplateEvent(TEMPLATE_EVENTS.SELECTED, id, extra)
export const trackTemplatePreviewed = (id, extra) => trackTemplateEvent(TEMPLATE_EVENTS.PREVIEWED, id, extra)
export const trackTemplateFallback  = (requestedId, resolvedId) =>
  trackTemplateEvent(TEMPLATE_EVENTS.FALLBACK, resolvedId, { requested_id: String(requestedId || 'empty') })
export const trackTemplateError     = (id, reason) =>
  trackTemplateEvent(TEMPLATE_EVENTS.ERROR, id, { reason: String(reason || '').slice(0, 80) })
