import { Check, Crown } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { PRICING } from '../../data/constants'
import t from '../../data/translations'

export default function Pricing({ lang, onSelect }) {
  const tr = t[lang]
  const [ref, visible] = useScrollReveal()

  return (
    <section className="py-24 px-6 bg-cream">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-4">Pricing</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-light">{tr.pricing_title}</h2>
          <p className="text-brown-muted text-sm mt-3">{tr.pricing_subtitle}</p>
          <div className="gold-divider mt-6 max-w-xs mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-beige-dark">
          {PRICING.map((pkg) => {
            const isPopular = pkg.popular
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col p-8 transition-all duration-300 ${
                  isPopular
                    ? 'bg-ink text-white'
                    : 'bg-cream hover:bg-beige'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gold px-4 py-1">
                    <Crown size={10} className="text-white" />
                    <span className="text-white text-[10px] tracking-[0.2em] uppercase font-medium">
                      {tr.pkg_popular}
                    </span>
                  </div>
                )}

                <p className={`text-xs tracking-[0.2em] uppercase mb-3 ${isPopular ? 'text-gold' : 'text-brown-muted'}`}>
                  {tr[`pkg_${pkg.id}`]}
                </p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`font-serif text-5xl font-light ${isPopular ? 'text-white' : 'text-ink'}`}>
                    {pkg.price}
                  </span>
                  <span className={`text-sm ${isPopular ? 'text-gold-light' : 'text-brown-muted'}`}>
                    {tr.pkg_azn}
                  </span>
                </div>

                <div className={`h-px my-6 ${isPopular ? 'bg-white/20' : 'gold-divider'}`} />

                <ul className="flex-1 space-y-3 mb-8">
                  {pkg.features[lang].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check size={14} className={`mt-0.5 flex-shrink-0 ${isPopular ? 'text-gold' : 'text-gold'}`} />
                      <span className={isPopular ? 'text-white/80' : 'text-brown-muted'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelect?.(pkg.id)}
                  className={`w-full py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-200 ${
                    isPopular
                      ? 'bg-gold text-white hover:bg-gold-dark'
                      : 'border border-gold text-gold hover:bg-gold hover:text-white'
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
