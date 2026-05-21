import { DRESS_CODE_PALETTES } from '../data/constants'
import { formatAzDate, formatTime24 } from './dateFormat'
import t from '../data/translations'

/* ── URL-safe Base64 encode ── */
export function encodeData(data) {
  try {
    const utf8Bytes = new TextEncoder().encode(JSON.stringify(data))
    return btoa(String.fromCharCode(...utf8Bytes))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch { return '' }
}

/* ── Mərkəzi WhatsApp mesaj generatoru ── */
export function buildWhatsAppMessage(data, lang = 'az') {
  const isCouple = ['toy', 'nishan'].includes(data.eventType)
  const isCorp   = ['corporate', 'other'].includes(data.eventType)

  const eventLabels = {
    toy:       t.az.event_toy,
    nishan:    t.az.event_nishan,
    birthday:  t.az.event_birthday,
    corporate: t.az.event_corporate,
    other:     data.eventName || t.az.event_other,
  }

  const { formattedDate, dayName } = formatAzDate(data.date, lang)
  const dateStr = dayName ? `${formattedDate} — ${dayName}` : formattedDate
  const timeStr = formatTime24(data.time)

  const paletteObj = DRESS_CODE_PALETTES.find(p => p.id === data.dressCodePalette)
  const dressLabel = paletteObj?.label[lang] || data.dressCodePalette || '—'

  const programCount = (data.programSteps || []).filter(r => r.time || r.activity).length

  const token     = encodeData(data)
  const adminLink = `${window.location.origin}/builder?admin=digitoyadmin2026&data=${token}`

  let nameLines = ''
  if (isCouple) {
    nameLines = `👰 Gəlin: ${data.brideName || '—'}\n🤵 Bəy: ${data.groomName || '—'}`
  } else if (isCorp) {
    nameLines = `🏢 Tədbir adı: ${data.eventName || '—'}`
    if (data.organizer?.trim()) nameLines += `\n👤 Təşkilatçı: ${data.organizer}`
  } else {
    nameLines = `👤 Ad: ${data.brideName || '—'}`
  }

  const lines = [
    `🤵‍♂️👰‍♀️ YENİ SİFARİŞ (Digitoy.az)`,
    `----------------------------------`,
    `✨ Tədbir: ${eventLabels[data.eventType] || data.eventType}`,
    nameLines,
    `📅 Tarix: ${dateStr}`,
    `🕒 Saat: ${timeStr}`,
    `📍 Məkan: ${data.venueName || '—'}`,
    `👗 Geyim: ${dressLabel}`,
    `📋 Proqram: ${programCount > 0 ? `${programCount} sətir daxil edilib` : 'daxil edilməyib'}`,
    `----------------------------------`,
    `🔗 Sifarişin İdarəetmə Linki (Sırf Admin Üçün):`,
    adminLink,
  ]

  return encodeURIComponent(lines.join('\n'))
}

/* ── WhatsApp URL ── */
export function buildWhatsAppUrl(data, lang = 'az', waNumber = '994557133696') {
  return `https://wa.me/${waNumber}?text=${buildWhatsAppMessage(data, lang)}`
}
