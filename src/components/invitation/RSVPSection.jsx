import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Minus, Plus, Send } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { formatFullDateByLang } from '../../utils/dateFormat'
import t from '../../data/translations'
import { getGuestResponses, submitGuestResponse } from '../../utils/api'

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
  const [sending,   setSending]   = useState(false)
  const [stats,     setStats]     = useState(null)
  const [ref, visible] = useScrollReveal()

  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || null

  /* Serverdən cari statistikanı çək */
  useEffect(() => {
    if (!slug) return
    getGuestResponses(slug)
      .then(data => setStats(data.rsvp ?? { yes: 0, no: 0, guests: 0 }))
      .catch(() => {})
  }, [slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending || !status) return
    setSending(true)

    /* Optimistic update */
    setStats(prev => {
      const base = prev ?? { yes: 0, no: 0, guests: 0 }
      return {
        yes:    base.yes    + (status === 'yes' ? 1 : 0),
        no:     base.no     + (status === 'no'  ? 1 : 0),
        guests: base.guests + (status === 'yes' ? plusOne : 0),
      }
    })
    setSubmitted(true)

    try {
      if (slug) {
        await submitGuestResponse({
          invitationId:     slug,
          guestName:        '—',
          attendanceStatus: status,
          extraGuests:      status === 'yes' ? plusOne : 0,
        })
      }
    } catch {
      /* Şəbəkə xətasında optimistic state qalır */
    } finally {
      setSending(false)
    }
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
        className={`max-w-[540px] mx-auto px-6 text-center reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.42em] text-gold-dark uppercase">
            <span className="w-[22px] h-px bg-gold opacity-60" />
            RSVP
            <span className="w-[22px] h-px bg-gold opacity-60" />
          </div>
          <h2 className="font-serif font-normal text-espresso mt-3 mb-2.5" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>{L.title}</h2>
          {L.subtitle && (
            <p className="text-brown-dark text-[15px] leading-[1.6] mb-7">{L.subtitle}</p>
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
              <div className="flex gap-3 justify-center flex-wrap mb-5">
                <button
                  type="button"
                  onClick={() => setStatus('yes')}
                  className={`min-h-[52px] px-7 rounded-full font-semibold text-[13px] tracking-[0.18em] uppercase transition-all duration-200 ${
                    status === 'yes'
                      ? 'bg-gradient-to-br from-gold to-gold-dark text-white border border-transparent'
                      : 'bg-gold/[0.12] border border-gold/50 text-gold-dark'
                  }`}
                >
                  {L.yes}
                </button>
                <button
                  type="button"
                  onClick={() => { setStatus('no'); setPlusOne(0) }}
                  className={`min-h-[52px] px-7 rounded-full font-semibold text-[13px] tracking-[0.18em] uppercase transition-all duration-200 ${
                    status === 'no'
                      ? 'bg-espresso/85 text-white border border-transparent'
                      : 'bg-white/40 border border-gold/25 text-espresso'
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
                disabled={!status || sending}
                className="btn-gold w-full min-h-[52px] flex items-center justify-center gap-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={12} strokeWidth={1.5} />
                {sending ? '...' : L.send}
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
