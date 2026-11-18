/* ─────────────────────────────────────────────────────────────────────────────
   Dəvətnamə linkinin önizləmə şəkilləri (WhatsApp / Telegram / Facebook) — 2026-11-18

     node scripts/og-images.mjs            → public/og/*.jpg (1200×630, JPEG)

   Hər şablon üçün qəbul etdiyi HƏR tədbir növünə bir şəkil: <id>--<eventType>.jpg
   («Toy / Nişan» şablonu → --toy və --nishan, bir neçə bölməli şablon → --birthday da)
   və növ uyğun gəlməyəndə <id>--neutral.jpg («Dəvətnamə»). Seçimi public/seo.php ›
   seoInviteImage() edir. Qapaq yenilənəndə skripti yenidən işlədin.
   Qapaqdakı DEMO adlar görünməsin deyə şablon yalnız bulanıq fon kimi işlənir.
   ───────────────────────────────────────────────────────────────────────── */
import { chromium } from 'playwright'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { TEMPLATES, CONCEPT_META, templateConcepts } from '../src/templates/templateConfig.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'og')
mkdirSync(OUT, { recursive: true })

/* Dəvətnamənin tədbir növü → önizləmədə yazılan başlıq */
const EVENT_LABEL = {
  toy: 'Toy dəvətnaməsi', nishan: 'Nişan dəvətnaməsi', birthday: 'Ad günü dəvətnaməsi',
  xina: 'Xına gecəsi dəvətnaməsi', sunnet: 'Sünnət toyu dəvətnaməsi', baby: 'Baby shower dəvətnaməsi',
  anniversary: 'İldönümü dəvətnaməsi', graduation: 'Məzuniyyət dəvətnaməsi', bachelorette: 'Qız gecəsi dəvətnaməsi',
  corporate: 'Tədbirə dəvət', other: 'Bayram məclisinə dəvət', neutral: 'Dəvətnamə',
}

const FONTS = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=block'

function page(coverUrl, label) {
  return `<!doctype html><html lang="az"><head><meta charset="utf-8"><link rel="stylesheet" href="${FONTS}">
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;position:relative;background:#1f1814;font-family:'Cormorant Garamond',serif}
/* Şablonun rəngi və motivləri bulanıq fon kimi — qapaqdakı DEMO adlar oxunmasın */
.bg{position:absolute;inset:-60px;background:url('${coverUrl}') center 42%/cover;filter:blur(18px) saturate(1.15);transform:scale(1.08)}
.shade{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(20,14,10,.38) 0%,rgba(20,14,10,.66) 62%,rgba(20,14,10,.8) 100%)}
.frame{position:absolute;inset:28px;border:1.5px solid rgba(232,203,140,.7);border-radius:6px}
.frame:after{content:'';position:absolute;inset:10px;border:1px solid rgba(232,203,140,.35);border-radius:3px}
.txt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#f6ecd8}
.k{font:600 22px/1 'Cormorant Garamond',serif;letter-spacing:.38em;text-transform:uppercase;color:#ecd08f}
.l{font:400 108px/1.05 'Great Vibes',cursive;margin-top:22px;color:#fdf6e6;text-shadow:0 4px 28px rgba(0,0,0,.5)}
.s{font:italic 500 34px/1.3 'Cormorant Garamond',serif;margin-top:18px;color:#f0e3c8;text-shadow:0 2px 14px rgba(0,0,0,.5)}
.rule{width:140px;height:2px;margin-top:30px;background:linear-gradient(90deg,transparent,#ecd08f,transparent)}
.d{font:600 24px/1 'Cormorant Garamond',serif;letter-spacing:.16em;margin-top:20px;color:#ecd08f}
</style></head><body><div class="bg"></div><div class="shade"></div><div class="frame"></div>
<div class="txt"><div class="k">Rəqəmsal dəvətnamə</div><div class="l">${label}</div>
<div class="s">Sizi dəvət edirik — açmaq üçün toxunun</div><div class="rule"></div><div class="d">digitoy.az</div></div>
</body></html>`
}

const dataUri = (f) => `data:image/webp;base64,${readFileSync(f).toString('base64')}`
const jobs = []
for (const t of TEMPLATES) {
  const cover = join(ROOT, 'public', 'img', 'templates', `${t.id}.webp`)
  if (!existsSync(cover)) continue
  const bday = join(ROOT, 'public', 'img', 'templates', `${t.id}--birthday.webp`)
  const events = new Set()
  for (const c of templateConcepts(t)) for (const ev of CONCEPT_META[c]?.eventTypes || [CONCEPT_META[c]?.eventType]) if (ev) events.add(ev)
  for (const ev of events) {
    /* setContent səhifəsi file:// açmır — şəkil data URI kimi gömülür */
    const src = ev === 'birthday' && existsSync(bday) ? bday : cover
    jobs.push([`${t.id}--${ev}.jpg`, dataUri(src), EVENT_LABEL[ev] || EVENT_LABEL.neutral])
  }
  jobs.push([`${t.id}--neutral.jpg`, dataUri(cover), EVENT_LABEL.neutral])
}

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1200, height: 630 } })
for (const [name, url, label] of jobs) {
  await p.setContent(page(url, label), { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.screenshot({ path: join(OUT, name), type: 'jpeg', quality: 80 })
}
await b.close()
console.log(`og-images: ${jobs.length} şəkil → public/og/`)
