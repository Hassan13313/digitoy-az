// ════════════════════════════════════════════════════════════════
// Digitoy — ortaq premium UI primitivləri
// Bütün bölmələr (Header, Hero, HowItWorks, Testimonials, Pricing, FAQ, Footer) bunları istifadə edir.
// ════════════════════════════════════════════════════════════════
import { forwardRef } from 'react';

/** Yalnız qlif — WhatsApp üçün (lucide-react-da brend ikonu yoxdur) */
export function WhatsAppIcon({ className = 'h-4 w-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

/** Mərkəzi romb + iki incə xətt — bölmə başlıqlarının imza ornamenti */
export function Ornament({ align = 'center', className = '' }) {
  const justify = align === 'left' ? 'justify-start' : 'justify-center';
  return (
    <div aria-hidden="true" className={`flex items-center gap-3 ${justify} ${className}`}>
      <span
        className={`h-px w-12 sm:w-16 ${
          align === 'left' ? 'bg-gold/60' : 'bg-gradient-to-r from-transparent to-gold/70'
        }`}
      />
      <span className="h-1 w-1 rotate-45 bg-gold/70" />
      <span className="h-2.5 w-2.5 rotate-45 border border-gold" />
      <span className="h-1 w-1 rotate-45 bg-gold/70" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/70 sm:w-16" />
    </div>
  );
}

/** Kiçik böyük-hərfli üst başlıq ("eyebrow"). Rəng: gold-deep (AA ✓) */
export function Eyebrow({ children, className = '' }) {
  return (
    <p
      className={`font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep sm:text-xs sm:tracking-eyebrow ${className}`}
    >
      {children}
    </p>
  );
}

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

/** Bölmə başlığı: eyebrow + serif başlıq + ornament + alt mətn */
export function SectionHeading({ eyebrow, title, subtitle, align = 'center', as: Tag = 'h2', id }) {
  const alignCls = align === 'left' ? 'text-left items-start' : 'text-center items-center';
  return (
    <div className={`flex flex-col ${alignCls}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag
        id={id}
        className="mt-4 font-serif text-[2.25rem] font-medium leading-[1.08] tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.5rem]"
      >
        {title}
      </Tag>
      <Ornament align={align} className="mt-6" />
      {subtitle && (
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-brown-dark/90 sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}

const base =
  'group relative inline-flex select-none items-center whitespace-nowrap justify-center gap-2.5 overflow-hidden rounded-full font-sans font-semibold uppercase transition-[transform,box-shadow,background-color,color,border-color] duration-300 ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-50';

const sizes = {
  md: 'h-11 px-6 text-[11px] tracking-label',
  lg: 'h-14 px-8 text-xs tracking-label sm:text-[13px]',
};

const variants = {
  // Espresso fon + krem mətn: 13:1 kontrast. Əsas CTA.
  primary:
    'bg-espresso-grad text-cream shadow-lift ring-1 ring-inset ring-gold/30 hover:-translate-y-0.5 hover:shadow-luxe active:translate-y-0',
  // Qızılı fon + espresso mətn: 6.1:1 kontrast (ağ mətn 2.5:1 idi — düzəldildi)
  gold: 'bg-gold text-espresso shadow-soft ring-1 ring-inset ring-gold-dark/30 hover:-translate-y-0.5 hover:bg-[#CDA963] hover:shadow-lift active:translate-y-0',
  // Konturlu: gold-deep mətn krem/bej fonda ≥4.8:1
  outline: 'border border-gold/55 bg-cream/40 text-gold-deep backdrop-blur-sm hover:border-gold hover:bg-gold-mist/60',
  // Tünd fon üzərində konturlu
  'outline-dark': 'border border-gold/40 text-gold-light hover:border-gold-light hover:bg-white/5',
};

/**
 * Premium düymə. `href` verilsə <a>, əks halda <button>.
 * Primary/gold variantlarda hover-da incə işıq zolağı keçir (reduced-motion-da sönür).
 */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'lg', href, className = '', children, ...props },
  ref,
) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const sheen = (variant === 'primary' || variant === 'gold') && (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-[left,opacity] duration-700 ease-luxe group-hover:left-[120%] group-hover:opacity-100 motion-reduce:hidden"
    />
  );
  if (href) {
    return (
      <a ref={ref} href={href} className={cls} {...props}>
        {sheen}
        <span className="relative inline-flex items-center gap-2.5">{children}</span>
      </a>
    );
  }
  return (
    <button ref={ref} type="button" className={cls} {...props}>
      {sheen}
      <span className="relative inline-flex items-center gap-2.5">{children}</span>
    </button>
  );
});
