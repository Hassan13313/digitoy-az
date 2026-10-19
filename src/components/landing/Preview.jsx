import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, MessageCircle, Edit2, Calendar, MapPin, Shirt, Users, Image, ListOrdered, Crown, Martini, Palette, Music } from 'lucide-react'
import { DRESS_CODE_PALETTES } from '../../data/constants'
import { resolveDressGenders } from '../../data/dressCode'
import { formatAzDate, formatTime24 } from '../../utils/dateFormat'
import { buildWhatsAppUrl } from '../../utils/whatsappOrder'
import { submitDraft } from '../../utils/api'
import { readCustomerPhone } from '../../utils/customerPhone'
import { trackEvent } from '../../utils/analytics'
import OrderLegalNote from '../legal/OrderLegalNote'
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

export default function Preview({ lang, data, onEdit, onView }) {
  const tr = t[lang]
  const palette = DRESS_CODE_PALETTES.find(p => p.id === data.dressCodePalette)
  const isCouple = ['toy', 'nishan'].includes(data.eventType)

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: data.eventName || tr.event_other,
  }

  const { formattedDate, dayName } = formatAzDate(data.date, lang)
  const timeStr    = formatTime24(data.time)
  const dateDisplay = dayName ? `${formattedDate} — ${dayName}` : formattedDate

  const waUrl = buildWhatsAppUrl(data, lang, ADMIN_WA)

  const handleWaClick = useCallback(() => {
    const sid = localStorage.getItem('digitoy_session_id') || ''
    const pkg = data.package || data.selectedPackage || 'SADE'
    trackEvent('whatsapp_order_clicked', { lang, package: pkg })
    submitDraft(sid, data, pkg, readCustomerPhone()).then(r => {
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
          <span className="text-[13px] tabular-nums text-brown-dark/75">{timeStr}</span>
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
            <span className="text-[13px] text-brown-dark/75">{data.venueNote}</span>
          </span>
        )
        : (data.venueName || '—'),
    }] : []),
    ...(isSectionOn(data, 'program') && data.programSteps?.filter(r => r.time || r.activity).length > 0 ? [{
      icon: ListOrdered, label: tr.program_summary_label,
      value: (
        <span className="flex flex-col gap-1">
          {data.programSteps.filter(r => r.time || r.activity).map((row, i) => (
            <span key={i} className="flex items-center gap-2 text-[14px]">
              {row.time && <span className="w-11 flex-shrink-0 font-semibold tabular-nums text-gold-deep">{row.time}</span>}
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
          <div className="-ml-1 flex items-start gap-3 rounded-2xl bg-gold-mist/40 px-3.5 py-3 ring-1 ring-inset ring-gold/25">
            <span className="mt-0.5 grid h-10 w-10 min-w-[40px] place-items-center rounded-full bg-espresso text-gold-light">
              <DCIcon size={15} strokeWidth={1.5} />
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-[15px] font-semibold text-ink">{label}</span>
              {sub && <span className="text-[13px] leading-relaxed text-brown-dark/85">{sub}</span>}
              <span className="mt-0.5 flex items-center gap-1.5">
                {colors.map(c => (
                  <span key={c} className="inline-block h-4 w-4 flex-shrink-0 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: c }} />
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
              {m.title}{m.artist ? <span className="text-brown-dark/70"> — {m.artist}</span> : null}
            </span>
            <span className="flex items-center gap-1.5 flex-wrap">
              {m.startTime > 0 && (
                <span className="inline-flex items-center rounded-full bg-gold-mist/70 px-2.5 py-0.5 text-[12px] font-medium tabular-nums text-gold-deep">
                  {ml.start}: {fmtSec(m.startTime)}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-beige px-2.5 py-0.5 text-[12px] text-brown-dark ring-1 ring-inset ring-beige-dark">
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
    <div className="mx-auto max-w-[780px] animate-fade-up">
      {/* Section header */}
      <div className="mb-10 text-center">
        <h2 className="font-serif text-[30px] font-medium leading-tight text-ink sm:text-[34px]">{tr.preview_title}</h2>
        <div aria-hidden="true" className="mx-auto mt-5 flex max-w-[140px] items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
          <div className="h-2.5 w-2.5 rotate-45 border border-gold" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
        </div>
      </div>

      {/* ── Luxury receipt card ── */}
      <div className="relative mb-6 overflow-hidden rounded-[28px] bg-white/90 shadow-luxe ring-1 ring-gold/15">
        <span aria-hidden="true" className="absolute inset-x-12 top-0 h-px bg-gold-line" />
        {/* Name header */}
        <div className="px-8 pt-8 pb-7 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-eyebrow text-gold-deep">
            {eventLabels[data.eventType] || tr.event_other}
          </p>
          <h3 className="font-serif text-[32px] font-medium leading-tight text-ink sm:text-[36px]">
            {/* ⚠ Phase 27: göstərim sırası BƏY → GƏLİN (data açarları dəyişmir) */}
            {isCouple ? (
              <>
                {data.groomName || '—'}
                <span className="mx-3 font-serif font-normal italic text-gold-rich">&amp;</span>
                {data.brideName || '—'}
              </>
            ) : (
              data.brideName || data.eventName || '—'
            )}
          </h3>
        </div>

        {/* Gold hairline divider */}
        <div aria-hidden="true" className="mx-8 h-px bg-gold-line opacity-70" />

        {/* Data rows */}
        <div className="space-y-5 px-6 py-7 sm:px-8">
          {rows.map(({ icon: Icon, label, value }) => {
            const isEmpty = typeof value === 'string' && (value === tr.seating_no || value === tr.gallery_no || value === '—')
            return (
              <div key={label} className="flex items-start gap-4">
                {/* Frameless icon marker */}
                <div className="mt-0.5 grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gold-mist/70 text-gold-deep">
                  <Icon size={16} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-label text-brown-dark/80">{label}</p>
                  {isEmpty ? (
                    <span className="inline-flex items-center rounded-full bg-beige px-2.5 py-0.5 text-[12px] italic text-brown-dark/70">
                      —
                    </span>
                  ) : (
                    <div className="text-[15px] leading-snug text-ink">{value}</div>
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
          className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2.5 rounded-full bg-espresso-grad px-6 text-center text-[12px] font-semibold uppercase tracking-label text-cream shadow-lift ring-1 ring-inset ring-gold/30 transition-[transform,box-shadow] duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-luxe"
        >
          <MessageCircle size={16} strokeWidth={1.6} className="text-gold-light" />
          {tr.preview_whatsapp}
        </a>
        <motion.button
          onClick={onView}
          className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2.5 rounded-full border border-gold/55 bg-cream/40 px-6 text-center text-[12px] font-semibold uppercase tracking-label text-gold-deep transition-colors hover:border-gold hover:bg-gold-mist/60"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Eye size={14} strokeWidth={1.5} />
          {tr.preview_view}
        </motion.button>
      </div>

      {/* Phase 47 — sifarişin hüquqi qeydi */}
      <OrderLegalNote lang={lang} color="#5C4A3A" style={{ margin: '0 auto 6px' }} />

      {/* Edit link */}
      <button
        onClick={onEdit}
        className="group flex min-h-[48px] w-full items-center justify-center gap-2 py-3 text-[12px] font-semibold uppercase tracking-label text-brown-dark transition-colors duration-200 hover:text-gold-deep"
      >
        <Edit2 size={11} strokeWidth={1.5} />
        <span className="relative">
          {tr.preview_edit}
          <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-gold transition-all duration-300" />
        </span>
      </button>
    </div>
  )
}
