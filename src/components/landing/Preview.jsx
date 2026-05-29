import { useState, useCallback } from 'react'
import { Eye, MessageCircle, Edit2, Calendar, MapPin, Shirt, Users, Image, ListOrdered, ShieldCheck, Copy, Check } from 'lucide-react'
import { DRESS_CODE_PALETTES } from '../../data/constants'
import { formatAzDate, formatTime24 } from '../../utils/dateFormat'
import { buildWhatsAppUrl, buildLiveLink } from '../../utils/whatsappOrder'
import t from '../../data/translations'

const ADMIN_WA = '994557133696'

/* ── Dress code colors (lokal, yalnız vizual üçün) ── */
const DRESS_COLORS = {
  blacktie:    ['#1A1A1A', '#F5F5F5', '#C9A84C'],
  cocktail:    ['#C4956A', '#E8D5C4', '#8B6347'],
  smartcasual: ['#6B8CAE', '#D4E4F0', '#4A6B8A'],
  creative:    ['#9B6B9B', '#F0C4D4', '#6B9B6B'],
}

const DRESS_LABELS = {
  blacktie: 'Black Tie', cocktail: 'Cocktail', smartcasual: 'Smart Casual', creative: 'Creative',
}

/* ── Admin paneli: linki kopyala düyməsi ── */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 transition-colors"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Kopyalandı!' : 'Kopyala'}
    </button>
  )
}

export default function Preview({ lang, data, onEdit, onView, isAdmin = false }) {
  const tr = t[lang]
  const palette = DRESS_CODE_PALETTES.find(p => p.id === data.dressCodePalette)
  const isCouple = ['toy', 'nishan'].includes(data.eventType)

  const [liveLink,      setLiveLink]      = useState('')
  const [linkCopied,    setLinkCopied]    = useState(false)
  const [linkGenerated, setLinkGenerated] = useState(false)

  const handleApprove = useCallback(() => {
    const link = buildLiveLink(slug, data)
    setLiveLink(link)
    setLinkGenerated(true)
    navigator.clipboard.writeText(link).catch(() => {})
  }, [data])

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(liveLink).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    })
  }, [liveLink])

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: data.eventName || tr.event_other,
  }

  const { formattedDate, dayName } = formatAzDate(data.date, lang)
  const timeStr    = formatTime24(data.time)
  const dateDisplay = dayName ? `${formattedDate} — ${dayName}` : formattedDate

  /* Slug hesabla */
  function toSlug(str = '') {
    return str.toLowerCase()
      .replace(/ç/g,'c').replace(/ğ/g,'g').replace(/[ışı]/g,'i')
      .replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'davetname'
  }
  const isCouple2 = ['toy', 'nishan'].includes(data.eventType)
  const isCorp2   = ['corporate', 'other'].includes(data.eventType)
  const slug = isCouple2
    ? `${toSlug(data.brideName || '')}-ve-${toSlug(data.groomName || '')}`
    : isCorp2 ? toSlug(data.eventName || 'tedbir')
    : toSlug(data.brideName || 'davetname')

  /* WhatsApp link — adminin nömrəsinə gedir, slug ilə qısa admin link */
  const waLink = buildWhatsAppUrl(data, lang, ADMIN_WA, slug)

  const handleWaClick = useCallback(() => {}, []) /* URL-driven: DB yazma yoxdur */

  /* Xülasə sətirləri */
  const rows = [
    {
      icon: Calendar, label: tr.datetime_label,
      value: (
        <span className="flex flex-col gap-0.5">
          <span>{dateDisplay}</span>
          <span className="text-brown-muted/60 text-xs">{timeStr}</span>
        </span>
      ),
    },
    { icon: MapPin, label: tr.venue_summary, value: data.venueName || '—' },
    ...(data.programSteps?.filter(r => r.time || r.activity).length > 0 ? [{
      icon: ListOrdered, label: tr.program_summary_label,
      value: (
        <span className="flex flex-col gap-1">
          {data.programSteps.filter(r => r.time || r.activity).map((row, i) => (
            <span key={i} className="flex items-center gap-2 text-xs font-light">
              {row.time && <span className="text-gold/80 font-medium w-10 flex-shrink-0">{row.time}</span>}
              {row.icon && <span className="text-sm leading-none">{row.icon}</span>}
              <span>{row.activity}</span>
            </span>
          ))}
        </span>
      ),
    }] : []),
    {
      icon: Shirt, label: tr.dresscode_summary,
      value: (() => {
        const id     = data.dressCodePalette
        const label  = palette?.label?.[lang] || DRESS_LABELS[id] || id
        const colors = palette?.colors || DRESS_COLORS[id] || []
        return (
          <span className="flex items-center gap-1.5">
            {colors.map(c => (
              <span key={c} className="w-3.5 h-3.5 rounded-full border border-beige-dark/40 shadow-sm inline-block flex-shrink-0" style={{ backgroundColor: c }} />
            ))}
            <span className="ml-1 font-light">{label}</span>
          </span>
        )
      })(),
    },
    { icon: Users, label: tr.seating_label,  value: data.seatingPlan ? tr.seating_yes : tr.seating_no },
    { icon: Image, label: tr.gallery_label,   value: data.galleryLink ? tr.gallery_yes : tr.gallery_no },
  ]

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-3 font-medium">Preview</p>
        <h2 className="font-serif text-2xl text-ink font-light tracking-tight">{tr.preview_title}</h2>
        <div className="gold-divider mt-6 max-w-[160px] mx-auto" />
      </div>

      {/* Name card */}
      <div className="bg-beige border border-beige-dark/60 px-10 py-10 mb-px text-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-brown-muted mb-4 font-medium">
          {eventLabels[data.eventType] || tr.event_other}
        </p>
        <h3 className="font-serif text-3xl text-ink font-light tracking-tight">
          {isCouple ? (
            <>
              {data.brideName || '—'}
              <span className="text-gold mx-4 font-serif italic font-light">&</span>
              {data.groomName || '—'}
            </>
          ) : (
            data.brideName || data.eventName || '—'
          )}
        </h3>
      </div>

      {/* Details */}
      <div className="bg-cream border border-beige-dark/60 border-t-0 px-10 py-8 mb-8">
        <div className="space-y-6">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-5">
              <div className="w-7 h-7 border border-beige-dark/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={12} className="text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[9px] tracking-[0.22em] uppercase text-brown-muted mb-1 font-medium">{label}</p>
                <div className="text-sm text-ink font-light flex items-center">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Müştəri düymələri */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWaClick}
          className="flex-1 flex items-center justify-center gap-2.5 btn-gold"
        >
          <MessageCircle size={14} strokeWidth={1.5} />
          {tr.preview_whatsapp}
        </a>
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2.5 btn-outline-gold"
        >
          <Eye size={14} strokeWidth={1.5} />
          {tr.preview_view}
        </button>
      </div>

      <button
        onClick={onEdit}
        className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] tracking-[0.18em] uppercase text-brown-muted hover:text-gold transition-colors duration-200 py-3"
      >
        <Edit2 size={11} strokeWidth={1.5} />
        {tr.preview_edit}
      </button>

      {/* ── Admin Paneli ── */}
      {isAdmin && (
        <div
          className="mt-10 border border-emerald-600/25"
          style={{ background: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)' }}
        >
          <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(16,185,129,0.6) 40%,rgba(16,185,129,0.8) 50%,rgba(16,185,129,0.6) 60%,transparent)' }} />
          <div className="px-8 py-7 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-2">
              <ShieldCheck size={15} className="text-emerald-700" strokeWidth={1.5} />
              <p className="text-[10px] tracking-[0.28em] uppercase text-emerald-700 font-semibold">⚡ Admin Paneli</p>
            </div>
            <p className="text-sm text-emerald-800/70 font-light leading-relaxed mb-6 max-w-sm mx-auto">
              Müştərinin məlumatlarını yuxarıda redaktə edin. Hər şey hazır olduqda müştəriyə göndəriləcək yekun linki yaradın.
            </p>

            {!linkGenerated ? (
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors duration-200 shadow-md"
              >
                <Check size={13} strokeWidth={2.5} />
                Sifarişi Təsdiqlə
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-700 font-semibold">
                  ✓ Link hazırlandı — müştəriyə göndər
                </p>
                <div className="bg-cream border border-beige-dark/70 px-4 py-3 text-left">
                  <p className="text-xs text-espresso font-mono break-all leading-relaxed">{liveLink}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border border-emerald-600 text-emerald-700 text-[10px] tracking-[0.18em] uppercase font-semibold hover:bg-emerald-600 hover:text-white transition-colors duration-200"
                >
                  {linkCopied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={1.5} />}
                  {linkCopied ? 'Kopyalandı!' : 'Linki Kopyala'}
                </button>
              </div>
            )}
          </div>
          <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(16,185,129,0.6) 40%,rgba(16,185,129,0.8) 50%,rgba(16,185,129,0.6) 60%,transparent)' }} />
        </div>
      )}
    </div>
  )
}
