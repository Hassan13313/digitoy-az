// ════════════════════════════════════════════════════════════════
// 2) Qalereya səhifəsi — YALNIZ görünüş
//   GalleryTopBar · GalleryCover · ViewOnlyNote · GalleryToolbar · SortMenu · DownloadButton
//   SelectionBar · GalleryEmpty · GallerySkeleton · Toast
// ════════════════════════════════════════════════════════════════
import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  ImagePlus,
  Presentation,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { useAutoDismiss } from './hooks';
import { Btn, Eyebrow, Ornament, Spinner } from './shared';
import { FOCUS, FOCUS_DARK, GLASS_DARK, formatNumber } from './tokens';

const EASE = [0.22, 1, 0.36, 1];

// ════════════════════════════════════════════════════════════════
/**
 * Yapışqan yuxarı panel.
 * @param {object} p
 * @param {()=>void} p.onBack
 * @param {string} [p.backLabel='Geri']
 * @param {string} [p.title='Qonaq Şəkilləri']
 * @param {string} [p.subtitle]          «#aysel-ve-nicat»
 * @param {React.ReactNode} [p.right]    Sağ tərəf (məs. «18 media»)
 */
export function GalleryTopBar({
  onBack,
  backLabel = 'Geri',
  title = 'Qonaq Şəkilləri',
  subtitle,
  right,
  lang = 'az',
}) {
  return (
    <header
      lang={lang}
      className="sticky top-0 z-40 border-b border-gold/20 bg-cream/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto grid h-14 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:h-16 sm:px-6">
        <div>
          {onBack && (
            <button
              lang={lang}
              type="button"
              onClick={onBack}
              className={`inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-brown-dark transition-colors hover:text-ink ${FOCUS}`}
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
              <span className="hidden min-[420px]:inline">{backLabel}</span>
              <span className="sr-only min-[420px]:hidden">{backLabel}</span>
            </button>
          )}
        </div>
        <div className="min-w-0 text-center">
          {title && (
            <p className="truncate font-serif text-[20px] leading-none text-ink sm:text-[22px]">{title}</p>
          )}
          {subtitle && (
            <p
              lang={lang}
              className="mt-1 truncate text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep"
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          lang={lang}
          className="flex justify-end text-[11px] font-semibold uppercase tracking-[0.18em] text-brown-dark"
        >
          {right}
        </div>
      </div>
    </header>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Üz qapağı. Qapaq şəkli varsa tam enli, üstündə adlar; yoxdursa krem fon + ornament.
 * @param {object} p
 * @param {string} [p.cover]
 * @param {string} [p.eyebrow='Xatirə qalereyası']
 * @param {string} p.title                 «Nicat & Aysel»
 * @param {string} [p.subtitle]            Alt yazı (ayarlardan)
 * @param {string} [p.date]                «19.09.2026»
 * @param {string} [p.venue]               «Buta Palace, Bakı»
 * @param {number} [p.photos] @param {number} [p.videos]
 * @param {(photos:number, videos:number)=>string} [p.formatCounts]  Default: «18 foto · 2 video»
 * @param {()=>void} [p.onUpload]          «Şəkil göndər»
 * @param {()=>void} [p.onSlideshow]       «Slayd şou»
 * @param {string} [p.uploadLabel='Şəkil göndər'] @param {string} [p.slideshowLabel='Slayd şou']
 */
export function GalleryCover({
  cover,
  eyebrow = 'Xatirə qalereyası',
  title,
  subtitle,
  date,
  venue,
  photos,
  videos,
  formatCounts = (p, v) =>
    [p ? `${formatNumber(p)} foto` : null, v ? `${formatNumber(v)} video` : null].filter(Boolean).join(' · '),
  onUpload,
  onSlideshow,
  uploadLabel = 'Şəkil göndər',
  slideshowLabel = 'Slayd şou',
  lang = 'az',
}) {
  const meta = [date, venue].filter(Boolean).join(' · ');
  const counts = formatCounts(photos, videos);
  const dark = !!cover;

  const body = (
    <div className="relative mx-auto flex max-w-[720px] flex-col items-center px-5 text-center">
      <Eyebrow lang={lang} tone={dark ? 'light' : 'gold'}>
        {eyebrow}
      </Eyebrow>
      <h1
        className={`mt-4 font-serif text-[44px] font-medium leading-[1.02] [text-wrap:balance] sm:text-[64px] ${
          dark ? 'text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]' : 'text-ink'
        }`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className={`mt-3 font-serif text-[19px] italic ${dark ? 'text-white/90' : 'text-brown-dark'}`}>
          {subtitle}
        </p>
      )}
      {meta && (
        <p
          lang={lang}
          className={`mt-3 text-[12px] font-medium uppercase tracking-[0.22em] lining-nums ${dark ? 'text-white/85' : 'text-brown-dark'}`}
        >
          {meta}
        </p>
      )}
      <Ornament tone={dark ? 'light' : 'gold'} className="mt-5" />
      {counts && (
        <p
          lang={lang}
          className={`mt-5 inline-flex h-9 items-center rounded-full px-4 text-[12px] font-semibold uppercase tracking-[0.18em] lining-nums ${
            dark
              ? 'bg-black/30 text-cream ring-1 ring-inset ring-white/20 backdrop-blur-md'
              : 'bg-white text-brown-dark ring-1 ring-inset ring-gold/35'
          }`}
        >
          {counts}
        </p>
      )}
      {(onUpload || onSlideshow) && (
        <div className="mt-6 flex w-full flex-col gap-2.5 min-[420px]:w-auto min-[420px]:flex-row">
          {onUpload && (
            <Btn variant="gold" size="lg" icon={ImagePlus} onClick={onUpload} dark={dark}>
              {uploadLabel}
            </Btn>
          )}
          {onSlideshow && (
            <Btn
              variant={dark ? 'glass' : 'ghost'}
              size="lg"
              icon={Presentation}
              onClick={onSlideshow}
              dark={dark}
            >
              {slideshowLabel}
            </Btn>
          )}
        </div>
      )}
    </div>
  );

  if (!cover) {
    return (
      <section lang={lang} className="relative overflow-hidden border-b border-gold/15 py-14 sm:py-20">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 h-[460px] w-[640px] max-w-[160vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.45),transparent)]"
        />
        {body}
      </section>
    );
  }

  return (
    <section
      lang={lang}
      className="relative isolate flex min-h-[min(64svh,600px)] items-center overflow-hidden bg-espresso py-14"
    >
      <img src={cover} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(20,16,15,0.55)_0%,rgba(20,16,15,0.72)_70%),linear-gradient(180deg,rgba(20,16,15,0.2),rgba(20,16,15,0.6))]"
      />
      <div className="w-full">{body}</div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Qonaq üçün yığcam «baxış rejimi» izahı (açılan «Ətraflı» ilə).
 * @param {object} p
 * @param {string} [p.title='Baxış rejimi']
 * @param {string} [p.text='Şəkillərə baxa, endirə və reaksiya verə bilərsiniz.']
 * @param {string} [p.more='Silmək və seçilmiş etmək üçün sizə göndərilən idarəetmə linki ilə daxil olun.']
 * @param {string} [p.moreLabel='Ətraflı']
 */
export function ViewOnlyNote({
  title = 'Baxış rejimi',
  text = 'Şəkillərə baxa, endirə və reaksiya verə bilərsiniz.',
  more = 'Silmək və seçilmiş etmək üçün sizə göndərilən idarəetmə linki ilə daxil olun.',
  moreLabel = 'Ətraflı',
  lang = 'az',
}) {
  return (
    <details
      lang={lang}
      className="group rounded-2xl bg-white/80 ring-1 ring-inset ring-gold/30 open:bg-white"
    >
      <summary
        className={`flex min-h-[48px] cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-2 text-[13.5px] [&::-webkit-details-marker]:hidden ${FOCUS}`}
      >
        <Eye className="h-[18px] w-[18px] shrink-0 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
        <span className="min-w-0 flex-1 text-brown-dark">
          <strong className="font-semibold text-ink">{title}</strong> — {text}
        </span>
        {more && (
          <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-gold-deep">
            <span className="hidden sm:inline">{moreLabel}</span>
            <ChevronDown
              className="h-4 w-4 transition-transform duration-300 group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        )}
      </summary>
      {more && <p className="px-4 pb-3.5 pl-[46px] text-[13.5px] leading-relaxed text-brown-dark">{more}</p>}
    </details>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * HD endirmə düyməsi — 4 vəziyyət.
 * @param {object} p
 * @param {'idle'|'loading'|'done'|'error'} [p.state='idle']
 * @param {()=>void} p.onClick
 * @param {boolean} [p.dark]       Tünd fonda (SelectionBar)
 * @param {boolean} [p.iconOnlyOnMobile]
 * @param {object} [p.labels]      { idle:'HD formatda endir', loading:'Endirilir…', done:'Endirildi!', error:'Alınmadı — yenidən' }
 */
export function DownloadButton({
  state = 'idle',
  onClick,
  dark = false,
  iconOnlyOnMobile = false,
  labels = {},
  className = '',
}) {
  const L = {
    idle: 'HD formatda endir',
    loading: 'Endirilir…',
    done: 'Endirildi!',
    error: 'Alınmadı — yenidən',
    ...labels,
  };
  const icon =
    state === 'loading' ? (
      <Spinner className="h-4 w-4" />
    ) : state === 'done' ? (
      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
    ) : state === 'error' ? (
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
    ) : (
      <Download className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
    );
  const tone = dark
    ? state === 'error'
      ? 'bg-rust text-white'
      : state === 'done'
        ? 'bg-olive text-white'
        : 'bg-white/10 text-cream ring-1 ring-inset ring-white/20 hover:bg-white/20'
    : state === 'error'
      ? 'bg-rust-mist text-rust ring-1 ring-inset ring-rust/30'
      : state === 'done'
        ? 'bg-olive-mist text-olive ring-1 ring-inset ring-olive/25'
        : 'bg-white text-gold-deep ring-1 ring-inset ring-gold/40 hover:bg-gold-mist/60';
  return (
    <button
      lang="az"
      type="button"
      onClick={onClick}
      disabled={state === 'loading'}
      aria-live="polite"
      aria-label={iconOnlyOnMobile ? L[state] : undefined}
      className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-[11.5px] font-semibold uppercase tracking-[0.12em] transition-colors disabled:cursor-wait ${
        iconOnlyOnMobile ? 'w-11 sm:w-auto sm:px-4' : 'px-4'
      } ${dark ? FOCUS_DARK : FOCUS} ${tone} ${className}`}
    >
      {icon}
      <span className={iconOnlyOnMobile ? 'hidden sm:inline' : ''}>{L[state]}</span>
    </button>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Sıralama menyusu (menu + menuitemradio). Ox düymələri, Enter, Esc işləyir.
 * @param {object} p
 * @param {string} p.value
 * @param {{id:string, label:string}[]} [p.options]   Default: Seçilmişlər öndə / Əvvəlcə yeni / Əvvəlcə köhnə
 * @param {(id:string)=>void} p.onChange
 * @param {string} [p.label='Sıralama']
 */
export function SortMenu({
  value,
  options = [
    { id: 'featured', label: 'Seçilmişlər öndə' },
    { id: 'newest', label: 'Əvvəlcə yeni' },
    { id: 'oldest', label: 'Əvvəlcə köhnə' },
  ],
  onChange,
  label = 'Sıralama',
  lang = 'az',
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();
  const current = options.find((o) => o.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return undefined;
    const items = () => [...(menuRef.current?.querySelectorAll('[role="menuitemradio"]') ?? [])];
    requestAnimationFrame(() =>
      (items().find((el) => el.getAttribute('aria-checked') === 'true') ?? items()[0])?.focus(),
    );
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      const list = items();
      const i = list.indexOf(document.activeElement);
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        list[(i + 1) % list.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        list[(i - 1 + list.length) % list.length]?.focus();
      } else if (e.key === 'Tab') {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div lang={lang} className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-11 items-center gap-2 rounded-full bg-white px-3.5 text-[13px] font-medium text-ink ring-1 ring-inset ring-beige-dark transition-colors hover:ring-gold/60 ${FOCUS}`}
      >
        <ArrowUpDown className="h-4 w-4 text-gold-deep" strokeWidth={1.8} aria-hidden="true" />
        <span className="sr-only">{label}: </span>
        <span className="max-w-[46vw] truncate">{current?.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-brown-dark transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={label}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-[calc(100%+6px)] z-30 w-60 origin-top-right rounded-2xl bg-white p-1.5 shadow-luxe ring-1 ring-gold/25 sm:left-0 sm:right-auto sm:origin-top-left"
          >
            {options.map((o) => {
              const on = o.id === value;
              return (
                <li key={o.id} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={on}
                    onClick={() => {
                      onChange?.(o.id);
                      setOpen(false);
                      btnRef.current?.focus();
                    }}
                    className={`flex min-h-[44px] w-full items-center gap-3 rounded-[12px] px-3 text-left text-[14px] transition-colors focus-visible:bg-gold-mist/70 focus-visible:outline-none ${
                      on ? 'font-medium text-ink' : 'text-brown-dark hover:bg-beige'
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 place-items-center ${on ? 'text-gold-deep' : 'text-transparent'}`}
                    >
                      <Check className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    {o.label}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Alət paneli. Mobil: 1-ci sətir — say + sıralama; 2-ci sətir — üfüqi sürüşən çiplər.
 * Desktop: hamısı bir sətirdə. Yalnız cütlük üçün: Statistika, Qapaq.
 * «Hamısını seç» və silmə SEÇİM REJİMİNDƏ (SelectionBar) yerləşir.
 * @param {object} p
 * @param {number} p.fileCount @param {number} [p.featuredCount]
 * @param {(files:number, featured:number)=>string} [p.formatSummary]   Default: «18 fayl · 5 ★»
 * @param {string} p.sort @param {(id:string)=>void} p.onSort
 * @param {{id:string,label:string}[]} [p.sortOptions]
 * @param {()=>void} [p.onRefresh] @param {boolean} [p.refreshing]
 * @param {()=>void} [p.onSlideshow]
 * @param {()=>void} [p.onDownloadAll] @param {'idle'|'loading'|'done'|'error'} [p.downloadState]
 * @param {boolean} [p.canManage]
 * @param {()=>void} [p.onStats] @param {()=>void} [p.onCover]
 * @param {boolean} [p.sticky=true]     Yuxarı panelin altında yapışır
 * @param {string} [p.stickyTop='top-[calc(env(safe-area-inset-top,0px)+56px)] sm:top-[calc(env(safe-area-inset-top,0px)+64px)]']
 * @param {object} [p.labels]           { refresh, refreshing, slideshow, stats, cover, sort, download:{…} }
 */
export function GalleryToolbar({
  fileCount,
  featuredCount = 0,
  formatSummary = (f, s) => `${formatNumber(f)} fayl · ${formatNumber(s)} ★`,
  sort,
  onSort,
  sortOptions,
  onRefresh,
  refreshing = false,
  onSlideshow,
  onDownloadAll,
  downloadState = 'idle',
  canManage = false,
  onStats,
  onCover,
  sticky = true,
  stickyTop = 'top-[calc(env(safe-area-inset-top,0px)+56px)] sm:top-[calc(env(safe-area-inset-top,0px)+64px)]',
  labels = {},
  lang = 'az',
}) {
  const L = {
    refresh: 'Yenilə',
    refreshing: 'Yenilənir…',
    slideshow: 'Slayd şou',
    stats: 'Statistika',
    cover: 'Qapaq',
    sort: 'Sıralama',
    ...labels,
  };
  const chip = `inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[11.5px] font-semibold uppercase tracking-[0.12em] transition-colors ${FOCUS}`;
  const chipLight = `${chip} bg-white text-gold-deep ring-1 ring-inset ring-gold/40 hover:bg-gold-mist/60`;
  const chipManage = `${chip} bg-espresso text-cream hover:bg-espresso-soft`;

  return (
    <div
      lang={lang}
      role="toolbar"
      aria-label={L.toolbar ?? 'Qalereya alətləri'}
      className={`${sticky ? `sticky ${stickyTop} z-30` : ''} -mx-4 border-b border-gold/15 bg-cream/90 px-4 py-2.5 backdrop-blur-xl sm:mx-0 sm:rounded-[22px] sm:border sm:bg-white/90 sm:px-3 ${sticky ? 'sm:shadow-[0_-14px_0_10px_#FDFBF7,0_0_0_10px_#FDFBF7]' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
        {/* 1-ci sətir */}
        <div className="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-start">
          <p
            lang={lang}
            className="pl-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-brown-dark lining-nums"
          >
            {formatSummary(fileCount, featuredCount)}
          </p>
          <SortMenu value={sort} options={sortOptions} onChange={onSort} label={L.sort} lang={lang} />
        </div>

        {/* 2-ci sətir — mobildə sürüşür, desktopda sağa düzülür */}
        <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:w-full sm:px-0 lg:ml-auto lg:w-auto lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-2 py-0.5 lg:w-auto">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className={`${chipLight} disabled:cursor-wait`}
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? 'animate-spin motion-reduce:animate-none' : ''}`}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                {refreshing ? L.refreshing : L.refresh}
              </button>
            )}
            {onSlideshow && (
              <button type="button" onClick={onSlideshow} className={chipLight}>
                <Presentation className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                {L.slideshow}
              </button>
            )}
            {onDownloadAll && (
              <DownloadButton state={downloadState} onClick={onDownloadAll} labels={L.download} />
            )}
            {canManage && (onStats || onCover) && (
              <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-gold/30" />
            )}
            {canManage && onStats && (
              <button type="button" onClick={onStats} className={chipManage}>
                <BarChart3 className="h-4 w-4 text-gold-light" strokeWidth={1.8} aria-hidden="true" />
                {L.stats}
              </button>
            )}
            {canManage && onCover && (
              <button type="button" onClick={onCover} className={chipManage}>
                <SlidersHorizontal className="h-4 w-4 text-gold-light" strokeWidth={1.8} aria-hidden="true" />
                {L.cover}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Seçim rejimi: nəsə seçiləndə ekranın altında yapışan panel.
 * @param {object} p
 * @param {number} p.count                 Seçilmişlərin sayı (0 → panel gizlənir)
 * @param {number} p.total
 * @param {()=>void} p.onSelectAll
 * @param {()=>void} p.onClear             «Seçimi sıfırla» və «×»
 * @param {()=>void} [p.onDownload] @param {'idle'|'loading'|'done'|'error'} [p.downloadState]
 * @param {()=>void} [p.onDelete]          Yalnız cütlük (təsdiqi siz açın)
 * @param {(n:number)=>string} [p.formatCount]   Default: «3 seçildi»
 * @param {object} [p.labels]              { selectAll, clear, delete, close, region, download:{…} }
 */
export function SelectionBar({
  count,
  total,
  onSelectAll,
  onClear,
  onDownload,
  downloadState = 'idle',
  onDelete,
  formatCount = (n) => `${formatNumber(n)} seçildi`,
  labels = {},
  lang = 'az',
}) {
  const L = {
    selectAll: 'Hamısını seç',
    clear: 'Seçimi sıfırla',
    delete: 'Sil',
    close: 'Seçim rejimini bağla',
    region: 'Seçilmiş fayllar',
    ...labels,
  };
  const all = count >= total;
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            lang={lang}
            role="region"
            aria-label={L.region}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] sm:px-6"
          >
            <div
              className={`mx-auto flex h-16 max-w-[760px] items-center gap-1.5 rounded-[22px] p-2.5 shadow-[0_18px_44px_-14px_rgba(0,0,0,0.55)] sm:gap-2 ${GLASS_DARK}`}
            >
              <button
                type="button"
                onClick={onClear}
                aria-label={L.close}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sand transition-colors hover:bg-white/10 hover:text-cream ${FOCUS_DARK}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-[19px] leading-none text-cream" aria-live="polite">
                  <span className="lining-nums">{formatCount(count)}</span>
                </p>
                <button
                  lang={lang}
                  type="button"
                  onClick={all ? onClear : onSelectAll}
                  className={`mt-1 -ml-1 rounded px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-light underline-offset-4 hover:underline ${FOCUS_DARK}`}
                >
                  {all ? L.clear : L.selectAll}
                </button>
              </div>
              {onDownload && (
                <DownloadButton
                  state={downloadState}
                  onClick={onDownload}
                  dark
                  iconOnlyOnMobile
                  labels={L.download}
                />
              )}
              {onDelete && (
                <button
                  lang={lang}
                  type="button"
                  onClick={onDelete}
                  aria-label={L.delete}
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full bg-rust text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#86321F] sm:w-auto sm:px-4 ${FOCUS_DARK}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                  <span className="hidden sm:inline">{L.delete}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Boş qalereya.
 * @param {object} p
 * @param {string} [p.title='Hələ şəkil yüklənməyib']
 * @param {string} [p.text='Qonaqlar QR kodu skanerləyərək şəkil göndərəcəklər']
 * @param {string} [p.actionLabel='Şəkil göndər']
 * @param {()=>void} [p.onUpload]
 */
export function GalleryEmpty({
  title = 'Hələ şəkil yüklənməyib',
  text = 'Qonaqlar QR kodu skanerləyərək şəkil göndərəcəklər',
  actionLabel = 'Şəkil göndər',
  onUpload,
  lang = 'az',
}) {
  return (
    <section
      lang={lang}
      className="flex flex-col items-center rounded-[28px] border border-dashed border-gold/45 bg-white/60 px-6 py-14 text-center"
    >
      <svg viewBox="0 0 160 110" className="h-[110px] w-[160px]" fill="none" aria-hidden="true">
        <g transform="rotate(-10 60 60)">
          <rect
            x="22"
            y="22"
            width="64"
            height="76"
            rx="4"
            fill="#FFFDF8"
            stroke="#C5A059"
            strokeWidth="1.4"
          />
          <rect x="29" y="29" width="50" height="46" rx="2" fill="#F3EAD3" />
        </g>
        <g transform="rotate(8 100 54)">
          <rect
            x="70"
            y="16"
            width="64"
            height="76"
            rx="4"
            fill="#FFFDF8"
            stroke="#C5A059"
            strokeWidth="1.4"
          />
          <rect
            x="77"
            y="23"
            width="50"
            height="46"
            rx="2"
            stroke="#C5A059"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <path d="M102 38v16M94 46h16" stroke="#C5A059" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </svg>
      <h2 className="mt-6 font-serif text-[28px] leading-tight text-ink">{title}</h2>
      <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-brown-dark">{text}</p>
      {onUpload && (
        <Btn variant="primary" size="lg" icon={ImagePlus} onClick={onUpload} className="mt-7">
          {actionLabel}
        </Btn>
      )}
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Yüklənmə skeleti (mozaika formasında).
 * @param {object} p
 * @param {number} [p.count=12]
 * @param {string} [p.label='Şəkillər yüklənir']
 */
export function GallerySkeleton({ count = 12, label = 'Şəkillər yüklənir', lang = 'az' }) {
  const ratios = [0.75, 1.33, 1, 0.66, 1.5, 0.8, 1.2, 0.7, 1, 1.4, 0.75, 1.1];
  return (
    <div
      lang={lang}
      role="status"
      aria-label={label}
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
    >
      {Array.from({ length: Math.min(4, count) }, (_, c) => (
        <div
          key={c}
          className={`flex flex-col gap-2 sm:gap-3 ${c === 2 ? 'max-sm:hidden' : ''} ${c === 3 ? 'max-lg:hidden' : ''}`}
        >
          {Array.from({ length: Math.ceil(count / 4) }, (_, r) => (
            <span
              key={r}
              aria-hidden="true"
              className="block rounded-[14px] bg-gradient-to-br from-beige via-gold-mist/70 to-beige motion-safe:animate-pulse sm:rounded-[16px]"
              style={{
                aspectRatio: ratios[(c * 3 + r) % ratios.length],
                animationDelay: `${(c + r) * 120}ms`,
              }}
            />
          ))}
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Əməliyyat bildirişi — özü sönür.
 * @param {object} p
 * @param {boolean} p.open
 * @param {'ok'|'error'} [p.tone='ok']
 * @param {string} p.message           «Silindi.», «Seçilmişlərə əlavə olundu.»
 * @param {()=>void} p.onClose
 * @param {number} [p.duration=3200]   0 → özü sönmür
 * @param {string} [p.closeLabel='Bağla']
 */
export function Toast({
  open,
  tone = 'ok',
  message,
  onClose,
  duration = 3200,
  closeLabel = 'Bağla',
  lang = 'az',
}) {
  useAutoDismiss(open, duration, onClose);
  return (
    <MotionConfig reducedMotion="user">
      <div
        lang={lang}
        aria-live={tone === 'error' ? 'assertive' : 'polite'}
        className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+68px)] z-[70] flex justify-center px-4"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              role={tone === 'error' ? 'alert' : 'status'}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className={`pointer-events-auto flex min-h-[52px] max-w-[440px] items-center gap-3 rounded-full py-1.5 pl-2 pr-1.5 shadow-lift ${
                tone === 'error'
                  ? 'bg-rust text-white'
                  : 'bg-espresso text-cream ring-1 ring-inset ring-gold/30'
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone === 'error' ? 'bg-white/15' : 'bg-olive text-white'}`}
              >
                {tone === 'error' ? (
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0 flex-1 text-[14px] font-medium">{message}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-white/10 ${FOCUS_DARK}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
