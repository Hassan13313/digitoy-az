import { useEffect, useMemo, useState } from 'react'
import Lightbox from '../guest-photos/Lightbox'
import { downloadItem } from '../../utils/photoGallery'
import { useMediaReaction } from '../../hooks/useMediaReaction'

/* ══════════════════════════════════════════════════
   QALEREYA LIGHTBOX — tam ekran baxış + sürüşdürmə
   (UI redesign 2026-10: görünüş guest-photos/Lightbox-dadır)

   • barmaqla sola/sağa sürüşdürmə → növbəti / əvvəlki media,
     aşağı çəkmə → bağla; ← / → / Esc klaviatura ilə,
   • qonşu şəkillər əvvəlcədən yüklənir — keçid ani olur,
   • reaksiya: bir qonaq · bir media · bir reaksiya (useMediaReaction),
   • HD endirmə hamı üçün; seçilmiş et və sil yalnız idarəetmə linki ilə.

   ⚠ VİDEO: videoda sürüşdürmə söndürülüb — alt zolaq (sarıma) işləsin;
   keçid oxlarla olur. Siyahının sonunda dövr etmir.
══════════════════════════════════════════════════ */

const isVideoItem = (i) => i?.type?.startsWith('video/')

export default function GalleryLightbox({
  items, index, onIndex, slug, canManage, onClose, onReaction, onFeature, onDelete,
}) {
  const item = index >= 0 ? items[index] : null
  const { counts, mine, busy, react } = useMediaReaction(slug, item, onReaction)

  /* Endirmə vəziyyəti media üzrə — başqa şəklə keçəndə «Endirildi!» qalmır */
  const [dl, setDl] = useState({ id: null, state: 'idle' })
  useEffect(() => {
    if (dl.state !== 'done') return undefined
    const t = setTimeout(() => setDl({ id: null, state: 'idle' }), 2500)
    return () => clearTimeout(t)
  }, [dl])

  const view = useMemo(() => items.map((i) => ({
    id: i.id,
    type: isVideoItem(i) ? 'video' : 'image',
    src: i.url,
    poster: i.posterUrl || undefined,
    name: i.name,
    alt: i.name || '',
    featured: !!i.featured,
  })), [items])

  return (
    <Lightbox
      items={view}
      index={index}
      onIndex={onIndex}
      onClose={onClose}
      reactionCounts={counts}
      myReaction={mine}
      onReact={react}
      reactionsDisabled={busy}
      canManage={canManage}
      onFeature={canManage ? (v) => onFeature(v.id, !v.featured) : undefined}
      onDelete={canManage ? (v) => onDelete(v.id) : undefined}
      onDownload={(v) => {
        const src = items.find((i) => i.id === v.id)
        if (!src) return
        downloadItem(src)
        setDl({ id: v.id, state: 'done' })
      }}
      downloadState={dl.id === item?.id ? dl.state : 'idle'}
      labels={{ dialog: 'Media baxışı', reactions: 'Reaksiya ver', download: { idle: 'HD endir' } }}
    />
  )
}
