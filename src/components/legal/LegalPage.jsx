import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import LanguageSwitcher from '../LanguageSwitcher'
import FooterLegalLinks from './FooterLegalLinks'
import { LEGAL_DOCS, LEGAL_UPDATED } from '../../data/legal/docs'
import { legalUi, LEGAL_CONTACT, LEGAL_LINK as LINK } from '../../data/legal/ui'
import { LEGAL_PAGE_UI } from '../../data/legal/page'
import { spaClick } from '../../utils/siteRoutes'
import { formatDayMonthYear } from '../../utils/dateFormat'

/* ─────────────────────────────────────────────────────────────────────────────
   HÜQUQİ SƏHİFƏ — /mexfilik, /sertler, /geri-qaytarma (Phase 47)

   Mətn data/legal/<sənəd>/<dil>.js-dədir və ayrıca chunk kimi yüklənir:
   landing açan ziyarətçi bu mətnləri heç vaxt endirmir.
   Uzun oxu üçün: tək sütun ≤ 68 simvol, böyük sətir aralığı, bölmə başlıqları
   serif. Kiçik mətn rəngləri AA kontrastdan keçir (brown-dark 8:1, LINK 6:1).
   ───────────────────────────────────────────────────────────────────────── */

const loaders = import.meta.glob('../../data/legal/*/*.js')

function Body({ items }) {
  return items.map((b, i) => (typeof b === 'string'
    ? <p key={i} className="mt-4 first:mt-0">{b}</p>
    : (
      <ul key={i} className="mt-3 space-y-2 pl-5 list-disc marker:text-gold">
        {b.list.map((li) => <li key={li} className="pl-1">{li}</li>)}
      </ul>
    )))
}

export default function LegalPage({ doc, lang, setLang, onBack }) {
  const ui = { links: legalUi(lang).links, page: LEGAL_PAGE_UI[lang] || LEGAL_PAGE_UI.az }
  const key = `${doc}/${lang}`
  const [loaded, setLoaded] = useState({ key: null, text: null })
  const text = loaded.key === key ? loaded.text : null

  useEffect(() => {
    let alive = true
    const load = loaders[`../../data/legal/${doc}/${lang}.js`] || loaders[`../../data/legal/${doc}/az.js`]
    if (!load) return undefined
    load().then((m) => { if (alive) setLoaded({ key, text: m.default }) })
    return () => { alive = false }
  }, [doc, lang, key])

  /* /mexfilik#kuki — mətn gələndən sonra bölməyə sürüş */
  useEffect(() => {
    if (!text) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }, [text])

  const others = LEGAL_DOCS.filter((d) => d.id !== doc)

  return (
    <div className="min-h-screen bg-cream text-brown-dark">
      <header className="sticky top-0 z-40 bg-cream/92 backdrop-blur-md border-b border-beige-dark/35">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[13px] text-brown-dark bg-transparent border-0 cursor-pointer min-h-[44px] pr-2"
          >
            <ArrowLeft size={14} strokeWidth={1.6} />
            {ui.page.back}
          </button>
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20 sm:pt-12">
        {/* Üç sənəd arasında keçid — eyni ailənin səhifələridir */}
        <nav aria-label={ui.page.related} className="flex flex-wrap gap-2">
          {LEGAL_DOCS.map((d) => {
            const active = d.id === doc
            return (
              <a
                key={d.id} href={d.path} onClick={(e) => spaClick(e, d.path)}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 min-h-[40px] inline-flex items-center text-[13px] no-underline transition-colors duration-200 border ${
                  active ? 'bg-ink text-cream border-ink' : 'border-gold/45 text-brown-dark hover:border-gold hover:bg-white/60'
                }`}
              >
                {ui.links[d.id]}
              </a>
            )
          })}
        </nav>

        {!text ? (
          <p className="mt-16 text-[15px]" role="status">{ui.page.loading}</p>
        ) : (
          <div className="mt-10 sm:mt-14 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
            {/* Mündəricat — böyük ekranda yapışqan sol sütun, telefonda açılan siyahı */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <details className="group lg:hidden mb-8 border-y border-gold/30 py-3">
                <summary className="cursor-pointer text-[14px] text-ink min-h-[32px] flex items-center justify-between list-none">
                  {ui.page.contents}
                  <ChevronDown size={16} strokeWidth={1.6} className="transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <TocList sections={text.sections} />
              </details>
              <div className="hidden lg:block">
                <p className="font-serif text-[17px] text-ink mb-3">{ui.page.contents}</p>
                <TocList sections={text.sections} />
              </div>
            </aside>

            <article className="max-w-[68ch]">
              <h1 className="font-serif text-[clamp(32px,7vw,52px)] text-ink font-light leading-[1.08] tracking-[-0.01em]">
                {text.title}
              </h1>
              <div className="mt-5 h-px w-16 bg-gold" aria-hidden="true" />
              <p className="mt-4 font-serif italic text-[17px] text-brown-dark">
                {ui.page.updated}: {formatDayMonthYear(LEGAL_UPDATED, lang)}
              </p>
              {text.notice && (
                <p className="mt-5 text-[13.5px] leading-relaxed border-l-2 border-gold/60 pl-3">{text.notice}</p>
              )}

              <div className="mt-8 text-[15.5px] leading-[1.75]">
                <Body items={text.intro} />
              </div>

              {text.sections.map((s) => (
                <section key={s.id} id={s.id} className="mt-12" style={{ scrollMarginTop: 80 }}>
                  <h2 className="font-serif text-[clamp(22px,4.6vw,28px)] text-ink font-normal leading-snug">{s.title}</h2>
                  <div className="mt-3 text-[15.5px] leading-[1.75]">
                    <Body items={s.body} />
                  </div>
                </section>
              ))}

              <section className="mt-16 rounded-2xl bg-white/70 border border-gold/30 px-5 py-6 sm:px-7">
                <h2 className="font-serif text-[22px] text-ink">{ui.page.contact}</h2>
                <p className="mt-2 text-[15px] leading-relaxed">{ui.page.contactText}</p>
                <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                  <a href={`mailto:${LEGAL_CONTACT.email}`} style={{ color: LINK }} className="underline underline-offset-4">{LEGAL_CONTACT.email}</a>
                  <a href={LEGAL_CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: LINK }} className="underline underline-offset-4">
                    WhatsApp {LEGAL_CONTACT.phone}
                  </a>
                </p>
              </section>

              <nav aria-label={ui.page.related} className="mt-10">
                <p className="font-serif text-[19px] text-ink">{ui.page.related}</p>
                <ul className="mt-2 space-y-1.5">
                  {others.map((d) => (
                    <li key={d.id}>
                      <a href={d.path} onClick={(e) => spaClick(e, d.path)} style={{ color: LINK }} className="text-[15px] underline underline-offset-4">
                        {ui.links[d.id]}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </article>
          </div>
        )}
      </main>

      <footer className="border-t border-beige-dark/35 py-8 px-4">
        <FooterLegalLinks lang={lang} tone="light" />
        <p className="mt-4 text-center text-[12px]">© {new Date().getFullYear()} {LEGAL_CONTACT.brand}</p>
      </footer>
    </div>
  )
}

function TocList({ sections }) {
  return (
    <ol className="mt-2 space-y-1.5 text-[14px] leading-snug list-none p-0">
      {sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="text-brown-dark hover:text-ink no-underline hover:underline underline-offset-4 inline-block py-1">
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )
}
