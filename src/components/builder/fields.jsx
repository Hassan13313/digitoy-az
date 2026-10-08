// ════════════════════════════════════════════════════════════════
// Builder — forma primitivləri (YALNIZ görünüş, tətbiq state-i yoxdur)
// Konvensiya: hər input `id` alır; Field eyni `id` ilə label, ipucu və xətanı
// bağlayır (aria-describedby = `${id}-hint ${id}-error`).
// onChange həmişə (value, event) qaytarır.
// ════════════════════════════════════════════════════════════════
import { forwardRef } from 'react';
import { AlertCircle, CalendarDays, Check, Clock, Lock, Plus } from 'lucide-react';
import t from '../../data/translations';
import { inputBase, ringState, describedBy } from './styles';

const tx = (lang) => t[lang] ?? t.az ?? {};

// ── Tarix yazılışı: "12 iyun 2027, Şənbə" ─────────────────────
const MONTHS = {
  az: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  ru: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
};
const WEEKDAYS = {
  az: ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
};

/**
 * "2027-06-12" → "12 iyun 2027, Şənbə". Yanlış dəyərdə boş sətir qaytarır.
 * @param {string} iso  YYYY-MM-DD
 * @param {'az'|'en'|'ru'} [lang='az']
 */
function formatEventDate(iso, lang = 'az') {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return '';
  const L = MONTHS[lang] ? lang : 'az';
  const day = d.getDate();
  const month = MONTHS[L][d.getMonth()];
  const wd = WEEKDAYS[L][d.getDay()];
  return L === 'en' ? `${month} ${day}, ${d.getFullYear()}, ${wd}` : `${day} ${month} ${d.getFullYear()}, ${wd}`;
}

// ── Ortaq input görünüşü ───────────────────────────────────────
/**
 * Sahə qabığı: label, məcburi ulduz, ipucu, xəta mesajı.
 * @param {object} p
 * @param {string} p.id            Uşaq inputun id-si (eyni olmalıdır)
 * @param {string} p.label
 * @param {boolean} [p.required]
 * @param {boolean} [p.optional]   «(istəyə bağlı)» yazısı
 * @param {string} [p.hint]        Sahənin altındakı köməkçi mətn
 * @param {string} [p.error]       Xəta mətni — verilərsə ipucunun yerinə göstərilir
 * @param {React.ReactNode} [p.aside]  Label sətrinin sağında (məs. simvol sayğacı)
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function Field({ id, label, required, optional, hint, error, aside, lang = 'az', className = '', children }) {
  const x = tx(lang);
  return (
    <div className={className}>
      {label && (
        <div className="mb-2.5 flex items-end justify-between gap-3">
          <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-label text-brown-dark">
            {label}
            {required && (
              <span className="ml-1 text-gold-deep" aria-hidden="true">
                *
              </span>
            )}
            {required && <span className="sr-only"> ({x.fieldRequired ?? 'məcburi'})</span>}
            {optional && (
              <span className="ml-1.5 font-normal normal-case tracking-normal text-brown-muted">
                ({x.fieldOptional ?? 'istəyə bağlı'})
              </span>
            )}
          </label>
          {aside}
        </div>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-start gap-1.5 text-[13px] leading-snug text-rust">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-[13px] leading-snug text-brown-dark/85">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/**
 * Mətn sahəsi.
 * @param {object} p
 * @param {string} p.id
 * @param {string} p.value
 * @param {(value:string, e:Event)=>void} p.onChange
 * @param {string} [p.error]       Xəta mətni (Field-ə də eyni xətanı verin)
 * @param {string} [p.hint]        Field-ə verilən ipucu (aria üçün)
 * @param {React.ComponentType} [p.icon]  Soldakı lucide ikon
 * @param {boolean} [p.disabled]
 */
export const TextInput = forwardRef(function TextInput(
  { id, value, onChange, error, hint, icon: Icon, className = '', type = 'text', ...rest },
  ref,
) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gold-deep"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value, e)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${inputBase} ${ringState(error)} h-14 ${Icon ? 'pl-11' : 'pl-4'} pr-4 ${className}`}
        {...rest}
      />
    </div>
  );
});

/**
 * Tarix sahəsi (native date picker) + altında gözəl yazılış: «12 iyun 2027, Şənbə».
 * @param {object} p
 * @param {string} p.id
 * @param {string} p.value          YYYY-MM-DD
 * @param {(value:string, e:Event)=>void} p.onChange
 * @param {string} [p.error]
 * @param {boolean} [p.showPretty=true]  Yazılışı göstər
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export const DateInput = forwardRef(function DateInput(
  { id, value, onChange, error, hint, showPretty = true, lang = 'az', className = '', ...rest },
  ref,
) {
  const pretty = showPretty ? formatEventDate(value, lang) : '';
  return (
    <div>
      <div className="relative">
        <CalendarDays
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gold-deep"
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <input
          ref={ref}
          id={id}
          type="date"
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value, e)}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [describedBy(id, error, hint), pretty && `${id}-pretty`].filter(Boolean).join(' ') || undefined
          }
          className={`${inputBase} ${ringState(error)} h-14 appearance-none pl-11 pr-4 lining-nums tabular-nums [&::-webkit-calendar-picker-indicator]:opacity-60 ${className}`}
          {...rest}
        />
      </div>
      <p
        id={`${id}-pretty`}
        aria-live="polite"
        className="mt-2 h-5 font-serif text-[16px] italic leading-5 lining-nums text-gold-deep"
      >
        {pretty}
      </p>
    </div>
  );
});

/**
 * Saat sahəsi (native time picker).
 * @param {object} p
 * @param {string} p.id
 * @param {string} p.value          "HH:MM"
 * @param {(value:string, e:Event)=>void} p.onChange
 * @param {string} [p.error]
 * @param {'md'|'sm'} [p.size='md']  sm — proqram sətirləri üçün kompakt
 */
export const TimeInput = forwardRef(function TimeInput(
  { id, value, onChange, error, hint, size = 'md', className = '', ...rest },
  ref,
) {
  const sm = size === 'sm';
  return (
    <div className="relative">
      {!sm && (
        <Clock
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gold-deep"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      )}
      <input
        ref={ref}
        id={id}
        type="time"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value, e)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${inputBase} ${ringState(error)} appearance-none lining-nums tabular-nums [&::-webkit-calendar-picker-indicator]:opacity-50 ${
          sm ? 'h-12 px-2 text-center font-medium [&::-webkit-calendar-picker-indicator]:hidden' : 'h-14 pl-11 pr-4'
        } ${className}`}
        {...rest}
      />
    </div>
  );
});

/**
 * Çoxsətirli mətn. maxLength verilərsə sağ altda sayğac göstərilir.
 * @param {object} p
 * @param {string} p.id
 * @param {string} p.value
 * @param {(value:string, e:Event)=>void} p.onChange
 * @param {number} [p.rows=4]
 * @param {number} [p.maxLength]
 * @param {string} [p.error]
 */
export const Textarea = forwardRef(function Textarea(
  { id, value, onChange, error, hint, rows = 4, maxLength, className = '', ...rest },
  ref,
) {
  const len = (value ?? '').length;
  return (
    <div className="relative">
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        value={value ?? ''}
        maxLength={maxLength}
        onChange={(e) => onChange?.(e.target.value, e)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${inputBase} ${ringState(error)} resize-y px-4 py-3.5 leading-relaxed ${maxLength ? 'pb-8' : ''} ${className}`}
        {...rest}
      />
      {maxLength && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-2.5 right-3.5 text-[11px] lining-nums tabular-nums ${
            len >= maxLength ? 'text-rust' : 'text-brown-muted'
          }`}
        >
          {len} / {maxLength}
        </span>
      )}
    </div>
  );
});

/**
 * İkonlu seçim kartı (radio). Eyni `name` ilə qruplaşdırın — ox düymələri native işləyir.
 * Qrup üçün <ChoiceGroup> istifadə edin.
 * @param {object} p
 * @param {string} p.name
 * @param {string} p.value
 * @param {boolean} p.checked
 * @param {(value:string)=>void} p.onChange
 * @param {React.ComponentType} [p.icon]
 * @param {string} p.label
 * @param {string} [p.description]
 * @param {boolean} [p.disabled]
 * @param {boolean} [p.locked]     Qıfıl + «Paketdə yoxdur»
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function SelectCard({
  name,
  value,
  checked,
  onChange,
  icon: Icon,
  label,
  description,
  disabled,
  locked,
  lang = 'az',
}) {
  const x = tx(lang);
  const off = disabled || locked;
  return (
    <label className={`group relative block ${off ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={!!checked}
        disabled={off}
        onChange={() => onChange?.(value)}
        className="peer sr-only"
      />
      <span
        className={`relative flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-2xl px-3 py-5 text-center ring-1 ring-inset transition-[background-color,box-shadow,transform] duration-300 ease-luxe peer-focus-visible:ring-2 peer-focus-visible:ring-gold-deep peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream ${
          checked
            ? 'bg-gold-mist/70 shadow-soft ring-2 ring-espresso'
            : off
              ? 'bg-beige/50 ring-beige-dark'
              : 'bg-white ring-beige-dark group-hover:-translate-y-0.5 group-hover:ring-gold/60 group-hover:shadow-soft'
        }`}
      >
        {checked && (
          <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-espresso text-gold-light">
            <Check className="h-3 w-3" strokeWidth={2.6} aria-hidden="true" />
          </span>
        )}
        {locked && (
          <span className="absolute right-2.5 top-2.5 text-brown-muted">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
          </span>
        )}
        {Icon && (
          <Icon
            className={`h-6 w-6 ${checked ? 'text-ink' : off ? 'text-brown-muted' : 'text-gold-deep'}`}
            strokeWidth={1.4}
            aria-hidden="true"
          />
        )}
        <span
          className={`text-[12px] font-semibold uppercase tracking-label ${checked ? 'text-ink' : off ? 'text-brown-muted' : 'text-brown-dark'}`}
        >
          {label}
        </span>
        {description && <span className="text-[12px] leading-snug text-brown-dark/80">{description}</span>}
        {locked && (
          <span className="text-[10.5px] font-medium text-brown-muted">{x.lockedInPackage ?? 'Paketdə yoxdur'}</span>
        )}
      </span>
    </label>
  );
}

/**
 * Seçim kartları üçün radiogroup qabığı (legend + şəbəkə).
 * @param {object} p
 * @param {string} p.legend
 * @param {string} [p.error]
 * @param {string} [p.className]  Şəbəkə sinifləri (default: 2 → 3 → 5 sütun)
 */
export function ChoiceGroup({
  legend,
  error,
  id,
  className = 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5',
  children,
}) {
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      {legend && (
        <legend className="mb-3 text-[11px] font-semibold uppercase tracking-label text-brown-dark">{legend}</legend>
      )}
      <div role="radiogroup" className={className}>
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-start gap-1.5 text-[13px] text-rust">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

/**
 * Aç/bağla açarı (role="switch").
 * @param {object} p
 * @param {boolean} p.checked
 * @param {(checked:boolean)=>void} p.onChange
 * @param {string} p.label         Ekran oxuyucu üçün ad (görünmür)
 * @param {boolean} [p.disabled]
 * @param {string} [p.describedBy]
 */
export function Switch({ checked, onChange, label, disabled, describedBy: db, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={!!checked}
      aria-label={label}
      aria-describedby={db}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-8 w-[52px] shrink-0 items-center rounded-full p-1 transition-colors duration-300 ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed ${
        checked ? 'bg-espresso' : disabled ? 'bg-beige' : 'bg-beige-dark hover:bg-[#d2c8b8]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`grid h-6 w-6 place-items-center rounded-full shadow-[0_1px_3px_rgba(44,37,35,0.25)] transition-transform duration-300 ease-luxe ${
          checked ? 'translate-x-5 bg-gold-light' : 'translate-x-0 bg-white'
        }`}
      >
        {checked && <Check className="h-3 w-3 text-espresso" strokeWidth={3} />}
      </span>
    </button>
  );
}

/**
 * Kəsik xətli «əlavə et» düyməsi (yeni sətir, yeni fəsil, yeni şəkil).
 * @param {object} p
 * @param {()=>void} p.onClick
 * @param {string} p.children
 * @param {boolean} [p.disabled]
 * @param {boolean} [p.block]   Tam en
 */
export function AddButton({ onClick, children, disabled, block = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/60 bg-white/50 px-5 text-[12px] font-semibold uppercase tracking-label text-gold-deep transition-[background-color,border-color] duration-300 hover:border-gold-deep hover:bg-gold-mist/50 disabled:cursor-not-allowed disabled:opacity-50 ${
        block ? 'w-full' : ''
      } ${className}`}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-mist text-gold-deep transition-transform duration-300 group-hover:rotate-90">
        <Plus className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      {children}
    </button>
  );
}
