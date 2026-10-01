/* ── Analitika hadisə növbəsi (Phase 46.1) ──
   posthog-js asinxron yüklənir, amma ilk $pageview / landing_view mount anında
   gəlir. Hədəf hazır olana qədər hadisələr burada gözləyir, attach() ilə
   ardıcıllıqla göndərilir. Limit yaddaşın sonsuz böyüməsinin qarşısını alır. */
export function createEventBuffer(limit = 50) {
  let target = null
  let queue = []
  return {
    capture(name, props) {
      if (target) target.capture(name, props)
      else if (queue.length < limit) queue.push([name, props])
    },
    attach(t) {
      target = t
      for (const [name, props] of queue) t.capture(name, props)
      queue = []
    },
    drop() { queue = [] },
    get size() { return queue.length },
  }
}
