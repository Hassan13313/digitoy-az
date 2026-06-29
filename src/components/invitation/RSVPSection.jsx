import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Minus, Plus, Send, Search, AlertCircle } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { formatFullDateByLang } from '../../utils/dateFormat'
import t from '../../data/translations'
import { getGuests, submitAttendance, submitGuestResponse } from '../../utils/api'
import { trackEvent } from '../../utils/analytics'

/* Azərbaycan hərfi normalizasiyası — yalnız axtarış üçün */
const AZ_MAP = { ş: 's', ə: 'e', ö: 'o', ü: 'u', ğ: 'g', ç: 'c', ı: 'i' }
function normalizeAz(str) {
  return (str || '').toLocaleLowerCase('az').replace(/[şəöüğçı]/g, ch => AZ_MAP[ch] || ch).trim()
}

export default function RSVPSection({ lang, weddingData }) {
  const [guestList,    setGuestList]    = useState(null)   // null = yüklənir
  const [query,        setQuery]        = useState('')
  const [selected,     setSelected]     = useState(null)   // { id, full_name, table_id }
  const [activeIdx,    setActiveIdx]    = useState(-1)
  const [status,       setStatus]       = useState(null)   // GOING | NOT_GOING | MAYBE
  const [plusOne,      setPlusOne]      = useState(0)
  const [submitted,    setSubmitted]    = useState(false)
  const [alreadyDone,  setAlreadyDone]  = useState(false)
  const [sending,      setSending]      = useState(false)
  const [ref, visible] = useScrollReveal()
  const inputRef = useRef(null)

  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || null
  const tr   = t[lang] || t.az

  /* ── Qonaq siyahısını yüklə ── */
  useEffect(() => {
    if (!slug) { setGuestList([]); return }
    getGuests(slug)
      .then(d => setGuestList(d.guests ?? []))
      .catch(() => setGuestList([]))
  }, [slug])

  const useGuestMode = Array.isArray(guestList) && guestList.length > 0

  /* ── Autocomplete filtri ── */
  const suggestions = useMemo(() => {
    if (!useGuestMode || selected || query.trim().length < 2) return []
    const nq = normalizeAz(query)
    return guestList
      .filter(g => normalizeAz(g.full_name).includes(nq))
      .slice(0, 8)
  }, [query, guestList, selected, useGuestMode])

  const rsvpClosed = (() => {
    if (!weddingData?.date) return false
    const dl = new Date(`${weddingData.date}T23:59:59`)
    return !isNaN(dl.getTime()) && dl.getTime() < Date.now()
  })()

  const labels = {
    az: {
      title: 'İştirak edəcəksinizmi?',
      subtitle: weddingData?.date ? `Zəhmət olmasa ${formatFullDateByLang(weddingData.date, 'az')}-a qədər cavablandırın` : 'Cavabınızı bildirin',
      namePh: 'Adınızı yazın…',
      yes: 'Gələcəyəm', maybe: 'Hələ dəqiq deyil', no: 'Gəlməyəcəyəm',
      plusq: 'Əlavə qonaq gətirəcəksiniz?', send: 'Göndər',
      thanks_yes: 'Görüşmək üçün səbirsizlənir',
      thanks_maybe: 'Bildirdiniz, əlavə məlumat göndərəcəyik',
      thanks_no: 'Anlayışla qarşıladıq',
      thanks_sub: 'Cavabınız qeydə alındı',
      already_done: 'Cavabınız artıq qeydə alınıb',
      select_guest: 'Siyahıdan adınızı seçin',
      not_in_list: 'Adınız siyahıda tapılmadı — tam adınızı yazın',
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
      not_in_list: 'Name not found — try your full name',
    },
    ru: {
      title: 'Вы придёте?',
      subtitle: weddingData?.date ? `Пожалуйста, ответьте до ${formatFullDateByLang(weddingData.date, 'ru')}` : 'Дайте нам знать',
      namePh: 'Введите имя…',
      yes: 'Приду', maybe: 'Пока не уверен', no: 'Не смогу прийти',
      plusq: 'Возьмёте гостя с собой?', send: 'Отправить',
      thanks_yes: 'С нетерпением вас ждём',
      thanks_maybe: 'Мы приняли ваш ответ к сведению',
      thanks_no: 'Мы понимаем и благодарим за ответ',
      thanks_sub: 'Ваш ответ записан',
      already_done: 'Ваш ответ уже записан',
      select_guest: 'Выберите своё имя из списка',
      not_in_list: 'Имя не найдено — напишите полное имя',
    },
  }
  const L = labels[lang] || labels.az

  const pick = (g) => { setSelected(g); setQuery(g.full_name); setActiveIdx(-1) }
  const resetGuest = () => { setSelected(null); setQuery(''); setActiveIdx(-1); inputRef.current?.focus() }

  const onKeyDown = (e) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (activeIdx >= 0) pick(suggestions[activeIdx]); else if (suggestions.length === 1) pick(suggestions[0]) }
    else if (e.key === 'Escape') resetGuest()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending || !status || rsvpClosed) return
    if (useGuestMode && !selected) return

    setSending(true)
    setSubmitted(true)

    try {
      if (slug) {
        if (useGuestMode && selected) {
          const result = await submitAttendance({
            guestId: selected.id,
            status: status === 'yes' ? 'GOING' : status === 'no' ? 'NOT_GOING' : 'MAYBE',
            optionalMessage: null,
            extraGuests: status === 'yes' ? plusOne : 0,
          })
          if (result.alreadySubmitted) {
            setAlreadyDone(true)
            setSubmitted(false)
            setSending(false)
            return
          }
        } else {
          /* Fallback: qonaq siyahısı yoxdursa köhnə üsul */
          await submitGuestResponse({
            invitationId: slug,
            guestName: query.trim() || '—',
            attendanceStatus: status,
            extraGuests: status === 'yes' ? plusOne : 0,
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

  const thanksMsg = status === 'yes' ? L.thanks_yes : status === 'maybe' ? L.thanks_maybe : L.thanks_no
  const showNotFound = useGuestMode && !selected && query.trim().length >= 2 && suggestions.length === 0

  return (
    <section className="py-28 px-6 bg-cream">
      <div
        ref={ref}
        className={`max-w-[540px] mx-auto px-6 text-center reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.42em] text-gold-dark uppercase">
            <span className="w-[22px] h-px bg-gold opacity-60" />
            İştirak Təsdiqi
            <span className="w-[22px] h-px bg-gold opacity-60" />
          </div>
          <h2 className="font-serif font-normal text-espresso mt-3 mb-2.5" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>{L.title}</h2>
          {L.subtitle && (
            <p className="text-brown-dark text-[15px] leading-[1.6] mb-7">{L.subtitle}</p>
          )}
          <div className="gold-divider mt-8 max-w-[100px] mx-auto" />
        </div>

        <AnimatePresence mode="wait">
          {rsvpClosed && !submitted ? (
            <motion.div key="closed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 border border-beige-dark/50 bg-beige/40"
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border" style={{ borderColor: '#DDD5C8' }}>
                <X size={20} className="text-brown-muted" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-ink font-light mb-2">{tr.rsvp_closed_title}</h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-brown-muted font-sans font-medium">{tr.rsvp_closed_desc}</p>
            </motion.div>
          ) : alreadyDone ? (
            <motion.div key="already" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 border border-beige-dark/50 bg-beige/40"
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border" style={{ borderColor: '#C5A059' }}>
                <AlertCircle size={20} style={{ color: '#C5A059' }} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-ink font-light mb-2">{L.already_done}</h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-brown-muted font-sans font-medium">{selected?.full_name}</p>
            </motion.div>
          ) : submitted ? (
            <motion.div key="thanks" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 border border-beige-dark/50 bg-beige/40"
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border"
                style={{ borderColor: status === 'no' ? '#DDD5C8' : '#C5A059' }}
              >
                {status === 'yes'   && <Check size={20} className="text-gold" strokeWidth={1.5} />}
                {status === 'maybe' && <Minus size={20} style={{ color: '#C5A059' }} strokeWidth={1.5} />}
                {status === 'no'    && <X size={20} className="text-brown-muted" strokeWidth={1.5} />}
              </div>
              <h3 className="font-serif text-xl text-ink font-light mb-2">{thanksMsg}</h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-brown-muted font-sans font-medium">{L.thanks_sub}</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* ── Qonaq axtarışı (autocomplete) ── */}
              {useGuestMode ? (
                <div className="relative text-left">
                  <div style={{ position: 'absolute', left: 14, top: 18, pointerEvents: 'none' }}>
                    <Search size={14} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,0.7)' }} />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setActiveIdx(-1); if (selected) setSelected(null) }}
                    onKeyDown={onKeyDown}
                    placeholder={L.namePh}
                    autoComplete="off"
                    className="luxury-input w-full text-left"
                    style={{ paddingLeft: 38, paddingRight: 38 }}
                  />
                  {query && (
                    <button type="button" onClick={resetGuest} style={{ position: 'absolute', right: 12, top: 18, background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={13} strokeWidth={1.5} style={{ color: 'rgba(140,123,107,0.5)' }} />
                    </button>
                  )}

                  {/* Autocomplete dropdown */}
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
                        style={{
                          listStyle: 'none', margin: '4px 0 0', padding: 4,
                          position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 30,
                          background: 'rgba(253,250,244,0.98)', border: '1px solid rgba(197,160,89,0.28)',
                          boxShadow: '0 12px 36px rgba(0,0,0,0.12)', maxHeight: 260, overflowY: 'auto',
                        }}
                      >
                        {suggestions.map((g, i) => (
                          <li
                            key={g.id}
                            onMouseEnter={() => setActiveIdx(i)}
                            onMouseDown={e => { e.preventDefault(); pick(g) }}
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              gap: 12, padding: '12px 14px', cursor: 'pointer',
                              background: i === activeIdx ? 'rgba(197,160,89,0.10)' : 'transparent',
                            }}
                          >
                            <span style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 16, fontWeight: 300, color: '#1C1610' }}>
                              {g.full_name}
                            </span>
                            <span style={{
                              fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                              color: 'rgba(140,100,30,0.9)', padding: '3px 9px',
                              border: '1px solid rgba(197,160,89,0.3)', background: 'rgba(197,160,89,0.07)',
                              whiteSpace: 'nowrap', flexShrink: 0,
                            }}>
                              {g.table_id}
                            </span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>

                  {/* Seçilmiş qonaq konfirmasiyası */}
                  {selected && (
                    <p style={{ fontSize: 10, color: 'rgba(100,140,80,0.9)', marginTop: 6, letterSpacing: '0.06em' }}>
                      ✓ {selected.table_id} · {selected.full_name}
                    </p>
                  )}
                  {showNotFound && (
                    <p style={{ fontSize: 10, color: 'rgba(180,100,60,0.85)', marginTop: 6, letterSpacing: '0.04em' }}>
                      {L.not_in_list}
                    </p>
                  )}
                </div>
              ) : (
                /* Fallback: qonaq siyahısı yoxdursa sərbəst mətn */
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={L.namePh}
                  required
                  className="luxury-input border-b w-full text-center"
                />
              )}

              {/* ── 3 status düyməsi ── */}
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
                    className={`min-h-[52px] px-7 font-semibold text-[13px] tracking-[0.18em] uppercase transition-all duration-200 border ${status === val ? activeClass : inactiveClass}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Əlavə qonaq ── */}
              <AnimatePresence>
                {status === 'yes' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="border border-beige-dark/50 bg-beige/40 p-7">
                      <p className="text-[10px] tracking-[0.22em] uppercase text-brown-muted mb-6 font-sans font-medium text-center">{L.plusq}</p>
                      <div className="flex items-center justify-center gap-8">
                        <button type="button" disabled={plusOne === 0} onClick={() => setPlusOne(p => p - 1)}
                          className="w-10 h-10 border border-beige-dark flex items-center justify-center text-brown-muted hover:border-gold hover:text-gold transition-all disabled:opacity-25">
                          <Minus size={13} strokeWidth={1.5} />
                        </button>
                        <span className="font-serif text-4xl text-ink font-light w-12 text-center tabular-nums">{plusOne}</span>
                        <button type="button" disabled={plusOne === 3} onClick={() => setPlusOne(p => p + 1)}
                          className="w-10 h-10 border border-beige-dark flex items-center justify-center text-brown-muted hover:border-gold hover:text-gold transition-all disabled:opacity-25">
                          <Plus size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={!status || (useGuestMode && !selected) || sending}
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
