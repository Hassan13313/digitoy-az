import { useState, useEffect } from 'react'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
import DigitoyOrijinalUI from './components/DigitoyOrijinalUI'
import { defaultWedding } from './data/defaultWedding'
import './App.css'

const ACTIVE_UI = 'v3'
const ADMIN_KEY = 'digitoyadmin2026'

function decodeData(token) {
  try { return JSON.parse(decodeURIComponent(escape(atob(token)))) } catch { return null }
}

/* URL-dən /invite/:slug oxu */
function parseInviteSlug() {
  const match = window.location.pathname.match(/^\/invite\/([^/?#]+)/)
  return match ? match[1] : null
}

export default function App() {
  const [view,        setView]        = useState('landing')   // 'landing' | 'invitation' | 'invite'
  const [lang,        setLang]        = useState('az')
  const [weddingData, setWeddingData] = useState(defaultWedding)
  const [isAdmin,     setIsAdmin]     = useState(false)

  useEffect(() => {
    /* ── /invite/:slug → canlı dəvətnamə ── */
    const slug = parseInviteSlug()
    if (slug) {
      const stored = localStorage.getItem(`wedding_${slug}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setWeddingData({ ...defaultWedding, ...parsed })
          setView('invite')
          return
        } catch {}
      }
      /* localStorage yoxdursa URL token-dən cəhd et */
      const params = new URLSearchParams(window.location.search)
      const token  = params.get('data')
      if (token) {
        const decoded = decodeData(token)
        if (decoded) {
          setWeddingData({ ...defaultWedding, ...decoded })
          /* Gələcək ziyarətlər üçün saxla */
          localStorage.setItem(`wedding_${slug}`, JSON.stringify(decoded))
          setView('invite')
          return
        }
      }
    }

    /* ── Admin URL parametrləri ── */
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === ADMIN_KEY) {
      localStorage.setItem('isAdmin', 'true')
      setIsAdmin(true)
    } else if (localStorage.getItem('isAdmin') === 'true') {
      setIsAdmin(true)
    }

    const token = params.get('data')
    if (token) {
      const restored = decodeData(token)
      if (restored) {
        setWeddingData({ ...defaultWedding, ...restored })
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [])

  if (ACTIVE_UI === 'new') return <DigitoyOrijinalUI />

  /* ── /invite/:slug — tam ekran dəvətnamə, admin UI yoxdur ── */
  if (view === 'invite') {
    return (
      <div className="min-h-screen bg-cream">
        <InvitationPage
          lang={lang}
          setLang={setLang}
          weddingData={weddingData}
          onBack={() => {
            window.history.pushState({}, '', '/')
            setView('landing')
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {view === 'landing' ? (
        <LandingPage
          lang={lang}
          setLang={setLang}
          weddingData={weddingData}
          setWeddingData={setWeddingData}
          onViewInvitation={() => setView('invitation')}
          isAdmin={isAdmin}
        />
      ) : (
        <InvitationPage
          lang={lang}
          setLang={setLang}
          weddingData={weddingData}
          onBack={() => setView('landing')}
        />
      )}
    </div>
  )
}
