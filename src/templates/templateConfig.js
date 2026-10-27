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
  /* ⚠ Phase 43-də yenidən quruldu: əvvəl 12 kateqoriya vardı və 8-i TƏK
     şablonlu idi («Kino 1», «Retro 1»…) — vitrində peşəkarsız görünürdü.
     Qayda: hər kateqoriyada ƏN AZI 2 şablon.
     Yeni şablon əlavə edəndə ya mövcud qrupa qoşulsun, ya da qoşa gəlsin. */
  luxury:    { az: 'Lüks',       en: 'Luxury',     ru: 'Люкс'        },
  classic:   { az: 'Klassik',    en: 'Classic',    ru: 'Классика'    },
  minimal:   { az: 'Minimalist', en: 'Minimal',    ru: 'Минимализм'  },
  celestial: { az: 'Səma',       en: 'Celestial',  ru: 'Небесный'    },
  nature:    { az: 'Təbiət',     en: 'Nature',     ru: 'Природа'     },
  vintage:   { az: 'Vintage',    en: 'Vintage',    ru: 'Винтаж'      },
  editorial: { az: 'Editorial',  en: 'Editorial',  ru: 'Editorial'   },
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
  /* ── AZƏRBAYCAN HƏRFLƏRİ (Phase 43 · ISSUE #2) ────────────────────────
     Aşağıdakı zəncirlərdə ikinci pillə TƏSADÜFİ DEYİL. Bəzi şriftlərdə
     `Ə` (U+018F) glyph-i yoxdur və CSS həmin HƏRFİ növbəti şriftdən götürür.
     Əvvəl növbəti pillə sistem `Georgia`/`Inter` idi — hərf gözə çarpırdı.
     İndi hər zəncirdə vizual olaraq ƏN YAXIN, tam əhatəli VEB şrifti durur.

     Brauzerdə ölçülüb — `Ə` OLMAYANLAR:
       Italiana (Ə Ğ Ş İ) · Cinzel · Bebas Neue · Marcellus · Amiri · Jost
     TAM əhatəlilər:
       Cormorant · Playfair · Newsreader · Baskerville · Space Grotesk ·
       JetBrains Mono · Archivo · DM Sans · Inter

     ⚠ Yeni şrift əlavə edəndə `Ə` yoxlanmalıdır (tests/az_glyph_test.mjs). */

  /* Tam əhatəli serif-lər — ikinci pilləyə ehtiyac yoxdur */
  cormorant:  "'Cormorant Garamond', Georgia, serif",
  newsreader: "'Newsreader', Georgia, serif",
  baskerville: "'Libre Baskerville', Georgia, 'Times New Roman', serif",
  instrument: "'Instrument Serif', 'Cormorant Garamond', Georgia, serif",

  /* `Ə` çatmayan serif-lər → Cormorant/Playfair üzərinə düşür (Georgia yox) */
  marcellus:  "'Marcellus', 'Cormorant Garamond', Georgia, serif",
  italiana:   "'Italiana', 'Cormorant Garamond', Georgia, serif",
  amiri:      "'Amiri', 'Cormorant Garamond', Georgia, serif",
  /* Cinzel kapitel-kitabə üslubludur; Playfair-in majuskulları Cormorant-dan
     daha yaxındır, ona görə birinci ehtiyat odur. */
  cinzel:     "'Cinzel', 'Playfair Display', 'Cormorant Garamond', Georgia, serif",

  /* Tam əhatəli sans-lar */
  archivo:    "'Archivo', 'Inter', system-ui, sans-serif",
  dmsans:     "'DM Sans', 'Inter', system-ui, sans-serif",
  inter:      "'Inter', system-ui, sans-serif",
  spacegrotesk: "'Space Grotesk', 'Inter', system-ui, sans-serif",
  jetbrains:    "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",

  /* `Ə` çatmayan sans-lar → həndəsi qohumu olan DM Sans üzərinə düşür.
     ⚠ Jost 6 şablonun MƏTN şriftidir (floral-garden, modern-black,
     night-sky, oriental-luxe, nature-touch, crystal-glass) — bu bir sətir
     ən çox görünən düzəlişdir. */
  jost:       "'Jost', 'DM Sans', 'Inter', system-ui, sans-serif",
  /* Bebas kondensasiya olunmuş majuskuldur; Archivo dizaynın öz mətn
     şriftidir və `Ə`-si var → təbii ehtiyatdır. */
  bebas:      "'Bebas Neue', 'Archivo', Impact, system-ui, sans-serif",

  /* ── Premium redizayn (Royal Gold · Floral Garden) ──
     Hamısı Ə/Ğ/Ş/İ daxil tam əhatəlidir (fonttools ilə glyph cədvəlindən
     yoxlanılıb) — ikinci pillə yalnız şrift yüklənənə qədərki ehtiyatdır. */
  notoDisplay: "'Noto Serif Display', 'Cormorant Garamond', Georgia, serif",
  hanken:      "'Hanken Grotesk', 'Inter', system-ui, sans-serif",
  /* Ballet — yalnız Royal Gold-un «&» kalliqrafiyası (mis qələm burulğanı) */
  ballet:      "'Ballet', 'Great Vibes', 'Cormorant Garamond', cursive",
  fraunces:    "'Fraunces', 'Cormorant Garamond', Georgia, serif",
  /* Mulish — Floral Garden mətni; Ə və kiril tam (Albert Sans-da kiril yox idi) */
  mulish:      "'Mulish', 'Inter', system-ui, sans-serif",

  /* ── Premium redizayn — qalan 13 şablon (2026-10) ──
     Hər şablonun öz cütü var; hamısında Ə/ğ/ı/İ/ş var (fonttools ilə
     yoxlanılıb). Kiril olmayanlarda ikinci pillə index.html-də artıq yüklənən
     Cormorant / Playfair / Inter-dir — rus mətnində sistem şriftinə düşmür. */
  unbounded:    "'Unbounded', 'Inter', system-ui, sans-serif",
  interTight:   "'Inter Tight', 'Inter', system-ui, sans-serif",
  spectral:     "'Spectral', 'Cormorant Garamond', Georgia, serif",
  sourceSerif:  "'Source Serif 4', 'Cormorant Garamond', Georgia, serif",
  commissioner: "'Commissioner', 'Inter', system-ui, sans-serif",
  reemKufi:     "'Reem Kufi', 'Playfair Display', Georgia, serif",
  alegreya:     "'Alegreya', 'Cormorant Garamond', Georgia, serif",
  vollkorn:     "'Vollkorn', 'Playfair Display', Georgia, serif",
  geologica:    "'Geologica', 'Inter', system-ui, sans-serif",
  josefin:      "'Josefin Sans', 'Inter', system-ui, sans-serif",
  onest:        "'Onest', 'Inter', system-ui, sans-serif",
  oswald:       "'Oswald', 'Inter', system-ui, sans-serif",
  plexSans:     "'IBM Plex Sans', 'Inter', system-ui, sans-serif",
  plexMono:     "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
  bigShoulders: "'Big Shoulders Display', 'Oswald', 'Inter', system-ui, sans-serif",
  playfair:     "'Playfair Display', Georgia, serif",
  youngSerif:   "'Young Serif', 'Playfair Display', Georgia, serif",
  montserrat:   "'Montserrat', 'Inter', system-ui, sans-serif",
  cormorantSC:  "'Cormorant SC', 'Cormorant Garamond', Georgia, serif",
  ebGaramond:   "'EB Garamond', 'Cormorant Garamond', Georgia, serif",
  imperial:     "'Imperial Script', 'Great Vibes', 'Cormorant Garamond', cursive",
  libreBodoni:  "'Libre Bodoni', 'Playfair Display', Georgia, serif",
  literata:     "'Literata', 'Cormorant Garamond', Georgia, serif",
  oldStandard:  "'Old Standard TT', 'Playfair Display', Georgia, serif",
  libreCaslon:  "'Libre Caslon Display', 'Playfair Display', Georgia, serif",
  raleway:      "'Raleway', 'Inter', system-ui, sans-serif",
}

/* Brauzerdə ÖLÇÜLƏRƏK təsdiqlənmiş siyahı: bu ailələrdə `Ə` glyph-i yoxdur.
   Admin tipoqrafiya seçicisi bunları xəbərdarlıqla göstərir. */
export const FONTS_MISSING_AZ = {
  italiana:  'Ə Ğ Ş İ',
  cinzel:    'Ə',
  bebas:     'Ə',
  marcellus: 'Ə',
  amiri:     'Ə',
  jost:      'Ə',
}


export const TEMPLATES = [
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    tagline: 'Qızıl gravür · Guilloche · Lak qara',
    description: 'Qızıl gravürün dili — sikkə medalyonu, guilloche naxışı, xronoqraf sayğac və fil sümüyü cavab kartı.',
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
      fonts: { heading: FONT_STACKS.notoDisplay, body: FONT_STACKS.hanken },
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
    tagline: 'Pion · Evkalipt · Bağ yolu',
    description: 'Floristin bağ mərasimi — açan pionlar, evkalipt budaqları və qonağı bölmədən bölməyə aparan yaşıl bağ yolu.',
    shortDescription: { az: 'Botanik bağ mərasimi üslubu', en: 'Botanical garden ceremony style' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'classic',
    version: 1,
    previewRoute: '/demo/template/floral-garden',
    theme: {
      primary:   '#5E7C6B',
      accent:    '#C9768A',
      secondary: '#3F5E4C',
      background: '#F4F6EF',
      surface:   '#FFFFFF',
      text:      '#213229',
      muted:     '#5D6B61',
      mapTint:  '#5E7C6B',
      footerBg:  '#213229',
      footerText: '#F6DCE2',
      footerAccent: '#F3C3CD',
      fonts: { heading: FONT_STACKS.fraunces, body: FONT_STACKS.mulish },
    },
    preview: {
      accent: '#C9768A',
      background: 'linear-gradient(170deg, #F4F6EF, #E6EDE3)',
      swatches: ['#5E7C6B', '#C9768A', '#F4F6EF'],
    },
  },
  {
    id: 'modern-black',
    name: 'Modern Black',
    tagline: 'Saf qara · Geniş şrift · Afişa',
    description: 'Moda evinin tipoqrafik afişası — ekran enində adlar, spesifikasiya cədvəli, ortadan yarılan açılış.',
    shortDescription: { az: 'Minimalist tipoqrafik dizayn', en: 'Minimalist typographic design' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'minimal',
    version: 0,
    previewRoute: '/demo/template/modern-black',
    theme: {
      primary: '#FFFFFF',
      accent: '#FFFFFF',
      secondary: '#BDBDBD',
      background: '#000000',
      surface: '#0D0D0D',
      text: '#FFFFFF',
      muted: '#8C8C8C',
      mapTint: '#000000',
      footerBg: '#000000',
      footerText: '#BDBDBD',
      fonts: { heading: FONT_STACKS.unbounded, body: FONT_STACKS.interTight },
    },
    preview: {
      accent: '#FFFFFF',
      background: '#000000',
      swatches: ['#000000', '#FFFFFF', '#8C8C8C'],
    },
  },
  {
    id: 'white-elegance',
    name: 'White Elegance',
    tagline: 'Pambıq kağız · Rəngsiz qabartma · Kalka',
    description: 'Ən bahalı dəftərxananın dili — boyasız qabartma monoqram, cırıq kənarlı kartlar, kalka vərəq və qatlanmış yer kartı.',
    shortDescription: { az: 'Ağ kağız üzərində zəriflik', en: 'Elegance on white paper' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'minimal',
    version: 0,
    previewRoute: '/demo/template/white-elegance',
    theme: {
      primary: '#2B2723',
      accent: '#8B8175',
      secondary: '#5A534B',
      background: '#F6F4F0',
      surface: '#FBFAF7',
      text: '#2B2723',
      muted: '#7A7166',
      mapTint: '#8B8175',
      footerBg: '#2B2723',
      footerText: '#E8E5DF',
      footerAccent: '#FFFFFF',
      fonts: { heading: FONT_STACKS.spectral, body: FONT_STACKS.spectral },
    },
    preview: {
      accent: '#8B8175',
      background: 'linear-gradient(170deg, #FBFAF7, #E8E5DF)',
      swatches: ['#FBFAF7', '#E8E5DF', '#2B2723'],
    },
  },
  {
    id: 'night-sky',
    name: 'Night Sky',
    tagline: 'Real ulduz xəritəsi · Ay fazası · Koordinatlar',
    description: 'Tədbir gecəsinin həqiqi səması — o tarixdə, o saatda məkanın üzərindəki ulduzlar və bürclər, Ayın fazası və coğrafi koordinatlar.',
    shortDescription: { az: 'Gecə səması və ulduz xəritəsi', en: 'Night sky and star map' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'celestial',
    version: 0,
    previewRoute: '/demo/template/night-sky',
    theme: {
      primary: '#F2D9A6',
      accent: '#C8CEE0',
      secondary: '#A2A8BC',
      background: '#070B18',
      surface: '#0F1526',
      text: '#E4E9F5',
      muted: '#A2A8BC',
      mapTint: '#1B2340',
      footerBg: '#04060F',
      footerText: '#C8CEE0',
      footerAccent: '#F2D9A6',
      fonts: { heading: FONT_STACKS.sourceSerif, body: FONT_STACKS.commissioner },
    },
    preview: {
      accent: '#F2D9A6',
      background: 'radial-gradient(130% 100% at 50% 110%, #1B2340, #070B18 70%)',
      swatches: ['#070B18', '#C8CEE0', '#F2D9A6'],
    },
  },
  {
    id: 'oriental-luxe',
    name: 'Oriental Luxe',
    tagline: 'Şəbəkə pəncərəsi · Xalça · Nar',
    description: 'Azərbaycan məclisinin öz sənəti — Şəki şəbəkəsinin rəngli şüşələri, xalça haşiyəsi və göl medalyonu, nar qırmızısı ilə qızıl.',
    shortDescription: { az: 'Şərq ornamentləri və nar tonları', en: 'Oriental ornaments and pomegranate tones' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    version: 0,
    previewRoute: '/demo/template/oriental-luxe',
    theme: {
      primary: '#4A0F1C',
      accent: '#D9B36C',
      secondary: '#7A2234',
      background: '#2E0710',
      surface: '#3E0C17',
      text: '#F3E4C4',
      muted: '#CDA88E',
      mapTint: '#4A0F1C',
      footerBg: '#220509',
      footerText: '#E7CFA6',
      footerAccent: '#D9B36C',
      fonts: { heading: FONT_STACKS.reemKufi, body: FONT_STACKS.alegreya },
    },
    preview: {
      accent: '#D9B36C',
      background: 'radial-gradient(120% 82% at 50% 38%, #7A2234, #2E0710 76%)',
      swatches: ['#4A0F1C', '#D9B36C', '#2B4C8F'],
    },
  },
  {
    id: 'nature-touch',
    name: 'Nature Touch',
    tagline: 'Herbari qovluğu · Dağ çəmənliyi · Ağac kəsiyi',
    description: 'Şəhərdən kənar toy — kəndirli herbari qovluğu açılır, içəridə qızıl saatda Qafqaz dağları, ağac kəsiyində sayğac və masa nömrəsi, meşə cığırı boyunca proqram.',
    shortDescription: { az: 'Kətan və meşə yaşılı təbiət üslubu', en: 'Linen and forest green nature style' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'nature',
    version: 0,
    previewRoute: '/demo/template/nature-touch',
    theme: {
      primary: '#2F3A2C',
      accent: '#9A5530',
      secondary: '#5C6B4C',
      background: '#F6F2E7',
      surface: '#E8E2D3',
      text: '#2F3A2C',
      muted: '#5C6B4C',
      mapTint: '#93A07E',
      footerBg: '#2F3A2C',
      footerText: '#E8E2D3',
      footerAccent: '#E2C28F',
      fonts: { heading: FONT_STACKS.vollkorn, body: FONT_STACKS.geologica },
    },
    preview: {
      accent: '#9A5530',
      background: 'linear-gradient(180deg, #F5E2C4, #A8B9A5 60%, #33493A)',
      swatches: ['#F6F2E7', '#5A715D', '#D9A55B'],
    },
  },
  {
    id: 'crystal-glass',
    name: 'Crystal Glass',
    tagline: 'Kristal çilçıraq · Faset · Spektr',
    description: 'Böyük salonun kristal çilçırağı — enən muncuq sapları, fasetli kristal çərçivələr, akril kartlar və işığın spektrə ayrıldığı proqram.',
    shortDescription: { az: 'Kristal refraksiya və şüşə effekti', en: 'Crystal refraction and glass effect' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'celestial',
    version: 0,
    previewRoute: '/demo/template/crystal-glass',
    theme: {
      primary: '#23303B',
      accent: '#5A6772',
      secondary: '#DCE5EC',
      background: '#EEF2F6',
      surface: '#F9FBFC',
      text: '#23303B',
      muted: '#5A6772',
      mapTint: '#5A6772',
      footerBg: '#23303B',
      footerText: '#DCE5EC',
      footerAccent: '#FFFFFF',
      fonts: { heading: FONT_STACKS.josefin, body: FONT_STACKS.onest },
    },
    preview: {
      accent: '#5A6772',
      background: 'radial-gradient(110% 70% at 50% 20%, #FFFFFF, #EEF2F6 60%, #DFE6EC)',
      swatches: ['#FFFFFF', '#AEB9C3', '#23303B'],
    },
  },
  /* ───────────────────────────────────────────────────────────────────────
     PHASE 41 — Claude Design «Digitoy Seçilmiş 7» dəsti.
     Rəng və şrift dəyərləri birbaşa dizayn faylından götürülüb
     (`Digitoy Secilmis 7.dc.html`, bölmə 01…07).
     Hər biri TemplateShell üzərində qurulub → 13 bölmə, RSVP, qalereya,
     oturma planı, QR, musiqi, sayğac, MapSection və AZ/EN/RU tərcüməsi
     avtomatik gəlir; şablon yalnız ÖZ vizual dilini verir.
     ─────────────────────────────────────────────────────────────────── */
  {
    id: 'boarding-pass',
    name: 'Boarding Pass',
    tagline: 'Split-flap lövhə · Birinci sinif · Hava poçtu',
    description: 'Reaktiv əsrin birinci sinif səyahəti — fırlanan hərfli uçuş lövhəsi, fil sümüyü kartonda mis gerbli minik talonu, check-in və «Par Avion» kartları.',
    shortDescription: { az: 'Uçuş bileti üslubunda mono dizayn', en: 'Boarding-pass styled mono design' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'editorial',
    version: 1,
    previewRoute: '/demo/template/boarding-pass',
    theme: {
      primary: '#D2A262',
      accent: '#F4EFE4',
      secondary: '#9AA6B6',
      background: '#0E1B2E',
      surface: '#14243B',
      text: '#F4EFE4',
      muted: '#9AA6B6',
      mapTint: '#1B3456',
      footerBg: '#08111E',
      footerText: '#C9D1DC',
      footerAccent: '#D2A262',
      fonts: { heading: FONT_STACKS.oswald, body: FONT_STACKS.plexSans, mono: FONT_STACKS.plexMono },
    },
    preview: {
      accent: '#D2A262',
      background: 'radial-gradient(120% 80% at 50% 0%, #1A2D47, #0E1B2E 50%, #08111E)',
      swatches: ['#0E1B2E', '#F4EFE4', '#D2A262'],
    },
  },
  {
    id: 'cinema-premiere',
    name: 'Cinema Premiere',
    tagline: 'Məxmər pərdə · Marquee · Art-deko afişa',
    description: 'Art-deko kino sarayında premyera gecəsi — qırmızı məxmər pərdə, lampaları qaçan marquee, kinoplyonka seansları, qırmızı bilet və ★★★★★ rəylər.',
    shortDescription: { az: 'Film premyerası üslubu', en: 'Film premiere styling' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'vintage',
    version: 1,
    previewRoute: '/demo/template/cinema-premiere',
    theme: {
      primary: '#D9A441',
      accent: '#D9A441',
      secondary: '#7A111B',
      background: '#0B0A0C',
      surface: '#141215',
      text: '#F2EBDD',
      muted: '#A9A39A',
      mapTint: '#7A111B',
      footerBg: '#070607',
      footerText: '#D8CFC0',
      footerAccent: '#F1CF7E',
      fonts: { heading: FONT_STACKS.bigShoulders, body: FONT_STACKS.playfair },
    },
    preview: {
      accent: '#D9A441',
      background: 'repeating-linear-gradient(90deg, #3E070D 0, #7A111B 8%, #A72330 12%, #7A111B 16%, #3E070D 22%)',
      swatches: ['#7A111B', '#D9A441', '#0B0A0C'],
    },
  },
  {
    id: 'vinyl-record',
    name: 'Vinyl Record',
    tagline: 'Hi-fi vallı · Albom qabığı · Trek siyahısı',
    description: 'Audiofil hi-fi və 60-cı illərin caz albomu — qoz ağacı vallı, mid-century üz qabığı, mavi VU-metr, arxa qabıqda trek siyahısı və jukebox kartı.',
    shortDescription: { az: 'Vinil plyonka üslubu', en: 'Vinyl record styling' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'vintage',
    version: 1,
    previewRoute: '/demo/template/vinyl-record',
    theme: {
      primary: '#D2642F',
      accent: '#E2A93B',
      secondary: '#1F5C5B',
      background: '#151312',
      surface: '#1E1B19',
      text: '#F1E8D6',
      muted: '#B3A894',
      mapTint: '#D2642F',
      footerBg: '#0E0C0B',
      footerText: '#D8CDB8',
      footerAccent: '#E2A93B',
      fonts: { heading: FONT_STACKS.youngSerif, body: FONT_STACKS.montserrat },
    },
    preview: {
      accent: '#D2642F',
      background: 'linear-gradient(160deg, #1F5C5B 0 55%, #D2642F 55% 100%)',
      swatches: ['#1F5C5B', '#D2642F', '#E2A93B'],
    },
  },
  {
    id: 'royal-palace',
    name: 'Royal Palace',
    tagline: 'Fərman tumarı · Tac · Zanbaq naxışı',
    description: 'Barokko sarayının dili — kral göyü məxmər üzərində zərli zanbaq naxışı, özü açılan fərman tumarı, tac və dəfnə çələngi, portret qalereyası.',
    shortDescription: { az: 'Saray heraldikası, gecə mavisi', en: 'Palace heraldry on midnight blue' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    version: 1,
    previewRoute: '/demo/template/royal-palace',
    theme: {
      primary: '#D6B76E',
      accent: '#D6B76E',
      secondary: '#AAB0CC',
      background: '#0C1128',
      surface: '#141B3A',
      text: '#F3ECDD',
      muted: '#AAB0CC',
      mapTint: '#24306A',
      footerBg: '#080C1E',
      footerText: '#D9DCEB',
      footerAccent: '#F0DCA0',
      fonts: { heading: FONT_STACKS.cormorantSC, body: FONT_STACKS.ebGaramond, script: FONT_STACKS.imperial },
    },
    preview: {
      accent: '#D6B76E',
      background: 'radial-gradient(90% 60% at 50% 35%, #233066, #141B3A 55%, #0C1128)',
      swatches: ['#141B3A', '#D6B76E', '#EFE3C8'],
    },
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    tagline: 'Mayolika kaşıları · Limon · Riviera',
    description: 'Amalfi sahilində yay — kobalt-limon mayolika divarı, Riviera mənzərəsi, mavi pəncərə qapaqları, keramika boşqabda masa nömrəsi və poçt kartı.',
    shortDescription: { az: 'Aralıq dənizi sahil üslubu', en: 'Mediterranean coastal style' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'nature',
    version: 1,
    previewRoute: '/demo/template/mediterranean',
    theme: {
      primary: '#1F5FA6',
      accent: '#D7774E',
      secondary: '#2E7C96',
      background: '#FBF8F1',
      surface: '#F1E7D3',
      text: '#1E3348',
      muted: '#5A6B7A',
      mapTint: '#2E7C96',
      footerBg: '#1F5FA6',
      footerText: '#EAF1F7',
      footerAccent: '#F2C94C',
      fonts: { heading: FONT_STACKS.libreBodoni, body: FONT_STACKS.literata },
    },
    preview: {
      accent: '#1F5FA6',
      background: 'linear-gradient(180deg, #A9D6EA, #F7E6CB 50%, #2E7C96 50%, #1F5FA6)',
      swatches: ['#FBF8F1', '#1F5FA6', '#F2C94C'],
    },
  },
  {
    id: 'gazette',
    name: 'Gazette',
    tagline: 'Təcili buraxılış · Manşet · Kupon',
    description: '1930-cu illərin böyük formatlı qəzeti — fırlanaraq gələn birinci səhifə, rastr foto, teleproqram, elanlar, kəsilən RSVP kuponu və oxucu məktubları.',
    shortDescription: { az: 'Qəzet xüsusi buraxılışı', en: 'Newspaper special edition' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'editorial',
    version: 1,
    previewRoute: '/demo/template/gazette',
    theme: {
      primary: '#1A1917',
      accent: '#B3261E',
      secondary: '#55514A',
      background: '#F3EEE2',
      surface: '#FBF9F3',
      text: '#1A1917',
      muted: '#55514A',
      mapTint: '#1A1917',
      footerBg: '#1A1917',
      footerText: '#E9E3D4',
      footerAccent: '#FFFFFF',
      fonts: { heading: FONT_STACKS.playfair, body: FONT_STACKS.sourceSerif },
    },
    preview: {
      accent: '#B3261E',
      background: '#F3EEE2',
      swatches: ['#F3EEE2', '#1A1917', '#B3261E'],
    },
  },
  {
    id: 'luxury-jewelry',
    name: 'Luxury Jewelry',
    tagline: 'Üzük qutusu · Zümrüd kəsim · Platin',
    description: 'Yüksək zərgərlik evinin vitrini — açılan zümrüd məxmər üzük qutusu, dörd fərqli daş kəsimində sayğac, hərrac kataloqu proqramı və lentli hədiyyə kartları.',
    shortDescription: { az: 'Zümrüd zərgərlik vitrini', en: 'Emerald jewelry showcase' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    version: 1,
    previewRoute: '/demo/template/luxury-jewelry',
    theme: {
      primary: '#A3D6C7',
      accent: '#A3D6C7',
      secondary: '#9DB5AE',
      background: '#07110E',
      surface: '#0E2A23',
      text: '#F4F1EA',
      muted: '#9DB5AE',
      mapTint: '#1F7A5C',
      footerBg: '#050C0A',
      footerText: '#D9DEE0',
      footerAccent: '#A3D6C7',
      fonts: { heading: FONT_STACKS.libreCaslon, body: FONT_STACKS.raleway },
    },
    preview: {
      accent: '#A3D6C7',
      background: 'radial-gradient(60% 45% at 50% 34%, #1E4C40, #07110E 70%)',
      swatches: ['#0E2A23', '#1F7A5C', '#D9DEE0'],
    },
  },
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

/**
 * Builder-də İLK OLARAQ seçili gələn şablon — reyestrin BİRİNCİ seçilə bilən
 * şablonu (indi Royal Gold).
 *
 * ⚠ Bu, `DEFAULT_TEMPLATE_ID`-dən FƏRQLİDİR və qəsdən belədir:
 *   • DEFAULT_TEMPLATE_ID = simple-luxury → RENDER fallback-ıdır. `templateId`
 *     olmayan KÖHNƏ dəvətnamələr bununla açılır, ona görə heç vaxt dəyişmir.
 *   • BUILDER_DEFAULT_TEMPLATE_ID → YENİ müştəriyə ilk göstərilən dizayndır.
 *     Simple Luxury artıq siyahının sonundadır (köhnə klassik nümunə kimi),
 *     ona görə builder-də də ilk o çıxmamalıdır.
 */
export function builderDefaultTemplateId() {
  return listTemplates({ onlySelectable: true })[0]?.id || DEFAULT_TEMPLATE_ID
}

/**
 * Builder-in həqiqi şablonu (Phase 45.1). Boş `templateId` əvvəl UI-da Royal
 * Gold kimi «Seçildi» görünür, amma önbaxış/server onu simple-luxury edirdi.
 *   • müştəri → builderDefaultTemplateId() (gördüyü dizayn)
 *   • admin   → DEFAULT_TEMPLATE_ID (köhnə sifariş necə render olunurdusa)
 */
export function resolveBuilderTemplateId(templateId, { isAdmin = false } = {}) {
  if (templateId) return templateId
  return isAdmin ? DEFAULT_TEMPLATE_ID : builderDefaultTemplateId()
}

/** Reyestrdə mövcud olan bütün kateqoriyalar (təkrarsız). */
export function listCategories() {
  return [...new Set(TEMPLATES.map((tpl) => tpl.category).filter(Boolean))]
}
