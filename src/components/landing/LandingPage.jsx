import { useState } from 'react'
import LanguageSwitcher from '../LanguageSwitcher'
import Hero, { FeaturesSection, FAQSection, HeroFooter } from './Hero'
import BuilderForm from './BuilderForm'
import Preview from './Preview'
import Pricing from './Pricing'
import t from '../../data/translations'

export default function LandingPage({ lang, setLang, weddingData, setWeddingData, onViewInvitation }) {
  const tr = t[lang]
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState(weddingData)

  const handleFormSubmit = (data) => {
    setFormData(data)
    setWeddingData(data)
    setShowPreview(true)
    setTimeout(() => {
      document.getElementById('builder-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const scrollToBuilder = () => {
    setShowPreview(false)
    document.getElementById('builder-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
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

      {/* 1. Hero + 9 interaktiv düymə */}
      <Hero lang={lang} onStart={scrollToBuilder} onDemo={onViewInvitation} />

      {/* 2. Features — Premium Rəqəmsal İmkanlar */}
      <FeaturesSection />

      {/* 3. Builder */}
      <section id="builder-section" className="py-12 md:py-24 px-6 bg-beige/80 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
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
          {showPreview ? (
            <Preview
              lang={lang}
              data={formData}
              onEdit={() => setShowPreview(false)}
              onView={onViewInvitation}
            />
          ) : (
            <BuilderForm
              lang={lang}
              initialData={formData}
              onSubmit={handleFormSubmit}
            />
          )}
        </div>
      </section>

      {/* 4. Pricing */}
      <Pricing lang={lang} onSelect={scrollToBuilder} />

      {/* 5. FAQ */}
      <FAQSection />

      {/* 6. Premium Footer */}
      <HeroFooter />
    </div>
  )
}
