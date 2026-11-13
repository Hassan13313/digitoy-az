/* Prerender girişi (yalnız Node, scripts/prerender.mjs) — bax src/utils/prerender.js.
   Brauzer bundle-na düşmür: main.jsx bu faylı import etmir.
   ⚠ Ağac main.jsx-dəki ilə EYNİ olmalıdır (<StrictMode><App/></StrictMode>) —
   brauzer bu HTML-ə hydrateRoot ilə qoşulur, useId-lər də ağacın formasından asılıdır. */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'

export function renderHome() {
  return renderToString(
    <StrictMode>
      <App ssrPath="/" />
    </StrictMode>,
  )
}
