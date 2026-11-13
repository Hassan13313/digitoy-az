#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────────
   PRERENDER — `npm run build`-in son addımı (bax src/utils/prerender.js)

   1. src/prerender.jsx Vite SSR rejimində müvəqqəti qovluğa yığılır
      (node_modules/.prerender — deploy ZIP-ə düşmür)
   2. Node-da render olunur → dist/_prerender/home.html
   3. seo.php bu fraqmenti ana səhifənin `<div id="root">`-una qoyur.

   Xəta olsa build DAYANMIR: fraqment yazılmır, seo.php köhnə qaydada (boş
   root + noscript) işləyir — sayt heç vaxt bu addıma görə sınmır.
   ───────────────────────────────────────────────────────────────────────── */
import { build } from 'vite'
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TMP = path.join(ROOT, 'node_modules', '.prerender')
const OUT_DIR = path.join(ROOT, 'dist', '_prerender')

/* Minimum həcm: fraqment bundan qısadırsa nəsə səhv render olunub — yazılmır */
const MIN_BYTES = 20000

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
  const html = mod.renderHome()

  if (typeof html !== 'string' || html.length < MIN_BYTES || !html.includes('id="hero-title"')) {
    console.error(`prerender: gözlənilməz nəticə (${html?.length} bayt) — fraqment YAZILMADI`)
    return 1
  }
  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(path.join(OUT_DIR, 'home.html'), html)
  rmSync(TMP, { recursive: true, force: true })
  console.log(`prerender: dist/_prerender/home.html (${Math.round(html.length / 1024)} KB)`)
  return 0
}

main().then((code) => { process.exitCode = code }, (e) => {
  console.error('prerender: XƏTA —', e?.stack || e)
  process.exitCode = 1
})
