// ════════════════════════════════════════════════════════════════
// Qonaq fotoları — ortaq kiçik hissələr (YALNIZ görünüş, qlobal CSS yoxdur)
// ════════════════════════════════════════════════════════════════
import { Loader2 } from 'lucide-react';
import { FOCUS, FOCUS_DARK } from './tokens';

/** Fırlanan yüklənmə ikonu */
export function Spinner({ className = 'h-4 w-4', label }) {
  return (
    <>
      <Loader2 className={`${className} animate-spin motion-reduce:animate-none`} aria-hidden="true" />
      {label && <span className="sr-only">{label}</span>}
    </>
  );
}

/** Böyük hərfli üst yazı (lang verilir ki, İ/ı düzgün çevrilsin) */
export function Eyebrow({ children, lang = 'az', tone = 'gold', className = '' }) {
  const color = tone === 'light' ? 'text-gold-light' : 'text-gold-deep';
  return (
    <p lang={lang} className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${color} ${className}`}>
      {children}
    </p>
  );
}

/** Romb ornamenti */
export function Ornament({ tone = 'gold', className = '' }) {
  const line = tone === 'light' ? 'via-gold-light/70' : 'via-gold/70';
  return (
    <span aria-hidden="true" className={`flex items-center justify-center gap-2 ${className}`}>
      <span className={`h-px w-12 bg-gradient-to-r from-transparent ${line} to-transparent`} />
      <span
        className={`h-1.5 w-1.5 rotate-45 border ${tone === 'light' ? 'border-gold-light' : 'border-gold'}`}
      />
      <span className={`h-px w-12 bg-gradient-to-r from-transparent ${line} to-transparent`} />
    </span>
  );
}

/**
 * Düymə — bölmənin bütün yerlərində eyni forma.
 * @param {'primary'|'gold'|'ghost'|'glass'|'danger'|'quiet'} [variant='ghost']
 * @param {'sm'|'md'|'lg'} [size='md']  sm=44px, md=48px, lg=56px
 */
export function Btn({
  variant = 'ghost',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  dark = false,
  ...props
}) {
  const sizes = {
    sm: 'h-11 px-4 text-[11.5px] gap-2',
    md: 'h-12 px-5 text-[12px] gap-2.5',
    lg: 'h-14 px-7 text-[12.5px] gap-2.5',
  };
  const variants = {
    primary: 'bg-espresso text-cream shadow-soft ring-1 ring-inset ring-gold/30 hover:bg-espresso-soft',
    gold: 'bg-gold text-espresso shadow-soft hover:bg-[#CDA963]',
    ghost: 'bg-white/70 text-gold-deep ring-1 ring-inset ring-gold/45 hover:bg-gold-mist/60 hover:ring-gold',
    glass: 'bg-white/10 text-cream ring-1 ring-inset ring-white/25 backdrop-blur-md hover:bg-white/20',
    danger: 'bg-rust text-white hover:bg-[#86321F]',
    quiet: 'text-brown-dark hover:bg-black/[0.04] hover:text-ink',
  };
  return (
    <button
      lang="az"
      type="button"
      className={`inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full font-semibold uppercase tracking-[0.14em] transition-[background-color,color,box-shadow,transform] duration-300 ease-luxe disabled:cursor-not-allowed disabled:opacity-50 ${
        dark ? FOCUS_DARK : FOCUS
      } ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />}
      {children}
    </button>
  );
}
