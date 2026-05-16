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
    <section className="py-24 px-6 bg-beige">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-4">Features</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-light">{tr.features_title}</h2>
          <div className="gold-divider mt-6 max-w-xs mx-auto" />
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-beige-dark">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="bg-cream p-8 group hover:bg-beige transition-colors duration-300"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="w-10 h-10 border border-gold/30 flex items-center justify-center mb-5 group-hover:border-gold transition-colors duration-300">
                <Icon size={18} className="text-gold" />
              </div>
              <h3 className="font-serif text-base text-ink mb-2">{title}</h3>
              <p className="text-xs text-brown-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
