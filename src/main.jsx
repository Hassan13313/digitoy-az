import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ConsentBanner from './components/legal/ConsentBanner.jsx'
import { PRERENDERED } from './utils/prerender'

const rootEl = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/* 2026-11-14 — ana səhifə serverdə hazır HTML ilə gəlir (bax utils/prerender.js):
   React mövcud DOM-a qoşulur (hydrate), elementləri silib yenidən yaratmır —
   mətn ilk saniyədə görünür və yerində qalır. Uyğunsuzluq olsa React özü həmin
   hissəni yenidən çəkir; xəbərdarlıq konsola «warn» kimi düşür. */
if (PRERENDERED) {
  hydrateRoot(rootEl, app, {
    onRecoverableError: (err) => console.warn('[prerender] hydrate uyğunsuzluğu — yenidən çəkildi:', err?.message || err),
  })
} else {
  createRoot(rootEl).render(app)
}

/* Kuki banneri öz konteynerində: hazır HTML-də yoxdur (razılıq yalnız brauzerdə məlumdur),
   ana ağacın hydrate-inə qarışmamalıdır */
const consentEl = document.createElement('div')
consentEl.id = 'consent-root'
document.body.appendChild(consentEl)
createRoot(consentEl).render(
  <StrictMode>
    <ConsentBanner />
  </StrictMode>,
)
