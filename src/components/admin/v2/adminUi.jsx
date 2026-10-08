// ════════════════════════════════════════════════════════════════
// Digitoy Admin — ORTAQ UI komponentləri (YALNIZ görünüş)
//
// Admin hər gün işlədilən alətdir: sakit səthlər, 14px əsas mətn, serif yalnız
// səhifə başlıqlarında. Burada fetch / API / localStorage YOXDUR — hər şey props +
// callback ilə gəlir. Daxili state yalnız UI üçündür (menyu açıqdır, "Kopyalandı"
// 2 saniyə görünür, təsdiq sözü yazılıb və s.).
//
// ── Admin tokenləri (Tailwind arbitrary dəyərləri; tailwind.config.js-ə toxunmur) ──
//   Səhifə fonu      #F6F3ED      Kart            #FFFFFF
//   Xətt             #E5DED2      Güclü xətt      #D6CCBC
//   Mətn (əsas)      espresso #2C2523  (ağda 14.6:1)
//   Mətn (ikinci)    #5C4A3A (brown-dark, ağda 8.9:1)
//   Mətn (sakit)     #6B5E54 (ağda 6.2:1, səhifə fonunda 5.6:1)
//   Yan panel        #1C1614   üzərində mətn sand #CBBFAE (10:1), aktiv #E8D5A3
//   Vurğu / fokus    #A9822F (qızılı; yalnız xətt/halqa — mətn deyil)
//   Tipoqrafiya: səhifə başlığı serif 28/32px · bölmə başlığı Inter 15–16px 600 ·
//   əsas mətn 14px · köməkçi 13px · ən kiçik 12px (11px YOXDUR).
// ════════════════════════════════════════════════════════════════
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleHelp,
  CirclePause,
  CircleX,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  Link2,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  PencilLine,
  QrCode,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';

// ── Kiçik köməkçilər ─────────────────────────────────────────────
/** class adlarını birləşdirir (falsy-ləri atır). */
export const cx = (...a) => a.filter(Boolean).join(' ');

/** Ağ / açıq fonda görünən klaviatura fokusu (qızılı halqa). */
export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9822F] focus-visible:ring-offset-2 focus-visible:ring-offset-white';
/** Kartın içində, kənara çıxmayan fokus. */
export const FOCUS_INSET =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A9822F]';
/** Tünd yan panel / aşağı naviqasiya üçün fokus. */
export const FOCUS_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8D5A3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1614]';

/** Mobil aşağı naviqasiyanın hündürlüyü (px) — yapışqan panellər bunun üstündə durur. */
export const MOBILE_NAV_HEIGHT = 64;
/** `style={{ bottom: ABOVE_MOBILE_NAV }}` — aşağı naviqasiyanın düz üstü (iPhone zonası daxil). */
export const ABOVE_MOBILE_NAV = `calc(${MOBILE_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`;

/** Rəqəmi minliklərə bölür: 1284 → «1 284» (dar boşluq). */
export const formatNumber = (n) =>
  typeof n === 'number' && Number.isFinite(n)
    ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    : (n ?? '—');

/** Qiymət: 129 → «129₼». */
export const formatPrice = (n) => (n == null ? '' : `${formatNumber(n)}₼`);

/** Azərbaycan hərfləri ilə böyük hərf müqayisəsi üçün normallaşdırma (İ → I). */
const normWord = (s) =>
  String(s ?? '')
    .trim()
    .toLocaleUpperCase('az')
    .replace(/İ/g, 'I');

// ── UI hook-ları ─────────────────────────────────────────────────
/**
 * Controlled / uncontrolled dəyər. `value` verilibsə onu, yoxsa daxili state-i işlədir.
 * @returns {[any, (next:any)=>void]}
 */
export function useControllable(value, onChange, initial) {
  const [inner, setInner] = useState(initial);
  const controlled = value !== undefined;
  const set = useCallback(
    (next) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set];
}

/** Media sorğusu (məs. '(min-width: 1024px)'). */
export function useMediaQuery(query) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const trapStack = [];

/** Fokusu dialoqun içində saxlayır, Esc ilə bağlayır, bağlananda fokusu geri qaytarır. */
function useFocusTrap(ref, active, onEscape) {
  const escRef = useRef(onEscape);
  useLayoutEffect(() => {
    escRef.current = onEscape;
  });
  useEffect(() => {
    if (!active) return undefined;
    const token = {};
    trapStack.push(token);
    const prev = document.activeElement;
    const node = ref.current;
    const list = () =>
      [...(node?.querySelectorAll(FOCUSABLE) ?? [])].filter((el) => el.getClientRects().length > 0);
    const raf = requestAnimationFrame(() => {
      if (!node || node.contains(document.activeElement)) return;
      const auto = node.querySelector('[data-autofocus]');
      (auto ?? list()[0] ?? node).focus({ preventScroll: true });
    });
    const onKey = (e) => {
      if (trapStack[trapStack.length - 1] !== token) return;
      if (e.key === 'Escape') {
        escRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const els = list();
      if (!els.length) {
        e.preventDefault();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !node.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      trapStack.splice(trapStack.indexOf(token), 1);
      if (prev && typeof prev.focus === 'function' && document.contains(prev))
        prev.focus({ preventScroll: true });
    };
  }, [active, ref]);
}

let scrollLocks = 0;
function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    scrollLocks += 1;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      scrollLocks -= 1;
      if (scrollLocks === 0) document.body.style.overflow = prev;
    };
  }, [active]);
}

// ── Spinner / Skeleton ───────────────────────────────────────────
/** Fırlanan göstərici. `label` verilsə ekran oxuyucu üçün oxunur. */
export function Spinner({ className = 'h-4 w-4', label }) {
  return (
    <span role={label ? 'status' : undefined} className="inline-flex">
      <svg viewBox="0 0 24 24" fill="none" className={cx('animate-spin', className)} aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

/** Boz yer tutucu blok (`className` ilə ölçü verin). Azaldılmış hərəkətdə yanıb-sönmür. */
export function Skeleton({ className = 'h-4 w-full', style }) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className={cx('block rounded-[6px] bg-[#ECE6DC] motion-safe:animate-pulse', className)}
    />
  );
}

// ── Düymələr ─────────────────────────────────────────────────────
const BTN_BASE =
  'relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50';
const BTN_SIZE = {
  // mobildə 44px toxunma hədəfi, desktopda yığcam 36px
  sm: 'h-11 px-3.5 text-[14px] lg:h-9 lg:px-3 lg:text-[13.5px]',
  md: 'h-11 px-4 text-[14px]',
};
const BTN_VARIANT = {
  primary: 'bg-espresso text-cream hover:bg-espresso-soft',
  secondary:
    'bg-white text-espresso ring-1 ring-inset ring-[#D6CCBC] hover:bg-[#F6F3ED] hover:ring-[#C2B6A4]',
  ghost: 'text-[#5C4A3A] hover:bg-[#2C2523]/[0.06] hover:text-espresso',
  danger: 'bg-rust text-white hover:bg-[#86321F]',
  success: 'bg-olive text-white hover:bg-[#435B31]',
};
const BTN_DESTRUCTIVE = {
  secondary: 'bg-white text-rust ring-1 ring-inset ring-[#E2C3BB] hover:bg-rust-mist',
  ghost: 'text-rust hover:bg-rust-mist',
};

/**
 * Vahid düymə.
 * @param {object} p
 * @param {'primary'|'secondary'|'ghost'|'danger'|'success'} [p.variant='secondary']
 *        success — YALNIZ «Təsdiq et» üçün; danger — təhlükəli əməliyyatın son təsdiqi.
 * @param {'sm'|'md'} [p.size='md']   sm: desktopda 36px, mobildə yenə 44px
 * @param {import('react').ComponentType} [p.icon]       Soldakı ikon (lucide)
 * @param {import('react').ComponentType} [p.iconRight]  Sağdakı ikon
 * @param {boolean} [p.loading]   Spinner göstərir və kliki bağlayır
 * @param {boolean} [p.destructive] secondary/ghost üçün qırmızı mətn (məs. «Rədd et»)
 * @param {boolean} [p.block]     Tam en
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  destructive = false,
  block = false,
  className = '',
  children,
  type = 'button',
  disabled,
  ref,
  ...rest
}) {
  const v = (destructive && BTN_DESTRUCTIVE[variant]) || BTN_VARIANT[variant] || BTN_VARIANT.secondary;
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(BTN_BASE, BTN_SIZE[size], v, block && 'w-full', FOCUS, className)}
      {...rest}
    >
      {loading ? <Spinner /> : Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      {children}
      {IconRight && !loading && <IconRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
    </button>
  );
}

const TIP_POS = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
};
const TIP_ALIGN = {
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
  start: 'left-0',
};

/**
 * Yalnız ikonlu düymə — HƏMİŞƏ `label` tələb edir (aria-label + tooltip).
 * @param {object} p
 * @param {string} p.label  Ekran oxuyucu və tooltip mətni (məs. «Sil», «Başqa masaya köçür»)
 * @param {import('react').ComponentType} p.icon
 * @param {'ghost'|'secondary'|'primary'|'danger'} [p.variant='ghost']
 * @param {'sm'|'md'} [p.size='md']
 * @param {boolean} [p.destructive]
 * @param {boolean} [p.tooltip=true]
 * @param {'top'|'bottom'} [p.tooltipSide='top']  @param {'center'|'end'|'start'} [p.tooltipAlign='center']
 */
export function IconButton({
  label,
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  destructive = false,
  tooltip = true,
  tooltipSide = 'top',
  tooltipAlign = 'center',
  className = '',
  type = 'button',
  ref,
  ...rest
}) {
  const v = (destructive && BTN_DESTRUCTIVE[variant]) || BTN_VARIANT[variant];
  const dim = size === 'sm' ? 'h-11 w-11 lg:h-9 lg:w-9' : 'h-11 w-11';
  return (
    <span className="group/tip relative inline-flex">
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={cx(BTN_BASE, dim, v, FOCUS, className)}
        {...rest}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
      {tooltip && (
        <span
          aria-hidden="true"
          className={cx(
            'pointer-events-none absolute z-30 whitespace-nowrap rounded-[6px] bg-espresso px-2 py-1 text-[12px] font-medium text-cream opacity-0 shadow-sm transition-opacity duration-150 group-hover/tip:opacity-100 group-has-[:focus-visible]/tip:opacity-100',
            TIP_POS[tooltipSide],
            TIP_ALIGN[tooltipAlign],
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}

/** «Yenilə» düyməsi — yüklənəndə ikon fırlanır. */
export function RefreshButton({
  onClick,
  refreshing = false,
  label = 'Yenilə',
  busyLabel = 'Yenilənir…',
  size = 'sm',
  className,
}) {
  return (
    <Button
      size={size}
      onClick={onClick}
      aria-busy={refreshing || undefined}
      disabled={refreshing}
      className={cx('disabled:opacity-100', className)}
    >
      <RefreshCw className={cx('h-4 w-4', refreshing && 'motion-safe:animate-spin')} aria-hidden="true" />
      {refreshing ? busyLabel : label}
    </Button>
  );
}

// ── Status nişanları ─────────────────────────────────────────────
/** Vahid status sistemi: rəng + ikon + mətn. Rəng heç vaxt tək daşıyıcı deyil. */
export const STATUS = {
  order: {
    new: { label: 'Yeni', icon: Clock3, cls: 'bg-[#FBF1DC] text-[#6E5114] ring-[#EBD39C]' },
    approved: {
      label: 'Təsdiqlənmiş',
      icon: CircleCheck,
      cls: 'bg-olive-mist text-[#3D5530] ring-[#C9D6B8]',
    },
    rejected: { label: 'Rədd', icon: CircleX, cls: 'bg-rust-mist text-[#8A3125] ring-[#E8C7BF]' },
    deleted: { label: 'Silinmiş', icon: Trash2, cls: 'bg-[#EFEBE5] text-[#51483F] ring-[#DCD4C9]' },
    draft: {
      label: 'Qaralama',
      icon: PencilLine,
      cls: 'bg-white text-[#51483F] ring-[#CFC5B6] [border-style:dashed]',
    },
  },
  rsvp: {
    yes: { label: 'Gələcək', icon: CircleCheck, cls: 'bg-olive-mist text-[#3D5530] ring-[#C9D6B8]' },
    maybe: { label: 'Bəlkə', icon: CircleHelp, cls: 'bg-[#FBF1DC] text-[#6E5114] ring-[#EBD39C]' },
    no: { label: 'Gəlməyəcək', icon: CircleX, cls: 'bg-rust-mist text-[#8A3125] ring-[#E8C7BF]' },
    none: { label: 'Cavabsız', icon: CircleDashed, cls: 'bg-[#EFEBE5] text-[#51483F] ring-[#DCD4C9]' },
  },
  invite: {
    active: { label: 'Aktiv', icon: CircleCheck, cls: 'bg-olive-mist text-[#3D5530] ring-[#C9D6B8]' },
    inactive: { label: 'Deaktiv', icon: CirclePause, cls: 'bg-[#EFEBE5] text-[#51483F] ring-[#DCD4C9]' },
  },
};

/** Qrafik / çip nöqtələri üçün status rəngləri (həmişə mətnlə birlikdə). */
export const RSVP_DOT = { yes: '#4F6B3A', maybe: '#B8903A', no: '#9A3B2E', none: '#A79C90' };

/**
 * Status nişanı.
 * @param {object} p
 * @param {'order'|'rsvp'|'invite'} [p.kind='order']
 * @param {string} p.status  order: new|approved|rejected|deleted|draft · rsvp: yes|maybe|no|none · invite: active|inactive
 * @param {string} [p.label]  Mətni dəyişmək üçün (default STATUS cədvəlindən)
 * @param {'sm'|'md'} [p.size='md']
 */
export function StatusBadge({ kind = 'order', status, label, size = 'md', className = '' }) {
  const s = STATUS[kind]?.[status] ?? STATUS.rsvp.none;
  const Icon = s.icon;
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-medium ring-1 ring-inset',
        size === 'sm' ? 'h-6 px-2 text-[12px]' : 'h-7 px-2.5 text-[13px]',
        s.cls,
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      {label ?? s.label}
    </span>
  );
}

// ── Kartlar ──────────────────────────────────────────────────────
const TONE_BOX = {
  neutral: 'bg-[#F3EEE6] text-[#5C4A3A]',
  gold: 'bg-gold-mist text-gold-deep',
  olive: 'bg-olive-mist text-olive',
  rust: 'bg-rust-mist text-rust',
  amber: 'bg-[#FBF1DC] text-[#6E5114]',
};

/**
 * Göstərici kartı.
 * @param {object} p
 * @param {import('react').ComponentType} [p.icon]
 * @param {number|string} p.value
 * @param {string} p.label
 * @param {import('react').ReactNode} [p.note]   Alt qeyd (məs. «Bu gün: 1»)
 * @param {'neutral'|'gold'|'olive'|'rust'|'amber'} [p.tone='neutral']  İkon qutusunun rəngi
 * @param {boolean} [p.emphasis]  Vurğulu (açıq qızılı fon) — məs. «Real iştirak»
 * @param {'md'|'sm'} [p.size='md']  sm — tab içindəki yığcam variant
 * @param {string} [p.dot]  Ad yanında status nöqtəsi (hex)
 * @param {()=>void} [p.onClick]  Verilsə kart düyməyə çevrilir
 * @param {boolean} [p.loading]
 */
export function StatCard({
  icon: Icon,
  value,
  label,
  note,
  tone = 'neutral',
  emphasis = false,
  size = 'md',
  dot,
  onClick,
  loading = false,
  className = '',
}) {
  const Tag = onClick ? 'button' : 'div';
  const sm = size === 'sm';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'flex min-w-0 items-start gap-3.5 rounded-[12px] text-left ring-1 ring-inset transition-colors',
        sm ? 'p-3.5' : 'p-4',
        emphasis ? 'bg-[#FBF3E2] ring-[#E9D3A1]' : 'bg-white ring-[#E5DED2]',
        onClick && cx('hover:ring-[#C2B6A4]', FOCUS),
        className,
      )}
    >
      {Icon && !sm && (
        <span
          className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px]', TONE_BOX[tone])}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0">
        {loading ? (
          <Skeleton className={cx('mb-2 h-7', sm ? 'w-10' : 'w-14')} />
        ) : (
          <span
            className={cx(
              'block font-semibold leading-none tracking-tight text-espresso tabular-nums',
              sm ? 'text-[22px]' : 'text-[26px]',
              emphasis && 'text-[#5E4512]',
            )}
          >
            {typeof value === 'number' ? formatNumber(value) : value}
          </span>
        )}
        <span
          className={cx(
            'mt-1.5 flex items-center gap-1.5 text-[#5C4A3A]',
            sm ? 'text-[13px]' : 'text-[13.5px]',
          )}
        >
          {dot && (
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: dot }} aria-hidden="true" />
          )}
          {Icon && sm && <Icon className="h-3.5 w-3.5 shrink-0 text-[#6B5E54]" aria-hidden="true" />}
          <span className="min-w-0">{label}</span>
        </span>
        {note && <span className="mt-1 block text-[12.5px] text-[#6B5E54]">{note}</span>}
      </span>
    </Tag>
  );
}

/**
 * Ağ kart bölməsi: başlıq, izah, sağda əməliyyatlar.
 * @param {object} p
 * @param {import('react').ReactNode} [p.title]  @param {import('react').ReactNode} [p.description]
 * @param {import('react').ComponentType} [p.icon]  @param {import('react').ReactNode} [p.actions]
 * @param {2|3} [p.level=2]  Başlıq səviyyəsi (h2/h3)
 * @param {boolean} [p.flush]  Bədəndə daxili boşluq olmasın (cədvəl üçün)
 */
export function Panel({
  title,
  description,
  icon: Icon,
  actions,
  children,
  level = 2,
  flush = false,
  className = '',
  bodyClassName = '',
  id,
}) {
  const H = level === 3 ? 'h3' : 'h2';
  const hid = useId();
  return (
    <section
      id={id}
      aria-labelledby={title ? hid : undefined}
      className={cx('min-w-0 rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]', className)}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 px-4 pt-4 sm:px-5">
          <div className="min-w-0">
            {title && (
              <H id={hid} className="flex items-center gap-2 text-[15px] font-semibold text-espresso">
                {Icon && <Icon className="h-4 w-4 text-[#6B5E54]" aria-hidden="true" />}
                {title}
              </H>
            )}
            {description && <p className="mt-0.5 text-[13px] leading-snug text-[#6B5E54]">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cx(flush ? 'pt-3' : 'px-4 pb-4 pt-3 sm:px-5 sm:pb-5', bodyClassName)}>{children}</div>
    </section>
  );
}

/**
 * Bildiriş zolağı.
 * @param {object} p
 * @param {'info'|'warning'|'danger'|'success'} [p.tone='info']
 * @param {import('react').ReactNode} [p.title]  @param {import('react').ReactNode} [p.action]
 */
export function Notice({ tone = 'info', icon, title, children, action, className = '' }) {
  const T = {
    info: { cls: 'bg-[#F3EEE6] ring-[#E0D7C9] text-[#3F342E]', icon: Info, ic: 'text-[#5C4A3A]' },
    warning: { cls: 'bg-[#FBF1DC] ring-[#EBD39C] text-[#4A3A12]', icon: AlertTriangle, ic: 'text-[#6E5114]' },
    danger: { cls: 'bg-rust-mist ring-[#E8C7BF] text-[#5A2119]', icon: CircleAlert, ic: 'text-rust' },
    success: { cls: 'bg-olive-mist ring-[#C9D6B8] text-[#2E3F24]', icon: CircleCheck, ic: 'text-olive' },
  }[tone];
  const Icon = icon ?? T.icon;
  return (
    <div
      role={tone === 'danger' ? 'alert' : undefined}
      className={cx(
        'flex flex-col gap-3 rounded-[12px] px-4 py-3.5 ring-1 ring-inset sm:flex-row sm:items-center',
        T.cls,
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <Icon className={cx('mt-0.5 h-[18px] w-[18px] shrink-0', T.ic)} aria-hidden="true" />
        <div className="min-w-0 text-[14px] leading-relaxed">
          {title && <p className="font-semibold">{title}</p>}
          {children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}
        </div>
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2 pl-[30px] sm:pl-0">{action}</div>}
    </div>
  );
}

/**
 * Boş vəziyyət. `compact` — qrafik/kiçik bölmələr üçün tək sətir (böyük boş qutu YOX).
 * @param {object} p
 * @param {import('react').ComponentType} [p.icon]  @param {string} p.title
 * @param {import('react').ReactNode} [p.text]  @param {import('react').ReactNode} [p.action]
 * @param {boolean} [p.compact]
 */
export function EmptyState({
  icon: Icon = CircleDashed,
  title,
  text,
  action,
  compact = false,
  className = '',
}) {
  if (compact) {
    return (
      <div className={cx('flex items-center gap-3 rounded-[8px] bg-[#FAF8F4] px-3.5 py-3', className)}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0EBE3] text-[#6B5E54]">
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium text-espresso">{title}</p>
          {text && <p className="text-[13px] leading-snug text-[#6B5E54]">{text}</p>}
        </div>
        {action}
      </div>
    );
  }
  return (
    <div className={cx('flex flex-col items-center px-6 py-12 text-center', className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3EEE6] text-[#6B5E54]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-4 text-[16px] font-semibold text-espresso">{title}</p>
      {text && <p className="mt-1.5 max-w-sm text-[14px] leading-relaxed text-[#6B5E54]">{text}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}

/**
 * Açar–dəyər siyahısı (sifariş məlumatı).
 * @param {object} p
 * @param {{icon?:import('react').ComponentType,label:string,value:import('react').ReactNode}[]} p.items
 * @param {1|2} [p.columns=1]
 */
export function InfoList({ items, columns = 1, className = '' }) {
  return (
    <dl className={cx('grid gap-x-6 gap-y-4', columns === 2 && 'sm:grid-cols-2', className)}>
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex min-w-0 gap-3">
          {Icon && <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#8A7D72]" aria-hidden="true" />}
          <div className="min-w-0">
            <dt className="text-[12.5px] text-[#6B5E54]">{label}</dt>
            <dd className="mt-0.5 break-words text-[14.5px] font-medium text-espresso">{value ?? '—'}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

// ── Səhifə başlığı və alətlər ────────────────────────────────────
/**
 * Səhifə başlığı. Serif YALNIZ burada işlədilir.
 * @param {object} p
 * @param {import('react').ReactNode} p.title
 * @param {import('react').ReactNode} [p.subtitle]  Alt yazı / say (məs. «3 sifariş»)
 * @param {{label:string,onClick?:()=>void,href?:string}} [p.back]  «← Sifarişlərə qayıt»
 * @param {import('react').ReactNode} [p.meta]   Başlıq üstündə (kod + status)
 * @param {import('react').ReactNode} [p.actions] Sağda əməliyyatlar (mobildə altda)
 * @param {boolean} [p.hideActionsOnMobile]  Mobildə əməliyyatları gizlət (yapışqan panel varsa)
 */
export function PageHeader({
  title,
  subtitle,
  back,
  meta,
  actions,
  hideActionsOnMobile = false,
  className = '',
}) {
  const BackTag = back?.href ? 'a' : 'button';
  return (
    <header className={cx('mb-5 sm:mb-6', className)}>
      {back && (
        <BackTag
          href={back.href}
          type={back.href ? undefined : 'button'}
          onClick={back.onClick}
          className={cx(
            '-ml-2 mb-2 inline-flex h-11 items-center gap-2 rounded-[8px] px-2 text-[14px] font-medium text-[#5C4A3A] hover:text-espresso lg:h-9',
            FOCUS,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {back.label}
        </BackTag>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {meta && <div className="mb-1.5 flex flex-wrap items-center gap-2">{meta}</div>}
          <h1 className="break-words font-serif text-[28px] font-medium leading-[1.1] text-espresso sm:text-[32px]">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-[14px] text-[#6B5E54]">{subtitle}</p>}
        </div>
        {actions && (
          <div className={cx('flex flex-wrap items-center gap-2', hideActionsOnMobile && 'max-lg:hidden')}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

const INPUT_BASE =
  'block w-full rounded-[8px] border border-[#D6CCBC] bg-white text-[14px] text-espresso placeholder:text-[#7A6D62] transition-colors hover:border-[#C2B6A4] focus:border-[#A9822F] focus:outline-none focus:ring-2 focus:ring-[#A9822F]/25 disabled:cursor-not-allowed disabled:bg-[#F3EFE8] disabled:text-[#7A6D62] aria-[invalid=true]:border-rust aria-[invalid=true]:focus:ring-rust/20';

/** Mətn sahəsi (h-11). `ref` prop kimi ötürülə bilər (React 19). */
export function Input({ className = '', ref, ...p }) {
  return <input ref={ref} className={cx(INPUT_BASE, 'h-11 px-3.5', className)} {...p} />;
}

/** Çoxsətirli sahə. */
export function Textarea({ className = '', rows = 4, ref, ...p }) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx(INPUT_BASE, 'resize-y px-3.5 py-3 leading-relaxed', className)}
      {...p}
    />
  );
}

/**
 * Native select (mobildə sistem seçicisi açılır).
 * @param {object} p
 * @param {{value:string,label:string}[]} p.options
 * @param {(value:string)=>void} [p.onValueChange]  Rahat callback (event yox, dəyər)
 */
export function Select({ options = [], className = '', onValueChange, onChange, ref, ...p }) {
  return (
    <span className={cx('relative block', className)}>
      <select
        ref={ref}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(e.target.value);
        }}
        className={cx(INPUT_BASE, 'h-11 appearance-none pl-3.5 pr-10')}
        {...p}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B5E54]"
        aria-hidden="true"
      />
    </span>
  );
}

/**
 * Forma sahəsi: label + uşaq (Input/Select/Textarea) + izah / xəta. id-ləri özü bağlayır.
 * @param {object} p
 * @param {import('react').ReactNode} p.label  @param {import('react').ReactNode} [p.hint]
 * @param {import('react').ReactNode} [p.error]  @param {boolean} [p.required]  @param {boolean} [p.labelHidden]
 * @param {boolean} [p.changed]  Sahə şablondan dəyişibsə «dəyişib» nişanı (2-ci hissə)
 * @param {()=>void} [p.onReset]  Verilsə və `changed` olsa, label sağında «Sıfırla»
 * @param {import('react').ReactNode} [p.labelAside]  Label sağında əlavə element (məs. göz düyməsi)
 */
export function Field({
  label,
  hint,
  error,
  required,
  labelHidden = false,
  changed = false,
  onReset,
  resetLabel = 'Sıfırla',
  labelAside,
  children,
  className = '',
}) {
  const id = useId();
  const hintId = hint ? `${id}-h` : undefined;
  const errId = error ? `${id}-e` : undefined;
  const child = Children.only(children);
  const describedBy = [child.props['aria-describedby'], hintId, errId].filter(Boolean).join(' ') || undefined;
  const showReset = changed && onReset;
  return (
    <div className={className}>
      <div className={cx('mb-1.5 flex min-h-5 items-center justify-between gap-2', labelHidden && 'sr-only')}>
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <label htmlFor={id} className="text-[13px] font-semibold text-[#3F342E]">
            {label}
            {required && (
              <span className="text-rust" aria-hidden="true">
                {' '}
                *
              </span>
            )}
          </label>
          {changed && <ChangedBadge />}
        </span>
        {(showReset || labelAside) && (
          <span className="flex shrink-0 items-center gap-1">
            {labelAside}
            {showReset && (
              <button
                type="button"
                onClick={onReset}
                className={cx(
                  '-my-3 inline-flex h-11 items-center gap-1 rounded-[6px] px-2 text-[13px] font-medium text-[#5C4A3A] hover:text-espresso lg:-my-1.5 lg:h-8',
                  FOCUS,
                )}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {resetLabel}
                <span className="sr-only">: {typeof label === 'string' ? label : ''}</span>
              </button>
            )}
          </span>
        )}
      </div>
      {isValidElement(child) &&
        cloneElement(child, {
          id,
          'aria-describedby': describedBy,
          'aria-invalid': error ? true : child.props['aria-invalid'],
          required: required || child.props.required,
        })}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[12.5px] leading-snug text-[#6B5E54]">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errId}
          className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium leading-snug text-rust"
        >
          <CircleAlert className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Axtarış sahəsi (ikon + təmizlə düyməsi).
 * @param {object} p
 * @param {string} p.value  @param {(v:string)=>void} p.onChange  @param {string} [p.placeholder]
 * @param {string} [p.label='Axtarış']  Gizli label
 */
export function SearchInput({
  value = '',
  onChange,
  placeholder = 'Axtar…',
  label = 'Axtarış',
  clearLabel = 'Axtarışı təmizlə',
  className = '',
}) {
  const id = useId();
  return (
    <div className={cx('relative min-w-0', className)} role="search">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B5E54]"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.stopPropagation();
            onChange?.('');
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        className={cx(INPUT_BASE, 'h-11 pl-10 pr-11 [&::-webkit-search-cancel-button]:appearance-none')}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          aria-label={clearLabel}
          className={cx(
            'absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-[8px] text-[#6B5E54] hover:text-espresso',
            FOCUS_INSET,
          )}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/**
 * Alət sətri: axtarış, filtrlər (select), «Yenilə». Mobildə axtarış tam en, altında filtr + Yenilə.
 * @param {object} p
 * @param {{value:string,onChange:(v:string)=>void,placeholder?:string,label?:string}} [p.search]
 * @param {{value:string,onChange:(v:string)=>void,options:{value:string,label:string}[],label:string}[]} [p.filters]
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]
 * @param {import('react').ReactNode} [p.children]  Əlavə düymələr (sağda)
 */
export function Toolbar({ search, filters = [], onRefresh, refreshing, children, className = '' }) {
  return (
    <div
      className={cx(
        'flex gap-2',
        filters.length || children ? 'flex-col sm:flex-row sm:items-center' : 'flex-row items-center',
        className,
      )}
    >
      {search && <SearchInput {...search} className="min-w-0 flex-1 sm:max-w-[360px]" />}
      <div className="flex min-w-0 gap-2 sm:ml-auto">
        {filters.map((f) => (
          <div key={f.label} className="min-w-0 flex-1 sm:w-52 sm:flex-none">
            <label className="sr-only" htmlFor={`flt-${f.label}`}>
              {f.label}
            </label>
            <Select id={`flt-${f.label}`} value={f.value} onValueChange={f.onChange} options={f.options} />
          </div>
        ))}
        {children}
        {onRefresh && <RefreshButton onClick={onRefresh} refreshing={refreshing} className="lg:h-11" />}
      </div>
    </div>
  );
}

// ── Tablar / çiplər ──────────────────────────────────────────────
/**
 * Tablar (say ilə). Mobildə üfüqi sürüşür; ← → Home End ilə gəzilir.
 * @param {object} p
 * @param {{id:string,label:string,count?:number,icon?:import('react').ComponentType}[]} p.tabs
 * @param {string} p.value  @param {(id:string)=>void} p.onChange
 * @param {string} p.label  tablist üçün aria-label
 * @param {'underline'|'segmented'} [p.variant='underline']
 * @param {string} [p.idPrefix]  Verilsə tab ↔ panel aria-controls bağlanır (bax: TabPanel)
 */
export function Tabs({ tabs, value, onChange, label, variant = 'underline', idPrefix, className = '' }) {
  const refs = useRef({});
  const onKey = (e, i) => {
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n == null) return;
    e.preventDefault();
    const t = tabs[n];
    onChange?.(t.id);
    refs.current[t.id]?.focus();
  };
  const seg = variant === 'segmented';
  const list = (
    <div
      role="tablist"
      aria-label={label}
      className={cx(
        seg ? 'inline-flex rounded-[8px] bg-[#EFE9DF] p-1' : 'flex min-w-max gap-1 border-b border-[#E5DED2]',
        className,
      )}
    >
      {tabs.map((t, i) => {
        const on = t.id === value;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            id={idPrefix ? `${idPrefix}-tab-${t.id}` : undefined}
            aria-controls={idPrefix ? `${idPrefix}-panel-${t.id}` : undefined}
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange?.(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-[14px] font-medium transition-colors',
              seg
                ? cx(
                    'h-11 rounded-[6px] px-3.5 lg:h-9',
                    on ? 'bg-white text-espresso shadow-sm' : 'text-[#5C4A3A] hover:text-espresso',
                    FOCUS_INSET,
                  )
                : cx(
                    'h-12 rounded-t-[6px] px-3 lg:h-11',
                    on
                      ? 'text-espresso after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-[#A9822F]'
                      : 'text-[#6B5E54] hover:text-espresso',
                    FOCUS_INSET,
                  ),
            )}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {t.label}
            {t.count != null && (
              <span
                className={cx(
                  'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[12px] font-semibold tabular-nums',
                  on ? 'bg-espresso text-cream' : 'bg-[#EFE9DF] text-[#5C4A3A]',
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
  if (seg) return list;
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      {list}
    </div>
  );
}

/** Tabs ilə bağlı panel (`idPrefix` eyni olmalıdır). */
export function TabPanel({ idPrefix, id, children, className = '' }) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
      tabIndex={-1}
      className={cx('focus:outline-none', className)}
    >
      {children}
    </div>
  );
}

/**
 * Tək seçimli filtr çipləri (status çipləri).
 * @param {object} p
 * @param {{id:string,label:string,count?:number,dot?:string}[]} p.items
 * @param {string} p.value  @param {(id:string)=>void} p.onChange  @param {string} p.label
 */
export function FilterChips({ items, value, onChange, label, className = '' }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div role="group" aria-label={label} className={cx('flex min-w-max gap-2 py-0.5', className)}>
        {items.map((it) => {
          const on = it.id === value;
          return (
            <button
              key={it.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange?.(it.id)}
              className={cx(
                'inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-medium transition-colors lg:h-9',
                on
                  ? 'bg-espresso text-cream'
                  : 'bg-white text-[#3F342E] ring-1 ring-inset ring-[#D6CCBC] hover:bg-[#F6F3ED]',
                FOCUS,
              )}
            >
              {it.dot && (
                <span
                  className={cx('h-2.5 w-2.5 rounded-full', on && 'ring-2 ring-cream/60')}
                  style={{ background: it.dot }}
                  aria-hidden="true"
                />
              )}
              {it.label}
              {it.count != null && (
                <span className={cx('tabular-nums', on ? 'text-sand' : 'text-[#6B5E54]')}>{it.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Cədvəl ───────────────────────────────────────────────────────
/**
 * Desktopda cədvəl, mobildə (<768px) avtomatik KART siyahısı.
 *
 * Sütun (`columns[i]`):
 *   key, header, render?(row) → node, align?: 'left'|'right'|'center', width?: CSS,
 *   nowrap?, primary?: true  — sətrin əsas mətni (klaviatura ilə açılan düymə olur),
 *   mobile?: 'title' | 'badge' | 'meta' | 'code' | 'detail' | 'action' | 'hidden',
 *   'footer' — kartın altında tam en (əməliyyat düymələri) ·
 *   colClassName?: desktop th+td üçün (məs. 'max-xl:hidden' — dar ekranda sütunu gizlət) ·
 *   mobileRender?(row) → node  — kartda fərqli mətn lazımdırsa (məs. «+1» əvəzinə «+1 qonaq»; null → göstərmə)
 *     title — kartın başlığı · badge — sağ yuxarı · meta — « · » ilə bir sətir ·
 *     code — mono sətir · detail — «Başlıq: dəyər» · action — sağda düymə · hidden — göstərmə
 *
 * @param {object} p
 * @param {object[]} p.columns  @param {object[]} p.rows
 * @param {(row:object)=>string|number} [p.getKey]
 * @param {(row:object)=>void} [p.onRowClick]  Sətir/kart kliklənir
 * @param {(row:object)=>string} [p.rowLabel]  Mobil kart düyməsinin aria-label-i (məs. «Sifarişi aç: Sevinc & Rauf»)
 * @param {boolean} [p.loading]  Skeleton göstərir  @param {number} [p.skeletonRows=5]
 * @param {import('react').ReactNode} [p.empty]  Boş olanda (EmptyState)
 * @param {string} [p.caption]  Ekran oxuyucu üçün cədvəl adı
 * @param {boolean} [p.stickyHeader=true]  @param {string} [p.stickyTopClass='top-0']
 * @param {boolean} [p.embedded]  Panel içində — öz çərçivəsi olmasın
 * @param {boolean} [p.fixed]  table-layout: fixed — bir neçə qrup cədvəlində sütunlar eyni xəttdə dursun
 */
export function DataTable({
  columns,
  rows = [],
  getKey = (r) => r.id,
  onRowClick,
  rowLabel,
  loading = false,
  skeletonRows = 5,
  empty,
  caption,
  stickyHeader = true,
  stickyTopClass = 'top-0',
  embedded = false,
  fixed = false,
  className = '',
}) {
  const ignoreClick = (e) => e.target.closest('button,a,input,select,textarea,label,[role=menu]');
  if (!loading && rows.length === 0) {
    return (
      <div className={cx(!embedded && 'rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]', className)}>
        {empty}
      </div>
    );
  }
  const cell = (c, r) => (c.render ? c.render(r) : r[c.key]);
  const mcell = (c, r) => (c.mobileRender ? c.mobileRender(r) : cell(c, r));
  const alignCls = (c) =>
    c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left';
  const pick = (role) => columns.filter((c) => c.mobile === role);
  const titleCol = columns.find((c) => c.mobile === 'title') ?? columns.find((c) => c.primary) ?? columns[0];

  return (
    <div className={className}>
      {/* ── Desktop / planşet: cədvəl ── */}
      <div
        className={cx('hidden md:block', !embedded && 'rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]')}
      >
        <table className={cx('w-full border-separate border-spacing-0 text-[14px]', fixed && 'table-fixed')}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th
                  key={c.key}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={cx(
                    'h-11 whitespace-nowrap border-b border-[#E5DED2] bg-[#F8F5F0] px-4 text-[12.5px] font-semibold text-[#5C4A3A]',
                    alignCls(c),
                    stickyHeader && cx('sticky z-10', stickyTopClass),
                    !embedded && i === 0 && 'rounded-tl-[12px]',
                    !embedded && i === columns.length - 1 && 'rounded-tr-[12px]',
                    c.colClassName,
                    c.headerClassName,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: skeletonRows }, (_, i) => (
                  <tr key={i}>
                    {columns.map((c, j) => (
                      <td key={c.key} className="h-14 border-b border-[#EEE8DF] px-4">
                        <Skeleton className={cx('h-3.5', j === 1 ? 'w-40' : 'w-20')} />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((r, ri) => {
                  const last = ri === rows.length - 1;
                  return (
                    <tr
                      key={getKey(r)}
                      onClick={onRowClick ? (e) => !ignoreClick(e) && onRowClick(r) : undefined}
                      className={cx(
                        'group/row transition-colors',
                        onRowClick && 'cursor-pointer hover:bg-[#FBF9F5]',
                      )}
                    >
                      {columns.map((c, ci) => (
                        <td
                          key={c.key}
                          className={cx(
                            'h-14 px-4 align-middle text-espresso',
                            !last && 'border-b border-[#EEE8DF]',
                            last && !embedded && ci === 0 && 'rounded-bl-[12px]',
                            last && !embedded && ci === columns.length - 1 && 'rounded-br-[12px]',
                            alignCls(c),
                            c.nowrap && 'whitespace-nowrap',
                            c.colClassName,
                            c.cellClassName,
                          )}
                        >
                          {c.primary && onRowClick ? (
                            <button
                              type="button"
                              onClick={() => onRowClick(r)}
                              className={cx(
                                'rounded text-left font-medium text-espresso underline-offset-4 group-hover/row:underline',
                                FOCUS,
                              )}
                            >
                              {cell(c, r)}
                            </button>
                          ) : (
                            cell(c, r)
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* ── Mobil: kartlar ── */}
      <ul className={cx('md:hidden', embedded ? 'border-t border-[#EEE8DF]' : 'space-y-2.5')}>
        {loading
          ? Array.from({ length: Math.min(skeletonRows, 4) }, (_, i) => (
              <li
                key={i}
                className={cx(
                  'bg-white p-4',
                  embedded
                    ? 'border-b border-[#EEE8DF] last:border-0'
                    : 'rounded-[12px] ring-1 ring-inset ring-[#E5DED2]',
                )}
              >
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-3 h-3.5 w-56" />
                <Skeleton className="mt-2.5 h-3.5 w-24" />
              </li>
            ))
          : rows.map((r) => {
              const actions = pick('action');
              const meta = pick('meta')
                .map((c) => mcell(c, r))
                .filter((x) => x != null && x !== '' && x !== false);
              return (
                <li
                  key={getKey(r)}
                  className={cx(
                    'relative bg-white',
                    embedded
                      ? 'border-b border-[#EEE8DF] last:rounded-b-[12px] last:border-0'
                      : 'rounded-[12px] ring-1 ring-inset ring-[#E5DED2]',
                  )}
                >
                  {onRowClick && (
                    <button
                      type="button"
                      onClick={() => onRowClick(r)}
                      aria-label={rowLabel?.(r)}
                      className={cx('absolute inset-0', embedded ? FOCUS_INSET : cx('rounded-[12px]', FOCUS))}
                    />
                  )}
                  <div className={cx('relative flex gap-3 p-4', onRowClick && 'pointer-events-none')}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 break-words text-[15.5px] font-semibold leading-snug text-espresso">
                          {mcell(titleCol, r)}
                        </p>
                        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                          {pick('badge').map((c) => (
                            <span key={c.key}>{mcell(c, r)}</span>
                          ))}
                        </div>
                      </div>
                      {meta.length > 0 && (
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-[#5C4A3A]">
                          {meta.map((m, i) => (
                            <span key={i} className="inline-flex items-center gap-2">
                              {i > 0 && (
                                <span aria-hidden="true" className="text-[#B5A99A]">
                                  ·
                                </span>
                              )}
                              {m}
                            </span>
                          ))}
                        </p>
                      )}
                      {pick('code').map((c) => (
                        <p key={c.key} className="mt-2 text-[13.5px]">
                          {mcell(c, r)}
                        </p>
                      ))}
                      {pick('detail').map((c) => {
                        const v = mcell(c, r);
                        if (v == null || v === '' || v === '—') return null;
                        return (
                          <p key={c.key} className="mt-1.5 text-[13.5px] text-[#5C4A3A]">
                            <span className="text-[#6B5E54]">{c.header}: </span>
                            {v}
                          </p>
                        );
                      })}
                      {pick('footer').length > 0 && (
                        <div className="pointer-events-auto relative z-10 mt-3 flex gap-2">
                          {pick('footer').map((c) => (
                            <Fragment key={c.key}>{mcell(c, r)}</Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                    {actions.length > 0 ? (
                      <div className="pointer-events-auto relative z-10 -my-1 -mr-2 flex shrink-0 items-center">
                        {actions.map((c) => (
                          <span key={c.key}>{mcell(c, r)}</span>
                        ))}
                      </div>
                    ) : (
                      onRowClick && <ChevronDownRight />
                    )}
                  </div>
                </li>
              );
            })}
      </ul>
    </div>
  );
}

function ChevronDownRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-1 h-5 w-5 shrink-0 self-center text-[#8A7D72]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Menyu (⋯) ────────────────────────────────────────────────────
/**
 * Əməliyyat menyusu. Klaviatura: ↑ ↓ Home End, Esc bağlayır və fokusu düyməyə qaytarır.
 * @param {object} p
 * @param {{id:string,label:string,icon?:import('react').ComponentType,onSelect:()=>void,destructive?:boolean,disabled?:boolean,hidden?:boolean,hint?:string,divider?:boolean}[]} p.items
 *        `divider: true` — ayırıcı xətt (təhlükəli əməliyyatları ayırmaq üçün)
 * @param {string} [p.label='Digər əməliyyatlar']  Düymənin aria-label/tooltip mətni
 * @param {import('react').ReactNode} [p.buttonText]  Verilsə ikon əvəzinə mətnli düymə
 * @param {'bottom'|'top'} [p.side='bottom']  @param {'end'|'start'} [p.align='end']
 * @param {'ghost'|'secondary'} [p.variant='ghost']  @param {'sm'|'md'} [p.size='md']
 */
export function ActionMenu({
  items,
  label = 'Digər əməliyyatlar',
  buttonText,
  side = 'bottom',
  align = 'end',
  variant = 'ghost',
  size = 'md',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const btn = useRef(null);
  const itemRefs = useRef([]);
  const menuId = useId();
  const visible = items.filter((i) => !i.hidden);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    requestAnimationFrame(() => itemRefs.current.find((el) => el && !el.disabled)?.focus());
    const onDown = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onMenuKey = (e) => {
    const els = itemRefs.current.filter((el) => el && !el.disabled);
    const i = els.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      els[(i + 1) % els.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      els[(i - 1 + els.length) % els.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      els[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      els[els.length - 1]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const triggerProps = {
    ref: btn,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: () => setOpen((o) => !o),
    onKeyDown: (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(true);
      }
    },
  };

  return (
    <div ref={wrap} className={cx('relative inline-flex', className)}>
      {buttonText ? (
        <Button variant={variant} size={size} iconRight={ChevronDown} {...triggerProps}>
          {buttonText}
        </Button>
      ) : (
        <IconButton
          label={label}
          icon={MoreHorizontal}
          variant={variant}
          size={size}
          tooltip={!open}
          tooltipAlign={align === 'end' ? 'end' : 'start'}
          tooltipSide={side === 'top' ? 'bottom' : 'top'}
          {...triggerProps}
        />
      )}
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={typeof buttonText === 'string' ? buttonText : label}
          onKeyDown={onMenuKey}
          className={cx(
            'absolute z-50 min-w-[220px] rounded-[12px] bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(44,37,35,0.35)] ring-1 ring-[#E5DED2]',
            side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {visible.map((it, i) => {
            const Icon = it.icon;
            if (it.divider)
              return (
                <div key={it.id ?? `d${i}`} role="separator" className="mx-2 my-1.5 h-px bg-[#EEE8DF]" />
              );
            return (
              <button
                key={it.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={it.disabled}
                onClick={() => {
                  close(false);
                  it.onSelect?.();
                }}
                className={cx(
                  'flex h-11 w-full items-center gap-2.5 rounded-[8px] px-3 text-left text-[14px] font-medium transition-colors disabled:opacity-50',
                  it.destructive
                    ? 'text-rust hover:bg-rust-mist focus:bg-rust-mist'
                    : 'text-espresso hover:bg-[#F6F3ED] focus:bg-[#F6F3ED]',
                  'focus:outline-none',
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                <span className="min-w-0 flex-1">{it.label}</span>
                {it.hint && (
                  <span className="shrink-0 text-[12.5px] font-normal text-[#6B5E54]">{it.hint}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Kopyalanan link ──────────────────────────────────────────────
/**
 * Link + «Kopyala» → «Kopyalandı». Kopyalama özü sizin `onCopy`-dədir (clipboard məntiqi).
 * `onCopy` Promise qaytarsa və rədd olunsa «Kopyalanmadı» görünür.
 * @param {object} p
 * @param {string} p.value  @param {string} [p.label='Dəvətnamə linki']
 * @param {(value:string)=>void|Promise<void>} p.onCopy
 * @param {string} [p.openHref]  Verilsə «Aç» linki çıxır (yeni tabda)
 */
export function CopyField({
  value,
  label = 'Dəvətnamə linki',
  onCopy,
  copyLabel = 'Kopyala',
  copiedLabel = 'Kopyalandı',
  errorLabel = 'Kopyalanmadı',
  openHref,
  openLabel = 'Aç',
  className = '',
}) {
  const [state, setState] = useState('idle');
  const timer = useRef(null);
  const id = useId();
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await onCopy?.(value);
      setState('done');
    } catch {
      setState('error');
    }
    timer.current = setTimeout(() => setState('idle'), 2200);
  };
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#3F342E]"
      >
        <Link2 className="h-4 w-4 text-[#6B5E54]" aria-hidden="true" />
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          readOnly
          value={value}
          onFocus={(e) => e.target.select()}
          className={cx(INPUT_BASE, 'h-11 min-w-0 flex-1 truncate bg-[#FAF8F4] px-3 font-mono text-[13px]')}
        />
        <Button
          size="md"
          variant="secondary"
          onClick={copy}
          icon={state === 'done' ? Check : Copy}
          className={state === 'done' ? 'text-olive' : ''}
        >
          {state === 'done' ? copiedLabel : state === 'error' ? errorLabel : copyLabel}
        </Button>
        {openHref && (
          <a
            href={openHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${openLabel} (yeni pəncərədə)`}
            className={cx(BTN_BASE, BTN_SIZE.md, BTN_VARIANT.ghost, 'px-3', FOCUS)}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span className="max-sm:sr-only">{openLabel}</span>
          </a>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {state === 'done' ? copiedLabel : state === 'error' ? errorLabel : ''}
      </span>
    </div>
  );
}

// ── Modal / Sheet / ConfirmDialog ────────────────────────────────
const MODAL_W = {
  sm: 'sm:max-w-[420px]',
  md: 'sm:max-w-[520px]',
  lg: 'sm:max-w-[720px]',
  xl: 'sm:max-w-[920px]',
  // tam iş pəncərəsi (məzmun meneceri): mobildə bütün ekran, desktopda 1280px
  full: 'sm:max-w-[1280px] sm:h-[92dvh]',
};

/**
 * Pəncərə: desktopda mərkəzdə modal, mobildə (<640px) aşağıdan açılan vərəq.
 * Fokus içəridə saxlanılır, Esc bağlayır, fokus açan düyməyə qayıdır.
 * @param {object} p
 * @param {boolean} p.open  @param {()=>void} p.onClose
 * @param {import('react').ReactNode} p.title  @param {import('react').ReactNode} [p.description]
 * @param {import('react').ReactNode} [p.footer]  Düymələr (mobildə tam en, alt-alta)
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [p.size='md']  full — mobildə tam ekran, desktopda böyük iş pəncərəsi
 * @param {'auto'|'sheet'} [p.variant='auto']  sheet — hər ölçüdə aşağıdan
 * @param {import('react').ReactNode} [p.headerExtra]  Başlığın altında (məs. mobil «Redaktə / Önbaxış» keçidi)
 * @param {'stack'|'bar'} [p.footerLayout='stack']  bar — düymələr bir sətirdə, iki kənara düzülür
 * @param {boolean} [p.bodyPadding=true]  false — bədən boşluqsuz (öz düzülüşü olan pəncərə üçün)
 * @param {boolean} [p.dismissible=true]  Fona klik / Esc ilə bağlansın
 * @param {import('react').ReactNode} [p.icon]  Başlıq yanında ikon bloku
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  variant = 'auto',
  dismissible = true,
  icon,
  closeLabel = 'Bağla',
  bodyClassName = '',
  headerExtra,
  footerLayout = 'stack',
  bodyPadding = true,
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const full = size === 'full';
  const tid = useId();
  const did = useId();
  useFocusTrap(ref, open, dismissible ? onClose : undefined);
  useBodyScrollLock(open);
  if (typeof document === 'undefined') return null;
  const sheet = variant === 'sheet';
  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={cx(
            'fixed inset-0 z-[90] flex justify-center',
            sheet
              ? 'items-end'
              : full
                ? 'items-stretch sm:items-center sm:p-6'
                : 'items-end sm:items-center sm:p-6',
          )}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-[#1C1614]/50"
            onClick={dismissible ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={tid}
            aria-describedby={description ? did : undefined}
            tabIndex={-1}
            className={cx(
              'relative flex w-full flex-col bg-white shadow-[0_24px_60px_-20px_rgba(28,22,20,0.45)] focus:outline-none',
              full ? 'h-[100dvh] sm:max-h-[92dvh]' : 'max-h-[92dvh]',
              sheet
                ? 'rounded-t-2xl sm:max-w-[560px]'
                : full
                  ? cx('sm:rounded-2xl', MODAL_W.full)
                  : cx('rounded-t-2xl sm:rounded-2xl', MODAL_W[size]),
            )}
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              aria-hidden="true"
              className={cx(
                'mx-auto mt-2.5 h-1 w-10 rounded-full bg-[#DDD5C8]',
                !sheet && 'sm:hidden',
                full && 'hidden',
              )}
            />
            <div
              className={cx(
                'flex items-start gap-3 px-5 pb-2 pt-4 sm:px-6 sm:pt-5',
                full && 'border-b border-[#EEE8DF] pb-3 sm:pb-4',
              )}
              style={full ? { paddingTop: 'max(16px, env(safe-area-inset-top, 0px))' } : undefined}
            >
              {icon}
              <div className="min-w-0 flex-1 pt-1.5">
                <h2 id={tid} className="text-[18px] font-semibold leading-snug text-espresso">
                  {title}
                </h2>
                {description && (
                  <div id={did} className="mt-1 text-[14px] leading-relaxed text-[#5C4A3A]">
                    {description}
                  </div>
                )}
              </div>
              {dismissible && (
                <IconButton label={closeLabel} icon={X} onClick={onClose} tooltip={false} className="-mr-2" />
              )}
            </div>
            {headerExtra}
            {children && (
              <div
                className={cx(
                  'min-h-0 flex-1',
                  bodyPadding ? 'overflow-y-auto px-5 pb-5 pt-2 sm:px-6' : 'flex flex-col overflow-hidden',
                  bodyClassName,
                )}
              >
                {children}
              </div>
            )}
            {footer && (
              <div
                className={cx(
                  'flex gap-2 border-t border-[#EEE8DF] px-5 pt-3.5 sm:px-6 sm:pb-4',
                  footerLayout === 'bar'
                    ? 'flex-wrap items-center justify-between'
                    : 'flex-col-reverse sm:flex-row sm:justify-end [&>*]:w-full sm:[&>*]:w-auto',
                )}
                style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom, 0px))' }}
              >
                {footer}
              </div>
            )}
            {!footer && <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} aria-hidden="true" />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Həmişə aşağıdan açılan vərəq (məs. mobil «Daha çox» menyusu). Props — Modal ilə eyni. */
export function Sheet(props) {
  return <Modal {...props} variant="sheet" />;
}

/**
 * Təsdiq pəncərəsi. Təhlükəli əməliyyat üçün iki addımlı qoruma:
 *   guard='type'   — «SİL» yazılmadan düymə açılmır (İ/I fərqi nəzərə alınmır);
 *   guard='double' — birinci klik xəbərdarlıq göstərir, ikinci klik təsdiqləyir.
 * @param {object} p
 * @param {boolean} p.open  @param {import('react').ReactNode} p.title  @param {import('react').ReactNode} [p.description]
 * @param {string} [p.confirmLabel='Təsdiq et']  @param {string} [p.cancelLabel='Ləğv et']
 * @param {'danger'|'primary'|'success'} [p.tone='danger']
 * @param {boolean} [p.busy]  @param {()=>void} p.onConfirm  @param {()=>void} p.onCancel
 * @param {'none'|'type'|'double'} [p.guard='none']  @param {string} [p.guardWord='SİL']
 * @param {string} [p.secondStepText]  double: ikinci addımın xəbərdarlığı
 * @param {string} [p.secondConfirmLabel]  double: ikinci düymənin mətni
 */
export function ConfirmDialog({
  open,
  title,
  description,
  children,
  confirmLabel = 'Təsdiq et',
  cancelLabel = 'Ləğv et',
  tone = 'danger',
  busy = false,
  onConfirm,
  onCancel,
  guard = 'none',
  guardWord = 'SİL',
  secondStepText = 'Bu əməliyyat geri qaytarılmır. Davam etmək istədiyinizə əminsiniz?',
  secondConfirmLabel = 'Bəli, birdəfəlik sil',
}) {
  const [typed, setTyped] = useState('');
  const [armed, setArmed] = useState(false);
  const [cool, setCool] = useState(false);
  /* bağlananda sıfırla (render zamanı — effektdə setState yox) */
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setTyped('');
      setArmed(false);
    }
  }
  const typedOk = guard !== 'type' || normWord(typed) === normWord(guardWord);
  const variant = tone === 'danger' ? 'danger' : tone === 'success' ? 'success' : 'primary';
  const onClick = () => {
    if (guard === 'double' && !armed) {
      setArmed(true);
      setCool(true);
      setTimeout(() => setCool(false), 600);
      return;
    }
    onConfirm?.();
  };
  const iconBox =
    tone === 'danger' ? (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rust-mist text-rust">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </span>
    ) : (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EEE6] text-[#5C4A3A]">
        <Info className="h-5 w-5" aria-hidden="true" />
      </span>
    );
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onCancel}
      title={title}
      description={description}
      size="sm"
      icon={iconBox}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={busy}
            data-autofocus={tone === 'danger' ? true : undefined}
          >
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onClick} loading={busy} disabled={!typedOk || cool}>
            {guard === 'double' && armed ? secondConfirmLabel : confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      {guard === 'type' && (
        <Field
          label={
            <>
              Təsdiq üçün{' '}
              <span lang="az" className="rounded bg-rust-mist px-1.5 py-0.5 font-mono text-rust">
                {guardWord}
              </span>{' '}
              yazın
            </>
          }
          className="mt-1"
        >
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
          />
        </Field>
      )}
      {guard === 'double' && armed && (
        <Notice tone="danger" className="mt-1">
          {secondStepText}
        </Notice>
      )}
    </Modal>
  );
}

// ── Toast ────────────────────────────────────────────────────────
/**
 * Qısa bildiriş (avtomatik bağlanır, üzərinə gələndə dayanır).
 * Mobildə aşağı naviqasiyanın üstündə durur.
 * @param {object} p
 * @param {boolean} p.open  @param {'success'|'error'|'info'} [p.tone='success']
 * @param {import('react').ReactNode} p.message  @param {()=>void} p.onClose
 * @param {string} [p.actionLabel]  @param {()=>void} [p.onAction]  (məs. «Geri al»)
 * @param {number} [p.duration=4000]  0 — avtomatik bağlanmır
 * @param {boolean} [p.aboveNav=true]  Mobil naviqasiya yoxdursa false
 */
export function Toast({
  open,
  tone = 'success',
  message,
  onClose,
  actionLabel,
  onAction,
  duration = 4000,
  aboveNav = true,
  closeLabel = 'Bağla',
}) {
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const closeRef = useRef(onClose);
  useLayoutEffect(() => {
    closeRef.current = onClose;
  });
  useEffect(() => {
    if (!open || !duration || hover) return undefined;
    const t = setTimeout(() => closeRef.current?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, hover, message]);
  const Icon = tone === 'error' ? CircleAlert : tone === 'info' ? Info : CircleCheck;
  const ic = tone === 'error' ? 'text-[#F0A493]' : tone === 'info' ? 'text-sand' : 'text-[#B5D29C]';
  return (
    <div
      aria-live="polite"
      className={cx(
        'pointer-events-none fixed inset-x-0 z-[95] flex justify-center px-4',
        aboveNav
          ? 'bottom-[calc(76px+env(safe-area-inset-bottom,0px))] lg:bottom-6'
          : 'bottom-[calc(16px+env(safe-area-inset-bottom,0px))]',
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            role={tone === 'error' ? 'alert' : 'status'}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto flex w-full max-w-[460px] items-center gap-3 rounded-[12px] bg-espresso py-2 pl-4 pr-2 text-[14px] text-cream shadow-[0_16px_40px_-16px_rgba(28,22,20,0.6)]"
          >
            <Icon className={cx('h-5 w-5 shrink-0', ic)} aria-hidden="true" />
            <p className="min-w-0 flex-1 py-1.5 leading-snug">{message}</p>
            {actionLabel && (
              <button
                type="button"
                onClick={onAction}
                className={cx(
                  'h-11 shrink-0 rounded-[8px] px-3 font-semibold text-[#E8D5A3] hover:bg-white/10',
                  FOCUS_DARK,
                )}
              >
                {actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className={cx(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] text-sand hover:bg-white/10 hover:text-cream',
                FOCUS_DARK,
              )}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Qrafiklər (kitabxanasız) ─────────────────────────────────────
const BAR = '#A9822F';
const PEAK = '#84652A';
const ACTIVE = '#2C2523';

/** Seriya boşdurmu (bütün dəyərlər 0 və ya massiv boş)? */
export const isEmptySeries = (data) => !data?.length || data.every((d) => !d.value);

/**
 * Sadə sütun qrafiki (div). Ən yüksək sütun tünd qızılı + üstündə rəqəm.
 * Hover / toxunuş / ← → ilə dəqiq dəyər. Ekran oxuyucu üçün gizli cədvəl.
 * @param {object} p
 * @param {{label:string,value:number}[]} p.data
 * @param {string} p.title  Gizli başlıq (aria)
 * @param {(v:number)=>string} [p.formatValue]  Tooltip mətni (məs. v => `${v} baxış`)
 * @param {number} [p.height=120]
 * @param {boolean} [p.showPeak=true]
 */
export function MiniBarChart({
  data = [],
  title,
  formatValue = (v) => formatNumber(v),
  height = 120,
  showPeak = true,
  className = '',
}) {
  const [active, setActive] = useState(null);
  const [w, setW] = useState(0);
  const box = useRef(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const max = Math.max(1, ...data.map((d) => d.value));
  const peak = data.reduce((b, d, i) => (d.value > (data[b]?.value ?? -1) ? i : b), 0);
  const step = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor((w || 320) / 46))));
  const onKey = (e) => {
    if (!data.length) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActive((a) => (a == null ? 0 : Math.min(data.length - 1, a + 1)));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActive((a) => (a == null ? data.length - 1 : Math.max(0, a - 1)));
    } else if (e.key === 'Escape') setActive(null);
  };
  const cur = active != null ? data[active] : null;
  return (
    <div className={className}>
      <div
        ref={box}
        tabIndex={0}
        role="group"
        aria-label={`${title}. Dəyərlər üçün ← → oxlarından istifadə edin.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}
        className={cx('relative rounded-[6px]', FOCUS)}
        style={{ paddingTop: showPeak ? 22 : 8 }}
      >
        <div className="flex items-end gap-[3px]" style={{ height }}>
          {data.map((d, i) => {
            const h = d.value ? Math.max(4, (d.value / max) * height) : 2;
            const isPeak = showPeak && i === peak && d.value > 0;
            const color = active === i ? ACTIVE : d.value === 0 ? '#E5DED2' : isPeak ? PEAK : BAR;
            return (
              <div
                key={d.label + i}
                className="relative flex h-full flex-1 items-end"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                onPointerDown={() => setActive(i)}
              >
                {isPeak && active == null && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] font-semibold text-[#5E4512] tabular-nums"
                    style={{ bottom: h + 4 }}
                    aria-hidden="true"
                  >
                    {formatNumber(d.value)}
                  </span>
                )}
                <div
                  className="w-full rounded-t-[4px] transition-colors duration-100"
                  style={{ height: h, background: color }}
                />
              </div>
            );
          })}
        </div>
        {cur && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-espresso px-2 py-1 text-[12px] font-medium text-cream"
            style={{ left: `clamp(48px, ${((active + 0.5) / data.length) * 100}%, calc(100% - 48px))` }}
          >
            {cur.label} · {formatValue(cur.value)}
          </div>
        )}
      </div>
      <div className="mt-1.5 flex gap-[3px]" aria-hidden="true">
        {data.map((d, i) => {
          const show = i % step === 0 || i === data.length - 1;
          const edge = i === 0 ? 'left-0' : i === data.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2';
          // son etiket əvvəlkinə çox yaxındırsa göstərmə
          const crowded = i === data.length - 1 && i % step !== 0 && i % step < step / 2;
          return (
            <span key={d.label + i} className="relative h-4 flex-1">
              {show && !crowded && (
                <span
                  className={cx(
                    'absolute top-0 whitespace-nowrap text-[12px] leading-4 text-[#6B5E54]',
                    edge,
                  )}
                >
                  {d.label}
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span className="sr-only" aria-live="polite">
        {cur ? `${cur.label}: ${formatValue(cur.value)}` : ''}
      </span>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.label + i}>
              <th scope="row">{d.label}</th>
              <td>{formatValue(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Üfüqi zolaq siyahısı (məs. paket bölgüsü). Uzunluq ən böyük dəyərə nisbətdir.
 * @param {object} p
 * @param {{label:string,value:number,hint?:string}[]} p.items
 * @param {(v:number,total:number)=>string} [p.formatValue]
 */
export function BarList({ items = [], formatValue, className = '' }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <ul className={cx('space-y-3.5', className)}>
      {items.map((it) => (
        <li key={it.label}>
          <div className="flex items-baseline justify-between gap-3 text-[14px]">
            <span className="font-medium text-espresso">{it.label}</span>
            <span className="tabular-nums text-[#5C4A3A]">
              {formatValue ? formatValue(it.value, total) : formatNumber(it.value)}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#EFE9DF]" aria-hidden="true">
            <div
              className="h-full rounded-full"
              style={{ width: `${(it.value / max) * 100}%`, background: BAR }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

// ── Admin qabığı ─────────────────────────────────────────────────
/** Default bölmələr (sıra = yan paneldəki sıra). `short` — mobil aşağı naviqasiya adı. */
export const ADMIN_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', short: 'Panel', icon: LayoutGrid },
  { id: 'orders', label: 'Sifarişlər', icon: ShoppingBag },
  { id: 'invites', label: 'Dəvətnamələr', short: 'Dəvətnamə', icon: FileText },
  { id: 'photos', label: 'Fotolar', icon: ImageIcon },
  { id: 'qr', label: 'QR Stend', icon: QrCode },
  { id: 'letters', label: 'Təbrik Məktubları', icon: MessageSquare },
  { id: 'maintenance', label: 'Baxım', icon: ShieldCheck },
];

function NavLink({ section, active, badge, onSelect, getHref, dark = true, variant = 'side' }) {
  const Icon = section.icon;
  const href = getHref?.(section.id);
  const Tag = href ? 'a' : 'button';
  const common = {
    href,
    type: href ? undefined : 'button',
    'aria-current': active ? 'page' : undefined,
    onClick: (e) => onSelect?.(section.id, e),
  };
  const srBadge = badge ? <span className="sr-only">, {badge.label ?? badge.count}</span> : null;

  if (variant === 'tab') {
    return (
      <Tag
        {...common}
        className={cx(
          'relative flex h-16 flex-1 flex-col items-center justify-center gap-1 text-[12px] font-medium',
          active ? 'text-[#E8D5A3]' : 'text-sand hover:text-cream',
          FOCUS_DARK,
          'focus-visible:ring-offset-0 focus-visible:ring-inset',
        )}
      >
        {active && (
          <span aria-hidden="true" className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-[#C5A059]" />
        )}
        <span className="relative">
          <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
          {badge?.count > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#C5A059] px-1 text-[11.5px] font-semibold text-espresso ring-2 ring-[#1C1614]"
            >
              {badge.count}
            </span>
          )}
        </span>
        <span>{section.short ?? section.label}</span>
        {srBadge}
      </Tag>
    );
  }

  if (!dark) {
    // «Daha çox» vərəqi (ağ fon)
    return (
      <Tag
        {...common}
        className={cx(
          'flex h-14 w-full items-center gap-3.5 rounded-[12px] px-3.5 text-left text-[16px]',
          active ? 'bg-gold-mist/80 font-semibold text-espresso' : 'text-[#3F342E] hover:bg-[#F6F3ED]',
          FOCUS_INSET,
        )}
      >
        <Icon className={cx('h-5 w-5', active ? 'text-gold-deep' : 'text-[#6B5E54]')} aria-hidden="true" />
        <span className="flex-1">{section.label}</span>
        {badge?.count > 0 && (
          <span
            aria-hidden="true"
            className="rounded-full bg-[#FBF1DC] px-2.5 py-0.5 text-[12.5px] font-semibold text-[#6E5114]"
          >
            {badge.label ?? badge.count}
          </span>
        )}
        {srBadge}
      </Tag>
    );
  }

  return (
    <Tag
      {...common}
      className={cx(
        'relative flex h-11 w-full items-center gap-3 rounded-[8px] px-3 text-left text-[14px] transition-colors',
        active
          ? 'bg-white/[0.08] font-medium text-white before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[3px] before:rounded-full before:bg-[#C5A059]'
          : 'text-sand hover:bg-white/[0.05] hover:text-cream',
        FOCUS_DARK,
      )}
    >
      <Icon
        className={cx('h-[18px] w-[18px] shrink-0', active ? 'text-[#E8D5A3]' : 'text-[#A99D8E]')}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate">{section.label}</span>
      {badge?.count > 0 && (
        <span
          aria-hidden="true"
          className="shrink-0 rounded-full bg-[#C5A059] px-2 py-0.5 text-[12px] font-semibold text-espresso"
        >
          {badge.label ?? badge.count}
        </span>
      )}
      {srBadge}
    </Tag>
  );
}

/**
 * Admin qabığı. Desktop (≥1024px): sol yan panel. Mobil: yuxarı panel + aşağı naviqasiya
 * (4 bölmə + «Daha çox» vərəqi). Marşrutlaşdırma sizdədir: `onNavigate(id, event)` və ya `getHref`.
 * @param {object} p
 * @param {string} p.active  Aktiv bölmənin id-si
 * @param {(id:string, e:Event)=>void} [p.onNavigate]
 * @param {(id:string)=>string} [p.getHref]  Verilsə <a href> render olunur (router Link əvəzinə)
 * @param {Record<string,{count:number,label?:string}>} [p.badges]  məs. { orders: { count: 3, label: '3 yeni' } }
 * @param {typeof ADMIN_SECTIONS} [p.sections]
 * @param {string[]} [p.mobileTabs]  Aşağı naviqasiyadakı 4 bölmə
 * @param {string} [p.pageTitle]  Mobil yuxarı paneldə sağda
 * @param {()=>void} [p.onBackToSite]  @param {string} [p.backToSiteHref]
 * @param {()=>void} [p.onLogout]  Verilsə «Çıxış» görünür
 */
export function AdminShell({
  active,
  onNavigate,
  getHref,
  badges = {},
  sections = ADMIN_SECTIONS,
  mobileTabs = ['dashboard', 'orders', 'invites', 'photos'],
  pageTitle,
  onBackToSite,
  backToSiteHref,
  backToSiteLabel = 'Sayta qayıt',
  onLogout,
  logoutLabel = 'Çıxış',
  moreLabel = 'Daha çox',
  moreTitle = 'Bölmələr',
  brandSub = 'Admin panel',
  children,
}) {
  const [more, setMore] = useState(false);
  const select = (id, e) => {
    setMore(false);
    onNavigate?.(id, e);
  };
  const tabSections = mobileTabs.map((id) => sections.find((s) => s.id === id)).filter(Boolean);
  const inMore = !mobileTabs.includes(active);
  const BackTag = backToSiteHref ? 'a' : 'button';
  const moreBadge = sections
    .filter((s) => !mobileTabs.includes(s.id))
    .reduce((n, s) => n + (badges[s.id]?.count ?? 0), 0);

  return (
    <div className="min-h-dvh bg-[#F6F3ED] font-sans text-espresso lg:flex">
      <a
        href="#admin-main"
        className="sr-only z-[100] rounded-[8px] bg-espresso px-4 py-3 text-cream focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Əsas məzmuna keç
      </a>

      {/* ── Desktop yan panel ── */}
      <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col bg-[#1C1614] lg:flex">
        <div className="flex h-[76px] flex-col justify-center border-b border-white/10 px-6">
          <span className="font-serif text-[24px] leading-none text-[#E8D5A3]">Digitoy</span>
          <span lang="az" className="mt-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-sand">
            {brandSub}
          </span>
        </div>
        <nav aria-label="Admin bölmələri" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <NavLink
                  section={s}
                  active={s.id === active}
                  badge={badges[s.id]}
                  onSelect={select}
                  getHref={getHref}
                />
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-1 border-t border-white/10 px-3 py-3">
          <BackTag
            href={backToSiteHref}
            type={backToSiteHref ? undefined : 'button'}
            onClick={onBackToSite}
            className={cx(
              'flex h-11 w-full items-center gap-3 rounded-[8px] px-3 text-[14px] text-sand hover:bg-white/[0.05] hover:text-cream',
              FOCUS_DARK,
            )}
          >
            <LogOut className="h-[18px] w-[18px] rotate-180" aria-hidden="true" />
            {backToSiteLabel}
          </BackTag>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className={cx(
                'flex h-11 w-full items-center gap-3 rounded-[8px] px-3 text-[14px] text-sand hover:bg-white/[0.05] hover:text-cream',
                FOCUS_DARK,
              )}
            >
              <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
              {logoutLabel}
            </button>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* ── Mobil yuxarı panel ── */}
        <header
          className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-[#1C1614] px-4 lg:hidden"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="flex h-14 items-baseline gap-2">
            <span className="self-center font-serif text-[22px] leading-none text-[#E8D5A3]">Digitoy</span>
            <span
              lang="az"
              className="self-center text-[12px] font-medium uppercase tracking-[0.18em] text-sand"
            >
              Admin
            </span>
          </div>
          {pageTitle && (
            <span className="min-w-0 truncate text-[15px] font-medium text-cream">{pageTitle}</span>
          )}
        </header>

        <main
          id="admin-main"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1440px] px-4 pb-[calc(96px+env(safe-area-inset-bottom,0px))] pt-5 focus:outline-none sm:px-6 lg:px-8 lg:pb-12 lg:pt-8"
        >
          {children}
        </main>
      </div>

      {/* ── Mobil aşağı naviqasiya ── */}
      <nav
        aria-label="Admin bölmələri"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#1C1614] lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <ul className="flex">
          {tabSections.map((s) => (
            <li key={s.id} className="flex flex-1">
              <NavLink
                section={s}
                active={s.id === active && !more}
                badge={badges[s.id]}
                onSelect={select}
                getHref={getHref}
                variant="tab"
              />
            </li>
          ))}
          <li className="flex flex-1">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={more}
              onClick={() => setMore(true)}
              className={cx(
                'relative flex h-16 flex-1 flex-col items-center justify-center gap-1 text-[12px] font-medium',
                inMore || more ? 'text-[#E8D5A3]' : 'text-sand hover:text-cream',
                FOCUS_DARK,
                'focus-visible:ring-offset-0 focus-visible:ring-inset',
              )}
            >
              {(inMore || more) && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-[#C5A059]"
                />
              )}
              <span className="relative">
                <MoreHorizontal className="h-[22px] w-[22px]" aria-hidden="true" />
                {moreBadge > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rounded-full bg-[#C5A059] ring-2 ring-[#1C1614]"
                  />
                )}
              </span>
              {moreLabel}
            </button>
          </li>
        </ul>
      </nav>

      <Sheet
        open={more}
        onClose={() => setMore(false)}
        title={
          <span lang="az" className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#6B5E54]">
            {moreTitle}
          </span>
        }
      >
        <nav aria-label={moreTitle}>
          <ul className="space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <NavLink
                  section={s}
                  active={s.id === active}
                  badge={badges[s.id]}
                  onSelect={select}
                  getHref={getHref}
                  dark={false}
                />
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-[#EEE8DF] pt-3">
            <BackTag
              href={backToSiteHref}
              type={backToSiteHref ? undefined : 'button'}
              onClick={() => {
                setMore(false);
                onBackToSite?.();
              }}
              className={cx(
                'flex h-14 w-full items-center gap-3.5 rounded-[12px] px-3.5 text-[16px] text-[#3F342E] hover:bg-[#F6F3ED]',
                FOCUS_INSET,
              )}
            >
              <LogOut className="h-5 w-5 rotate-180 text-[#6B5E54]" aria-hidden="true" />
              {backToSiteLabel}
            </BackTag>
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  setMore(false);
                  onLogout();
                }}
                className={cx(
                  'flex h-14 w-full items-center gap-3.5 rounded-[12px] px-3.5 text-[16px] text-[#3F342E] hover:bg-[#F6F3ED]',
                  FOCUS_INSET,
                )}
              >
                <LogOut className="h-5 w-5 text-[#6B5E54]" aria-hidden="true" />
                {logoutLabel}
              </button>
            )}
          </div>
        </nav>
      </Sheet>
    </div>
  );
}

/**
 * Mobil yapışqan əməliyyat paneli — aşağı naviqasiyanın düz üstündə (lg-də gizlənir).
 * Səhifənin altına `pb-24` kimi əlavə boşluq verin ki, məzmun panelin altında qalmasın.
 */
export function MobileActionBar({ children, label = 'Əməliyyatlar', className = '' }) {
  return (
    <div
      role="region"
      aria-label={label}
      className={cx(
        'fixed inset-x-0 z-30 border-t border-[#E5DED2] bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden',
        className,
      )}
      style={{ bottom: ABOVE_MOBILE_NAV }}
    >
      <div className="mx-auto flex max-w-[640px] items-center gap-2">{children}</div>
    </div>
  );
}

// ── Kiçik sifariş elementləri (2-ci hissədə də işlədilir) ────────
/** Şablon: rəng nöqtəsi + ad. Açıq rəngli şablonun nöqtəsi görünsün deyə çərçivəlidir. */
export function TemplateLabel({ name, color = '#C5A059', className = '' }) {
  return (
    <span className={cx('inline-flex min-w-0 items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className="h-3 w-3 shrink-0 rounded-[4px] ring-1 ring-inset ring-black/15"
        style={{ background: color }}
      />
      <span className="truncate">
        <span lang="en">{name}</span>
      </span>
    </span>
  );
}

/** Sifariş kodu (DT-99JCW9) — mono şrift, oxunaqlı aralıq. */
export function OrderCode({ children, className = '' }) {
  return (
    <span
      className={cx(
        'whitespace-nowrap font-mono text-[13px] font-medium tracking-[0.04em] text-[#3F342E]',
        className,
      )}
    >
      {children}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════
// ── 2-ci HİSSƏ ƏLAVƏLƏRİ ─────────────────────────────────────────
// Switch, SegmentedControl, CopyButton, ChangedBadge, ResetFieldButton,
// ColorField, RangeField, OpStatus, SummaryList, ProgressBar, LangLabel
// (Modal-a da `size="full"`, `headerExtra`, `footerLayout`, `bodyPadding` əlavə olunub.)
// ════════════════════════════════════════════════════════════════

/**
 * Açar (switch). Bütün sətir kliklənir; ekran oxuyucu üçün role="switch".
 * @param {object} p
 * @param {boolean} p.checked  @param {(v:boolean)=>void} p.onChange
 * @param {import('react').ReactNode} p.label  @param {import('react').ReactNode} [p.description]
 * @param {boolean} [p.disabled]  @param {import('react').ReactNode} [p.badge]  Ad yanında nişan (məs. «Vacib»)
 */
export function Switch({ checked, onChange, label, description, disabled = false, badge, className = '' }) {
  const id = useId();
  return (
    <div className={cx('flex items-start gap-4 py-1', className)}>
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className={cx(
            'flex flex-wrap items-center gap-2 text-[14.5px] font-medium text-espresso',
            !disabled && 'cursor-pointer',
          )}
        >
          {label}
          {badge}
        </label>
        {description && (
          <p id={`${id}-d`} className="mt-0.5 text-[13px] leading-snug text-[#6B5E54]">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-d` : undefined}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cx(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 before:absolute before:-inset-2 before:content-[''] disabled:cursor-not-allowed disabled:opacity-50",
          checked ? 'bg-olive' : 'bg-[#CFC5B6]',
          FOCUS,
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            'flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-150',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-olive" />}
        </span>
      </button>
    </div>
  );
}

/**
 * Seçim düymələri qrupu (radiogroup): AZ/EN/RU, Redaktə/Önbaxış, Telefon/Desktop.
 * ← → ilə gəzilir. Tabs-dan fərqi: panel dəyişmir, eyni formanın rejimi dəyişir.
 * @param {object} p
 * @param {{value:string,label:import('react').ReactNode,icon?:import('react').ComponentType,lang?:string,hint?:string}[]} p.options
 * @param {string} p.value  @param {(v:string)=>void} p.onChange  @param {string} p.label  aria-label
 * @param {boolean} [p.block]  Tam en (seçimlər bərabər bölünür)
 * @param {'sm'|'md'} [p.size='md']
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  label,
  block = false,
  size = 'md',
  className = '',
}) {
  const refs = useRef([]);
  const onKey = (e, i) => {
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % options.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + options.length) % options.length;
    if (n == null) return;
    e.preventDefault();
    onChange?.(options[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx('inline-flex rounded-[8px] bg-[#EFE9DF] p-1', block && 'flex w-full', className)}
    >
      {options.map((o, i) => {
        const on = o.value === value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            title={o.hint}
            onClick={() => onChange?.(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] px-3.5 font-medium transition-colors',
              size === 'sm' ? 'h-11 text-[13.5px] lg:h-8' : 'h-11 text-[14px] lg:h-9',
              block && 'flex-1',
              on ? 'bg-white text-espresso shadow-sm' : 'text-[#5C4A3A] hover:text-espresso',
              FOCUS_INSET,
            )}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {o.lang ? <span lang={o.lang}>{o.label}</span> : o.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Kopyalama düyməsi: «Kopyala» → «Kopyalandı» (2 san.). Kopyalama özü `onCopy`-dədir.
 * @param {object} p
 * @param {string} p.value  @param {(v:string)=>void|Promise<void>} p.onCopy
 * @param {string} [p.label='Kopyala']  @param {string} [p.copiedLabel='Kopyalandı']
 * @param {'primary'|'secondary'|'ghost'} [p.variant='secondary']  @param {'sm'|'md'} [p.size='md']
 */
export function CopyButton({
  value,
  onCopy,
  label = 'Kopyala',
  copiedLabel = 'Kopyalandı',
  errorLabel = 'Kopyalanmadı',
  variant = 'secondary',
  size = 'md',
  icon = Copy,
  block = false,
  className = '',
}) {
  const [state, setState] = useState('idle');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await onCopy?.(value);
      setState('done');
    } catch {
      setState('error');
    }
    timer.current = setTimeout(() => setState('idle'), 2200);
  };
  return (
    <Button
      variant={state === 'done' && variant === 'primary' ? 'success' : variant}
      size={size}
      block={block}
      icon={state === 'done' ? Check : icon}
      onClick={copy}
      className={cx(state === 'done' && variant !== 'primary' && 'text-olive', className)}
    >
      <span aria-live="polite">
        {state === 'done' ? copiedLabel : state === 'error' ? errorLabel : label}
      </span>
    </Button>
  );
}

/** «Dəyişib» nişanı — sahə saxlanmış versiyadan fərqlidir (saxlanmayıb). */
export function ChangedBadge({ label = 'dəyişib', className = '' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full bg-[#FBF1DC] px-2 py-0.5 text-[12px] font-medium text-[#6E5114]',
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#B8903A]" />
      {label}
    </span>
  );
}

/** Sahəni şablonun öz dəyərinə qaytaran kiçik düymə (ikon + tooltip). */
export function ResetFieldButton({ onClick, label = 'Sahəni sıfırla', field }) {
  return (
    <IconButton
      size="sm"
      icon={RotateCcw}
      label={field ? `${label}: ${field}` : label}
      onClick={onClick}
      tooltipAlign="end"
    />
  );
}

/**
 * Rəng sahəsi: rəng seçici + hex. Şablondan fərqlidirsə «sıfırla» görünür.
 * @param {object} p
 * @param {string} p.label  @param {string} p.value  hex (#RRGGBB)
 * @param {(hex:string)=>void} p.onChange  @param {string} [p.defaultValue]  Şablonun rəngi
 * @param {boolean} [p.changed]  Saxlanmamış dəyişiklik
 * @param {string} [p.hint]
 */
export function ColorField({ label, value, onChange, defaultValue, changed = false, hint, className = '' }) {
  const id = useId();
  const [draft, setDraft] = useState(value ?? '');
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(value ?? '');
  }
  const valid = (v) => /^#([0-9a-f]{6})$/i.test(v);
  const commit = (v) => {
    let x = v.trim();
    if (x && !x.startsWith('#')) x = `#${x}`;
    if (/^#([0-9a-f]{3})$/i.test(x)) x = `#${x[1]}${x[1]}${x[2]}${x[2]}${x[3]}${x[3]}`;
    if (valid(x)) onChange?.(x.toUpperCase());
    else setDraft(value ?? '');
  };
  const differs = defaultValue && value && value.toUpperCase() !== defaultValue.toUpperCase();
  return (
    <div
      className={cx(
        'flex items-center gap-3 rounded-[8px] px-3 py-2.5',
        changed ? 'bg-[#FDF8EC] ring-1 ring-inset ring-[#EBD39C]' : 'ring-1 ring-inset ring-[#EEE8DF]',
        className,
      )}
    >
      <label
        className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-[8px] ring-1 ring-inset ring-black/15 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#A9822F]"
        style={{ background: value }}
      >
        <span className="sr-only">{label} — rəng seçici</span>
        <input
          type="color"
          value={valid(value ?? '') ? value : '#000000'}
          onChange={(e) => onChange?.(e.target.value.toUpperCase())}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-espresso"
        >
          {label}
          {changed && <ChangedBadge />}
        </label>
        {hint && <p className="text-[12.5px] text-[#6B5E54]">{hint}</p>}
      </div>
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && commit(e.currentTarget.value)}
        spellCheck={false}
        maxLength={7}
        aria-label={`${label} — hex kodu`}
        className={cx(
          INPUT_BASE.replace('w-full ', ''),
          'h-11 w-[104px] shrink-0 px-2.5 font-mono text-[13.5px] uppercase',
        )}
      />
      {differs ? (
        <ResetFieldButton
          onClick={() => onChange?.(defaultValue.toUpperCase())}
          label="Şablon rənginə qaytar"
          field={label}
        />
      ) : (
        <span className="w-11 shrink-0 lg:w-9" aria-hidden="true" />
      )}
    </div>
  );
}

/**
 * Sürüşgəc (range) + cari dəyər.
 * @param {object} p
 * @param {string} p.label  @param {number} p.value  @param {(v:number)=>void} p.onChange
 * @param {number} [p.min=0]  @param {number} [p.max=100]  @param {number} [p.step=1]
 * @param {(v:number)=>string} [p.format]  @param {[string,string]} [p.ends]  Uc yazıları
 */
export function RangeField({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  format = (v) => v,
  ends,
  hint,
  className = '',
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-[#3F342E]">
          {label}
        </label>
        <span className="text-[14px] font-semibold text-espresso tabular-nums">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={String(format(value))}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={cx(
          'h-11 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none',
          '[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent',
          '[&::-webkit-slider-thumb]:-mt-[9px] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-espresso [&::-webkit-slider-thumb]:shadow',
          '[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent [&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-[#A9822F] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-espresso',
          'focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-[#A9822F]/40',
        )}
        style={{
          background: `linear-gradient(90deg,#A9822F ${pct}%,#E5DED2 ${pct}%) center / 100% 6px no-repeat`,
          borderRadius: 999,
        }}
      />
      {ends && (
        <div className="-mt-1 flex justify-between text-[12px] text-[#6B5E54]" aria-hidden="true">
          <span>{ends[0]}</span>
          <span>{ends[1]}</span>
        </div>
      )}
      {hint && <p className="mt-1.5 text-[12.5px] text-[#6B5E54]">{hint}</p>}
    </div>
  );
}

/**
 * Əməliyyat vəziyyəti sətri: işləyir / bitdi / xəta (ikon + mətn, aria-live).
 * @param {object} p
 * @param {'idle'|'running'|'done'|'error'} p.state  @param {import('react').ReactNode} [p.text]
 */
export function OpStatus({ state = 'idle', text, className = '' }) {
  if (state === 'idle' && !text) return <span aria-live="polite" className="sr-only" />;
  const T = {
    idle: { icon: Info, cls: 'text-[#6B5E54]' },
    running: { icon: null, cls: 'text-[#5C4A3A]' },
    done: { icon: CircleCheck, cls: 'text-[#3D5530]' },
    error: { icon: CircleAlert, cls: 'text-rust' },
  }[state];
  const Icon = T.icon;
  const fallback = { running: 'İşləyir…', done: 'Bitdi', error: 'Xəta baş verdi' }[state];
  return (
    <p
      aria-live="polite"
      className={cx('flex items-start gap-2 text-[13.5px] font-medium leading-snug', T.cls, className)}
    >
      {state === 'running' ? (
        <Spinner className="mt-px h-4 w-4 shrink-0" />
      ) : (
        Icon && <Icon className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span>{text ?? fallback}</span>
    </p>
  );
}

/**
 * Sətir-sətir xülasə (ad — dəyər). `loading` olanda dəyərlər skeleton olur.
 * @param {object} p
 * @param {{label:import('react').ReactNode,value:import('react').ReactNode,emphasis?:boolean}[]} p.items
 * @param {boolean} [p.loading]
 */
export function SummaryList({ items = [], loading = false, className = '' }) {
  return (
    <dl className={cx('divide-y divide-[#EEE8DF] rounded-[8px] ring-1 ring-inset ring-[#E5DED2]', className)}>
      {items.map((it, i) => (
        <div key={i} className="flex min-h-11 items-center justify-between gap-4 px-3.5 py-2">
          <dt className="text-[14px] text-[#5C4A3A]">{it.label}</dt>
          <dd
            className={cx(
              'text-right text-[14px] tabular-nums',
              it.emphasis ? 'font-semibold text-rust' : 'font-semibold text-espresso',
            )}
          >
            {loading ? <Skeleton className="h-3.5 w-14" /> : it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** İrəliləyiş zolağı (faiz). */
export function ProgressBar({ value = 0, label, className = '' }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex justify-between text-[13px] text-[#5C4A3A]">
          <span>{label}</span>
          <span className="font-semibold tabular-nums">{Math.round(v)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(v)}
        aria-label={label}
        className="h-2 overflow-hidden rounded-full bg-[#EFE9DF]"
      >
        <div
          className="h-full rounded-full bg-[#A9822F] transition-[width] duration-200"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

/** Dil kodları üçün oxunaqlı ad (ekran oxuyucu düzgün tələffüz etsin). */
export const LANGS = {
  az: { short: 'AZ', label: 'Azərbaycanca', lang: 'az' },
  en: { short: 'EN', label: 'English', lang: 'en' },
  ru: { short: 'RU', label: 'Русский', lang: 'ru' },
};
