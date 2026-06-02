/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Mərkəzi API Client
   Lokal dev: birbaşa https://digitoy.az/api (cross-origin)
   Production: /api (same-origin)
══════════════════════════════════════════════════ */

const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
const BASE = isLocalhost ? 'https://digitoy.az/api' : '/api'

/* ── Admin HMAC tokeni sessionStorage-dan oxu ── */
function getAdminToken() {
  try {
    const token = sessionStorage.getItem('adminToken')
    const exp   = parseInt(sessionStorage.getItem('adminTokenExp') || '0', 10)
    if (token && exp && Date.now() < exp * 1000) return token
    sessionStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminTokenExp')
  } catch {}
  return null
}

/* ── Admin sorğularına X-Admin-Token header əlavə et ── */
function adminHeaders() {
  const token = getAdminToken()
  return token ? { 'X-Admin-Token': token } : {}
}

/* ── Admin girişi — key backend tərəfindən yoxlanılır ── */
export async function adminLogin(key) {
  const res = await fetch(`${BASE}/admin_login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  })
  if (!res.ok) throw new Error(`admin_login: ${res.status}`)
  return res.json() /* { ok, token, exp } */
}

/* ── Dəvətnaməni serverə saxla (UPSERT) — admin tələb olunur ── */
export async function saveInvitation(slug, formData) {
  const res = await fetch(`${BASE}/save_invitation.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ slug, formData }),
  })
  if (!res.ok) throw new Error(`save_invitation: ${res.status}`)
  return res.json()
}

/* ── Dəvətnaməni serverdən oxu (public) ── */
export async function getInvitation(slug) {
  const res = await fetch(`${BASE}/get_invitation.php?slug=${encodeURIComponent(slug)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`get_invitation: ${res.status}`)
  const json = await res.json()
  return json.data ?? null
}

/* ── Şəkil yüklə — admin tələb olunur ── */
export async function uploadPhoto(file, slug) {
  const fd = new FormData()
  fd.append('photo', file)
  fd.append('slug', slug)
  const res = await fetch(`${BASE}/upload_photo.php`, {
    method: 'POST',
    headers: adminHeaders(), /* Content-Type FormData üçün avtomatik təyin edilir */
    body: fd,
  })
  if (!res.ok) throw new Error(`upload_photo: ${res.status}`)
  return res.json()
}

/* ── Şəkilləri çək (public) ── */
export async function getPhotos(slug) {
  const res = await fetch(`${BASE}/get_photos.php?slug=${encodeURIComponent(slug)}`)
  if (!res.ok) throw new Error(`get_photos: ${res.status}`)
  const json = await res.json()
  return json.photos ?? []
}

/* ── Qonaq cavablarını çək (public) ── */
export async function getGuestResponses(invitationId) {
  const res = await fetch(`${BASE}/get_guest_responses.php?invitation_id=${encodeURIComponent(invitationId)}`)
  if (!res.ok) throw new Error(`get_guest_responses: ${res.status}`)
  return res.json()
}

/* ── Qonaq cavabı göndər (public) ── */
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

/* ── Şəkili sil — admin tələb olunur ── */
export async function deletePhoto(slug, id) {
  const res = await fetch(`${BASE}/delete_photo.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ slug, id }),
  })
  if (!res.ok) throw new Error(`delete_photo: ${res.status}`)
  return res.json()
}
