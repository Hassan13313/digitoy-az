import { useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Upload, Loader2, Trash2, MonitorPlay, Star } from 'lucide-react'
import { saveGallerySettings } from '../../utils/api'
import { resizeToDataUrl, resizeErrorText, humanBytes } from '../../utils/imageResize'

/* ─────────────────────────────────────────────────────────────────────────────
   GalleryCoverSettings — cütlüyün üz qapağı + slayd şou ayarları (Phase 43)

   ⚠ QİSMİ YENİLƏMƏ: yalnız bu modalın sahələri göndərilir. Server mövcud
   konfiqurasiyanı oxuyub üzərinə yazır (bax gallery_settings.php → merge),
   ona görə adminin QR stend ayarları BURADAN saxlamaqla itmir.

   ⚠ QAPAQ ŞƏKLİ ÜÇ MƏNBƏ: qalereyadaki mövcud media, yeni yüklənən şəkil
   (brauzerdə 1600px-ə kiçildilir → data URI) və ya boş (avtomatik seçim:
   ilk seçilmiş, yoxsa ən yeni foto).
   ───────────────────────────────────────────────────────────────────────── */

const FIELD = {
  width: '100%', padding: '11px 13px',
  border: '1px solid rgba(197,160,89,0.3)', background: '#FFFFFF',
  fontSize: 13, color: '#1C1610', outline: 'none',
  fontFamily: '"Inter",system-ui,sans-serif', borderRadius: 2,
}
const LABEL = {
  display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'rgba(140,123,107,0.85)', marginBottom: 7, fontWeight: 600,
}

export default function GalleryCoverSettings({ slug, config = {}, items = [], names = '', onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    coverEnabled:      config.coverEnabled !== false,
    coverTitle:        config.coverTitle    || '',
    coverSubtitle:     config.coverSubtitle || '',
    coverPhoto:        config.coverPhoto    || '',
    slideSeconds:      Number(config.slideSeconds) || 6,
    slideFeaturedOnly: config.slideFeaturedOnly === true,
  }))
  const [busy,    setBusy]    = useState(false)
  const [error,   setError]   = useState('')
  const [upBusy,  setUpBusy]  = useState(false)
  const [upBytes, setUpBytes] = useState(0)
  const fileRef = useRef(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  /* Qalereyadan seçim üçün yalnız fotolar (video qapaq ola bilməz) */
  const photoItems = useMemo(
    () => items.filter(i => !i.type?.startsWith('video/')).slice(0, 24),
    [items],
  )

  /* Önbaxış ünvanı — fayl adı seçilibsə onun url-i */
  const previewUrl = useMemo(() => {
    const v = form.coverPhoto
    if (!v) return null
    if (v.startsWith('data:') || v.startsWith('http') || v.startsWith('/')) return v
    return items.find(i => i.id === v)?.url || null
  }, [form.coverPhoto, items])

  const handleUpload = async (file) => {
    if (!file) return
    setError('')
    setUpBusy(true)
    try {
      const { dataUrl, bytes } = await resizeToDataUrl(file, 'cover')
      set('coverPhoto', dataUrl)
      setUpBytes(bytes)
    } catch (err) {
      setError(resizeErrorText(err))
    } finally {
      setUpBusy(false)
    }
  }

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      await saveGallerySettings(slug, {
        coverEnabled:      form.coverEnabled,
        coverTitle:        form.coverTitle,
        coverSubtitle:     form.coverSubtitle,
        coverPhoto:        form.coverPhoto,
        slideSeconds:      form.slideSeconds,
        slideFeaturedOnly: form.slideFeaturedOnly,
      })
      onSaved?.()
      onClose?.()
    } catch (e) {
      setError(e?.message || 'Ayarlar saxlanılmadı.')
    } finally {
      setBusy(false)
    }
  }

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
        role="dialog" aria-modal="true" aria-label="Qapaq ayarları"
        style={{
          width: '100%', maxWidth: 560,
          background: '#FDFAF4', border: '1px solid rgba(197,160,89,0.3)',
          padding: 'clamp(18px, 5vw, 26px)',
          fontFamily: '"Inter",system-ui,sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 20 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 'clamp(19px, 5vw, 23px)', fontWeight: 300, color: '#1C1610', margin: 0,
            }}>
              Qapaq və Slayd Şou
            </h2>
            <p style={{ fontSize: 8.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(197,160,89,0.8)', marginTop: 4 }}>
              #{slug}
            </p>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Bağla"
            style={{
              width: 34, height: 34, flexShrink: 0, background: 'rgba(197,160,89,0.1)',
              border: '1px solid rgba(197,160,89,0.35)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} strokeWidth={2} style={{ color: 'rgba(150,118,54,1)' }} />
          </button>
        </div>

        {error && (
          <p role="alert" style={{
            marginBottom: 14, padding: '11px 14px',
            border: '1px solid rgba(170,35,35,0.35)', background: 'rgba(170,35,35,0.05)',
            fontSize: 12, lineHeight: 1.6, color: 'rgba(140,28,28,0.95)',
          }}>
            {error}
          </p>
        )}

        {/* Qapağı göstər */}
        <label style={{
          display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18,
          cursor: 'pointer', minHeight: 44,
        }}>
          <input
            type="checkbox"
            checked={form.coverEnabled}
            onChange={e => set('coverEnabled', e.target.checked)}
            style={{ width: 17, height: 17, accentColor: 'rgb(197,160,89)', flexShrink: 0 }}
          />
          <span style={{ fontSize: 12.5, color: '#3A3128', lineHeight: 1.5 }}>
            Qalereyanın başında üz qapağını göstər
          </span>
        </label>

        <div style={{ marginBottom: 14 }}>
          <label style={LABEL} htmlFor="gcs-title">Başlıq</label>
          <input
            id="gcs-title" type="text" style={FIELD}
            value={form.coverTitle}
            placeholder={names || 'Bəy & Gəlin'}
            maxLength={120}
            onChange={e => set('coverTitle', e.target.value)}
          />
          <p style={{ fontSize: 10.5, color: 'rgba(140,123,107,0.7)', marginTop: 5, lineHeight: 1.5 }}>
            Boş qalsa dəvətnamədəki adlar işlədilir.
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={LABEL} htmlFor="gcs-sub">Alt yazı</label>
          <textarea
            id="gcs-sub" rows={2} style={{ ...FIELD, resize: 'vertical', lineHeight: 1.6 }}
            value={form.coverSubtitle}
            placeholder="Xatirələrinizi bizimlə paylaşın"
            maxLength={240}
            onChange={e => set('coverSubtitle', e.target.value)}
          />
        </div>

        {/* Qapaq şəkli */}
        <div style={{ marginBottom: 18 }}>
          <label style={LABEL}>Qapaq şəkli</label>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap' }}>
            {previewUrl ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={previewUrl} alt=""
                  style={{
                    width: 132, height: 88, objectFit: 'cover',
                    border: '1px solid rgba(197,160,89,0.3)', display: 'block',
                  }}
                />
                <button
                  type="button"
                  onClick={() => { set('coverPhoto', ''); setUpBytes(0) }}
                  aria-label="Qapaq şəklini sil"
                  style={{
                    position: 'absolute', top: -9, right: -9, width: 24, height: 24,
                    borderRadius: '50%', background: '#FFF',
                    border: '1px solid rgba(197,160,89,0.45)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Trash2 size={11} strokeWidth={2} style={{ color: 'rgba(170,35,35,0.85)' }} />
                </button>
              </div>
            ) : (
              <div style={{
                width: 132, height: 88, border: '1px dashed rgba(197,160,89,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: 'rgba(140,123,107,0.65)', textAlign: 'center',
                padding: 8, lineHeight: 1.4,
              }}>
                Avtomatik: seçilmiş / ən yeni foto
              </div>
            )}

            <div>
              <input
                ref={fileRef} type="file" className="hidden"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                style={{ display: 'none' }}
                onChange={e => { handleUpload(e.target.files?.[0]); e.target.value = '' }}
              />
              <button
                type="button" data-press disabled={upBusy}
                onClick={() => fileRef.current?.click()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  minHeight: 40, padding: '0 14px',
                  border: '1px solid rgba(197,160,89,0.34)', background: 'rgba(197,160,89,0.07)',
                  cursor: upBusy ? 'default' : 'pointer', opacity: upBusy ? 0.6 : 1,
                  fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
                  fontWeight: 600, color: 'rgba(150,118,54,1)',
                }}
              >
                {upBusy
                  ? <Loader2 size={12} strokeWidth={1.8} className="gcs-spin" />
                  : <Upload size={12} strokeWidth={1.8} />}
                Şəkil yüklə
              </button>
              {upBytes > 0 && (
                <p style={{ fontSize: 10, color: 'rgba(140,123,107,0.7)', marginTop: 6 }}>
                  {humanBytes(upBytes)}
                </p>
              )}
            </div>
          </div>

          {/* Qalereyadan seçim */}
          {photoItems.length > 0 && (
            <>
              <p style={{ fontSize: 10.5, color: 'rgba(140,123,107,0.75)', marginBottom: 7 }}>
                və ya qalereyadan seçin:
              </p>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))',
                gap: 5, maxHeight: 146, overflowY: 'auto',
              }}>
                {photoItems.map(i => {
                  const active = form.coverPhoto === i.id
                  return (
                    <button
                      key={i.id} type="button"
                      onClick={() => { set('coverPhoto', i.id); setUpBytes(0) }}
                      aria-label={`Qapaq: ${i.name}`}
                      aria-pressed={active}
                      style={{
                        position: 'relative', aspectRatio: '1', padding: 0,
                        border: `2px solid ${active ? 'rgba(197,160,89,0.95)' : 'transparent'}`,
                        background: 'none', cursor: 'pointer', overflow: 'hidden',
                      }}
                    >
                      <img
                        src={i.thumbUrl || i.url} alt="" loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {i.featured && (
                        <Star
                          size={10} strokeWidth={2} fill="#FFF" color="#FFF"
                          style={{ position: 'absolute', top: 2, right: 2, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Slayd şou */}
        <div style={{
          borderTop: '1px solid rgba(197,160,89,0.2)', paddingTop: 16, marginBottom: 20,
        }}>
          <p style={{
            display: 'flex', alignItems: 'center', gap: 7, ...LABEL, marginBottom: 12,
          }}>
            <MonitorPlay size={12} strokeWidth={1.8} />
            Slayd şou
          </p>

          <div style={{ marginBottom: 14 }}>
            <label htmlFor="gcs-sec" style={{ fontSize: 12, color: '#3A3128', display: 'block', marginBottom: 7 }}>
              Hər şəkil {form.slideSeconds} saniyə göstərilsin
            </label>
            <input
              id="gcs-sec" type="range" min={3} max={30} step={1}
              value={form.slideSeconds}
              onChange={e => set('slideSeconds', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'rgb(197,160,89)' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', minHeight: 44 }}>
            <input
              type="checkbox"
              checked={form.slideFeaturedOnly}
              onChange={e => set('slideFeaturedOnly', e.target.checked)}
              style={{ width: 17, height: 17, accentColor: 'rgb(197,160,89)', flexShrink: 0 }}
            />
            <span style={{ fontSize: 12.5, color: '#3A3128', lineHeight: 1.5 }}>
              Yalnız seçilmiş şəkilləri göstər
              <span style={{ display: 'block', fontSize: 10.5, color: 'rgba(140,123,107,0.75)', marginTop: 2 }}>
                Seçilmiş şəkil yoxdursa hamısı göstərilir — ekran boş qalmır.
              </span>
            </span>
          </label>
        </div>

        {/* Əməliyyatlar */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            type="button" onClick={onClose}
            style={{
              minHeight: 42, padding: '0 18px',
              border: '1px solid rgba(197,160,89,0.28)', background: 'transparent',
              cursor: 'pointer', fontSize: 9.5, letterSpacing: '0.18em',
              textTransform: 'uppercase', fontWeight: 600, color: 'rgba(140,123,107,0.9)',
            }}
          >
            Ləğv et
          </button>
          <button
            type="button" data-press onClick={save} disabled={busy}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              minHeight: 42, padding: '0 20px', border: 'none',
              background: 'rgba(197,160,89,0.95)', color: '#1A1408',
              cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.65 : 1,
              fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
            }}
          >
            {busy
              ? <Loader2 size={12} strokeWidth={2} className="gcs-spin" />
              : <Check size={12} strokeWidth={2.4} />}
            Saxla
          </button>
        </div>

        <style>{`
          .gcs-spin { animation: gcs-rot 0.9s linear infinite; }
          @keyframes gcs-rot { to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) { .gcs-spin { animation: none; } }
        `}</style>
      </motion.div>
    </motion.div>
  )
}
