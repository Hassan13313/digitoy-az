import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useTimeline } from '../../hooks/useTimeline'

/* Proqram məntiqi (standart şablonlar + istifadəçi addımları) artıq
   `hooks/useTimeline.js`-dədir — bu fayl yalnız simple-luxury UI qatıdır. */

export default function EventTimeline({ lang, eventType, programSteps }) {
  const { events, sectionLabel } = useTimeline({ lang, eventType, programSteps })
  const [ref, visible] = useScrollReveal()

  return (
    <section className="py-28 px-6 bg-cream">
      <div
        ref={ref}
        className={`max-w-lg mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-16">
          <p className="text-[9px] tracking-[0.38em] uppercase text-gold mb-5 font-medium font-sans">Schedule</p>
          <h2 className="font-serif text-3xl text-ink font-light tracking-tight">
            {sectionLabel}
          </h2>
          <div className="gold-divider mt-8 max-w-[100px] mx-auto" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[52px] top-5 bottom-5 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(197,160,89,0.35), transparent)' }}
          />

          <div className="space-y-10">
            {events.map((event, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Time */}
                <div className="w-[52px] flex-shrink-0 text-right">
                  <span className="text-[10px] tracking-[0.12em] text-brown-muted/70 font-sans font-medium">
                    {event.time}
                  </span>
                </div>

                {/* Icon box */}
                <div
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-cream border border-gold/30 rounded-lg p-1.5"
                  style={{ boxShadow: '0 2px 8px rgba(197,160,89,0.08)' }}
                >
                  <span className="text-base">{event.icon}</span>
                </div>

                {/* Title */}
                <div className="pt-2">
                  <p className="font-serif text-base text-ink font-light">{event.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
