import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   HERO COMIC — lüks sünnət seriyası (2026-11, foto redizayn)

   Kiçik bəy günün super qəhrəmanıdır — şəhər damı, qırmızı plaş, qızılı axşam; açılışda «BAM!» partlayır və komiks səhifəsi çəp xətlə ikiyə bölünüb açılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/hc-*). Əvvəlki dizayn legacy/v2/hero-comic-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('hero-comic')
const ID = 'hero-comic'

const LINKS = { primary: ['ACCENT', 'RED'], secondary: ['BLUE'], accent: ['YEL'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4600, overlay: { kind: 'burst', ink: '#121212', red: '#E63946', yellow: '#FFD43B', blue: '#1F5FD1', sky: '#5BC0EB', font: "'Unbounded', 'Arial Black', sans-serif" } }

export default function HeroComicTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 800, upper: true, lh: 1.02, inlineSize: 'clamp(34px, 9.6vw, 46px)', inlineMax: 11 },
    heroAlign: 'left', ornament: '★', countdown: 'comic', seat: 'ticket', program: 'card', detail: 'inset', gallery: 'rect', btnRadius: 0, cardRadius: 0, headUpper: true, headWeight: 800, numWeight: 800,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
