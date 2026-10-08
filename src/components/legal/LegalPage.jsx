import { useEffect, useRef, useState } from 'react'
import LanguageSwitcher from '../LanguageSwitcher'
import SubpageHeader, { SubpageFooter } from '../public/SubpageHeader'
import { LegalDocTabs, LegalToc, LegalArticle, LegalContactCard, LegalRelated, ReadingProgress } from '../public/legal'
import { useActiveSection, useReadingProgress } from '../public/hooks'
import { LEGAL_DOCS, LEGAL_UPDATED } from '../../data/legal/docs'
import { legalUi, LEGAL_CONTACT } from '../../data/legal/ui'
import { LEGAL_PAGE_UI } from '../../data/legal/page'
import { spaClick } from '../../utils/siteRoutes'
import { formatDayMonthYear } from '../../utils/dateFormat'
import { consent } from '../../utils/consent'

/* ─────────────────────────────────────────────────────────────────────────────
   HÜQUQİ SƏHİFƏ — /mexfilik, /sertler, /geri-qaytarma (Phase 47 məntiqi ·
   UI redesign 2026-10 görünüşü: public/legal.jsx)

   Mətn data/legal/<sənəd>/<dil>.js-dədir və ayrıca chunk kimi yüklənir:
   landing açan ziyarətçi bu mətnləri heç vaxt endirmir.
   Uzun oxu üçün: tək sütun ≤ 68 simvol, böyük sətir aralığı, bölmə başlıqları
   serif; aktiv bölmə mündəricatda vurğulanır, yuxarıda oxu zolağı.
   ───────────────────────────────────────────────────────────────────────── */

const loaders = import.meta.glob('../../data/legal/*/*.js')

/* Yeni görünüşün əlavə etiketləri (LEGAL_PAGE_UI testlə bağlıdır — ona toxunmuruq) */
const EXTRA = {
  az: { tabs: 'Hüquqi sənədlər', notice: 'Qeyd', email: 'E-poçt', rights: 'Bütün hüquqlar qorunur.' },
  en: { tabs: 'Legal documents', notice: 'Note', email: 'Email', rights: 'All rights reserved.' },
  ru: { tabs: 'Правовые документы', notice: 'Примечание', email: 'Эл. почта', rights: 'Все права защищены.' },
}

export default function LegalPage({ doc, lang, setLang, onBack }) {
  const ui = { links: legalUi(lang).links, page: LEGAL_PAGE_UI[lang] || LEGAL_PAGE_UI.az }
  const extra = EXTRA[lang] || EXTRA.az
  const key = `${doc}/${lang}`
  const [loaded, setLoaded] = useState({ key: null, text: null })
  const text = loaded.key === key ? loaded.text : null
  const articleRef = useRef(null)

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

  const sectionIds = text ? text.sections.map((s) => s.id) : []
  const activeId = useActiveSection(sectionIds)
  const progress = useReadingProgress(articleRef)

  const current = LEGAL_DOCS.find((d) => d.id === doc)
  const tabs = LEGAL_DOCS.map((d) => ({ href: d.path, label: ui.links[d.id] }))
  const others = LEGAL_DOCS.filter((d) => d.id !== doc).map((d) => ({ href: d.path, label: ui.links[d.id] }))
  const nav = (e, href) => spaClick(e, href)

  return (
    <div className="dt-site dt-page min-h-screen bg-cream text-brown-dark">
      <SubpageHeader
        lang={lang}
        backLabel={ui.page.back}
        onBack={(e) => { e?.preventDefault?.(); onBack() }}
        languageSwitcher={<LanguageSwitcher lang={lang} setLang={setLang} />}
        progress={text ? <ReadingProgress value={progress} /> : null}
      />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        {/* Üç sənəd arasında keçid — eyni ailənin səhifələridir */}
        <LegalDocTabs lang={lang} docs={tabs} currentHref={current?.path} onNavigate={nav} label={extra.tabs} />

        {!text ? (
          <p className="mt-16 text-[15px]" role="status">{ui.page.loading}</p>
        ) : (
          <div className="mt-10 sm:mt-14 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <LegalToc lang={lang} sections={text.sections} activeId={activeId} title={ui.page.contents} mobileClassName="mb-8" />
            </aside>

            <div className="min-w-0">
              <LegalArticle
                lang={lang}
                doc={text}
                articleRef={articleRef}
                updatedLabel={`${ui.page.updated}:`}
                updatedAt={formatDayMonthYear(LEGAL_UPDATED, lang)}
                updatedIso={LEGAL_UPDATED}
                noticeLabel={extra.notice}
              />

              <div className="mt-16 max-w-[68ch] space-y-10">
                <LegalContactCard
                  lang={lang}
                  title={ui.page.contact}
                  text={ui.page.contactText}
                  email={LEGAL_CONTACT.email}
                  emailLabel={extra.email}
                  whatsappUrl={LEGAL_CONTACT.whatsapp}
                  whatsappLabel={`WhatsApp ${LEGAL_CONTACT.phone}`}
                />
                <LegalRelated lang={lang} title={ui.page.related} items={others} onNavigate={nav} />
              </div>
            </div>
          </div>
        )}
      </main>

      <SubpageFooter
        lang={lang}
        navLabel={extra.tabs}
        links={tabs}
        onNavigate={nav}
        action={{ label: ui.links.cookies, onClick: () => consent.openSettings() }}
        copyright={`© ${new Date().getFullYear()} ${LEGAL_CONTACT.brand}. ${extra.rights}`}
      />
    </div>
  )
}
