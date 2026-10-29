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
  playful:   { az: 'Əyləncəli',  en: 'Playful',    ru: 'Игривый'     },
}

/* ── KONSEPT (tədbir növü) — 2026-10 ────────────────────────────────────────
   Qonaq rəyi: şablonlar ümumi idi, müştəri öz tədbirinə uyğun olanı tapa
   bilmirdi. İndi hər şablonun bir `concept`-i var və vitrin/builder əvvəlcə
   konseptə görə süzür («Uşaq ad günü» → yalnız uşaq şablonları).
   ⚠ `category` (üslub: Lüks, Vintage…) QALIR — konsept ondan ayrı oxdur.
   Sıra burada sabitdir (vitrində bu ardıcıllıqla görünür); şablonu olmayan
   konsept çipi göstərilmir (bax listTemplateFacets).
   `eventType` — builder-də bu konseptin şablonu seçiləndə formanın ilkin
   tədbir növü (müştəri 1-ci addımda yenə dəyişə bilər). */
export const CONCEPT_META = {
  toy:          { az: 'Toy',            en: 'Wedding',           ru: 'Свадьба',            eventType: 'toy' },
  nishan:       { az: 'Nişan',          en: 'Engagement',        ru: 'Помолвка',           eventType: 'nishan' },
  birthday:     { az: 'Ad günü',        en: 'Birthday',          ru: 'День рождения',      eventType: 'birthday' },
  kids:         { az: 'Uşaq ad günü',   en: 'Kids’ birthday',    ru: 'Детский праздник',   eventType: 'birthday' },
  xina:         { az: 'Xına gecəsi',    en: 'Henna night',       ru: 'Вечер хны',          eventType: 'xina' },
  sunnet:       { az: 'Sünnət toyu',    en: 'Sunnat celebration', ru: 'Сюннет-той',        eventType: 'sunnet' },
  baby:         { az: 'Baby shower',    en: 'Baby shower',       ru: 'Бэби шауэр',         eventType: 'baby' },
  corporate:    { az: 'Korporativ',     en: 'Corporate',         ru: 'Корпоратив',         eventType: 'corporate' },
  anniversary:  { az: 'İldönümü',       en: 'Anniversary',       ru: 'Годовщина',          eventType: 'anniversary' },
  graduation:   { az: 'Məzuniyyət',     en: 'Graduation',        ru: 'Выпускной',          eventType: 'graduation' },
  opening:      { az: 'Açılış',         en: 'Grand opening',     ru: 'Открытие',           eventType: 'corporate' },
  holiday:      { az: 'Bayram gecəsi',  en: 'Holiday party',     ru: 'Праздничный вечер',  eventType: 'other' },
  bachelorette: { az: 'Qız gecəsi',     en: 'Bachelorette',      ru: 'Девичник',           eventType: 'bachelorette' },
}
const CONCEPT_ORDER = Object.keys(CONCEPT_META)

/** Konsept id → görünən ad (naməlum id-də id-nin özü) */
export function getConceptLabel(concept, lang = 'az') {
  const m = CONCEPT_META[concept]
  return m ? (m[lang] || m.az) : (concept || '')
}

/** Şablonun konseptinə uyğun ilkin tədbir növü (yoxdursa null) */
export function conceptEventType(templateId) {
  const c = BY_ID[templateId]?.concept
  return (c && CONCEPT_META[c]?.eventType) || null
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

  /* Konseptlər CONCEPT_META sırası ilə (sayına görə yox) — müştəri tədbirini
     həmişə eyni yerdə tapsın */
  const kMap = tally('concept')
  const concepts = CONCEPT_ORDER
    .filter((k) => kMap.has(k))
    .map((k) => ({ id: k, label: getConceptLabel(k, lang), count: kMap.get(k) }))

  return { statuses, categories, concepts }
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

  /* ── Uşaq ad günü konsepti (2026-10) ──
     Hamısında Ə/ğ/ı/İ/ş VƏ kiril var (fonttools ilə glyph cədvəlindən
     yoxlanılıb) — rus dilində də başqa şriftə düşmür. */
  cormorantUnicase: "'Cormorant Unicase', 'Cormorant Garamond', Georgia, serif",
  bonaNova:     "'Bona Nova', 'Cormorant Garamond', Georgia, serif",
  tektur:       "'Tektur', 'Inter', system-ui, sans-serif",
  exo2:         "'Exo 2', 'Inter', system-ui, sans-serif",
  oi:           "'Oi', 'Playfair Display', Georgia, serif",
  podkova:      "'Podkova', 'Playfair Display', Georgia, serif",
  shantell:     "'Shantell Sans', 'Inter', system-ui, sans-serif",
  andika:       "'Andika', 'Inter', system-ui, sans-serif",
  mplusRounded: "'M PLUS Rounded 1c', 'Inter', system-ui, sans-serif",
  pacifico:     "'Pacifico', 'Great Vibes', 'Cormorant Garamond', cursive",
  /* Konseptlər II (2026-10) — hamısında Ə/ğ/ı/İ/ş və kiril var (fonttools ilə yoxlanılıb) */
  lora: "'Lora', 'Cormorant Garamond', Georgia, serif",
  greatVibes: "'Great Vibes', 'Cormorant Garamond', Georgia, cursive",
  alegreyaSans: "'Alegreya Sans', 'Inter', system-ui, sans-serif",
  badScript: "'Bad Script', 'Cormorant Garamond', Georgia, cursive",
  playfairSC: "'Playfair Display SC', 'Playfair Display', Georgia, serif",
  merriweather: "'Merriweather', Georgia, serif",
  spectralSC: "'Spectral SC', 'Cormorant SC', Georgia, serif",
  balsamiq: "'Balsamiq Sans', 'Inter', system-ui, sans-serif",
  nunitoSans: "'Nunito Sans', 'Inter', system-ui, sans-serif",
  montserratAlt: "'Montserrat Alternates', 'Montserrat', 'Inter', system-ui, sans-serif",
  nunito: "'Nunito', 'Inter', system-ui, sans-serif",
  cormorantInfant: "'Cormorant Infant', 'Cormorant Garamond', Georgia, serif",
  caveat: "'Caveat', 'Cormorant Garamond', cursive",
  comfortaa: "'Comfortaa', 'Nunito', 'Inter', system-ui, sans-serif",
  playpen: "'Playpen Sans', 'Nunito', 'Inter', system-ui, sans-serif",
  ysabeauInfant: "'Ysabeau Infant', 'Nunito', 'Inter', system-ui, sans-serif",
  interTightBold: "'Inter Tight', 'Inter', system-ui, sans-serif",
  lobster: "'Lobster', 'Pacifico', cursive",
  jura: "'Jura', 'Inter', system-ui, sans-serif",
  vollkornSC: "'Vollkorn SC', 'Vollkorn', Georgia, serif",
  brygada: "'Brygada 1918', 'Vollkorn', Georgia, serif",
  piazzolla: "'Piazzolla', 'Literata', Georgia, serif",
  didact: "'Didact Gothic', 'Nunito Sans', system-ui, sans-serif",
  marmelad: "'Marmelad', 'Comfortaa', system-ui, sans-serif",
  pangolin: "'Pangolin', 'Marmelad', cursive",
  bellotaText: "'Bellota Text', 'Nunito', system-ui, sans-serif",
  alegreyaSC: "'Alegreya SC', 'Alegreya', Georgia, serif",
  firaXC: "'Fira Sans Extra Condensed', 'Oswald', system-ui, sans-serif",
  firaC: "'Fira Sans Condensed', 'Inter', system-ui, sans-serif",
  comforterBrush: "'Comforter Brush', 'Caveat', cursive",
  robotoSerif: "'Roboto Serif', 'Georgia', serif",
  notoSans: "'Noto Sans', 'Inter', system-ui, sans-serif",
  comforter: "'Comforter', 'Great Vibes', cursive",
  amatic: "'Amatic SC', 'Caveat', cursive",
  ysabeauOffice: "'Ysabeau Office', 'Nunito Sans', system-ui, sans-serif",
  ysabeau: "'Ysabeau', 'Nunito Sans', system-ui, sans-serif",
  martianMono: "'Martian Mono', ui-monospace, monospace",
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
    concept: 'toy',
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
    concept: 'nishan',
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
    concept: 'birthday',
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
    concept: 'toy',
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
    concept: 'nishan',
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
    concept: 'toy',
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
    concept: 'nishan',
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
    concept: 'toy',
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
    concept: 'birthday',
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
    concept: 'birthday',
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
    concept: 'birthday',
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
    concept: 'toy',
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
    concept: 'nishan',
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
    concept: 'birthday',
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
    concept: 'nishan',
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
  /* ── UŞAQ AD GÜNÜ konsepti (2026-10) — 5 şablon ── */
  {
    id: 'fairy-tale',
    name: 'Fairy Tale',
    tagline: 'Nağıl kitabı · Pop-up qəsr · Sehrli güzgü',
    description: '«Biri var idi, biri yox idi…» — açılan nağıl kitabından qalxan pop-up qəsr, fəsil-fəsil proqram və masanı göstərən sehrli güzgü.',
    shortDescription: { az: 'Nağıl kitabı üslubunda uşaq ad günü', en: 'Storybook-style kids’ birthday' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'kids',
    version: 1,
    previewRoute: '/demo/template/fairy-tale',
    theme: {
      primary:   '#5E4A9C',
      accent:    '#C8A15A',
      secondary: '#1F2A52',
      background: '#FBF5EA',
      surface:   '#F3E7D1',
      text:      '#2D2A4A',
      muted:     '#625C7C',
      mapTint:  '#5E4A9C',
      footerBg:  '#1F2A52',
      footerText: '#F3E7D1',
      footerAccent: '#E2C27E',
      fonts: { heading: FONT_STACKS.cormorantUnicase, body: FONT_STACKS.bonaNova },
    },
    preview: {
      accent: '#C8A15A',
      background: 'radial-gradient(120% 80% at 50% 20%, #3B3A7A, #1F2A52 70%)',
      swatches: ['#1F2A52', '#B7A3D9', '#C8A15A'],
    },
  },
  {
    id: 'space-mission',
    name: 'Space Mission',
    tagline: 'Raket buraxılışı · Missiya pultu · Planet orbiti',
    description: 'Kosmik səyahət — «3·2·1» ilə buraxılan raket, missiya pultu sayğacı, radar ekranında xəritə və planetlərlə uçuş planı.',
    shortDescription: { az: 'Kosmik səyahət üslubunda uşaq ad günü', en: 'Space-voyage kids’ birthday' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'kids',
    version: 1,
    previewRoute: '/demo/template/space-mission',
    theme: {
      primary:   '#FF8A3D',
      accent:    '#FFC94D',
      secondary: '#5FE0B7',
      background: '#141A3C',
      surface:   '#1C2350',
      text:      '#F5F3FF',
      muted:     '#AEB4D8',
      mapTint:  '#3B2F7A',
      footerBg:  '#0C1029',
      footerText: '#F5F3FF',
      footerAccent: '#FFC94D',
      fonts: { heading: FONT_STACKS.unbounded, body: FONT_STACKS.exo2 },
    },
    preview: {
      accent: '#FF8A3D',
      background: 'radial-gradient(120% 80% at 50% 110%, #3B2F7A, #141A3C 55%, #0C1029)',
      swatches: ['#141A3C', '#FF8A3D', '#5FE0B7'],
    },
  },
  {
    id: 'circus-show',
    name: 'Circus Show',
    tagline: 'Sirk çadırı · Taxta şrift afişa · Şou proqramı',
    description: 'Köhnə sirk afişasının dili — zolaqlı çadır, nağara ilə açılan şou, nömrə-nömrə proqram və alqış kartları.',
    shortDescription: { az: 'Vintage sirk afişası üslubunda uşaq ad günü', en: 'Vintage circus-poster kids’ birthday' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'kids',
    version: 1,
    previewRoute: '/demo/template/circus-show',
    theme: {
      primary:   '#C62537',
      accent:    '#F2B23A',
      secondary: '#1E2A57',
      background: '#F7ECD6',
      surface:   '#FFF8EA',
      text:      '#2A1E1A',
      muted:     '#6A5546',
      mapTint:  '#1E2A57',
      footerBg:  '#1E2A57',
      footerText: '#F7ECD6',
      footerAccent: '#F2B23A',
      fonts: { heading: FONT_STACKS.oi, body: FONT_STACKS.podkova },
    },
    preview: {
      accent: '#C62537',
      background: 'repeating-linear-gradient(90deg, #C62537 0 14%, #F7ECD6 14% 28%)',
      swatches: ['#C62537', '#F7ECD6', '#1E2A57'],
    },
  },
  {
    id: 'dino-adventure',
    name: 'Dino Adventure',
    tagline: 'Dinozavr yumurtası · Vulkan · İz cığırı',
    description: 'Dinozavr ekspedisiyası — çatlayan yumurtadan çıxan balaca dino, vulkanlı cəngəllik, iz cığırı ilə proqram və qazıntıdan çıxan masa nömrəsi.',
    shortDescription: { az: 'Dinozavr ekspedisiyası üslubunda uşaq ad günü', en: 'Dinosaur-expedition kids’ birthday' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'kids',
    version: 1,
    previewRoute: '/demo/template/dino-adventure',
    theme: {
      primary:   '#3E7A3A',
      accent:    '#E4683A',
      secondary: '#24452F',
      background: '#F5EBD3',
      surface:   '#FBF4E2',
      text:      '#2B2A20',
      muted:     '#615C47',
      mapTint:  '#3E7A3A',
      footerBg:  '#24452F',
      footerText: '#F5EBD3',
      footerAccent: '#F2A65A',
      fonts: { heading: FONT_STACKS.shantell, body: FONT_STACKS.andika },
    },
    preview: {
      accent: '#E4683A',
      background: 'linear-gradient(180deg, #BFE3DA, #F5EBD3 60%, #8CC084)',
      swatches: ['#3E7A3A', '#E4683A', '#F5EBD3'],
    },
  },
  {
    id: 'balloon-party',
    name: 'Balloon Party',
    tagline: 'Folqa şarlar · Qatlı tort · Saqqız avtomatı',
    description: 'Şirin bayram — havaya qalxan şar dəstəsi, folqa hərflərlə ad, qatlı tort kimi proqram və masa nömrəsini verən saqqız avtomatı.',
    shortDescription: { az: 'Şar və şirniyyat üslubunda uşaq ad günü', en: 'Balloons & candy kids’ birthday' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'kids',
    version: 1,
    previewRoute: '/demo/template/balloon-party',
    theme: {
      primary:   '#C9577C',
      accent:    '#D8A64A',
      secondary: '#7FC8B0',
      background: '#FFF8F3',
      surface:   '#FFFFFF',
      text:      '#4A3046',
      muted:     '#7D6479',
      mapTint:  '#C9577C',
      footerBg:  '#4A3046',
      footerText: '#FFF1F4',
      footerAccent: '#F6C3CF',
      fonts: { heading: FONT_STACKS.mplusRounded, body: FONT_STACKS.mplusRounded },
    },
    preview: {
      accent: '#EF8FA8',
      background: 'linear-gradient(170deg, #FFF8F3, #F6E1EA 60%, #E6F4EE)',
      swatches: ['#EF8FA8', '#BDE8D7', '#D8A64A'],
    },
  },
  {
    id: 'red-veil',
    name: 'Red Veil',
    tagline: 'Qırmızı məxmər · Qızılı tikmə · Şam işığı',
    description: 'Xına gecəsinin qırmızı örpəyi — açılışda örpək qalxır, daxildə qızılı tikmə rozetlər, buta naxışlı proqram və məxmər kisədə masa nömrəsi.',
    shortDescription: { az: 'Qırmızı örpək və qızılı tikmə ilə xına gecəsi', en: 'Henna night with a red veil and gold embroidery' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    concept: 'xina',
    version: 1,
    previewRoute: '/demo/template/red-veil',
    theme: {
      primary: '#8E1B2B',
      accent: '#D4A64A',
      secondary: '#3E0911',
      background: '#F8EEE2',
      surface: '#FFFDF9',
      text: '#2A1014',
      muted: '#76524C',
      mapTint: '#8E1B2B',
      footerBg: '#3E0911',
      footerText: '#F8EEE2',
      footerAccent: '#F0D48C',
      fonts: { heading: FONT_STACKS.cormorant, body: FONT_STACKS.lora },
    },
    preview: {
      accent: '#D4A64A',
      background: 'radial-gradient(120% 80% at 50% 0%, #B3283A, #7E1626 48%, #3E0911)',
      swatches: ['#8E1B2B', '#D4A64A', '#F8EEE2'],
    },
  },
  {
    id: 'xonca',
    name: 'Xonça',
    tagline: 'Mis xonça · Şam işığı · Qırmızı lent',
    description: 'Şamlı mis xonça — açılışda şamlar bir-bir alışır, daxildə mis nəlbəki sayğac, gecə keçdikcə əriyən şamlar kimi proqram və lentli mis boşqabda masa nömrəsi.',
    shortDescription: { az: 'Şamlı mis xonça ilə xına gecəsi', en: 'Henna night with a candlelit copper tray' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'classic',
    concept: 'xina',
    version: 1,
    previewRoute: '/demo/template/xonca',
    theme: {
      primary: '#B8683A',
      accent: '#D9A54A',
      secondary: '#22120B',
      background: '#F6EAD8',
      surface: '#FFFBF4',
      text: '#2B1A10',
      muted: '#7A5F4C',
      mapTint: '#B8683A',
      footerBg: '#22120B',
      footerText: '#F6EAD8',
      footerAccent: '#E3A06C',
      fonts: { heading: FONT_STACKS.alegreya, body: FONT_STACKS.alegreyaSans },
    },
    preview: {
      accent: '#E3A06C',
      background: 'radial-gradient(80% 60% at 50% 70%, #5A3220, #22120B 70%)',
      swatches: ['#B8683A', '#FFD27A', '#A51E2C'],
    },
  },
  {
    id: 'henna-buta',
    name: 'Henna Buta',
    tagline: 'Xına naxışı · Buta · Terrakota',
    description: 'Gəlinin ovucunda xına — açılışda naxış özü xətt-xətt çəkilir, daxildə mandala sayğac, xına sarmaşığı kimi proqram və mandalanın ortasında masa nömrəsi.',
    shortDescription: { az: 'Ovucda xına naxışı ilə xına gecəsi', en: 'Henna night with a hand-drawn mehndi pattern' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'nature',
    concept: 'xina',
    version: 1,
    previewRoute: '/demo/template/henna-buta',
    theme: {
      primary: '#8A3A18',
      accent: '#B5552B',
      secondary: '#5E7A3A',
      background: '#FBF3E8',
      surface: '#FFFCF7',
      text: '#3A1E12',
      muted: '#7B5A48',
      mapTint: '#B5552B',
      footerBg: '#3A1E12',
      footerText: '#FBF3E8',
      footerAccent: '#E2B795',
      fonts: { heading: FONT_STACKS.spectral, body: FONT_STACKS.commissioner },
    },
    preview: {
      accent: '#8A3A18',
      background: 'radial-gradient(80% 60% at 50% 60%, #FFF6EA, #F3E3CF 75%)',
      swatches: ['#8A3A18', '#F1D3B8', '#5E7A3A'],
    },
  },
  {
    id: 'mirror-candle',
    name: 'Mirror & Candle',
    tagline: 'Qızılı güzgü · İki şam · Gecə',
    description: 'Gəlinin güzgüsü və şamları — açılışda şamlar alışır, güzgü işıqlanır və üzərindən parıltı keçir; daxildə oval güzgü sayğac, oval çərçivədə xəritə və güzgüdə həkk olunmuş masa nömrəsi.',
    shortDescription: { az: 'Güzgü və şam işığında xına gecəsi', en: 'Henna night of mirror and candlelight' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    concept: 'xina',
    version: 1,
    previewRoute: '/demo/template/mirror-candle',
    theme: {
      primary: '#E0B864',
      accent: '#F6DFA0',
      secondary: '#A88438',
      background: '#14100D',
      surface: '#211A15',
      text: '#F4ECDD',
      muted: '#B8AA94',
      mapTint: '#A88438',
      footerBg: '#0E0B09',
      footerText: '#F4ECDD',
      footerAccent: '#E0B864',
      fonts: { heading: FONT_STACKS.notoDisplay, body: FONT_STACKS.ebGaramond },
    },
    preview: {
      accent: '#E0B864',
      background: 'radial-gradient(60% 45% at 50% 45%, #3A2C1E, #14100D 75%)',
      swatches: ['#E0B864', '#C9CED6', '#14100D'],
    },
  },
  {
    id: 'kelagayi',
    name: 'Kəlağayı',
    tagline: 'İpək kəlağayı · Buta · Zəfəran və indigo',
    description: 'Basma naxışlı ipək kəlağayı — açılışda qatlanmış kəlağayı açılır, daxildə romb lövhələrdə sayğac, üç rəngli haşiyəli xəritə və romb pəncərəli fotolar.',
    shortDescription: { az: 'İpək kəlağayı naxışı ilə xına gecəsi', en: 'Henna night with a silk kalaghayi scarf' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'vintage',
    concept: 'xina',
    version: 1,
    previewRoute: '/demo/template/kelagayi',
    theme: {
      primary: '#9E1F32',
      accent: '#E0A526',
      secondary: '#24305E',
      background: '#F7EED9',
      surface: '#FFFCF4',
      text: '#1E1A17',
      muted: '#6E5F4E',
      mapTint: '#9E1F32',
      footerBg: '#24305E',
      footerText: '#F7EED9',
      footerAccent: '#E0A526',
      fonts: { heading: FONT_STACKS.playfairSC, body: FONT_STACKS.merriweather },
    },
    preview: {
      accent: '#9E1F32',
      background: 'radial-gradient(70% 50% at 50% 50%, #FFF9EA, #EEDCB6 85%)',
      swatches: ['#9E1F32', '#E0A526', '#24305E'],
    },
  },
  {
    id: 'little-prince',
    name: 'Little Prince',
    tagline: 'Tac · Məxmər yastıq · Kral mavisi',
    description: 'Kiçik şahzadənin günü — açılışda tac məxmər yastıqdan qalxır, daxildə qalxan formalı sayğac, şah fərmanı kimi proqram və yastıq üstündə masa nömrəsi.',
    shortDescription: { az: 'Tac və kral mavisi ilə sünnət toyu', en: 'Sunnat celebration with a crown and royal blue' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    concept: 'sunnet',
    version: 1,
    previewRoute: '/demo/template/little-prince',
    theme: {
      primary: '#1C3474',
      accent: '#D8B058',
      secondary: '#0F1C3F',
      background: '#F8F2E4',
      surface: '#FFFDF7',
      text: '#16203D',
      muted: '#5D6684',
      mapTint: '#1C3474',
      footerBg: '#0F1C3F',
      footerText: '#F8F2E4',
      footerAccent: '#F3DC98',
      fonts: { heading: FONT_STACKS.spectralSC, body: FONT_STACKS.mulish },
    },
    preview: {
      accent: '#D8B058',
      background: 'radial-gradient(90% 60% at 50% 20%, #2D4E9E, #0F1C3F 75%)',
      swatches: ['#1C3474', '#D8B058', '#8E1E33'],
    },
  },
  {
    id: 'hero-comic',
    name: 'Hero Comic',
    tagline: 'Komiks · BAM! · Super qəhrəman',
    description: 'Kiçik bəy günün super qəhrəmanıdır — açılışda «BAM!» partlayır və komiks səhifəsi ikiyə bölünür; daxildə rəngli komiks panelləri, balonlu proqram lenti və missiya partlayışında masa nömrəsi.',
    shortDescription: { az: 'Komiks üslubunda sünnət toyu', en: 'Comic-book style sunnat celebration' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'sunnet',
    version: 1,
    previewRoute: '/demo/template/hero-comic',
    theme: {
      primary: '#E63946',
      accent: '#FFD43B',
      secondary: '#1F5FD1',
      background: '#FFF8E6',
      surface: '#FFFFFF',
      text: '#121212',
      muted: '#4A4A4A',
      mapTint: '#1F5FD1',
      footerBg: '#121212',
      footerText: '#FFF8E6',
      footerAccent: '#FFD43B',
      fonts: { heading: FONT_STACKS.unbounded, body: FONT_STACKS.balsamiq },
    },
    preview: {
      accent: '#FFD43B',
      background: 'repeating-conic-gradient(from 0deg at 50% 50%, #1F5FD1 0deg 7deg, #2C74F0 7deg 14deg)',
      swatches: ['#E63946', '#FFD43B', '#1F5FD1'],
    },
  },
  {
    id: 'mashallah',
    name: 'Maşallah',
    tagline: 'Göz muncuğu · Atlas lent · Kobalt',
    description: 'Sünnət toyunun ənənəvi rəmzləri — açılışda göz muncuğunun üzərindən parıltı keçir və «Maşallah» lenti uçub gəlir; daxildə muncuq sapı kimi sayğac və proqram, lentli göz muncuğunda masa nömrəsi.',
    shortDescription: { az: 'Göz muncuğu və «Maşallah» lenti ilə sünnət toyu', en: 'Sunnat celebration with an evil-eye bead and sash' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'classic',
    concept: 'sunnet',
    version: 1,
    previewRoute: '/demo/template/mashallah',
    theme: {
      primary: '#0D3B8E',
      accent: '#27B0C8',
      secondary: '#D6A947',
      background: '#F6F2E8',
      surface: '#FFFFFF',
      text: '#0E1F3D',
      muted: '#56677F',
      mapTint: '#0D3B8E',
      footerBg: '#082658',
      footerText: '#F6F2E8',
      footerAccent: '#F2D88E',
      fonts: { heading: FONT_STACKS.literata, body: FONT_STACKS.nunitoSans },
    },
    preview: {
      accent: '#27B0C8',
      background: 'radial-gradient(70% 50% at 50% 40%, #FFFFFF, #F6F2E8 70%)',
      swatches: ['#0D3B8E', '#27B0C8', '#D6A947'],
    },
  },
  {
    id: 'little-pilot',
    name: 'Little Pilot',
    tagline: 'Qırmızı təyyarə · Buludlar · Səma',
    description: 'Kiçik pilotun uçuşu — açılışda təyyarə adı yazılmış bayrağı aparıb buludlar arasından uçur; daxildə əqrəbli pilot cihazları, uçuş marşrutu kimi proqram və təyyarənin quyruğunda masa nömrəsi.',
    shortDescription: { az: 'Təyyarə və buludlarla sünnət toyu', en: 'Sunnat celebration with a little plane in the sky' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'sunnet',
    version: 1,
    previewRoute: '/demo/template/little-pilot',
    theme: {
      primary: '#E5533D',
      accent: '#FFC845',
      secondary: '#3B95D6',
      background: '#FFF9EE',
      surface: '#FFFFFF',
      text: '#18324F',
      muted: '#5C6F85',
      mapTint: '#3B95D6',
      footerBg: '#18324F',
      footerText: '#FFF9EE',
      footerAccent: '#FFC845',
      fonts: { heading: FONT_STACKS.montserratAlt, body: FONT_STACKS.nunito },
    },
    preview: {
      accent: '#E5533D',
      background: 'linear-gradient(180deg, #3B95D6, #8DD3F7 55%, #CDEEFC)',
      swatches: ['#E5533D', '#FFC845', '#8DD3F7'],
    },
  },
  {
    id: 'football-star',
    name: 'Football Star',
    tagline: 'Gecə stadionu · Forma · QOL!',
    description: 'Kiçik bəy matçın ulduzudur — açılışda top qapıya uçur, tor dartılır və «QOL!» yanır; daxildə adı və yaşı yazılmış forma, LED tablo sayğac, matçın gedişi kimi proqram və formada masa nömrəsi.',
    shortDescription: { az: 'Futbol və stadion üslubunda sünnət toyu', en: 'Football stadium style sunnat celebration' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'sunnet',
    version: 1,
    previewRoute: '/demo/template/football-star',
    theme: {
      primary: '#145A2B',
      accent: '#F2C230',
      secondary: '#0E2A47',
      background: '#EEF5EC',
      surface: '#FFFFFF',
      text: '#0C1B2C',
      muted: '#586878',
      mapTint: '#1F7A3C',
      footerBg: '#081A2E',
      footerText: '#EEF5EC',
      footerAccent: '#F2C230',
      fonts: { heading: FONT_STACKS.oswald, body: FONT_STACKS.interTight },
    },
    preview: {
      accent: '#F2C230',
      background: 'linear-gradient(180deg, #081A2E, #0E2A47 40%, #145A2B 40.2%, #1F7A3C)',
      swatches: ['#1F7A3C', '#F2C230', '#0E2A47'],
    },
  },
  {
    id: 'pastel-bloom',
    name: 'Pastel Bloom',
    tagline: 'Akvarel çiçəklər · Pastel · Kağız',
    description: 'Akvarel kağızına çəkilmiş pastel çiçəklər — açılışda çiçəklər boyaq kimi kağıza yayılır; daxildə çiçək çələngində ad, akvarel ləkələrində sayğac və böyük çiçəyin ortasında masa nömrəsi.',
    shortDescription: { az: 'Akvarel çiçəklərlə baby shower', en: 'Watercolor florals baby shower' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'nature',
    concept: 'baby',
    version: 1,
    previewRoute: '/demo/template/pastel-bloom',
    theme: {
      primary: '#D98E93',
      accent: '#A9C2A2',
      secondary: '#CDBFE6',
      background: '#FCF8F2',
      surface: '#FFFFFF',
      text: '#4E3F45',
      muted: '#85737A',
      mapTint: '#EFB8B8',
      footerBg: '#4E3F45',
      footerText: '#FCF8F2',
      footerAccent: '#EFB8B8',
      fonts: { heading: FONT_STACKS.cormorantInfant, body: FONT_STACKS.nunitoSans },
    },
    preview: {
      accent: '#D98E93',
      background: 'radial-gradient(circle at 20% 25%, #F7D3D2, transparent 40%), radial-gradient(circle at 80% 75%, #D5E3D0, transparent 42%), #FCF8F2',
      swatches: ['#EFB8B8', '#A9C2A2', '#F3DDA6'],
    },
  },
  {
    id: 'teddy-bear',
    name: 'Teddy Bear',
    tagline: 'Plüş ayıcıq · Toxunma · Bayraqcıqlar',
    description: 'Yumşaq plüş ayıcıq — açılışda toxunma yorğanın arxasından çıxıb əl yelləyir, ürəkciklər uçur; daxildə bayraqcıq girlyandası, toxunma yamaqlarda sayğac, düymə və sap kimi proqram və ayıcığın lövhəsində masa nömrəsi.',
    shortDescription: { az: 'Plüş ayıcıq və toxunma ilə baby shower', en: 'Teddy bear and knit baby shower' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'baby',
    version: 1,
    previewRoute: '/demo/template/teddy-bear',
    theme: {
      primary: '#8E6440',
      accent: '#BFD9EA',
      secondary: '#F2CFCF',
      background: '#FBF5EC',
      surface: '#FFFFFF',
      text: '#5B4332',
      muted: '#8F7765',
      mapTint: '#C99A6B',
      footerBg: '#5B4332',
      footerText: '#FBF5EC',
      footerAccent: '#E6C49E',
      fonts: { heading: FONT_STACKS.comfortaa, body: FONT_STACKS.nunito },
    },
    preview: {
      accent: '#C99A6B',
      background: 'linear-gradient(180deg, #E4F0F8, #FBF5EC 70%)',
      swatches: ['#C99A6B', '#BFD9EA', '#F2CFCF'],
    },
  },
  {
    id: 'gender-reveal',
    name: 'Gender Reveal',
    tagline: 'Oğlan, yoxsa qız? · Mavi və çəhrayı',
    description: 'Cinsiyyət açılışı əyləncəsi — açılışda zolaqlı hədiyyə qutusunun qapağı uçur, içindən mavi və çəhrayı şarlar, konfetti çıxır; daxildə iki tərəfli hero, növbəli bloklarda sayğac və qutunun etiketində masa nömrəsi. Sürprizi şablon açmır.',
    shortDescription: { az: 'Oğlan yoxsa qız — cinsiyyət açılışı', en: 'Boy or girl — gender reveal party' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'baby',
    version: 1,
    previewRoute: '/demo/template/gender-reveal',
    theme: {
      primary: '#33365C',
      accent: '#E9C46A',
      secondary: '#F49AC1',
      background: '#FFFBF7',
      surface: '#FFFFFF',
      text: '#33365C',
      muted: '#6E7091',
      mapTint: '#7DB9F0',
      footerBg: '#33365C',
      footerText: '#FFFBF7',
      footerAccent: '#E9C46A',
      fonts: { heading: FONT_STACKS.playpen, body: FONT_STACKS.onest },
    },
    preview: {
      accent: '#E9C46A',
      background: 'linear-gradient(115deg, #D6EAFC 0 50%, #FCDDEA 50% 100%)',
      swatches: ['#7DB9F0', '#F49AC1', '#E9C46A'],
    },
  },
  {
    id: 'stork-letter',
    name: 'Stork Letter',
    tagline: 'Leylək · Poçt markası · Mum möhür',
    description: 'Leyləkdən köhnə poçt məktubu — açılışda möhür sınır, zərfin qapağı açılır və leyləkli məktub qalxır; daxildə poçt markalarında sayğac, poçt kartı kimi xəritə, xətli kağızda proqram və markada masa nömrəsi.',
    shortDescription: { az: 'Leylək və köhnə məktub üslubunda baby shower', en: 'Vintage stork letter baby shower' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'vintage',
    concept: 'baby',
    version: 1,
    previewRoute: '/demo/template/stork-letter',
    theme: {
      primary: '#A9473A',
      accent: '#7C97AE',
      secondary: '#C98B6B',
      background: '#F3EBDD',
      surface: '#FBF6EC',
      text: '#3E3A36',
      muted: '#776C61',
      mapTint: '#9A7B57',
      footerBg: '#4E6A83',
      footerText: '#FBF6EC',
      footerAccent: '#E6D9C3',
      fonts: { heading: FONT_STACKS.oldStandard, body: FONT_STACKS.vollkorn },
    },
    preview: {
      accent: '#A9473A',
      background: 'radial-gradient(70% 50% at 50% 50%, #F4ECDE, #DDCDB2 90%)',
      swatches: ['#7C97AE', '#C98B6B', '#A9473A'],
    },
  },
  {
    id: 'baby-mobile',
    name: 'Baby Mobile',
    tagline: 'Keçə mobil · Ay və ulduzlar · Layla',
    description: 'Beşik üstündə asılan keçə mobil — açılışda mobil fırlanır, fiqurlar dönür və layla notları uçur; daxildə keçə buludlarda sayğac, sapdan asılan fiqurlarla proqram və böyük keçə ulduzda masa nömrəsi.',
    shortDescription: { az: 'Keçə beşik mobili ilə baby shower', en: 'Felt crib mobile baby shower' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'celestial',
    concept: 'baby',
    version: 1,
    previewRoute: '/demo/template/baby-mobile',
    theme: {
      primary: '#2E3A63',
      accent: '#E9B949',
      secondary: '#F2B5A7',
      background: '#F8F1E6',
      surface: '#FFFFFF',
      text: '#2A2F4A',
      muted: '#6B6F88',
      mapTint: '#41508A',
      footerBg: '#222B4D',
      footerText: '#FFF4DE',
      footerAccent: '#E9B949',
      fonts: { heading: FONT_STACKS.ysabeauInfant, body: FONT_STACKS.mulish },
    },
    preview: {
      accent: '#E9B949',
      background: 'radial-gradient(70% 45% at 50% 0%, #4B5B96, transparent 70%), linear-gradient(180deg, #2E3A63, #222B4D)',
      swatches: ['#2E3A63', '#E9B949', '#F2B5A7'],
    },
  },
  {
    id: 'gala-night',
    name: 'Gala Night',
    tagline: 'Art-deco · Qızılı şüalar · Şampan qülləsi',
    description: 'Art-deco gala gecəsi — açılışda qədəhlər sıra-sıra dolur və köpüklər qalxır; daxildə künc yelpikli çərçivə, pilləli künclü sayğac, qızılı bilet-saatlar və yer kartında masa nömrəsi.',
    shortDescription: { az: 'Art-deco üslubunda gala gecəsi', en: 'Art-deco corporate gala' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    concept: 'corporate',
    version: 1,
    previewRoute: '/demo/template/gala-night',
    theme: {
      primary: '#D4AF61',
      accent: '#F1DCA4',
      secondary: '#9C7C34',
      background: '#0B0A09',
      surface: '#151311',
      text: '#F5EFE3',
      muted: '#A99F8E',
      mapTint: '#9C7C34',
      footerBg: '#060505',
      footerText: '#F5EFE3',
      footerAccent: '#D4AF61',
      fonts: { heading: FONT_STACKS.playfair, body: FONT_STACKS.montserrat },
    },
    preview: {
      accent: '#D4AF61',
      background: 'radial-gradient(60% 40% at 50% 62%, #241F18, #0B0A09 75%)',
      swatches: ['#D4AF61', '#0B0A09', '#F3E2B3'],
    },
  },
  {
    id: 'keynote',
    name: 'Keynote',
    tagline: 'Səhnə ekranı · Nöqtəli şəbəkə · Neon mavi',
    description: 'Konfrans və təqdimat səhnəsi — açılışda ekran CRT kimi yanır, projektor şüaları açılır; daxildə səhnə taymeri, nömrəli gündəm və adınız yazılmış konfrans bəyində masa nömrəsi.',
    shortDescription: { az: 'Konfrans səhnəsi üslubunda korporativ tədbir', en: 'Conference keynote style corporate event' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'minimal',
    concept: 'corporate',
    version: 1,
    previewRoute: '/demo/template/keynote',
    theme: {
      primary: '#3D7BFF',
      accent: '#22D3EE',
      secondary: '#8B7BFF',
      background: '#060A14',
      surface: '#111A30',
      text: '#F3F6FC',
      muted: '#8A97B4',
      mapTint: '#3D7BFF',
      footerBg: '#04070F',
      footerText: '#F3F6FC',
      footerAccent: '#22D3EE',
      fonts: { heading: FONT_STACKS.geologica, body: FONT_STACKS.onest },
    },
    preview: {
      accent: '#22D3EE',
      background: 'radial-gradient(80% 50% at 50% 0%, rgba(61,123,255,.35), transparent 70%), #060A14',
      swatches: ['#3D7BFF', '#22D3EE', '#8B7BFF'],
    },
  },
  {
    id: 'award-night',
    name: 'Award Night',
    tagline: 'Kubok · Qırmızı xalça · Dəfnə çələngi',
    description: 'Mükafatlandırma gecəsi — açılışda projektor yanır, örtük qalxır və qızılı kubok parıldayır; daxildə dəfnə çələngi, lentli medallarda sayğac, nominasiya kartları kimi proqram və vintli mis lövhədə masa nömrəsi.',
    shortDescription: { az: 'Mükafat gecəsi üslubunda korporativ tədbir', en: 'Awards night corporate event' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    concept: 'corporate',
    version: 1,
    previewRoute: '/demo/template/award-night',
    theme: {
      primary: '#E1B54E',
      accent: '#F6DD95',
      secondary: '#8A1426',
      background: '#2A060E',
      surface: '#4E0D1A',
      text: '#F7EEDC',
      muted: '#CDB1A8',
      mapTint: '#8A1426',
      footerBg: '#1B0409',
      footerText: '#F7EEDC',
      footerAccent: '#E1B54E',
      fonts: { heading: FONT_STACKS.cormorantSC, body: FONT_STACKS.raleway },
    },
    preview: {
      accent: '#E1B54E',
      background: 'radial-gradient(90% 60% at 50% 0%, #6E1426, #4E0D1A 50%, #2A060E)',
      swatches: ['#4E0D1A', '#E1B54E', '#8A1426'],
    },
  },
  {
    id: 'business-card',
    name: 'Business Card',
    tagline: 'Vizit kartı · İsveçrə şəbəkəsi · Klein mavisi',
    description: 'Minimal biznes üslubu — açılışda vizit kartı çevrilir və mavi arxa üzündə tarix, saat, məkan görünür; daxildə iri tipoqrafiya, nazik xətli cədvəllər və qonağın adı yazılmış vizit kartında masa nömrəsi.',
    shortDescription: { az: 'Minimal biznes üslubunda korporativ tədbir', en: 'Minimal Swiss-style corporate event' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'minimal',
    concept: 'corporate',
    version: 1,
    previewRoute: '/demo/template/business-card',
    theme: {
      primary: '#2438E8',
      accent: '#121212',
      secondary: '#76756F',
      background: '#F4F3EF',
      surface: '#FFFFFF',
      text: '#121212',
      muted: '#76756F',
      mapTint: '#2438E8',
      footerBg: '#121212',
      footerText: '#F4F3EF',
      footerAccent: '#2438E8',
      fonts: { heading: FONT_STACKS.interTightBold, body: FONT_STACKS.interTight },
    },
    preview: {
      accent: '#2438E8',
      background: 'linear-gradient(135deg, #F4F3EF 0 62%, #2438E8 62% 100%)',
      swatches: ['#2438E8', '#121212', '#F4F3EF'],
    },
  },
  {
    id: 'neon-party',
    name: 'Neon Party',
    tagline: 'Neon lövhə · Kərpic divar · Gecə',
    description: 'Korporativ əyləncə gecəsi — açılışda kərpic divardakı neon lövhə titrəyərək yanır; daxildə neon çərçivədə ad, rəngli boru çərçivələrdə sayğac, işıq nöqtəli proqram və neon lövhədə masa nömrəsi.',
    shortDescription: { az: 'Neon üslubunda korporativ parti', en: 'Neon sign corporate party' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'corporate',
    version: 1,
    previewRoute: '/demo/template/neon-party',
    theme: {
      primary: '#FF4FD8',
      accent: '#3CF2FF',
      secondary: '#9B5CFF',
      background: '#0D0A15',
      surface: '#1B1428',
      text: '#F6F0FF',
      muted: '#A99CC4',
      mapTint: '#9B5CFF',
      footerBg: '#07050C',
      footerText: '#F6F0FF',
      footerAccent: '#3CF2FF',
      fonts: { heading: FONT_STACKS.jura, body: FONT_STACKS.jura },
    },
    preview: {
      accent: '#FF4FD8',
      background: 'radial-gradient(60% 45% at 50% 42%, rgba(255,79,216,.35), transparent 70%), #181222',
      swatches: ['#FF4FD8', '#3CF2FF', '#9B5CFF'],
    },
  },
  {
    id: 'silver-locket',
    name: 'Silver Locket',
    tagline: 'Gümüş medalyon · Gecə mavisi · Qızılgül',
    description: 'Gümüş toy və ildönümü — açılışda zəncirdən asılan ürək medalyonun qapağı açılır, içində birlikdə keçən illər həkk olunub; daxildə gümüş medalyonlarda sayğac, zəncir boyunca proqram və medalyonun içində masa nömrəsi.',
    shortDescription: { az: 'Gümüş medalyonlu ildönümü', en: 'Silver locket anniversary' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'luxury',
    concept: 'anniversary',
    version: 1,
    previewRoute: '/demo/template/silver-locket',
    theme: {
      primary: '#B87B80',
      accent: '#C9CED6',
      secondary: '#D9A3A6',
      background: '#F4F1EC',
      surface: '#FFFFFF',
      text: '#232831',
      muted: '#7C8592',
      mapTint: '#D9A3A6',
      footerBg: '#141923',
      footerText: '#F4F1EC',
      footerAccent: '#C9CED6',
      fonts: { heading: FONT_STACKS.cormorant, body: FONT_STACKS.mulish },
    },
    preview: {
      accent: '#C9CED6',
      background: 'radial-gradient(60% 45% at 50% 40%, rgba(201,206,214,.25), transparent 70%), #141923',
      swatches: ['#C9CED6', '#D9A3A6', '#141923'],
    },
  },
  {
    id: 'golden-jubilee',
    name: 'Golden Jubilee',
    tagline: 'Dəri albom · Qızıl basma · 50 il',
    description: 'Qızıl toy — açılışda tünd qırmızı dəri ailə albomunun qabığı açılır, üzündə qızıl basma «50»; daxildə krem albom vərəqləri, foto künclərində sayğac və şəkillər, dəri lövhədə qızıl masa nömrəsi.',
    shortDescription: { az: 'Dəri albomlu qızıl toy', en: 'Leather album golden jubilee' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'vintage',
    concept: 'anniversary',
    version: 1,
    previewRoute: '/demo/template/golden-jubilee',
    theme: {
      primary: '#5A1E1B',
      accent: '#D4AF5A',
      secondary: '#9C7A2E',
      background: '#F7F0E1',
      surface: '#FFFDF7',
      text: '#3B2A1C',
      muted: '#86735A',
      mapTint: '#D4AF5A',
      footerBg: '#33100E',
      footerText: '#F6EAD0',
      footerAccent: '#D4AF5A',
      fonts: { heading: FONT_STACKS.vollkornSC, body: FONT_STACKS.brygada },
    },
    preview: {
      accent: '#D4AF5A',
      background: 'radial-gradient(60% 45% at 50% 40%, rgba(212,175,90,.28), transparent 70%), #5A1E1B',
      swatches: ['#D4AF5A', '#5A1E1B', '#F7F0E1'],
    },
  },
  {
    id: 'first-paper',
    name: 'First Paper',
    tagline: 'Origami · Kağız toy · İlk il',
    description: 'Birinci ildönümü — «kağız toy». Açılışda mavi dalğa naxışlı origami vərəq zərf kimi qatlanıb; toxunanda dörd künc bir-bir açılır və ağ üzündə «1 il birlikdə» görünür. Daxildə qat izli sayğac, origami ürəklər, çadır qatlı masa kartı və lentlə yapışdırılmış fotolar.',
    shortDescription: { az: 'Origami vərəqli ilk ildönümü', en: 'Origami paper first anniversary' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'minimal',
    concept: 'anniversary',
    version: 1,
    previewRoute: '/demo/template/first-paper',
    theme: {
      primary: '#3561C9',
      accent: '#A9C0EE',
      secondary: '#24449A',
      background: '#F8F6F1',
      surface: '#FFFFFF',
      text: '#232B4A',
      muted: '#737A8A',
      mapTint: '#A9C0EE',
      footerBg: '#232B4A',
      footerText: '#FFFFFF',
      footerAccent: '#A9C0EE',
      fonts: { heading: FONT_STACKS.piazzolla, body: FONT_STACKS.didact },
    },
    preview: {
      accent: '#3561C9',
      background: 'linear-gradient(135deg, #3B6AD6, #24449A)',
      swatches: ['#3561C9', '#A9C0EE', '#F8F6F1'],
    },
  },
  {
    id: 'retro-polaroid',
    name: 'Retro Polaroid',
    tagline: 'Ani foto · 70-ci illər · Gün batımı',
    description: 'Retro ildönümü — açılışda 70-ci illərin ani foto kamerası flaş çaxır, kameradan polaroid çıxır və gözünüz önündə aşkarlanır; daxildə rəngli polaroid sayğac, göy qurşağı zolaqlı proqram və polaroid masa kartı.',
    shortDescription: { az: 'Polaroid kameralı retro ildönümü', en: 'Retro instant-camera anniversary' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'anniversary',
    version: 1,
    previewRoute: '/demo/template/retro-polaroid',
    theme: {
      primary: '#E07A2E',
      accent: '#E2B33C',
      secondary: '#3E7C74',
      background: '#F4EAD5',
      surface: '#FFFDF8',
      text: '#3B2418',
      muted: '#8A6E58',
      mapTint: '#E2B33C',
      footerBg: '#3B2418',
      footerText: '#F4EAD5',
      footerAccent: '#E2B33C',
      fonts: { heading: FONT_STACKS.marmelad, body: FONT_STACKS.bellotaText },
    },
    preview: {
      accent: '#E07A2E',
      background: 'linear-gradient(180deg, #F2C15A 0%, #E07A2E 55%, #C8452D 100%)',
      swatches: ['#C8452D', '#E07A2E', '#E2B33C', '#3E7C74'],
    },
  },
  {
    id: 'love-letters',
    name: 'Love Letters',
    tagline: 'Məktub bağlaması · İp · Marka',
    description: 'İllərin sevgi məktubları — açılışda ipə bağlanmış zərf bağlamasının fiyonku açılır, zərflər yelpik kimi açılır və üstdəki zərfdən məktub qalxır; daxildə zərf sayğac, xətli vərəqdə proqram, ünvan yerində masa nömrəsi və «P.S.» arzular.',
    shortDescription: { az: 'Sevgi məktublu ildönümü', en: 'Love letters anniversary' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'classic',
    concept: 'anniversary',
    version: 1,
    previewRoute: '/demo/template/love-letters',
    theme: {
      primary: '#2F3550',
      accent: '#C98B8B',
      secondary: '#9C4A4A',
      background: '#EFE6D8',
      surface: '#FBF6EC',
      text: '#2F3550',
      muted: '#7D7468',
      mapTint: '#C98B8B',
      footerBg: '#262B42',
      footerText: '#EFE6D8',
      footerAccent: '#C98B8B',
      fonts: { heading: FONT_STACKS.greatVibes, body: FONT_STACKS.ebGaramond },
    },
    preview: {
      accent: '#9C4A4A',
      background: 'linear-gradient(160deg, #F4ECDD, #E3CFCB)',
      swatches: ['#2F3550', '#C98B8B', '#E7D8C1'],
    },
  },
  {
    id: 'caps-toss',
    name: 'Caps Toss',
    tagline: 'Məzun papaqları · Gecə mavisi · Qızılı',
    description: 'Məzuniyyət gecəsi — açılışda üç məzun papağı fırlanaraq havaya uçur, qızılı konfetti yağır; daxildə «Məzun 2027» lenti, romb kartlarda sayğac, diplom tumarında proqram və qızıl möhürlü sertifikatda masa nömrəsi.',
    shortDescription: { az: 'Papaqlar havaya — məzun gecəsi', en: 'Caps-in-the-air graduation' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'classic',
    concept: 'graduation',
    version: 1,
    previewRoute: '/demo/template/caps-toss',
    theme: {
      primary: '#14213D',
      accent: '#E5B94E',
      secondary: '#B38A2C',
      background: '#F7F4EC',
      surface: '#FFFFFF',
      text: '#14213D',
      muted: '#6B7590',
      mapTint: '#1F3160',
      footerBg: '#0C1529',
      footerText: '#F7F4EC',
      footerAccent: '#E5B94E',
      fonts: { heading: FONT_STACKS.alegreyaSC, body: FONT_STACKS.sourceSerif },
    },
    preview: {
      accent: '#E5B94E',
      background: 'radial-gradient(60% 45% at 50% 30%, rgba(229,185,78,.25), transparent 70%), #14213D',
      swatches: ['#14213D', '#E5B94E', '#F7F4EC'],
    },
  },
  {
    id: 'yearbook',
    name: 'Yearbook',
    tagline: 'Məzun albomu · İmzalar · Varsity',
    description: 'Məzun albomu — açılışda xətli vərəqdə məzunun baş hərfi; toxunanda rəngli markerlə sinif yoldaşlarının imzaları və cizgilər peyda olur, «2027» varsity yamağı möhür kimi vurulur. Daxildə forma nömrəsi kimi sayğac, işarələnən proqram və yamaqda masa nömrəsi.',
    shortDescription: { az: 'İmzalı məzun albomu', en: 'Signed yearbook graduation' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'graduation',
    version: 1,
    previewRoute: '/demo/template/yearbook',
    theme: {
      primary: '#1F4FD1',
      accent: '#FFC629',
      secondary: '#E63946',
      background: '#FFFFFF',
      surface: '#F7F8FB',
      text: '#14182B',
      muted: '#69708A',
      mapTint: '#1F4FD1',
      footerBg: '#0F2566',
      footerText: '#FFFFFF',
      footerAccent: '#FFC629',
      fonts: { heading: FONT_STACKS.firaXC, body: FONT_STACKS.firaC },
    },
    preview: {
      accent: '#FFC629',
      background: 'linear-gradient(160deg, #1F4FD1, #0F2566)',
      swatches: ['#1F4FD1', '#FFC629', '#E63946'],
    },
  },
  {
    id: 'last-bell',
    name: 'Last Bell',
    tagline: 'Son zəng · Ağ bant · Qırmızı lent',
    description: 'Son zəng — açılışda dəftər vərəqində mis məktəb zəngi; toxunanda zəng çalınır, səs dalğaları yayılır və ekranı qızılı yazılı qırmızı «Məzun» lenti kəsib keçir. Daxildə ağ bantlar, qopan təqvim vərəqlərində sayğac, dərs cədvəli kimi proqram, qırmızı rozetdə masa nömrəsi.',
    shortDescription: { az: 'Son zəng — məktəb məzuniyyəti', en: 'Last bell school graduation' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'classic',
    concept: 'graduation',
    version: 1,
    previewRoute: '/demo/template/last-bell',
    theme: {
      primary: '#C8102E',
      accent: '#E2BD6A',
      secondary: '#1C2A4A',
      background: '#FFFFFF',
      surface: '#F5F6F9',
      text: '#1C2A4A',
      muted: '#6A7387',
      mapTint: '#C8102E',
      footerBg: '#1C2A4A',
      footerText: '#FFFFFF',
      footerAccent: '#E2BD6A',
      fonts: { heading: FONT_STACKS.robotoSerif, body: FONT_STACKS.notoSans },
    },
    preview: {
      accent: '#C8102E',
      background: 'linear-gradient(160deg, #FFFFFF 0%, #FFFFFF 55%, #C8102E 55%, #C8102E 70%, #FFFFFF 70%)',
      swatches: ['#C8102E', '#1C2A4A', '#E2BD6A'],
    },
  },
  {
    id: 'chalkboard',
    name: 'Chalkboard',
    tagline: 'Yaşıl lövhə · Təbaşir · Taxta çərçivə',
    description: 'Məzuniyyət — açılışda taxta çərçivəli yaşıl lövhədə məzunun adı silinmiş təbaşir izi kimi görünür; toxunanda təbaşir «Məzun 2027» və adı təzədən yazır, altından xətt çəkilir, rəngli cizgilər çıxır. Daxildə təbaşir qutularında sayğac, oxlu proqram, kiçik lövhədə masa nömrəsi.',
    shortDescription: { az: 'Təbaşir lövhəli məzuniyyət', en: 'Chalkboard graduation' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'playful',
    concept: 'graduation',
    version: 1,
    previewRoute: '/demo/template/chalkboard',
    theme: {
      primary: '#26453D',
      accent: '#F5DE7A',
      secondary: '#9A6A42',
      background: '#F6F2E8',
      surface: '#FFFFFF',
      text: '#26453D',
      muted: '#6F7A72',
      mapTint: '#26453D',
      footerBg: '#1A322C',
      footerText: '#F3F0E6',
      footerAccent: '#F5DE7A',
      fonts: { heading: FONT_STACKS.amatic, body: FONT_STACKS.ysabeauOffice },
    },
    preview: {
      accent: '#F5DE7A',
      background: 'linear-gradient(180deg, #2A4B42, #22403A)',
      swatches: ['#26453D', '#F5DE7A', '#9A6A42'],
    },
  },
  {
    id: 'paper-plane',
    name: 'Paper Plane',
    tagline: 'Gələcəyə məktub · Kağız təyyarə · Səma',
    description: 'Gələcəyə məktub — açılışda səmada xətli dəftər vərəqi; toxunanda vərəq qatlanıb kağız təyyarəyə çevrilir və qırıq-qırıq iz buraxaraq uçur. Daxildə hava poçtu zolaqlı sayğac, marşrut kimi proqram, açıqcada masa nömrəsi və gecə səmasında arzular.',
    shortDescription: { az: 'Kağız təyyarəli məzuniyyət', en: 'Paper plane graduation' },
    status: TEMPLATE_STATUS.LIVE,
    category: 'minimal',
    concept: 'graduation',
    version: 1,
    previewRoute: '/demo/template/paper-plane',
    theme: {
      primary: '#2F6FDB',
      accent: '#E0483E',
      secondary: '#FFC857',
      background: '#FFFFFF',
      surface: '#EAF6FD',
      text: '#1B2D4F',
      muted: '#5E7290',
      mapTint: '#BFE0F5',
      footerBg: '#111E36',
      footerText: '#FFFFFF',
      footerAccent: '#FFC857',
      fonts: { heading: FONT_STACKS.ysabeau, body: FONT_STACKS.ysabeauOffice },
    },
    preview: {
      accent: '#2F6FDB',
      background: 'linear-gradient(180deg, #A9D4F2 0%, #EAF6FD 100%)',
      swatches: ['#2F6FDB', '#E0483E', '#FFC857'],
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
    concept: 'toy',
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
export function listTemplates({ onlySelectable = false, category = null, concept = null } = {}) {
  let list = TEMPLATES.filter((tpl) => tpl.status !== TEMPLATE_STATUS.DISABLED)
  if (onlySelectable) list = list.filter((tpl) => SELECTABLE_STATUSES.includes(tpl.status))
  if (category) list = list.filter((tpl) => tpl.category === category)
  if (concept) list = list.filter((tpl) => tpl.concept === concept)
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
