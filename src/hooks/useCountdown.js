import { useEffect, useState } from 'react'
import t from '../data/translations'

/* ─────────────────────────────────────────────────────────────────────────────
   useCountdown — geri sayım məntiqi (UI-sız).

   CountdownTimer.jsx-dən çıxarılıb; hesablama və başlıq məntiqi eynidir,
   yalnız markup komponentdə/şablonda qalır.
   ───────────────────────────────────────────────────────────────────────── */

export function getTimeLeft(targetDate, targetTime) {
  const target = new Date(`${targetDate}T${targetTime || '00:00'}`)
  const now = new Date()
  const diff = target - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    past: false,
  }
}

/* ── Dinamik countdown başlığı (tədbir növünə görə) ── */
export function countdownTitle(tr, eventType, eventName) {
  if (eventType === 'nishan')   return tr.inv_countdown_nishan
  if (eventType === 'birthday') return tr.inv_countdown_birthday
  if (eventType === 'corporate' || eventType === 'other') {
    const name = (eventName || '').trim()
    return name ? `${name} ${tr.inv_countdown_event}` : tr.inv_countdown
  }
  return tr.inv_countdown // toy default
}

/**
 * @returns {{ days, hours, minutes, seconds, past, title, labels }}
 *   labels — { days, hours, minutes, seconds } dilə uyğun etiketlər
 */
export function useCountdown({ date, time, lang = 'az', eventType = 'toy', eventName = '' }) {
  const tr = t[lang] || t.az
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(date, time))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(date, time)), 1000)
    return () => clearInterval(id)
  }, [date, time])

  return {
    ...timeLeft,
    title: countdownTitle(tr, eventType, eventName),
    labels: {
      days:    tr.inv_days,
      hours:   tr.inv_hours,
      minutes: tr.inv_minutes,
      seconds: tr.inv_seconds,
    },
  }
}

export default useCountdown
