import { useState, useEffect } from 'react'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
import DigitoyOrijinalUI from './components/DigitoyOrijinalUI'
import { defaultWedding } from './data/defaultWedding'
import './App.css'

const ACTIVE_UI   = 'v3'
const ADMIN_KEY   = 'digitoyadmin2026'

function decodeData(token) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(token))))
  } catch {
    return null
  }
}

export default function App() {
  const [view,        setView]        = useState('landing')
  const [lang,        setLang]        = useState('az')
  const [weddingData, setWeddingData] = useState(defaultWedding)
  const [isAdmin,     setIsAdmin]     = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const adminParam = params.get('admin')
    const dataParam  = params.get('data')

    /* Admin tanıma */
    if (adminParam === ADMIN_KEY) {
      localStorage.setItem('isAdmin', 'true')
      setIsAdmin(true)
    } else if (localStorage.getItem('isAdmin') === 'true') {
      setIsAdmin(true)
    }

    /* Data restore */
    if (dataParam) {
      const restored = decodeData(dataParam)
      if (restored) {
        setWeddingData({ ...defaultWedding, ...restored })
        /* Builder-i göstər — scroll builder-ə ediləcək */
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [])

  if (ACTIVE_UI === 'new') return <DigitoyOrijinalUI />

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
