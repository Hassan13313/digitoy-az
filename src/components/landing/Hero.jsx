import { ChevronDown, Sparkles } from 'lucide-react'
import t from '../../data/translations'

export default function Hero({ lang, onStart, onDemo }) {
  const tr = t[lang]
  const features = [
    tr.f_countdown, tr.f_maps, tr.f_dresscode,
    tr.f_seating, tr.f_gallery, tr.f_music,
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-36 pb-28 overflow-hidden bg-cream">
      {/* Ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(ellipse, #E8D5A3 0%, transparent 68%)' }}
        />
      </div>

      {/* Premium badge */}
      <div className="relative flex items-center gap-2.5 mb-12 px-6 py-2.5 border border-gold/30 bg-gold/[0.04]">
        <Sparkles size={11} className="text-gold" strokeWidth={1.5} />
        <span className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium">Premium Digital Invitation</span>
        <Sparkles size={11} className="text-gold" strokeWidth={1.5} />
      </div>

      {/* Main heading */}
      <h1 className="relative font-serif text-center leading-[1.08] mb-8 max-w-3xl">
        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-ink font-light tracking-tight">
          {tr.hero_line1}
        </span>
        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gold font-light mt-2">
          {tr.hero_line2}
        </span>
      </h1>

      {/* Gold ornamental rule */}
      <div className="relative flex items-center gap-3 mb-10 w-full max-w-[200px]">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55))' }} />
        <div className="w-1 h-1 bg-gold rotate-45 opacity-70" />
        <div className="w-2 h-2 border border-gold/60 rotate-45" />
        <div className="w-1 h-1 bg-gold rotate-45 opacity-70" />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.55))' }} />
      </div>

      {/* Subtitle */}
      <p className="relative text-brown-muted text-center text-base sm:text-lg leading-[1.8] max-w-sm mb-14 font-light tracking-wide">
        {tr.hero_subtitle}
      </p>

      {/* CTA buttons */}
      <div className="relative flex flex-col sm:flex-row gap-3 mb-20">
        <button onClick={onStart} className="btn-gold">
          {tr.hero_cta}
        </button>
        <button onClick={onDemo} className="btn-outline-gold">
          {tr.hero_demo}
        </button>
      </div>

      {/* Feature badges */}
      <div className="relative flex flex-wrap justify-center gap-2 max-w-xl">
        {features.map((f) => (
          <span
            key={f}
            className="flex items-center gap-2 text-[10px] tracking-[0.12em] text-brown-muted px-4 py-2 bg-beige border border-beige-dark/60 uppercase"
          >
            <span className="w-1 h-1 bg-gold/70 rounded-full" />
            {f}
          </span>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown size={18} className="text-gold/35" strokeWidth={1.5} />
      </div>
    </section>
  )
}
