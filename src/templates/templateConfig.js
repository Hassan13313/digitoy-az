/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE CONFIG — bütün dəvətnamə şablonlarının mərkəzi reyestri.

   Rəng/şrift dəyərləri Claude Design layihəsindən götürülüb:
   "Digitoy — 8 Premium Dəvətnamə Template" (Digitoy Templates.dc.html).
   Hər şablon eyni 13 bölməni eyni ardıcıllıqla saxlayır; dəyişən yalnız
   vizual dildir (bax: design faylındakı "Struktur" bölməsi).

   Bu fayl YALNIZ metadata saxlayır (React yoxdur) — builder kartları, preview
   route-ları və gələcək admin/DB inteqrasiyası eyni mənbədən oxuyur.
   Yeni şablon = bura bir obyekt + registry.js-ə bir sətir. 50+ şablona qədər.

   Sahələr:
     id        — URL və DB üçün stabil açar (DƏYİŞDİRMƏ!)
     name      — istifadəçiyə görünən ad
     tagline   — builder kartının alt sətri
     enabled   — true → real müştəri dəvətnaməsində istifadə oluna bilər
     status    — 'live' | 'scaffold' | 'planned'
     theme     — dizayn tokenləri (rəng + şrift), şablon komponentləri oxuyur
     preview   — builder thumbnail-ı üçün vizual reseptlər
   ───────────────────────────────────────────────────────────────────────── */

/* Standart şablon — həm fallback, həm də bütün MÖVCUD müştərilər üçün default.
   ⚠ Bu, sayta indi qədər çıxmış köhnə Digitoy dəvətnaməsidir. Əvvəllər səhvən
   `royal-gold` adlanırdı; Royal Gold isə Claude Design-dakı AYRICA premium
   şablondur. Fallback həmişə `simple-luxury`-dir ki, heç bir mövcud müştərinin
   dizaynı dəyişməsin. */
export const DEFAULT_TEMPLATE_ID = 'simple-luxury'

export const TEMPLATE_STATUS = {
  LIVE:        'live',         /* production-a tam hazır                       */
  BETA:        'beta',         /* seçilə bilər, amma hələ cilalanır            */
  COMING_SOON: 'coming_soon',  /* qalereyada görünür, seçilə BİLMƏZ            */
  CONCEPT:     'concept',      /* yalnız dizayn konsepti — hələ qurulmayıb     */
  DISABLED:    'disabled',     /* tamamilə gizli (nasaz/təqaüdə çıxmış şablon) */
}

/* Hansı statuslar müştəri dəvətnaməsində render oluna bilər?
   Bu yeganə mənbədir — heç bir UI-da hardcode yoxdur. */
export const SELECTABLE_STATUSES = [TEMPLATE_STATUS.LIVE, TEMPLATE_STATUS.BETA]

/* Status → UI badge (builder kartları və admin üçün) */
export const STATUS_META = {
  live:        { az: 'Canlı',    en: 'Live',        ru: 'Актив',   tone: 'positive' },
  beta:        { az: 'Beta',     en: 'Beta',        ru: 'Бета',    tone: 'info'     },
  coming_soon: { az: 'Tezliklə', en: 'Soon',        ru: 'Скоро',   tone: 'muted'    },
  concept:     { az: 'Konsept',  en: 'Concept',     ru: 'Концепт', tone: 'muted'    },
  disabled:    { az: 'Bağlı',    en: 'Disabled',    ru: 'Отключён',tone: 'muted'    },
}

/* ── Kateqoriya metası (şablon vitrinindəki filtr üçün) ─────────────────────
   ⚠ TƏK MƏNBƏ: `/templates` səhifəsi və builder filtrləri bu obyektdən oxuyur.
   Yeni kateqoriyalı şablon əlavə ediləndə YALNIZ bura bir sətir yazılır —
   filtr çipləri, sayğaclar və tərcümələr avtomatik gəlir.
   Naməlum kateqoriya üçün `getCategoryMeta` id-nin özünü qaytarır, yəni
   bura yazmaq unudulsa da səhifə sınmır. */
export const CATEGORY_META = {
  classic:   { az: 'Klassik',  en: 'Classic',   ru: 'Классика'  },
  luxury:    { az: 'Lüks',     en: 'Luxury',    ru: 'Люкс'      },
  floral:    { az: 'Çiçəkli',  en: 'Floral',    ru: 'Цветочный' },
  modern:    { az: 'Modern',   en: 'Modern',    ru: 'Модерн'    },
  minimal:   { az: 'Minimal',  en: 'Minimal',   ru: 'Минимализм'},
  celestial: { az: 'Səma',     en: 'Celestial', ru: 'Небесный'  },
  oriental:  { az: 'Şərq',     en: 'Oriental',  ru: 'Восточный' },
  nature:    { az: 'Təbiət',   en: 'Nature',    ru: 'Природа'   },
  crystal:   { az: 'Kristal',  en: 'Crystal',   ru: 'Кристалл'  },
}

/** Kateqoriya id → görünən ad (naməlum id-də id-nin özü) */
export function getCategoryLabel(category, lang = 'az') {
  const m = CATEGORY_META[category]
  return m ? (m[lang] || m.az) : (category || '')
}

/**
 * Vitrində göstəriləcək filtr qrupları — YALNIZ mövcud şablonlardan hesablanır,
 * ona görə boş çip heç vaxt çıxmır (20+ şablonda da özü uyğunlaşır).
 * @returns {{ statuses: Array, categories: Array }} hər element { id, label, count }
 */
export function listTemplateFacets(lang = 'az') {
  const list = listTemplates()
  const tally = (key) => {
    const map = new Map()
    list.forEach((tpl) => {
      const v = tpl[key]
      if (!v) return
      map.set(v, (map.get(v) || 0) + 1)
    })
    return map
  }

  const sMap = tally('status')
  /* Status sırası məntiqi ardıcıllıqla sabitdir (əlifba sırası deyil) */
  const statuses = [
    TEMPLATE_STATUS.LIVE, TEMPLATE_STATUS.BETA,
    TEMPLATE_STATUS.COMING_SOON, TEMPLATE_STATUS.CONCEPT,
  ]
    .filter((s) => sMap.has(s))
    .map((s) => ({ id: s, label: getStatusMeta(s, lang).label, tone: STATUS_META[s]?.tone, count: sMap.get(s) }))

  const cMap = tally('category')
  const categories = [...cMap.entries()]
    .map(([id, count]) => ({ id, label: getCategoryLabel(id, lang), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'az'))

  return { statuses, categories }
}

/** Status badge metası (naməlum statusda coming_soon) */
export function getStatusMeta(status, lang = 'az') {
  const m = STATUS_META[status] || STATUS_META.coming_soon
  return { label: m[lang] || m.az, tone: m.tone, status: status || TEMPLATE_STATUS.COMING_SOON }
}

/* Design faylında istifadə olunan Google Fonts ailələri — şablonlar
   `theme.fonts` vasitəsilə istinad edir, yükləmə index.html-dədir. */
export const FONT_STACKS = {
  cormorant:  "'Cormorant Garamond', Georgia, serif",
  marcellus:  "'Marcellus', Georgia, serif",
  instrument: "'Instrument Serif', Georgia, serif",
  newsreader: "'Newsreader', Georgia, serif",
  italiana:   "'Italiana', Georgia, serif",
  amiri:      "'Amiri', Georgia, serif",
  archivo:    "'Archivo', 'Inter', system-ui, sans-serif",
  jost:       "'Jost', 'Inter', system-ui, sans-serif",
  dmsans:     "'DM Sans', 'Inter', system-ui, sans-serif",
  inter:      "'Inter', system-ui, sans-serif",
}

export const TEMPLATES = [
  {
    id: 'simple-luxury',
    name: 'Simple Luxury',
    tagline: 'Krem · Qızıl · Digitoy klassik',
    description: 'Digitoy-un klassik krem-qızıl dəvətnaməsi — indiyə qədər işlənən standart dizayn.',
    shortDescription: { az: 'Digitoy klassik krem-qızıl dizayn', en: 'Digitoy classic cream & gold style' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'classic',
    version: 1,
    previewRoute: '/demo/template/simple-luxury',
    theme: {
      primary:   '#C5A059',
      accent:    '#E8D5A3',
      secondary: '#8A6A2E',
      background: '#FDFAF4',
      surface:   '#F2EAD6',
      text:      '#1A1A1A',
      muted:     '#8C7B6B',
      footerBg:  '#2C2523',
      footerText: '#E8D5A3',
      fonts: { heading: FONT_STACKS.cormorant, body: FONT_STACKS.inter },
    },
    preview: {
      accent: '#C5A059',
      background: 'linear-gradient(160deg, #FDFAF4 0%, #F2EAD6 55%, #E8DCC0 100%)',
      swatches: ['#C5A059', '#FDFAF4', '#2C2318'],
    },
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    tagline: 'Qızıl · Zərf möhürü · Gecə',
    description: 'Klassik Bakı toyunun rəqəmsal versiyası — möhürlənmiş zərf, tünd fon, qızıl folqa.',
    shortDescription: { az: 'Klassik lüks toy üslubu', en: 'Classic luxury wedding style' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    version: 1,
    previewRoute: '/demo/template/royal-gold',
    theme: {
      primary:   '#C5A059',
      accent:    '#E8D5A3',
      secondary: '#8A6A2E',
      background: '#0B0906',
      surface:   '#16110A',
      text:      '#F3EADA',
      muted:     '#C6B59C',
      mapTint:  '#C5A059',
      footerBg:  '#14100B',
      footerText: '#C5A059',
      fonts: { heading: FONT_STACKS.cormorant, body: FONT_STACKS.dmsans },
    },
    preview: {
      accent: '#C5A059',
      background: 'radial-gradient(120% 80% at 50% 30%, #1C1509, #0A0805 72%)',
      swatches: ['#0B0906', '#C5A059', '#E8D5A3'],
    },
  },
  {
    id: 'floral-garden',
    name: 'Floral Garden',
    tagline: 'Adaçayı · Tozlu qızılgül · Botanik',
    description: 'Gündüz, açıq havada, ot üzərində keçən toy. Qızıl yox — işıq və bitki.',
    shortDescription: { az: 'Botanik bağ mərasimi üslubu', en: 'Botanical garden ceremony style' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'floral',
    version: 1,
    previewRoute: '/demo/template/floral-garden',
    theme: {
      primary:   '#7E8C6E',
      accent:    '#C98F84',
      secondary: '#E7CFC8',
      background: '#FBF7F2',
      surface:   '#F3EFE8',
      text:      '#3E3730',
      muted:     '#6F6960',
      mapTint:  '#7E8C6E',
      footerBg:  '#3E4A3A',
      footerText: '#E7CFC8',
      fonts: { heading: FONT_STACKS.cormorant, body: FONT_STACKS.jost },
    },
    preview: {
      accent: '#C98F84',
      background: 'linear-gradient(170deg, #FBF7F2, #EFE7DE)',
      swatches: ['#7E8C6E', '#C98F84', '#FBF7F2'],
    },
  },
  {
    id: 'modern-black',
    name: 'Modern Black',
    tagline: 'Qara · Tipoqrafik · Ornamentsiz',
    description: 'Minimalist qara-ağ tipoqrafik dizayn, kəskin kontrast, ornament yoxdur.',
    shortDescription: { az: 'Minimalist tipoqrafik dizayn', en: 'Minimalist typographic design' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'modern',
    version: 0,
    previewRoute: '/demo/template/modern-black',
    theme: {
      primary:   '#0A0A0A',
      accent:    '#FFFFFF',
      secondary: '#D6D3CD',
      background: '#050505',
      surface:   '#111111',
      text:      '#FFFFFF',
      muted:     '#7A7A7A',
      mapTint:  '#000000',
      footerBg:  '#000000',
      footerText: '#D6D3CD',
      fonts: { heading: FONT_STACKS.archivo, body: FONT_STACKS.archivo, accentFont: FONT_STACKS.instrument },
    },
    preview: {
      accent: '#FFFFFF',
      background: '#0A0A0A',
      swatches: ['#0A0A0A', '#FFFFFF', '#6C6C6C'],
    },
  },
  {
    id: 'white-elegance',
    name: 'White Elegance',
    tagline: 'Ağ · Kağız · Boş sahə',
    description: 'Ağ üzərində incə detallar, tam minimalizm və geniş boş sahə.',
    shortDescription: { az: 'Ağ kağız üzərində zəriflik', en: 'Elegance on white paper' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'minimal',
    version: 0,
    previewRoute: '/demo/template/white-elegance',
    theme: {
      primary:   '#FFFFFF',
      accent:    '#8B8175',
      secondary: '#DDD8D0',
      background: '#F2EFEA',
      surface:   '#FAF8F5',
      text:      '#2B2723',
      muted:     '#8B8175',
      mapTint:  '#8B8175',
      footerBg:  '#2B2723',
      footerText: '#DDD8D0',
      fonts: { heading: FONT_STACKS.marcellus, body: FONT_STACKS.jost },
    },
    preview: {
      accent: '#8B8175',
      background: '#FFFFFF',
      swatches: ['#FFFFFF', '#A79C90', '#2B2723'],
    },
  },
  {
    id: 'night-sky',
    name: 'Night Sky',
    tagline: 'Gecə mavisi · Ulduz xəritəsi',
    description: 'Gecə səması, ulduz tozu və dərin lacivərd tonlar.',
    shortDescription: { az: 'Gecə səması və ulduz xəritəsi', en: 'Night sky and star map' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'celestial',
    version: 0,
    previewRoute: '/demo/template/night-sky',
    theme: {
      primary:   '#1B2340',
      accent:    '#C8CEE0',
      secondary: '#3C4869',
      background: '#070B18',
      surface:   '#0F1526',
      text:      '#E4E9F5',
      muted:     '#8A90A4',
      mapTint:  '#2C3A5C',
      footerBg:  '#04060F',
      footerText: '#C8CEE0',
      fonts: { heading: FONT_STACKS.cormorant, body: FONT_STACKS.jost },
    },
    preview: {
      accent: '#C8CEE0',
      background: 'radial-gradient(130% 100% at 50% 110%, #1B2340, #070B18 70%)',
      swatches: ['#070B18', '#C8CEE0', '#3C4869'],
    },
  },
  {
    id: 'oriental-luxe',
    name: 'Oriental Luxe',
    tagline: 'Nar · Buta · Girih naxışı',
    description: 'Şərq ornamentləri — nar qırmızısı, buta və girih naxışı ilə qızıl.',
    shortDescription: { az: 'Şərq ornamentləri və nar tonları', en: 'Oriental ornaments and pomegranate tones' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'oriental',
    version: 0,
    previewRoute: '/demo/template/oriental-luxe',
    theme: {
      primary:   '#4A0F1C',
      accent:    '#D9B36C',
      secondary: '#7C2233',
      background: '#38080F',
      surface:   '#3E0C17',
      text:      '#F1DDB4',
      muted:     '#C79E86',
      mapTint:  '#7C2233',
      footerBg:  '#2A050B',
      footerText: '#E9CE96',
      fonts: { heading: FONT_STACKS.amiri, body: FONT_STACKS.jost },
    },
    preview: {
      accent: '#D9B36C',
      background: '#4A0F1C',
      swatches: ['#4A0F1C', '#D9B36C', '#E9CE96'],
    },
  },
  {
    id: 'nature-touch',
    name: 'Nature Touch',
    tagline: 'Kətan · Meşə yaşılı · Terrakota',
    description: 'Kətan toxuması, meşə yaşılı və terrakota — açıq havada təbii mərasim.',
    shortDescription: { az: 'Kətan və meşə yaşılı təbiət üslubu', en: 'Linen and forest green nature style' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'nature',
    version: 0,
    previewRoute: '/demo/template/nature-touch',
    theme: {
      primary:   '#3E4A3A',
      accent:    '#B4693E',
      secondary: '#7D8A6B',
      background: '#EDE8DE',
      surface:   '#E3DED1',
      text:      '#2F3A2C',
      muted:     '#7E7869',
      mapTint:  '#5E6B4E',
      footerBg:  '#2F3A2C',
      footerText: '#EDE8DE',
      fonts: { heading: FONT_STACKS.newsreader, body: FONT_STACKS.jost },
    },
    preview: {
      accent: '#B4693E',
      background: 'linear-gradient(165deg, #EDE8DE, #DCD5C6)',
      swatches: ['#3E4A3A', '#B4693E', '#EDE8DE'],
    },
  },
  {
    id: 'crystal-glass',
    name: 'Crystal Glass',
    tagline: 'Buz mavisi · Platin · Refraksiya',
    description: 'Kristal refleksləri, şüşə effekti və platin aksentlər.',
    shortDescription: { az: 'Kristal refraksiya və şüşə effekti', en: 'Crystal refraction and glass effect' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'crystal',
    version: 0,
    previewRoute: '/demo/template/crystal-glass',
    theme: {
      primary:   '#2E3A44',
      accent:    '#7E8D99',
      secondary: '#DCE6EE',
      background: '#F4F7FA',
      surface:   '#EAF0F4',
      text:      '#2E3A44',
      muted:     '#66727D',
      mapTint:  '#7E8D99',
      footerBg:  '#2E3A44',
      footerText: '#DCE6EE',
      fonts: { heading: FONT_STACKS.italiana, body: FONT_STACKS.jost },
    },
    preview: {
      accent: '#7E8D99',
      background: 'linear-gradient(150deg, #F4F7FA, #DCE6EE 60%, #EAF0F4)',
      swatches: ['#7E8D99', '#F4F7FA', '#2E3A44'],
    },
  },
]

/* id → config sürətli axtarış üçün */
const BY_ID = TEMPLATES.reduce((acc, tpl) => { acc[tpl.id] = tpl; return acc }, {})

/** Konfiqurasiyanı id ilə qaytarır (tapılmasa null). */
export function getTemplateConfig(id) {
  return BY_ID[id] || null
}

/** Şablonun dizayn tokenləri (tapılmasa default şablonun tokenləri). */
export function getTemplateTheme(id) {
  return (BY_ID[id] || BY_ID[DEFAULT_TEMPLATE_ID]).theme
}

/**
 * Şablon müştəri tərəfindən seçilə/render edilə bilərmi?
 * YEGANƏ meyar statusdur (live | beta) — heç bir UI-da hardcode yoxdur.
 */
export function isTemplateSelectable(id) {
  const tpl = BY_ID[id]
  return !!tpl && SELECTABLE_STATUSES.includes(tpl.status)
}

/**
 * VALIDATION LAYER — istənilən girişi etibarlı şablon id-sinə çevirir.
 *
 * Aşağıdakıların HAMISI default şablona (simple-luxury) düşür:
 *   null · undefined · '' · yalnız boşluq · string olmayan tip ·
 *   reyestrdə olmayan id · statusu coming_soon/disabled olan şablon
 *
 * @param {*} id
 * @param {{ allowDisabled?: boolean }} opts
 *   allowDisabled: true → YALNIZ /demo/template/:id önbaxışında; hazırlanan
 *   şablonlara da baxmağa icazə verir. Müştəri marşrutlarında HEÇ VAXT true.
 */
export function resolveTemplateId(id, { allowDisabled = false } = {}) {
  if (typeof id !== 'string') return DEFAULT_TEMPLATE_ID
  const key = id.trim()
  if (!key) return DEFAULT_TEMPLATE_ID

  const tpl = BY_ID[key]
  if (!tpl) return DEFAULT_TEMPLATE_ID

  /* Preview-də belə `disabled` (nasaz/təqaüdə çıxmış) şablon açılmır */
  if (tpl.status === TEMPLATE_STATUS.DISABLED) return DEFAULT_TEMPLATE_ID

  if (!allowDisabled && !SELECTABLE_STATUSES.includes(tpl.status)) return DEFAULT_TEMPLATE_ID
  return tpl.id
}

/**
 * Reyestrdəki şablonlar.
 * @param {{ onlySelectable?: boolean, category?: string }} opts
 */
export function listTemplates({ onlySelectable = false, category = null } = {}) {
  let list = TEMPLATES.filter((tpl) => tpl.status !== TEMPLATE_STATUS.DISABLED)
  if (onlySelectable) list = list.filter((tpl) => SELECTABLE_STATUSES.includes(tpl.status))
  if (category) list = list.filter((tpl) => tpl.category === category)
  return list
}

/** Admin/analitika üçün: id → görünən ad (naməlum id-də id-nin özü qaytarılır). */
export function getTemplateName(id) {
  return BY_ID[id]?.name || id || ''
}

/** Şablonun önbaxış marşrutu (metadata-dan, hardcode yox). */
export function getTemplatePreviewRoute(id) {
  return BY_ID[id]?.previewRoute || `/demo/template/${DEFAULT_TEMPLATE_ID}`
}

/** Reyestrdə mövcud olan bütün kateqoriyalar (təkrarsız). */
export function listCategories() {
  return [...new Set(TEMPLATES.map((tpl) => tpl.category).filter(Boolean))]
}
