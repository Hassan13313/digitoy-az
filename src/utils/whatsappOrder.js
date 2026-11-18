import { DRESS_CODE_PALETTES, COUPLE_TYPES, CORP_TYPES } from '../data/constants'
import { packageLabel } from '../data/packages'
import { describeVideoSource, sampleWatchUrl, videoMusicLabel } from '../data/videoSamples'
import { formatAzDate, formatTime24 } from './dateFormat'
import t from '../data/translations'
import { waChatUrl } from './waLink'

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

/* ── Mərkəzi WhatsApp mesaj generatoru ── */
export function buildWhatsAppMessage(data, lang = 'az', slug = '', draftCode = '') {
  const isCouple = COUPLE_TYPES.includes(data.eventType)
  const isCorp   = CORP_TYPES.includes(data.eventType)

  const eventLabels = {
    toy:       t.az.event_toy,
    nishan:    t.az.event_nishan,
    birthday:  t.az.event_birthday,
    corporate: t.az.event_corporate,
    other:     data.eventName || t.az.event_other,
    xina: t.az.event_xina, sunnet: t.az.event_sunnet, baby: t.az.event_baby,
    anniversary: t.az.event_anniversary, graduation: t.az.event_graduation, bachelorette: t.az.event_bachelorette,
  }

  const { formattedDate, dayName } = formatAzDate(data.date, lang)
  const dateStr = dayName ? `${formattedDate} — ${dayName}` : formattedDate
  const timeStr = formatTime24(data.time)

  const paletteObj = DRESS_CODE_PALETTES.find(p => p.id === data.dressCodePalette)
  /* Fərdi kart adı varsa sifariş mesajında da o görünsün (yoxdursa standart) */
  const dressCustom = (data.dressCodeLabels?.[data.dressCodePalette] || '').trim()
  const dressLabel = dressCustom || paletteObj?.label?.az || data.dressCodePalette || '—'

  const programCount = (data.programSteps || []).filter(r => r.time || r.activity).length

  let nameLines = ''
  if (isCouple) {
    /* ⚠ Phase 27: sıra BƏY → GƏLİN (builder formasındakı sıra ilə eyni) */
    nameLines = `🤵 Bəy: ${data.groomName || '—'}\n👰 Gəlin: ${data.brideName || '—'}`
  } else if (isCorp) {
    nameLines = `🏢 Şirkət: ${data.eventName || '—'}`
    if (data.organizer?.trim()) nameLines += `\n👤 Təşkilatçı: ${data.organizer}`
  } else {
    nameLines = `👤 Ad: ${data.brideName || '—'}`
  }

  const pkgLabel = packageLabel(data.package || data.selectedPackage)

  const lines = [
    `💍 YENİ SİFARİŞ — Digitoy.az`,
    `━━━━━━━━━━━━━━━━━━`,
    `📦 Paket: ${pkgLabel}`,
    `🎉 Tədbir: ${eventLabels[data.eventType] || data.eventType}`,
    nameLines,
    `📅 Tarix: ${dateStr}`,
    `🕒 Saat: ${timeStr}`,
    `📍 Məkan: ${data.venueName || '—'}${data.venueNote ? ` (${data.venueNote})` : ''}`,
    `👔 Geyim: ${dressLabel}`,
    ...(programCount > 0 ? [`📋 Proqram: ${programCount} addım`] : []),
    ...(data.seatingMethod === 'digitory' ? [`🪑 Oturma planı: DigiToy dolduracaq (+15 AZN)`] : []),
    `━━━━━━━━━━━━━━━━━━`,
    ...(draftCode ? [`📋 Sifariş Kodu: ${draftCode}`] : []),
  ]

  return encodeURIComponent(lines.join('\n'))
}

/* ── VİDEO paketi (29 ₼) — sifariş mesajı (admin üçün, həmişə AZ) ──
   `v` = VideoOrderForm-un form_data-sı (bax components/landing/VideoOrderForm.jsx) */
export function buildVideoWhatsAppMessage(v) {
  const isCouple = COUPLE_TYPES.includes(v.eventType)
  const isCorp   = CORP_TYPES.includes(v.eventType)
  const eventLabel = v.eventType === 'other' ? (v.eventName || t.az.event_other) : (t.az[`event_${v.eventType}`] || v.eventType || '—')
  const { formattedDate, dayName } = formatAzDate(v.date, 'az')
  const dateStr = v.date ? (dayName ? `${formattedDate} — ${dayName}` : formattedDate) : '—'

  const { sample, link } = describeVideoSource(v.video)
  const sampleLine = sample ? `🎞️ Nümunə: ${sample.title.az}\n${sampleWatchUrl(sample)}`
    : link ? `🎞️ Öz nümunəsi: ${link}`
    : `🎞️ Nümunə: WhatsApp-da göndəriləcək`

  const nameLines = isCouple ? `🤵 Bəy: ${v.groomName || '—'}\n👰 Gəlin: ${v.brideName || '—'}`
    : isCorp ? `🏢 Ad: ${v.eventName || '—'}`
    : `👤 Ad: ${v.brideName || '—'}${v.age ? ` (${v.age})` : ''}`

  const lines = [
    `🎬 YENİ SİFARİŞ — Digitoy.az`,
    `━━━━━━━━━━━━━━━━━━`,
    `📦 Paket: ${packageLabel('VIDEO')}`,
    sampleLine,
    `🎉 Tədbir: ${eventLabel}`,
    nameLines,
    `📅 Tarix: ${dateStr}`,
    `🕒 Saat: ${v.time ? formatTime24(v.time) : '—'}`,
    `📍 Məkan: ${v.venueName || '—'}`,
    `📝 Yazı: ${(v.inviteText || '').trim() || 'Siz yazın'}`,
    `🎵 Musiqi: ${videoMusicLabel(v.videoMusic, 'Siz seçin')}`,
    ...((v.note || '').trim() ? [`💬 Qeyd: ${v.note.trim()}`] : []),
    `━━━━━━━━━━━━━━━━━━`,
  ]
  return encodeURIComponent(lines.join('\n'))
}

export function buildVideoWhatsAppUrl(v, waNumber = '994992133696') {
  return waChatUrl(waNumber, buildVideoWhatsAppMessage(v))
}

/* ── WhatsApp URL ── (wa.me YOX — emojiləri sındırır, bax utils/waLink.js) */
export function buildWhatsAppUrl(data, lang = 'az', waNumber = '994992133696', slug = '', draftCode = '') {
  return waChatUrl(waNumber, buildWhatsAppMessage(data, lang, slug, draftCode))
}
