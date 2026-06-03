import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Minus, Plus, Send } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { formatFullDateByLang } from '../../utils/dateFormat'
import t from '../../data/translations'
import { submitGuestResponse } from '../../utils/api'

export default function RSVPSection({ lang, weddingData }) {
  const [status,    setStatus]    = useState(null)
  const [guestName, setGuestName] = useState('')
  const [plusOne,   setPlusOne]   = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [sending,   setSending]   = useState(false)
  const [ref, visible] = useScrollReveal()

  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending || !status || !guestName.trim()) return
    setSending(true)
    setSubmitted(true)

    try {
      if (slug) {
        await submitGuestResponse({
          invitationId:     slug,
          guestName:        guestName.trim(),
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
      namePh: 'Adınız',
      yes: 'Gələcəyəm', maybe: 'Hələ dəqiq deyil', no: 'Gəlməyəcəyəm',
      plusq: 'Əlavə qonaq gətirəcəksiniz?', send: 'Göndər',
      thanks_yes: 'Görüşmək üçün səbirsizlənir',
      thanks_maybe: 'Bildirdiniz, əlavə məlumat göndərəcəyik',
      thanks_no: 'Anlayışla qarşıladıq',
      thanks_sub: 'Cavabınız qeydə alındı',
    },
    en: {
      title: 'Will you attend?',
      subtitle: deadline ? `Please reply by ${deadline}` : 'Let us know',
      namePh: 'Your name',
      yes: 'I will attend', maybe: 'Not sure yet', no: 'I cannot attend',
      plusq: 'Will you bring a guest?', send: 'Send Reply',
      thanks_yes: 'We look forward to seeing you',
      thanks_maybe: 'We noted your response and will follow up',
      thanks_no: 'We understand and appreciate you letting us know',
      thanks_sub: 'Your response has been recorded',
    },
    ru: {
      title: 'Вы придёте?',
      subtitle: deadline ? `Пожалуйста, ответьте до ${deadline}` : 'Дайте нам знать',
      namePh: 'Ваше имя',
      yes: 'Приду', maybe: 'Пока не уверен', no: 'Не смогу прийти',
      plusq: 'Возьмёте гостя с собой?', send: 'Отправить',
      thanks_yes: 'С нетерпением вас ждём',
      thanks_maybe: 'Мы приняли ваш ответ к сведению',
      thanks_no: 'Мы понимаем и благодарим за ответ',
      thanks_sub: 'Ваш ответ записан',
    },
  }
  const L = labels[lang] || labels.az

  const thanksMsg = status === 'yes' ? L.thanks_yes : status === 'maybe' ? L.thanks_maybe : L.thanks_no

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
                style={{ borderColor: status === 'yes' ? '#C5A059' : status === 'maybe' ? '#C5A059' : '#DDD5C8' }}
              >
                {status === 'yes'   && <Check size={20} className="text-gold" strokeWidth={1.5} />}
                {status === 'maybe' && <Minus size={20} style={{ color: '#C5A059' }} strokeWidth={1.5} />}
                {status === 'no'    && <X size={20} className="text-brown-muted" strokeWidth={1.5} />}
              </div>
              <h3 className="font-serif text-xl text-ink font-light mb-2">{thanksMsg}</h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-brown-muted font-sans font-medium">
                {L.thanks_sub}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Ad sahəsi */}
              <input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder={L.namePh}
                required
                className="luxury-input border-b w-full text-center"
              />

              {/* 3 status düyməsi */}
              <div className="flex flex-col gap-2.5">
                {[
                  { val: 'yes',   label: L.yes,   activeClass: 'bg-gradient-to-br from-gold to-gold-dark text-white border-transparent', inactiveClass: 'bg-gold/[0.12] border-gold/50 text-gold-dark' },
                  { val: 'maybe', label: L.maybe, activeClass: 'bg-[#C5A059]/30 border-[#C5A059] text-[#8A6A20]',                        inactiveClass: 'bg-white/40 border-gold/25 text-espresso/70' },
                  { val: 'no',    label: L.no,    activeClass: 'bg-espresso/85 text-white border-transparent',                            inactiveClass: 'bg-white/40 border-gold/25 text-espresso' },
                ].map(({ val, label, activeClass, inactiveClass }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { setStatus(val); if (val !== 'yes') setPlusOne(0) }}
                    className={`min-h-[52px] px-7 font-semibold text-[13px] tracking-[0.18em] uppercase transition-all duration-200 border ${
                      status === val ? activeClass : inactiveClass
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Əlavə qonaq — yalnız 'yes' üçün */}
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
                disabled={!status || !guestName.trim() || sending}
                className="btn-gold w-full min-h-[52px] flex items-center justify-center gap-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={12} strokeWidth={1.5} />
                {sending ? '...' : L.send}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
