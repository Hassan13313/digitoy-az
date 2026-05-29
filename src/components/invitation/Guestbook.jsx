import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { getGuestResponses, submitGuestResponse } from '../../utils/api'

const LABELS = {
  az: {
    title: 'Təbrik Kitabı',
    sub: 'Xoş arzularınızı bizimlə bölüşün',
    namePh: 'Adınız, Soyadınız',
    msgPh: 'Ürək sözləriniz...',
    btn: 'Paylaş',
    sending: 'Göndərilir...',
  },
  en: {
    title: 'Guestbook',
    sub: 'Share your warm wishes with us',
    namePh: 'Your name',
    msgPh: 'Your message...',
    btn: 'Share',
    sending: 'Sending...',
  },
  ru: {
    title: 'Книга пожеланий',
    sub: 'Поделитесь тёплыми словами',
    namePh: 'Ваше имя',
    msgPh: 'Ваше пожелание...',
    btn: 'Отправить',
    sending: 'Отправка...',
  },
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')} · ${String(d.getMonth() + 1).padStart(2, '0')} · ${d.getFullYear()}`
}

function getSlug() {
  return (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || null
}

export default function Guestbook({ lang, initialMessages }) {
  const L = LABELS[lang] || LABELS.az
  const slug = getSlug()

  const [messages, setMessages] = useState(initialMessages || [])
  const [name,     setName]     = useState('')
  const [text,     setText]     = useState('')
  const [sending,  setSending]  = useState(false)
  const [ref, visible] = useScrollReveal()

  /* Serverdən mövcud mesajları çək */
  useEffect(() => {
    if (!slug) return
    getGuestResponses(slug)
      .then(data => { if (data.messages?.length) setMessages(data.messages) })
      .catch(() => {})
  }, [slug])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim() || sending) return

    const optimistic = { name: name.trim(), text: text.trim() }
    setMessages(prev => [optimistic, ...prev])
    setName('')
    setText('')
    setSending(true)

    try {
      if (slug) {
        await submitGuestResponse({
          invitationId: slug,
          guestName:    optimistic.name,
          message:      optimistic.text,
        })
      }
    } catch {
      /* Şəbəkə xətasında optimistic mesaj qalır — istifadəçini narahat etmirik */
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="py-28 px-6 bg-beige">
      <div
        ref={ref}
        className={`max-w-[680px] mx-auto px-6 reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-12">
          <p className="text-[9px] tracking-[0.38em] uppercase text-gold mb-5 font-medium font-sans">
            Guestbook
          </p>
          <h2 className="font-serif text-3xl text-ink font-light tracking-tight">{L.title}</h2>
          <p className="text-brown-muted text-xs mt-3 tracking-wide font-light font-sans">{L.sub}</p>
          <div className="gold-divider mt-8 max-w-[100px] mx-auto" />
        </div>

        {/* Form */}
        <form onSubmit={handleAdd} className="grid gap-3.5 mb-10">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={L.namePh}
            className="luxury-input border-b"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={L.msgPh}
            rows={4}
            className="luxury-input border-b resize-none"
          />
          <button
            type="submit"
            disabled={!name.trim() || !text.trim() || sending}
            className="btn-gold w-full min-h-[52px] flex items-center justify-center gap-2.5 disabled:opacity-30"
          >
            <Send size={12} strokeWidth={1.5} />
            {sending ? L.sending : L.btn}
          </button>
        </form>

        {/* Messages */}
        <div className="grid gap-3.5">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={(msg.name || msg.guest_name) + idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
              >
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-full flex-shrink-0 grid place-items-center text-white font-serif text-base shadow-[0_4px_12px_rgba(197,160,89,0.35)]"
                      style={{ background: 'linear-gradient(135deg, #E8D5A3, #A8843E)' }}
                    >
                      {(msg.name || msg.guest_name)?.[0]?.toUpperCase() || '·'}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-espresso">
                        {msg.name || msg.guest_name}
                      </div>
                      {msg.created_at || msg.createdAt ? (
                        <div className="font-mono text-[10px] tracking-[0.18em] text-brown-muted">
                          {formatDate(msg.created_at || msg.createdAt)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <p className="m-0 font-serif italic text-[17px] leading-[1.5] text-espresso">
                    "{msg.text || msg.message}"
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
