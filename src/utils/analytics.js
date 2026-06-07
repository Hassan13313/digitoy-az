/* ── Analytics Foundation (GA4 + PostHog) ──────────────────────────────────
   Lazy-loaded, env-var based, production-safe behavioral analytics.
   No measurement IDs are hardcoded — everything comes from VITE_ env vars,
   and nothing loads or sends data unless those vars are present AND the app
   is running in a production build.

   PRIVACY: only behavioral data ever leaves this module. See SAFE_KEYS below —
   any property not on that allowlist is silently dropped before it reaches
   GA4 or PostHog. Never pass names, phone numbers, dates, venues, guest
   names or message text into trackEvent().                                */

const GA_ID         = import.meta.env.VITE_GA_MEASUREMENT_ID || ''
const POSTHOG_KEY   = import.meta.env.VITE_POSTHOG_KEY || ''
const POSTHOG_HOST  = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

const ANALYTICS_ENABLED = import.meta.env.PROD

let gaReady   = false
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

function loadGA() {
  if (!GA_ID || gaReady || typeof document === 'undefined') return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  /* SPA-da page_view-u biz özümüz göndəririk — avtomatik ikiqat hesablamanın qarşısı */
  window.gtag('config', GA_ID, { send_page_view: false })
  gaReady = true
}

async function loadPostHog() {
  if (!POSTHOG_KEY || posthog) return
  try {
    const mod = await import('posthog-js')
    const ph = mod.default
    ph.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      autocapture: false,
      persistence: 'localStorage+cookie',
    })
    posthog = ph
  } catch {
    /* PostHog yüklənmədi (şəbəkə/CDN problemi) — sayt analitika olmadan davam edir */
  }
}

/* ── App mount-da bir dəfə çağırılır ── */
export function initAnalytics() {
  if (initDone) return
  initDone = true
  if (!ANALYTICS_ENABLED) return
  loadGA()
  loadPostHog()
}

/* ── SPA route dəyişəndə səhifə baxışını göndərir ── */
export function trackPageView(path) {
  if (!ANALYTICS_ENABLED || !path) return
  if (gaReady && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path })
  }
  if (posthog) {
    posthog.capture('$pageview', { $current_url: `${window.location.origin}${path}` })
  }
}

/* ── Davranış hadisələri — yalnız sanitize edilmiş (PII-siz) sahələr göndərilir ── */
export function trackEvent(name, properties = {}) {
  if (!ANALYTICS_ENABLED || !name) return
  const safe = sanitize(properties)
  if (gaReady && window.gtag) {
    window.gtag('event', name, safe)
  }
  if (posthog) {
    posthog.capture(name, safe)
  }
}
