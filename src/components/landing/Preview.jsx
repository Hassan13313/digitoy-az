import { Eye, MessageCircle, Edit2, Calendar, MapPin, Shirt, Users, Image } from 'lucide-react'
import { DRESS_CODE_PALETTES, WHATSAPP_NUMBER } from '../../data/constants'
import t from '../../data/translations'

function formatDate(dateStr, lang) {
  if (!dateStr) return '—'
  try {
    const locales = { az: 'az-AZ', en: 'en-US', ru: 'ru-RU' }
    return new Date(dateStr + 'T00:00:00').toLocaleDateString(locales[lang] || 'az-AZ', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function generateWhatsAppText(data, lang) {
  const tr = t[lang]
  const eventLabels = {
    toy: t.az.event_toy, nishan: t.az.event_nishan,
    birthday: t.az.event_birthday, corporate: t.az.event_corporate,
  }
  const paletteLabel = DRESS_CODE_PALETTES.find((p) => p.id === data.dressCodePalette)?.label[lang] || '—'
  const dateStr = formatDate(data.date, lang)

  const lines = [
    tr.whatsapp_header,
    '',
    `🎉 ${tr.event_label}: ${eventLabels[data.eventType] || data.eventType}`,
    `👰 ${tr.bride_label}: ${data.brideName || '—'}`,
    `🤵 ${tr.groom_label}: ${data.groomName || '—'}`,
    `📅 ${tr.datetime_label}: ${dateStr}, ${data.time || '—'}`,
    `📍 ${tr.venue_summary}: ${data.venueName || '—'}`,
    `👗 ${tr.dresscode_summary}: ${paletteLabel}`,
    `🪑 ${tr.seating_label}: ${data.seatingPlan ? tr.seating_yes : tr.seating_no}`,
    `📸 ${tr.gallery_label}: ${data.galleryLink ? tr.gallery_yes : tr.gallery_no}`,
    '',
    tr.whatsapp_footer,
  ]

  return encodeURIComponent(lines.join('\n'))
}

export default function Preview({ lang, data, onEdit, onView }) {
  const tr = t[lang]
  const palette = DRESS_CODE_PALETTES.find((p) => p.id === data.dressCodePalette)
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppText(data, lang)}`

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
  }

  const rows = [
    { icon: Calendar, label: tr.datetime_label, value: `${formatDate(data.date, lang)} — ${data.time || '—'}` },
    { icon: MapPin, label: tr.venue_summary, value: data.venueName || '—' },
    {
      icon: Shirt, label: tr.dresscode_summary,
      value: (
        <span className="flex items-center gap-2">
          {palette?.colors.map((c) => (
            <span key={c} className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-sm inline-block" style={{ backgroundColor: c }} />
          ))}
          <span className="ml-1 font-light">{palette?.label[lang]}</span>
        </span>
      ),
    },
    { icon: Users, label: tr.seating_label, value: data.seatingPlan ? tr.seating_yes : tr.seating_no },
    { icon: Image, label: tr.gallery_label, value: data.galleryLink ? tr.gallery_yes : tr.gallery_no },
  ]

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-3 font-medium">Preview</p>
        <h2 className="font-serif text-2xl text-ink font-light tracking-tight">{tr.preview_title}</h2>
        <div className="gold-divider mt-6 max-w-[160px] mx-auto" />
      </div>

      {/* Couple card */}
      <div className="bg-beige border border-beige-dark/60 px-10 py-10 mb-px text-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-brown-muted mb-4 font-medium">{eventLabels[data.eventType]}</p>
        <h3 className="font-serif text-3xl text-ink font-light tracking-tight">
          {data.brideName || '—'}
          <span className="text-gold mx-4 font-serif italic font-light">&</span>
          {data.groomName || '—'}
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
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
    </div>
  )
}
