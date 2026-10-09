/* ══════════════════════════════════════════════════════════════════════════
   SPA tarixçəsi (2026-10-09) — brauzerin GERİ düyməsi istifadəçini haradan
   gəldisə ORA (eyni scroll mövqeyinə) qaytarsın.

   • pushView(path, state)  cari girişə scroll mövqeyini yazır, sonra yeni giriş
                            əlavə edir. Yeni giriş `dt: 1` + `from` daşıyır —
                            yəni «əvvəlimdə saytın öz səhifəsi var».
   • goBackOr(fallback, from)  səhifədəki «geri» düymələri: əvvəlki giriş
                            bizimdirsə history.back() (popstate hər şeyi bərpa
                            edir), deyilsə (birbaşa link) fallback().
   • restoreScroll(y)       popstate-dən sonra: səhifə o hündürlüyə çatana qədər
                            bir neçə kadr gözləyib scroll edir — brauzerin öz
                            bərpası view hələ dəyişməmiş (qısa) səhifədə edilir
                            və yarımçıq qalırdı. Yalnız bizim yazdığımız mövqe
                            bərpa olunur; #anker keçidlərinə toxunulmur.
   ══════════════════════════════════════════════════════════════════════ */

const H = () => (typeof window === 'undefined' ? null : window.history)

/** Cari girişin vəziyyətinə scroll mövqeyini (+ `here` sahələrini) yaz; digər sahələr qalır.
    `here.scrollY: null` → mövqe saxlanılmır (məs. builder addımı: qayıdanda addımın başına sürüşülür) */
export function rememberScroll(here = {}) {
  const h = H()
  if (!h) return
  try { h.replaceState({ ...(h.state || {}), scrollY: Math.round(window.scrollY), ...here }, '') } catch { /* təhlükəsiz */ }
}

/** Cari girişin vəziyyətini yenilə — yeni giriş YARATMADAN (görünən mərhələ ilə sinxron) */
export function patchState(fields) {
  const h = H()
  if (!h) return
  try { h.replaceState({ ...(h.state || {}), ...fields }, '') } catch { /* təhlükəsiz */ }
}

/** Cari ünvan (yol + sorğu) — eyni səhifədə mərhələ girişləri üçün */
export const currentUrl = () => window.location.pathname + window.location.search

/** Yeni SPA girişi — əvvəlki girişin scroll mövqeyi (+ `here`, məs. { view }) saxlanılır */
export function pushView(path, state = {}, here = {}) {
  const h = H()
  if (!h) return
  rememberScroll(here)
  try {
    h.pushState({ ...state, dt: 1, from: window.location.pathname }, '', path)
  } catch { /* təhlükəsiz */ }
}

/** Əvvəlki giriş saytın özününkü? `from` verilərsə yol da uyğun gəlməlidir */
export function canGoBackInApp(from) {
  const s = H()?.state
  return !!s?.dt && (!from || s.from === from)
}

export function goBackOr(fallback, from) {
  if (canGoBackInApp(from)) H().back()
  else fallback?.()
}

/** Cari girişdə saxlanılmış scroll mövqeyi (yoxdursa null) */
export function savedScroll() {
  const y = H()?.state?.scrollY
  return Number.isFinite(y) ? y : null
}

/** y-yə sürüşdür; səhifə hələ qısadırsa bir neçə dəfə yenidən cəhd et */
export function restoreScroll(y, { tries = 15, delay = 100 } = {}) {
  if (typeof window === 'undefined') return
  const target = Number.isFinite(y) ? Math.max(0, y) : 0
  let n = 0
  const tick = () => {
    n += 1
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (target > max + 8 && n < tries) { setTimeout(tick, delay); return }
    window.scrollTo({ top: Math.min(target, Math.max(0, max)), behavior: 'auto' })
  }
  requestAnimationFrame(tick)
}
