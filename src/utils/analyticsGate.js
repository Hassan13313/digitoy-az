/* ══════════════════════════════════════════════════════════════════════════
   Phase 47 — analitika qapısı: GA4 və PostHog YALNIZ razılıqdan sonra.

   Saf modul (yükləyicilər çağırandan gəlir) → tests/analytics_gate_test.mjs.
     unknown + soruşula bilən səhifə → hadisələr növbədə gözləyir (≤ limit);
                                       «Qəbul et» olsa göndərilir, yoxsa atılır
     unknown + dəvətnamə səhifəsi     → atılır, heç nə yüklənmir
     granted                          → skriptlər BİR DƏFƏ yüklənir, növbə gedir
     denied                           → hər şey atılır; əvvəl yüklənibsə optOut()
   ══════════════════════════════════════════════════════════════════════ */

import { createEventBuffer } from './eventBuffer.js'

/**
 * @param {object} o
 * @param {() => ({capture:Function}|null)} o.loadGA
 * @param {() => Promise<{capture:Function}|null>} o.loadPostHog
 * @param {() => void} o.optOut          imtina: izləməni dayandır, kukiləri sil
 * @param {() => void} o.optIn           imtinadan sonra yenidən qəbul
 */
export function createAnalyticsGate({ loadGA, loadPostHog, optOut, optIn, limit = 50 }) {
  const ga = createEventBuffer(limit)
  const ph = createEventBuffer(limit)
  const dead = new Set()   /* yüklənə bilməyən hədəf — həmişəlik bloklu */
  let loaded = false
  let optedOut = false

  const setBlocked = (b) => {
    for (const buf of [ga, ph]) (b || dead.has(buf) ? buf.block() : buf.unblock())
  }
  const fail = (buf) => { dead.add(buf); buf.block() }

  function load() {
    loaded = true
    let g
    try { g = loadGA() } catch { g = null }
    if (g) ga.attach(g); else fail(ga)
    Promise.resolve()
      .then(loadPostHog)
      .then((p) => {
        if (!p) return fail(ph)
        ph.attach(p)
        if (optedOut) optOut()   /* yüklənərkən imtina edilib — yeni yaranan identifikator da silinsin */
      }, () => fail(ph))
  }

  return {
    apply({ status, promptable }) {
      if (status === 'granted') {
        setBlocked(false)
        if (optedOut) { optedOut = false; optIn() }
        if (!loaded) load()
        return
      }
      if (status === 'denied') {
        setBlocked(true)
        if (loaded && !optedOut) { optedOut = true; optOut() }
        return
      }
      setBlocked(!promptable)
    },
    pageView(path, origin) {
      ga.capture('page_view', { page_path: path })
      ph.capture('$pageview', { $current_url: `${origin}${path}` })
    },
    event(name, props) {
      ga.capture(name, props)
      ph.capture(name, props)
    },
    get state() { return { loaded, optedOut, ga: ga.size, ph: ph.size, blocked: ga.blocked && ph.blocked } },
  }
}
