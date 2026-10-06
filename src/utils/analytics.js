/* ── Analytics Foundation (GA4 + PostHog) ──────────────────────────────────
   Lazy-loaded, env-var based, production-safe behavioral analytics.
   No measurement IDs are hardcoded — everything comes from VITE_ env vars,
   and nothing loads or sends data unless those vars are present AND the app
   is running in a production build.

   PRIVACY: only behavioral data ever leaves this module. See SAFE_KEYS below —
   any property not on that allowlist is silently dropped before it reaches
   GA4 or PostHog. Never pass names, phone numbers, dates, venues, guest
   names or message text into trackEvent().

   CONSENT (Phase 47): nothing loads until the visitor clicks «Qəbul et» in the
   cookie banner (utils/consent.js). The gate (utils/analyticsGate.js) queues
   early events on the main site, drops them on invitation pages without
   consent, and opts out + clears analytics cookies if consent is withdrawn. */

import { createAnalyticsGate } from './analyticsGate'
import { consent } from './consent'

const GA_ID         = import.meta.env.VITE_GA_MEASUREMENT_ID || ''
const POSTHOG_KEY   = import.meta.env.VITE_POSTHOG_KEY || ''
const POSTHOG_HOST  = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

const ANALYTICS_ENABLED = import.meta.env.PROD && !!(GA_ID || POSTHOG_KEY)

let posthog   = null
let initDone  = false

/* Yalnız bu açarlar göndərilə bilər — istənilən başqa sahə susdurulur.
   Davranış məlumatları (paket, dil, addım, status...) — şəxsi məlumat yox. */
const SAFE_KEYS = new Set([
  'lang', 'package', 'step', 'view', 'event_type', 'status',
  'count', 'path', 'has_results', 'query_length', 'source', 'palette',
])

function sanitize(props = {}) {
  const out = {}
  for (const key of Object.keys(props)) {
    if (!SAFE_KEYS.has(key)) continue
    const value = props[key]
    const kind = typeof value
    if (value === null || value === undefined) continue
    if (kind !== 'string' && kind !== 'number' && kind !== 'boolean') continue
    out[key] = value
  }
  return out
}

/* ── Yükləyicilər — YALNIZ razılıqdan sonra çağırılır (analyticsGate) ── */
function loadGA() {
  if (!GA_ID || typeof document === 'undefined') return null
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  /* SPA-da page_view-u biz özümüz göndəririk — avtomatik ikiqat hesablamanın qarşısı */
  window.gtag('config', GA_ID, { send_page_view: false })
  return { capture: (name, props) => window.gtag('event', name, props) }
}

async function loadPostHog() {
  if (!POSTHOG_KEY) return null
  const mod = await import('posthog-js')
  const ph = mod.default
  ph.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    autocapture: false,
    /* Məxfilik siyasəti yalnız səhifə baxışı + əsas addımları vəd edir */
    disable_session_recording: true,
    persistence: 'localStorage+cookie',
  })
  posthog = ph
  /* Yalnız razılıqdan sonra yüklənir: əvvəlki imtinanın PostHog bayrağı qalıbsa götür.
     Yüklənərkən imtina edilibsə analyticsGate özü optOut() çağırır. */
  if (ph.has_opted_out_capturing?.()) ph.opt_in_capturing()
  return ph
}

/* İmtina: izləmə dayanır, analitika kukiləri və PostHog identifikatoru silinir.
   PostHog-un öz imtina bayrağına (__ph_opt_in_out_*) toxunulmur. */
function optOut() {
  try { posthog?.opt_out_capturing() } catch { /* yüklənməyib */ }
  if (GA_ID) window[`ga-disable-${GA_ID}`] = true
  try {
    const host = window.location.hostname
    const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0].trim()
      if (!/^(_ga|_gid|ph_)/.test(name)) continue
      for (const d of domains) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ''}`
      }
    }
  } catch { /* kuki bağlıdır */ }
  try {
    for (const k of Object.keys(window.localStorage)) {
      if (/^ph_.*_posthog$/.test(k)) window.localStorage.removeItem(k)
    }
  } catch { /* localStorage bağlıdır */ }
}

function optIn() {
  if (GA_ID) window[`ga-disable-${GA_ID}`] = false
  try { posthog?.opt_in_capturing() } catch { /* yüklənməyib */ }
}

const gate = createAnalyticsGate({ loadGA, loadPostHog, optOut, optIn })

/* ── App mount-da bir dəfə çağırılır: razılığa abunə olur ── */
export function initAnalytics() {
  if (initDone || !ANALYTICS_ENABLED) return
  initDone = true
  gate.apply(consent.getSnapshot())
  consent.subscribe(() => gate.apply(consent.getSnapshot()))
}

/* ── SPA route dəyişəndə səhifə baxışını göndərir ── */
export function trackPageView(path) {
  if (!ANALYTICS_ENABLED || !path) return
  gate.pageView(path, window.location.origin)
}

/* ── Davranış hadisələri — yalnız sanitize edilmiş (PII-siz) sahələr göndərilir ── */
export function trackEvent(name, properties = {}) {
  if (!ANALYTICS_ENABLED || !name) return
  gate.event(name, sanitize(properties))
}
