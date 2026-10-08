// ════════════════════════════════════════════════════════════════
// Footer (#site-footer) — espresso fon, loqo, naviqasiya, əlaqə, hüquqi linklər
// İstifadə:
//   <Footer lang={lang} whatsappUrl="..." email="info@digitoy.az"
//           instagramUrl="https://instagram.com/..." tiktokUrl="https://tiktok.com/@..."
//           onCookieSettings={() => openCookieSettings()} />
// ════════════════════════════════════════════════════════════════
import { ArrowUp, Mail } from 'lucide-react';
import t from '../../../data/translations';
import { Container, WhatsAppIcon } from './ui';
import { scrollToSection } from './scroll';

function InstagramIcon({ className = 'h-[18px] w-[18px]' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className = 'h-[18px] w-[18px]' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.6 3c.3 2.1 1.6 3.6 3.9 3.8v3a7.1 7.1 0 0 1-3.9-1.2v6.2c0 3.4-2.6 6.2-6.1 6.2a6 6 0 0 1-6-6c0-3.6 3.2-6.4 6.9-5.9v3.2a2.9 2.9 0 0 0-3.8 2.8 2.9 2.9 0 0 0 5.8 0V3h3.2Z" />
    </svg>
  );
}

export default function Footer({
  lang = 'az',
  whatsappUrl = 'https://wa.me/994000000000',
  email = 'info@digitoy.az',
  instagramUrl = 'https://instagram.com/',
  tiktokUrl = 'https://tiktok.com/',
  privacyHref = '/privacy',
  termsHref = '/terms',
  refundHref = '/refund',
  onCookieSettings = () => {},
  /* İnteqrasiya: nav [{id,label}] + onNavigate(id), legalLinks [{id,href,label,onClick}], onLogoClick */
  nav: navProp,
  onNavigate,
  legalLinks,
  cookiesLabel,
  onLogoClick,
}) {
  const x = t[lang] ?? t.az ?? {};
  const year = new Date().getFullYear();

  const nav = navProp ? navProp.map((n) => [n.id, n.label]) : [
    ['features', x.navFeatures ?? 'Funksiyalar'],
    ['how-it-works', x.navHow ?? 'Necə işləyir?'],
    ['sample-section', x.navTemplates ?? 'Şablonlar'],
    ['builder-section', x.navPackages ?? 'Paketlər'],
    ['faq', x.navFaq ?? 'Suallar'],
  ];

  const social = [
    ['WhatsApp', whatsappUrl, <WhatsAppIcon key="w" className="h-[18px] w-[18px]" />],
    ['Instagram', instagramUrl, <InstagramIcon key="i" />],
    ['TikTok', tiktokUrl, <TikTokIcon key="t" />],
  ];

  const linkCls =
    'rounded text-[14.5px] text-sand transition-colors duration-300 hover:text-cream focus-visible:outline-gold-light';
  const headCls = 'text-[11px] font-semibold uppercase tracking-eyebrow text-gold-light';

  return (
    <footer
      id="site-footer"
      className="relative isolate overflow-hidden bg-espresso-grad text-sand [&_:focus-visible]:outline-gold-light"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold-line opacity-60" />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -z-10 h-[420px] w-[900px] max-w-[180vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(197,160,89,0.14),transparent)]"
      />

      {/* Köhnə «Əlaqə» ankeri — xarici linklər bura gəlir */}
      <div id="contact-section" />
      <Container className="pb-10 pt-20 lg:pt-24">
        {/* ── Yuxarı: brend + sütunlar ──────────────────────────── */}
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div className="max-w-sm">
            <a
              href="/"
              onClick={onLogoClick ? (e) => { e.preventDefault(); onLogoClick(); } : undefined}
              className="inline-flex items-baseline rounded-[6px]"
              aria-label="Digitoy.az"
            >
              <span className="font-serif text-[32px] font-medium leading-none tracking-[0.04em] text-gold-light">
                Digitoy
              </span>
              <span className="font-serif text-[22px] italic leading-none text-sand/80">.az</span>
            </a>
            <p className="mt-5 font-serif text-[22px] italic leading-snug text-cream/90">
              {x.footerTagline ?? 'Ömürlük xatirələr üçün premium rəqəmsal dəvətnamələr.'}
            </p>
            <ul className="mt-8 flex gap-3">
              {social.map(([label, href, icon]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-gold/30 text-gold-light transition-[background-color,border-color,color,transform] duration-300 ease-luxe hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-espresso"
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={x.footerNavLabel ?? 'Sayt xəritəsi'}>
            <h2 className={headCls}>{x.footerNav ?? 'Naviqasiya'}</h2>
            <ul className="mt-5 space-y-3">
              {nav.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate(id);
                      else scrollToSection(id);
                    }}
                    className={linkCls}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headCls}>{x.footerContact ?? 'Əlaqə'}</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkCls} inline-flex items-center gap-2.5`}
                >
                  <WhatsAppIcon className="h-4 w-4 text-gold-light" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className={`${linkCls} inline-flex items-center gap-2.5 break-all`}>
                  <Mail className="h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.6} aria-hidden="true" />
                  {email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={headCls}>{x.footerLegal ?? 'Hüquqi'}</h2>
            <ul className="mt-5 space-y-3">
              {(legalLinks ?? [
                { id: 'privacy', href: privacyHref, label: x.footerPrivacy ?? 'Məxfilik siyasəti' },
                { id: 'terms', href: termsHref, label: x.footerTerms ?? 'İstifadə şərtləri' },
                { id: 'refund', href: refundHref, label: x.footerRefund ?? 'Ödəniş və geri qaytarma' },
              ]).map((l) => (
                <li key={l.id}>
                  <a href={l.href} onClick={l.onClick} className={linkCls}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" onClick={onCookieSettings} className={`${linkCls} text-left`}>
                  {cookiesLabel ?? x.footerCookies ?? 'Kuki ayarları'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Nəhəng dekorativ söz nişanı ───────────────────────── */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-16 select-none text-center font-serif text-[23vw] font-medium leading-[1] tracking-[0.02em] text-transparent [-webkit-text-stroke:1px_rgba(197,160,89,0.22)] lg:mt-20 lg:text-[15.5rem] xl:text-[17rem]"
        >
          Digitoy
        </p>

        {/* ── Alt sətir ─────────────────────────────────────────── */}
        <div className="mt-6 flex flex-col-reverse items-center gap-6 border-t border-gold/15 pt-8 sm:flex-row sm:justify-between">
          <p className="text-center text-[12px] tracking-[0.08em] text-sand/90 sm:text-left">
            © {year} Digitoy.az. {x.footerRights ?? 'Bütün hüquqlar qorunur.'}
          </p>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
              })
            }
            className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-label text-gold-light transition-colors hover:text-cream"
          >
            {x.footerTop ?? 'Yuxarı qayıt'}
            <ArrowUp
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </Container>
    </footer>
  );
}
