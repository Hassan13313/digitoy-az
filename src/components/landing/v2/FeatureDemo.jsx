// ════════════════════════════════════════════════════════════════
// FeatureDemo — 10 funksiyanın canlı nümunəsi (telefon maketi daxilində)
// Hero-nun sağ tərəfində istifadə olunur — ana səhifədə YEGANƏ telefon maketi:
//   <FeatureDemo lang={lang} autoPlay />
// ════════════════════════════════════════════════════════════════
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Heart,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Minus,
  Music,
  Navigation,
  Pause,
  Play,
  Plus,
  QrCode,
  Send,
  Shirt,
  Timer,
  UserCheck,
  Users,
} from 'lucide-react';
import t from '../../../data/translations';

// ── Funksiyaların siyahısı ──────────────────────────────────────────────
const FEATURES = [
  {
    id: 'countdown',
    plan: 'all', // hansı paketdən başlayır
    icon: Timer,
    label: (x) => x.featCountdown ?? 'Geri sayım',
    caption: (x) => x.featCountdownCaption ?? 'Toy gününə qədər canlı geri sayım',
    desc: (x) =>
      x.featCountdownDesc ??
      'Qonaqlarınız dəvətnaməni hər açanda böyük günə nə qədər qaldığını saniyəsinə qədər görür.',
  },
  {
    id: 'lovestory',
    plan: 'all', // data/sections.js: gate yoxdur → bütün paketlərdə
    icon: Heart,
    label: (x) => x.featLoveStory ?? 'Love story',
    caption: (x) => x.featLoveStoryCaption ?? 'Tanışlıqdan toya qədər sizin hekayəniz',
    desc: (x) =>
      x.featLoveStoryDesc ??
      'İlk görüşdən evlilik təklifinə qədər ən xüsusi anlarınızı tarix və şəkillərlə paylaşın — qonaqlarınız hekayənizin bir parçası olsun.',
  },
  {
    id: 'navigation',
    plan: 'all', // hansı paketdən başlayır
    icon: MapPin,
    label: (x) => x.featNavigation ?? 'Naviqasiya',
    caption: (x) => x.featNavigationCaption ?? 'Bir toxunuşla məkana yol tarifi',
    desc: (x) =>
      x.featNavigationDesc ??
      'Google Maps ilə inteqrasiya — qonaqlar ünvanı axtarmadan birbaşa şadlıq sarayına yol alır.',
  },
  {
    id: 'dresscode',
    plan: 'all', // hansı paketdən başlayır
    icon: Shirt,
    label: (x) => x.featDresscode ?? 'Geyim tərzi',
    caption: (x) => x.featDresscodeCaption ?? 'Tədbirin rəng palitrası və geyim tərzi',
    desc: (x) =>
      x.featDresscodeDesc ??
      'Arzuladığınız geyim tərzini və rəng palitrasını göstərin ki, xatirə şəkilləri harmonik alınsın.',
  },
  {
    id: 'seating',
    plan: 'vip', // hansı paketdən başlayır
    icon: Users,
    label: (x) => x.featSeating ?? 'Oturma planı',
    caption: (x) => x.featSeatingCaption ?? 'Qonaq masasını saniyələr içində tapır',
    desc: (x) => x.featSeatingDesc ?? 'Hər qonaq adını seçib öz masasını görür — girişdə növbə və çaşqınlıq olmur.',
  },
  {
    id: 'gallery',
    plan: 'premium', // hansı paketdən başlayır
    icon: Camera,
    label: (x) => x.featGallery ?? 'Foto qalereya',
    caption: (x) => x.featGalleryCaption ?? 'QR kod vasitəsilə foto yükləmə imkanı',
    desc: (x) =>
      x.featGalleryDesc ??
      'Xatirə Qalereyası — İnsanların toydan əvvəl və sonra bütün xoş xatirələrlə dolu şəkillərini bəy və gəlinlə asanlıqla paylaşa biləcəyi xüsusi platforma.',
  },
  {
    id: 'music',
    plan: 'all', // hansı paketdən başlayır
    icon: Music,
    label: (x) => x.featMusic ?? 'Fon musiqisi',
    caption: (x) => x.featMusicCaption ?? 'Dəvətnamə öz musiqinizlə açılır',
    desc: (x) =>
      x.featMusicDesc ?? 'Sizin üçün xüsusi olan mahnını seçin — dəvətnamə açılan kimi zərif fon musiqisi səslənir.',
  },
  {
    id: 'rsvp',
    plan: 'vip', // hansı paketdən başlayır
    icon: UserCheck,
    label: (x) => x.featRsvp ?? 'İştirak təsdiqi',
    caption: (x) => x.featRsvpCaption ?? 'Qonaqlar iştirakını bir kliklə təsdiqləyir',
    desc: (x) =>
      x.featRsvpDesc ?? 'Kimin gələcəyini və neçə nəfər olacağını real vaxtda görün — zəng etməyə ehtiyac qalmır.',
  },
  {
    id: 'program',
    plan: 'all', // hansı paketdən başlayır
    icon: Clock,
    label: (x) => x.featProgram ?? 'Tədbir proqramı',
    caption: (x) => x.featProgramCaption ?? 'Gecənin axışı bir baxışda',
    desc: (x) => x.featProgramDesc ?? 'Qarşılamadan tort kəsilməsinə qədər hər anın vaxtını qonaqlarınızla paylaşın.',
  },
  {
    id: 'guestbook',
    plan: 'all', // data/sections.js: gate yoxdur → bütün paketlərdə
    icon: BookOpen,
    label: (x) => x.featGuestbook ?? 'Təbrik kitabı',
    caption: (x) => x.featGuestbookCaption ?? 'Qonaqların səmimi arzuları bir yerdə',
    desc: (x) =>
      x.featGuestbookDesc ??
      'Qonaqlar təbriklərini birbaşa dəvətnaməyə yazır — illər sonra da oxuya biləcəyiniz rəqəmsal xatirə.',
  },
];

const SCREEN_EASE = [0.22, 1, 0.36, 1];

// Paket nişanı (Pricing bölməsindəki siyahıya uyğun)
const planLabel = (plan, x) =>
  ({
    all: x.planAll ?? 'Bütün paketlərdə',
    vip: x.planVip ?? 'VİP və Premium paketlərdə',
    premium: x.planPremium ?? 'Yalnız Premium paketdə',
  })[plan];

// ════════════════════════════════════════════════════════════════
// Əsas komponent
// ════════════════════════════════════════════════════════════════
export default function FeatureDemo({ lang = 'az', autoPlay = false, initialId = 'gallery' }) {
  const x = t[lang] ?? t.az ?? {};
  const uid = useId();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const tabRefs = useRef([]);
  const inView = useInView(rootRef, { amount: 0.35 });
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      FEATURES.findIndex((f) => f.id === initialId),
    ),
  );
  const [userTook, setUserTook] = useState(false); // istifadəçi seçim edibsə avtomatik keçid dayanır
  const [hovering, setHovering] = useState(false);

  // Avtomatik keçid: yalnız görünəndə, hover/fokus yoxdursa və reduced-motion deyilsə
  useEffect(() => {
    if (!autoPlay || reduce || userTook || hovering || !inView) return undefined;
    const id = setInterval(() => setActive((i) => (i + 1) % FEATURES.length), 5200);
    return () => clearInterval(id);
  }, [autoPlay, reduce, userTook, hovering, inView]);

  const select = useCallback((i, focus = false) => {
    setActive(i);
    setUserTook(true);
    if (focus) tabRefs.current[i]?.focus();
  }, []);

  // WAI-ARIA tab klaviatura naviqasiyası
  const onKeyDown = (e) => {
    const n = FEATURES.length;
    const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (map[e.key]) {
      e.preventDefault();
      select((active + map[e.key] + n) % n, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      select(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      select(n - 1, true);
    }
  };

  const feature = FEATURES[active];
  const panelId = `${uid}-panel`;

  return (
    // reducedMotion="user": sistemdə "hərəkəti azalt" aktivdirsə, framer-motion transform animasiyalarını söndürür
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocusCapture={() => setHovering(true)}
        onBlurCapture={() => setHovering(false)}
        className="relative grid items-center gap-8 lg:grid-cols-[190px_auto] lg:gap-6 xl:grid-cols-[208px_auto] xl:gap-10"
      >
        {/* ── Seçici: mobil/planşet 2 sütun, xl-də telefonun yanında şaquli siyahı ── */}
        <div className="mx-auto w-full max-w-[380px] lg:max-w-none">
          <div
            role="tablist"
            aria-label={x.featTablistLabel ?? 'Funksiyalar'}
            onKeyDown={onKeyDown}
            className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-1"
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const selected = i === active;
              return (
                <button
                  key={f.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  id={`${uid}-tab-${f.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={`group relative flex min-h-[52px] items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors duration-300 ease-luxe lg:min-h-[44px] lg:rounded-[12px] lg:py-1.5 ${
                    selected
                      ? 'text-ink'
                      : 'bg-white/40 text-brown-dark/85 ring-1 ring-inset ring-gold/10 hover:bg-white/70 hover:text-ink lg:bg-transparent lg:ring-0'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId={`${uid}-pill`}
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-[inherit] bg-white shadow-soft ring-1 ring-gold/35"
                    />
                  )}
                  <span
                    className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                      selected
                        ? 'bg-espresso text-gold-light'
                        : 'bg-gold-mist/70 text-gold-deep group-hover:bg-gold-mist'
                    }`}
                  >
                    <Icon className="h-[15px] w-[15px]" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="relative text-[12.5px] font-medium leading-tight xl:text-[13px]">{f.label(x)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Telefon maketi + izah ──────────────────────────────── */}
        <div className="flex flex-col items-center">
          <Phone x={x}>
            <div
              id={panelId}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${feature.id}`}
              aria-live="polite"
              className="relative h-full"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={feature.id}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: SCREEN_EASE }}
                >
                  <Screen id={feature.id} x={x} reduce={reduce} />
                </motion.div>
              </AnimatePresence>
            </div>
          </Phone>

          {/* İzah + paket nişanı — hündürlük sabit (CLS = 0) */}
          <div className="mt-6 flex h-[112px] w-full max-w-[320px] flex-col items-center text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={feature.id}
                className="flex flex-col items-center"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: SCREEN_EASE }}
              >
                <p className="text-[13.5px] leading-relaxed text-brown-dark">{feature.caption(x)}</p>
                {feature.plan && (
                  <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-gold-mist/80 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gold-deep">
                    <Check className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
                    {planLabel(feature.plan, x)}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
            {autoPlay && !reduce && !userTook && (
              <div className="mt-auto flex gap-1.5" aria-hidden="true">
                {FEATURES.map((f, i) => (
                  <span
                    key={f.id}
                    className={`h-[3px] rounded-full transition-all duration-500 ease-luxe ${
                      i === active ? 'w-5 bg-gold' : 'w-1.5 bg-beige-dark'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

// ════════════════════════════════════════════════════════════════
// Telefon çərçivəsi — ölçülər sabitdir (CLS = 0)
// ════════════════════════════════════════════════════════════════
function Phone({ x = {}, children, header = true }) {
  return (
    <div className="relative">
      {/* arxa işıq halosu */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.55),transparent)] blur-2xl"
      />
      <div className="relative h-[500px] w-[272px] rounded-[46px] bg-espresso-grad p-[10px] shadow-luxe sm:h-[580px] sm:w-[292px]">
        {/* bezelin qızılı kənar xətti */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[46px] ring-1 ring-inset ring-gold/35"
        />
        <div className="relative h-full w-full overflow-hidden rounded-[37px] bg-cream">
          {/* dynamic island */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-2.5 z-20 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-espresso"
          />
          {/* dəvətnamə başlığı (header={false} olanda ekran tam boş qalır) */}
          {header && (
            <div className="grain relative border-b border-gold/15 bg-gradient-to-b from-gold-mist/70 to-cream px-5 pb-4 pt-11 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
                {x.demoInviteKicker ?? 'Toy dəvətnaməsi'}
              </p>
              <p className="mt-1.5 font-serif text-[26px] font-medium italic leading-none text-ink">
                Leyla &amp; Murad
              </p>
              <p className="mt-2 text-[10px] tracking-[0.25em] text-brown-dark/80">12 · 06 · 2027</p>
            </div>
          )}
          <div className={`relative ${header ? 'h-[calc(100%-118px)]' : 'h-full'}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Ekranlar
// ════════════════════════════════════════════════════════════════
function Screen({ id, x, reduce }) {
  switch (id) {
    case 'countdown':
      return <CountdownScreen x={x} />;
    case 'navigation':
      return <NavigationScreen x={x} reduce={reduce} />;
    case 'dresscode':
      return <DresscodeScreen x={x} />;
    case 'seating':
      return <SeatingScreen x={x} />;
    case 'gallery':
      return <GalleryScreen x={x} />;
    case 'music':
      return <MusicScreen x={x} />;
    case 'rsvp':
      return <RsvpScreen x={x} />;
    case 'program':
      return <ProgramScreen x={x} />;
    case 'guestbook':
      return <GuestbookScreen x={x} />;
    case 'lovestory':
      return <LoveStoryScreen x={x} />;
    default:
      return null;
  }
}

function ScreenTitle({ children, sub }) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-gold-deep">{children}</p>
      {sub && <p className="mt-1 font-serif text-lg leading-tight text-ink">{sub}</p>}
    </div>
  );
}

// ── 1. Geri sayım ───────────────────────────────────────────────
const WEDDING_DATE = new Date('2027-06-12T18:00:00+04:00').getTime();

function getRemaining() {
  const diff = Math.max(0, WEDDING_DATE - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

function CountdownScreen({ x }) {
  const [r, setR] = useState(getRemaining);
  useEffect(() => {
    const id = setInterval(() => setR(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);
  const cells = [
    [r.d, x.cdDays ?? 'Gün'],
    [r.h, x.cdHours ?? 'Saat'],
    [r.m, x.cdMinutes ?? 'Dəqiqə'],
    [r.s, x.cdSeconds ?? 'Saniyə'],
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center px-5">
      <ScreenTitle sub={x.cdTitle ?? 'Böyük günə qalıb'}>{x.featCountdown ?? 'Geri sayım'}</ScreenTitle>
      <div className="mt-6 grid w-full grid-cols-4 gap-2" role="timer" aria-live="off">
        {cells.map(([v, l]) => (
          <div key={l} className="flex flex-col items-center rounded-2xl bg-white py-3 shadow-soft ring-1 ring-gold/15">
            <span className="font-serif text-[26px] font-medium leading-none lining-nums tabular-nums text-ink">
              {String(v).padStart(2, '0')}
            </span>
            <span className="mt-1.5 text-[8.5px] font-medium uppercase tracking-[0.12em] text-brown-dark/80">{l}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 text-[11px] text-brown-dark">
        <span className="h-px w-6 bg-gold/50" />
        {x.cdDateLine ?? '12 İyun 2027 · Şənbə · 18:00'}
        <span className="h-px w-6 bg-gold/50" />
      </div>
    </div>
  );
}

// ── 2. Naviqasiya ──────────────────────────────────────────────
function NavigationScreen({ x, reduce }) {
  return (
    <div className="flex h-full flex-col px-4 pb-5 pt-4">
      <div className="relative flex-1 overflow-hidden rounded-2xl bg-beige ring-1 ring-gold/15">
        {/* stilizə xəritə — SVG, şəkil yoxdur */}
        <svg
          viewBox="0 0 240 200"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <rect width="240" height="200" fill="#F4F1EA" />
          <path d="M-10 140 C 60 120, 90 160, 250 110" stroke="#fff" strokeWidth="14" fill="none" />
          <path d="M70 -10 C 80 60, 60 120, 95 210" stroke="#fff" strokeWidth="10" fill="none" />
          <path d="M150 -10 L 175 210" stroke="#fff" strokeWidth="8" fill="none" />
          <path d="M-10 50 L 250 70" stroke="#fff" strokeWidth="6" fill="none" />
          <rect x="100" y="78" width="40" height="26" rx="4" fill="#E8DFCC" />
          <rect x="185" y="20" width="36" height="30" rx="4" fill="#E8DFCC" />
          <rect x="20" y="160" width="40" height="22" rx="4" fill="#E8DFCC" />
          <circle cx="200" cy="160" r="22" fill="#DCE3CF" />
          <path
            d="M95 210 C 60 120, 80 60, 120 92"
            stroke="#C5A059"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            fill="none"
          />
        </svg>
        <motion.div
          className="absolute left-[50%] top-[38%] -translate-x-1/2 -translate-y-full"
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="grid h-9 w-9 place-items-center rounded-full rounded-bl-none bg-espresso shadow-lift [transform:rotate(-45deg)]">
            <MapPin className="h-4 w-4 rotate-45 text-gold-light" strokeWidth={1.8} aria-hidden="true" />
          </div>
        </motion.div>
      </div>
      <div className="mt-3 rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-gold/15">
        <p className="font-serif text-[17px] leading-tight text-ink">{x.navVenue ?? 'Ulduz Şadlıq Sarayı'}</p>
        <p className="mt-0.5 text-[11px] text-brown-dark/85">{x.navAddress ?? 'Bakı, Nəsimi rayonu'}</p>
        <button
          type="button"
          className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-full bg-espresso text-[10px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-espresso-soft"
        >
          <Navigation className="h-3.5 w-3.5 text-gold-light" strokeWidth={1.8} aria-hidden="true" />
          {x.navCta ?? 'Yol tarifi'}
        </button>
      </div>
    </div>
  );
}

// ── 3. Geyim tərzi ─────────────────────────────────────────────
const PALETTE = [
  { hex: '#E8D5A3', key: 'dcChampagne', az: 'Şampan' },
  { hex: '#F4EEE2', key: 'dcIvory', az: 'Fil sümüyü' },
  { hex: '#5E6B4E', key: 'dcOlive', az: 'Zeytun' },
  { hex: '#2C2523', key: 'dcEspresso', az: 'Espresso' },
];

function DresscodeScreen({ x }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center px-5">
      <ScreenTitle sub={x.dcStyle ?? 'Klassik · Black Tie'}>{x.featDresscode ?? 'Geyim tərzi'}</ScreenTitle>
      <div className="mt-6 flex gap-3" role="radiogroup" aria-label={x.dcPaletteLabel ?? 'Rəng palitrası'}>
        {PALETTE.map((c, i) => (
          <button
            key={c.hex}
            type="button"
            role="radio"
            aria-checked={sel === i}
            aria-label={x[c.key] ?? c.az}
            onClick={() => setSel(i)}
            className={`h-11 w-11 rounded-full ring-offset-2 ring-offset-cream transition-[box-shadow,transform] duration-300 ease-luxe hover:scale-105 ${
              sel === i ? 'ring-2 ring-gold-deep' : 'ring-1 ring-beige-dark'
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
      <p className="mt-3 h-4 text-[11px] font-medium text-ink">{x[PALETTE[sel].key] ?? PALETTE[sel].az}</p>
      <div className="mt-5 w-full space-y-2">
        {[
          [x.dcWomen ?? 'Xanımlar', x.dcWomenText ?? 'Uzun axşam donu'],
          [x.dcMen ?? 'Bəylər', x.dcMenText ?? 'Klassik kostyum, qalstuk'],
        ].map(([a, b]) => (
          <div
            key={a}
            className="flex items-center justify-between rounded-[12px] bg-white px-3.5 py-2.5 text-[11px] shadow-soft ring-1 ring-gold/15"
          >
            <span className="font-semibold uppercase tracking-[0.12em] text-gold-deep">{a}</span>
            <span className="text-brown-dark">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4. Oturma planı ────────────────────────────────────────────
const GUESTS = [
  { name: 'Aynur M.', table: 4 },
  { name: 'Elvin Q.', table: 7 },
  { name: 'Nərmin A.', table: 2 },
];

function SeatingScreen({ x }) {
  const [g, setG] = useState(0);
  const table = GUESTS[g].table;
  return (
    <div className="flex h-full flex-col justify-center px-5">
      <ScreenTitle sub={x.seatTitle ?? 'Masanızı tapın'}>{x.featSeating ?? 'Oturma planı'}</ScreenTitle>
      <div className="mt-4 flex justify-center gap-1.5">
        {GUESTS.map((guest, i) => (
          <button
            key={guest.name}
            type="button"
            aria-pressed={g === i}
            onClick={() => setG(i)}
            className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10.5px] font-medium transition-colors duration-300 ${
              g === i ? 'bg-espresso text-cream' : 'bg-white text-brown-dark ring-1 ring-gold/20 hover:ring-gold/50'
            }`}
          >
            {guest.name}
          </button>
        ))}
      </div>
      <div
        className="relative mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/70 p-3 ring-1 ring-gold/15"
        aria-hidden="true"
      >
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className={`mx-auto grid h-10 w-10 place-items-center rounded-full font-serif text-[15px] lining-nums transition-all duration-500 ease-luxe ${
              n === table ? 'scale-110 bg-gold text-espresso shadow-lift' : 'bg-beige text-brown-dark/70'
            }`}
          >
            {n}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[12px] text-brown-dark" aria-live="polite">
        <span className="font-serif text-[17px] italic text-ink">
          {x.seatTable ?? 'Masa'} {table}
        </span>
        <span className="mx-1.5 text-gold">·</span>
        {x.seatHint ?? 'Səhnəyə yaxın'}
      </p>
    </div>
  );
}

// ── 5. Foto qalereya ───────────────────────────────────────────
const SHOTS = [
  'from-[#F3EAD3] via-[#FBF7EE] to-[#EDE6D8]',
  'from-[#EDE6D8] via-[#F7F1E4] to-[#E8D5A3]/60',
  'from-[#F4F1EA] via-[#FFFDF8] to-[#F3EAD3]',
];

function GalleryScreen({ x }) {
  const [i, setI] = useState(0);
  const go = (d) => setI((v) => (v + d + SHOTS.length) % SHOTS.length);
  return (
    <div className="flex h-full flex-col px-4 pt-4">
      <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-2xl ring-1 ring-gold/15">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={i}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${SHOTS[i]}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: SCREEN_EASE }}
          >
            <Camera className="h-7 w-7 text-gold" strokeWidth={1.2} aria-hidden="true" />
            <span className="mt-2 text-[11px] text-brown-dark/70">
              {x.galPhoto ?? 'Şəkil'} {i + 1}
            </span>
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={x.prev ?? 'Əvvəlki'}
          className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-gold-deep shadow-soft transition hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={x.next ?? 'Növbəti'}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-gold-deep shadow-soft transition hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {SHOTS.map((_, n) => (
          <span
            key={n}
            className={`h-1.5 rounded-full transition-all duration-300 ${n === i ? 'w-5 bg-gold' : 'w-1.5 bg-beige-dark'}`}
          />
        ))}
      </div>
      <div className="mb-5 mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-gold/15">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-espresso">
          <QrCode className="h-6 w-6 text-gold-light" strokeWidth={1.4} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-[11.5px] font-semibold text-ink">{x.galQrTitle ?? 'QR kodu skan edin'}</p>
          <p className="text-[10.5px] leading-snug text-brown-dark/85">
            {x.galQrText ?? 'Şəkil və videolarınızı birbaşa yükləyin'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 6. Fon musiqisi ────────────────────────────────────────────
function MusicScreen({ x }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(28);
  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 1)), 600);
    return () => clearInterval(id);
  }, [playing]);
  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      {/* val (vinil) */}
      <div className="relative h-36 w-36">
        <div
          className={`absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,#2C2523_0_2px,#3A312D_2px_4px)] shadow-lift ${
            playing ? 'animate-[spin_6s_linear_infinite]' : ''
          }`}
        >
          <div className="absolute inset-[34%] rounded-full bg-gradient-to-br from-gold-light to-gold ring-4 ring-espresso" />
        </div>
      </div>
      <p className="mt-5 font-serif text-lg leading-tight text-ink">{x.musicTrack ?? 'Toy valsı'}</p>
      <p className="text-[11px] text-brown-dark/85">{x.musicArtist ?? 'Instrumental · Piano'}</p>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-beige-dark/60">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-500 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-6 items-end gap-[3px]" aria-hidden="true">
          {[0, 0.2, 0.4, 0.1].map((d, n) => (
            <span
              key={n}
              className={`w-[3px] origin-bottom rounded-full bg-gold ${playing ? 'animate-eq' : 'scale-y-[0.3]'}`}
              style={{ height: '100%', animationDelay: `${d}s` }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? (x.musicPause ?? 'Dayandır') : (x.musicPlay ?? 'Səsləndir')}
          aria-pressed={playing}
          className="grid h-12 w-12 place-items-center rounded-full bg-espresso text-gold-light shadow-lift transition-transform hover:scale-105"
        >
          {playing ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
          )}
        </button>
        <div className="flex h-6 items-end gap-[3px]" aria-hidden="true">
          {[0.3, 0.05, 0.25, 0.45].map((d, n) => (
            <span
              key={n}
              className={`w-[3px] origin-bottom rounded-full bg-gold ${playing ? 'animate-eq' : 'scale-y-[0.3]'}`}
              style={{ height: '100%', animationDelay: `${d}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 7. İştirak təsdiqi ─────────────────────────────────────────
function RsvpScreen({ x }) {
  const [answer, setAnswer] = useState('yes');
  const [count, setCount] = useState(2);
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="grid h-14 w-14 place-items-center rounded-full bg-gold text-espresso shadow-lift"
        >
          <Check className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
        </motion.div>
        <p className="mt-4 font-serif text-xl text-ink">{x.rsvpThanks ?? 'Təşəkkür edirik!'}</p>
        <p className="mt-1 text-[11.5px] text-brown-dark">{x.rsvpSaved ?? 'Cavabınız qeydə alındı.'}</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 text-[11px] font-medium text-gold-deep underline underline-offset-4"
        >
          {x.rsvpEdit ?? 'Cavabı dəyiş'}
        </button>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-center px-5">
      <ScreenTitle sub={x.rsvpQuestion ?? 'Bizimlə olacaqsınız?'}>{x.featRsvp ?? 'İştirak təsdiqi'}</ScreenTitle>
      <div
        className="mt-5 grid grid-cols-2 gap-2"
        role="radiogroup"
        aria-label={x.rsvpQuestion ?? 'Bizimlə olacaqsınız?'}
      >
        {[
          ['yes', x.rsvpYes ?? 'Gələcəyəm'],
          ['no', x.rsvpNo ?? 'Gələ bilmirəm'],
        ].map(([v, l]) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={answer === v}
            onClick={() => setAnswer(v)}
            className={`h-10 rounded-full text-[11px] font-semibold transition-colors duration-300 ${
              answer === v
                ? 'bg-espresso text-cream'
                : 'bg-white text-brown-dark ring-1 ring-gold/25 hover:ring-gold/60'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div
        className={`mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 shadow-soft ring-1 ring-gold/15 transition-opacity duration-300 ${
          answer === 'yes' ? 'opacity-100' : 'pointer-events-none opacity-40'
        }`}
      >
        <span className="text-[11px] font-medium text-brown-dark">{x.rsvpGuests ?? 'Qonaq sayı'}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={x.decrease ?? 'Azalt'}
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            className="grid h-7 w-7 place-items-center rounded-full bg-gold-mist text-gold-deep"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <span className="w-4 text-center font-serif text-lg lining-nums tabular-nums text-ink" aria-live="polite">
            {count}
          </span>
          <button
            type="button"
            aria-label={x.increase ?? 'Artır'}
            onClick={() => setCount((c) => Math.min(6, c + 1))}
            className="grid h-7 w-7 place-items-center rounded-full bg-gold-mist text-gold-deep"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSent(true)}
        className="mt-5 h-11 rounded-full bg-gold text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso shadow-soft transition hover:bg-[#CDA963]"
      >
        {x.rsvpSend ?? 'Təsdiqlə'}
      </button>
    </div>
  );
}

// ── 8. Tədbir proqramı ─────────────────────────────────────────
function ProgramScreen({ x }) {
  const items = [
    ['18:00', x.progWelcome ?? 'Qonaqların qarşılanması'],
    ['19:00', x.progCeremony ?? 'Bəy və gəlinin girişi'],
    ['20:00', x.progDinner ?? 'Şam yeməyi və musiqi'],
    ['22:30', x.progCake ?? 'Tortun kəsilməsi'],
  ];
  return (
    <div className="flex h-full flex-col justify-center px-6">
      <ScreenTitle sub={x.progTitle ?? 'Gecənin axışı'}>{x.featProgram ?? 'Tədbir proqramı'}</ScreenTitle>
      <ol className="relative mt-6 space-y-4 border-l border-gold/35 pl-5">
        {items.map(([time, label], i) => (
          <motion.li
            key={time}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.35, ease: SCREEN_EASE }}
            className="relative"
          >
            <span
              className="absolute -left-[25px] top-1 h-2 w-2 rotate-45 border border-gold bg-cream"
              aria-hidden="true"
            />
            <p className="font-serif text-[17px] leading-none lining-nums tabular-nums text-ink">{time}</p>
            <p className="mt-1 text-[11.5px] text-brown-dark">{label}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

// ── 9. Təbrik kitabı ───────────────────────────────────────────
function GuestbookScreen({ x }) {
  const [list, setList] = useState(() => [
    { n: 'Günay', m: x.gbSample1 ?? 'Ömürlük xoşbəxtlik arzulayırıq! ♡' },
    { n: 'Rəşad', m: x.gbSample2 ?? 'Bir yastıqda qocalın, əzizlərim.' },
  ]);
  const [val, setVal] = useState('');
  const inputId = useId();
  const submit = (e) => {
    e.preventDefault();
    const m = val.trim();
    if (!m) return;
    setList((l) => [{ n: x.gbYou ?? 'Siz', m }, ...l].slice(0, 3));
    setVal('');
  };
  return (
    <div className="flex h-full flex-col px-4 pb-5 pt-4">
      <ScreenTitle>{x.featGuestbook ?? 'Təbrik kitabı'}</ScreenTitle>
      <ul className="mt-3 flex-1 space-y-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {list.map((it) => (
            <motion.li
              key={it.n + it.m}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: SCREEN_EASE }}
              className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-gold/15"
            >
              <p className="font-serif text-[14px] italic leading-snug text-ink">“{it.m}”</p>
              <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold-deep">— {it.n}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <form
        onSubmit={submit}
        className="mt-3 flex items-center gap-2 rounded-full bg-white p-1 pl-4 shadow-soft ring-1 ring-gold/20 focus-within:ring-gold-deep"
      >
        <label htmlFor={inputId} className="sr-only">
          {x.gbPlaceholder ?? 'Təbrikinizi yazın…'}
        </label>
        <input
          id={inputId}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          maxLength={80}
          placeholder={x.gbPlaceholder ?? 'Təbrikinizi yazın…'}
          className="min-w-0 flex-1 bg-transparent text-[16px] text-ink placeholder:text-brown-muted focus:outline-none sm:text-[13px]"
        />
        <button
          type="submit"
          aria-label={x.gbSend ?? 'Göndər'}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-espresso text-gold-light transition hover:bg-espresso-soft"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

// ── 10. Love story ─────────────────────────────────────────────
const STORY = [
  { year: '2019', t: 'lsMet', az: 'İlk görüş', d: 'lsMetText', azd: 'Dostların ad günündə təsadüfi tanışlıq' },
  { year: '2023', t: 'lsProposal', az: 'Evlilik təklifi', d: 'lsProposalText', azd: 'Dəniz kənarında, gün batımında' },
  { year: '2025', t: 'lsEngagement', az: 'Nişan', d: 'lsEngagementText', azd: 'Ailələrimizin xeyir-duası ilə' },
  { year: '2027', t: 'lsWedding', az: 'Toy', d: 'lsWeddingText', azd: 'Hekayəmizin ən gözəl səhifəsi' },
];
const STORY_TONES = [
  'from-[#F3EAD3] via-[#FBF7EE] to-[#EDE6D8]',
  'from-[#EDE6D8] via-[#F7F1E4] to-[#E8D5A3]/70',
  'from-[#F4F1EA] via-[#FFFDF8] to-[#F3EAD3]',
  'from-[#E8D5A3]/60 via-[#FBF7EE] to-[#F3EAD3]',
];

function LoveStoryScreen({ x }) {
  const [i, setI] = useState(0);
  const m = STORY[i];
  return (
    <div className="flex h-full flex-col px-4 pb-5 pt-4">
      <ScreenTitle sub={x.lsTitle ?? 'Bizim hekayəmiz'}>{x.featLoveStory ?? 'Love story'}</ScreenTitle>
      {/* şəkil yer tutucusu — ölçü sabit */}
      <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-2xl ring-1 ring-gold/15">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={i}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${STORY_TONES[i]}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: SCREEN_EASE }}
          >
            <Heart className="h-6 w-6 text-gold" strokeWidth={1.2} aria-hidden="true" />
            <span className="mt-2 font-serif text-[28px] italic leading-none lining-nums text-gold-deep">{m.year}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* zaman xətti */}
      <div className="relative mt-4 px-2">
        <span aria-hidden="true" className="absolute inset-x-5 top-[7px] h-px bg-gold/35" />
        <div className="relative flex justify-between" role="group" aria-label={x.lsTimeline ?? 'Hekayə xronologiyası'}>
          {STORY.map((s, n) => (
            <button
              key={s.year}
              type="button"
              onClick={() => setI(n)}
              aria-pressed={i === n}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={`grid h-[15px] w-[15px] place-items-center rounded-full border transition-colors duration-300 ${
                  i === n ? 'border-gold-deep bg-gold' : 'border-gold/50 bg-cream'
                }`}
              >
                {n === STORY.length - 1 && <Heart className="h-2 w-2 fill-current text-espresso" aria-hidden="true" />}
              </span>
              <span
                className={`text-[10px] font-semibold lining-nums tabular-nums ${i === n ? 'text-ink' : 'text-brown-dark/70'}`}
              >
                {s.year}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 h-[52px] text-center" aria-live="polite">
        <p className="font-serif text-[18px] leading-tight text-ink">{x[m.t] ?? m.az}</p>
        <p className="mt-1 text-[11px] text-brown-dark">{x[m.d] ?? m.azd}</p>
      </div>
    </div>
  );
}
