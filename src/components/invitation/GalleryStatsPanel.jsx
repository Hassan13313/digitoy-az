import { useState, useEffect, useMemo } from 'react'
import StatsSheet from '../guest-photos/stats'
import { getGalleryAnalytics } from '../../utils/api'
import { shortDay } from '../ui/GalleryCharts'

/* ─────────────────────────────────────────────────────────────────────────────
   GalleryStatsPanel — cütlüyün öz qalereya statistikası (Phase 43;
   UI redesign 2026-10: görünüş guest-photos/stats › StatsSheet)

   Qalereya səhifəsində «Statistika» düyməsi ilə açılır. Yalnız idarəetmə
   səlahiyyəti olan şəxs görür (`requireGalleryAccess` serverdə yoxlanılır —
   düymənin gizlədilməsi yalnız UI rahatlığıdır, təhlükəsizlik SERVERDƏDİR).

   ⚠ FOTO/VİDEO saylarının mənbəyi fayl sistemidir, baxış/QR/yükləmə isə
   jurnal cədvəlidir (bax gallery_analytics.php). Yəni jurnal boş olsa da
   media sayları DÜZGÜN qalır və panel «0 baxış, 43 foto» göstərir — bu,
   Phase 43-dən əvvəl yüklənmiş qalereyalarda normal vəziyyətdir.
   ⚠ Hər açılışda yenidən oxunur (köhnə davranış).
   ───────────────────────────────────────────────────────────────────────── */

const REACTION_NAMES = {
  '❤️': 'Bəyəndim', '😍': 'Çox gözəl', '👏': 'Alqış', '🎉': 'Təbriklər',
}

export default function GalleryStatsPanel({ slug, open, onClose }) {
  /* Hər açılış (və «Yenidən cəhd et») yeni sorğu açarıdır */
  const [nonce, setNonce] = useState(0)
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setNonce((n) => n + 1)
  }
  const key = open ? `${slug}:${nonce}` : null

  const [res, setRes] = useState({ key: null, data: null, error: '' })
  useEffect(() => {
    if (!key) return undefined
    let alive = true
    getGalleryAnalytics(slug, 30)
      .then((d) => { if (alive) setRes({ key, data: d, error: '' }) })
      .catch((e) => { if (alive) setRes({ key, data: null, error: e?.message || 'Statistika yüklənmədi.' }) })
    return () => { alive = false }
  }, [key, slug])

  const loading = !!key && res.key !== key
  const data = res.data

  const view = useMemo(() => {
    const t = data?.totals || {}
    /* Son 14 gün göstərilir: 30 sütun telefonda oxunmaz olur */
    const days = (data?.byDate || []).slice(-14)
    const hours = Array.from({ length: 24 }, () => 0)
    for (const h of data?.byHour || []) {
      if (h.hour >= 0 && h.hour < 24) hours[h.hour] = Number(h.count) || 0
    }
    return {
      totals: {
        views: t.visits, qrScans: t.qr_scans, uploads: t.uploads, photos: t.photos,
        videos: t.videos, featured: t.featured, reactions: t.reactions, slideshows: t.slideshows,
      },
      viewsByDay: days.map((d) => ({ label: shortDay(d.day), tooltipLabel: d.day, value: Number(d.visits) || 0 })),
      uploadsByDay: days.map((d) => ({ label: shortDay(d.day), tooltipLabel: d.day, value: Number(d.uploads) || 0 })),
      byHour: hours,
      reactions: Object.entries(data?.reactionByType || {}).map(([emoji, n]) => ({
        emoji, label: REACTION_NAMES[emoji] || emoji, count: Number(n) || 0,
      })),
    }
  }, [data])

  const state = loading ? 'loading' : res.error ? 'error' : 'ready'

  return (
    <StatsSheet
      open={open}
      onClose={onClose}
      state={state}
      onRetry={() => setNonce((n) => n + 1)}
      subtitle={`#${slug} · son 30 gün`}
      labels={{ error: res.error || 'Statistikanı yükləmək alınmadı.' }}
      {...view}
    />
  )
}
