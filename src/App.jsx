import { useState } from 'react'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
import DigitoyOrijinalUI from './components/DigitoyOrijinalUI'
import { defaultWedding } from './data/defaultWedding'
import './App.css'

// "v3" → mövcud v0.3.0 | "new" → yeni UI
const ACTIVE_UI = 'v3'

export default function App() {
  const [view, setView] = useState('landing')
  const [lang, setLang] = useState('az')
  const [weddingData, setWeddingData] = useState(defaultWedding)

  if (ACTIVE_UI === 'new') {
    return <DigitoyOrijinalUI />
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
