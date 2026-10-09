import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, RotateCcw, Upload } from 'lucide-react'
import { uploadPhoto, uploadPhotoChunked, trackGalleryEvent } from '../../utils/api'
import { useGalleryMeta } from '../../hooks/useGalleryMeta'
import { trackEvent } from '../../utils/analytics'
import {
  MAX_UPLOAD_LABEL, ACCEPT_IMAGE, ACCEPT_VIDEO, ACCEPT_ANY,
  validateFile, compressImage, extractVideoPoster,
  needsChunkedUpload, slowUploadWarning,
} from '../../utils/uploadPolicy'
import {
  UploadHero, UploadChoices, UploadLimits, UploadProgress, UploadQueue,
  UploadQueueItem, UploadNotice, UploadDone, DropOverlay,
} from '../guest-photos/upload'
import { Btn } from '../guest-photos/shared'
import { FOCUS } from '../guest-photos/tokens'
import { useWindowFileDrop } from '../guest-photos/hooks'

/* Paralel yükləmə işçiləri — sıra ilə (1-bir) yükləmək 50-100 fotoluq
   partiyalarda son dərəcə yavaş idi. Server tərəfdə hələ də "sorğu
   başına 1 fayl" qaydası qüvvədədir (upload_photo.php). */
const MAX_CONCURRENT = 3

/* Yalnız MÜVƏQQƏTİ xətalar üçün. Köhnə kod HƏR uğursuzluğu 2 dəfə
   təkrarlayırdı — 60 MB-lıq video limitə görə rədd olunanda eyni fayl
   3 dəfə göndərilirdi: 180 MB mobil trafik və dəqiqələrlə əbəs gözləmə. */
const MAX_RETRIES = 2

/* ── Üç aydın yol (UI redesign 2026-10: UploadChoices) ──
   Köhnə UI-da tək bir passiv "bura at" sahəsi var idi; tədbir qonağı
   şəkil çəkə biləcəyini, qalereyadan seçə biləcəyini və ya video
   göndərə biləcəyini başa düşmürdü. İndi hər yol ayrıca kartdır.
   capture="environment" → kamera birbaşa açılır (iOS/Android); kamera
   yoxdursa brauzer avtomatik fayl seçiciyə keçir. */
const CHOICES = [
  { id: 'camera',  title: 'Şəkil çək',       text: 'Kameranı aç və indi çək', accept: ACCEPT_IMAGE, capture: 'environment', multiple: false },
  { id: 'gallery', title: 'Qalereyadan seç', text: 'Şəkil və ya video — birdən çox seçə bilərsiniz', accept: ACCEPT_ANY, multiple: true },
  { id: 'video',   title: 'Video göndər',    text: `Uzun video olar — maksimum ${MAX_UPLOAD_LABEL} · MP4 və ya MOV`, accept: ACCEPT_VIDEO, multiple: true },
]

export default function PhotoShare() {
  /* queue elementi: { id, file, preview, poster, posterUrl, status, pct, error } */
  const [queue,     setQueue]     = useState([])
  const [uploading, setUploading] = useState(false)
  const [done,      setDone]      = useState(false)
  const [rejected,  setRejected]  = useState([])   /* { name, reason } */
  const [notices,   setNotices]   = useState([])   /* xəbərdarlıq, xəta deyil */
  /* Şəbəkə itəndə sorğular çox vaxt xəta vermir, ASILI QALIR — qonaq
     sistemin donduğunu düşünür. Brauzerin öz siqnalı ilə vəziyyəti
     DƏRHAL göstəririk. */
  const [online,    setOnline]    = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine !== false)

  const queueRef   = useRef(queue)
  const abortRef   = useRef(null)

  useEffect(() => { queueRef.current = queue }, [queue])

  useEffect(() => {
    const up   = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  /* Qalan bütün blob preview URL-ləri azad et — istifadəçi yükləmə
     yarımçıq ikən səhifədən çıxsa belə sızma olmur. */
  useEffect(() => () => {
    /* Unmount: qalan bütün preview-lar azad olunur (effekt artıq işləməyəcək) */
    queueRef.current.forEach(q => {
      if (q.preview) URL.revokeObjectURL(q.preview)
      if (q.posterUrl) URL.revokeObjectURL(q.posterUrl)
    })
    abortRef.current?.abort()
  }, [])

  const slugMatch = window.location.pathname.match(/\/invite\/([^/?#]+)/)
  const slug = slugMatch?.[1] || 'preview'
  const backHref = slugMatch ? `/invite/${slugMatch[1]}#gallery` : null

  /* ── Phase 43 — canlı sayğaclar və toyun adı ──
     Bu səhifə QR kodun hədəfidir: qonaq buraya çatanda nə qədər şəkil
     toplandığını görür. Sayğaclar `gallery_meta.php`-dən gəlir və ETag
     sayəsində dəyişiklik olmayanda cavab 304-dür.
     ⚠ Meta yüklənməsə səhifə TAM İŞLƏYİR — yalnız rəqəmlər görünmür. */
  const meta = useGalleryMeta(slug, { interval: 30000 })
  /* Server «belə dəvətnamə yoxdur» deyirsə yükləmə formu göstərilmir (gallery_meta.php › exists) */
  const notReady = meta.meta?.exists === false

  /* QR skan — bu səhifəyə gəliş praktikada QR kodun skan edilməsidir.
     Server GÜNDƏ BİR DƏFƏ sayır (ip_hash + tarix), ona görə səhifəni
     yeniləmək statistikanı şişirtmir. */
  useEffect(() => {
    if (slugMatch) trackGalleryEvent(slug, 'qr_scan')
  }, [slug, slugMatch])

  /* Fayllar SEÇİLƏN KİMİ yoxlanılır — limitə uyğun olmayan fayl heç vaxt
     şəbəkəyə çıxmır və istifadəçi səbəbi dərhal görür. */
  const addFiles = useCallback((incoming) => {
    const accepted = []
    const refused  = []

    Array.from(incoming || []).forEach(f => {
      const v = validateFile(f)
      if (v.ok) accepted.push(f)
      else      refused.push({ name: f.name, reason: v.message })
    })

    if (refused.length) setRejected(prev => [...prev, ...refused])

    /* Böyük fayl üçün vaxt xəbərdarlığı — qonaq "donub" düşünməsin */
    const warns = accepted.map(f => {
      const w = slowUploadWarning(f)
      return w ? { name: f.name, reason: w } : null
    }).filter(Boolean)
    if (warns.length) setNotices(prev => [...prev, ...warns])

    if (accepted.length) {
      setQueue(prev => [
        ...prev,
        ...accepted.map(f => ({
          id:      Math.random().toString(36).slice(2),
          file:    f,
          preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
          poster:  null,
          status:  'pending',
          pct:     0,
          error:   null,
        })),
      ])
    }
  }, [])

  /* ── Video posterləri fonda hazırlanır — qalereyada real kadr görünsün ──
     ⚠ Bu effekt `queue`-dan ASILI OLA BİLMƏZ: yükləmə zamanı onProgress
     saniyədə onlarla dəfə setQueue çağırır; `queue` asılılığı effekti hər
     dəfə söndürüb yenidən qurar, çıxarılan poster həmişə atılar və hər
     tick-də yeni <video> + blob URL yaradılıb tərk edilərdi (mobil
     telefonda 60-90 MB-lıq blob-lar yığılır). Ona görə asılılıq yalnız
     poster gözləyən videoların İD SİYAHISIDIR — o, progress zamanı
     dəyişmir. */
  const pendingPosterIds = queue
    .filter(q => q.poster === null && q.file.type.startsWith('video/'))
    .map(q => q.id).join(',')

  useEffect(() => {
    if (!pendingPosterIds) return
    const ids = pendingPosterIds.split(',')
    let cancelled = false
    ;(async () => {
      for (const id of ids) {
        const item = queueRef.current.find(q => q.id === id)
        if (!item || cancelled) return
        const blob = await extractVideoPoster(item.file)
        if (cancelled) return
        /* false = cəhd edildi, alınmadı — təkrar cəhd olunmasın */
        setQueue(prev => prev.map(q => q.id === id
          ? { ...q, poster: blob || false, posterUrl: blob ? URL.createObjectURL(blob) : null }
          : q))
      }
    })()
    return () => { cancelled = true }
  }, [pendingPosterIds])

  const removeItem = useCallback((id) => {
    setQueue(prev => prev.filter(q => q.id !== id))
  }, [])

  /* ── Blob preview URL-lərinin azad edilməsi ──
     ⚠ Azad etmə RENDER-DƏN SONRA olmalıdır. Əvvəl setQueue-nun içində
     revokeObjectURL çağırılırdı: React hələ köhnə <img src={blob}> ilə
     bir kadr render edə bilirdi və brauzer artıq ləğv edilmiş blob-u
     yükləməyə çalışıb konsola ERR_FILE_NOT_FOUND yazırdı.
     İndi commit-dən sonra yalnız NÖVBƏDƏ QALMAYAN URL-lər azad edilir —
     sızma da olmur, xəta da. */
  const knownPreviews = useRef(new Set())
  useEffect(() => {
    const current = new Set(queue.flatMap(q => [q.preview, q.posterUrl]).filter(Boolean))
    for (const url of knownPreviews.current) {
      if (!current.has(url)) URL.revokeObjectURL(url)
    }
    knownPreviews.current = current
  }, [queue])

  const setItem = useCallback((id, patch) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q))
  }, [])

  /* Növbə-hovuz: 3 paralel işçi paylaşılan kursordan fayl götürür.
     Yalnız MÜVƏQQƏTİ xətalar təkrarlanır (server `permanent` bayrağı
     verir) — limit/format xətasında dərhal dayanılır. */
  const uploadOne = useCallback(async (item, signal) => {
    let lastErr = null

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        setItem(item.id, { status: 'uploading', pct: 0, error: null })

        /* Böyük fotolar göndərilməzdən əvvəl kiçildilir (8-20 MB → ~1-2 MB) */
        const file = await compressImage(item.file)

        /* Kiçik fayl → tək sorğu (ən sürətli yol).
           Böyük fayl → hissə-hissə: server limitlərinə toxunmur və
           bağlantı kəsilsə qaldığı yerdən davam edir. */
        const send = needsChunkedUpload(file) ? uploadPhotoChunked : uploadPhoto

        await send(file, slug, {
          poster: item.poster || undefined,
          signal,
          onProgress: pct => setItem(item.id, { pct }),
        })

        setItem(item.id, { status: 'done', pct: 100, error: null })
        return true
      } catch (e) {
        lastErr = e
        if (e?.code === 'ABORTED') {
          setItem(item.id, { status: 'pending', pct: 0, error: null })
          return false
        }
        if (e?.permanent || attempt === MAX_RETRIES) break
        setItem(item.id, { status: 'retrying', error: null })
        await new Promise(r => setTimeout(r, 700 * (attempt + 1)))
      }
    }

    setItem(item.id, {
      status: 'error', pct: 0,
      error: lastErr?.message || 'Göndərilmədi. Yenidən cəhd edin.',
    })
    return false
  }, [slug, setItem])

  const handleUpload = async () => {
    const targets = queue.filter(q => q.status === 'pending' || q.status === 'error')
    if (!targets.length || uploading) return

    const controller = new AbortController()
    abortRef.current = controller
    setUploading(true)

    let cursor = 0
    let successCount = 0
    const runWorker = async () => {
      while (cursor < targets.length && !controller.signal.aborted) {
        const item = targets[cursor++]
        const ok = await uploadOne(item, controller.signal)
        if (ok) successCount++
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(MAX_CONCURRENT, targets.length) }, runWorker))

    abortRef.current = null
    setUploading(false)

    if (successCount > 0) trackEvent('gallery_upload', { count: successCount })

    /* Phase 43 — sayğaclar dərhal düzəlsin. `upload` hadisəsini SERVER
       özü yazır (upload_photo.php / media_store.php), ona görə burada
       yalnız yenidən oxuyuruq — client uydurma statistika yarada bilmir. */
    if (successCount > 0) meta.refresh()

    setQueue(prev => {
      if (prev.length > 0 && prev.every(q => q.status === 'done')) setDone(true)
      return prev
    })
  }

  const cancelUpload = () => abortRef.current?.abort()

  const pendingCount = queue.filter(q => q.status === 'pending').length
  const errorCount   = queue.filter(q => q.status === 'error').length
  const doneCount    = queue.filter(q => q.status === 'done').length
  const toSendCount  = pendingCount + errorCount

  /* Ümumi faiz — bayt əsaslı deyil, fayl əsaslıdır (sadə və dürüst) */
  const overallPct = queue.length === 0 ? 0 : Math.round(
    queue.reduce((sum, q) => sum + (q.status === 'done' ? 100 : q.pct || 0), 0) / queue.length)

  const resetAll = () => {
    /* Preview-lar yuxarıdakı effekt tərəfindən render-dən sonra azad edilir */
    setDone(false)
    setQueue([])
    setRejected([])
    setNotices([])
  }

  /* Fayl bütün pəncərəyə sürüklənəndə (desktop) — köhnə «drop» sahəsinin yerinə */
  const dropActive = useWindowFileDrop({ onFiles: addFiles, disabled: done || notReady })

  /* Qapaq: cütlüyün qalereya qapağı (data URI / tam ünvan). Qalereyadan seçilmiş
     fayl adı bu səhifədə həll olunmur (media siyahısı yüklənmir) — o halda
     krem başlıq göstərilir. */
  const rawCover = meta.config?.coverEnabled !== false ? meta.config?.coverPhoto : ''
  const cover = rawCover && (rawCover.startsWith('data:') || rawCover.startsWith('http') || rawCover.startsWith('/'))
    ? rawCover : undefined

  const counts = meta.counts
  const countLabel = () =>
    `${counts.photos} foto${counts.videos > 0 ? ` · ${counts.videos} video` : ''}`

  return (
    <div className="dt-site dt-page min-h-screen bg-cream text-brown-dark">
      {backHref && (
        <header className="sticky top-0 z-40 border-b border-gold/20 bg-cream/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-[560px] items-center px-3">
            <a
              href={backHref}
              className={`inline-flex h-11 items-center gap-2 rounded-full px-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-brown-dark transition-colors hover:text-ink ${FOCUS}`}
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
              Dəvətnaməyə qayıt
            </a>
          </div>
        </header>
      )}

      <main className="mx-auto w-full max-w-[560px] pb-16">
        <UploadHero
          cover={cover}
          names={meta.names}
          hashtag={`#${slug}`}
          photoCount={counts.total > 0 ? counts.total : undefined}
          formatCount={countLabel}
        />

        <div className="mt-6 space-y-4 px-4 sm:px-5">
          {/* Şəbəkə itəndə sorğular çox vaxt xəta vermir, ASILI QALIR —
              vəziyyət brauzerin öz siqnalı ilə DƏRHAL göstərilir */}
          {!online && (
            <UploadNotice tone="offline" title="İnternet bağlantısı yoxdur.">
              Bağlantı qayıdanda «Yenidən göndər» düyməsinə toxunun — yükləmə qaldığı yerdən davam edəcək.
            </UploadNotice>
          )}

          {notReady ? (
            /* Dəvətnamə hələ yoxdur (məs. builder önbaxışındakı nümunə QR/link —
               real link təsdiqdən sonra sifariş koduna bağlı suffiks alır).
               Əvvəl qonaq faylı seçib göndərirdi və yalnız sonda «tapılmadı» alırdı. */
            <UploadNotice tone="info" title="Bu dəvətnamə hələ aktiv deyil">
              Foto və video paylaşımı dəvətnamə təsdiqləndikdən sonra açılır. Önbaxışdakı QR kod
              və link yalnız nümunədir — təsdiqdən sonra göndərilən linkdə şəkillər qəbul olunacaq.
            </UploadNotice>
          ) : done ? (
            <UploadDone
              count={doneCount}
              formatText={(n) => `${n} fayl cütlüyün qalereyasına əlavə olundu.`
                + (counts.total > 0 ? ` Qalereyada ${counts.total} media var.` : '')}
              onMore={resetAll}
              onGallery={slugMatch ? () => window.location.assign(`/invite/${slug}/qalereya-idare`) : undefined}
            />
          ) : (
            <>
              <UploadChoices options={CHOICES} onFiles={addFiles} />

              {/* Qəbul şərtləri — fayl seçilməzdən ƏVVƏL görünür */}
              <UploadLimits maxSize={MAX_UPLOAD_LABEL} />

              {/* Qəbul edilməyən fayllar — səbəbi ilə birlikdə */}
              {rejected.length > 0 && (
                <UploadNotice
                  tone="error"
                  title="Bu fayllar qəbul edilmədi"
                  items={rejected}
                  onDismiss={() => setRejected([])}
                />
              )}

              {/* Xəbərdarlıqlar — xəta DEYİL, sadəcə vaxt barədə məlumat */}
              {notices.length > 0 && (
                <UploadNotice
                  tone="warning"
                  title="Böyük fayl — göndərmək bir az vaxt alacaq"
                  items={notices}
                  onDismiss={() => setNotices([])}
                />
              )}

              {queue.length > 0 && (
                <>
                  {(uploading || doneCount > 0) && (
                    <UploadProgress
                      sent={doneCount}
                      total={queue.length}
                      percent={overallPct}
                      paused={!online}
                    />
                  )}

                  <UploadQueue
                    title={`${queue.length} fayl seçildi`}
                    action={errorCount > 0 && !uploading ? (
                      <Btn variant="quiet" size="sm" icon={RotateCcw} onClick={handleUpload}>
                        Hamısını yenidən cəhd et
                      </Btn>
                    ) : null}
                  >
                    {queue.map(item => (
                      <UploadQueueItem
                        key={item.id}
                        name={item.file.name}
                        size={item.file.size}
                        type={item.file.type.startsWith('video/') ? 'video' : 'image'}
                        preview={item.preview || item.posterUrl || undefined}
                        status={item.status}
                        progress={item.pct}
                        error={item.error}
                        onRetry={uploading ? undefined : handleUpload}
                        onRemove={item.status === 'pending' && !uploading ? () => removeItem(item.id) : undefined}
                      />
                    ))}
                  </UploadQueue>

                  {/* ── Əsas hərəkət ── */}
                  <Btn
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={uploading ? undefined : errorCount > 0 ? RotateCcw : Upload}
                    onClick={handleUpload}
                    disabled={toSendCount === 0 || uploading}
                  >
                    {uploading
                      ? `Göndərilir… ${overallPct}%`
                      : errorCount > 0
                        ? `${toSendCount} faylı yenidən göndər`
                        : `${toSendCount} faylı göndər`}
                  </Btn>

                  {uploading && (
                    <div className="flex justify-center">
                      <Btn variant="quiet" size="sm" onClick={cancelUpload}>Ləğv et</Btn>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <p className="mt-12 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-brown-muted">
          digitoy.az
        </p>
      </main>

      <DropOverlay active={dropActive} />
    </div>
  )
}
