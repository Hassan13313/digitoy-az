import { useEffect } from 'react'
import { motion, AnimatePresence, useDragControls, useReducedMotion } from 'framer-motion'
import { X, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactionBar from './ReactionBar'

/* ══════════════════════════════════════════════════
   QALEREYA LIGHTBOX — tam ekran baxış + sürüşdürmə (2026-09-28)

   Əvvəl lightbox tək media göstərirdi: növbəti şəklə keçmək üçün qonaq
   bağlayıb başqa xanaya toxunmalı idi. İndi:
     • barmaqla sola/sağa sürüşdürmə → növbəti / əvvəlki media,
     • ← / → düymələri (klaviatura və ekrandakı oxlar),
     • qonşu şəkillər əvvəlcədən yüklənir — keçid ani olur.

   ⚠ VİDEO İDARƏETMƏSİ: videonun alt zolağı (irəli-geri sarıma) da üfüqi
   hərəkətdir. Barmaq həmin zolaqda başlasa sürüşdürmə BAŞLAMIR — sarıma
   işləyir. Ona görə drag avtomatik yox, `dragControls` ilə əl ilə başladılır.
   ⚠ Siyahının sonunda dövr etmir: son mediada «növbəti» oxu görünmür.
══════════════════════════════════════════════════ */

const SWIPE_DISTANCE = 60     /* px — bundan qısa hərəkət yerinə qayıdır */
const SWIPE_VELOCITY = 420    /* px/s — qısa, amma sürətli fırlatma da keçir */
const VIDEO_CONTROLS_ZONE = 64 /* px — videonun alt zolağı sürüşdürməyə verilmir */

const navBtn = (side) => ({
  position: 'fixed', top: '50%', [side]: 'max(8px, env(safe-area-inset-' + side + '))',
  transform: 'translateY(-50%)', zIndex: 2,
  width: 44, height: 44, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(20,16,10,0.55)', border: '1px solid rgba(197,160,89,0.4)',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
  color: 'rgba(222,196,146,1)', cursor: 'pointer',
})

export default function GalleryLightbox({
  item, index, total, dir = 0, prevItem, nextItem,
  slug, canManage, onClose, onPrev, onNext, onReaction, onFeature,
}) {
  const dragControls = useDragControls()
  const reduceMotion = useReducedMotion()
  const isVideo = item.type?.startsWith('video/')
  const hasPrev = !!prevItem
  const hasNext = !!nextItem

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      else if (e.key === 'ArrowRight' && hasNext) onNext()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  /* Qonşu ŞƏKİLLƏRİ əvvəlcədən yüklə (video yox — ağırdır) */
  useEffect(() => {
    for (const n of [prevItem, nextItem]) {
      if (n && !n.type?.startsWith('video/') && n.url) {
        const img = new Image()
        img.decoding = 'async'
        img.src = n.url
      }
    }
  }, [prevItem, nextItem])

  const startDrag = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (isVideo && e.target instanceof HTMLVideoElement) {
      const r = e.target.getBoundingClientRect()
      if (e.clientY > r.bottom - VIDEO_CONTROLS_ZONE) return
    }
    dragControls.start(e)
  }

  const onDragEnd = (_, info) => {
    const { offset, velocity } = info
    if ((offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) && hasNext) onNext()
    else if ((offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) && hasPrev) onPrev()
  }

  const shift = reduceMotion ? 0 : 70
  const slide = {
    enter:  (d) => ({ x: d > 0 ? shift : d < 0 ? -shift : 0, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d) => ({ x: d > 0 ? -shift : d < 0 ? shift : 0, opacity: 0 }),
  }

  const mediaStyle = {
    maxWidth: '90vw', maxHeight: '72vh', display: 'block',
    border: '1px solid rgba(197,160,89,0.18)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
    userSelect: 'none', WebkitUserSelect: 'none',
  }

  return (
    <motion.div
      role="dialog" aria-modal="true" aria-label="Media baxışı"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(6,4,2,0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={onClose}
    >
      {hasPrev && (
        <button type="button" aria-label="Əvvəlki" style={navBtn('left')}
          onClick={(e) => { e.stopPropagation(); onPrev() }}>
          <ChevronLeft size={22} strokeWidth={1.6} />
        </button>
      )}
      {hasNext && (
        <button type="button" aria-label="Növbəti" style={navBtn('right')}
          onClick={(e) => { e.stopPropagation(); onNext() }}>
          <ChevronRight size={22} strokeWidth={1.6} />
        </button>
      )}

      <motion.div
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Media — sürüşdürülən hissə */}
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={item.id}
            custom={dir}
            variants={slide}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: reduceMotion ? 0.12 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            drag={total > 1 ? 'x' : false}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.55}
            onDragEnd={onDragEnd}
            onPointerDown={total > 1 ? startDrag : undefined}
            /* Şaquli sürüşdürmə səhifəyə qalır, üfüqi — bizə */
            style={{ touchAction: 'pan-y', cursor: total > 1 ? 'grab' : 'default' }}
          >
            {isVideo ? (
              <video
                src={item.url} controls autoPlay playsInline
                poster={item.posterUrl || undefined}
                preload="metadata"
                style={mediaStyle}
              />
            ) : (
              <img src={item.url} alt={item.name} draggable={false} style={{ ...mediaStyle, objectFit: 'contain' }} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Reaksiyalar (Phase 43) ── qonaq reaksiyanı burada verir */}
        <div style={{
          marginTop: 14, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <ReactionBar slug={slug} item={item} onChange={onReaction} size="lg" />

          {canManage && (
            <button
              type="button"
              data-press
              onClick={() => onFeature(item.id, !item.featured)}
              aria-pressed={!!item.featured}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                minHeight: 38, padding: '0 14px', borderRadius: 999,
                border: `1px solid ${item.featured ? 'rgba(197,160,89,0.85)' : 'rgba(197,160,89,0.3)'}`,
                background: item.featured ? 'rgba(197,160,89,0.2)' : 'rgba(255,255,255,0.05)',
                cursor: 'pointer',
                fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
                fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 600,
                color: 'rgba(222,196,146,1)',
              }}
            >
              <Star size={12} strokeWidth={2} fill={item.featured ? 'currentColor' : 'none'} />
              {item.featured ? 'Seçilmiş' : 'Seçilmiş et'}
            </button>
          )}
        </div>

        {/* Bağla */}
        <button
          onClick={onClose}
          aria-label="Bağla"
          style={{
            position: 'absolute', top: -18, right: -18, zIndex: 3,
            width: 36, height: 36,
            background: 'rgba(197,160,89,0.15)',
            border: '1px solid rgba(197,160,89,0.45)',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.18s, border-color 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.32)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.75)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.15)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.45)' }}
        >
          <X size={15} color="rgba(197,160,89,1)" strokeWidth={2} />
        </button>

        {/* Mövqe + fayl adı */}
        <p style={{
          marginTop: 10, textAlign: 'center',
          fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(197,160,89,0.55)',
          fontFamily: '"Inter",system-ui,sans-serif',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {total > 1 && <span style={{ color: 'rgba(222,196,146,0.85)' }}>{index + 1} / {total}</span>}
          {total > 1 && item.name && <span aria-hidden="true">{'  ·  '}</span>}
          {item.name}
        </p>
      </motion.div>
    </motion.div>
  )
}
