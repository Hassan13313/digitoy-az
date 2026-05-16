import { useState } from 'react'
import LanguageSwitcher from '../LanguageSwitcher'
import Hero from './Hero'
import Features from './Features'
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-beige-dark">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif text-xl text-ink tracking-wider">
            <span className="text-gold-gradient font-semibold">Digitoy</span>
            <span className="text-brown-muted font-light">.az</span>
          </div>

          <nav className="hidden sm:flex items-center gap-6">
            <button
              onClick={onViewInvitation}
              className="text-xs tracking-[0.15em] uppercase text-brown-muted hover:text-gold transition-colors duration-200"
            >
              {tr.nav_demo}
            </button>
            <button
              onClick={scrollToBuilder}
              className="text-xs tracking-[0.15em] uppercase px-4 py-2 border border-gold/40 text-gold hover:bg-gold hover:text-white transition-all duration-200"
            >
              {tr.nav_create}
            </button>
          </nav>

          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
      </header>

      {/* Hero */}
      <Hero lang={lang} onStart={scrollToBuilder} onDemo={onViewInvitation} />

      {/* Features */}
      <Features lang={lang} />

      {/* Builder / Preview section */}
      <section id="builder-section" className="py-24 px-6 bg-beige">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase text-gold mb-4">
              {showPreview ? 'Preview' : 'Builder'}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-light">
              {tr.builder_title}
            </h2>
            {!showPreview && (
              <p className="text-brown-muted text-sm mt-3">{tr.builder_subtitle}</p>
            )}
            <div className="gold-divider mt-6 max-w-xs mx-auto" />
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

      {/* Pricing */}
      <Pricing lang={lang} onSelect={scrollToBuilder} />

      {/* Footer */}
      <footer className="py-10 px-6 bg-ink text-center">
        <div className="font-serif text-lg mb-2">
          <span className="text-gold">Digitoy</span>
          <span className="text-white/50">.az</span>
        </div>
        <p className="text-white/30 text-xs tracking-widest">{tr.footer_made}</p>
        <div className="gold-divider mt-6 max-w-xs mx-auto opacity-30" />
        <p className="text-white/20 text-[10px] mt-4 tracking-wide">
          © {new Date().getFullYear()} Digitoy.az
        </p>
      </footer>
    </div>
  )
}
