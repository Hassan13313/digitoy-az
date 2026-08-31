/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Mərkəzi API Client
   VITE_API_URL set edilibsə — onu istifadə et (local dev)
   Production: /api (same-origin)
══════════════════════════════════════════════════ */

const BASE = import.meta.env.VITE_API_URL || '/api'

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

/* ── Qalereya idarəetmə tokeni (per-toy) ──
   Cütlüyə verilən idarəetmə linkindəki ?k=… tokeni. localStorage-da
   slug üzrə saxlanılır ki, refresh və ya linki yenidən açmaq lazım
   gəlməsin. Admin tokenindən FƏRQLİDİR və yalnız öz toyuna aiddir. */
const GALLERY_KEY_PREFIX = 'digitoyGalleryKey:'

export function storeGalleryKey(slug, token) {
  try { localStorage.setItem(GALLERY_KEY_PREFIX + slug, token) } catch { /* private mode */ }
}

export function getGalleryKey(slug) {
  try { return localStorage.getItem(GALLERY_KEY_PREFIX + slug) || null } catch { return null }
}

/** Bu slug üçün idarəetmə səlahiyyəti varmı? (admin VƏ YA qalereya tokeni) */
export function canManageGallery(slug) {
  return Boolean(getAdminToken() || getGalleryKey(slug))
}

function galleryHeaders(slug) {
  const token = getGalleryKey(slug)
  return token ? { 'X-Gallery-Token': token } : {}
}

/* ── Serverin JSON xəta cavabını istifadəçiyə göstəriləcək xətaya çevir ──
   Backend `message` (Azərbaycanca), `code` və `permanent` qaytarır.
   `permanent: true` = yenidən cəhd etmək mənasızdır (fayl çox böyük,
   format dəstəklənmir və s.) — çağıran tərəf buna görə davranır. */
async function toApiError(res, fallback) {
  let data = null
  try { data = await res.json() } catch { /* JSON deyil */ }
  const err = new Error(data?.message || fallback || `HTTP ${res.status}`)
  err.status    = res.status
  err.code      = data?.code || data?.error || null
  err.permanent = data?.permanent === true
  return err
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

/* ── Media yüklə (qonaq — public) ──
   fetch() YÜKLƏMƏ progress-i verə bilmir, ona görə XMLHttpRequest
   istifadə olunur: qonaq 60 MB video göndərəndə faizi real görür.
   Əvvəl yalnız fırlanan spinner var idi və mobil internetdə sistem
   "donmuş" kimi görünürdü — hadisə hesabatındakı əsas şikayətlərdən biri.

   @param {File}   file
   @param {string} slug
   @param {object} opts
   @param {(pct:number)=>void} opts.onProgress  0-100
   @param {Blob}   opts.poster   videonun ilk kadrı (könüllü)
   @param {AbortSignal} opts.signal  ləğv etmək üçün                    */
export function uploadPhoto(file, slug, opts = {}) {
  const { onProgress, poster, signal } = opts

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const e = new Error('Ləğv edildi'); e.code = 'ABORTED'; return reject(e)
    }

    const fd = new FormData()
    fd.append('photo', file)
    fd.append('slug', slug)
    if (poster) fd.append('poster', poster, 'poster.jpg')

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${BASE}/upload_photo.php`)

    /* Admin panel də eyni funksiyanı işlədir — tokeni varsa göndər */
    const admin = adminHeaders()
    if (admin['X-Admin-Token']) xhr.setRequestHeader('X-Admin-Token', admin['X-Admin-Token'])

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)))
      }
    }

    const onAbort = () => xhr.abort()
    signal?.addEventListener('abort', onAbort)

    const cleanup = () => signal?.removeEventListener('abort', onAbort)

    xhr.onload = () => {
      cleanup()
      let data = null
      try { data = JSON.parse(xhr.responseText) } catch { /* JSON deyil */ }

      if (xhr.status >= 200 && xhr.status < 300 && data?.ok) {
        onProgress?.(100)
        return resolve(data)
      }

      const err = new Error(
        data?.message || 'Yükləmə alınmadı. Yenidən cəhd edin.')
      err.status    = xhr.status
      err.code      = data?.code || data?.error || 'HTTP_' + xhr.status
      /* Daimi xəta = yenidən cəhd mənasızdır. Server bunu açıq bildirir;
         bildirməyibsə 4xx-i (429 istisna) daimi sayırıq. */
      err.permanent = data?.permanent === true
        || (xhr.status >= 400 && xhr.status < 500 && xhr.status !== 429)
      reject(err)
    }

    xhr.onerror = () => {
      cleanup()
      const err = new Error('İnternet bağlantısı kəsildi. Yenidən cəhd edin.')
      err.code = 'NETWORK'; err.permanent = false
      reject(err)
    }

    xhr.ontimeout = () => {
      cleanup()
      const err = new Error('Yükləmə çox uzun çəkdi. Yenidən cəhd edin.')
      err.code = 'TIMEOUT'; err.permanent = false
      reject(err)
    }

    xhr.onabort = () => {
      cleanup()
      const err = new Error('Ləğv edildi'); err.code = 'ABORTED'; err.permanent = true
      reject(err)
    }

    /* Böyük videolar zəif mobil şəbəkədə uzun çəkə bilər — geniş pəncərə.
       Server tərəfdə max_execution_time = 300s. */
    xhr.timeout = 600000
    xhr.send(fd)
  })
}

/* ── Phase 25.3 — Musiqi (MP3) yüklə — public, rate-limitli ── */
export async function uploadMusic(file, slug) {
  const fd = new FormData()
  fd.append('music', file)
  fd.append('slug', slug)
  const res = await fetch(`${BASE}/upload_music.php`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) throw new Error(`upload_music: ${res.status}`)
  return res.json() /* { ok, url, filename, mime } */
}

/* ── Şəkilləri çək (public) ──
   Şərti GET (ETag/Last-Modified): qalereya 30 saniyədə bir bu funksiyanı
   çağırır (auto-refresh). Slug üzrə son ETag-i yaddaşda saxlayıb
   If-None-Match kimi göndəririk — server qovluq dəyişməyibsə 304 qaytarır
   və biz əvvəlki nəticəni geri veririk (eyni array referansı ilə — React
   setState bu halda re-render-i atlayır). cache:'no-store' brauzerin öz
   HTTP keşinin bu əl ilə idarə olunan məntiqlə qarışmasının qarşısını alır. */
const _photoCache = new Map() // slug -> { etag, lastModified, photos }

export async function getPhotos(slug) {
  const cached = _photoCache.get(slug)
  const headers = {}
  if (cached?.etag)         headers['If-None-Match']     = cached.etag
  if (cached?.lastModified) headers['If-Modified-Since'] = cached.lastModified

  const res = await fetch(`${BASE}/get_photos.php?slug=${encodeURIComponent(slug)}`, {
    headers,
    cache: 'no-store',
  })

  if (res.status === 304 && cached) return cached.photos
  if (!res.ok) throw new Error(`get_photos: ${res.status}`)

  const json   = await res.json()
  const photos = json.photos ?? []
  _photoCache.set(slug, {
    etag:         res.headers.get('ETag') || null,
    lastModified: res.headers.get('Last-Modified') || null,
    photos,
  })
  return photos
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

/* ── Draft-ı approve et (status = 'approved') ── */
export async function approveDraft(draftCode, slug = '') {
  const res = await fetch(`${BASE}/approve_draft.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ draft_code: draftCode, ...(slug ? { slug } : {}) }),
  })
  if (!res.ok) throw new Error(`approve_draft: ${res.status}`)
  return res.json()
}

/* ── Admin: sifariş siyahısı ── */
export async function getOrdersList(status = 'submitted', limit = 50, offset = 0, search = '', template = '') {
  const params = new URLSearchParams({ status, limit, offset })
  if (search) params.set('search', search)
  if (template) params.set('template', template)   /* Phase 4 — şablon filtri */
  const res = await fetch(`${BASE}/get_orders_list.php?${params}`, { headers: adminHeaders() })
  if (!res.ok) throw new Error(`get_orders_list: ${res.status}`)
  return res.json()
}

/* ── Draft: autosave (session_id üzrə upsert) ── */
export async function saveDraft(sessionId, formData, pkg, currentStep) {
  const res = await fetch(`${BASE}/save_draft.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, form_data: formData, package: pkg, current_step: currentStep }),
  })
  if (!res.ok) throw new Error(`save_draft: ${res.status}`)
  return res.json()
}

/* ── Draft: session_id üzrə yüklə (autosave restore) ── */
export async function getDraft(sessionId) {
  const res = await fetch(`${BASE}/get_draft.php?session_id=${encodeURIComponent(sessionId)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`get_draft: ${res.status}`)
  return res.json()
}

/* ── Draft: draft_code üzrə yüklə (admin axını) ── */
export async function getDraftByCode(draftCode) {
  const res = await fetch(`${BASE}/get_draft.php?draft_code=${encodeURIComponent(draftCode)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`get_draft_by_code: ${res.status}`)
  return res.json()
}

/* ── Draft: submit et (WhatsApp sifariş öncəsi) ── */
export async function submitDraft(sessionId, formData, pkg, customerPhone = '') {
  const res = await fetch(`${BASE}/submit_draft.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, form_data: formData, package: pkg, customer_phone: customerPhone }),
  })
  if (!res.ok) throw new Error(`submit_draft: ${res.status}`)
  return res.json()
}

/* ── Admin: slug üzrə RSVP cavabları ── */
export async function getRsvpResponses(slug) {
  const res = await fetch(`${BASE}/get_rsvp_responses.php?slug=${encodeURIComponent(slug)}`, {
    headers: adminHeaders(),
  })
  if (!res.ok) throw new Error(`get_rsvp_responses: ${res.status}`)
  return res.json()
}

/* ── Admin: dashboard statistikaları ── */
export async function getDashboardStats() {
  const res = await fetch(`${BASE}/get_dashboard_stats.php`, { headers: adminHeaders() })
  if (!res.ok) throw new Error(`get_dashboard_stats: ${res.status}`)
  return res.json()
}

/* ── Draft-ı sil — soft delete (status = 'deleted') ── */
export async function deleteDraft(draftCode) {
  const res = await fetch(`${BASE}/delete_draft.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ draft_code: draftCode }),
  })
  if (!res.ok) throw new Error(`delete_draft: ${res.status}`)
  return res.json()
}

/* ── Draft-ı rədd et (status = 'rejected') ── */
export async function rejectDraft(draftCode, reason = '') {
  const res = await fetch(`${BASE}/reject_draft.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ draft_code: draftCode, reason }),
  })
  if (!res.ok) throw new Error(`reject_draft: ${res.status}`)
  return res.json()
}

/* ── Medianı sil ──
   İcazə: admin tokeni VƏ YA MƏHZ bu slug üçün qalereya tokeni.

   ⚠ ÇAĞIRAN TƏRƏF ÜÇÜN QAYDA: bu funksiya xəta atırsa media SİLİNMƏYİB.
   Xətanı udub elementi UI-dan çıxarmaq OLMAZ — 2026-08-31 hadisəsinin
   kök səbəbi məhz bu idi (UI "silindi" göstərirdi, refresh-də media
   geri qayıdırdı, admin əl ilə uploads qovluğunu təmizləməli olurdu). */
export async function deletePhoto(slug, id) {
  const res = await fetch(`${BASE}/delete_photo.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders(), ...galleryHeaders(slug) },
    body: JSON.stringify({ slug, id }),
  })
  if (!res.ok) throw await toApiError(res, 'Silinmə alınmadı.')
  return res.json() /* { ok, deleted, already } */
}

/* ── Cütlük üçün qalereya idarəetmə linki yarat — admin tələb olunur ── */
export async function createGalleryLink(slug) {
  const res = await fetch(`${BASE}/gallery_link.php?slug=${encodeURIComponent(slug)}`, {
    headers: adminHeaders(),
  })
  if (!res.ok) throw await toApiError(res, 'Link yaradıla bilmədi.')
  return res.json() /* { ok, url, token, exp } */
}

/* ── Media tutarlılıq auditi (yalnız oxuma) — admin tələb olunur ── */
export async function getMediaAudit(slug) {
  const q = slug ? `?slug=${encodeURIComponent(slug)}` : ''
  const res = await fetch(`${BASE}/media_audit.php${q}`, { headers: adminHeaders() })
  if (!res.ok) throw await toApiError(res, 'Audit alınmadı.')
  return res.json()
}

/* ══════════════════════════════════════════════════
   Phase 22 — Guest Management API
══════════════════════════════════════════════════ */

/* ── Qonaqları + iştirak statusunu + statistikanı gətir (public) ── */
export async function getGuests(invitationId) {
  const res = await fetch(`${BASE}/get_guests.php?invitation_id=${encodeURIComponent(invitationId)}`)
  if (!res.ok) throw new Error(`get_guests: ${res.status}`)
  return res.json()
}

/* ── Qonaq idarəetməsi: add | update | delete | move (admin) ── */
export async function manageGuest(action, data) {
  const res = await fetch(`${BASE}/manage_guest.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ action, ...data }),
  })
  if (!res.ok) throw new Error(`manage_guest/${action}: ${res.status}`)
  return res.json()
}

/* ── İştirak cavabı göndər (public) ── */
export async function submitAttendance({ guestId, status, optionalMessage, extraGuests = 0 }) {
  const res = await fetch(`${BASE}/submit_attendance.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      guest_id:         guestId,
      status,
      optional_message: optionalMessage || null,
      extra_guests:     Math.max(0, Math.min(10, parseInt(extraGuests) || 0)),
    }),
  })
  const json = await res.json()
  if (res.status === 409) return { ...json, alreadySubmitted: true }
  if (!res.ok) throw new Error(`submit_attendance: ${res.status}`)
  return json
}

/* ── Oturma planı mətnini guests cədvəlinə köçür (admin) ── */
export async function migrateGuests(invitationId, migrateAll = false) {
  const res = await fetch(`${BASE}/migrate_guests.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify(migrateAll ? { all: true } : { invitation_id: invitationId }),
  })
  if (!res.ok) throw new Error(`migrate_guests: ${res.status}`)
  return res.json()
}

/* ── Qonaqları CSV olaraq ixrac et (admin) ── */
export async function exportGuestsCsv(invitationId, mode = 'tables') {
  const res = await fetch(
    `${BASE}/export_guests.php?invitation_id=${encodeURIComponent(invitationId)}&mode=${mode}`,
    { headers: adminHeaders() }
  )
  if (!res.ok) throw new Error(`export_guests: ${res.status}`)
  const blob = await res.blob()
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  const today = new Date().toISOString().slice(0, 10)
  a.href     = url
  a.download = `qonaqlar-${invitationId}-${mode}-${today}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
