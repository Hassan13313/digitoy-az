import { Timer, MapPin, Shirt, Users, Camera, Music } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <section className="py-32 px-6 relative z-10">
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

        {/* Feature grid — glass tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              style={{
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                background: 'rgba(255,255,255,0.16)',
                border: '1px solid rgba(255,255,255,0.28)',
                borderRadius: 16,
                padding: '32px 28px',
                boxShadow: '0 4px 24px rgba(44,26,14,0.07), inset 0 1px 0 rgba(255,255,255,0.40)',
                transitionDelay: `${i * 50}ms`,
              }}
              whileHover={{
                y: -6,
                background: 'rgba(255,255,255,0.22)',
                boxShadow: '0 16px 40px rgba(44,26,14,0.12), inset 0 1px 0 rgba(255,255,255,0.50)',
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
              <div style={{
                width: 36, height: 36,
                backdropFilter: 'blur(12px)',
                background: 'rgba(197,160,89,0.08)',
                border: '1px solid rgba(197,160,89,0.28)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Icon size={15} color="#C5A059" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-[15px] text-ink mb-3 font-light">{title}</h3>
              <p className="text-xs text-brown-muted leading-[1.9] tracking-wide">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
