/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Cihaz matrisi E2E testləri

   iPhone Safari üçün WEBKIT işlədilir — bu, Safari-nin ƏSL mühərrikidir
   (Chromium-un "iPhone kimi göstər" emulyasiyası deyil). Kritik API-lər
   məhz burada fərqlənir:
     • createImageBitmap({ imageOrientation }) — şəkil yanakı düşməsin
     • canvas.toBlob('image/jpeg')            — client sıxılması
     • <video> + canvas                       — video posteri
     • File.slice() + XHR upload progress     — hissəli yükləmə
     • localStorage                           — davam etdirmə açarı

   Şəbəkə droseli və offline ssenariləri CDP tələb edir (yalnız Chromium),
   ona görə onlar Android profilində işləyir — yoxlanılan məntiq eynidir.

   Qurulum:
     npm i playwright && npx playwright install webkit chromium
   İşlət:
     BASE=http://localhost:8080 MEDIA=/fixtures node tests/device_matrix_test.mjs
══════════════════════════════════════════════════ */

import { webkit, chromium, devices } from 'playwright'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

const BASE  = process.env.BASE  || 'http://localhost:8080'
const MEDIA = process.env.MEDIA || '.'
const f = (n) => path.join(MEDIA, n)

let pass = 0, fail = 0
const ok  = (n) => { pass++; console.log(`    ok   ${n}`) }
const bad = (n, exp, got) => { fail++; console.log(`    FAIL ${n}\n         gözlənilən: ${exp}\n         alınan:     ${got}`) }
const eq  = (n, exp, got) => (String(exp) === String(got)) ? ok(n) : bad(n, exp, got)
const yes = (n, cond, got = '') => cond ? ok(n) : bad(n, 'true', got || 'false')

const fetchManifest = (page, slug) => page.evaluate(async (s) => {
  const r = await fetch(`/api/get_photos.php?slug=${s}`, { cache: 'no-store' })
  return r.json()
}, slug)

/* Yalnız şəkillərin saxlanmış ölçüsü (video sıxılmır) */
const imageBytes = (m) => (m.photos || [])
  .filter(p => p.type.startsWith('image/'))
  .reduce((s, p) => s + (p.size || 0), 0)

/* Tərəqqi MƏTNDƏN deyil, sabit DOM qarmağından oxunur: PhotoShare ümumi
   zolağı role="progressbar" + aria-valuenow ilə verir (mətn kövrəkdir). */
const progressNow = (page) => page.evaluate(() => {
  const el = document.querySelector('[role=progressbar]')
  return el ? Number(el.getAttribute('aria-valuenow')) : null
})

/** Serverin bu yükləmə üçün aldığı bayt sayı (davam nöqtəsi) */
const serverReceived = (page, slug) => page.evaluate(async (s) => {
  const k = Object.keys(localStorage).find(x => x.startsWith(`digitoyUpload:${s}:`))
  if (!k) return { uploadId: null, received: 0 }
  const uploadId = localStorage.getItem(k)
  const r = await fetch(`/api/upload_chunk.php?slug=${s}&uploadId=${uploadId}`, { cache: 'no-store' })
  return { uploadId, received: (await r.json()).received || 0 }
}, slug)

/** Slow 4G — real toy məkanındakı sıx şəbəkə (CDP: yalnız Chromium) */
async function throttle(context, page, kbps) {
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 400,
    downloadThroughput: kbps * 1024 / 8,
    uploadThroughput:   kbps * 1024 / 8,
  })
}

/* ══════════════════════════════════════════════════
   1) Platforma matrisi — şəkil, çoxlu şəkil, video
══════════════════════════════════════════════════ */
async function runDevice(label, browserType, deviceProfile, slug) {
  console.log(`\n  ── ${label} ──`)
  const browser = await browserType.launch()
  const context = await browser.newContext({ ...deviceProfile })
  const page = await context.newPage()

  const consoleErrors = []
  page.on('console', m => {
    if (m.type() !== 'error') return
    /* Analitika (PostHog/GA) test mühitində 404/401 verir — tətbiq xətası deyil */
    const url = m.location()?.url || ''
    if (/posthog|google-analytics|googletagmanager|gtag|favicon/i.test(url)) return
    consoleErrors.push(`${m.text()} @ ${url}`)
  })

  try {
    await page.goto(`${BASE}/invite/${slug}/foto`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('button:has-text("Şəkil çək")', { timeout: 30000 })

    for (const t of ['Şəkil çək', 'Qalereyadan seç', 'Video göndər']) {
      yes(`"${t}" düyməsi görünür`, await page.locator(`button:has-text("${t}")`).isVisible())
    }

    eq('kamera girişi capture="environment"', 'environment',
       await page.locator('input[type=file][capture]').getAttribute('capture'))

    yes('üfüqi sürüşdürmə yoxdur', !(await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth + 1)))

    eq('44px-dən kiçik toxunuş hədəfi yoxdur', 0, await page.evaluate(() =>
      [...document.querySelectorAll('button')].filter(b => {
        const r = b.getBoundingClientRect()
        return r.width > 0 && (r.height < 44 || r.width < 44)
      }).length))

    yes('yükləmə limiti fayl seçilməzdən ƏVVƏL göstərilir',
        /2 GB/.test(await page.locator('body').innerText()))

    /* ── Qalereyadan çoxlu şəkil ── */
    const photos = ['test_photo.jpg', 'phone_photo_12mp.jpg'].map(f).filter(existsSync)
    await page.locator('button:has-text("Qalereyadan seç")').click()
    await page.locator('input[type=file][multiple]').first().setInputFiles(photos)
    await page.waitForSelector('button:has-text("faylı göndər")', { timeout: 15000 })
    await page.locator('button:has-text("faylı göndər")').click()
    await page.waitForSelector('text=Təşəkkürlər', { timeout: 180000 })
    ok(`${photos.length} şəkil göndərildi`)

    const originalBytes = photos.reduce((s, p) => s + statSync(p).size, 0)
    const storedBytes   = imageBytes(await fetchManifest(page, slug))
    yes(`client sıxılması işləyir (${(storedBytes / 1048576).toFixed(1)} MB < ${(originalBytes / 1048576).toFixed(1)} MB)`,
        storedBytes > 0 && storedBytes < originalBytes,
        `serverdə=${storedBytes} orijinal=${originalBytes}`)

    /* ── Video ── */
    const video = f('real_video.mp4')
    if (existsSync(video)) {
      await page.locator('button:has-text("Daha Çox Göndər")').click()
      await page.locator('button:has-text("Video göndər")').click()
      await page.locator('input[type=file][accept="video/*"]').setInputFiles(video)
      await page.locator('button:has-text("faylı göndər")').click()
      await page.waitForSelector('text=Təşəkkürlər', { timeout: 180000 })
      ok('video göndərildi')
    }

    const manifest = await fetchManifest(page, slug)
    yes(`server manifestində ${manifest.total} media`, manifest.total >= photos.length, `total=${manifest.total}`)
    yes('şəkillər üçün thumbnail yaradılıb',
        manifest.photos.filter(p => p.thumbUrl !== p.url).length > 0)

    eq('tətbiq konsol xətası yoxdur', 0, consoleErrors.length)
    if (consoleErrors.length) console.log('         ', consoleErrors.slice(0, 3).join(' | '))
  } finally {
    await browser.close()
  }
}

/* ══════════════════════════════════════════════════
   2) Yükləmə zamanı REFRESH — davam etdirmə
   Drosel olmadan 100 MB lokalda saniyələrə bitir və test mənasız olur,
   ona görə şəbəkə qəsdən yavaşladılır.
══════════════════════════════════════════════════ */
async function runResumeTest(slug) {
  console.log('\n  ── Yükləmə zamanı refresh (drosellənmiş) ──')
  const big = f('vid_100mb.mp4')
  if (!existsSync(big)) { console.log('    (100 MB fayl yoxdur — atlanır)'); return }

  const browser = await chromium.launch()
  const context = await browser.newContext(devices['Pixel 7'])
  const page = await context.newPage()
  try {
    await throttle(context, page, 8000)   /* ~8 Mbps — bitməsin, amma sürünməsin */
    await page.goto(`${BASE}/invite/${slug}/foto`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('button:has-text("Video göndər")', { timeout: 60000 })
    await page.locator('button:has-text("Video göndər")').click()
    await page.locator('input[type=file][accept="video/*"]').setInputFiles(big)
    await page.locator('button:has-text("faylı göndər")').click()

    /* Yükləmə YARIMÇIQ ikən tut */
    let before = null
    for (let i = 0; i < 250; i++) {
      const s = await serverReceived(page, slug)
      if (s.received > 0) { before = s; break }
      await page.waitForTimeout(150)
    }
    yes('yükləmə açarı localStorage-da saxlanılır', Boolean(before?.uploadId), JSON.stringify(before))
    yes('refresh-dən ƏVVƏL server hissələri alıb', (before?.received ?? 0) > 0, `received=${before?.received}`)

    const pct = await progressNow(page)
    yes('tərəqqi göstəricisi real faiz verir', pct !== null && pct >= 0 && pct <= 100, `aria-valuenow=${pct}`)

    /* Qonaq təsadüfən səhifəni yeniləyir */
    await page.reload({ waitUntil: 'domcontentloaded' })
    const after = await serverReceived(page, slug)

    yes('refresh-dən SONRA yükləmə açarı qorunur',
        Boolean(after.uploadId) && after.uploadId === before?.uploadId,
        `${before?.uploadId} vs ${after.uploadId}`)
    yes('REGRESSION: refresh yükləməni SIFIRLAMIR',
        after.received > 0 && after.received >= (before?.received ?? 0),
        `əvvəl=${before?.received} sonra=${after.received}`)
  } finally {
    await browser.close()
  }
}

/* ══════════════════════════════════════════════════
   3) Slow 4G — tərəqqi görünürmü, yükləmə bitirmi
══════════════════════════════════════════════════ */
async function runThrottledTest(slug) {
  console.log('\n  ── Slow 4G (400 kbps) ──')
  const browser = await chromium.launch()
  const context = await browser.newContext(devices['Pixel 7'])
  const page = await context.newPage()
  try {
    await throttle(context, page, 400)
    await page.goto(`${BASE}/invite/${slug}/foto`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('button:has-text("Qalereyadan seç")', { timeout: 180000 })
    ok('səhifə Slow 4G-də açılır')

    await page.locator('button:has-text("Qalereyadan seç")').click()
    await page.locator('input[type=file][multiple]').first().setInputFiles([f('phone_photo_12mp.jpg')])
    await page.waitForSelector('button:has-text("faylı göndər")', { timeout: 30000 })
    await page.locator('button:has-text("faylı göndər")').click()

    /* Yavaş şəbəkədə tərəqqi GÖRÜNMƏLİDİR — "donub" hissi yaranmasın */
    let sawProgress = false
    for (let i = 0; i < 400; i++) {
      if ((await progressNow(page)) !== null) { sawProgress = true; break }
      await page.waitForTimeout(100)
    }
    yes('yavaş şəbəkədə real tərəqqi göstərilir (donma hissi yoxdur)', sawProgress)

    await page.waitForSelector('text=Təşəkkürlər', { timeout: 300000 })
    ok('Slow 4G-də yükləmə tamamlanır')
  } finally {
    await browser.close()
  }
}

/* ══════════════════════════════════════════════════
   4) İnternet kəsilir və qayıdır
══════════════════════════════════════════════════ */
async function runOfflineTest(slug) {
  console.log('\n  ── İnternet kəsilir və qayıdır ──')
  const big = f('vid_100mb.mp4')
  if (!existsSync(big)) { console.log('    (100 MB fayl yoxdur — atlanır)'); return }

  const browser = await chromium.launch()
  const context = await browser.newContext(devices['Pixel 7'])
  const page = await context.newPage()
  try {
    await throttle(context, page, 8000)
    await page.goto(`${BASE}/invite/${slug}/foto`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('button:has-text("Video göndər")', { timeout: 60000 })
    await page.locator('button:has-text("Video göndər")').click()
    await page.locator('input[type=file][accept="video/*"]').setInputFiles(big)
    await page.locator('button:has-text("faylı göndər")').click()

    let received = 0
    for (let i = 0; i < 250; i++) {
      received = (await serverReceived(page, slug)).received
      if (received > 0) break
      await page.waitForTimeout(150)
    }
    yes('kəsilmədən əvvəl hissələr getdi', received > 0, `received=${received}`)

    await context.setOffline(true)

    /* İstifadəçi xətanı GÖRMƏLİDİR — sükutla donmamalıdır */
    let sawError = false
    for (let i = 0; i < 400; i++) {
      const t = await page.locator('body').innerText()
      if (/bağlantısı yoxdur|kəsildi|alınmadı|Yenidən göndər/i.test(t)) { sawError = true; break }
      await page.waitForTimeout(150)
    }
    yes('bağlantı kəsiləndə istifadəçi aydın xəta görür', sawError)

    /* Şəbəkə qayıdır — server artıq aldığı hissələri SAXLAMALIDIR */
    await context.setOffline(false)
    const after = await serverReceived(page, slug)
    yes('kəsilmədən sonra server hissələri saxlayır (sıfırdan başlanmır)',
        after.received >= received && after.received > 0,
        `əvvəl=${received} sonra=${after.received}`)

    /* Əsas istifadəçi zəmanəti: bağlantı qayıdandan sonra qonaq İLİŞİB
       QALMIR — ya yükləmə özü davam edib bitir, ya da ona aydın
       "yenidən göndər" düyməsi verilir. İkisindən biri olmalıdır. */
    const atReconnect = (await serverReceived(page, slug)).received
    let recovered = null
    for (let i = 0; i < 200; i++) {
      if (await page.locator('text=Təşəkkürlər').count() > 0)                  { recovered = 'avtomatik tamamlandı'; break }
      if (await page.locator('button:has-text("yenidən göndər")').count() > 0) { recovered = 'yenidən göndər düyməsi'; break }
      /* Üçüncü qəbul edilən nəticə: yükləmə sadəcə DAVAM EDİR */
      const now = (await serverReceived(page, slug)).received
      if (now > atReconnect) { recovered = `yükləmə davam edir (${atReconnect} → ${now})`; break }
      await page.waitForTimeout(300)
    }
    yes(`bağlantı qayıdanda qonaq ilişib qalmır (${recovered})`, recovered !== null,
        'nə tamamlandı, nə də yenidən göndər düyməsi göründü')
  } finally {
    await browser.close()
  }
}

console.log('DIGITOY — cihaz matrisi')
console.log(`BASE=${BASE}`)

await runDevice('iPhone Safari (WebKit — əsl Safari mühərriki)', webkit, devices['iPhone 13'], 'zz-dev-ios')
await runDevice('Android Chrome (Pixel 7)', chromium, devices['Pixel 7'], 'zz-dev-android')
await runDevice('Desktop Chrome', chromium, { viewport: { width: 1280, height: 900 } }, 'zz-dev-desktop')
await runResumeTest('zz-dev-resume')
await runThrottledTest('zz-dev-slow4g')
await runOfflineTest('zz-dev-offline')

console.log(`\n${pass} keçdi, ${fail} uğursuz`)
process.exit(fail === 0 ? 0 : 1)
