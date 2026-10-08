import { useEffect, useMemo, useState } from 'react'
import { listTemplates, listTemplateFacets, isTemplateSelectable, getStatusMeta, getTemplateTheme, getCategoryLabel } from '../../templates/templateConfig'
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
    intro: 'Hər şablon ayrıca dizayn dilidir — rəng, şrift, animasiya və açılış ekranı fərqlidir. Bəyəndiyinizi seçin, məlumatlarınız eyni qalır.',
    preview: 'Önbaxış',
    back: 'Ana səhifə',
    cta: 'Dəvətnaməni hazırla',
    ctaTitle: 'Bəyəndiyiniz dizaynla başlayın',
    ctaText: 'Şablonu sifariş formasının ilk addımında da seçə və dəyişə bilərsiniz.',
    count: (v, t) => (v === t ? `${t} şablon` : `${v} / ${t} şablon`),
    filterStatus: 'Vəziyyət',
    filterCategory: 'Kateqoriya',
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
    intro: 'Each template is its own design language — colours, type, motion and opening screen all differ. Pick the one you like; your details stay the same.',
    preview: 'Preview',
    back: 'Home',
    cta: 'Create your invitation',
    ctaTitle: 'Start with the design you love',
    ctaText: 'You can also choose and change the template in the first step of the order form.',
    count: (v, t) => (v === t ? `${t} templates` : `${v} / ${t} templates`),
    filterStatus: 'Status',
    filterCategory: 'Category',
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
    intro: 'Каждый шаблон — отдельный язык дизайна: цвета, шрифты, анимация и экран открытия. Выберите понравившийся, ваши данные останутся теми же.',
    preview: 'Просмотр',
    back: 'На главную',
    cta: 'Создать приглашение',
    ctaTitle: 'Начните с понравившегося дизайна',
    ctaText: 'Шаблон можно выбрать и изменить и на первом шаге формы заказа.',
    count: (v, t) => (v === t ? `${t} шаблонов` : `${v} / ${t} шаблонов`),
    filterStatus: 'Статус',
    filterCategory: 'Категория',
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

  /* Çiplər mövcud şablonlardan hesablanır → boş filtr heç vaxt görünmür. */
  const facets = useMemo(() => listTemplateFacets(lang), [lang])

  const visible = useMemo(() => templates.filter((tpl) => (
    (status === 'all' || tpl.status === status) &&
    (category === 'all' || tpl.category === category)
  )), [templates, status, category])

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
        status, category,
      }))
    } catch { /* private mode — vəziyyət bərpa olunmayacaq */ }
    onPreview(tpl)
  }

  const resetFilters = () => { setStatus('all'); setCategory('all') }
  const legal = legalUi(lang).links

  return (
    <div className="dt-site min-h-screen bg-cream">
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
            status={status}
            category={category}
            onStatus={setStatus}
            onCategory={setCategory}
            total={templates.length}
            visibleCount={visible.length}
            onReset={resetFilters}
            statusLegend={ui.filterStatus}
            categoryLegend={ui.filterCategory}
            resetLabel={ui.reset}
            formatCount={ui.count}
            bleedClassName="-mx-4 px-4 sm:mx-0 sm:px-0"
          />
        </div>

        {visible.length > 0 ? (
          <div className="mt-8">
            <TemplatesGrid
              label={ui.list}
              items={visible}
              getKey={(tpl) => tpl.id}
              renderItem={(tpl, i) => {
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
                    loading={i < 3 ? 'eager' : 'lazy'}
                    accent={theme.primary || '#C5A059'}
                    background={theme.background || '#FDFBF7'}
                    locked={!isTemplateSelectable(tpl.id)}
                    lockedLabel={ui.locked}
                    onPreview={() => handlePreview(tpl)}
                    previewLabel={ui.preview}
                  />
                )
              }}
            />
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
