import { useState, useEffect, useRef, useMemo } from 'react'
import { getGuests, submitAttendance, submitGuestResponse } from '../utils/api'
import { trackEvent } from '../utils/analytics'
import { formatFullDateByLang, formatDayMonthYear } from '../utils/dateFormat'
import { normalizeAz, getInviteSlug } from './useSeating'
import { useHoneypot } from '../utils/honeypot'
import { rsvpTarget } from '../utils/rsvpTarget'

/* ─────────────────────────────────────────────────────────────────────────────
   useRsvp — İştirak Təsdiqi məntiqi (UI-sız).

   RSVPSection.jsx-dən çıxarılıb. Siyahı varsa autocomplete göstərilir; cavabın
   kimin adına (siyahıdakı qonaq və ya yazılan ad) gedəcəyini utils/rsvpTarget.js
   həll edir — siyahı olmasa da, ad orada olmasa da göndərmək olur (Phase 48).

   Şəbəkə xətasında optimistic state saxlanılır (mövcud davranış).
   ───────────────────────────────────────────────────────────────────────── */

export function buildRsvpLabels(lang, weddingData) {
  const labels = {
    az: {
      title: 'İştirak edəcəksinizmi?',
      /* Phase 45: əvvəl «…2026, Bazar-a qədər» çıxırdı (həftə gününə şəkilçi) */
      subtitle: weddingData?.date ? `Zəhmət olmasa ${formatDayMonthYear(weddingData.date, 'az')} tarixinədək cavablandırın` : 'Cavabınızı bildirin',
      namePh: 'Adınızı yazın…',
      yes: 'Gələcəyəm', maybe: 'Hələ dəqiq deyil', no: 'Gəlməyəcəyəm',
      plusq: 'Əlavə qonaq gətirəcəksiniz?', send: 'Göndər',
      thanks_yes: 'Görüşmək üçün səbirsizlənir',
      thanks_maybe: 'Bildirdiniz, əlavə məlumat göndərəcəyik',
      thanks_no: 'Anlayışla qarşıladıq',
      thanks_sub: 'Cavabınız qeydə alındı',
      already_done: 'Cavabınız artıq qeydə alınıb',
      select_guest: 'Siyahıdan adınızı seçin',
      not_in_list: 'Siyahıda tapılmadı — adınızla göndərə bilərsiniz',
    },
    en: {
      title: 'Will you attend?',
      subtitle: weddingData?.date ? `Please reply by ${formatFullDateByLang(weddingData.date, 'en')}` : 'Let us know',
      namePh: 'Type your name…',
      yes: 'I will attend', maybe: 'Not sure yet', no: 'I cannot attend',
      plusq: 'Will you bring a guest?', send: 'Send Reply',
      thanks_yes: 'We look forward to seeing you',
      thanks_maybe: 'We noted your response and will follow up',
      thanks_no: 'We understand and appreciate you letting us know',
      thanks_sub: 'Your response has been recorded',
      already_done: 'Your response has already been recorded',
      select_guest: 'Please select your name from the list',
      not_in_list: 'Not on the list — you can still send your reply',
    },
    ru: {
      title: 'Вы придёте?',
      subtitle: weddingData?.date ? `Пожалуйста, ответьте до ${formatDayMonthYear(weddingData.date, 'ru')}` : 'Дайте нам знать',
      namePh: 'Введите имя…',
      yes: 'Приду', maybe: 'Пока не уверен', no: 'Не смогу прийти',
      plusq: 'Возьмёте гостя с собой?', send: 'Отправить',
      thanks_yes: 'С нетерпением вас ждём',
      thanks_maybe: 'Мы приняли ваш ответ к сведению',
      thanks_no: 'Мы понимаем и благодарим за ответ',
      thanks_sub: 'Ваш ответ записан',
      already_done: 'Ваш ответ уже записан',
      select_guest: 'Выберите своё имя из списка',
      not_in_list: 'Нет в списке — вы всё равно можете отправить ответ',
    },
  }
  return labels[lang] || labels.az
}

export const RSVP_MAX_EXTRA_GUESTS = 3

export function useRsvp({ lang = 'az', weddingData }) {
  const slug = getInviteSlug()

  /* slug yoxdursa (demo/preview) sorğu getmir → dərhal boş massiv */
  const [guestList,   setGuestList]   = useState(slug ? null : [])   // null = yüklənir
  const [query,       setQuery]       = useState('')
  const [selected,    setSelected]    = useState(null)   // { id, full_name, table_id }
  const [activeIdx,   setActiveIdx]   = useState(-1)
  const [status,      setStatus]      = useState(null)   // 'yes' | 'maybe' | 'no'
  const [plusOne,     setPlusOne]     = useState(0)
  const [submitted,   setSubmitted]   = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)
  const [sending,     setSending]     = useState(false)
  const readHoneypot                  = useHoneypot()   /* Phase 39 — spam qorunması */
  const inputRef = useRef(null)

  const L = buildRsvpLabels(lang, weddingData)

  /* ── Qonaq siyahısını yüklə ── */
  useEffect(() => {
    if (!slug) return
    getGuests(slug)
      .then((d) => setGuestList(d.guests ?? []))
      .catch(() => setGuestList([]))
  }, [slug])

  const useGuestMode = Array.isArray(guestList) && guestList.length > 0

  /* ── Autocomplete filtri ── */
  const suggestions = useMemo(() => {
    if (!useGuestMode || selected || query.trim().length < 2) return []
    const nq = normalizeAz(query)
    return guestList.filter((g) => normalizeAz(g.full_name).includes(nq)).slice(0, 8)
  }, [query, guestList, selected, useGuestMode])

  /* Tədbir tarixi keçibsə RSVP bağlanır.
     Mount anında bir dəfə hesablanır (sessiya ərzində dəyişmir) — beləliklə
     render təmiz qalır və mövcud davranış eynidir. */
  const [rsvpClosed] = useState(() => {
    if (!weddingData?.date) return false
    const dl = new Date(`${weddingData.date}T23:59:59`)
    return !isNaN(dl.getTime()) && dl.getTime() < Date.now()
  })

  const pick       = (g) => { setSelected(g); setQuery(g.full_name); setActiveIdx(-1) }
  const resetGuest = ()  => { setSelected(null); setQuery(''); setActiveIdx(-1); inputRef.current?.focus() }

  /* Status seçimi — "yes" olmayanda əlavə qonaq sıfırlanır */
  const chooseStatus = (val) => { setStatus(val); if (val !== 'yes') setPlusOne(0) }

  const incPlusOne = () => setPlusOne((p) => Math.min(p + 1, RSVP_MAX_EXTRA_GUESTS))
  const decPlusOne = () => setPlusOne((p) => Math.max(p - 1, 0))

  const onKeyDown = (e) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown')    { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter')   { e.preventDefault(); if (activeIdx >= 0) pick(suggestions[activeIdx]); else if (suggestions.length === 1) pick(suggestions[0]) }
    else if (e.key === 'Escape')  resetGuest()
  }

  const target = useMemo(() => rsvpTarget({ guestList, selected, query }), [guestList, selected, query])

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    if (sending || !status || rsvpClosed || !target) return
    if (target.kind === 'guest' && !selected) setSelected(target.guest)   /* «artıq qeydə alınıb» adı */

    setSending(true)
    setSubmitted(true)

    try {
      if (slug) {
        if (target.kind === 'guest') {
          const result = await submitAttendance({
            invitationId: slug,
            guestId: target.guest.id,
            status: status === 'yes' ? 'GOING' : status === 'no' ? 'NOT_GOING' : 'MAYBE',
            optionalMessage: null,
            extraGuests: status === 'yes' ? plusOne : 0,
            website: readHoneypot(),
          })
          if (result.alreadySubmitted) {
            setAlreadyDone(true)
            setSubmitted(false)
            setSending(false)
            return
          }
        } else {
          /* Siyahı yoxdur və ya ad orada yoxdur → yazılan adla sərbəst cavab */
          await submitGuestResponse({
            invitationId: slug,
            guestName: target.name,
            attendanceStatus: status,
            extraGuests: status === 'yes' ? plusOne : 0,
            website: readHoneypot(),
          })
        }
        trackEvent('participation_confirmed', { lang, status })
      }
    } catch {
      /* Şəbəkə xətasında optimistic state qalır */
    } finally {
      setSending(false)
    }
  }

  /* ── Statistika paneli üçün — qonaq siyahısından hesablanır, yeni API yoxdur.
     Siyahı boşdursa null qaytarılır ki, şablon paneli gizlətsin. ── */
  const stats = useMemo(() => {
    if (!Array.isArray(guestList) || guestList.length === 0) return null
    let going = 0, notGoing = 0, maybe = 0, extra = 0
    for (const g of guestList) {
      if (g.status === 'GOING')          going++
      else if (g.status === 'NOT_GOING') notGoing++
      else if (g.status === 'MAYBE')     maybe++
      extra += Number(g.extra_guests || 0)
    }
    return { total: guestList.length, responded: going + notGoing + maybe, going, notGoing, maybe, extra }
  }, [guestList])

  const thanksMsg   = status === 'yes' ? L.thanks_yes : status === 'maybe' ? L.thanks_maybe : L.thanks_no
  const showNotFound = useGuestMode && !selected && query.trim().length >= 2 && suggestions.length === 0
  const canSubmit    = !!status && !!target && !sending

  return {
    /* data */
    guestList, suggestions, selected, useGuestMode, stats,
    /* vəziyyət */
    query, setQuery, activeIdx, setActiveIdx, setSelected,
    status, plusOne, submitted, alreadyDone, sending,
    rsvpClosed, showNotFound, canSubmit, thanksMsg,
    /* hərəkətlər */
    chooseStatus, incPlusOne, decPlusOne, setPlusOne,
    pick, resetGuest, onKeyDown, handleSubmit, inputRef,
    /* i18n */
    labels: L,
    maxExtraGuests: RSVP_MAX_EXTRA_GUESTS,
  }
}

export default useRsvp
