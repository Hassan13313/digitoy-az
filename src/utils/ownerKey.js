/* ─────────────────────────────────────────────────────────────────────────────
   «Müştəri paneli» açarı (Phase 50) — brauzer tərəfi.

   Admin müştəriyə /invite/<slug>/panel#k=<64 hex> linkini verir. Açar URL-in
   FRAGMENT hissəsindədir: brauzer onu serverə, Referer başlığına və WhatsApp
   önbaxış botuna göndərmir. Panel açarı localStorage-a yazır və URL-dən silir
   (ekran görüntüsü / ünvan sətrində görünməsin). `?k=` də qəbul olunur.

   Açar X-Owner-Token başlığında gedir və MƏHZ öz dəvətnaməsinə keçir.
   ───────────────────────────────────────────────────────────────────────── */

const PREFIX = 'digitoyOwnerKey:'
const KEY_RE = /^[a-f0-9]{64}$/

export function isOwnerKey(key) {
  return typeof key === 'string' && KEY_RE.test(key)
}

export function storeOwnerKey(slug, key) {
  if (!isOwnerKey(key)) return
  try { localStorage.setItem(PREFIX + slug, key) } catch { /* private rejim */ }
}

export function getOwnerKey(slug) {
  try {
    const key = localStorage.getItem(PREFIX + slug)
    return isOwnerKey(key) ? key : null
  } catch { return null }
}

export function clearOwnerKey(slug) {
  try { localStorage.removeItem(PREFIX + slug) } catch { /* private rejim */ }
}

/** Bu slug üçün saxlanmış açar varsa X-Owner-Token başlığı */
export function ownerHeaders(slug) {
  const key = slug ? getOwnerKey(slug) : null
  return key ? { 'X-Owner-Token': key } : {}
}

/**
 * URL-dən açarı götür: əvvəl `#k=`, sonra `?k=`. Digər parametrlər (utm və s.)
 * saxlanılır. Format səhvdirsə key = null, amma `k` yenə URL-dən silinir.
 * @param {{pathname?: string, search?: string, hash?: string}} loc
 * @returns {{key: string|null, cleanUrl: string}}
 */
export function takeKeyFromLocation({ pathname = '', search = '', hash = '' } = {}) {
  const h = new URLSearchParams(hash.replace(/^#/, ''))
  const q = new URLSearchParams(search.replace(/^\?/, ''))
  const raw = h.get('k') || q.get('k')
  h.delete('k')
  q.delete('k')
  const qs = q.toString()
  const hs = h.toString()
  return {
    key: isOwnerKey(raw) ? raw : null,
    cleanUrl: pathname + (qs ? `?${qs}` : '') + (hs ? `#${hs}` : ''),
  }
}
