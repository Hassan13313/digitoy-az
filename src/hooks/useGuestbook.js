import { useState, useEffect } from 'react'
import { getGuestResponses, submitGuestResponse } from '../utils/api'
import { trackEvent } from '../utils/analytics'
import { getInviteSlug } from './useSeating'

/* ─────────────────────────────────────────────────────────────────────────────
   useGuestbook — qonaq dəftəri məntiqi (UI-sız).

   Guestbook.jsx-dən çıxarılıb: serverdən mesajlar, optimistic göndərmə,
   analytics. Şəbəkə xətasında optimistic mesaj silinmir (mövcud davranış).
   ───────────────────────────────────────────────────────────────────────── */

export const GUESTBOOK_LABELS = {
  az: { title: 'Təbrik Kitabı',      sub: 'Xoş arzularınızı bizimlə bölüşün', namePh: 'Adınız',    msgPh: 'Ürək sözləriniz...', btn: 'Paylaş',    sending: 'Göndərilir...' },
  en: { title: 'Guestbook',          sub: 'Share your warm wishes with us',   namePh: 'Your name', msgPh: 'Your message...',    btn: 'Share',     sending: 'Sending...' },
  ru: { title: 'Книга пожеланий',    sub: 'Поделитесь тёплыми словами',       namePh: 'Ваше имя',  msgPh: 'Ваше пожелание...',  btn: 'Отправить', sending: 'Отправка...' },
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
    setSending(true)

    try {
      if (slug) {
        await submitGuestResponse({
          invitationId: slug,
          guestName:    optimistic.name,
          message:      optimistic.text,
        })
        trackEvent('guestbook_message_sent')
      }
    } catch {
      /* Şəbəkə xətasında optimistic mesaj qalır — istifadəçini narahat etmirik */
    } finally {
      setSending(false)
    }
  }

  return {
    messages, name, setName, text, setText, sending,
    handleAdd,
    canSubmit: !!name.trim() && !!text.trim() && !sending,
    labels: L,
    formatDate: formatGuestbookDate,
    readMessage,
  }
}

export default useGuestbook
