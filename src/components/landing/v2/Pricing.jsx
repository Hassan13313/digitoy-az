// ════════════════════════════════════════════════════════════════
// Paketlər (#builder-section) — Mini · Sadə · VİP · Premium (Premium önə çıxır)
// + altında ayrıca enli «Videolu dəvətnamə» kartı (2026-11-18)
// İstifadə:
//   <Pricing lang={lang} onSelectPackage={(id) => ...} selectedPackage={selected}>
//     {selected && <OrderForm packageId={selected} />}   ← mövcud sifariş formanız
//   </Pricing>
// ════════════════════════════════════════════════════════════════
import { MotionConfig, motion } from 'framer-motion';
import { ArrowRight, Check, Clock, Crown, Minus, Play, Sparkles } from 'lucide-react';
import t from '../../../data/translations';
import { buildPricingPackages } from '../../../data/packageCopy';
import { Button, Container, SectionHeading } from './ui';
import { STATIC_INTRO } from '../../../utils/prerender';

const EASE = [0.22, 1, 0.36, 1];

/** Bölmə fonu — Digitoy-da #builder-section (paketlər + builder) eyni fonu işlədir */
export function PricingBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gold-line opacity-50" />
      <div className="absolute -right-48 top-1/3 h-[680px] w-[680px] rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.4),transparent)]" />
      <div className="absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(253,251,247,0.9),transparent)]" />
    </div>
  );
}

/**
 * İnteqrasiya props-ları (Digitoy):
 *  - packages  — hazır kart siyahısı (data/packageCopy.js › buildPricingPackages); verilməsə həmin funksiya
 *  - videoPackage — data/packageCopy.js › buildVideoPackage; verilərsə gridin altında enli kart
 *  - copy      — { eyebrow, title, subtitle, templates, select, selected, notIncluded }
 *  - embedded  — true: <section> yox, yalnız məzmun (bölmənin özü LandingPage-dədir)
 *  - cardIds   — { [packageId]: 'dom-id' } — köhnə scroll ankerləri (first-pricing-card ...)
 */
export default function Pricing({
  lang = 'az',
  onSelectPackage = () => {},
  selectedPackage = null,
  templatesHref = '/templates',
  children,
  packages: packagesProp,
  copy = {},
  embedded = false,
  cardIds = {},
  videoPackage = null,
}) {
  const x = { ...(t[lang] ?? t.az ?? {}), ...pickCopy(copy) };
  const packages = packagesProp ?? buildPricingPackages(lang);

  const body = (
        <Container>
          <SectionHeading
            id="pricing-title"
            eyebrow={x.pricingEyebrow ?? 'Qiymətlər'}
            title={x.pricingTitle ?? 'Paketinizi Seçin'}
            subtitle={x.pricingSubtitle ?? 'Toyunuza ən uyğun paketi seçin — dəyər zərif detallarda yaşayır.'}
          />

          {/* Artan sıra: 39 → 59 → 89 → 129. Planşetdə 2×2, xl-də bir sıra;
              xl-də Premium sağda yuxarı qalxır və bir az enlidir */}
          <ul className="mt-10 grid gap-7 sm:mt-16 sm:gap-8 md:grid-cols-2 md:items-start md:gap-6 lg:mt-24 xl:grid-cols-[1fr_1fr_1fr_1.08fr] xl:gap-5">
            {packages.map((p, i) => (
              <motion.li
                key={p.id}
                className={p.featured ? 'xl:-mt-8' : 'xl:mt-4'}
                initial={STATIC_INTRO ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
              >
                <div id={cardIds[p.id]} className="h-full">
                  <PackageCard p={p} x={x} selected={selectedPackage === p.id} onSelect={() => onSelectPackage(p.id)} />
                </div>
              </motion.li>
            ))}
          </ul>

          {videoPackage && (
            <div id={cardIds[videoPackage.id]} className="mt-10 sm:mt-12">
              <VideoPackageCard
                p={videoPackage}
                x={x}
                selected={selectedPackage === videoPackage.id}
                onSelect={() => onSelectPackage(videoPackage.id)}
              />
            </div>
          )}

          {/* Mövcud sifariş formanız burada açılır (dəyişmədən) */}
          {children}

          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" href={templatesHref}>
              {x.pricingTemplates ?? 'Bütün şablonlara bax'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Container>
  );

  if (embedded) {
    return (
      <MotionConfig reducedMotion="user">
        <div id="paketler" className="scroll-mt-20">{body}</div>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="builder-section"
        aria-labelledby="pricing-title"
        className="grain relative isolate overflow-hidden bg-beige py-24 sm:py-28 lg:py-36"
      >
        <PricingBackdrop />
        {body}
      </section>
    </MotionConfig>
  );
}

/* copy → x açarları (boş dəyərlər t[lang]-ı əvəz etmir) */
function pickCopy(c) {
  const map = {
    eyebrow: 'pricingEyebrow', title: 'pricingTitle', subtitle: 'pricingSubtitle',
    templates: 'pricingTemplates', select: 'pkgSelect',
    selected: 'pkgSelected', notIncluded: 'pkgNotIncluded',
  };
  const out = {};
  for (const [k, v] of Object.entries(c)) if (v != null && map[k]) out[map[k]] = v;
  return out;
}

// ════════════════════════════════════════════════════════════════
// Paket kartı
// ════════════════════════════════════════════════════════════════
function PackageCard({ p, x, selected, onSelect }) {
  const dark = p.featured;
  const titleId = `pkg-${p.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={`group relative flex h-full flex-col rounded-[28px] transition-[transform,box-shadow] duration-500 ease-luxe hover:-translate-y-1 ${
        dark
          ? 'bg-espresso-grad p-6 text-cream shadow-[0_40px_80px_-40px_rgba(44,37,35,0.65)] min-[400px]:p-7 sm:p-10'
          : 'bg-white/85 p-6 text-brown-dark shadow-soft ring-1 ring-gold/15 hover:shadow-lift min-[400px]:p-7 sm:p-9'
      } ${selected ? 'ring-2 ring-gold-deep ring-offset-4 ring-offset-beige' : ''}`}
    >
      {/* Premium: qızılı qradiyent kənar + daxili parıltı */}
      {dark && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_1px_0_rgba(232,213,163,0.45)] ring-1 ring-inset ring-gold/45"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.28),transparent)]"
          />
        </>
      )}

      {/* nişan */}
      {p.badge && (
        <span
          className={`absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] min-[400px]:left-7 sm:left-10 ${
            dark ? 'bg-gold text-espresso shadow-lift' : 'bg-espresso text-gold-light shadow-soft'
          }`}
        >
          {dark ? (
            <Crown className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
          )}
          {p.badge}
        </span>
      )}

      {/* başlıq + qiymət */}
      <div className="relative order-1">
        <h3
          id={titleId}
          className={`text-xs font-semibold uppercase tracking-eyebrow ${dark ? 'text-gold-light' : 'text-gold-deep'}`}
        >
          {p.name}
        </h3>
        <p className="mt-4 flex items-start gap-1.5 sm:mt-5">
          <span
            className={`font-serif text-[64px] font-normal leading-[0.85] sm:text-[76px] lining-nums tracking-[-0.02em] ${
              dark ? 'text-cream' : 'text-ink'
            }`}
          >
            {p.price}
          </span>
          <span className={`mt-1.5 font-sans text-2xl font-medium ${dark ? 'text-gold-light' : 'text-gold-deep'}`}>
            ₼
          </span>
          <span className="sr-only">{x.currencyName ?? 'manat'}</span>
        </p>
        <p className={`mt-3 text-[15px] leading-relaxed sm:mt-4 lg:min-h-[3em] ${dark ? 'text-sand' : 'text-brown-dark'}`}>
          {p.tagline}
        </p>
      </div>

      <div aria-hidden="true" className={`order-3 my-6 h-px lg:my-7 ${dark ? 'bg-gold/25' : 'bg-gold/20'}`} />

      {/* funksiyalar */}
      <ul className="relative order-4 flex-1 space-y-3 lg:space-y-3.5">
        {p.features.map(([status, label]) => (
          <li key={label} className="flex items-start gap-3 text-[14.5px] leading-snug">
            <FeatureIcon status={status} dark={dark} />
            <span
              className={
                status === 'no'
                  ? dark
                    ? 'text-sand/60 line-through decoration-sand/30'
                    : 'text-brown-muted line-through decoration-beige-dark'
                  : status === 'star'
                    ? dark
                      ? 'font-medium text-gold-light'
                      : 'font-medium text-ink'
                    : dark
                      ? 'text-cream'
                      : 'text-brown-dark'
              }
            >
              {status === 'no' && <span className="sr-only">{x.pkgNotIncluded ?? 'Daxil deyil:'} </span>}
              {label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA — telefonda/planşetdə qiymətin dərhal altında (uzun siyahını
          keçmədən seçmək olur), desktopda kartın dibində */}
      <Button
        variant={dark ? 'gold' : p.badge ? 'primary' : 'outline'}
        size="lg"
        onClick={onSelect}
        aria-pressed={selected}
        aria-describedby={titleId}
        className={`relative order-2 mt-6 w-full lg:order-6 lg:mt-7 ${dark ? 'focus-visible:ring-offset-espresso' : ''}`}
      >
        {selected ? (
          <>
            <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            {x.pkgSelected ?? 'Seçildi'}
          </>
        ) : (
          (x.pkgSelect ?? 'Seçim et')
        )}
      </Button>
    </article>
  );
}

// ════════════════════════════════════════════════════════════════
// Videolu dəvətnamə — veb-paketlərdən ayrı məhsul, enli kart.
// Solda üç şaquli nümunə posteri yelpik kimi (məhsulun özü — 9:16 video).
// ════════════════════════════════════════════════════════════════
const FAN = [
  'left-0 top-5 -rotate-[9deg]',
  'left-1/2 top-0 z-10 -translate-x-1/2',
  'right-0 top-5 rotate-[9deg]',
];

function VideoPackageCard({ p, x, selected, onSelect }) {
  const titleId = `pkg-${p.id}-title`;
  return (
    <article
      aria-labelledby={titleId}
      className={`relative grid gap-7 overflow-hidden rounded-[28px] bg-white/85 p-6 text-brown-dark shadow-soft ring-1 ring-gold/15 min-[400px]:p-7 sm:p-9 md:grid-cols-[200px_minmax(0,1fr)] md:items-center md:gap-10 lg:grid-cols-[230px_minmax(0,1fr)_240px] ${
        selected ? 'ring-2 ring-gold-deep ring-offset-4 ring-offset-beige' : ''
      }`}
    >
      {/* nümunə posterləri */}
      <div aria-hidden="true" className="relative mx-auto h-[196px] w-[220px] md:h-[210px] md:w-full">
        {(p.posters || []).map((src, i) => (
          <span
            key={src}
            className={`absolute aspect-[9/16] w-[96px] overflow-hidden rounded-[14px] bg-beige shadow-lift ring-[3px] ring-white md:w-[104px] ${FAN[i]}`}
          >
            <img src={src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-full w-full scale-[1.03] object-cover" />
            {i === 1 && (
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-espresso/80 text-cream backdrop-blur-sm">
                  <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={0} />
                </span>
              </span>
            )}
          </span>
        ))}
      </div>

      {/* başlıq, qiymət, funksiyalar */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
          <div>
            <h3 id={titleId} className="text-xs font-semibold uppercase tracking-eyebrow text-gold-deep">
              {p.eyebrow ?? p.name}
            </h3>
            <p className="mt-3 flex items-start gap-1.5">
              <span className="font-serif text-[64px] font-normal leading-[0.85] tracking-[-0.02em] text-ink lining-nums sm:text-[76px]">{p.price}</span>
              <span className="mt-1.5 font-sans text-2xl font-medium text-gold-deep">₼</span>
              <span className="sr-only">{x.currencyName ?? 'manat'}</span>
            </p>
          </div>
          {p.ready && (
            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-gold-mist/70 px-3 py-1.5 text-[12.5px] font-medium text-brown-dark ring-1 ring-inset ring-gold/30">
              <Clock className="h-3.5 w-3.5 text-gold-deep" strokeWidth={1.8} aria-hidden="true" />
              {p.ready}
            </span>
          )}
        </div>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed">{p.tagline}</p>
        <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {p.features.map(([status, label]) => (
            <li key={label} className="flex items-start gap-3 text-[14.5px] leading-snug">
              <FeatureIcon status={status} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="md:col-span-2 lg:col-span-1">
        <Button
          variant="primary"
          size="lg"
          onClick={onSelect}
          aria-pressed={selected}
          aria-describedby={titleId}
          className="w-full"
        >
          {selected ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {x.pkgSelected ?? 'Seçildi'}
            </>
          ) : (
            (x.pkgSelect ?? 'Seçim et')
          )}
        </Button>
        {p.note && <p className="mt-3 text-center text-[12.5px] leading-snug text-brown-dark/80">{p.note}</p>}
      </div>
    </article>
  );
}

function FeatureIcon({ status, dark }) {
  if (status === 'no') {
    return (
      <span
        aria-hidden="true"
        className={`mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full ${dark ? 'bg-white/5 text-sand/50' : 'bg-beige text-brown-muted'}`}
      >
        <Minus className="h-3 w-3" strokeWidth={2} />
      </span>
    );
  }
  if (status === 'star') {
    return (
      <span
        aria-hidden="true"
        className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold text-espresso shadow-[0_0_12px_rgba(232,213,163,0.45)]"
      >
        <Sparkles className="h-3 w-3" strokeWidth={2} />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full ${
        dark ? 'bg-gold/20 text-gold-light' : 'bg-espresso text-gold-light'
      }`}
    >
      <Check className="h-3 w-3" strokeWidth={2.4} />
    </span>
  );
}
