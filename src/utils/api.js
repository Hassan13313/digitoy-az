/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Mərkəzi API Client
   VITE_API_URL set edilibsə — onu istifadə et (local dev)
   Production: /api (same-origin)
══════════════════════════════════════════════════ */

import { buildAutoI18n } from '../data/contentI18n'

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

/* ── Dəvətnaməni serverə saxla (UPSERT) — admin tələb olunur ──

   Phase 40: builder yalnız AZ mətn toplayır. Göndərməzdən ƏVVƏL lüğət
   avtomatik EN/RU qarşılıqlarını qurur və `i18n` + `i18nMeta` (hamısı 'auto')
   olaraq əlavə edilir — beləliklə tərcümə DB-də ilk saxlamadan mövcud olur,
   admin heç nə etməsə də dəvətnamə EN/RU-da düzgün görünür.

   ⚠ Admin-in ƏL İLƏ yazdığına toxunmur: server 'manual' işarəli sahələri
   qoruyur (`api/i18n_merge.php`), buradan gələn 'auto' dəyər onları
   ƏVƏZ EDƏ BİLMİR. Builder-də AZ mətn dəyişəndə isə yalnız 'auto' sahələr
   yenilənir — köhnəlmiş avtomatik tərcümə qalmır. */
export async function saveInvitation(slug, formData, draftCode = null) {
  const auto = buildAutoI18n(formData)
  const payload = auto ? { ...formData, ...auto } : formData

  const res = await fetch(`${BASE}/save_invitation.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    /* draft_code sifarişin unikal kodudur — kanonik slug ondan törəyir,
       yəni təkrar saxlama yeni dublikat dəvətnamə yaratmır (idempotent) */
    body: JSON.stringify({ slug, formData: payload, draft_code: draftCode }),
  })
  if (!res.ok) throw new Error(`save_invitation: ${res.status}`)
  return res.json() /* { ok, slug, created } — slug KANONİKDİR */
}

/* ── Dəvətnaməni serverdən oxu (public) ──
   Phase 36: cavab artıq `active` bayrağı da daşıyır.
   ⚠ GERİYƏ UYĞUNLUQ: köhnə serverdə (deploy yarımçıq qalarsa) `active`
   sahəsi ümumiyyətlə gəlmir — `!== false` yazılışı belə halda dəvətnaməni
   AKTİV sayır, yəni heç bir mövcud link səhvən bağlı görünmür.
   @returns {null | { data: object|null, active: boolean }} */
export async function getInvitation(slug) {
  const res = await fetch(`${BASE}/get_invitation.php?slug=${encodeURIComponent(slug)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`get_invitation: ${res.status}`)
  const json = await res.json()
  return { data: json.data ?? null, active: json.active !== false }
}

/* ── Phase 36: dəvətnamə linkini aktiv/deaktiv et (admin) ── */
export async function setInvitationActive(slug, active) {
  const res = await fetch(`${BASE}/set_invitation_status.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ slug, active: !!active }),
  })
  if (!res.ok) throw await toApiError(res, 'Status dəyişdirilə bilmədi')
  return res.json() /* { ok, slug, active } */
}

/* ── Phase 36: təbrik məktubları — admin moderasiyası ── */
export async function getAdminGuestbook({ slug = '', search = '', limit = 100, offset = 0 } = {}) {
  const p = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (slug)   p.set('slug', slug)
  if (search) p.set('search', search)
  const res = await fetch(`${BASE}/admin_guestbook.php?${p}`, { headers: adminHeaders() })
  if (!res.ok) throw await toApiError(res, 'Mesajlar yüklənmədi')
  return res.json() /* { ok, messages, total } */
}

/* ══ Phase 37/39 — Admin baxım (backup vəziyyəti, draft təmizləmə, media indeksi) ══
   Yeni endpointdir; mövcud API çağırışlarının heç biri dəyişmir. */
export async function getMaintenanceStatus() {
  const res = await fetch(`${BASE}/admin_maintenance.php?action=status`, { headers: adminHeaders() })
  if (!res.ok) throw await toApiError(res, 'Baxım məlumatı yüklənmədi')
  return res.json()
}

export async function getAdminAudit(limit = 50) {
  const res = await fetch(`${BASE}/admin_maintenance.php?action=audit&limit=${limit}`, { headers: adminHeaders() })
  if (!res.ok) throw await toApiError(res, 'Audit jurnalı yüklənmədi')
  return res.json()
}

export async function cleanupDrafts() {
  const res = await fetch(`${BASE}/admin_maintenance.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ action: 'cleanup_drafts' }),
  })
  if (!res.ok) throw await toApiError(res, 'Draft təmizləmə alınmadı')
  return res.json()
}

export async function reindexMedia() {
  const res = await fetch(`${BASE}/admin_maintenance.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ action: 'reindex_media' }),
  })
  if (!res.ok) throw await toApiError(res, 'Media indeksi qurulmadı')
  return res.json()
}

export async function deleteGuestbookMessage(id) {
  const res = await fetch(`${BASE}/admin_guestbook.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw await toApiError(res, 'Mesaj silinmədi')
  return res.json() /* { ok, id, mode } */
}

/* ── Phase 36: məzmun tərcümələri (admin) ── */
export async function getInvitationTranslations(slug) {
  const res = await fetch(`${BASE}/admin_translations.php?slug=${encodeURIComponent(slug)}`, {
    headers: adminHeaders(),
  })
  if (!res.ok) throw await toApiError(res, 'Tərcümələr yüklənmədi')
  return res.json() /* { ok, slug, form_data, i18n } */
}

export async function saveInvitationTranslations(slug, i18n, i18nMeta = null) {
  const res = await fetch(`${BASE}/admin_translations.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ slug, i18n, i18nMeta }),
  })
  if (!res.ok) throw await toApiError(res, 'Tərcümələr saxlanılmadı')
  return res.json() /* { ok, slug, i18n, i18nMeta } */
}

/* ══════════════════════════════════════════════════
   MƏZMUN MENECERİ (Phase 42)

   ⚠ `save_invitation.php`-yə GETMİR: o, slug allokasiyasını işə salır və
   canlı linki dəyişmə riski yaradır. Bu endpoint yalnız `form_data`-nın
   `admin` və `sections` açarlarını yeniləyir.
════════════════════════════════════════════════════ */

export async function getInvitationContent(slug) {
  const res = await fetch(`${BASE}/admin_invitation_content.php?slug=${encodeURIComponent(slug)}`, {
    headers: adminHeaders(),
  })
  if (!res.ok) throw await toApiError(res, 'Məzmun yüklənmədi')
  return res.json() /* { slug, template_id, admin, sections } */
}

export async function saveInvitationContent(slug, admin, sections = null) {
  const res = await fetch(`${BASE}/admin_invitation_content.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ slug, admin, sections }),
  })
  if (!res.ok) throw await toApiError(res, 'Məzmun saxlanılmadı')
  return res.json() /* { ok, admin, sections } */
}

/* ── Phase 45: admin şəkli (açılış monoqramı, hekayə fəsli) ──
   Admin tokeni tələb olunur; fayl `uploads/_admin/<slug>/` qovluğuna düşür.
   @param {Blob} blob  artıq hazırlanmış şəkil (bax imageResize › prepareAdminImage)
   @returns {Promise<{url: string, width: number, height: number}>} */
export async function uploadAdminMedia(slug, blob, filename = 'admin.jpg') {
  const fd = new FormData()
  fd.append('slug', slug)
  fd.append('photo', blob, filename)
  let res
  try {
    res = await fetch(`${BASE}/admin_media_upload.php`, { method: 'POST', headers: adminHeaders(), body: fd })
  } catch {
    const e = new Error('İnternet bağlantısı kəsildi. Yenidən cəhd edin.'); e.code = 'NETWORK'; throw e
  }
  let data = null
  try { data = await res.json() } catch { /* JSON deyil */ }
  if (res.ok && data?.ok && typeof data.url === 'string') return data
  const e = new Error(data?.message || (res.status === 401 ? 'Admin sessiyası bitib — yenidən daxil olun.' : 'Şəkil yüklənmədi.'))
  e.code = data?.code || 'HTTP_' + res.status
  throw e
}

/* ══════════════════════════════════════════════════
   HİSSƏLİ / DAVAM ETDİRİLƏ BİLƏN YÜKLƏMƏ

   Böyük video TƏK sorğu ilə göndərilmir. Səbəb (ölçülmüş):
   production-da `post_max_size ≈ 104M` — 2 GB-lıq tək sorğu üçün bu limiti
   qaldırmaq lazım gələrdi, bu isə hər paralel yükləmə üçün ~4 GB anlıq
   disk, saatlarla açıq qalan sorğu və kəsiləndə SIFIRDAN başlamaq
   deməkdir. Bunun əvəzinə fayl 4 MB-lıq parçalarla gedir: server
   limitlərinə toxunulmur və kəsilmə olarsa yalnız son parça itir.
══════════════════════════════════════════════════ */

/** Faylı təkrar açılışlarda tanımaq üçün sabit açar */
function fileKey(file, slug) {
  return `digitoyUpload:${slug}:${file.name}:${file.size}:${file.lastModified}`
}

function loadUploadId(file, slug) {
  try {
    const v = localStorage.getItem(fileKey(file, slug))
    if (v && /^[a-z0-9]{16,64}$/.test(v)) return v
  } catch { /* private mode */ }
  return null
}

function newUploadId(file, slug) {
  const id = (Array.from({ length: 4 }, () =>
    Math.random().toString(36).slice(2, 10)).join('')).slice(0, 32).replace(/[^a-z0-9]/g, '0')
  try { localStorage.setItem(fileKey(file, slug), id) } catch { /* private mode */ }
  return id
}

function clearUploadId(file, slug) {
  try { localStorage.removeItem(fileKey(file, slug)) } catch { /* private mode */ }
}

/** Serverdə artıq neçə bayt var? (davam nöqtəsi) */
async function fetchReceived(slug, uploadId, signal) {
  try {
    const res = await fetch(
      `${BASE}/upload_chunk.php?slug=${encodeURIComponent(slug)}&uploadId=${uploadId}`,
      { signal, cache: 'no-store' })
    if (!res.ok) return 0
    const j = await res.json()
    return Number(j?.received) || 0
  } catch { return 0 }
}

/** Tək hissəni göndər — XHR, çünki fetch yükləmə progress-i vermir */
function sendChunk({ slug, uploadId, blob, chunkIndex, totalChunks, fileSize, poster, onBytes, signal }) {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('slug', slug)
    fd.append('uploadId', uploadId)
    fd.append('chunkIndex', String(chunkIndex))
    fd.append('totalChunks', String(totalChunks))
    fd.append('fileSize', String(fileSize))
    fd.append('chunk', blob, 'chunk.bin')
    if (poster) fd.append('poster', poster, 'poster.jpg')

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${BASE}/upload_chunk.php`)

    /* ── Donma (stall) aşkarlayıcısı ──
       Telefon şəbəkəni itirəndə sorğu çox vaxt XƏTA VERMİR, sadəcə ASILI
       QALIR — brauzer timeout-u gözləyənə qədər (dəqiqələr) istifadəçi
       heç nə görmür və sistem "donmuş" kimi qalır. Ona görə: müəyyən
       müddət ərzində heç bir yükləmə hadisəsi gəlməsə, sorğunu özümüz
       kəsib aydın "bağlantı kəsildi" xətası veririk.
       Astana 4 MB-lıq hissə üçün Slow 4G-də belə bol vaxtdır (~80 san
       ötürmə davam edərkən onprogress müntəzəm gəlir). */
    const STALL_MS = 25000
    let stallTimer = null
    let stalled = false
    const armStall = () => {
      clearTimeout(stallTimer)
      stallTimer = setTimeout(() => { stalled = true; xhr.abort() }, STALL_MS)
    }

    xhr.upload.onprogress = (e) => {
      armStall()
      if (e.lengthComputable) onBytes?.(e.loaded)
    }

    const onAbort = () => xhr.abort()
    signal?.addEventListener('abort', onAbort)
    const cleanup = () => {
      clearTimeout(stallTimer)
      signal?.removeEventListener('abort', onAbort)
    }

    xhr.onload = () => {
      cleanup()
      let data = null
      try { data = JSON.parse(xhr.responseText) } catch { /* JSON deyil */ }
      if (xhr.status >= 200 && xhr.status < 300 && data?.ok) return resolve(data)

      const err = new Error(data?.message || 'Yükləmə alınmadı. Yenidən cəhd edin.')
      err.status = xhr.status
      err.code = data?.code || 'HTTP_' + xhr.status
      /* Server həqiqi mövqeyi bildirirsə saxla — çağıran ondan davam edir */
      if (Number.isFinite(Number(data?.received))) err.received = Number(data.received)
      err.permanent = data?.permanent === true
        || (xhr.status >= 400 && xhr.status < 500 && xhr.status !== 429 && xhr.status !== 409)
      reject(err)
    }
    xhr.onerror = () => {
      cleanup()
      const e = new Error('İnternet bağlantısı kəsildi. Yenidən cəhd edin.')
      e.code = 'NETWORK'; e.permanent = false; reject(e)
    }
    xhr.onabort = () => {
      cleanup()
      if (stalled) {
        const e = new Error('İnternet bağlantısı kəsildi. Yenidən cəhd edin.')
        e.code = 'NETWORK'; e.permanent = false; return reject(e)
      }
      const e = new Error('Ləğv edildi'); e.code = 'ABORTED'; e.permanent = true; reject(e)
    }
    xhr.timeout = 180000        /* Slow 4G-də 4 MB ~80 san çəkə bilər */
    xhr.ontimeout = () => {
      cleanup()
      const e = new Error('Bağlantı çox yavaşdır.'); e.code = 'TIMEOUT'; e.permanent = false; reject(e)
    }
    xhr.send(fd)
  })
}

export async function uploadPhotoChunked(file, slug, opts = {}) {
  const { onProgress, poster, signal } = opts
  const CHUNK = 4 * 1024 * 1024

  let uploadId = loadUploadId(file, slug) || newUploadId(file, slug)

  /* Əvvəlki cəhddən qalan hissələr varsa oradan davam et */
  let offset = await fetchReceived(slug, uploadId, signal)
  if (offset > file.size) { offset = 0; uploadId = newUploadId(file, slug) }

  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK))

  while (offset < file.size) {
    if (signal?.aborted) {
      const e = new Error('Ləğv edildi'); e.code = 'ABORTED'; e.permanent = true; throw e
    }

    const end        = Math.min(offset + CHUNK, file.size)
    const blob       = file.slice(offset, end)
    const chunkIndex = Math.floor(offset / CHUNK)
    const isLast     = end >= file.size
    const base       = offset

    let res
    try {
      res = await sendChunk({
        slug, uploadId, blob, chunkIndex, totalChunks,
        fileSize: file.size,
        poster: isLast ? poster : undefined,
        signal,
        onBytes: (loaded) =>
          onProgress?.(Math.min(99, Math.round(((base + loaded) / file.size) * 100))),
      })
    } catch (e) {
      /* Sıra pozulub (məs. eyni fayl iki tabda göndərilir) — server həqiqi
         mövqeyi bildirir, oradan davam edirik. Sonsuz döngə olmasın deyə
         yalnız İRƏLİ gedirik. */
      if (e?.code === 'CHUNK_OUT_OF_ORDER' && Number.isFinite(e.received) && e.received > offset) {
        offset = e.received
        onProgress?.(Math.min(99, Math.round((offset / file.size) * 100)))
        continue
      }
      throw e
    }

    if (res.done) {
      clearUploadId(file, slug)
      onProgress?.(100)
      return res
    }

    /* Server həqiqəti bildirir — təkrar/qismən yazılmış hissədə də düz qalırıq */
    const next = Number(res.received)
    offset = Number.isFinite(next) && next > offset ? next : end
    onProgress?.(Math.min(99, Math.round((offset / file.size) * 100)))
  }

  /* Bura düşməməlidir: son hissə həmişə done qaytarır */
  const e = new Error('Yükləmə tamamlanmadı. Yenidən cəhd edin.')
  e.code = 'INCOMPLETE'; e.permanent = false
  throw e
}

/* ══════════════════════════════════════════════════
   «BİZİM HEKAYƏMİZ» ŞƏKİLLƏRİ (Phase 44)

   Builder-də şəkil seçilən kimi serverə fayl kimi gedir (story_upload.php);
   formda yalnız qaytarılan qısa yol saxlanılır. Slug hələ yoxdur, ona görə
   qovluq builder sessiyasına bağlıdır.
══════════════════════════════════════════════════ */
const STORY_SID_KEY = 'digitoy_story_sid'

/** Draft sessiyası varsa onu, yoxdursa (admin rejimi) tab-a məxsus ID. */
export function getStorySessionId() {
  const valid = (v) => typeof v === 'string' && /^[A-Za-z0-9-]{16,64}$/.test(v)
  try {
    const sid = localStorage.getItem('digitoy_session_id')
    if (valid(sid)) return sid
  } catch { /* private mode */ }
  try {
    let sid = sessionStorage.getItem(STORY_SID_KEY)
    if (!valid(sid)) {
      sid = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
      sessionStorage.setItem(STORY_SID_KEY, sid)
    }
    return sid
  } catch {
    return 'story-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12)
  }
}

/**
 * Hekayə şəklini yüklə.
 * @param {Blob} blob  artıq kiçildilmiş JPEG (bax utils/imageResize.js › resizeToBlob)
 * @returns {Promise<{url: string, width: number, height: number}>}
 */
export async function uploadStoryPhoto(blob) {
  const fd = new FormData()
  fd.append('sid', getStorySessionId())
  fd.append('photo', blob, 'story.jpg')

  let res
  try {
    res = await fetch(`${BASE}/story_upload.php`, { method: 'POST', body: fd })
  } catch {
    const e = new Error('İnternet bağlantısı kəsildi. Yenidən cəhd edin.'); e.code = 'NETWORK'; throw e
  }
  let data = null
  try { data = await res.json() } catch { /* JSON deyil */ }
  if (res.ok && data?.ok && typeof data.url === 'string') return data

  const e = new Error(data?.message || 'Şəkil yüklənmədi. Yenidən cəhd edin.')
  e.code = data?.code || 'HTTP_' + res.status
  throw e
}

/**
 * Hekayə şəklinin göstəriləcək ünvanı.
 * Serverdəki şəkil `form_data`-da domensiz saxlanılır (`/uploads/_story/…`):
 * production-da API ilə sayt eyni origin-dədir, lokal dev-də isə API ayrı
 * portdadır — o halda ünvan API origin-inə bağlanır.
 * Yalnız təhlükəsiz sxemlər qəbul edilir; qalanı üçün null.
 */
export function storyPhotoSrc(src) {
  if (typeof src !== 'string' || !src) return null
  if (/^data:image\/(jpeg|png|webp);base64,/i.test(src)) return src
  if (/^https:\/\//i.test(src)) return src
  if (src.startsWith('/uploads/')) {
    if (/^https?:\/\//i.test(BASE)) {
      try { return new URL(src, BASE).href } catch { return src }
    }
    return src
  }
  return null
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

    /* Donma aşkarlayıcısı — bax: sendChunk-dakı izah. Şəbəkə itəndə sorğu
       xəta vermir, asılı qalır; istifadəçi «donub» görür. */
    const STALL_MS = 25000
    let stallTimer = null
    let stalled = false
    const armStall = () => {
      clearTimeout(stallTimer)
      stallTimer = setTimeout(() => { stalled = true; xhr.abort() }, STALL_MS)
    }

    xhr.upload.onprogress = (e) => {
      armStall()
      if (e.lengthComputable && onProgress) {
        onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)))
      }
    }

    const onAbort = () => xhr.abort()
    signal?.addEventListener('abort', onAbort)

    const cleanup = () => {
      clearTimeout(stallTimer)
      signal?.removeEventListener('abort', onAbort)
    }

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
      if (stalled) {
        const e = new Error('İnternet bağlantısı kəsildi. Yenidən cəhd edin.')
        e.code = 'NETWORK'; e.permanent = false; return reject(e)
      }
      const err = new Error('Ləğv edildi'); err.code = 'ABORTED'; err.permanent = true
      reject(err)
    }

    /* Böyük videolar zəif mobil şəbəkədə uzun çəkə bilər — geniş pəncərə.
       Server tərəfdə max_execution_time = 300s. */
    xhr.timeout = 600000
    armStall()
    xhr.send(fd)
  })
}

/* ── Phase 25.3 — Musiqi (MP3) yüklə — public, rate-limitli ──
   ⚠ Phase 44.3: builder SESSİYA ID-si göndərir, slug yox. Dəvətnamə yalnız
   təsdiqdə yaranır (slug-a kod əlavə olunur), ona görə builder-in bildiyi
   slug serverdə yoxdur və yükləmə 404 alırdı. Fayl sessiya qovluğuna düşür,
   URL təsdiqdən sonra da dəyişmir (bax upload_music.php). */
export async function uploadMusic(file) {
  const fd = new FormData()
  fd.append('music', file)
  fd.append('sid', getStorySessionId())
  const res = await fetch(`${BASE}/upload_music.php`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) throw await toApiError(res, 'Musiqi yüklənmədi. Yenidən cəhd edin.')
  return res.json() /* { ok, url, filename, mime } */
}

/* ── Şəkilləri çək (public) ──
   Şərti GET (ETag/Last-Modified): qalereya 30 saniyədə bir bu funksiyanı
   çağırır (auto-refresh). Slug üzrə son ETag-i yaddaşda saxlayıb
   If-None-Match kimi göndəririk — server qovluq dəyişməyibsə 304 qaytarır
   və biz əvvəlki nəticəni geri veririk (eyni array referansı ilə — React
   setState bu halda re-render-i atlayır). cache:'no-store' brauzerin öz
   HTTP keşinin bu əl ilə idarə olunan məntiqlə qarışmasının qarşısını alır. */
/* ⚠ Phase 43: keş açarı artıq `slug|sort|visitor`-dur.
   ƏVVƏL yalnız `slug` idi. Sıralama rejimi dəyişəndə (ya da qonaq
   kimliyi qoşulanda) server BAŞQA siyahı qaytarır, amma köhnə açar
   eyni qalırdı: client öz keşindəki ETag-i göndərib 304 alır və
   ƏVVƏLKİ sıra ilə göstərməyə davam edirdi. */
const _photoCache = new Map() // key -> { etag, lastModified, photos, meta }

/**
 * Qalereya manifesti.
 * @param {string} slug
 * @param {{sort?: "newest"|"oldest"|"featured", visitor?: string|null}} [opts]
 *   Parametrsiz çağırış Phase 39 davranışını SAXLAYIR (sort=newest,
 *   qonaq kimliyi göndərilmir) — mövcud çağıranlar dəyişmir.
 */
export async function getPhotos(slug, opts = {}) {
  const sort    = opts.sort || 'newest'
  const visitor = opts.visitor || null

  const key     = `${slug}|${sort}|${visitor || ''}`
  const cached  = _photoCache.get(key)
  const headers = {}
  if (cached?.etag)         headers['If-None-Match']     = cached.etag
  if (cached?.lastModified) headers['If-Modified-Since'] = cached.lastModified

  const qs = new URLSearchParams({ slug })
  if (sort !== 'newest') qs.set('sort', sort)
  if (visitor) qs.set('visitor', visitor)

  const res = await fetch(`${BASE}/get_photos.php?${qs}`, {
    headers,
    cache: 'no-store',
  })

  if (res.status === 304 && cached) return cached.photos
  if (!res.ok) throw new Error(`get_photos: ${res.status}`)

  const json   = await res.json()
  const photos = json.photos ?? []
  /* Sayğaclar manifestin ÖZÜ ilə gəlir — ayrıca sorğu lazım deyil.
     Massivə yazılır ki, `getPhotos` imzası (array qaytarır) dəyişməsin:
     mövcud bütün çağıranlar olduğu kimi işləyir. */
  Object.defineProperty(photos, 'counts', {
    value: json.counts || null, enumerable: false, configurable: true,
  })
  _photoCache.set(key, {
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
export async function submitGuestResponse({ invitationId, guestName, message, attendanceStatus, extraGuests, website }) {
  const res = await fetch(`${BASE}/submit_guest_response.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invitation_id:     invitationId,
      guest_name:        guestName,
      message:           message || null,
      attendance_status: attendanceStatus || null,
      extra_guests:      extraGuests || 0,
      /* Phase 39 — honeypot: insan bunu heç vaxt doldurmur (bax utils/honeypot.js) */
      website:           website || '',
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
  /* ⚠ Server yalnız admin tokeni ilə cavab verir (2026-09-28) */
  const res = await fetch(`${BASE}/get_draft.php?draft_code=${encodeURIComponent(draftCode)}`, { headers: adminHeaders() })
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

/* ── Phase 46: BİRDƏFƏLİK silmə (admin_purge.php) — GERİ QAYTARILMIR ──
   action: 'preview' | 'invitation' (slug, confirm) | 'order' (draft_code) | 'deleted_orders' */
export async function adminPurge(payload) {
  const res = await fetch(`${BASE}/admin_purge.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw await toApiError(res, 'Silinmədi')
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

/* ── Qonaqlar ──
   Admin tokeni varsa tam siyahı (telefon, status, statistika); yoxdursa
   server yalnız ad + masa verir (dəvətnamədəki «masanı tap», RSVP). */
export async function getGuests(invitationId) {
  const res = await fetch(`${BASE}/get_guests.php?invitation_id=${encodeURIComponent(invitationId)}`, { headers: adminHeaders() })
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
export async function submitAttendance({ invitationId, guestId, status, optionalMessage, extraGuests = 0, website }) {
  const res = await fetch(`${BASE}/submit_attendance.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      /* ⚠ Server qonağın bu dəvətnaməyə aid olduğunu yoxlayır (2026-09-28) */
      invitation_id:    invitationId,
      guest_id:         guestId,
      status,
      optional_message: optionalMessage || null,
      extra_guests:     Math.max(0, Math.min(10, parseInt(extraGuests) || 0)),
      /* Phase 39 — honeypot (bax utils/honeypot.js) */
      website:          website || '',
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

/* ══════════════════════════════════════════════════
   PHASE 43 — QALEREYA TƏCRÜBƏSİ

   Hamısı YENİ funksiyalardır: mövcud heç bir imza, URL və ya davranış
   dəyişmir. Serverdə uyğun endpoint yoxdursa (köhnə backend) hər biri
   xəta atır və çağıran tərəf xüsusiyyəti sadəcə göstərmir.
══════════════════════════════════════════════════ */

/* ── Qonaq kimliyi ──
   Reaksiyaların «bir qonaq · bir səs» qaydası üçün lazımdır. Qalereyada
   hesab sistemi YOXDUR (qonaq QR skan edib gəlir), ona görə brauzerdə
   təsadüfi hex saxlanılır. ŞƏXSİ MƏLUMAT DEYİL: heç bir ada, telefona
   və ya IP-yə bağlanmır, yalnız öz reaksiyasını geri tanımağa xidmət edir.
   Private rejimdə localStorage bağlıdırsa sessiyaya məxsus id qaytarılır —
   reaksiya işləyir, sadəcə tab bağlananda yadda qalmır. */
const VISITOR_KEY = 'digitoyVisitorId'
let _memVisitor = null

export function getVisitorId() {
  try {
    let v = localStorage.getItem(VISITOR_KEY)
    if (!v || !/^[a-f0-9]{8,32}$/.test(v)) {
      v = randomHex(16)
      localStorage.setItem(VISITOR_KEY, v)
    }
    return v
  } catch {
    if (!_memVisitor) _memVisitor = randomHex(16)
    return _memVisitor
  }
}

function randomHex(bytes) {
  try {
    const a = new Uint8Array(bytes)
    crypto.getRandomValues(a)
    return Array.from(a, b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    /* crypto yoxdursa (çox köhnə brauzer) — kifayət qədər unikal fallback */
    return (Date.now().toString(16) + Math.random().toString(16).slice(2)).slice(0, bytes * 2).padEnd(bytes * 2, '0')
  }
}

/* ── Dəvətnamə siyahısı (admin) ── */
export async function getInvitationsList({ search = '', limit = 50, offset = 0 } = {}) {
  const p = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (search) p.set('search', search)
  const res = await fetch(`${BASE}/get_invitations_list.php?${p}`, { headers: adminHeaders() })
  if (!res.ok) throw await toApiError(res, 'Dəvətnamə siyahısı yüklənmədi.')
  return res.json()
}

/* ── Qalereya metası: adlar, tarix, sayğaclar, cütlüyün ayarları (public) ── */
export async function getGalleryMeta(slug) {
  const res = await fetch(`${BASE}/gallery_meta.php?slug=${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`gallery_meta: ${res.status}`)
  return res.json()
}

/* ── Qalereya ayarlarını saxla — admin VƏ YA qalereya tokeni ── */
export async function saveGallerySettings(slug, config) {
  const res = await fetch(`${BASE}/gallery_settings.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders(), ...galleryHeaders(slug) },
    body: JSON.stringify({ slug, config }),
  })
  if (!res.ok) throw await toApiError(res, 'Ayarlar saxlanıla bilmədi.')
  return res.json()
}

/* ── Reaksiya ver / geri al (public) ──
   `emoji: ''` reaksiyanı GERİ ALIR. Cavab həqiqi sayğacları qaytarır,
   ona görə UI optimistik dəyəri onunla əvəz edir. */
export async function reactToMedia(slug, id, emoji) {
  const res = await fetch(`${BASE}/media_react.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, id, emoji: emoji || '', visitor: getVisitorId() }),
  })
  if (!res.ok) throw await toApiError(res, 'Reaksiya göndərilmədi.')
  return res.json() /* { ok, id, counts, total, mine } */
}

/* ── Medianı seçilmiş işarələ — admin VƏ YA qalereya tokeni ── */
export async function setMediaFeatured(slug, id, featured) {
  const res = await fetch(`${BASE}/media_feature.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders(), ...galleryHeaders(slug) },
    body: JSON.stringify({ slug, id, featured: !!featured }),
  })
  if (!res.ok) throw await toApiError(res, 'İşarə saxlanıla bilmədi.')
  return res.json() /* { ok, id, featured, featuredCount } */
}

/* ── Qalereya hadisəsini qeyd et (public, «atıb-get») ──
   ⚠ HEÇ VAXT XƏTA ATMIR: analitika qonağın axınını dayandırmamalıdır.
   ⚠ `keepalive` — səhifə dərhal başqa ünvana keçsə də sorğu çatır. */
export function trackGalleryEvent(slug, event) {
  try {
    fetch(`${BASE}/gallery_track.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, event }),
      keepalive: true,
    }).catch(() => {})
  } catch { /* analitika heç vaxt bloklamır */ }
}

/* ── Qalereya analitikası ──
   slug verilibsə qalereya/admin tokeni, verilməyibsə yalnız admin. */
export async function getGalleryAnalytics(slug = null, days = 30) {
  const qs = new URLSearchParams(slug ? { slug, days: String(days) } : {})
  const res = await fetch(`${BASE}/gallery_analytics.php?${qs}`, {
    headers: { ...adminHeaders(), ...(slug ? galleryHeaders(slug) : {}) },
  })
  if (!res.ok) throw await toApiError(res, 'Analitika yüklənmədi.')
  return res.json()
}

/* ── Qonaqları topluca idxal et (admin) ──
   `dryRun: true` heç nə yazmır — yalnız yoxlama hesabatı qaytarır. */
export async function importGuests(invitationId, rows, dryRun = false) {
  const res = await fetch(`${BASE}/import_guests.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ invitation_id: invitationId, rows, dry_run: dryRun }),
  })
  if (!res.ok) throw await toApiError(res, 'İdxal alınmadı.')
  return res.json()
}
