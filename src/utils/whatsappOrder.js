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

/* ── Localhost vs produksiya base URL ── */
function getBasePlatformUrl() {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  return isLocalhost ? window.location.origin : 'https://digitoy.az'
}

/* ── Admin idarəetmə linki — bütün formData URL-ə kodlanmış ── */
export function buildAdminLink(slug, data = null) {
  const base = `${getBasePlatformUrl()}/invite/${slug}?admin=digitoyadmin2026`
  if (!data) return base
  const token = encodeData(data)
  return token ? `${base}&data=${token}` : base
}

/* ── Yekun müştəri dəvətnamə linki (admin təsdiqindən sonra) ── */
export function buildLiveLink(slug, data) {
  const encoded = encodeData(data)
  return `${getBasePlatformUrl()}/invite/${slug}?view=live&d=${encoded}`
}

/* ── DB-backed qısa link — iOS-safe, 40 char max ── */
export function buildShortLiveLink(slug) {
  return `${getBasePlatformUrl()}/invite/${slug}`
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

  const adminLink = slug
    ? buildAdminLink(slug, data)
    : `${getBasePlatformUrl()}/?admin=digitoyadmin2026&data=${encodeData(data)}`

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
