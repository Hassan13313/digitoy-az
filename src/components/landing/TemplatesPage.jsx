import { useEffect, useMemo, useState } from 'react'
import { listTemplates, listTemplateFacets, isTemplateSelectable, getStatusMeta, getTemplateTheme, getCategoryLabel, groupTemplatesByConcept, templateConcepts, countTemplateCards, CONCEPT_META } from '../../templates/templateConfig'
import { ensureTemplateFonts } from '../../templates/fonts'
import { trackTemplatePreviewed } from '../../templates/templateAnalytics'
import LanguageSwitcher from '../LanguageSwitcher'
import SubpageHeader, { SubpageFooter } from '../public/SubpageHeader'
import { TemplatesIntro, FilterBar, TemplatesGrid, TemplateCard, TemplatesEmpty, TemplatesCta } from '../public/templates'
import { templateImage, templateImageSrcSet, TEMPLATE_IMAGE_SIZE } from '../../data/templateImages'
import { conceptPageFor, conceptAbout } from '../../data/conceptPages'
import { LEGAL_DOCS } from '../../data/legal/docs'
import { legalUi } from '../../data/legal/ui'
import { spaClick } from '../../utils/siteRoutes'
import { consent } from '../../utils/consent'

/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLONLAR SƏHİFƏSİ — /templates  (UI redesign 2026-10: public/templates.jsx)

   Müştəriyə ayrıca göndərilə bilən ictimai səhifə. Builder-dən ASILI DEYİL:
   paket seçmədən, forma doldurmadan açılır.

   ⚠ TƏK MƏNBƏ: bütün məlumat `templateConfig`-dən (`listTemplates()`) gəlir —
   ad, təsvir, status, theme rəngləri, önbaxış marşrutu. Builder-dəki
   `TemplateSelect.jsx` də eyni mənbəni oxuyur, ona görə yeni şablon əlavə
   ediləndə hər iki yer AVTOMATİK yenilənir. Kart şəkli: data/templateImages.js.
   ───────────────────────────────────────────────────────────────────────── */

const UI = {
  az: {
    kicker: 'Dizayn kolleksiyası',
    title: 'Dəvətnamə Şablonları',
    intro: 'Toy, nişan, xına gecəsi, ad günü, ildönümü, uşaq tədbirləri, korporativ və digər tədbirlər üçün online dəvətnamə şablonları. Əvvəlcə tədbirinizi seçin: hər tədbirin öz dizaynları var — rəng, şrift, animasiya və açılış ekranı fərqlidir.',
    preview: 'Önbaxış',
    back: 'Ana səhifə',
    cta: 'Dəvətnaməni hazırla',
    ctaTitle: 'Bəyəndiyiniz dizaynla başlayın',
    ctaText: 'Şablonu sifariş formasının ilk addımında da seçə və dəyişə bilərsiniz.',
    count: (v, t) => (v === t ? `${t} şablon` : `${v} / ${t} şablon`),
    filterStatus: 'Vəziyyət',
    filterCategory: 'Üslub',
    filterConcept: 'Tədbir',
    byEvent: 'Tədbirə görə şablonlar',
    all: 'Hamısı',
    reset: 'Filtri sıfırla',
    empty: 'Bu filtrə uyğun şablon tapılmadı.',
    locked: 'Kilidli',
    list: 'Şablonlar',
    rights: 'Bütün hüquqlar qorunur.',
    legalNav: 'Hüquqi sənədlər',
  },
  en: {
    kicker: 'Design collection',
    title: 'Invitation Templates',
    intro: 'Online invitation templates for weddings, engagements, henna nights, birthdays, anniversaries, kids’ events, corporate occasions and more. Start with your event: each one has its own designs, with different colours, type, motion and opening screens.',
    preview: 'Preview',
    back: 'Home',
    cta: 'Create your invitation',
    ctaTitle: 'Start with the design you love',
    ctaText: 'You can also choose and change the template in the first step of the order form.',
    count: (v, t) => (v === t ? `${t} templates` : `${v} / ${t} templates`),
    filterStatus: 'Status',
    filterCategory: 'Style',
    filterConcept: 'Event',
    byEvent: 'Templates by event',
    all: 'All',
    reset: 'Reset filters',
    empty: 'No templates match this filter.',
    locked: 'Locked',
    list: 'Templates',
    rights: 'All rights reserved.',
    legalNav: 'Legal documents',
  },
  ru: {
    kicker: 'Коллекция дизайнов',
    title: 'Шаблоны приглашений',
    intro: 'Шаблоны онлайн-приглашений на свадьбу, помолвку, вечер хны, день рождения, годовщину, детские и корпоративные события и не только. Начните с события: у каждого свои дизайны — цвета, шрифты, анимация и экран открытия.',
    preview: 'Просмотр',
    back: 'На главную',
    cta: 'Создать приглашение',
    ctaTitle: 'Начните с понравившегося дизайна',
    ctaText: 'Шаблон можно выбрать и изменить и на первом шаге формы заказа.',
    count: (v, t) => (v === t ? `${t} шаблонов` : `${v} / ${t} шаблонов`),
    filterStatus: 'Статус',
    filterCategory: 'Стиль',
    filterConcept: 'Событие',
    byEvent: 'Шаблоны по событиям',
    all: 'Все',
    reset: 'Сбросить фильтры',
    empty: 'Нет шаблонов по этому фильтру.',
    locked: 'Недоступен',
    list: 'Шаблоны',
    rights: 'Все права защищены.',
    legalNav: 'Правовые документы',
  },
}

/* Önbaxışdan qayıdış vəziyyətini oxu (bir dəfəlik — oxunan kimi silinir).
   `App.goBackFromPreview` bu açarı yazır. */
function readTemplatesRestore() {
  try {
    const raw = sessionStorage.getItem('digitoy_templates_restore')
    if (!raw) return null
    sessionStorage.removeItem('digitoy_templates_restore')
    return JSON.parse(raw)
  } catch { return null }
}

export default function TemplatesPage({ lang, setLang, onBack, onPreview, onCreate, initialConcept = null, onConceptChange }) {
  const ui = UI[lang] || UI.az
  /* `listTemplates()` disabled şablonları onsuz da süzür */
  const templates = listTemplates()

  /* Önbaxışdan qayıdış konteksti — bir dəfə oxunur (mount-dan ƏVVƏL, ona görə
     filtrlər ilk render-də düzgün gəlir və heç bir "sıçrayış" olmur). */
  const [restore] = useState(readTemplatesRestore)

  /* Filtr seçimləri — 'all' = filtrsiz */
  const [status, setStatus] = useState(restore?.status || 'all')
  const [category, setCategory] = useState(restore?.category || 'all')
  const [concept, setConceptState] = useState(initialConcept || restore?.concept || 'all')
  /* Tədbir seçimi URL-ə yazılır: /sablonlar/ad-gunu paylaşıla və indeksləşə bilir */
  const setConcept = (next) => {
    setConceptState(next)
    const slug = CONCEPT_META[next]?.slug
    try { window.history.replaceState(window.history.state, '', slug ? `/sablonlar/${slug}` : '/templates') } catch { /* köhnə brauzer */ }
    onConceptChange?.()
  }
  /* Brauzerin «geri»si URL-i dəyişəndə seçim də ona uyğunlaşır */
  const [urlConcept, setUrlConcept] = useState(initialConcept)
  if (urlConcept !== initialConcept) {
    setUrlConcept(initialConcept)
    setConceptState(initialConcept || 'all')
  }
  const page = conceptPageFor(concept)

  /* Çiplər mövcud şablonlardan hesablanır → boş filtr heç vaxt görünmür. */
  const facets = useMemo(() => listTemplateFacets(lang), [lang])

  const visible = useMemo(() => templates.filter((tpl) => (
    (status === 'all' || tpl.status === status) &&
    (category === 'all' || tpl.category === category) &&
    (concept === 'all' || templateConcepts(tpl).includes(concept))
  )), [templates, status, category, concept])

  /* «Hamısı»: hər tədbir öz başlıqlı bölməsində (Toy, Nişan, Uşaq ad günü…).
     Bir tədbir seçiləndə bölmə başlığı lazım deyil — tək şəbəkə qalır. */
  const groups = useMemo(() => (concept === 'all' ? groupTemplatesByConcept(visible, lang) : null), [concept, visible, lang])

  /* Bir dizayn iki bölmədədirsə iki kart görünür — saylar uyğun gəlsin */
  const totalCards = countTemplateCards(templates)
  const visibleCards = concept === 'all' ? countTemplateCards(visible) : visible.length

  /* Kart yer tutucuları şablon şriftlərini işlədə bilər — bu səhifədə yüklə */
  useEffect(() => { ensureTemplateFonts() }, [])

  /* Scroll mövqeyi — kartlar render olunandan sonra bərpa olunur */
  useEffect(() => {
    if (!restore?.scrollY) return
    const id = setTimeout(() => window.scrollTo({ top: restore.scrollY, behavior: 'auto' }), 60)
    return () => clearTimeout(id)
  }, [restore])

  /* Önbaxışdan qayıdanda səhifə eyni vəziyyətdə açılsın — filtrlər və scroll
     mövqeyi sessionStorage-a yazılır, mount-da geri oxunur. */
  const handlePreview = (tpl, tplConcept) => {
    trackTemplatePreviewed(tpl.id, { source: 'templates_page' })
    try {
      sessionStorage.setItem('digitoy_preview_return', JSON.stringify({
        origin: 'templates',
        templateId: tpl.id,
        scrollY: Math.round(window.scrollY),
        status, category, concept,
      }))
    } catch { /* private mode — vəziyyət bərpa olunmayacaq */ }
    onPreview(tpl, tplConcept)
  }

  const resetFilters = () => { setStatus('all'); setCategory('all'); setConcept('all') }

  /* Kart: tədbir bölmə başlığında / çipdədir, kartda üslub (Lüks, Vintage…) görünür.
     `eager` yalnız ilk görünən 3 şəkil üçün. */
  const renderCard = (tpl, i, groupIndex = 0, cardConcept = concept === 'all' ? tpl.concept : concept) => {
    const theme = getTemplateTheme(tpl.id) || {}
    const badge = getStatusMeta(tpl.status, lang)
    const image = templateImage(tpl.id, cardConcept) || undefined
    return (
      <TemplateCard
        lang={lang}
        name={tpl.name}
        statusLabel={badge.label}
        statusTone={badge.tone}
        categoryLabel={getCategoryLabel(tpl.category, lang)}
        description={tpl.shortDescription?.[lang] || tpl.shortDescription?.az || tpl.tagline}
        image={image}
        imageSrcSet={templateImageSrcSet(image)}
        imageWidth={TEMPLATE_IMAGE_SIZE.width}
        imageHeight={TEMPLATE_IMAGE_SIZE.height}
        /* Yalnız ilk kartın şəkli dərhal və yüksək prioritetlə (mobildə LCP-dir). 2-ci/3-cü kart mobildə
           ekrandan 600–1200px aşağıdadır — «eager» olanda LCP şəkli ilə trafik bölüşürdü; lazy şəkil
           ekrana yaxın olanda brauzer onsuz da CSS-dən dərhal sonra yükləyir. */
        loading={groupIndex === 0 && i === 0 ? 'eager' : 'lazy'}
        priority={groupIndex === 0 && i === 0}
        accent={theme.primary || '#C5A059'}
        background={theme.background || '#FDFBF7'}
        locked={!isTemplateSelectable(tpl.id)}
        lockedLabel={ui.locked}
        onPreview={() => handlePreview(tpl, cardConcept)}
        previewLabel={ui.preview}
      />
    )
  }

  const legal = legalUi(lang).links

  return (
    <div className="dt-site dt-page min-h-screen bg-cream">
      <SubpageHeader
        lang={lang}
        backLabel={ui.back}
        onBack={(e) => { e?.preventDefault?.(); onBack() }}
        languageSwitcher={<LanguageSwitcher lang={lang} setLang={setLang} />}
      />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <TemplatesIntro lang={lang} eyebrow={ui.kicker} title={page?.h1[lang] || page?.h1.az || ui.title} text={page?.intro[lang] || page?.intro.az || ui.intro} />

        <div className="mt-8">
          <FilterBar
            lang={lang}
            statuses={facets.statuses.length > 1 ? [{ id: 'all', label: ui.all, count: totalCards }, ...facets.statuses] : []}
            categories={[{ id: 'all', label: ui.all, count: totalCards }, ...facets.categories]}
            concepts={[{ id: 'all', label: ui.all, count: totalCards }, ...facets.concepts]}
            status={status}
            category={category}
            concept={concept}
            onStatus={setStatus}
            onCategory={setCategory}
            onConcept={setConcept}
            total={totalCards}
            visibleCount={visibleCards}
            onReset={resetFilters}
            statusLegend={ui.filterStatus}
            categoryLegend={ui.filterCategory}
            conceptLegend={ui.filterConcept}
            resetLabel={ui.reset}
            formatCount={ui.count}
            bleedClassName="-mx-4 px-4 sm:mx-0 sm:px-0"
          />
        </div>

        {visible.length > 0 && groups ? (
          <div className="mt-8 space-y-14 sm:space-y-16">
            {groups.map((g, gi) => (
              <section key={g.id} aria-labelledby={`tpl-concept-${g.id}`}>
                <div className="flex items-end justify-between gap-4 border-b border-beige-dark pb-3">
                  <h2 id={`tpl-concept-${g.id}`} className="font-serif text-[1.85rem] font-medium leading-tight text-ink sm:text-[2.25rem]">
                    {g.label}
                  </h2>
                  <span className="shrink-0 pb-1 text-[13px] text-brown-muted">{ui.count(g.items.length, g.items.length)}</span>
                </div>
                <div className="mt-6">
                  <TemplatesGrid label={g.label} items={g.items} getKey={(tpl) => tpl.id} renderItem={(tpl, i) => renderCard(tpl, i, gi, g.id)} />
                </div>
              </section>
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="mt-8">
            <TemplatesGrid label={ui.list} items={visible} getKey={(tpl) => tpl.id} renderItem={renderCard} />
          </div>
        ) : (
          <div className="mt-8">
            <TemplatesEmpty lang={lang} title={ui.empty} resetLabel={ui.reset} onReset={resetFilters} />
          </div>
        )}

        <nav aria-label={ui.filterConcept} className="mt-14 border-t border-beige-dark pt-6 sm:mt-20">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.18em] text-brown-muted">{ui.byEvent}</h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {facets.concepts.map((c) => (
              <li key={c.id}>
                <a
                  href={`/sablonlar/${CONCEPT_META[c.id].slug}`}
                  onClick={(e) => { e.preventDefault(); setConcept(c.id); window.scrollTo({ top: 0 }) }}
                  aria-current={concept === c.id ? 'page' : undefined}
                  className="inline-block py-1 text-[15px] text-brown-dark underline decoration-beige-dark underline-offset-4 hover:text-ink"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {page && <ConceptAbout about={conceptAbout(page, lang)} lang={lang} />}

        <div className="mt-14 sm:mt-20">
          <TemplatesCta lang={lang} title={ui.ctaTitle} text={ui.ctaText} buttonLabel={ui.cta} onCreate={onCreate} />
        </div>
      </main>

      <SubpageFooter
        lang={lang}
        navLabel={ui.legalNav}
        links={LEGAL_DOCS.map((d) => ({ href: d.path, label: legal[d.id] }))}
        onNavigate={(e, href) => spaClick(e, href)}
        action={{ label: legal.cookies, onClick: () => consent.openSettings() }}
        copyright={`© ${new Date().getFullYear()} Digitoy.az. ${ui.rights}`}
      />
    </div>
  )
}

/* 2026-11 SEO — tədbir səhifəsinin «Necə işləyir» və sualları (bax conceptPages.js › conceptAbout) */
function ConceptAbout({ about, lang }) {
  if (!about) return null
  const faqTitle = { az: 'Tez-tez verilən suallar', en: 'Frequently asked questions', ru: 'Частые вопросы' }[lang] || 'Tez-tez verilən suallar'
  return (
    <section lang={lang} className="mx-auto mt-14 max-w-3xl sm:mt-20">
      <h2 className="font-serif text-[28px] leading-tight text-ink sm:text-[34px]">{about.title}</h2>
      <ol className="mt-5 space-y-3 text-[15px] leading-relaxed text-brown-dark">
        {about.steps.map((t, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-espresso text-[12px] font-semibold text-cream">{i + 1}</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[15px] leading-relaxed text-brown-dark">{about.features}</p>
      <h2 className="mt-10 font-serif text-[24px] leading-tight text-ink sm:text-[28px]">{faqTitle}</h2>
      <dl className="mt-4 space-y-4">
        {about.faq.map(([q, a]) => (
          <div key={q}>
            <dt className="text-[15px] font-semibold text-ink">{q}</dt>
            <dd className="mt-1 text-[15px] leading-relaxed text-brown-dark">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
