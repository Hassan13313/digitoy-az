import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImageIcon, Check, X, Film } from 'lucide-react'
import { uploadPhoto } from '../../utils/api'

export default function PhotoShare() {
  const [queue,     setQueue]     = useState([])   // { file, preview, id, status }
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [done,      setDone]      = useState(false)
  const inputRef = useRef()

  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || 'preview'

  const addFiles = useCallback((incoming) => {
    const valid = Array.from(incoming).filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    )
    setQueue(prev => [
      ...prev,
      ...valid.map(f => ({
        file:    f,
        preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
        id:      Math.random().toString(36).slice(2),
        status:  'pending',
      })),
    ])
  }, [])

  const removeItem = useCallback((id) => {
    setQueue(prev => {
      const item = prev.find(q => q.id === id)
      if (item?.preview) URL.revokeObjectURL(item.preview)
      return prev.filter(q => q.id !== id)
    })
  }, [])

  const handleUpload = async () => {
    if (!queue.length || uploading) return
    setUploading(true)

    let successCount = 0
    for (const item of queue) {
      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'uploading' } : q))
      try {
        await uploadPhoto(item.file, slug)
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'done' } : q))
        successCount++
      } catch {
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error' } : q))
      }
    }

    setUploading(false)
    setDone(true)

    if (successCount > 0) {
      setTimeout(() => {
        window.location.href = `/invite/${slug}/qalereya-idare`
      }, 1500)
    }
  }

  const pendingCount = queue.filter(q => q.status === 'pending').length
  const doneCount    = queue.filter(q => q.status === 'done').length

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(197,160,89,0.08) 0%, transparent 70%)',
      }} />

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-10">
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
              <button
                onClick={() => { setDone(false); setQueue([]) }}
                className="mt-8 inline-flex items-center gap-2 btn-gold"
              >
                <Upload size={12} strokeWidth={1.5} />
                Daha Çox Yüklə
              </button>
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Drop zone */}
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
                style={{
                  border: `1px ${dragging ? 'solid' : 'dashed'} rgba(197,160,89,${dragging ? '0.65' : '0.3'})`,
                  background: dragging ? 'rgba(197,160,89,0.05)' : 'transparent',
                  padding: '36px 24px',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s',
                  marginBottom: 20,
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={e => addFiles(e.target.files)}
                />
                <div style={{
                  width: 48, height: 48, margin: '0 auto 14px',
                  border: '1px solid rgba(197,160,89,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Upload size={18} style={{ color: 'rgba(197,160,89,0.65)' }} strokeWidth={1.5} />
                </div>
                <p className="font-serif text-base text-ink font-light mb-1">
                  Şəkil / Video seç və ya bura at
                </p>
                <p style={{
                  fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'rgba(140,123,107,0.55)', fontFamily: '"Inter",system-ui,sans-serif',
                }}>
                  JPG · PNG · HEIC · MP4 · MOV
                </p>
              </div>

              {/* Preview grid */}
              {queue.length > 0 && (
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
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Film size={22} style={{ color: 'rgba(197,160,89,0.7)' }} strokeWidth={1} />
                        </div>
                      )}

                      {/* Status overlay */}
                      {item.status === 'uploading' && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(0,0,0,0.45)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{
                            width: 20, height: 20, border: '2px solid rgba(197,160,89,0.3)',
                            borderTop: '2px solid rgba(197,160,89,0.9)',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }} />
                        </div>
                      )}
                      {item.status === 'done' && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(197,160,89,0.25)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={20} color="white" strokeWidth={2} />
                        </div>
                      )}
                      {item.status === 'error' && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(180,40,40,0.35)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <X size={18} color="white" strokeWidth={2} />
                        </div>
                      )}

                      {/* Remove button */}
                      {item.status === 'pending' && (
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            position: 'absolute', top: 4, right: 4,
                            width: 22, height: 22,
                            background: 'rgba(0,0,0,0.6)',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={11} color="white" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add more */}
                  <button
                    onClick={() => inputRef.current?.click()}
                    style={{
                      aspectRatio: '1',
                      border: '1px dashed rgba(197,160,89,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', background: 'transparent',
                    }}
                  >
                    <ImageIcon size={18} style={{ color: 'rgba(197,160,89,0.3)' }} strokeWidth={1} />
                  </button>
                </div>
              )}

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={pendingCount === 0 || uploading}
                className="w-full btn-gold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
              >
                {uploading ? (
                  <span>Yüklənir… ({doneCount}/{queue.length})</span>
                ) : (
                  <>
                    <Upload size={12} strokeWidth={1.5} />
                    {pendingCount > 0
                      ? `${pendingCount} Faylı Göndər`
                      : 'Fayl Seç'
                    }
                  </>
                )}
              </button>
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
