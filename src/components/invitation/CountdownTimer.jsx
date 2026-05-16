import { useEffect, useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import t from '../../data/translations'

function getTimeLeft(targetDate, targetTime) {
  const target = new Date(`${targetDate}T${targetTime || '00:00'}`)
  const now = new Date()
  const diff = target - now

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    past: false,
  }
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
        style={{
          background: 'rgba(253,251,247,0.7)',
          border: '1px solid rgba(221,213,200,0.6)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        }}
      >
        <span className="font-serif text-2xl sm:text-3xl text-ink font-light tabular-nums tracking-tight">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-3 text-[9px] tracking-[0.25em] uppercase text-brown-muted/70 font-medium">{label}</span>
    </div>
  )
}

export default function CountdownTimer({ date, time, lang }) {
  const tr = t[lang]
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(date, time))
  const [ref, visible] = useScrollReveal()

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(date, time)), 1000)
    return () => clearInterval(id)
  }, [date, time])

  return (
    <section className="py-24 px-6 bg-beige">
      <div
        ref={ref}
        className={`max-w-lg mx-auto text-center reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">Countdown</p>
        <h2 className="font-serif text-2xl text-ink font-light tracking-tight mb-12">{tr.inv_countdown}</h2>

        <div className="gold-divider mb-12 max-w-[120px] mx-auto" />

        <div className="flex items-start justify-center gap-4 sm:gap-6">
          <TimeBox value={timeLeft.days} label={tr.inv_days} />
          <span className="font-serif text-2xl text-gold/30 mt-5 font-light">·</span>
          <TimeBox value={timeLeft.hours} label={tr.inv_hours} />
          <span className="font-serif text-2xl text-gold/30 mt-5 font-light">·</span>
          <TimeBox value={timeLeft.minutes} label={tr.inv_minutes} />
          <span className="font-serif text-2xl text-gold/30 mt-5 font-light">·</span>
          <TimeBox value={timeLeft.seconds} label={tr.inv_seconds} />
        </div>

        <div className="gold-divider mt-12 max-w-[120px] mx-auto" />
      </div>
    </section>
  )
}
