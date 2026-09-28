import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import {
  Search, X, RefreshCw, Download, FileImage, Loader2, Check,
  Upload, Trash2, Star, QrCode,
} from 'lucide-react'
import {
  getInvitationsList, getGalleryMeta, getPhotos, saveGallerySettings,
} from '../../utils/api'
import { resizeToDataUrl, resizeErrorText, humanBytes } from '../../utils/imageResize'
import {
  renderStandCanvas, downloadStandPdf, downloadStandPng,
  STAND_LAYOUTS, STAND_LAYOUT_LABELS, STAND_MM,
} from '../../utils/qrStandPdf'
import { formatAzDate } from '../../utils/dateFormat'
import { useIsNarrow } from '../../hooks/useIsNarrow'

/* ══════════════════════════════════════════════════
   QR STEND DİZAYNERİ (Phase 43)

   Admin toy masalarına qoyulacaq çap stendini burada qurur və PDF olaraq
   endirir. Dörd maket, redaktə olunan başlıq/izah, bəy-gəlin şəkli, tarix.

   ⚠ PDF NƏ ÜÇÜN CANVAS ÜZƏRİNDƏN: bax utils/qrStandPdf.js — yeni asılılıq
   yoxdur və `Ə Ğ İ Ş` hərfləri şrift problemi yaratmır.

   ⚠ ÖNBAXIŞ 96 DPI-dədir (sürətli), ENDİRİLƏN FAYL 300 DPI (çap keyfiyyəti).
   İkisi EYNİ funksiyadan çıxır (`renderStandCanvas`), ona görə önbaxış
   nəticəni dəqiq göstərir — «ekranda başqa, çapda başqa» problemi yoxdur.

   ⚠ AYARLAR QİSMİ SAXLANILIR: yalnız `stand*` sahələri göndərilir, server
   qalan konfiqurasiyanı qoruyur (bax gallery_settings.php → merge), yəni
   cütlüyün qapaq ayarları buradan saxlamaqla itmir.
══════════════════════════════════════════════════ */

const PREVIEW_DPI = 96

const CARD = {
  background: 'white', border: '1px solid oklch(88% 0.02 60)',
  borderRadius: 6, padding: '18px 20px',
}
const LABEL = {
  display: 'block', fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'oklch(50% 0.03 60)', marginBottom: 7, fontWeight: 600,
}
const FIELD = {
  width: '100%', padding: '10px 12px', borderRadius: 4,
  border: '1px solid oklch(85% 0.02 60)', background: 'white',
  fontSize: 13, color: 'oklch(25% 0.02 60)', outline: 'none',
  fontFamily: '"Inter",system-ui,sans-serif',
}
const BTN = (primary) => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  minHeight: 40, padding: '0 15px', borderRadius: 4,
  border: primary ? 'none' : '1px solid oklch(85% 0.02 60)',
  background: primary ? 'oklch(68% 0.1 80)' : 'white',
  color: primary ? 'oklch(22% 0.03 70)' : 'oklch(45% 0.03 60)',
  cursor: 'pointer', fontSize: 10, letterSpacing: '0.1em',
  textTransform: 'uppercase', fontWeight: 600,
  fontFamily: '"Inter",system-ui,sans-serif',
})

const DEFAULT_TITLE = 'Şəkillərinizi bizimlə paylaşın'
const DEFAULT_DESC  = 'QR kodu telefonunuzun kamerası ilə skan edin və çəkdiyiniz şəkilləri bizə göndərin.'

export default function AdminQrStand() {
  const narrow = useIsNarrow()

  /* ── Dəvətnamə seçimi ── */
  const [list,      setList]      = useState([])
  const [listBusy,  setListBusy]  = useState(true)
  const [listError, setListError] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [slug,      setSlug]      = useState('')
  const debounceRef = useRef(null)

  /* ── Seçilmiş toyun məlumatı ── */
  const [meta,     setMeta]     = useState(null)
  const [photos,   setPhotos]   = useState([])
  const [metaBusy, setMetaBusy] = useState(false)

  /* ── Forma ── */
  const [form, setForm] = useState({
    standTitle: '', standDescription: '', standLayout: 'classic',
    standShowDate: true, standShowPhoto: true, coverPhoto: '',
  })

  const [previewUrl, setPreviewUrl] = useState(null)
  const [exportBusy, setExportBusy] = useState('')
  const [saveState,  setSaveState]  = useState('idle')
  const [error,      setError]      = useState('')
  const [upBytes,    setUpBytes]    = useState(0)

  const qrRef   = useRef(null)
  const fileRef = useRef(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  /* ── Siyahını yüklə ── */
  const loadList = useCallback((q = '') => {
    setListBusy(true)
    setListError('')
    getInvitationsList({ search: q, limit: 60 })
      .then(d => setList(d.invitations || []))
      .catch(() => setListError('Dəvətnamə siyahısı yüklənmədi.'))
      .finally(() => setListBusy(false))
  }, [])

  useEffect(() => { loadList() }, [loadList])

  const handleSearch = (v) => {
    setSearchVal(v)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => loadList(v), 400)
  }

  /* ── Seçim dəyişdi → meta + media + mövcud ayarlar ── */
  useEffect(() => {
    if (!slug) { setMeta(null); setPhotos([]); return }
    let alive = true
    setMetaBusy(true)
    setError('')
    Promise.all([
      getGalleryMeta(slug),
      getPhotos(slug, { sort: 'featured' }).catch(() => []),
    ])
      .then(([m, ph]) => {
        if (!alive) return
        setMeta(m)
        setPhotos(ph)
        const c = m.config || {}
        setForm({
          standTitle:       c.standTitle       || DEFAULT_TITLE,
          standDescription: c.standDescription || DEFAULT_DESC,
          standLayout:      STAND_LAYOUTS.includes(c.standLayout) ? c.standLayout : 'classic',
          standShowDate:    c.standShowDate  !== false,
          standShowPhoto:   c.standShowPhoto !== false,
          coverPhoto:       c.coverPhoto || '',
        })
        setUpBytes(0)
      })
      .catch(() => { if (alive) setError('Toy məlumatları yüklənmədi.') })
      .finally(() => { if (alive) setMetaBusy(false) })
    return () => { alive = false }
  }, [slug])

  /* ── Şəkil mənbəyi ──
     Ardıcıllıq: cütlüyün/adminin seçdiyi → qalereyadakı seçilmiş → ən yeni foto. */
  const photoSrc = useMemo(() => {
    const v = form.coverPhoto
    if (v) {
      if (v.startsWith('data:') || v.startsWith('http') || v.startsWith('/')) return v
      const hit = photos.find(p => p.id === v)
      if (hit) return hit.url
    }
    const auto = photos.find(p => p.featured && !p.type?.startsWith('video/'))
              || photos.find(p => !p.type?.startsWith('video/'))
    return auto ? auto.url : null
  }, [form.coverPhoto, photos])

  const shareUrl = slug ? `${window.location.origin}/invite/${slug}/foto` : ''
  const dateLabel = meta?.date ? formatAzDate(meta.date, 'az').formattedDate : ''

  /* Stend parametrləri — önbaxış və ixrac ÜÇÜN EYNİ obyekt */
  const standOpts = useMemo(() => ({
    layout:      form.standLayout,
    names:       meta?.names || '',
    dateLabel,
    title:       form.standTitle,
    description: form.standDescription,
    urlLabel:    shareUrl.replace(/^https?:\/\//, ''),
    photoSrc,
    showPhoto:   form.standShowPhoto,
    showDate:    form.standShowDate,
  }), [form, meta, dateLabel, shareUrl, photoSrc])

  /* ── Önbaxış ──
     Debounce: mətn yazarkən hər hərfdə canvas çizmək lazım deyil. */
  useEffect(() => {
    if (!slug || !meta) { setPreviewUrl(null); return }
    let alive = true
    const t = setTimeout(async () => {
      try {
        const canvas = await renderStandCanvas({
          ...standOpts,
          qrCanvas: qrRef.current,
          dpi: PREVIEW_DPI,
        })
        if (alive) setPreviewUrl(canvas.toDataURL('image/png'))
      } catch {
        if (alive) setPreviewUrl(null)
      }
    }, 260)
    return () => { alive = false; clearTimeout(t) }
  }, [slug, meta, standOpts])

  /* ── Şəkil yükləmə ── */
  const handleUpload = async (file) => {
    if (!file) return
    setError('')
    setExportBusy('upload')
    try {
      const { dataUrl, bytes } = await resizeToDataUrl(file, 'stand')
      set('coverPhoto', dataUrl)
      setUpBytes(bytes)
    } catch (err) {
      setError(resizeErrorText(err))
    } finally {
      setExportBusy('')
    }
  }

  /* ── İxrac ── */
  const safeName = (slug || 'digitoy').replace(/[^a-zA-Z0-9-]/g, '')

  const exportPdf = async () => {
    setExportBusy('pdf')
    setError('')
    try {
      await downloadStandPdf(
        { ...standOpts, qrCanvas: qrRef.current, dpi: 300 },
        `qr-stend-${safeName}.pdf`,
      )
    } catch {
      setError('PDF yaradıla bilmədi. Şəkil xarici ünvandandırsa onu yükləyin.')
    } finally {
      setExportBusy('')
    }
  }

  const exportPng = async () => {
    setExportBusy('png')
    setError('')
    try {
      await downloadStandPng(
        { ...standOpts, qrCanvas: qrRef.current, dpi: 300 },
        `qr-stend-${safeName}.png`,
      )
    } catch {
      setError('PNG yaradıla bilmədi.')
    } finally {
      setExportBusy('')
    }
  }

  const save = async () => {
    if (!slug) return
    setSaveState('busy')
    setError('')
    try {
      /* YALNIZ stend sahələri — qapaq ayarları serverdə qorunur */
      await saveGallerySettings(slug, {
        standTitle:       form.standTitle,
        standDescription: form.standDescription,
        standLayout:      form.standLayout,
        standShowDate:    form.standShowDate,
        standShowPhoto:   form.standShowPhoto,
        coverPhoto:       form.coverPhoto,
      })
      setSaveState('done')
      setTimeout(() => setSaveState('idle'), 2600)
    } catch (e) {
      setError(e?.message || 'Ayarlar saxlanılmadı.')
      setSaveState('idle')
    }
  }

  const layoutLabels = STAND_LAYOUT_LABELS.az

  return (
    <div style={{ padding: narrow ? '20px 16px' : '32px 36px' }}>
      {/* Başlıq */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: '"Cormorant Garamond","Playfair Display",serif',
          fontSize: 24, fontWeight: 300, color: 'oklch(20% 0.02 60)',
          margin: 0, letterSpacing: '-0.01em',
        }}>
          QR Stend
        </h1>
        <p style={{ fontSize: 12, color: 'oklch(55% 0.03 60)', margin: '4px 0 0' }}>
          Masaüstü çap stendi — {STAND_MM.w}×{STAND_MM.h} mm (A5), 300 DPI PDF
        </p>
      </div>

      {/* Dəvətnamə seçimi */}
      <div style={{ ...CARD, marginBottom: 16 }}>
        <label style={LABEL} htmlFor="qs-search">Dəvətnamə seçin</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '1 1 200px', minWidth: 0 }}>
            <Search size={13} strokeWidth={1.5} style={{ position: 'absolute', left: 10, color: 'oklch(60% 0.03 60)', pointerEvents: 'none' }} />
            <input
              id="qs-search" type="text" placeholder="Ad və ya slug axtar…"
              value={searchVal} onChange={e => handleSearch(e.target.value)}
              style={{ ...FIELD, padding: '10px 30px 10px 30px' }}
            />
            {searchVal && (
              <button
                type="button" onClick={() => { setSearchVal(''); loadList('') }}
                aria-label="Axtarışı təmizlə"
                style={{
                  position: 'absolute', right: 8, background: 'none', border: 'none',
                  cursor: 'pointer', color: 'oklch(60% 0.03 60)', display: 'flex',
                }}
              >
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>
          <button type="button" onClick={() => loadList(searchVal)} style={BTN(false)}>
            <RefreshCw size={12} strokeWidth={1.5} style={{ animation: listBusy ? 'qs-rot 1s linear infinite' : 'none' }} />
            Yenilə
          </button>
        </div>

        {listError && (
          <p role="alert" style={{ fontSize: 12, color: 'oklch(45% 0.1 25)' }}>{listError}</p>
        )}

        <div style={{
          display: 'grid', gap: 6,
          gridTemplateColumns: narrow ? '1fr' : 'repeat(auto-fill, minmax(230px, 1fr))',
          maxHeight: 210, overflowY: 'auto',
        }}>
          {list.map(inv => {
            const active = inv.slug === slug
            return (
              <button
                key={inv.slug}
                type="button"
                onClick={() => setSlug(inv.slug)}
                style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 4,
                  border: `1px solid ${active ? 'oklch(72% 0.12 80)' : 'oklch(90% 0.02 60)'}`,
                  background: active ? 'oklch(97% 0.03 80)' : 'white',
                  cursor: 'pointer', minWidth: 0, minHeight: 48,
                }}
              >
                <span style={{
                  display: 'block', fontSize: 12.5, fontWeight: 500,
                  color: 'oklch(25% 0.02 60)', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {inv.names}
                </span>
                <span style={{
                  display: 'block', fontFamily: 'monospace', fontSize: 10,
                  color: 'oklch(58% 0.05 75)', marginTop: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {inv.slug}
                </span>
              </button>
            )
          })}
          {!listBusy && list.length === 0 && !listError && (
            <p style={{ fontSize: 12, color: 'oklch(62% 0.03 60)' }}>Dəvətnamə tapılmadı.</p>
          )}
        </div>
      </div>

      {!slug && (
        <div style={{
          ...CARD, textAlign: 'center', padding: '48px 24px',
          borderStyle: 'dashed', color: 'oklch(58% 0.03 60)',
        }}>
          <QrCode size={26} strokeWidth={1.2} style={{ color: 'oklch(70% 0.06 80)', marginBottom: 12 }} />
          <p style={{ fontSize: 13 }}>Stendi qurmaq üçün yuxarıdan bir dəvətnamə seçin.</p>
        </div>
      )}

      {slug && (
        <div style={{
          display: 'grid', gap: 16,
          gridTemplateColumns: narrow ? '1fr' : 'minmax(0, 1fr) minmax(280px, 400px)',
          alignItems: 'start',
        }}>
          {/* ── Forma ── */}
          <div style={CARD}>
            {metaBusy && (
              <p style={{ fontSize: 12, color: 'oklch(60% 0.03 60)', marginBottom: 12 }}>Yüklənir…</p>
            )}

            {error && (
              <p role="alert" style={{
                marginBottom: 14, padding: '10px 13px', borderRadius: 4,
                border: '1px solid oklch(80% 0.08 25)', background: 'oklch(97% 0.03 25)',
                fontSize: 12, lineHeight: 1.6, color: 'oklch(42% 0.11 25)',
              }}>
                {error}
              </p>
            )}

            {/* Toyun məlumatı (oxunur, redaktə olunmur) */}
            <div style={{
              marginBottom: 18, padding: '11px 13px', borderRadius: 4,
              background: 'oklch(97% 0.012 80)', border: '1px solid oklch(92% 0.02 70)',
            }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'oklch(25% 0.02 60)' }}>
                {meta?.names || '—'}
              </p>
              <p style={{ fontSize: 11, color: 'oklch(55% 0.03 60)', marginTop: 3 }}>
                {[dateLabel, meta?.venue].filter(Boolean).join(' · ') || 'Tarix/məkan yoxdur'}
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'oklch(58% 0.05 75)', marginTop: 5 }}>
                {shareUrl.replace(/^https?:\/\//, '')}
              </p>
            </div>

            {/* Maket */}
            <div style={{ marginBottom: 16 }}>
              <span style={LABEL}>Maket</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {STAND_LAYOUTS.map(l => (
                  <button
                    key={l} type="button"
                    onClick={() => set('standLayout', l)}
                    aria-pressed={form.standLayout === l}
                    style={{
                      minHeight: 40, padding: '0 14px', borderRadius: 4, cursor: 'pointer',
                      border: `1px solid ${form.standLayout === l ? 'oklch(72% 0.12 80)' : 'oklch(88% 0.02 60)'}`,
                      background: form.standLayout === l ? 'oklch(96% 0.04 80)' : 'white',
                      fontSize: 11, fontWeight: 500,
                      color: form.standLayout === l ? 'oklch(38% 0.09 75)' : 'oklch(50% 0.03 60)',
                      fontFamily: '"Inter",system-ui,sans-serif',
                    }}
                  >
                    {layoutLabels[l]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={LABEL} htmlFor="qs-title">Başlıq</label>
              <input
                id="qs-title" type="text" style={FIELD} maxLength={120}
                value={form.standTitle}
                placeholder={DEFAULT_TITLE}
                onChange={e => set('standTitle', e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={LABEL} htmlFor="qs-desc">İzah</label>
              <textarea
                id="qs-desc" rows={3} maxLength={400}
                style={{ ...FIELD, resize: 'vertical', lineHeight: 1.6 }}
                value={form.standDescription}
                placeholder={DEFAULT_DESC}
                onChange={e => set('standDescription', e.target.value)}
              />
            </div>

            {/* Açarlar */}
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 18 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', minHeight: 40 }}>
                <input
                  type="checkbox" checked={form.standShowDate}
                  onChange={e => set('standShowDate', e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'oklch(68% 0.1 80)' }}
                />
                <span style={{ fontSize: 12.5, color: 'oklch(32% 0.02 60)' }}>Tarixi göstər</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', minHeight: 40 }}>
                <input
                  type="checkbox" checked={form.standShowPhoto}
                  onChange={e => set('standShowPhoto', e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'oklch(68% 0.1 80)' }}
                />
                <span style={{ fontSize: 12.5, color: 'oklch(32% 0.02 60)' }}>Şəkli göstər</span>
              </label>
            </div>

            {/* Şəkil */}
            <div style={{ marginBottom: 18 }}>
              <span style={LABEL}>Bəy və gəlin şəkli</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 10 }}>
                {photoSrc ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={photoSrc} alt=""
                      style={{ width: 104, height: 78, objectFit: 'cover', borderRadius: 4, border: '1px solid oklch(88% 0.02 60)', display: 'block' }}
                    />
                    {form.coverPhoto && (
                      <button
                        type="button"
                        onClick={() => { set('coverPhoto', ''); setUpBytes(0) }}
                        aria-label="Şəkli sil"
                        style={{
                          position: 'absolute', top: -8, right: -8, width: 22, height: 22,
                          borderRadius: '50%', background: 'white', cursor: 'pointer',
                          border: '1px solid oklch(85% 0.02 60)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={10} strokeWidth={2} style={{ color: 'oklch(50% 0.13 25)' }} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{
                    width: 104, height: 78, borderRadius: 4, border: '1px dashed oklch(84% 0.03 70)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: 'oklch(62% 0.03 60)', textAlign: 'center', padding: 6, lineHeight: 1.4,
                  }}>
                    Şəkil yoxdur
                  </div>
                )}
                <div>
                  <input
                    ref={fileRef} type="file" style={{ display: 'none' }}
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                    onChange={e => { handleUpload(e.target.files?.[0]); e.target.value = '' }}
                  />
                  <button
                    type="button" style={BTN(false)}
                    disabled={exportBusy === 'upload'}
                    onClick={() => fileRef.current?.click()}
                  >
                    {exportBusy === 'upload'
                      ? <Loader2 size={12} strokeWidth={1.8} style={{ animation: 'qs-rot 0.9s linear infinite' }} />
                      : <Upload size={12} strokeWidth={1.8} />}
                    Şəkil yüklə
                  </button>
                  {upBytes > 0 && (
                    <p style={{ fontSize: 10, color: 'oklch(58% 0.03 60)', marginTop: 6 }}>{humanBytes(upBytes)}</p>
                  )}
                </div>
              </div>

              {/* Qalereyadan seçim */}
              {photos.filter(p => !p.type?.startsWith('video/')).length > 0 && (
                <>
                  <p style={{ fontSize: 10.5, color: 'oklch(58% 0.03 60)', marginBottom: 6 }}>
                    və ya qalereyadan seçin:
                  </p>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
                    gap: 4, maxHeight: 120, overflowY: 'auto',
                  }}>
                    {photos.filter(p => !p.type?.startsWith('video/')).slice(0, 30).map(p => {
                      const active = form.coverPhoto === p.id
                      return (
                        <button
                          key={p.id} type="button"
                          onClick={() => { set('coverPhoto', p.id); setUpBytes(0) }}
                          aria-pressed={active}
                          aria-label={`Şəkil: ${p.name}`}
                          style={{
                            position: 'relative', aspectRatio: '1', padding: 0, overflow: 'hidden',
                            border: `2px solid ${active ? 'oklch(72% 0.12 80)' : 'transparent'}`,
                            background: 'none', cursor: 'pointer', borderRadius: 3,
                          }}
                        >
                          <img
                            src={p.thumbUrl || p.url} alt="" loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                          {p.featured && (
                            <Star size={9} strokeWidth={2} fill="#FFF" color="#FFF"
                              style={{ position: 'absolute', top: 2, right: 2, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Əməliyyatlar */}
            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap',
              borderTop: '1px solid oklch(92% 0.01 70)', paddingTop: 16,
            }}>
              <button type="button" style={BTN(true)} onClick={exportPdf} disabled={exportBusy === 'pdf'}>
                {exportBusy === 'pdf'
                  ? <Loader2 size={12} strokeWidth={2} style={{ animation: 'qs-rot 0.9s linear infinite' }} />
                  : <Download size={12} strokeWidth={1.8} />}
                PDF endir
              </button>
              <button type="button" style={BTN(false)} onClick={exportPng} disabled={exportBusy === 'png'}>
                {exportBusy === 'png'
                  ? <Loader2 size={12} strokeWidth={2} style={{ animation: 'qs-rot 0.9s linear infinite' }} />
                  : <FileImage size={12} strokeWidth={1.8} />}
                PNG
              </button>
              <button type="button" style={BTN(false)} onClick={save} disabled={saveState === 'busy'}>
                {saveState === 'busy'
                  ? <Loader2 size={12} strokeWidth={2} style={{ animation: 'qs-rot 0.9s linear infinite' }} />
                  : saveState === 'done'
                    ? <Check size={12} strokeWidth={2.4} style={{ color: 'oklch(48% 0.12 145)' }} />
                    : <Check size={12} strokeWidth={1.8} />}
                {saveState === 'done' ? 'Saxlanıldı' : 'Ayarları saxla'}
              </button>
            </div>
            <p style={{ fontSize: 10.5, color: 'oklch(60% 0.03 60)', marginTop: 10, lineHeight: 1.6 }}>
              «Ayarları saxla» başlıq, izah və maketi bu toy üçün yadda saxlayır — sonra
              yenidən açanda hər şey olduğu kimi qalır.
            </p>
          </div>

          {/* ── Önbaxış ── */}
          <div style={{ ...CARD, position: narrow ? 'static' : 'sticky', top: 16 }}>
            <span style={LABEL}>Önbaxış</span>
            <div style={{
              background: 'oklch(95% 0.01 75)', borderRadius: 4, padding: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 240,
            }}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="QR stendin önbaxışı"
                  style={{
                    width: '100%', maxWidth: 300, height: 'auto', display: 'block',
                    boxShadow: '0 6px 26px rgba(0,0,0,0.16)',
                  }}
                />
              ) : (
                <span style={{ fontSize: 11.5, color: 'oklch(60% 0.03 60)' }}>
                  {metaBusy ? 'Yüklənir…' : 'Önbaxış hazırlanır…'}
                </span>
              )}
            </div>
            <p style={{ fontSize: 10.5, color: 'oklch(60% 0.03 60)', marginTop: 10, lineHeight: 1.6 }}>
              Endirilən PDF 300 DPI-dədir — önbaxış yalnız ekran üçün kiçildilmişdir.
            </p>
          </div>
        </div>
      )}

      {/* ── Gizli QR canvas ──
          `renderStandCanvas` bunu birbaşa `drawImage` ilə götürür: SVG
          serializasiyası yoxdur, canvas «tainted» olmur. */}
      <div style={{ position: 'absolute', left: -99999, top: 0, width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
        {shareUrl && (
          <QRCodeCanvas
            ref={qrRef}
            value={shareUrl}
            size={900}
            level="M"
            marginSize={0}
            bgColor="#FFFFFF"
            fgColor="#141414"
          />
        )}
      </div>

      <style>{`@keyframes qs-rot { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
