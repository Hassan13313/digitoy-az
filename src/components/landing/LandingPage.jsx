import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BuilderForm from './BuilderForm'
import Preview from './Preview'
import Header from './v2/Header'
import Hero from './v2/Hero'
import HowItWorks from './v2/HowItWorks'
import Testimonials from './v2/Testimonials'
import Pricing, { PricingBackdrop } from './v2/Pricing'
import FAQ from './v2/FAQ'
import Footer from './v2/Footer'
import { Container, SectionHeading } from './v2/ui'
import t from '../../data/translations'
import { getReviews } from '../../data/testimonials'
import { getFaqItems } from '../../data/faq'
import { buildPricingPackages, UI as PKG_UI, VAGZALI_NOTE } from '../../data/packageCopy'
import { SOCIAL_LINKS, CONTACT_EMAIL } from '../../data/constants'
import { LEGAL_DOCS } from '../../data/legal/docs'
import { legalUi } from '../../data/legal/ui'
import { spaClick } from '../../utils/siteRoutes'
import { consent } from '../../utils/consent'
import { trackEvent } from '../../utils/analytics'
import { readBuilderSnapshot, clearBuilderSnapshot } from '../../utils/builderSession'

/* Navbar yüksəkliyi 72px — scroll hesablamada çıxılır */
function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.innerWidth < 768) {
    const headings = [...el.querySelectorAll('h2, h3')]
    const heading = headings.find(h => h.offsetParent !== null) || el
    const top = heading.getBoundingClientRect().top + window.pageYOffset - 80
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  } else {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 72
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

/* Paketlər bölməsi altındakı şablon vitrini CTA-sı (Phase 27.1) */
const TEMPLATES_CTA = {
  az: 'Bütün şablonlara bax',
  en: 'Browse all templates',
  ru: 'Смотреть все шаблоны',
}

/* Naviqasiya — səhifədəki bölmə ardıcıllığı ilə.
   `templates` ayrıca səhifədir (/templates), `builder-section` paket seçiminə qaytarır. */
const navItems = (tr) => [
  { id: 'how-it-works',    label: tr.navHow },
  { id: 'features',        label: tr.navFeatures },
  { id: 'templates',       label: tr.navTemplates },
  { id: 'builder-section', label: tr.navPackages },
  { id: 'faq',             label: tr.navFaq },
]

export default function LandingPage({ lang, setLang, weddingData, setWeddingData, onViewInvitation, onDemo, isAdmin = false, initialShowPreview = false, initialPackage = null, showPackages = false }) {
  const tr = t[lang] || t.az
  const [showPreview,     setShowPreview]     = useState(initialShowPreview)
  /* Forma məlumatları: eyni tabda snapshot varsa ondan bərpa olunur
     (önbaxış → geri ssenarisi), yoxsa App-dən gələn `weddingData`. */
  const [formData, setFormData] = useState(() => {
    const snap = isAdmin ? null : readBuilderSnapshot()
    const base = snap?.data ? { ...weddingData, ...snap.data } : weddingData
    return initialPackage ? { ...base, package: initialPackage } : base
  })
  const [returnToStep,    setReturnToStep]    = useState(null)

  /*
   * selectedPackage — normalda null başlayır (paket seçimi məcburi).
   * Admin modunda weddingData.package oxunur — paketi bypass etmir.
   */
  /* `initialPackage` — şablon önbaxışından qayıdanda paket bərpa olunur,
     yəni istifadəçidən yenidən paket seçmək istənmir.
     `showPackages` — «Paketlərə keç» ilə gəliblərsə paket kartları göstərilir
     (paket müvəqqəti seçilməmiş sayılır), amma forma məlumatları
     sessionStorage snapshot-ında qalır → paketi seçən kimi hər şey yerindədir. */
  const [selectedPackage, setSelectedPackage] = useState(() => {
    if (isAdmin) return weddingData?.package || 'SADE'
    if (showPackages) return null
    /* Snapshot-dakı paket də sayılır — beləliklə HƏR qayıdış yolu
       (geri düyməsi, brauzerin geri düyməsi, önbaxış linki) builder-i açır,
       paket seçimi ekranına düşmür. */
    const snap = readBuilderSnapshot()
    return initialPackage || snap?.data?.package || null
  })

  /* Köhnə localStorage keşini təmizlə — hər sessiyada təmiz başla.
     ⚠ Önbaxışdan qayıdış halında (initialPackage) təmizləmirik, əks halda
     paket dərhal itər və istifadəçi yenidən paket seçimində qalar. */
  useEffect(() => {
    if (initialPackage || showPackages) return
    try { localStorage.removeItem('selected_package') } catch { /* private mode */ }
  }, [initialPackage, showPackages])

  /* «Paketlərə keç» — paket kartlarına hamar scroll (SPA, reload yoxdur) */
  useEffect(() => {
    if (!showPackages) return
    let tries = 0
    const tick = () => {
      tries += 1
      const first = document.getElementById('first-pricing-card')
      const el = first || document.getElementById('paketler')
      if (!el) { if (tries < 12) setTimeout(tick, 120); return }
      const top = el.getBoundingClientRect().top + window.pageYOffset + (first ? -240 : -120)
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }
    const id = setTimeout(tick, 160)
    return () => clearTimeout(id)
  }, [showPackages])

  /* Açılış səhifəsi göstərildi — bir dəfə (admin "review" rejimi xaric) */
  useEffect(() => {
    if (!isAdmin) trackEvent('landing_view', { lang })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* Preview göstərildikdə builder bölməsinə scroll et */
  useEffect(() => {
    if (showPreview) {
      setTimeout(() => scrollToSection('builder-content'), 100)
    }
  }, [showPreview])

  /* Admin dərin link: mount zamanı birbaşa builder-ə jump et */
  useEffect(() => {
    if (!isAdmin) return
    const t = setTimeout(() => {
      const el = document.getElementById('builder-content')
      if (!el) return
      const top = el.getBoundingClientRect().top + window.pageYOffset - 72
      window.scrollTo({ top, behavior: 'auto' })
    }, 300)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Hadisə işləyiciləri ── */

  const handleFormSubmit = (data) => {
    /* Paket həmişə data-da olur — mövcudsa qoru, yoxdursa selectedPackage-dən al */
    const enriched = { ...data, package: data.package || selectedPackage || 'SADE' }
    setFormData(enriched)
    setWeddingData(enriched)
    setReturnToStep(null)
    setShowPreview(true)
    trackEvent('preview_opened', { lang, package: enriched.package })
    setTimeout(() => scrollToSection('builder-content'), 100)
  }

  const handleEditFromPreview = () => {
    /* Admin review modunda addım 1-dən başla; müştəridə son addıma qayıt
       (7 = Foto Qalereya; paketdə bağlıdırsa BuilderForm son görünən addıma yuvarlaqlaşdırır) */
    setReturnToStep(isAdmin ? 1 : 7)
    setShowPreview(false)
    setTimeout(() => scrollToSection('builder-content'), 100)
  }

  const handleLogoClick = () => {
    /* Açıq "yenidən başla" — builder snapshot-u da təmizlənir */
    clearBuilderSnapshot()
    setReturnToStep(null)
    setShowPreview(false)
    setSelectedPackage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* Naviqasiyadakı «Paketlər» — paket seçiminə qayıt, ilk kart üzərindən -240px offset ilə scroll */
  const scrollToBuilder = () => {
    setReturnToStep(null)
    setShowPreview(false)
    setSelectedPackage(null)
    setTimeout(() => {
      const firstCard = document.getElementById('first-pricing-card')
      const fallback  = document.getElementById('paketler')
      const el = firstCard || fallback
      if (el) {
        const yOffset = firstCard ? -240 : -120
        const yPosition = el.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: yPosition, behavior: 'smooth' })
      }
    }, 80)
  }

  /* Bölmələrdəki «Paketlərə bax» CTA-ları — heç nəyi sıfırlamır: builder açıqdırsa
     ona, deyilsə paket kartlarına sürüşür */
  const goPackages = () => {
    const firstCard = document.getElementById('first-pricing-card')
    if (firstCard) {
      const top = firstCard.getBoundingClientRect().top + window.scrollY - 240
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      return
    }
    scrollToSection('builder-content')
  }

  const handleNavigate = (id) => {
    if (id === 'builder-section') { scrollToBuilder(); return }
    /* Şablonlar — ayrıca ictimai səhifə (Phase 27.1) */
    if (id === 'templates') { window.location.assign('/templates'); return }
    scrollToSection(id)
  }

  /* Paket seçildikdə çağırılır — yalnız bundan sonra BuilderForm açılır */
  const handlePackageSelect = (pkgId) => {
    try { localStorage.setItem('selected_package', pkgId) } catch { /* private mode */ }
    setSelectedPackage(pkgId)
    setFormData(d => ({ ...d, package: pkgId }))   // initialData.package-i sinxronlaşdır
    setReturnToStep(null)
    setShowPreview(false)
    trackEvent('builder_started', { lang, package: pkgId })
    setTimeout(() => scrollToSection('builder-content'), 80)
  }

  const nav = navItems(tr)
  const pkgUi = PKG_UI[lang] || PKG_UI.az
  const legal = legalUi(lang).links
  const legalLinks = LEGAL_DOCS.map((d) => ({
    id: d.id, href: d.path, label: legal[d.id], onClick: (e) => spaClick(e, d.path),
  }))
  const motionStep = { duration: 0.35, ease: [0.32, 0, 0.68, 1] }

  return (
    <div className="dt-site min-h-screen bg-cream">

      <Header
        lang={lang}
        onLangChange={setLang}
        whatsappUrl={SOCIAL_LINKS.whatsapp}
        email={CONTACT_EMAIL}
        nav={nav}
        onNavigate={handleNavigate}
        onLogoClick={handleLogoClick}
      />

      {/* Əsas məzmun landmark-ı: ekran oxuyucuları və axtarış botları
         naviqasiya/altbilgi ilə əsas məzmunu ayıra bilsin (Lighthouse
         `landmark-one-main` auditi bunu tələb edir). */}
      <main id="main">

      {/* ── 1. Hero (+ #features — funksiyaların canlı nümunəsi) ── */}
      <Hero lang={lang} onStart={() => scrollToSection('how-it-works')} onDemo={onDemo} />

      {/* ── 2. Necə İşləyir ── */}
      <HowItWorks lang={lang} onCta={goPackages} />

      {/* ── 3. Rəylər (#sample-section) ── */}
      <Testimonials lang={lang} reviews={getReviews(lang)} onPrimary={goPackages} onDemo={onDemo} />

      {/* Naviqasiya anchor — packages tab hədəfi */}
      <div id="pricing-section" />

      {/* ── 4. Paketlər / Builder bölməsi ── */}
      <section
        id="builder-section"
        aria-label={tr.navPackages}
        className="grain relative isolate z-10 overflow-hidden bg-beige py-24 sm:py-28 lg:py-32"
      >
        <PricingBackdrop />

        {/* Başlıq — yalnız builder/preview aktiv ikən göstərilir (paket kartlarının öz başlığı var) */}
        {(showPreview || selectedPackage) && (
          <Container className="mb-14 sm:mb-16">
            <SectionHeading
              eyebrow={showPreview ? 'Preview' : 'Builder'}
              title={tr.builder_title}
              subtitle={showPreview ? undefined : tr.builder_subtitle}
            />
          </Container>
        )}

        {/* Dəqiq scroll hədəfi — padding/başlıqdan sonra */}
        <div id="builder-content" />

        {/* Axış: Preview → paket seçimi → BuilderForm */}
        <AnimatePresence mode="wait">
          {showPreview ? (
            <motion.div key="preview" className="mx-auto max-w-6xl px-4 sm:px-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={motionStep}>
              <Preview
                lang={lang}
                data={formData}
                onEdit={handleEditFromPreview}
                onView={onViewInvitation}
                isAdmin={isAdmin}
              />
            </motion.div>
          ) : !selectedPackage ? (
            <motion.div key="packages" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={motionStep}>
              <Pricing
                lang={lang}
                embedded
                packages={buildPricingPackages(lang)}
                cardIds={{ SADE: 'first-pricing-card', VIP: 'vip-package-card' }}
                onSelectPackage={handlePackageSelect}
                copy={{
                  eyebrow: tr.pricingEyebrow,
                  title: pkgUi.title,
                  subtitle: pkgUi.subtitle,
                  partner: VAGZALI_NOTE[lang] || VAGZALI_NOTE.az,
                  templates: TEMPLATES_CTA[lang] || TEMPLATES_CTA.az,
                  select: pkgUi.btn,
                }}
              />
            </motion.div>
          ) : (
            <motion.div key="builder" className="mx-auto max-w-6xl px-4 sm:px-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.32, 0, 0.68, 1] }}>
              <BuilderForm
                lang={lang}
                initialData={formData}
                initialStep={returnToStep}
                onSubmit={handleFormSubmit}
                isAdmin={isAdmin}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── 5. FAQ ── */}
      <FAQ lang={lang} items={getFaqItems(lang)} whatsappUrl={SOCIAL_LINKS.whatsapp} />

      </main>

      {/* ── 6. Footer ── */}
      <Footer
        lang={lang}
        whatsappUrl={SOCIAL_LINKS.whatsapp}
        email={CONTACT_EMAIL}
        instagramUrl={SOCIAL_LINKS.instagram}
        tiktokUrl={SOCIAL_LINKS.tiktok}
        nav={nav}
        onNavigate={handleNavigate}
        onLogoClick={handleLogoClick}
        legalLinks={legalLinks}
        cookiesLabel={legal.cookies}
        onCookieSettings={() => consent.openSettings()}
      />
    </div>
  )
}
