import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LanguageSwitcher from '../LanguageSwitcher'
import Hero, { FeaturesSection, FAQSection, HeroFooter } from './Hero'
import BuilderForm from './BuilderForm'
import Preview from './Preview'
import PackageSelect from './PackageSelect'
import TestimonialsSection from './TestimonialsSection'
import TubelightNavbar from '../ui/TubelightNavbar'
import StickyScrollReveal from '../ui/StickyScrollReveal'
import t from '../../data/translations'
import { trackEvent } from '../../utils/analytics'

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

const NAV_TABS = {
  az: [
    { id: 'why',      label: 'Necə işləyir?' },
    { id: 'features', label: 'Funksiyalar' },
    { id: 'packages', label: 'Paketlər' },
    { id: 'faq',      label: 'Suallar' },
  ],
  en: [
    { id: 'why',      label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'packages', label: 'Packages' },
    { id: 'faq',      label: 'FAQ' },
  ],
  ru: [
    { id: 'why',      label: 'Как это работает' },
    { id: 'features', label: 'Функции' },
    { id: 'packages', label: 'Пакеты' },
    { id: 'faq',      label: 'Вопросы' },
  ],
}

export default function LandingPage({ lang, setLang, weddingData, setWeddingData, onViewInvitation, onDemo, isAdmin = false, initialShowPreview = false }) {
  const tr = t[lang]
  const [showPreview,     setShowPreview]     = useState(initialShowPreview)
  const [formData,        setFormData]        = useState(weddingData)
  const [returnToStep,    setReturnToStep]    = useState(null)
  const [activeTab,       setActiveTab]       = useState('packages')

  /*
   * selectedPackage — normalda null başlayır (PackageSelect məcburi).
   * Admin modunda weddingData.package oxunur — paketi bypass etmir.
   */
  const [selectedPackage, setSelectedPackage] = useState(
    isAdmin ? (weddingData?.package || 'SADE') : null
  )

  /* Köhnə localStorage keşini təmizlə — hər sessiyada təmiz başla */
  useEffect(() => {
    try { localStorage.removeItem('selected_package') } catch {}
  }, [])

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
    setReturnToStep(null)
    setShowPreview(false)
    setSelectedPackage(null)
    setActiveTab('packages')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* "İndi Başla" / "Özün Yarat" — İlk kart üzərindən -240px offset ilə scroll */
  const scrollToBuilder = () => {
    setReturnToStep(null)
    setShowPreview(false)
    setSelectedPackage(null)
    setActiveTab('packages')
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

  const handleTabClick = (tab) => {
    setActiveTab(tab.id)
    if (tab.id === 'packages') { scrollToBuilder(); return }
    if (tab.id === 'why')      { scrollToSection('how-it-works'); return }
    if (tab.id === 'features') { scrollToSection('features'); return }
    if (tab.id === 'faq')      { scrollToSection('faq'); return }
  }

  /* Paket seçildikdə çağırılır — yalnız bundan sonra BuilderForm açılır */
  const handlePackageSelect = (pkgId) => {
    try { localStorage.setItem('selected_package', pkgId) } catch {}
    setSelectedPackage(pkgId)
    setFormData(d => ({ ...d, package: pkgId }))   // initialData.package-i sinxronlaşdır
    setReturnToStep(null)
    setShowPreview(false)
    trackEvent('builder_started', { lang, package: pkgId })
    setTimeout(() => scrollToSection('builder-content'), 80)
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Tubelight Navbar ── */}
      <TubelightNavbar
        lang={lang}
        tabs={NAV_TABS[lang] || NAV_TABS.az}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        logo={
          <button
            onClick={handleLogoClick}
            title="Digitoy.az — Ana Səhifə"
            className="font-serif text-lg text-ink tracking-widest cursor-pointer bg-transparent border-0 p-0"
          >
            <span className="text-gold font-light">Digitoy</span>
            <span className="text-brown-muted/50 font-light">.az</span>
          </button>
        }
        rightContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Mobile: icon only */}
            <a
              href="https://wa.me/994992133696"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              className="sm:hidden"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, flexShrink: 0,
                background: 'linear-gradient(135deg, #C5A059 0%, #A07840 100%)',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(197,160,89,0.28)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            {/* Desktop: icon + text */}
            <a
              href="https://wa.me/994992133696"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex"
              style={{
                alignItems: 'center', gap: 6,
                padding: '7px 14px',
                background: 'linear-gradient(135deg, #C5A059 0%, #A07840 100%)',
                color: 'white', fontSize: 10, letterSpacing: '0.18em',
                textTransform: 'uppercase', fontWeight: 600,
                textDecoration: 'none', borderRadius: 8,
                fontFamily: 'Inter, system-ui, sans-serif',
                whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: '0 2px 8px rgba(197,160,89,0.28)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
        }
      />

      {/* ── 1. Hero ── */}
      <Hero lang={lang} onStart={() => scrollToSection('how-it-works')} onDemo={onDemo} />

      {/* ── 2. Necə İşləyir ── */}
      <div id="how-it-works">
        <StickyScrollReveal lang={lang} />
      </div>

      {/* ── 3. Funksiyalar ── */}
      <FeaturesSection lang={lang} />

      {/* ── 4. Nümunə ── */}
      <div id="sample-section">
        <TestimonialsSection lang={lang} onDemo={onDemo} />
      </div>

      {/* Naviqasiya anchor — packages tab hədəfi */}
      <div id="pricing-section" />

      {/* ── 5. Paketlər / Builder bölməsi ── */}
      <section id="builder-section" className="py-12 md:py-24 px-4 sm:px-6 bg-beige/80 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Başlıq — yalnız builder/preview aktiv ikən göstərilir (PackageSelect özünün başlığı var) */}
          {(showPreview || selectedPackage) && (
            <div className="text-center mb-16 sm:mb-20">
              <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-5 font-medium">
                {showPreview ? 'Preview' : 'Builder'}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-light tracking-tight">
                {tr.builder_title}
              </h2>
              {!showPreview && (
                <p className="text-brown-muted text-sm mt-4 tracking-wide font-light">{tr.builder_subtitle}</p>
              )}
              <div className="gold-divider mt-8 max-w-[160px] mx-auto" />
            </div>
          )}

          {/* Dəqiq scroll hədəfi — padding/başlıqdan sonra */}
          <div id="builder-content" />

          {/* Axış: Preview → PackageSelect → BuilderForm */}
          <AnimatePresence mode="wait">
            {showPreview ? (
              <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.32, 0, 0.68, 1] }}>
                <Preview
                  lang={lang}
                  data={formData}
                  onEdit={handleEditFromPreview}
                  onView={onViewInvitation}
                  isAdmin={isAdmin}
                />
              </motion.div>
            ) : !selectedPackage ? (
              <motion.div key="packages" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.32, 0, 0.68, 1] }}>
                <PackageSelect lang={lang} onSelect={handlePackageSelect} />
              </motion.div>
            ) : (
              <motion.div key="builder" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.32, 0, 0.68, 1] }}>
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
        </div>
      </section>

      {/* ── 6. FAQ ── */}
      <FAQSection lang={lang} />

      {/* ── 7. Footer ── */}
      <HeroFooter lang={lang} />
    </div>
  )
}
