// ════════════════════════════════════════════════════════════════
// Hüquqi səhifələr — /mexfilik, /sertler, /geri-qaytarma (YALNIZ görünüş)
//   LegalDocTabs · LegalToc · LegalArticle · LegalContactCard · LegalRelated · ReadingProgress
//
// Sənəd forması:
//   doc  = { title, notice?, intro: Body[], sections: [{ id, title, body: Body[] }] }
//   Body = string (abzas) | { list: string[] } (nöqtəli siyahı)
// ════════════════════════════════════════════════════════════════
import { useRef } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { ArrowUpRight, ChevronDown, FileText, Info, Mail } from 'lucide-react';
import { WhatsAppIcon } from '../landing/v2/ui';
import { FOCUS, FOCUS_DARK, Kicker } from './shared';

const pad = (n) => String(n).padStart(2, '0');

// ════════════════════════════════════════════════════════════════
/**
 * Üç sənəd arasında keçid. Hər biri real <a href> (yeni tabda açılır), klik onNavigate-ə gedir.
 * @param {object} p
 * @param {{href:string, label:string}[]} p.docs
 * @param {string} p.currentHref                Aktiv sənədin href-i → aria-current="page"
 * @param {(e:MouseEvent, href:string)=>void} [p.onNavigate]
 * @param {string} [p.label='Hüquqi sənədlər']
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function LegalDocTabs({ docs = [], currentHref, onNavigate, label = 'Hüquqi sənədlər', lang = 'az' }) {
  return (
    <nav lang={lang} aria-label={label}>
      <ul className="grid grid-cols-3 gap-1 rounded-[20px] bg-white/70 p-1 ring-1 ring-inset ring-beige-dark sm:inline-grid sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-none sm:rounded-full">
        {docs.map((d) => {
          const current = d.href === currentHref;
          return (
            <li key={d.href} className="min-w-0">
              <a
                href={d.href}
                aria-current={current ? 'page' : undefined}
                onClick={(e) => onNavigate?.(e, d.href)}
                className={`flex h-full min-h-[48px] items-center justify-center rounded-[16px] px-2 text-center text-[12.5px] font-medium leading-tight hyphens-auto [overflow-wrap:anywhere] transition-[background-color,color] duration-300 sm:rounded-full sm:px-5 sm:text-[13.5px] ${FOCUS} ${
                  current
                    ? 'bg-espresso text-cream shadow-soft'
                    : 'text-brown-dark hover:bg-gold-mist/60 hover:text-ink'
                }`}
              >
                {d.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Mündəricat. Desktop (lg+): yapışqan nömrəli siyahı, aktiv bölmə qızılı zolaqla.
 * Mobil: başlığın altında yapışan açılan siyahı (<details> — klaviatura ilə Enter/Space).
 * @param {object} p
 * @param {{id:string, title:string}[]} p.sections
 * @param {string} [p.activeId]                 useActiveSection() nəticəsi
 * @param {(e:MouseEvent, id:string)=>void} [p.onJump]   Verilməsə adi #anchor işləyir
 * @param {string} [p.title='Mündəricat']
 * @param {'both'|'desktop'|'mobile'} [p.variant='both']
 * @param {string} [p.mobileStickyTop='top-16']  Mobil siyahının yapışma nöqtəsi (başlıq hündürlüyü)
 * @param {string} [p.mobileClassName]          Mobil siyahıya əlavə class (məs. margin). Yapışması üçün onu
 *                                               uzun valideynin BİRBAŞA övladı kimi qoyun (kiçik div-ə bükməyin).
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function LegalToc({
  sections = [],
  activeId,
  onJump,
  title = 'Mündəricat',
  variant = 'both',
  mobileStickyTop = 'top-16',
  mobileClassName = '',
  lang = 'az',
}) {
  const detailsRef = useRef(null);
  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );
  const active = sections[activeIndex];

  return (
    <MotionConfig reducedMotion="user">
      {variant !== 'mobile' && (
        <nav lang={lang} aria-label={title} className="hidden lg:block">
          <Kicker lang={lang}>{title}</Kicker>
          <ol className="mt-5 border-l border-gold/25">
            {sections.map((s, i) => {
              const on = s.id === activeId;
              return (
                <li key={s.id} className="relative">
                  {on && (
                    <motion.span
                      layoutId="legal-toc-bar"
                      aria-hidden="true"
                      className="absolute -left-px top-1 bottom-1 w-[2px] rounded-full bg-gold-deep"
                      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                    />
                  )}
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => onJump?.(e, s.id)}
                    aria-current={on ? 'location' : undefined}
                    className={`flex min-h-[40px] items-baseline gap-3 rounded-r-[8px] py-2 pl-5 pr-2 text-[14px] leading-snug transition-colors ${FOCUS} ${
                      on ? 'text-ink' : 'text-brown-dark hover:text-ink'
                    }`}
                  >
                    <span
                      className={`w-5 shrink-0 font-serif text-[14px] italic lining-nums ${on ? 'text-gold-deep' : 'text-brown-dark/70'}`}
                    >
                      {pad(i + 1)}
                    </span>
                    <span className={on ? 'font-medium' : ''}>{s.title}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {variant !== 'desktop' && (
        <details
          ref={detailsRef}
          lang={lang}
          className={`group sticky ${mobileStickyTop} z-30 -mx-5 border-b border-gold/20 bg-cream/90 px-5 backdrop-blur-xl lg:hidden ${mobileClassName}`}
        >
          <summary
            className={`flex min-h-[56px] cursor-pointer list-none items-center gap-3 rounded-[8px] [&::-webkit-details-marker]:hidden ${FOCUS}`}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[10.5px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
                {title}
              </span>
              <span className="mt-0.5 block truncate text-[14px] text-ink">
                {active && (
                  <>
                    <span className="mr-1.5 font-serif italic lining-nums text-gold-deep">{pad(activeIndex + 1)}</span>
                    {active.title}
                  </>
                )}
              </span>
            </span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-gold-deep transition-transform duration-300 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <ol className="max-h-[60vh] overflow-y-auto pb-3">
            {sections.map((s, i) => {
              const on = s.id === activeId;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={on ? 'location' : undefined}
                    onClick={(e) => {
                      onJump?.(e, s.id);
                      if (detailsRef.current) detailsRef.current.open = false;
                    }}
                    className={`flex min-h-[44px] items-baseline gap-3 rounded-[8px] px-1 py-2.5 text-[15px] ${FOCUS} ${
                      on ? 'text-ink' : 'text-brown-dark'
                    }`}
                  >
                    <span className="w-5 shrink-0 font-serif italic lining-nums text-gold-deep">{pad(i + 1)}</span>
                    <span className={on ? 'font-medium' : ''}>{s.title}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </details>
      )}
    </MotionConfig>
  );
}

// ════════════════════════════════════════════════════════════════
function Body({ blocks = [] }) {
  return blocks.map((b, i) =>
    typeof b === 'string' ? (
      <p key={i}>{b}</p>
    ) : b?.list ? (
      <ul key={i} className="space-y-2.5">
        {b.list.map((item, j) => (
          <li key={j} className="relative pl-6">
            <span aria-hidden="true" className="absolute left-0.5 top-[0.72em] h-1.5 w-1.5 rotate-45 bg-gold" />
            {item}
          </li>
        ))}
      </ul>
    ) : null,
  );
}

/**
 * Sənədin özü: başlıq, yenilənmə tarixi, qeyd, giriş, nömrəli bölmələr.
 * Hər bölmənin `id`-si və scroll-margin-top-u var → #anchor linklər başlığın altında dayanır.
 * Mətn sütunu ≤ 68 simvol, 17px, sətir aralığı 1.8.
 * @param {object} p
 * @param {{title:string, notice?:string, intro?:(string|{list:string[]})[], sections:{id:string,title:string,body:(string|{list:string[]})[]}[]}} p.doc
 * @param {string} [p.updatedLabel='Son yenilənmə:']
 * @param {string} [p.updatedAt]          Göstəriləcək tarix: «6 Oktyabr 2026»
 * @param {string} [p.updatedIso]         <time dateTime>: «2026-10-06»
 * @param {string} [p.noticeLabel='Qeyd']
 * @param {string} [p.scrollMarginClass='scroll-mt-36 lg:scroll-mt-24']  Yapışqan başlıq(lar)a görə
 * @param {React.Ref} [p.articleRef]      ReadingProgress üçün
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function LegalArticle({
  doc,
  updatedLabel = 'Son yenilənmə:',
  updatedAt,
  updatedIso,
  noticeLabel = 'Qeyd',
  scrollMarginClass = 'scroll-mt-36 lg:scroll-mt-24',
  articleRef,
  lang = 'az',
}) {
  if (!doc) return null;
  return (
    <article ref={articleRef} lang={lang} className="min-w-0">
      <header>
        <h1 className="font-serif text-[2.5rem] font-medium leading-[1.06] tracking-[-0.01em] text-ink [text-wrap:balance] sm:text-[3.25rem]">
          {doc.title}
        </h1>
        <div aria-hidden="true" className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
        {updatedAt && (
          <p className="mt-5 text-[13px] text-brown-dark">
            {updatedLabel} <time dateTime={updatedIso}>{updatedAt}</time>
          </p>
        )}
      </header>

      {doc.notice && (
        <aside
          role="note"
          className="mt-8 flex max-w-[68ch] gap-3.5 rounded-2xl bg-gold-mist/60 p-4 ring-1 ring-inset ring-gold/30 sm:p-5"
        >
          <Info className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold-deep" strokeWidth={1.8} aria-hidden="true" />
          <p className="text-[14.5px] leading-relaxed text-[#3A312D]">
            <span className="sr-only">{noticeLabel}: </span>
            {doc.notice}
          </p>
        </aside>
      )}

      {doc.intro?.length > 0 && (
        <div className="mt-8 max-w-[68ch] space-y-5 text-[17px] leading-[1.8] text-[#3A312D] sm:text-[18px] [&>p:first-child]:font-serif [&>p:first-child]:text-[21px] [&>p:first-child]:leading-[1.55] [&>p:first-child]:text-ink sm:[&>p:first-child]:text-[23px]">
          <Body blocks={doc.intro} />
        </div>
      )}

      <div className="mt-12 space-y-14 sm:mt-14 sm:space-y-16">
        {doc.sections?.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className={scrollMarginClass}>
            <div className="flex items-baseline gap-4 border-t border-gold/25 pt-7">
              <span aria-hidden="true" className="font-serif text-[22px] italic lining-nums text-gold-deep">
                {pad(i + 1)}
              </span>
              <h2
                id={`${s.id}-title`}
                className="font-serif text-[26px] font-medium leading-tight text-ink sm:text-[30px]"
              >
                {s.title}
              </h2>
            </div>
            <div className="mt-5 max-w-[68ch] space-y-5 text-[16.5px] leading-[1.8] text-[#3A312D] sm:pl-[42px] sm:text-[17px]">
              <Body blocks={s.body} />
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * «Sualınız var?» əlaqə kartı.
 * @param {object} p
 * @param {string} [p.title='Sualınız var?']
 * @param {string} [p.text]
 * @param {string} [p.email='info@digitoy.az']
 * @param {string} [p.emailLabel='E-poçt']
 * @param {string} [p.whatsappUrl]
 * @param {string} [p.whatsappLabel='WhatsApp']
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function LegalContactCard({
  title = 'Sualınız var?',
  text = 'Bu sənədlə bağlı sualınız olarsa, bizə yazın.',
  email = 'info@digitoy.az',
  emailLabel = 'E-poçt',
  whatsappUrl,
  whatsappLabel = 'WhatsApp',
  lang = 'az',
}) {
  return (
    <section
      lang={lang}
      className="relative overflow-hidden rounded-[28px] bg-espresso-grad p-7 text-cream shadow-luxe sm:p-10"
    >
      <span aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gold-line" />
      <span
        aria-hidden="true"
        className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.2),transparent)]"
      />
      <div className="relative sm:flex sm:items-end sm:justify-between sm:gap-8">
        <div>
          <h2 className="font-serif text-[30px] font-medium leading-tight">{title}</h2>
          {text && <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-sand">{text}</p>}
        </div>
        <div className="mt-6 grid gap-2.5 sm:mt-0 sm:min-w-[260px]">
          {email && (
            <a
              href={`mailto:${email}`}
              className={`flex min-h-[52px] items-center gap-3 rounded-2xl bg-white/[0.06] px-4 ring-1 ring-inset ring-gold/25 transition-colors hover:bg-white/10 ${FOCUS_DARK}`}
            >
              <Mail className="h-[18px] w-[18px] shrink-0 text-gold-light" strokeWidth={1.6} aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light">
                  {emailLabel}
                </span>
                <span className="block truncate text-[14.5px] text-cream">{email}</span>
              </span>
            </a>
          )}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-gold px-4 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:bg-[#CDA963] ${FOCUS_DARK}`}
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              {whatsappLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * «Digər sənədlər» linkləri.
 * @param {object} p
 * @param {string} [p.title='Digər sənədlər']
 * @param {{href:string, label:string, description?:string}[]} p.items
 * @param {(e:MouseEvent, href:string)=>void} [p.onNavigate]
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function LegalRelated({ title = 'Digər sənədlər', items = [], onNavigate, lang = 'az' }) {
  if (!items.length) return null;
  return (
    <nav lang={lang} aria-label={title}>
      <Kicker lang={lang}>{title}</Kicker>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              onClick={(e) => onNavigate?.(e, it.href)}
              className={`group flex min-h-[72px] items-center gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-beige-dark/80 transition-[box-shadow,transform] duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-lift ${FOCUS}`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-mist text-gold-deep">
                <FileText className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-[20px] leading-tight text-ink">{it.label}</span>
                {it.description && <span className="mt-0.5 block text-[13px] text-brown-dark">{it.description}</span>}
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-gold-deep transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Nazik qızılı oxu zolağı. SubpageHeader-in `progress` slotuna qoyun.
 * Dekorativdir (aria-hidden) — məzmun ekran oxuyucu üçün dəyişmir.
 * @param {object} p
 * @param {number} p.value   0…1 (useReadingProgress nəticəsi)
 */
export function ReadingProgress({ value = 0 }) {
  return (
    <span aria-hidden="true" className="block h-[2px] w-full bg-transparent">
      <span
        className="block h-full origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-light transition-transform duration-150 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${Math.min(1, Math.max(0, value))})` }}
      />
    </span>
  );
}
