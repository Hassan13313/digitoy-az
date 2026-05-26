import { Timer, MapPin, Shirt, Users, Camera, Music } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import t from '../../data/translations'

const icons = [Timer, MapPin, Shirt, Users, Camera, Music]
const keys = ['countdown', 'maps', 'dresscode', 'seating', 'gallery', 'music']

export default function Features({ lang }) {
  const tr = t[lang]
  const [ref, visible] = useScrollReveal()

  const features = keys.map((k, i) => ({
    icon: icons[i],
    title: tr[`f_${k}`],
    desc: tr[`f_${k}_desc`],
  }))

  return (
    <section className="py-32 px-6 bg-beige/80 backdrop-blur-sm relative z-10">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-5 font-medium">Features</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-light tracking-tight">{tr.features_title}</h2>
          <div className="gold-divider mt-8 max-w-[160px] mx-auto" />
        </div>

        {/* Feature grid — fine border lines between cells */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-beige-dark/50">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="bg-cream px-10 py-12 group hover:bg-beige/60 transition-colors duration-400"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="w-9 h-9 border border-gold/25 flex items-center justify-center mb-7 group-hover:border-gold/50 transition-colors duration-300">
                <Icon size={16} className="text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-[15px] text-ink mb-3 font-light">{title}</h3>
              <p className="text-xs text-brown-muted leading-[1.9] tracking-wide">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
