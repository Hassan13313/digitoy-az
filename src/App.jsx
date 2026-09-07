import { useState, useEffect, useRef } from 'react'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
import PhotoShare from './components/invitation/PhotoShare'
import GalleryPage from './components/invitation/GalleryPage'
import { defaultWedding } from './data/defaultWedding'
import { demoInvitation, demoGuestbook } from './data/demoInvitation'
import ScrollProgress from './components/ui/ScrollProgress'
import './App.css'

const ACTIVE_UI = 'v3'

/* ── Admin token helpers (sessionStorage, 8-saat müddəti) ── */
function getStoredToken() {
  const token = sessionStorage.getItem('adminToken')
  const exp   = Number(sessionStorage.getItem('adminTokenExp') || 0)
  return token && exp > Math.floor(Date.now() / 1000) ? token : null
}

async function verifyAdminKey(key) {
  try {
    const res = await fetch('/api/admin_login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    })
    const json = await res.json()
    if (json.ok && json.token) {
      sessionStorage.setItem('adminToken', json.token)
      sessionStorage.setItem('adminTokenExp', String(json.exp))
      return true
    }
  } catch {}
  return false
}

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

  /* Admin login UI state */
  const [adminLoginKey,     setAdminLoginKey]     = useState('')
  const [adminLoginError,   setAdminLoginError]   = useState('')
  const [adminLoginLoading, setAdminLoginLoading] = useState(false)
  const pendingParamsRef = useRef(null)

  /* ── URL routing məntiqini ayır — auth statusu bəlli olandan sonra çağırılır ── */
  const doRoute = (hasAdmin, params) => {
    if (window.location.pathname === '/demo') { setView('demo'); return }

    const { slug, sub } = parseInviteSlug()

    if (hasAdmin) setIsAdmin(true)

    if (slug) {
      if (sub === 'foto')           { setView('photo');        return }
      if (sub === 'qalereya-idare') { setView('gallery-page'); return }

      const viewParam = params.get('view')
      const dParam    = params.get('d')
      const dataParam = params.get('data')

      if (viewParam === 'live' && dParam) {
        const decoded = decodeData(dParam)
        if (decoded) setWeddingData({ ...defaultWedding, ...decoded })
        setView('invite')
        return
      }

      if (hasAdmin) {
        if (dataParam) {
          const decoded = decodeData(dataParam)
          if (decoded) setWeddingData({ ...defaultWedding, ...decoded })
        }
        setAdminSlug(slug)
        setView('admin-review')
        return
      }

      if (dataParam) {
        const decoded = decodeData(dataParam)
        if (decoded) { setWeddingData({ ...defaultWedding, ...decoded }); setView('invite'); return }
      }

      window.history.replaceState({}, '', '/')
      setView('landing')
      return
    }

    const token = params.get('data')
    if (hasAdmin && token) {
      const decoded = decodeData(token)
      if (decoded) { setWeddingData({ ...defaultWedding, ...decoded }); setView('admin-review'); return }
    }

    setView('landing')
  }

  useEffect(() => {
    if (window.location.pathname === '/demo') { setView('demo'); return }

    const params      = new URLSearchParams(window.location.search)
    const adminParam  = params.get('admin')
    const storedToken = getStoredToken()

    /* 1. Mövcud session token varsa — dərhal admin mode */
    if (storedToken) {
      doRoute(true, params)
      return
    }

    /* 2. URL-də admin parametri var — server tərəfi yoxlama */
    if (adminParam) {
      verifyAdminKey(adminParam).then(ok => {
        if (ok) {
          /* URL-dən açarı sil */
          const clean = new URL(window.location.href)
          clean.searchParams.delete('admin')
          window.history.replaceState({}, '', clean.pathname + (clean.search || ''))
        }
        doRoute(ok, params)
      })
      return
    }

    /* 3. Admin parametri yoxdur — adi istifadəçi */
    doRoute(false, params)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Admin Login Handler (view === 'admin-login' state üçün) ── */
  const handleAdminLogin = () => {
    if (!adminLoginKey.trim() || adminLoginLoading) return
    setAdminLoginLoading(true)
    setAdminLoginError('')
    verifyAdminKey(adminLoginKey.trim()).then(ok => {
      if (ok) {
        doRoute(true, pendingParamsRef.current || new URLSearchParams())
      } else {
        setAdminLoginError('Şifrə yanlışdır')
        setAdminLoginLoading(false)
      }
    })
  }

  /* URL ayrıştırılana qədər minimal yükləmə ekranı */
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

  /* Admin login formu — ?admin=KEY yoxdursa ama admin linki açılıbsa */
  if (view === 'admin-login') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div style={{
          maxWidth: 360, width: '100%',
          border: '1px solid rgba(197,160,89,0.35)',
          background: '#faf8f4',
          padding: '40px 32px',
        }}>
          <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.9),transparent)', marginBottom: 28 }} />
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold text-center mb-6 font-medium">Admin Girişi</p>
          <input
            type="password"
            value={adminLoginKey}
            onChange={e => setAdminLoginKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
            placeholder="Şifrə"
            autoFocus
            className="w-full border-b border-beige-dark/60 bg-transparent py-2.5 text-sm text-ink placeholder:text-brown-muted/40 focus:outline-none focus:border-gold/60 mb-4"
          />
          {adminLoginError && (
            <p className="text-red-400 text-xs mb-3 text-center">{adminLoginError}</p>
          )}
          <button
            onClick={handleAdminLogin}
            disabled={adminLoginLoading}
            className="w-full btn-gold text-xs py-3 disabled:opacity-50"
          >
            {adminLoginLoading ? '…' : 'Daxil ol'}
          </button>
          <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.9),transparent)', marginTop: 28 }} />
        </div>
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
