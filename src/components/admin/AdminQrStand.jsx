import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import {
  getInvitationsList, getGalleryMeta, getPhotos, saveGallerySettings,
} from '../../utils/api'
import { resizeToDataUrl, resizeErrorText } from '../../utils/imageResize'
import {
  renderStandCanvas, downloadStandPdf, downloadStandPng, STAND_LAYOUTS,
} from '../../utils/qrStandPdf'
import { formatAzDate } from '../../utils/dateFormat'
import QrStandEditor from './v2/QrStandEditor'
import { Notice } from './v2/adminUi'

/* ══════════════════════════════════════════════════
   QR STEND DİZAYNERİ (Phase 43; UI redesign 2026-10: v2/QrStandEditor)

   Admin toy masalarına qoyulacaq çap stendini burada qurur və PDF olaraq
   endirir. Dörd maket, redaktə olunan başlıq/izah, bəy-gəlin şəkli, tarix.

   ⚠ PDF canvas üzərindən (utils/qrStandPdf.js) — `Ə Ğ İ Ş` şrift problemi yoxdur.
   ⚠ ÖNBAXIŞ 96 DPI, ENDİRİLƏN FAYL 300 DPI — ikisi EYNİ funksiyadan çıxır.
   ⚠ AYARLAR QİSMİ SAXLANILIR: yalnız `stand*` (+ şəkil) sahələri göndərilir,
   server qalan konfiqurasiyanı qoruyur (gallery_settings.php → merge).
══════════════════════════════════════════════════ */

const PREVIEW_DPI = 96
const DEFAULT_TITLE = 'Şəkillərinizi bizimlə paylaşın'
const DEFAULT_DESC  = 'QR kodu telefonunuzun kamerası ilə skan edin və çəkdiyiniz şəkilləri bizə göndərin.'

/* Görünüşün maket id-ləri ↔ server/PDF id-ləri */
const toView   = (l) => (l === 'portrait' ? 'photo' : l)
const fromView = (l) => (l === 'photo' ? 'portrait' : l)
const isDirect = (v) => v.startsWith('data:') || v.startsWith('http') || v.startsWith('/')

export default function AdminQrStand() {
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

  const qrRef = useRef(null)
  const set = (patch) => setForm(f => ({ ...f, ...patch }))

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
    debounceRef.current = setTimeout(() => loadList(v), v ? 400 : 0)
  }

  /* ── Seçim dəyişdi → meta + media + mövcud ayarlar ── */
  const selectSlug = (s) => {
    if (s === slug) return
    setSlug(s)
    setMeta(null)
    setPhotos([])
    setPreviewUrl(null)
    setMetaBusy(true)
    setError('')
  }

  useEffect(() => {
    if (!slug) return undefined
    let alive = true
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
      if (isDirect(v)) return v
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

  /* ── Önbaxış (debounce: mətn yazarkən hər hərfdə canvas çizilmir) ── */
  useEffect(() => {
    if (!slug || !meta) return undefined
    let alive = true
    const t = setTimeout(async () => {
      try {
        const canvas = await renderStandCanvas({ ...standOpts, qrCanvas: qrRef.current, dpi: PREVIEW_DPI })
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
      const { dataUrl } = await resizeToDataUrl(file, 'stand')
      set({ coverPhoto: dataUrl })
    } catch (err) {
      setError(resizeErrorText(err))
    } finally {
      setExportBusy('')
    }
  }

  /* ── İxrac ── */
  const safeName = (slug || 'digitoy').replace(/[^a-zA-Z0-9-]/g, '')
  const [exportError, setExportError] = useState('')

  const exportPdf = async () => {
    setExportBusy('pdf')
    setExportError('')
    try {
      await downloadStandPdf({ ...standOpts, qrCanvas: qrRef.current, dpi: 300 }, `qr-stend-${safeName}.pdf`)
    } catch {
      setExportError('PDF yaradıla bilmədi. Şəkil xarici ünvandandırsa onu yükləyin.')
    } finally {
      setExportBusy('')
    }
  }

  const exportPng = async () => {
    setExportBusy('png')
    setExportError('')
    try {
      await downloadStandPng({ ...standOpts, qrCanvas: qrRef.current, dpi: 300 }, `qr-stend-${safeName}.png`)
    } catch {
      setExportError('PNG yaradıla bilmədi.')
    } finally {
      setExportBusy('')
    }
  }

  const save = async () => {
    if (!slug) return
    setSaveState('saving')
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
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2600)
    } catch (e) {
      setError(e?.message || 'Ayarlar saxlanılmadı.')
      setSaveState('error')
    }
  }

  const invitations = list.map(inv => (inv.slug === slug
    ? { id: inv.slug, slug: inv.slug, names: meta?.names || inv.names, date: dateLabel || undefined, venue: meta?.venue || inv.venue || undefined }
    : { id: inv.slug, slug: inv.slug, names: inv.names }))

  return (
    <>
      {(listError || error) && <Notice tone="danger" title={listError || error} className="mb-4" />}
      <QrStandEditor
        invitations={invitations}
        selectedId={slug || null}
        onSelectInvitation={selectSlug}
        search={searchVal}
        onSearch={handleSearch}
        onRefresh={() => loadList(searchVal)}
        refreshing={listBusy}
        loadingList={listBusy && list.length === 0}
        settings={{
          layout: toView(form.standLayout),
          title: form.standTitle,
          subtitle: form.standDescription,
          showDate: form.standShowDate,
          showPhoto: form.standShowPhoto,
          photoUrl: photoSrc,
          photoId: form.coverPhoto && !isDirect(form.coverPhoto) ? form.coverPhoto : null,
        }}
        onChange={(p) => {
          const next = {}
          if ('layout' in p)    next.standLayout = fromView(p.layout)
          if ('title' in p)     next.standTitle = String(p.title).slice(0, 120)
          if ('subtitle' in p)  next.standDescription = String(p.subtitle).slice(0, 400)
          if ('showDate' in p)  next.standShowDate = p.showDate
          if ('showPhoto' in p) next.standShowPhoto = p.showPhoto
          set(next)
        }}
        onUploadPhoto={handleUpload}
        uploadProgress={exportBusy === 'upload' ? 70 : null}
        onRemovePhoto={() => set({ coverPhoto: '' })}
        galleryPhotos={photos.filter(p => !p.type?.startsWith('video/')).slice(0, 30)
          .map(p => ({ id: p.id, src: p.thumbUrl || p.url }))}
        onPickPhoto={(id) => set({ coverPhoto: id })}
        onSaveSettings={save}
        saveState={saveState}
        onExportPdf={exportPdf}
        onExportPng={exportPng}
        exporting={exportBusy === 'pdf' || exportBusy === 'png' ? exportBusy : null}
        exportError={exportError}
        previewUrl={previewUrl}
        previewLoading={metaBusy}
      />

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
    </>
  )
}
