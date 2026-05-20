/* ══════════════════════════════════════════════════
   DUAL-PATH PHOTO STORAGE
   USE_SUPABASE_STORAGE = false  →  Base64 → localStorage
   USE_SUPABASE_STORAGE = true   →  Supabase Storage Bucket (launch-ready)
   Single flag flip — no other code change needed.
══════════════════════════════════════════════════ */

export const USE_SUPABASE_STORAGE = false

/* Fill these at launch time */
const SUPABASE_URL      = ''
const SUPABASE_ANON_KEY = ''
const BUCKET_NAME       = 'gallery'

/* Max inline image dimension (px) — keeps localStorage sane */
const MAX_DIM = 900
const JPEG_Q  = 0.72

/* ── Storage key per event slug ── */
const key = (slug) => `gallery_${slug}`

/* ── Compress image via canvas ── */
async function compress(file) {
  if (!file.type.startsWith('image/')) return file
  return new Promise((resolve) => {
    const img = new Image()
    const src = URL.createObjectURL(file)
    img.onload = () => {
      let { width, height } = img
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height)
        width  = Math.round(width  * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(src)
      canvas.toBlob(
        (blob) => resolve(blob || file),
        'image/jpeg', JPEG_Q,
      )
    }
    img.onerror = () => { URL.revokeObjectURL(src); resolve(file) }
    img.src = src
  })
}

/* ── Read file as DataURL (Base64) ── */
function readAsDataURL(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload  = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(blob)
  })
}

/* ── Load gallery for slug ── */
export function loadGallery(slug) {
  try { return JSON.parse(localStorage.getItem(key(slug)) || '[]') }
  catch { return [] }
}

/* ── Persist full array ── */
export function saveGallery(slug, items) {
  try { localStorage.setItem(key(slug), JSON.stringify(items)) }
  catch (e) {
    /* localStorage quota exceeded — trim oldest items */
    const trimmed = items.slice(-80)
    try { localStorage.setItem(key(slug), JSON.stringify(trimmed)) } catch {}
  }
}

/* ── Upload one file ── */
export async function uploadMedia(file, slug) {
  if (USE_SUPABASE_STORAGE) {
    /* ──────────────────────────────────────────────
       SUPABASE STORAGE PATH (active when true)
       Uploads directly to bucket, returns public URL.
    ────────────────────────────────────────────── */
    const ext  = file.name.split('.').pop()
    const path = `${slug}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const res  = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${path}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
        body: file,
      },
    )
    if (!res.ok) throw new Error(`Supabase upload failed: ${res.status}`)
    return {
      id:         path,
      url:        `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`,
      thumbUrl:   `${SUPABASE_URL}/storage/v1/render/image/public/${BUCKET_NAME}/${path}?width=300&quality=70`,
      type:       file.type,
      name:       file.name,
      size:       file.size,
      uploadedAt: new Date().toISOString(),
      source:     'supabase',
    }
  } else {
    /* ──────────────────────────────────────────────
       BASE64 → LOCALSTORAGE PATH (active when false)
       Compresses image first to stay within quota.
    ────────────────────────────────────────────── */
    const blob    = await compress(file)
    const dataUrl = await readAsDataURL(blob)
    const item = {
      id:         `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      url:        dataUrl,
      thumbUrl:   dataUrl,   // same as url in local mode
      type:       file.type.startsWith('image/') ? 'image/jpeg' : file.type,
      name:       file.name,
      size:       blob.size,
      uploadedAt: new Date().toISOString(),
      source:     'local',
    }
    saveGallery(slug, [...loadGallery(slug), item])
    return item
  }
}

/* ── Delete one item ── */
export function deleteMedia(slug, id) {
  const items = loadGallery(slug).filter(i => i.id !== id)
  saveGallery(slug, items)
  return items
}

/* ── Delete multiple items ── */
export function deleteMultiple(slug, ids) {
  const set   = new Set(ids)
  const items = loadGallery(slug).filter(i => !set.has(i.id))
  saveGallery(slug, items)
  return items
}

/* ── Trigger browser download for a single item ── */
export function downloadItem(item) {
  const a    = document.createElement('a')
  a.href     = item.url
  a.download = item.name || `photo_${item.id}.jpg`
  a.click()
}

/* ── Download all items as individual files (ZIP simulation) ── */
export async function downloadAllAsZip(items, slug) {
  /* In local mode we trigger individual downloads sequentially.
     With USE_SUPABASE_STORAGE=true this would be replaced by
     a server-side ZIP endpoint or jszip streaming. */
  for (let i = 0; i < items.length; i++) {
    await new Promise(r => setTimeout(r, 120))
    downloadItem(items[i])
  }
}
