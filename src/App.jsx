import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import LandingPage from './components/landing/LandingPage'
import InvitationPage from './components/invitation/InvitationPage'
/* Route-level code splitting — isolated, non-landing routes load on demand,
   shrinking the initial bundle for the home/invite paths. SEO unaffected
   (these routes are all noindex). */
const PhotoShare       = lazy(() => import('./components/invitation/PhotoShare'))
const GalleryPage      = lazy(() => import('./components/invitation/GalleryPage'))
/* Phase 43 — TV/proyektor rejimi. Ayrı chunk: dəvətnaməni açan qonaq
   bu kodu heç vaxt endirmir. */
const SlideshowPage    = lazy(() => import('./components/invitation/SlideshowPage'))
const AdminApp         = lazy(() => import('./components/admin/AdminApp'))
const AdminLoginGate   = lazy(() => import('./components/admin/AdminLoginGate'))
const TemplatesPage    = lazy(() => import('./components/landing/TemplatesPage'))
/* Phase 47 — hüquqi səhifələr: mətnlər də ayrıca chunk-dadır */
const LegalPage        = lazy(() => import('./components/legal/LegalPage'))
/* Template Engine — InvitationPage onsuz da statik import edir,
   preview marşrutu üçün ayrıca chunk yaratmağa ehtiyac yoxdur. */
import TemplateRenderer from './templates/TemplateRenderer'
import { defaultWedding } from './data/defaultWedding'
import { demoInvitation, demoGuestbook } from './data/demoInvitation'
import { DEFAULT_TEMPLATE_ID, resolveTemplateId, isTemplateSelectable } from './templates/templateConfig'
import { getInvitation, adminLogin, getDraftByCode } from './utils/api'
import { unlockAudio } from './utils/audioUnlock'
import ScrollProgress from './components/ui/ScrollProgress'
import StatusPage from './components/public/StatusPage'
import TemplatePreviewBar from './components/public/TemplatePreviewBar'
import { readBuilderSnapshot, saveBuilderSnapshot } from './utils/builderSession'
import { trackTemplateSelected } from './templates/templateAnalytics'
import { matchLegalRoute, isKnownSpaPath } from './utils/siteRoutes'
import { pushView, goBackOr, canGoBackInApp, savedScroll, restoreScroll } from './utils/navHistory'
import { legalDoc as findLegalDoc } from './data/legal/docs'
import { legalUi } from './data/legal/ui'
import { consent } from './utils/consent'
import { useSEO } from './hooks/useSEO'
import { inviteSeoMeta } from './utils/inviteSeo'
import { initAnalytics, trackPageView, trackEvent } from './utils/analytics'
import './App.css'

/* Canlı önbaxış səhifəsi (yalnız admin iframe-i açır) — lazy, ayrı chunk.
   ⚠ Adi istifadəçi bu marşruta düşmür, ona görə əsas bundle-a əlavə çəki
   gətirmir. */
const LivePreviewPage = lazy(() => import('./components/admin/LivePreviewPage'))

const ACTIVE_UI = 'v3'

const HOME_TITLE = 'DigiToy — Rəqəmsal Toy Dəvətnaməsi, İştirak Təsdiqi və QR Foto Paylaşımı'
const HOME_DESC  = 'Bir Dəvətnamədən Daha Artığı. İştirak Təsdiqi, oturma planı, QR foto paylaşımı və premium rəqəmsal toy dəvətnamələri.'

/* ── view → SEO konfiqurasiyası (title/description/canonical/OG/Twitter) ── */
function getSEOConfig(view, { weddingData, slug, legalDoc } = {}) {
  switch (view) {
    /* Phase 47 — hüquqi səhifələr (seo.php ilə eyni mətn, bax data/legal/docs.js) */
    case 'legal': {
      const doc = findLegalDoc(legalDoc)
      if (doc) return { title: doc.title, description: doc.description, path: doc.path, type: 'website' }
      return { title: HOME_TITLE, description: HOME_DESC, path: '/', type: 'website' }
    }

    /* Ümumi 404 — seo.php eyni yola HTTP 404 və eyni başlığı verir */
    case 'not-found':
      return { title: 'Səhifə tapılmadı | DigiToy', description: 'Axtardığınız səhifə mövcud deyil.', noindex: true }

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
      /* Phase 45.2: mətn tədbir növünə görədir (bax utils/inviteSeo.js) */
      const seo = inviteSeoMeta(weddingData)
      const title = seo.title
      const description = seo.description || HOME_DESC
      /* Müştəri tarixi/məkan/ad kimi şəxsi məlumatlar daşıyır — axtarış
         nəticələrində görünməsin (noindex), amma WhatsApp/Telegram
         paylaşım önbaxışları üçün OG/Twitter meta-ları aktiv qalsın
         və link əlçatan olsun (follow). */
      return { title, description, path: slug ? `/invite/${slug}` : '/', type: 'profile', noindex: true }
    }

    /* ── Phase 36: admin tərəfindən deaktiv edilmiş dəvətnamə ──
       Status kodu 200 OLARAQ QALIR (SPA marşrutudur, server 200 verir).
       Robots: noindex + nofollow — bağlanmış link crawl edilməsin. */
    case 'invite-disabled':
      return {
        title: 'Dəvətnamə deaktivdir | DigiToy',
        description: 'Bu dəvətnamə deaktiv edilmişdir.',
        path: '/', noindex: true, nofollow: true,
      }

    case 'invite-not-found':
      return { title: 'Dəvətnamə tapılmadı | DigiToy', description: 'Axtardığınız dəvətnamə mövcud deyil və ya köhnəlmiş linkdir.', path: '/', noindex: true }

    case 'photo':
    case 'gallery-page':
      return { title: 'Foto Paylaşımı | DigiToy', description: 'Toy qonaqlarının foto paylaşım səhifəsi.', noindex: true }

    /* Phase 43 — slayd şou: zal ekranı üçündür, indeksləşdirilmir */
    case 'slideshow':
      return { title: 'Slayd Şou | DigiToy', description: 'Toy qalereyasının slayd şou rejimi.', noindex: true, nofollow: true }

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
    case 'slideshow':    return slug ? `/invite/${slug}/slayd` : null
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
    /* Phase 43 — TV/proyektor rejimi. Token tələb etmir: zal ekranını
       açan şəxs onsuz da slug-u bilir və bu səhifə yalnız OXUYUR. */
    if (sub === 'slayd')          { setView('slideshow');    return }

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
        /* Phase 36: `active === false` → link admin tərəfindən bağlanıb.
           Slug mövcuddur, ona görə bu 404 DEYİL — ayrıca səhifə göstərilir. */
        if (result && result.active === false) {
          setView('invite-disabled')
          return
        }
        if (result && result.data) {
          setWeddingData({ ...defaultWedding, ...result.data })
          setView('invite')
        } else {
          setView('invite-not-found')
        }
      })
      .catch(function() { setView('invite-not-found') })
    return
  }

  /* Phase 47: naməlum yol → 404 ekranı (əvvəl səssizcə landing açılırdı;
     server onsuz da 404 statusu verir — seo.php). */
  if (!isKnownSpaPath(window.location.pathname)) {
    setView('not-found')
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
  /* ⚠ `/preview/live` İLKİN STATE-də həll olunur, effektdə yox:
     bu, yalnız URL-dən asılı SAF qərardır. Effektdə etsək əvvəlcə 'loading'
     render olunub sonra dəyişərdi (yanıp-sönmə) və `setState`-in effekt
     içində sinxron çağırılması kaskad render yaradardı.
     ⚠ Bu səhifə admin token TƏLƏB ETMİR — heç nə oxumur, datanı valideyn
     pəncərə postMessage ilə verir. */
  /* Phase 47: hüquqi səhifə də URL-dən asılı SAF qərardır → ilkin state-də */
  const [view,        setView]        = useState(() => {
    if (typeof window === 'undefined') return 'loading'
    if (window.location.pathname === '/preview/live') return 'live-preview'
    return matchLegalRoute(window.location.pathname) ? 'legal' : 'loading'
  })
  const [legalDoc,    setLegalDoc]    = useState(
    () => (typeof window !== 'undefined' ? matchLegalRoute(window.location.pathname) : null),
  )
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

  /* ── Brauzer tarixçəsi (2026-10-09) ── hər SPA keçidi `go()` ilə: köhnə girişə
     view + scroll yazılır, GERİ basanda popstate onları bərpa edir (utils/navHistory). */
  const viewRef = useRef(view)
  useEffect(() => { viewRef.current = view }, [view])
  const go = useCallback((path, state) => pushView(path, state, { view: viewRef.current }), [])

  /* Hər view dəyişəndə <head> meta-larını yenilə (title, description, OG, Twitter, canonical) */
  useSEO(getSEOConfig(view, { weddingData, slug: adminSlug || parseInviteSlug().slug, legalDoc }))

  /* ⚠ KRİTİK LOCALE DÜZƏLİŞİ (Phase 27): `<html lang>` statik olaraq "az" idi və
     dil dəyişəndə yenilənmirdi. CSS `text-transform: uppercase` element dilinə
     görə işlədiyi üçün Azərbaycan qaydası BÜTÜN mətnə tətbiq olunurdu:
     ingilis "Wedding" → "WEDDİNG", "Min" → "MİN", rus "DigiToy" → "DİGİTOY".
     Dil ilə birlikdə yenilənəndə hər dil öz düzgün böyük hərf qaydasını alır. */
  useEffect(() => { document.documentElement.lang = lang || 'az' }, [lang])

  /* Analitika: GA4/PostHog-u bir dəfə işə sal (yalnız production + env dəyişənləri varsa) */
  useEffect(() => { initAnalytics() }, [])

  /* Phase 47: kuki banneri harada çıxsın və hansı dildə — utils/consent.js.
     page_view effektindən ƏVVƏL: dəvətnamədə razılıq yoxdursa hadisə atılsın. */
  useEffect(() => { consent.setContext({ view, lang }) }, [view, lang])

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
  /* Önbaxış kontekstini oxu və bərpanı hazırla — həm səhifədəki «geri»
     düyməsi, həm brauzerin GERİ düyməsi (popstate) bunu çağırır */
  const takePreviewReturn = useCallback(() => {
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
    }
    if (ctx?.pkg) setResumePackage(ctx.pkg)
    return ctx
  }, [])

  const goBackFromPreview = useCallback(() => {
    /* Önbaxışa saytın içindən gəlinibsə — bir addım geri: popstate view-u,
       vitrin filtrlərini və scroll mövqeyini bərpa edir. Tarixçədə artıq
       «irəli» önbaxış girişi qalmır (əvvəl yeni giriş əlavə olunurdu). */
    if (canGoBackInApp()) { window.history.back(); return }

    const ctx = takePreviewReturn()
    if (ctx?.origin === 'templates') {
      go('/templates')
      setView('templates')
      return
    }

    go('/')
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
  }, [takePreviewReturn, go])

  /* ── Önbaxış panelindəki «Bu dizaynla sifariş et» (UI redesign 2026-10) ──
     Şablon builder snapshot-una yazılır (data.templateId → autosave/draft/sifariş
     zənciri onsuz da bu sahəni daşıyır), addım 1-ə (Dizayn) qaytarılır.
       • önbaxışa builder-dən gəlinibsə (paket seçilib) → builder-ə qayıdış
       • əks halda → «Paketlərə keç» axını: paket seçilən kimi builder bu
         dizaynla açılır */
  const choosePreviewTemplate = useCallback(() => {
    const id = previewTemplateId
    if (!id || !isTemplateSelectable(id)) return
    const snap = readBuilderSnapshot()
    saveBuilderSnapshot({ data: { ...(snap?.data || {}), templateId: id }, step: 1 })
    trackTemplateSelected(id, { source: 'preview_bar' })
    let ctx = null
    try { ctx = JSON.parse(sessionStorage.getItem('digitoy_preview_return') || 'null') } catch { /* private mode */ }
    if (ctx?.origin === 'builder' && ctx.pkg) { goBackFromPreview(); return }
    try { sessionStorage.removeItem('digitoy_preview_return') } catch { /* private mode */ }
    window.dispatchEvent(new CustomEvent('digitoy:packages'))
  }, [previewTemplateId, goBackFromPreview])

  /* Ana səhifəyə qayıdış (hüquqi səhifə, 404, deaktiv dəvətnamə) */
  const goHome = useCallback(() => {
    /* Ana səhifədən gəlinibsə — ora, eyni scroll mövqeyinə */
    if (canGoBackInApp('/')) { window.history.back(); return }
    go('/')
    setView('landing')
    window.scrollTo(0, 0)
  }, [go])

  /* Landing-in builder blokuna keçid (şablon vitrinindəki "Dəvətnaməni hazırla") */
  const goToBuilder = useCallback(() => {
    go('/')
    setView('landing')
    setTimeout(() => {
      const el = document.getElementById('builder-content')
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' })
    }, 260)
  }, [go])

  /* Builder-dəki "Önbaxış" düyməsi — eyni tabda şablon önbaxışına keç */
  useEffect(() => {
    const onPreview = (e) => {
      const id = e?.detail?.id
      if (!id) return
      setPackagesIntent(false)
      go(`/demo/template/${id}`)
      setPreviewTemplateId(resolveTemplateId(id, { allowDisabled: true }))
      setView('template-preview')
      window.scrollTo(0, 0)
    }
    window.addEventListener('digitoy:preview', onPreview)
    return () => window.removeEventListener('digitoy:preview', onPreview)
  }, [go])

  /* ── «Paketlərə keç» (şablonun son CTA-sı) ─────────────────────────────────
     Demo / önbaxış / vitrin — hamısından landing-in paket kartlarına aparır.
     Sərt reload YOXDUR: yalnız view dəyişir, sonra LandingPage `#paketler`-ə
     hamar scroll edir. Builder snapshot-una TOXUNMUR, ona görə istifadəçi
     paketi seçən kimi forma məlumatları olduğu kimi qayıdır. */
  useEffect(() => {
    const onPackages = () => {
      go('/')
      setPackagesIntent(true)
      setView('landing')
      window.scrollTo(0, 0)
    }
    window.addEventListener('digitoy:packages', onPackages)
    return () => window.removeEventListener('digitoy:packages', onPackages)
  }, [go])

  /* ⚠ Brauzerin öz GERİ/İRƏLİ düymələri (Phase 27.3).
     Əvvəl `popstate` dinlənilmirdi: pushState ilə açılan önbaxışdan geri
     basanda URL dəyişir, ekran isə önbaxışda qalırdı. İndi URL-ə uyğun
     view bərpa olunur.
     Phase 47: footer/sifariş qeydi linkləri (siteRoutes.navigateSpa) EYNİ
     yoldan keçir — pushState, sonra URL-ə uyğun view. Hash (#kuki) qalır. */
  useEffect(() => {
    /* 2026-10-09: girişin `view`-u (məs. «Dəvətnaməni gör» → 'invitation',
       admin baxışı → 'admin-review') və scroll mövqeyi də bərpa olunur */
    const ROOT_VIEWS = ['landing', 'invitation', 'admin-review']
    const route = () => {
      const path = window.location.pathname
      const previewId = parseTemplatePreviewId()
      if (previewId) {
        setPreviewTemplateId(resolveTemplateId(previewId, { allowDisabled: true }))
        setView('template-preview')
        return true
      }
      if (/^\/templates\/?$/.test(path)) { setView('templates'); return true }
      if (path === '/preview/live') { setView('live-preview'); return true }
      if (path === '/demo') { setView('demo'); return true }
      if (path === '/') {
        const v = window.history.state?.view
        setView(ROOT_VIEWS.includes(v) ? v : 'landing')
        return true
      }
      const legal = matchLegalRoute(path)
      if (legal) { setLegalDoc(legal); setView('legal'); return true }
      if (!isKnownSpaPath(path)) { setView('not-found'); return true }
      return false   /* /admin, /invite — öz komponentləri idarə edir */
    }
    const onPop = () => {
      /* Brauzerin geri/irəli düyməsi «Paketlərə keç» niyyətini ləğv edir —
         əks halda builder əvəzinə paket kartları açılırdı. */
      setPackagesIntent(false)
      /* Önbaxışdan geri: vitrin filtrləri / builder paketi də qayıdır */
      if (viewRef.current === 'template-preview') takePreviewReturn()
      if (!route()) return
      /* yalnız `go()`-nun yazdığı mövqe; #anker girişlərində brauzer özü idarə edir */
      const y = savedScroll()
      if (y != null) restoreScroll(y)
    }
    const onNavigate = (e) => {
      const path = String(e?.detail?.path || '')
      if (!path) return
      go(path)
      setPackagesIntent(false)
      route()
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', onPop)
    window.addEventListener('digitoy:navigate', onNavigate)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('digitoy:navigate', onNavigate)
    }
  }, [takePreviewReturn, go])

  useEffect(() => {
    /* ⚠ CANLI ÖNBAXIŞ — /preview/live: marşrutlaşdırma APARILMIR.
       Bu effekt sonda `routeWithDraft(...)` → `setView('landing')` çağırır
       və ilkin state-də qoyduğumuz 'live-preview' görünüşünü üstələyirdi
       (səhifə landing kimi açılırdı). Erkən çıxış bunun qarşısını alır.
       ⚠ Burada `setView` ÇAĞIRILMIR — yalnız çıxış, ona görə kaskad render
       xəbərdarlığı da yaranmır. */
    if (window.location.pathname === '/preview/live') return
    /* Hüquqi səhifə ilkin state-də həll olunub (yuxarıya bax) */
    if (matchLegalRoute(window.location.pathname)) return

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

  /* ── CANLI ÖNBAXIŞ — /preview/live (admin iframe-i) ──
     Şəbəkəyə sorğu getmir; dəvətnamə datası postMessage ilə gəlir. */
  if (view === 'live-preview') {
    return (
      <Suspense fallback={<RouteLoader />}>
        <LivePreviewPage />
      </Suspense>
    )
  }

  /* ── ŞABLON ÖNBAXIŞI — /demo/template/:id ──
     Yalnız daxili test üçün. Demo datası ilə işləyir, DB-yə toxunmur,
     builder/admin/production invite marşrutlarından tam təcrid olunub.
     isPreview={true} → hazırlanmaqda olan (enabled=false) şablonlar da açılır. */
  if (view === 'template-preview') {
    return (
      <div className="min-h-screen bg-cream">
        <TemplateRenderer
          template={previewTemplateId}
          isPreview={true}
          lang={lang} setLang={setLang}
          weddingData={demoInvitation}
          isDemoMode={true}
          initialGuestbook={demoGuestbook}
          onBack={goBackFromPreview}
        />
        {/* UI redesign: köhnə yazı zolağının yerinə önbaxış paneli */}
        <TemplatePreviewBar
          templateId={previewTemplateId}
          lang={lang}
          onBack={goBackFromPreview}
          onChoose={choosePreviewTemplate}
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
          onBack={goHome}
          onPreview={(tpl) => {
            go(`/demo/template/${tpl.id}`)
            setPreviewTemplateId(tpl.id)
            setView('template-preview')
            window.scrollTo(0, 0)
          }}
          onCreate={goToBuilder}
        />
      </Suspense>
    )
  }

  /* ── Phase 47: hüquqi səhifələr — /mexfilik, /sertler, /geri-qaytarma ── */
  if (view === 'legal') {
    return (
      <Suspense fallback={<RouteLoader />}>
        <LegalPage doc={legalDoc} lang={lang} setLang={setLang} onBack={goHome} />
      </Suspense>
    )
  }

  if (view === 'not-found') {
    const t = legalUi(lang).notFound
    const templatesLabel = { az: 'Şablonlara bax', en: 'Browse templates', ru: 'Смотреть шаблоны' }[lang] || 'Şablonlara bax'
    return (
      <StatusPage
        variant="not-found" code="404" lang={lang}
        title={t.title} text={t.text}
        primaryLabel={t.home} onPrimary={goHome}
        secondaryLabel={templatesLabel}
        onSecondary={() => { go('/templates'); setView('templates'); window.scrollTo(0, 0) }}
      />
    )
  }

  /* ── /demo — Phase 27: nümunə dəvətnamə artıq FLORAL GARDEN şablonudur.
     URL istifadəçi üçün `/demo` olaraq qalır (pushState edilmir). ── */
  if (view === 'demo') {
    return (
      <div className="min-h-screen bg-cream">
        {/* SEO (2026-09-28): /demo indekslənən səhifədir, şablonlarda h1 yoxdur */}
        <h1 className="sr-only">Nümunə rəqəmsal toy dəvətnaməsi — DigiToy</h1>
        <TemplateRenderer
          template={DEMO_TEMPLATE_ID}
          lang={lang} setLang={setLang}
          weddingData={demoInvitation}
          isDemoMode={true}
          initialGuestbook={demoGuestbook}
          onBack={() => goBackOr(() => { go('/'); setView('landing') })}
        />
      </div>
    )
  }

  if (view === 'photo')        return <Suspense fallback={<RouteLoader />}><PhotoShare /></Suspense>
  if (view === 'gallery-page') return <Suspense fallback={<RouteLoader />}><GalleryPage /></Suspense>
  if (view === 'slideshow')    return <Suspense fallback={<RouteLoader />}><SlideshowPage /></Suspense>
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
              if (adminSlug) go(`/invite/${adminSlug}`)
              setView('invite')
            })}
            onDemo={() => { trackEvent('demo_opened', { lang }); navigateTo(() => { go('/demo'); setView('demo') }) }}
            isAdmin={true} initialShowPreview={false} historyView="admin-review"
          />
        </div>
      </>
    )
  }

  /* ── DEAKTİV EDİLMİŞ DƏVƏTNAMƏ (Phase 36) ──
     Məzmun serverdən ümumiyyətlə gəlmir (get_invitation.php `data: null`
     qaytarır), ona görə burada cütlüyün adı/tarixi/məkanı sızmır. */
  if (view === 'invite-disabled') {
    return (
      <StatusPage
        variant="invite-disabled"
        title="Bu dəvətnamə deaktiv edilmişdir."
        text="Əlavə məlumat üçün təşkilatçı ilə əlaqə saxlayın."
        primaryLabel="Ana səhifəyə qayıt" onPrimary={goHome}
      />
    )
  }

  if (view === 'invite-not-found') {
    return (
      <StatusPage
        variant="invite-not-found" code="404"
        title="Bu dəvətnamə tapılmadı."
        text="Link köhnəlmiş və ya yanlış ola bilər. Zəhmət olmasa dəvətnamə sahibindən yeni link tələb edin."
        primaryLabel="Ana səhifəyə qayıt" onPrimary={goHome}
      />
    )
  }

  if (view === 'invite') {
    return (
      <div className="min-h-screen bg-cream">
        <InvitationPage
          lang={lang} setLang={setLang}
          weddingData={weddingData} isAdmin={isAdmin}
          onBack={() => goBackOr(() => { go('/'); setView('landing') })}
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
          onViewInvitation={() => navigateTo(() => {
            /* Tarixçəyə giriş — brauzerin GERİ düyməsi doldurulmuş builder/önbaxışa,
               eyni scroll mövqeyinə qaytarır (əvvəl saytdan çıxırdı) */
            go('/', { view: 'invitation' })
            setView('invitation')
          })}
          onDemo={() => { trackEvent('demo_opened', { lang }); navigateTo(() => { go('/demo'); setView('demo') }) }}
          isAdmin={isAdmin}
        />
      </div>
      {view === 'invitation' && (
        <div className="min-h-screen bg-cream">
          <InvitationPage
            lang={lang} setLang={setLang}
            weddingData={weddingData}
            onBack={() => goBackOr(() => {
              setView('landing')
              setTimeout(() => {
                const el = document.getElementById('builder-content')
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' })
              }, 80)
            })}
          />
        </div>
      )}
    </>
  )
}
