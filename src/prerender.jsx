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
import { LEGAL_DOCS } from './data/legal/docs.js'

/** Hazır HTML yazılan marşrutlar: [yol, fayl adı (seo.php ilə eyni qayda)] */
export const PRERENDER_ROUTES = [
  ['/', 'home'],
  ['/templates', 'templates'],
  ...Object.values(CONCEPT_META).map((m) => [`/sablonlar/${m.slug}`, `sablonlar--${m.slug}`]),
  /* 2026-11-18 — hüquqi səhifələr: botlar əvvəl boş qabıq görürdü (H1 yox, 4–7 söz) */
  ...LEGAL_DOCS.map((d) => [d.path, `legal--${d.id}`]),
]

async function streamToString(stream) {
  const dec = new TextDecoder()
  let out = ''
  for await (const c of stream) out += typeof c === 'string' ? c : dec.decode(c, { stream: true })
  return out + dec.decode()
}

/* 2026-11-18 — hüquqi mətnlər brauzerdə ayrıca chunk kimi effektdə yüklənir; serverdə isə
   dərhal lazımdır. Yalnız bu SSR girişində statik idxal olunur → klient bundle-a təsir etmir.
   LegalPage IS_SSR-də ilkin state-i buradan götürür (src/components/legal/LegalPage.jsx). */
const LEGAL_AZ = import.meta.glob('./data/legal/*/az.js', { eager: true })
globalThis.__DT_LEGAL__ = Object.fromEntries(
  Object.entries(LEGAL_AZ).map(([file, m]) => [`${file.split('/').at(-2)}/az`, m.default]),
)

export async function renderPath(path) {
  globalThis.__DT_SSR_PATH__ = path
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <App ssrPath={path} />
    </StrictMode>,
  )
  return streamToString(prelude)
}
