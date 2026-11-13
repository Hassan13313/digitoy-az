#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────────
   PRERENDER — `npm run build`-in son addımı (bax src/utils/prerender.js)

   1. src/prerender.jsx Vite SSR rejimində müvəqqəti qovluğa yığılır
      (node_modules/.prerender — deploy ZIP-ə düşmür)
   2. Node-da hər marşrut render olunur → dist/_prerender/<ad>.html
      (/ → home, /templates → templates, /sablonlar/<slug> → sablonlar--<slug>)
   3. seo.php fraqmenti həmin marşrutun `<div id="root">`-una qoyur.

   Xəta olsa həmin fraqment yazılmır, seo.php o marşrutu köhnə qaydada (boş root +
   noscript) verir — sayt bu addıma görə sınmır. Build isə xəta kodu ilə bitir ki,
   problem diqqətdən qaçmasın (dist/ hazır qalır).
   ───────────────────────────────────────────────────────────────────────── */
import { build } from 'vite'
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TMP = path.join(ROOT, 'node_modules', '.prerender')
const OUT_DIR = path.join(ROOT, 'dist', '_prerender')

/* Hər fraqmentin olmalı olduğu işarə — yoxdursa nəsə səhv render olunub (məs. yükləyici) */
const MUST = (route) => (route === '/' ? 'id="hero-title"' : '/img/templates/')
const MIN_BYTES = 15000

async function main() {
  if (!existsSync(path.join(ROOT, 'dist', 'index.html'))) {
    console.error('prerender: dist/index.html yoxdur — əvvəlcə vite build')
    return 1
  }
  await build({
    root: ROOT,
    logLevel: 'warn',
    build: {
      ssr: 'src/prerender.jsx',
      outDir: TMP,
      emptyOutDir: true,
      copyPublicDir: false,
      rollupOptions: { output: { entryFileNames: 'prerender.mjs' } },
    },
  })

  globalThis.__DT_SSR__ = true
  const mod = await import(pathToFileURL(path.join(TMP, 'prerender.mjs')).href)
  mkdirSync(OUT_DIR, { recursive: true })
  let ok = 0
  for (const [route, name] of mod.PRERENDER_ROUTES) {
    try {
      const html = await mod.renderPath(route)
      if (typeof html !== 'string' || html.length < MIN_BYTES || !html.includes(MUST(route))) {
        console.error(`prerender: ${route} — gözlənilməz nəticə (${html?.length} bayt), YAZILMADI`)
        continue
      }
      writeFileSync(path.join(OUT_DIR, `${name}.html`), html)
      ok++
    } catch (e) {
      console.error(`prerender: ${route} — XƏTA, yazılmadı:`, e?.message || e)
    }
  }
  rmSync(TMP, { recursive: true, force: true })
  console.log(`prerender: ${ok}/${mod.PRERENDER_ROUTES.length} marşrut → dist/_prerender/`)
  return ok === mod.PRERENDER_ROUTES.length ? 0 : 1
}

main().then((code) => { process.exitCode = code }, (e) => {
  console.error('prerender: XƏTA —', e?.stack || e)
  process.exitCode = 1
})
