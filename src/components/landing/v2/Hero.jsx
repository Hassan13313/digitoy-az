// ════════════════════════════════════════════════════════════════
// Hero — başlıq, CTA-lar və canlı funksiya nümunəsi
// İstifadə:
//   <Hero lang={lang} />                         // "İndi başla" → #builder-section
//   <Hero lang={lang} onStart={...} demoHref="/demo" />
// ════════════════════════════════════════════════════════════════
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, Eye, Sparkles } from 'lucide-react';
import t from '../../../data/translations';
import FeatureDemo from './FeatureDemo';
import { Button, Container, Ornament } from './ui';
import { scrollToSection } from './scroll';

const EASE = [0.22, 1, 0.36, 1];

/** onDemo — verilsə, demo linki səhifəni yeniləmir (SPA keçidi + analitika mövcud koddadır) */
export default function Hero({ lang = 'az', onStart, onDemo, demoHref = '/demo' }) {
  const x = t[lang] ?? t.az ?? {};
  const reduce = useReducedMotion();

  const start = () => (onStart ? onStart() : scrollToSection('builder-section'));

  // Giriş animasiyası: yalnız transform (opacity yox) — LCP gecikmir, CLS yaranmır
  const line = (i) =>
    reduce
      ? {}
      : {
          initial: { y: '108%' },
          animate: { y: 0 },
          transition: { duration: 1, delay: 0.08 + i * 0.1, ease: EASE },
        };
  const fade = (d) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: d, ease: EASE },
        };

  const trust = [
    x.heroTrust1 ?? '59 ₼-dan başlayan',
    x.heroTrust2 ?? 'AZ · EN · RU',
    x.heroTrust3 ?? '~5 dəqiqəyə hazır',
  ];

  return (
    <section aria-labelledby="hero-title" className="grain relative isolate overflow-hidden">
      {/* ── Fon qatları ─────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#FDFBF7_0%,#F7F2E8_55%,#FDFBF7_100%)]" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.28),transparent)]" />
        <div className="absolute -right-32 top-1/4 h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.38),transparent)]" />
        <RingsMotif reduce={reduce} />
        {/* alt kənar: növbəti bölməyə yumşaq keçid */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-cream" />
      </div>

      <Container className="relative pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36 xl:pt-40">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 xl:gap-16">
          {/* ── Sol: mətn ───────────────────────────────────────── */}
          <div className="text-left">
            <motion.p
              {...fade(0)}
              className="inline-flex items-center gap-2.5 rounded-full border border-gold/35 bg-white/55 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep shadow-soft backdrop-blur-sm sm:px-5 sm:text-[11px] sm:tracking-[0.26em]"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={1.6} aria-hidden="true" />
              {x.heroEyebrow ?? 'Bir dəvətnamədən daha artığı'}
            </motion.p>

            <h1
              id="hero-title"
              className="mt-7 font-serif text-[44px] font-medium leading-[1.02] tracking-[-0.015em] text-ink min-[400px]:text-[48px] sm:text-[64px] lg:text-[54px] xl:text-[80px]"
            >
              {[x.heroTitle1 ?? 'Rəqəmsal Toy', x.heroTitle2 ?? 'Dəvətnamənizi'].map((txt, i) => (
                <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em] pt-[0.08em]">
                  <motion.span {...line(i)} className="block">
                    {txt}
                  </motion.span>
                </span>
              ))}
              <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em] pr-[0.1em] pt-[0.08em]">
                <motion.span
                  {...line(2)}
                  className="text-gold-sheen block animate-sheen bg-[length:200%_100%] font-normal italic"
                >
                  {x.heroTitleAccent ?? 'Özünüz Yaradın'}
                </motion.span>
              </span>
            </h1>

            <motion.div {...fade(0.45)}>
              <Ornament align="left" className="mt-8" />
            </motion.div>

            <motion.p {...fade(0.5)} className="mt-7 max-w-[34rem] text-base leading-[1.75] text-brown-dark sm:text-lg">
              {x.heroSubtitle ??
                'Sadəcə dəvətnamə deyil — İştirak Təsdiqi, oturma planı, foto paylaşımı və xatirələrin toplandığı tam bir toy təcrübəsi. Hamısı bir zərif linkdə.'}
            </motion.p>

            <motion.div
              {...fade(0.6)}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <Button variant="primary" size="lg" onClick={start} className="w-full sm:w-auto sm:min-w-[188px]">
                {x.heroCtaPrimary ?? 'İndi başla'}
                <ArrowRight
                  className="h-4 w-4 text-gold-light transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
              <Button
                variant="outline"
                size="lg"
                href={demoHref}
                onClick={onDemo ? (e) => { e.preventDefault(); onDemo(); } : undefined}
                className="w-full sm:w-auto"
              >
                <Eye className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                {x.heroCtaSecondary ?? 'Nümunə dəvətnaməyə bax'}
              </Button>
            </motion.div>

            <motion.ul
              {...fade(0.7)}
              className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-brown-dark sm:gap-x-5"
            >
              {trust.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-1 w-1 shrink-0 rotate-45 bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ── Sağ: 10 funksiyanın canlı nümunəsi (#features — naviqasiya bura sürüşür) ── */}
          <motion.div
            id="features"
            className="flex scroll-mt-24 justify-center"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
          >
            <FeatureDemo lang={lang} autoPlay initialId="countdown" />
          </motion.div>
        </div>
      </Container>

      {/* aşağı sürüşmə işarəsi — yalnız böyük ekranda */}
      <button
        type="button"
        onClick={() => scrollToSection('how-it-works')}
        aria-label={x.heroScroll ?? 'Aşağı sürüşdür'}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full p-2 text-gold-deep/80 transition-colors hover:text-gold-deep lg:block"
      >
        <ChevronDown className="h-5 w-5 motion-safe:animate-float-slow" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </section>
  );
}

/** İki bir-birinə keçən halqa (nikah üzükləri motivi) — incə xətlə, yüklənəndə "çəkilir" */
function RingsMotif({ reduce }) {
  const draw = (d) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 2.4, delay: d, ease: EASE },
        };
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      className="absolute -right-[260px] top-[60px] h-[600px] w-[800px] opacity-70 sm:-right-[160px] lg:-right-[120px] lg:top-[80px] xl:right-[-60px]"
    >
      <motion.circle cx="330" cy="300" r="230" stroke="#C5A059" strokeOpacity="0.28" strokeWidth="1" {...draw(0.3)} />
      <motion.circle cx="490" cy="300" r="230" stroke="#C5A059" strokeOpacity="0.22" strokeWidth="1" {...draw(0.6)} />
      <motion.circle cx="330" cy="300" r="250" stroke="#C5A059" strokeOpacity="0.1" strokeWidth="1" {...draw(0.9)} />
    </svg>
  );
}
