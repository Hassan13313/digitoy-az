/* ─────────────────────────────────────────────────────────────────────────────
   PROMOKOD — müştəri tərəfi (2026-11-25)

   İşə salma:  node tests/promo_ui_test.mjs

   Yoxlayır:
     1. WhatsApp sifariş mesajı: kod tətbiq olunubsa «🎟 Promokod» + «💰 Yekun»
        sətirləri paketdən dərhal sonra; olmayanda heç bir promokod sətri yoxdur
        (veb və VİDEO sifarişi)
     2. PHP qiymətləri (config.php › DIGITOY_PACKAGE_PRICES) = packages.js qiymətləri
     3. Mətnlər: hər səbəb üçün AZ/EN/RU mesajı var
     4. `?kod=` linki kodu yadda saxlayır (boş/olmayan kod heç nə yazmır)
     5. submitDraft promo_code-u yalnız verildikdə göndərir; form_data-ya qatmır
     6. checkPromo: 429 → RATE_LIMITED
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { PACKAGE_DEFS } from '../src/data/packages.js'
import { PROMO_COPY, PROMO_REASONS, capturePromoFromUrl, getStoredPromo, clearStoredPromo, promoWaLines } from '../src/utils/promo.js'

registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx) } catch (e) {
      if (spec.startsWith('.') && !/\.[a-z]+$/i.test(spec)) return next(`${spec}.js`, ctx)
      throw e
    }
  },
  /* api.js Vite-in import.meta.env-ini oxuyur — Node-da boş obyekt (BASE = '/api') */
  load(url, ctx, next) {
    const r = next(url, ctx)
    if (!url.endsWith('/src/utils/api.js')) return r
    return { ...r, source: String(r.source).replace(/import\.meta\.env/g, '({})') }
  },
})

/* brauzer API-ləri (localStorage, sessionStorage, import.meta.env) — Node-da sadə əvəzlər */
const mem = new Map()
globalThis.localStorage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) }
globalThis.sessionStorage = globalThis.localStorage

const { buildWhatsAppMessage, buildVideoWhatsAppMessage } = await import('../src/utils/whatsappOrder.js')
const { submitDraft, checkPromo } = await import('../src/utils/api.js')

let fail = 0
let checks = 0
const ok = (name, cond, extra = '') => {
  checks++
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}

/* ── 1. WhatsApp ── */
const promo = { ok: true, code: 'QARACUMA', kind: 'percent', amount: 30, price_base: 129, price_final: 90 }
ok('promoWaLines faiz', JSON.stringify(promoWaLines(promo)) === JSON.stringify(['🎟 Promokod: QARACUMA (−30%)', '💰 Yekun: 90₼ (129₼ əvəzinə)']))
ok('promoWaLines ₼', promoWaLines({ ...promo, code: 'AYSEL10', kind: 'fixed', amount: 10, price_final: 119 })[0] === '🎟 Promokod: AYSEL10 (−10₼)')
ok('promoWaLines: ok=false / null → boş', promoWaLines({ ok: false, reason: 'EXPIRED' }).length === 0 && promoWaLines(null).length === 0)

const web = { eventType: 'toy', groomName: 'Tural', brideName: 'Aysel', date: '2026-12-20', time: '18:00', package: 'PREMIUM' }
const msg = decodeURIComponent(buildWhatsAppMessage({ ...web, promo }, 'az'))
const lines = msg.split('\n')
const pkgAt = lines.findIndex((l) => l.startsWith('📦 Paket: Premium (129₼)'))
ok('veb: promokod sətri paketdən dərhal sonra', pkgAt > -1 && lines[pkgAt + 1] === '🎟 Promokod: QARACUMA (−30%)' && lines[pkgAt + 2] === '💰 Yekun: 90₼ (129₼ əvəzinə)', msg)
const plain = decodeURIComponent(buildWhatsAppMessage(web, 'az'))
ok('veb: promokodsuz mesajda promokod/yekun yoxdur', !plain.includes('Promokod') && !plain.includes('Yekun'))

const video = { eventType: 'birthday', brideName: 'Leyla', date: '2026-12-20', time: '', video: { source: 'link', link: '' }, videoMusic: { mode: 'later' } }
const vmsg = decodeURIComponent(buildVideoWhatsAppMessage({ ...video, promo: { ...promo, price_base: 29, price_final: 20 } }))
ok('video: promokod sətirləri', vmsg.includes('🎟 Promokod: QARACUMA (−30%)\n💰 Yekun: 20₼ (29₼ əvəzinə)'), vmsg)
ok('video: promokodsuz', !decodeURIComponent(buildVideoWhatsAppMessage(video)).includes('Promokod'))

/* ── 2. PHP ↔ JS qiymətləri ── */
const config = readFileSync(new URL('../public/api/config.php', import.meta.url), 'utf8')
const m = config.match(/const DIGITOY_PACKAGE_PRICES = \[([^\]]+)\]/)
const php = m ? Object.fromEntries([...m[1].matchAll(/'([A-Z]+)'\s*=>\s*(\d+)/g)].map(([, k, v]) => [k, Number(v)])) : {}
const js = Object.fromEntries(Object.values(PACKAGE_DEFS).map((d) => [d.id, Number(d.price)]))
ok('PHP qiymətləri = packages.js', JSON.stringify(php) === JSON.stringify(js), `${JSON.stringify(php)} vs ${JSON.stringify(js)}`)

/* ── 3. Mətnlər ── */
for (const lang of ['az', 'en', 'ru']) {
  const c = PROMO_COPY[lang]
  for (const k of ['toggle', 'label', 'placeholder', 'apply', 'remove', 'applied', 'checking', 'empty', 'total']) ok(`${lang}.${k}`, typeof c[k] === 'string' && c[k].length > 0)
  for (const r of PROMO_REASONS) ok(`${lang}.reasons.${r}`, typeof c.reasons[r] === 'string' && c.reasons[r].length > 5)
}
const serverReasons = [...readFileSync(new URL('../public/api/promo_lib.php', import.meta.url), 'utf8')
  .match(/const PROMO_REASONS\s*=\s*\[([^\]]+)\]/)[1].matchAll(/'([A-Z_]+)'/g)].map((x) => x[1])
ok('serverin bütün səbəbləri üçün mətn var', serverReasons.length === 6 && serverReasons.every((r) => PROMO_REASONS.includes(r)))

/* ── 4. ?kod= ── */
clearStoredPromo()
ok('kod yoxdursa heç nə yazılmır', capturePromoFromUrl('?utm_source=ig') === null && getStoredPromo() === '')
ok('boş kod yazılmır', capturePromoFromUrl('?kod=%20%20') === null && getStoredPromo() === '')
ok('?kod=qaracuma yadda qalır', capturePromoFromUrl('?kod=qaracuma&utm_source=ig') === 'qaracuma' && getStoredPromo() === 'qaracuma')
ok('çox uzun kod 40 simvola kəsilir', capturePromoFromUrl(`?kod=${'A'.repeat(60)}`).length === 40)
clearStoredPromo()
ok('clearStoredPromo', getStoredPromo() === '')

/* ── 5–6. API ── */
const sent = []
globalThis.fetch = async (url, init) => {
  sent.push({ url, body: init?.body ? JSON.parse(init.body) : null })
  if (String(url).includes('promo_check') && sent.length > 2) return { ok: false, status: 429, json: async () => ({}) }
  return { ok: true, status: 200, json: async () => ({ ok: true }) }
}
await submitDraft('sess-12345678', { eventType: 'toy' }, 'VIP', '')
await submitDraft('sess-12345678', { eventType: 'toy' }, 'VIP', '', 'QARACUMA')
ok('submitDraft: kodsuz → promo_code yoxdur', !('promo_code' in sent[0].body))
ok('submitDraft: kodla → promo_code, form_data-da yox', sent[1].body.promo_code === 'QARACUMA' && !('promo' in sent[1].body.form_data) && !('promo_code' in sent[1].body.form_data))
const r429 = await checkPromo('X', 'VIP', 's')
ok('checkPromo 429 → RATE_LIMITED', r429.ok === false && r429.reason === 'RATE_LIMITED')
ok('checkPromo body: code, package, session_id', sent[2].body.code === 'X' && sent[2].body.package === 'VIP' && sent[2].body.session_id === 's')

console.log(`\n${checks - fail}/${checks} keçdi${fail ? `, ${fail} UĞURSUZ` : ''}`)
process.exit(fail ? 1 : 0)
