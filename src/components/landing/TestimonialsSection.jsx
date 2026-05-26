import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BlurFade from '../ui/BlurFade'
import AnimatedNumber from '../ui/AnimatedNumber'

const TESTIMONIALS = {
  az: [
    { name: 'Aytən & Rauf', role: 'Toy — Bakı, 2025', text: 'Dəvətnamənin açılışındakı zərf animasiyası qonaqlarımızı heyran etdi. Hamı soruşdu necə etdik!', avatar: 'A' },
    { name: 'Günel & Elçin', role: 'Nişan — Sumqayıt, 2025', text: 'Geri sayım, proqram, oturma düzümü — hamısı bir yerdə. Qonaqlar çox rahat tapdılar. Tövsiyyə edirəm.', avatar: 'G' },
    { name: 'Lətifə & Nicat', role: 'Toy — Gəncə, 2024', text: 'VİP paket tam dəyərdi. Foto qalereyası, musiqi, QR kod — professional görünüş yaratdı.', avatar: 'L' },
    { name: 'Sevinc & Tural', role: 'Toy — Bakı, 2025', text: 'WhatsApp-a link göndərmək çox asan oldu. Planlaşdırma prosesini çox rahatlaşdırdı.', avatar: 'S' },
    { name: 'Rəna & Əli', role: 'Nişan — Bakı, 2025', text: '3 dildə hazırlamaq imkanı əla idi, xarici qonaqlarımız üçün çox əlverişli oldu.', avatar: 'R' },
  ],
  en: [
    { name: 'Ayten & Rauf', role: 'Wedding — Baku, 2025', text: 'The envelope opening animation amazed our guests. Everyone asked how we did it!', avatar: 'A' },
    { name: 'Gunel & Elchin', role: 'Engagement — Sumgait, 2025', text: 'Countdown, program, seating chart — all in one place. Guests found it very easy to use.', avatar: 'G' },
    { name: 'Latifa & Nijat', role: 'Wedding — Ganja, 2024', text: 'VIP package was totally worth it. Photo gallery, music, QR code — created a professional look.', avatar: 'L' },
    { name: 'Sevinj & Tural', role: 'Wedding — Baku, 2025', text: 'Sending a link via WhatsApp was very easy. Made the whole planning process much smoother.', avatar: 'S' },
    { name: 'Rena & Ali', role: 'Engagement — Baku, 2025', text: 'The ability to prepare in 3 languages was great, very convenient for our foreign guests.', avatar: 'R' },
  ],
  ru: [
    { name: 'Айтен & Рауф', role: 'Свадьба — Баку, 2025', text: 'Анимация открытия конверта восхитила наших гостей. Все спрашивали, как мы это сделали!', avatar: 'A' },
    { name: 'Гюнель & Эльчин', role: 'Помолвка — Сумгайыт, 2025', text: 'Обратный отсчёт, программа, план рассадки — всё в одном месте. Очень удобно для гостей.', avatar: 'G' },
    { name: 'Латифа & Ниджат', role: 'Свадьба — Гянджа, 2024', text: 'Пакет VIP стоит своих денег. Галерея, музыка, QR-код — профессиональный вид.', avatar: 'L' },
    { name: 'Севиндж & Турал', role: 'Свадьба — Баку, 2025', text: 'Отправить ссылку через WhatsApp очень легко. Процесс планирования стал намного проще.', avatar: 'S' },
    { name: 'Рена & Али', role: 'Помолвка — Баку, 2025', text: 'Возможность подготовить на 3 языках была отличной, очень удобно для иностранных гостей.', avatar: 'R' },
  ],
}

const UI = {
  az: { badge: 'Müştəri Rəyləri', title: 'Onlar Artıq Seçdi', subtitle: 'Digitoy.az-dan istifadə edən cütlüklərin fikirləri' },
  en: { badge: 'Testimonials', title: 'They Already Chose', subtitle: 'Thoughts from couples who used Digitoy.az' },
  ru: { badge: 'Отзывы', title: 'Они уже выбрали', subtitle: 'Мнения пар, воспользовавшихся Digitoy.az' },
}

/* Particle that floats in background */
function Particle({ x, y, delay, size }) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        width: size, height: size, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197,160,89,0.6) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
      animate={{ y: [0, -24, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
      transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* Single testimonial card */
function TestimonialCard({ testimonial, isActive, direction }) {
  return (
    <motion.div
      key={testimonial.name}
      initial={{ opacity: 0, x: direction * 60, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -direction * 60, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(197,160,89,0.2)',
        padding: '40px 36px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 4px 16px rgba(197,160,89,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background shimmer */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
      }} />
      {/* Top gold accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.5) 70%, transparent)' }} />

      {/* Quote mark */}
      <div style={{
        fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 72, lineHeight: 1,
        color: 'rgba(197,160,89,0.15)', fontWeight: 300, marginBottom: -16, marginTop: -8,
        position: 'relative', zIndex: 1,
      }}>"</div>

      {/* Text */}
      <p style={{
        fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 18, lineHeight: 1.75,
        fontWeight: 300, color: '#3A3020', letterSpacing: '0.01em',
        position: 'relative', zIndex: 1, marginBottom: 32,
        fontStyle: 'italic',
      }}>
        {testimonial.text}
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #C5A059 0%, #B8903A 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(197,160,89,0.35)',
        }}>
          <span style={{ color: 'white', fontSize: 16, fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'italic' }}>
            {testimonial.avatar}
          </span>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A', fontFamily: 'Inter,system-ui,sans-serif', marginBottom: 2 }}>
            {testimonial.name}
          </p>
          <p style={{ fontSize: 11, color: '#8C7B6B', letterSpacing: '0.08em', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 400 }}>
            {testimonial.role}
          </p>
        </div>
        {/* 5 stars */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#C5A059">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection({ lang = 'az' }) {
  const ui    = UI[lang]    || UI.az
  const items = TESTIMONIALS[lang] || TESTIMONIALS.az
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (idx) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }
  const prev = () => go((current - 1 + items.length) % items.length)
  const next = () => go((current + 1) % items.length)

  /* Auto-advance */
  useEffect(() => {
    const t = setTimeout(() => { setDirection(1); setCurrent(c => (c + 1) % items.length) }, 5000)
    return () => clearTimeout(t)
  }, [current, items.length])

  const particles = [
    { x: 8,  y: 20, delay: 0,   size: 5 }, { x: 88, y: 15, delay: 1.2, size: 4 },
    { x: 15, y: 75, delay: 0.5, size: 6 }, { x: 92, y: 70, delay: 2,   size: 4 },
    { x: 50, y: 5,  delay: 1.5, size: 5 }, { x: 45, y: 92, delay: 0.8, size: 3 },
  ]

  return (
    <section style={{
      padding: '80px 24px', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #FAF6EE 0%, #F4F1EA 50%, #FAF6EE 100%)',
    }}>
      {/* Floating particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '70vw', height: '40vh', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(197,160,89,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <BlurFade>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#C5A059', marginBottom: 16, fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 500 }}>
              {ui.badge}
            </p>
            <h2 style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 300, color: '#1A1A1A', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              {ui.title}
            </h2>
            <p style={{ fontSize: 14, color: '#8C7B6B', fontWeight: 300, fontFamily: 'Inter,system-ui,sans-serif', letterSpacing: '0.04em', marginBottom: 20 }}>
              {ui.subtitle}
            </p>
            <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.4),transparent)', maxWidth: 160, margin: '0 auto' }} />
          </div>
        </BlurFade>

        {/* Card slider */}
        <div style={{ position: 'relative', minHeight: 280 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <TestimonialCard
              key={current}
              testimonial={items[current]}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        {/* Dots navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32, alignItems: 'center' }}>
          <button onClick={prev} style={{
            width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(197,160,89,0.4)',
            background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C5A059', transition: 'all 0.2s',
          }}>‹</button>

          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: i === current ? 20 : 7,
                height: 7, borderRadius: 4,
                background: i === current ? '#C5A059' : 'rgba(197,160,89,0.3)',
                border: 'none', cursor: 'pointer', transition: 'all 0.35s ease',
                padding: 0,
              }}
            />
          ))}

          <button onClick={next} style={{
            width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(197,160,89,0.4)',
            background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C5A059', transition: 'all 0.2s',
          }}>›</button>
        </div>
      </div>
    </section>
  )
}
