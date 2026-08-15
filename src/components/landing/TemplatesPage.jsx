import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Eye, Lock } from 'lucide-react'
import { listTemplates, listTemplateFacets, isTemplateSelectable, getStatusMeta, getTemplateTheme } from '../../templates/templateConfig'
import { ensureTemplateFonts } from '../../templates/fonts'
import { trackTemplatePreviewed } from '../../templates/templateAnalytics'
import LanguageSwitcher from '../LanguageSwitcher'

/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLONLAR SƏHİFƏSİ — /templates

   Müştəriyə ayrıca göndərilə bilən ictimai səhifə. Builder-dən ASILI DEYİL:
   paket seçmədən, forma doldurmadan açılır.

   ⚠ TƏK MƏNBƏ: bütün məlumat `templateConfig`-dən (`listTemplates()`) gəlir —
   ad, təsvir, status, theme rəngləri, önbaxış marşrutu. Builder-dəki
   `TemplateSelect.jsx` də eyni mənbəni oxuyur, ona görə yeni şablon əlavə
   ediləndə hər iki yer AVTOMATİK yenilənir. Burada heç bir siyahı
   kopyalanmır.
   ───────────────────────────────────────────────────────────────────────── */

const UI = {
  az: {
    kicker: 'Dizayn kolleksiyası',
    title: 'Dəvətnamə Şablonları',
    intro: 'Hər şablon ayrıca dizayn dilidir — rəng, şrift, animasiya və açılış ekranı fərqlidir. Bəyəndiyinizi seçin, məlumatlarınız eyni qalır.',
    preview: 'Önbaxış',
    back: 'Ana səhifə',
    cta: 'Dəvətnaməni hazırla',
    count: (n) => `${n} şablon`,
    filterStatus: 'Vəziyyət',
    filterCategory: 'Kateqoriya',
    all: 'Hamısı',
    reset: 'Filtri sıfırla',
    empty: 'Bu filtrə uyğun şablon tapılmadı.',
  },
  en: {
    kicker: 'Design collection',
    title: 'Invitation Templates',
    intro: 'Each template is its own design language — colours, type, motion and opening screen all differ. Pick the one you like; your details stay the same.',
    preview: 'Preview',
    back: 'Home',
    cta: 'Create your invitation',
    count: (n) => `${n} templates`,
    filterStatus: 'Status',
    filterCategory: 'Category',
    all: 'All',
    reset: 'Reset filters',
    empty: 'No templates match this filter.',
  },
  ru: {
    kicker: 'Коллекция дизайнов',
    title: 'Шаблоны приглашений',
    intro: 'Каждый шаблон — отдельный язык дизайна: цвета, шрифты, анимация и экран открытия. Выберите понравившийся, ваши данные останутся теми же.',
    preview: 'Просмотр',
    back: 'На главную',
    cta: 'Создать приглашение',
    count: (n) => `${n} шаблонов`,
    filterStatus: 'Статус',
    filterCategory: 'Категория',
    all: 'Все',
    reset: 'Сбросить фильтры',
    empty: 'Нет шаблонов по этому фильтру.',
  },
}

/* Status nişanı — rəng tonu `getStatusMeta` metasından gəlir */
function StatusBadge({ badge }) {
  const tone = {
    positive: 'text-emerald-700/80 bg-emerald-600/10 border-emerald-600/20',
    info:     'text-sky-700/80 bg-sky-600/10 border-sky-600/20',
    muted:    'text-brown-muted/70 bg-brown-muted/10 border-brown-muted/20',
  }[badge.tone] || 'text-brown-muted/70 bg-brown-muted/10 border-brown-muted/20'

  return (
    <span className={`inline-block text-[9px] tracking-[0.16em] uppercase font-sans font-semibold px-2 py-[3px] rounded-full border ${tone}`}>
      {badge.label}
    </span>
  )
}

/* Şablonun öz theme token-lərindən qurulan önbaxış kartı.
   Thumbnail üçün ayrıca şəkil saxlanmır — rənglər config-dən gəlir, yəni
   yeni şablonun kartı əlavə iş olmadan düzgün görünür. */
function TemplateCard({ tpl, lang, ui, onPreview }) {
  const theme = getTemplateTheme(tpl.id)
  const badge = getStatusMeta(tpl.status, lang)
  const available = isTemplateSelectable(tpl.id)

  return (
    <article className="rounded-2xl overflow-hidden border border-beige-dark/40 bg-white shadow-[0_2px_16px_rgba(26,20,12,0.05)] flex flex-col">
      {/* Vizual — şablonun palitrası + tipoqrafiyası */}
      <div
        className="relative aspect-[4/5] flex flex-col items-center justify-center text-center px-5"
        style={{ background: theme.background }}
      >
        <span
          className="absolute inset-[10px] pointer-events-none"
          style={{ border: `1px solid ${theme.primary}33` }}
        />
        <span
          style={{
            fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase',
            color: theme.primary, marginBottom: 12, fontFamily: theme.fonts?.body,
          }}
        >
          {tpl.tagline?.split('·')[0]?.trim() || badge.label}
        </span>
        <span
          style={{
            fontFamily: theme.fonts?.heading, fontSize: 26, lineHeight: 1.25,
            color: theme.text,
          }}
        >
          Nigar<br />&amp; Rauf
        </span>
        <span style={{ width: 28, height: 1, background: theme.primary, margin: '12px 0' }} />
        <span
          style={{
            fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
            color: theme.muted, fontFamily: theme.fonts?.body,
          }}
        >
          12.07.2026
        </span>

        {!available && (
          <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/45 flex items-center justify-center">
            <Lock size={12} strokeWidth={1.6} className="text-white/90" />
          </span>
        )}
      </div>

      {/* Metadata — hamısı templateConfig-dən */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-serif text-[17px] text-ink leading-tight">{tpl.name}</h3>
          <StatusBadge badge={badge} />
        </div>
        <p className="text-[12.5px] text-brown-dark/75 leading-relaxed flex-1">
          {tpl.shortDescription?.[lang] || tpl.shortDescription?.az || tpl.tagline}
        </p>
        <button
          onClick={() => onPreview(tpl)}
          className="mt-1 inline-flex items-center justify-center gap-2 w-full min-h-[44px] rounded-full border border-gold/45 text-gold text-[11px] tracking-[0.14em] uppercase font-sans font-semibold bg-transparent cursor-pointer hover:bg-gold/8 transition-colors"
        >
          <Eye size={13} strokeWidth={1.6} />
          {ui.preview}
        </button>
      </div>
    </article>
  )
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

/* Filtr çipi — status və kateqoriya sətirlərində eyni komponent */
function Chip({ active, label, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-full border text-[11px] tracking-[0.1em] uppercase font-sans font-semibold cursor-pointer transition-colors ${
        active
          ? 'bg-gold text-white border-gold'
          : 'bg-transparent text-brown-dark/75 border-beige-dark/60 hover:border-gold/50'
      }`}
    >
      {label}
      {count != null && (
        <span className={active ? 'text-white/75' : 'text-brown-muted/60'}>{count}</span>
      )}
    </button>
  )
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

  /* Çiplər mövcud şablonlardan hesablanır → boş filtr heç vaxt görünmür.
     20+ şablonda da əl ilə siyahı saxlamaq lazım gəlmir. */
  const facets = useMemo(() => listTemplateFacets(lang), [lang])

  const visible = useMemo(() => templates.filter((tpl) => (
    (status === 'all' || tpl.status === status) &&
    (category === 'all' || tpl.category === category)
  )), [templates, status, category])

  const isFiltered = status !== 'all' || category !== 'all'

  /* Kartlar şablon şriftlərini işlədir — bu səhifədə lazım olduğu üçün yüklə */
  useEffect(() => { ensureTemplateFonts() }, [])

  /* Scroll mövqeyi — kartlar render olunandan sonra bərpa olunur */
  useEffect(() => {
    if (!restore?.scrollY) return
    const id = setTimeout(() => window.scrollTo({ top: restore.scrollY, behavior: 'auto' }), 60)
    return () => clearTimeout(id)
  }, [restore])

  /* Önbaxışdan qayıdanda səhifə eyni vəziyyətdə açılsın — filtrlər və scroll
     mövqeyi sessionStorage-a yazılır, mount-da geri oxunur (aşağıdakı effect). */
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


  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 bg-cream/92 backdrop-blur-md border-b border-beige-dark/35">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[12px] text-brown-dark/80 bg-transparent border-0 cursor-pointer min-h-[44px] pr-2"
          >
            <ArrowLeft size={14} strokeWidth={1.6} />
            {ui.back}
          </button>
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <p className="text-[10px] tracking-[0.24em] uppercase text-gold font-sans font-semibold">
          {ui.kicker}
        </p>
        <h1 className="font-serif text-[clamp(28px,7vw,44px)] text-ink font-light leading-tight mt-3">
          {ui.title}
        </h1>
        <p className="text-[14px] text-brown-dark/75 leading-[1.8] max-w-xl mt-4">
          {ui.intro}
        </p>
        {/* ── FİLTRLƏR ──────────────────────────────────────────────────────
            İki müstəqil sətir: status və kateqoriya. Mobil ekranda üfüqi
            sürüşür (`overflow-x-auto`), ona görə 20+ kateqoriyada da səhifə
            eninə daşmır. */}
        <div className="mt-8 space-y-3">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-brown-muted/70 font-sans mb-2">
              {ui.filterStatus}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              <Chip active={status === 'all'} label={ui.all} count={templates.length} onClick={() => setStatus('all')} />
              {facets.statuses.map((s) => (
                <Chip key={s.id} active={status === s.id} label={s.label} count={s.count} onClick={() => setStatus(s.id)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-brown-muted/70 font-sans mb-2">
              {ui.filterCategory}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              <Chip active={category === 'all'} label={ui.all} count={templates.length} onClick={() => setCategory('all')} />
              {facets.categories.map((c) => (
                <Chip key={c.id} active={category === c.id} label={c.label} count={c.count} onClick={() => setCategory(c.id)} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap mt-6">
          <p className="text-[11px] tracking-[0.16em] uppercase text-brown-muted font-sans">
            {ui.count(visible.length)}
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={() => { setStatus('all'); setCategory('all') }}
              className="text-[11px] tracking-[0.1em] uppercase font-sans text-gold bg-transparent border-0 cursor-pointer underline underline-offset-4 min-h-[38px]"
            >
              {ui.reset}
            </button>
          )}
        </div>

        {visible.length > 0 ? (
          <div className="grid gap-5 sm:gap-6 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((tpl) => (
              <TemplateCard key={tpl.id} tpl={tpl} lang={lang} ui={ui} onPreview={handlePreview} />
            ))}
          </div>
        ) : (
          <div className="mt-8 py-14 text-center border border-dashed border-beige-dark/60 rounded-2xl">
            <p className="text-[14px] text-brown-dark/70">{ui.empty}</p>
            <button
              type="button"
              onClick={() => { setStatus('all'); setCategory('all') }}
              className="mt-4 inline-flex items-center justify-center min-h-[44px] px-6 rounded-full border border-gold/45 text-gold text-[11px] tracking-[0.14em] uppercase font-sans font-semibold bg-transparent cursor-pointer"
            >
              {ui.reset}
            </button>
          </div>
        )}

        <div className="mt-12 sm:mt-16 text-center">
          <button
            onClick={onCreate}
            className="inline-flex items-center justify-center min-h-[52px] px-9 rounded-full bg-gradient-to-br from-[#C5A059] to-[#A07840] text-white text-[12px] tracking-[0.18em] uppercase font-sans font-bold border-0 cursor-pointer shadow-[0_10px_30px_rgba(197,160,89,0.28)]"
          >
            {ui.cta}
          </button>
        </div>
      </main>
    </div>
  )
}
