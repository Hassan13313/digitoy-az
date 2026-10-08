// ════════════════════════════════════════════════════════════════
// StatusPage — 404 · dəvətnamə tapılmadı · dəvətnamə deaktiv (YALNIZ görünüş)
// Bu ekranları çox vaxt QONAQ telefonda görür: ton nəzakətli, illüstrasiya sakit.
// Hərəkət yumşaqdır və prefers-reduced-motion-da tam dayanır.
// ════════════════════════════════════════════════════════════════
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { FOCUS, Grain, Rule, Wordmark } from './shared';

const GOLD = '#C5A059';
const PAPER = '#FFFDF8';
const PAPER_2 = '#F6EEDC';

const DEFAULTS = {
  'not-found': {
    code: '404',
    title: 'Bu səhifə tapılmadı.',
    text: 'Link köhnəlmiş və ya yanlış yazılmış ola bilər.',
    primaryLabel: 'Ana səhifəyə qayıt',
    secondaryLabel: 'Şablonlara bax',
  },
  'invite-not-found': {
    title: 'Bu dəvətnamə tapılmadı.',
    text: 'Link köhnəlmiş və ya yanlış ola bilər. Zəhmət olmasa dəvətnamə sahibindən yeni link tələb edin.',
    primaryLabel: 'Ana səhifəyə qayıt',
  },
  'invite-disabled': {
    title: 'Bu dəvətnamə deaktiv edilmişdir.',
    text: 'Əlavə məlumat üçün təşkilatçı ilə əlaqə saxlayın.',
    primaryLabel: 'Ana səhifəyə qayıt',
  },
};

/**
 * @param {object} p
 * @param {'not-found'|'invite-not-found'|'invite-disabled'} [p.variant='not-found']
 * @param {string} [p.code]            Kiçik üst yazı, məs. «404» (not-found-da default '404')
 * @param {string} [p.title]           Variant üzrə AZ default
 * @param {string} [p.text]
 * @param {string} [p.primaryLabel]
 * @param {()=>void} p.onPrimary
 * @param {string} [p.secondaryLabel]  Yalnız not-found-da default var
 * @param {()=>void} [p.onSecondary]   Verilməsə ikinci düymə göstərilmir
 * @param {boolean} [p.showBrand=true] Yuxarıda Digitoy.az söz nişanı
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export default function StatusPage({
  variant = 'not-found',
  code,
  title,
  text,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  showBrand = true,
  lang = 'az',
}) {
  const d = DEFAULTS[variant] ?? DEFAULTS['not-found'];
  const c = code ?? d.code;
  const second = secondaryLabel ?? d.secondaryLabel;

  return (
    <MotionConfig reducedMotion="user">
      <main
        lang={lang}
        className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden bg-cream px-5 pb-[calc(env(safe-area-inset-bottom,0px)+32px)] pt-8 text-center"
      >
        <Grain />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[30%] -z-10 h-[520px] w-[520px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.45),transparent)]"
        />

        {showBrand && (
          <p className="relative text-[22px]">
            <Wordmark />
          </p>
        )}

        <div className="relative my-auto flex w-full max-w-[460px] flex-col items-center py-10">
          <Illustration variant={variant} />

          {c && <p className="mt-8 font-serif text-[15px] italic tracking-[0.2em] text-gold-deep lining-nums">{c}</p>}
          <h1
            className={`${c ? 'mt-2' : 'mt-8'} font-serif text-[2.1rem] font-medium leading-[1.12] text-ink [text-wrap:balance] sm:text-[2.6rem]`}
          >
            {title ?? d.title}
          </h1>
          <Rule align="center" className="mt-5" />
          <p className="mt-5 max-w-[36ch] text-[15.5px] leading-[1.75] text-brown-dark sm:text-[16.5px]">
            {text ?? d.text}
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onPrimary}
              className={`group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-espresso-grad px-8 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-cream shadow-lift ring-1 ring-inset ring-gold/30 transition-[transform,box-shadow] duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-luxe ${FOCUS}`}
            >
              {primaryLabel ?? d.primaryLabel}
              <ArrowRight
                className="h-4 w-4 text-gold-light transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
            {onSecondary && second && (
              <button
                type="button"
                onClick={onSecondary}
                className={`inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-white/60 px-7 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold-deep ring-1 ring-inset ring-gold/55 transition-colors hover:bg-gold-mist/60 ${FOCUS}`}
              >
                <LayoutGrid className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                {second}
              </button>
            )}
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}

// ════════════════════════════════════════════════════════════════
// İllüstrasiyalar — inline SVG, incə qızılı xətlər (dekorativ)
// ════════════════════════════════════════════════════════════════
function Illustration({ variant }) {
  const reduce = useReducedMotion();
  const float = reduce
    ? {}
    : { animate: { y: [0, -6, 0] }, transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } };
  return (
    <div aria-hidden="true" className="relative h-[180px] w-[240px]">
      {/* yerə düşən kölgə */}
      <motion.span
        className="absolute bottom-1 left-1/2 h-3 w-40 -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(92,74,58,0.18),transparent)]"
        animate={reduce ? undefined : { scaleX: [1, 0.92, 1], opacity: [1, 0.8, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.svg viewBox="0 0 240 180" className="absolute inset-0 h-full w-full" fill="none" {...float}>
        {variant === 'invite-not-found' ? (
          <EnvelopeNoAddress reduce={reduce} />
        ) : variant === 'invite-disabled' ? (
          <EnvelopeBrokenSeal reduce={reduce} />
        ) : (
          <EnvelopeOpenEmpty reduce={reduce} />
        )}
      </motion.svg>
    </div>
  );
}

/** Açıq, boş zərf (404) */
function EnvelopeOpenEmpty({ reduce }) {
  const twinkle = (d) =>
    reduce
      ? {}
      : {
          animate: { opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] },
          transition: { duration: 3, delay: d, repeat: Infinity },
        };
  return (
    <>
      {/* açıq qapaq (arxada) */}
      <path d="M40 66 L120 14 L200 66 Z" fill={PAPER_2} stroke={GOLD} strokeWidth="1.4" strokeLinejoin="round" />
      {/* zərfin içi */}
      <rect x="40" y="66" width="160" height="96" rx="4" fill="#F1E6CF" stroke={GOLD} strokeWidth="1.4" />
      {/* boş kart yeri — kəsik xətt */}
      <rect
        x="62"
        y="52"
        width="116"
        height="64"
        rx="3"
        fill={PAPER}
        stroke={GOLD}
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.9"
      />
      {/* ön cib */}
      <path
        d="M40 70 L120 122 L200 70 L200 158 a4 4 0 0 1 -4 4 L44 162 a4 4 0 0 1 -4 -4 Z"
        fill={PAPER}
        stroke={GOLD}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M40 162 L104 112 M200 162 L136 112" stroke={GOLD} strokeWidth="1" opacity="0.5" />
      {/* parıltılar */}
      {[
        [34, 30, 0],
        [210, 24, 0.9],
        [222, 96, 1.8],
      ].map(([x, y, d]) => (
        <motion.path
          key={`${x}-${y}`}
          d={`M${x} ${y - 6} L${x + 1.6} ${y - 1.6} L${x + 6} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 6} L${x - 1.6} ${y + 1.6} L${x - 6} ${y} L${x - 1.6} ${y - 1.6} Z`}
          fill={GOLD}
          style={{ transformOrigin: `${x}px ${y}px` }}
          {...twinkle(d)}
        />
      ))}
    </>
  );
}

/** Ünvanı olmayan zərf (dəvətnamə tapılmadı) */
function EnvelopeNoAddress({ reduce }) {
  const march = reduce
    ? {}
    : { animate: { strokeDashoffset: [0, -24] }, transition: { duration: 2.4, repeat: Infinity, ease: 'linear' } };
  return (
    <>
      <rect x="30" y="34" width="180" height="120" rx="6" fill={PAPER} stroke={GOLD} strokeWidth="1.4" />
      <rect x="36" y="40" width="168" height="108" rx="3" stroke={GOLD} strokeWidth="0.8" opacity="0.35" />
      {/* göndərən sətri */}
      <path d="M48 56 H96" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      {/* boş marka */}
      <rect x="166" y="50" width="28" height="34" rx="2" stroke={GOLD} strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="180" cy="67" r="7" stroke={GOLD} strokeWidth="0.8" opacity="0.45" />
      {/* boş ünvan sətirləri */}
      {[104, 120, 136].map((y, i) => (
        <motion.path
          key={y}
          d={`M${84 + i * 4} ${y} H${170 - i * 10}`}
          stroke={GOLD}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="6 6"
          {...march}
        />
      ))}
    </>
  );
}

/** Qırılmış mum möhürlü zərf (dəvətnamə deaktiv) */
function EnvelopeBrokenSeal({ reduce }) {
  const drift = (dir) =>
    reduce
      ? {}
      : {
          animate: { x: [0, dir * 1.5, 0], rotate: [0, dir * 2, 0] },
          transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        };
  const crack = 'L122 131 L117 123 L123 115 L116 108 Z';
  return (
    <>
      <rect x="30" y="40" width="180" height="120" rx="6" fill={PAPER} stroke={GOLD} strokeWidth="1.4" />
      <path d="M30 160 L106 112 M210 160 L134 112" stroke={GOLD} strokeWidth="1" opacity="0.5" />
      {/* bağlı qapaq */}
      <path d="M31 42 L120 116 L209 42" fill={PAPER_2} stroke={GOLD} strokeWidth="1.4" strokeLinejoin="round" />
      {/* möhür — sol yarı */}
      <motion.g style={{ transformOrigin: '110px 120px' }} {...drift(-1)}>
        <path d={`M120 100 A20 20 0 0 0 118 140 ${crack}`} fill="#8E3B32" />
        <path d="M118 104 A16 16 0 0 0 116 136" stroke="#B5645A" strokeWidth="1" />
        <path d="M103 128 q-4 5 -1 9" stroke="#8E3B32" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
      {/* möhür — sağ yarı, bir az aralı */}
      <g transform="translate(5 3) rotate(7 132 120)">
        <motion.g style={{ transformOrigin: '132px 120px' }} {...drift(1)}>
          <path d={`M120 100 A20 20 0 0 1 118 140 ${crack}`} fill="#8E3B32" />
          <path d="M124 104 A16 16 0 0 1 122 136" stroke="#B5645A" strokeWidth="1" />
        </motion.g>
      </g>
      {/* kiçik qırıntılar */}
      <path d="M150 146 l4 -2 l1 4 z M92 150 l3 2 l-3 2 z" fill="#8E3B32" opacity="0.8" />
    </>
  );
}
