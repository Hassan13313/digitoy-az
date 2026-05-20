/* ══════════════════════════════════════════════════
   GALLERY MANAGER
   Admin: select, delete, zip-download, QR
   Guest: upload only (via PhotoShare)
   100+ media — lazy load, no freeze
══════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, CheckSquare, Square, Download, Archive,
  ImagePlus, ZoomIn, X, Check, RotateCcw, Film,
} from 'lucide-react'
import {
  loadGallery, deleteMedia, deleteMultiple, downloadAllAsZip, downloadItem,
} from '../../utils/photoGallery'

/* ── Lazy image — loads only when in viewport ── */
function LazyMedia({ item, selected, onToggle, onDelete, onPreview }) {
  const ref       = useRef()
  const [vis, setVis] = useState(false)
  const [hov, setHov] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { rootMargin: '200px' },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const isVideo = item.type?.startsWith('video/')

  return (
    <div
      ref={ref}
      style={{
        position: 'relative', aspectRatio: '1', overflow: 'hidden',
        background: 'rgba(197,160,89,0.06)',
        border: `1px solid ${selected ? 'rgba(197,160,89,0.7)' : 'rgba(197,160,89,0.12)'}`,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        outline: selected ? '2px solid rgba(197,160,89,0.4)' : 'none',
        outlineOffset: 1,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onPreview(item)}
    >
      {/* Thumbnail */}
      {vis && (
        isVideo ? (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(20,16,10,0.85)',
          }}>
            <Film size={24} style={{ color: 'rgba(197,160,89,0.7)' }} strokeWidth={1} />
          </div>
        ) : (
          <img
            src={item.thumbUrl || item.url}
            alt={item.name}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )
      )}

      {/* Skeleton while not visible */}
      {!vis && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(197,160,89,0.06) 25%, rgba(197,160,89,0.12) 50%, rgba(197,160,89,0.06) 75%)',
          backgroundSize: '200% 100%',
          animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
        }} />
      )}

      {/* Hover overlay */}
      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
              padding: 6, gap: 4,
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => onDelete(item.id)}
              style={{
                width: 28, height: 28, borderRadius: 2,
                background: 'rgba(180,40,40,0.85)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Trash2 size={12} color="white" strokeWidth={2} />
            </button>
            <button
              onClick={() => downloadItem(item)}
              style={{
                width: 28, height: 28, borderRadius: 2,
                background: 'rgba(197,160,89,0.85)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Download size={12} color="white" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkbox */}
      <div
        onClick={e => { e.stopPropagation(); onToggle(item.id) }}
        style={{
          position: 'absolute', top: 5, left: 5,
          opacity: selected || hov ? 1 : 0,
          transition: 'opacity 0.15s',
        }}
      >
        {selected
          ? <CheckSquare size={18} style={{ color: 'rgba(197,160,89,1)', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }} strokeWidth={2} />
          : <Square      size={18} style={{ color: 'rgba(255,255,255,0.85)', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }} strokeWidth={1.5} />
        }
      </div>
    </div>
  )
}

/* ── Lightbox ── */
function Lightbox({ item, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,8,5,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {item.type?.startsWith('video/') ? (
          <video src={item.url} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'block' }} />
        ) : (
          <img src={item.url} alt={item.name} style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'block', objectFit: 'contain' }} />
        )}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -14, right: -14,
            width: 32, height: 32,
            background: 'rgba(197,160,89,0.9)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 2,
          }}
        >
          <X size={15} color="white" strokeWidth={2} />
        </button>
        <p style={{
          position: 'absolute', bottom: -28, left: 0, right: 0, textAlign: 'center',
          fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)',
          fontFamily: '"Inter",system-ui,sans-serif',
        }}>
          {item.name}
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div style={{
      padding: '48px 24px', textAlign: 'center',
      border: '1px dashed rgba(197,160,89,0.22)',
      background: 'rgba(197,160,89,0.03)',
    }}>
      <div style={{
        width: 48, height: 48, margin: '0 auto 16px',
        border: '1px solid rgba(197,160,89,0.25)', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ImagePlus size={20} strokeWidth={1} style={{ color: 'rgba(197,160,89,0.5)' }} />
      </div>
      <p style={{
        fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
        fontSize: 16, fontWeight: 300, color: 'rgba(80,68,58,0.6)', marginBottom: 6,
      }}>
        Hələ şəkil yüklənməyib
      </p>
      <p style={{
        fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(140,123,107,0.5)', fontFamily: '"Inter",system-ui,sans-serif',
      }}>
        Qonaqlar QR kodu skanerləyərək şəkil göndərəcəklər
      </p>
    </div>
  )
}

/* PAGE_SIZE — items to show per batch */
const PAGE_SIZE = 30

export default function GalleryManager({ slug, onRefresh }) {
  const [items,     setItems]     = useState(() => loadGallery(slug))
  const [selected,  setSelected]  = useState(new Set())
  const [preview,   setPreview]   = useState(null)
  const [page,      setPage]      = useState(1)
  const [zipState,  setZipState]  = useState('idle') // idle | loading | done
  const loadMoreRef = useRef()

  /* Reload when slug changes */
  useEffect(() => {
    setItems(loadGallery(slug))
    setSelected(new Set())
    setPage(1)
  }, [slug])

  /* Infinite scroll sentinel */
  useEffect(() => {
    if (!loadMoreRef.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setPage(p => p + 1)
    }, { rootMargin: '300px' })
    obs.observe(loadMoreRef.current)
    return () => obs.disconnect()
  }, [items.length])

  const visibleItems = items.slice(0, page * PAGE_SIZE)
  const hasMore      = visibleItems.length < items.length

  const toggleSelect = useCallback((id) => {
    setSelected(s => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }, [])

  const selectAll = () => setSelected(new Set(items.map(i => i.id)))
  const clearSel  = () => setSelected(new Set())

  const handleDelete = useCallback((id) => {
    const next = deleteMedia(slug, id)
    setItems(next)
    setSelected(s => { const n = new Set(s); n.delete(id); return n })
  }, [slug])

  const handleDeleteSelected = () => {
    const ids  = Array.from(selected)
    const next = deleteMultiple(slug, ids)
    setItems(next)
    setSelected(new Set())
  }

  const handleZipDownload = async () => {
    const targets = selected.size > 0
      ? items.filter(i => selected.has(i.id))
      : items
    if (!targets.length) return
    setZipState('loading')
    await downloadAllAsZip(targets, slug)
    setZipState('done')
    setTimeout(() => setZipState('idle'), 3000)
  }

  const allSelected = items.length > 0 && selected.size === items.length

  const BTN = (props) => (
    <button
      type="button"
      {...props}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 14px',
        border: '1px solid rgba(197,160,89,0.28)',
        background: props.danger ? 'rgba(180,40,40,0.07)' : 'rgba(197,160,89,0.06)',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.4 : 1,
        fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: props.danger ? 'rgba(180,40,40,0.85)' : 'rgba(197,160,89,0.9)',
        fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500,
        transition: 'background 0.15s',
        ...props.style,
      }}
      onMouseEnter={e => !props.disabled && (e.currentTarget.style.background = props.danger ? 'rgba(180,40,40,0.13)' : 'rgba(197,160,89,0.12)')}
      onMouseLeave={e => (e.currentTarget.style.background = props.danger ? 'rgba(180,40,40,0.07)' : 'rgba(197,160,89,0.06)')}
    >
      {props.children}
    </button>
  )

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
        padding: '12px 0 14px',
        borderBottom: '1px solid rgba(197,160,89,0.14)',
        marginBottom: 12,
      }}>
        {/* Left: count + select all */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(140,123,107,0.7)', fontFamily: '"Inter",system-ui,sans-serif',
          }}>
            {items.length} media
            {selected.size > 0 && ` · ${selected.size} seçildi`}
          </span>
          {items.length > 0 && (
            <BTN onClick={allSelected ? clearSel : selectAll}>
              {allSelected
                ? <><RotateCcw size={11} strokeWidth={1.5} /> Seçimi Sıfırla</>
                : <><CheckSquare size={11} strokeWidth={1.5} /> Hamısını Seç</>
              }
            </BTN>
          )}
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {selected.size > 0 && (
            <BTN danger onClick={handleDeleteSelected}>
              <Trash2 size={11} strokeWidth={1.5} />
              Seçilənləri Sil ({selected.size})
            </BTN>
          )}
          {items.length > 0 && (
            <BTN onClick={handleZipDownload} disabled={zipState === 'loading'}>
              {zipState === 'done'
                ? <><Check size={11} strokeWidth={2} /> Tamamlandı</>
                : zipState === 'loading'
                ? <><Archive size={11} strokeWidth={1.5} /> Hazırlanır…</>
                : <><Archive size={11} strokeWidth={1.5} />
                    {selected.size > 0 ? `${selected.size} Faylı Endir` : 'Hamısını .ZIP Endir'}
                  </>
              }
            </BTN>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: 6,
          }}>
            {visibleItems.map(item => (
              <LazyMedia
                key={item.id}
                item={item}
                selected={selected.has(item.id)}
                onToggle={toggleSelect}
                onDelete={handleDelete}
                onPreview={setPreview}
              />
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          {hasMore && (
            <div ref={loadMoreRef} style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 9, color: 'rgba(197,160,89,0.5)', letterSpacing: '0.2em', fontFamily: '"Inter",system-ui,sans-serif' }}>
                Daha çox yüklənir…
              </span>
            </div>
          )}
        </>
      )}

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {preview && <Lightbox item={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>

      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  )
}
