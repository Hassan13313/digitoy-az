import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, MessageCircle, Edit2, Calendar, MapPin, Shirt, Users, Image, ListOrdered, ShieldCheck, Copy, Check, Crown, Martini, Palette, Music } from 'lucide-react'
import { DRESS_CODE_PALETTES } from '../../data/constants'
import { resolveDressGenders } from '../../data/dressCode'
import { formatAzDate, formatTime24 } from '../../utils/dateFormat'
import { buildWhatsAppUrl, buildShortLiveLink } from '../../utils/whatsappOrder'
import { saveInvitation, submitDraft } from '../../utils/api'
import { trackEvent } from '../../utils/analytics'
import t from '../../data/translations'
import { SECTION_DEFS, isSectionOn } from '../../data/sections'

const ADMIN_WA = '994992133696'

/* ── Dress code colors (lokal, yalnız vizual üçün) ── */
const DRESS_COLORS = {
  blacktie:    ['#1A1A1A', '#F5F5F5', '#C9A84C'],
  cocktail:    ['#C4956A', '#E8D5C4', '#8B6347'],
  smartcasual: ['#6B8CAE', '#D4E4F0', '#4A6B8A'],
  creative:    ['#9B6B9B', '#F0C4D4', '#6B9B6B'],
}

const DRESS_LABELS_FALLBACK = {
  blacktie: 'Rəsmi', cocktail: 'Cocktail', smartcasual: 'Smart Casual', creative: 'Creative',
}

/* Phase 25.3 — dress code premium kart ikonları (BuilderForm ilə eyni xəritə) */
const DRESS_ICONS = { blacktie: Crown, cocktail: Martini, smartcasual: Shirt, creative: Palette }

/* Phase 35 — xülasədəki "gizlədilmiş bölmələr" sətrinin başlığı */
const HIDDEN_LABEL = { az: 'Gizlədilən bölmələr', en: 'Hidden sections', ru: 'Скрытые разделы' }

const MUSIC_MODE_LABELS = {
  az: { auto: 'Açılan kimi', button: 'Düymə ilə', start: 'Başlanğıc' },
  en: { auto: 'On open', button: 'By button', start: 'Start' },
  ru: { auto: 'При открытии', button: 'По кнопке', start: 'Начало' },
}

function fmtSec(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
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
  const [saving,        setSaving]        = useState(false)
  const [saveError,     setSaveError]     = useState(false)

  /* slug — useCallback-dan əvvəl declare edilməlidir (TDZ) */
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

  const handleApprove = useCallback(async () => {
    if (saving) return
    setSaving(true)
    setSaveError(false)
    try {
      await saveInvitation(slug, data)
      const link = buildShortLiveLink(slug)
      setLiveLink(link)
      setLinkGenerated(true)
      navigator.clipboard.writeText(link).catch(() => {})
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }, [slug, data, saving])

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

  const waUrl = buildWhatsAppUrl(data, lang, ADMIN_WA, slug, '')

  const handleWaClick = useCallback(() => {
    const sid = localStorage.getItem('digitoy_session_id') || ''
    const pkg = data.package || data.selectedPackage || 'SADE'
    trackEvent('whatsapp_order_clicked', { lang, package: pkg })
    submitDraft(sid, data, pkg).then(r => {
      if (r?.draft_code) trackEvent('order_submitted', { lang, package: pkg })
    }).catch(() => {})
  }, [data, lang])

  /* Phase 35 — cütlüyün söndürdüyü bölmələrin adları (paket kilidi SAYILMIR:
     burada yalnız istifadəçinin öz seçimi göstərilir). */
  const hiddenSectionNames = SECTION_DEFS
    .filter((sdef) => !isSectionOn(data, sdef.id))
    .map((sdef) => sdef.labels[lang] || sdef.labels.az)

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
    ...(isSectionOn(data, 'venue') ? [{
      icon: MapPin, label: tr.venue_summary,
      /* Məkan qeydi varsa ikinci sətirdə; yoxdursa əvvəlki kimi tək sətir */
      value: data.venueNote
        ? (
          <span className="flex flex-col gap-0.5">
            <span>{data.venueName || '—'}</span>
            <span className="text-brown-muted/60 text-xs">{data.venueNote}</span>
          </span>
        )
        : (data.venueName || '—'),
    }] : []),
    ...(isSectionOn(data, 'program') && data.programSteps?.filter(r => r.time || r.activity).length > 0 ? [{
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
    ...(isSectionOn(data, 'dresscode') ? [{
      icon: Shirt, label: tr.dresscode_summary,
      value: (() => {
        /* Phase 25.3 — premium mini-kart: ikon + başlıq + açıqlama + palitra */
        const id      = data.dressCodePalette
        /* Fərdi ad varsa o, yoxdursa standart ad (köhnə sifarişlər üçün fallback) */
        const custom  = (data.dressCodeLabels?.[id] || '').trim()
        const label   = custom || palette?.label?.[lang] || t[lang]?.[`dresscode_${id}_label`] || DRESS_LABELS_FALLBACK[id] || id
        /* Alt sətir kişi/qadın mətnlərindən qurulur → dəvətnamədəki ilə eynidir */
        const g       = resolveDressGenders(id, lang, data.dressCodeGenders)
        const sub     = [g.male, g.female].filter(Boolean).join(' · ')
                        || t[lang]?.[`dresscode_${id}_sub`] || palette?.description?.[lang] || ''
        const colors  = palette?.colors || DRESS_COLORS[id] || []
        const DCIcon  = DRESS_ICONS[id] || Shirt
        return (
          <div
            className="flex items-start gap-3 rounded-xl px-3.5 py-3 -ml-1"
            style={{
              background: 'linear-gradient(150deg, rgba(255,255,255,0.6) 0%, rgba(197,160,89,0.06) 100%)',
              border: '1px solid rgba(197,160,89,0.32)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 4px 16px rgba(197,160,89,0.08)',
            }}
          >
            <span className="w-9 h-9 min-w-[36px] rounded-full flex items-center justify-center border border-gold/40 bg-gold/[0.08] mt-0.5">
              <DCIcon size={14} strokeWidth={1.5} className="text-gold" />
            </span>
            <span className="flex flex-col gap-1 min-w-0">
              <span className="text-[13px] font-medium text-espresso tracking-wide">{label}</span>
              {sub && <span className="text-[10.5px] text-brown-muted/65 font-light leading-relaxed">{sub}</span>}
              <span className="flex items-center gap-1.5 mt-0.5">
                {colors.map(c => (
                  <span key={c} className="w-3 h-3 rounded-full border border-beige-dark/40 shadow-sm inline-block flex-shrink-0" style={{ backgroundColor: c }} />
                ))}
              </span>
            </span>
          </div>
        )
      })(),
    }] : []),
    ...(isSectionOn(data, 'music') && data.music ? [{
      icon: Music, label: tr.music_summary || 'Musiqi',
      value: (() => {
        const m  = data.music
        const ml = MUSIC_MODE_LABELS[lang] || MUSIC_MODE_LABELS.az
        return (
          <span className="flex flex-col gap-1">
            <span className="font-light">
              {m.title}{m.artist ? <span className="text-brown-muted/60"> — {m.artist}</span> : null}
            </span>
            <span className="flex items-center gap-1.5 flex-wrap">
              {m.startTime > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-mono text-gold-dark bg-gold/[0.08] border border-gold/25">
                  {ml.start}: {fmtSec(m.startTime)}
                </span>
              )}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] text-brown-muted/70 bg-beige border border-beige-dark/40">
                {m.playMode === 'auto' ? ml.auto : ml.button}
              </span>
            </span>
          </span>
        )
      })(),
    }] : []),
    ...(isSectionOn(data, 'seating') ? [{ icon: Users, label: tr.seating_label,
      value: data.seatingMethod === 'digitory'
        ? 'DigiToy (+15 AZN)'
        : data.seatingPlan ? tr.seating_yes : tr.seating_no }] : []),
    ...(isSectionOn(data, 'gallery') ? [{ icon: Image, label: tr.gallery_label, value: data.galleryLink ? tr.gallery_yes : tr.gallery_no }] : []),
    /* Phase 35 — söndürülmüş bölmələr xülasədə bir sətirlə görünür ki,
       cütlük sifarişdən əvvəl nəyin gizli qaldığını təsdiqləyə bilsin. */
    ...(hiddenSectionNames.length > 0 ? [{
      icon: EyeOff, label: HIDDEN_LABEL[lang] || HIDDEN_LABEL.az,
      value: <span className="font-light">{hiddenSectionNames.join(' · ')}</span>,
    }] : []),
  ]

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] tracking-[0.42em] uppercase text-gold-dark mb-3">Preview</p>
        <h2 className="font-serif text-2xl text-espresso font-light tracking-tight">{tr.preview_title}</h2>
        <div className="flex items-center justify-center gap-3 mt-5 max-w-[140px] mx-auto">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55))' }} />
          <div className="w-1.5 h-1.5 border border-gold/60 rotate-45" />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.55))' }} />
        </div>
      </div>

      {/* ── Luxury receipt card ── */}
      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{
          background: 'linear-gradient(160deg, #FDFCF9 0%, #F8F5EF 100%)',
          boxShadow: '0 20px 60px rgba(44,26,14,0.08), 0 6px 20px rgba(44,26,14,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
          border: '1px solid rgba(221,213,200,0.55)',
        }}
      >
        {/* Name header */}
        <div className="px-8 pt-8 pb-7 text-center">
          <p className="font-mono text-[9px] tracking-[0.34em] uppercase text-brown-muted/70 mb-3">
            {eventLabels[data.eventType] || tr.event_other}
          </p>
          <h3 className="font-serif text-[28px] text-espresso font-light tracking-tight leading-tight">
            {/* ⚠ Phase 27: göstərim sırası BƏY → GƏLİN (data açarları dəyişmir) */}
            {isCouple ? (
              <>
                {data.groomName || '—'}
                <span className="text-gold mx-3 font-serif italic font-light">&amp;</span>
                {data.brideName || '—'}
              </>
            ) : (
              data.brideName || data.eventName || '—'
            )}
          </h3>
        </div>

        {/* Gold hairline divider */}
        <div className="mx-8 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.45) 30%, rgba(197,160,89,0.45) 70%, transparent)' }} />

        {/* Data rows */}
        <div className="px-8 py-7 space-y-5">
          {rows.map(({ icon: Icon, label, value }) => {
            const isEmpty = typeof value === 'string' && (value === tr.seating_no || value === tr.gallery_no || value === '—')
            return (
              <div key={label} className="flex items-start gap-4">
                {/* Frameless icon marker */}
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-lg"
                  style={{ background: 'rgba(197,160,89,0.07)' }}>
                  <Icon size={13} className="text-gold" strokeWidth={1.4} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-brown-muted/65 mb-1 font-semibold">{label}</p>
                  {isEmpty ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] italic text-brown-muted/50 font-light"
                      style={{ background: 'rgba(139,107,91,0.06)', border: '1px solid rgba(139,107,91,0.12)' }}>
                      —
                    </span>
                  ) : (
                    <div className="text-[13.5px] text-espresso font-light leading-snug">{value}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWaClick}
          className="flex-1 flex items-center justify-center gap-2.5 btn-gold min-h-[52px]"
        >
          <MessageCircle size={14} strokeWidth={1.5} />
          {tr.preview_whatsapp}
        </a>
        <motion.button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2.5 btn-outline-gold min-h-[52px]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Eye size={14} strokeWidth={1.5} />
          {tr.preview_view}
        </motion.button>
      </div>

      {/* Edit link */}
      <button
        onClick={onEdit}
        className="group w-full flex items-center justify-center gap-2 text-[10px] tracking-[0.18em] uppercase text-brown-muted hover:text-gold transition-colors duration-200 py-3"
      >
        <Edit2 size={11} strokeWidth={1.5} />
        <span className="relative">
          {tr.preview_edit}
          <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-gold transition-all duration-300" />
        </span>
      </button>

      {/* ── Admin Paneli — approve BuilderForm-dan edilir; burada gizlədilir ── */}
      {isAdmin && false && (
        <div
          className="mt-8 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1px solid rgba(16,185,129,0.22)',
            boxShadow: '0 8px 24px rgba(16,185,129,0.08)',
          }}
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
              <div className="space-y-2">
                <motion.button
                  type="button"
                  onClick={handleApprove}
                  disabled={saving}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors duration-200 shadow-md rounded-xl"
                  whileHover={saving ? {} : { scale: 1.02 }}
                  whileTap={saving ? {} : { scale: 0.97 }}
                >
                  <Check size={13} strokeWidth={2.5} />
                  {saving ? 'Saxlanılır...' : 'Sifarişi Təsdiqlə'}
                </motion.button>
                {saveError && (
                  <p className="text-[10px] text-red-500 font-medium">
                    Xəta baş verdi. Yenidən cəhd edin.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-700 font-semibold">
                  ✓ Saxlandı — müştəriyə göndər
                </p>
                <div className="bg-cream border border-beige-dark/70 rounded-xl px-4 py-3 text-left">
                  <p className="text-xs text-espresso font-mono break-all leading-relaxed">{liveLink}</p>
                </div>
                <motion.button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border border-emerald-600 text-emerald-700 text-[10px] tracking-[0.18em] uppercase font-semibold hover:bg-emerald-600 hover:text-white transition-colors duration-200 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {linkCopied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={1.5} />}
                  {linkCopied ? 'Kopyalandı!' : 'Linki Kopyala'}
                </motion.button>
              </div>
            )}
          </div>
          <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(16,185,129,0.6) 40%,rgba(16,185,129,0.8) 50%,rgba(16,185,129,0.6) 60%,transparent)' }} />
        </div>
      )}
    </div>
  )
}
