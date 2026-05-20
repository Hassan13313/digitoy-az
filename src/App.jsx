import { useState, useEffect } from 'react'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
import PhotoShare from './components/invitation/PhotoShare'
import DigitoyOrijinalUI from './components/DigitoyOrijinalUI'
import { defaultWedding } from './data/defaultWedding'
import './App.css'

const ACTIVE_UI = 'v3'
const ADMIN_KEY = 'digitoyadmin2026'

function decodeData(token) {
  try {
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/') +
      '=='.slice(0, (4 - (token.length % 4)) % 4)
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i)
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch { return null }
}

function parseInviteSlug() {
  const match = window.location.pathname.match(/^\/invite\/([^/?#]+)(?:\/([^/?#]*))?/)
  if (!match) return { slug: null, sub: null }
  return { slug: match[1], sub: match[2] || null }
}

export default function App() {
  const [view,        setView]        = useState('landing')   // 'landing' | 'invitation' | 'invite'
  const [lang,        setLang]        = useState('az')
  const [weddingData, setWeddingData] = useState(defaultWedding)
  const [isAdmin,     setIsAdmin]     = useState(false)

  useEffect(() => {
    const { slug, sub } = parseInviteSlug()
    if (slug) {
      /* foto paylaşım alt-route */
      if (sub === 'foto') {
        setView('photo')
        return
      }
      const stored = localStorage.getItem(`wedding_${slug}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setWeddingData({ ...defaultWedding, ...parsed })
          setView('invite')
          return
        } catch {}
      }
      const params = new URLSearchParams(window.location.search)
      const token  = params.get('data')
      if (token) {
        const decoded = decodeData(token)
        if (decoded) {
          setWeddingData({ ...defaultWedding, ...decoded })
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

    /* URL token-i burada silmirik — BuilderForm özü oxuyacaq */
  }, [])

  if (ACTIVE_UI === 'new') return <DigitoyOrijinalUI />

  if (view === 'photo') {
    return <PhotoShare />
  }

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
