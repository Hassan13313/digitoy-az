import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Minus, Plus, Send } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { formatFullDateByLang } from '../../utils/dateFormat'
import t from '../../data/translations'

/* ── LocalStorage-based stats ── */
function loadStats(slug) {
  try { return JSON.parse(localStorage.getItem(`rsvp_${slug}`) || '{"yes":0,"no":0,"guests":0}') }
  catch { return { yes: 0, no: 0, guests: 0 } }
}
function saveStats(slug, patch) {
  const s = loadStats(slug)
  const next = { yes: s.yes + (patch.yes||0), no: s.no + (patch.no||0), guests: s.guests + (patch.guests||0) }
  localStorage.setItem(`rsvp_${slug}`, JSON.stringify(next))
  return next
}

function RSVPStats({ stats, lang }) {
  const total = stats.yes + stats.no
  const pct   = total > 0 ? Math.round((stats.yes / total) * 100) : 0
  const LABELS = {
    az: { attending: 'İştirak edəcək', declined: 'Gəlməyəcək', guests: 'Əlavə Qonaq', total: 'Cəmi Cavab' },
    en: { attending: 'Attending',      declined: 'Not coming',  guests: 'Extra Guests', total: 'Total Replies' },
    ru: { attending: 'Придут',         declined: 'Не придут',   guests: 'Доп. Гости',   total: 'Всего ответов' },
  }
  const L = LABELS[lang] || LABELS.az

  if (total === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      style={{
        marginTop: 32,
        border: '1px solid rgba(197,160,89,0.18)',
        background: 'linear-gradient(160deg, #FDFAF4 0%, #F8F3E8 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid rgba(197,160,89,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(197,160,89,0.9)', fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500,
        }}>
          {L.total}
        </span>
        <span style={{
          fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(140,123,107,0.7)', fontFamily: '"Inter",system-ui,sans-serif',
        }}>
          {total}
        </span>
      </div>

      {/* Attendance bar */}
      <div style={{ padding: '18px 24px 0' }}>
        <div style={{
          height: 2, background: 'rgba(221,213,200,0.5)', position: 'relative', overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
            style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              background: 'linear-gradient(to right, rgba(197,160,89,0.6), rgba(197,160,89,1))',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 8, letterSpacing: '0.15em', color: 'rgba(197,160,89,0.8)', fontFamily: '"Inter",system-ui,sans-serif', textTransform: 'uppercase' }}>
            {pct}%
          </span>
          <span style={{ fontSize: 8, letterSpacing: '0.15em', color: 'rgba(140,123,107,0.6)', fontFamily: '"Inter",system-ui,sans-serif', textTransform: 'uppercase' }}>
            {100 - pct}%
          </span>
        </div>
      </div>

      {/* Stats rows */}
      <div style={{ padding: '8px 0 4px' }}>
        {[
          { label: L.attending, value: stats.yes,   accent: 'rgba(197,160,89,0.85)' },
          { label: L.declined,  value: stats.no,    accent: 'rgba(140,123,107,0.65)' },
          { label: L.guests,    value: stats.guests, accent: 'rgba(197,160,89,0.55)' },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 24px',
            borderBottom: i < 2 ? '1px solid rgba(221,213,200,0.35)' : 'none',
          }}>
            <span style={{
              fontSize: 10, color: 'rgba(80,68,58,0.75)',
              fontFamily: '"Inter",system-ui,sans-serif',
              letterSpacing: '0.04em',
            }}>
              {row.label}
            </span>
            <span style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 22, fontWeight: 300, color: row.accent,
              lineHeight: 1,
            }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function RSVPSection({ lang, weddingData }) {
  const tr = t[lang]
  const [status,    setStatus]    = useState(null)
  const [plusOne,   setPlusOne]   = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [stats,     setStats]     = useState(null)
  const [ref, visible] = useScrollReveal()

  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || 'preview'

  useEffect(() => {
    setStats(loadStats(slug))
  }, [slug])

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = saveStats(slug, {
      yes:    status === 'yes' ? 1 : 0,
      no:     status === 'no'  ? 1 : 0,
      guests: status === 'yes' ? plusOne : 0,
    })
    setStats(next)
    setSubmitted(true)
  }

  const deadline = weddingData?.date ? formatFullDateByLang(weddingData.date, lang) : null

  const labels = {
    az: {
      title: 'İştirak edəcəksinizmi?',
      subtitle: deadline ? `Zəhmət olmasa ${deadline}-a qədər cavablandırın` : 'Cavabınızı bildirin',
      yes: 'Bəli, Gəlirəm', no: 'Gəlmirəm',
      plusq: 'Əlavə qonaq gətirəcəksiniz?', send: 'Göndər',
      thanks_yes: 'Görüşmək üçün səbirsizlənir', thanks_no: 'Anlayışla qarşıladıq',
      thanks_sub: 'Cavabınız qeydə alındı',
    },
    en: {
      title: 'Will you attend?',
      subtitle: deadline ? `Please reply by ${deadline}` : 'Let us know',
      yes: "Yes, I'll be there", no: "Sorry, can't make it",
      plusq: 'Will you bring a guest?', send: 'Send Reply',
      thanks_yes: 'We look forward to seeing you', thanks_no: 'We understand',
      thanks_sub: 'Your response has been recorded',
    },
    ru: {
      title: 'Вы придёте?',
      subtitle: deadline ? `Пожалуйста, ответьте до ${deadline}` : 'Дайте нам знать',
      yes: 'Да, приду', no: 'К сожалению, не смогу',
      plusq: 'Возьмёте гостя с собой?', send: 'Отправить',
      thanks_yes: 'С нетерпением вас ждём', thanks_no: 'Мы понимаем',
      thanks_sub: 'Ваш ответ записан',
    },
  }
  const L = labels[lang] || labels.az

  return (
    <section className="py-28 px-6 bg-cream">
      <div
        ref={ref}
        className={`max-w-lg mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-12">
          <p className="text-[9px] tracking-[0.38em] uppercase text-gold mb-5 font-medium font-sans">RSVP</p>
          <h2 className="font-serif text-3xl text-ink font-light tracking-tight">{L.title}</h2>
          {L.subtitle && (
            <p className="text-brown-muted text-xs mt-3 tracking-wide font-light font-sans">{L.subtitle}</p>
          )}
          <div className="gold-divider mt-8 max-w-[100px] mx-auto" />
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 border border-beige-dark/50 bg-beige/40"
            >
              <div
                className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border"
                style={{ borderColor: status === 'yes' ? '#C5A059' : '#DDD5C8' }}
              >
                {status === 'yes'
                  ? <Check size={20} className="text-gold" strokeWidth={1.5} />
                  : <X size={20} className="text-brown-muted" strokeWidth={1.5} />
                }
              </div>
              <h3 className="font-serif text-xl text-ink font-light mb-2">
                {status === 'yes' ? L.thanks_yes : L.thanks_no}
              </h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-brown-muted font-sans font-medium">
                {L.thanks_sub}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="grid grid-cols-2 gap-px bg-beige-dark/40">
                <button
                  type="button"
                  onClick={() => setStatus('yes')}
                  className={`py-5 text-[10px] tracking-[0.22em] uppercase font-medium font-sans transition-all duration-200 ${
                    status === 'yes' ? 'bg-gold text-cream' : 'bg-cream text-brown-muted hover:bg-beige'
                  }`}
                >
                  {L.yes}
                </button>
                <button
                  type="button"
                  onClick={() => { setStatus('no'); setPlusOne(0) }}
                  className={`py-5 text-[10px] tracking-[0.22em] uppercase font-medium font-sans transition-all duration-200 ${
                    status === 'no' ? 'bg-espresso text-cream' : 'bg-cream text-brown-muted hover:bg-beige'
                  }`}
                >
                  {L.no}
                </button>
              </div>

              <AnimatePresence>
                {status === 'yes' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-beige-dark/50 bg-beige/40 p-7">
                      <p className="text-[10px] tracking-[0.22em] uppercase text-brown-muted mb-6 font-sans font-medium text-center">
                        {L.plusq}
                      </p>
                      <div className="flex items-center justify-center gap-8">
                        <button
                          type="button"
                          disabled={plusOne === 0}
                          onClick={() => setPlusOne(p => p - 1)}
                          className="w-10 h-10 border border-beige-dark flex items-center justify-center text-brown-muted hover:border-gold hover:text-gold transition-all disabled:opacity-25"
                        >
                          <Minus size={13} strokeWidth={1.5} />
                        </button>
                        <span className="font-serif text-4xl text-ink font-light w-12 text-center tabular-nums">
                          {plusOne}
                        </span>
                        <button
                          type="button"
                          disabled={plusOne === 3}
                          onClick={() => setPlusOne(p => p + 1)}
                          className="w-10 h-10 border border-beige-dark flex items-center justify-center text-brown-muted hover:border-gold hover:text-gold transition-all disabled:opacity-25"
                        >
                          <Plus size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={!status}
                className="w-full flex items-center justify-center gap-2.5 btn-gold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={12} strokeWidth={1.5} />
                {L.send}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── İştirak Statistikası ── */}
        {stats && <RSVPStats stats={stats} lang={lang} />}
      </div>
    </section>
  )
}
