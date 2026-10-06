/* Phase 46.1 — PostHog hadisə növbəsi
   İşə salma: node tests/event_buffer_test.mjs

   posthog-js dinamik import ilə (asinxron) yüklənir, amma ilk $pageview və
   landing_view mount anında SİNXRON gəlir — posthog hələ null olduğu üçün
   atılırdı. Saytı açıb çıxan ziyarətçi PostHog-da heç görünmürdü. */
import { createEventBuffer } from '../src/utils/eventBuffer.js'

let passed = 0, failed = 0
const ok = (label, cond) => { if (cond) { passed++; console.log('  ok  ', label) } else { failed++; console.log('  FAIL', label) } }
const fakeTarget = () => { const sent = []; return { sent, capture: (n, p) => sent.push([n, p]) } }

{
  const buf = createEventBuffer()
  buf.capture('$pageview', { path: '/' })
  buf.capture('landing_view', { lang: 'az' })
  const t = fakeTarget()
  ok('yüklənmədən əvvəl heç nə itmir', t.sent.length === 0 && buf.size === 2)
  buf.attach(t)
  ok('yüklənəndə növbə ardıcıllıqla göndərilir', JSON.stringify(t.sent) === JSON.stringify([['$pageview', { path: '/' }], ['landing_view', { lang: 'az' }]]))
  ok('növbə boşalır', buf.size === 0)
  buf.capture('demo_opened', { lang: 'en' })
  ok('sonrakı hadisə birbaşa gedir', t.sent.length === 3 && t.sent[2][0] === 'demo_opened' && buf.size === 0)
}

{
  const buf = createEventBuffer(3)
  for (let i = 0; i < 10; i++) buf.capture('e' + i, {})
  ok('limit — yaddaş sonsuz böyümür', buf.size === 3)
  buf.block()
  ok('yükləmə alınmasa növbə atılır', buf.size === 0)
  const t = fakeTarget()
  buf.attach(t)
  ok('atılmış növbə sonradan göndərilmir', t.sent.length === 0)
}

/* Phase 47 — razılıq: imtina və ya dəvətnamədə razılıq yoxdursa hadisələr ATILIR */
{
  const buf = createEventBuffer()
  buf.capture('a', {})
  buf.block()
  ok('block növbəni boşaldır', buf.size === 0 && buf.blocked)
  buf.capture('b', {})
  ok('bloklu ikən növbəyə düşmür', buf.size === 0)
  const t = fakeTarget()
  buf.attach(t)
  ok('bloklu ikən qoşulma heç nə göndərmir', t.sent.length === 0)
  buf.capture('c', {})
  ok('hədəf qoşulu olsa da bloklu hadisə getmir', t.sent.length === 0)
  buf.unblock()
  buf.capture('d', {})
  ok('unblock-dan sonra birbaşa gedir', t.sent.length === 1 && t.sent[0][0] === 'd' && !buf.blocked)
}

console.log(`\n${passed} ok, ${failed} FAIL`)
process.exit(failed ? 1 : 0)
