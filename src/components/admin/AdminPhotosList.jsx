import { useState, useEffect, useRef, useMemo } from 'react'
import GalleriesList from './v2/GalleriesList'
import { Notice } from './v2/adminUi'
import { azDate } from './adminFormat'

/* ─────────────────────────────────────────────────────────────────────────────
   Fotolar (qonaq qalereyaları) — UI redesign 2026-10 (görünüş v2/GalleriesList)

   Məntiq dəyişməyib: get_photos_summary.php (400ms debounce axtarış) və
   gallery_link.php — cütlüyə göndəriləcək İDARƏETMƏ linki. İçindəki ?k=
   tokeni MƏHZ bu toyun slug-una imzalanıb; bu link OLMADAN cütlük
   qalereyada yalnız BAXIŞ rejimindədir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = import.meta.env.VITE_API_URL || '/api'

function getAdminToken() {
  try {
    const t = sessionStorage.getItem('adminToken')
    const e = parseInt(sessionStorage.getItem('adminTokenExp') || '0', 10)
    if (t && e && Date.now() < e * 1000) return t
  } catch { /* sessionStorage əlçatmaz */ }
  return null
}

async function fetchGalleryLink(slug) {
  const token = getAdminToken()
  const res = await fetch(`${BASE}/gallery_link.php?slug=${encodeURIComponent(slug)}`, {
    headers: token ? { 'X-Admin-Token': token } : {},
  })
  if (!res.ok) throw new Error(`gallery_link: ${res.status}`)
  return res.json()
}

async function getPhotosSummary(search = '', limit = 50, offset = 0) {
  const p = new URLSearchParams({ limit, offset })
  if (search) p.set('search', search)
  const token = getAdminToken()
  const res = await fetch(`${BASE}/get_photos_summary.php?${p}`, {
    headers: token ? { 'X-Admin-Token': token } : {},
  })
  if (!res.ok) throw new Error(`get_photos_summary: ${res.status}`)
  return res.json()
}

const open = (url) => window.open(url, '_blank', 'noopener')

export default function AdminPhotosList() {
  const [albums,    setAlbums]    = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [search,    setSearch]    = useState('')
  const debounceRef = useRef(null)

  const load = (q = '') => {
    setLoading(true)
    setError('')
    getPhotosSummary(q)
      .then(d => { setAlbums(d.albums || []); setTotal(d.total || 0) })
      .catch(() => setError('Foto məlumatları yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (val) => {
    setSearchVal(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(val); load(val) }, val ? 400 : 0)
  }

  /* Cütlüyə göndəriləcək idarəetmə linkini kopyala.
     Clipboard API HTTPS/icazə tələb edir və köhnə Safari-də yoxdur —
     alınmasa link HƏR HALDA göstərilir, admin linksiz qalmamalıdır. */
  const copyLink = async (album) => {
    let url
    try {
      url = (await fetchGalleryLink(album.slug)).url
    } catch (e) {
      setError('Link yaradıla bilmədi. Sessiya bitibsə yenidən giriş edin.')
      throw e
    }
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Bu linki kopyalayıb cütlüyə göndərin:', url)
    }
  }

  const rows = useMemo(() => albums.map(a => ({
    id: a.slug,
    slug: a.slug,
    photos: Number(a.photo_count) || 0,
    size: `${a.total_mb ?? 0} MB`,
    lastUpload: a.last_upload ? azDate(a.last_upload, { time: true }) : undefined,
  })), [albums])

  const totalPhotos = albums.reduce((s, a) => s + (Number(a.photo_count) || 0), 0)
  const totalMb     = albums.reduce((s, a) => s + (a.total_mb || 0), 0).toFixed(1)

  return (
    <>
      {error && <Notice tone="danger" title={error} className="mb-4" />}
      <GalleriesList
        albums={rows}
        totals={{ albums: total, photos: totalPhotos, size: `${totalMb} MB` }}
        search={searchVal}
        onSearch={handleSearch}
        onRefresh={() => load(search)}
        refreshing={loading}
        loading={loading}
        onCopyLink={copyLink}
        onManage={(a) => open(`/invite/${a.slug}/qalereya-idare`)}
        onSlideshow={(a) => open(`/invite/${a.slug}/slayd`)}
        onUploadPage={(a) => open(`/invite/${a.slug}/foto`)}
      />
    </>
  )
}
