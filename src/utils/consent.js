/* ══════════════════════════════════════════════════════════════════════════
   Phase 47 — kuki/analitika razılığı: TƏK mənbə.

   Saf modul (import.meta yoxdur) → tests/consent_test.mjs Node-da yoxlayır.
   Brauzerdə `consent` tək nüsxədir: ConsentBanner onu useSyncExternalStore
   ilə oxuyur, analytics.js abunə olur, App.jsx cari view/dili ötürür.

   Saxlama: localStorage `digitoy_consent` = {"v":1,"s":"granted|denied","t":ms}.
   365 gündən köhnə, başqa versiya və ya pozulmuş dəyər → yenidən soruşulur.
   localStorage bağlıdırsa (gizli rejim) seçim yalnız bu səhifə üçün qalır.
   ══════════════════════════════════════════════════════════════════════ */

export const CONSENT_KEY = 'digitoy_consent'
export const CONSENT_VERSION = 1
export const CONSENT_MAX_AGE_MS = 365 * 86400000

/* Banner YALNIZ bu view-larda çıxır (Həsənin qərarı, 2026-10-06): qonaqların
   açdığı dəvətnamə səhifələrində çıxmır, orada analitika yalnız əvvəlcədən
   razılıq verilibsə işləyir. Qonaq səhifələrində də soruşmaq üçün bu siyahıya
   'invite', 'photo', 'gallery-page', 'slideshow' əlavə et. */
export const CONSENT_PROMPT_VIEWS = ['landing', 'invitation', 'demo', 'templates', 'template-preview', 'legal', 'not-found']

const STATUSES = ['granted', 'denied']

/** localStorage → try/catch; əlçatmazdırsa yaddaşda (Map) saxlanılır. */
export function safeStorage(getter = () => globalThis.localStorage) {
  const mem = new Map()
  let ls = null
  try { ls = getter() || null } catch { ls = null }
  return {
    get(k) {
      try { if (ls) return ls.getItem(k) } catch { /* bloklanıb */ }
      return mem.has(k) ? mem.get(k) : null
    },
    set(k, v) {
      mem.set(k, v)
      try { ls?.setItem(k, v) } catch { /* gizli rejim */ }
    },
  }
}

export function readStatus(storage, now) {
  try {
    const v = JSON.parse(storage.get(CONSENT_KEY) || 'null')
    if (!v || v.v !== CONSENT_VERSION || !STATUSES.includes(v.s)) return 'unknown'
    if (!Number.isFinite(v.t) || now - v.t >= CONSENT_MAX_AGE_MS || v.t > now + 86400000) return 'unknown'
    return v.s
  } catch { return 'unknown' }
}

export function createConsentStore({ storage = safeStorage(), now = () => Date.now() } = {}) {
  let status = readStatus(storage, now())
  let view = 'loading'
  let lang = 'az'
  let settingsOpen = false
  const subs = new Set()

  /* 'loading' da soruşula bilən sayılır (hadisələr gözləyir): uşaq komponentin
     effekti (məs. LandingPage-in landing_view-u) App view-u ötürməzdən ƏVVƏL işləyir. */
  const build = () => {
    const prompt = CONSENT_PROMPT_VIEWS.includes(view)
    return {
      status, lang,
      promptable: prompt || view === 'loading',
      showBanner: prompt && (status === 'unknown' || settingsOpen),
    }
  }
  let snap = build()
  /* Görünən heç nə dəyişməyibsə (məs. qərardan sonra səhifə keçidi) bildiriş yoxdur */
  const emit = () => {
    const next = build()
    if (Object.keys(next).every((k) => next[k] === snap[k])) return
    snap = next
    subs.forEach((f) => f())
  }

  return {
    getSnapshot: () => snap,
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn) },
    setStatus(s) {
      if (!STATUSES.includes(s)) return
      status = s
      settingsOpen = false
      storage.set(CONSENT_KEY, JSON.stringify({ v: CONSENT_VERSION, s, t: now() }))
      emit()
    },
    setContext({ view: v = view, lang: l = lang } = {}) {
      if (v === view && l === lang) return
      view = v
      lang = l
      emit()
    },
    openSettings() { settingsOpen = true; emit() },
  }
}

/* Brauzer üçün tək nüsxə */
export const consent = createConsentStore()
