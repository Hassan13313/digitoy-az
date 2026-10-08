// ════════════════════════════════════════════════════════════════
// 1) Foto yükləmə səhifəsi (qonaq, QR-dan gəlir) — YALNIZ görünüş
//   UploadHero · UploadChoices · UploadLimits · UploadProgress · UploadQueue · UploadQueueItem
//   UploadNotice · UploadDone · DropOverlay
// Fayl seçimi yalnız onFiles(FileList, source) çağırır; yükləmə məntiqi sizdədir.
// ════════════════════════════════════════════════════════════════
import { useId } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Film,
  ImagePlus,
  Images,
  Info,
  RotateCw,
  UploadCloud,
  Video,
  WifiOff,
  X,
} from 'lucide-react';
import { Btn, Eyebrow, Ornament, Spinner } from './shared';
import { FOCUS, formatBytes, formatDuration, formatNumber } from './tokens';

const EASE = [0.22, 1, 0.36, 1];

// ════════════════════════════════════════════════════════════════
/**
 * Səhifənin başı. Qapaq varsa yuxarıda (maks. ~34svh, 3 düymə ilk ekranda qalsın), adlar üstündə;
 * yoxdursa krem fon + ornament.
 * @param {object} p
 * @param {string} [p.cover]              Qapaq şəklinin URL-i
 * @param {string} p.names                «Nicat & Aysel»
 * @param {string} [p.hashtag]            «#aysel-ve-nicat»
 * @param {number} [p.photoCount]         Qalereyadakı foto sayı
 * @param {string} [p.eyebrow='Photo · Share']
 * @param {'az'|'en'|'ru'} [p.eyebrowLang='en']
 * @param {string} [p.title='Şəkillərini Paylaş']
 * @param {(n:number)=>string} [p.formatCount]   Default: «18 foto»
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function UploadHero({
  cover,
  names,
  hashtag,
  photoCount,
  eyebrow = 'Photo · Share',
  eyebrowLang = 'en',
  title = 'Şəkillərini Paylaş',
  formatCount = (n) => `${formatNumber(n)} foto`,
  lang = 'az',
}) {
  const count =
    typeof photoCount === 'number' ? (
      <p lang={lang} className="text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
        {formatCount(photoCount)}
      </p>
    ) : null;

  if (cover) {
    return (
      <header lang={lang} className="relative">
        <div className="relative h-[min(34svh,300px)] min-h-[200px] w-full overflow-hidden bg-espresso">
          <img src={cover} alt="" className="h-full w-full object-cover" />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,15,0.15)_0%,rgba(20,16,15,0.35)_45%,rgba(20,16,15,0.82)_100%)]"
          />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5 text-center">
            <Eyebrow lang={eyebrowLang} tone="light">
              {eyebrow}
            </Eyebrow>
            <p className="mt-2 font-serif text-[34px] font-medium leading-[1.05] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] sm:text-[42px]">
              {names}
            </p>
          </div>
        </div>
        <div className="px-5 pt-6 text-center">
          <h1 className="font-serif text-[30px] font-medium leading-tight text-ink sm:text-[36px]">
            {title}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-3 text-[13.5px] text-brown-dark">
            {hashtag && <span>{hashtag}</span>}
            {hashtag && count && <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold" />}
            {count}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header lang={lang} className="relative overflow-hidden px-5 pb-2 pt-10 text-center sm:pt-14">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 h-[380px] w-[520px] max-w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.45),transparent)]"
      />
      <Ornament />
      <Eyebrow lang={eyebrowLang} className="mt-5">
        {eyebrow}
      </Eyebrow>
      <h1 className="mt-3 font-serif text-[36px] font-medium leading-[1.08] text-ink sm:text-[44px]">
        {title}
      </h1>
      <p className="mt-2 font-serif text-[22px] italic text-brown-dark">{names}</p>
      {hashtag && <p className="mt-1 text-[13.5px] text-brown-dark">{hashtag}</p>}
      {count && <div className="mt-3">{count}</div>}
      <Ornament className="mt-6" />
    </header>
  );
}

// ════════════════════════════════════════════════════════════════
const CHOICE_ICONS = { camera: Camera, gallery: Images, video: Video };

/**
 * Üç böyük seçim: Şəkil çək / Qalereyadan seç / Video göndər.
 * Hər biri gizli <input type="file"> üzərində qurulub → klaviatura və ekran oxuyucu ilə işləyir.
 * @param {object} p
 * @param {(files: FileList, source: 'camera'|'gallery'|'video') => void} p.onFiles
 * @param {boolean} [p.disabled]
 * @param {{id:'camera'|'gallery'|'video', title:string, text:string, accept?:string, capture?:string, multiple?:boolean}[]} [p.options]
 *        Default: ekran şəkillərindəki 3 seçim (mətnlər AZ)
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function UploadChoices({
  onFiles,
  disabled = false,
  options = [
    {
      id: 'camera',
      title: 'Şəkil çək',
      text: 'Kameranı aç və indi çək',
      accept: 'image/*',
      capture: 'environment',
      multiple: false,
    },
    {
      id: 'gallery',
      title: 'Qalereyadan seç',
      text: 'Şəkil və ya video — birdən çox seçə bilərsiniz',
      accept: 'image/*,video/*',
      multiple: true,
    },
    {
      id: 'video',
      title: 'Video göndər',
      text: 'Uzun video olar — maksimum 2 GB · MP4 və ya MOV',
      accept: 'video/mp4,video/quicktime,video/*',
      multiple: true,
    },
  ],
  lang = 'az',
}) {
  return (
    <ul lang={lang} className="grid gap-3">
      {options.map((o, i) => (
        <li key={o.id}>
          <ChoiceCard option={o} primary={i === 0} disabled={disabled} onFiles={onFiles} />
        </li>
      ))}
    </ul>
  );
}

function ChoiceCard({ option, primary, disabled, onFiles }) {
  const id = useId();
  const Icon = CHOICE_ICONS[option.id] ?? ImagePlus;
  return (
    <label
      htmlFor={id}
      className={`group relative flex min-h-[80px] items-center gap-4 rounded-[22px] p-4 pr-3 transition-[transform,box-shadow,background-color] duration-300 ease-luxe sm:p-5 ${
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0'
      } ${
        primary
          ? 'bg-espresso-grad text-cream shadow-lift ring-1 ring-inset ring-gold/30 hover:shadow-luxe'
          : 'bg-white text-ink shadow-soft ring-1 ring-inset ring-beige-dark hover:ring-gold/60 hover:shadow-lift'
      }`}
    >
      <input
        id={id}
        type="file"
        className="peer sr-only"
        accept={option.accept}
        capture={option.capture}
        multiple={option.multiple}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) onFiles?.(e.target.files, option.id);
          e.target.value = '';
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[22px] peer-focus-visible:ring-2 peer-focus-visible:ring-gold-deep peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream"
      />
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
          primary ? 'bg-gold text-espresso' : 'bg-gold-mist text-gold-deep'
        }`}
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span lang="az" className="block text-[13px] font-semibold uppercase tracking-[0.16em]">
          {option.title}
        </span>
        <span className={`mt-1 block text-[14px] leading-snug ${primary ? 'text-sand' : 'text-brown-dark'}`}>
          {option.text}
        </span>
      </span>
      <ChevronRight
        className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 ${primary ? 'text-gold-light' : 'text-gold-deep'}`}
        aria-hidden="true"
      />
    </label>
  );
}

/**
 * Format və limit qeydi.
 * @param {object} p
 * @param {string} [p.formats='JPG · PNG · HEIC · MP4 · MOV']
 * @param {string} [p.maxSize='2 GB']
 * @param {string} [p.perFileLabel='fayl başına maks.']
 * @param {string} [p.resumeText='Böyük fayllar hissə-hissə göndərilir — bağlantı kəsilsə qaldığı yerdən davam edir']
 */
export function UploadLimits({
  formats = 'JPG · PNG · HEIC · MP4 · MOV',
  maxSize = '2 GB',
  perFileLabel = 'fayl başına maks.',
  resumeText = 'Böyük fayllar hissə-hissə göndərilir — bağlantı kəsilsə qaldığı yerdən davam edir',
  lang = 'az',
}) {
  return (
    <div lang={lang} className="text-center text-[13px] leading-relaxed text-brown-dark">
      <p>
        {formats} — {perFileLabel} <strong className="font-semibold text-ink">{maxSize}</strong>
      </p>
      <p className="mt-0.5 text-brown-dark/90">{resumeText}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Ümumi irəliləmə: «12 / 30 göndərildi» + faiz zolağı.
 * @param {object} p
 * @param {number} p.sent              Göndərilmiş fayl sayı
 * @param {number} p.total
 * @param {number} [p.percent]         0–100; verilməsə sent/total
 * @param {boolean} [p.paused]         Offline — zolaq dayanır, «Gözləyir» yazılır
 * @param {(sent:number,total:number)=>string} [p.formatLabel]   Default: «12 / 30 göndərildi»
 * @param {string} [p.pausedLabel='Bağlantı gözlənilir']
 * @param {string} [p.doneLabel='Hamısı göndərildi']
 */
export function UploadProgress({
  sent,
  total,
  percent,
  paused = false,
  formatLabel = (s, t) => `${s} / ${t} göndərildi`,
  pausedLabel = 'Bağlantı gözlənilir',
  doneLabel = 'Hamısı göndərildi',
  lang = 'az',
}) {
  const pct = Math.round(percent ?? (total ? (sent / total) * 100 : 0));
  const done = total > 0 && sent >= total;
  return (
    <div
      lang={lang}
      className="rounded-[22px] bg-white p-4 shadow-soft ring-1 ring-inset ring-beige-dark sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[15px] font-medium text-ink" aria-live="polite">
          <span className="lining-nums tabular-nums">{formatLabel(sent, total)}</span>
        </p>
        <p lang={lang} className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brown-dark">
          {done ? doneLabel : paused ? pausedLabel : <span className="lining-nums tabular-nums">{pct}%</span>}
        </p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-beige"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={formatLabel(sent, total)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            done ? 'bg-olive' : paused ? 'bg-brown-muted' : 'bg-gradient-to-r from-gold-deep to-gold'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Növbə siyahısı.
 * @param {object} p
 * @param {string} [p.title='Göndərilənlər']
 * @param {React.ReactNode} [p.action]   Başlığın sağında (məs. «Hamısını yenidən cəhd et»)
 * @param {React.ReactNode} p.children   <UploadQueueItem/> elementləri
 */
export function UploadQueue({ title = 'Göndərilənlər', action, children, lang = 'az' }) {
  return (
    <section lang={lang} aria-label={title}>
      <div className="mb-3 flex min-h-[44px] items-center justify-between gap-3">
        <h2 lang={lang} className="text-[11.5px] font-semibold uppercase tracking-[0.22em] text-brown-dark">
          {title}
        </h2>
        {action}
      </div>
      <ul className="grid gap-2">{children}</ul>
    </section>
  );
}

const STATUS = {
  pending: { icon: Clock, tone: 'text-brown-dark', ring: 'ring-beige-dark' },
  uploading: { icon: null, tone: 'text-gold-deep', ring: 'ring-gold/40' },
  retrying: { icon: RotateCw, tone: 'text-gold-deep', ring: 'ring-gold/40' },
  done: { icon: Check, tone: 'text-olive', ring: 'ring-olive/25' },
  error: { icon: AlertTriangle, tone: 'text-rust', ring: 'ring-rust/35' },
};

/**
 * Növbədə bir fayl.
 * @param {object} p
 * @param {string} p.name
 * @param {number} [p.size]                       Bayt
 * @param {'image'|'video'} [p.type='image']
 * @param {string} [p.preview]                    Önizləmə URL-i (video üçün kadr)
 * @param {number} [p.duration]                   Video müddəti (saniyə)
 * @param {'pending'|'uploading'|'retrying'|'done'|'error'} p.status
 * @param {number} [p.progress]                   0–100 (uploading)
 * @param {number} [p.attempt] @param {number} [p.maxAttempts]   retrying: «2 / 5»
 * @param {string} [p.error]                      error səbəbi
 * @param {string} [p.warning]                    Xəbərdarlıq (məs. «Video böyükdür…»)
 * @param {()=>void} [p.onRetry]
 * @param {()=>void} [p.onRemove]                 Növbədən sil (verilməsə düymə yoxdur)
 * @param {object} [p.labels]                     { pending, uploading, retrying, done, error, retry, remove }
 */
export function UploadQueueItem({
  name,
  size,
  type = 'image',
  preview,
  duration,
  status,
  progress = 0,
  attempt,
  maxAttempts,
  error,
  warning,
  onRetry,
  onRemove,
  labels = {},
  lang = 'az',
}) {
  const L = {
    pending: 'Gözləyir',
    uploading: 'Göndərilir',
    retrying: 'Yenidən cəhd',
    done: 'Göndərildi',
    error: 'Alınmadı',
    retry: 'Yenidən cəhd et',
    remove: 'Növbədən sil',
    ...labels,
  };
  const s = STATUS[status] ?? STATUS.pending;
  const Icon = s.icon;
  const pct = Math.round(progress);

  return (
    <li lang={lang} className={`rounded-2xl bg-white p-2.5 ring-1 ring-inset ${s.ring} transition-colors`}>
      <div className="flex items-center gap-3">
        {/* önizləmə */}
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-beige">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="grid h-full w-full place-items-center text-gold-deep">
              {type === 'video' ? (
                <Film className="h-5 w-5" aria-hidden="true" />
              ) : (
                <ImagePlus className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
          )}
          {type === 'video' && (
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
              <Film className="h-3 w-3" aria-hidden="true" />
              {formatDuration(duration)}
            </span>
          )}
          {status === 'done' && (
            <span className="absolute inset-0 grid place-items-center bg-olive/45">
              <Check className="h-6 w-6 text-white" strokeWidth={2.6} aria-hidden="true" />
            </span>
          )}
        </span>

        {/* ad + vəziyyət */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-ink" title={name}>
            {name}
          </p>
          <p className={`mt-0.5 flex items-center gap-1.5 text-[12.5px] ${s.tone}`}>
            {status === 'uploading' ? (
              <Spinner className="h-3.5 w-3.5" />
            ) : (
              Icon && (
                <Icon
                  className={`h-3.5 w-3.5 ${status === 'retrying' ? 'animate-spin motion-reduce:animate-none [animation-duration:1.6s]' : ''}`}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )
            )}
            <span className="font-medium">
              {status === 'uploading' ? (
                <>
                  {L.uploading} <span className="lining-nums tabular-nums">{pct}%</span>
                </>
              ) : status === 'retrying' && attempt ? (
                <>
                  {L.retrying}{' '}
                  <span className="lining-nums tabular-nums">
                    ({attempt}
                    {maxAttempts ? ` / ${maxAttempts}` : ''})
                  </span>
                </>
              ) : (
                L[status]
              )}
            </span>
            {size != null && status !== 'error' && (
              <>
                <span aria-hidden="true" className="text-brown-muted">
                  ·
                </span>
                <span className="text-brown-dark/90 lining-nums">{formatBytes(size)}</span>
              </>
            )}
          </p>
          {status === 'error' && error && (
            <p className="mt-0.5 text-[12.5px] leading-snug text-rust">{error}</p>
          )}
          {warning && status !== 'error' && (
            <p className="mt-0.5 flex items-start gap-1 text-[12.5px] leading-snug text-[#7A5A1C]">
              <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              {warning}
            </p>
          )}
        </div>

        {/* hərəkətlər */}
        {status === 'error' && onRetry && (
          <button
            lang={lang}
            type="button"
            onClick={onRetry}
            aria-label={`${L.retry}: ${name}`}
            className={`hidden h-11 shrink-0 items-center gap-1.5 rounded-full bg-espresso px-4 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-espresso-soft min-[420px]:inline-flex ${FOCUS}`}
          >
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            {L.retry}
          </button>
        )}
        {status === 'error' && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            aria-label={`${L.retry}: ${name}`}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-espresso text-cream min-[420px]:hidden ${FOCUS}`}
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        {onRemove && status !== 'uploading' && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`${L.remove}: ${name}`}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-brown-dark transition-colors hover:bg-rust-mist hover:text-rust ${FOCUS}`}
          >
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        )}
      </div>
      {(status === 'uploading' || status === 'retrying') && (
        <div className="mx-0.5 mt-2.5 h-1 overflow-hidden rounded-full bg-beige" aria-hidden="true">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${status === 'retrying' ? 'bg-gold/50' : 'bg-gold-deep'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </li>
  );
}

// ════════════════════════════════════════════════════════════════
const NOTICE = {
  info: {
    icon: Info,
    box: 'bg-white ring-gold/30',
    iconBox: 'bg-gold-mist text-gold-deep',
    role: 'status',
  },
  warning: {
    icon: AlertTriangle,
    box: 'bg-[#FBF3DF] ring-[#C9A24E]/45',
    iconBox: 'bg-[#EBD49A] text-[#5E4512]',
    role: 'status',
  },
  error: {
    icon: AlertTriangle,
    box: 'bg-rust-mist ring-rust/30',
    iconBox: 'bg-rust text-white',
    role: 'alert',
  },
  offline: {
    icon: WifiOff,
    box: 'bg-espresso text-cream ring-gold/25',
    iconBox: 'bg-white/10 text-gold-light',
    role: 'status',
  },
};

/**
 * Bildiriş: məlumat / xəbərdarlıq / xəta (rədd edilən fayllar) / internet kəsildi.
 * @param {object} p
 * @param {'info'|'warning'|'error'|'offline'} [p.tone='info']
 * @param {string} p.title
 * @param {React.ReactNode} [p.children]
 * @param {{name:string, reason:string}[]} [p.items]   Məs. rədd edilən fayllar
 * @param {React.ReactNode} [p.action]
 * @param {()=>void} [p.onDismiss]
 * @param {string} [p.dismissLabel='Bağla']
 */
export function UploadNotice({
  tone = 'info',
  title,
  children,
  items,
  action,
  onDismiss,
  dismissLabel = 'Bağla',
  lang = 'az',
}) {
  const n = NOTICE[tone] ?? NOTICE.info;
  const Icon = n.icon;
  const dark = tone === 'offline';
  return (
    <div lang={lang} role={n.role} className={`rounded-[20px] p-4 ring-1 ring-inset ${n.box}`}>
      <div className="flex items-start gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${n.iconBox}`}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 pt-1">
          <p className={`text-[14.5px] font-semibold ${dark ? 'text-cream' : 'text-ink'}`}>{title}</p>
          {children && (
            <div className={`mt-0.5 text-[13.5px] leading-relaxed ${dark ? 'text-sand' : 'text-brown-dark'}`}>
              {children}
            </div>
          )}
          {items?.length > 0 && (
            <ul className="mt-2 space-y-1">
              {items.map((it, i) => (
                <li key={`${it.name}-${i}`} className="flex flex-wrap gap-x-2 text-[13px]">
                  <span className={`max-w-full truncate font-medium ${dark ? 'text-cream' : 'text-ink'}`}>
                    {it.name}
                  </span>
                  <span className={dark ? 'text-sand' : 'text-brown-dark'}>— {it.reason}</span>
                </li>
              ))}
            </ul>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            className={`-mr-1 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors ${
              dark ? 'text-sand hover:bg-white/10' : 'text-brown-dark hover:bg-black/5'
            } ${FOCUS}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * «Hamısı göndərildi» ekranı.
 * @param {object} p
 * @param {number} [p.count]
 * @param {string} [p.title='Təşəkkür edirik!']
 * @param {(n:number)=>string} [p.formatText]   Default: «18 fayl cütlüyün qalereyasına əlavə olundu.»
 * @param {string} [p.moreLabel='Daha çox göndər']
 * @param {string} [p.galleryLabel='Qalereyaya bax']
 * @param {()=>void} p.onMore
 * @param {()=>void} [p.onGallery]
 */
export function UploadDone({
  count,
  title = 'Təşəkkür edirik!',
  formatText = (n) => `${n} fayl cütlüyün qalereyasına əlavə olundu.`,
  moreLabel = 'Daha çox göndər',
  galleryLabel = 'Qalereyaya bax',
  onMore,
  onGallery,
  lang = 'az',
}) {
  const reduce = useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <section lang={lang} className="flex flex-col items-center px-5 py-10 text-center" role="status">
        <div className="relative h-[150px] w-[180px]" aria-hidden="true">
          <motion.svg
            viewBox="0 0 180 150"
            className="absolute inset-0 h-full w-full"
            fill="none"
            initial={reduce ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* iki polaroid + ürək */}
            <g transform="rotate(-8 70 80)">
              <rect
                x="30"
                y="34"
                width="70"
                height="82"
                rx="4"
                fill="#FFFDF8"
                stroke="#C5A059"
                strokeWidth="1.4"
              />
              <rect x="38" y="42" width="54" height="50" rx="2" fill="#F3EAD3" />
            </g>
            <g transform="rotate(7 110 76)">
              <rect
                x="80"
                y="28"
                width="70"
                height="82"
                rx="4"
                fill="#FFFDF8"
                stroke="#C5A059"
                strokeWidth="1.4"
              />
              <rect x="88" y="36" width="54" height="50" rx="2" fill="#EADCBF" />
            </g>
            <motion.path
              d="M90 128 c-14 -10 -22 -17 -22 -26 c0 -6 5 -10 10 -10 c5 0 9 3 12 7 c3 -4 7 -7 12 -7 c5 0 10 4 10 10 c0 9 -8 16 -22 26 z"
              fill="#9A3B2E"
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              style={{ transformOrigin: '90px 112px' }}
              transition={{
                delay: 0.35,
                type: 'spring',
                stiffness: 320,
                damping: 14,
              }}
            />
          </motion.svg>
          {!reduce &&
            [
              [14, 20, 0.2],
              [164, 14, 0.5],
              [170, 96, 0.8],
              [6, 100, 1.1],
            ].map(([x, y, d]) => (
              <motion.span
                key={`${x}-${y}`}
                className="absolute h-2 w-2 rotate-45 bg-gold"
                style={{ left: x, top: y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.4], scale: [0, 1, 0.8] }}
                transition={{ delay: d, duration: 1.4 }}
              />
            ))}
        </div>
        <h2 className="mt-6 font-serif text-[34px] font-medium leading-tight text-ink">{title}</h2>
        {typeof count === 'number' && (
          <p className="mt-2 max-w-[32ch] text-[15.5px] leading-relaxed text-brown-dark">
            {formatText(count)}
          </p>
        )}
        <div className="mt-8 grid w-full max-w-[360px] gap-3">
          <Btn variant="primary" size="lg" icon={ImagePlus} onClick={onMore}>
            {moreLabel}
          </Btn>
          {onGallery && (
            <Btn variant="ghost" size="lg" icon={Images} onClick={onGallery}>
              {galleryLabel}
            </Btn>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Fayl ekran üzərində sürüklənəndə tam ekran örtük (desktop). `useWindowFileDrop()` ilə istifadə edin.
 * Dekorativdir: buraxma hadisəsini hook tutur.
 * @param {object} p
 * @param {boolean} p.active
 * @param {string} [p.title='Faylları buraya buraxın']
 * @param {string} [p.text='Şəkil və videolar dərhal növbəyə əlavə olunacaq']
 */
export function DropOverlay({
  active,
  title = 'Faylları buraya buraxın',
  text = 'Şəkil və videolar dərhal növbəyə əlavə olunacaq',
  lang = 'az',
}) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {active && (
          <motion.div
            lang={lang}
            aria-live="polite"
            className="pointer-events-none fixed inset-0 z-[90] grid place-items-center bg-espresso/70 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex w-full max-w-[520px] flex-col items-center rounded-[32px] border-2 border-dashed border-gold-light/70 bg-cream/95 px-8 py-14 text-center shadow-luxe"
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-espresso text-gold-light">
                <UploadCloud className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="mt-5 font-serif text-[30px] leading-tight text-ink">{title}</p>
              <p className="mt-2 text-[14.5px] text-brown-dark">{text}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
