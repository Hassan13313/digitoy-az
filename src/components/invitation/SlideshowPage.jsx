import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  Sparkles, ImagePlus, X, Star,
} from 'lucide-react'
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
      ekranda yalnız xatirələr qalsın.

   ⚠ Bu route TAMAMİLƏ YENİDİR: /invite/:slug, /foto və /qalereya-idare
   ünvanlarına toxunmur.
   ══════════════════════════════════════════════════ */

const REFRESH_MS   = 20000    /* yeni media yoxlaması */
const IDLE_HIDE_MS = 4000     /* idarəetmənin gizlənməsi */
const VIDEO_MAX_MS = 30000    /* uzun videonu kəs — slayd şou dayanmasın */

/* ── Tək kadr ── */
function Slide({ item, active, seconds }) {
  const isVideo = item.type?.startsWith('video/')
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Bulanıq fon — şəklin nisbəti ekrana uyğun gəlməyəndə qara zolaqlar
          yerinə şəklin özünün rəngləri görünür (proyektorda çox daha yaxşıdır) */}
      {!isVideo && (
        <img
          src={item.thumbUrl || item.url} alt="" aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'blur(38px) brightness(0.42)',
            transform: 'scale(1.12)',
          }}
        />
      )}

      {isVideo ? (
        <video
          src={item.url}
          poster={item.posterUrl || undefined}
          autoPlay muted playsInline
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      ) : (
        /* Ken Burns — yavaş böyümə kadrı canlandırır, amma diqqəti dağıtmır.
           `prefers-reduced-motion` CSS-i bunu söndürür (aşağıdaki <style>). */
        <motion.img
          src={item.url}
          alt={item.name || ''}
          initial={{ scale: 1.0 }}
          animate={{ scale: active ? 1.07 : 1.0 }}
          transition={{ duration: seconds + 1.2, ease: 'linear' }}
          className="slide-kenburns"
          style={{
            position: 'relative',
            maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
            boxShadow: '0 30px 90px rgba(0,0,0,0.6)',
          }}
        />
      )}
    </motion.div>
  )
}

export default function SlideshowPage() {
  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || 'preview'

  const [items,   setItems]   = useState([])
  const [meta,    setMeta]    = useState(null)
  const [index,   setIndex]   = useState(0)
  const [playing, setPlaying] = useState(true)
  const [ready,   setReady]   = useState(false)
  const [fs,      setFs]      = useState(false)
  const [uiVisible, setUiVisible] = useState(true)
  const [newBadge,  setNewBadge]  = useState(0)

  /* Aktual dəyərləri interval-ın içindən oxumaq üçün (kapan problemi) */
  const itemsRef = useRef([])
  const idleRef  = useRef(null)
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

  /* «Yeni şəkil» nişanı öz-özünə sönür */
  useEffect(() => {
    if (!newBadge) return
    const t = setTimeout(() => setNewBadge(0), 9000)
    return () => clearTimeout(t)
  }, [newBadge])

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

  /* ── İdarəetmə 4 saniyədən sonra gizlənir ── */
  const poke = useCallback(() => {
    setUiVisible(true)
    clearTimeout(idleRef.current)
    idleRef.current = setTimeout(() => setUiVisible(false), IDLE_HIDE_MS)
  }, [])

  useEffect(() => {
    poke()
    const evs = ['pointermove', 'pointerdown', 'keydown']
    evs.forEach(e => window.addEventListener(e, poke))
    return () => {
      evs.forEach(e => window.removeEventListener(e, poke))
      clearTimeout(idleRef.current)
    }
  }, [poke])

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
    const onKey = (e) => {
      if (e.key === ' ')            { e.preventDefault(); setPlaying(p => !p) }
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft')  prev()
      else if (e.key.toLowerCase() === 'f') toggleFs()
      else if (e.key === 'Escape' && document.fullscreenElement) setFs(false)
    }
    const onFsChange = () => setFs(Boolean(document.fullscreenElement))
    window.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('fullscreenchange', onFsChange)
    }
  }, [next, prev, toggleFs])

  const dateLabel = meta?.date ? formatAzDate(meta.date, 'az').formattedDate : ''

  const btn = {
    width: 42, height: 42, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(255,255,255,0.09)',
    border: '1px solid rgba(197,160,89,0.34)',
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
    color: 'rgba(255,255,255,0.92)', cursor: 'pointer',
    transition: 'background 0.18s',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: '#070503',
        overflow: 'hidden',
        cursor: uiVisible ? 'default' : 'none',
        fontFamily: '"Inter",system-ui,sans-serif',
      }}
    >
      {/* ── Kadrlar ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <AnimatePresence initial={false}>
          {current && <Slide item={current} active={playing} seconds={seconds} />}
        </AnimatePresence>
      </div>

      {/* ── Boş / yüklənir ── */}
      {ready && visible.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center',
          padding: 24,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            border: '1px solid rgba(197,160,89,0.34)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ImagePlus size={26} strokeWidth={1} style={{ color: 'rgba(197,160,89,0.62)' }} />
          </div>
          <p style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
            fontSize: 'clamp(20px, 5vw, 30px)', fontWeight: 300, color: 'rgba(255,255,255,0.78)',
            margin: 0,
          }}>
            Hələ şəkil yoxdur
          </p>
          <p style={{
            fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(197,160,89,0.6)',
          }}>
            Qonaqlar QR kodu skan edən kimi şəkillər burada görünəcək
          </p>
        </div>
      )}
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(197,160,89,0.55)',
          }}>
            Yüklənir…
          </span>
        </div>
      )}

      {/* ── Üst başlıq (adlar + sayğac) ── */}
      <motion.div
        animate={{ opacity: uiVisible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: 'clamp(14px, 3vw, 26px) clamp(16px, 4vw, 34px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 14, pointerEvents: uiVisible ? 'auto' : 'none',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
        }}
      >
        <div style={{ minWidth: 0 }}>
          {meta?.names && (
            <p style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 'clamp(17px, 3.4vw, 27px)', fontWeight: 300,
              color: 'rgba(255,255,255,0.96)', margin: 0, lineHeight: 1.15,
              textShadow: '0 2px 18px rgba(0,0,0,0.6)',
            }}>
              {meta.names}
            </p>
          )}
          {dateLabel && (
            <p style={{
              fontSize: 'clamp(8px, 1.6vw, 10px)', letterSpacing: '0.26em',
              textTransform: 'uppercase', color: 'rgba(197,160,89,0.9)', marginTop: 5,
            }}>
              {dateLabel}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Yeni yükləmə nişanı */}
          <AnimatePresence>
            {newBadge > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 13px', borderRadius: 999,
                  background: 'rgba(197,160,89,0.22)',
                  border: '1px solid rgba(197,160,89,0.55)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <Sparkles size={12} strokeWidth={1.6} style={{ color: 'rgba(233,205,148,1)' }} />
                <span style={{ fontSize: 10.5, letterSpacing: '0.1em', color: '#FFF', fontWeight: 600 }}>
                  +{newBadge} yeni
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <span style={{
            fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.6)',
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
          }}>
            {visible.length ? `${(index % visible.length) + 1} / ${visible.length}` : '—'}
          </span>

          {current?.featured && (
            <Star size={13} strokeWidth={1.6} style={{ color: 'rgba(233,205,148,1)', fill: 'rgba(233,205,148,0.9)' }} />
          )}
        </div>
      </motion.div>

      {/* ── Alt idarəetmə ── */}
      <motion.div
        animate={{ opacity: uiVisible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(16px, 3vw, 28px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          pointerEvents: uiVisible ? 'auto' : 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
        }}
      >
        <button type="button" onClick={prev} aria-label="Əvvəlki" style={btn}>
          <ChevronLeft size={19} strokeWidth={1.6} />
        </button>
        <button
          type="button" onClick={() => setPlaying(p => !p)}
          aria-label={playing ? 'Dayandır' : 'Oynat'}
          style={{ ...btn, width: 52, height: 52, background: 'rgba(197,160,89,0.26)' }}
        >
          {playing ? <Pause size={21} strokeWidth={1.6} /> : <Play size={21} strokeWidth={1.6} />}
        </button>
        <button type="button" onClick={next} aria-label="Növbəti" style={btn}>
          <ChevronRight size={19} strokeWidth={1.6} />
        </button>
        <button type="button" onClick={toggleFs} aria-label="Tam ekran" style={{ ...btn, marginLeft: 8 }}>
          {fs ? <Minimize2 size={17} strokeWidth={1.6} /> : <Maximize2 size={17} strokeWidth={1.6} />}
        </button>
        <a
          href={`/invite/${slug}/qalereya-idare`}
          aria-label="Qalereyaya qayıt"
          style={{ ...btn, textDecoration: 'none' }}
        >
          <X size={17} strokeWidth={1.6} />
        </a>
      </motion.div>

      {/* İrəliləyiş zolağı — növbəti kadra nə qədər qaldığını göstərir */}
      {playing && visible.length > 1 && !isVideo && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            key={`${index}-${seconds}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: seconds, ease: 'linear' }}
            style={{ height: '100%', background: 'rgba(197,160,89,0.9)' }}
          />
        </div>
      )}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .slide-kenburns { transform: none !important; }
        }
      `}</style>
    </div>
  )
}
