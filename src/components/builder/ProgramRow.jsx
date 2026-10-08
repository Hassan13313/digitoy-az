// ════════════════════════════════════════════════════════════════
// Tədbir proqramı sətri: tutacaq + saat + ikon seçici + mətn + sil (YALNIZ görünüş)
// Sürükləmə: öz DnD kitabxananızın props-larını `dragHandleProps` ilə tutacağa verin.
// Klaviatura: tutacaq fokusda olanda ↑ / ↓ → onMoveUp / onMoveDown.
// Qeyd: ikon seçicinin açıq/bağlı vəziyyəti yalnız UI state-dir.
// ════════════════════════════════════════════════════════════════
import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';
import t from '../../data/translations';
import { TimeInput } from './fields';

const tx = (lang) => t[lang] ?? t.az ?? {};

const DEFAULT_PROGRAM_ICONS = ['🥂', '💒', '💍', '🍽️', '💃', '🎂', '🎶', '📸', '🎆', '🚗', '🌹', '✨'];

/**
 * @param {object} p
 * @param {string} p.id                  Sətrin unikal id-si
 * @param {number} p.index               0-dan (ekran oxuyucu üçün)
 * @param {string} p.time                "18:00"
 * @param {(v:string)=>void} p.onTimeChange
 * @param {string} p.icon                Emoji
 * @param {(v:string)=>void} p.onIconChange
 * @param {string[]} [p.icons]           Seçiləcək emojilər
 * @param {string} p.text                «Qonaqların qarşılanması»
 * @param {(v:string)=>void} p.onTextChange
 * @param {()=>void} p.onRemove
 * @param {()=>void} [p.onMoveUp]  @param {()=>void} [p.onMoveDown]
 * @param {object} [p.dragHandleProps]   DnD kitabxanasının tutacaq props-ları
 * @param {boolean} [p.isDragging]
 * @param {string} [p.error]             Sətir xətası (məs. «Saat daxil edin»)
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export default function ProgramRow({
  id,
  index = 0,
  time,
  onTimeChange,
  icon,
  onIconChange,
  icons = DEFAULT_PROGRAM_ICONS,
  text,
  onTextChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  dragHandleProps,
  isDragging = false,
  error,
  lang = 'az',
}) {
  const x = tx(lang);
  const hintId = useId();

  const onHandleKey = (e) => {
    if (e.key === 'ArrowUp' && onMoveUp) {
      e.preventDefault();
      onMoveUp();
    } else if (e.key === 'ArrowDown' && onMoveDown) {
      e.preventDefault();
      onMoveDown();
    }
  };

  return (
    <div
      className={`rounded-2xl p-2.5 ring-1 ring-inset transition-[box-shadow,background-color] duration-300 sm:p-3 ${
        isDragging
          ? 'bg-white shadow-luxe ring-gold'
          : error
            ? 'bg-rust-mist/40 ring-rust/40'
            : 'bg-cream ring-beige-dark/80'
      }`}
    >
      <div className="grid grid-cols-[40px_112px_48px_minmax(0,1fr)_44px] items-center gap-2 max-sm:grid-cols-[40px_112px_48px_1fr_44px]">
        {/* tutacaq */}
        <button
          type="button"
          {...dragHandleProps}
          onKeyDown={(e) => {
            dragHandleProps?.onKeyDown?.(e);
            onHandleKey(e);
          }}
          aria-label={`${x.programReorder ?? 'Sıranı dəyiş'}: ${text || `${index + 1}`}`}
          aria-describedby={hintId}
          className="grid h-11 w-10 cursor-grab touch-none place-items-center rounded-[12px] text-brown-muted transition-colors hover:bg-white hover:text-gold-deep active:cursor-grabbing"
        >
          <GripVertical className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <span id={hintId} className="sr-only">
          {x.programReorderHint ?? 'Yuxarı və aşağı ox düymələri ilə sıranı dəyişin'}
        </span>

        <TimeInput
          id={`${id}-time`}
          size="sm"
          value={time}
          onChange={onTimeChange}
          error={error}
          aria-label={x.programTime ?? 'Saat'}
        />

        <IconPicker value={icon} onChange={onIconChange} icons={icons} lang={lang} />

        {/* mətn — desktopda eyni sətirdə, mobildə alt sətirdə */}
        <input
          id={`${id}-text`}
          type="text"
          value={text ?? ''}
          onChange={(e) => onTextChange?.(e.target.value, e)}
          placeholder={x.programPlaceholder ?? 'Fəaliyyət, məs. Tortun kəsilməsi'}
          aria-label={x.programActivity ?? 'Fəaliyyət'}
          aria-invalid={error ? true : undefined}
          className="h-12 w-full min-w-0 rounded-[12px] bg-white px-3.5 text-[16px] text-ink ring-1 ring-inset ring-beige-dark transition-shadow placeholder:text-brown-muted/80 hover:ring-gold/60 focus:outline-none focus:ring-2 focus:ring-gold-deep max-sm:order-last max-sm:col-span-5"
        />

        <button
          type="button"
          onClick={onRemove}
          aria-label={`${x.programRemove ?? 'Sətri sil'}: ${text || `${index + 1}`}`}
          className="grid h-11 w-11 place-items-center justify-self-end rounded-[12px] text-brown-muted transition-colors hover:bg-rust-mist hover:text-rust max-sm:col-start-5 max-sm:row-start-1"
        >
          <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 pl-12 text-[13px] text-rust">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Emoji ikon seçici (popover). Esc və kənara klik bağlayır.
 * @param {object} p
 * @param {string} p.value
 * @param {(v:string)=>void} p.onChange
 * @param {string[]} p.icons
 */
export function IconPicker({ value, onChange, icons = DEFAULT_PROGRAM_ICONS, lang = 'az' }) {
  const x = tx(lang);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const popId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => wrapRef.current?.querySelector('[data-selected="true"], [data-icon]')?.focus());
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popId}
        aria-label={`${x.programIcon ?? 'İkon seç'}: ${value ?? ''}`}
        className={`grid h-12 w-12 place-items-center rounded-full bg-white text-[22px] ring-1 ring-inset transition-shadow hover:ring-gold ${
          open ? 'ring-2 ring-gold-deep' : 'ring-gold/35'
        }`}
      >
        <span aria-hidden="true">{value || '✨'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={popId}
            role="dialog"
            aria-label={x.programIcon ?? 'İkon seç'}
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 top-[calc(100%+8px)] z-30 w-[232px] -translate-x-1/2 rounded-2xl bg-white p-2.5 shadow-luxe ring-1 ring-gold/25 max-sm:left-0 max-sm:translate-x-0"
          >
            <div className="grid grid-cols-6 gap-1">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  data-icon
                  data-selected={ic === value || undefined}
                  aria-pressed={ic === value}
                  onClick={() => {
                    onChange?.(ic);
                    setOpen(false);
                    btnRef.current?.focus();
                  }}
                  className={`grid h-9 w-9 place-items-center rounded-[12px] text-[19px] transition-colors hover:bg-gold-mist ${
                    ic === value ? 'bg-gold-mist ring-1 ring-inset ring-gold-deep' : ''
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
