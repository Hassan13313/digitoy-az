import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, CheckSquare, Square, Download, Archive,
  ImagePlus, X, Check, RotateCcw, Film, ArrowLeft,
} from 'lucide-react'
import { getPhotos, deletePhoto } from '../../utils/api'
import { downloadAllAsZip, downloadItem } from '../../utils/photoGallery'

const PAGE_SIZE = 30

/* ── Lazy media cell ── */
function LazyMedia({ item, selected, onToggle, onDelete, onPreview }) {
  const ref = useRef()
  const [vis, setVis] = useState(false)
  const [hov, setHov] = useState(false)
  const isVideo = item.type?.startsWith('video/')

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { rootMargin: '200px' },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onPreview(item)}
      style={{
        position: 'relative', aspectRatio: '1', overflow: 'hidden',
        background: 'rgba(197,160,89,0.06)',
        border: `1px solid ${selected ? 'rgba(197,160,89,0.75)' : 'rgba(197,160,89,0.14)'}`,
        outline: selected ? '2px solid rgba(197,160,89,0.35)' : 'none',
        outlineOffset: 1, cursor: 'pointer', transition: 'border-color 0.15s',
      }}
    >
      {/* Skeleton */}
      {!vis && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(197,160,89,0.05) 25%, rgba(197,160,89,0.11) 50%, rgba(197,160,89,0.05) 75%)',
          backgroundSize: '200% 100%',
          animation: 'gp-skeleton 1.6s ease-in-out infinite',
        }} />
      )}

      {/* Media */}
      {vis && (isVideo ? (
        <div style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: 'rgba(20,16,10,0.88)',
        }}>
          <Film size={26} style={{ color: 'rgba(197,160,89,0.7)' }} strokeWidth={1} />
        </div>
      ) : (
        <img
          src={item.thumbUrl || item.url} alt={item.name}
          loading="lazy" decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ))}

      {/* Hover overlay */}
      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.13 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
              padding: 6, gap: 4,
            }}
          >
            <button
              onClick={() => onDelete(item.id)}
              style={{
                width: 30, height: 30, borderRadius: 2,
                background: 'rgba(170,35,35,0.88)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Trash2 size={13} color="white" strokeWidth={2} />
            </button>
            <button
              onClick={() => downloadItem(item)}
              style={{
                width: 30, height: 30, borderRadius: 2,
                background: 'rgba(197,160,89,0.9)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Download size={13} color="white" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkbox */}
      <div
        onClick={e => { e.stopPropagation(); onToggle(item.id) }}
        style={{
          position: 'absolute', top: 6, left: 6,
          opacity: selected || hov ? 1 : 0,
          transition: 'opacity 0.14s',
        }}
      >
        {selected
          ? <CheckSquare size={20} style={{ color: 'rgba(197,160,89,1)', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.55))' }} strokeWidth={2} />
          : <Square size={20} style={{ color: 'rgba(255,255,255,0.88)', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.55))' }} strokeWidth={1.5} />
        }
      </div>
    </div>
  )
}

/* ── Lightbox ── */
function Lightbox({ item, onClose }) {
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <motion.div
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
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Media */}
        {item.type?.startsWith('video/') ? (
          <video
            src={item.url} controls autoPlay
            style={{
              maxWidth: '90vw', maxHeight: '82vh', display: 'block',
              border: '1px solid rgba(197,160,89,0.18)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
          />
        ) : (
          <img
            src={item.url} alt={item.name}
            style={{
              maxWidth: '90vw', maxHeight: '82vh', objectFit: 'contain', display: 'block',
              border: '1px solid rgba(197,160,89,0.18)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
          />
        )}

        {/* Premium close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -18, right: -18,
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

        {/* File name caption */}
        {item.name && (
          <p style={{
            position: 'absolute', bottom: -30, left: 0, right: 0, textAlign: 'center',
            fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(197,160,89,0.45)',
            fontFamily: '"Inter",system-ui,sans-serif',
          }}>
            {item.name}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ── Toolbar button ── */
function Btn({ children, danger, disabled, onClick, style: extraStyle = {} }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '9px 16px',
        border: `1px solid ${danger ? 'rgba(180,40,40,0.32)' : 'rgba(197,160,89,0.32)'}`,
        background: danger ? 'rgba(180,40,40,0.07)' : 'rgba(197,160,89,0.07)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: danger ? 'rgba(170,35,35,0.9)' : 'rgba(197,160,89,0.95)',
        fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 600,
        transition: 'background 0.15s, border-color 0.15s',
        whiteSpace: 'nowrap',
        ...extraStyle,
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.background = danger ? 'rgba(180,40,40,0.13)' : 'rgba(197,160,89,0.13)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.background = danger ? 'rgba(180,40,40,0.07)' : 'rgba(197,160,89,0.07)')}
    >
      {children}
    </button>
  )
}

/* ══════════════════════════════════════════════════
   GalleryPage — tam müstəqil qalereya səhifəsi
   Route: /invite/:slug/qalereya-idare
══════════════════════════════════════════════════ */
export default function GalleryPage() {
  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || 'preview'

  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [preview,  setPreview]  = useState(null)
  const [page,     setPage]     = useState(1)
  const [zipState, setZipState] = useState('idle')
  const [delConfirm, setDelConfirm] = useState(false)
  const sentinelRef = useRef()

  /* Serverdən yüklə */
  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const photos = await getPhotos(slug)
      setItems(photos)
    } catch { /* server əlçatmaz */ }
    finally { setLoading(false) }
  }, [slug])

  useEffect(() => { fetchItems() }, [fetchItems])

  /* 30 saniyədə bir avtomatik yeniləmə — real-time sinxronizasiya */
  useEffect(() => {
    const timer = setInterval(fetchItems, 30000)
    return () => clearInterval(timer)
  }, [fetchItems])

  /* Infinite scroll sentinel */
  useEffect(() => {
    if (!sentinelRef.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setPage(p => p + 1) },
      { rootMargin: '300px' },
    )
    obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [items.length])

  const visibleItems = items.slice(0, page * PAGE_SIZE)
  const hasMore      = visibleItems.length < items.length

  const toggleSelect = useCallback((id) => {
    setSelected(s => {
      const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n
    })
  }, [])

  const selectAll = () => setSelected(new Set(items.map(i => i.id)))
  const clearSel  = () => setSelected(new Set())
  const allSelected = items.length > 0 && selected.size === items.length

  const handleDelete = useCallback(async (id) => {
    try { await deletePhoto(slug, id) } catch {}
    setItems(prev => prev.filter(i => i.id !== id))
    setSelected(s => { const n = new Set(s); n.delete(id); return n })
  }, [slug])

  const handleDeleteSelected = async () => {
    const ids = Array.from(selected)
    await Promise.allSettled(ids.map(id => deletePhoto(slug, id)))
    const idSet = new Set(ids)
    setItems(prev => prev.filter(i => !idSet.has(i.id)))
    setSelected(new Set())
    setDelConfirm(false)
  }

  const handleZip = async () => {
    const targets = selected.size > 0 ? items.filter(i => selected.has(i.id)) : items
    if (!targets.length) return
    setZipState('loading')
    try {
      await downloadAllAsZip(targets, slug)
      setZipState('done')
      setTimeout(() => setZipState('idle'), 3500)
    } catch {
      setZipState('error')
      setTimeout(() => setZipState('idle'), 3000)
    }
  }

  const goBack = () => {
    const base = `/invite/${slug}`
    window.history.pushState({}, '', base)
    window.location.assign(base)
  }

  const CARD = {
    border: '1px solid rgba(197,160,89,0.18)',
    background: 'linear-gradient(150deg, #FDFAF4 0%, #F8F3E8 100%)',
  }

  return (
    <div className="min-h-screen bg-cream" style={{ fontFamily: '"Inter",system-ui,sans-serif' }}>

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 35% at 50% 15%, rgba(197,160,89,0.07) 0%, transparent 65%)',
      }} />

      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(253,250,244,0.92)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(197,160,89,0.18)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 24px',
          height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={goBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(140,123,107,0.75)', background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px 0', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(197,160,89,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(140,123,107,0.75)'}
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Geri
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 17, fontWeight: 300, color: '#1C1610', lineHeight: 1 }}>
              Qonaq Şəkilləri
            </p>
            <p style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(197,160,89,0.75)', marginTop: 3 }}>
              #{slug}
            </p>
          </div>

          <div style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(140,123,107,0.5)' }}>
            {loading ? '…' : `${items.length} media`}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Toolbar */}
        <div style={{
          ...CARD,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10,
          position: 'relative',
        }}>
          {/* Üst ornament xətti */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55) 40%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.55) 60%, transparent)',
          }} />

          {/* Sol: say + seçim + yenilə */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(140,123,107,0.65)' }}>
              {loading ? 'Yüklənir…' : `${items.length} fayl`}
              {selected.size > 0 && <span style={{ color: 'rgba(197,160,89,0.9)' }}> · {selected.size} seçildi</span>}
            </span>
            <Btn onClick={fetchItems} disabled={loading}>
              <RotateCcw size={11} strokeWidth={1.5} />
              Yenilə
            </Btn>
            {items.length > 0 && (
              <Btn onClick={allSelected ? clearSel : selectAll}>
                {allSelected
                  ? <><RotateCcw size={11} strokeWidth={1.5} /> Seçimi Sıfırla</>
                  : <><CheckSquare size={11} strokeWidth={1.5} /> Hamısını Seç</>
                }
              </Btn>
            )}
          </div>

          {/* Sağ: əməliyyatlar */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {selected.size > 0 && !delConfirm && (
              <Btn danger onClick={() => setDelConfirm(true)}>
                <Trash2 size={11} strokeWidth={1.5} />
                Seçilənləri Sil ({selected.size})
              </Btn>
            )}

            {delConfirm && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, color: 'rgba(170,35,35,0.8)', letterSpacing: '0.12em' }}>
                  {selected.size} fayl silinəcək — əminsiniz?
                </span>
                <Btn danger onClick={handleDeleteSelected}>
                  <Check size={11} strokeWidth={2} /> Bəli, Sil
                </Btn>
                <Btn onClick={() => setDelConfirm(false)}>
                  <X size={11} strokeWidth={2} /> Ləğv et
                </Btn>
              </div>
            )}

            {items.length > 0 && (
              <Btn
                onClick={handleZip}
                disabled={zipState === 'loading'}
                style={{ minWidth: 190 }}
              >
                {zipState === 'done'   ? <><Check size={11} strokeWidth={2} /> Endirildi!</> :
                 zipState === 'error'  ? <><X size={11} strokeWidth={2} /> Xəta baş verdi</> :
                 zipState === 'loading' ? <><Archive size={11} strokeWidth={1.5} /> ZIP Hazırlanır…</> :
                 <><Archive size={11} strokeWidth={1.5} />
                   {selected.size > 0 ? `${selected.size} Faylı .ZIP Endir` : 'Bütün Şəkilləri .ZIP Endir'}
                 </>}
              </Btn>
            )}
          </div>
        </div>

        {/* Boş vəziyyət */}
        {items.length === 0 && (
          <div style={{
            padding: '72px 24px', textAlign: 'center',
            border: '1px dashed rgba(197,160,89,0.22)',
            background: 'rgba(197,160,89,0.03)',
          }}>
            <div style={{
              width: 56, height: 56, margin: '0 auto 18px',
              border: '1px solid rgba(197,160,89,0.28)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ImagePlus size={22} strokeWidth={1} style={{ color: 'rgba(197,160,89,0.5)' }} />
            </div>
            <p style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 20, fontWeight: 300, color: 'rgba(80,68,58,0.6)', marginBottom: 8,
            }}>
              Hələ şəkil yüklənməyib
            </p>
            <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(140,123,107,0.45)' }}>
              Qonaqlar QR kodu skanerləyərək şəkil göndərəcəklər
            </p>
          </div>
        )}

        {/* Media grid */}
        {items.length > 0 && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 8,
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

            {hasMore && (
              <div ref={sentinelRef} style={{
                height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12,
              }}>
                <span style={{ fontSize: 9, color: 'rgba(197,160,89,0.45)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                  Daha çox yüklənir…
                </span>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {preview && <Lightbox item={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>

      <style>{`
        @keyframes gp-skeleton {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  )
}
