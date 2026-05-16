import { ChevronDown, Sparkles } from 'lucide-react'
import t from '../../data/translations'

export default function Hero({ lang, onStart, onDemo }) {
  const tr = t[lang]
  const features = [
    tr.f_countdown, tr.f_maps, tr.f_dresscode,
    tr.f_seating, tr.f_gallery, tr.f_music,
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-cream">
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #E8D5A3 0%, transparent 70%)' }} />
      </div>

      {/* Premium badge */}
      <div className="relative flex items-center gap-2 mb-8 px-5 py-2 border border-gold/40 bg-gold/5">
        <Sparkles size={13} className="text-gold" />
        <span className="text-xs tracking-[0.2em] uppercase text-gold font-medium">Premium Digital Invitation</span>
        <Sparkles size={13} className="text-gold" />
      </div>

      {/* Main heading */}
      <h1 className="relative font-serif text-center leading-[1.1] mb-6">
        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ink font-light">
          {tr.hero_line1}
        </span>
        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gold-gradient font-semibold mt-1">
          {tr.hero_line2}
        </span>
      </h1>

      {/* Gold ornamental line */}
      <div className="relative flex items-center gap-3 mb-8 w-full max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/60" />
        <div className="w-1.5 h-1.5 bg-gold rotate-45" />
        <div className="w-2.5 h-2.5 border border-gold rotate-45" />
        <div className="w-1.5 h-1.5 bg-gold rotate-45" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/60" />
      </div>

      {/* Subtitle */}
      <p className="relative text-brown-muted text-center text-base sm:text-lg leading-relaxed max-w-md mb-10 font-light">
        {tr.hero_subtitle}
      </p>

      {/* CTA buttons */}
      <div className="relative flex flex-col sm:flex-row gap-3 mb-14">
        <button onClick={onStart} className="btn-gold text-sm tracking-widest uppercase">
          {tr.hero_cta}
        </button>
        <button onClick={onDemo} className="btn-outline-gold text-sm tracking-widest uppercase">
          {tr.hero_demo}
        </button>
      </div>

      {/* Feature badges */}
      <div className="relative flex flex-wrap justify-center gap-2 max-w-xl">
        {features.map((f) => (
          <span key={f} className="flex items-center gap-1.5 text-xs text-brown-muted px-3 py-1.5 bg-beige border border-beige-dark">
            <span className="w-1 h-1 bg-gold rounded-full" />
            {f}
          </span>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown size={20} className="text-gold/50" />
      </div>
    </section>
  )
}
