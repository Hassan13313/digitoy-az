import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ConsentBanner from './components/legal/ConsentBanner.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ConsentBanner />
  </StrictMode>,
)
