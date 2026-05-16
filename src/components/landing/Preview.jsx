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
            <span key={c} className="w-4 h-4 rounded-full border border-white/60 shadow-sm inline-block" style={{ backgroundColor: c }} />
          ))}
          <span className="ml-1">{palette?.label[lang]}</span>
        </span>
      ),
    },
    { icon: Users, label: tr.seating_label, value: data.seatingPlan ? tr.seating_yes : tr.seating_no },
    { icon: Image, label: tr.gallery_label, value: data.galleryLink ? tr.gallery_yes : tr.gallery_no },
  ]

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Preview</p>
        <h2 className="font-serif text-2xl text-ink">{tr.preview_title}</h2>
        <div className="gold-divider mt-4 max-w-xs mx-auto" />
      </div>

      {/* Couple card */}
      <div className="bg-beige border border-beige-dark p-8 mb-1 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-brown-muted mb-3">{eventLabels[data.eventType]}</p>
        <h3 className="font-serif text-3xl text-ink font-light">
          {data.brideName || '—'}
          <span className="text-gold mx-3 font-serif italic">&</span>
          {data.groomName || '—'}
        </h3>
      </div>

      {/* Details */}
      <div className="bg-cream border border-beige-dark border-t-0 p-6 mb-6">
        <div className="space-y-4">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-8 h-8 border border-beige-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={13} className="text-gold" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-brown-muted mb-0.5">{label}</p>
                <div className="text-sm text-ink flex items-center">{value}</div>
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
          className="flex-1 flex items-center justify-center gap-2.5 btn-gold text-xs tracking-widest uppercase"
        >
          <MessageCircle size={15} />
          {tr.preview_whatsapp}
        </a>
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2.5 btn-outline-gold text-xs tracking-widest uppercase"
        >
          <Eye size={15} />
          {tr.preview_view}
        </button>
      </div>

      <button
        onClick={onEdit}
        className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-brown-muted hover:text-gold transition-colors duration-200 py-2"
      >
        <Edit2 size={12} />
        {tr.preview_edit}
      </button>
    </div>
  )
}
