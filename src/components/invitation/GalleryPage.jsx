import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, CheckSquare, Square, Download,
  ImagePlus, X, Check, RotateCcw, Film, ArrowLeft,
  Star, MonitorPlay, ArrowDownUp, BarChart3, Settings2,
} from 'lucide-react'
import {
  getPhotos, deletePhoto, storeGalleryKey, canManageGallery,
  getVisitorId, setMediaFeatured, trackGalleryEvent,
} from '../../utils/api'
import { downloadItemsHD, downloadItem } from '../../utils/photoGallery'
import { trackEvent } from '../../utils/analytics'
import { useGalleryMeta } from '../../hooks/useGalleryMeta'
import GalleryCover from './GalleryCover'
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
   «çirklənir» və oxunmur — o halda poster olduğu kimi saxlanılır. */
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

/* ── Lazy media cell ── */
function LazyMedia({ item, selected, canManage, onToggle, onDelete, onPreview, onFeature, featureBusy }) {
  const ref = useRef()
  const [vis, setVis] = useState(false)
  const [hov, setHov] = useState(false)
  const isVideo = item.type?.startsWith('video/')
  /* Video posteri varsa real kadr göstərilir. Poster yoxdursa, sınıqdırsa
     və ya qaradırsa `posterBad` → kadr videonun özündən (yalnız metadata). */
  const poster  = isVideo ? item.posterUrl : null
  const [posterBad, setPosterBad] = useState(false)

  /* Reaksiya xülasəsi — xanada YALNIZ göstərici (4 düymə 120px-lik xanaya
     sığmır və toxunuş hədəfləri bir-birinə girərdi). Tam reaksiya çubuğu
     lightbox-dadır, yəni qonaq şəkli açıb rahat seçir. */
  const topReaction = useMemo(() => {
    const entries = Object.entries(item.reactions || {})
    if (!entries.length) return null
    return entries.sort((a, b) => b[1] - a[1])[0][0]
  }, [item.reactions])

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
          position: 'relative', width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(20,16,10,0.88)',
        }}>
          {poster && !posterBad && (
            <img
              src={poster} alt={item.name}
              loading="lazy" decoding="async"
              onLoad={(e) => { if (isNearlyBlack(e.currentTarget)) setPosterBad(true) }}
              onError={() => setPosterBad(true)}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
              }}
            />
          )}
          {/* Poster yoxdur, açılmır və ya QARADIR (2026-09-28 öncəki yükləmələr) →
              brauzer kadrı videonun özündən çəkir. Yalnız metadata + bir kadr
              endirilir; video oynadılmır. `#t=1` iOS Safari-də də kadrı göstərir
              (1 s-dən qısa videoda brauzer son kadra düşür). */}
          {(!poster || posterBad) && (
            <video
              src={`${item.url}#t=1`}
              preload="metadata" muted playsInline disablePictureInPicture
              tabIndex={-1} aria-hidden="true"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none',
              }}
            />
          )}
          {/* Film nişanı kadrın üzərində qalır — bunun video olduğu aydın olsun */}
          <div style={{
            position: 'relative', width: 38, height: 38, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
          }}>
            <Film size={22} style={{ color: 'rgba(255,255,255,0.92)' }} strokeWidth={1.2} />
          </div>
        </div>
      ) : (
        <img
          src={item.thumbUrl || item.url} alt={item.name}
          loading="lazy" decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ))}

      {/* Seçilmiş nişanı — hover-dən ASILI DEYİL, həmişə görünür */}
      {item.featured && (
        <div
          aria-label="Seçilmiş"
          style={{
            position: 'absolute', top: 6, right: 6,
            width: 22, height: 22, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(197,160,89,0.92)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.4)',
          }}
        >
          <Star size={12} strokeWidth={2} color="#FFF" fill="#FFF" />
        </div>
      )}

      {/* Reaksiya xülasəsi */}
      {item.reactionTotal > 0 && (
        <div style={{
          position: 'absolute', bottom: 6, left: 6,
          display: 'flex', alignItems: 'center', gap: 3,
          padding: '2px 7px 2px 5px', borderRadius: 999,
          background: 'rgba(12,9,6,0.62)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        }}>
          <span aria-hidden="true" style={{
            fontSize: 11,
            fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
          }}>
            {topReaction}
          </span>
          <span style={{
            fontSize: 9.5, fontWeight: 600, color: '#FFF',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {item.reactionTotal}
          </span>
        </div>
      )}

      {/* Hover overlay — toxunuş cihazlarında onMouseEnter/Leave heç vaxt
          tetiklənmir, ona görə seçilmiş element üçün də göstəririk
          (sil/yüklə düymələri toxunuşla əlçatan olsun) */}
      <AnimatePresence>
        {(hov || selected) && (
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
            {/* Seçilmiş işarəsi — yalnız idarəetmə səlahiyyəti olanda */}
            {canManage && (
            <button
              onClick={() => onFeature(item.id, !item.featured)}
              disabled={featureBusy}
              aria-label={item.featured ? 'Seçilmişdən çıxar' : 'Seçilmiş et'}
              aria-pressed={!!item.featured}
              style={{
                width: 34, height: 34, borderRadius: 2,
                background: item.featured ? 'rgba(197,160,89,0.95)' : 'rgba(255,255,255,0.22)',
                border: 'none', cursor: featureBusy ? 'default' : 'pointer',
                opacity: featureBusy ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Star size={14} color="white" strokeWidth={2} fill={item.featured ? 'white' : 'none'} />
            </button>
            )}

            {/* Silmə yalnız idarəetmə səlahiyyəti olanda görünür — qonaq
                heç vaxt işləməyəcək düyməyə baxmır (əvvəl 401 alırdı) */}
            {canManage && (
            <button
              onClick={() => onDelete(item.id)}
              aria-label="Şəkli sil"
              style={{
                width: 34, height: 34, borderRadius: 2,
                background: 'rgba(170,35,35,0.88)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Trash2 size={14} color="white" strokeWidth={2} />
            </button>
            )}
            <button
              data-press
              onClick={() => downloadItem(item)}
              aria-label="Şəkli HD endir"
              style={{
                width: 34, height: 34, borderRadius: 2,
                background: 'rgba(197,160,89,0.9)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Download size={14} color="white" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkbox — hover-dən asılı olmadan həmişə görünür, çünki toxunuş
          cihazlarında hover vəziyyəti heç vaxt baş vermir (seçim mexanizmi
          mobil/tablette əlçatan olmalıdır) */}
      <div
        onClick={e => { e.stopPropagation(); onToggle(item.id) }}
        style={{
          position: 'absolute', top: 6, left: 6,
          opacity: selected ? 1 : 0.85,
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

/* ── Toolbar button ── */
function Btn({ children, danger, disabled, onClick, style: extraStyle = {} }) {
  return (
    <button
      type="button"
      data-press
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
  const [preview,  setPreview]  = useState(null)
  const [page,     setPage]     = useState(1)
  const [zipState, setZipState] = useState('idle')
  const [delConfirm, setDelConfirm] = useState(false)
  const [notice,   setNotice]   = useState(null)   /* { kind:'error'|'ok', text } */
  const sentinelRef = useRef()

  /* ── Phase 43 vəziyyəti ── */
  const [sort,        setSort]        = useState('featured')
  const [sortOpen,    setSortOpen]    = useState(false)
  const [featureBusy, setFeatureBusy] = useState(false)
  const [statsOpen,   setStatsOpen]   = useState(false)
  const [coverOpen,   setCoverOpen]   = useState(false)

  /* Qonaq kimliyi — reaksiyaların «bir qonaq · bir səs» qaydası üçün.
     ŞƏXSİ MƏLUMAT DEYİL (bax utils/api.js › getVisitorId). */
  const visitor = useMemo(() => getVisitorId(), [])

  /* Üz qapağı + canlı sayğaclar */
  const meta = useGalleryMeta(slug)

  /* Bildirişlər özləri sönür — istifadəçi əl ilə bağlamalı olmasın */
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 6000)
    return () => clearTimeout(t)
  }, [notice])

  /* Serverdən yüklə */
  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const photos = await getPhotos(slug, { sort, visitor })
      setItems(photos)
    } catch { /* server əlçatmaz */ }
    finally { setLoading(false) }
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

  /* ── Tək elementi yerində yenilə (reaksiya / seçim) ──
     Bütün siyahını yenidən çəkmək əvəzinə yalnız dəyişən element əvəz
     olunur: 500 medialı qalereyada bu, fərqi hiss olunan şəkildə saxlayır.
     Açıq lightbox da eyni obyekti göstərdiyi üçün onunla sinxronlaşır. */
  const patchItem = useCallback((id, fields) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...fields } : i)))
    setPreview(p => (p && p.id === id ? { ...p, ...fields } : p))
  }, [])

  /* ── Lightbox-da növbəti / əvvəlki media ──
     `navDir` keçid animasiyasının istiqamətidir (sola/sağa sürüşmə). */
  const [navDir, setNavDir] = useState(0)
  const previewIndex = preview ? items.findIndex(i => i.id === preview.id) : -1
  const stepPreview = useCallback((delta) => {
    const i = preview ? items.findIndex(x => x.id === preview.id) : -1
    const target = i >= 0 ? items[i + delta] : null
    if (!target) return
    setNavDir(delta)
    setPreview(target)
  }, [items, preview])

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
      setPreview(p => (p && p.id === id ? null : p))
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
    setDelConfirm(false)

    const results = await Promise.allSettled(ids.map(id => deletePhoto(slug, id)))

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

  const HD_WARN_THRESHOLD = 15
  const handleHD = async () => {
    const targets = selected.size > 0 ? items.filter(i => selected.has(i.id)) : items
    if (!targets.length) return
    if (targets.length > HD_WARN_THRESHOLD &&
        !window.confirm(`${targets.length} şəkil bir-bir endiriləcək. Brauzer bir neçə endirməyə icazə istəyə bilər. Davam edək?`)) {
      return
    }
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

  const CARD = {
    border: '1px solid rgba(197,160,89,0.18)',
    background: 'linear-gradient(150deg, #FDFAF4 0%, #F8F3E8 100%)',
  }

  const featuredCount = items.filter(i => i.featured).length
  const sortLabel = SORTS.find(s => s.id === sort)?.label || SORTS[0].label

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

          <div style={{ textAlign: 'center', minWidth: 0 }}>
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

      {/* ── Üz qapağı (Phase 43) ──
          `coverEnabled: false` seçilibsə göstərilmir. Meta yüklənməyibsə də
          qalereya tam işləyir — qapaq sadəcə olmur. */}
      {meta.config?.coverEnabled !== false && (meta.names || coverUrl) && (
        <GalleryCover
          names={meta.config?.coverTitle || meta.names}
          title={meta.title}
          date={meta.date}
          venue={meta.venue}
          photos={meta.counts.photos}
          videos={meta.counts.videos}
          coverUrl={coverUrl}
          subtitle={meta.config?.coverSubtitle || ''}
        >
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              data-press
              href={`/invite/${slug}/foto`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                minHeight: 42, padding: '0 18px',
                background: 'rgba(197,160,89,0.95)', color: '#1A1408',
                textDecoration: 'none', borderRadius: 2,
                fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
              }}
            >
              <ImagePlus size={13} strokeWidth={2} />
              Şəkil göndər
            </a>
            <a
              data-press
              href={`/invite/${slug}/slayd`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                minHeight: 42, padding: '0 18px',
                background: 'rgba(255,255,255,0.1)', color: '#FFF',
                border: '1px solid rgba(197,160,89,0.5)',
                textDecoration: 'none', borderRadius: 2,
                fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
              }}
            >
              <MonitorPlay size={13} strokeWidth={1.8} />
              Slayd şou
            </a>
          </div>
        </GalleryCover>
      )}

      {/* ── Main content ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Əməliyyat bildirişi — silmə uğuru/uğursuzluğu HƏMİŞƏ görünür.
            Yalnız rənglə deyil, mətnlə də ifadə olunur (accessibility). */}
        <AnimatePresence>
          {notice && (
            <motion.div
              role="status" aria-live="polite"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                marginBottom: 14, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                border: `1px solid ${notice.kind === 'error' ? 'rgba(170,35,35,0.4)' : 'rgba(197,160,89,0.4)'}`,
                background: notice.kind === 'error' ? 'rgba(170,35,35,0.06)' : 'rgba(197,160,89,0.06)',
                fontSize: 12, lineHeight: 1.5,
                color: notice.kind === 'error' ? 'rgba(140,28,28,0.95)' : 'rgba(90,70,35,0.95)',
              }}
            >
              {notice.kind === 'error'
                ? <X size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
                : <Check size={15} strokeWidth={2} style={{ flexShrink: 0 }} />}
              <span>{notice.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* İdarəetmə səlahiyyəti yoxdursa açıq izah — qonaq işləməyəcək
            düymələrə baxmasın, cütlük isə nə etməli olduğunu bilsin */}
        {!canManage && (
          <div style={{
            marginBottom: 14, padding: '12px 16px',
            border: '1px solid rgba(197,160,89,0.28)',
            background: 'rgba(197,160,89,0.04)',
            fontSize: 12, lineHeight: 1.6, color: 'rgba(110,92,70,0.95)',
          }}>
            Baxış rejimi — şəkilləri görə, endirə və reaksiya verə bilərsiniz.
            Silmək və seçilmiş etmək üçün sizə göndərilən <strong>idarəetmə linki</strong> ilə daxil olun.
          </div>
        )}

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
              {featuredCount > 0 && <span style={{ color: 'rgba(197,160,89,0.9)' }}> · {featuredCount} ★</span>}
            </span>
            <Btn onClick={fetchItems} disabled={loading}>
              <RotateCcw size={11} strokeWidth={1.5} />
              Yenilə
            </Btn>

            {/* Sıralama seçicisi (Phase 43) */}
            {items.length > 1 && (
              <div style={{ position: 'relative' }}>
                <Btn onClick={() => setSortOpen(o => !o)}>
                  <ArrowDownUp size={11} strokeWidth={1.5} />
                  {sortLabel}
                </Btn>
                {sortOpen && (
                  <>
                    <div
                      onClick={() => setSortOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 60 }}
                    />
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 61,
                      background: '#FDFAF4', border: '1px solid rgba(197,160,89,0.34)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 178,
                    }}>
                      {SORTS.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setSort(s.id); setSortOpen(false) }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 7, width: '100%',
                            minHeight: 40, padding: '0 13px', border: 'none',
                            background: sort === s.id ? 'rgba(197,160,89,0.12)' : 'transparent',
                            cursor: 'pointer', textAlign: 'left',
                            fontSize: 11, color: 'rgba(90,74,54,0.95)',
                            fontFamily: '"Inter",system-ui,sans-serif',
                          }}
                        >
                          {sort === s.id
                            ? <Check size={11} strokeWidth={2.4} style={{ color: 'rgba(160,126,54,1)' }} />
                            : <span style={{ width: 11 }} />}
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

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
            {/* Slayd şou — hər kəs üçün (yalnız oxuyur) */}
            <Btn onClick={() => window.open(`/invite/${slug}/slayd`, '_blank', 'noopener')}>
              <MonitorPlay size={11} strokeWidth={1.5} />
              Slayd şou
            </Btn>

            {/* Statistika + qapaq ayarları — yalnız idarəetmə səlahiyyəti ilə */}
            {canManage && (
              <>
                <Btn onClick={() => setStatsOpen(true)}>
                  <BarChart3 size={11} strokeWidth={1.5} />
                  Statistika
                </Btn>
                <Btn onClick={() => setCoverOpen(true)}>
                  <Settings2 size={11} strokeWidth={1.5} />
                  Qapaq
                </Btn>
              </>
            )}

            {canManage && selected.size > 0 && !delConfirm && (
              <Btn danger onClick={() => setDelConfirm(true)}>
                <Trash2 size={11} strokeWidth={1.5} />
                Seçilənləri Sil ({selected.size})
              </Btn>
            )}

            {canManage && delConfirm && (
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
                onClick={handleHD}
                disabled={zipState === 'loading'}
                style={{ minWidth: 190 }}
              >
                {zipState === 'done'   ? <><Check size={11} strokeWidth={2} /> Endirildi!</> :
                 zipState === 'error'  ? <><X size={11} strokeWidth={2} /> Xəta baş verdi</> :
                 zipState === 'loading' ? <><Download size={11} strokeWidth={1.5} /> Endirilir…</> :
                 <><Download size={11} strokeWidth={1.5} />
                   {selected.size > 0 ? `${selected.size} şəkli HD formatda endir` : 'HD formatda endir'}
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
                  canManage={canManage}
                  onToggle={toggleSelect}
                  onDelete={handleDelete}
                  onPreview={setPreview}
                  onFeature={handleFeature}
                  featureBusy={featureBusy}
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

      {/* Lightbox — sürüşdürmə ilə bütün siyahı boyunca (grid-in yalnız
          görünən hissəsi yox: `items` tam siyahıdır, səhifələmə yalnız çəkilişdir) */}
      <AnimatePresence>
        {preview && (
          <GalleryLightbox
            item={preview}
            index={previewIndex}
            total={items.length}
            dir={navDir}
            prevItem={previewIndex > 0 ? items[previewIndex - 1] : null}
            nextItem={previewIndex >= 0 ? items[previewIndex + 1] || null : null}
            slug={slug}
            canManage={canManage}
            onClose={() => setPreview(null)}
            onPrev={() => stepPreview(-1)}
            onNext={() => stepPreview(1)}
            onReaction={patchItem}
            onFeature={handleFeature}
          />
        )}
      </AnimatePresence>

      {/* Statistika paneli */}
      <AnimatePresence>
        {statsOpen && <GalleryStatsPanel slug={slug} onClose={() => setStatsOpen(false)} />}
      </AnimatePresence>

      {/* Qapaq ayarları */}
      <AnimatePresence>
        {coverOpen && (
          <GalleryCoverSettings
            slug={slug}
            config={meta.config}
            items={items}
            names={meta.names}
            onClose={() => setCoverOpen(false)}
            onSaved={() => { meta.refresh(); setNotice({ kind: 'ok', text: 'Qapaq ayarları saxlanıldı.' }) }}
          />
        )}
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
