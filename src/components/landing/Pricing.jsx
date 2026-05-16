import { Check, Crown } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { PRICING } from '../../data/constants'
import t from '../../data/translations'

export default function Pricing({ lang, onSelect }) {
  const tr = t[lang]
  const [ref, visible] = useScrollReveal()

  return (
    <section className="py-32 px-6 bg-cream">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-20">
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-5 font-medium">Pricing</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-light tracking-tight">{tr.pricing_title}</h2>
          <p className="text-brown-muted text-sm mt-4 tracking-wide font-light">{tr.pricing_subtitle}</p>
          <div className="gold-divider mt-8 max-w-[160px] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-beige-dark/50">
          {PRICING.map((pkg) => {
            const isPopular = pkg.popular
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col px-10 py-12 transition-all duration-300 ${
                  isPopular
                    ? 'bg-espresso text-white'
                    : 'bg-cream hover:bg-beige/50'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gold px-5 py-1">
                    <Crown size={9} className="text-white" strokeWidth={1.5} />
                    <span className="text-white text-[9px] tracking-[0.25em] uppercase font-medium">
                      {tr.pkg_popular}
                    </span>
                  </div>
                )}

                <p className={`text-[10px] tracking-[0.28em] uppercase mb-5 font-medium ${isPopular ? 'text-gold' : 'text-brown-muted'}`}>
                  {tr[`pkg_${pkg.id}`]}
                </p>

                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className={`font-serif text-5xl font-light tracking-tight ${isPopular ? 'text-white' : 'text-ink'}`}>
                    {pkg.price}
                  </span>
                  <span className={`text-sm font-light ${isPopular ? 'text-gold-light/70' : 'text-brown-muted'}`}>
                    {tr.pkg_azn}
                  </span>
                </div>

                <div className={`h-px my-8 ${isPopular ? 'bg-white/10' : 'gold-divider'}`} />

                <ul className="flex-1 space-y-4 mb-10">
                  {pkg.features[lang].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[13px]">
                      <Check size={13} className={`mt-0.5 flex-shrink-0 ${isPopular ? 'text-gold' : 'text-gold'}`} strokeWidth={1.5} />
                      <span className={`leading-relaxed font-light ${isPopular ? 'text-white/75' : 'text-brown-muted'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelect?.(pkg.id)}
                  className={`w-full py-3.5 text-[10px] tracking-[0.22em] uppercase font-medium transition-all duration-300 ${
                    isPopular
                      ? 'bg-gold text-white hover:bg-gold-dark'
                      : 'border border-gold/60 text-gold hover:bg-gold hover:text-white hover:border-gold'
                  }`}
                >
                  {tr.pkg_select}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
