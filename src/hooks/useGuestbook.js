import { useState, useEffect } from 'react'
import { getGuestResponses, submitGuestResponse } from '../utils/api'
import { trackEvent } from '../utils/analytics'
import { getInviteSlug } from './useSeating'
import { useHoneypot } from '../utils/honeypot'

/* ─────────────────────────────────────────────────────────────────────────────
   useGuestbook — qonaq dəftəri məntiqi (UI-sız).

   Guestbook.jsx-dən çıxarılıb: serverdən mesajlar, optimistic göndərmə,
   analytics. Phase 45.2: server mesajı qəbul etməsə optimistic mesaj geri
   götürülür, yazı sahələrə qayıdır və `error` qonağa göstərilir — əvvəl
   mesaj ekranda qalırdı, bazada isə yox idi.
   ───────────────────────────────────────────────────────────────────────── */

export const GUESTBOOK_LABELS = {
  az: { title: 'Təbrik Kitabı',      sub: 'Xoş arzularınızı bizimlə bölüşün', namePh: 'Adınız',    msgPh: 'Ürək sözləriniz...', btn: 'Paylaş',    sending: 'Göndərilir...', error: 'Mesaj göndərilmədi. Bir az sonra yenidən cəhd edin.' },
  en: { title: 'Guestbook',          sub: 'Share your warm wishes with us',   namePh: 'Your name', msgPh: 'Your message...',    btn: 'Share',     sending: 'Sending...',    error: 'Your message was not sent. Please try again shortly.' },
  ru: { title: 'Книга пожеланий',    sub: 'Поделитесь тёплыми словами',       namePh: 'Ваше имя',  msgPh: 'Ваше пожелание...',  btn: 'Отправить', sending: 'Отправка...',   error: 'Сообщение не отправлено. Попробуйте ещё раз чуть позже.' },
}

/** "14 · 08 · 2026" formatı */
export function formatGuestbookDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')} · ${String(d.getMonth() + 1).padStart(2, '0')} · ${d.getFullYear()}`
}

/** Mesaj sahələri həm köhnə, həm yeni API formatında gələ bilər */
export function readMessage(msg) {
  return {
    name: msg.name || msg.guest_name || '',
    text: msg.text || msg.message || '',
    date: msg.created_at || msg.createdAt || null,
  }
}

export function useGuestbook({ lang = 'az', initialMessages }) {
  const L = GUESTBOOK_LABELS[lang] || GUESTBOOK_LABELS.az
  const slug = getInviteSlug()

  const [messages, setMessages] = useState(initialMessages || [])
  const [name,     setName]     = useState('')
  const [text,     setText]     = useState('')
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState(false)
  const readHoneypot            = useHoneypot()   /* Phase 39 — spam qorunması */

  /* Serverdən mövcud mesajları çək */
  useEffect(() => {
    if (!slug) return
    getGuestResponses(slug)
      .then((data) => { if (data.messages?.length) setMessages(data.messages) })
      .catch(() => {})
  }, [slug])

  const handleAdd = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    if (!name.trim() || !text.trim() || sending) return

    const optimistic = { name: name.trim(), text: text.trim() }
    setMessages((prev) => [optimistic, ...prev])
    setName('')
    setText('')
    setError(false)
    setSending(true)

    try {
      if (slug) {
        await submitGuestResponse({
          invitationId: slug,
          guestName:    optimistic.name,
          message:      optimistic.text,
          website:      readHoneypot(),
        })
        trackEvent('guestbook_message_sent')
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m !== optimistic))
      setName(optimistic.name)
      setText(optimistic.text)
      setError(true)
    } finally {
      setSending(false)
    }
  }

  return {
    messages, name, setName, text, setText, sending, error,
    handleAdd,
    canSubmit: !!name.trim() && !!text.trim() && !sending,
    labels: L,
    formatDate: formatGuestbookDate,
    readMessage,
  }
}

export default useGuestbook
