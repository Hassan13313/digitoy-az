import { useState, useEffect } from 'react'
import LanguageSwitcher from '../LanguageSwitcher'
import Hero, { FeaturesSection, FAQSection, HeroFooter } from './Hero'
import BuilderForm from './BuilderForm'
import Preview from './Preview'
import PackageSelect from './PackageSelect'
import TestimonialsSection from './TestimonialsSection'
import TubelightNavbar from '../ui/TubelightNavbar'
import StickyScrollReveal from '../ui/StickyScrollReveal'
import t from '../../data/translations'

/* Navbar yüksəkliyi 72px — scroll hesablamada çıxılır */
function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.pageYOffset - 72
  window.scrollTo({ top, behavior: 'smooth' })
}

const NAV_TABS = {
  az: [
    { id: 'demo',     label: 'Demo Gör' },
    { id: 'packages', label: 'Paketlər' },
    { id: 'how',      label: 'Necə İşləyir?' },
    { id: 'contact',  label: 'Əlaqə' },
  ],
  en: [
    { id: 'demo',     label: 'See Demo' },
    { id: 'packages', label: 'Packages' },
    { id: 'how',      label: 'How It Works' },
    { id: 'contact',  label: 'Contact' },
  ],
  ru: [
    { id: 'demo',     label: 'Демо' },
    { id: 'packages', label: 'Пакеты' },
    { id: 'how',      label: 'Как Это Работает' },
    { id: 'contact',  label: 'Контакт' },
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
   * Admin modunda həmişə PREMIUM — bütün 6 addım görünür, PackageSelect atlanır.
   */
  const [selectedPackage, setSelectedPackage] = useState(
    isAdmin ? 'PREMIUM' : null
  )

  /* Köhnə localStorage keşini təmizlə — hər sessiyada təmiz başla */
  useEffect(() => {
    try { localStorage.removeItem('selected_package') } catch {}
  }, [])

  /* Preview göstərildikdə builder bölməsinə scroll et */
  useEffect(() => {
    if (showPreview) {
      setTimeout(() => scrollToSection('builder-content'), 100)
    }
  }, [showPreview])

  /* ── Hadisə işləyiciləri ── */

  const handleFormSubmit = (data) => {
    /* Paketi formData-ya əlavə et ki, admin linki və WhatsApp mesajı onu göstərsin */
    const enriched = selectedPackage ? { ...data, package: selectedPackage } : data
    setFormData(enriched)
    setWeddingData(enriched)
    setReturnToStep(null)
    setShowPreview(true)
    setTimeout(() => scrollToSection('builder-content'), 100)
  }

  const handleEditFromPreview = () => {
    /* Admin review modunda addım 1-dən başla; müştəridə son addıma qayıt */
    setReturnToStep(isAdmin ? 1 : 6)
    setShowPreview(false)
    setTimeout(() => scrollToSection('builder-content'), 100)
  }

  /* "İndi Başla" / "Özün Yarat" — həmişə PackageSelect-ə yönləndirir */
  const scrollToBuilder = () => {
    setReturnToStep(null)
    setShowPreview(false)
    setSelectedPackage(null)
    setActiveTab('packages')
    scrollToSection('pricing-section')
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab.id)
    if (tab.id === 'demo')     { onDemo(); return }
    if (tab.id === 'packages') { scrollToBuilder(); return }
    if (tab.id === 'how')      { scrollToSection('how-it-works'); return }
    if (tab.id === 'contact')  { scrollToSection('contact-section'); return }
  }

  /* Paket seçildikdə çağırılır — yalnız bundan sonra BuilderForm açılır */
  const handlePackageSelect = (pkgId) => {
    try { localStorage.setItem('selected_package', pkgId) } catch {}
    setSelectedPackage(pkgId)
    setReturnToStep(null)
    setShowPreview(false)
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
          <div className="font-serif text-lg text-ink tracking-widest">
            <span className="text-gold font-light">Digitoy</span>
            <span className="text-brown-muted/50 font-light">.az</span>
          </div>
        }
        rightContent={<LanguageSwitcher lang={lang} setLang={setLang} />}
      />

      {/* ── 1. Hero ── */}
      <Hero lang={lang} onStart={scrollToBuilder} onDemo={onDemo} />

      {/* ── 2. Features ── */}
      <FeaturesSection lang={lang} />

      {/* ── 3. How It Works (Sticky Scroll Reveal) ── */}
      <StickyScrollReveal lang={lang} />

      {/* Naviqasiya anchor — packages tab hədəfi */}
      <div id="pricing-section" />

      {/* ── 4. Builder / PackageSelect bölməsi ── */}
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
          {showPreview ? (
            <Preview
              lang={lang}
              data={formData}
              onEdit={handleEditFromPreview}
              onView={onViewInvitation}
              isAdmin={isAdmin}
            />
          ) : !selectedPackage ? (
            /* Paket seçilməyibsə: PackageSelect göstər */
            <PackageSelect lang={lang} onSelect={handlePackageSelect} />
          ) : (
            /* Paket seçildikdən sonra: BuilderForm */
            <BuilderForm
              lang={lang}
              initialData={formData}
              initialStep={returnToStep}
              onSubmit={handleFormSubmit}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </section>

      {/* ── 4. Testimonials ── */}
      <TestimonialsSection lang={lang} />

      {/* ── 5. FAQ ── */}
      <FAQSection lang={lang} />

      {/* ── 5. Footer ── */}
      <HeroFooter lang={lang} />
    </div>
  )
}
