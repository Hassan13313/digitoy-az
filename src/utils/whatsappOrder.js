import { DRESS_CODE_PALETTES } from '../data/constants'
import { ACTIVE_PARTNERS } from '../data/partners'
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
export function buildWhatsAppMessage(data, lang = 'az', slug = '', draftCode = '') {
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

  let nameLines = ''
  if (isCouple) {
    nameLines = `👰 Gəlin: ${data.brideName || '—'}\n🤵 Bəy: ${data.groomName || '—'}`
  } else if (isCorp) {
    nameLines = `🏢 Şirkət: ${data.eventName || '—'}`
    if (data.organizer?.trim()) nameLines += `\n👤 Təşkilatçı: ${data.organizer}`
  } else {
    nameLines = `👤 Ad: ${data.brideName || '—'}`
  }

  const pkgLabel = PACKAGE_LABELS[data.package] || PACKAGE_LABELS[data.selectedPackage] || '—'

  const lines = [
    `💍 YENİ SİFARİŞ — Digitoy.az`,
    `━━━━━━━━━━━━━━━━━━`,
    `📦 Paket: ${pkgLabel}`,
    `🎉 Tədbir: ${eventLabels[data.eventType] || data.eventType}`,
    nameLines,
    `📅 Tarix: ${dateStr}`,
    `🕒 Saat: ${timeStr}`,
    `📍 Məkan: ${data.venueName || '—'}`,
    `👔 Geyim: ${dressLabel}`,
    ...(programCount > 0 ? [`📋 Proqram: ${programCount} addım`] : []),
    ...(data.seatingMethod === 'digitory' ? [`🪑 Oturma planı: DigiToy dolduracaq (+15 AZN)`] : []),
    `━━━━━━━━━━━━━━━━━━`,
    ...(draftCode ? [`📋 Sifariş Kodu: ${draftCode}`] : []),
  ]

  /* Phase 25.2 — Partnyor bonusları (yalnız admin üçün informativ blok).
     Bütün aktiv partnyorlar üçün render olunur — yeni partnyor avtomatik daxil olur. */
  const bonusPkg = ['SADE', 'VIP', 'PREMIUM'].includes(data.package) ? data.package
    : ['SADE', 'VIP', 'PREMIUM'].includes(data.selectedPackage) ? data.selectedPackage
    : null
  if (bonusPkg) {
    for (const partner of ACTIVE_PARTNERS) {
      const pct = partner.discounts[bonusPkg]
      if (!pct) continue
      lines.push(
        `━━━━━━━━━━━━━━━━━━`,
        ``,
        `🎁 ${partner.name} Bonusu`,
        ``,
        `Paketə uyğun endirim:`,
        `${pct}-dək`,
        ``,
        `━━━━━━━━━━━━━━━━━━`,
      )
    }
  }

  return encodeURIComponent(lines.join('\n'))
}

/* ── WhatsApp URL ── */
export function buildWhatsAppUrl(data, lang = 'az', waNumber = '994992133696', slug = '', draftCode = '') {
  return `https://wa.me/${waNumber}?text=${buildWhatsAppMessage(data, lang, slug, draftCode)}`
}
