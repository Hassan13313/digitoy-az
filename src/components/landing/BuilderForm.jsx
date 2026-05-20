import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Heart, Diamond, Cake, Briefcase, Sparkles,
  ChevronRight, ChevronLeft, Check, Crown, Shirt, Calendar, User, MapPin, Search,
  Download, QrCode, Images, Archive,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { DRESS_CODE_PALETTES, EVENT_TYPES } from '../../data/constants'
import { formatFullDateByLang } from '../../utils/dateFormat'
import t from '../../data/translations'

const EVENT_ICONS = { toy: Heart, nishan: Diamond, birthday: Cake, corporate: Briefcase, other: Sparkles }
const TOTAL_STEPS = 6
const COUPLE_TYPES = ['toy', 'nishan']
const CORP_TYPES   = ['corporate', 'other']

/* ── Çoxdilli təqvim massivləri ── */
const calendarTranslations = {
  az: {
    weekDays: ['B.', 'B.E.', 'Ç.A.', 'Ç.', 'C.A.', 'C.', 'Ş.'],
    months: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  },
  ru: {
    weekDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  },
  en: {
    weekDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
}

/* ── Nominatim ilə məkan axtarışı komponenti ── */
const VENUE_HINTS = {
  az: '*Məkan adlarını Azərbaycan hərfləri ilə və ya Google-da axtardığınız rəsmi şəkildə yazmağınız tövsiyə olunur.',
  en: '*It is recommended to type venue names with Azerbaijani characters or exactly as they appear on Google Search.',
  ru: '*Рекомендуется вводить названия мест на азербайджанской латинице или так, как они указаны в поиске Google.',
}

function VenueSearchInput({ value, onSelect, lang, tr }) {
  const [query, setQuery]     = useState(value || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen]       = useState(false)
  const [success, setSuccess] = useState(false)
  const wrapRef   = useRef(null)
  const debounceRef = useRef(null)

  /* Xaricdən value dəyişəndə query-ni sinxronla */
  useEffect(() => { setQuery(value || '') }, [value])

  /* Kənara klikdə dropdown-u bağla */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const doSearch = async (q) => {
    if (!q.trim() || q.trim().length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6`,
        { headers: { 'Accept-Language': lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'az,en' } }
      )
      const data = await res.json()
      setResults(data)
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const q = e.target.value
    setQuery(q)
    setSuccess(false)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(q), 300)
  }

  const handleSelect = (item) => {
    const lat = parseFloat(item.lat)
    const lon = parseFloat(item.lon)
    const name = item.display_name.split(',')[0].trim()
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
    const wazeUrl = `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`
    setQuery(name)
    setOpen(false)
    setResults([])
    setSuccess(true)
    onSelect({ venueName: name, googleMapsUrl: mapsUrl, wazeUrl })
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div ref={wrapRef} className="relative">
      {/* Input */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border border-gold/40 border-t-gold/80 rounded-full animate-spin" />
        )}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), doSearch(query))}
          placeholder={tr.venue_search_placeholder}
          className="w-full pl-9 pr-10 py-3 bg-[#1a1a1a]/60 border border-gold/20 text-white/90 text-sm placeholder-white/25 rounded-none focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      {/* Hint qeydi — həmişə görünür */}
      <p className="text-xs text-amber-500/70 mt-1 block font-sans">
        {VENUE_HINTS[lang] || VENUE_HINTS.az}
      </p>

      {/* Dropdown nəticələr */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[110] backdrop-blur-md bg-[#1a1a1a]/90 border border-gold/20 shadow-2xl max-h-64 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-3 hover:bg-gold/10 border-b border-white/5 last:border-0 transition-colors"
            >
              <p className="text-white/90 text-sm leading-snug">{item.display_name.split(',')[0]}</p>
              <p className="text-white/35 text-[10px] mt-0.5 truncate">{item.display_name}</p>
            </button>
          ))}
        </div>
      )}

      {/* Nəticə yoxdur */}
      {open && results.length === 0 && !loading && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[110] backdrop-blur-md bg-[#1a1a1a]/90 border border-gold/20 px-4 py-3">
          <p className="text-white/40 text-sm">{tr.venue_search_no_results}</p>
        </div>
      )}

      {/* Uğur bildirişi */}
      {success && (
        <p className="mt-2 text-[11px] tracking-[0.12em] text-gold font-medium flex items-center gap-1.5">
          <MapPin size={11} /> {tr.venue_search_success}
        </p>
      )}
    </div>
  )
}

/* ── Proqram Addımı Redaktoru ── */
const PROGRAM_ICONS = ['🥂','💍','🎵','💃','🎂','🎤','❤️','🤵','🎆','☕']

function TimeInput({ value, onChange, onComplete, placeholder, className }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    let display = raw
    if (raw.length >= 3) display = raw.slice(0, 2) + ':' + raw.slice(2)
    onChange(display)
    if (raw.length === 4) onComplete?.()
  }
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      maxLength={5}
    />
  )
}

function IconPickerBtn({ value, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-10 h-10 flex items-center justify-center border border-amber-600/30 bg-white hover:bg-neutral-50 text-xl rounded transition-all"
        title="İkon seç"
      >
        {value || '✨'}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-[120] bg-white border border-neutral-200 rounded-lg shadow-xl w-48 p-2 grid grid-cols-4 gap-2">
          {PROGRAM_ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => { onSelect(ic); setOpen(false) }}
              className={`flex items-center justify-center text-2xl rounded p-1 hover:bg-neutral-100 transition-colors ${value === ic ? 'bg-amber-100' : ''}`}
            >
              {ic}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProgramStepEditor({ rows, onChange, tr }) {
  const activityRefs = useRef([])

  const update = (i, field, val) => {
    const updated = [...rows]
    updated[i] = { ...updated[i], [field]: val }
    onChange(updated)
  }

  const addRow = () => onChange([...rows, { time: '', icon: '', activity: '' }])

  const removeRow = (i) => onChange(rows.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-row items-center gap-3 w-full bg-neutral-50 border border-neutral-100 rounded-lg p-2.5">
            {/* 1 — Saat */}
            <TimeInput
              value={row.time}
              onChange={(v) => update(i, 'time', v)}
              onComplete={() => activityRefs.current[i]?.focus()}
              placeholder="19:00"
              className="w-[90px] flex-shrink-0 text-center p-2.5 border border-neutral-300 rounded bg-white font-mono text-sm focus:outline-none focus:border-gold/60 transition-colors"
            />
            {/* 2 — Fəaliyyət */}
            <input
              ref={(el) => (activityRefs.current[i] = el)}
              type="text"
              value={row.activity}
              onChange={(e) => update(i, 'activity', e.target.value)}
              placeholder={tr.program_step_activity_placeholder}
              className="flex-1 min-w-0 p-2.5 border border-neutral-300 rounded bg-white text-sm focus:outline-none focus:border-gold/60 transition-colors"
            />
            {/* 3 — İkon seçici */}
            <IconPickerBtn
              value={row.icon}
              onSelect={(ic) => update(i, 'icon', ic)}
            />
            {/* 4 — Sil */}
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="flex-shrink-0 p-2 text-neutral-400 hover:text-red-500 transition-colors rounded"
              aria-label="Sil"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="text-[11px] tracking-[0.16em] uppercase text-gold/80 hover:text-gold border border-gold/25 hover:border-gold/50 px-4 py-2.5 transition-all duration-200 flex items-center gap-2"
      >
        {tr.program_add_row}
      </button>
      <p className="text-[11px] text-brown-muted/60 font-light tracking-wide">{tr.program_hint}</p>
    </div>
  )
}

/* ── Köməkçi: YYYY-MM-DD → { year, month(0-based), day } ── */
function parseIso(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return { year: y, month: m - 1, day: d }
}

/* ── Köməkçi: { year, month, day } → YYYY-MM-DD ── */
function toIso(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/* ══════════════════════════════════════════════════
   Özəl Azərbaycan Təqvim Komponenti
══════════════════════════════════════════════════ */
function AzCalendar({ value, onChange, hasError, lang = 'az' }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const today    = new Date()
  const selected = parseIso(value)
  const calLang  = calendarTranslations[lang] || calendarTranslations.az

  /* displayDate: GG.AA.YYYY — həm başlanğıc dəyər, həm sinxron */
  const isoToDisplay = (iso) => {
    const p = parseIso(iso)
    if (!p) return ''
    return `${String(p.day).padStart(2, '0')}.${String(p.month + 1).padStart(2, '0')}.${p.year}`
  }

  const [inputValue, setInputValue] = useState(isoToDisplay(value))
  const [viewYear,   setViewYear]   = useState(selected?.year  ?? today.getFullYear())
  const [viewMonth,  setViewMonth]  = useState(selected?.month ?? today.getMonth())

  /* xarici value dəyişəndə inputValue-nu sinxronla (məs: ay seçimindən) */
  useEffect(() => {
    setInputValue(isoToDisplay(value))
  }, [value])

  /* kənar klik ilə bağla */
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  /* əl ilə yazma — avtomatik nöqtə maskası */
  const handleInputChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '')
    let masked = raw
    if (raw.length > 2 && raw.length <= 4) {
      masked = `${raw.slice(0, 2)}.${raw.slice(2)}`
    } else if (raw.length > 4) {
      masked = `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4, 8)}`
    }
    masked = masked.slice(0, 10)
    setInputValue(masked)

    if (masked.length === 10) {
      const [dd, mm, yyyy] = masked.split('.')
      const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
      if (!isNaN(parsed.getTime())) {
        const iso = toIso(Number(yyyy), Number(mm) - 1, Number(dd))
        onChange(iso)
        setViewYear(Number(yyyy))
        setViewMonth(Number(mm) - 1)
      }
    }
  }

  const handleDay = (e, day) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(toIso(viewYear, viewMonth, day))
    setOpen(false)
  }

  const isSelected = (day) =>
    selected && selected.year === viewYear && selected.month === viewMonth && selected.day === day

  const isToday = (day) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day

  return (
    <div ref={wrapRef} className="relative">
      {/* yazıla bilən + ikonlu trigger */}
      <div className={`flex items-center border-0 border-b ${hasError ? 'border-b-red-300' : 'border-beige-dark'} focus-within:border-gold transition-colors duration-300`}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="GG.AA.YYYY"
          maxLength={10}
          className="flex-1 bg-transparent text-ink text-sm py-3 focus:outline-none placeholder:text-brown-muted/40"
        />
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="pl-2 py-3 text-brown-muted/50 hover:text-gold transition-colors duration-200"
        >
          <Calendar size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* canlı tarix mətni */}
      {value && (
        <p className="mt-2 text-[10px] tracking-[0.14em] text-gold/80 font-light">
          {formatFullDateByLang(value, lang)}
        </p>
      )}

      {/* təqvim paneli — absolute, z-[9999] */}
      {open && (
        <div
          className="absolute left-0 top-full mt-1 w-full max-w-[340px] bg-[#1a1a1a]/95 backdrop-blur-md border border-amber-500/20 rounded-xl p-4 shadow-2xl"
          style={{ zIndex: 9999 }}
        >
          {/* başlıq */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center text-amber-400/70 hover:text-amber-400 transition-colors rounded-full hover:bg-white/5">
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <span className="text-[11px] tracking-[0.22em] uppercase text-amber-200/80 font-medium">
              {calLang.months[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center text-amber-400/70 hover:text-amber-400 transition-colors rounded-full hover:bg-white/5">
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* həftə günləri */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {calLang.weekDays.map((d) => (
              <div key={d} className="text-center text-[9px] text-amber-500/50 font-medium tracking-wide py-1">{d}</div>
            ))}
          </div>

          {/* günlər */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                onClick={(e) => handleDay(e, day)}
                className={`h-8 w-full flex items-center justify-center text-[11px] rounded-md transition-all duration-150 font-light ${
                  isSelected(day)
                    ? 'bg-amber-500 text-white font-medium'
                    : isToday(day)
                    ? 'border border-amber-500/40 text-amber-400'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <p className="mt-3 text-center text-[9px] text-amber-500/30 tracking-widest uppercase">
            {calLang.months[viewMonth]} {viewYear}
          </p>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   24 Saatlıq Saat — yazıla bilən mətn maskası
══════════════════════════════════════════════════ */
function TimeInputAz({ value, onChange }) {
  const [timeInputValue, setTimeInputValue] = useState(value || '')

  useEffect(() => {
    setTimeInputValue(value || '')
  }, [value])

  const handleTimeInputChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '')

    let masked = raw
    if (raw.length > 2) {
      let hours   = raw.slice(0, 2)
      let minutes = raw.slice(2, 4)
      if (parseInt(hours,   10) > 23) hours   = '23'
      if (parseInt(minutes, 10) > 59) minutes = '59'
      masked = `${hours}:${minutes}`
    }

    const final = masked.slice(0, 5)
    setTimeInputValue(final)

    if (final.length === 5) onChange(final)
  }

  return (
    <div className={`flex items-center border-0 border-b border-beige-dark focus-within:border-gold transition-colors duration-300`}>
      <input
        type="text"
        value={timeInputValue}
        onChange={handleTimeInputChange}
        placeholder="19:00"
        maxLength={5}
        className="flex-1 bg-transparent text-ink text-sm py-3 focus:outline-none placeholder:text-brown-muted/40"
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Sadə köməkçi komponentlər
══════════════════════════════════════════════════ */
function Label({ children, required }) {
  return (
    <label className="block text-[10px] tracking-[0.22em] uppercase text-brown-muted mb-3 font-medium">
      {children} {required && <span className="text-gold">*</span>}
    </label>
  )
}

function Input({ className = '', ...props }) {
  return <input {...props} className={`luxury-input ${className}`} />
}

function Textarea({ ...props }) {
  return (
    <textarea
      {...props}
      rows={5}
      className="w-full border-0 border-b border-beige-dark bg-transparent text-ink text-sm px-0 py-3 focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-brown-muted/40 resize-none rounded-none"
    />
  )
}

/* ══════════════════════════════════════════════════
   Foto Qalereya Admin Addımı (Step 6)
══════════════════════════════════════════════════ */
function GalleryAdminStep({ data, isCouple, isCorp }) {
  const [mockPhotos] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({ id: i, label: `Şəkil ${i + 1}` }))
  )
  const [zipLoading, setZipLoading] = useState(false)
  const [zipDone,    setZipDone]    = useState(false)

  let slug = ''
  if (isCouple) slug = `${toSlug(data.brideName || '')}-ve-${toSlug(data.groomName || '')}`
  else if (isCorp) slug = toSlug(data.eventName || 'tedbir')
  else slug = toSlug(data.brideName || 'davetname')

  const photoShareUrl = slug
    ? `${window.location.origin}/invite/${slug}/foto`
    : `${window.location.origin}/invite/davetname/foto`

  const downloadQR = useCallback(() => {
    const names = isCouple
      ? `${data.brideName || ''} & ${data.groomName || ''}`
      : data.brideName || data.eventName || 'Digitoy'

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="440" viewBox="0 0 440 440">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FDFAF4"/>
      <stop offset="100%" stop-color="#F0E8D6"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="35%" stop-color="#C5A059"/>
      <stop offset="65%" stop-color="#C5A059"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>
  <rect width="440" height="440" fill="url(#bg)"/>
  <rect x="1" y="1" width="438" height="438" fill="none" stroke="rgba(197,160,89,0.45)" stroke-width="1.2"/>
  <rect x="14" y="14" width="412" height="412" fill="none" stroke="rgba(197,160,89,0.18)" stroke-width="0.6"/>
  <path d="M26,26 L52,26 M26,26 L26,52" stroke="rgba(197,160,89,0.7)" stroke-width="1.8" fill="none"/>
  <path d="M414,26 L388,26 M414,26 L414,52" stroke="rgba(197,160,89,0.7)" stroke-width="1.8" fill="none"/>
  <path d="M26,414 L52,414 M26,414 L26,388" stroke="rgba(197,160,89,0.7)" stroke-width="1.8" fill="none"/>
  <path d="M414,414 L388,414 M414,414 L414,388" stroke="rgba(197,160,89,0.7)" stroke-width="1.8" fill="none"/>
  <text x="220" y="64" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="rgba(197,160,89,0.9)" letter-spacing="5">FOTO · PAYLAŞIM</text>
  <rect x="110" y="74" width="220" height="0.8" fill="url(#gold)"/>
  <text x="220" y="112" text-anchor="middle" font-family="Georgia,serif" font-size="24" font-weight="300" fill="#1A1A1A">${names}</text>
  <text x="220" y="138" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="rgba(140,123,107,0.7)" letter-spacing="2">${data.date || ''}</text>
  <rect x="150" y="152" width="140" height="0.6" fill="url(#gold)"/>
  <rect x="145" y="166" width="150" height="150" rx="4" fill="white" stroke="rgba(197,160,89,0.3)" stroke-width="1"/>
  <text x="220" y="248" text-anchor="middle" font-family="monospace" font-size="7" fill="rgba(140,123,107,0.45)">${photoShareUrl}</text>
  <rect x="110" y="332" width="220" height="0.6" fill="url(#gold)"/>
  <text x="220" y="356" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="rgba(140,123,107,0.7)" letter-spacing="3">TOY ŞƏKİLLƏRİNİZİ PAYLAŞIN</text>
  <text x="220" y="398" text-anchor="middle" font-family="Georgia,serif" font-size="9" fill="rgba(197,160,89,0.65)" letter-spacing="2">digitoy.az</text>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `masa-qr-${slug || 'digitoy'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }, [data, slug, photoShareUrl, isCouple, isCorp])

  const simulateZipDownload = () => {
    setZipLoading(true)
    setTimeout(() => { setZipLoading(false); setZipDone(true); setTimeout(() => setZipDone(false), 3000) }, 1800)
  }

  const BLOCK_STYLE = {
    border: '1px solid rgba(197,160,89,0.2)',
    background: 'linear-gradient(150deg, #FDFAF4 0%, #F8F3E8 100%)',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  }
  const HEADER_STYLE = {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
  }
  const ICON_BOX = {
    width: 38, height: 38, flexShrink: 0,
    border: '1px solid rgba(197,160,89,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(197,160,89,0.06)',
  }

  return (
    <div className="space-y-5">
      {/* ── QR Kod Bölməsi ── */}
      <div style={BLOCK_STYLE}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.6) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.6) 70%, transparent)',
        }} />
        <div style={HEADER_STYLE}>
          <div style={ICON_BOX}>
            <QrCode size={18} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,0.8)' }} />
          </div>
          <div>
            <p style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(197,160,89,0.85)', fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500, marginBottom: 3 }}>
              Masa QR Kodu
            </p>
            <p style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 16, fontWeight: 300, color: '#1C1610' }}>
              HD Masa Kartı — Mətbəə üçün
            </p>
          </div>
        </div>

        {/* QR preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{
            padding: 10, border: '1px solid rgba(197,160,89,0.2)',
            background: 'rgba(255,255,255,0.8)', flexShrink: 0,
          }}>
            <QRCodeSVG value={photoShareUrl} size={90} bgColor="transparent" fgColor="rgba(26,20,12,0.85)" level="M" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: 'rgba(80,68,58,0.75)', fontFamily: '"Inter",system-ui,sans-serif', lineHeight: 1.6, marginBottom: 8 }}>
              Qonaqlar bu QR kodu skanlayaraq toy şəkillərini sistemə yükləyə bilərlər.
            </p>
            <p style={{ fontSize: 9, letterSpacing: '0.06em', color: 'rgba(197,160,89,0.75)', fontFamily: '"Inter",system-ui,sans-serif', wordBreak: 'break-all' }}>
              {photoShareUrl}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadQR}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '12px 18px',
            border: '1px solid rgba(197,160,89,0.35)',
            background: 'rgba(197,160,89,0.06)',
            cursor: 'pointer',
            fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(197,160,89,0.9)', fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(197,160,89,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(197,160,89,0.06)'}
        >
          <Download size={13} strokeWidth={1.5} />
          Masa Kartını HD (SVG) Endir
        </button>
      </div>

      {/* ── Foto Qalereya Admin Paneli ── */}
      <div style={BLOCK_STYLE}>
        <div style={HEADER_STYLE}>
          <div style={ICON_BOX}>
            <Images size={18} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,0.8)' }} />
          </div>
          <div>
            <p style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(197,160,89,0.85)', fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500, marginBottom: 3 }}>
              Canlı Qalereya
            </p>
            <p style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 16, fontWeight: 300, color: '#1C1610' }}>
              Qonaq Şəkilləri İdarəetməsi
            </p>
          </div>
        </div>

        {/* Mock photo grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16 }}>
          {mockPhotos.map(p => (
            <div key={p.id} style={{
              aspectRatio: '1',
              background: 'linear-gradient(135deg, rgba(197,160,89,0.08), rgba(197,160,89,0.04))',
              border: '1px solid rgba(197,160,89,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Placeholder shimmer */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(90deg, transparent, transparent 50%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.06) 51%)',
                backgroundSize: '8px 100%',
              }} />
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 20, height: 20, margin: '0 auto 4px',
                  border: '1px solid rgba(197,160,89,0.25)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 8, color: 'rgba(197,160,89,0.5)' }}>✦</span>
                </div>
                <p style={{ fontSize: 7, color: 'rgba(140,123,107,0.45)', fontFamily: '"Inter",system-ui,sans-serif' }}>{p.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 14,
        }}>
          {[
            { label: 'Yüklənmiş', val: '0' },
            { label: 'Qonaqlar', val: '—' },
            { label: 'Həcm', val: '0 MB' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: '9px 6px', textAlign: 'center',
              border: '1px solid rgba(197,160,89,0.14)',
              background: 'rgba(197,160,89,0.04)',
            }}>
              <p style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 18, fontWeight: 300, color: 'rgba(197,160,89,0.85)', lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(140,123,107,0.6)', fontFamily: '"Inter",system-ui,sans-serif', marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Download zip */}
        <button
          type="button"
          onClick={simulateZipDownload}
          disabled={zipLoading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '12px 18px',
            border: '1px solid rgba(197,160,89,0.35)',
            background: zipDone ? 'rgba(197,160,89,0.15)' : 'rgba(197,160,89,0.06)',
            cursor: zipLoading ? 'wait' : 'pointer',
            fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(197,160,89,0.9)', fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500,
            transition: 'background 0.2s, opacity 0.2s',
            opacity: zipLoading ? 0.6 : 1,
          }}
        >
          <Archive size={13} strokeWidth={1.5} />
          {zipLoading ? 'Hazırlanır…' : zipDone ? '✓ ZIP Hazırdır' : 'Bütün Şəkilləri .zip Endir'}
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Əsas Builder Formu
══════════════════════════════════════════════════ */
/* ── Ad → URL slug çevricisi ── */
function toSlug(str = '') {
  const MAP = {
    ə:'e',ə:'e',Ə:'e',ğ:'g',Ğ:'g',ı:'i',İ:'i',ö:'o',Ö:'o',ü:'u',Ü:'u',ş:'s',Ş:'s',ç:'c',Ç:'c',
    á:'a',é:'e',í:'i',ó:'o',ú:'u',ñ:'n',ä:'a',ü:'u',ö:'o',
  }
  return str
    .split('').map(c => MAP[c] || c).join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* ── URL-safe Base64 encode (+ → -, / → _, = silinir) ── */
function encodeDataLocal(data) {
  try {
    const utf8Bytes = new TextEncoder().encode(JSON.stringify(data))
    return btoa(String.fromCharCode(...utf8Bytes))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch { return '' }
}

/* ── URL-safe Base64 decode ── */
function decodeDataLocal(token) {
  try {
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/') +
      '=='.slice(0, (4 - (token.length % 4)) % 4)
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i)
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch { return null }
}

export default function BuilderForm({ lang, initialData, onSubmit, isAdmin = false }) {
  const tr = t[lang]
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [generatedLiveLink, setGeneratedLiveLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [adminMode,   setAdminMode]   = useState(isAdmin)
  const [isHydrated,  setIsHydrated]  = useState(false)

  /* ── URL-dən data hydration (admin idarəetmə linki) ── */
  useEffect(() => {
    const urlParams   = new URLSearchParams(window.location.search)
    const adminToken  = urlParams.get('admin')
    const encodedData = urlParams.get('data')

    if (adminToken === 'digitoyadmin2026') {
      setAdminMode(true)
      localStorage.setItem('isAdmin', 'true')
    }

    if (encodedData) {
      try {
        const parsedData = decodeDataLocal(encodedData)
        if (!parsedData) throw new Error('null result')
        console.log('Deşifrə olunan data:', parsedData)
        setData(prev => ({ ...prev, ...parsedData }))
        window.history.replaceState({}, '', window.location.pathname)
      } catch (err) {
        console.error('Datanı deşifrə edərkən xəta baş verdi. Format düzgün deyil:', err)
      }
    }

    /* Hydration tamamlandı — digər effektlər artıq işə düşə bilər */
    setIsHydrated(true)
  }, [])

  const set = (key, val) => {
    setData((d) => ({ ...d, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const isCouple = COUPLE_TYPES.includes(data.eventType)
  const isCorp   = CORP_TYPES.includes(data.eventType)

  const steps = [
    tr.step1_title, tr.step2_title, tr.step3_title,
    tr.step4_title, tr.step5_title, tr.step6_title,
  ]

  const validate = () => {
    const e = {}
    if (step === 1) {
      if (isCorp && !data.eventName?.trim()) e.eventName = true
      if (!isCorp && !data.brideName.trim()) e.brideName = true
      if (isCouple && !data.groomName.trim()) e.groomName = true
      if (!data.date) e.date = true
      if (!data.time) e.time = true
    }
    if (step === 2) {
      if (!data.venueName.trim()) e.venueName = true
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const scrollToTop = () => {
    setTimeout(() => {
      const el = document.getElementById('builder-top')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const next = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    if (validate()) {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS))
      scrollToTop()
    }
  }
  const prev = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    setStep((s) => Math.max(s - 1, 1))
    scrollToTop()
  }
  const handleSubmit = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    if (validate()) onSubmit(data)
  }

  const handleApproveAndGenerateLink = () => {
    const isCouple = COUPLE_TYPES.includes(data.eventType)
    const isCorp   = CORP_TYPES.includes(data.eventType)
    let slug = ''
    if (isCouple) {
      slug = `${toSlug(data.brideName)}-ve-${toSlug(data.groomName)}`
    } else if (isCorp) {
      slug = toSlug(data.eventName || 'tedbir')
    } else {
      slug = toSlug(data.brideName || 'davetname')
    }
    /* Datanı qalıcı yaddaşa yaz — link açılanda oradan oxunacaq */
    localStorage.setItem(`wedding_${slug}`, JSON.stringify(data))
    const token = encodeDataLocal(data)
    const link  = `${window.location.origin}/invite/${slug}?data=${token}`
    setGeneratedLiveLink(link)
    setLinkCopied(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLiveLink).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    })
  }

  return (
    <div id="builder-top" className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center mb-14">
        {steps.map((title, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          return (
            <div key={n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-7 h-7 flex items-center justify-center text-[10px] font-medium transition-all duration-300 ${
                    done
                      ? 'bg-gold text-white'
                      : active
                      ? 'border border-gold text-gold bg-transparent'
                      : 'border border-beige-dark text-brown-muted/40 bg-transparent'
                  }`}
                >
                  {done ? <Check size={11} strokeWidth={2} /> : n}
                </div>
                <span className={`hidden sm:block text-[9px] tracking-[0.12em] uppercase text-center max-w-[56px] leading-tight ${active ? 'text-gold' : 'text-brown-muted/50'}`}>
                  {title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-all duration-500 ${done ? 'step-line-active' : 'bg-beige-dark/60'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-cream border border-beige-dark/60 px-10 py-12 overflow-visible min-h-[520px]">
        <h3 className="font-serif text-xl text-ink mb-10 font-light tracking-tight">{steps[step - 1]}</h3>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-8 pb-64">
            {/* Tədbir növü */}
            <div>
              <Label>{tr.event_type || 'Tədbir növü'}</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-1">
                {EVENT_TYPES.map(({ id }) => {
                  const Icon = EVENT_ICONS[id]
                  const label = tr[`event_${id}`]
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('eventType', id)}
                      className={`flex flex-col items-center gap-2.5 py-5 border transition-all duration-200 ${
                        data.eventType === id
                          ? 'border-gold bg-gold/[0.04] text-gold'
                          : 'border-beige-dark/70 text-brown-muted/70 hover:border-gold/40 hover:text-brown-muted'
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      <span className="text-[10px] tracking-[0.12em] uppercase">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Korporativ / Digər — Tədbirin Adı + Təşkilatçı */}
            {isCorp ? (
              <>
                <div>
                  <Label required>{tr.event_name_label}</Label>
                  <Input
                    value={data.eventName || ''}
                    onChange={(e) => set('eventName', e.target.value)}
                    placeholder={tr.event_name_label}
                    className={errors.eventName ? 'border-b-red-300' : ''}
                  />
                </div>
                <div>
                  <Label>{tr.organizer_label}</Label>
                  <Input
                    value={data.organizer || ''}
                    onChange={(e) => set('organizer', e.target.value)}
                    placeholder={tr.organizer_placeholder}
                  />
                </div>
              </>
            ) : isCouple ? (
              /* Toy / Nişan — cütlük adları */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <Label required>{tr.bride_label}</Label>
                  <Input
                    value={data.brideName}
                    onChange={(e) => set('brideName', e.target.value)}
                    placeholder="Leyla"
                    className={errors.brideName ? 'border-b-red-300' : ''}
                  />
                </div>
                <div>
                  <Label required>{tr.groom_label}</Label>
                  <Input
                    value={data.groomName}
                    onChange={(e) => set('groomName', e.target.value)}
                    placeholder="Murad"
                    className={errors.groomName ? 'border-b-red-300' : ''}
                  />
                </div>
              </div>
            ) : (
              /* Ad günü — tək ad */
              <div>
                <Label required>{tr.person_name_label}</Label>
                <Input
                  value={data.brideName}
                  onChange={(e) => set('brideName', e.target.value)}
                  placeholder={tr.person_name_label}
                  className={errors.brideName ? 'border-b-red-300' : ''}
                />
              </div>
            )}

            {/* Tarix & Vaxt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <Label required>{tr.date_label}</Label>
                <AzCalendar
                  value={data.date}
                  onChange={(iso) => set('date', iso)}
                  hasError={!!errors.date}
                  lang={lang}
                />
              </div>
              <div>
                <Label required>{tr.time_label}</Label>
                <TimeInputAz
                  value={data.time}
                  onChange={(val) => set('time', val)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <Label required>{tr.venue_search_label}</Label>
              <VenueSearchInput
                value={data.venueName}
                onChange={(val) => set('venueName', val)}
                onSelect={({ venueName, googleMapsUrl, wazeUrl }) => {
                  setData(d => ({ ...d, venueName, googleMapsUrl, wazeUrl }))
                  setErrors(e => ({ ...e, venueName: undefined }))
                }}
                lang={lang}
                tr={tr}
              />
              {errors.venueName && (
                <p className="mt-1 text-[10px] text-red-400/80">{errors.venueName}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 — Tədbir Proqramı */}
        {step === 3 && (
          <ProgramStepEditor
            rows={data.programSteps || []}
            onChange={(rows) => set('programSteps', rows)}
            tr={tr}
          />
        )}

        {/* STEP 4 — Dress Code */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <Label>{tr.dresscode_type_label}</Label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {[
                  { id: 'blacktie',    label: 'Black Tie',    subKey: 'dresscode_blacktie_sub',    colors: ['#1A1A1A', '#F5F5F5', '#C9A84C'] },
                  { id: 'cocktail',    label: 'Cocktail',     subKey: 'dresscode_cocktail_sub',    colors: ['#C4956A', '#E8D5C4', '#8B6347'] },
                  { id: 'smartcasual', label: 'Smart Casual', subKey: 'dresscode_smartcasual_sub', colors: ['#6B8CAE', '#D4E4F0', '#4A6B8A'] },
                  { id: 'creative',    label: 'Creative',     subKey: 'dresscode_creative_sub',    colors: ['#9B6B9B', '#F0C4D4', '#6B9B6B'] },
                ].map(({ id, label, subKey, colors }) => {
                  const sub = tr[subKey] || subKey
                  const isActive = data.dressCodePalette === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('dressCodePalette', id)}
                      className={`text-left p-5 border transition-all duration-200 ${
                        isActive
                          ? 'border-gold bg-gold/[0.04]'
                          : 'border-beige-dark/60 hover:border-gold/35'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="flex items-center gap-1">
                          {colors.map((c) => (
                            <span
                              key={c}
                              className="w-3 h-3 rounded-full border border-black/10 inline-block flex-shrink-0"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium tracking-wide ${isActive ? 'text-gold' : 'text-ink'}`}>{label}</p>
                      </div>
                      <p className="text-[10px] text-brown-muted/70 font-light mb-4">{sub}</p>
                      {isActive && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center gap-1.5">
                            <User size={18} className="text-amber-700/80" strokeWidth={1.4} />
                            <span className="text-[9px] text-brown-muted">{tr.dresscode_groom_icon}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1.5">
                            <Sparkles size={18} className="text-amber-700/80" strokeWidth={1.4} />
                            <span className="text-[9px] text-brown-muted">{tr.dresscode_bride_icon}</span>
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <Label>{tr.dresscode_desc_label}</Label>
              <Textarea
                value={data.dressCodeDescription}
                onChange={(e) => set('dressCodeDescription', e.target.value)}
                placeholder={tr.dresscode_placeholder}
              />
            </div>
          </div>
        )}

        {/* STEP 5 — Oturma Planı */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <Label>{tr.seating_label}</Label>
              <Textarea
                value={data.seatingPlan}
                onChange={(e) => set('seatingPlan', e.target.value)}
                placeholder={tr.seating_placeholder}
                rows={7}
              />
              <p className="text-[11px] text-brown-muted/70 mt-3 leading-relaxed tracking-wide font-light">{tr.seating_help}</p>
            </div>
          </div>
        )}

        {/* STEP 6 — Foto Qalereya & QR İdarəetmə */}
        {step === 6 && (
          <GalleryAdminStep data={data} isCouple={isCouple} isCorp={isCorp} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1}
          className="flex items-center gap-2 px-7 py-3.5 border border-beige-dark/70 text-brown-muted text-[10px] tracking-[0.22em] uppercase hover:border-gold/50 hover:text-gold transition-all duration-200 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={13} strokeWidth={1.5} />
          {tr.btn_prev}
        </button>

        {step < TOTAL_STEPS ? (
          <button type="button" onClick={next} className="flex items-center gap-2 btn-gold">
            {tr.btn_next}
            <ChevronRight size={13} strokeWidth={1.5} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} className="btn-gold">
            {tr.btn_create}
          </button>
        )}
      </div>

      {/* ── Admin İdarəetmə Paneli ── */}
      {(isAdmin || adminMode) && (
        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm text-center">
          <h3 className="text-base font-semibold text-emerald-800 mb-1 flex items-center justify-center gap-2">
            ⚡ Rəqəmsal Admin Paneli
          </h3>
          <p className="text-sm text-emerald-600 mb-5 font-light leading-relaxed">
            Yuxarıda müştərinin məlumatlarını redaktə edə bilərsiniz. Hər şey hazırdırsa, canlı linki generasiya edin.
          </p>

          <button
            type="button"
            onClick={handleApproveAndGenerateLink}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors w-full sm:w-auto"
          >
            Sifarişi Təsdiqlə və Canlı Linki Yarat
          </button>

          {generatedLiveLink && (
            <div className="mt-4 p-3 bg-white border border-emerald-300 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono text-xs text-emerald-700 break-all text-left select-all leading-relaxed">
                {generatedLiveLink}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-shrink-0 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded transition-colors whitespace-nowrap"
              >
                {linkCopied ? '✓ Kopyalandı' : 'Linki Kopyala'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
