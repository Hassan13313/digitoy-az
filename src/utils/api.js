/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Mərkəzi API Client
   Bütün server əməliyyatları buradan keçir.
   Lokal dev: /api/... → Vite proxy → same origin
   Production: https://digitoy.az/api/...
══════════════════════════════════════════════════ */

const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
const BASE = isLocalhost ? 'https://digitoy.az/api' : '/api'

/* ── Dəvətnaməni serverə saxla (UPSERT) ── */
export async function saveInvitation(slug, formData) {
  const res = await fetch(`${BASE}/save_invitation.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, formData }),
  })
  if (!res.ok) throw new Error(`save_invitation: ${res.status}`)
  return res.json()
}

/* ── Dəvətnaməni serverdən oxu ── */
export async function getInvitation(slug) {
  const res = await fetch(`${BASE}/get_invitation.php?slug=${encodeURIComponent(slug)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`get_invitation: ${res.status}`)
  const json = await res.json()
  return json.data ?? null
}

/* ── Şəkil yüklə ── */
export async function uploadPhoto(file, slug) {
  const fd = new FormData()
  fd.append('photo', file)
  fd.append('slug', slug)
  const res = await fetch(`${BASE}/upload_photo.php`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error(`upload_photo: ${res.status}`)
  return res.json()
}

/* ── Şəkilləri çək ── */
export async function getPhotos(slug) {
  const res = await fetch(`${BASE}/get_photos.php?slug=${encodeURIComponent(slug)}`)
  if (!res.ok) throw new Error(`get_photos: ${res.status}`)
  const json = await res.json()
  return json.photos ?? []
}

/* ── Qonaq cavablarını çək (Guestbook + RSVP) ── */
export async function getGuestResponses(invitationId) {
  const res = await fetch(`${BASE}/get_guest_responses.php?invitation_id=${encodeURIComponent(invitationId)}`)
  if (!res.ok) throw new Error(`get_guest_responses: ${res.status}`)
  return res.json()
}

/* ── Qonaq cavabı göndər ── */
export async function submitGuestResponse({ invitationId, guestName, message, attendanceStatus, extraGuests }) {
  const res = await fetch(`${BASE}/submit_guest_response.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invitation_id:     invitationId,
      guest_name:        guestName,
      message:           message || null,
      attendance_status: attendanceStatus || null,
      extra_guests:      extraGuests || 0,
    }),
  })
  if (!res.ok) throw new Error(`submit_guest_response: ${res.status}`)
  return res.json()
}

/* ── Şəkili sil ── */
export async function deletePhoto(slug, id) {
  const res = await fetch(`${BASE}/delete_photo.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, id }),
  })
  if (!res.ok) throw new Error(`delete_photo: ${res.status}`)
  return res.json()
}
