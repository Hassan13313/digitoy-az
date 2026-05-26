import { DRESS_CODE_PALETTES } from '../data/constants'
import { formatAzDate, formatTime24 } from './dateFormat'
import t from '../data/translations'

/* ── URL-safe Base64 encode (fallback üçün saxlanılır) ── */
export function encodeData(data) {
  try {
    const utf8Bytes = new TextEncoder().encode(JSON.stringify(data))
    return btoa(String.fromCharCode(...utf8Bytes))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch { return '' }
}

/* ── Admin idarəetmə linki (qısa, slug əsaslı) ── */
export function buildAdminLink(slug) {
  return `${window.location.origin}/invite/${slug}?admin=digitoyadmin2026`
}

const PACKAGE_LABELS = {
  SADE:    'Sadə (59₼)',
  VIP:     'VİP (89₼)',
  PREMIUM: 'Premium (129₼)',
}

/* ── Mərkəzi WhatsApp mesaj generatoru ── */
export function buildWhatsAppMessage(data, lang = 'az', slug = '') {
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
  const dressLabel = paletteObj?.label?.az || data.dressCodePalette || '—'

  const programCount = (data.programSteps || []).filter(r => r.time || r.activity).length

  /* Slug varsa qısa link, yoxdursa Base64 fallback */
  const adminLink = slug
    ? buildAdminLink(slug)
    : `${window.location.origin}/?admin=digitoyadmin2026&data=${encodeData(data)}`

  let nameLines = ''
  if (isCouple) {
    nameLines = `👰 Gəlin: *${data.brideName || '—'}*\n🤵 Bəy: *${data.groomName || '—'}*`
  } else if (isCorp) {
    nameLines = `🏢 Tədbir: *${data.eventName || '—'}*`
    if (data.organizer?.trim()) nameLines += `\n👤 Təşkilatçı: ${data.organizer}`
  } else {
    nameLines = `👤 Ad: *${data.brideName || '—'}*`
  }

  const pkgLabel = PACKAGE_LABELS[data.package] || PACKAGE_LABELS[data.selectedPackage] || '—'

  const lines = [
    `🌟 *YENİ SİFARİŞ — Digitoy.az*`,
    `━━━━━━━━━━━━━━━━━━`,
    `📦 Paket: *${pkgLabel}*`,
    `✨ Tədbir: *${eventLabels[data.eventType] || data.eventType}*`,
    nameLines,
    `📅 Tarix: ${dateStr}`,
    `🕒 Saat: ${timeStr}`,
    `📍 Məkan: ${data.venueName || '—'}`,
    `👗 Geyim: ${dressLabel}`,
    ...(programCount > 0 ? [`📋 Proqram: ${programCount} addım`] : []),
    `━━━━━━━━━━━━━━━━━━`,
    `🔐 *Admin İdarəetmə Linki:*`,
    adminLink,
  ]

  return encodeURIComponent(lines.join('\n'))
}

/* ── WhatsApp URL ── */
export function buildWhatsAppUrl(data, lang = 'az', waNumber = '994557133696', slug = '') {
  return `https://wa.me/${waNumber}?text=${buildWhatsAppMessage(data, lang, slug)}`
}
