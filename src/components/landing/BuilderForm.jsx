import { useState, useEffect, useRef } from 'react'
import {
  Heart, Diamond, Cake, Briefcase, Sparkles,
  ChevronRight, ChevronLeft, Check, Crown, Shirt, Calendar, User,
} from 'lucide-react'
import { DRESS_CODE_PALETTES, EVENT_TYPES } from '../../data/constants'
import { formatAzFullDate } from '../../utils/dateFormat'
import t from '../../data/translations'

const EVENT_ICONS = { toy: Heart, nishan: Diamond, birthday: Cake, corporate: Briefcase, other: Sparkles }
const TOTAL_STEPS = 5
const COUPLE_TYPES = ['toy', 'nishan']

/* ── Azərbaycan ay + gün massivləri ── */
const azMonths = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktabr', 'Noyabr', 'Dekabr',
]
const azWeekDays = ['B.', 'B.E.', 'Ç.A.', 'Ç.', 'C.A.', 'C.', 'Ş.']

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
function AzCalendar({ value, onChange, hasError }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const today    = new Date()
  const selected = parseIso(value)

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
          {formatAzFullDate(value, 'az')}
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
              {azMonths[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center text-amber-400/70 hover:text-amber-400 transition-colors rounded-full hover:bg-white/5">
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* həftə günləri */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {azWeekDays.map((d) => (
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
            {azMonths[viewMonth]} {viewYear}
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
   Əsas Builder Formu
══════════════════════════════════════════════════ */
export default function BuilderForm({ lang, initialData, onSubmit }) {
  const tr = t[lang]
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState({})

  const set = (key, val) => {
    setData((d) => ({ ...d, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const isCouple = COUPLE_TYPES.includes(data.eventType)

  const steps = [
    tr.step1_title, tr.step2_title, tr.step3_title,
    tr.step4_title, tr.step5_title,
  ]

  const validate = () => {
    const e = {}
    if (step === 1) {
      if (data.eventType === 'other' && !data.eventName?.trim()) e.eventName = true
      if (!data.brideName.trim()) e.brideName = true
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

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, TOTAL_STEPS)) }
  const prev = () => setStep((s) => Math.max(s - 1, 1))
  const handleSubmit = () => { if (validate()) onSubmit(data) }

  return (
    <div className="max-w-2xl mx-auto">
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
      <div className="bg-cream border border-beige-dark/60 px-10 py-12 overflow-visible">
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

            {/* "Digər" seçilsə Tədbirin Adı inputu */}
            {data.eventType === 'other' && (
              <div>
                <Label required>{tr.event_name_label}</Label>
                <Input
                  value={data.eventName || ''}
                  onChange={(e) => set('eventName', e.target.value)}
                  placeholder={tr.event_name_label}
                  className={errors.eventName ? 'border-b-red-300' : ''}
                />
              </div>
            )}

            {/* Ad sahələri — cütlük vs tək */}
            {isCouple ? (
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
              <Label required>{tr.venue_label}</Label>
              <Input
                value={data.venueName}
                onChange={(e) => set('venueName', e.target.value)}
                placeholder="Şahmar Restoran, Bakı"
              />
            </div>
            <div>
              <Label>{tr.maps_label}</Label>
              <Input
                value={data.googleMapsUrl}
                onChange={(e) => set('googleMapsUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div>
              <Label>{tr.waze_label}</Label>
              <Input
                value={data.wazeUrl}
                onChange={(e) => set('wazeUrl', e.target.value)}
                placeholder="https://waze.com/ul?..."
              />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <Label>{tr.palette_label || 'Geyim stili'}</Label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {[
                  { id: 'blacktie',    label: 'Black Tie',    sub: 'Zərif / Rəsmi'        },
                  { id: 'cocktail',    label: 'Cocktail',     sub: 'Yarı-rəsmi / Modern'  },
                  { id: 'smartcasual', label: 'Smart Casual', sub: 'Şık / Rahat'           },
                  { id: 'creative',    label: 'Creative',     sub: 'Tematik / Yaradıcı'   },
                ].map(({ id, label, sub }) => {
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
                      <p className={`text-xs font-medium tracking-wide mb-0.5 ${isActive ? 'text-gold' : 'text-ink'}`}>{label}</p>
                      <p className="text-[10px] text-brown-muted/70 font-light mb-4">{sub}</p>
                      {isActive && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center gap-1.5">
                            <User size={18} className="text-amber-700/80" strokeWidth={1.4} />
                            <span className="text-[9px] text-brown-muted">Bəy</span>
                          </div>
                          <div className="flex flex-col items-center gap-1.5">
                            <Sparkles size={18} className="text-amber-700/80" strokeWidth={1.4} />
                            <span className="text-[9px] text-brown-muted">Xanım</span>
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

        {/* STEP 4 */}
        {step === 4 && (
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

        {/* STEP 5 */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <Label>{tr.gallery_label}</Label>
              <Input
                value={data.galleryLink}
                onChange={(e) => set('galleryLink', e.target.value)}
                placeholder={tr.gallery_placeholder}
              />
              <p className="text-[11px] text-brown-muted/70 mt-3 leading-relaxed tracking-wide font-light">{tr.gallery_help}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          disabled={step === 1}
          className="flex items-center gap-2 px-7 py-3.5 border border-beige-dark/70 text-brown-muted text-[10px] tracking-[0.22em] uppercase hover:border-gold/50 hover:text-gold transition-all duration-200 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={13} strokeWidth={1.5} />
          {tr.btn_prev}
        </button>

        {step < TOTAL_STEPS ? (
          <button onClick={next} className="flex items-center gap-2 btn-gold">
            {tr.btn_next}
            <ChevronRight size={13} strokeWidth={1.5} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-gold">
            {tr.btn_create}
          </button>
        )}
      </div>
    </div>
  )
}
