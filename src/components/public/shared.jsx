// ════════════════════════════════════════════════════════════════
// İctimai səhifələr — ortaq kiçik hissələr (YALNIZ görünüş)
// Qlobal CSS yoxdur: fokus, tekstura və s. hamısı komponentin öz class-larındadır.
// ════════════════════════════════════════════════════════════════

/** Bütün düymə və linklər üçün görünən klaviatura fokusu (krem fonda) */
export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

/** Tünd fonda fokus */
export const FOCUS_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-espresso';

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.36 0 0 0 0 0.29 0 0 0 0 0.23 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** İncə kağız teksturası — valideyn `relative` olmalıdır */
export function Grain({ opacity = 0.045 }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{ backgroundImage: NOISE, opacity }}
    />
  );
}

/** «Digitoy.az» söz nişanı */
export function Wordmark({ className = '', tone = 'light' }) {
  return (
    <span className={`inline-flex items-baseline font-serif leading-none ${className}`}>
      <span
        className={`font-medium tracking-[0.04em] ${
          tone === 'dark' ? 'text-gold-light' : 'bg-gold-sheen bg-clip-text text-transparent'
        }`}
      >
        Digitoy
      </span>
      <span className={`italic ${tone === 'dark' ? 'text-sand/80' : 'text-brown-dark/70'}`}>.az</span>
    </span>
  );
}

/** Kiçik böyük-hərfli üst başlıq. lang verilir ki, «İ/ı» düzgün çevrilsin */
export function Kicker({ children, lang = 'az', className = '' }) {
  return (
    <p
      lang={lang}
      className={`text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-deep sm:text-xs ${className}`}
    >
      {children}
    </p>
  );
}

/** Romb ornamenti (sol və ya mərkəz) */
export function Rule({ align = 'left', className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center gap-2.5 ${align === 'center' ? 'justify-center' : ''} ${className}`}
    >
      {align === 'center' && <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/70" />}
      {align === 'left' && <span className="h-px w-10 bg-gold/60" />}
      <span className="h-1 w-1 rotate-45 bg-gold/70" />
      <span className="h-2 w-2 rotate-45 border border-gold" />
      <span className="h-1 w-1 rotate-45 bg-gold/70" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/70" />
    </span>
  );
}

/** Status nişanının rəngləri (açıq fon) */
const STATUS_TONES = {
  positive: { chip: 'bg-olive-mist text-olive', dot: 'bg-olive' },
  info: { chip: 'bg-[#E7EDF4] text-[#2E4A68]', dot: 'bg-[#2E4A68]' },
  muted: { chip: 'bg-beige text-brown-dark', dot: 'bg-brown-muted' },
};

/** Status nişanının rəngləri (tünd şüşə fon) */
const STATUS_TONES_DARK = {
  positive: { chip: 'bg-[#B9DDA7]/15 text-[#D3EBC7]', dot: 'bg-[#A9D795]' },
  info: { chip: 'bg-[#A9C4E6]/15 text-[#D4E3F6]', dot: 'bg-[#9DBDE6]' },
  muted: { chip: 'bg-white/10 text-sand', dot: 'bg-sand' },
};

/**
 * Status nişanı («Canlı», «Yeni», «Tezliklə» …).
 * @param {object} p
 * @param {string} p.label
 * @param {'positive'|'info'|'muted'} [p.tone='positive']
 * @param {boolean} [p.dark]  Tünd fonda göstərilirsə
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function StatusChip({ label, tone = 'positive', dark = false, lang = 'az', className = '' }) {
  const t = (dark ? STATUS_TONES_DARK : STATUS_TONES)[tone] ?? STATUS_TONES.positive;
  if (!label) return null;
  return (
    <span
      lang={lang}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.14em] ${t.chip} ${className}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {label}
    </span>
  );
}
