import { useState, useEffect } from 'react'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
import PhotoShare from './components/invitation/PhotoShare'
import GalleryPage from './components/invitation/GalleryPage'
import DigitoyOrijinalUI from './components/DigitoyOrijinalUI'
import AdminBar from './components/admin/AdminBar'
import Preview from './components/landing/Preview'
import BuilderForm from './components/landing/BuilderForm'
import { defaultWedding } from './data/defaultWedding'
import { demoInvitation, demoGuestbook } from './data/demoInvitation'
import { getInvitation, saveInvitation } from './utils/api'
import SmoothCursor from './components/ui/SmoothCursor'
import ScrollProgress from './components/ui/ScrollProgress'
import './App.css'

const ACTIVE_UI  = 'v3'
const ADMIN_KEY  = 'digitoyadmin2026'

/* ── URL-safe Base64 deşifrəsi ── */
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

/* ── Ad → slug çevricisi (Preview-dəki ilə eyni) ── */
function toSlug(str = '') {
  return str.toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/[ışı]/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'davetname'
}

function computeSlugFromData(data) {
  const isCouple = ['toy', 'nishan'].includes(data.eventType)
  const isCorp   = ['corporate', 'other'].includes(data.eventType)
  if (isCouple) return `${toSlug(data.brideName || '')}-ve-${toSlug(data.groomName || '')}`
  if (isCorp)   return toSlug(data.eventName || 'tedbir')
  return toSlug(data.brideName || 'davetname')
}

/* ── /invite/SLUG[/sub] parse ── */
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
  const [adminSaving, setAdminSaving] = useState(false)

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

    /* ── Slug olan URL-lər ── */
    if (slug) {
      if (sub === 'foto')            { setView('photo');        return }
      if (sub === 'qalereya-idare')  { setView('gallery-page'); return }

      /* DB-dən yüklə */
      const loadFromServer = async () => {
        let loaded = null
        try {
          const data = await getInvitation(slug)
          if (data) loaded = data
        } catch { /* server əlçatmaz */ }

        /* Fallback: URL data token */
        if (!loaded) {
          const token = params.get('data')
          if (token) {
            const decoded = decodeData(token)
            if (decoded) {
              loaded = decoded
              saveInvitation(slug, decoded).catch(() => {})
            }
          }
        }

        if (loaded) {
          setWeddingData({ ...defaultWedding, ...loaded })
        }
        /* Data olsa da olmasa da — admin isə admin-review, deyilsə invite */
        setAdminSlug(slug)
        if (hasAdminAccess) {
          setView('admin-review')
        } else if (loaded) {
          setView('invite')
        } else {
          /* Heç bir data yoxdur + admin deyil → ana səhifə */
          window.history.replaceState({}, '', '/')
          setView('landing')
        }
      }

      loadFromServer()
      return
    }

    /* ── Slug yoxdur: kök URL-də admin+data parametrləri ── */
    const token = params.get('data')
    if (hasAdminAccess && token) {
      const decoded = decodeData(token)
      if (decoded) {
        setWeddingData({ ...defaultWedding, ...decoded })
        const slug2 = computeSlugFromData(decoded)
        setAdminSlug(slug2)
        setView('admin-review')
        return
      }
    }

    /* Admin parametri var amma data/slug yoxdur → admin-review boş formla */
    if (hasAdminAccess) {
      setAdminSlug('')
      setView('admin-review')
      return
    }

    setView('landing')
  }, [])

  /* ── Admin: DB-yə saxla ── */
  const handleAdminSave = async () => {
    if (!adminSlug) throw new Error('Slug yoxdur')
    setAdminSaving(true)
    try {
      await saveInvitation(adminSlug, weddingData)
    } finally {
      setAdminSaving(false)
    }
  }

  /* ── Admin: Təsdiqlə + linki kopyala + açıq ── */
  const handleAdminApprove = async () => {
    if (!adminSlug) throw new Error('Slug yoxdur')
    setAdminSaving(true)
    try {
      await saveInvitation(adminSlug, weddingData)
      const link = `${window.location.origin}/invite/${adminSlug}`
      navigator.clipboard.writeText(link).catch(() => {})
      window.open(link, '_blank')
    } finally {
      setAdminSaving(false)
    }
  }

  /* ── Admin: Redaktə bitdi → nəzərdən keçirməyə qayıt ── */
  const handleAdminEditDone = (data) => {
    setWeddingData(data)
    /* Əgər slug yoxdursa, datadan hesabla */
    if (!adminSlug) setAdminSlug(computeSlugFromData(data))
    setView('admin-review')
  }

  if (ACTIVE_UI === 'new') return <DigitoyOrijinalUI />

  /* ── Yükləmə ekranı ── */
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

  /* ── Demo Dəvətnamə ── */
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

  /* ════════════════════════════════════════════════
     ADMIN NƏZƏRDƏN KEÇİRMƏSİ — Preview + AdminBar
  ════════════════════════════════════════════════ */
  if (view === 'admin-review') {
    const inviteLink = adminSlug
      ? `${window.location.origin}/invite/${adminSlug}`
      : `${window.location.origin}/invite/${computeSlugFromData(weddingData)}`

    return (
      <div className="min-h-screen bg-cream">
        <AdminBar
          slug={adminSlug || computeSlugFromData(weddingData)}
          onEdit={() => setView('admin-edit')}
          onSave={handleAdminSave}
          onApprove={handleAdminApprove}
          isEditing={false}
        />

        {/* ── Mərkəzi kart: müştərinin sifariş xülasəsi ── */}
        <div style={{ paddingTop: 52 }} className="px-4 py-12 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[9px] tracking-[0.30em] uppercase text-gold mb-2 font-medium">Admin — Sifariş Xülasəsi</p>
            <h2 className="font-serif text-2xl text-ink font-light tracking-tight">Sifarişi Nəzərdən Keçir</h2>
            <div className="gold-divider mt-6 max-w-[120px] mx-auto" />
          </div>

          <Preview
            lang={lang}
            data={weddingData}
            onEdit={() => setView('admin-edit')}
            onView={() => window.open(inviteLink, '_blank')}
            isAdmin={true}
          />
        </div>
      </div>
    )
  }

  /* ════════════════════════════════════════════════
     ADMIN REDAKTƏ MODU — BuilderForm + AdminBar
  ════════════════════════════════════════════════ */
  if (view === 'admin-edit') {
    return (
      <div className="min-h-screen bg-beige">
        <AdminBar
          slug={adminSlug || computeSlugFromData(weddingData)}
          onBack={() => setView('admin-review')}
          onSave={handleAdminSave}
          onApprove={handleAdminApprove}
          isEditing={true}
        />

        <div style={{ paddingTop: 52 }} className="px-4 py-10 pb-24 max-w-2xl mx-auto">
          {/* Başlıq */}
          <div className="text-center mb-10">
            <p className="text-[9px] tracking-[0.30em] uppercase text-gold mb-2 font-medium">Admin — Redaktə Rejimi</p>
            <h2 className="font-serif text-2xl text-ink font-light tracking-tight">Məlumatları Yenilə</h2>
            <div className="gold-divider mt-6 max-w-[120px] mx-auto" />
          </div>

          {/* BuilderForm — bütün addımlar, data Admin-in saxladığı weddingData-dır */}
          <BuilderForm
            lang={lang}
            initialData={weddingData}
            initialStep={1}
            onSubmit={handleAdminEditDone}
            onDataChange={setWeddingData}
            isAdmin={true}
          />
        </div>
      </div>
    )
  }

  /* ── Müştərinin dəvətnaməsi ── */
  if (view === 'invite') {
    return (
      <div className="min-h-screen bg-cream">
        <InvitationPage
          lang={lang} setLang={setLang}
          weddingData={weddingData}
          isAdmin={isAdmin}
          onBack={() => { window.history.pushState({}, '', '/'); setView('landing') }}
        />
      </div>
    )
  }

  /* ── Ana Səhifə (LandingPage, həmişə mounted) ── */
  return (
    <>
      <SmoothCursor />
      <ScrollProgress />
      <div className="min-h-screen bg-cream" style={view === 'invitation' ? { display: 'none' } : {}}>
        <LandingPage
          lang={lang} setLang={setLang}
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
