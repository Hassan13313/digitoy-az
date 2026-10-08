// ════════════════════════════════════════════════════════════════
// Paketlər (#builder-section) — Sadə · VİP · Premium (Premium önə çıxır)
// İstifadə:
//   <Pricing lang={lang} onSelectPackage={(id) => ...} selectedPackage={selected}>
//     {selected && <OrderForm packageId={selected} />}   ← mövcud sifariş formanız
//   </Pricing>
// ════════════════════════════════════════════════════════════════
import { MotionConfig, motion } from 'framer-motion';
import { ArrowRight, Check, Crown, Gift, Minus, Sparkles } from 'lucide-react';
import t from '../../../data/translations';
import { Button, Container, SectionHeading } from './ui';

const EASE = [0.22, 1, 0.36, 1];

// ← packageId-ləri öz layihənizdəki dəyərlərlə eyniləşdirin
const PACKAGE_IDS = { simple: 'simple', vip: 'vip', premium: 'premium' };

// status: 'yes' daxildir · 'no' daxil deyil · 'star' yalnız bu paketə xas
const getPackages = (x) => [
  {
    id: PACKAGE_IDS.simple,
    name: x.pkgSimpleName ?? 'Sadə',
    price: 59,
    tagline: x.pkgSimpleTagline ?? 'Toyunuz üçün zərif və premium rəqəmsal dəvətnamə.',
    features: [
      ['yes', x.pkgOpening ?? 'Açılış animasiyası'],
      ['yes', x.pkgCountdown ?? 'Geri sayım saatı'],
      ['yes', x.pkgMaps ?? 'Google Maps naviqasiya'],
      ['yes', x.pkgDress ?? 'Dress code'],
      ['yes', x.pkgProgram ?? 'Toy proqramı'],
      ['yes', x.pkgLink ?? 'Paylaşıla bilən link'],
      ['yes', x.pkgMusic ?? 'Dəvətnamənizdəki musiqini şəxsi zövqünüzə uyğun seçin'],
      ['no', x.pkgRsvp ?? 'İştirak Təsdiqi'],
      ['no', x.pkgSeating ?? 'Oturma Planı'],
      ['no', x.pkgQr ?? 'QR Foto Paylaşım'],
      ['no', x.pkgGalleryMgmt ?? 'Qalereya idarəetməsi'],
    ],
    gift: x.pkgSimpleGift ?? 'Vagzali.az-da gəlinlik və digər xidmətlər üçün 5%-dək xüsusi endirim',
  },
  {
    id: PACKAGE_IDS.vip,
    name: x.pkgVipName ?? 'VİP',
    price: 89,
    badge: x.pkgVipBadge ?? 'Ən çox seçilən',
    tagline: x.pkgVipTagline ?? 'Qonaqların iştirakını və oturma planını rahat idarə edin.',
    features: [
      ['yes', x.pkgAllSimple ?? 'Sadə paketdəki hər şey'],
      ['yes', x.pkgRsvp ?? 'İştirak Təsdiqi'],
      ['yes', x.pkgSeating ?? 'Oturma Planı'],
      ['yes', x.pkgGuestList ?? 'Qonaq siyahısının idarə olunması'],
      ['no', x.pkgQr ?? 'QR Foto Paylaşım'],
      ['no', x.pkgGalleryMgmt ?? 'Qalereya idarəetməsi'],
    ],
    gift: x.pkgVipGift ?? 'Vagzali.az-da gəlinlik və digər xidmətlər üçün 10%-dək xüsusi endirim',
  },
  {
    id: PACKAGE_IDS.premium,
    name: x.pkgPremiumName ?? 'Premium',
    price: 129,
    badge: x.pkgPremiumBadge ?? 'Ən tam paket',
    featured: true,
    tagline: x.pkgPremiumTagline ?? 'Toy gününüzün bütün xatirələrini bir yerdə toplayın.',
    features: [
      ['yes', x.pkgAllVip ?? 'VİP paketdəki hər şey'],
      ['star', x.pkgQrSystem ?? 'QR Foto Paylaşım Sistemi'],
      ['star', x.pkgGuestGallery ?? 'Qonaq Qalereyası'],
      ['star', x.pkgGalleryMgmtFull ?? 'Qalereya İdarəetməsi'],
      ['star', x.pkgZip ?? 'Bütün şəkilləri ZIP endirmə'],
      ['star', x.pkgQrCard ?? 'HD çap üçün QR kart faylı'],
      ['yes', x.pkgPriority ?? 'Prioritet hazırlama'],
    ],
    gift: x.pkgPremiumGift ?? 'Vagzali.az-da gəlinlik və digər xidmətlər üçün 15%-dək xüsusi endirim',
  },
];

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
 *  - packages  — hazır kart siyahısı (data/packageCopy.js › buildPricingPackages); verilməsə getPackages
 *  - copy      — { eyebrow, title, subtitle, partner, templates, select, selected, notIncluded }
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
}) {
  const x = { ...(t[lang] ?? t.az ?? {}), ...pickCopy(copy) };
  const packages = packagesProp ?? getPackages(x);

  const body = (
        <Container>
          <SectionHeading
            id="pricing-title"
            eyebrow={x.pricingEyebrow ?? 'Qiymətlər'}
            title={x.pricingTitle ?? 'Paketinizi Seçin'}
            subtitle={x.pricingSubtitle ?? 'Toyunuza ən uyğun paketi seçin — dəyər zərif detallarda yaşayır.'}
          />

          {/* Artan sıra: 59 → 89 → 129. lg-də Premium sağda yuxarı qalxır və bir az enlidir */}
          <ul className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-[1fr_1fr_1.08fr] lg:items-start lg:gap-5 xl:gap-7">
            {packages.map((p, i) => (
              <motion.li
                key={p.id}
                className={p.featured ? 'lg:-mt-8' : 'lg:mt-4'}
                initial={{ opacity: 0, y: 24 }}
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

          <p className="mx-auto mt-12 flex max-w-xl items-start justify-center gap-2.5 text-left text-[13px] leading-relaxed text-brown-dark sm:items-center sm:text-center">
            <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep sm:mt-0" strokeWidth={1.6} aria-hidden="true" />
            {x.pricingPartner ?? 'Digitoy müştəriləri Vagzali.az tərəfdaş üstünlüklərindən yararlana bilərlər.'}
          </p>

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
    partner: 'pricingPartner', templates: 'pricingTemplates', select: 'pkgSelect',
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
          ? 'bg-espresso-grad p-8 text-cream shadow-[0_40px_80px_-40px_rgba(44,37,35,0.65)] sm:p-10'
          : 'bg-white/85 p-8 text-brown-dark shadow-soft ring-1 ring-gold/15 hover:shadow-lift sm:p-9'
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
          className={`absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] sm:left-10 ${
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
      <div className="relative">
        <h3
          id={titleId}
          className={`text-xs font-semibold uppercase tracking-eyebrow ${dark ? 'text-gold-light' : 'text-gold-deep'}`}
        >
          {p.name}
        </h3>
        <p className="mt-5 flex items-start gap-1.5">
          <span
            className={`font-serif text-[76px] font-normal leading-[0.85] lining-nums tracking-[-0.02em] ${
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
        <p className={`mt-4 min-h-[3em] text-[15px] leading-relaxed ${dark ? 'text-sand' : 'text-brown-dark'}`}>
          {p.tagline}
        </p>
      </div>

      <div aria-hidden="true" className={`my-7 h-px ${dark ? 'bg-gold/25' : 'bg-gold/20'}`} />

      {/* funksiyalar */}
      <ul className="relative flex-1 space-y-3.5">
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

      {/* hədiyyə */}
      <div
        className={`relative mt-8 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-[13px] leading-snug ${
          dark ? 'bg-white/[0.06] text-sand ring-1 ring-inset ring-gold/20' : 'bg-gold-mist/60 text-brown-dark'
        }`}
      >
        <Gift
          className={`mt-px h-4 w-4 shrink-0 ${dark ? 'text-gold-light' : 'text-gold-deep'}`}
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <span>{p.gift}</span>
      </div>

      {/* CTA */}
      <Button
        variant={dark ? 'gold' : p.badge ? 'primary' : 'outline'}
        size="lg"
        onClick={onSelect}
        aria-pressed={selected}
        aria-describedby={titleId}
        className={`relative mt-7 w-full ${dark ? 'focus-visible:ring-offset-espresso' : ''}`}
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
