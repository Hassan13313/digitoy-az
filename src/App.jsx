import { useState, useEffect } from 'react'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
import PhotoShare from './components/invitation/PhotoShare'
import GalleryPage from './components/invitation/GalleryPage'
import DigitoyOrijinalUI from './components/DigitoyOrijinalUI'
import { defaultWedding } from './data/defaultWedding'
import { demoInvitation, demoGuestbook } from './data/demoInvitation'
import { getInvitation, saveInvitation } from './utils/api'
import SmoothCursor from './components/ui/SmoothCursor'
import ScrollProgress from './components/ui/ScrollProgress'
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
  const [view,        setView]        = useState('loading')
  const [lang,        setLang]        = useState('az')
  const [weddingData, setWeddingData] = useState(defaultWedding)
  const [isAdmin,     setIsAdmin]     = useState(false)
  const [adminSlug,   setAdminSlug]   = useState('')

  useEffect(() => {
    if (window.location.pathname === '/demo') {
      setView('demo')
      return
    }

    const { slug, sub } = parseInviteSlug()
    const params = new URLSearchParams(window.location.search)

    /* ── Admin səlahiyyət yoxlaması ── */
    const isAdminParam = params.get('admin') === ADMIN_KEY
    const isAdminLocal = localStorage.getItem('isAdmin') === 'true'
    if (isAdminParam) {
      localStorage.setItem('isAdmin', 'true')
      setIsAdmin(true)
    } else if (isAdminLocal) {
      setIsAdmin(true)
    }
    const hasAdminAccess = isAdminParam || isAdminLocal

    if (slug) {
      if (sub === 'foto') { setView('photo'); return }
      if (sub === 'qalereya-idare') { setView('gallery-page'); return }

      /* ── Server-dən yüklə, URL token fallback ── */
      const loadFromServer = async () => {
        let loaded = null

        try {
          const dbData = await getInvitation(slug)
          if (dbData) {
            loaded = dbData
            /* DB-dən gəldisə, URL-dəki köhnə ?data= tokenini təmizlə */
            const clean = new URL(window.location.href)
            clean.searchParams.delete('data')
            window.history.replaceState({}, '', clean.toString())
          }
        } catch { /* server əlçatmaz → URL token-ə bax */ }

        /* Fallback: URL-dəki data token */
        if (!loaded) {
          const token = params.get('data')
          if (token) {
            const decoded = decodeData(token)
            if (decoded) {
              loaded = decoded
              /* Tokeni DB-yə yaz, sonra URL-i təmizlə */
              saveInvitation(slug, decoded).catch(() => {})
            }
          }
        }

        if (loaded) setWeddingData({ ...defaultWedding, ...loaded })

        setAdminSlug(slug)
        if (hasAdminAccess) {
          /* Admin: data olsa da olmasa da builder modunda aç */
          setView('admin-review')
        } else if (loaded) {
          setView('invite')
        } else {
          /* Data yoxdur, admin deyil → ana səhifə */
          window.history.replaceState({}, '', '/')
          try { localStorage.removeItem('isAdmin') } catch {}
          setIsAdmin(false)
          setView('landing')
        }
      }

      loadFromServer()
      return
    }

    /* ── Slug yoxdur: köklü URL-də admin+data parametrləri yoxla ── */
    const token = params.get('data')
    if (hasAdminAccess && token) {
      const decoded = decodeData(token)
      if (decoded) {
        setWeddingData({ ...defaultWedding, ...decoded })
        setView('admin-review')
        return
      }
    }

    /* Admin sessiyası bu URL-də aktiv deyil — localStorage temizlə */
    if (!isAdminParam) {
      try { localStorage.removeItem('isAdmin') } catch {}
      setIsAdmin(false)
    }
    setView('landing')
  }, [])

  if (ACTIVE_UI === 'new') return <DigitoyOrijinalUI />


  /* Server sorğusu bitənə qədər minimal yükləmə ekranı */
  if (view === 'loading') {

    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div style={{
          width: 40, height: 40,
          border: '1px solid rgba(197,160,89,0.25)',
          borderTop: '1px solid rgba(197,160,89,0.8)',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (view === 'demo') {
    return (
      <div className="min-h-screen bg-cream">
        <InvitationPage
          lang={lang}
          setLang={setLang}
          weddingData={demoInvitation}
          isDemoMode={true}
          initialGuestbook={demoGuestbook}
          onBack={() => {
            window.history.pushState({}, '', '/')
            setView('landing')
          }}
        />
      </div>
    )
  }

  if (view === 'photo') {
    return <PhotoShare />
  }

  if (view === 'gallery-page') {
    return <GalleryPage />
  }

  /* ── Admin Builder Modu: data dolu Builder açılır, admin redaktə edib təsdiqlər ── */
  if (view === 'admin-review') {
    return (
      <div className="min-h-screen bg-cream">
        <LandingPage
          lang={lang}
          setLang={setLang}
          weddingData={weddingData}
          setWeddingData={setWeddingData}
          onViewInvitation={() => {
            if (adminSlug) window.history.pushState({}, '', `/invite/${adminSlug}`)
            setView('invite')
          }}
          onApproveOrder={(slug, approvedData) => {
            setWeddingData({ ...defaultWedding, ...approvedData })
            setAdminSlug(slug)
            window.history.pushState({}, '', `/invite/${slug}`)
            setView('invite')
          }}
          onDemo={() => { window.history.pushState({}, '', '/demo'); setView('demo') }}
          isAdmin={true}
          initialShowPreview={false}
        />
      </div>
    )
  }

  if (view === 'invite') {
    return (
      <div className="min-h-screen bg-cream">
        <InvitationPage
          lang={lang}
          setLang={setLang}
          weddingData={weddingData}
          isAdmin={isAdmin}
          onBack={() => {
            window.history.pushState({}, '', '/')
            setView('landing')
          }}
        />
      </div>
    )
  }

  return (
    <>
      <SmoothCursor />
      <ScrollProgress />

      {/* LandingPage həmişə mounted qalır — form data qorunur */}
      <div className="min-h-screen bg-cream" style={view === 'invitation' ? { display: 'none' } : {}}>
        <LandingPage
          lang={lang}
          setLang={setLang}
          weddingData={weddingData}
          setWeddingData={setWeddingData}
          onViewInvitation={() => setView('invitation')}
          onDemo={() => { window.history.pushState({}, '', '/demo'); setView('demo') }}
          isAdmin={isAdmin}
        />
      </div>
      {view === 'invitation' && (
        <div className="min-h-screen bg-cream">
          <InvitationPage
            lang={lang}
            setLang={setLang}
            weddingData={weddingData}
            onBack={() => {
              setView('landing')
              setTimeout(() => {
                const el = document.getElementById('builder-content')
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' })
              }, 80)
            }}
          />
        </div>
      )}
    </>
  )
}
