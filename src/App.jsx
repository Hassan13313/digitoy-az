import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
/* Route-level code splitting — isolated, non-landing routes load on demand,
   shrinking the initial bundle for the home/invite paths. SEO unaffected
   (these routes are all noindex). */
const PhotoShare       = lazy(() => import('./components/invitation/PhotoShare'))
const GalleryPage      = lazy(() => import('./components/invitation/GalleryPage'))
const AdminApp         = lazy(() => import('./components/admin/AdminApp'))
const AdminLoginGate   = lazy(() => import('./components/admin/AdminLoginGate'))
const TemplatesPage    = lazy(() => import('./components/landing/TemplatesPage'))
/* Template Engine — InvitationPage onsuz da statik import edir,
   preview marşrutu üçün ayrıca chunk yaratmağa ehtiyac yoxdur. */
import TemplateRenderer from './templates/TemplateRenderer'
import { defaultWedding } from './data/defaultWedding'
import { demoInvitation, demoGuestbook } from './data/demoInvitation'
import { DEFAULT_TEMPLATE_ID, getTemplateConfig, resolveTemplateId } from './templates/templateConfig'
import { getInvitation, adminLogin, getDraftByCode } from './utils/api'
import { unlockAudio } from './utils/audioUnlock'
import ScrollProgress from './components/ui/ScrollProgress'
import { useSEO } from './hooks/useSEO'
import { initAnalytics, trackPageView, trackEvent } from './utils/analytics'
import './App.css'

const ACTIVE_UI = 'v3'

const HOME_TITLE = 'DigiToy — Rəqəmsal Toy Dəvətnaməsi, İştirak Təsdiqi və QR Foto Paylaşımı'
const HOME_DESC  = 'Bir Dəvətnamədən Daha Artığı. İştirak Təsdiqi (RSVP), oturma planı, QR foto paylaşımı və premium rəqəmsal toy dəvətnamələri.'

/* ── view → SEO konfiqurasiyası (title/description/canonical/OG/Twitter) ── */
function getSEOConfig(view, { weddingData, slug } = {}) {
  switch (view) {
    case 'landing':
    case 'invitation':
      return { title: HOME_TITLE, description: HOME_DESC, path: '/', type: 'website' }

    case 'demo':
      return {
        title: 'Nümunə Dəvətnamə — DigiToy Rəqəmsal Toy Dəvətnaməsi',
        description: 'DigiToy rəqəmsal toy dəvətnaməsinin canlı nümunəsinə baxın: İştirak Təsdiqi, oturma planı, QR foto paylaşımı və premium dizayn bir arada.',
        path: '/demo',
        type: 'website',
      }

    /* Şablonlar vitrini — müştəriyə göndərilə bilən ictimai səhifə */
    case 'templates':
      return {
        title: 'Dəvətnamə Şablonları — DigiToy',
        description: 'DigiToy-un bütün rəqəmsal dəvətnamə şablonları: klassik qızıl, botanik bağ, modern qara, gecə səması və daha çoxu. Hər birinin canlı önbaxışına baxın.',
        path: '/templates',
        type: 'website',
      }

    /* Şablon önbaxışı — yalnız daxili test marşrutu, indekslənmir */
    case 'template-preview':
      return {
        title: 'Şablon Önbaxışı | DigiToy',
        description: 'DigiToy dəvətnamə şablonlarının daxili önbaxış səhifəsi.',
        noindex: true,
      }

    case 'invite': {
      const bride = weddingData?.brideName || ''
      const groom = weddingData?.groomName || ''
      /* Phase 27.1: göstərim sırası BƏY → GƏLİN (slug toxunulmur) */
      const names = [groom, bride].filter(Boolean).join(' & ')
      const title = names ? `${names} — Toy Dəvətnaməsi | DigiToy` : 'Toy Dəvətnaməsi | DigiToy'
      const venue = weddingData?.venueName ? ` ${weddingData.venueName} məkanında` : ''
      const description = names
        ? `${names} sizi toy mərasiminə dəvət edir.${venue} Rəqəmsal dəvətnaməyə baxın, İştirak Təsdiqi göndərin.`
        : HOME_DESC
      /* Müştəri tarixi/məkan/ad kimi şəxsi məlumatlar daşıyır — axtarış
         nəticələrində görünməsin (noindex), amma WhatsApp/Telegram
         paylaşım önbaxışları üçün OG/Twitter meta-ları aktiv qalsın
         və link əlçatan olsun (follow). */
      return { title, description, path: slug ? `/invite/${slug}` : '/', type: 'profile', noindex: true }
    }

    case 'invite-not-found':
      return { title: 'Dəvətnamə tapılmadı | DigiToy', description: 'Axtardığınız dəvətnamə mövcud deyil və ya köhnəlmiş linkdir.', path: '/', noindex: true }

    case 'photo':
    case 'gallery-page':
      return { title: 'Foto Paylaşımı | DigiToy', description: 'Toy qonaqlarının foto paylaşım səhifəsi.', noindex: true }

    case 'admin-panel':
    case 'admin-login':
    case 'admin-review':
      return { title: 'Admin Panel | DigiToy', description: 'DigiToy idarəetmə paneli.', noindex: true }

    default:
      return { title: HOME_TITLE, description: HOME_DESC, path: '/', type: 'website' }
  }
}

/* ── view → GA4 page_view path-ı (yalnız ictimai 5 marşrut izlənir) ── */
function getAnalyticsPath(view, slug) {
  switch (view) {
    case 'landing':
    case 'invitation': return '/'
    case 'demo':       return '/demo'
    case 'invite':     return slug ? `/invite/${slug}` : null
    case 'photo':      return slug ? `/invite/${slug}/foto` : null
    case 'gallery-page': return slug ? `/invite/${slug}/qalereya-idare` : null
    default: return null
  }
}

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

/* Phase 27: /demo marşrutunun şablonu. Landing-dəki bütün "Nümunə dəvətnamə"
   CTA-ları da bura gəlir — tək mənbə budur, dəyişmək üçün yalnız bu sətir. */
const DEMO_TEMPLATE_ID = 'floral-garden'

/* ── /demo/template/:id — daxili şablon önbaxışı (production linklərinə toxunmur) ── */
function parseTemplatePreviewId() {
  const match = window.location.pathname.match(/^\/demo\/template\/([^/?#]+)\/?$/)
  return match ? decodeURIComponent(match[1]) : null
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

  /* Kök URL-də admin ── data varsa decode, admin-review hər halda açılır */
  if (hasAdminAccess) {
    const rootDataParam = params.get('data')
    if (rootDataParam) {
      const decoded = decodeData(rootDataParam)
      if (decoded) setWeddingData({ ...defaultWedding, ...decoded })
    }
    setView('admin-review')
    return
  }

  setView('landing')
}

/* Shared cream loading spinner — initial route + lazy-route Suspense fallback */
function RouteLoader() {
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

export default function App() {
  const [view,        setView]        = useState('loading')
  const [lang,        setLang]        = useState('az')
  const [weddingData, setWeddingData] = useState(defaultWedding)
  const [isAdmin,     setIsAdmin]     = useState(false)
  const [adminSlug,   setAdminSlug]   = useState('')
  const [entering,    setEntering]    = useState(false)
  /* Şablon önbaxışı (/demo/template/:id) — yalnız daxili test */
  const [previewTemplateId, setPreviewTemplateId] = useState(DEFAULT_TEMPLATE_ID)
  /* Önbaxışdan builder-ə qayıdanda bərpa olunan paket (Phase 27.1) */
  const [resumePackage, setResumePackage] = useState(null)
  /* «Paketlərə keç» — landing paket kartları ilə açılsın (Phase 27.4) */
  const [packagesIntent, setPackagesIntent] = useState(false)

  /* Hər view dəyişəndə <head> meta-larını yenilə (title, description, OG, Twitter, canonical) */
  useSEO(getSEOConfig(view, { weddingData, slug: adminSlug || parseInviteSlug().slug }))

  /* ⚠ KRİTİK LOCALE DÜZƏLİŞİ (Phase 27): `<html lang>` statik olaraq "az" idi və
     dil dəyişəndə yenilənmirdi. CSS `text-transform: uppercase` element dilinə
     görə işlədiyi üçün Azərbaycan qaydası BÜTÜN mətnə tətbiq olunurdu:
     ingilis "Wedding" → "WEDDİNG", "Min" → "MİN", rus "DigiToy" → "DİGİTOY".
     Dil ilə birlikdə yenilənəndə hər dil öz düzgün böyük hərf qaydasını alır. */
  useEffect(() => { document.documentElement.lang = lang || 'az' }, [lang])

  /* Analitika: GA4/PostHog-u bir dəfə işə sal (yalnız production + env dəyişənləri varsa) */
  useEffect(() => { initAnalytics() }, [])

  /* Spesifikasiyada göstərilən 5 marşrut üçün SPA page_view izləməsi */
  useEffect(() => {
    const path = getAnalyticsPath(view, adminSlug || parseInviteSlug().slug)
    if (path) trackPageView(path)
  }, [view, adminSlug])

  /* Cream fade overlay before route switch — gives a luxury page-transition feel */
  const navigateTo = useCallback((fn) => {
    unlockAudio()   // unlock audio context on first user gesture (Demo Gör, Nümunə, etc.)
    setEntering(true)
    setTimeout(() => {
      fn()
      window.scrollTo(0, 0)   // new view always starts from the top, regardless of prior scroll position
      setTimeout(() => setEntering(false), 80)
    }, 800)
  }, [])

  /* Önbaxış/dəvətnamə səhifələrindən builder-ə qayıdış.
     Ayrıca `/builder` marşrutu yoxdur — builder landing səhifəsinin içindədir,
     ona görə landing-ə keçib `#builder-content` bloku görünəcək yerə sürüşürük. */
  /* ── Şablon önbaxışından GERİ ────────────────────────────────────────────
     İstifadəçi önbaxışa haradan girdisə ora qayıdır (Phase 27.3):
       • `/templates` vitrinindən  → vitrinə, filtrlər + scroll bərpa olunur
       • builder-dən              → builder-ə, paket saxlanılır, şablon seçiminə scroll
       • birbaşa link (kontekst yox) → landing/builder (default)
     Kontekst önbaxış açılarkən sessionStorage-a yazılır. */
  const goBackFromPreview = useCallback(() => {
    let ctx = null
    try {
      const raw = sessionStorage.getItem('digitoy_preview_return')
      if (raw) ctx = JSON.parse(raw)
      sessionStorage.removeItem('digitoy_preview_return')
    } catch { /* private mode */ }

    if (ctx?.origin === 'templates') {
      /* Vitrin öz vəziyyətini mount-da bu açardan oxuyur */
      try {
        sessionStorage.setItem('digitoy_templates_restore', JSON.stringify({
          status: ctx.status, category: ctx.category, scrollY: ctx.scrollY,
        }))
      } catch { /* private mode */ }
      window.history.pushState({}, '', '/templates')
      setView('templates')
      return
    }

    if (ctx?.pkg) setResumePackage(ctx.pkg)
    window.history.pushState({}, '', '/')
    setView('landing')

    /* Scroll bərpası — builder blokunun tam qurulması bir neçə kadr çəkir
       (paket → BuilderForm mount → şablon kartları). Ona görə tək setTimeout
       kifayət etmir: səhifə hündürlüyü hədəfə çatana qədər bir neçə dəfə
       cəhd edilir, sonra dayanır. */
    const target = ctx?.scrollY
    let tries = 0
    const tick = () => {
      tries += 1
      const el = document.getElementById(ctx?.pkg ? 'template-select' : 'builder-content')
        || document.getElementById('builder-content')
      /* Əvvəlcə dəqiq mövqe (istifadəçi harada idisə), yoxdursa bloka hizala */
      const top = Number.isFinite(target) && target > 0
        ? target
        : (el ? el.getBoundingClientRect().top + window.pageYOffset - 72 : null)
      if (top == null) { if (tries < 12) setTimeout(tick, 120); return }
      /* Səhifə hələ o qədər uzun deyilsə — gözlə */
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (top > maxScroll + 8 && tries < 12) { setTimeout(tick, 120); return }
      window.scrollTo({ top: Math.min(top, Math.max(0, maxScroll)), behavior: 'auto' })
    }
    setTimeout(tick, 220)
  }, [])

  /* Landing-in builder blokuna keçid (şablon vitrinindəki "Dəvətnaməni hazırla") */
  const goToBuilder = useCallback(() => {
    window.history.pushState({}, '', '/')
    setView('landing')
    setTimeout(() => {
      const el = document.getElementById('builder-content')
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' })
    }, 260)
  }, [])

  /* Builder-dəki "Önbaxış" düyməsi — eyni tabda şablon önbaxışına keç */
  useEffect(() => {
    const onPreview = (e) => {
      const id = e?.detail?.id
      if (!id) return
      setPackagesIntent(false)
      window.history.pushState({}, '', `/demo/template/${id}`)
      setPreviewTemplateId(resolveTemplateId(id, { allowDisabled: true }))
      setView('template-preview')
      window.scrollTo(0, 0)
    }
    window.addEventListener('digitoy:preview', onPreview)
    return () => window.removeEventListener('digitoy:preview', onPreview)
  }, [])

  /* ── «Paketlərə keç» (şablonun son CTA-sı) ─────────────────────────────────
     Demo / önbaxış / vitrin — hamısından landing-in paket kartlarına aparır.
     Sərt reload YOXDUR: yalnız view dəyişir, sonra LandingPage `#paketler`-ə
     hamar scroll edir. Builder snapshot-una TOXUNMUR, ona görə istifadəçi
     paketi seçən kimi forma məlumatları olduğu kimi qayıdır. */
  useEffect(() => {
    const onPackages = () => {
      window.history.pushState({}, '', '/')
      setPackagesIntent(true)
      setView('landing')
      window.scrollTo(0, 0)
    }
    window.addEventListener('digitoy:packages', onPackages)
    return () => window.removeEventListener('digitoy:packages', onPackages)
  }, [])

  /* ⚠ Brauzerin öz GERİ/İRƏLİ düymələri (Phase 27.3).
     Əvvəl `popstate` dinlənilmirdi: pushState ilə açılan önbaxışdan geri
     basanda URL dəyişir, ekran isə önbaxışda qalırdı. İndi URL-ə uyğun
     view bərpa olunur. */
  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname
      /* Brauzerin geri/irəli düyməsi «Paketlərə keç» niyyətini ləğv edir —
         əks halda builder əvəzinə paket kartları açılırdı. */
      setPackagesIntent(false)
      const previewId = parseTemplatePreviewId()
      if (previewId) {
        setPreviewTemplateId(resolveTemplateId(previewId, { allowDisabled: true }))
        setView('template-preview')
        return
      }
      if (/^\/templates\/?$/.test(path)) { setView('templates'); return }
      if (path === '/demo') { setView('demo'); return }
      if (path === '/') { setView('landing'); return }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    /* Admin Panel — /admin/* route-ları */
    if (window.location.pathname.startsWith('/admin')) {
      const stored = getStoredAdminToken()
      if (stored) {
        setIsAdmin(true)
        setView('admin-panel')
      } else {
        setView('admin-login')   /* Token yoxdur → login gate */
      }
      return
    }

    /* Şablon önbaxışı — /demo/template/:id
       Naməlum id → simple-luxury fallback (resolveTemplateId).
       ⚠ /demo-dan ƏVVƏL yoxlanılır ki, alt-marşrut tutulsun. */
    const previewId = parseTemplatePreviewId()
    if (previewId) {
      setPreviewTemplateId(resolveTemplateId(previewId, { allowDisabled: true }))
      setView('template-preview')
      return
    }

    if (window.location.pathname === '/demo') {
      setView('demo')
      return
    }

    /* Şablonlar vitrini — /templates (müştəriyə göndərilən ictimai link) */
    if (/^\/templates\/?$/.test(window.location.pathname)) {
      setView('templates')
      return
    }

    const { slug, sub } = parseInviteSlug()
    const params = new URLSearchParams(window.location.search)
    const adminKeyParam = params.get('admin')
    const draftParam    = params.get('draft')
    const routeCtx = { slug, sub, params }
    const setters = { setView, setWeddingData, setAdminSlug, setIsAdmin }

    /* ?draft=DT-XXXXXX olan URL-lərdə DB-dən form data yüklə, sonra admin-review aç
       slug olmasa da işləyir — admin paneldən /?admin=KEY&draft=DT- axını üçün */
    function routeWithDraft(hasAccess) {
      if (draftParam && hasAccess) {
        getDraftByCode(draftParam)
          .then(function(draft) {
            if (draft?.found && draft.form_data) {
              setWeddingData(function(prev) { return { ...prev, ...draft.form_data } })
            }
            if (slug) setAdminSlug(slug)
            setView('admin-review')
          })
          .catch(function() {
            routeAfterAuth({ ...routeCtx, hasAdminAccess: true }, setters)
          })
      } else {
        routeAfterAuth({ ...routeCtx, hasAdminAccess: hasAccess }, setters)
      }
    }

    if (adminKeyParam) {
      /* Admin key var → backend-də yoxla, token al */
      adminLogin(adminKeyParam)
        .then(function(loginResult) {
          sessionStorage.setItem('adminToken', loginResult.token)
          sessionStorage.setItem('adminTokenExp', String(loginResult.exp))
          setIsAdmin(true)
          routeWithDraft(true)
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
    routeWithDraft(!!existingToken)
  }, [])

  if (view === 'loading') return <RouteLoader />

  /* ── ŞABLON ÖNBAXIŞI — /demo/template/:id ──
     Yalnız daxili test üçün. Demo datası ilə işləyir, DB-yə toxunmur,
     builder/admin/production invite marşrutlarından tam təcrid olunub.
     isPreview={true} → hazırlanmaqda olan (enabled=false) şablonlar da açılır. */
  if (view === 'template-preview') {
    const previewConfig = getTemplateConfig(previewTemplateId)
    return (
      <div className="min-h-screen bg-cream">
        {/* Daxili test lenti — canlı müştəri bu marşruta düşmür */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 220,
          padding: '5px 12px', textAlign: 'center',
          background: 'rgba(26,20,12,0.86)', color: 'rgba(255,255,255,0.82)',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
          pointerEvents: 'none', backdropFilter: 'blur(6px)',
        }}>
          Önbaxış · {previewConfig?.name || previewTemplateId} · {previewTemplateId}
        </div>
        <TemplateRenderer
          template={previewTemplateId}
          isPreview={true}
          lang={lang} setLang={setLang}
          weddingData={demoInvitation}
          isDemoMode={true}
          initialGuestbook={demoGuestbook}
          onBack={goBackFromPreview}
        />
      </div>
    )
  }

  /* ── /templates — şablonlar vitrini (Phase 27.1).
     Bütün məlumat `templateConfig`-dən oxunur, builder-dən asılı deyil. ── */
  if (view === 'templates') {
    return (
      <Suspense fallback={<RouteLoader />}>
        <TemplatesPage
          lang={lang} setLang={setLang}
          onBack={() => { window.history.pushState({}, '', '/'); setView('landing'); window.scrollTo(0, 0) }}
          onPreview={(tpl) => {
            window.history.pushState({}, '', `/demo/template/${tpl.id}`)
            setPreviewTemplateId(tpl.id)
            setView('template-preview')
            window.scrollTo(0, 0)
          }}
          onCreate={goToBuilder}
        />
      </Suspense>
    )
  }

  /* ── /demo — Phase 27: nümunə dəvətnamə artıq FLORAL GARDEN şablonudur.
     URL istifadəçi üçün `/demo` olaraq qalır (pushState edilmir). ── */
  if (view === 'demo') {
    return (
      <div className="min-h-screen bg-cream">
        <TemplateRenderer
          template={DEMO_TEMPLATE_ID}
          lang={lang} setLang={setLang}
          weddingData={demoInvitation}
          isDemoMode={true}
          initialGuestbook={demoGuestbook}
          onBack={() => { window.history.pushState({}, '', '/'); setView('landing') }}
        />
      </div>
    )
  }

  if (view === 'photo')        return <Suspense fallback={<RouteLoader />}><PhotoShare /></Suspense>
  if (view === 'gallery-page') return <Suspense fallback={<RouteLoader />}><GalleryPage /></Suspense>
  if (view === 'admin-panel')  return <Suspense fallback={<RouteLoader />}><AdminApp lang={lang} setLang={setLang} /></Suspense>
  if (view === 'admin-login')  return (
    <Suspense fallback={<RouteLoader />}>
      <AdminLoginGate onSuccess={() => { setIsAdmin(true); setView('admin-panel') }} />
    </Suspense>
  )

  if (view === 'admin-review') {
    return (
      <>
        {entering && (
          <motion.div
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#FDFAF4', pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <div className="min-h-screen bg-cream">
          <LandingPage
            lang={lang} setLang={setLang}
            weddingData={weddingData} setWeddingData={setWeddingData}
            onViewInvitation={() => navigateTo(() => {
              if (adminSlug) window.history.pushState({}, '', `/invite/${adminSlug}`)
              setView('invite')
            })}
            onDemo={() => { trackEvent('demo_opened', { lang }); navigateTo(() => { window.history.pushState({}, '', '/demo'); setView('demo') }) }}
            isAdmin={true} initialShowPreview={false}
          />
        </div>
      </>
    )
  }

  if (view === 'invite-not-found') {
    const goHome = () => { window.history.pushState({}, '', '/'); setView('landing') }
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        {/* Ambient gold glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 35% at 50% 38%, rgba(197,160,89,0.08) 0%, transparent 65%)',
        }} />
        <div className="relative">
          <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.6), transparent)', margin: '0 auto 28px' }} />
          <p className="font-mono text-[10px] tracking-[0.38em] uppercase text-gold mb-6">Digitoy.az</p>
          <p className="font-serif text-gold/35 font-light leading-none mb-4" style={{ fontSize: 'clamp(56px, 16vw, 96px)' }}>404</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-light tracking-tight mb-4">Bu dəvətnamə tapılmadı.</h1>
          <p className="text-brown-muted text-sm font-light leading-relaxed max-w-xs mx-auto mb-10">
            Link köhnəlmiş və ya yanlış ola bilər. Zəhmət olmasa dəvətnamə sahibindən yeni link tələb edin.
          </p>
          <button
            onClick={goHome}
            className="inline-flex items-center gap-2.5 btn-gold"
            style={{ textDecoration: 'none' }}
          >
            Ana səhifəyə qayıt
            <span style={{ fontSize: 14 }}>→</span>
          </button>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.4), transparent)', margin: '40px auto 0' }} />
        </div>
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
      {entering && (
        <motion.div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#FDFAF4', pointerEvents: 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.48, ease: 'easeInOut' }}
        />
      )}
      <ScrollProgress />
      <div className="min-h-screen bg-cream" style={view === 'invitation' ? { display: 'none' } : {}}>
        <LandingPage
          lang={lang} setLang={setLang}
          weddingData={weddingData} setWeddingData={setWeddingData}
          initialPackage={resumePackage}
          showPackages={packagesIntent}
          onViewInvitation={() => navigateTo(() => setView('invitation'))}
          onDemo={() => { trackEvent('demo_opened', { lang }); navigateTo(() => { window.history.pushState({}, '', '/demo'); setView('demo') }) }}
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
