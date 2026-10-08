// ════════════════════════════════════════════════════════════════
// Builder — bildiriş, təsdiq pəncərəsi, spinner, boş vəziyyət (YALNIZ görünüş)
// ════════════════════════════════════════════════════════════════
import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, History, Info, X } from 'lucide-react';
import t from '../../data/translations';

const tx = (lang) => t[lang] ?? t.az ?? {};

const VARIANTS = {
  info: { icon: Info, box: 'bg-white ring-gold/25', iconBox: 'bg-gold-mist text-gold-deep' },
  draft: { icon: History, box: 'bg-gold-mist/60 ring-gold/35', iconBox: 'bg-espresso text-gold-light' },
  success: { icon: CheckCircle2, box: 'bg-olive-mist ring-olive/25', iconBox: 'bg-olive text-white' },
  error: { icon: AlertTriangle, box: 'bg-rust-mist ring-rust/30', iconBox: 'bg-rust text-white' },
};

/**
 * Bildiriş zolağı. Məs: «Qaralama bərpa edildi» + «Yenidən başla».
 * @param {object} p
 * @param {'info'|'draft'|'success'|'error'} [p.variant='info']
 * @param {string} [p.title]
 * @param {React.ReactNode} [p.children]   Mətn
 * @param {React.ReactNode} [p.action]     Sağdakı düymə(lər)
 * @param {()=>void} [p.onDismiss]         Verilərsə «×» görünür
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function Notice({ variant = 'info', title, children, action, onDismiss, lang = 'az', className = '' }) {
  const x = tx(lang);
  const v = VARIANTS[variant] ?? VARIANTS.info;
  const Icon = v.icon;
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex flex-col gap-3 rounded-2xl p-4 ring-1 ring-inset sm:flex-row sm:items-center sm:gap-4 sm:p-5 ${v.box} ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${v.iconBox}`}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0 pt-0.5">
          {title && <p className="text-[14.5px] font-semibold text-ink">{title}</p>}
          {children && <div className="mt-0.5 text-[13.5px] leading-relaxed text-brown-dark">{children}</div>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={x.dismiss ?? 'Bağla'}
            className="-mr-1 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-brown-dark transition-colors hover:bg-black/5 sm:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {(action || onDismiss) && (
        <div className="flex items-center gap-2 pl-[50px] sm:pl-0">
          {action}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label={x.dismiss ?? 'Bağla'}
              className="hidden h-11 w-11 place-items-center rounded-full text-brown-dark transition-colors hover:bg-black/5 sm:grid"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Notice daxilində istifadə üçün kiçik mətn düyməsi */
export function NoticeButton({ onClick, children, tone = 'default' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center rounded-full px-4 text-[12px] font-semibold uppercase tracking-label transition-colors ${
        tone === 'danger'
          ? 'text-rust hover:bg-rust/10'
          : 'bg-white text-ink ring-1 ring-inset ring-beige-dark hover:ring-gold'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Təsdiq pəncərəsi (modal). Esc ilə bağlanır, fokus içində qalır, açılanda «Ləğv et»-ə fokuslanır.
 * @param {object} p
 * @param {boolean} p.open
 * @param {string} p.title
 * @param {React.ReactNode} [p.description]
 * @param {string} [p.confirmLabel]
 * @param {string} [p.cancelLabel]
 * @param {()=>void} p.onConfirm
 * @param {()=>void} p.onCancel
 * @param {boolean} [p.destructive]   Təsdiq düyməsi rust rəngdə
 * @param {boolean} [p.loading]
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  destructive = false,
  loading = false,
  lang = 'az',
}) {
  const x = tx(lang);
  const reduce = useReducedMotion();
  const panelRef = useRef(null);
  const cancelRef = useRef(null);
  const returnRef = useRef(null);
  const cancelCb = useRef(onCancel);
  // effekt hər render-də yenidən qurulmasın — ən son onCancel ref-də saxlanır
  useEffect(() => { cancelCb.current = onCancel; });
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    returnRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => cancelRef.current?.focus());
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelCb.current?.();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll('button:not([disabled])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      returnRef.current?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-espresso/40 backdrop-blur-[3px]"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
          />
          <motion.div
            ref={panelRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            className="relative w-full max-w-[440px] rounded-[28px] bg-cream p-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] shadow-luxe sm:p-8"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gold-line" />
            <span
              aria-hidden="true"
              className={`grid h-12 w-12 place-items-center rounded-full ${
                destructive ? 'bg-rust-mist text-rust' : 'bg-gold-mist text-gold-deep'
              }`}
            >
              <AlertTriangle className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <h2 id={titleId} className="mt-5 font-serif text-[26px] font-medium leading-tight text-ink">
              {title}
            </h2>
            {description && (
              <div id={descId} className="mt-2.5 text-[14.5px] leading-relaxed text-brown-dark">
                {description}
              </div>
            )}
            <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className="h-12 rounded-full bg-white text-[13px] font-semibold text-ink ring-1 ring-inset ring-beige-dark transition-colors hover:ring-gold"
              >
                {cancelLabel ?? x.cancel ?? 'Ləğv et'}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-full text-[13px] font-semibold text-white transition-colors disabled:opacity-60 ${
                  destructive ? 'bg-rust hover:bg-[#86321F]' : 'bg-espresso hover:bg-espresso-soft'
                }`}
              >
                {loading && <Spinner size="sm" tone="light" />}
                {confirmLabel ?? x.confirm ?? 'Təsdiqlə'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Yüklənmə spinneri.
 * @param {object} p
 * @param {'sm'|'md'|'lg'} [p.size='md']
 * @param {'dark'|'light'|'gold'} [p.tone='gold']
 * @param {string} [p.label]   Ekran oxuyucu üçün (verilməsə «Yüklənir»)
 */
export function Spinner({ size = 'md', tone = 'gold', label, lang = 'az' }) {
  const x = tx(lang);
  const s = { sm: 'h-4 w-4 border-[1.5px]', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-2' }[size];
  const c = {
    gold: 'border-gold/25 border-t-gold-deep',
    dark: 'border-espresso/20 border-t-espresso',
    light: 'border-white/30 border-t-white',
  }[tone];
  return (
    <span role="status" className="inline-flex">
      <span
        aria-hidden="true"
        className={`inline-block animate-spin rounded-full ${s} ${c} motion-reduce:animate-none`}
      />
      <span className="sr-only">{label ?? x.loading ?? 'Yüklənir'}</span>
    </span>
  );
}

/**
 * Boş vəziyyət (siyahı boşdur).
 * @param {object} p
 * @param {React.ComponentType} [p.icon]
 * @param {string} p.title
 * @param {string} [p.text]
 * @param {React.ReactNode} [p.action]
 */
export function EmptyState({ icon: Icon, title, text, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center rounded-3xl border border-dashed border-gold/40 bg-white/50 px-6 py-10 text-center ${className}`}
    >
      {Icon && (
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-mist text-gold-deep">
          <Icon className="h-6 w-6" strokeWidth={1.4} aria-hidden="true" />
        </span>
      )}
      <p className="mt-4 font-serif text-[22px] leading-tight text-ink">{title}</p>
      {text && <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-brown-dark">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
