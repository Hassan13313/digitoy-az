/* ── Analitika hadisə növbəsi (Phase 46.1) ──
   posthog-js asinxron yüklənir, amma ilk $pageview / landing_view mount anında
   gəlir. Hədəf hazır olana qədər hadisələr burada gözləyir, attach() ilə
   ardıcıllıqla göndərilir. Limit yaddaşın sonsuz böyüməsinin qarşısını alır.

   Phase 47 — razılıq: block() növbəni boşaldır və hədəf qoşulu olsa belə yeni
   hadisələri ATIR (istifadəçi imtina edib və ya dəvətnamə səhifəsində razılıq
   yoxdur). unblock() yenidən qəbul edir. */
export function createEventBuffer(limit = 50) {
  let target = null
  let queue = []
  let blocked = false
  return {
    capture(name, props) {
      if (blocked) return
      if (target) target.capture(name, props)
      else if (queue.length < limit) queue.push([name, props])
    },
    attach(t) {
      target = t
      for (const [name, props] of queue) t.capture(name, props)   /* bloklu ikən növbə onsuz da boşdur */
      queue = []
    },
    block() { blocked = true; queue = [] },
    unblock() { blocked = false },
    get blocked() { return blocked },
    get size() { return queue.length },
  }
}
