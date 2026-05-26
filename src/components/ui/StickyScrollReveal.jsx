import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ════════════════════════════════════════════
   STICKY SCROLL REVEAL (C3)
   Desktop: 2-col sticky left + scrolling right
   Mobile: collapsed into vertical list
════════════════════════════════════════════ */

function StepCard({ step, index, progress, total }) {
  const start = index / total
  const mid   = (index + 0.5) / total
  const end   = (index + 1) / total

  /* Minimum 0.75 — mobil oxunuşu qoruyur */
  const opacity = useTransform(progress, [start, mid, end], [0.72, 1, 0.72])
  const y       = useTransform(progress, [start, mid], [24, 0])

  return (
    <motion.div
      style={{ opacity, y }}
      className="flex gap-6 sm:gap-8 items-start py-10 sm:py-16 border-b border-gold/10 last:border-0"
    >
      {/* Step number bubble */}
      <div style={{
        flexShrink: 0,
        width: 44, height: 44,
        borderRadius: '50%',
        border: '1px solid rgba(197,160,89,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(197,160,89,0.06)',
        boxShadow: '0 0 16px rgba(197,160,89,0.14)',
      }}>
        <span style={{
          fontFamily: '"Cormorant Garamond",Georgia,serif',
          fontSize: 18, fontWeight: 300,
          color: '#C5A059', letterSpacing: '-0.02em',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
          fontSize: 'clamp(17px,2.2vw,24px)',
          fontWeight: 300, color: '#1A1A1A',
          letterSpacing: '-0.01em', marginBottom: 8,
        }}>
          {step.title}
        </h3>
        <p style={{
          fontFamily: 'Inter,system-ui,sans-serif',
          fontSize: 'clamp(13px,1.35vw,15px)',
          color: '#6B5D50', lineHeight: 1.75,
          fontWeight: 400, maxWidth: 360,
        }}>
          {step.desc}
        </p>

        {step.tag && (
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            marginTop: 12, padding: '4px 12px',
            background: 'rgba(197,160,89,0.09)',
            border: '1px solid rgba(197,160,89,0.25)',
            borderRadius: 20,
          }}>
            <span style={{
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#B8903A', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 600,
            }}>
              {step.tag}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const STEPS = {
  az: [
    { title: 'Paket Seçin',         desc: 'SADE, VİP və ya PREMİUM paketlərdən birini seçin. Hər paket fərqli imkanlar təklif edir.',  tag: '1 dəqiqə' },
    { title: 'Formu Doldurun',      desc: 'Ad-soyadlar, tarix, məkan, dress code, foto qalereya — hamısı addım-addım asancasına.',       tag: '5 dəqiqə' },
    { title: 'WhatsApp-a Göndərin', desc: 'Hazır link avtomatik yaranır. Biryolluğa kopyalayıb qonaqlarınıza paylaşın.',                tag: 'Anında' },
    { title: 'Linki Alın',          desc: 'Qonaqlar linki açanda zərif dəvətnaməni görür — geri sayım, naviqasiya, proqram, hamısı.',   tag: 'Qurulmadan hazır' },
  ],
  en: [
    { title: 'Choose a Package',    desc: 'Pick from BASIC, VIP or PREMIUM. Each tier unlocks more features for your special day.',    tag: '1 minute' },
    { title: 'Fill the Form',       desc: 'Names, date, venue, dress code, photo gallery — every step is quick and intuitive.',         tag: '5 minutes' },
    { title: 'Send via WhatsApp',   desc: 'Your unique link is ready instantly. Copy and share it with all your guests.',               tag: 'Instant' },
    { title: 'Get Your Link',       desc: 'Guests tap the link and see your invitation — countdown, navigation, program and more.',     tag: 'Zero setup' },
  ],
  ru: [
    { title: 'Выберите пакет',      desc: 'БАЗОВЫЙ, VIP или PREMIUM — каждый предлагает разные возможности для вашего торжества.',      tag: '1 минута' },
    { title: 'Заполните форму',     desc: 'Имена, дата, место, дресс-код, галерея — всё пошагово и легко.',                            tag: '5 минут' },
    { title: 'Отправьте в WhatsApp', desc: 'Ссылка генерируется мгновенно. Скопируйте и поделитесь с гостями.',                        tag: 'Мгновенно' },
    { title: 'Получите ссылку',     desc: 'Гости открывают ссылку и видят приглашение с обратным отсчётом, навигацией и программой.',  tag: 'Без настройки' },
  ],
}

const UI = {
  az: { badge: 'Addım-addım', title: 'Necə İşləyir?', sub: '4 sadə addımda zərif dəvətnaməniz hazırdır' },
  en: { badge: 'Step by step', title: 'How It Works', sub: 'Your elegant invitation in 4 simple steps' },
  ru: { badge: 'Шаг за шагом', title: 'Как это работает', sub: 'Ваше элегантное приглашение за 4 шага' },
}

export default function StickyScrollReveal({ lang = 'az' }) {
  const ui    = UI[lang]    || UI.az
  const steps = STEPS[lang] || STEPS.az
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      style={{
        position: 'relative',
        background: 'linear-gradient(170deg, #FDFBF7 0%, #F7F2E9 50%, #FDFBF7 100%)',
        padding: '0 16px',
      }}
    >
      {/* ── Desktop: 2-column grid ── */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
      }}>

        {/* Mobile header (visible only <768px) */}
        <div style={{ padding: '56px 8px 0' }} className="block md:hidden">
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, rgba(197,160,89,0.5))', marginBottom: 18 }} />
          <p style={{
            fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase',
            color: '#C5A059', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 500, marginBottom: 14,
          }}>
            {ui.badge}
          </p>
          <h2 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
            fontSize: 'clamp(28px,8vw,42px)',
            fontWeight: 300, color: '#1A1A1A',
            letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: 12,
          }}>
            {ui.title}
          </h2>
          <p style={{
            fontSize: 14, color: '#6B5D50', lineHeight: 1.7,
            fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 400, marginBottom: 32,
          }}>
            {ui.sub}
          </p>
        </div>

        {/* Desktop sticky grid */}
        <div
          className="hidden md:grid"
          style={{ gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}
        >
          {/* ── Left sticky panel ── */}
          <div style={{ position: 'sticky', top: '18vh', paddingTop: 80, paddingBottom: 80 }}>
            <div style={{
              width: 1, height: 56,
              background: 'linear-gradient(to bottom, transparent, rgba(197,160,89,0.5))',
              marginBottom: 22,
            }} />

            <p style={{
              fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase',
              color: '#C5A059', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 500, marginBottom: 16,
            }}>
              {ui.badge}
            </p>

            <h2 style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 'clamp(32px,4.2vw,50px)',
              fontWeight: 300, color: '#1A1A1A',
              letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: 18,
            }}>
              {ui.title}
            </h2>

            <p style={{
              fontSize: 'clamp(13px,1.35vw,15px)',
              color: '#6B5D50', lineHeight: 1.7,
              fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 400,
              maxWidth: 300, marginBottom: 36,
            }}>
              {ui.sub}
            </p>

            {/* Scroll progress bar */}
            <div style={{ width: 140, height: 2, background: 'rgba(197,160,89,0.18)', borderRadius: 1 }}>
              <motion.div
                style={{
                  height: '100%', borderRadius: 1,
                  background: 'linear-gradient(to right, #C5A059, #E8D5A3)',
                  scaleX: scrollYProgress,
                  transformOrigin: 'left',
                }}
              />
            </div>
          </div>

          {/* ── Right scrolling steps ── */}
          <div style={{ paddingTop: 80, paddingBottom: 80 }}>
            {steps.map((step, i) => (
              <StepCard
                key={i} step={step} index={i}
                progress={scrollYProgress} total={steps.length}
              />
            ))}
          </div>
        </div>

        {/* Mobile steps list */}
        <div className="block md:hidden" style={{ paddingBottom: 56 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-5 items-start py-8 border-b border-gold/10 last:border-0"
            >
              <div style={{
                flexShrink: 0, width: 40, height: 40,
                borderRadius: '50%',
                border: '1px solid rgba(197,160,89,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(197,160,89,0.06)',
              }}>
                <span style={{
                  fontFamily: '"Cormorant Garamond",Georgia,serif',
                  fontSize: 16, fontWeight: 300, color: '#C5A059',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
                  fontSize: 18, fontWeight: 300, color: '#1A1A1A',
                  letterSpacing: '-0.01em', marginBottom: 7,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: 'Inter,system-ui,sans-serif',
                  fontSize: 13, color: '#6B5D50', lineHeight: 1.75, fontWeight: 400,
                }}>
                  {step.desc}
                </p>
                {step.tag && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    marginTop: 10, padding: '3px 10px',
                    background: 'rgba(197,160,89,0.09)',
                    border: '1px solid rgba(197,160,89,0.25)',
                    borderRadius: 20,
                  }}>
                    <span style={{
                      fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: '#B8903A', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 600,
                    }}>
                      {step.tag}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
