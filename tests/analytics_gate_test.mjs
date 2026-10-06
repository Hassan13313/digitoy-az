/* ─────────────────────────────────────────────────────────────────────────────
   ANALİTİKA QAPISI (Phase 47) — src/utils/analyticsGate.js

   GA4 və PostHog skriptləri YALNIZ «Qəbul et»dən sonra yüklənməlidir.
   Saxta yükləyicilərlə yoxlanılır: hansı halda nə yüklənir, nə göndərilir,
   nə atılır.

   İşə salmaq: node tests/analytics_gate_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import { createAnalyticsGate } from '../src/utils/analyticsGate.js'

let fail = 0
let pass = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; return }
  console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++
}
const tick = () => new Promise((r) => setTimeout(r, 0))

function setup({ gaFails = false, phFails = false } = {}) {
  const log = { gaLoads: 0, phLoads: 0, ga: [], ph: [], optOut: 0, optIn: 0 }
  const gate = createAnalyticsGate({
    limit: 50,
    loadGA: () => { log.gaLoads++; if (gaFails) throw new Error('blocked'); return { capture: (n, p) => log.ga.push([n, p]) } },
    loadPostHog: async () => { log.phLoads++; if (phFails) throw new Error('cdn'); return { capture: (n, p) => log.ph.push([n, p]) } },
    optOut: () => { log.optOut++ },
    optIn: () => { log.optIn++ },
  })
  return { gate, log }
}
const UNKNOWN = { status: 'unknown', promptable: true }
const GRANTED = { status: 'granted', promptable: true }
const DENIED = { status: 'denied', promptable: true }

/* 1. Qərar yoxdur — heç nə yüklənmir, hadisələr gözləyir */
{
  const { gate, log } = setup()
  gate.apply(UNKNOWN)
  gate.pageView('/', 'https://digitoy.az')
  gate.event('landing_view', { lang: 'az' })
  ok('unknown: skript yüklənmir', log.gaLoads === 0 && log.phLoads === 0)
  ok('unknown: hadisələr növbədədir', gate.state.ga === 2 && gate.state.ph === 2)
  for (let i = 0; i < 100; i++) gate.event('x', {})
  ok('növbə limitlidir (50)', gate.state.ga === 50 && gate.state.ph === 50)
}

/* 2. Qəbul — hər skript BİR DƏFƏ yüklənir, növbə ardıcıllıqla gedir */
{
  const { gate, log } = setup()
  gate.apply(UNKNOWN)
  gate.pageView('/', 'https://digitoy.az')
  gate.event('landing_view', { lang: 'az' })
  gate.apply(GRANTED)
  await tick()
  ok('qəbul: GA və PostHog bir dəfə yüklənir', log.gaLoads === 1 && log.phLoads === 1)
  ok('GA: page_view + landing_view ardıcıl', JSON.stringify(log.ga) === JSON.stringify([['page_view', { page_path: '/' }], ['landing_view', { lang: 'az' }]]))
  ok('PostHog: $pageview tam URL ilə', log.ph[0][0] === '$pageview' && log.ph[0][1].$current_url === 'https://digitoy.az/')
  gate.apply(GRANTED)
  gate.apply({ status: 'granted', promptable: false })
  await tick()
  ok('təkrar apply yenidən yükləmir', log.gaLoads === 1 && log.phLoads === 1)
  gate.event('demo_opened', {})
  ok('sonrakı hadisələr birbaşa gedir', log.ga.at(-1)[0] === 'demo_opened' && log.ph.at(-1)[0] === 'demo_opened')
}

/* 3. İmtina — heç nə yüklənmir, növbə və sonrakılar atılır */
{
  const { gate, log } = setup()
  gate.apply(UNKNOWN)
  gate.event('landing_view', {})
  gate.apply(DENIED)
  gate.event('demo_opened', {})
  await tick()
  ok('imtina: skript yüklənmir', log.gaLoads === 0 && log.phLoads === 0)
  ok('imtina: növbə atılır', gate.state.ga === 0 && gate.state.ph === 0 && log.ga.length === 0)
  ok('imtina: optOut çağırılmır (heç nə yüklənməyib)', log.optOut === 0)
  gate.apply(GRANTED)
  await tick()
  ok('imtinadan sonra qəbul → yüklənir', log.gaLoads === 1 && log.phLoads === 1)
  ok('əvvəl atılan hadisələr göndərilmir', log.ga.length === 0)
}

/* 4. Qəbul → İmtina («Kuki ayarları») → Qəbul */
{
  const { gate, log } = setup()
  gate.apply(GRANTED)
  await tick()
  gate.apply(DENIED)
  gate.apply(DENIED)
  gate.event('after_deny', {})
  ok('optOut bir dəfə çağırılır', log.optOut === 1)
  ok('imtinadan sonra heç nə getmir', !log.ga.some(([n]) => n === 'after_deny') && !log.ph.some(([n]) => n === 'after_deny'))
  gate.apply(GRANTED)
  gate.event('back', {})
  ok('yenidən qəbul: optIn, yenidən yükləmə yox', log.optIn === 1 && log.gaLoads === 1 && log.ga.at(-1)[0] === 'back')
}

/* 5. Dəvətnamə səhifəsi, razılıq yoxdur — atılır; əvvəlcədən razılıq varsa işləyir */
{
  const { gate, log } = setup()
  gate.apply({ status: 'unknown', promptable: true })   /* 'loading' */
  gate.pageView('/invite/x', 'https://digitoy.az')
  gate.apply({ status: 'unknown', promptable: false })  /* 'invite' */
  gate.event('invitation_opened', {})
  ok('dəvətnamə + unknown: atılır, yüklənmir', gate.state.ga === 0 && gate.state.ph === 0 && log.gaLoads === 0)
  const b = setup()
  b.gate.apply({ status: 'granted', promptable: false })
  b.gate.event('invitation_opened', {})
  await tick()
  ok('dəvətnamə + əvvəlki razılıq: işləyir', b.log.gaLoads === 1 && b.log.ga.at(-1)[0] === 'invitation_opened')
}

/* 6. Yükləmə xətaları */
{
  const f = setup({ gaFails: true, phFails: true })
  f.gate.apply(UNKNOWN)
  f.gate.event('x', {})
  f.gate.apply(GRANTED)
  await tick()
  f.gate.event('y', {})
  ok('yükləmə alınmasa növbə atılır, sayt sınmır', f.gate.state.ga === 0 && f.gate.state.ph === 0)
  f.gate.apply(GRANTED)   /* hər view/dil dəyişikliyində təkrarlanır */
  f.gate.event('z', {})
  ok('alınmayan hədəf sonrakı apply-da da bloklu qalır (növbə yığılmır)', f.gate.state.ga === 0 && f.gate.state.ph === 0)
}

/* 7. PostHog yüklənərkən imtina — yükləndikdən sonra da optOut çağırılır */
{
  const { gate, log } = setup()
  gate.apply(GRANTED)
  gate.apply(DENIED)
  ok('imtina anında optOut', log.optOut === 1)
  await tick()
  ok('PostHog yükləndikdən sonra yenidən optOut (yeni identifikator silinsin)', log.optOut === 2 && log.phLoads === 1)
  gate.event('x', {})
  ok('heç nə getmir', log.ph.length === 0 && log.ga.length === 0)
}

console.log(fail ? `\n${pass} ok, ${fail} FAIL` : `\nanalytics_gate: ${pass} yoxlama keçdi`)
process.exit(fail ? 1 : 0)
