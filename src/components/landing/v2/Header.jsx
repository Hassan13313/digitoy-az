// ════════════════════════════════════════════════════════════════
// Header — fixed, sürüşmədə "şüşə" fona keçir, aktiv bölməni vurğulayır
// İstifadə:
//   <Header lang={lang} onLangChange={setLang} whatsappUrl="https://wa.me/994XXXXXXXXX" />
// ════════════════════════════════════════════════════════════════
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import t from '../../../data/translations';
import { Container, WhatsAppIcon } from './ui';
import { scrollToSection } from './scroll';

const LANGS = ['az', 'en', 'ru'];

const getNav = (x) => [
  { id: 'features', label: x.navFeatures ?? 'Funksiyalar' },
  { id: 'how-it-works', label: x.navHow ?? 'Necə işləyir?' },
  { id: 'sample-section', label: x.navTemplates ?? 'Şablonlar' },
  { id: 'builder-section', label: x.navPackages ?? 'Paketlər' },
  { id: 'faq', label: x.navFaq ?? 'Suallar' },
];

/**
 * İnteqrasiya props-ları (Digitoy):
 *  - nav          — [{ id, label }] (verilməsə getNav); `id` səhifədəki bölmənin id-sidir
 *  - onNavigate   — (id) => void; verilsə, bölməyə sürüşmə əvəzinə çağırılır
 *                   (məs. «Şablonlar» → /templates, «Paketlər» → paket seçiminə qayıt)
 *  - onLogoClick  — verilsə, loqo səhifəni yeniləmir, bu funksiya çağırılır
 */
export default function Header({
  lang = 'az',
  onLangChange = () => {},
  whatsappUrl = 'https://wa.me/994000000000',
  email = 'info@digitoy.az',
  nav: navProp,
  onNavigate,
  onLogoClick,
}) {
  const x = t[lang] ?? t.az ?? {};
  const nav = navProp ?? getNav(x);
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);
  const menuId = useId();

  // <html lang> — ekran oxuyucular və "İ/ı" böyük hərf çevrilməsi üçün vacibdir
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Sürüşmə vəziyyəti (rAF ilə, passive)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Aktiv bölmə — ekranın ortasından keçən bölmə
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 200 && setActive(null);
    window.addEventListener('scroll', onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onTop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback((e, id) => {
    e.preventDefault();
    setOpen(false);
    // menyu bağlanandan sonra sürüşdür ki, scroll-lock mane olmasın
    requestAnimationFrame(() => {
      if (onNavigate) { onNavigate(id); return; }
      scrollToSection(id);
      history.replaceState(null, '', `#${id}`);
    });
  }, [onNavigate]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    burgerRef.current?.focus();
  }, []);

  const solid = scrolled || open;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-espresso px-4 py-2 text-sm text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {x.skipToContent ?? 'Əsas məzmuna keç'}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-luxe ${
          solid
            ? 'bg-cream/80 shadow-[0_1px_0_rgba(197,160,89,0.18),0_10px_30px_-20px_rgba(92,74,58,0.35)] backdrop-blur-xl backdrop-saturate-150'
            : 'bg-transparent'
        }`}
      >
        <Container
          className={`flex items-center justify-between gap-3 transition-[height] duration-500 ease-luxe ${
            scrolled ? 'h-16' : 'h-16 lg:h-[76px]'
          }`}
        >
          {/* Loqo */}
          <a
            href="/"
            onClick={onLogoClick ? (e) => { e.preventDefault(); onLogoClick(); } : undefined}
            className="group flex shrink-0 items-baseline rounded-[6px]"
            aria-label="Digitoy.az"
          >
            <span className="text-gold-sheen font-serif text-[25px] font-medium leading-none tracking-[0.04em] sm:text-[27px]">
              Digitoy
            </span>
            <span className="font-serif text-[18px] italic leading-none text-brown-dark/70 sm:text-[19px]">.az</span>
          </a>

          {/* Desktop naviqasiya */}
          <nav aria-label={x.navLabel ?? 'Əsas naviqasiya'} className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {nav.map((n) => {
                const isActive = active === n.id;
                return (
                  <li key={n.id}>
                    <a
                      href={`#${n.id}`}
                      onClick={(e) => go(e, n.id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`relative block rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-label transition-colors duration-300 xl:px-4 ${
                        isActive ? 'text-ink' : 'text-brown-dark/80 hover:text-ink'
                      }`}
                    >
                      {n.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
                          className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold-line xl:inset-x-4"
                          aria-hidden="true"
                        >
                          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold" />
                        </motion.span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sağ tərəf */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gold px-0 text-espresso shadow-soft ring-1 ring-inset ring-gold-dark/30 transition-[transform,background-color,box-shadow] duration-300 ease-luxe hover:-translate-y-px hover:bg-[#CDA963] hover:shadow-lift max-xl:w-10 xl:px-4"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              <span className="hidden text-[11px] font-semibold uppercase tracking-label xl:inline">WhatsApp</span>
            </a>

            <LangSwitch lang={lang} onChange={onLangChange} label={x.langLabel ?? 'Dil seçimi'} />

            <button
              ref={burgerRef}
              type="button"
              aria-label={open ? (x.menuClose ?? 'Menyunu bağla') : (x.menuOpen ?? 'Menyunu aç')}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((o) => !o)}
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-gold-mist/70"
            >
              <span aria-hidden="true" className="relative block h-3 w-[22px]">
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-luxe ${
                    open ? 'top-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 h-px bg-current transition-[transform,width] duration-500 ease-luxe ${
                    open ? 'top-1/2 w-full -rotate-45' : 'bottom-0 w-[70%]'
                  }`}
                />
              </span>
            </button>
          </div>
        </Container>
      </header>

      <MenuSheet
        id={menuId}
        open={open}
        onClose={closeMenu}
        nav={nav}
        active={active}
        go={go}
        x={x}
        lang={lang}
        onLangChange={onLangChange}
        whatsappUrl={whatsappUrl}
        email={email}
        reduce={reduce}
      />
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// Dil seçimi — sürüşən espresso göstərici
// ════════════════════════════════════════════════════════════════
function LangSwitch({ lang, onChange, label, size = 'sm' }) {
  const reduce = useReducedMotion();
  const uid = useId();
  const btn = size === 'lg' ? 'h-10 w-12 text-xs' : 'h-8 w-[34px] text-[10.5px]';
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex items-center rounded-full bg-white/70 p-1 ring-1 ring-gold/30 backdrop-blur"
    >
      {LANGS.map((l) => {
        const sel = l === lang;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={sel}
            lang={l}
            onClick={() => onChange(l)}
            className={`relative rounded-full font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${btn} ${
              sel ? 'text-cream' : 'text-brown-dark hover:text-ink'
            }`}
          >
            {sel && (
              <motion.span
                layoutId={`${uid}-lang`}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 36 }}
                className="absolute inset-0 rounded-full bg-espresso shadow-inner-gold"
                aria-hidden="true"
              />
            )}
            <span className="relative">{l}</span>
          </button>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Menyu paneli (mobil + desktop) — sağdan açılan zərif panel
// Esc ilə bağlanır, fokus panel daxilində qalır, arxa fon sürüşmür
// ════════════════════════════════════════════════════════════════
function MenuSheet({ id, open, onClose, nav, active, go, x, lang, onLangChange, whatsappUrl, email, reduce }) {
  const panelRef = useRef(null);

  // Scroll lock + scrollbar enini kompensasiya (desktopda layout sıçramasın)
  useEffect(() => {
    if (!open) return undefined;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const prev = { o: document.body.style.overflow, p: document.body.style.paddingRight };
    document.body.style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      document.body.style.overflow = prev.o;
      document.body.style.paddingRight = prev.p;
    };
  }, [open]);

  // Esc + fokus tələsi
  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    const first = panel?.querySelector('a, button');
    first?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const f = panel.querySelectorAll('a[href], button:not([disabled])');
      const a = f[0];
      const z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const ease = [0.22, 1, 0.36, 1];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1001]" id={id}>
          <motion.div
            className="absolute inset-0 bg-espresso/35 backdrop-blur-[3px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={x.menuTitle ?? 'Menyu'}
            className="grain absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col overflow-y-auto bg-cream shadow-luxe"
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduce ? 0 : 0.55, ease }}
          >
            {/* yuxarı sətir */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gold/15 px-6 lg:h-[76px] lg:px-8">
              <span className="font-serif text-[25px] font-medium leading-none tracking-[0.04em]">
                <span className="text-gold-sheen">Digitoy</span>
                <span className="text-[18px] italic text-brown-dark/70">.az</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label={x.menuClose ?? 'Menyunu bağla'}
                className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-gold-mist/70"
              >
                <span aria-hidden="true" className="relative block h-3 w-[22px]">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            {/* naviqasiya */}
            <nav aria-label={x.navLabel ?? 'Əsas naviqasiya'} className="flex-1 px-6 pt-6 lg:px-8 lg:pt-10">
              <ul>
                {nav.map((n, i) => (
                  <motion.li
                    key={n.id}
                    initial={reduce ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : 0.12 + i * 0.05, duration: 0.5, ease }}
                    className="border-b border-gold/15"
                  >
                    <a
                      href={`#${n.id}`}
                      onClick={(e) => go(e, n.id)}
                      aria-current={active === n.id ? 'location' : undefined}
                      className="group flex items-baseline gap-5 py-5"
                    >
                      <span className="w-6 font-serif text-sm italic lining-nums tabular-nums text-gold-deep">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`font-serif text-[30px] font-medium leading-none transition-[color,transform] duration-300 ease-luxe group-hover:translate-x-1 ${
                          active === n.id ? 'text-gold-deep' : 'text-ink group-hover:text-gold-deep'
                        }`}
                      >
                        {n.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* alt hissə */}
            <div className="space-y-6 px-6 pb-8 pt-8 lg:px-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-14 items-center justify-between rounded-full bg-espresso-grad pl-6 pr-2 text-cream shadow-lift ring-1 ring-inset ring-gold/30"
              >
                <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-label">
                  <WhatsAppIcon className="h-[18px] w-[18px] text-gold-light" />
                  {x.menuWhatsapp ?? 'WhatsApp ilə yazın'}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-espresso transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <LangSwitch lang={lang} onChange={onLangChange} label={x.langLabel ?? 'Dil seçimi'} size="lg" />
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-sm text-brown-dark underline-offset-4 hover:text-ink hover:underline"
                >
                  <Mail className="h-4 w-4 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
                  {email}
                </a>
              </div>
              <p className="font-serif text-[17px] italic leading-snug text-brown-dark/85">
                {x.footerTagline ?? 'Ömürlük xatirələr üçün premium rəqəmsal dəvətnamələr.'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
