/* ─────────────────────────────────────────────────────────────────────────────
   KUKİ RAZILIĞI (Phase 47) — src/utils/consent.js

   • localStorage bağlı/xətalı olsa sayt sınmır;
   • seçim 365 gün saxlanılır, köhnə/pozulmuş dəyər yenidən soruşulur;
   • banner yalnız əsas saytda çıxır — dəvətnamə, foto, qalereya, slayd və
     admin səhifələrində çıxmır (Həsənin qərarı, 2026-10-06);
   • «Kuki ayarları» qərar verilmiş olsa da banneri yenidən açır.

   İşə salmaq: node tests/consent_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { createConsentStore, safeStorage, readStatus, CONSENT_KEY, CONSENT_PROMPT_VIEWS } from '../src/utils/consent.js'

let fail = 0
let pass = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; return }
  console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++
}
const memLs = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), m } }
const DAY = 86400000
const NOW = Date.UTC(2026, 9, 6)

/* ── 1. Yaddaş xətaları ── */
{
  const throwing = safeStorage(() => ({ getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }))
  const s = createConsentStore({ storage: throwing, now: () => NOW })
  ok('bloklu localStorage → unknown, xəta yoxdur', s.getSnapshot().status === 'unknown')
  s.setStatus('granted')
  ok('bloklu localStorage → seçim bu səhifədə qalır', s.getSnapshot().status === 'granted')
  ok('getter özü xəta atsa da işləyir', safeStorage(() => { throw new Error('x') }).get('a') === null)
}

/* ── 2. Saxlama və oxuma ── */
{
  const ls = memLs()
  const s = createConsentStore({ storage: safeStorage(() => ls), now: () => NOW })
  s.setStatus('denied')
  const saved = JSON.parse(ls.m.get(CONSENT_KEY))
  ok('formatı: {v:1, s, t}', saved.v === 1 && saved.s === 'denied' && saved.t === NOW)
  const again = createConsentStore({ storage: safeStorage(() => ls), now: () => NOW + 10 * DAY })
  ok('yenidən açılanda seçim qalır', again.getSnapshot().status === 'denied')
  s.setStatus('bəlkə')
  ok('yanlış status qəbul edilmir', s.getSnapshot().status === 'denied')
}
{
  const st = (raw, now = NOW) => readStatus({ get: () => raw }, now)
  ok('365 gündən köhnə → unknown', st(JSON.stringify({ v: 1, s: 'granted', t: NOW - 366 * DAY })) === 'unknown')
  ok('364 günlük → qüvvədədir', st(JSON.stringify({ v: 1, s: 'granted', t: NOW - 364 * DAY })) === 'granted')
  ok('başqa versiya → unknown', st(JSON.stringify({ v: 2, s: 'granted', t: NOW })) === 'unknown')
  ok('pozulmuş JSON → unknown', st('{oops') === 'unknown')
  ok('gələcək tarix → unknown', st(JSON.stringify({ v: 1, s: 'granted', t: NOW + 30 * DAY })) === 'unknown')
  ok('boş → unknown', st(null) === 'unknown')
}

/* ── 3. Banner harada çıxır ── */
{
  const s = createConsentStore({ storage: safeStorage(() => memLs()), now: () => NOW })
  ok('yüklənərkən çıxmır, amma hadisələr gözləyə bilər', !s.getSnapshot().showBanner && s.getSnapshot().promptable)
  for (const v of ['landing', 'legal', 'not-found', 'templates', 'demo']) {
    s.setContext({ view: v })
    ok(`banner çıxır: ${v}`, s.getSnapshot().showBanner)
  }
  for (const v of ['invite', 'photo', 'gallery-page', 'slideshow', 'admin-panel', 'admin-login', 'admin-review', 'live-preview', 'invite-disabled', 'invite-not-found']) {
    s.setContext({ view: v })
    ok(`banner çıxmır: ${v}`, !s.getSnapshot().showBanner && !s.getSnapshot().promptable)
  }
  ok('siyahıda dəvətnamə view-ları yoxdur', !CONSENT_PROMPT_VIEWS.some((v) => ['invite', 'photo', 'gallery-page', 'slideshow'].includes(v)))
  s.setContext({ view: 'landing' })
  s.setStatus('granted')
  ok('qərardan sonra gizlənir', !s.getSnapshot().showBanner)
  s.openSettings()
  ok('«Kuki ayarları» yenidən açır', s.getSnapshot().showBanner)
  s.setStatus('denied')
  ok('seçim edəndə bağlanır', !s.getSnapshot().showBanner && s.getSnapshot().status === 'denied')
  s.setContext({ lang: 'ru' })
  ok('dil ötürülür', s.getSnapshot().lang === 'ru')
}

/* ── 4. Abunə və sabit snapshot (useSyncExternalStore tələbi) ── */
{
  const s = createConsentStore({ storage: safeStorage(() => memLs()), now: () => NOW })
  let calls = 0
  const off = s.subscribe(() => { calls++ })
  const a = s.getSnapshot()
  ok('dəyişiklik olmadan eyni obyekt', a === s.getSnapshot())
  s.setContext({ view: 'loading', lang: 'az' })
  ok('eyni kontekst → bildiriş yoxdur', calls === 0 && a === s.getSnapshot())
  s.setContext({ view: 'landing' })
  ok('dəyişiklik → yeni obyekt + bildiriş', calls === 1 && a !== s.getSnapshot())
  s.setContext({ view: 'templates' })
  ok('banner vəziyyəti dəyişməyən keçid → bildiriş yoxdur', calls === 1)
  s.setContext({ view: 'invite' })
  ok('soruşulmayan səhifəyə keçid → bildiriş var', calls === 2)
  off()
  s.setStatus('granted')
  ok('abunədən çıxandan sonra bildiriş gəlmir', calls === 2)
}

console.log(fail ? `\n${pass} ok, ${fail} FAIL` : `\nconsent: ${pass} yoxlama keçdi`)
process.exit(fail ? 1 : 0)
