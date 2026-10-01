/* ─────────────────────────────────────────────────────────────────────────────
   Dəvətnamə səhifəsinin <title> və description-u — tədbir növünə görə
   (Phase 45.2).

   Əvvəl korporativ/digər/ad günü dəvətnaməsi də «Toy Dəvətnaməsi» və
   «sizi toy mərasiminə dəvət edir» yazırdı. Toy üçün mətn dəyişməyib.
   ⚠ Server tərəfi (WhatsApp/Telegram önbaxışı): public/seo.php › seoInviteMeta().
   ───────────────────────────────────────────────────────────────────────── */

const COUPLE_KINDS = {
  toy:      { label: 'Toy Dəvətnaməsi',     invite: 'toy mərasiminə' },
  nishan:   { label: 'Nişan Dəvətnaməsi',   invite: 'nişan mərasiminə' },
  birthday: { label: 'Ad Günü Dəvətnaməsi', invite: 'ad gününə' },
}
const TAIL = 'Rəqəmsal dəvətnaməyə baxın, İştirak Təsdiqi göndərin.'

/** @returns {{ title: string, description: string|null }} description null → çağıran ümumi mətni qoyur */
export function inviteSeoMeta(d = {}) {
  const data  = d || {}
  const venue = data.venueName ? ` ${data.venueName} məkanında` : ''
  const kind  = COUPLE_KINDS[data.eventType || 'toy']

  if (kind) {
    /* Göstərim sırası BƏY → GƏLİN (Phase 27.1); ad günündə yalnız brideName dolur */
    const names = [data.groomName, data.brideName].map((s) => (s || '').trim()).filter(Boolean).join(' & ')
    if (!names) return { title: `${kind.label} | DigiToy`, description: null }
    return { title: `${names} — ${kind.label} | DigiToy`, description: `${names} sizi ${kind.invite} dəvət edir.${venue} ${TAIL}` }
  }

  const event = (data.eventName || '').trim()
  if (!event) return { title: 'Dəvətnamə | DigiToy', description: null }
  return { title: `${event} — Dəvətnamə | DigiToy`, description: `Sizi «${event}» tədbirinə dəvət edirik.${venue} ${TAIL}` }
}
