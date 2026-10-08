import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getPhotos, deletePhoto, storeGalleryKey, canManageGallery,
  getVisitorId, setMediaFeatured, trackGalleryEvent,
} from '../../utils/api'
import { downloadItemsHD, downloadItem } from '../../utils/photoGallery'
import { trackEvent } from '../../utils/analytics'
import { formatAzDate } from '../../utils/dateFormat'
import { useGalleryMeta } from '../../hooks/useGalleryMeta'
import {
  GalleryTopBar, GalleryCover, ViewOnlyNote, GalleryToolbar, SelectionBar,
  GalleryEmpty, GallerySkeleton, Toast,
} from '../guest-photos/gallery'
import MasonryGrid from '../guest-photos/MasonryGrid'
import MediaTile from '../guest-photos/MediaTile'
import { ConfirmDialog } from '../guest-photos/Sheet'
import GalleryStatsPanel from './GalleryStatsPanel'
import GalleryCoverSettings from './GalleryCoverSettings'
import GalleryLightbox from './GalleryLightbox'

const PAGE_SIZE = 30

/* ── Sıralama rejimləri (Phase 43) ──
   ⚠ MÖVCUD SIRALAMA QORUNUR: `newest` serverin defaultudur və Phase 39-dakı
   davranışın eynisidir. `featured` yalnız seçilmişləri ÖNƏ çıxarır, siyahıdan
   heç nə çıxarmır. */
const SORTS = [
  { id: 'featured', label: 'Seçilmişlər öndə' },
  { id: 'newest',   label: 'Əvvəlcə yeni' },
  { id: 'oldest',   label: 'Əvvəlcə köhnə' },
]

/* ── Poster demək olar tam qaradırmı? ──
   2026-09-28-dək client kadrı seek bitməmiş çəkirdi (bax uploadPolicy.js ›
   extractVideoPoster) və serverdə QARA posterlər qalıb. Onlar yüklənəndə
   12×12-lik nümunənin orta parlaqlığı ölçülür. Cross-origin şəkildə canvas
   «çirklənir» və oxunmur — o halda poster olduğu kimi saxlanılır.
   (MediaTile `rejectPoster` → true olanda kadr videonun özündən götürülür.) */
function isNearlyBlack(img) {
  try {
    const c = document.createElement('canvas')
    c.width = 12
    c.height = 12
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, 12, 12)
    const d = ctx.getImageData(0, 0, 12, 12).data
    let sum = 0
    for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    return sum / (d.length / 4) < 14
  } catch {
    return false
  }
}

/* Reaksiya xülasəsi — xanada YALNIZ göstərici (ən çox verilən emoji + cəm).
   Tam reaksiya çubuğu lightbox-dadır. */
function topReactionOf(reactions) {
  const entries = Object.entries(reactions || {})
  if (!entries.length) return undefined
  return entries.sort((x, y) => y[1] - x[1])[0][0]
}

const HD_WARN_THRESHOLD = 15

/* ══════════════════════════════════════════════════
   GalleryPage — tam müstəqil qalereya səhifəsi
   Route: /invite/:slug/qalereya-idare
══════════════════════════════════════════════════ */
export default function GalleryPage() {
  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || 'preview'

  /* İdarəetmə linkindəki ?k=… tokeni.
     Başlanğıc dəyər render zamanı YALNIZ OXUNUR (side-effect yoxdur);
     yaddaşa yazmaq və URL-i təmizləmək effektə köçürülüb — StrictMode-un
     ikiqat render-i heç nəyi pozmur. */
  const urlKey = (() => {
    try { return new URLSearchParams(window.location.search).get('k') } catch { return null }
  })()

  const [canManage] = useState(() => Boolean(urlKey) || canManageGallery(slug))

  useEffect(() => {
    if (!urlKey) return
    storeGalleryKey(slug, urlKey)
    try {
      /* Yalnız `k` silinir — utm_* və digər parametrlər qorunur */
      const params = new URLSearchParams(window.location.search)
      params.delete('k')
      const qs = params.toString()
      window.history.replaceState({}, '',
        window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash)
    } catch { /* history əlçatmazdırsa token yenə də saxlanıldı */ }
  }, [slug, urlKey])

  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [previewId, setPreviewId] = useState(null)
  const [page,     setPage]     = useState(1)
  const [zipState, setZipState] = useState('idle')
  const [delConfirm, setDelConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [delOne,   setDelOne]   = useState(null)   /* tək media silinməsi üçün təsdiq */
  const [hdAsk,    setHdAsk]    = useState(null)   /* çox fayl HD endirmə təsdiqi */
  const [notice,   setNotice]   = useState(null)   /* { kind:'error'|'ok', text } */
  const [loadedOnce, setLoadedOnce] = useState(false)

  /* ── Phase 43 vəziyyəti ── */
  const [sort,        setSort]        = useState('featured')
  const [featureBusy, setFeatureBusy] = useState(false)
  const [statsOpen,   setStatsOpen]   = useState(false)
  const [coverOpen,   setCoverOpen]   = useState(false)

  /* Qonaq kimliyi — reaksiyaların «bir qonaq · bir səs» qaydası üçün.
     ŞƏXSİ MƏLUMAT DEYİL (bax utils/api.js › getVisitorId). */
  const visitor = useMemo(() => getVisitorId(), [])

  /* Üz qapağı + canlı sayğaclar */
  const meta = useGalleryMeta(slug)

  /* Serverdən yüklə */
  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const photos = await getPhotos(slug, { sort, visitor })
      setItems(photos)
    } catch { /* server əlçatmaz */ }
    finally { setLoading(false); setLoadedOnce(true) }
  }, [slug, sort, visitor])

  useEffect(() => { fetchItems() }, [fetchItems])

  /* Qalereya idarəetmə səhifəsi açıldı — bir dəfə */
  useEffect(() => {
    trackEvent('gallery_opened')
    /* Phase 43 — server tərəfi analitika. Gündə bir dəfə sayılır
       (bax gallery_track.php), ona görə açıq tab statistikanı şişirtmir. */
    trackGalleryEvent(slug, 'visit')
  }, [slug])

  /* ── 30 saniyəlik avtomatik yeniləmə — YALNIZ tab görünəndə (Phase 39) ──
     ƏVVƏL: interval tab arxa planda olsa da işləyirdi. Cavab ETag/304
     sayəsində ucuz olsa da, hər sorğu mobil radionu OYADIR — bu, telefon
     batareyasında ən bahalı əməliyyatdır və qalereya toy gecəsi saatlarla
     açıq qalır.

     İNDİ: tab gizlənəndə interval tam dayanır; geri qayıdanda DƏRHAL bir
     dəfə yenilənir (qonaq gözləmir) və interval yenidən qurulur.
     ⚠ Davranış istifadəçi üçün eynidir — görünən tabda heç nə dəyişmir. */
  useEffect(() => {
    let timer = null

    const start = () => {
      if (timer === null) timer = setInterval(fetchItems, 30000)
    }
    const stop = () => {
      if (timer !== null) { clearInterval(timer); timer = null }
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchItems()   /* geri qayıdanda gecikmə olmasın */
        start()
      } else {
        stop()
      }
    }

    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      stop()
    }
  }, [fetchItems])

  const visibleItems = items.slice(0, page * PAGE_SIZE)
  const hasMore      = visibleItems.length < items.length

  const toggleSelect = useCallback((id) => {
    setSelected(s => {
      const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n
    })
  }, [])

  const selectAll = () => setSelected(new Set(items.map(i => i.id)))
  const clearSel  = () => setSelected(new Set())

  /* ── Tək elementi yerində yenilə (reaksiya / seçim) ──
     Bütün siyahını yenidən çəkmək əvəzinə yalnız dəyişən element əvəz
     olunur: 500 medialı qalereyada bu, fərqi hiss olunan şəkildə saxlayır.
     Açıq lightbox da eyni obyekti göstərdiyi üçün onunla sinxronlaşır. */
  const patchItem = useCallback((id, fields) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...fields } : i)))
  }, [])

  /* Lightbox bütün siyahı boyunca gəzir (grid-in yalnız görünən hissəsi yox:
     `items` tam siyahıdır, səhifələmə yalnız çəkilişdir) */
  const previewIndex = previewId ? items.findIndex(i => i.id === previewId) : -1

  /* ── Seçilmiş media (Phase 43) ──
     ⚠ SİLMƏ QAYDASI İLƏ EYNİ PRİNSİP: vəziyyət YALNIZ server təsdiqləyəndən
     sonra dəyişir. Optimistik göstərmək cütlüyün «işarələdim» görüb refresh-də
     itirməsinə aparardı. */
  const handleFeature = useCallback(async (id, featured) => {
    setFeatureBusy(true)
    try {
      const res = await setMediaFeatured(slug, id, featured)
      patchItem(id, { featured: res.featured })
      setNotice({
        kind: 'ok',
        text: res.featured ? 'Seçilmişlərə əlavə olundu.' : 'Seçilmişlərdən çıxarıldı.',
      })
    } catch (e) {
      setNotice({ kind: 'error', text: e?.message || 'İşarə saxlanılmadı.' })
    } finally {
      setFeatureBusy(false)
    }
  }, [slug, patchItem])

  /* ⚠ SİLMƏ DÜRÜSTLÜYÜ QAYDASI
     Element UI-dan YALNIZ server silinməni təsdiqləyəndən sonra çıxarılır.
     Köhnə kod `catch {}` ilə xətanı udub elementi hər halda çıxarırdı —
     cütlük "silindi" görürdü, refresh-də media geri qayıdırdı və admin
     əl ilə uploads qovluğuna girməli olurdu. Bu, 2026-08-31 hadisəsinin
     kök səbəbi idi. */
  const handleDelete = useCallback(async (id) => {
    try {
      await deletePhoto(slug, id)
      setItems(prev => prev.filter(i => i.id !== id))
      setSelected(s => { const n = new Set(s); n.delete(id); return n })
      setPreviewId(p => (p === id ? null : p))
      setNotice({ kind: 'ok', text: 'Silindi.' })
      /* Sayğaclar dərhal düzəlsin — 20 saniyə gözləmək lazım deyil */
      meta.refresh()
    } catch (e) {
      /* Element QALIR — UI serverlə uyğunsuz vəziyyətə düşmür */
      setNotice({ kind: 'error', text: e?.message || 'Silinmə alınmadı.' })
    }
  }, [slug, meta])

  const handleDeleteSelected = async () => {
    const ids = Array.from(selected)
    setDeleting(true)

    const results = await Promise.allSettled(ids.map(id => deletePhoto(slug, id)))
    setDeleting(false)
    setDelConfirm(false)

    const deleted = new Set()
    let firstError = null
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') deleted.add(ids[i])
      else if (!firstError) firstError = r.reason
    })

    /* Yalnız HƏQİQƏTƏN silinənlər siyahıdan çıxır */
    if (deleted.size) setItems(prev => prev.filter(i => !deleted.has(i.id)))
    setSelected(new Set(ids.filter(id => !deleted.has(id))))
    if (deleted.size) meta.refresh()

    const failed = ids.length - deleted.size
    if (failed === 0) {
      setNotice({ kind: 'ok', text: `${deleted.size} fayl silindi.` })
    } else {
      setNotice({
        kind: 'error',
        text: `${failed} fayl silinmədi${deleted.size ? ` (${deleted.size} silindi)` : ''}. `
            + (firstError?.message || 'Yenidən cəhd edin.'),
      })
    }
  }

  const handleHD = async (confirmed = false) => {
    const targets = selected.size > 0 ? items.filter(i => selected.has(i.id)) : items
    if (!targets.length) return
    if (targets.length > HD_WARN_THRESHOLD && !confirmed) {
      setHdAsk(targets.length)
      return
    }
    setHdAsk(null)
    setZipState('loading')
    try {
      await downloadItemsHD(targets)
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
  const goUpload    = () => window.location.assign(`/invite/${slug}/foto`)
  const goSlideshow = () => window.location.assign(`/invite/${slug}/slayd`)

  const featuredCount = items.filter(i => i.featured).length

  /* Qapaq şəkli: cütlüyün seçdiyi fayl adı, data URI, tam ünvan — və ya
     avtomatik olaraq ilk seçilmiş/ən yeni media. */
  const coverUrl = useMemo(() => {
    const raw = meta.config?.coverPhoto
    if (raw) {
      if (raw.startsWith('data:') || raw.startsWith('http') || raw.startsWith('/')) return raw
      const hit = items.find(i => i.id === raw)
      if (hit) return hit.url
    }
    const auto = items.find(i => i.featured && !i.type?.startsWith('video/'))
              || items.find(i => !i.type?.startsWith('video/'))
    return auto ? auto.url : null
  }, [meta.config, items])

  const coverDate = useMemo(
    () => (meta.date ? formatAzDate(meta.date, 'az').formattedDate : ''),
    [meta.date],
  )

  return (
    <div className="dt-site dt-page min-h-screen bg-cream text-brown-dark">
      <GalleryTopBar
        onBack={goBack}
        title="Qonaq Şəkilləri"
        subtitle={`#${slug}`}
        right={loading && !items.length ? '…' : `${items.length} media`}
      />

      {/* ── Üz qapağı (Phase 43) ──
          `coverEnabled: false` seçilibsə göstərilmir. Meta yüklənməyibsə də
          qalereya tam işləyir — qapaq sadəcə olmur. */}
      {meta.config?.coverEnabled !== false && (meta.names || coverUrl) && (
        <GalleryCover
          cover={coverUrl || undefined}
          title={meta.config?.coverTitle || meta.names || meta.title}
          subtitle={meta.config?.coverSubtitle || ''}
          date={coverDate}
          venue={meta.venue}
          photos={meta.counts.photos}
          videos={meta.counts.videos}
          onUpload={goUpload}
          onSlideshow={goSlideshow}
        />
      )}

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-32 pt-6 sm:px-6 sm:pt-8">
        {/* İdarəetmə səlahiyyəti yoxdursa açıq izah — qonaq işləməyəcək
            düymələrə baxmasın, cütlük isə nə etməli olduğunu bilsin */}
        {!canManage && <div className="mb-4"><ViewOnlyNote /></div>}

        <GalleryToolbar
          fileCount={items.length}
          featuredCount={featuredCount}
          formatSummary={(n, s) => (loading && !items.length ? 'Yüklənir…' : s > 0 ? `${n} fayl · ${s} ★` : `${n} fayl`)}
          sort={sort}
          sortOptions={SORTS}
          onSort={setSort}
          onRefresh={fetchItems}
          refreshing={loading}
          /* Slayd şou — hər kəs üçün (yalnız oxuyur), yeni tabda */
          onSlideshow={() => window.open(`/invite/${slug}/slayd`, '_blank', 'noopener')}
          onDownloadAll={items.length > 0 ? () => handleHD() : undefined}
          downloadState={zipState}
          canManage={canManage}
          onStats={() => setStatsOpen(true)}
          onCover={() => setCoverOpen(true)}
        />

        <div className="mt-5">
          {items.length === 0 && !loadedOnce ? (
            <GallerySkeleton />
          ) : items.length === 0 ? (
            <GalleryEmpty onUpload={goUpload} />
          ) : (
            <MasonryGrid
              items={visibleItems}
              getKey={(item) => item.id}
              label="Qonaq şəkilləri"
              hasMore={hasMore}
              onLoadMore={() => setPage(p => p + 1)}
              renderItem={(item, i, { onAspect }) => {
                const isVideo = item.type?.startsWith('video/')
                return (
                  <MediaTile
                    src={isVideo ? item.url : (item.thumbUrl || item.url)}
                    type={isVideo ? 'video' : 'image'}
                    poster={isVideo ? item.posterUrl || undefined : undefined}
                    rejectPoster={isNearlyBlack}
                    alt={item.name}
                    label={`Şəkil ${i + 1} / ${items.length}`}
                    featured={!!item.featured}
                    reactionEmoji={topReactionOf(item.reactions)}
                    reactionCount={item.reactionTotal || 0}
                    selected={selected.has(item.id)}
                    onToggleSelect={() => toggleSelect(item.id)}
                    onOpen={() => setPreviewId(item.id)}
                    canManage={canManage}
                    onFeature={() => { if (!featureBusy) handleFeature(item.id, !item.featured) }}
                    onDownload={() => downloadItem(item)}
                    onDelete={() => setDelOne(item.id)}
                    onAspect={onAspect}
                  />
                )
              }}
            />
          )}
        </div>
      </main>

      {/* Seçim rejimi — HD endirmə hamı üçün, silmə yalnız idarəetmə linki ilə */}
      <SelectionBar
        count={selected.size}
        total={items.length}
        onSelectAll={selectAll}
        onClear={clearSel}
        onDownload={() => handleHD()}
        downloadState={zipState}
        onDelete={canManage ? () => setDelConfirm(true) : undefined}
      />

      <ConfirmDialog
        open={canManage && delConfirm}
        title={`${selected.size} fayl silinəcək — əminsiniz?`}
        text="Silinən şəkil və videolar geri qaytarılmır."
        onConfirm={handleDeleteSelected}
        onCancel={() => setDelConfirm(false)}
        busy={deleting}
      />
      <ConfirmDialog
        open={canManage && delOne !== null}
        title="Bu fayl silinsin?"
        text="Silinən şəkil və ya video geri qaytarılmır."
        onConfirm={() => { const id = delOne; setDelOne(null); handleDelete(id) }}
        onCancel={() => setDelOne(null)}
      />
      <ConfirmDialog
        open={hdAsk !== null}
        destructive={false}
        title={`${hdAsk} şəkil bir-bir endiriləcək`}
        text="Brauzer bir neçə endirməyə icazə istəyə bilər. Davam edək?"
        confirmLabel="Bəli, endir"
        onConfirm={() => handleHD(true)}
        onCancel={() => setHdAsk(null)}
      />

      {/* Əməliyyat bildirişi — silmə uğuru/uğursuzluğu HƏMİŞƏ görünür.
          Yalnız rənglə deyil, mətnlə və ikonla da ifadə olunur. */}
      <Toast
        open={!!notice}
        tone={notice?.kind === 'error' ? 'error' : 'ok'}
        message={notice?.text}
        onClose={() => setNotice(null)}
        duration={6000}
      />

      <GalleryLightbox
        items={items}
        index={previewIndex}
        onIndex={(i) => setPreviewId(items[i]?.id ?? null)}
        slug={slug}
        canManage={canManage}
        onClose={() => setPreviewId(null)}
        onReaction={patchItem}
        onFeature={handleFeature}
        /* Təsdiq pəncərəsi lightbox-un üstündə iki fokus tələsi yaratmasın — əvvəl bağlanır */
        onDelete={(id) => { setPreviewId(null); setDelOne(id) }}
      />

      {/* Statistika + qapaq ayarları — yalnız idarəetmə səlahiyyəti ilə */}
      {canManage && (
        <>
          <GalleryStatsPanel slug={slug} open={statsOpen} onClose={() => setStatsOpen(false)} />
          <GalleryCoverSettings
            open={coverOpen}
            slug={slug}
            config={meta.config}
            items={items}
            names={meta.names}
            onClose={() => setCoverOpen(false)}
            onSaved={() => { meta.refresh(); setNotice({ kind: 'ok', text: 'Qapaq ayarları saxlanıldı.' }) }}
          />
        </>
      )}
    </div>
  )
}
