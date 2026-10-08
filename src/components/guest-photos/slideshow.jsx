// ════════════════════════════════════════════════════════════════
// 6) TV slayd şou (zalda, 1920×1080, saatlarla açıq qalır) — YALNIZ görünüş
//   SlideshowStage · SlideshowHeader · SlideshowControls · NewMediaBadge · QrCorner · SlideshowEmpty
// Ölçülər vw/vh ilə miqyaslanır: 1080p-də mətn 3–5 m-dən oxunur, QR ≥ 200px.
// Şəkil heç vaxt QR kartının altında qalmır: QR açıq olanda şəkil sahəsi hər iki yandan daralır.
// ════════════════════════════════════════════════════════════════
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  ImagePlus,
  Maximize,
  Minimize,
  Pause,
  Play,
  Star,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAutoDismiss, useIdle, useKeys } from './hooks';
import { Spinner } from './shared';
import { FOCUS_DARK } from './tokens';

/** QR kartının eni (şəkil sahəsi bu qədər daralır) */
const QR_RESERVE = 'clamp(220px, 17vw, 340px)';

/**
 * @typedef {{id:string, type?:'image'|'video', src:string, poster?:string, featured?:boolean}} SlideItem
 */

/**
 * Tam ekran səhnə.
 * @param {object} p
 * @param {SlideItem[]} p.items
 * @param {number} p.index
 * @param {number} [p.seconds=6]           Bir şəklin müddəti (irəliləmə zolağı + Ken Burns)
 * @param {boolean} [p.playing=true]
 * @param {boolean} [p.loading]
 * @param {string} p.names                 «Nicat & Aysel»
 * @param {string} [p.date]                «19.09.2026»
 * @param {boolean} [p.showQr=true]
 * @param {string} [p.uploadUrl]           QR-ın linki
 * @param {number} [p.newCount]            Yeni gələn media sayı (0 → nişan yoxdur)
 * @param {()=>void} [p.onNewSeen]         Nişan sönəndə
 * @param {()=>void} p.onPrev @param {()=>void} p.onNext @param {()=>void} p.onTogglePlay
 * @param {()=>void} [p.onFullscreen] @param {boolean} [p.isFullscreen]
 * @param {()=>void} p.onClose
 * @param {number} [p.idleMs=4000]         İdarəetmə bu müddətdən sonra gizlənir
 * @param {object} [p.labels]              { qrTitle, qrText, emptyTitle, emptyText, loading, newMedia:(n)=>string, … }
 */
export default function SlideshowStage({
  items = [],
  index = 0,
  seconds = 6,
  playing = true,
  loading = false,
  names,
  date,
  showQr = true,
  uploadUrl,
  newCount = 0,
  onNewSeen,
  onPrev,
  onNext,
  onTogglePlay,
  onFullscreen,
  isFullscreen = false,
  onClose,
  idleMs = 4000,
  labels = {},
  lang = 'az',
}) {
  const reduce = useReducedMotion();
  const awake = useIdle(idleMs);
  const item = items[index];
  const empty = !loading && items.length === 0;
  const qrVisible = showQr && !!uploadUrl;

  useKeys({
    ArrowLeft: () => onPrev?.(),
    ArrowRight: () => onNext?.(),
    ' ': () => onTogglePlay?.(),
    f: () => onFullscreen?.(),
    F: () => onFullscreen?.(),
  });

  return (
    <MotionConfig reducedMotion="user">
      <div
        lang={lang}
        role="region"
        aria-roledescription={labels.region ?? 'slayd şou'}
        aria-label={names}
        className={`fixed inset-0 z-[100] h-[100svh] w-screen overflow-hidden bg-black text-cream ${awake ? '' : 'cursor-none'}`}
      >
        {/* bulanıq fon — şəklin öz rəngləri */}
        <AnimatePresence initial={false}>
          {item && (
            <motion.img
              key={`bg-${item.id}`}
              src={item.poster || item.src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-125 object-cover blur-[60px] saturate-[1.15]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.2 : 1.6 }}
            />
          )}
        </AnimatePresence>
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15),rgba(0,0,0,0.7))]"
        />

        {/* şəkil sahəsi — QR açıqdırsa hər iki yandan daralır, mərkəzdə qalır */}
        {item && (
          <div
            className="absolute"
            style={{
              top: '13vh',
              bottom: '8vh',
              left: qrVisible ? QR_RESERVE : '3vw',
              right: qrVisible ? QR_RESERVE : '3vw',
            }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={item.id}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.2 : 1.2, ease: 'easeInOut' }}
              >
                <div
                  className="relative flex h-full w-full items-center justify-center"
                  style={
                    reduce
                      ? undefined
                      : {
                          animation: `slideshowKen ${seconds + 1.2}s linear forwards`,
                          animationPlayState: playing ? 'running' : 'paused',
                        }
                  }
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      poster={item.poster}
                      muted
                      autoPlay={!reduce}
                      loop
                      playsInline
                      className="max-h-full max-w-full rounded-[6px] object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt=""
                      className="max-h-full max-w-full rounded-[6px] object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
                    />
                  )}
                  {item.type === 'video' && (
                    <span
                      lang={lang}
                      className="absolute bottom-[2vh] left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-[clamp(14px,1vw,20px)] font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur"
                    >
                      <Film className="h-[1.2em] w-[1.2em]" aria-hidden="true" />
                      {labels.video ?? 'Video'}
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {!empty && (
          <SlideshowHeader
            names={names}
            date={date}
            index={index}
            total={items.length}
            featured={item?.featured}
            featuredLabel={labels.featured}
          />
        )}

        {loading && (
          <div className="absolute inset-0 grid place-items-center" role="status">
            <div className="flex flex-col items-center gap-5">
              <Spinner className="h-12 w-12 text-gold-light" />
              <p className="font-serif text-[clamp(28px,2.4vw,48px)] text-cream">{names}</p>
              <p className="sr-only">{labels.loading ?? 'Yüklənir'}</p>
            </div>
          </div>
        )}

        {empty && (
          <SlideshowEmpty
            names={names}
            date={date}
            uploadUrl={uploadUrl}
            title={labels.emptyTitle}
            text={labels.emptyText}
            qrLabel={labels.qrTitle}
          />
        )}

        {qrVisible && !empty && (
          <QrCorner uploadUrl={uploadUrl} title={labels.qrTitle} text={labels.qrText} />
        )}

        <NewMediaBadge count={newCount} onDone={onNewSeen} format={labels.newMedia} />

        {/* irəliləmə zolağı */}
        {item && !empty && (
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
            <span
              key={`${item.id}-${index}`}
              className="block h-full origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-light"
              style={{
                animation: `slideshowProgress ${seconds}s linear forwards`,
                animationPlayState: playing ? 'running' : 'paused',
              }}
            />
            <style>
              {
                '@keyframes slideshowProgress{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes slideshowKen{from{transform:scale(1)}to{transform:scale(1.06)}}'
              }
            </style>
          </div>
        )}

        <SlideshowControls
          visible={awake}
          playing={playing}
          onPrev={onPrev}
          onNext={onNext}
          onTogglePlay={onTogglePlay}
          onFullscreen={onFullscreen}
          isFullscreen={isFullscreen}
          onClose={onClose}
          labels={labels}
          disabledNav={items.length < 2}
        />
      </div>
    </MotionConfig>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Sol yuxarıda adlar + tarix, sağ yuxarıda «1 / 18 ★».
 * @param {object} p
 * @param {string} p.names @param {string} [p.date]
 * @param {number} p.index @param {number} p.total @param {boolean} [p.featured]
 * @param {string} [p.featuredLabel='Seçilmiş']
 */
export function SlideshowHeader({ names, date, index, total, featured, featuredLabel = 'Seçilmiş' }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-6 bg-gradient-to-b from-black/55 to-transparent px-[3vw] pb-[6vh] pt-[3.5vh]">
      <div>
        <p className="font-serif text-[clamp(28px,2.6vw,58px)] font-medium leading-none text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
          {names}
        </p>
        {date && (
          <p
            lang="az"
            className="mt-[1.2vh] text-[clamp(13px,0.95vw,20px)] font-semibold uppercase tracking-[0.3em] text-gold-light lining-nums"
          >
            {date}
          </p>
        )}
      </div>
      {total > 0 && (
        <p className="flex items-center gap-[0.6vw] text-[clamp(16px,1.2vw,26px)] font-semibold tracking-[0.12em] text-cream lining-nums tabular-nums">
          {index + 1} / {total}
          {featured && (
            <>
              <Star className="h-[1em] w-[1em] fill-gold-light text-gold-light" aria-hidden="true" />
              <span className="sr-only">{featuredLabel}</span>
            </>
          )}
        </p>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Alt mərkəzdə idarəetmə — yalnız siçan/pult hərəkətində görünür (useIdle).
 * Gizli olanda da klaviatura ilə işləyir (← → Boşluq Esc F).
 * @param {object} p
 * @param {boolean} p.visible
 * @param {boolean} p.playing
 * @param {()=>void} p.onPrev @param {()=>void} p.onNext @param {()=>void} p.onTogglePlay
 * @param {()=>void} [p.onFullscreen] @param {boolean} [p.isFullscreen]
 * @param {()=>void} p.onClose
 * @param {boolean} [p.disabledNav]
 * @param {object} [p.labels]   { prev, next, play, pause, fullscreen, exitFullscreen, close }
 */
export function SlideshowControls({
  visible,
  playing,
  onPrev,
  onNext,
  onTogglePlay,
  onFullscreen,
  isFullscreen,
  onClose,
  disabledNav,
  labels = {},
}) {
  const L = {
    prev: 'Əvvəlki',
    next: 'Növbəti',
    play: 'Davam et',
    pause: 'Dayandır',
    fullscreen: 'Tam ekran',
    exitFullscreen: 'Tam ekrandan çıx',
    close: 'Bağla',
    ...labels,
  };
  const btn = `grid h-14 w-14 place-items-center rounded-full text-cream transition-colors hover:bg-white/15 disabled:opacity-40 ${FOCUS_DARK}`;
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[4vh] z-20 flex justify-center"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.35 }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <div className="flex items-center gap-1 rounded-full bg-black/55 p-1.5 ring-1 ring-inset ring-white/15 backdrop-blur-xl">
        <button
          type="button"
          onClick={onPrev}
          disabled={disabledNav}
          aria-label={L.prev}
          className={btn}
          tabIndex={visible ? 0 : -1}
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playing ? L.pause : L.play}
          className={`grid h-16 w-16 place-items-center rounded-full bg-gold text-espresso transition-colors hover:bg-[#CDA963] ${FOCUS_DARK}`}
          tabIndex={visible ? 0 : -1}
        >
          {playing ? (
            <Pause className="h-6 w-6 fill-espresso" aria-hidden="true" />
          ) : (
            <Play className="ml-1 h-6 w-6 fill-espresso" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={disabledNav}
          aria-label={L.next}
          className={btn}
          tabIndex={visible ? 0 : -1}
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
        {onFullscreen && (
          <>
            <span aria-hidden="true" className="mx-1 h-8 w-px bg-white/20" />
            <button
              type="button"
              onClick={onFullscreen}
              aria-label={isFullscreen ? L.exitFullscreen : L.fullscreen}
              className={btn}
              tabIndex={visible ? 0 : -1}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Maximize className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={L.close}
          className={btn}
          tabIndex={visible ? 0 : -1}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * «+2 yeni şəkil» — yuxarı mərkəzdə çıxır və özü sönür.
 * @param {object} p
 * @param {number} p.count
 * @param {()=>void} [p.onDone]
 * @param {number} [p.duration=5000]
 * @param {(n:number)=>string} [p.format]   Default: «+2 yeni şəkil»
 */
export function NewMediaBadge({ count = 0, onDone, duration = 5000, format = (n) => `+${n} yeni şəkil` }) {
  useAutoDismiss(count > 0, duration, onDone);
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[4vh] z-30 flex justify-center"
      aria-live="polite"
    >
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-[0.6vw] rounded-full bg-gold px-[1.6vw] py-[1vh] text-[clamp(16px,1.25vw,26px)] font-semibold text-espresso shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]"
          >
            <ImagePlus className="h-[1.1em] w-[1.1em]" strokeWidth={2} aria-hidden="true" />
            {(format ?? ((n) => `+${n} yeni şəkil`))(count)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Sağ aşağı küncdə QR kartı. QR ağ fonda, 4 modul boşluqla (quiet zone) — tünd fonda da oxunur.
 * 1080p-də QR ölçüsü ≈ 200px (3–5 m məsafədən skan olunur).
 * @param {object} p
 * @param {string} p.uploadUrl
 * @param {string} [p.title='Şəkil göndər']
 * @param {string} [p.text='Kameranı QR-a tut — şəklin bir azdan bu ekranda']
 */
export function QrCorner({
  uploadUrl,
  title = 'Şəkil göndər',
  text = 'Kameranı QR-a tut — şəklin bir azdan bu ekranda',
}) {
  return (
    <div
      className="absolute bottom-[4vh] right-[2vw] z-10 flex flex-col items-center rounded-[clamp(18px,1.4vw,28px)] bg-black/45 p-[clamp(12px,0.9vw,18px)] text-center ring-1 ring-inset ring-gold-light/30 backdrop-blur-xl"
      style={{ width: `calc(${QR_RESERVE} - 4vw)` }}
    >
      <div className="w-full rounded-[clamp(10px,0.8vw,16px)] bg-white p-[clamp(10px,0.85vw,18px)]">
        <QRCodeSVG
          value={uploadUrl}
          level="M"
          marginSize={2}
          bgColor="#FFFFFF"
          fgColor="#111111"
          className="block h-auto w-full"
          title={title}
        />
      </div>
      <p className="mt-[1.4vh] font-serif text-[clamp(20px,1.6vw,34px)] font-medium leading-none text-white">
        {title}
      </p>
      <p className="mt-[0.8vh] text-[clamp(12px,0.82vw,17px)] leading-snug text-sand">{text}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Hələ şəkil yoxdur — QR ekranın mərkəzində, böyük.
 * @param {object} p
 * @param {string} p.names @param {string} [p.date]
 * @param {string} [p.uploadUrl]
 * @param {string} [p.title='Qonaqlar QR kodu skan edən kimi şəkillər burada görünəcək']
 * @param {string} [p.text='Kameranı QR-a tut və toyun ilk şəklini sən göndər']
 * @param {string} [p.qrLabel='Şəkil göndər']
 */
export function SlideshowEmpty({
  names,
  date,
  uploadUrl,
  title = 'Qonaqlar QR kodu skan edən kimi şəkillər burada görünəcək',
  text = 'Kameranı QR-a tut və toyun ilk şəklini sən göndər',
  qrLabel = 'Şəkil göndər',
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#3A312D_0%,#1A1513_70%)] px-[6vw]">
      <div className="flex max-w-[1500px] flex-col items-center justify-center gap-[4vh] text-center md:flex-row md:gap-[5vw] md:text-left">
        {uploadUrl && (
          <div className="shrink-0 rounded-[clamp(18px,1.6vw,32px)] bg-white p-[clamp(14px,1.2vw,26px)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
            <QRCodeSVG
              value={uploadUrl}
              level="M"
              marginSize={2}
              className="block h-auto"
              style={{ width: 'clamp(240px, 22vw, 440px)' }}
              title={qrLabel}
            />
          </div>
        )}
        <div className="max-w-[min(46vw,860px)] max-md:max-w-[40ch]">
          <p
            lang="az"
            className="text-[clamp(13px,0.95vw,20px)] font-semibold uppercase tracking-[0.3em] text-gold-light"
          >
            {qrLabel}
          </p>
          <p className="mt-[1.6vh] font-serif text-[clamp(32px,3.2vw,68px)] font-medium leading-[1.08] text-white [text-wrap:balance]">
            {title}
          </p>
          <p className="mt-[2vh] text-[clamp(16px,1.3vw,28px)] leading-snug text-sand">{text}</p>
          <p className="mt-[4vh] font-serif text-[clamp(22px,1.8vw,38px)] italic text-gold-light">
            {names}
            {date && (
              <span className="ml-4 text-[0.7em] not-italic tracking-[0.2em] text-sand lining-nums">
                {date}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
