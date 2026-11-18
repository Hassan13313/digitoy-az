/* ══════════════════════════════════════════════════
   VİDEO paketi — nümunə üslubların seçimi (2026-11-18)

   • Kart = seçim düyməsi (aria-pressed); «Bax» ayrıca düymədir və videonu
     pəncərədə açır — MP4 YALNIZ bu klikdən sonra yüklənir.
   • Videolar və posterlər saytın özündədir: public/video/samples/.
══════════════════════════════════════════════════ */
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Play, X } from 'lucide-react'
import { VIDEO_SAMPLES, samplePoster, sampleVideo, sampleTitle } from '../../data/videoSamples'
import { useBodyScrollLock, useFocusTrap } from '../guest-photos/hooks'
import { videoCopy } from '../../data/videoOrderCopy'

export default function VideoSamplePicker({ lang = 'az', value, onChange, error }) {
  const c = videoCopy(lang)
  const [open, setOpen] = useState(null)

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-describedby={error ? 'video-sample-error' : undefined}>
        {VIDEO_SAMPLES.map((s) => {
          const selected = value === s.id
          const title = sampleTitle(s, lang)
          return (
            <li key={s.id} className="relative">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(s.id)}
                className={`group block w-full rounded-2xl p-1.5 text-left ring-1 ring-inset transition-[box-shadow,background-color] duration-300 ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep ${
                  selected ? 'bg-gold-mist/70 shadow-soft ring-2 ring-espresso' : 'bg-white ring-beige-dark hover:ring-gold/60 hover:shadow-soft'
                }`}
              >
                <span className="relative block aspect-[9/16] overflow-hidden rounded-[12px] bg-beige">
                  <img
                    src={samplePoster(s)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {selected && (
                    <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-espresso text-gold-light shadow-soft">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span className="block px-1.5 pb-1 pt-2.5">
                  <span className={`block text-[13.5px] font-semibold leading-snug ${selected ? 'text-ink' : 'text-brown-dark'}`}>{title}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-brown-dark/75">{s.note[lang] || s.note.az}</span>
                </span>
              </button>
              {/* «Bax» — seçim düyməsinin QARDAŞIdır (iç-içə düymə olmur) */}
              <button
                type="button"
                onClick={() => setOpen(s)}
                aria-label={c.watchAria(title)}
                className="absolute left-3 top-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-espresso/85 pl-2.5 pr-3.5 text-[12px] font-semibold text-cream shadow-lift backdrop-blur-sm transition-colors hover:bg-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
              >
                <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} aria-hidden="true" />
                {c.watch}
              </button>
            </li>
          )
        })}
      </ul>
      {error && (
        <p id="video-sample-error" role="alert" className="mt-3 text-[13px] text-rust">{error}</p>
      )}
      <p className="mt-4 text-[13px] leading-snug text-brown-dark/85">{c.samplesNote}</p>

      {open && (
        <SampleDialog
          sample={open}
          lang={lang}
          selected={value === open.id}
          onChoose={() => { onChange(open.id); setOpen(null) }}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  )
}

function SampleDialog({ sample, lang, selected, onChoose, onClose }) {
  const c = videoCopy(lang)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const title = sampleTitle(sample, lang)

  /* Tab pəncərədən çıxmır, Esc bağlayır, bağlananda fokus «Bax»-a qayıdır */
  useFocusTrap(dialogRef, true, { onEscape: onClose, initialFocus: closeRef })
  useBodyScrollLock(true)

  /* Portal: builder kartı framer-motion `transform`-u daşıyır — onun içində
     `position: fixed` ekrana yox, karta bağlanırdı (pəncərə kəsilirdi) */
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[220] flex items-center justify-center bg-espresso/75 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex max-h-full w-full max-w-[380px] flex-col overflow-hidden rounded-[24px] bg-cream shadow-luxe ring-1 ring-gold/25">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="min-w-0 truncate font-serif text-[19px] text-ink">{title}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={c.close}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-brown-dark transition-colors hover:bg-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
          >
            <X className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
        {/* 9:16 — ekrana sığsın deyə hündürlük də məhdudlaşdırılır */}
        <div className="mx-auto aspect-[9/16] w-full max-h-[62vh] max-w-[calc(62vh*9/16)] bg-espresso">
          <video
            src={sampleVideo(sample)}
            poster={samplePoster(sample)}
            autoPlay
            muted
            loop
            playsInline
            controls
            aria-label={title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <button
            type="button"
            onClick={onChoose}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-espresso-grad px-6 text-[12px] font-semibold uppercase tracking-label text-cream shadow-lift ring-1 ring-inset ring-gold/30 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
          >
            <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            {selected ? c.chosen : c.chooseThis}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
