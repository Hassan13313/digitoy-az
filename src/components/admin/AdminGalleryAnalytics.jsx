import { useState, useEffect, useCallback } from 'react'
import {
  Eye, QrCode, Upload, Heart, Star, MonitorPlay, RefreshCw, Images,
} from 'lucide-react'
import { getGalleryAnalytics } from '../../utils/api'
import { StatTile, BarChart, BarRow, shortDay, hourLabel } from '../ui/GalleryCharts'
import { useIsNarrow } from '../../hooks/useIsNarrow'

/* ─────────────────────────────────────────────────────────────────────────────
   AdminGalleryAnalytics — dashboard-un qalereya bölməsi (Phase 43)

   Bütün toylar üzrə ümumi mənzərə: baxış, QR skan, yükləmə, reaksiya +
   son 14 günün trendi, saat üzrə paylanma və ən aktiv qalereyalar.

   ⚠ XƏTA DASHBOARD-U SINDIRMIR: endpoint əlçatmazdırsa (köhnə backend və ya
   jurnal cədvəli hələ yaranmayıb) bölmə yalnız qısa izah göstərir — sifariş
   statistikası olduğu kimi işləməyə davam edir.
   ───────────────────────────────────────────────────────────────────────── */

const CARD = {
  background: 'white', border: '1px solid oklch(88% 0.02 60)',
  borderRadius: 6, padding: '18px 20px',
}
const HEAD = {
  fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'oklch(50% 0.03 60)', marginBottom: 12,
}

export default function AdminGalleryAnalytics({ onOpenAlbum }) {
  const narrow = useIsNarrow()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    getGalleryAnalytics(null)
      .then(d => setData(d))
      .catch(() => setError('Qalereya analitikası yüklənmədi.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const g = data?.global || {}
  const albums = data?.topAlbums || []
  const albumMax = Math.max(...albums.map(a => a.visits), 1)

  return (
    <section style={{ marginTop: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 14, flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif',
            fontSize: 19, fontWeight: 300, color: 'oklch(22% 0.02 60)', margin: 0,
          }}>
            Qalereya Analitikası
          </h2>
          <p style={{ fontSize: 11.5, color: 'oklch(55% 0.03 60)', margin: '3px 0 0' }}>
            Bütün toylar üzrə — baxış, QR skan, yükləmə
          </p>
        </div>
        <button
          type="button" onClick={load}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            background: 'white', border: '1px solid oklch(85% 0.02 60)', borderRadius: 4,
            cursor: 'pointer', fontSize: 11, color: 'oklch(45% 0.03 60)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}
        >
          <RefreshCw size={12} strokeWidth={1.5} style={{ animation: loading ? 'aga-rot 1s linear infinite' : 'none' }} />
          Yenilə
        </button>
      </div>

      {error && (
        <div style={{
          ...CARD, fontSize: 12, lineHeight: 1.7, color: 'oklch(48% 0.04 60)',
        }}>
          {error}
          <span style={{ display: 'block', marginTop: 6, color: 'oklch(60% 0.03 60)' }}>
            Qalereya hadisə jurnalı ilk baxışdan sonra yaranır — yeni quraşdırmada
            bu normaldır.
          </span>
        </div>
      )}

      {!error && (
        <>
          <div style={{
            display: 'grid', gap: 10, marginBottom: 14,
            gridTemplateColumns: narrow ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(140px, 1fr))',
          }}>
            <StatTile icon={Eye}         label="Qalereya baxışı" value={g.visits}     compact tone="oklch(50% 0.09 250)" />
            <StatTile icon={QrCode}      label="QR skan"         value={g.qr_scans}   compact tone="oklch(50% 0.1 300)" />
            <StatTile icon={Upload}      label="Yükləmə"         value={g.uploads}    compact tone="oklch(48% 0.11 145)" />
            <StatTile icon={Heart}       label="Reaksiya"        value={g.reactions}  compact tone="oklch(52% 0.13 15)" />
            <StatTile icon={Star}        label="Seçilmiş media"  value={g.featured}   compact />
            <StatTile icon={MonitorPlay} label="Slayd şou"       value={g.slideshows} compact tone="oklch(45% 0.05 60)" />
          </div>

          <div style={{
            display: 'grid', gap: 14,
            gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
          }}>
            <div style={CARD}>
              <div style={HEAD}>Son 14 gün — baxış və yükləmə</div>
              <BarChart
                ariaLabel="Son 14 günün qalereya baxışları"
                data={(data?.daily || []).map(d => ({
                  label: shortDay(d.day),
                  value: d.visits,
                  title: `${d.day}: ${d.visits} baxış, ${d.uploads} yükləmə`,
                }))}
                tone="oklch(58% 0.09 250)"
              />
              <div style={{ marginTop: 10 }}>
                <BarChart
                  ariaLabel="Son 14 günün yükləmələri"
                  data={(data?.daily || []).map(d => ({
                    label: shortDay(d.day),
                    value: d.uploads,
                    title: `${d.day}: ${d.uploads} yükləmə`,
                  }))}
                  tone="oklch(56% 0.1 145)"
                  height={56}
                />
              </div>
            </div>

            <div style={CARD}>
              <div style={HEAD}>Saat üzrə aktivlik</div>
              <BarChart
                ariaLabel="Sutkanın saatları üzrə qalereya aktivliyi"
                data={(data?.byHour || []).map(h => ({
                  label: hourLabel(h.hour),
                  value: h.count,
                  title: `${String(h.hour).padStart(2, '0')}:00 — ${h.count} hadisə`,
                }))}
                height={70}
              />
              <p style={{ fontSize: 10.5, color: 'oklch(60% 0.03 60)', marginTop: 8, lineHeight: 1.6 }}>
                Qonaqların şəkil göndərdiyi saatlar — toy proqramını planlaşdırarkən faydalıdır.
              </p>
            </div>
          </div>

          <div style={{ ...CARD, marginTop: 14 }}>
            <div style={HEAD}>Ən aktiv qalereyalar</div>
            {albums.length === 0 ? (
              <p style={{ fontSize: 12, color: 'oklch(65% 0.03 60)' }}>
                {loading ? 'Yüklənir…' : 'Hələ qalereya aktivliyi qeydə alınmayıb.'}
              </p>
            ) : (
              albums.map(a => (
                <div key={a.slug} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <BarRow
                      label={a.slug}
                      value={a.visits}
                      max={albumMax}
                      tone="oklch(62% 0.09 250)"
                    />
                  </div>
                  {onOpenAlbum && (
                    <button
                      type="button"
                      onClick={() => onOpenAlbum(a.slug)}
                      aria-label={`${a.slug} qalereyasını aç`}
                      title={`${a.slug} · ${a.uploads} yükləmə`}
                      style={{
                        width: 30, height: 30, flexShrink: 0, borderRadius: 4,
                        background: 'oklch(96% 0.02 80)', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Images size={13} strokeWidth={1.6} style={{ color: 'oklch(48% 0.08 75)' }} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      <style>{`@keyframes aga-rot { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
