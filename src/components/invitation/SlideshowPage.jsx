import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import SlideshowStage from '../guest-photos/slideshow'
import { getPhotos, getGalleryMeta, trackGalleryEvent } from '../../utils/api'
import { formatAzDate } from '../../utils/dateFormat'

/* ══════════════════════════════════════════════════
   SlideshowPage — TV / proyektor rejimi (Phase 43)
   Route: /invite/:slug/slayd

   Toy zalındaki ekranda saatlarla açıq qalır, ona görə üç qayda var:

   1. YENİ YÜKLƏMƏLƏR ÖZÜ GƏLİR. Hər 20 saniyədə manifest yenilənir (ETag
      sayəsində dəyişiklik olmayanda 304 — praktiki olaraq pulsuz). Yeni
      media gələndə siyahıya ƏLAVƏ olunur və NÖVBƏTİ kadrda göstərilir:
      qonaq şəklini göndərdikdən ~yarım dəqiqə sonra ekranda görür.
      ⚠ Siyahı YENİDƏN QURULMUR — cari kadrın yeri qorunur, yəni ekran
      heç vaxt ortadan sıçramır.

   2. EKRAN YATMASIN. `navigator.wakeLock` dəstəklənirsə alınır. Brauzer
      icazə verməsə (Safari) heç nə pozulmur — proyektor onsuz da adətən
      enerji sxemi ilə açıq saxlanılır.

   3. HEÇ BİR İDARƏETMƏ TƏLƏB ETMİR. Səhifə açılan kimi avtomatik oynayır.
      İdarəetmə düymələri 4 saniyə hərəkətsizlikdən sonra yox olur ki,
      ekranda yalnız xatirələr qalsın (UI redesign 2026-10: SlideshowStage).

   4. QR KARTI (2026-10). Sağ aşağı küncdə «Şəkil göndər» QR-ı — zaldakı
      qonaq ekrandan skan edib /foto səhifəsinə düşür. Cütlük qalereya
      ayarlarında söndürə bilər (`slideShowQr: false`).

   ⚠ Bu route TAMAMİLƏ YENİDİR: /invite/:slug, /foto və /qalereya-idare
   ünvanlarına toxunmur.
   ══════════════════════════════════════════════════ */

const REFRESH_MS   = 20000    /* yeni media yoxlaması */
const IDLE_HIDE_MS = 4000     /* idarəetmənin gizlənməsi */
const VIDEO_MAX_MS = 30000    /* uzun videonu kəs — slayd şou dayanmasın */

export default function SlideshowPage() {
  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || 'preview'

  const [items,   setItems]   = useState([])
  const [meta,    setMeta]    = useState(null)
  const [index,   setIndex]   = useState(0)
  const [playing, setPlaying] = useState(true)
  const [ready,   setReady]   = useState(false)
  const [fs,      setFs]      = useState(false)
  const [newBadge,  setNewBadge]  = useState(0)

  /* Aktual dəyərləri interval-ın içindən oxumaq üçün (kapan problemi) */
  const itemsRef = useRef([])
  const knownRef = useRef(new Set())

  useEffect(() => { itemsRef.current = items }, [items])

  /* ── Ayarlar: slayd müddəti + yalnız seçilmişlər ── */
  const seconds = Math.max(3, Math.min(30, Number(meta?.config?.slideSeconds) || 6))
  const featuredOnly = meta?.config?.slideFeaturedOnly === true

  /* ── Göstərilən siyahı ──
     Seçilmişlər ƏVVƏLDƏ (qalereya ilə eyni qayda), `slideFeaturedOnly`
     açıqdırsa yalnız onlar. Seçilmiş heç nə yoxdursa siyahı boş qalmasın —
     hamısına düşür (toy gecəsində boş ekran ən pis nəticədir). */
  const visible = useMemo(() => {
    if (!featuredOnly) return items
    const feat = items.filter(i => i.featured)
    return feat.length ? feat : items
  }, [items, featuredOnly])

  /* ── Yükləmə ── */
  const load = useCallback(async (isFirst = false) => {
    try {
      const [photos, m] = await Promise.all([
        getPhotos(slug, { sort: 'featured' }),
        isFirst ? getGalleryMeta(slug).catch(() => null) : Promise.resolve(null),
      ])
      if (m) setMeta(m)

      /* ⚠ BÜTÜN HESABLAMA `setItems` UPDATER-İNDƏN KƏNARDADIR.
         React updater-i iki dəfə çağıra bilər (StrictMode + concurrent
         render). Əvvəlki versiyada `knownRef` məhz updater-in içində
         mutasiya edilirdi: ikinci çağırış yeni fotoları artıq «məlum»
         görürdü və onlar siyahıya DÜŞMÜRDÜ — slayd şou yeni yükləmələri
         göstərmirdi. İndi updater yoxdur, yan təsir də yoxdur. */
      const current = itemsRef.current

      if (isFirst || current.length === 0) {
        /* İlk yükləmə — hamısı «məlum» sayılır, «yeni» nişanı çıxmır */
        knownRef.current = new Set(photos.map(p => p.id))
        setItems(photos)
        return
      }

      /* ⚠ MÖVCUD SIRA QORUNUR: yeni elementlər siyahının SONUNA əlavə
         olunur, köhnələr yerində qalır. Manifesti bütövlükdə əvəz etsək
         cari kadrın indeksi başqa şəkilə düşərdi və ekran sıçrayardı. */
      const byId = new Map(photos.map(p => [p.id, p]))
      const kept = current
        .filter(p => byId.has(p.id))               /* silinənlər çıxır */
        .map(p => ({ ...p, ...byId.get(p.id) }))   /* seçim/reaksiya yenilənir */
      const fresh = photos.filter(p => !knownRef.current.has(p.id))

      if (fresh.length) {
        fresh.forEach(p => knownRef.current.add(p.id))
        setNewBadge(n => n + fresh.length)
      }

      /* Reaksiya və seçim vəziyyəti hər dövrədə yenilənir, ona görə
         siyahı uzunluğu dəyişməsə də state yenilənir. */
      setItems(fresh.length ? [...kept, ...fresh] : kept)
    } catch { /* şəbəkə qırılsa cari siyahı ilə davam edir */ }
    finally { if (isFirst) setReady(true) }
  }, [slug])

  useEffect(() => { load(true) }, [load])

  /* Açılış hadisəsi — analitikada «slayd şou» sayğacı */
  useEffect(() => { trackGalleryEvent(slug, 'slideshow') }, [slug])

  /* ── Yeni media yoxlaması — yalnız tab görünəndə (batareya/şəbəkə) ── */
  useEffect(() => {
    let timer = null
    const start = () => { if (timer === null) timer = setInterval(() => load(false), REFRESH_MS) }
    const stop  = () => { if (timer !== null) { clearInterval(timer); timer = null } }
    const onVis = () => {
      if (document.visibilityState === 'visible') { load(false); start() } else stop()
    }
    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', onVis)
    return () => { document.removeEventListener('visibilitychange', onVis); stop() }
  }, [load])

  /* ── Avtomatik keçid ──
     Video öz müddətini alır (maksimum VIDEO_MAX_MS), foto isə `seconds`. */
  const current = visible.length ? visible[index % visible.length] : null
  const isVideo = current?.type?.startsWith('video/')

  useEffect(() => {
    if (!playing || visible.length < 2) return
    const ms = isVideo ? VIDEO_MAX_MS : seconds * 1000
    const t = setTimeout(() => setIndex(i => (i + 1) % visible.length), ms)
    return () => clearTimeout(t)
  }, [playing, index, visible.length, seconds, isVideo])

  /* Siyahı qısalsa indeks diapazondan çıxa bilər */
  useEffect(() => {
    if (visible.length && index >= visible.length) setIndex(0)
  }, [visible.length, index])

  /* ── Ekran yatmasın (dəstəkləyən brauzerlərdə) ── */
  useEffect(() => {
    let lock = null
    let cancelled = false
    const request = async () => {
      try {
        if ('wakeLock' in navigator) {
          lock = await navigator.wakeLock.request('screen')
        }
      } catch { /* icazə yoxdursa problem deyil */ }
    }
    request()
    /* Tab geri qayıdanda kilid itir — yenidən alırıq */
    const onVis = () => { if (document.visibilityState === 'visible' && !cancelled) request() }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVis)
      try { lock?.release?.() } catch { /* onsuz da buraxılıb */ }
    }
  }, [])

  /* ── Klaviatura ── */
  const next = useCallback(() => setIndex(i => (visible.length ? (i + 1) % visible.length : 0)), [visible.length])
  const prev = useCallback(() => setIndex(i => (visible.length ? (i - 1 + visible.length) % visible.length : 0)), [visible.length])

  const toggleFs = useCallback(async () => {
    try {
      if (!document.fullscreenElement) { await document.documentElement.requestFullscreen(); setFs(true) }
      else { await document.exitFullscreen(); setFs(false) }
    } catch { /* icazə verilmədi */ }
  }, [])

  useEffect(() => {
    const onFsChange = () => setFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const dateLabel = meta?.date ? formatAzDate(meta.date, 'az').formattedDate : ''

  /* QR → qonağın şəkil göndərmə səhifəsi. Cütlük söndürübsə heç yerdə göstərilmir. */
  const showQr = meta?.config?.slideShowQr !== false
  const uploadUrl = showQr ? `${window.location.origin}/invite/${slug}/foto` : undefined

  const stageItems = useMemo(() => visible.map(i => {
    const video = i.type?.startsWith('video/')
    return {
      id: i.id,
      type: video ? 'video' : 'image',
      src: i.url,
      poster: video ? (i.posterUrl || undefined) : (i.thumbUrl || undefined),
      featured: !!i.featured,
    }
  }), [visible])

  return (
    <SlideshowStage
      items={stageItems}
      index={visible.length ? index % visible.length : 0}
      /* Video öz müddətini alır (maks. 30 s) — irəliləmə zolağı da ona uyğun */
      seconds={isVideo ? VIDEO_MAX_MS / 1000 : seconds}
      playing={playing}
      loading={!ready}
      names={meta?.names || ''}
      date={dateLabel}
      showQr={showQr}
      uploadUrl={uploadUrl}
      newCount={newBadge}
      onNewSeen={() => setNewBadge(0)}
      onPrev={prev}
      onNext={next}
      onTogglePlay={() => setPlaying(p => !p)}
      onFullscreen={toggleFs}
      isFullscreen={fs}
      onClose={() => window.location.assign(`/invite/${slug}/qalereya-idare`)}
      idleMs={IDLE_HIDE_MS}
      labels={{ close: 'Qalereyaya qayıt' }}
    />
  )
}
