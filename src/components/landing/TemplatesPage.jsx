import { useEffect, useMemo, useState } from 'react'
import { listTemplates, listTemplateFacets, isTemplateSelectable, getStatusMeta, getTemplateTheme, getCategoryLabel, groupTemplatesByConcept } from '../../templates/templateConfig'
import { ensureTemplateFonts } from '../../templates/fonts'
import { trackTemplatePreviewed } from '../../templates/templateAnalytics'
import LanguageSwitcher from '../LanguageSwitcher'
import SubpageHeader, { SubpageFooter } from '../public/SubpageHeader'
import { TemplatesIntro, FilterBar, TemplatesGrid, TemplateCard, TemplatesEmpty, TemplatesCta } from '../public/templates'
import { templateImage, TEMPLATE_IMAGE_SIZE } from '../../data/templateImages'
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
    intro: 'Toy, nişan, ad günü və uşaq ad günü üçün online dəvətnamə şablonları. Əvvəlcə tədbirinizi seçin: hər tədbirin öz dizaynları var — rəng, şrift, animasiya və açılış ekranı fərqlidir.',
    preview: 'Önbaxış',
    back: 'Ana səhifə',
    cta: 'Dəvətnaməni hazırla',
    ctaTitle: 'Bəyəndiyiniz dizaynla başlayın',
    ctaText: 'Şablonu sifariş formasının ilk addımında da seçə və dəyişə bilərsiniz.',
    count: (v, t) => (v === t ? `${t} şablon` : `${v} / ${t} şablon`),
    filterStatus: 'Vəziyyət',
    filterCategory: 'Üslub',
    filterConcept: 'Tədbir',
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
    intro: 'Online invitation templates for weddings, engagements, birthdays and kids’ parties. Start with your event: each one has its own designs, with different colours, type, motion and opening screens.',
    preview: 'Preview',
    back: 'Home',
    cta: 'Create your invitation',
    ctaTitle: 'Start with the design you love',
    ctaText: 'You can also choose and change the template in the first step of the order form.',
    count: (v, t) => (v === t ? `${t} templates` : `${v} / ${t} templates`),
    filterStatus: 'Status',
    filterCategory: 'Style',
    filterConcept: 'Event',
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
    intro: 'Шаблоны онлайн-приглашений на свадьбу, помолвку, день рождения и детский праздник. Начните с события: у каждого свои дизайны — цвета, шрифты, анимация и экран открытия.',
    preview: 'Просмотр',
    back: 'На главную',
    cta: 'Создать приглашение',
    ctaTitle: 'Начните с понравившегося дизайна',
    ctaText: 'Шаблон можно выбрать и изменить и на первом шаге формы заказа.',
    count: (v, t) => (v === t ? `${t} шаблонов` : `${v} / ${t} шаблонов`),
    filterStatus: 'Статус',
    filterCategory: 'Стиль',
    filterConcept: 'Событие',
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

export default function TemplatesPage({ lang, setLang, onBack, onPreview, onCreate }) {
  const ui = UI[lang] || UI.az
  /* `listTemplates()` disabled şablonları onsuz da süzür */
  const templates = listTemplates()

  /* Önbaxışdan qayıdış konteksti — bir dəfə oxunur (mount-dan ƏVVƏL, ona görə
     filtrlər ilk render-də düzgün gəlir və heç bir "sıçrayış" olmur). */
  const [restore] = useState(readTemplatesRestore)

  /* Filtr seçimləri — 'all' = filtrsiz */
  const [status, setStatus] = useState(restore?.status || 'all')
  const [category, setCategory] = useState(restore?.category || 'all')
  const [concept, setConcept] = useState(restore?.concept || 'all')

  /* Çiplər mövcud şablonlardan hesablanır → boş filtr heç vaxt görünmür. */
  const facets = useMemo(() => listTemplateFacets(lang), [lang])

  const visible = useMemo(() => templates.filter((tpl) => (
    (status === 'all' || tpl.status === status) &&
    (category === 'all' || tpl.category === category) &&
    (concept === 'all' || tpl.concept === concept)
  )), [templates, status, category, concept])

  /* «Hamısı»: hər tədbir öz başlıqlı bölməsində (Toy, Nişan, Uşaq ad günü…).
     Bir tədbir seçiləndə bölmə başlığı lazım deyil — tək şəbəkə qalır. */
  const groups = useMemo(() => (concept === 'all' ? groupTemplatesByConcept(visible, lang) : null), [concept, visible, lang])

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
  const handlePreview = (tpl) => {
    trackTemplatePreviewed(tpl.id, { source: 'templates_page' })
    try {
      sessionStorage.setItem('digitoy_preview_return', JSON.stringify({
        origin: 'templates',
        templateId: tpl.id,
        scrollY: Math.round(window.scrollY),
        status, category, concept,
      }))
    } catch { /* private mode — vəziyyət bərpa olunmayacaq */ }
    onPreview(tpl)
  }

  const resetFilters = () => { setStatus('all'); setCategory('all'); setConcept('all') }

  /* Kart: tədbir bölmə başlığında / çipdədir, kartda üslub (Lüks, Vintage…) görünür.
     `eager` yalnız ilk görünən 3 şəkil üçün. */
  const renderCard = (tpl, i, groupIndex = 0) => {
    const theme = getTemplateTheme(tpl.id) || {}
    const badge = getStatusMeta(tpl.status, lang)
    return (
      <TemplateCard
        lang={lang}
        name={tpl.name}
        statusLabel={badge.label}
        statusTone={badge.tone}
        categoryLabel={getCategoryLabel(tpl.category, lang)}
        description={tpl.shortDescription?.[lang] || tpl.shortDescription?.az || tpl.tagline}
        image={templateImage(tpl.id) || undefined}
        imageWidth={TEMPLATE_IMAGE_SIZE.width}
        imageHeight={TEMPLATE_IMAGE_SIZE.height}
        loading={groupIndex === 0 && i < 3 ? 'eager' : 'lazy'}
        accent={theme.primary || '#C5A059'}
        background={theme.background || '#FDFBF7'}
        locked={!isTemplateSelectable(tpl.id)}
        lockedLabel={ui.locked}
        onPreview={() => handlePreview(tpl)}
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
        <TemplatesIntro lang={lang} eyebrow={ui.kicker} title={ui.title} text={ui.intro} />

        <div className="mt-8">
          <FilterBar
            lang={lang}
            statuses={[{ id: 'all', label: ui.all, count: templates.length }, ...facets.statuses]}
            categories={[{ id: 'all', label: ui.all, count: templates.length }, ...facets.categories]}
            concepts={[{ id: 'all', label: ui.all, count: templates.length }, ...facets.concepts]}
            status={status}
            category={category}
            concept={concept}
            onStatus={setStatus}
            onCategory={setCategory}
            onConcept={setConcept}
            total={templates.length}
            visibleCount={visible.length}
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
                  <TemplatesGrid label={g.label} items={g.items} getKey={(tpl) => tpl.id} renderItem={(tpl, i) => renderCard(tpl, i, gi)} />
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
