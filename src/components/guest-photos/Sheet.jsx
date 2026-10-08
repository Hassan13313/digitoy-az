// ════════════════════════════════════════════════════════════════
// Sheet — mobildə tam ekran vərəq, desktopda modal (Statistika, Qapaq ayarları)
// ConfirmDialog — silmə və digər geri qaytarılmaz əməliyyatların təsdiqi
// YALNIZ görünüş: açıq/bağlı vəziyyəti props ilə gəlir.
// ════════════════════════════════════════════════════════════════
import { useId, useRef } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useBodyScrollLock, useFocusTrap } from './hooks';
import { Btn, Spinner } from './shared';
import { FOCUS } from './tokens';

const EASE = [0.22, 1, 0.36, 1];

/**
 * @param {object} p
 * @param {boolean} p.open
 * @param {()=>void} p.onClose
 * @param {string} p.title
 * @param {React.ReactNode} [p.subtitle]       Başlığın altındakı kiçik yazı (məs. «#aysel-ve-nicat · son 30 gün»)
 * @param {React.ReactNode} p.children
 * @param {React.ReactNode} [p.footer]         Aşağıda yapışan düymələr sətri
 * @param {'md'|'lg'} [p.size='md']            Desktop eni: md 600px, lg 820px
 * @param {string} [p.closeLabel='Bağla']
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export default function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeLabel = 'Bağla',
  lang = 'az',
}) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <SheetInner
            {...{
              onClose,
              title,
              subtitle,
              children,
              footer,
              size,
              closeLabel,
              lang,
            }}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

function SheetInner({ onClose, title, subtitle, children, footer, size, closeLabel, lang }) {
  const ref = useRef(null);
  const titleId = useId();
  useBodyScrollLock(true);
  useFocusTrap(ref, true, { onEscape: onClose });
  const w = size === 'lg' ? 'sm:max-w-[820px]' : 'sm:max-w-[600px]';

  return (
    <div lang={lang} className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-espresso/55 backdrop-blur-[3px]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex h-[100dvh] w-full flex-col overflow-hidden bg-cream shadow-luxe sm:h-auto sm:max-h-[90dvh] sm:rounded-[28px] ${w}`}
        initial={{ y: '6%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '4%', opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <header className="sticky top-0 z-10 flex items-start gap-4 border-b border-gold/15 bg-cream/95 px-5 pb-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] backdrop-blur sm:px-8 sm:pt-6">
          <span aria-hidden="true" className="absolute inset-x-10 top-0 hidden h-px bg-gold-line sm:block" />
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="font-serif text-[28px] font-medium leading-tight text-ink sm:text-[32px]"
            >
              {title}
            </h2>
            {subtitle && (
              <div
                lang="az"
                className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-gold-deep"
              >
                {subtitle}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={`-mr-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-brown-dark ring-1 ring-inset ring-gold/30 transition-colors hover:bg-gold-mist/60 hover:text-ink ${FOCUS}`}
          >
            <X className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">{children}</div>
        {footer && (
          <footer className="border-t border-gold/15 bg-cream/95 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+14px)] pt-3.5 backdrop-blur sm:px-8 sm:pb-5">
            {footer}
          </footer>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Təsdiq pəncərəsi. Mobildə aşağıdan çıxır, desktopda mərkəzdə. Açılanda fokus «Ləğv et»-dədir.
 * @param {object} p
 * @param {boolean} p.open
 * @param {string} p.title                 «3 fayl silinəcək — əminsiniz?»
 * @param {React.ReactNode} [p.text]       Əlavə izah
 * @param {string} [p.confirmLabel='Bəli, sil']
 * @param {string} [p.cancelLabel='Ləğv et']
 * @param {()=>void} p.onConfirm
 * @param {()=>void} p.onCancel
 * @param {boolean} [p.busy]               Təsdiq gedir — spinner
 * @param {boolean} [p.destructive=true]
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel = 'Bəli, sil',
  cancelLabel = 'Ləğv et',
  onConfirm,
  onCancel,
  busy = false,
  destructive = true,
  lang = 'az',
}) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <ConfirmInner
            {...{
              title,
              text,
              confirmLabel,
              cancelLabel,
              onConfirm,
              onCancel,
              busy,
              destructive,
              lang,
            }}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

function ConfirmInner({
  title,
  text,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy,
  destructive,
  lang,
}) {
  const ref = useRef(null);
  const cancelRef = useRef(null);
  const titleId = useId();
  const textId = useId();
  useFocusTrap(ref, true, {
    onEscape: busy ? undefined : onCancel,
    initialFocus: cancelRef,
  });
  return (
    <div
      lang={lang}
      className="fixed inset-0 z-[95] flex items-end justify-center p-3 sm:items-center sm:p-6"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={busy ? undefined : onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={text ? textId : undefined}
        className="relative w-full max-w-[420px] rounded-[26px] bg-cream p-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] shadow-luxe sm:p-7"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <span
          aria-hidden="true"
          className={`grid h-12 w-12 place-items-center rounded-full ${destructive ? 'bg-rust-mist text-rust' : 'bg-gold-mist text-gold-deep'}`}
        >
          <AlertTriangle className="h-5 w-5" strokeWidth={1.7} />
        </span>
        <h2 id={titleId} className="mt-5 font-serif text-[26px] font-medium leading-tight text-ink">
          {title}
        </h2>
        {text && (
          <p id={textId} className="mt-2 text-[14.5px] leading-relaxed text-brown-dark">
            {text}
          </p>
        )}
        <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
          <Btn
            ref={cancelRef}
            variant="ghost"
            size="md"
            onClick={onCancel}
            disabled={busy}
            className="normal-case tracking-normal text-[14px]"
          >
            {cancelLabel}
          </Btn>
          <Btn
            variant={destructive ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            disabled={busy}
            className="normal-case tracking-normal text-[14px]"
          >
            {busy && <Spinner />}
            {confirmLabel}
          </Btn>
        </div>
      </motion.div>
    </div>
  );
}
