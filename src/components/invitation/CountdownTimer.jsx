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
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cream border border-beige-dark flex items-center justify-center shadow-sm">
        <span className="font-serif text-2xl sm:text-3xl text-ink font-light tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-[10px] tracking-[0.2em] uppercase text-brown-muted">{label}</span>
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
    <section className="py-20 px-6 bg-beige">
      <div
        ref={ref}
        className={`max-w-lg mx-auto text-center reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Countdown</p>
        <h2 className="font-serif text-2xl text-ink font-light mb-10">{tr.inv_countdown}</h2>

        {/* Gold top border accent */}
        <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />

        <div className="flex items-start justify-center gap-4 sm:gap-6">
          <TimeBox value={timeLeft.days} label={tr.inv_days} />
          <div className="font-serif text-2xl text-gold/40 mt-4">:</div>
          <TimeBox value={timeLeft.hours} label={tr.inv_hours} />
          <div className="font-serif text-2xl text-gold/40 mt-4">:</div>
          <TimeBox value={timeLeft.minutes} label={tr.inv_minutes} />
          <div className="font-serif text-2xl text-gold/40 mt-4">:</div>
          <TimeBox value={timeLeft.seconds} label={tr.inv_seconds} />
        </div>

        <div className="w-full h-px mt-8" style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />
      </div>
    </section>
  )
}
