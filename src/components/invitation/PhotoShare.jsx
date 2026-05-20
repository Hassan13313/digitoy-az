import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImageIcon, Check, X } from 'lucide-react'

export default function PhotoShare() {
  const [files,     setFiles]     = useState([])
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [done,      setDone]      = useState(false)
  const inputRef = useRef()

  const slug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || ''

  const addFiles = (incoming) => {
    const imgs = Array.from(incoming).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...imgs.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      id: Math.random().toString(36).slice(2),
    }))])
  }

  const removeFile = (id) => {
    setFiles(prev => {
      const f = prev.find(f => f.id === id)
      if (f) URL.revokeObjectURL(f.preview)
      return prev.filter(f => f.id !== id)
    })
  }

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 1800))
    setUploading(false)
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(197,160,89,0.08) 0%, transparent 70%)',
      }} />

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="gold-divider mb-8 max-w-[80px] mx-auto" />
          <p className="text-[9px] tracking-[0.38em] uppercase text-gold mb-4 font-medium font-sans">Photo · Share</p>
          <h1 className="font-serif text-3xl text-ink font-light tracking-tight mb-3">
            Şəkillərini Paylaş
          </h1>
          <p className="text-xs text-brown-muted font-light tracking-wide">
            {slug ? `#${slug}` : 'Toy xatirələrini əlavə et'}
          </p>
          <div className="gold-divider mt-8 max-w-[80px] mx-auto" />
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 border border-beige-dark/50 bg-beige/30"
            >
              <div className="w-14 h-14 mx-auto mb-6 border border-gold/40 flex items-center justify-center">
                <Check size={22} className="text-gold" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-xl text-ink font-light mb-2">Təşəkkürlər</h2>
              <p className="text-[11px] tracking-[0.18em] uppercase text-brown-muted font-sans">
                {files.length} şəkil göndərildi
              </p>
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Drop zone */}
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
                style={{
                  border: `1px ${dragging ? 'solid' : 'dashed'} rgba(197,160,89,${dragging ? '0.6' : '0.3'})`,
                  background: dragging ? 'rgba(197,160,89,0.04)' : 'transparent',
                  padding: '40px 24px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  marginBottom: 24,
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
                <div className="flex justify-center mb-4">
                  <div style={{
                    width: 52, height: 52,
                    border: '1px solid rgba(197,160,89,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Upload size={20} className="text-gold/60" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="font-serif text-base text-ink font-light mb-1">Şəkil seç və ya buraya at</p>
                <p className="text-[10px] tracking-[0.16em] uppercase text-brown-muted/60 font-sans">
                  JPG · PNG · HEIC
                </p>
              </div>

              {/* Preview grid */}
              {files.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-8">
                  {files.map((f) => (
                    <div key={f.id} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                      <img
                        src={f.preview}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        onClick={() => removeFile(f.id)}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 22, height: 22,
                          background: 'rgba(0,0,0,0.55)',
                          border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <X size={11} color="white" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => inputRef.current?.click()}
                    style={{
                      aspectRatio: '1', border: '1px dashed rgba(197,160,89,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', background: 'transparent',
                    }}
                  >
                    <ImageIcon size={18} className="text-gold/30" strokeWidth={1} />
                  </button>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!files.length || uploading}
                className="w-full btn-gold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
              >
                {uploading ? (
                  <span className="text-[10px] tracking-[0.22em] uppercase font-sans">Göndərilir…</span>
                ) : (
                  <>
                    <Upload size={12} strokeWidth={1.5} />
                    <span>{files.length > 0 ? `${files.length} Şəkil Göndər` : 'Şəkil Seç'}</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center mt-10 text-[9px] tracking-[0.2em] text-brown-muted/40 uppercase font-sans">
          digitoy.az
        </p>
      </div>
    </div>
  )
}
