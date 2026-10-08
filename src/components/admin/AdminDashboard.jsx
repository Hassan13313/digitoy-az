import { useState, useEffect, useCallback, useMemo } from 'react'
import { getDashboardStats, getGalleryAnalytics } from '../../utils/api'
import DashboardView from './v2/AdminDashboard'
import { Notice } from './v2/adminUi'
import { azWeekdayShort } from './adminFormat'
import { shortDay } from '../ui/GalleryCharts'

/* ─────────────────────────────────────────────────────────────────────────────
   Admin Dashboard — sifariş statistikası + qalereya analitikası
   (UI redesign 2026-10: görünüş v2/AdminDashboard)

   ⚠ İki AYRI sorğu: qalereya analitikası xəta versə (köhnə backend və ya
   jurnal cədvəli hələ yaranmayıb) sifariş statistikası olduğu kimi qalır —
   Phase 43-dəki qayda.
   ───────────────────────────────────────────────────────────────────────── */

const PKG_LABELS = { SADE: 'Sadə (59₼)', VIP: 'VİP (89₼)', PREMIUM: 'Premium (129₼)' }

export default function AdminDashboard({ onNavigate }) {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const [gal,        setGal]        = useState(null)
  const [galLoading, setGalLoading] = useState(true)
  const [galError,   setGalError]   = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    getDashboardStats()
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => { setError('Statistika yüklənmədi.'); setLoading(false) })
  }, [])

  const loadGallery = useCallback(() => {
    setGalLoading(true)
    setGalError('')
    getGalleryAnalytics(null)
      .then(d => setGal(d))
      .catch(() => setGalError('Qalereya analitikası yüklənmədi.'))
      .finally(() => setGalLoading(false))
  }, [])

  useEffect(() => { load(); loadGallery() }, [load, loadGallery])

  const o = stats?.orders || {}
  const viewStats = {
    total: o.total, today: o.today, pending: o.submitted, pending7d: o.last7days,
    approved: o.approved, rejected: o.rejected, invites: stats?.invitations, photos: stats?.photos,
  }

  const packages = useMemo(
    () => Object.entries(stats?.packages || {}).map(([pkg, cnt]) => ({ label: PKG_LABELS[pkg] || pkg, value: Number(cnt) || 0 })),
    [stats],
  )
  const last7 = useMemo(
    /* ⚠ `toLocaleDateString('az-AZ', {weekday})` Chrome-da ingiliscə qaytarır — əl ilə qısaltma */
    () => (stats?.daily || []).map(d => ({ label: azWeekdayShort(d.day), value: Number(d.cnt) || 0 })),
    [stats],
  )

  const gallery = useMemo(() => {
    const g = gal?.global || {}
    const hours = Array.from({ length: 24 }, () => 0)
    for (const h of gal?.byHour || []) if (h.hour >= 0 && h.hour < 24) hours[h.hour] = Number(h.count) || 0
    return {
      views: g.visits, qrScans: g.qr_scans, uploads: g.uploads, reactions: g.reactions,
      featured: g.featured, slideshows: g.slideshows,
      views14:   (gal?.daily || []).map(d => ({ label: shortDay(d.day), value: Number(d.visits) || 0 })),
      uploads14: (gal?.daily || []).map(d => ({ label: shortDay(d.day), value: Number(d.uploads) || 0 })),
      byHour: hours,
      top: (gal?.topAlbums || []).map(a => ({ id: a.slug, names: a.slug, code: '', views: a.visits, uploads: a.uploads })),
    }
  }, [gal])

  return (
    <>
      {error && <Notice tone="danger" title={error} className="mb-4" />}
      {galError && (
        <Notice tone="info" title={galError} className="mb-4">
          Qalereya hadisə jurnalı ilk baxışdan sonra yaranır — yeni quraşdırmada bu normaldır.
        </Notice>
      )}
      <DashboardView
        stats={viewStats}
        pending={{ count: o.submitted || 0, items: [] }}
        onOpenOrders={() => onNavigate?.('orders')}
        packages={packages}
        last7={last7}
        gallery={gallery}
        onOpenGallery={(t) => window.open(`/invite/${t.id}/qalereya-idare`, '_blank', 'noopener')}
        onRefresh={load}
        refreshing={loading && !!stats}
        onGalleryRefresh={loadGallery}
        galleryRefreshing={galLoading && !!gal}
        loading={loading && !stats}
      />
    </>
  )
}
