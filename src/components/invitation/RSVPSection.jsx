import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Minus, Plus, Send } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import t from '../../data/translations'

export default function RSVPSection({ lang, weddingData }) {
  const tr = t[lang]
  const [status, setStatus] = useState(null)
  const [plusOne, setPlusOne] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [ref, visible] = useScrollReveal()

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const deadline = weddingData?.date
    ? new Date(weddingData.date + 'T00:00:00').toLocaleDateString(
        lang === 'az' ? 'az-AZ' : lang === 'ru' ? 'ru-RU' : 'en-US',
        { day: 'numeric', month: 'long' }
      )
    : null

  const labels = {
    az: {
      title: 'İştirak edəcəksinizmi?',
      subtitle: deadline ? `Zəhmət olmasa ${deadline}-a qədər cavablandırın` : 'Cavabınızı bildirin',
      yes: 'Bəli, Gəlirəm',
      no: 'Gəlmirəm',
      plusq: 'Əlavə qonaq gətirəcəksiniz?',
      send: 'Göndər',
      thanks_yes: 'Görüşmək üçün səbirsizlənir',
      thanks_no: 'Anlayışla qarşıladıq',
      thanks_sub: 'Cavabınız qeydə alındı',
    },
    en: {
      title: 'Will you attend?',
      subtitle: deadline ? `Please reply by ${deadline}` : 'Let us know',
      yes: 'Yes, I\'ll be there',
      no: 'Sorry, can\'t make it',
      plusq: 'Will you bring a guest?',
      send: 'Send Reply',
      thanks_yes: 'We look forward to seeing you',
      thanks_no: 'We understand',
      thanks_sub: 'Your response has been recorded',
    },
    ru: {
      title: 'Вы придёте?',
      subtitle: deadline ? `Пожалуйста, ответьте до ${deadline}` : 'Дайте нам знать',
      yes: 'Да, приду',
      no: 'К сожалению, не смогу',
      plusq: 'Возьмёте гостя с собой?',
      send: 'Отправить',
      thanks_yes: 'С нетерпением вас ждём',
      thanks_no: 'Мы понимаем',
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
              {/* Yes / No */}
              <div className="grid grid-cols-2 gap-px bg-beige-dark/40">
                <button
                  type="button"
                  onClick={() => setStatus('yes')}
                  className={`py-5 text-[10px] tracking-[0.22em] uppercase font-medium font-sans transition-all duration-200 ${
                    status === 'yes'
                      ? 'bg-gold text-cream'
                      : 'bg-cream text-brown-muted hover:bg-beige'
                  }`}
                >
                  {L.yes}
                </button>
                <button
                  type="button"
                  onClick={() => { setStatus('no'); setPlusOne(0) }}
                  className={`py-5 text-[10px] tracking-[0.22em] uppercase font-medium font-sans transition-all duration-200 ${
                    status === 'no'
                      ? 'bg-espresso text-cream'
                      : 'bg-cream text-brown-muted hover:bg-beige'
                  }`}
                >
                  {L.no}
                </button>
              </div>

              {/* Plus one counter */}
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
      </div>
    </section>
  )
}
