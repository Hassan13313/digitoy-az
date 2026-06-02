import { useState, useEffect } from 'react'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
import PhotoShare from './components/invitation/PhotoShare'
import GalleryPage from './components/invitation/GalleryPage'
import DigitoyOrijinalUI from './components/DigitoyOrijinalUI'
import { defaultWedding } from './data/defaultWedding'
import { demoInvitation, demoGuestbook } from './data/demoInvitation'
import { getInvitation, adminLogin } from './utils/api'
import ScrollProgress from './components/ui/ScrollProgress'
import './App.css'

const ACTIVE_UI = 'v3'

/* ── sessionStorage-dakı admin tokenini oxu, müddəti yoxla ── */
function getStoredAdminToken() {
  try {
    const stored = sessionStorage.getItem('adminToken')
    const storedExp = parseInt(sessionStorage.getItem('adminTokenExp') || '0', 10)
    if (stored && storedExp && Date.now() < storedExp * 1000) return stored
    sessionStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminTokenExp')
  } catch {}
  return null
}

function decodeData(encoded) {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/') +
      '=='.slice(0, (4 - (encoded.length % 4)) % 4)
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch { return null }
}

function parseInviteSlug() {
  const match = window.location.pathname.match(/^\/invite\/([^/?#]+)(?:\/([^/?#]*))?/)
  if (!match) return { slug: null, sub: null }
  return { slug: match[1], sub: match[2] || null }
}

/* ── Routing məntiqi (admin flag alındıqdan sonra çağırılır) ── */
function routeAfterAuth(
  { slug, sub, params, hasAdminAccess, adminAttempted = false },
  { setView, setWeddingData, setAdminSlug, setIsAdmin }
) {
  if (slug) {
    if (sub === 'foto')           { setView('photo');        return }
    if (sub === 'qalereya-idare') { setView('gallery-page'); return }

    const viewParam  = params.get('view')
    const dParam     = params.get('d')
    const dataParam  = params.get('data')

    /* Yekun müştəri dəvətnaməsi: ?view=live&d=TOKEN */
    if (viewParam === 'live' && dParam) {
      const decoded = decodeData(dParam)
      if (decoded) setWeddingData({ ...defaultWedding, ...decoded })
      setView('invite')
      return
    }

    /* Admin modu */
    if (hasAdminAccess) {
      if (dataParam) {
        const decoded = decodeData(dataParam)
        if (decoded) setWeddingData({ ...defaultWedding, ...decoded })
      }
      setAdminSlug(slug)
      setView('admin-review')
      return
    }

    /* Köhnə format: ?data= (geriyə uyğunluq)
       ?admin= olan URL-lərdə skip edilir — admin cəhdi var idi */
    if (dataParam && !adminAttempted) {
      const decoded = decodeData(dataParam)
      if (decoded) {
        setWeddingData({ ...defaultWedding, ...decoded })
        setView('invite')
        return
      }
    }

    /* Slug var, data yoxdur → DB-dən yüklə */
    getInvitation(slug)
      .then(function(result) {
        if (result) {
          setWeddingData({ ...defaultWedding, ...result })
          setView('invite')
        } else {
          setView('invite-not-found')
        }
      })
      .catch(function() { setView('invite-not-found') })
    return
  }

  /* Kök URL-də admin+data */
  const rootDataParam = params.get('data')
  if (hasAdminAccess && rootDataParam) {
    const decoded = decodeData(rootDataParam)
    if (decoded) {
      setWeddingData({ ...defaultWedding, ...decoded })
      setView('admin-review')
      return
    }
  }

  setView('landing')
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
    const adminKeyParam = params.get('admin')
    const routeCtx = { slug, sub, params }
    const setters = { setView, setWeddingData, setAdminSlug, setIsAdmin }

    if (adminKeyParam) {
      /* Admin key var → backend-də yoxla, token al */
      adminLogin(adminKeyParam)
        .then(function(loginResult) {
          sessionStorage.setItem('adminToken', loginResult.token)
          sessionStorage.setItem('adminTokenExp', String(loginResult.exp))
          setIsAdmin(true)
          routeAfterAuth({ ...routeCtx, hasAdminAccess: true }, setters)
        })
        .catch(function() {
          /* Yanlış key/server xətası — ?data= legacy path-ı skip et */
          routeAfterAuth({ ...routeCtx, hasAdminAccess: false, adminAttempted: true }, setters)
        })
      return
    }

    /* Admin key yoxdur — sessionStorage-dakı token-ı yoxla */
    const existingToken = getStoredAdminToken()
    if (existingToken) setIsAdmin(true)
    routeAfterAuth({ ...routeCtx, hasAdminAccess: !!existingToken }, setters)
  }, [])

  if (ACTIVE_UI === 'new') return <DigitoyOrijinalUI />

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
          lang={lang} setLang={setLang}
          weddingData={demoInvitation}
          isDemoMode={true}
          initialGuestbook={demoGuestbook}
          onBack={() => { window.history.pushState({}, '', '/'); setView('landing') }}
        />
      </div>
    )
  }

  if (view === 'photo')        return <PhotoShare />
  if (view === 'gallery-page') return <GalleryPage />

  if (view === 'admin-review') {
    return (
      <div className="min-h-screen bg-cream">
        <LandingPage
          lang={lang} setLang={setLang}
          weddingData={weddingData} setWeddingData={setWeddingData}
          onViewInvitation={() => {
            if (adminSlug) window.history.pushState({}, '', `/invite/${adminSlug}`)
            setView('invite')
          }}
          onDemo={() => { window.history.pushState({}, '', '/demo'); setView('demo') }}
          isAdmin={true} initialShowPreview={false}
        />
      </div>
    )
  }

  if (view === 'invite-not-found') {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
        <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.6), transparent)', marginBottom: 28 }} />
        <p className="font-mono text-[10px] tracking-[0.38em] uppercase text-gold mb-4">Digitoy.az</p>
        <h1 className="font-serif text-2xl text-ink font-light tracking-tight mb-3">Bu dəvətnamə tapılmadı</h1>
        <p className="text-brown-muted text-sm font-light leading-relaxed max-w-xs">
          Link köhnəlmiş və ya yanlış ola bilər. Dəvətnamə sahibindən yeni link tələb edin.
        </p>
        <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.4), transparent)', marginTop: 28 }} />
      </div>
    )
  }

  if (view === 'invite') {
    return (
      <div className="min-h-screen bg-cream">
        <InvitationPage
          lang={lang} setLang={setLang}
          weddingData={weddingData} isAdmin={isAdmin}
          onBack={() => { window.history.pushState({}, '', '/'); setView('landing') }}
        />
      </div>
    )
  }

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen bg-cream" style={view === 'invitation' ? { display: 'none' } : {}}>
        <LandingPage
          lang={lang} setLang={setLang}
          weddingData={weddingData} setWeddingData={setWeddingData}
          onViewInvitation={() => setView('invitation')}
          onDemo={() => { window.history.pushState({}, '', '/demo'); setView('demo') }}
          isAdmin={isAdmin}
        />
      </div>
      {view === 'invitation' && (
        <div className="min-h-screen bg-cream">
          <InvitationPage
            lang={lang} setLang={setLang}
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
