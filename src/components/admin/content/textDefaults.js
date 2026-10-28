import translations from '../../../data/translations'

/* Admin «Mətnlər» tabının placeholder köməkçiləri (AdminContentManager-dən ayrıldı) */

/* Bölmə başlığının köhnə (sistem) sətri — şablonun öz başlığı onu əvəz edir */
export const SHADOWED_TITLE = {
  venue: 'inv_location', dresscode: 'inv_dresscode', gallery: 'inv_gallery',
  seating: 'seating.title', rsvp: 'rsvp.title', guestbook: 'gbook.title',
}

/* Placeholder: bölmə başlığının sistem mətni (şablonun öz başlığı yoxdursa) */
export function sectionTitleDefault(key, lg, wd, systemText) {
  if (key === 'hero' || key === 'footer') {
    if (!wd) return ''
    return ['toy', 'nishan'].includes(wd.eventType)
      ? [wd.groomName, wd.brideName].filter(Boolean).join(' & ')
      : (wd.eventName || wd.brideName || '')
  }
  const sys = { venue: 'inv_location', dresscode: 'inv_dresscode', gallery: 'inv_gallery', seating: 'seating.title', rsvp: 'rsvp.title', guestbook: 'gbook.title' }[key]
  return sys ? systemText(sys, lg) : ''
}

/* Placeholder: üst etiketin dəvətnamədə görünən mətni (yalnız defoltu olanlar) */
export function sectionKickerDefault(key, lg, wd) {
  const tr = translations[lg] || translations.az
  if (key === 'hero') {
    const type = wd?.eventType || 'toy'
    return type === 'other' ? (wd?.eventName || tr.event_other) : (tr[`event_${type}`] || tr.event_toy)
  }
  if (key === 'rsvp') return tr.inv_rsvp || '—'
  return '—'
}
