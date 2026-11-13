/* Prerender girişi (yalnız Node, scripts/prerender.mjs) — bax src/utils/prerender.js.
   Brauzer bundle-na düşmür: main.jsx bu faylı import etmir.
   ⚠ Ağac main.jsx-dəki ilə EYNİ olmalıdır (<StrictMode><App/></StrictMode>) —
   brauzer bu HTML-ə hydrateRoot ilə qoşulur, useId-lər də ağacın formasından asılıdır.
   prerenderToNodeStream lazy() səhifələri (TemplatesPage) gözləyir — renderToString
   onların yerinə yükləyicini yazardı. */
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import App from './App.jsx'
import { CONCEPT_META } from './templates/templateConfig'

/** Hazır HTML yazılan marşrutlar: [yol, fayl adı (seo.php ilə eyni qayda)] */
export const PRERENDER_ROUTES = [
  ['/', 'home'],
  ['/templates', 'templates'],
  ...Object.values(CONCEPT_META).map((m) => [`/sablonlar/${m.slug}`, `sablonlar--${m.slug}`]),
]

async function streamToString(stream) {
  const chunks = []
  for await (const c of stream) chunks.push(typeof c === 'string' ? Buffer.from(c) : Buffer.from(c))
  return Buffer.concat(chunks).toString('utf8')
}

export async function renderPath(path) {
  globalThis.__DT_SSR_PATH__ = path
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <App ssrPath={path} />
    </StrictMode>,
  )
  return streamToString(prelude)
}
