import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  X, Eye, QrCode, Upload, Image as ImageIcon, Film, Star, Heart, Loader2, MonitorPlay,
} from 'lucide-react'
import { getGalleryAnalytics } from '../../utils/api'
import { StatTile, BarChart, BarRow, shortDay, hourLabel } from '../ui/GalleryCharts'

/* ─────────────────────────────────────────────────────────────────────────────
   GalleryStatsPanel — cütlüyün öz qalereya statistikası (Phase 43)

   Qalereya səhifəsində «Statistika» düyməsi ilə açılır. Yalnız idarəetmə
   səlahiyyəti olan şəxs görür (`requireGalleryAccess` serverdə yoxlanılır —
   düymənin gizlədilməsi yalnız UI rahatlığıdır, təhlükəsizlik SERVERDƏDİR).

   ⚠ FOTO/VİDEO saylarının mənbəyi fayl sistemidir, baxış/QR/yükləmə isə
   jurnal cədvəlidir (bax gallery_analytics.php). Yəni jurnal boş olsa da
   media sayları DÜZGÜN qalır və panel «0 baxış, 43 foto» göstərir — bu,
   Phase 43-dən əvvəl yüklənmiş qalereyalarda normal vəziyyətdir.
   ───────────────────────────────────────────────────────────────────────── */

const REACTION_NAMES = {
  '❤️': 'Bəyəndim', '😍': 'Çox gözəl', '👏': 'Alqış', '🎉': 'Təbriklər',
}

export default function GalleryStatsPanel({ slug, onClose }) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    let alive = true
    getGalleryAnalytics(slug, 30)
      .then(d => { if (alive) { setData(d); setLoading(false) } })
      .catch(e => {
        if (!alive) return
        setError(e?.message || 'Statistika yüklənmədi.')
        setLoading(false)
      })
    return () => { alive = false }
  }, [slug])

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const t = data?.totals || {}
  const reactions = data?.reactionByType || {}
  const reactionMax = Math.max(...Object.values(reactions).map(Number), 1)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(12,9,6,0.62)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 'clamp(12px, 4vw, 40px)', overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Qalereya statistikası"
        style={{
          width: '100%', maxWidth: 720,
          background: '#FDFAF4', border: '1px solid rgba(197,160,89,0.3)',
          padding: 'clamp(18px, 5vw, 28px)',
          fontFamily: '"Inter",system-ui,sans-serif',
        }}
      >
        {/* Başlıq */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 14, marginBottom: 20,
        }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 'clamp(19px, 5vw, 24px)', fontWeight: 300,
              color: '#1C1610', margin: 0,
            }}>
              Qalereya Statistikası
            </h2>
            <p style={{
              fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(197,160,89,0.8)', marginTop: 4,
            }}>
              #{slug} · son 30 gün
            </p>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Bağla"
            style={{
              width: 34, height: 34, flexShrink: 0,
              background: 'rgba(197,160,89,0.1)',
              border: '1px solid rgba(197,160,89,0.35)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} strokeWidth={2} style={{ color: 'rgba(150,118,54,1)' }} />
          </button>
        </div>

        {loading && (
          <div style={{ padding: '44px 0', display: 'flex', justifyContent: 'center' }}>
            <Loader2 size={20} strokeWidth={1.6} className="gs-spin" style={{ color: 'rgba(197,160,89,0.8)' }} />
          </div>
        )}

        {error && !loading && (
          <p role="alert" style={{
            padding: '12px 16px', border: '1px solid rgba(170,35,35,0.35)',
            background: 'rgba(170,35,35,0.05)', fontSize: 12, lineHeight: 1.6,
            color: 'rgba(140,28,28,0.95)',
          }}>
            {error}
          </p>
        )}

        {data && !loading && (
          <>
            {/* Əsas göstəricilər */}
            <div style={{
              display: 'grid', gap: 10, marginBottom: 18,
              gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))',
            }}>
              <StatTile icon={Eye}       label="Baxış"        value={t.visits}   compact tone="oklch(50% 0.09 250)" />
              <StatTile icon={QrCode}    label="QR skan"      value={t.qr_scans} compact tone="oklch(50% 0.1 300)" />
              <StatTile icon={Upload}    label="Yükləmə"      value={t.uploads}  compact tone="oklch(48% 0.11 145)" />
              <StatTile icon={ImageIcon} label="Foto"         value={t.photos}   compact />
              <StatTile icon={Film}      label="Video"        value={t.videos}   compact tone="oklch(50% 0.1 20)" />
              <StatTile icon={Star}      label="Seçilmiş"     value={t.featured} compact />
              <StatTile icon={Heart}     label="Reaksiya"     value={t.reactions} compact tone="oklch(52% 0.13 15)" />
              <StatTile icon={MonitorPlay} label="Slayd şou"  value={t.slideshows} compact tone="oklch(45% 0.05 60)" />
            </div>

            {/* Tarix üzrə aktivlik */}
            <div style={{
              background: 'white', border: '1px solid oklch(88% 0.02 60)',
              borderRadius: 6, padding: '16px 18px', marginBottom: 12,
            }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'oklch(50% 0.03 60)', marginBottom: 6,
              }}>
                Gün üzrə baxış
              </div>
              <BarChart
                ariaLabel="Son 30 günün gündəlik baxış sayı"
                /* Son 14 gün göstərilir: 30 xana telefonda oxunmaz olur */
                data={(data.byDate || []).slice(-14).map(d => ({
                  label: shortDay(d.day),
                  value: d.visits,
                  title: `${d.day}: ${d.visits} baxış, ${d.uploads} yükləmə`,
                }))}
                tone="oklch(58% 0.09 250)"
              />
            </div>

            <div style={{
              background: 'white', border: '1px solid oklch(88% 0.02 60)',
              borderRadius: 6, padding: '16px 18px', marginBottom: 12,
            }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'oklch(50% 0.03 60)', marginBottom: 6,
              }}>
                Gün üzrə yükləmə
              </div>
              <BarChart
                ariaLabel="Son 30 günün gündəlik yükləmə sayı"
                data={(data.byDate || []).slice(-14).map(d => ({
                  label: shortDay(d.day),
                  value: d.uploads,
                  title: `${d.day}: ${d.uploads} yükləmə`,
                }))}
                tone="oklch(56% 0.1 145)"
              />
            </div>

            {/* Saat üzrə — toyun pik saatı */}
            <div style={{
              background: 'white', border: '1px solid oklch(88% 0.02 60)',
              borderRadius: 6, padding: '16px 18px', marginBottom: 12,
            }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'oklch(50% 0.03 60)', marginBottom: 6,
              }}>
                Saat üzrə aktivlik
              </div>
              <BarChart
                ariaLabel="Sutkanın saatları üzrə aktivlik"
                data={(data.byHour || []).map(h => ({
                  label: hourLabel(h.hour),
                  value: h.count,
                  title: `${String(h.hour).padStart(2, '0')}:00 — ${h.count} hadisə`,
                }))}
                height={70}
              />
            </div>

            {/* Reaksiya bölgüsü */}
            <div style={{
              background: 'white', border: '1px solid oklch(88% 0.02 60)',
              borderRadius: 6, padding: '16px 18px',
            }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'oklch(50% 0.03 60)', marginBottom: 14,
              }}>
                Reaksiyalar
              </div>
              {Object.keys(reactions).length > 0
                ? Object.entries(reactions)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emoji, n]) => (
                      <BarRow
                        key={emoji}
                        emoji={emoji}
                        label={REACTION_NAMES[emoji] || emoji}
                        value={n}
                        max={reactionMax}
                        tone="oklch(58% 0.12 15)"
                      />
                    ))
                : <p style={{ fontSize: 12, color: 'oklch(65% 0.03 60)' }}>Hələ reaksiya yoxdur.</p>
              }
            </div>
          </>
        )}

        <style>{`
          .gs-spin { animation: gs-rot 0.9s linear infinite; }
          @keyframes gs-rot { to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) { .gs-spin { animation: none; } }
        `}</style>
      </motion.div>
    </motion.div>
  )
}
