import { useState, useEffect } from 'react'
import LanguageSwitcher from '../LanguageSwitcher'
import Hero, { FeaturesSection, FAQSection, HeroFooter } from './Hero'
import BuilderForm from './BuilderForm'
import Preview from './Preview'
import Pricing from './Pricing'
import PackageSelect from './PackageSelect'
import t from '../../data/translations'

export default function LandingPage({ lang, setLang, weddingData, setWeddingData, onViewInvitation, isAdmin = false }) {
  const tr = t[lang]
  const [showPreview,     setShowPreview]     = useState(false)
  const [formData,        setFormData]        = useState(weddingData)
  const [returnToStep,    setReturnToStep]    = useState(null)

  /*
   * selectedPackage — hər zaman null başlayır.
   * İstifadəçi mütləq PackageSelect ekranından keçərək seçim etməlidir.
   * localStorage yalnız BuilderForm addım kilidləmə üçün istifadə olunur.
   */
  const [selectedPackage, setSelectedPackage] = useState(null)

  /* Köhnə localStorage keşini təmizlə — hər sessiyada təmiz başla */
  useEffect(() => {
    try { localStorage.removeItem('selected_package') } catch {}
  }, [])

  /* ── Hadisə işləyiciləri ── */

  const handleFormSubmit = (data) => {
    setFormData(data)
    setWeddingData(data)
    setReturnToStep(null)
    setShowPreview(true)
    setTimeout(() => document.getElementById('builder-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleEditFromPreview = () => {
    setReturnToStep(6)
    setShowPreview(false)
    setTimeout(() => document.getElementById('builder-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  /* "İndi Başla" / "Özün Yarat" — həmişə PackageSelect-ə yönləndirir */
  const scrollToBuilder = () => {
    setReturnToStep(null)
    setShowPreview(false)
    setSelectedPackage(null)           // paket seçimi məcburidir
    document.getElementById('builder-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  /* Paket seçildikdə çağırılır — yalnız bundan sonra BuilderForm açılır */
  const handlePackageSelect = (pkgId) => {
    try { localStorage.setItem('selected_package', pkgId) } catch {}
    setSelectedPackage(pkgId)
    setReturnToStep(null)
    setShowPreview(false)
    setTimeout(() => document.getElementById('builder-section')?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/92 backdrop-blur-md border-b border-beige-dark/35">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="font-serif text-lg text-ink tracking-widest">
            <span className="text-gold font-light">Digitoy</span>
            <span className="text-brown-muted/50 font-light">.az</span>
          </div>
          <nav className="hidden sm:flex items-center gap-8">
            <button
              onClick={onViewInvitation}
              className="text-[10px] tracking-[0.22em] uppercase text-brown-muted hover:text-gold transition-colors duration-300 font-medium"
            >
              {tr.nav_demo}
            </button>
            {/* Header düyməsi → həmişə PackageSelect-ə */}
            <button
              onClick={scrollToBuilder}
              className="text-[10px] tracking-[0.22em] uppercase px-5 py-2.5 border border-gold/35 text-gold hover:bg-gold hover:text-white transition-all duration-300 font-medium"
            >
              {tr.nav_create}
            </button>
          </nav>
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
      </header>

      {/* ── 1. Hero ── */}
      {/* onStart → scrollToBuilder → PackageSelect məcburi */}
      <Hero lang={lang} onStart={scrollToBuilder} onDemo={onViewInvitation} />

      {/* ── 2. Features ── */}
      <FeaturesSection lang={lang} />

      {/* ── 3. Builder / PackageSelect bölməsi ── */}
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

      {/* ── 4. Pricing (display bölməsi) ── */}
      <Pricing lang={lang} onSelect={(pkgId) => {
        /* Pricing "Seç" düymələri → paket seç + builder-ə keç */
        const map = { basic: 'SADE', premium: 'VIP', vip: 'PREMIUM' }
        handlePackageSelect(map[pkgId] || 'VIP')
      }} />

      {/* ── 5. FAQ ── */}
      <FAQSection lang={lang} />

      {/* ── 6. Footer ── */}
      <HeroFooter lang={lang} />
    </div>
  )
}
