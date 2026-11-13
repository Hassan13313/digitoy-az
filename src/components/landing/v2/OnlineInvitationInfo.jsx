// ════════════════════════════════════════════════════════════════
// «Online dəvətnamə nədir?» — ana səhifənin izah bölməsi (2026-11-14, SEO)
// Mətn: data/homeSeo.js (3 dil). Tədbir səhifələrinə (/sablonlar/*) və
// bələdçilərə açar sözlü daxili linklər — Google həm mövzunu, həm də
// saytın quruluşunu buradan oxuyur.
// ════════════════════════════════════════════════════════════════
import { HOME_SEO } from '../../../data/homeSeo';
import { CONCEPT_PAGES } from '../../../data/conceptPages';
import { CONCEPT_META } from '../../../templates/templateConfig';
import { GUIDES } from '../../../data/guides';
import { spaClick } from '../../../utils/siteRoutes';
import { Container, SectionHeading } from './ui';

/* mobildə iki sütun (tam enli), sm+ sərbəst sıra */
const LIST = 'mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2.5';
const PILL =
  'flex h-full min-h-10 w-full items-center justify-center rounded-full border border-gold/35 bg-white/60 px-3 py-2 text-center text-[12.5px] leading-snug sm:inline-flex sm:w-auto sm:px-4 sm:text-[13.5px] text-brown-dark transition-colors duration-300 hover:border-gold hover:bg-gold-mist/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream';
const LIST_TITLE = 'text-center font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep';

export default function OnlineInvitationInfo({ lang = 'az' }) {
  const c = HOME_SEO[lang] || HOME_SEO.az;
  const events = Object.entries(CONCEPT_META).map(([key, m]) => ({
    key,
    href: `/sablonlar/${m.slug}`,
    label: CONCEPT_PAGES[key]?.h1?.[lang] || CONCEPT_PAGES[key]?.h1?.az || m[lang] || m.az,
  }));

  return (
    <section id="online-devetname" aria-labelledby="online-devetname-title" className="relative bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} id="online-devetname-title" />
        <p className="mx-auto mt-8 max-w-3xl text-center text-[15px] leading-[1.8] text-brown-dark sm:text-base">{c.intro}</p>

        <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-3 md:gap-6">
          {c.blocks.map((b) => (
            <article key={b.title} className="rounded-[24px] bg-white/70 p-6 shadow-soft ring-1 ring-gold/15 sm:p-7">
              <h3 className="font-serif text-[1.55rem] font-medium leading-tight text-ink">{b.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.75] text-brown-dark">{b.text}</p>
            </article>
          ))}
        </div>

        <nav aria-labelledby="online-devetname-events" className="mt-14">
          <h3 id="online-devetname-events" className={LIST_TITLE}>{c.eventsTitle}</h3>
          <ul className={LIST}>
            {events.map((e) => (
              <li key={e.key}>
                <a href={e.href} onClick={(ev) => spaClick(ev, e.href)} className={PILL}>{e.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="online-devetname-guides" className="mt-10">
          <h3 id="online-devetname-guides" className={LIST_TITLE}>{c.guidesTitle}</h3>
          <ul className={LIST}>
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <a href={`/${g.slug}`} lang="az" onClick={(ev) => spaClick(ev, `/${g.slug}`)} className={PILL}>{g.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
