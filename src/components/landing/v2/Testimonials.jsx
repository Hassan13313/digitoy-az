// ════════════════════════════════════════════════════════════════
// Müştəri rəyləri (#sample-section) — "Onlar Artıq Seçdi" karuseli
// İstifadə:
//   <Testimonials lang={lang} />                 // t[lang].reviews və ya aşağıdakı nümunələr
//   <Testimonials lang={lang} reviews={myReviews} demoHref="/demo" />
// Rəy formatı: { quote, names, event, city, month, year, rating }   (month istəyə bağlıdır: 'İyun')
// ════════════════════════════════════════════════════════════════
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import t from '../../../data/translations';
import { Button, Container, SectionHeading } from './ui';
import { scrollToSection } from './scroll';

// Yalnız saytınızda artıq görünən rəylər. Qalan real rəylərinizi buraya
// və ya t[lang].reviews massivinə əlavə edin — uydurma rəy yazmayın.
const DEFAULT_REVIEWS = [
  {
    quote: 'VİP paket tam dəyərdi. Foto qalereyası, musiqi, QR kod — professional görünüş yaratdı.',
    names: 'Lətifə & Nicat',
    event: 'Toy',
    city: 'Gəncə',
    year: 2024,
    rating: 5,
  },
  {
    quote: 'WhatsApp-a link göndərmək çox asan oldu. Planlaşdırma prosesini çox rahatlaşdırdı.',
    names: 'Sevinc & Tural',
    event: 'Toy',
    city: 'Bakı',
    year: 2026,
    rating: 5,
  },
];

const EASE = [0.22, 1, 0.36, 1];
const AUTOPLAY_MS = 7000;

/** onPrimary — «Paketlərə keç»; onDemo — verilsə demo linki SPA keçidi ilə açılır */
export default function Testimonials({ lang = 'az', reviews, demoHref = '/demo', onPrimary, onDemo }) {
  const x = t[lang] ?? t.az ?? {};
  const list = reviews ?? x.reviews ?? DEFAULT_REVIEWS;
  const n = list.length;
  const uid = useId();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userTook, setUserTook] = useState(false);

  const go = useCallback(
    (d) => {
      setIndex((i) => (i + d + n) % n);
      setUserTook(true);
    },
    [n],
  );
  const goTo = (i) => {
    setIndex(i);
    setUserTook(true);
  };

  // Avtomatik keçid: görünəndə, hover/fokus yoxdursa, istifadəçi idarə etməyibsə
  useEffect(() => {
    if (n < 2 || reduce || paused || userTook || !inView) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % n), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [n, reduce, paused, userTook, inView]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  // Mobil sürüşdürmə (swipe)
  const onDragEnd = (_, info) => {
    if (info.offset.x < -50 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 50 || info.velocity.x > 400) go(-1);
  };

  const starsLabel = (r) => (x.starsLabel ?? '{r} ulduzdan 5').replace('{r}', r);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="sample-section"
        aria-labelledby="reviews-title"
        className="grain relative isolate overflow-hidden bg-cream py-24 sm:py-28 lg:py-36"
      >
        {/* fon: nəhəng dekorativ dırnaq + yumşaq işıq */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.32),transparent)]" />
          <span className="absolute left-1/2 top-[38%] -translate-x-1/2 select-none font-serif text-[420px] leading-none text-gold/[0.07] sm:text-[560px]">
            “
          </span>
        </div>

        <Container>
          <SectionHeading
            id="reviews-title"
            eyebrow={x.reviewsEyebrow ?? 'Müştəri rəyləri'}
            title={x.reviewsTitle ?? 'Onlar Artıq Seçdi'}
            subtitle={x.reviewsSubtitle ?? 'Digitoy.az-dan istifadə edən cütlüklərin fikirləri'}
          />

          {/* ── Karusel ─────────────────────────────────────────── */}
          <div
            ref={rootRef}
            role="region"
            aria-roledescription={x.carouselRole ?? 'karusel'}
            aria-label={x.reviewsTitle ?? 'Onlar Artıq Seçdi'}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative mx-auto mt-14 max-w-[880px] rounded-[28px] focus-visible:outline-offset-8 lg:mt-20"
          >
            <div className="relative rounded-[28px] bg-white/80 px-6 pb-9 pt-12 shadow-luxe backdrop-blur-sm sm:px-12 sm:pb-12 sm:pt-16 lg:px-20">
              {/* üst qızılı xətt */}
              <span aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gold-line" />

              {/* Bütün rəylər eyni grid xanasında üst-üstə: hündürlük = ən uzun rəy → CLS yoxdur */}
              <motion.div
                className="grid cursor-grab touch-pan-y active:cursor-grabbing"
                drag={n > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={onDragEnd}
                aria-live={userTook ? 'polite' : 'off'}
              >
                {list.map((r, i) => {
                  const active = i === index;
                  return (
                    <motion.figure
                      key={i}
                      id={`${uid}-slide-${i}`}
                      role="group"
                      aria-roledescription={x.slideRole ?? 'slayd'}
                      aria-label={`${i + 1} / ${n}`}
                      aria-hidden={!active}
                      className="col-start-1 row-start-1 flex flex-col items-center text-center"
                      initial={false}
                      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      style={{ pointerEvents: active ? 'auto' : 'none' }}
                    >
                      <div className="flex gap-1" role="img" aria-label={starsLabel(r.rating ?? 5)}>
                        {Array.from({ length: 5 }, (_, s) => (
                          <Star
                            key={s}
                            aria-hidden="true"
                            strokeWidth={1.2}
                            className={`h-4 w-4 ${s < (r.rating ?? 5) ? 'fill-gold text-gold' : 'text-beige-dark'}`}
                          />
                        ))}
                      </div>
                      <blockquote className="mt-7">
                        <p className="font-serif text-[1.625rem] font-normal italic leading-[1.35] text-ink [text-wrap:balance] sm:text-[2rem] lg:text-[2.375rem]">
                          “{r.quote}”
                        </p>
                      </blockquote>
                      <figcaption className="mt-9 flex items-center gap-4 text-left">
                        <span
                          aria-hidden="true"
                          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-espresso-grad font-serif text-xl italic text-gold-light shadow-lift ring-1 ring-inset ring-gold/40"
                        >
                          {r.names?.trim()?.[0]}
                        </span>
                        <span>
                          <span className="block font-sans text-[15px] font-semibold text-ink">{r.names}</span>
                          <span className="mt-0.5 block text-[13px] tracking-[0.04em] text-brown-dark">
                            {[r.event, [r.city, [r.month, r.year].filter(Boolean).join(' ')].filter(Boolean).join(', ')]
                              .filter(Boolean)
                              .join(' — ')}
                          </span>
                        </span>
                      </figcaption>
                    </motion.figure>
                  );
                })}
              </motion.div>
            </div>

            {/* ── İdarəetmə ─────────────────────────────────────── */}
            {n > 1 && (
              <div className="mt-8 flex items-center justify-center gap-5">
                <ArrowBtn onClick={() => go(-1)} label={x.prevReview ?? 'Əvvəlki rəy'}>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </ArrowBtn>
                <div className="flex items-center" role="group" aria-label={x.reviewsDots ?? 'Rəy seçimi'}>
                  {list.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`${x.reviewLabel ?? 'Rəy'} ${i + 1}`}
                      aria-current={i === index ? 'true' : undefined}
                      aria-controls={`${uid}-slide-${i}`}
                      className="grid h-8 w-6 place-items-center"
                    >
                      <span
                        className={`block h-1.5 rounded-full transition-all duration-500 ease-luxe ${
                          i === index ? 'w-6 bg-gold-deep' : 'w-1.5 bg-beige-dark hover:bg-gold/60'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <ArrowBtn onClick={() => go(1)} label={x.nextReview ?? 'Növbəti rəy'}>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </ArrowBtn>
              </div>
            )}
          </div>

          {/* ── CTA-lar ─────────────────────────────────────────── */}
          <div className="mx-auto mt-14 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4 lg:mt-16">
            <Button
              variant="primary"
              size="lg"
              onClick={onPrimary ?? (() => scrollToSection('builder-section'))}
              className="sm:min-w-[220px]"
            >
              {x.reviewsCtaPrimary ?? 'Paketlərə keç'}
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
            >
              {x.reviewsCtaSecondary ?? 'Nümunə dəvətnaməyə bax'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </section>
    </MotionConfig>
  );
}

function ArrowBtn({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-gold/45 bg-white/70 text-gold-deep transition-[background-color,border-color,transform] duration-300 ease-luxe hover:-translate-y-px hover:border-gold hover:bg-white active:translate-y-0"
    >
      {children}
    </button>
  );
}
