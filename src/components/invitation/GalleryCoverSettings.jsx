import { useState, useMemo } from 'react'
import CoverSettingsSheet from '../guest-photos/settings'
import { saveGallerySettings } from '../../utils/api'
import { resizeToDataUrl, resizeErrorText } from '../../utils/imageResize'

/* ─────────────────────────────────────────────────────────────────────────────
   GalleryCoverSettings — cütlüyün üz qapağı + slayd şou ayarları (Phase 43;
   UI redesign 2026-10: görünüş guest-photos/settings › CoverSettingsSheet)

   ⚠ QİSMİ YENİLƏMƏ: yalnız bu pəncərənin sahələri göndərilir. Server mövcud
   konfiqurasiyanı oxuyub üzərinə yazır (bax gallery_settings.php → merge),
   ona görə adminin QR stend ayarları BURADAN saxlamaqla itmir.

   ⚠ QAPAQ ŞƏKLİ ÜÇ MƏNBƏ: qalereyadaki mövcud media, yeni yüklənən şəkil
   (brauzerdə 1600px-ə kiçildilir → data URI) və ya boş (avtomatik seçim:
   ilk seçilmiş, yoxsa ən yeni foto).

   `slideShowQr` (2026-10): TV slayd şouda «Şəkil göndər» QR kartı, default açıq.
   ───────────────────────────────────────────────────────────────────────── */

const isDirectUrl = (v) => v.startsWith('data:') || v.startsWith('http') || v.startsWith('/')

const formFrom = (config = {}) => ({
  coverEnabled:      config.coverEnabled !== false,
  coverTitle:        config.coverTitle    || '',
  coverSubtitle:     config.coverSubtitle || '',
  coverPhoto:        config.coverPhoto    || '',
  slideSeconds:      Number(config.slideSeconds) || 6,
  slideFeaturedOnly: config.slideFeaturedOnly === true,
  slideShowQr:       config.slideShowQr !== false,
})

export default function GalleryCoverSettings({ open, slug, config = {}, items = [], names = '', onClose, onSaved }) {
  const [form, setForm] = useState(() => formFrom(config))
  const [busy,   setBusy]   = useState(false)
  const [error,  setError]  = useState('')
  const [upBusy, setUpBusy] = useState(false)

  /* Hər açılışda forma serverdəki son ayarlardan qurulur */
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) { setForm(formFrom(config)); setError('') }
  }

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  /* Qalereyadan seçim üçün yalnız fotolar (video qapaq ola bilməz) */
  const mediaOptions = useMemo(
    () => items
      .filter((i) => !i.type?.startsWith('video/'))
      .slice(0, 24)
      .map((i) => ({ id: i.id, src: i.thumbUrl || i.url, featured: !!i.featured })),
    [items],
  )

  /* Önbaxış ünvanı — fayl adı seçilibsə onun url-i */
  const previewUrl = useMemo(() => {
    const v = form.coverPhoto
    if (!v) return undefined
    if (isDirectUrl(v)) return v
    return items.find((i) => i.id === v)?.url || undefined
  }, [form.coverPhoto, items])

  const handleUpload = async (file) => {
    if (!file) return
    setError('')
    setUpBusy(true)
    try {
      const { dataUrl } = await resizeToDataUrl(file, 'cover')
      set({ coverPhoto: dataUrl })
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
        slideShowQr:       form.slideShowQr,
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
    <CoverSettingsSheet
      open={open}
      onClose={onClose}
      values={{
        showCover:    form.coverEnabled,
        title:        form.coverTitle,
        subtitle:     form.coverSubtitle,
        coverUrl:     previewUrl,
        coverId:      form.coverPhoto && !isDirectUrl(form.coverPhoto) ? form.coverPhoto : undefined,
        seconds:      form.slideSeconds,
        featuredOnly: form.slideFeaturedOnly,
        showQr:       form.slideShowQr,
      }}
      onChange={(p) => {
        const next = {}
        if ('showCover' in p)    next.coverEnabled = p.showCover
        if ('title' in p)        next.coverTitle = p.title
        if ('subtitle' in p)     next.coverSubtitle = p.subtitle
        if ('coverId' in p)      next.coverPhoto = p.coverId || ''
        if ('seconds' in p)      next.slideSeconds = p.seconds
        if ('featuredOnly' in p) next.slideFeaturedOnly = p.featuredOnly
        if ('showQr' in p)       next.slideShowQr = p.showQr
        set(next)
      }}
      onSave={save}
      saveState={busy ? 'saving' : error ? 'error' : 'idle'}
      errorText={error}
      defaultTitle={names || 'Bəy & Gəlin'}
      mediaOptions={mediaOptions}
      onUploadCover={(files) => handleUpload(files?.[0])}
      onRemoveCover={() => set({ coverPhoto: '' })}
      coverUploading={upBusy}
      subtitleHeader={`#${slug}`}
      labels={{ cover: { empty: 'Avtomatik: seçilmiş və ya ən yeni foto' } }}
    />
  )
}
