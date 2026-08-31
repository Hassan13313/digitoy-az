import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Images, Video, Check, X, Film, ArrowLeft, Upload, RotateCcw,
} from 'lucide-react'
import { uploadPhoto } from '../../utils/api'
import { trackEvent } from '../../utils/analytics'
import {
  MAX_UPLOAD_LABEL, ACCEPT_IMAGE, ACCEPT_VIDEO, ACCEPT_ANY,
  humanSize, validateFile, compressImage, extractVideoPoster,
} from '../../utils/uploadPolicy'

/* Paralel yükləmə işçiləri — sıra ilə (1-bir) yükləmək 50-100 fotoluq
   partiyalarda son dərəcə yavaş idi. Server tərəfdə hələ də "sorğu
   başına 1 fayl" qaydası qüvvədədir (upload_photo.php). */
const MAX_CONCURRENT = 3

/* Yalnız MÜVƏQQƏTİ xətalar üçün. Köhnə kod HƏR uğursuzluğu 2 dəfə
   təkrarlayırdı — 60 MB-lıq video limitə görə rədd olunanda eyni fayl
   3 dəfə göndərilirdi: 180 MB mobil trafik və dəqiqələrlə əbəs gözləmə. */
const MAX_RETRIES = 2

const st = {
  label: {
    fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
    fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 600,
  },
}

/* ── Böyük, aydın seçim düyməsi ──
   Köhnə UI-da tək bir passiv "bura at" sahəsi var idi; tədbir qonağı
   şəkil çəkə biləcəyini, qalereyadan seçə biləcəyini və ya video
   göndərə biləcəyini başa düşmürdü. İndi hər yol ayrıca düymədir.
   Toxunuş sahəsi ≥ 64px, mətn + ikon (yalnız rəngə güvənilmir). */
function ChoiceButton({ icon: Icon, title, hint, onClick }) {
  return (
    <button
      type="button"
      data-press
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        width: '100%', minHeight: 68, padding: '14px 16px',
        border: '1px solid rgba(197,160,89,0.42)',
        background: 'linear-gradient(150deg, #FDFAF4 0%, #F6EFE1 100%)',
        cursor: 'pointer', textAlign: 'left',
        transition: 'border-color 0.18s, background 0.18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.85)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.42)' }}
    >
      <span style={{
        flexShrink: 0, width: 42, height: 42,
        border: '1px solid rgba(197,160,89,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={19} strokeWidth={1.5} style={{ color: 'rgba(160,124,52,1)' }} />
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ ...st.label, display: 'block', color: '#2A2118' }}>{title}</span>
        <span style={{
          display: 'block', marginTop: 3, fontSize: 11,
          color: 'rgba(110,92,70,0.85)',
          fontFamily: '"Inter",system-ui,sans-serif', letterSpacing: '0.01em',
        }}>{hint}</span>
      </span>
    </button>
  )
}

export default function PhotoShare() {
  /* queue elementi: { id, file, preview, poster, status, pct, error } */
  const [queue,     setQueue]     = useState([])
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [done,      setDone]      = useState(false)
  const [rejected,  setRejected]  = useState([])   /* { name, reason } */

  const cameraRef  = useRef()
  const galleryRef = useRef()
  const videoRef   = useRef()
  const queueRef   = useRef(queue)
  const abortRef   = useRef(null)

  useEffect(() => { queueRef.current = queue }, [queue])

  /* Qalan bütün blob preview URL-ləri azad et — istifadəçi yükləmə
     yarımçıq ikən səhifədən çıxsa belə sızma olmur. */
  useEffect(() => () => {
    queueRef.current.forEach(q => { if (q.preview) URL.revokeObjectURL(q.preview) })
    abortRef.current?.abort()
  }, [])

  const slugMatch = window.location.pathname.match(/\/invite\/([^/?#]+)/)
  const slug = slugMatch?.[1] || 'preview'
  const backHref = slugMatch ? `/invite/${slugMatch[1]}#gallery` : null

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
        setQueue(prev => prev.map(q => q.id === id ? { ...q, poster: blob || false } : q))
      }
    })()
    return () => { cancelled = true }
  }, [pendingPosterIds])

  const removeItem = useCallback((id) => {
    setQueue(prev => {
      const item = prev.find(q => q.id === id)
      if (item?.preview) URL.revokeObjectURL(item.preview)
      return prev.filter(q => q.id !== id)
    })
  }, [])

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

        await uploadPhoto(file, slug, {
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

  const openPicker = (ref) => ref.current?.click()

  const resetAll = () => {
    queueRef.current.forEach(q => { if (q.preview) URL.revokeObjectURL(q.preview) })
    setDone(false)
    setQueue([])
    setRejected([])
  }

  return (
    <div className={`min-h-screen bg-cream flex flex-col items-center justify-center px-4 pb-16 ${backHref ? 'pt-24' : 'pt-16'}`}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(197,160,89,0.08) 0%, transparent 70%)',
      }} />

      {backHref && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-cream/88 backdrop-blur-md border-b border-beige-dark/30">
          <div className="max-w-md mx-auto px-4 h-14 flex items-center">
            <a
              href={backHref}
              className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-brown-muted hover:text-gold transition-colors duration-300 font-medium"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              Dəvətnaməyə qayıt
            </a>
          </div>
        </header>
      )}

      {/* Gizli inputlar — hər biri bir yola uyğundur.
          capture="environment" → kamera birbaşa açılır (iOS/Android).
          Kamera mövcud deyilsə brauzer avtomatik fayl seçiciyə keçir. */}
      <input ref={cameraRef}  type="file" accept={ACCEPT_IMAGE} capture="environment"
             className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = '' }} />
      <input ref={galleryRef} type="file" accept={ACCEPT_ANY} multiple
             className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = '' }} />
      <input ref={videoRef}   type="file" accept={ACCEPT_VIDEO} multiple
             className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = '' }} />

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="gold-divider mb-8 max-w-[80px] mx-auto" />
          <p className="text-[9px] tracking-[0.38em] uppercase text-gold mb-4 font-medium font-sans">Photo · Share</p>
          <h1 className="font-serif text-3xl text-ink font-light tracking-tight mb-3">
            Şəkillərini Paylaş
          </h1>
          <p className="text-xs text-brown-muted font-light tracking-wide font-sans">
            #{slug}
          </p>
          <div className="gold-divider mt-8 max-w-[80px] mx-auto" />
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center', padding: '48px 24px',
                border: '1px solid rgba(197,160,89,0.22)',
                background: 'linear-gradient(150deg, #FDFAF4 0%, #F8F3E8 100%)',
              }}
            >
              <div style={{
                width: 52, height: 52, margin: '0 auto 20px',
                border: '1px solid rgba(197,160,89,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={22} style={{ color: 'rgba(197,160,89,0.9)' }} strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-2xl text-ink font-light mb-3">Təşəkkürlər!</h2>
              <p className="text-brown-muted text-sm font-light tracking-wide font-sans mb-2">
                {doneCount} fayl uğurla göndərildi
              </p>
              <p style={{
                fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
                color: 'rgba(197,160,89,0.7)', fontFamily: '"Inter",system-ui,sans-serif',
              }}>
                #{slug}
              </p>
              <button data-press onClick={resetAll} className="mt-8 inline-flex items-center gap-2 btn-gold">
                <Upload size={12} strokeWidth={1.5} />
                Daha Çox Göndər
              </button>
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* ── Üç aydın yol ── */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
                style={{
                  display: 'grid', gap: 8, marginBottom: 14,
                  outline: dragging ? '2px dashed rgba(197,160,89,0.7)' : 'none',
                  outlineOffset: 6,
                }}
              >
                <ChoiceButton icon={Camera} title="Şəkil çək"
                  hint="Kameranı aç və indi çək"
                  onClick={() => openPicker(cameraRef)} />
                <ChoiceButton icon={Images} title="Qalereyadan seç"
                  hint="Şəkil və ya video — birdən çox seçə bilərsiniz"
                  onClick={() => openPicker(galleryRef)} />
                <ChoiceButton icon={Video} title="Video göndər"
                  hint={`Maksimum ${MAX_UPLOAD_LABEL} · MP4 və ya MOV`}
                  onClick={() => openPicker(videoRef)} />
              </div>

              {/* Qəbul şərtləri — fayl seçilməzdən ƏVVƏL görünür */}
              <p style={{
                fontSize: 10.5, lineHeight: 1.6, textAlign: 'center', marginBottom: 18,
                color: 'rgba(120,102,80,0.9)', fontFamily: '"Inter",system-ui,sans-serif',
              }}>
                JPG · PNG · HEIC · MP4 · MOV — fayl başına maks. <strong>{MAX_UPLOAD_LABEL}</strong>
                <br />
                <span style={{ color: 'rgba(140,123,107,0.75)' }}>
                  (təxminən 1080p-də 90 saniyə, 4K-da 25 saniyə video)
                </span>
              </p>

              {/* Qəbul edilməyən fayllar — səbəbi ilə birlikdə */}
              {rejected.length > 0 && (
                <div style={{
                  marginBottom: 14, padding: '11px 14px',
                  border: '1px solid rgba(170,35,35,0.35)',
                  background: 'rgba(170,35,35,0.05)',
                }}>
                  {rejected.map((r, i) => (
                    <p key={i} style={{
                      fontSize: 11, lineHeight: 1.55, color: 'rgba(140,28,28,0.95)',
                      fontFamily: '"Inter",system-ui,sans-serif',
                      marginTop: i ? 6 : 0,
                    }}>
                      <X size={11} strokeWidth={2.5} style={{ display: 'inline', marginRight: 5, verticalAlign: -1 }} />
                      <strong>{r.name}</strong> — {r.reason}
                    </p>
                  ))}
                  <button
                    onClick={() => setRejected([])}
                    style={{
                      ...st.label, marginTop: 9, background: 'none', border: 'none',
                      color: 'rgba(140,28,28,0.7)', cursor: 'pointer', padding: 0, fontSize: 9,
                    }}
                  >
                    Bağla
                  </button>
                </div>
              )}

              {/* ── Seçilmiş fayllar ── */}
              {queue.length > 0 && (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                    <span style={{ ...st.label, fontSize: 9, color: 'rgba(140,123,107,0.8)' }}>
                      {queue.length} fayl seçildi
                    </span>
                    {uploading && (
                      <span style={{ ...st.label, fontSize: 9, color: 'rgba(160,124,52,1)' }}>
                        {overallPct}% · {doneCount}/{queue.length}
                      </span>
                    )}
                  </div>

                  {/* Ümumi tərəqqi zolağı */}
                  {uploading && (
                    <div
                      role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100}
                      style={{ height: 3, background: 'rgba(197,160,89,0.16)', marginBottom: 12 }}
                    >
                      <div style={{
                        width: `${overallPct}%`, height: '100%',
                        background: 'rgba(197,160,89,0.95)', transition: 'width 0.25s ease',
                      }} />
                    </div>
                  )}

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 6, marginBottom: 16,
                  }}>
                    {queue.map(item => (
                      <div key={item.id} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                        {item.preview ? (
                          <img src={item.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            background: 'rgba(20,16,10,0.8)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 4,
                          }}>
                            <Film size={20} style={{ color: 'rgba(197,160,89,0.75)' }} strokeWidth={1} />
                            <span style={{
                              fontSize: 8.5, color: 'rgba(197,160,89,0.75)',
                              fontFamily: '"Inter",system-ui,sans-serif',
                            }}>
                              {humanSize(item.file.size)}
                            </span>
                          </div>
                        )}

                        {/* Fayl üzrə tərəqqi — faiz RƏQƏMLƏ göstərilir */}
                        {(item.status === 'uploading' || item.status === 'retrying') && (
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.55)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}>
                            <span style={{
                              color: 'white', fontSize: 15, fontWeight: 600,
                              fontFamily: '"Inter",system-ui,sans-serif',
                            }}>
                              {item.status === 'retrying' ? '…' : `${item.pct}%`}
                            </span>
                            <div style={{ width: '68%', height: 2, background: 'rgba(255,255,255,0.25)' }}>
                              <div style={{
                                width: `${item.pct}%`, height: '100%',
                                background: 'white', transition: 'width 0.2s ease',
                              }} />
                            </div>
                            {item.status === 'retrying' && (
                              <span style={{ ...st.label, fontSize: 8, color: 'rgba(255,255,255,0.9)' }}>
                                Yenidən
                              </span>
                            )}
                          </div>
                        )}

                        {item.status === 'done' && (
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(120,150,90,0.55)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Check size={22} color="white" strokeWidth={2.5} />
                          </div>
                        )}

                        {item.status === 'error' && (
                          <div
                            title={item.error}
                            style={{
                              position: 'absolute', inset: 0,
                              background: 'rgba(150,30,30,0.62)',
                              display: 'flex', flexDirection: 'column',
                              alignItems: 'center', justifyContent: 'center', gap: 3, padding: 4,
                            }}
                          >
                            <X size={18} color="white" strokeWidth={2.5} />
                            <span style={{
                              ...st.label, fontSize: 7.5, color: 'white',
                              textAlign: 'center', letterSpacing: '0.08em',
                            }}>
                              Alınmadı
                            </span>
                          </div>
                        )}

                        {item.status === 'pending' && !uploading && (
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label="Faylı çıxar"
                            style={{
                              position: 'absolute', top: 3, right: 3,
                              width: 26, height: 26,
                              background: 'rgba(0,0,0,0.68)',
                              border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <X size={12} color="white" strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Uğursuz fayllar — SƏBƏBİ ilə açıq mətn şəklində */}
                  {errorCount > 0 && !uploading && (
                    <div style={{
                      marginBottom: 14, padding: '11px 14px',
                      border: '1px solid rgba(170,35,35,0.35)',
                      background: 'rgba(170,35,35,0.05)',
                    }}>
                      {queue.filter(q => q.status === 'error').map(q => (
                        <p key={q.id} style={{
                          fontSize: 11, lineHeight: 1.55, marginBottom: 4,
                          color: 'rgba(140,28,28,0.95)',
                          fontFamily: '"Inter",system-ui,sans-serif',
                        }}>
                          <strong>{q.file.name}</strong> — {q.error}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── Əsas hərəkət ── */}
              {queue.length > 0 && (
                <button
                  data-press
                  onClick={handleUpload}
                  disabled={toSendCount === 0 || uploading}
                  className="w-full btn-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                  style={{ minHeight: 52 }}
                >
                  {uploading ? (
                    <span>Göndərilir… {overallPct}%</span>
                  ) : errorCount > 0 ? (
                    <><RotateCcw size={13} strokeWidth={1.8} /> {toSendCount} faylı yenidən göndər</>
                  ) : (
                    <><Upload size={13} strokeWidth={1.8} /> {toSendCount} faylı göndər</>
                  )}
                </button>
              )}

              {uploading && (
                <button
                  onClick={cancelUpload}
                  style={{
                    ...st.label, display: 'block', margin: '12px auto 0',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(140,123,107,0.85)', fontSize: 9, padding: 8,
                  }}
                >
                  Ləğv et
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{
          textAlign: 'center', marginTop: 36,
          fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(140,123,107,0.35)', fontFamily: '"Inter",system-ui,sans-serif',
        }}>
          digitoy.az
        </p>
      </div>
    </div>
  )
}
