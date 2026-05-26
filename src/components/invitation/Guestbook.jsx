import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Heart } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const INITIAL_MESSAGES = [
  { name: 'Ayan & Elnur', text: 'Ömür boyu xoşbəxtlik arzulayırıq! Çox gözəl cütlüksünüz.' },
  { name: 'Rauf bəy', text: 'Təbriklər! Toy günü görüşərik!' },
]

const LABELS = {
  az: {
    title: 'Təbrik Kitabı',
    sub: 'Xoş arzularınızı bizimlə bölüşün',
    namePh: 'Adınız, Soyadınız',
    msgPh: 'Ürək sözləriniz...',
    btn: 'Paylaş',
  },
  en: {
    title: 'Guestbook',
    sub: 'Share your warm wishes with us',
    namePh: 'Your name',
    msgPh: 'Your message...',
    btn: 'Share',
  },
  ru: {
    title: 'Книга пожеланий',
    sub: 'Поделитесь тёплыми словами',
    namePh: 'Ваше имя',
    msgPh: 'Ваше пожелание...',
    btn: 'Отправить',
  },
}

export default function Guestbook({ lang, initialMessages }) {
  const L = LABELS[lang] || LABELS.az
  const [messages, setMessages] = useState(initialMessages || INITIAL_MESSAGES)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [ref, visible] = useScrollReveal()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setMessages([{ name: name.trim(), text: text.trim() }, ...messages])
    setName('')
    setText('')
  }

  return (
    <section className="py-28 px-6 bg-beige">
      <div
        ref={ref}
        className={`max-w-lg mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}
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
        <form onSubmit={handleAdd} className="mb-10 space-y-6">
          <div className="bg-cream border border-beige-dark/50 px-8 py-8 space-y-6">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={L.namePh}
                className="luxury-input font-sans"
              />
            </div>
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={L.msgPh}
                rows={3}
                className="w-full border-0 border-b border-beige-dark bg-transparent text-ink text-sm px-0 py-3 focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-brown-muted/40 resize-none rounded-none font-sans font-light"
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim() || !text.trim()}
              className="w-full flex items-center justify-center gap-2.5 btn-gold disabled:opacity-30"
            >
              <Send size={12} strokeWidth={1.5} />
              {L.btn}
            </button>
          </div>
        </form>

        {/* Messages */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.name + i}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cream border border-beige-dark/50 px-6 py-5 flex gap-4"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Heart size={11} className="text-gold/60" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-ink font-medium font-sans mb-1.5">
                    {msg.name}
                  </p>
                  <p className="text-[13px] text-brown-muted font-light font-serif italic leading-relaxed">
                    "{msg.text}"
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
